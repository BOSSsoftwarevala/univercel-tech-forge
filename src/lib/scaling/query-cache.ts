/**
 * Query Cache with TTL and Invalidation
 * Optimizes database read performance for high-volume usage
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  hitCount: number;
  tags: string[];
}

interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
  cleanupInterval: number;
}

// Multi-tier cache with LRU eviction
export class QueryCache<T = unknown> {
  private cache = new Map<string, CacheEntry<T>>();
  private accessOrder: string[] = [];
  private config: CacheConfig;
  private tagIndex = new Map<string, Set<string>>();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    invalidations: 0,
  };
  
  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: config.defaultTTL || 60000, // 1 minute default
      maxSize: config.maxSize || 1000,
      cleanupInterval: config.cleanupInterval || 30000,
    };
    
    this.startCleanup();
  }
  
  private generateKey(query: string, params?: Record<string, unknown>): string {
    const paramsStr = params ? JSON.stringify(params) : '';
    return `${query}:${paramsStr}`;
  }
  
  get(query: string, params?: Record<string, unknown>): T | null {
    const key = this.generateKey(query, params);
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }
    
    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.delete(key);
      this.stats.misses++;
      return null;
    }
    
    // Update access order (LRU)
    this.updateAccessOrder(key);
    entry.hitCount++;
    this.stats.hits++;
    
    return entry.data;
  }
  
  set(
    query: string,
    params: Record<string, unknown> | undefined,
    data: T,
    options: { ttl?: number; tags?: string[] } = {}
  ): void {
    const key = this.generateKey(query, params);
    const ttl = options.ttl || this.config.defaultTTL;
    const tags = options.tags || [];
    
    // Evict if at capacity
    while (this.cache.size >= this.config.maxSize) {
      this.evictLRU();
    }
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
      hitCount: 0,
      tags,
    };
    
    this.cache.set(key, entry);
    this.updateAccessOrder(key);
    
    // Update tag index
    for (const tag of tags) {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(key);
    }
  }
  
  private updateAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    this.accessOrder.push(key);
  }
  
  private evictLRU(): void {
    const lruKey = this.accessOrder.shift();
    if (lruKey) {
      this.delete(lruKey);
      this.stats.evictions++;
    }
  }
  
  private delete(key: string): void {
    const entry = this.cache.get(key);
    if (entry) {
      // Remove from tag index
      for (const tag of entry.tags) {
        this.tagIndex.get(tag)?.delete(key);
      }
      this.cache.delete(key);
    }
    
    const accessIndex = this.accessOrder.indexOf(key);
    if (accessIndex > -1) {
      this.accessOrder.splice(accessIndex, 1);
    }
  }
  
  invalidate(query: string, params?: Record<string, unknown>): void {
    const key = this.generateKey(query, params);
    this.delete(key);
    this.stats.invalidations++;
  }
  
  invalidateByTag(tag: string): number {
    const keys = this.tagIndex.get(tag);
    if (!keys) return 0;
    
    let count = 0;
    for (const key of keys) {
      this.delete(key);
      count++;
    }
    
    this.tagIndex.delete(tag);
    this.stats.invalidations += count;
    return count;
  }
  
  invalidatePattern(pattern: RegExp): number {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.delete(key);
        count++;
      }
    }
    this.stats.invalidations += count;
    return count;
  }
  
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now > entry.expiresAt) {
          this.delete(key);
        }
      }
    }, this.config.cleanupInterval);
  }
  
  getStats(): {
    size: number;
    hits: number;
    misses: number;
    hitRate: number;
    evictions: number;
    invalidations: number;
  } {
    const total = this.stats.hits + this.stats.misses;
    return {
      size: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: total > 0 ? this.stats.hits / total : 0,
      evictions: this.stats.evictions,
      invalidations: this.stats.invalidations,
    };
  }
  
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    this.tagIndex.clear();
  }
  
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }
}

// Pre-configured caches for different data types
export const queryCache = new QueryCache({
  defaultTTL: 60000, // 1 minute
  maxSize: 2000,
});

export const walletCache = new QueryCache({
  defaultTTL: 5000, // 5 seconds (financial data needs freshness)
  maxSize: 500,
});

export const userCache = new QueryCache({
  defaultTTL: 300000, // 5 minutes
  maxSize: 1000,
});

export const demoCache = new QueryCache({
  defaultTTL: 120000, // 2 minutes
  maxSize: 500,
});

export const leadCache = new QueryCache({
  defaultTTL: 30000, // 30 seconds
  maxSize: 2000,
});

// Cache-through helper for Supabase queries
export async function cachedQuery<T>(
  cache: QueryCache<T>,
  cacheKey: string,
  queryFn: () => Promise<T>,
  options: { ttl?: number; tags?: string[]; skipCache?: boolean } = {}
): Promise<T> {
  if (!options.skipCache) {
    const cached = cache.get(cacheKey);
    if (cached !== null) {
      return cached;
    }
  }
  
  const data = await queryFn();
  cache.set(cacheKey, undefined, data, options);
  return data;
}

// Batch cache operations
export function batchInvalidate(tags: string[]): void {
  for (const tag of tags) {
    queryCache.invalidateByTag(tag);
    walletCache.invalidateByTag(tag);
    userCache.invalidateByTag(tag);
    demoCache.invalidateByTag(tag);
    leadCache.invalidateByTag(tag);
  }
}
