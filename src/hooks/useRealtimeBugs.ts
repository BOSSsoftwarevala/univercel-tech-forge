import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { toast } from 'sonner';

export interface Bug {
  id: string;
  title: string;
  description: string | null;
  severity: string;
  status: 'open' | 'fixed';
  sla_deadline: string | null;
  assigned_to: string | null;
  reopen_count: number;
  created_at: string;
  task_id: string | null;
  is_acknowledged: boolean;
}

export const useRealtimeBugs = (developerId?: string) => {
  const queryClient = useQueryClient();

  // Fetch bugs from developer_violations table
  const { data: bugs, isLoading, error, refetch } = useQuery({
    queryKey: ['developer-bugs', developerId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const devId = developerId || user?.id;
      
      if (!devId) return [];

      const { data, error } = await supabase
        .from('developer_violations')
        .select('*')
        .eq('developer_id', devId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Transform violations to bug format
      return (data || []).map(v => ({
        id: v.id,
        title: v.violation_type || 'Issue',
        description: v.description,
        severity: v.severity || 'medium',
        status: v.is_acknowledged ? 'fixed' as const : 'open' as const,
        sla_deadline: null,
        assigned_to: v.developer_id,
        reopen_count: 0,
        created_at: v.created_at,
        task_id: v.task_id,
        is_acknowledged: v.is_acknowledged || false
      })) as Bug[];
    },
    staleTime: 0
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('bugs-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'developer_violations'
        },
        (payload) => {
          console.log('Bug/Violation change:', payload);
          queryClient.invalidateQueries({ queryKey: ['developer-bugs'] });
          
          if (payload.eventType === 'INSERT') {
            toast.warning('New issue reported!');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Mark as fixed (acknowledge)
  const markFixed = useMutation({
    mutationFn: async (bugId: string) => {
      const { error } = await supabase
        .from('developer_violations')
        .update({ 
          is_acknowledged: true,
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', bugId);

      if (error) throw error;
      return bugId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer-bugs'] });
      toast.success('Issue marked as fixed!');
    }
  });

  // Reopen bug (unacknowledge)
  const reopenBug = useMutation({
    mutationFn: async (bugId: string) => {
      const { error } = await supabase
        .from('developer_violations')
        .update({ 
          is_acknowledged: false,
          acknowledged_at: null
        })
        .eq('id', bugId);

      if (error) throw error;
      return bugId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer-bugs'] });
      toast.info('Issue reopened');
    }
  });

  // Filter by status
  const openBugs = bugs?.filter(b => b.status === 'open') || [];
  const fixedBugs = bugs?.filter(b => b.status === 'fixed') || [];

  return {
    bugs,
    openBugs,
    fixedBugs,
    isLoading,
    error,
    refetch,
    markFixed,
    reopenBug
  };
};

export default useRealtimeBugs;
