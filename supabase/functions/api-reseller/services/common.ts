export interface ServiceUser {
  userId: string;
  role: string;
  email: string;
}

type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

const cache = new Map<string, CacheEntry<unknown>>();

export function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }

  if (entry.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }

  return entry.value as T;
}

export function setCache<T>(key: string, value: T, ttlMs = 30_000) {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function clearCacheByPrefix(prefix: string) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

export function isManagerRole(role: string) {
  return ['boss_owner', 'super_admin', 'ceo', 'admin', 'reseller_manager', 'finance_manager', 'franchise'].includes(role);
}

export async function resolveResellerId(supabaseAdmin: any, userId: string) {
  const { data, error } = await supabaseAdmin
    .from('resellers')
    .select('id')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data?.id ?? null;
}

export function getPagination(url: URL, defaultLimit = 12, maxLimit = 50) {
  const page = Math.max(Number(url.searchParams.get('page') || '1'), 1);
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || String(defaultLimit)), 1), maxLimit);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function toNumber(value: unknown) {
  return Number(value ?? 0) || 0;
}

export function parseJsonBody<T = Record<string, unknown>>(body: unknown): T {
  return (body || {}) as T;
}