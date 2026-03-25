import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface AutoScalingPolicy {
  id: string;
  server_id: string;
  cpu_threshold_percent: number;
  ram_threshold_percent: number;
  disk_threshold_percent?: number;
  scale_up_cpu: number;
  scale_up_ram: number;
  scale_up_storage?: number;
  max_cpu: number;
  max_ram: number;
  max_storage?: number;
  cooldown_minutes: number;
  cooldown_seconds?: number;
  consecutive_checks_required: number;
  consecutive_triggers?: number;
  is_enabled: boolean;
  last_scale_at?: string;
  last_triggered_at?: string;
}

interface ScalingEvent {
  id: string;
  server_id: string;
  policy_id: string;
  trigger_reason: string;
  trigger_value: number;
  threshold_value: number;
  scale_direction: 'up' | 'down';
  cpu_before: number;
  cpu_after: number;
  ram_before: number;
  ram_after: number;
  status: string;
  created_at: string;
  completed_at?: string;
}

export function useAutoScalingPolicies(serverId?: string) {
  const queryClient = useQueryClient();

  const { data: policies, isLoading, error } = useQuery({
    queryKey: ['auto-scaling-policies', serverId],
    queryFn: async () => {
      let query = supabase
        .from('auto_scaling_policies')
        .select('*')
        .order('created_at', { ascending: false });

      if (serverId) {
        query = query.eq('server_id', serverId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as AutoScalingPolicy[];
    }
  });

  const createPolicy = useMutation({
    mutationFn: async (policy: Omit<AutoScalingPolicy, 'id'>) => {
      const { data, error } = await supabase
        .from('auto_scaling_policies')
        .insert(policy)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auto-scaling-policies'] });
      toast.success('Auto-scaling policy created');
    },
    onError: (error) => {
      toast.error('Failed to create policy: ' + error.message);
    }
  });

  const updatePolicy = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AutoScalingPolicy> & { id: string }) => {
      const { data, error } = await supabase
        .from('auto_scaling_policies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auto-scaling-policies'] });
      toast.success('Policy updated');
    },
    onError: (error) => {
      toast.error('Failed to update policy: ' + error.message);
    }
  });

  const togglePolicy = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { data, error } = await supabase
        .from('auto_scaling_policies')
        .update({ is_enabled: enabled })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['auto-scaling-policies'] });
      toast.success(`Auto-scaling ${variables.enabled ? 'enabled' : 'disabled'}`);
    }
  });

  const deletePolicy = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('auto_scaling_policies')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auto-scaling-policies'] });
      toast.success('Policy deleted');
    }
  });

  return {
    policies,
    isLoading,
    error,
    createPolicy,
    updatePolicy,
    togglePolicy,
    deletePolicy
  };
}

export function useScalingEvents(serverId?: string, limit = 50) {
  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ['scaling-events', serverId, limit],
    queryFn: async () => {
      let query = supabase
        .from('scaling_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (serverId) {
        query = query.eq('server_id', serverId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ScalingEvent[];
    },
    refetchInterval: 10000 // Refetch every 10 seconds
  });

  return { events, isLoading, refetch };
}

interface CheckAutoScalingResult {
  should_scale: boolean;
  reason?: string;
  scale_cpu?: number;
  scale_ram?: number;
  current_cpu?: number;
  current_ram?: number;
  trigger_value?: number;
}

export function useCheckAutoScaling() {
  const [isChecking, setIsChecking] = useState(false);

  const checkAndScale = useCallback(async (serverId: string) => {
    setIsChecking(true);
    try {
      // Call the check function
      const { data, error: checkError } = await supabase
        .rpc('check_auto_scaling', { p_server_id: serverId });

      if (checkError) throw checkError;

      const checkResult = data as unknown as CheckAutoScalingResult;

      if (checkResult?.should_scale) {
        // Execute scaling
        const { data: scaleResult, error: scaleError } = await supabase
          .rpc('execute_auto_scale', {
            p_server_id: serverId,
            p_new_cpu: checkResult.scale_cpu,
            p_new_ram: checkResult.scale_ram,
            p_reason: checkResult.reason,
            p_trigger_value: checkResult.trigger_value
          });

        if (scaleError) throw scaleError;

        toast.success(`Auto-scaled server: CPU ${checkResult.current_cpu} → ${checkResult.scale_cpu}, RAM ${checkResult.current_ram} → ${checkResult.scale_ram}GB`);
        return { scaled: true, result: scaleResult };
      }

      return { scaled: false, reason: checkResult?.reason };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Auto-scaling check failed: ' + message);
      throw error;
    } finally {
      setIsChecking(false);
    }
  }, []);

  return { checkAndScale, isChecking };
}

export function useServerActions(serverId?: string) {
  const { data: actions, isLoading } = useQuery({
    queryKey: ['server-actions', serverId],
    queryFn: async () => {
      let query = supabase
        .from('server_actions')
        .select('*, server_instances(name)')
        .order('requested_at', { ascending: false })
        .limit(100);

      if (serverId) {
        query = query.eq('server_id', serverId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000
  });

  return { actions, isLoading };
}
