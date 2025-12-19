import { useEffect, useRef, useState, useCallback } from 'react';
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

export const useRealtimeConnection = (config: RealtimeConfig) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'offline'>('excellent');
  const [lastPing, setLastPing] = useState<number>(0);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const measureLatency = useCallback(() => {
    const start = performance.now();
    
    // Use Supabase presence for ping measurement
    if (channelRef.current) {
      channelRef.current.track({ ping: start })
        .then(() => {
          const latency = performance.now() - start;
          setLastPing(Math.round(latency));
          
          if (latency < 100) setConnectionQuality('excellent');
          else if (latency < 300) setConnectionQuality('good');
          else if (latency < 1000) setConnectionQuality('poor');
          else setConnectionQuality('offline');
        })
        .catch(() => setConnectionQuality('offline'));
    }
  }, []);

  const connect = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase.channel(config.channelName, {
      config: {
        broadcast: { self: true },
        presence: { key: 'user' }
      }
    });

    // Database changes subscription
    if (config.table) {
      channel.on(
        'postgres_changes' as any,
        {
          event: config.event || '*',
          schema: config.schema || 'public',
          table: config.table,
          filter: config.filter
        } as any,
        (payload: any) => {
          config.onUpdate?.(payload);
        }
      );
    }

    // Presence tracking
    if (config.enablePresence) {
      channel.on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        config.onPresence?.(state);
      });
    }

    // Broadcast for custom events
    channel.on('broadcast', { event: 'custom' }, (payload) => {
      config.onUpdate?.(payload);
    });

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setIsConnected(true);
        reconnectAttempts.current = 0;
        measureLatency();
      } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        setIsConnected(false);
        setConnectionQuality('offline');
        
        // Auto-reconnect with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        }
      }
    });

    channelRef.current = channel;
  }, [config, measureLatency]);

  const broadcast = useCallback((event: string, payload: any) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event,
        payload
      });
    }
  }, []);

  const trackPresence = useCallback((userData: any) => {
    if (channelRef.current) {
      channelRef.current.track(userData);
    }
  }, []);

  useEffect(() => {
    connect();
    
    // Ping interval for connection quality monitoring
    pingIntervalRef.current = setInterval(measureLatency, 30000);

    // Online/offline detection
    const handleOnline = () => {
      setConnectionQuality('good');
      connect();
    };
    
    const handleOffline = () => {
      setConnectionQuality('offline');
      setIsConnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [connect, measureLatency]);

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
