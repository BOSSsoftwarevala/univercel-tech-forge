/**
 * useRolePermission - STEP 11: Role Permission Gate
 * Strict permission checking before any action
 */

import { useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { hasPermission, PERMISSION_MATRIX, logSecurityEvent } from '@/utils/securityUtils';
import { toast } from 'sonner';

// Extended permission matrix for granular actions
export const ACTION_PERMISSIONS: Record<string, string[]> = {
  // CRUD actions
  'create': ['create_any', 'create_own'],
  'read': ['read_any', 'read_own', 'read_assigned'],
  'update': ['update_any', 'update_own'],
  'delete': ['delete_any', 'delete_own'],
  'disable': ['disable_any', 'disable_own'],
  
  // Approval actions
  'approve': ['approve_users', 'approve_transactions', 'approve_payouts'],
  'reject': ['reject_users', 'reject_transactions', 'reject_payouts'],
  
  // Administrative actions
  'force_logout': ['force_logout'],
  'manage_roles': ['manage_roles'],
  'view_logs': ['view_logs', 'view_master_logs'],
  'export': ['export_data', 'export_reports'],
  
  // Module-specific
  'manage_servers': ['manage_servers', 'view_servers'],
  'manage_wallets': ['manage_wallets', 'view_wallets'],
  'manage_leads': ['manage_leads', 'view_leads'],
  'manage_tasks': ['manage_tasks', 'view_tasks'],
};

// Role hierarchy for scope checking
const ROLE_HIERARCHY: Record<string, number> = {
  'boss_owner': 110,
  'ceo': 105,
  'server_manager': 95,
  'area_manager': 90,
  'finance_manager': 85,
  'legal_compliance': 80,
  'hr_manager': 75,
  'performance_manager': 70,
  'rnd_manager': 65,
  'marketing_manager': 60,
  'demo_manager': 55,
  'task_manager': 50,
  'lead_manager': 45,
  'seo_manager': 40,
  'client_success': 35,
  'ai_manager': 30,
  'support': 25,
  'franchise': 20,
  'reseller': 15,
  'developer': 12,
  'influencer': 10,
  'prime': 8,
  'client': 5,
};

export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  requiresElevation?: boolean;
}

export function useRolePermission() {
  const { user } = useAuth();
  const userRole = (user as any)?.role as string | null;
  const userId = user?.id;

  // Get user's role level
  const roleLevel = useMemo(() => {
    return ROLE_HIERARCHY[userRole || ''] || 0;
  }, [userRole]);

  // Check if user can perform action on entity
  const checkPermission = useCallback((
    action: string,
    entityType?: string,
    entityOwnerId?: string,
    targetRole?: string
  ): PermissionCheckResult => {
    // No role = no access
    if (!userRole) {
      return { allowed: false, reason: 'Not authenticated' };
    }

    // Boss owner has all permissions
    if (userRole === 'boss_owner') {
      return { allowed: true };
    }

    // CEO has almost all permissions (except master logs)
    if (userRole === 'ceo' && action !== 'view_master_logs') {
      return { allowed: true };
    }

    // Check role hierarchy - can't act on higher roles
    if (targetRole) {
      const targetLevel = ROLE_HIERARCHY[targetRole] || 0;
      if (targetLevel >= roleLevel) {
        return { 
          allowed: false, 
          reason: 'Cannot perform actions on equal or higher roles',
          requiresElevation: true,
        };
      }
    }

    // Check ownership for "own" permissions
    const isOwner = entityOwnerId && entityOwnerId === userId;
    
    // Get required permissions for action
    const requiredPerms = ACTION_PERMISSIONS[action] || [action];
    
    // Check if user has any of the required permissions
    const hasAnyPerm = requiredPerms.some(perm => {
      // Check "any" permission
      if (perm.endsWith('_any')) {
        return hasPermission(userRole, perm);
      }
      
      // Check "own" permission with ownership
      if (perm.endsWith('_own') && isOwner) {
        return hasPermission(userRole, perm);
      }
      
      // Check direct permission
      return hasPermission(userRole, perm);
    });

    if (hasAnyPerm) {
      return { allowed: true };
    }

    // Check base permission matrix
    if (PERMISSION_MATRIX[userRole]?.[action]) {
      return { allowed: true };
    }

    return { 
      allowed: false, 
      reason: 'Permission required',
    };
  }, [userRole, userId, roleLevel]);

  // Wrapper to check and log attempt
  const checkAndLog = useCallback(async (
    action: string,
    entityType?: string,
    entityId?: string,
    entityOwnerId?: string,
    targetRole?: string
  ): Promise<PermissionCheckResult> => {
    const result = checkPermission(action, entityType, entityOwnerId, targetRole);
    
    // Log denied attempts (silent)
    if (!result.allowed) {
      await logSecurityEvent('permission_denied', {
        action,
        entityType,
        entityId,
        reason: result.reason,
        userRole,
      }).catch(() => {}); // Silent fail
    }

    return result;
  }, [checkPermission, userRole]);

  // Gate an action - shows tooltip if denied
  const gateAction = useCallback(async (
    action: string,
    onAllowed: () => void | Promise<void>,
    options?: {
      entityType?: string;
      entityId?: string;
      entityOwnerId?: string;
      targetRole?: string;
      showToast?: boolean;
    }
  ): Promise<boolean> => {
    const result = await checkAndLog(
      action,
      options?.entityType,
      options?.entityId,
      options?.entityOwnerId,
      options?.targetRole
    );

    if (result.allowed) {
      await onAllowed();
      return true;
    }

    if (options?.showToast !== false) {
      toast.error(result.reason || 'Permission required', {
        description: result.requiresElevation 
          ? 'This action requires higher privileges'
          : 'Contact your administrator for access',
      });
    }

    return false;
  }, [checkAndLog]);

  // Check if button should be disabled
  const shouldDisableButton = useCallback((
    action: string,
    entityOwnerId?: string,
    targetRole?: string
  ): boolean => {
    const result = checkPermission(action, undefined, entityOwnerId, targetRole);
    return !result.allowed;
  }, [checkPermission]);

  // Get tooltip for disabled button
  const getDisabledTooltip = useCallback((
    action: string,
    entityOwnerId?: string,
    targetRole?: string
  ): string | null => {
    const result = checkPermission(action, undefined, entityOwnerId, targetRole);
    if (result.allowed) return null;
    return result.reason || 'Permission required';
  }, [checkPermission]);

  // Check if user can view entity (for data scoping)
  const canViewEntity = useCallback((
    entityOwnerId?: string,
    entityRole?: string,
    entityScope?: { continentId?: string; countryId?: string; franchiseId?: string }
  ): boolean => {
    if (!userRole) return false;
    if (userRole === 'boss_owner' || userRole === 'ceo') return true;

    // Role-based scope checking
    const userScopeLevel = ROLE_HIERARCHY[userRole] || 0;
    
    // Higher roles see more
    if (userScopeLevel >= 90) return true; // Area manager and above see all
    
    // Check ownership
    if (entityOwnerId === userId) return true;

    // Check role hierarchy - can see lower roles
    if (entityRole) {
      const entityRoleLevel = ROLE_HIERARCHY[entityRole] || 0;
      return userScopeLevel > entityRoleLevel;
    }

    return false;
  }, [userRole, userId]);

  return {
    userRole,
    roleLevel,
    checkPermission,
    checkAndLog,
    gateAction,
    shouldDisableButton,
    getDisabledTooltip,
    canViewEntity,
  };
}

export default useRolePermission;
