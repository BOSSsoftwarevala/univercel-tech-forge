import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface SuperAdmin {
  id: string;
  user_id: string;
  name: string;
  continent: string;
  login_status: string;
  current_device: string | null;
  last_login_time: string | null;
  risk_score: number;
  countries_managed: number;
  created_at: string;
}

interface RoleActivity {
  id: string;
  role_type: string;
  role_id: string;
  action_type: string;
  action_object: string | null;
  ip_address: string | null;
  device: string | null;
  geo_location: string | null;
  risk_flag: string;
  created_at: string;
}

interface ApprovalItem {
  id: string;
  requested_by_role: string;
  requested_by_id: string;
  action_type: string;
  action_payload: unknown;
  priority: string;
  status: string;
  review_notes: string | null;
  created_at: string;
}

interface TaskItem {
  id: string;
  assigned_to_role: string;
  assigned_to_id: string | null;
  task_type: string;
  title: string;
  description: string | null;
  priority: string;
  deadline: string | null;
  status: string;
  progress_percentage: number;
  created_at: string;
}

interface SystemAlert {
  id: string;
  source_table: string;
  source_id: string | null;
  alert_type: string;
  severity: string;
  title: string;
  message: string | null;
  status: string;
  created_at: string;
}

interface AIInsight {
  id: string;
  scope: string;
  scope_value: string | null;
  related_role: string | null;
  issue_detected: string;
  suggested_action: string | null;
  confidence_score: number;
  is_acknowledged: boolean;
  created_at: string;
}

export function useSuperAdminControl() {
  const { user } = useAuth();
  const [superAdmins, setSuperAdmins] = useState<SuperAdmin[]>([]);
  const [activities, setActivities] = useState<RoleActivity[]>([]);
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSuperAdmins = useCallback(async () => {
    const { data, error } = await supabase
      .from('super_admin')
      .select('*')
      .order('continent');
    
    if (error) {
      console.error('Error fetching super admins:', error);
      return;
    }
    setSuperAdmins(data || []);
  }, []);

  const fetchActivities = useCallback(async () => {
    const { data, error } = await supabase
      .from('role_activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error fetching activities:', error);
      return;
    }
    setActivities(data || []);
  }, []);

  const fetchApprovals = useCallback(async () => {
    const { data, error } = await supabase
      .from('sa_approval_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching approvals:', error);
      return;
    }
    setApprovals(data || []);
  }, []);

  const fetchTasks = useCallback(async () => {
    const { data, error } = await supabase
      .from('task_master')
      .select('*')
      .neq('status', 'completed')
      .order('priority', { ascending: false });
    
    if (error) {
      console.error('Error fetching tasks:', error);
      return;
    }
    setTasks(data || []);
  }, []);

  const fetchAlerts = useCallback(async () => {
    const { data, error } = await supabase
      .from('system_alerts')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching alerts:', error);
      return;
    }
    setAlerts(data || []);
  }, []);

  const fetchInsights = useCallback(async () => {
    const { data, error } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('is_acknowledged', false)
      .order('confidence_score', { ascending: false });
    
    if (error) {
      console.error('Error fetching insights:', error);
      return;
    }
    setInsights(data || []);
  }, []);

  const approveRequest = useCallback(async (approvalId: string, notes?: string) => {
    const { error } = await supabase
      .from('sa_approval_queue')
      .update({
        status: 'approved',
        review_time: new Date().toISOString(),
        review_notes: notes || null
      })
      .eq('id', approvalId);
    
    if (error) {
      toast.error('Failed to approve request');
      return false;
    }
    toast.success('Request approved');
    fetchApprovals();
    return true;
  }, [fetchApprovals]);

  const rejectRequest = useCallback(async (approvalId: string, notes: string) => {
    const { error } = await supabase
      .from('sa_approval_queue')
      .update({
        status: 'rejected',
        review_time: new Date().toISOString(),
        review_notes: notes
      })
      .eq('id', approvalId);
    
    if (error) {
      toast.error('Failed to reject request');
      return false;
    }
    toast.success('Request rejected');
    fetchApprovals();
    return true;
  }, [fetchApprovals]);

  const createTask = useCallback(async (task: {
    assigned_to_role: string;
    assigned_to_id?: string;
    task_type: string;
    title: string;
    description?: string;
    priority?: string;
    deadline?: string;
  }) => {
    const { error } = await supabase
      .from('task_master')
      .insert([{
        assigned_to_role: task.assigned_to_role as any,
        assigned_to_id: task.assigned_to_id,
        task_type: task.task_type,
        title: task.title,
        description: task.description,
        priority: task.priority || 'normal',
        deadline: task.deadline,
        status: 'pending',
        progress_percentage: 0
      }]);
    
    if (error) {
      toast.error('Failed to create task');
      return false;
    }
    toast.success('Task created');
    fetchTasks();
    return true;
  }, [fetchTasks]);

  const acknowledgeAlert = useCallback(async (alertId: string) => {
    const { error } = await supabase
      .from('system_alerts')
      .update({
        status: 'acknowledged',
        acknowledged_by: user?.id,
        acknowledged_at: new Date().toISOString()
      })
      .eq('id', alertId);
    
    if (error) {
      toast.error('Failed to acknowledge alert');
      return false;
    }
    toast.success('Alert acknowledged');
    fetchAlerts();
    return true;
  }, [user, fetchAlerts]);

  const acknowledgeInsight = useCallback(async (insightId: string) => {
    const { error } = await supabase
      .from('ai_insights')
      .update({
        is_acknowledged: true,
        acknowledged_by: user?.id,
        acknowledged_at: new Date().toISOString()
      })
      .eq('id', insightId);
    
    if (error) {
      toast.error('Failed to acknowledge insight');
      return false;
    }
    toast.success('Insight acknowledged');
    fetchInsights();
    return true;
  }, [user, fetchInsights]);

  useEffect(() => {
    if (!user) return;
    
    const loadAll = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchSuperAdmins(),
        fetchActivities(),
        fetchApprovals(),
        fetchTasks(),
        fetchAlerts(),
        fetchInsights()
      ]);
      setIsLoading(false);
    };
    
    loadAll();

    // Set up realtime subscriptions
    const activityChannel = supabase
      .channel('role_activity_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'role_activity_log' }, () => {
        fetchActivities();
      })
      .subscribe();

    const approvalChannel = supabase
      .channel('approval_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sa_approval_queue' }, () => {
        fetchApprovals();
      })
      .subscribe();

    const alertChannel = supabase
      .channel('alert_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'system_alerts' }, () => {
        fetchAlerts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(activityChannel);
      supabase.removeChannel(approvalChannel);
      supabase.removeChannel(alertChannel);
    };
  }, [user, fetchSuperAdmins, fetchActivities, fetchApprovals, fetchTasks, fetchAlerts, fetchInsights]);

  return {
    superAdmins,
    activities,
    approvals,
    tasks,
    alerts,
    insights,
    isLoading,
    approveRequest,
    rejectRequest,
    createTask,
    acknowledgeAlert,
    acknowledgeInsight,
    refetch: {
      superAdmins: fetchSuperAdmins,
      activities: fetchActivities,
      approvals: fetchApprovals,
      tasks: fetchTasks,
      alerts: fetchAlerts,
      insights: fetchInsights
    }
  };
}
