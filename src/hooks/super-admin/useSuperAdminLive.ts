import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LiveActivity {
  id: string;
  type: string;
  message: string;
  user_id: string;
  module: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface LiveState {
  isConnected: boolean;
  activities: LiveActivity[];
  stats: {
    activeUsers: number;
    onlineAdmins: number;
    securityAlerts: number;
  };
}

export function useSuperAdminLive() {
  const [state, setState] = useState<LiveState>({
    isConnected: false,
    activities: [],
    stats: {
      activeUsers: 0,
      onlineAdmins: 0,
      securityAlerts: 0
    }
  });
  
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const maxActivities = 50;

  const addActivity = useCallback((activity: LiveActivity) => {
    setState(prev => ({
      ...prev,
      activities: [activity, ...prev.activities].slice(0, maxActivities)
    }));
  }, []);

  const connect = useCallback(async () => {
    try {
      const { data: authData } = await supabase.auth.getSession();
      if (!authData.session) return;

      // Subscribe to realtime channels
      const channel = supabase.channel('super-admin-live')
        // Activity log changes
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'super_admin_activity_log'
        }, (payload) => {
          const data = payload.new as Record<string, unknown>;
          addActivity({
            id: data.id as string,
            type: 'activity',
            message: `${data.action} on ${data.target_entity || data.module}`,
            user_id: data.super_admin_id as string,
            module: data.module as string,
            timestamp: data.created_at as string,
            metadata: data
          });
        })
        // Security events
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'super_admin_security_events'
        }, (payload) => {
          const data = payload.new as Record<string, unknown>;
          addActivity({
            id: data.id as string,
            type: 'security',
            message: `Security: ${data.event_type} - ${data.severity}`,
            user_id: data.target_user_id as string || '',
            module: 'security',
            timestamp: data.detected_at as string,
            metadata: data
          });
          
          // Update security alerts count
          setState(prev => ({
            ...prev,
            stats: {
              ...prev.stats,
              securityAlerts: prev.stats.securityAlerts + 1
            }
          }));
        })
        // User status changes
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'user_status_history'
        }, (payload) => {
          const data = payload.new as Record<string, unknown>;
          addActivity({
            id: data.id as string,
            type: 'user_status',
            message: `User status: ${data.old_status} → ${data.new_status}`,
            user_id: data.user_id as string,
            module: 'users',
            timestamp: data.changed_at as string,
            metadata: data
          });
        })
        // System locks
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'system_locks'
        }, (payload) => {
          const data = payload.new as Record<string, unknown>;
          const isLocked = !data.unlocked_at;
          addActivity({
            id: data.id as string,
            type: 'lock',
            message: `${data.lock_scope} ${isLocked ? 'locked' : 'unlocked'}: ${data.reason}`,
            user_id: data.locked_by_super_admin_id as string,
            module: 'locks',
            timestamp: data.locked_at as string || data.unlocked_at as string,
            metadata: data
          });
        })
        .subscribe((status) => {
          console.log('[SuperAdmin Live] Channel status:', status);
          setState(prev => ({
            ...prev,
            isConnected: status === 'SUBSCRIBED'
          }));
        });

      channelRef.current = channel;
      
    } catch (err) {
      console.error('[SuperAdmin Live] Connection error:', err);
    }
  }, [addActivity]);

  const disconnect = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    setState(prev => ({
      ...prev,
      isConnected: false
    }));
  }, []);

  const fetchInitialStats = useCallback(async () => {
    try {
      // Fetch active sessions count
      const { count: sessionsCount } = await supabase
        .from('super_admin_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch unresolved security events
      const { count: alertsCount } = await supabase
        .from('super_admin_security_events')
        .select('*', { count: 'exact', head: true })
        .is('resolved_at', null);

      setState(prev => ({
        ...prev,
        stats: {
          activeUsers: 0, // Would need user presence tracking
          onlineAdmins: sessionsCount || 0,
          securityAlerts: alertsCount || 0
        }
      }));
    } catch (err) {
      console.error('[SuperAdmin Live] Stats fetch error:', err);
    }
  }, []);

  const clearActivities = useCallback(() => {
    setState(prev => ({
      ...prev,
      activities: []
    }));
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    fetchInitialStats();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect, fetchInitialStats]);

  return {
    ...state,
    connect,
    disconnect,
    clearActivities,
    refreshStats: fetchInitialStats
  };
}
