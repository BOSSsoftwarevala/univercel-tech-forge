/**
 * License Service
 * Core license management: generation, validation, domain/device binding, expiration.
 */

import { supabase } from '@/integrations/supabase/client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LicenseRecord {
  id: string;
  license_key: string;
  product_id: string;
  user_id?: string | null;
  order_id?: string | null;
  domain_bound?: string | null;
  device_fingerprint?: string | null;
  status: 'unused' | 'active' | 'expired' | 'revoked' | 'suspended';
  expires_at?: string | null;
  activated_at?: string | null;
  last_validated_at?: string | null;
  activation_count: number;
  max_activations: number;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}

export interface GenerateLicenseOptions {
  product_id: string;
  quantity: number;
  expires_at?: string | null;
  domain_bound?: string | null;
  max_activations?: number;
  user_id?: string | null;
  order_id?: string | null;
}

export interface ValidationResult {
  valid: boolean;
  license?: LicenseRecord;
  reason?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function generateLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments: string[] = [];
  for (let s = 0; s < 4; s++) {
    let seg = '';
    for (let i = 0; i < 4; i++) {
      seg += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    segments.push(seg);
  }
  return segments.join('-');
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

/** Fetch all licenses, optionally filtered by product or status. */
export async function fetchLicenses(filters?: {
  product_id?: string;
  status?: string;
}): Promise<LicenseRecord[]> {
  let query = supabase.from('product_licenses').select('*').order('created_at', { ascending: false });

  if (filters?.product_id && filters.product_id !== 'all') {
    query = query.eq('product_id', filters.product_id);
  }
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[LicenseService] fetchLicenses error:', error.message);
    return [];
  }
  return (data ?? []) as LicenseRecord[];
}

/** Generate and persist one or more license keys. */
export async function generateLicenses(opts: GenerateLicenseOptions): Promise<LicenseRecord[]> {
  const records = Array.from({ length: opts.quantity }, () => ({
    license_key: generateLicenseKey(),
    product_id: opts.product_id,
    user_id: opts.user_id ?? null,
    order_id: opts.order_id ?? null,
    domain_bound: opts.domain_bound ?? null,
    expires_at: opts.expires_at ?? null,
    status: 'unused' as const,
    max_activations: opts.max_activations ?? 1,
    activation_count: 0,
  }));

  const { data, error } = await supabase
    .from('product_licenses')
    .insert(records)
    .select();

  if (error) {
    console.error('[LicenseService] generateLicenses error:', error.message);
    throw new Error(error.message);
  }
  return (data ?? []) as LicenseRecord[];
}

/** Revoke a license by setting its status to 'revoked'. */
export async function revokeLicense(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('product_licenses')
    .update({ status: 'revoked', updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('[LicenseService] revokeLicense error:', error.message);
    return false;
  }
  return true;
}

// ─── Validation ───────────────────────────────────────────────────────────────

/** Validate a license key, optionally checking domain and device binding. */
export async function validateLicense(
  licenseKey: string,
  opts?: { domain?: string; deviceFingerprint?: string },
): Promise<ValidationResult> {
  const { data, error } = await supabase
    .from('product_licenses')
    .select('*')
    .eq('license_key', licenseKey)
    .single();

  if (error || !data) {
    return { valid: false, reason: 'License key not found' };
  }

  const record = data as LicenseRecord;

  if (record.status === 'revoked') return { valid: false, reason: 'License has been revoked', license: record };
  if (record.status === 'suspended') return { valid: false, reason: 'License is suspended', license: record };

  // Expiration check
  if (record.expires_at && new Date(record.expires_at) < new Date()) {
    await supabase
      .from('product_licenses')
      .update({ status: 'expired', updated_at: new Date().toISOString() })
      .eq('id', record.id);
    return { valid: false, reason: 'License has expired', license: { ...record, status: 'expired' } };
  }

  // Domain binding check
  if (record.domain_bound && opts?.domain && record.domain_bound !== opts.domain) {
    return { valid: false, reason: 'Domain not bound to this license', license: record };
  }

  // Device binding check (first activation binds device)
  if (opts?.deviceFingerprint) {
    if (record.device_fingerprint && record.device_fingerprint !== opts.deviceFingerprint) {
      return { valid: false, reason: 'Device not bound to this license', license: record };
    }
    if (!record.device_fingerprint) {
      // Bind device on first use
      await supabase
        .from('product_licenses')
        .update({
          device_fingerprint: opts.deviceFingerprint,
          status: 'active',
          activated_at: record.activated_at ?? new Date().toISOString(),
          activation_count: record.activation_count + 1,
          last_validated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', record.id);
    }
  }

  // Update last validated timestamp
  await supabase
    .from('product_licenses')
    .update({ last_validated_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', record.id);

  return { valid: true, license: record };
}

/** Activate a license key (sets status to 'active' and records activation timestamp). */
export async function activateLicense(
  licenseKey: string,
  opts?: { domain?: string; deviceFingerprint?: string; userId?: string },
): Promise<ValidationResult> {
  const check = await validateLicense(licenseKey, opts);
  if (!check.valid) return check;

  const record = check.license!;
  if (record.activation_count >= record.max_activations) {
    return { valid: false, reason: 'Activation limit reached', license: record };
  }

  const { error } = await supabase
    .from('product_licenses')
    .update({
      status: 'active',
      activated_at: record.activated_at ?? new Date().toISOString(),
      activation_count: record.activation_count + 1,
      domain_bound: opts?.domain ?? record.domain_bound,
      device_fingerprint: opts?.deviceFingerprint ?? record.device_fingerprint,
      user_id: opts?.userId ?? record.user_id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', record.id);

  if (error) {
    console.error('[LicenseService] activateLicense error:', error.message);
    return { valid: false, reason: error.message };
  }
  return { valid: true, license: { ...record, status: 'active' } };
}
