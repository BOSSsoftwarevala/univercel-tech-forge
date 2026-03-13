/**
 * Client-Side Rate Limiter
 *
 * Provides in-memory per-IP and per-user rate limiting for the frontend layer.
 * Heavy-duty enforcement happens server-side; this prevents obvious abuse from
 * reaching the API at all.
 *
 * Limits:
 *  - Orders: 5 per IP per hour
 *  - Orders: 10 per user per day
 *  - API calls: configurable
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export const LIMITS: Record<string, RateLimitConfig> = {
  /** 5 orders per IP per hour */
  order_ip: { maxRequests: 5, windowMs: 60 * 60 * 1000 },
  /** 10 orders per user per day */
  order_user: { maxRequests: 10, windowMs: 24 * 60 * 60 * 1000 },
  /** 3 payment attempts per user per minute */
  payment_user: { maxRequests: 3, windowMs: 60 * 1000 },
  /** Default API calls: 60 per minute */
  default: { maxRequests: 60, windowMs: 60 * 1000 },
};

/**
 * Check whether the caller is within the allowed rate limit.
 *
 * @param identifier  Key such as IP address or user ID
 * @param limitType   One of the keys defined in LIMITS
 */
export function checkRateLimit(
  identifier: string,
  limitType: keyof typeof LIMITS = 'default',
): { allowed: boolean; remaining: number; resetIn: number } {
  const config = LIMITS[limitType] ?? LIMITS.default;
  const key = `${limitType}:${identifier}`;
  const now = Date.now();

  let entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + config.windowMs };
  }

  entry.count += 1;
  store.set(key, entry);

  // Prune stale entries to avoid unbounded memory growth
  if (store.size > 5000) pruneExpired();

  const remaining = Math.max(0, config.maxRequests - entry.count);
  const resetIn = Math.max(0, entry.resetAt - now);

  return { allowed: entry.count <= config.maxRequests, remaining, resetIn };
}

/** Remove entries whose window has expired. */
function pruneExpired(): void {
  const now = Date.now();
  for (const [k, v] of store.entries()) {
    if (now >= v.resetAt) store.delete(k);
  }
}

/** Reset the counter for a given identifier + limit type (e.g. after success). */
export function resetLimit(identifier: string, limitType: keyof typeof LIMITS = 'default'): void {
  store.delete(`${limitType}:${identifier}`);
}

/** Returns remaining allowed requests without incrementing the counter. */
export function peekLimit(
  identifier: string,
  limitType: keyof typeof LIMITS = 'default',
): { remaining: number; resetIn: number } {
  const config = LIMITS[limitType] ?? LIMITS.default;
  const key = `${limitType}:${identifier}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    return { remaining: config.maxRequests, resetIn: config.windowMs };
  }

  return {
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetIn: Math.max(0, entry.resetAt - now),
  };
}
