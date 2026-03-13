// =============================================================================
// Master Control Layer – Enterprise Kill-Switch System
// Provides owner-only kill-switches, production write-protection,
// emergency read-only mode, auto anomaly locking, AI action approval
// thresholds, command sandboxing, and an immutable audit trail.
// =============================================================================

import { supabase } from '@/integrations/supabase/client';

// ─── Types ────────────────────────────────────────────────────────────────────

export type KillSwitchScope = 'global' | 'regional' | 'franchise';

export interface KillSwitch {
  id: string;
  switch_key: string;
  scope: KillSwitchScope;
  is_active: boolean;
  reason: string | null;
  activated_by: string | null;
  activated_at: string;
  deactivated_by: string | null;
  deactivated_at: string | null;
  metadata: Record<string, unknown>;
}

export type AnomalySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AnomalyLock {
  id: string;
  resource_key: string;
  anomaly_type: string;
  severity: AnomalySeverity;
  is_locked: boolean;
  detected_at: string;
  evidence: Record<string, unknown>;
}

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'SANDBOXED';

export interface AiActionApproval {
  id: string;
  action_type: string;
  payload: Record<string, unknown>;
  risk_score: number;
  status: ApprovalStatus;
  requested_by: string | null;
  expires_at: string;
}

export type SandboxExecutionStatus = 'PENDING' | 'EXECUTED' | 'BLOCKED' | 'FAILED';

export interface SandboxCommand {
  command_type: string;
  command_payload: Record<string, unknown>;
  approval_id?: string;
}

export interface MclAuditEntry {
  actor_id?: string;
  action: string;
  target_type: 'kill_switch' | 'write_protection' | 'anomaly_lock' | 'ai_approval' | 'sandbox';
  target_id?: string;
  before_state?: Record<string, unknown>;
  after_state?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

// ─── In-memory cache ─────────────────────────────────────────────────────────

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class MclCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private defaultTtlMs: number;

  constructor(defaultTtlMs = 30_000) {
    this.defaultTtlMs = defaultTtlMs;
  }

