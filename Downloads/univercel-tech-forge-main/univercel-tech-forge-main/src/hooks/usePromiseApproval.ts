import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export interface PendingPromise {
  id: string;
  developer_id: string;
  task_id: string;
  deadline: string;
  promise_type: string;
  priority: string;
  status: string;
  created_at: string;
}

// Hook to get pending approval promises
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
      return data as PendingPromise[];
    },
  });
}

// Hook to approve a promise
export function useApprovePromise() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (promiseId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('approve_promise', {
        p_promise_id: promiseId,
        p_approver_id: user.id,
      });

      if (error) throw error;
      
      const result = data as { success: boolean; error?: string; promise_id?: string };
      if (!result?.success) throw new Error(result?.error || 'Failed to approve promise');
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['active-promises'] });
      queryClient.invalidateQueries({ queryKey: ['promise-metrics'] });
      toast.success('Promise approved and activated');
    },
    onError: (error) => {
      toast.error('Failed to approve: ' + error.message);
    },
  });
}

// Hook to reject a promise
export function useRejectPromise() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ promiseId, reason }: { promiseId: string; reason?: string }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('reject_promise', {
        p_promise_id: promiseId,
        p_rejector_id: user.id,
        p_reason: reason || 'Rejected by manager',
      });

      if (error) throw error;
      
      const result = data as { success: boolean; error?: string; promise_id?: string };
      if (!result?.success) throw new Error(result?.error || 'Failed to reject promise');
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['active-promises'] });
      queryClient.invalidateQueries({ queryKey: ['promise-metrics'] });
      toast.success('Promise rejected');
    },
    onError: (error) => {
      toast.error('Failed to reject: ' + error.message);
    },
  });
}

// Hook to get escalated promises
export function useEscalatedPromises() {
  return useQuery({
    queryKey: ['escalated-promises'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promise_logs')
        .select('*')
        .gt('escalation_level', 0)
        .in('status', ['promised', 'in_progress'])
        .order('escalation_level', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

// Hook to create a promise with approval flow
export function useCreatePromiseWithApproval() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      developerId,
      taskId,
      deadline,
      promiseType,
      priority,
      approvalRequired = true,
    }: {
      developerId: string;
      taskId: string;
      deadline: string;
      promiseType: string;
      priority: string;
      approvalRequired?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('promise_logs')
        .insert({
          developer_id: developerId,
          task_id: taskId,
          deadline: deadline,
          promise_type: promiseType,
          priority: priority,
          status: approvalRequired ? 'pending_approval' : 'assigned',
          approval_required: approvalRequired,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['active-promises'] });
      queryClient.invalidateQueries({ queryKey: ['promise-metrics'] });
      toast.success(
        data.status === 'pending_approval' 
          ? 'Promise submitted for approval' 
          : 'Promise created'
      );
    },
    onError: (error) => {
      toast.error('Failed to create promise: ' + error.message);
    },
  });
}
