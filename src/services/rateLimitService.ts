/**
 * Rate Limit Service
 * IP-based and user-level request throttling with Supabase logging.
 */

import { supabase } from '@/integrations/supabase/client';

// ─── Configuration ────────────────────────────────────────────────────────────

export interface RateLimitConfig {
  /** Maximum requests allowed in the time window */
  maxRequests: number;
  /** Time window size in seconds */
  windowSeconds: number;
  /** How long to block the identifier after exceeding limit (seconds) */
  blockDurationSeconds?: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 100,
  windowSeconds: 60,
  blockDurationSeconds: 300,
};

const USER_CONFIG: RateLimitConfig = {
  maxRequests: 500,
  windowSeconds: 60,
  blockDurationSeconds: 60,
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type IdentifierType = 'ip' | 'user' | 'api_key';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  blockedUntil?: Date;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function windowStart(windowSeconds: number): Date {
  const now = new Date();
  const ms = windowSeconds * 1000;
  return new Date(Math.floor(now.getTime() / ms) * ms);
}

// ─── Core ─────────────────────────────────────────────────────────────────────

/**
 * Check and increment the request count for a given identifier.
 * Returns whether the request is allowed and how many requests remain.
 */
export async function checkRateLimit(
  identifier: string,
  identifierType: IdentifierType = 'ip',
  endpoint = '*',
  config?: Partial<RateLimitConfig>,
): Promise<RateLimitResult> {
  const cfg: RateLimitConfig = {
    ...( identifierType === 'user' ? USER_CONFIG : DEFAULT_CONFIG ),
    ...config,
  };

  const winStart = windowStart(cfg.windowSeconds);
  const winEnd = new Date(winStart.getTime() + cfg.windowSeconds * 1000);
  const now = new Date();

  // Upsert the rate limit record, incrementing the counter
  const { data, error } = await supabase
    .from('api_rate_limits')
    .upsert(
      {
        identifier,
        identifier_type: identifierType,
        endpoint,
        window_start: winStart.toISOString(),
        window_end: winEnd.toISOString(),
        request_count: 1,
        updated_at: now.toISOString(),
      },
      {
        onConflict: 'identifier,endpoint,window_start',
        ignoreDuplicates: false,
      },
    )
    .select('request_count, is_blocked, blocked_until')
    .single();

  if (error) {
    // On DB error, fail open (allow the request) and log
    console.warn('[RateLimitService] DB upsert failed, failing open:', error.message);
    return { allowed: true, remaining: cfg.maxRequests, resetAt: winEnd };
  }

  // If already blocked, check whether block has expired
  if (data.is_blocked) {
    const blockedUntil = data.blocked_until ? new Date(data.blocked_until) : winEnd;
    if (now < blockedUntil) {
      return { allowed: false, remaining: 0, resetAt: winEnd, blockedUntil };
    }
    // Block expired — clear it
    await supabase
      .from('api_rate_limits')
      .update({ is_blocked: false, blocked_until: null, updated_at: now.toISOString() })
      .eq('identifier', identifier)
      .eq('endpoint', endpoint)
      .eq('window_start', winStart.toISOString());
  }

  // Use a raw increment via RPC if available; otherwise fallback to read + write
  const { data: updData, error: incrError } = await supabase.rpc('increment_rate_limit_counter', {
    p_identifier: identifier,
    p_endpoint: endpoint,
    p_window_start: winStart.toISOString(),
  });

  const requestCount: number = incrError
    ? (data.request_count ?? 1)
    : ((updData as number | null) ?? data.request_count ?? 1);

  const exceeded = requestCount > cfg.maxRequests;

  if (exceeded && cfg.blockDurationSeconds) {
    const blockedUntil = new Date(now.getTime() + cfg.blockDurationSeconds * 1000);
    await supabase
      .from('api_rate_limits')
      .update({
        is_blocked: true,
        blocked_until: blockedUntil.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('identifier', identifier)
      .eq('endpoint', endpoint)
      .eq('window_start', winStart.toISOString());

    return { allowed: false, remaining: 0, resetAt: winEnd, blockedUntil };
  }

  return {
    allowed: !exceeded,
    remaining: Math.max(0, cfg.maxRequests - requestCount),
    resetAt: winEnd,
  };
}

/**
 * Check if an identifier is currently blocked without incrementing the counter.
 */
export async function isBlocked(
  identifier: string,
  endpoint = '*',
): Promise<{ blocked: boolean; blockedUntil?: Date }> {
  const { data, error } = await supabase
    .from('api_rate_limits')
    .select('is_blocked, blocked_until')
    .eq('identifier', identifier)
    .eq('endpoint', endpoint)
    .gte('window_end', new Date().toISOString())
    .order('window_start', { ascending: false })
    .limit(1)
    .single();

  if (error || !data || !data.is_blocked) return { blocked: false };

  const blockedUntil = data.blocked_until ? new Date(data.blocked_until) : undefined;
  if (blockedUntil && new Date() > blockedUntil) return { blocked: false };

  return { blocked: true, blockedUntil };
}

/**
 * Clear all rate limit records for a given identifier (admin use).
 */
export async function clearRateLimits(identifier: string): Promise<boolean> {
  const { error } = await supabase
    .from('api_rate_limits')
    .delete()
    .eq('identifier', identifier);

  if (error) {
    console.error('[RateLimitService] clearRateLimits error:', error.message);
    return false;
  }
  return true;
}
