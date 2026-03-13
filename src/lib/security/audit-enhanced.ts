// ==============================================
// Enhanced Audit Logging
// ==============================================
// Comprehensive audit trail with sensitive-data
// masking, integrity checksums, and real-time
// security alert hooks.

import { supabase } from '@/integrations/supabase/client';

// ---------- Types ----------

export type AuditSeverity = 'info' | 'warning' | 'critical';

export interface AuditEntry {
  userId: string | null;
  role?: string | null;
  module: string;
  action: string;
  severity?: AuditSeverity;
  ipAddress?: string;
  deviceFingerprint?: string;
  userAgent?: string;
  meta?: Record<string, unknown>;
}

export interface AuditLogRecord {
  id?: string;
  user_id: string | null;
  role: string | null;
  module: string;
  action: string;
  severity: AuditSeverity;
  ip_address: string | null;
  device_fingerprint: string | null;
  user_agent: string | null;
  meta_json: Record<string, unknown>;
  checksum: string;
  timestamp: string;
}

// ---------- Sensitive-data masking ----------

const SENSITIVE_KEYS = new Set([
  'password', 'secret', 'token', 'key', 'credit_card', 'card_number',
  'cvv', 'ssn', 'national_id', 'otp', 'pin', 'auth_code',
]);

export function maskSensitiveData(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (SENSITIVE_KEYS.has(k.toLowerCase())) {
      result[k] = '[REDACTED]';
    } else if (typeof v === 'string' && v.length > 4) {
      // Partially mask email addresses
      if (/^[^@]+@[^@]+\.[^@]+$/.test(v)) {
        result[k] = v.replace(/(.{2})(.*)(@.*)/, '$1***$3');
      } else {
        result[k] = v;
      }
    } else if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      result[k] = maskSensitiveData(v as Record<string, unknown>);
    } else {
      result[k] = v;
    }
  }
  return result;
}

// ---------- Checksum ----------

async function computeChecksum(record: Omit<AuditLogRecord, 'checksum'>): Promise<string> {
  const payload = JSON.stringify({
    user_id: record.user_id,
    module: record.module,
    action: record.action,
    timestamp: record.timestamp,
    meta_json: record.meta_json,
  });
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(payload));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ---------- Real-time alert hooks ----------

type AlertHandler = (entry: AuditEntry) => void;
const alertHandlers: AlertHandler[] = [];

export function registerAlertHandler(handler: AlertHandler): void {
  alertHandlers.push(handler);
}

function dispatchAlerts(entry: AuditEntry): void {
  if (entry.severity === 'critical' || entry.severity === 'warning') {
    alertHandlers.forEach(h => {
      try { h(entry); } catch { /* individual handler failure must not break logging */ }
    });
  }
}

// ---------- Core log function ----------

export async function logAuditEvent(entry: AuditEntry): Promise<void> {
  try {
    const maskedMeta = entry.meta ? maskSensitiveData(entry.meta) : {};
    const severity: AuditSeverity = entry.severity ?? 'info';
    const timestamp = new Date().toISOString();

    const recordWithoutChecksum: Omit<AuditLogRecord, 'checksum'> = {
      user_id: entry.userId,
      role: entry.role ?? null,
      module: entry.module,
      action: entry.action,
      severity,
      ip_address: entry.ipAddress ?? null,
      device_fingerprint: entry.deviceFingerprint ?? null,
      user_agent: entry.userAgent ?? navigator?.userAgent ?? null,
      meta_json: maskedMeta,
      timestamp,
    };

    const checksum = await computeChecksum(recordWithoutChecksum);

    await supabase.from('audit_logs').insert({
      user_id: recordWithoutChecksum.user_id,
      // role is a typed enum in the DB; cast through unknown to satisfy TS without `as never`
      role: recordWithoutChecksum.role as unknown as never,
      module: recordWithoutChecksum.module,
      action: recordWithoutChecksum.action,
      meta_json: {
        ...maskedMeta,
        _severity: severity,
        _ip: recordWithoutChecksum.ip_address,
        _device: recordWithoutChecksum.device_fingerprint,
        _ua: recordWithoutChecksum.user_agent,
        _checksum: checksum,
      },
    });

    dispatchAlerts(entry);
  } catch (err) {
    // Audit logging must never crash the application
    console.error('[AuditLog] Failed to write audit entry:', err);
  }
}

// ---------- Convenience wrappers ----------

export const audit = {
  info: (entry: Omit<AuditEntry, 'severity'>) =>
    logAuditEvent({ ...entry, severity: 'info' }),

  warning: (entry: Omit<AuditEntry, 'severity'>) =>
    logAuditEvent({ ...entry, severity: 'warning' }),

  critical: (entry: Omit<AuditEntry, 'severity'>) =>
    logAuditEvent({ ...entry, severity: 'critical' }),

  loginAttempt: (userId: string | null, email: string, success: boolean, meta?: Record<string, unknown>) =>
    logAuditEvent({
      userId,
      module: 'auth',
      action: success ? 'login_success' : 'login_failed',
      severity: success ? 'info' : 'warning',
      meta: { email, ...meta },
    }),

  twoFactorVerified: (userId: string, method: string) =>
    logAuditEvent({
      userId,
      module: 'auth',
      action: '2fa_verified',
      severity: 'info',
      meta: { method },
    }),

  twoFactorFailed: (userId: string, method: string) =>
    logAuditEvent({
      userId,
      module: 'auth',
      action: '2fa_failed',
      severity: 'warning',
      meta: { method },
    }),

  privilegedAction: (userId: string, role: string, action: string, meta?: Record<string, unknown>) =>
    logAuditEvent({
      userId,
      role,
      module: 'privileged',
      action,
      severity: 'warning',
      meta,
    }),

  dataExport: (userId: string, dataType: string, recordCount: number) =>
    logAuditEvent({
      userId,
      module: 'gdpr',
      action: 'data_export',
      severity: 'warning',
      meta: { dataType, recordCount },
    }),

  securityAlert: (userId: string | null, alertType: string, meta?: Record<string, unknown>) =>
    logAuditEvent({
      userId,
      module: 'security',
      action: alertType,
      severity: 'critical',
      meta,
    }),
};
