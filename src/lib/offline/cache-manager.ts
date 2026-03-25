/**
 * Cache Manager
 * Manages API response caching with TTL and size limits
 */

import { indexedDB } from './indexed-db';

interface CacheEntry<T = unknown> {
  key: string;
  data: T;
  timestamp: number;
  expires_at: number;
  size: number;
}

interface CacheConfig {
  maxSize: number; // bytes
  defaultTTL: number; // seconds
  cleanupInterval: number; // ms
}

const DEFAULT_CONFIG: CacheConfig = {
  maxSize: 50 * 1024 * 1024, // 50MB
  defaultTTL: 300, // 5 minutes
  cleanupInterval: 60000 // 1 minute
};

class CacheManager {
  private config: CacheConfig;
  private cleanupTimer: number | null = null;
  private currentSize = 0;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.startCleanup();
    this.calculateCurrentSize();
  }

  private async calculateCurrentSize(): Promise<void> {
    try {
      const entries = await indexedDB.getAll<CacheEntry>('cache');
      this.currentSize = entries.reduce((sum, entry) => sum + entry.size, 0);
    } catch {
      this.currentSize = 0;
    }
  }

  private startCleanup(): void {
    this.cleanupTimer = window.setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  private async cleanup(): Promise<void> {
    try {
      const deleted = await indexedDB.deleteExpired('cache', 'expires_at');
      if (deleted > 0) {
        await this.calculateCurrentSize();
      }
    } catch (error) {
      console.warn('Cache cleanup failed:', error);
    }
  }

  private estimateSize(data: unknown): number {
    const json = JSON.stringify(data);
    return new Blob([json]).size;
  }

  async get<T>(key: string): Promise<{ data: T; timestamp: number } | null> {
    try {
      const entry = await indexedDB.get<CacheEntry<T>>('cache', key);
      
      if (!entry) return null;
      
      // Check if expired
      if (entry.expires_at < Date.now()) {
        await this.delete(key);
        return null;
      }

      return { data: entry.data, timestamp: entry.timestamp };
    } catch {
      return null;
    }
  }

  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    try {
      const size = this.estimateSize(data);
      const expiresAt = Date.now() + (ttl || this.config.defaultTTL) * 1000;

      // Evict if needed
      while (this.currentSize + size > this.config.maxSize) {
        const evicted = await this.evictOldest();
        if (!evicted) break;
      }

      const entry: CacheEntry<T> = {
        key,
        data,
        timestamp: Date.now(),
        expires_at: expiresAt,
        size
      };

      await indexedDB.set('cache', entry);
      this.currentSize += size;
    } catch (error) {
      console.warn('Cache set failed:', error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const entry = await indexedDB.get<CacheEntry>('cache', key);
      if (entry) {
        this.currentSize -= entry.size;
        await indexedDB.delete('cache', key);
      }
    } catch {
      // Ignore deletion errors
    }
  }

  private async evictOldest(): Promise<boolean> {
    try {
      const entries = await indexedDB.getAll<CacheEntry>('cache');
      if (entries.length === 0) return false;

      // Sort by timestamp (oldest first)
      entries.sort((a, b) => a.timestamp - b.timestamp);
      
      const oldest = entries[0];
      await this.delete(oldest.key);
      return true;
    } catch {
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      await indexedDB.clear('cache');
      this.currentSize = 0;
    } catch {
      // Ignore clear errors
    }
  }

  async getStats(): Promise<{ entries: number; size: number; maxSize: number }> {
    const count = await indexedDB.count('cache');
    return {
      entries: count,
      size: this.currentSize,
      maxSize: this.config.maxSize
    };
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
  }
}

export const cacheManager = new CacheManager();
