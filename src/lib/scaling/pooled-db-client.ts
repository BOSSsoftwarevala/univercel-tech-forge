/**
 * Pooled Database Client
 * In-memory cache layer for Supabase read queries, simulating PgBouncer/Redis
 * pooling behaviour on the client side.
 *
 * PgBouncer configuration for the server side is managed via Supabase's
 * built-in connection pooling (transaction mode, max_client_conn = 10 000).
 */

import { SupabaseClient } from '@supabase/supabase-js';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

/**
 * Pooled database client with TTL-based in-memory caching.
 *
 * Usage:
 *   const client = new PooledDatabaseClient();
 *   const data = await client.query('franchise:all', 60, () =>
 *     supabase.from('franchise_accounts').select('*')
 *   );
 */
export class PooledDatabaseClient {
  private cache = new Map<string, CacheEntry<unknown>>();
  private maxSize: number;

  constructor(maxSize = 500) {
    this.maxSize = maxSize;
  }

  /**
   * Try the in-memory cache first; execute queryFn on a miss and cache the result.
   *
   * @param key  - Unique cache key for this query
   * @param ttl  - Time-to-live in seconds
   * @param queryFn - Async function that returns the data to cache
   */
  async query<T>(key: string, ttl: number, queryFn: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key) as CacheEntry<T> | undefined;

    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }

    const result = await queryFn();

    // Evict oldest expired entry first, then oldest insertion if still at capacity
    if (this.cache.size >= this.maxSize) {
      const now = Date.now();
      let evictKey: string | undefined;
      for (const [k, v] of this.cache.entries()) {
        if (v.expiresAt <= now) {
          evictKey = k;
          break;
        }
      }
      if (evictKey === undefined) {
        evictKey = this.cache.keys().next().value;
      }
      if (evictKey !== undefined) {
        this.cache.delete(evictKey);
      }
    }

    this.cache.set(key, { data: result, expiresAt: Date.now() + ttl * 1000 });
    return result;
  }

  /** Remove a specific key from the cache. */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /** Remove all keys that start with the given prefix. */
  invalidatePrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /** Clear the entire cache. */
  clear(): void {
    this.cache.clear();
  }

  /** Return basic cache statistics. */
  stats(): { size: number; maxSize: number } {
    return { size: this.cache.size, maxSize: this.maxSize };
  }
}

/**
 * Convenience wrapper: fetch a Supabase table with caching.
 *
 * @param supabase - Authenticated Supabase client
 * @param pool     - PooledDatabaseClient instance to use
 * @param cacheKey - Unique key for this query
 * @param ttl      - Cache TTL in seconds
 * @param queryFn  - Function returning a Supabase query builder
 */
export async function cachedSelect<T>(
  supabase: SupabaseClient,
  pool: PooledDatabaseClient,
  cacheKey: string,
  ttl: number,
  queryFn: (client: SupabaseClient) => PromiseLike<{ data: T | null; error: unknown }>
): Promise<{ data: T | null; error: unknown }> {
  return pool.query(cacheKey, ttl, async () => {
    const result = await queryFn(supabase);
    if (result.error) throw result.error;
    return result as { data: T | null; error: unknown };
  });
}

/** Shared singleton instance for application-wide use. */
export const pooledDbClient = new PooledDatabaseClient();
