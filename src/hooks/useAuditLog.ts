/**
 * useAuditLog - STEP 11: Audit & Traceability
 * Logs every significant action with masked actor info
 */

import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { maskData, generateMaskedId } from '@/utils/dataMasking';
import { generateDeviceFingerprint } from '@/utils/securityUtils';

export type AuditAction = 
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'disable'
  | 'enable'
  | 'approve'
  | 'reject'
  | 'login'
  | 'logout'
  | 'permission_denied'
  | 'data_export'
  | 'bulk_action'
  | 'config_change'
  | 'role_change'
  | 'wallet_transaction'
  | 'payout_request'
  | 'escalation';

export interface AuditLogEntry {
  action: AuditAction;
  entityType: string;
  entityId?: string;
  module: string;
  details?: Record<string, any>;
  previousState?: Record<string, any>;
  newState?: Record<string, any>;
}

export function useAuditLog() {
  const { user } = useAuth();
  const userRole = (user as any)?.role as string | null;
  const userId = user?.id;

  // Log an action (READ-ONLY logs - never modified after creation)
  const logAction = useCallback(async (entry: AuditLogEntry): Promise<boolean> => {
    try {
      // Generate masked actor info for privacy
      const maskedActorId = userId ? generateMaskedId(userId) : 'ANON-****';
      
      // Build audit log entry
      const auditEntry = {
        user_id: userId || undefined,
        role: userRole as any,
        module: entry.module,
        action: entry.action as string,
        meta_json: {
          entity_type: entry.entityType,
          entity_id: entry.entityId,
          masked_actor_id: maskedActorId,
          masked_actor_role: userRole ? maskData(userRole, 'partial') : '***',
          device_fingerprint: generateDeviceFingerprint(),
          ip_address: 'masked',
          user_agent: navigator.userAgent.substring(0, 100),
          details: entry.details,
          previous_state: entry.previousState ? sanitizeForLog(entry.previousState) : undefined,
          new_state: entry.newState ? sanitizeForLog(entry.newState) : undefined,
          timestamp: new Date().toISOString(),
        },
      };

      // Insert to audit_logs table
      const { error } = await supabase
        .from('audit_logs')
        .insert(auditEntry);

      if (error) {
        console.error('Failed to create audit log:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Audit log error:', err);
      return false;
    }
  }, [userId, userRole]);

  // Convenience wrappers for common actions

  const logCreate = useCallback((
    entityType: string,
    entityId: string,
    module: string,
    newState?: Record<string, any>
  ) => {
    return logAction({
      action: 'create',
      entityType,
      entityId,
      module,
      newState,
    });
  }, [logAction]);

  const logUpdate = useCallback((
    entityType: string,
    entityId: string,
    module: string,
    previousState?: Record<string, any>,
    newState?: Record<string, any>
  ) => {
    return logAction({
      action: 'update',
      entityType,
      entityId,
      module,
      previousState,
      newState,
    });
  }, [logAction]);

  const logDelete = useCallback((
    entityType: string,
    entityId: string,
    module: string,
    previousState?: Record<string, any>
  ) => {
    return logAction({
      action: 'delete',
      entityType,
      entityId,
      module,
      previousState,
    });
  }, [logAction]);

  const logDisable = useCallback((
    entityType: string,
    entityId: string,
    module: string,
    reason?: string
  ) => {
    return logAction({
      action: 'disable',
      entityType,
      entityId,
      module,
      details: { reason },
    });
  }, [logAction]);

  const logApprove = useCallback((
    entityType: string,
    entityId: string,
    module: string,
    details?: Record<string, any>
  ) => {
    return logAction({
      action: 'approve',
      entityType,
      entityId,
      module,
      details,
    });
  }, [logAction]);

  const logReject = useCallback((
    entityType: string,
    entityId: string,
    module: string,
    reason?: string
  ) => {
    return logAction({
      action: 'reject',
      entityType,
      entityId,
      module,
      details: { reason },
    });
  }, [logAction]);

  const logPermissionDenied = useCallback((
    action: string,
    entityType: string,
    module: string,
    details?: Record<string, any>
  ) => {
    return logAction({
      action: 'permission_denied',
      entityType,
      entityId: undefined,
      module,
      details: { attempted_action: action, ...details },
    });
  }, [logAction]);

  const logDataExport = useCallback((
    entityType: string,
    module: string,
    recordCount: number,
    exportFormat?: string
  ) => {
    return logAction({
      action: 'data_export',
      entityType,
      module,
      details: { record_count: recordCount, format: exportFormat },
    });
  }, [logAction]);

  return {
    logAction,
    logCreate,
    logUpdate,
    logDelete,
    logDisable,
    logApprove,
    logReject,
    logPermissionDenied,
    logDataExport,
  };
}

// Helper to sanitize data for logging (remove sensitive fields)
function sanitizeForLog(data: Record<string, any>): Record<string, any> {
  const sensitiveFields = [
    'password', 'password_hash', 'secret', 'token', 'api_key',
    'credit_card', 'card_number', 'cvv', 'pin',
    'ssn', 'social_security', 'bank_account',
  ];
  
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    
    if (sensitiveFields.some(f => lowerKey.includes(f))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeForLog(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

export default useAuditLog;
