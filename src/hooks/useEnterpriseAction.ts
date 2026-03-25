import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// JIRA-BTN-03: Button States
export type ActionState = 'idle' | 'loading' | 'success' | 'error' | 'retry';

// JIRA-BTN-02: Button Types
export type ActionType = 
  | 'view' | 'create' | 'edit' 
  | 'approve' | 'reject' 
  | 'suspend' | 'resume' 
  | 'delete' | 'escalate' 
  | 'export' | 'assign' 
  | 'ai-review';

// JIRA-ERD-03: Audit fields
export interface AuditEntry {
  action: string;
  module: string;
  user_id?: string;
  role?: string;
  meta_json?: Record<string, unknown>;
  timestamp: string;
}

export interface ActionConfig {
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  retryable?: boolean;
  maxRetries?: number;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

const defaultConfig: ActionConfig = {
  requiresConfirmation: false,
  successMessage: 'Action completed successfully',
  errorMessage: 'Action failed. Please try again.',
  retryable: true,
  maxRetries: 3,
};

// Actions that require confirmation (JIRA-BTN-02)
const destructiveActions: ActionType[] = ['delete', 'suspend', 'reject', 'escalate'];

export function useEnterpriseAction() {
  const [state, setState] = useState<ActionState>('idle');
  const [retryCount, setRetryCount] = useState(0);
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);

  // JIRA-SEC-02: Audit log immutable
  const logToAudit = useCallback(async (
    action: string,
    module: string,
    metadata?: Record<string, unknown>
  ) => {
    try {
      const metaJson = metadata ? JSON.parse(JSON.stringify(metadata)) : {};
      const { error } = await supabase.from('audit_logs').insert([{
        action,
        module,
        meta_json: metaJson,
        timestamp: new Date().toISOString(),
      }]);
      if (error) console.error('Audit log failed:', error);
    } catch (e) {
      console.error('Audit log error:', e);
    }
  }, []);

  // JIRA-BTN-03: Execute with all states
  const executeAction = useCallback(async <T>(
    actionType: ActionType,
    actionFn: () => Promise<T>,
    config: ActionConfig = {}
  ): Promise<ActionResult<T>> => {
    const finalConfig = { ...defaultConfig, ...config };
    const needsConfirmation = finalConfig.requiresConfirmation || 
      destructiveActions.includes(actionType);

    // Handle confirmation for destructive actions
    if (needsConfirmation && !pendingAction) {
      setPendingAction(async () => {
        await executeAction(actionType, actionFn, { ...config, requiresConfirmation: false });
      });
      return { success: false, error: 'awaiting_confirmation' };
    }

    setState('loading');
    setRetryCount(0);

    try {
      const result = await actionFn();
      setState('success');
      toast.success(finalConfig.successMessage);
      
      // Log successful action
      await logToAudit(`${actionType}_success`, 'enterprise_action', { 
        actionType,
        timestamp: new Date().toISOString()
      });

      // Reset after success animation
      setTimeout(() => setState('idle'), 2000);
      
      return { success: true, data: result };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : finalConfig.errorMessage;
      setState('error');
      toast.error(errorMsg);

      // Log failed action
      await logToAudit(`${actionType}_error`, 'enterprise_action', { 
        actionType,
        error: errorMsg,
        timestamp: new Date().toISOString()
      });

      // JIRA-BTN-03: Retry logic
      if (finalConfig.retryable && retryCount < (finalConfig.maxRetries || 3)) {
        setState('retry');
      }

      return { success: false, error: errorMsg };
    }
  }, [logToAudit, pendingAction, retryCount]);

  // Retry handler
  const retry = useCallback(async () => {
    if (pendingAction) {
      setRetryCount(prev => prev + 1);
      await pendingAction();
    }
  }, [pendingAction]);

