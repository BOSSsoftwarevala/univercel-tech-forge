/**
 * STEP 12: System Lock Hook
 * Prevents unauthorized changes after validation
 */

import { useState, useCallback, useEffect } from 'react';
import { useEnterpriseAudit } from './useEnterpriseAudit';

export type LockableArea = 
  | 'schema'
  | 'routes'
  | 'ui_refactor'
  | 'permissions'
  | 'design_system'
  | 'api_endpoints'
  | 'role_matrix'
  | 'production_mode';

export interface SystemLockState {
  isLocked: boolean;
  lockTimestamp: string | null;
  lockedBy: string | null;
  lockedAreas: LockableArea[];
  version: string;
  allowedChangeTypes: string[];
}

const SYSTEM_LOCK_KEY = 'system_lock_state';
const CURRENT_VERSION = '1.0.0';

export function useSystemLock() {
  const [lockState, setLockState] = useState<SystemLockState>(() => {
    const stored = localStorage.getItem(SYSTEM_LOCK_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return getDefaultLockState();
      }
    }
    return getDefaultLockState();
  });

  const { logAction } = useEnterpriseAudit();

  // Persist lock state
  useEffect(() => {
    localStorage.setItem(SYSTEM_LOCK_KEY, JSON.stringify(lockState));
  }, [lockState]);

  /**
   * Lock the entire system for production
   */
  const lockSystem = useCallback(async (lockedBy: string): Promise<boolean> => {
    const timestamp = new Date().toISOString();

    setLockState({
      isLocked: true,
      lockTimestamp: timestamp,
      lockedBy,
      lockedAreas: [
        'schema', 
        'routes', 
        'ui_refactor', 
        'permissions', 
        'design_system',
        'api_endpoints',
        'role_matrix',
        'production_mode'
      ],
      version: CURRENT_VERSION,
      allowedChangeTypes: ['hotfix', 'security_patch', 'new_version']
    });

    await logAction({
      action: 'system_full_lock',
      module: 'system',
      severity: 'critical',
      metadata: {
        locked_by: lockedBy,
        lock_timestamp: timestamp,
        version: CURRENT_VERSION,
        mode: 'production'
      }
    });

    return true;
  }, [logAction]);

  /**
   * Enable production mode lock
   */
  const enableProductionMode = useCallback(async (enabledBy: string): Promise<boolean> => {
    const timestamp = new Date().toISOString();

    setLockState(prev => ({
      ...prev,
      isLocked: true,
      lockTimestamp: timestamp,
      lockedBy: enabledBy,
      lockedAreas: [
        'schema', 
        'routes', 
        'ui_refactor', 
        'permissions', 
        'design_system',
        'api_endpoints',
        'role_matrix',
        'production_mode'
      ],
      allowedChangeTypes: ['hotfix', 'security_patch']
    }));

    await logAction({
      action: 'production_mode_enabled',
      module: 'system',
      severity: 'critical',
      metadata: {
        enabled_by: enabledBy,
        timestamp,
        version: CURRENT_VERSION
      }
    });

    return true;
  }, [logAction]);

  /**
   * Check if a specific area is locked
   */
  const isAreaLocked = useCallback((area: LockableArea): boolean => {
    return lockState.isLocked && lockState.lockedAreas.includes(area);
  }, [lockState]);

  /**
   * Check if a change type is allowed
   */
  const isChangeAllowed = useCallback((changeType: string): boolean => {
    if (!lockState.isLocked) return true;
    return lockState.allowedChangeTypes.includes(changeType);
  }, [lockState]);

  /**
   * Request unlock (requires approval)
   */
  const requestUnlock = useCallback(async (
    reason: string,
    requestedBy: string
  ): Promise<{ requestId: string }> => {
    const requestId = `unlock_${Date.now()}`;

    await logAction({
      action: 'unlock_request',
      module: 'system',
      severity: 'critical',
      metadata: {
        request_id: requestId,
        reason,
        requested_by: requestedBy,
        current_lock_state: lockState
      }
    });

    // In production, this would create an approval request
    return { requestId };
  }, [lockState, logAction]);

  /**
   * Get lock status summary
   */
  const getLockSummary = useCallback(() => {
    return {
      status: lockState.isLocked ? 'LOCKED' : 'UNLOCKED',
      version: lockState.version,
      lockedSince: lockState.lockTimestamp,
      lockedAreas: lockState.lockedAreas,
      message: lockState.isLocked 
        ? `System locked since ${lockState.lockTimestamp}. Only ${lockState.allowedChangeTypes.join(', ')} allowed.`
        : 'System is unlocked. Changes are permitted.'
    };
  }, [lockState]);

  return {
    lockState,
    lockSystem,
    enableProductionMode,
    isAreaLocked,
    isChangeAllowed,
    requestUnlock,
    getLockSummary
  };
}

function getDefaultLockState(): SystemLockState {
  return {
    isLocked: false,
    lockTimestamp: null,
    lockedBy: null,
    lockedAreas: [],
    version: CURRENT_VERSION,
    allowedChangeTypes: ['hotfix', 'security_patch', 'new_version']
  };
}
