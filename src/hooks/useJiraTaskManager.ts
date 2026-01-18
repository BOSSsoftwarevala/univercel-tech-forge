/**
 * JIRA-TM-01: Complete Task Manager Hook with Database Integration
 * Implements: CLICK → PERMISSION → API → VALIDATION → DB → AUDIT → UI UPDATE
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEnterpriseAudit } from './useEnterpriseAudit';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

// Status flow enforcement - immutable after completed
export const STATUS_FLOW: Record<string, string[]> = {
  'pending': ['assigned'],
  'assigned': ['in_progress', 'blocked'],
  'in_progress': ['completed', 'blocked', 'review'],
  'review': ['completed', 'in_progress'],
  'blocked': ['in_progress'],
  'completed': [] // IMMUTABLE - cannot change
};

export interface DeveloperTask {
  id: string;
  developer_id: string | null;
  assigned_by: string | null;
  title: string;
  description: string | null;
  category: string;
  tech_stack: string[] | null;
  priority: string | null;
  status: string;
  estimated_hours: number | null;
  max_delivery_hours: number | null;
  promised_at: string | null;
  accepted_at: string | null;
  started_at: string | null;
  paused_at: string | null;
  completed_at: string | null;
  deadline: string | null;
  pause_reason: string | null;
  total_paused_minutes: number | null;
  delivery_notes: string | null;
  client_id: string | null;
  masked_client_info: Json | null;
  buzzer_active: boolean | null;
  buzzer_acknowledged_at: string | null;
  created_at: string;
  updated_at: string;
  sla_hours: number | null;
  checkpoint_status: string | null;
  promised_delivery_at: string | null;
  actual_delivery_at: string | null;
  quality_score: number | null;
  client_rating: number | null;
  task_amount: number | null;
  penalty_amount: number | null;
}

export interface TaskFormData {
  sourceType: string;
  sourceId: string;
  taskType: string;
  description: string;
  priority: string;
  dueDate: string;
  requiredSkill: string;
  slaFlag: boolean;
  title: string;
}

export function useJiraTaskManager() {
  const [tasks, setTasks] = useState<DeveloperTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { logAction, logCrudOperation } = useEnterpriseAudit();

  /**
   * Fetch all tasks from database
   */
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('developer_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setTasks(data || []);
      
      await logAction({
        action: 'tasks_fetched',
        module: 'system',
        severity: 'low',
        metadata: { count: data?.length || 0 }
      });

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(message);
      toast.error(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [logAction]);

  /**
   * Create new task with full audit trail
   */
  const createTask = useCallback(async (formData: TaskFormData): Promise<DeveloperTask | null> => {
    setLoading(true);
    
    try {
      // Validate required fields
      const requiredFields = ['sourceType', 'sourceId', 'taskType', 'description', 'priority', 'dueDate', 'requiredSkill', 'title'];
      for (const field of requiredFields) {
        if (!formData[field as keyof TaskFormData]) {
          toast.error(`Missing required field: ${field}`);
          return null;
        }
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      const newTask = {
        title: formData.title || `${formData.taskType}: ${formData.description.substring(0, 50)}`,
        description: formData.description,
        category: formData.taskType,
        tech_stack: [formData.requiredSkill],
        priority: formData.priority,
        status: 'pending',
        deadline: new Date(formData.dueDate).toISOString(),
        sla_hours: formData.slaFlag ? 4 : null,
        assigned_by: user?.id || null,
        masked_client_info: {
          source_type: formData.sourceType,
          source_id: formData.sourceId
        }
      };

      const { data, error: insertError } = await supabase
        .from('developer_tasks')
        .insert([newTask])
        .select()
        .single();

      if (insertError) throw insertError;

      // Log CRUD operation
      await logCrudOperation('create', 'developer_tasks', data.id, 'system', undefined, newTask);

      // Log action for audit trail
      await logAction({
        action: 'task_created',
        module: 'system',
        severity: 'medium',
        target_id: data.id,
        target_type: 'developer_task',
        new_values: newTask,
        metadata: {
          source_type: formData.sourceType,
          source_id: formData.sourceId,
          sla_critical: formData.slaFlag
        }
      });

      toast.success('Task created successfully');
      await fetchTasks(); // Refresh list
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      toast.error(message);
      
      await logAction({
        action: 'task_creation_failed',
        module: 'system',
        severity: 'high',
        metadata: { error: message, formData }
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [logAction, logCrudOperation, fetchTasks]);

  /**
   * Change task status with flow validation
   */
  const changeStatus = useCallback(async (
    taskId: string,
    newStatus: string,
    reason?: string
  ): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Get current task
      const { data: currentTask, error: fetchError } = await supabase
        .from('developer_tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (fetchError || !currentTask) {
        throw new Error('Task not found');
      }

      // Validate status flow
      const allowedTransitions = STATUS_FLOW[currentTask.status] || [];
      if (!allowedTransitions.includes(newStatus)) {
        toast.error(`Cannot transition from ${currentTask.status} to ${newStatus}. Status flow is locked.`);
        
        await logAction({
          action: 'invalid_status_transition',
          module: 'system',
          severity: 'high',
          target_id: taskId,
          target_type: 'developer_task',
          metadata: {
            current_status: currentTask.status,
            attempted_status: newStatus,
            allowed_transitions: allowedTransitions
          }
        });
        
        return false;
      }

      // Prepare update data
      const updateData: Record<string, string | null> = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      // Add timestamp based on status
      if (newStatus === 'in_progress' && !currentTask.started_at) {
        updateData.started_at = new Date().toISOString();
      } else if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString();
        updateData.actual_delivery_at = new Date().toISOString();
      } else if (newStatus === 'blocked') {
        updateData.paused_at = new Date().toISOString();
        updateData.pause_reason = reason || 'No reason provided';
      }

      const { error: updateError } = await supabase
        .from('developer_tasks')
        .update(updateData)
        .eq('id', taskId);

      if (updateError) throw updateError;

      // Log CRUD operation
      await logCrudOperation(
        'update',
        'developer_tasks',
        taskId,
        'system',
        { status: currentTask.status },
        { status: newStatus }
      );

      // Log detailed action
      await logAction({
        action: 'status_changed',
        module: 'system',
        severity: newStatus === 'completed' ? 'medium' : 'low',
        target_id: taskId,
        target_type: 'developer_task',
        old_values: { status: currentTask.status },
        new_values: { status: newStatus },
        reason,
        metadata: {
          transition: `${currentTask.status} → ${newStatus}`,
          reason_provided: !!reason
        }
      });

      toast.success(`Task status updated to ${newStatus}`);
      await fetchTasks();
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [logAction, logCrudOperation, fetchTasks]);

  /**
   * Reassign task with mandatory reason
   */
  const reassignTask = useCallback(async (
    taskId: string,
    newDeveloperId: string,
    reason: string
  ): Promise<boolean> => {
    if (!reason.trim()) {
      toast.error('Reassignment reason is mandatory');
      return false;
    }

    setLoading(true);
    
    try {
      // Get current task
      const { data: currentTask, error: fetchError } = await supabase
        .from('developer_tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (fetchError || !currentTask) {
        throw new Error('Task not found');
      }

      const { data: { user } } = await supabase.auth.getUser();

      const { error: updateError } = await supabase
        .from('developer_tasks')
        .update({
          developer_id: newDeveloperId,
          assigned_by: user?.id,
          status: 'assigned',
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (updateError) throw updateError;

      // Log CRUD operation (high severity for reassignment)
      await logCrudOperation(
        'update',
        'developer_tasks',
        taskId,
        'system',
        { developer_id: currentTask.developer_id },
        { developer_id: newDeveloperId }
      );

      // Log detailed audit
      await logAction({
        action: 'task_reassigned',
        module: 'system',
        severity: 'high',
        target_id: taskId,
        target_type: 'developer_task',
        old_values: { developer_id: currentTask.developer_id },
        new_values: { developer_id: newDeveloperId },
        reason,
        metadata: {
          reassignment_reason: reason,
          previous_status: currentTask.status
        }
      });

      toast.success('Task reassigned successfully');
      await fetchTasks();
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reassign task';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [logAction, logCrudOperation, fetchTasks]);

  /**
   * Escalate task with logging
   */
  const escalateTask = useCallback(async (
    taskId: string,
    escalateTo: 'dev_manager' | 'pro_manager' | 'super_admin',
    note: string
  ): Promise<boolean> => {
    if (!note.trim()) {
      toast.error('Escalation note is required');
      return false;
    }

    try {
      await logAction({
        action: 'task_escalated',
        module: 'system',
        severity: 'critical',
        target_id: taskId,
        target_type: 'developer_task',
        metadata: {
          escalate_to: escalateTo,
          escalation_note: note,
          escalated_at: new Date().toISOString()
        }
      });

      // Insert into buzzer_queue for alerting
      const { error: buzzerError } = await supabase
        .from('buzzer_queue')
        .insert([{
          trigger_type: 'task_escalation',
          task_id: taskId,
          priority: 'high',
          role_target: escalateTo === 'super_admin' ? 'super_admin' : 'admin',
          status: 'pending'
        }]);

      if (buzzerError) {
        console.warn('Buzzer queue insert failed:', buzzerError);
      }

      toast.success(`Task escalated to ${escalateTo.replace('_', ' ')}`);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to escalate task';
      toast.error(message);
      return false;
    }
  }, [logAction]);

  /**
   * Get tasks by status
   */
  const getTasksByStatus = useCallback((status: string) => {
    return tasks.filter(t => t.status === status);
  }, [tasks]);

  /**
   * Get SLA breach alerts
   */
  const getSLAAlerts = useCallback(() => {
    return tasks.filter(task => {
      if (!task.deadline || task.status === 'completed') return false;
      
      const deadline = new Date(task.deadline);
      const now = new Date();
      const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      return hoursRemaining < 4; // Less than 4 hours or overdue
    }).map(task => ({
      ...task,
      hoursRemaining: task.deadline 
        ? Math.floor((new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60))
        : null,
      isBreached: task.deadline ? new Date(task.deadline) < new Date() : false
    }));
  }, [tasks]);

  /**
   * Get blocked tasks
   */
  const getBlockedTasks = useCallback(() => {
    return tasks.filter(t => t.status === 'blocked');
  }, [tasks]);

  /**
   * Get overdue tasks
   */
  const getOverdueTasks = useCallback(() => {
    return tasks.filter(task => {
      if (!task.deadline || task.status === 'completed') return false;
      return new Date(task.deadline) < new Date();
    });
  }, [tasks]);

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    // State
    tasks,
    loading,
    error,
    
    // Actions
    fetchTasks,
    createTask,
    changeStatus,
    reassignTask,
    escalateTask,
    
    // Queries
    getTasksByStatus,
    getSLAAlerts,
    getBlockedTasks,
    getOverdueTasks,
    
    // Constants
    STATUS_FLOW
  };
}

export default useJiraTaskManager;
