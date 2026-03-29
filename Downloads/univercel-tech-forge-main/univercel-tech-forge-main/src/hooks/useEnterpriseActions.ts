/**
 * Enterprise Action Handler System
 * Centralized CRUD and action management for all manager modules
 * Provides: API connection, audit logging, toast feedback, loading states
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ActionType = 
  | 'create' | 'read' | 'update' | 'delete' 
  | 'enable' | 'disable' | 'suspend' | 'activate'
  | 'approve' | 'reject' | 'escalate' | 'assign'
  | 'export' | 'import' | 'refresh' | 'sync';

export type ModuleType = 
  | 'product' | 'lead' | 'franchise' | 'reseller' 
  | 'marketing' | 'server' | 'support' | 'sales'
  | 'finance' | 'legal' | 'hr' | 'developer';

export interface ActionConfig {
  module: ModuleType;
  action: ActionType;
  target: string;
  targetId?: string;
  data?: Record<string, unknown>;
  requiresConfirmation?: boolean;
  confirmMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface ActionState {
  isLoading: boolean;
  isConfirming: boolean;
  lastAction?: ActionConfig;
  lastResult?: ActionResult;
}

/**
 * Log action to audit_logs table
 */
async function logAuditAction(config: ActionConfig, result: ActionResult) {
  try {
    const { data: session } = await supabase.auth.getSession();
    await supabase.from('audit_logs').insert([{
      action: `${config.action}_${config.target}`,
      module: config.module,
      user_id: session?.session?.user?.id || null,
      meta_json: JSON.parse(JSON.stringify({
        target_id: config.targetId || null,
        action_type: config.action,
        success: result.success,
        data: config.data || null,
        error: result.error || null
      }))
    }]);
  } catch (err) {
    console.error('Audit log failed:', err);
  }
}

/**
 * Enterprise Action Hook
 * Provides standardized action handling with loading states, audit logging, and feedback
 */
export function useEnterpriseActions() {
  const [state, setState] = useState<ActionState>({
    isLoading: false,
    isConfirming: false
  });

  const execute = useCallback(async <T = unknown>(
    config: ActionConfig,
    handler?: () => Promise<T>
  ): Promise<ActionResult<T>> => {
    const timestamp = new Date().toISOString();
    
    setState(prev => ({ ...prev, isLoading: true, lastAction: config }));

    try {
      let data: T | undefined;
      
      if (handler) {
        data = await handler();
      }

      const result: ActionResult<T> = {
        success: true,
        data,
        timestamp
      };

      // Log to audit
      await logAuditAction(config, result);

      // Show success toast
      toast.success(config.successMessage || `${config.action} completed successfully`, {
        description: `Target: ${config.target}${config.targetId ? ` (${config.targetId})` : ''}`
      });

      setState(prev => ({ ...prev, isLoading: false, lastResult: result }));
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      const result: ActionResult<T> = {
        success: false,
        error: errorMessage,
        timestamp
      };

      await logAuditAction(config, result);

      toast.error(config.errorMessage || `${config.action} failed`, {
        description: errorMessage
      });

      setState(prev => ({ ...prev, isLoading: false, lastResult: result }));
      return result;
    }
  }, []);

  // Pre-configured action helpers
  const actions = {
    // CRUD Operations
    create: useCallback((module: ModuleType, target: string, data?: Record<string, unknown>) =>
      execute({ module, action: 'create', target, data, successMessage: `${target} created` }), [execute]),
    
    read: useCallback((module: ModuleType, target: string, targetId?: string) =>
      execute({ module, action: 'read', target, targetId }), [execute]),
    
    update: useCallback((module: ModuleType, target: string, targetId: string, data?: Record<string, unknown>) =>
      execute({ module, action: 'update', target, targetId, data, successMessage: `${target} updated` }), [execute]),
    
    delete: useCallback((module: ModuleType, target: string, targetId: string) =>
      execute({ 
        module, action: 'delete', target, targetId, 
        requiresConfirmation: true,
        confirmMessage: `Are you sure you want to delete ${target}?`,
        successMessage: `${target} deleted` 
      }), [execute]),

    // Status Operations
    enable: useCallback((module: ModuleType, target: string, targetId: string) =>
      execute({ module, action: 'enable', target, targetId, successMessage: `${target} enabled` }), [execute]),
    
    disable: useCallback((module: ModuleType, target: string, targetId: string) =>
      execute({ module, action: 'disable', target, targetId, successMessage: `${target} disabled` }), [execute]),
    
    suspend: useCallback((module: ModuleType, target: string, targetId: string) =>
      execute({ 
        module, action: 'suspend', target, targetId,
        requiresConfirmation: true,
        successMessage: `${target} suspended` 
      }), [execute]),
    
    activate: useCallback((module: ModuleType, target: string, targetId: string) =>
      execute({ module, action: 'activate', target, targetId, successMessage: `${target} activated` }), [execute]),

    // Workflow Operations
    approve: useCallback((module: ModuleType, target: string, targetId: string) =>
      execute({ module, action: 'approve', target, targetId, successMessage: `${target} approved` }), [execute]),
    
    reject: useCallback((module: ModuleType, target: string, targetId: string, reason?: string) =>
      execute({ module, action: 'reject', target, targetId, data: { reason }, successMessage: `${target} rejected` }), [execute]),
    
    escalate: useCallback((module: ModuleType, target: string, targetId: string, level?: string) =>
      execute({ module, action: 'escalate', target, targetId, data: { level }, successMessage: `${target} escalated` }), [execute]),
    
    assign: useCallback((module: ModuleType, target: string, targetId: string, assigneeId: string) =>
      execute({ module, action: 'assign', target, targetId, data: { assigneeId }, successMessage: `${target} assigned` }), [execute]),

    // Data Operations
    export: useCallback((module: ModuleType, target: string, format?: string) =>
      execute({ module, action: 'export', target, data: { format }, successMessage: `${target} export started` }), [execute]),
    
    import: useCallback((module: ModuleType, target: string, data?: Record<string, unknown>) =>
      execute({ module, action: 'import', target, data, successMessage: `${target} import completed` }), [execute]),
    
    refresh: useCallback((module: ModuleType, target: string) =>
      execute({ module, action: 'refresh', target, successMessage: `${target} refreshed` }), [execute]),
    
    sync: useCallback((module: ModuleType, target: string) =>
      execute({ module, action: 'sync', target, successMessage: `${target} synced` }), [execute]),
  };

  return {
    ...state,
    execute,
    actions
  };
}

