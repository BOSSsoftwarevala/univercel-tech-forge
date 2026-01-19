/**
 * READ-ONLY Promise Tracker Hooks
 * Observer role with ZERO control power
 * All data is read-only, all views are logged
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState, useCallback } from 'react';

// Types
export interface TrackerMetrics {
  total_promises: number;
  active_promises: number;
  pending_approval: number;
  overdue_promises: number;
  fulfilled_promises: number;
  escalated_promises: number;
  last_updated: string;
}

export interface TrackerPromise {
  promise_id: string;
  promise_type: string | null;
  linked_module: string;
  assigned_role: string;
  assigned_user_masked: string;
  start_date: string;
  due_date: string;
  remaining_minutes: number;
  status: string;
  priority: string | null;
  escalation_level: number;
  escalated_at: string | null;
  is_locked: boolean;
  breach_reason: string | null;
  extended_count: number;
  approved_by: string | null;
  approved_at: string | null;
  finished_time: string | null;
  task_id: string;
  created_at: string;
  updated_at: string;
}

export interface TrackerFilters {
  status?: string;
  promiseType?: string;
  assignedRole?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// Hook: Get Tracker Metrics (Read-Only)
export function useTrackerMetrics() {
  return useQuery({
    queryKey: ['promise-tracker-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promise_tracker_metrics')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      // Return empty metrics if no data exists
      return (data ?? {
        total_promises: 0,
        active_promises: 0,
        completed_promises: 0,
        overdue_promises: 0,
        completion_rate: 0,
        average_completion_hours: 0
      }) as TrackerMetrics;
    },
    refetchInterval: 5000, // Refresh every 5 seconds for near real-time
    staleTime: 3000,
  });
}

// Hook: Get Promise List (Read-Only with filters)
export function useTrackerPromises(filters?: TrackerFilters) {
  return useQuery({
    queryKey: ['promise-tracker-list', filters],
    queryFn: async () => {
      // Use the view for masked data
      let query = supabase
        .from('promise_tracker_view')
        .select('*');

      // Apply filters (cast to any to avoid strict type checking on view)
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status as any);
      }

      if (filters?.assignedRole && filters.assignedRole !== 'all') {
        query = query.eq('assigned_role', filters.assignedRole as any);
      }

      if (filters?.dateFrom) {
        query = query.gte('start_date', filters.dateFrom as any);
      }

      if (filters?.dateTo) {
        query = query.lte('due_date', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Client-side search filter (for masked data)
      let filtered = data as TrackerPromise[];
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.promise_id.toLowerCase().includes(searchLower) ||
          p.task_id.toLowerCase().includes(searchLower) ||
          p.assigned_user_masked.toLowerCase().includes(searchLower)
        );
      }

      return filtered;
    },
    refetchInterval: 5000,
    staleTime: 3000,
  });
}

// Hook: Get Overdue Promises (Read-Only)
export function useTrackerOverdue() {
  return useQuery({
    queryKey: ['promise-tracker-overdue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promise_tracker_view')
        .select('*')
        .in('status', ['assigned', 'promised', 'in_progress'])
        .lt('remaining_minutes', 0);

      if (error) throw error;
      return data as TrackerPromise[];
    },
    refetchInterval: 5000,
  });
}

// Hook: Get Escalated Promises (Read-Only)
export function useTrackerEscalated() {
  return useQuery({
    queryKey: ['promise-tracker-escalated'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promise_tracker_view')
        .select('*')
        .gt('escalation_level', 0)
        .not('status', 'in', '("completed","breached")');

      if (error) throw error;
      return data as TrackerPromise[];
    },
    refetchInterval: 5000,
  });
}

// Hook: Get Fulfilled Promises (Read-Only)
export function useTrackerFulfilled() {
  return useQuery({
    queryKey: ['promise-tracker-fulfilled'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promise_tracker_view')
        .select('*')
        .eq('status', 'completed')
        .order('finished_time', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as TrackerPromise[];
    },
    refetchInterval: 10000,
  });
}

// Hook: Get Promise Detail (Read-Only)
export function useTrackerPromiseDetail(promiseId: string | null) {
  return useQuery({
    queryKey: ['promise-tracker-detail', promiseId],
    queryFn: async () => {
      if (!promiseId) return null;

      const { data, error } = await supabase
        .from('promise_tracker_view')
        .select('*')
        .eq('promise_id', promiseId)
        .single();

      if (error) throw error;
      return data as TrackerPromise;
    },
    enabled: !!promiseId,
  });
}

// Hook: Get Promise Audit History (Read-Only)
export function useTrackerAuditHistory(promiseId: string | null) {
  return useQuery({
    queryKey: ['promise-tracker-audit', promiseId],
    queryFn: async () => {
      if (!promiseId) return [];

      const { data, error } = await supabase
        .from('promise_audit_logs')
        .select('*')
        .eq('promise_id', promiseId)
        .order('server_timestamp', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!promiseId,
  });
}

// Mutation: Log View (for audit trail)
export function useLogPromiseView() {
  return useMutation({
    mutationFn: async (params: {
      promiseId?: string;
      viewType: 'list' | 'detail' | 'search';
    }) => {
      const { data, error } = await supabase.rpc('log_promise_view', {
        p_promise_id: params.promiseId || null,
        p_view_type: params.viewType,
        p_ip_address: null,
        p_user_agent: navigator.userAgent,
        p_session_id: null,
      });

      if (error) throw error;
      return data;
    },
  });
}

// Mutation: Log Export (for audit trail)
export function useLogPromiseExport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      format: 'pdf' | 'csv';
      filterCriteria?: Record<string, any>;
      recordsExported: number;
    }) => {
      const { data, error } = await supabase.rpc('log_promise_export', {
        p_export_format: params.format,
        p_filter_criteria: params.filterCriteria || null,
        p_records_exported: params.recordsExported,
      });

      if (error) throw error;
      return data;
    },
  });
}

// Hook: Real-time updates (Read-Only subscription)
export function useTrackerRealtime() {
  const queryClient = useQueryClient();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const channel = supabase
      .channel('promise-tracker-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'promise_logs',
        },
        (payload) => {
          // Invalidate all tracker queries on any change
          queryClient.invalidateQueries({ queryKey: ['promise-tracker-metrics'] });
          queryClient.invalidateQueries({ queryKey: ['promise-tracker-list'] });
          queryClient.invalidateQueries({ queryKey: ['promise-tracker-overdue'] });
          queryClient.invalidateQueries({ queryKey: ['promise-tracker-escalated'] });
          queryClient.invalidateQueries({ queryKey: ['promise-tracker-fulfilled'] });
          setLastUpdate(new Date());
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { lastUpdate };
}

// Hook: Server time sync (for accurate countdown)
export function useServerTime() {
  const [serverTime, setServerTime] = useState<Date>(new Date());
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    const syncTime = async () => {
      const clientStart = Date.now();
      const { data, error } = await supabase
        .from('promise_tracker_metrics')
        .select('last_updated')
        .single();

      if (!error && data?.last_updated) {
        const clientEnd = Date.now();
        const latency = (clientEnd - clientStart) / 2;
        const serverNow = new Date(data.last_updated).getTime() + latency;
        setOffset(serverNow - clientEnd);
      }
    };

    syncTime();
    const interval = setInterval(syncTime, 60000); // Re-sync every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setServerTime(new Date(Date.now() + offset));
    }, 1000);

    return () => clearInterval(interval);
  }, [offset]);

  return serverTime;
}

// Utility: Calculate remaining time from server time
export function calculateRemainingTime(deadline: string, serverTime: Date): {
  text: string;
  isOverdue: boolean;
  minutes: number;
} {
  const deadlineDate = new Date(deadline);
  const diffMs = deadlineDate.getTime() - serverTime.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 0) {
    const absMinutes = Math.abs(diffMinutes);
    if (absMinutes >= 1440) {
      return { text: `-${Math.floor(absMinutes / 1440)}d`, isOverdue: true, minutes: diffMinutes };
    }
    if (absMinutes >= 60) {
      return { text: `-${Math.floor(absMinutes / 60)}h ${absMinutes % 60}m`, isOverdue: true, minutes: diffMinutes };
    }
    return { text: `-${absMinutes}m`, isOverdue: true, minutes: diffMinutes };
  }

  if (diffMinutes >= 1440) {
    const days = Math.floor(diffMinutes / 1440);
    const hours = Math.floor((diffMinutes % 1440) / 60);
    return { text: `${days}d ${hours}h`, isOverdue: false, minutes: diffMinutes };
  }

  if (diffMinutes >= 60) {
    return { text: `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m`, isOverdue: false, minutes: diffMinutes };
  }

  return { text: `${diffMinutes}m`, isOverdue: false, minutes: diffMinutes };
}

// Export helper: Generate CSV from promises
export function generatePromiseCSV(promises: TrackerPromise[]): string {
  const headers = [
    'Promise ID',
    'Status',
    'Priority',
    'Assigned Role',
    'Assigned User (Masked)',
    'Start Date',
    'Due Date',
    'Remaining Time',
    'Escalation Level',
    'Is Locked',
  ];

  const rows = promises.map(p => [
    p.promise_id,
    p.status,
    p.priority || 'N/A',
    p.assigned_role,
    p.assigned_user_masked,
    new Date(p.start_date).toISOString(),
    new Date(p.due_date).toISOString(),
    `${Math.floor(p.remaining_minutes)} minutes`,
    p.escalation_level.toString(),
    p.is_locked ? 'Yes' : 'No',
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');
}
