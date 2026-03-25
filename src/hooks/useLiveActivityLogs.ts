import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type ActivityActionType = 
  | 'login'
  | 'logout'
  | 'page_navigation'
  | 'demo_interaction'
  | 'copy_attempt'
  | 'link_edit'
  | 'approval_request'
  | 'force_logout'
  | 'task_update'
  | 'lead_action'
  | 'chat_message'
  | 'file_access'
  | 'settings_change'
  | 'error';

export type ActivityStatus = 'success' | 'fail' | 'blocked' | 'pending' | 'warning';

export interface LiveActivityLog {
  id: string;
  user_id: string;
  user_role: string;
  action_type: ActivityActionType;
  action_description: string | null;
  status: ActivityStatus;
  page_url: string | null;
  ip_address: string | null;
  device_info: string | null;
  user_agent: string | null;
  duration_seconds: number;
  is_abnormal: boolean;
  abnormal_reason: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface UserOnlineStatus {
  id: string;
  user_id: string;
  user_role: string;
  is_online: boolean;
  last_seen_at: string;
  session_started_at: string | null;
  current_page: string | null;
  device_info: string | null;
  ip_address: string | null;
  force_logged_out: boolean;
  pending_approval: boolean;
  updated_at: string;
}

// Alias for backward compatibility
export type OnlineUser = UserOnlineStatus;

export type DateFilter = 'live' | 'daily' | 'weekly' | 'monthly';

interface UseLiveActivityLogsOptions {
  dateFilter?: DateFilter;
  roleFilter?: string | null;
  actionFilter?: ActivityActionType | null;
  limit?: number;
}

export function useLiveActivityLogs(options: UseLiveActivityLogsOptions = {}) {
  const { dateFilter = 'live', roleFilter = null, actionFilter = null, limit = 100 } = options;
  const { user, userRole } = useAuth();
  const [logs, setLogs] = useState<LiveActivityLog[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserOnlineStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDateRange = useCallback(() => {
    const now = new Date();
    let startDate: Date;

    switch (dateFilter) {
      case 'daily':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'weekly':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'monthly':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        startDate = new Date(now.setHours(now.getHours() - 1)); // Last hour for live
    }

    return startDate.toISOString();
  }, [dateFilter]);

  const fetchLogs = useCallback(async () => {
    if (!user || !userRole) return;

    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('live_activity_logs')
        .select('*')
        .gte('created_at', getDateRange())
        .order('created_at', { ascending: false })
        .limit(limit);

      if (roleFilter) {
        query = query.eq('user_role', roleFilter as any);
      }

      if (actionFilter) {
        query = query.eq('action_type', actionFilter);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setLogs((data || []) as LiveActivityLog[]);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
    } finally {
      setIsLoading(false);
    }
  }, [user, userRole, getDateRange, roleFilter, actionFilter, limit]);

  const fetchOnlineUsers = useCallback(async () => {
    if (!user || !userRole) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('user_online_status')
        .select('*')
        .order('last_seen_at', { ascending: false });

      if (fetchError) throw fetchError;
      setOnlineUsers((data || []) as UserOnlineStatus[]);
    } catch (err) {
      console.error('Error fetching online users:', err);
    }
  }, [user, userRole]);

  const logActivity = useCallback(async (
    actionType: ActivityActionType,
    description?: string,
    status: ActivityStatus = 'success',
    pageUrl?: string,
    metadata?: Record<string, unknown>
  ) => {
    try {
      const { error } = await supabase.rpc('log_activity', {
        p_action_type: actionType,
        p_description: description || null,
        p_status: status,
        p_page_url: pageUrl || null,
        p_metadata: (metadata || {}) as any
      });

      if (error) throw error;
    } catch (err) {
      console.error('Error logging activity:', err);
    }
  }, []);

  const updateOnlineStatus = useCallback(async (isOnline: boolean, currentPage?: string) => {
    try {
      const { error } = await supabase.rpc('update_online_status', {
        p_is_online: isOnline,
        p_current_page: currentPage || null
      });

      if (error) throw error;
    } catch (err) {
      console.error('Error updating online status:', err);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchLogs();
    fetchOnlineUsers();
  }, [fetchLogs, fetchOnlineUsers]);

  // Real-time subscription for logs
  useEffect(() => {
    if (!user) return;

    const logsChannel = supabase
      .channel('live-activity-logs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'live_activity_logs'
        },
        (payload) => {
          const newLog = payload.new as LiveActivityLog;
          // Check role-based visibility - boss_owner sees everything
          if (userRole === 'boss_owner') {
            setLogs(prev => [newLog, ...prev].slice(0, limit));
          }
        }
      )
      .subscribe();

    const statusChannel = supabase
      .channel('user-online-status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_online_status'
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const updatedStatus = payload.new as UserOnlineStatus;
            // Check role-based visibility
            if (userRole === 'master' || (userRole === 'super_admin' && updatedStatus.user_role !== 'master')) {
              setOnlineUsers(prev => {
                const exists = prev.find(u => u.user_id === updatedStatus.user_id);
                if (exists) {
                  return prev.map(u => u.user_id === updatedStatus.user_id ? updatedStatus : u);
                }
                return [updatedStatus, ...prev];
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(logsChannel);
      supabase.removeChannel(statusChannel);
    };
  }, [user, userRole, limit]);

  // Auto-refresh for live mode
  useEffect(() => {
    if (dateFilter !== 'live') return;

    const interval = setInterval(() => {
      fetchLogs();
      fetchOnlineUsers();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [dateFilter, fetchLogs, fetchOnlineUsers]);

  const stats = {
    totalLogs: logs.length,
    successCount: logs.filter(l => l.status === 'success').length,
    failCount: logs.filter(l => l.status === 'fail').length,
    blockedCount: logs.filter(l => l.status === 'blocked').length,
    warningCount: logs.filter(l => l.status === 'warning' || l.is_abnormal).length,
    onlineCount: onlineUsers.filter(u => u.is_online).length,
    offlineCount: onlineUsers.filter(u => !u.is_online).length,
    pendingCount: onlineUsers.filter(u => u.pending_approval).length,
    forceLoggedOutCount: onlineUsers.filter(u => u.force_logged_out).length,
  };

  return {
    logs,
    onlineUsers,
    stats,
    isLoading,
    error,
    refetch: fetchLogs,
    logActivity,
    updateOnlineStatus,
  };
}
