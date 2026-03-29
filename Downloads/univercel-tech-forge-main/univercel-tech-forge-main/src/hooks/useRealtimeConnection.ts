import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface RealtimeConfig {
  channelName: string;
  table?: string;
  schema?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  onUpdate?: (payload: any) => void;
  onPresence?: (state: any) => void;
  enablePresence?: boolean;
}

// Memoize config to prevent unnecessary reconnections
const useStableConfig = (config: RealtimeConfig) => {
  const configRef = useRef(config);
  const stableConfig = useMemo(() => {
    // Only update if meaningful values changed
    if (
      configRef.current.channelName !== config.channelName ||
      configRef.current.table !== config.table ||
      configRef.current.schema !== config.schema ||
      configRef.current.event !== config.event ||
      configRef.current.filter !== config.filter ||
      configRef.current.enablePresence !== config.enablePresence
    ) {
      configRef.current = config;
    }
    return configRef.current;
  }, [config.channelName, config.table, config.schema, config.event, config.filter, config.enablePresence]);
  
  return stableConfig;
};

export const useRealtimeConnection = (config: RealtimeConfig) => {
  const stableConfig = useStableConfig(config);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'offline'>('excellent');
  const [lastPing, setLastPing] = useState<number>(0);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const isCleaningUp = useRef(false);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stable callback refs to prevent recreation
  const onUpdateRef = useRef(config.onUpdate);
  const onPresenceRef = useRef(config.onPresence);
  
  useEffect(() => {
    onUpdateRef.current = config.onUpdate;
    onPresenceRef.current = config.onPresence;
  }, [config.onUpdate, config.onPresence]);

  const cleanup = useCallback(() => {
    isCleaningUp.current = true;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    
    isCleaningUp.current = false;
  }, []);

  const measureLatency = useCallback(() => {
    const start = performance.now();
    
    if (channelRef.current && !isCleaningUp.current) {
      channelRef.current.track({ ping: start })
        .then(() => {
          if (isCleaningUp.current) return;
          const latency = performance.now() - start;
          setLastPing(Math.round(latency));
          
          if (latency < 100) setConnectionQuality('excellent');
          else if (latency < 300) setConnectionQuality('good');
          else if (latency < 1000) setConnectionQuality('poor');
          else setConnectionQuality('offline');
        })
        .catch(() => {
          if (!isCleaningUp.current) {
            setConnectionQuality('offline');
          }
        });
    }
  }, []);

  const connect = useCallback(() => {
    if (isCleaningUp.current) return;
    
    // Clean up existing channel before creating new one
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channel = supabase.channel(stableConfig.channelName, {
      config: {
        broadcast: { self: true },
        presence: { key: 'user' }
      }
    });

    // Database changes subscription
    if (stableConfig.table) {
      channel.on(
        'postgres_changes' as any,
        {
          event: stableConfig.event || '*',
          schema: stableConfig.schema || 'public',
          table: stableConfig.table,
          filter: stableConfig.filter
        } as any,
        (payload: any) => {
          onUpdateRef.current?.(payload);
        }
      );
    }

    // Presence tracking
    if (stableConfig.enablePresence) {
      channel.on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        onPresenceRef.current?.(state);
      });
    }

    // Broadcast for custom events
    channel.on('broadcast', { event: 'custom' }, (payload) => {
      onUpdateRef.current?.(payload);
    });

    channel.subscribe((status) => {
      if (isCleaningUp.current) return;
      
      if (status === 'SUBSCRIBED') {
        setIsConnected(true);
        reconnectAttempts.current = 0;
        measureLatency();
      } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        setIsConnected(false);
        setConnectionQuality('offline');
        
        // Auto-reconnect with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts && !isCleaningUp.current) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectTimeoutRef.current = setTimeout(() => {
            if (!isCleaningUp.current) {
              reconnectAttempts.current++;
              connect();
            }
          }, delay);
        }
      }
    });

    channelRef.current = channel;
  }, [stableConfig, measureLatency]);

  const broadcast = useCallback((event: string, payload: any) => {
    if (channelRef.current && !isCleaningUp.current) {
      channelRef.current.send({
        type: 'broadcast',
        event,
        payload
      });
    }
  }, []);

  const trackPresence = useCallback((userData: any) => {
    if (channelRef.current && !isCleaningUp.current) {
      channelRef.current.track(userData);
    }
  }, []);

  useEffect(() => {
    connect();
    
    // Ping interval for connection quality monitoring
    pingIntervalRef.current = setInterval(measureLatency, 30000);

    // Online/offline detection
    const handleOnline = () => {
      if (!isCleaningUp.current) {
        setConnectionQuality('good');
        connect();
      }
    };
    
    const handleOffline = () => {
      if (!isCleaningUp.current) {
        setConnectionQuality('offline');
        setIsConnected(false);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      cleanup();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [connect, measureLatency, cleanup]);

  return {
    isConnected,
    connectionQuality,
    lastPing,
    broadcast,
    trackPresence,
    reconnect: connect
  };
};

export default useRealtimeConnection;
