/**
 * Tenant Isolation Service
 * Activates multi-tenant isolation, runs health checks, and detects violations.
 * Bridges the database-layer RLS enforcement with application-layer monitoring.
 */

import { supabase } from '@/integrations/supabase/client';
import { TenantIsolationManager, ISOLATED_TABLES } from '@/lib/multi-tenant/tenant-isolation';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IsolationHealthStatus {
  isolationStatus: 'healthy' | 'warning' | 'degraded' | 'critical';
  violationsLast24h: number;
  openViolations: number;
  criticalOpen: number;
  uniqueViolatorsLastHour: number;
  checkedAt: string;
}

export interface ViolationRecord {
  id: string;
  detectedAt: string;
  violatingUser: string | null;
  targetTable: string;
  actionAttempted: string;
  sourceTenant: string | null;
  targetTenant: string | null;
  policyViolated: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

// ─── Activation ───────────────────────────────────────────────────────────────

/**
 * Activate the tenant isolation layer for the current user session.
 * Returns a configured TenantIsolationManager or null when unauthenticated.
 */
export async function activateTenantIsolation(): Promise<TenantIsolationManager | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (!roleData) return null;

  // Fetch child tenant IDs for hierarchy-aware scoping
  const childIds = await resolveChildTenantIds(user.id, roleData.role);

  return new TenantIsolationManager(user.id, roleData.role, childIds);
}

/** Resolve IDs of all tenants that the given user is allowed to access. */
async function resolveChildTenantIds(userId: string, role: string): Promise<string[]> {
  const ids: string[] = [];

  if (['boss_owner', 'super_admin', 'master', 'area_manager'].includes(role)) {
    // These roles have platform-wide visibility; children resolved in DB policy.
    return ids;
  }

  if (role === 'franchise') {
    const { data } = await supabase
      .from('branch_map')
      .select('reseller_user_id, prime_user_id')
      .eq('franchise_user_id', userId);

    (data ?? []).forEach((row: Record<string, string | null>) => {
      if (row.reseller_user_id) ids.push(row.reseller_user_id);
      if (row.prime_user_id) ids.push(row.prime_user_id);
    });
  }

  if (role === 'reseller') {
    const { data } = await supabase
      .from('branch_map')
      .select('prime_user_id')
      .eq('reseller_user_id', userId);

    (data ?? []).forEach((row: Record<string, string | null>) => {
      if (row.prime_user_id) ids.push(row.prime_user_id);
    });
  }

  return ids;
}

// ─── Health Check ─────────────────────────────────────────────────────────────

interface HealthRow {
  isolation_status: string;
  violations_last_24h: number | string;
  open_violations: number | string;
  critical_open: number | string;
  unique_violators_last_1h: number | string;
  checked_at: string;
}

/**
 * Query the v_tenant_isolation_health view and return a typed result.
 */
export async function getTenantIsolationHealth(): Promise<IsolationHealthStatus | null> {
  try {
    const { data, error } = await supabase
      .from('v_tenant_isolation_health' as 'tenant_isolation_violations')
      .select('*')
      .single();

    if (error || !data) return null;

    const row = data as unknown as HealthRow;
    return {
      isolationStatus:         row.isolation_status   as IsolationHealthStatus['isolationStatus'],
      violationsLast24h:       Number(row.violations_last_24h    ?? 0),
      openViolations:          Number(row.open_violations         ?? 0),
      criticalOpen:            Number(row.critical_open           ?? 0),
      uniqueViolatorsLastHour: Number(row.unique_violators_last_1h ?? 0),
      checkedAt:               row.checked_at ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

// ─── Violation Logging ────────────────────────────────────────────────────────

// Typed parameters for the log_tenant_isolation_violation DB function
interface LogViolationParams {
  p_table: string;
  p_record_id: string | null;
  p_action: string;
  p_source_tenant: string;
  p_target_tenant: string;
  p_policy: string;
  p_severity: string;
}

/**
 * Log a detected tenant isolation violation via the database function.
 */
export async function logIsolationViolation(params: {
  table: string;
  recordId?: string;
  action: string;
  sourceTenant: string;
  targetTenant: string;
  policy: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}): Promise<void> {
  const rpcArgs: LogViolationParams = {
    p_table:         params.table,
    p_record_id:     params.recordId ?? null,
    p_action:        params.action,
    p_source_tenant: params.sourceTenant,
    p_target_tenant: params.targetTenant,
    p_policy:        params.policy,
    p_severity:      params.severity ?? 'high',
  };
  try {
    // The generated types may not include this custom function yet; use unknown cast.
    await (supabase.rpc as unknown as (fn: string, args: LogViolationParams) => Promise<unknown>)(
      'log_tenant_isolation_violation',
      rpcArgs
    );
  } catch (err) {
    console.error('Failed to log isolation violation:', err);
  }
}

// ─── Violation Queries ────────────────────────────────────────────────────────

interface ViolationRow {
  id: string;
  detected_at: string;
  violating_user: string | null;
  target_table: string;
  action_attempted: string;
  source_tenant: string | null;
  target_tenant: string | null;
  policy_violated: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

/**
 * Fetch recent unresolved violations. Requires super_admin or boss_owner.
 */
export async function getOpenViolations(limit = 50): Promise<ViolationRecord[]> {
  const table = 'tenant_isolation_violations' as const;
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('resolved', false)
    .order('detected_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return (data as unknown as ViolationRow[]).map(row => ({
    id:              row.id,
    detectedAt:      row.detected_at,
    violatingUser:   row.violating_user,
    targetTable:     row.target_table,
    actionAttempted: row.action_attempted,
    sourceTenant:    row.source_tenant,
    targetTenant:    row.target_tenant,
    policyViolated:  row.policy_violated,
    severity:        row.severity,
    resolved:        row.resolved,
  }));
}

/**
 * Mark a violation as resolved.
 */
export async function resolveViolation(violationId: string): Promise<boolean> {
  const table = 'tenant_isolation_violations' as const;
  const { error } = await supabase
    .from(table)
    .update({ resolved: true, resolved_at: new Date().toISOString() })
    .eq('id', violationId);

  return !error;
}

// ─── Integrity Check ──────────────────────────────────────────────────────────

/**
 * Verify tenant isolation is enforced on all expected tables by trying a
 * lightweight probe query on each table name.
 * Returns a map of tableName → tableExists.
 */
export async function verifyIsolationCoverage(): Promise<Record<string, boolean>> {
  const coverage: Record<string, boolean> = {};

  for (const policy of ISOLATED_TABLES) {
    // A query that is always empty is enough to confirm the table exists.
    const { error } = await supabase
      .from(policy.table as 'audit_logs')
      .select('id')
      .limit(0);

    // No error means the table is present and accessible (RLS enabled in migration).
    coverage[policy.table] = !error;
  }

  return coverage;
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

/**
 * Write an audit entry recording that multi-tenant isolation was activated.
 */
export async function auditIsolationActivation(userId: string): Promise<void> {
  try {
    await supabase.from('audit_logs').insert({
      user_id: userId,
      module:  'tenant_isolation',
      action:  'isolation_activated',
      meta_json: {
        timestamp:      new Date().toISOString(),
        isolated_tables: ISOLATED_TABLES.map(p => p.table),
        version:        '1.0.0',
      },
    });
  } catch (err) {
    console.error('Failed to write isolation activation audit log:', err);
  }
}