/**
 * Module-specific action creators
 */
export const createModuleActions = (module: ModuleType) => {
  return {
    create: (target: string, data?: Record<string, unknown>): ActionConfig => ({
      module, action: 'create', target, data
    }),
    update: (target: string, targetId: string, data?: Record<string, unknown>): ActionConfig => ({
      module, action: 'update', target, targetId, data
    }),
    delete: (target: string, targetId: string): ActionConfig => ({
      module, action: 'delete', target, targetId, requiresConfirmation: true
    }),
    enable: (target: string, targetId: string): ActionConfig => ({
      module, action: 'enable', target, targetId
    }),
    disable: (target: string, targetId: string): ActionConfig => ({
      module, action: 'disable', target, targetId
    }),
    suspend: (target: string, targetId: string): ActionConfig => ({
      module, action: 'suspend', target, targetId, requiresConfirmation: true
    }),
    approve: (target: string, targetId: string): ActionConfig => ({
      module, action: 'approve', target, targetId
    }),
    reject: (target: string, targetId: string, reason?: string): ActionConfig => ({
      module, action: 'reject', target, targetId, data: { reason }
    }),
    escalate: (target: string, targetId: string, level?: string): ActionConfig => ({
      module, action: 'escalate', target, targetId, data: { level }
    }),
    assign: (target: string, targetId: string, assigneeId: string): ActionConfig => ({
      module, action: 'assign', target, targetId, data: { assigneeId }
    }),
    refresh: (target: string): ActionConfig => ({
      module, action: 'refresh', target
    }),
    export: (target: string, format?: string): ActionConfig => ({
      module, action: 'export', target, data: { format }
    }),
  };
};

// Pre-built module actions
export const productActions = createModuleActions('product');
export const leadActions = createModuleActions('lead');
export const franchiseActions = createModuleActions('franchise');
export const resellerActions = createModuleActions('reseller');
export const marketingActions = createModuleActions('marketing');
export const serverActions = createModuleActions('server');
export const supportActions = createModuleActions('support');
export const salesActions = createModuleActions('sales');
export const financeActions = createModuleActions('finance');
export const legalActions = createModuleActions('legal');
export const hrActions = createModuleActions('hr');
export const developerActions = createModuleActions('developer');
