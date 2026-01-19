/**
 * SMOOTH-04: API Call Optimization Hook
 * One action → one API call, cancel duplicates, timeout handling
 */

import { useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface PendingRequest {
  controller: AbortController;
  promise: Promise<unknown>;
  timestamp: number;
}

interface APIOptimizationConfig {
  timeout?: number;           // Request timeout in ms (default: 30000)
  dedupeWindow?: number;      // Window to dedupe same requests (default: 300ms)
  maxConcurrent?: number;     // Max concurrent requests (default: 10)
  silentRetry?: boolean;      // Retry once silently (default: true)
  showSoftNotice?: boolean;   // Show soft notice on fail (default: true)
}

const DEFAULT_CONFIG: Required<APIOptimizationConfig> = {
  timeout: 30000,
  dedupeWindow: 300,
  maxConcurrent: 10,
  silentRetry: true,
  showSoftNotice: true
};

export function useAPIOptimization(config: APIOptimizationConfig = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  
  const pendingRequests = useRef<Map<string, PendingRequest>>(new Map());
  const requestQueue = useRef<string[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      pendingRequests.current.forEach((req) => {
        req.controller.abort();
      });
      pendingRequests.current.clear();
    };
  }, []);

  // Generate request key for deduplication
  const getRequestKey = useCallback((
    endpoint: string,
    method: string,
    body?: unknown
  ): string => {
    const bodyHash = body ? JSON.stringify(body).slice(0, 100) : '';
    return `${method}:${endpoint}:${bodyHash}`;
  }, []);

  // Cancel pending request
  const cancelRequest = useCallback((key: string): boolean => {
    const pending = pendingRequests.current.get(key);
    if (pending) {
      pending.controller.abort();
      pendingRequests.current.delete(key);
      const idx = requestQueue.current.indexOf(key);
      if (idx > -1) requestQueue.current.splice(idx, 1);
      return true;
    }
    return false;
  }, []);

  // Cancel all pending requests
  const cancelAll = useCallback((): void => {
    pendingRequests.current.forEach((req) => {
      req.controller.abort();
    });
    pendingRequests.current.clear();
    requestQueue.current = [];
  }, []);

  // Optimized fetch with deduplication and timeout
  const optimizedFetch = useCallback(async <T>(
    endpoint: string,
    options: RequestInit = {},
    requestConfig?: Partial<APIOptimizationConfig>
  ): Promise<T | null> => {
    const localCfg = { ...cfg, ...requestConfig };
    const method = options.method || 'GET';
    const key = getRequestKey(endpoint, method, options.body);

    // Check for duplicate request within dedupe window
    const existing = pendingRequests.current.get(key);
    if (existing && (Date.now() - existing.timestamp) < localCfg.dedupeWindow) {
      // Return existing promise to prevent duplicate calls
      return existing.promise as Promise<T>;
    }

    // Check concurrent limit
    if (pendingRequests.current.size >= localCfg.maxConcurrent) {
      // Cancel oldest request
      const oldestKey = requestQueue.current[0];
      if (oldestKey) {
        cancelRequest(oldestKey);
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), localCfg.timeout);

    const executeRequest = async (isRetry = false): Promise<T | null> => {
      try {
        const response = await fetch(endpoint, {
          ...options,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        return data as T;

      } catch (error) {
        clearTimeout(timeoutId);

        // Handle abort
        if (error instanceof Error && error.name === 'AbortError') {
          return null;
        }

        // Silent retry once
        if (!isRetry && localCfg.silentRetry) {
          await new Promise(resolve => setTimeout(resolve, 500));
          return executeRequest(true);
        }

        // Show soft notice
        if (localCfg.showSoftNotice) {
          toast.info('Request could not be completed. Please try again.', {
            duration: 3000,
            position: 'bottom-right'
          });
        }

        return null;

      } finally {
        pendingRequests.current.delete(key);
        const idx = requestQueue.current.indexOf(key);
        if (idx > -1) requestQueue.current.splice(idx, 1);
      }
    };

    const promise = executeRequest();

    pendingRequests.current.set(key, {
      controller,
      promise,
      timestamp: Date.now()
    });
    requestQueue.current.push(key);

    return promise;
  }, [cfg, getRequestKey, cancelRequest]);

  // Get count of pending requests
  const getPendingCount = useCallback((): number => {
    return pendingRequests.current.size;
  }, []);

  // Check if specific request is pending
  const isRequestPending = useCallback((
    endpoint: string,
    method = 'GET',
    body?: unknown
  ): boolean => {
    const key = getRequestKey(endpoint, method, body);
    return pendingRequests.current.has(key);
  }, [getRequestKey]);

  return {
    optimizedFetch,
    cancelRequest,
    cancelAll,
    getPendingCount,
    isRequestPending,
    getRequestKey
  };
}

/**
 * Wrapper for Supabase queries with optimization
 */
export function createOptimizedQuery<T>(
  queryFn: (signal?: AbortSignal) => Promise<T>,
  options: { key: string; timeout?: number } = { key: 'query' }
): () => Promise<T | null> {
  let pendingPromise: Promise<T | null> | null = null;
  let pendingController: AbortController | null = null;
  let lastCallTime = 0;

  return async (): Promise<T | null> => {
    const now = Date.now();
    
    // Dedupe within 300ms
    if (pendingPromise && (now - lastCallTime) < 300) {
      return pendingPromise;
    }

    // Cancel previous if still running
    if (pendingController) {
      pendingController.abort();
    }

    lastCallTime = now;
    pendingController = new AbortController();
    const controller = pendingController;

    const timeout = options.timeout || 30000;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    pendingPromise = (async () => {
      try {
        const result = await queryFn(controller.signal);
        clearTimeout(timeoutId);
        return result;
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
          return null;
        }
        throw error;
      } finally {
        pendingPromise = null;
        pendingController = null;
      }
    })();

    return pendingPromise;
  };
}
