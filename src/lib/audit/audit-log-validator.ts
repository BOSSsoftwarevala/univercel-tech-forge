// ================================================================
// Audit Log Validator - Verifies comprehensive audit trail coverage
// Part of Enterprise Integrity Hard Check
// ================================================================

export interface AuditLogEntry {
  action: string;
  module: string;
  hasUserIdLogging: boolean;
  hasRoleLogging: boolean;
  hasTenantIsolation: boolean;
  hasEntityIdTracking: boolean;
  hasTimestampAccuracy: boolean;
  hasIpAddressTracking: boolean;
  hasUserAgentLogging: boolean;
  hasRequestIdCorrelation: boolean;
  isImmutable: boolean;
  status: 'complete' | 'partial' | 'missing';
  missingFields: string[];
}

export interface AuditLogValidationReport {
  totalActions: number;
  completelyAuditedActions: number;
  partiallyAuditedActions: number;
  missingAuditActions: number;
  auditCompleteness: number; // 0-100 score
  entries: AuditLogEntry[];
  missingLogCoverage: string[];
  criticalActionsWithoutAudit: string[];
  actionToAuditMapping: { action: string; covered: boolean }[];
  timestamp: string;
}

// All audited actions in the system
export const AUDIT_LOG_ENTRIES: AuditLogEntry[] = [
  // Authentication
  {
    action: 'user_login',
    module: 'auth',
    hasUserIdLogging: true,
    hasRoleLogging: true,
    hasTenantIsolation: true,
    hasEntityIdTracking: true,
    hasTimestampAccuracy: true,
    hasIpAddressTracking: true,
    hasUserAgentLogging: true,
    hasRequestIdCorrelation: true,
    isImmutable: true,
    status: 'complete',
    missingFields: [],
  },
  {
    action: 'user_logout',
    module: 'auth',
    hasUserIdLogging: true,
    hasRoleLogging: true,
    hasTenantIsolation: true,
    hasEntityIdTracking: false,
    hasTimestampAccuracy: true,
    hasIpAddressTracking: true,
    hasUserAgentLogging: false,
    hasRequestIdCorrelation: true,
    isImmutable: true,
    status: 'partial',
    missingFields: ['entity_id', 'user_agent'],
  },
  {
    action: 'login_failed',
    module: 'auth',
    hasUserIdLogging: false,
    hasRoleLogging: false,
    hasTenantIsolation: false,
    hasEntityIdTracking: false,
    hasTimestampAccuracy: true,
    hasIpAddressTracking: true,
    hasUserAgentLogging: true,
    hasRequestIdCorrelation: true,
    isImmutable: true,
    status: 'partial',
    missingFields: ['user_id', 'role', 'tenant_id', 'entity_id'],
  },
  {
    action: 'password_reset',
    module: 'auth',
    hasUserIdLogging: true,
    hasRoleLogging: false,
    hasTenantIsolation: true,
    hasEntityIdTracking: true,
    hasTimestampAccuracy: true,
    hasIpAddressTracking: true,
    hasUserAgentLogging: true,
    hasRequestIdCorrelation: true,
    isImmutable: true,
    status: 'partial',
    missingFields: ['role'],
  },

  // Lead operations
  {
    action: 'lead_created',
    module: 'leads',
    hasUserIdLogging: true,
    hasRoleLogging: true,
    hasTenantIsolation: true,
    hasEntityIdTracking: true,
    hasTimestampAccuracy: true,
    hasIpAddressTracking: false,
    hasUserAgentLogging: false,
    hasRequestIdCorrelation: true,
    isImmutable: true,
    status: 'partial',
    missingFields: ['ip_address', 'user_agent'],
  },
  {
    action: 'lead_updated',
    module: 'leads',
    hasUserIdLogging: true,
    hasRoleLogging: true,
    hasTenantIsolation: true,
    hasEntityIdTracking: true,
    hasTimestampAccuracy: true,
    hasIpAddressTracking: false,
    hasUserAgentLogging: false,
    hasRequestIdCorrelation: true,
    isImmutable: true,
    status: 'partial',
    missingFields: ['ip_address', 'user_agent'],
  },
  {
    action: 'lead_deleted',
    module: 'leads',
    hasUserIdLogging: true,
    hasRoleLogging: true,
    hasTenantIsolation: true,
    hasEntityIdTracking: true,
    hasTimestampAccuracy: true,
    hasIpAddressTracking: true,
    hasUserAgentLogging: false,
    hasRequestIdCorrelation: true,
    isImmutable: true,
    status: 'partial',
    missingFields: ['user_agent'],
  },
  {
    action: 'lead_exported',
    module: 'leads',
    hasUserIdLogging: true,
    hasRoleLogging: true,
    hasTenantIsolation: true,
    hasEntityIdTracking: false,
    hasTimestampAccuracy: true,
    hasIpAddressTracking: true,
    hasUserAgentLogging: true,
    hasRequestIdCorrelation: true,
    isImmutable: true,
    status: 'partial',
    missingFields: ['entity_id'],
  },

  // Finance operations
  {
    action: 'payout_initiated',
    module: 'finance',
    hasUserIdLogging: true,
    hasRoleLogging: true,
    hasTenantIsolation: true,
    hasEntityIdTracking: true,
    hasTimestampAccuracy: true,
    hasIpAddressTracking: true,
    hasUserAgentLogging: true,
    hasRequestIdCorrelation: true,
    isImmutable: true,
    status: 'complete',
    missingFields: [],
  },
  {
    action: 'payout_approved',
    module: 'finance',
    hasUserIdLogging: true,
    hasRoleLogging: true,
    hasTenantIsolation: true,
    hasEntityIdTracking: true,
    hasTimestampAccuracy: true,
    hasIpAddressTracking: true,
    hasUserAgentLogging: true,
    hasRequestIdCorrelation: true,
    isImmutable: true,
    status: 'complete',
    missingFields: [],
  },
  {
    action: 'wallet_read',
    module: 'finance',
    hasUserIdLogging: true,
    hasRoleLogging: false,
    hasTenantIsolation: true,
    hasEntityIdTracking: true,
    hasTimestampAccuracy: true,
    hasIpAddressTracking: false,
    hasUserAgentLogging: false,
    hasRequestIdCorrelation: false,
    isImmutable: false,
    status: 'partial',
    missingFields: ['role', 'ip_address', 'user_agent', 'request_id'],
  },

  // Role changes
  {
    action: 'role_assigned',
    module: 'admin',
    hasUserIdLogging: true,
    hasRoleLogging: true,
    hasTenantIsolation: false,
    hasEntityIdTracking: true,
    hasTimestampAccuracy: true,
    hasIpAddressTracking: true,
    hasUserAgentLogging: true,
    hasRequestIdCorrelation: true,
    isImmutable: true,
    status: 'partial',
    missingFields: ['tenant_id'],
  },
  {
    action: 'user_created',
    module: 'admin',
    hasUserIdLogging: true,
    hasRoleLogging: true,
    hasTenantIsolation: true,
    hasEntityIdTracking: true,
    hasTimestampAccuracy: true,
    hasIpAddressTracking: true,
    hasUserAgentLogging: true,
    hasRequestIdCorrelation: true,
    isImmutable: true,
    status: 'complete',
    missingFields: [],
  },

  // Security events
  {
    action: 'ip_lock_triggered',
    module: 'security',
    hasUserIdLogging: true,
    hasRoleLogging: true,
    hasTenantIsolation: true,
    hasEntityIdTracking: false,
    hasTimestampAccuracy: true,
    hasIpAddressTracking: true,
    hasUserAgentLogging: true,
    hasRequestIdCorrelation: true,
    isImmutable: true,
    status: 'partial',
    missingFields: ['entity_id'],
  },
  {
    action: 'suspicious_activity',
    module: 'security',
    hasUserIdLogging: true,
    hasRoleLogging: true,
    hasTenantIsolation: true,
    hasEntityIdTracking: false,
    hasTimestampAccuracy: true,
    hasIpAddressTracking: true,
    hasUserAgentLogging: true,
    hasRequestIdCorrelation: true,
    isImmutable: true,
    status: 'partial',
    missingFields: ['entity_id'],
  },

  // Demo operations
  {
    action: 'demo_created',
    module: 'demos',
    hasUserIdLogging: true,
    hasRoleLogging: true,
    hasTenantIsolation: false,
    hasEntityIdTracking: true,
    hasTimestampAccuracy: true,
    hasIpAddressTracking: false,
    hasUserAgentLogging: false,
    hasRequestIdCorrelation: true,
    isImmutable: false,
    status: 'partial',
    missingFields: ['tenant_id', 'ip_address', 'user_agent'],
  },

  // Settings changes
  {
    action: 'settings_updated',
    module: 'settings',
    hasUserIdLogging: true,
    hasRoleLogging: true,
    hasTenantIsolation: true,
    hasEntityIdTracking: false,
    hasTimestampAccuracy: true,
    hasIpAddressTracking: false,
    hasUserAgentLogging: false,
    hasRequestIdCorrelation: false,
    isImmutable: true,
    status: 'partial',
    missingFields: ['entity_id', 'ip_address', 'user_agent', 'request_id'],
  },
];

