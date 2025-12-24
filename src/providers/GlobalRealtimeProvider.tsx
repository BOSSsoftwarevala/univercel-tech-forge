import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RealtimeChannel } from '@supabase/supabase-js';

interface RealtimeEvent {
  table: string;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  payload: any;
  timestamp: Date;
}

interface GlobalRealtimeContextType {
  isConnected: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'offline';
  lastEvent: RealtimeEvent | null;
  subscribe: (table: string, callback: (payload: any) => void) => () => void;
  broadcast: (event: string, payload: any) => void;
}

const GlobalRealtimeContext = createContext<GlobalRealtimeContextType | null>(null);

// Sound effects for notifications
const playSound = (type: 'task' | 'alert' | 'success' | 'error') => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  const frequencies: Record<string, number> = {
    task: 523.25,    // C5
    alert: 659.25,   // E5
    success: 783.99, // G5
    error: 392.00    // G4
  };
  
  oscillator.frequency.value = frequencies[type];
  oscillator.type = 'sine';
  gainNode.gain.value = 0.1;
  
  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  oscillator.stop(audioContext.currentTime + 0.3);
};

export const GlobalRealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'offline'>('offline');
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const subscribersRef = useRef<Map<string, Set<(payload: any) => void>>>(new Map());
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Notify subscribers for a specific table
  const notifySubscribers = useCallback((table: string, payload: any) => {
    const subscribers = subscribersRef.current.get(table);
    if (subscribers) {
      subscribers.forEach(callback => callback(payload));
    }
  }, []);

  // Handle different table changes
  const handleTableChange = useCallback((table: string, eventType: string, payload: any) => {
    const event: RealtimeEvent = {
      table,
      eventType: eventType as any,
      payload,
      timestamp: new Date()
    };
    setLastEvent(event);
    notifySubscribers(table, payload);

    // Invalidate relevant queries based on table
    const queryKeyMap: Record<string, string[]> = {
      developer_tasks: ['developer-tasks', 'active-tasks', 'tasks'],
      buzzer_queue: ['buzzer-queue', 'alerts'],
      developer_timer_logs: ['timer-logs', 'developer-timer'],
      promise_logs: ['promises', 'active-promises'],
      chat_messages: ['chat-messages', 'task-chat'],
      developer_violations: ['violations', 'developer-violations'],
      live_activity_logs: ['activity-logs', 'live-activity'],
      user_online_status: ['online-users', 'user-status'],
      dev_timer: ['dev-timer', 'timer-state'],
      user_roles: ['user-roles', 'current-role']
    };

    const keysToInvalidate = queryKeyMap[table] || [table];
    keysToInvalidate.forEach(key => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });

    // Show toast and play sound for important events
    if (eventType === 'INSERT') {
      if (table === 'developer_tasks') {
        toast.info('New task assigned!', { duration: 3000 });
        playSound('task');
      } else if (table === 'buzzer_queue') {
        toast.warning('New alert in queue!', { duration: 4000 });
        playSound('alert');
      } else if (table === 'developer_violations') {
        toast.error('Violation recorded', { duration: 5000 });
        playSound('error');
      }
    }
  }, [queryClient, notifySubscribers]);

  // Setup main realtime channel
  useEffect(() => {
    const channel = supabase.channel('global-realtime', {
      config: {
        broadcast: { self: true },
        presence: { key: 'global' }
      }
    });

    // Subscribe to all critical tables
    const tables = [
      'developer_tasks',
      'buzzer_queue', 
      'developer_timer_logs',
      'promise_logs',
      'chat_messages',
      'developer_violations',
      'live_activity_logs',
      'user_online_status',
      'dev_timer',
      'user_roles'
    ];

    tables.forEach(table => {
      channel.on(
        'postgres_changes' as any,
        { event: '*', schema: 'public', table },
        (payload: any) => {
          handleTableChange(table, payload.eventType, payload);
        }
      );
    });

    // Handle broadcast events for cross-dashboard sync
    channel.on('broadcast', { event: 'system-alert' }, (payload) => {
      toast.warning(payload.payload?.message || 'System alert', { duration: 5000 });
      playSound('alert');
    });

    channel.on('broadcast', { event: 'task-update' }, (payload) => {
      queryClient.invalidateQueries({ queryKey: ['developer-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['active-tasks'] });
    });

    channel.on('broadcast', { event: 'timer-sync' }, (payload) => {
      queryClient.invalidateQueries({ queryKey: ['dev-timer'] });
      queryClient.invalidateQueries({ queryKey: ['timer-state'] });
    });

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setIsConnected(true);
        setConnectionQuality('excellent');
      } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        setIsConnected(false);
        setConnectionQuality('offline');
      }
    });

    channelRef.current = channel;

    // Ping interval to check connection quality
    pingIntervalRef.current = setInterval(() => {
      const start = performance.now();
      channel.track({ ping: start }).then(() => {
        const latency = performance.now() - start;
        if (latency < 100) setConnectionQuality('excellent');
        else if (latency < 300) setConnectionQuality('good');
        else if (latency < 1000) setConnectionQuality('poor');
        else setConnectionQuality('offline');
      }).catch(() => {
        setConnectionQuality('offline');
      });
    }, 30000);

    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [handleTableChange, queryClient]);

  // Subscribe to specific table changes
  const subscribe = useCallback((table: string, callback: (payload: any) => void) => {
    if (!subscribersRef.current.has(table)) {
      subscribersRef.current.set(table, new Set());
    }
    subscribersRef.current.get(table)!.add(callback);

    return () => {
      subscribersRef.current.get(table)?.delete(callback);
    };
  }, []);

  // Broadcast to all connected clients
  const broadcast = useCallback((event: string, payload: any) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event,
        payload
      });
    }
  }, []);

  return (
    <GlobalRealtimeContext.Provider value={{
      isConnected,
      connectionQuality,
      lastEvent,
      subscribe,
      broadcast
    }}>
      {children}
    </GlobalRealtimeContext.Provider>
  );
};

export const useGlobalRealtime = () => {
  const context = useContext(GlobalRealtimeContext);
  if (!context) {
    throw new Error('useGlobalRealtime must be used within GlobalRealtimeProvider');
  }
  return context;
};

export default GlobalRealtimeProvider;
