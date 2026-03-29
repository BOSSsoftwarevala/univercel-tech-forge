/**
 * Universal Activity Logger for Boss Panel Real-Time Tracking
 * Every critical action → activity_log table → Boss Panel live stream
 */
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type CriticalActionType =
  | 'franchise_apply'
  | 'reseller_inquiry'
  | 'influencer_join'
  | 'job_apply'
  | 'product_purchase'
  | 'checkout_attempt'
  | 'margin_violation'
  | 'balance_add'
  | 'commission_release'
  | 'product_publish'
  | 'product_update'
  | 'license_generate'
  | 'refund_attempt'
  | 'failed_payment'
  | 'suspicious_activity'
  | 'security_violation'
  | 'server_deployment'
  | 'role_change'
  | 'user_login'
  | 'user_signup'
  | string;

export type SeverityLevel = 'info' | 'warning' | 'critical' | 'emergency';

interface LogActivityParams {
  actionType: CriticalActionType;
  entityType?: string;
  entityId?: string;
  tenantId?: string;
  severity?: SeverityLevel;
  metadata?: Record<string, unknown>;
}

/**
 * Standalone function for logging from non-hook contexts.
 * Uses rpc to bypass type-generation lag for new tables.
 */
export async function logCriticalActivity(params: LogActivityParams): Promise<void> {
  const maxRetries = 2;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Use the table directly via the any-cast pattern to handle
      // newly created tables not yet in the generated types
      const { error } = await (supabase as any).from('activity_log').insert({
        action_type: params.actionType,
        user_id: user?.id || null,
        entity_type: params.entityType || null,
        entity_id: params.entityId || null,
        tenant_id: params.tenantId || null,
        severity_level: params.severity || 'info',
        metadata: params.metadata || {},
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      });

      if (error) throw error;
      return;
    } catch (err) {
      attempt++;
      if (attempt > maxRetries) {
        console.error('[ActivityLogger] Failed after retries:', err);
        return;
      }
      await new Promise(r => setTimeout(r, attempt * 100));
    }
  }
}

/**
 * React hook for component-level activity logging
 */
export function useActivityLogger() {
  const log = useCallback((params: LogActivityParams) => {
    return logCriticalActivity(params);
  }, []);

  const logWithValidation = useCallback(async (
    params: LogActivityParams & { validateRole?: boolean }
  ) => {
    if (params.validateRole) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        await logCriticalActivity({
          actionType: 'security_violation',
          severity: 'critical',
          metadata: {
            blocked_action: params.actionType,
            reason: 'unauthenticated_attempt',
          },
        });
        throw new Error('Authentication required');
      }
    }
    return logCriticalActivity(params);
  }, []);

  return { log, logWithValidation };
}

export default useActivityLogger;
