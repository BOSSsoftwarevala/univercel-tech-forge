import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type ActionSeverity = 'low' | 'medium' | 'high' | 'critical';

interface AuditEntry {
  action: string;
  module: string;
  severity: ActionSeverity;
  target_id?: string;
  target_type?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  reason?: string;
}

export function useImmutableAudit() {
  const logAction = useCallback(async (entry: AuditEntry): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('Audit logging requires authenticated user');
        return false;
      }

      // Get device info
      const deviceInfo = {
        user_agent: navigator.userAgent,
        screen: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
      };

      // Log to audit_logs (immutable)
      const { error: auditError } = await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: entry.action,
        module: entry.module,
        meta_json: {
          severity: entry.severity,
          target_id: entry.target_id,
          target_type: entry.target_type,
          old_values: entry.old_values,
          new_values: entry.new_values,
          reason: entry.reason,
          device_info: deviceInfo,
          ip_timestamp: new Date().toISOString(),
        }
      });

      if (auditError) {
        console.error('Failed to create audit log:', auditError);
        return false;
      }

      // For critical actions, also log to blackbox_events
      if (entry.severity === 'critical') {
        await supabase.from('blackbox_events').insert({
          event_type: entry.action,
          module_name: entry.module,
          user_id: user.id,
          entity_id: entry.target_id,
          entity_type: entry.target_type,
          is_sealed: true, // Immutable
          risk_score: entry.severity === 'critical' ? 90 : entry.severity === 'high' ? 70 : 50,
          metadata: {
            old_values: entry.old_values,
            new_values: entry.new_values,
            reason: entry.reason,
          }
        });
      }

      return true;
    } catch (err) {
      console.error('Audit logging failed:', err);
      return false;
    }
  }, []);

  // Log sensitive data access
  const logDataAccess = useCallback(async (
    dataType: string,
    recordId: string,
    accessType: 'view' | 'export' | 'print'
  ): Promise<void> => {
    await logAction({
      action: `data_${accessType}`,
      module: 'data_protection',
      severity: accessType === 'export' ? 'high' : 'low',
      target_id: recordId,
      target_type: dataType,
    });
  }, [logAction]);

  // Log authentication events
  const logAuthEvent = useCallback(async (
    eventType: 'login' | 'logout' | 'failed_login' | 'password_change' | 'mfa_enabled' | 'mfa_disabled',
    details?: Record<string, any>
  ): Promise<void> => {
    const severityMap: Record<string, ActionSeverity> = {
      login: 'low',
      logout: 'low',
      failed_login: 'medium',
      password_change: 'high',
      mfa_enabled: 'medium',
      mfa_disabled: 'critical',
    };

    await logAction({
      action: `auth_${eventType}`,
      module: 'authentication',
      severity: severityMap[eventType] || 'medium',
      new_values: details,
    });
  }, [logAction]);

  // Log role changes
  const logRoleChange = useCallback(async (
    userId: string,
    oldRole: string | null,
    newRole: string,
    reason: string
  ): Promise<void> => {
    await logAction({
      action: 'role_change',
      module: 'access_control',
      severity: 'critical',
      target_id: userId,
      target_type: 'user',
      old_values: { role: oldRole },
      new_values: { role: newRole },
      reason,
    });

    toast.info('Role change logged', {
      description: 'This action has been permanently recorded.',
    });
  }, [logAction]);

  // Log financial transactions
  const logFinancialAction = useCallback(async (
    actionType: 'withdrawal' | 'deposit' | 'transfer' | 'refund',
    amount: number,
    targetId: string,
    details?: Record<string, any>
  ): Promise<void> => {
    await logAction({
      action: `financial_${actionType}`,
      module: 'finance',
      severity: amount > 10000 ? 'critical' : 'high',
      target_id: targetId,
      target_type: 'transaction',
      new_values: { amount, ...details },
    });
  }, [logAction]);

  return {
    logAction,
    logDataAccess,
    logAuthEvent,
    logRoleChange,
    logFinancialAction,
  };
}
