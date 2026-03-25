// IndexedDB wrapper for offline caching

const DB_NAME = 'software_vala_cache';
const DB_VERSION = 1;

interface CacheEntry<T = unknown> {
  key: string;
  data: T;
  timestamp: number;
  expiresAt: number;
  category: string;
}

class IndexedDBCache {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<IDBDatabase> | null = null;

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('cache')) {
          const store = db.createObjectStore('cache', { keyPath: 'key' });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('expiresAt', 'expiresAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('offline_queue')) {
          db.createObjectStore('offline_queue', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('api_cache')) {
          const apiStore = db.createObjectStore('api_cache', { keyPath: 'url' });
          apiStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });

    return this.initPromise;
  }

  async set<T>(key: string, data: T, category: string = 'general', ttlSeconds: number = 3600): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');

      const entry: CacheEntry<T> = {
        key,
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + (ttlSeconds * 1000),
        category,
      };

      store.put(entry);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const db = await this.getDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['cache'], 'readonly');
        const store = transaction.objectStore('cache');
        const request = store.get(key);

        request.onsuccess = () => {
          const entry = request.result as CacheEntry<T> | undefined;
          if (!entry) {
            resolve(null);
            return;
          }

          // Check expiration
          if (entry.expiresAt < Date.now()) {
            this.delete(key); // Clean up expired entry
            resolve(null);
            return;
          }

          resolve(entry.data);
        };

        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      store.delete(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async clearCategory(category: string): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const index = store.index('category');
      const request = index.openCursor(IDBKeyRange.only(category));

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
    } catch (error) {
      console.error('Cache clear category error:', error);
    }
  }

  async clearExpired(): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const index = store.index('expiresAt');
      const request = index.openCursor(IDBKeyRange.upperBound(Date.now()));

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
    } catch (error) {
      console.error('Cache clear expired error:', error);
    }
  }

  async clearAll(): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      store.clear();
    } catch (error) {
      console.error('Cache clear all error:', error);
    }
  }

  // API response caching
  async cacheApiResponse(url: string, response: unknown, ttlSeconds: number = 300): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(['api_cache'], 'readwrite');
      const store = transaction.objectStore('api_cache');

      store.put({
        url,
        data: response,
        timestamp: Date.now(),
        expiresAt: Date.now() + (ttlSeconds * 1000),
      });
    } catch (error) {
      console.error('API cache set error:', error);
    }
  }

  async getCachedApiResponse<T>(url: string): Promise<T | null> {
    try {
      const db = await this.getDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['api_cache'], 'readonly');
        const store = transaction.objectStore('api_cache');
        const request = store.get(url);

        request.onsuccess = () => {
          const entry = request.result;
          if (!entry || entry.expiresAt < Date.now()) {
            resolve(null);
            return;
          }
          resolve(entry.data as T);
        };

        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('API cache get error:', error);
      return null;
    }
  }

  // Offline queue for pending actions
  async queueOfflineAction(action: {
    type: string;
    endpoint: string;
    method: string;
    body: unknown;
  }): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(['offline_queue'], 'readwrite');
      const store = transaction.objectStore('offline_queue');
      store.add({ ...action, timestamp: Date.now() });
    } catch (error) {
      console.error('Offline queue add error:', error);
    }
  }

  async getOfflineQueue(): Promise<Array<{ id: number; type: string; endpoint: string; method: string; body: unknown }>> {
    try {
      const db = await this.getDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['offline_queue'], 'readonly');
        const store = transaction.objectStore('offline_queue');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Offline queue get error:', error);
      return [];
    }
  }

  async clearOfflineQueue(): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(['offline_queue'], 'readwrite');
      const store = transaction.objectStore('offline_queue');
      store.clear();
    } catch (error) {
      console.error('Offline queue clear error:', error);
    }
  }

  async removeFromOfflineQueue(id: number): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(['offline_queue'], 'readwrite');
      const store = transaction.objectStore('offline_queue');
      store.delete(id);
    } catch (error) {
      console.error('Offline queue remove error:', error);
    }
  }

  // Get cache stats
  async getStats(): Promise<{ totalEntries: number; totalSize: number; categories: Record<string, number> }> {
    try {
      const db = await this.getDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['cache'], 'readonly');
        const store = transaction.objectStore('cache');
        const request = store.getAll();

        request.onsuccess = () => {
          const entries = request.result || [];
          const categories: Record<string, number> = {};
          let totalSize = 0;

          for (const entry of entries) {
            categories[entry.category] = (categories[entry.category] || 0) + 1;
            totalSize += JSON.stringify(entry.data).length;
          }

          resolve({
            totalEntries: entries.length,
            totalSize: Math.round(totalSize / 1024), // KB
            categories,
          });
        };

        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Cache stats error:', error);
      return { totalEntries: 0, totalSize: 0, categories: {} };
    }
  }
}

export const cache = new IndexedDBCache();

// React hook for cache
import { useCallback } from 'react';

export function useCache() {
  const setCache = useCallback(<T>(key: string, data: T, category?: string, ttl?: number) => {
    return cache.set(key, data, category, ttl);
  }, []);

  const getCache = useCallback(<T>(key: string) => {
    return cache.get<T>(key);
  }, []);

  const deleteCache = useCallback((key: string) => {
    return cache.delete(key);
  }, []);

  const clearCategory = useCallback((category: string) => {
    return cache.clearCategory(category);
  }, []);

  const cacheApiResponse = useCallback((url: string, response: unknown, ttl?: number) => {
    return cache.cacheApiResponse(url, response, ttl);
  }, []);

  const getCachedApiResponse = useCallback(<T>(url: string) => {
    return cache.getCachedApiResponse<T>(url);
  }, []);

  const queueOfflineAction = useCallback((action: { type: string; endpoint: string; method: string; body: unknown }) => {
    return cache.queueOfflineAction(action);
  }, []);

  return {
    setCache,
    getCache,
    deleteCache,
    clearCategory,
    cacheApiResponse,
    getCachedApiResponse,
    queueOfflineAction,
    getOfflineQueue: cache.getOfflineQueue.bind(cache),
    clearOfflineQueue: cache.clearOfflineQueue.bind(cache),
    getStats: cache.getStats.bind(cache),
  };
}