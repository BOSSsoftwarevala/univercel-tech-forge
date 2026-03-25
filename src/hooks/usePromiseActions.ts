import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CompletionResult {
  success: boolean;
  on_time?: boolean;
  reward?: number;
  score_bonus?: number;
  error?: string;
}

interface BreachResult {
  success: boolean;
  penalty?: number;
  score_penalty?: number;
  payment_cut_percent?: number;
  error?: string;
}

// Confirm developer commitment to promise
export function useConfirmCommitment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promiseId: string) => {
      const { data, error } = await supabase.rpc('confirm_developer_commitment', {
        p_promise_id: promiseId
      });

      if (error) throw error;
      
      const result = data as { success: boolean; error?: string };
      if (!result.success) throw new Error(result.error || 'Failed to confirm');
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-promises'] });
      queryClient.invalidateQueries({ queryKey: ['promise-metrics'] });
      toast.success('Commitment confirmed - Timer started');
    },
    onError: (error) => {
      toast.error('Failed to confirm commitment: ' + error.message);
    },
  });
}

// Complete promise with automatic reward calculation
export function useCompletePromise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promiseId: string): Promise<CompletionResult> => {
      const { data, error } = await supabase.rpc('complete_promise_with_reward', {
        p_promise_id: promiseId
      });

      if (error) throw error;
      
      const result = data as unknown as CompletionResult;
      if (!result.success) throw new Error(result.error || 'Failed to complete');
      
      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['active-promises'] });
      queryClient.invalidateQueries({ queryKey: ['promise-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['top-performers'] });
      queryClient.invalidateQueries({ queryKey: ['developer-wallet'] });
      
      if (result.on_time && result.reward && result.reward > 0) {
        toast.success(`Promise completed on time! Reward: ₹${result.reward}, Score: +${result.score_bonus}`);
      } else if (result.on_time) {
        toast.success('Promise completed on time!');
      } else {
        toast.warning('Promise completed late - No reward earned');
      }
    },
    onError: (error) => {
      toast.error('Failed to complete promise: ' + error.message);
    },
  });
}

// Breach promise with automatic penalty calculation
export function useBreachPromise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ promiseId, reason }: { promiseId: string; reason?: string }): Promise<BreachResult> => {
      const { data, error } = await supabase.rpc('breach_promise_with_penalty', {
        p_promise_id: promiseId,
        p_reason: reason || 'Deadline exceeded'
      });

      if (error) throw error;
      
      const result = data as unknown as BreachResult;
      if (!result.success) throw new Error(result.error || 'Failed to breach');
      
      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['active-promises'] });
      queryClient.invalidateQueries({ queryKey: ['promise-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['top-performers'] });
      queryClient.invalidateQueries({ queryKey: ['developer-wallet'] });
      
      toast.error(
        `Promise breached! Penalty: ₹${result.penalty}, Score: ${result.score_penalty}, Payment cut: ${result.payment_cut_percent}%`
      );
    },
    onError: (error) => {
      toast.error('Failed to update promise: ' + error.message);
    },
  });
}

export function useExtendPromise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ promiseId, newDeadline }: { promiseId: string; newDeadline: string }) => {
      // Get current promise to increment extension count
      const { data: promise, error: fetchError } = await supabase
        .from('promise_logs')
        .select('extended_count')
        .eq('id', promiseId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from('promise_logs')
        .update({ 
          extended_deadline: newDeadline,
          extended_count: (promise?.extended_count || 0) + 1,
          extended_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', promiseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-promises'] });
      queryClient.invalidateQueries({ queryKey: ['promise-metrics'] });
      toast.success('Deadline extended');
    },
    onError: (error) => {
      toast.error('Failed to extend deadline: ' + error.message);
    },
  });
}
