/**
 * KPI Action Handler Hook
 * Handles all KPI box button actions with proper feedback
 */

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useEnterpriseAudit } from './useEnterpriseAudit';

export type KPIAction = 
  | 'approve' 
  | 'reject' 
  | 'review' 
  | 'pause' 
  | 'resume' 
  | 'stop' 
  | 'restart'
  | 'escalate'
  | 'resolve'
  | 'acknowledge'
  | 'investigate'
  | 'block'
  | 'deploy'
  | 'rollback'
  | 'retry'
  | 'cancel'
  | 'renew'
  | 'notify'
  | 'limit'
  | 'optimize'
  | 'assign'
  | 'close'
  | 'mitigate'
  | 'report'
  | 'hold'
  | 'scale'
  | 'refresh';

interface ActionState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

interface KPIActionResult {
  success: boolean;
  message: string;
  data?: any;
}

export function useKPIActions() {
  const { user } = useAuth();
  const { logAction } = useEnterpriseAudit();
  const [actionStates, setActionStates] = useState<Record<string, ActionState>>({});

  /**
   * Set action state for a specific action key
   */
  const setActionState = useCallback((key: string, state: Partial<ActionState>) => {
    setActionStates(prev => ({
      ...prev,
      [key]: { ...prev[key], ...state }
    }));
  }, []);

  /**
   * Execute a KPI action with full audit trail
   */
  const executeAction = useCallback(async (
    action: KPIAction,
    kpiId: string,
    kpiLabel: string,
    options?: {
      reason?: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<KPIActionResult> => {
    const actionKey = `${kpiId}_${action}`;
    
    // Set loading state
    setActionState(actionKey, { loading: true, success: false, error: null });

    try {
      // Log the action to audit
      await logAction({
        action: `kpi_action:${action}`,
        module: 'system',
        severity: getActionSeverity(action),
        target_id: kpiId,
        target_type: 'kpi',
        reason: options?.reason,
        metadata: {
          kpi_label: kpiLabel,
          ...options?.metadata,
        },
      });

      // Simulate action execution (in production, this would call actual APIs)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Success feedback based on action type
      const feedback = getActionFeedback(action, kpiLabel);
      toast[feedback.type](feedback.title, { description: feedback.description });

      // Update state
      setActionState(actionKey, { loading: false, success: true, error: null });

      return {
        success: true,
        message: feedback.title,
      };
    } catch (error: any) {
      const errorMsg = error.message || 'Action failed';
      
      setActionState(actionKey, { loading: false, success: false, error: errorMsg });
      toast.error(`Failed: ${action}`, { description: errorMsg });

      return {
        success: false,
        message: errorMsg,
      };
    }
  }, [logAction, setActionState]);

  /**
   * Get loading state for an action
   */
  const isActionLoading = useCallback((kpiId: string, action: KPIAction) => {
    return actionStates[`${kpiId}_${action}`]?.loading ?? false;
  }, [actionStates]);

  /**
   * Batch action handlers for common operations
   */
  const approveKPI = useCallback((kpiId: string, label: string) => 
    executeAction('approve', kpiId, label), [executeAction]);

  const rejectKPI = useCallback((kpiId: string, label: string, reason: string) => 
    executeAction('reject', kpiId, label, { reason }), [executeAction]);

  const pauseKPI = useCallback((kpiId: string, label: string) => 
    executeAction('pause', kpiId, label), [executeAction]);

  const resumeKPI = useCallback((kpiId: string, label: string) => 
    executeAction('resume', kpiId, label), [executeAction]);

  const reviewKPI = useCallback((kpiId: string, label: string) => 
    executeAction('review', kpiId, label), [executeAction]);

  const escalateKPI = useCallback((kpiId: string, label: string, reason: string) => 
    executeAction('escalate', kpiId, label, { reason }), [executeAction]);

  return {
    executeAction,
    isActionLoading,
    actionStates,
    // Convenience methods
    approveKPI,
    rejectKPI,
    pauseKPI,
    resumeKPI,
    reviewKPI,
    escalateKPI,
  };
}

/**
 * Get severity level for an action
 */
function getActionSeverity(action: KPIAction): 'low' | 'medium' | 'high' | 'critical' {
  const severityMap: Record<KPIAction, 'low' | 'medium' | 'high' | 'critical'> = {
    approve: 'medium',
    reject: 'high',
    review: 'low',
    pause: 'medium',
    resume: 'low',
    stop: 'high',
    restart: 'medium',
    escalate: 'high',
    resolve: 'medium',
    acknowledge: 'low',
    investigate: 'medium',
    block: 'critical',
    deploy: 'high',
    rollback: 'critical',
    retry: 'low',
    cancel: 'medium',
    renew: 'medium',
    notify: 'low',
    limit: 'medium',
    optimize: 'low',
    assign: 'low',
    close: 'low',
    mitigate: 'high',
    report: 'medium',
    hold: 'medium',
    scale: 'medium',
    refresh: 'low',
  };
  return severityMap[action] || 'low';
}

/**
 * Get feedback message for an action
 */
function getActionFeedback(action: KPIAction, label: string): {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description: string;
} {
  const feedbackMap: Record<KPIAction, { type: 'success' | 'warning' | 'error' | 'info'; title: string; desc: string }> = {
    approve: { type: 'success', title: `✓ Approved: ${label}`, desc: 'Action logged to audit' },
    reject: { type: 'error', title: `✕ Rejected: ${label}`, desc: 'Reason recorded' },
    review: { type: 'info', title: `👁 Reviewing: ${label}`, desc: 'Details opened' },
    pause: { type: 'warning', title: `⏸ Paused: ${label}`, desc: 'State preserved' },
    resume: { type: 'success', title: `▶ Resumed: ${label}`, desc: 'Operations restored' },
    stop: { type: 'error', title: `⏹ Stopped: ${label}`, desc: 'Safe-state triggered' },
    restart: { type: 'success', title: `🔁 Restarting: ${label}`, desc: 'Dependency check passed' },
    escalate: { type: 'warning', title: `⬆ Escalated: ${label}`, desc: 'Sent to higher authority' },
    resolve: { type: 'success', title: `✓ Resolved: ${label}`, desc: 'Issue closed' },
    acknowledge: { type: 'info', title: `👁 Acknowledged: ${label}`, desc: 'Alert noted' },
    investigate: { type: 'info', title: `🔍 Investigating: ${label}`, desc: 'Analysis started' },
    block: { type: 'error', title: `🚫 Blocked: ${label}`, desc: 'Access restricted' },
    deploy: { type: 'success', title: `🚀 Deployed: ${label}`, desc: 'Release pushed' },
    rollback: { type: 'warning', title: `↩ Rolled Back: ${label}`, desc: 'Previous version restored' },
    retry: { type: 'info', title: `🔄 Retrying: ${label}`, desc: 'Attempt restarted' },
    cancel: { type: 'warning', title: `✕ Cancelled: ${label}`, desc: 'Operation aborted' },
    renew: { type: 'success', title: `🔄 Renewed: ${label}`, desc: 'Subscription updated' },
    notify: { type: 'info', title: `📧 Notified: ${label}`, desc: 'Alert sent' },
    limit: { type: 'warning', title: `⚠ Limited: ${label}`, desc: 'Threshold applied' },
    optimize: { type: 'success', title: `⚡ Optimizing: ${label}`, desc: 'Improvements applied' },
    assign: { type: 'info', title: `👤 Assigned: ${label}`, desc: 'Task allocated' },
    close: { type: 'success', title: `✓ Closed: ${label}`, desc: 'Item completed' },
    mitigate: { type: 'warning', title: `🛡 Mitigating: ${label}`, desc: 'Risk reduced' },
    report: { type: 'info', title: `📊 Reported: ${label}`, desc: 'Report generated' },
    hold: { type: 'warning', title: `⏸ On Hold: ${label}`, desc: 'Pending review' },
    scale: { type: 'success', title: `📈 Scaling: ${label}`, desc: 'Resources adjusted' },
    refresh: { type: 'info', title: `🔄 Refreshed: ${label}`, desc: 'Data updated' },
  };

  const feedback = feedbackMap[action] || { type: 'info', title: action, desc: '' };
  return {
    type: feedback.type,
    title: feedback.title,
    description: feedback.desc,
  };
}
