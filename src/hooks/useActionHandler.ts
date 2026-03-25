import { useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ActionConfig {
  actionId: string;
  actionType: 'navigate' | 'create' | 'update' | 'delete' | 'fetch' | 'toggle';
  targetEntity: string;
  successMessage?: string;
  errorMessage?: string;
  requiresConfirmation?: boolean;
  metadata?: Record<string, any>;
}

export interface ActionResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Global Action Handler Hook
 * Ensures every button action is logged, provides feedback, and handles errors
 */
export function useActionHandler() {
  const { user, userRole } = useAuth();

  const logAction = useCallback(async (
    action: string, 
    target: string, 
    meta?: Record<string, any>
  ) => {
    try {
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        role: userRole as any,
        module: 'global_action',
        action,
        meta_json: { 
          target, 
          timestamp: new Date().toISOString(),
          ...meta 
        }
      });
    } catch (error) {
      console.error('Audit log error:', error);
    }
  }, [user?.id, userRole]);

  const executeAction = useCallback(async (config: ActionConfig): Promise<ActionResult> => {
    const startTime = Date.now();
    
    try {
      // Log the action start
      await logAction(`${config.actionId}_start`, config.targetEntity, {
        actionType: config.actionType,
        ...config.metadata
      });

      // Show loading state
      toast.loading(`Processing: ${config.targetEntity}...`, { id: config.actionId });

      // Simulate API call (replace with actual API logic)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Log success
      const duration = Date.now() - startTime;
      await logAction(`${config.actionId}_success`, config.targetEntity, {
        actionType: config.actionType,
        duration,
        ...config.metadata
      });

      // Show success toast
      toast.success(config.successMessage || `Action completed: ${config.targetEntity}`, {
        id: config.actionId,
        description: `${config.actionType} completed in ${duration}ms`
      });

      return { success: true };
    } catch (error) {
      // Log failure
      await logAction(`${config.actionId}_error`, config.targetEntity, {
        actionType: config.actionType,
        error: error instanceof Error ? error.message : 'Unknown error',
        ...config.metadata
      });

      // Show error toast
      toast.error(config.errorMessage || `Action failed: ${config.targetEntity}`, {
        id: config.actionId,
        description: error instanceof Error ? error.message : 'Please try again'
      });

      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }, [logAction]);

  // Quick action helpers
  const navigate = useCallback((target: string, metadata?: Record<string, any>) => {
    return executeAction({
      actionId: `nav_${target}`,
      actionType: 'navigate',
      targetEntity: target,
      successMessage: `Navigated to ${target}`,
      metadata
    });
  }, [executeAction]);

  const create = useCallback((entity: string, metadata?: Record<string, any>) => {
    return executeAction({
      actionId: `create_${entity}`,
      actionType: 'create',
      targetEntity: entity,
      successMessage: `Created: ${entity}`,
      metadata
    });
  }, [executeAction]);

  const update = useCallback((entity: string, metadata?: Record<string, any>) => {
    return executeAction({
      actionId: `update_${entity}`,
      actionType: 'update',
      targetEntity: entity,
      successMessage: `Updated: ${entity}`,
      metadata
    });
  }, [executeAction]);

  const remove = useCallback((entity: string, metadata?: Record<string, any>) => {
    return executeAction({
      actionId: `delete_${entity}`,
      actionType: 'delete',
      targetEntity: entity,
      successMessage: `Deleted: ${entity}`,
      requiresConfirmation: true,
      metadata
    });
  }, [executeAction]);

  const toggle = useCallback((entity: string, currentState: boolean, metadata?: Record<string, any>) => {
    return executeAction({
      actionId: `toggle_${entity}`,
      actionType: 'toggle',
      targetEntity: entity,
      successMessage: `${entity} ${currentState ? 'disabled' : 'enabled'}`,
      metadata: { previousState: currentState, newState: !currentState, ...metadata }
    });
  }, [executeAction]);

  const fetch = useCallback((entity: string, metadata?: Record<string, any>) => {
    return executeAction({
      actionId: `fetch_${entity}`,
      actionType: 'fetch',
      targetEntity: entity,
      successMessage: `Data loaded: ${entity}`,
      metadata
    });
  }, [executeAction]);

  return {
    executeAction,
    logAction,
    navigate,
    create,
    update,
    remove,
    toggle,
    fetch
  };
}
