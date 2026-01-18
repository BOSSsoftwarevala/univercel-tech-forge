/**
 * BOX ACTION HOOK — STANDARDIZED ACTION HANDLER
 * ==============================================
 * Provides action handling with state updates, API calls, and toast feedback.
 * Used by all ActionBox components across all modules.
 * 
 * LOCKED STRUCTURE - BOSS APPROVAL REQUIRED FOR CHANGES
 */

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

// Types moved inline since ActionBox was removed
export type BoxType = 'approval' | 'process' | 'ai' | 'live' | 'data';
export type BoxStatus = 'active' | 'pending' | 'suspended' | 'stopped';
export type PermissionLevel = 'boss' | 'ceo' | 'manager' | 'readonly';

export interface ActionResult {
  success: boolean;
  newStatus?: BoxStatus;
  message?: string;
}

export interface UseBoxActionsOptions {
  onStatusChange?: (entityId: string, newStatus: BoxStatus) => void;
  onRefresh?: () => void;
}

/**
 * Standard action handler for all box types
 * Implements: Button → Route → Screen → API → Result
 */
export function useBoxActions(options: UseBoxActionsOptions = {}) {
  const [processingActions, setProcessingActions] = useState<Record<string, boolean>>({});

  /**
   * Execute an action with proper state management
   */
  const executeAction = useCallback(async (
    actionId: string,
    entityId: string,
    currentStatus: BoxStatus
  ): Promise<ActionResult> => {
    const actionKey = `${entityId}-${actionId}`;
    
    // Prevent duplicate actions
    if (processingActions[actionKey]) {
      return { success: false, message: 'Action already in progress' };
    }

    setProcessingActions(prev => ({ ...prev, [actionKey]: true }));

    try {
      // Simulate API call (replace with real API calls)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Determine new status based on action
      let newStatus: BoxStatus = currentStatus;
      let message = '';

      switch (actionId) {
        case 'approve':
          newStatus = 'active';
          message = 'Approved successfully';
          break;
        case 'reject':
          newStatus = 'stopped';
          message = 'Rejected';
          break;
        case 'suspend':
          newStatus = 'suspended';
          message = 'Suspended';
          break;
        case 'resume':
        case 'start':
        case 'startAi':
          newStatus = 'active';
          message = 'Started successfully';
          break;
        case 'stop':
        case 'stopAi':
          newStatus = 'stopped';
          message = 'Stopped';
          break;
        case 'delete':
          message = 'Deleted (soft delete)';
          break;
        case 'view':
          message = 'Opening details...';
          break;
        case 'edit':
          message = 'Opening editor...';
          break;
        case 'update':
          message = 'Updated successfully';
          break;
        case 'post':
          message = 'Posted successfully';
          break;
        case 'viewLogs':
          message = 'Opening logs...';
          break;
        case 'pauseMonitoring':
          newStatus = 'pending';
          message = 'Monitoring paused';
          break;
        default:
          message = 'Action completed';
      }

      // Notify status change
      if (newStatus !== currentStatus && options.onStatusChange) {
        options.onStatusChange(entityId, newStatus);
      }

      return { success: true, newStatus, message };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Action failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setProcessingActions(prev => {
        const updated = { ...prev };
        delete updated[actionKey];
        return updated;
      });
    }
  }, [processingActions, options]);

  /**
   * Check if an action is currently processing
   */
  const isProcessing = useCallback((entityId: string, actionId: string): boolean => {
    return processingActions[`${entityId}-${actionId}`] ?? false;
  }, [processingActions]);

  /**
   * Get user permission level based on role
   */
  const getPermissionLevel = useCallback((userRole: string): PermissionLevel => {
    const roleMap: Record<string, PermissionLevel> = {
      'boss_owner': 'boss',
      'boss': 'boss',
      'ceo': 'ceo',
      'continent_super_admin': 'manager',
      'country_head': 'manager',
      'server_manager': 'manager',
      'franchise_manager': 'manager',
      'sales_support_manager': 'manager',
      'reseller_manager': 'manager',
      'lead_manager': 'manager',
      'product_manager': 'manager',
      'demo_manager': 'manager',
      'pro_manager': 'manager',
      'legal_manager': 'manager',
      'task_management': 'manager',
      'finance_manager': 'manager',
      'developer_management': 'manager',
      'marketing_management': 'manager',
      'customer_support_management': 'manager',
      'role_manager': 'manager',
      'vala_ai_management': 'manager',
    };
    return roleMap[userRole] || 'readonly';
  }, []);

  /**
   * Determine box type from context
   */
  const inferBoxType = useCallback((context: {
    hasApproval?: boolean;
    hasProcess?: boolean;
    hasAI?: boolean;
    isLive?: boolean;
  }): BoxType => {
    if (context.hasApproval) return 'approval';
    if (context.hasAI) return 'ai';
    if (context.hasProcess) return 'process';
    if (context.isLive) return 'live';
    return 'data';
  }, []);

  return {
    executeAction,
    isProcessing,
    getPermissionLevel,
    inferBoxType,
  };
}

export default useBoxActions;
