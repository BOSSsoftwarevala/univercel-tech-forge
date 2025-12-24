import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useCompletePromise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promiseId: string) => {
      const { error } = await supabase
        .from('promise_logs')
        .update({ 
          status: 'completed', 
          finished_time: new Date().toISOString() 
        })
        .eq('id', promiseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-promises'] });
      queryClient.invalidateQueries({ queryKey: ['promise-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['top-performers'] });
      toast.success('Promise marked complete');
    },
    onError: (error) => {
      toast.error('Failed to complete promise: ' + error.message);
    },
  });
}

export function useBreachPromise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ promiseId, reason }: { promiseId: string; reason?: string }) => {
      const { error } = await supabase
        .from('promise_logs')
        .update({ 
          status: 'breached', 
          breach_reason: reason || 'Deadline exceeded'
        })
        .eq('id', promiseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-promises'] });
      queryClient.invalidateQueries({ queryKey: ['promise-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['top-performers'] });
      toast.warning('Promise marked as breached');
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
          deadline: newDeadline,
          extended_count: (promise?.extended_count || 0) + 1
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