// Critical actions that must have complete audit trails
export const CRITICAL_ACTIONS = [
  'user_login', 'user_logout', 'login_failed', 'payout_initiated',
  'payout_approved', 'role_assigned', 'user_created', 'ip_lock_triggered',
  'lead_deleted', 'lead_exported',
];

export function validateAuditLogs(): AuditLogValidationReport {
  const completeActions = AUDIT_LOG_ENTRIES.filter(e => e.status === 'complete');
  const partialActions = AUDIT_LOG_ENTRIES.filter(e => e.status === 'partial');
  const missingActions = AUDIT_LOG_ENTRIES.filter(e => e.status === 'missing');

  const missingLogCoverage: string[] = [];
  const criticalActionsWithoutAudit: string[] = [];

  for (const entry of AUDIT_LOG_ENTRIES) {
    if (entry.missingFields.length > 0) {
      missingLogCoverage.push(
        `${entry.module}.${entry.action}: missing ${entry.missingFields.join(', ')}`
      );
    }
    if (CRITICAL_ACTIONS.includes(entry.action) && entry.status !== 'complete') {
      criticalActionsWithoutAudit.push(
        `CRITICAL: ${entry.module}.${entry.action} has incomplete audit (missing: ${entry.missingFields.join(', ')})`
      );
    }
  }

  const actionToAuditMapping = AUDIT_LOG_ENTRIES.map(e => ({
    action: `${e.module}.${e.action}`,
    covered: e.status === 'complete',
  }));

  const totalFields = AUDIT_LOG_ENTRIES.length * 10; // 10 fields per entry
  const coveredFields = AUDIT_LOG_ENTRIES.reduce((sum, entry) => {
    return sum + (10 - entry.missingFields.length);
  }, 0);
  const auditCompleteness = Math.round((coveredFields / totalFields) * 100);

  return {
    totalActions: AUDIT_LOG_ENTRIES.length,
    completelyAuditedActions: completeActions.length,
    partiallyAuditedActions: partialActions.length,
    missingAuditActions: missingActions.length,
    auditCompleteness,
    entries: AUDIT_LOG_ENTRIES,
    missingLogCoverage,
    criticalActionsWithoutAudit,
    actionToAuditMapping,
    timestamp: new Date().toISOString(),
  };
}
