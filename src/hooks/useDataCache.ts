/**
 * SMOOTH-05: Data Loading & Caching Hook
 * Cache read-only data, lazy-load heavy modules, prevent UI freeze
 */

import { useCallback, useRef, useMemo } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheConfig {
  defaultTTL?: number;      // Default cache TTL in ms (5 minutes)
  maxEntries?: number;      // Max cache entries (LRU eviction)
  enablePersist?: boolean;  // Persist to sessionStorage
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_ENTRIES = 100;

class DataCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private accessOrder: string[] = [];
  private maxEntries: number;
  private enablePersist: boolean;
  private storageKey = 'app_data_cache';

  constructor(config: CacheConfig = {}) {
    this.maxEntries = config.maxEntries || MAX_ENTRIES;
    this.enablePersist = config.enablePersist || false;
    
    if (this.enablePersist) {
      this.loadFromStorage();
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = sessionStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([key, entry]) => {
          const typedEntry = entry as CacheEntry<unknown>;
          if (Date.now() - typedEntry.timestamp < typedEntry.ttl) {
            this.cache.set(key, typedEntry);
            this.accessOrder.push(key);
          }
        });
      }
    } catch {
      // Silent fail
    }
  }

  private saveToStorage(): void {
    if (!this.enablePersist) return;
    try {
      const data: Record<string, CacheEntry<unknown>> = {};
      this.cache.forEach((entry, key) => {
        data[key] = entry;
      });
      sessionStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch {
      // Silent fail
    }
  }

  private evictLRU(): void {
    while (this.cache.size >= this.maxEntries && this.accessOrder.length > 0) {
      const oldest = this.accessOrder.shift();
      if (oldest) {
        this.cache.delete(oldest);
      }
    }
  }

  private updateAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    this.accessOrder.push(key);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) return null;
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    this.updateAccessOrder(key);
    return entry.data;
  }

  set<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
    this.evictLRU();
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
    
    this.updateAccessOrder(key);
    this.saveToStorage();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    this.saveToStorage();
  }

  invalidatePattern(pattern: string | RegExp): void {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    const keysToDelete: string[] = [];
    
    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.invalidate(key));
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    if (this.enablePersist) {
      sessionStorage.removeItem(this.storageKey);
    }
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Singleton cache instance
const globalCache = new DataCache({ enablePersist: true });

export function useDataCache() {
  const cacheRef = useRef(globalCache);

  const getCached = useCallback(<T>(key: string): T | null => {
    return cacheRef.current.get<T>(key);
  }, []);

  const setCached = useCallback(<T>(key: string, data: T, ttl?: number): void => {
    cacheRef.current.set(key, data, ttl);
  }, []);

  const fetchWithCache = useCallback(async <T>(
    key: string,
    fetcher: () => Promise<T>,
    options: { ttl?: number; forceRefresh?: boolean } = {}
  ): Promise<T> => {
    const { ttl = DEFAULT_TTL, forceRefresh = false } = options;

    // Check cache first
    if (!forceRefresh) {
      const cached = cacheRef.current.get<T>(key);
      if (cached !== null) {
        return cached;
      }
    }

    // Fetch fresh data
    const data = await fetcher();
    cacheRef.current.set(key, data, ttl);
    return data;
  }, []);

  const invalidate = useCallback((key: string): void => {
    cacheRef.current.invalidate(key);
  }, []);

  const invalidatePattern = useCallback((pattern: string | RegExp): void => {
    cacheRef.current.invalidatePattern(pattern);
  }, []);

  const clearAll = useCallback((): void => {
    cacheRef.current.clear();
  }, []);

  const stats = useMemo(() => cacheRef.current.getStats(), []);

  return {
    getCached,
    setCached,
    fetchWithCache,
    invalidate,
    invalidatePattern,
    clearAll,
    stats
  };
}

export { globalCache };
