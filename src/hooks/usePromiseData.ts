import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export interface PromiseLog {
  id: string;
  developer_id: string;
  task_id: string;
  promise_time: string;
  deadline: string;
  finished_time: string | null;
  breach_reason: string | null;
  status: string;
  fine_amount: number | null;
  extended_count: number;
  created_at: string;
}

export interface PromiseFine {
  id: string;
  promise_id: string;
  developer_id: string;
  fine_amount: number;
  fine_reason: string;
  fine_type: string;
  status: string;
  applied_at: string;
}

export interface PromiseMetrics {
  activePromises: number;
  completedToday: number;
  breachedToday: number;
  atRisk: number;
  avgCompletionRate: number;
  totalFines: string;
}

export function useActivePromises() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('promise-logs-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'promise_logs' }, () => {
        queryClient.invalidateQueries({ queryKey: ['active-promises'] });
        queryClient.invalidateQueries({ queryKey: ['promise-metrics'] });
        queryClient.invalidateQueries({ queryKey: ['top-performers'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ['active-promises'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promise_logs')
        .select('*')
        .in('status', ['promised', 'in_progress', 'assigned'])
        .order('deadline', { ascending: true })
        .limit(20);

      if (error) throw error;
      return (data || []) as PromiseLog[];
    },
  });
}

export function usePromiseFines() {
  return useQuery({
    queryKey: ['promise-fines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promise_fines')
        .select('*')
        .order('applied_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return (data || []) as PromiseFine[];
    },
  });
}

export function usePromiseMetrics() {
  return useQuery({
    queryKey: ['promise-metrics'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get active promises
      const { data: activeData, error: activeError } = await supabase
        .from('promise_logs')
        .select('id, status')
        .in('status', ['promised', 'in_progress', 'assigned']);

      if (activeError) throw activeError;

      // Get today's completed
      const { data: completedData, error: completedError } = await supabase
        .from('promise_logs')
        .select('id')
        .eq('status', 'completed')
        .gte('finished_time', today.toISOString());

      if (completedError) throw completedError;

      // Get today's breached
      const { data: breachedData, error: breachedError } = await supabase
        .from('promise_logs')
        .select('id')
        .eq('status', 'breached')
        .gte('updated_at', today.toISOString());

      if (breachedError) throw breachedError;

      // Get total fines
      const { data: finesData, error: finesError } = await supabase
        .from('promise_fines')
        .select('fine_amount')
        .eq('status', 'pending');

      if (finesError) throw finesError;

      const totalFines = (finesData || []).reduce((sum: number, f: any) => sum + (f.fine_amount || 0), 0);
      // Count promises approaching deadline as at-risk
      const atRiskCount = 0; // Would need deadline comparison logic

      // Calculate completion rate
      const { data: allCompleted } = await supabase
        .from('promise_logs')
        .select('id')
        .eq('status', 'completed');

      const { data: allBreached } = await supabase
        .from('promise_logs')
        .select('id')
        .eq('status', 'breached');

      const totalFinished = (allCompleted?.length || 0) + (allBreached?.length || 0);
      const completionRate = totalFinished > 0 
        ? Math.round(((allCompleted?.length || 0) / totalFinished) * 100) 
        : 100;

      return {
        activePromises: (activeData || []).length,
        completedToday: (completedData || []).length,
        breachedToday: (breachedData || []).length,
        atRisk: atRiskCount,
        avgCompletionRate: completionRate,
        totalFines: `₹${totalFines.toLocaleString()}`,
      } as PromiseMetrics;
    },
  });
}

export function useTopPerformers() {
  return useQuery({
    queryKey: ['top-performers'],
    queryFn: async () => {
      // This would ideally be a database function for efficiency
      const { data, error } = await supabase
        .from('promise_logs')
        .select('developer_id, status')
        .in('status', ['completed', 'breached']);

      if (error) throw error;

      // Group by developer
      const devStats: Record<string, { completed: number; total: number }> = {};
      (data || []).forEach((p: any) => {
        if (!devStats[p.developer_id]) {
          devStats[p.developer_id] = { completed: 0, total: 0 };
        }
        devStats[p.developer_id].total++;
        if (p.status === 'completed') {
          devStats[p.developer_id].completed++;
        }
      });

      // Convert to array and sort
      return Object.entries(devStats)
        .map(([id, stats]) => ({
          developer_id: id,
          completed: stats.completed,
          total: stats.total,
          rate: Math.round((stats.completed / stats.total) * 100),
        }))
        .sort((a, b) => b.rate - a.rate)
        .slice(0, 5);
    },
  });
}
