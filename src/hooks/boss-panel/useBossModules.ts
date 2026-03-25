import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SystemModule {
  id: string;
  module_code: string;
  module_name: string;
  description: string | null;
  status: string;
  is_critical: boolean;
  created_at: string;
}

export function useBossModules() {
  const queryClient = useQueryClient();

  const modulesQuery = useQuery({
    queryKey: ['boss-modules'],
    queryFn: async (): Promise<SystemModule[]> => {
      const { data, error } = await supabase
        .from('system_modules')
        .select('*')
        .order('module_name');

      if (error) throw error;
      return data || [];
    }
  });

  const updateModuleStatusMutation = useMutation({
    mutationFn: async ({ moduleId, status }: { moduleId: string; status: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('system_modules')
        .update({ status })
        .eq('id', moduleId);

      if (error) throw error;

      // Log the action
      await supabase.from('system_activity_log').insert({
        actor_role: 'boss',
        actor_id: user.id,
        action_type: `module_${status}`,
        target: moduleId,
        risk_level: status === 'locked' ? 'high' : 'medium'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boss-modules'] });
      toast.success('Module status updated');
    },
    onError: (error) => {
      toast.error(`Failed to update module: ${error.message}`);
    }
  });

  const lockModule = (moduleId: string, _reason?: string) => {
    updateModuleStatusMutation.mutate({ moduleId, status: 'locked' });
  };

  const unlockModule = (moduleId: string) => {
    updateModuleStatusMutation.mutate({ moduleId, status: 'active' });
  };

  const setMaintenanceMode = (moduleId: string, enabled: boolean) => {
    updateModuleStatusMutation.mutate({ moduleId, status: enabled ? 'maintenance' : 'active' });
  };

  return {
    modules: modulesQuery.data || [],
    isLoading: modulesQuery.isLoading,
    error: modulesQuery.error,
    lockModule,
    unlockModule,
    setMaintenanceMode,
    isUpdating: updateModuleStatusMutation.isPending
  };
}
