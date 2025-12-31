/**
 * Vertical Flow System Hook
 * 
 * Manages the vertical approval flow:
 * Role Action → Auto Debug → Auto Check → Auto Lock → Forward to Next Role
 * 
 * Rules:
 * - No backward access
 * - No edit after submit
 * - No delete history (append-only logs)
 * - All approvals move upward only
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

type FlowStage = 'pending' | 'debug' | 'check' | 'lock' | 'forward' | 'completed' | 'blocked';
type FlowStatus = 'Pending' | 'Locked' | 'Forwarded' | 'Blocked';

interface FlowAction {
  id: string;
  valaId: string;
  actionType: string;
  actionData: Record<string, unknown>;
  stage: FlowStage;
  status: FlowStatus;
  debugResult: { passed: boolean; issues: string[] } | null;
  checkResult: { passed: boolean; risks: string[] } | null;
  lockHash: string | null;
  forwardedTo: string | null;
  createdAt: number;
  lockedAt: number | null;
  forwardedAt: number | null;
}

interface FlowProgress {
  currentStage: FlowStage;
  completedStages: FlowStage[];
  progress: number; // 0-100
}

// Role hierarchy for upward-only forwarding
const ROLE_HIERARCHY: Record<string, string> = {
  'operation': 'area_control',
  'front': 'area_control',
  'area_control': 'regional_control',
  'regional_control': 'ai_head',
  'ai_head': 'master_admin',
  'master_admin': 'master_admin' // Terminal
};

export function useVerticalFlow(currentRole: string) {
  const { user } = useAuth();
  const [currentAction, setCurrentAction] = useState<FlowAction | null>(null);
  const [flowProgress, setFlowProgress] = useState<FlowProgress>({
    currentStage: 'pending',
    completedStages: [],
    progress: 0
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Create new action (entry point)
  const createAction = useCallback(async (
    valaId: string,
    actionType: string,
    actionData: Record<string, unknown>
  ): Promise<FlowAction> => {
    const action: FlowAction = {
      id: crypto.randomUUID(),
      valaId,
      actionType,
      actionData,
      stage: 'pending',
      status: 'Pending',
      debugResult: null,
      checkResult: null,
      lockHash: null,
      forwardedTo: null,
      createdAt: Date.now(),
      lockedAt: null,
      forwardedAt: null
    };

    setCurrentAction(action);
    setFlowProgress({
      currentStage: 'pending',
      completedStages: [],
      progress: 0
    });

    // Log action creation (append-only)
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      action: 'flow_action_created',
      module: 'vertical_flow',
      meta_json: {
        action_id: action.id,
        vala_id: valaId,
        action_type: actionType,
        role: currentRole
      }
    });

    return action;
  }, [user?.id, currentRole]);

  // Auto Debug Stage
  const executeDebug = useCallback(async (action: FlowAction): Promise<FlowAction> => {
    setIsProcessing(true);
    
    // Simulate debug process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const issues: string[] = [];
    
    // Validate action data structure
    if (!action.actionData || Object.keys(action.actionData).length === 0) {
      issues.push('Empty action data');
    }
    
    // Check for required fields
    if (!action.valaId) {
      issues.push('Missing Vala ID');
    }

    const debugResult = {
      passed: issues.length === 0,
      issues
    };

    const updatedAction: FlowAction = {
      ...action,
      stage: debugResult.passed ? 'debug' : 'blocked',
      status: debugResult.passed ? 'Pending' : 'Blocked',
      debugResult
    };

    setCurrentAction(updatedAction);
    setFlowProgress(prev => ({
      currentStage: 'debug',
      completedStages: [...prev.completedStages, 'pending'],
      progress: 25
    }));

    // Log debug result (append-only)
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      action: 'flow_debug_completed',
      module: 'vertical_flow',
      meta_json: {
        action_id: action.id,
        passed: debugResult.passed,
        issues
      }
    });

    setIsProcessing(false);
    return updatedAction;
  }, [user?.id]);

  // Auto Check Stage
  const executeCheck = useCallback(async (action: FlowAction): Promise<FlowAction> => {
    if (action.stage === 'blocked') return action;
    
    setIsProcessing(true);
    
    // Simulate check process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const risks: string[] = [];
    
    // Risk assessment
    const dataSize = JSON.stringify(action.actionData).length;
    if (dataSize > 10000) {
      risks.push('Large data payload detected');
    }

    const checkResult = {
      passed: risks.length === 0,
      risks
    };

    const updatedAction: FlowAction = {
      ...action,
      stage: checkResult.passed ? 'check' : 'blocked',
      status: checkResult.passed ? 'Pending' : 'Blocked',
      checkResult
    };

    setCurrentAction(updatedAction);
    setFlowProgress(prev => ({
      currentStage: 'check',
      completedStages: [...prev.completedStages, 'debug'],
      progress: 50
    }));

    // Log check result (append-only)
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      action: 'flow_check_completed',
      module: 'vertical_flow',
      meta_json: {
        action_id: action.id,
        passed: checkResult.passed,
        risks
      }
    });

    setIsProcessing(false);
    return updatedAction;
  }, [user?.id]);

  // Auto Lock Stage
  const executeLock = useCallback(async (action: FlowAction): Promise<FlowAction> => {
    if (action.stage === 'blocked') return action;
    
    setIsProcessing(true);
    
    // Generate lock hash
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify({
      actionId: action.id,
      actionData: action.actionData,
      timestamp: Date.now()
    }));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const lockHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const updatedAction: FlowAction = {
      ...action,
      stage: 'lock',
      status: 'Locked',
      lockHash,
      lockedAt: Date.now()
    };

    setCurrentAction(updatedAction);
    setFlowProgress(prev => ({
      currentStage: 'lock',
      completedStages: [...prev.completedStages, 'check'],
      progress: 75
    }));

    // Log lock (append-only)
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      action: 'flow_action_locked',
      module: 'vertical_flow',
      meta_json: {
        action_id: action.id,
        lock_hash: lockHash.slice(0, 16),
        locked_at: updatedAction.lockedAt
      }
    });

    setIsProcessing(false);
    toast.success('Action locked. No further edits allowed.');
    return updatedAction;
  }, [user?.id]);

  // Forward to Next Role Stage (upward only)
  const executeForward = useCallback(async (action: FlowAction): Promise<FlowAction> => {
    if (action.stage === 'blocked' || !action.lockHash) {
      toast.error('Cannot forward: Action not locked or blocked');
      return action;
    }
    
    setIsProcessing(true);
    
    const nextRole = ROLE_HIERARCHY[currentRole] || 'master_admin';
    
    const updatedAction: FlowAction = {
      ...action,
      stage: 'forward',
      status: 'Forwarded',
      forwardedTo: nextRole,
      forwardedAt: Date.now()
    };

    setCurrentAction(updatedAction);
    setFlowProgress(prev => ({
      currentStage: 'forward',
      completedStages: [...prev.completedStages, 'lock'],
      progress: 100
    }));

    // Log forward (append-only)
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      action: 'flow_action_forwarded',
      module: 'vertical_flow',
      meta_json: {
        action_id: action.id,
        from_role: currentRole,
        to_role: nextRole,
        forwarded_at: updatedAction.forwardedAt
      }
    });

    setIsProcessing(false);
    toast.success(`Action forwarded to ${nextRole.replace('_', ' ').toUpperCase()}`);
    return updatedAction;
  }, [user?.id, currentRole]);

  // Execute full flow automatically
  const executeFullFlow = useCallback(async (
    valaId: string,
    actionType: string,
    actionData: Record<string, unknown>
  ): Promise<FlowAction> => {
    let action = await createAction(valaId, actionType, actionData);
    action = await executeDebug(action);
    
    if (action.stage !== 'blocked') {
      action = await executeCheck(action);
    }
    
    if (action.stage !== 'blocked') {
      action = await executeLock(action);
    }
    
    if (action.stage !== 'blocked') {
      action = await executeForward(action);
    }
    
    return action;
  }, [createAction, executeDebug, executeCheck, executeLock, executeForward]);

  // Get next role in hierarchy
  const getNextRole = useCallback((): string => {
    return ROLE_HIERARCHY[currentRole] || 'master_admin';
  }, [currentRole]);

  // Check if current role can forward
  const canForward = useCallback((): boolean => {
    return currentRole !== 'master_admin';
  }, [currentRole]);

  return {
    currentAction,
    flowProgress,
    isProcessing,
    createAction,
    executeDebug,
    executeCheck,
    executeLock,
    executeForward,
    executeFullFlow,
    getNextRole,
    canForward
  };
}

export default useVerticalFlow;
