/**
 * useModuleActivityLogger
 * React hook that wraps `logActivity` from activityLogging.ts,
 * automatically injecting the authenticated user's id and role so
 * individual modules don't need to manage that themselves.
 */

import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  logActivity,
  logModuleAction,
  logModuleError,
  type ActivityLogEntry,
  type ActivitySeverity,
  type ActivityStatus,
} from '@/utils/activityLogging';

interface LogOptions {
  target_id?: string | null;
  severity?: ActivitySeverity;
  status?: ActivityStatus;
  metadata?: Record<string, unknown>;
}

export function useModuleActivityLogger(moduleName: string) {
  const { user } = useAuth();
  const userRole = (user as { role?: string } | null)?.role ?? 'user';
  const userId = user?.id ?? null;

  /** Log any activity entry, with user context automatically filled in. */
  const log = useCallback(
    (entry: Omit<ActivityLogEntry, 'user_id' | 'user_role'>) =>
      logActivity({ ...entry, user_id: userId, user_role: userRole }),
    [userId, userRole]
  );

  /** Log a successful action within this module. */
  const logAction = useCallback(
    (action_type: string, options?: LogOptions) =>
      logModuleAction(moduleName, action_type, userRole, {
        user_id: userId,
        ...options,
      }),
    [moduleName, userId, userRole]
  );

  /** Log a failed action within this module. */
  const logError = useCallback(
    (action_type: string, error_message: string, options?: Pick<LogOptions, 'target_id' | 'metadata'>) =>
      logModuleError(moduleName, action_type, userRole, error_message, {
        user_id: userId,
        ...options,
      }),
    [moduleName, userId, userRole]
  );

  return { log, logAction, logError };
}

export default useModuleActivityLogger;
