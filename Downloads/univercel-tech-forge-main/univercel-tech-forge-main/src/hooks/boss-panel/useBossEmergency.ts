import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EmergencyEvent {
  event_id: string;
  boss_id: string;
  action: string;
  reason: string;
  affected_modules: string[] | null;
  timestamp: string;
}

export function useBossEmergency() {
  const queryClient = useQueryClient();

  const eventsQuery = useQuery({
    queryKey: ['boss-emergency-events'],
    queryFn: async (): Promise<EmergencyEvent[]> => {
      const { data, error } = await supabase
        .from('emergency_events')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data || []) as EmergencyEvent[];
    }
  });

  const systemLockdownMutation = useMutation({
    mutationFn: async ({ reason, affectedModules }: { reason: string; affectedModules?: string[] }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get boss account
      const { data: bossAccount } = await supabase
        .from('boss_accounts')
        .select('boss_id')
        .eq('user_id', user.id)
        .single();

      if (!bossAccount) throw new Error('Boss account not found');

      // Lock all modules
      const { error: moduleError } = await supabase
        .from('system_modules')
        .update({ status: 'locked' })
        .neq('status', 'locked');

      if (moduleError) throw moduleError;

      // Create emergency event
      const { error: eventError } = await supabase
        .from('emergency_events')
        .insert({
          boss_id: bossAccount.boss_id,
          action: 'lockdown',
          reason,
          affected_modules: affectedModules || ['all']
        });

      if (eventError) throw eventError;

      // Log the action
      await supabase.from('system_activity_log').insert({
        actor_role: 'boss',
        actor_id: user.id,
        action_type: 'system_lockdown',
        risk_level: 'critical',
        metadata: { reason, affected_modules: affectedModules || ['all'] }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boss-modules'] });
      queryClient.invalidateQueries({ queryKey: ['boss-emergency-events'] });
      toast.success('System lockdown initiated');
    },
    onError: (error) => {
      toast.error(`Lockdown failed: ${error.message}`);
    }
  });

  const systemUnlockMutation = useMutation({
    mutationFn: async ({ reason }: { reason: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get boss account
      const { data: bossAccount } = await supabase
        .from('boss_accounts')
        .select('boss_id')
        .eq('user_id', user.id)
        .single();

      if (!bossAccount) throw new Error('Boss account not found');

      // Unlock all modules
      const { error: moduleError } = await supabase
        .from('system_modules')
        .update({ status: 'active' })
        .eq('status', 'locked');

      if (moduleError) throw moduleError;

      // Create emergency event
      const { error: eventError } = await supabase
        .from('emergency_events')
        .insert({
          boss_id: bossAccount.boss_id,
          action: 'unlock',
          reason,
          affected_modules: ['all']
        });

      if (eventError) throw eventError;

      // Log the action
      await supabase.from('system_activity_log').insert({
        actor_role: 'boss',
        actor_id: user.id,
        action_type: 'system_unlock',
        risk_level: 'high',
        metadata: { reason }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boss-modules'] });
      queryClient.invalidateQueries({ queryKey: ['boss-emergency-events'] });
      toast.success('System unlocked');
    },
    onError: (error) => {
      toast.error(`Unlock failed: ${error.message}`);
    }
  });

  return {
    events: eventsQuery.data || [],
    isLoading: eventsQuery.isLoading,
    error: eventsQuery.error,
    lockdown: systemLockdownMutation.mutate,
    unlock: systemUnlockMutation.mutate,
    isLocking: systemLockdownMutation.isPending,
    isUnlocking: systemUnlockMutation.isPending
  };
}