  // Confirm pending action
  const confirmAction = useCallback(async () => {
    if (pendingAction) {
      await pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  // Cancel pending action
  const cancelAction = useCallback(() => {
    setPendingAction(null);
    setState('idle');
  }, []);

  // JIRA-CRUD standard operations
  const create = useCallback(async <T>(
    entity: string,
    data: Record<string, unknown>,
    config?: ActionConfig
  ) => {
    return executeAction('create', async () => {
      const { data: result, error } = await supabase
        .from(entity as any)
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return result as T;
    }, { successMessage: `${entity} created successfully`, ...config });
  }, [executeAction]);

  const read = useCallback(async <T>(
    entity: string,
    id: string,
    config?: ActionConfig
  ) => {
    return executeAction('view', async () => {
      const { data: result, error } = await supabase
        .from(entity as any)
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return result as T;
    }, { successMessage: undefined, ...config });
  }, [executeAction]);

  const update = useCallback(async <T>(
    entity: string,
    id: string,
    data: Record<string, unknown>,
    config?: ActionConfig
  ) => {
    return executeAction('edit', async () => {
      const { data: result, error } = await supabase
        .from(entity as any)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result as T;
    }, { successMessage: `${entity} updated successfully`, ...config });
  }, [executeAction]);

  // JIRA-CRUD-04: Soft delete only
  const softDelete = useCallback(async (
    entity: string,
    id: string,
    config?: ActionConfig
  ) => {
    return executeAction('delete', async () => {
      const { error } = await supabase
        .from(entity as any)
        .update({ 
          is_active: false, 
          status: 'deleted',
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      if (error) throw error;
      return { id, deleted: true };
    }, { 
      requiresConfirmation: true,
      confirmationMessage: `Are you sure you want to delete this ${entity}?`,
      successMessage: `${entity} deleted successfully`,
      ...config 
    });
  }, [executeAction]);

  // JIRA-BTN-02: Standard actions
  const approve = useCallback(async (
    entity: string,
    id: string,
    config?: ActionConfig
  ) => {
    return executeAction('approve', async () => {
      const { error } = await supabase
        .from(entity as any)
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      if (error) throw error;
      return { id, approved: true };
    }, { successMessage: 'Approved successfully', ...config });
  }, [executeAction]);

  const reject = useCallback(async (
    entity: string,
    id: string,
    reason: string,
    config?: ActionConfig
  ) => {
    return executeAction('reject', async () => {
      const { error } = await supabase
        .from(entity as any)
        .update({ 
          status: 'rejected',
          rejection_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      if (error) throw error;
      return { id, rejected: true };
    }, { 
      requiresConfirmation: true,
      successMessage: 'Rejected',
      ...config 
    });
  }, [executeAction]);

  const suspend = useCallback(async (
    entity: string,
    id: string,
    reason: string,
    config?: ActionConfig
  ) => {
    return executeAction('suspend', async () => {
      const { error } = await supabase
        .from(entity as any)
        .update({ 
          status: 'suspended',
          suspension_reason: reason,
          suspended_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      if (error) throw error;
      return { id, suspended: true };
    }, { 
      requiresConfirmation: true,
      successMessage: 'Suspended',
      ...config 
    });
  }, [executeAction]);

  const resume = useCallback(async (
    entity: string,
    id: string,
    config?: ActionConfig
  ) => {
    return executeAction('resume', async () => {
      const { error } = await supabase
        .from(entity as any)
        .update({ 
          status: 'active',
          suspended_at: null,
          suspension_reason: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      if (error) throw error;
      return { id, resumed: true };
    }, { successMessage: 'Resumed successfully', ...config });
  }, [executeAction]);

  const escalate = useCallback(async (
    entity: string,
    id: string,
    level: number,
    notes: string,
    config?: ActionConfig
  ) => {
    return executeAction('escalate', async () => {
      const { error } = await supabase
        .from(entity as any)
        .update({ 
          escalation_level: level,
          escalation_notes: notes,
          escalated_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      if (error) throw error;
      return { id, escalated: true, level };
    }, { 
      requiresConfirmation: true,
      successMessage: `Escalated to level ${level}`,
      ...config 
    });
  }, [executeAction]);

  return {
    state,
    retryCount,
    hasPendingConfirmation: !!pendingAction,
    executeAction,
    retry,
    confirmAction,
    cancelAction,
    logToAudit,
    // CRUD operations
    create,
    read,
    update,
    softDelete,
    // Standard actions
    approve,
    reject,
    suspend,
    resume,
    escalate,
  };
}