  set<T>(key: string, value: T, ttlMs?: number): void {
    this.store.set(key, { value, expiresAt: Date.now() + (ttlMs ?? this.defaultTtlMs) });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry || Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  invalidateAll(): void {
    this.store.clear();
  }
}

const cache = new MclCache(30_000);

// ─── Anomaly detection thresholds ────────────────────────────────────────────

export const ANOMALY_THRESHOLDS = {
  /** Requests per minute that trigger a rate-spike lock */
  RATE_SPIKE_RPM: 500,
  /** Failed auth attempts before auth-flood lock */
  AUTH_FLOOD_ATTEMPTS: 20,
  /** Risk score above which AI actions must be sandboxed before execution */
  AI_SANDBOX_THRESHOLD: 60,
  /** Risk score above which AI actions need explicit super_admin approval */
  AI_APPROVAL_THRESHOLD: 40,
} as const;

// ─── Audit helper ─────────────────────────────────────────────────────────────

async function writeAuditLog(entry: MclAuditEntry): Promise<void> {
  try {
    await supabase.from('master_control_audit_log').insert({
      actor_id: entry.actor_id ?? null,
      action: entry.action,
      target_type: entry.target_type,
      target_id: entry.target_id ?? null,
      before_state: entry.before_state ?? null,
      after_state: entry.after_state ?? null,
      metadata: entry.metadata ?? {},
    });
  } catch (err) {
    console.error('[MCL] Failed to write audit log:', err);
  }
}

// ─── Kill-switch management ───────────────────────────────────────────────────

/**
 * Engage (disable) a kill-switch for the given scope/key.
 * Only callable by super_admin / boss_owner (enforced by RLS).
 */
export async function engageKillSwitch(
  switchKey: string,
  reason: string,
  actorId: string,
): Promise<{ success: boolean; error?: string }> {
  const { data: existing, error: fetchErr } = await supabase
    .from('master_control_switches')
    .select('*')
    .eq('switch_key', switchKey)
    .maybeSingle();

  if (fetchErr) return { success: false, error: fetchErr.message };

  const beforeState = existing ?? undefined;

  const { error } = await supabase
    .from('master_control_switches')
    .upsert(
      {
        switch_key: switchKey,
        scope: (existing?.scope as KillSwitchScope) ?? 'global',
        is_active: false,
        reason,
        activated_by: actorId,
        activated_at: new Date().toISOString(),
      },
      { onConflict: 'switch_key' },
    );

  if (error) return { success: false, error: error.message };

  cache.invalidate(`ks:${switchKey}`);
  cache.invalidate('ks:global');

  await writeAuditLog({
    actor_id: actorId,
    action: 'KILL_SWITCH_ENGAGED',
    target_type: 'kill_switch',
    before_state: beforeState as Record<string, unknown> | undefined,
    after_state: { switch_key: switchKey, is_active: false, reason },
    metadata: { switch_key: switchKey },
  });

  return { success: true };
}

/**
 * Disengage (re-enable) a kill-switch.
 */
export async function disengageKillSwitch(
  switchKey: string,
  actorId: string,
): Promise<{ success: boolean; error?: string }> {
  const { data: existing } = await supabase
    .from('master_control_switches')
    .select('*')
    .eq('switch_key', switchKey)
    .maybeSingle();

  const { error } = await supabase
    .from('master_control_switches')
    .update({
      is_active: true,
      deactivated_by: actorId,
      deactivated_at: new Date().toISOString(),
    })
    .eq('switch_key', switchKey);

  if (error) return { success: false, error: error.message };

  cache.invalidate(`ks:${switchKey}`);
  cache.invalidate('ks:global');

  await writeAuditLog({
    actor_id: actorId,
    action: 'KILL_SWITCH_DISENGAGED',
    target_type: 'kill_switch',
    before_state: existing as Record<string, unknown> | undefined,
    after_state: { switch_key: switchKey, is_active: true },
    metadata: { switch_key: switchKey },
  });

  return { success: true };
}

/**
 * Check whether a kill-switch is currently engaged (is_active = false).
 * Results are cached for 30 s.
 */
export async function isKillSwitchEngaged(switchKey: string): Promise<boolean> {
  const cacheKey = `ks:${switchKey}`;
  const cached = cache.get<boolean>(cacheKey);
  if (cached !== null) return cached;

  const { data, error } = await supabase
    .from('master_control_switches')
    .select('is_active')
    .eq('switch_key', switchKey)
    .maybeSingle();

  if (error || !data) return false;

  const engaged = !data.is_active;
  cache.set(cacheKey, engaged);
  return engaged;
}

/**
 * Engage the emergency read-only global mode.
 */
export async function engageEmergencyReadOnly(
  reason: string,
  actorId: string,
): Promise<{ success: boolean; error?: string }> {
  return engageKillSwitch('readonly_emergency', reason, actorId);
}

/**
 * Returns true when the system is in emergency read-only mode.
 */
export async function isEmergencyReadOnly(): Promise<boolean> {
  return isKillSwitchEngaged('readonly_emergency');
}

// ─── Production write-protection ─────────────────────────────────────────────

async function fetchWriteProtection(
  resourceKey: string,
): Promise<{ is_protected: boolean; whitelist: string[] } | null> {
  const { data } = await supabase
    .from('production_write_protections')
    .select('is_protected, whitelist')
    .eq('resource_key', resourceKey)
    .maybeSingle();
  return data as { is_protected: boolean; whitelist: string[] } | null;
}

/**
 * Check if a write to `resourceKey` is allowed for `userId`.
 * A resource is blocked when protected AND the user is not on the whitelist.
 */
export async function isWriteAllowed(
  resourceKey: string,
  userId: string,
): Promise<boolean> {
  // Reject all writes when emergency read-only is engaged.
  if (await isEmergencyReadOnly()) return false;

  const cacheKey = `wp:${resourceKey}`;
  const cached = cache.get<{ is_protected: boolean; whitelist: string[] }>(cacheKey);
  let row = cached;
  if (!row) {
    row = await fetchWriteProtection(resourceKey);
    if (row) cache.set(cacheKey, row);
  }

  if (!row || !row.is_protected) return true;

  const whitelist: string[] = Array.isArray(row.whitelist) ? row.whitelist : [];
  return whitelist.includes(userId);
}

// ─── Anomaly detection & auto-locking ────────────────────────────────────────

/**
 * Record a detected anomaly and lock the resource automatically.
 */
export async function recordAnomalyAndLock(
  resourceKey: string,
  anomalyType: string,
  severity: AnomalySeverity,
  evidence: Record<string, unknown>,
): Promise<{ locked: boolean; lockId?: string; error?: string }> {
  const { data, error } = await supabase
    .from('anomaly_locks')
    .insert({
      resource_key: resourceKey,
      anomaly_type: anomalyType,
      severity,
      is_locked: true,
      evidence,
    })
    .select('id')
    .single();

  if (error) return { locked: false, error: error.message };

  cache.invalidate(`anomaly:${resourceKey}`);

  await writeAuditLog({
    action: 'ANOMALY_LOCK_CREATED',
    target_type: 'anomaly_lock',
    target_id: data.id,
    after_state: { resource_key: resourceKey, anomaly_type: anomalyType, severity },
    metadata: { evidence },
  });

  return { locked: true, lockId: data.id };
}

/**
 * Returns true if the resource currently has an active anomaly lock.
 */
export async function isResourceLocked(resourceKey: string): Promise<boolean> {
  const cacheKey = `anomaly:${resourceKey}`;
  const cached = cache.get<boolean>(cacheKey);
  if (cached !== null) return cached;

  const { data } = await supabase
    .from('anomaly_locks')
    .select('id')
    .eq('resource_key', resourceKey)
    .eq('is_locked', true)
    .limit(1)
    .maybeSingle();

  const locked = !!data;
  cache.set(cacheKey, locked, 15_000);
  return locked;
}

/**
 * Resolve (unlock) an anomaly lock – super_admin only (enforced by RLS).
 */
export async function resolveAnomalyLock(
  lockId: string,
  actorId: string,
): Promise<{ success: boolean; error?: string }> {
  const { data: existing } = await supabase
    .from('anomaly_locks')
    .select('*')
    .eq('id', lockId)
    .maybeSingle();

  const { error } = await supabase
    .from('anomaly_locks')
    .update({
      is_locked: false,
      resolved: true,
      unlocked_by: actorId,
      unlocked_at: new Date().toISOString(),
    })
    .eq('id', lockId);

  if (error) return { success: false, error: error.message };

  if (existing?.resource_key) cache.invalidate(`anomaly:${existing.resource_key}`);

  await writeAuditLog({
    actor_id: actorId,
    action: 'ANOMALY_LOCK_RESOLVED',
    target_type: 'anomaly_lock',
    target_id: lockId,
    before_state: existing as Record<string, unknown> | undefined,
    after_state: { is_locked: false, resolved: true },
  });

  return { success: true };
}

// ─── AI action approval threshold ────────────────────────────────────────────

/**
 * Submit an AI-generated action for threshold-based review.
 *
 * - risk_score < APPROVAL_THRESHOLD  → auto-approved
 * - risk_score < SANDBOX_THRESHOLD   → needs explicit approval (PENDING)
 * - risk_score >= SANDBOX_THRESHOLD  → sandboxed; cannot run without approval
 */
export async function submitAiActionForApproval(
  actionType: string,
  payload: Record<string, unknown>,
  riskScore: number,
  requestedBy?: string,
): Promise<{ approvalId: string; status: ApprovalStatus; error?: string }> {
  let initialStatus: ApprovalStatus;

  if (riskScore >= ANOMALY_THRESHOLDS.AI_SANDBOX_THRESHOLD) {
    initialStatus = 'SANDBOXED';
  } else if (riskScore >= ANOMALY_THRESHOLDS.AI_APPROVAL_THRESHOLD) {
    initialStatus = 'PENDING';
  } else {
    initialStatus = 'APPROVED';
  }

  const { data, error } = await supabase
    .from('ai_action_approvals')
    .insert({
      action_type: actionType,
      payload,
      risk_score: riskScore,
      status: initialStatus,
      requested_by: requestedBy ?? null,
      expires_at: new Date(Date.now() + 3_600_000).toISOString(),
    })
    .select('id, status')
    .single();

  if (error) return { approvalId: '', status: 'REJECTED', error: error.message };

  await writeAuditLog({
    actor_id: requestedBy,
    action: 'AI_ACTION_SUBMITTED',
    target_type: 'ai_approval',
    target_id: data.id,
    after_state: { action_type: actionType, risk_score: riskScore, status: initialStatus },
  });

  return { approvalId: data.id, status: data.status as ApprovalStatus };
}

/**
 * Approve or reject a pending AI action (super_admin only).
 */
export async function reviewAiAction(
  approvalId: string,
  decision: 'APPROVED' | 'REJECTED',
  reviewerId: string,
  reviewNotes?: string,
): Promise<{ success: boolean; error?: string }> {
  const { data: existing } = await supabase
    .from('ai_action_approvals')
    .select('*')
    .eq('id', approvalId)
    .maybeSingle();

  const { error } = await supabase
    .from('ai_action_approvals')
    .update({
      status: decision,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
      review_notes: reviewNotes ?? null,
    })
    .eq('id', approvalId)
    .in('status', ['PENDING', 'SANDBOXED']);

  if (error) return { success: false, error: error.message };

  await writeAuditLog({
    actor_id: reviewerId,
    action: `AI_ACTION_${decision}`,
    target_type: 'ai_approval',
    target_id: approvalId,
    before_state: existing as Record<string, unknown> | undefined,
    after_state: { status: decision, review_notes: reviewNotes },
  });

  return { success: true };
}

// ─── Command sandboxing ───────────────────────────────────────────────────────

/**
 * Execute a sandboxed command.
 *
 * Before execution:
 *  1. If the global kill-switch is engaged → blocked.
 *  2. If the resource is anomaly-locked → blocked.
 *  3. If an approval_id is provided, verify it is APPROVED.
 *  4. Executes the provided `executor` function.
 *
 * All outcomes are recorded in command_sandbox_log.
 */
export async function executeSandboxedCommand(
  command: SandboxCommand,
  executor: () => Promise<unknown>,
  actorId?: string,
): Promise<{ success: boolean; output?: unknown; blocked?: boolean; blockReason?: string; error?: string }> {
  // 1. Global kill-switch check
  if (await isKillSwitchEngaged('global')) {
    const blockReason = 'Global kill-switch is engaged';
    await logSandboxExecution(command, 'BLOCKED', actorId, blockReason);
    return { success: false, blocked: true, blockReason };
  }

  // 2. Anomaly lock check
  const resourceKeyFromPayload = command.command_payload?.['resource_key'];
  if (resourceKeyFromPayload) {
    const resKey = String(resourceKeyFromPayload);
    if (await isResourceLocked(resKey)) {
      const blockReason = `Resource "${resKey}" is locked due to detected anomaly`;
      await logSandboxExecution(command, 'BLOCKED', actorId, blockReason);
      return { success: false, blocked: true, blockReason };
    }
  }

  // 3. Approval gate
  if (command.approval_id) {
    const { data: approval } = await supabase
      .from('ai_action_approvals')
      .select('status, expires_at')
      .eq('id', command.approval_id)
      .maybeSingle();

    const expired = approval && new Date(approval.expires_at) <= new Date();
    if (!approval || approval.status !== 'APPROVED' || expired) {
      const blockReason = expired
        ? 'Approval has expired'
        : `Approval status is "${approval?.status ?? 'not found'}" – must be APPROVED`;
      await logSandboxExecution(command, 'BLOCKED', actorId, blockReason);
      return { success: false, blocked: true, blockReason };
    }
  }

  // 4. Execute
  try {
    const output = await executor();
    await logSandboxExecution(command, 'EXECUTED', actorId, undefined, output);
    return { success: true, output };
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    await logSandboxExecution(command, 'FAILED', actorId, errMsg);
    return { success: false, error: errMsg };
  }
}

async function logSandboxExecution(
  command: SandboxCommand,
  status: SandboxExecutionStatus,
  actorId?: string,
  blockReason?: string,
  output?: unknown,
): Promise<void> {
  try {
    const { data } = await supabase
      .from('command_sandbox_log')
      .insert({
        approval_id: command.approval_id ?? null,
        command_type: command.command_type,
        command_payload: command.command_payload,
        execution_status: status,
        executed_by: actorId ?? null,
        executed_at: status === 'EXECUTED' ? new Date().toISOString() : null,
        block_reason: blockReason ?? null,
        output: output !== undefined ? (output as Record<string, unknown>) : null,
      })
      .select('id')
      .single();

    await writeAuditLog({
      actor_id: actorId,
      action: `SANDBOX_COMMAND_${status}`,
      target_type: 'sandbox',
      target_id: data?.id,
      after_state: {
        command_type: command.command_type,
        status,
        block_reason: blockReason,
      },
    });
  } catch (err) {
    console.error('[MCL] Failed to log sandbox execution:', err);
  }
}

// ─── API middleware enforcement ───────────────────────────────────────────────

export interface EnforcementResult {
  allowed: boolean;
  reason?: string;
  readOnly?: boolean;
}

/**
 * Central enforcement check to be called from API middleware / hooks.
 *
 * @param resourceKey  The table name or API path being accessed.
 * @param userId       The authenticated user's ID.
 * @param isWrite      Whether the operation is a write (POST/PUT/DELETE).
 */
export async function enforceControlLayer(
  resourceKey: string,
  userId: string,
  isWrite: boolean,
): Promise<EnforcementResult> {
  // Global kill-switch
  if (await isKillSwitchEngaged('global')) {
    return { allowed: false, reason: 'System is offline (global kill-switch engaged)' };
  }

  // Emergency read-only
  if (isWrite && (await isEmergencyReadOnly())) {
    return { allowed: false, readOnly: true, reason: 'System is in emergency read-only mode' };
  }

  // Anomaly lock
  if (await isResourceLocked(resourceKey)) {
    return { allowed: false, reason: `Access to "${resourceKey}" is blocked due to an anomaly lock` };
  }

  // Write protection whitelist
  if (isWrite && !(await isWriteAllowed(resourceKey, userId))) {
    return { allowed: false, reason: `Write access to "${resourceKey}" is restricted` };
  }

  return { allowed: true };
}

// ─── Real-time monitoring helper ──────────────────────────────────────────────

/**
 * Subscribe to changes on master_control_switches for real-time alerts.
 * Returns an unsubscribe function.
 */
export function subscribeToKillSwitchChanges(
  onchange: (payload: { new: KillSwitch; old: KillSwitch }) => void,
): () => void {
  const channel = supabase
    .channel('mcl-kill-switches')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'master_control_switches' },
      (payload) => {
        // Invalidate cache on any change
        cache.invalidateAll();
        onchange(payload as unknown as { new: KillSwitch; old: KillSwitch });
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Subscribe to new anomaly locks for real-time alerts.
 */
export function subscribeToAnomalyLocks(
  onlock: (lock: AnomalyLock) => void,
): () => void {
  const channel = supabase
    .channel('mcl-anomaly-locks')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'anomaly_locks' },
      (payload) => {
        cache.invalidateAll();
        onlock(payload.new as AnomalyLock);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ─── Cache management exports ─────────────────────────────────────────────────

/** Force-invalidate the entire MCL cache (e.g. after a bulk config change). */
export function invalidateMclCache(): void {
  cache.invalidateAll();
}

/** Invalidate the cache entry for a specific switch key. */
export function invalidateKillSwitchCache(switchKey: string): void {
  cache.invalidate(`ks:${switchKey}`);
}
