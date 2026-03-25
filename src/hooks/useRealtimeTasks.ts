import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { toast } from 'sonner';

export interface DeveloperTask {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  deadline: string | null;
  developer_id: string | null;
  created_at: string;
  updated_at: string;
  category: string | null;
  estimated_hours: number | null;
  sla_hours: number | null;
}

export const useRealtimeTasks = (developerId?: string) => {
  const queryClient = useQueryClient();

  // Fetch tasks
  const { data: tasks, isLoading, error, refetch } = useQuery({
    queryKey: ['developer-tasks', developerId],
    queryFn: async () => {
      let query = supabase
        .from('developer_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (developerId) {
        query = query.or(`developer_id.eq.${developerId},status.eq.pending`);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      
      return (data || []).map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        deadline: task.deadline,
        developer_id: task.developer_id,
        created_at: task.created_at,
        updated_at: task.updated_at,
        category: task.category,
        estimated_hours: task.estimated_hours,
        sla_hours: task.sla_hours
      })) as DeveloperTask[];
    },
    staleTime: 0,
  });

  // Setup realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('tasks-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'developer_tasks'
        },
        (payload) => {
          console.log('Task change:', payload);
          queryClient.invalidateQueries({ queryKey: ['developer-tasks'] });
          
          if (payload.eventType === 'INSERT') {
            toast.info('New task available!');
          } else if (payload.eventType === 'UPDATE') {
            const newData = payload.new as any;
            if (newData.status === 'completed') {
              toast.success('Task completed!');
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Accept task mutation
  const acceptTask = useMutation({
    mutationFn: async (taskId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('developer_tasks')
        .update({ 
          status: 'assigned',
          developer_id: user.id,
          accepted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;

      // Log the action
      await supabase.from('developer_activity_logs').insert({
        developer_id: user.id,
        activity_type: 'task_accepted',
        description: `Accepted task ${taskId}`
      });

      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer-tasks'] });
      toast.success('Task accepted!');
    },
    onError: (error) => {
      toast.error('Failed to accept task: ' + error.message);
    }
  });

  // Reject task mutation
  const rejectTask = useMutation({
    mutationFn: async ({ taskId, reason }: { taskId: string; reason?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('developer_tasks')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;

      // Log the rejection
      await supabase.from('developer_activity_logs').insert({
        developer_id: user.id,
        activity_type: 'task_rejected',
        description: `Rejected task ${taskId}: ${reason || 'No reason provided'}`
      });

      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer-tasks'] });
      toast.info('Task rejected');
    }
  });

  // Update task status
  const updateTaskStatus = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: string }) => {
      const { error } = await supabase
        .from('developer_tasks')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;
      return { taskId, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer-tasks'] });
    }
  });

  // Filter tasks by status
  const pendingTasks = tasks?.filter(t => t.status === 'pending') || [];
  const assignedTasks = tasks?.filter(t => t.status === 'assigned' || t.status === 'in_progress') || [];
  const completedTasks = tasks?.filter(t => t.status === 'completed') || [];

  return {
    tasks,
    pendingTasks,
    assignedTasks,
    completedTasks,
    isLoading,
    error,
    refetch,
    acceptTask,
    rejectTask,
    updateTaskStatus
  };
};

export default useRealtimeTasks;
