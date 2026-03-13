/**
 * activityLogging.ts
 * Centralized activity logging utility for all modules.
 * Writes to `system_activity_log` so every module action is visible
 * in the Boss Dashboard in real-time.
 */

import { supabase } from '@/integrations/supabase/client';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ActivitySeverity = 'low' | 'medium' | 'high' | 'critical';
export type ActivityStatus = 'success' | 'failure' | 'pending' | 'blocked';

export interface ActivityLogEntry {
  /** Name of the module generating the event (e.g. 'server-manager') */
  module_name: string;
  /** Verb describing what happened (e.g. 'server_restarted') */
  action_type: string;
  /** Role of the actor performing the action (e.g. 'admin', 'boss') */
  user_role: string;
  /** Optional authenticated user UUID */
  user_id?: string | null;
  /** Optional target resource identifier (UUID or slug) */
  target_id?: string | null;
  /** Outcome of the action */
  status?: ActivityStatus;
  /** Importance/risk level of this event */
  severity?: ActivitySeverity;
  /** Any additional structured data to attach to the log entry */
  metadata?: Record<string, unknown>;
}

// ─── Retry helper ─────────────────────────────────────────────────────────────

const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 150;

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES - 1) {
        await new Promise(resolve =>
          setTimeout(resolve, RETRY_BASE_DELAY_MS * Math.pow(2, attempt))
        );
      }
    }
  }
  throw lastError;
}

// ─── Core logging function ────────────────────────────────────────────────────

/**
 * Log a module activity to `system_activity_log`.
 * Production-safe: never throws — errors are logged to the console only so
 * that a logging failure never disrupts the user-facing operation.
 *
 * @returns `true` on success, `false` on failure.
 */
export async function logActivity(entry: ActivityLogEntry): Promise<boolean> {
  try {
    await withRetry(async () => {
      const { error } = await supabase.from('system_activity_log').insert({
        actor_role: entry.user_role,
        actor_id: entry.user_id ?? null,
        action_type: entry.action_type,
        target: entry.module_name,
        target_id: entry.target_id ?? null,
        risk_level: entry.severity ?? 'low',
        metadata: {
          module_name: entry.module_name,
          status: entry.status ?? 'success',
          ...(entry.metadata ?? {}),
        },
      });
      if (error) throw error;
    });
    return true;
  } catch (err) {
    console.error('[activityLogging] Failed to write to system_activity_log:', err);
    return false;
  }
}

// ─── Convenience wrappers ─────────────────────────────────────────────────────

/**
 * Log a successful action in a module.
 * Convenience wrapper around `logActivity` that defaults status to 'success'.
 */
export function logModuleAction(
  module_name: string,
  action_type: string,
  user_role: string,
  options?: Pick<ActivityLogEntry, 'user_id' | 'target_id' | 'severity' | 'metadata'>
): Promise<boolean> {
  return logActivity({
    module_name,
    action_type,
    user_role,
    status: 'success',
    severity: 'low',
    ...options,
  });
}

/**
 * Log a failed action in a module.
 * Convenience wrapper around `logActivity` that defaults status to 'failure'
 * and severity to 'medium'.
 */
export function logModuleError(
  module_name: string,
  action_type: string,
  user_role: string,
  error_message: string,
  options?: Pick<ActivityLogEntry, 'user_id' | 'target_id' | 'metadata'>
): Promise<boolean> {
  return logActivity({
    module_name,
    action_type,
    user_role,
    status: 'failure',
    severity: 'medium',
    metadata: { error_message, ...(options?.metadata ?? {}) },
    user_id: options?.user_id,
    target_id: options?.target_id,
  });
}
