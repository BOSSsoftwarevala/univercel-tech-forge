/**
 * STEP 4: Button Execution Tracking Hook
 * Every button click creates an execution record
 * Flow: CLICK → UI EVENT → ROUTE → CONTROLLER → SERVICE → DB → AUDIT → RESPONSE → UI UPDATE
 */

import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useEnterpriseAudit } from './useEnterpriseAudit';

export type ExecutionStatus = 'started' | 'success' | 'failed' | 'cancelled';

interface ExecutionContext {
  buttonId: string;
  moduleName: string;
  actionType: string;
  metadata?: Record<string, unknown>;
}

interface ExecutionResult {
  executionId: string;
  complete: (status: ExecutionStatus, error?: string) => Promise<void>;
  cancel: () => Promise<void>;
  startTime: number;
}

export function useButtonExecution() {
  const { user, userRole } = useAuth();
  const { logAction } = useEnterpriseAudit();
  const [activeExecutions, setActiveExecutions] = useState<Map<string, string>>(new Map());

  /**
   * Start button execution tracking
   */
  const startExecution = useCallback(async (context: ExecutionContext): Promise<ExecutionResult> => {
    const startTime = performance.now();
    const executionId = `exec_${context.buttonId}_${Date.now()}`;

    // Insert execution record
    const { error } = await supabase.from('button_executions').insert({
      id: executionId.replace('exec_', '').slice(0, 36).padEnd(36, '0').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5'),
      button_id: context.buttonId,
      user_id: user?.id || null,
      role_id: userRole || null,
      status: 'started',
      metadata: context.metadata || {},
      user_agent: navigator.userAgent,
    } as any);

    if (error) {
      console.error('[ButtonExecution] Failed to start tracking:', error);
    }

    // Track active execution
    setActiveExecutions(prev => new Map(prev).set(context.buttonId, executionId));

    // Log to audit
    await logAction({
      action: `button_execution_start:${context.buttonId}`,
      module: context.moduleName as any,
      severity: 'low',
      metadata: {
        execution_id: executionId,
        action_type: context.actionType,
        ...context.metadata,
      }
    });

    const complete = async (status: ExecutionStatus, errorMessage?: string) => {
      const latencyMs = Math.round(performance.now() - startTime);
      
      // Update execution record
      await supabase.from('button_executions').update({
        status,
        latency_ms: latencyMs,
        error_message: errorMessage || null,
        completed_at: new Date().toISOString(),
      } as any).eq('button_id', context.buttonId);

      // Log completion to audit
      await logAction({
        action: `button_execution_${status}:${context.buttonId}`,
        module: context.moduleName as any,
        severity: status === 'failed' ? 'medium' : 'low',
        metadata: {
          execution_id: executionId,
          latency_ms: latencyMs,
          error: errorMessage,
        }
      });

      // Remove from active executions
      setActiveExecutions(prev => {
        const next = new Map(prev);
        next.delete(context.buttonId);
        return next;
      });
    };

    const cancel = async () => {
      await complete('cancelled');
    };

    return {
      executionId,
      complete,
      cancel,
      startTime,
    };
  }, [user?.id, userRole, logAction]);

  /**
   * Check if button is currently executing
   */
  const isExecuting = useCallback((buttonId: string): boolean => {
    return activeExecutions.has(buttonId);
  }, [activeExecutions]);

  /**
   * Wrap an async action with execution tracking
   */
  const withExecution = useCallback(<T,>(
    context: ExecutionContext,
    action: () => Promise<T>
  ): () => Promise<T> => {
    return async () => {
      const execution = await startExecution(context);
      
      try {
        const result = await action();
        await execution.complete('success');
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        await execution.complete('failed', errorMessage);
        throw error;
      }
    };
  }, [startExecution]);

  return {
    startExecution,
    isExecuting,
    withExecution,
    activeExecutions: activeExecutions.size,
  };
}
