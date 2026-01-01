import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

type WebSocketChannel = 'server_metrics' | 'server_alerts' | 'server_actions' | 'server_health' | 'all';

interface MetricEvent {
  type: 'metric_update';
  server_id: string;
  server_name?: string;
  cpu: number;
  ram: number;
  disk: number;
  network_in: number;
  network_out: number;
  timestamp: string;
}

interface AlertEvent {
  type: 'alert';
  server_id: string;
  alert_id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  alert_type: string;
  message: string;
  threshold?: number;
  current?: number;
  timestamp: string;
}

interface ScaleEvent {
  type: 'scale';
  server_id: string;
  server_name?: string;
  action: string;
  action_type?: string;
  cpu?: string;
  ram?: string;
  previous?: { cpu: number; ram: number };
  new?: { cpu: number; ram: number };
  reason?: string;
  status: string;
  timestamp: string;
}

interface StatusEvent {
  type: 'status';
  server_id: string;
  server_name?: string;
  status: 'online' | 'offline' | 'warning' | 'maintenance';
  last_heartbeat?: string;
  timestamp: string;
}

type WebSocketEvent = MetricEvent | AlertEvent | ScaleEvent | StatusEvent | { type: string; [key: string]: unknown };

interface UseServerWebSocketOptions {
  channel?: WebSocketChannel;
  onMetric?: (event: MetricEvent) => void;
  onAlert?: (event: AlertEvent) => void;
  onScale?: (event: ScaleEvent) => void;
  onStatus?: (event: StatusEvent) => void;
  onAny?: (event: WebSocketEvent) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

interface WebSocketState {
  isConnected: boolean;
  connectionId: string | null;
  lastEvent: WebSocketEvent | null;
  error: string | null;
}

export function useServerWebSocket(options: UseServerWebSocketOptions = {}) {
  const {
    channel = 'all',
    onMetric,
    onAlert,
    onScale,
    onStatus,
    onAny,
    autoReconnect = true,
    reconnectInterval = 5000
  } = options;

  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    connectionId: null,
    lastEvent: null,
    error: null
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setState(prev => ({ ...prev, error: 'Not authenticated' }));
        return;
      }

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || 'feqdqyadkijpohyllfdq';
      const wsUrl = `wss://${projectId}.supabase.co/functions/v1/server-websocket?channel=${channel}&token=${session.access_token}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected to channel:', channel);
        setState(prev => ({ ...prev, isConnected: true, error: null }));

        // Start ping interval
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketEvent;
          
          setState(prev => ({ ...prev, lastEvent: data }));

          if (data.type === 'connected') {
            setState(prev => ({ 
              ...prev, 
              connectionId: (data as { connection_id?: string }).connection_id || null 
            }));
            return;
          }

          if (data.type === 'pong') return;

          // Route to appropriate handler
          switch (data.type) {
            case 'metric_update':
              onMetric?.(data as MetricEvent);
              break;
            case 'alert':
              onAlert?.(data as AlertEvent);
              break;
            case 'scale':
              onScale?.(data as ScaleEvent);
              break;
            case 'status':
              onStatus?.(data as StatusEvent);
              break;
          }

          onAny?.(data);
        } catch (e) {
          console.error('WebSocket message parse error:', e);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setState(prev => ({ ...prev, error: 'Connection error' }));
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setState(prev => ({ ...prev, isConnected: false, connectionId: null }));
        
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
        }

        // Auto reconnect
        if (autoReconnect) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect...');
            connect();
          }, reconnectInterval);
        }
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      setState(prev => ({ ...prev, error: 'Failed to connect' }));
    }
  }, [channel, onMetric, onAlert, onScale, onStatus, onAny, autoReconnect, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const subscribe = useCallback((serverId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'subscribe', server_id: serverId }));
    }
  }, []);

  const send = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    subscribe,
    send
  };
}

// Hook for auto-scaling events specifically
export function useAutoScalingEvents(onScaleEvent?: (event: ScaleEvent) => void) {
  const [scalingEvents, setScalingEvents] = useState<ScaleEvent[]>([]);

  const handleScale = useCallback((event: ScaleEvent) => {
    setScalingEvents(prev => [event, ...prev].slice(0, 50));
    onScaleEvent?.(event);
  }, [onScaleEvent]);

  const ws = useServerWebSocket({
    channel: 'server_actions',
    onScale: handleScale
  });

  return {
    ...ws,
    scalingEvents
  };
}

// Hook for real-time metrics
export function useServerMetricsStream(serverId?: string) {
  const [metrics, setMetrics] = useState<Record<string, MetricEvent>>({});

  const handleMetric = useCallback((event: MetricEvent) => {
    if (!serverId || event.server_id === serverId) {
      setMetrics(prev => ({
        ...prev,
        [event.server_id]: event
      }));
    }
  }, [serverId]);

  const ws = useServerWebSocket({
    channel: 'server_metrics',
    onMetric: handleMetric
  });

  useEffect(() => {
    if (serverId && ws.isConnected) {
      ws.subscribe(serverId);
    }
  }, [serverId, ws.isConnected, ws.subscribe]);

  return {
    ...ws,
    metrics: serverId ? metrics[serverId] : metrics,
    allMetrics: metrics
  };
}

// Hook for alerts stream
export function useServerAlertsStream() {
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [criticalCount, setCriticalCount] = useState(0);

  const handleAlert = useCallback((event: AlertEvent) => {
    setAlerts(prev => {
      const exists = prev.some(a => a.alert_id === event.alert_id);
      if (exists) {
        return prev.map(a => a.alert_id === event.alert_id ? event : a);
      }
      return [event, ...prev].slice(0, 100);
    });

    if (event.severity === 'critical') {
      setCriticalCount(prev => prev + 1);
    }
  }, []);

  const ws = useServerWebSocket({
    channel: 'server_alerts',
    onAlert: handleAlert
  });

  return {
    ...ws,
    alerts,
    criticalCount,
    clearCriticalCount: () => setCriticalCount(0)
  };
}
