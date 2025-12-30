/**
 * Promise Manager Hooks
 * Zero-loophole promise management system
 * Role: Promise Management (Control Role) - READ-ONLY control, no execution
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

// Types
export interface PromiseManagerMetrics {
  total_active: number;
  pending_approval: number;
  overdue: number;
  fulfilled: number;
  breached: number;
  total_promises: number;
  fulfillment_rate: number;
  active_escalations: number;
}

export interface PromiseAuditLog {
  id: string;
  promise_id: string;
  action_type: string;
  action_by: string;
  action_by_role: string;
  previous_status: string | null;
  new_status: string | null;
  reason: string | null;
  server_timestamp: string;
  is_system_action: boolean;
}

export interface PromiseWithDetails {
  id: string;
  task_id: string;
  developer_id: string;
  deadline: string;
  promise_type: string;
  priority: string;
  status: string;
  assigned_role: string | null;
  responsible_user_id: string | null;
  approval_required: boolean;
  approved_by: string | null;
  approved_at: string | null;
  rejected_by: string | null;
  rejection_reason: string | null;
  is_locked: boolean;
  escalation_level: number;
  created_at: string;
  updated_at: string;
}

// Hook: Get Promise Manager Dashboard Metrics
export function usePromiseManagerMetrics() {
  return useQuery({
    queryKey: ['promise-manager-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promise_manager_metrics')
        .select('*')
        .single();

      if (error) throw error;
      return data as PromiseManagerMetrics;
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });
}

// Hook: Get all promises with filtering
export function usePromisesList(filters?: {
  status?: string;
  priority?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['promises-list', filters],
    queryFn: async () => {
      let query = supabase
        .from('promise_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status as 'pending_approval' | 'assigned' | 'promised' | 'in_progress' | 'completed' | 'breached');
      }

      if (filters?.priority && filters.priority !== 'all') {
        query = query.eq('priority', filters.priority as 'low' | 'normal' | 'high' | 'critical');
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as PromiseWithDetails[];
    },
  });
}

// Hook: Get pending approvals
export function usePendingApprovals() {
  return useQuery({
    queryKey: ['pending-approvals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promise_logs')
        .select('*')
        .eq('status', 'pending_approval')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PromiseWithDetails[];
    },
  });
}

// Hook: Get overdue promises
export function useOverduePromises() {
  return useQuery({
    queryKey: ['overdue-promises'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promise_logs')
        .select('*')
        .in('status', ['assigned', 'promised', 'in_progress'])
        .lt('deadline', new Date().toISOString())
        .order('deadline', { ascending: true });

      if (error) throw error;
      return data as PromiseWithDetails[];
    },
  });
}

// Hook: Get escalated promises
export function useEscalatedPromises() {
  return useQuery({
    queryKey: ['escalated-promises'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promise_logs')
        .select('*')
        .gt('escalation_level', 0)
        .not('status', 'in', '("completed","breached")')
        .order('escalation_level', { ascending: false });

      if (error) throw error;
      return data as PromiseWithDetails[];
    },
  });
}

// Hook: Get promise audit logs (immutable)
export function usePromiseAuditLogs(promiseId?: string) {
  return useQuery({
    queryKey: ['promise-audit-logs', promiseId],
    queryFn: async () => {
      let query = supabase
        .from('promise_audit_logs')
        .select('*')
        .order('server_timestamp', { ascending: false })
        .limit(100);

      if (promiseId) {
        query = query.eq('promise_id', promiseId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as PromiseAuditLog[];
    },
  });
}

// Hook: Create promise with validation
export function useCreatePromise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      taskId: string;
      developerId: string;
      deadline: string;
      promiseType: string;
      priority: string;
      assignedRole: string;
      responsibleUserId?: string;
    }) => {
      const { data, error } = await supabase.rpc('create_promise_with_validation', {
        p_task_id: params.taskId,
        p_developer_id: params.developerId,
        p_deadline: params.deadline,
        p_promise_type: params.promiseType,
        p_priority: params.priority,
        p_assigned_role: params.assignedRole,
        p_responsible_user_id: params.responsibleUserId,
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; promise_id?: string };
      if (!result?.success) {
        throw new Error(result?.error || 'Failed to create promise');
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promises-list'] });
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['promise-manager-metrics'] });
      toast.success('Promise created and submitted for approval');
    },
    onError: (error) => {
      toast.error('Failed to create promise: ' + error.message);
    },
  });
}

// Hook: Approve promise (strict - only authorized roles)
export function useApprovePromiseStrict() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (promiseId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('approve_promise_strict', {
        p_promise_id: promiseId,
        p_approver_id: user.id,
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; promise_id?: string };
      if (!result?.success) {
        throw new Error(result?.error || 'Failed to approve promise');
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promises-list'] });
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['promise-manager-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['promise-audit-logs'] });
      toast.success('Promise approved and activated');
    },
    onError: (error) => {
      toast.error('Approval failed: ' + error.message);
    },
  });
}

// Hook: Reject promise (strict - reason mandatory)
export function useRejectPromiseStrict() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (params: { promiseId: string; reason: string }) => {
      if (!user) throw new Error('Not authenticated');

      if (!params.reason || params.reason.trim() === '') {
        throw new Error('Rejection reason is mandatory');
      }

      const { data, error } = await supabase.rpc('reject_promise_strict', {
        p_promise_id: params.promiseId,
        p_rejector_id: user.id,
        p_reason: params.reason,
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string };
      if (!result?.success) {
        throw new Error(result?.error || 'Failed to reject promise');
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promises-list'] });
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['promise-manager-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['promise-audit-logs'] });
      toast.success('Promise rejected');
    },
    onError: (error) => {
      toast.error('Rejection failed: ' + error.message);
    },
  });
}

// Hook: Escalate promise
export function useEscalatePromise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promiseId: string) => {
      const { data, error } = await supabase.rpc('escalate_overdue_promise', {
        p_promise_id: promiseId,
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; new_level?: number };
      if (!result?.success) {
        throw new Error(result?.error || 'Failed to escalate promise');
      }

      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['promises-list'] });
      queryClient.invalidateQueries({ queryKey: ['escalated-promises'] });
      queryClient.invalidateQueries({ queryKey: ['promise-manager-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['promise-audit-logs'] });
      toast.warning(`Promise escalated to level ${data.new_level}`);
    },
    onError: (error) => {
      toast.error('Escalation failed: ' + error.message);
    },
  });
}

// Hook: Fulfill/close promise (strict)
export function useFulfillPromise() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (params: { promiseId: string; forceClose?: boolean }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('fulfill_promise_strict', {
        p_promise_id: params.promiseId,
        p_fulfiller_id: user.id,
        p_force_close: params.forceClose || false,
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; locked?: boolean };
      if (!result?.success) {
        throw new Error(result?.error || 'Failed to fulfill promise');
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promises-list'] });
      queryClient.invalidateQueries({ queryKey: ['promise-manager-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['promise-audit-logs'] });
      toast.success('Promise fulfilled and permanently locked');
    },
    onError: (error) => {
      toast.error('Fulfillment failed: ' + error.message);
    },
  });
}

// Hook: Validate promise integrity
export function useValidatePromise() {
  return useMutation({
    mutationFn: async (promiseId: string) => {
      const { data, error } = await supabase.rpc('validate_promise_integrity', {
        p_promise_id: promiseId,
      });

      if (error) throw error;
      return data as { valid: boolean; errors: string[] };
    },
    onSuccess: (data) => {
      if (data.valid) {
        toast.success('Promise integrity verified');
      } else {
        toast.error('Integrity issues: ' + data.errors.join(', '));
      }
    },
  });
}

// Hook: Real-time promise updates
export function usePromiseRealtime(onUpdate: () => void) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['promise-realtime'],
    queryFn: async () => {
      const channel = supabase
        .channel('promise-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'promise_logs' },
          () => {
            queryClient.invalidateQueries({ queryKey: ['promises-list'] });
            queryClient.invalidateQueries({ queryKey: ['promise-manager-metrics'] });
            onUpdate();
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'promise_audit_logs' },
          () => {
            queryClient.invalidateQueries({ queryKey: ['promise-audit-logs'] });
          }
        )
        .subscribe();

      return channel;
    },
    staleTime: Infinity,
  });
}
