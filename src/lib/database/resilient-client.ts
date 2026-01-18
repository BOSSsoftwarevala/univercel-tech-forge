/**
 * Resilient Supabase Client
 * Provides automatic retry, circuit breaker, and connection pooling
 * for high-traffic enterprise usage
 */

import { supabase } from '@/integrations/supabase/client';
import { queryCache } from '@/lib/scaling/query-cache';
import { enterpriseRateLimiter } from '@/lib/scaling/rate-limiter-enterprise';

// Circuit breaker states
type CircuitState = 'closed' | 'open' | 'half-open';

interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  halfOpenRequests: number;
}

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  retryableErrors: string[];
}

// Circuit Breaker for database connections
class CircuitBreaker {
  private state: CircuitState = 'closed';
  private failures = 0;
  private lastFailureTime = 0;
  private halfOpenSuccesses = 0;
  private config: CircuitBreakerConfig;

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = {
      failureThreshold: config.failureThreshold || 5,
      resetTimeout: config.resetTimeout || 30000,
      halfOpenRequests: config.halfOpenRequests || 3,
    };
  }

  canRequest(): boolean {
    if (this.state === 'closed') return true;
    
    if (this.state === 'open') {
      const now = Date.now();
      if (now - this.lastFailureTime >= this.config.resetTimeout) {
        this.state = 'half-open';
        this.halfOpenSuccesses = 0;
        return true;
      }
      return false;
    }
    
    // Half-open: allow limited requests
    return true;
  }

  recordSuccess(): void {
    if (this.state === 'half-open') {
      this.halfOpenSuccesses++;
      if (this.halfOpenSuccesses >= this.config.halfOpenRequests) {
        this.state = 'closed';
        this.failures = 0;
      }
    } else if (this.state === 'closed') {
      this.failures = 0;
    }
  }

  recordFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.state === 'half-open' || this.failures >= this.config.failureThreshold) {
      this.state = 'open';
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  getStats(): { state: CircuitState; failures: number; lastFailure: number } {
    return {
      state: this.state,
      failures: this.failures,
      lastFailure: this.lastFailureTime,
    };
  }

  reset(): void {
    this.state = 'closed';
    this.failures = 0;
    this.lastFailureTime = 0;
    this.halfOpenSuccesses = 0;
  }
}

// Exponential backoff with jitter
function getBackoffDelay(attempt: number, config: RetryConfig): number {
  const delay = Math.min(config.baseDelay * Math.pow(2, attempt), config.maxDelay);
  const jitter = delay * 0.25 * (Math.random() * 2 - 1);
  return Math.round(delay + jitter);
}

// Check if error is retryable
function isRetryableError(error: unknown, config: RetryConfig): boolean {
  if (!error) return false;
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  return config.retryableErrors.some(pattern => 
    errorMessage.toLowerCase().includes(pattern.toLowerCase())
  );
}

// Default configurations
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  retryableErrors: [
    'network',
    'timeout',
    'connection',
    'ECONNRESET',
    'ETIMEDOUT',
    'fetch failed',
    'Failed to fetch',
    '503',
    '502',
    '504',
  ],
};

// Main resilient client class
class ResilientSupabaseClient {
  private circuitBreaker = new CircuitBreaker();
  private retryConfig: RetryConfig;
  private requestQueue: Map<string, Promise<unknown>> = new Map();

  constructor(config: Partial<RetryConfig> = {}) {
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  }

  /**
   * Execute a database query with retry and circuit breaker
   */
  async query<T>(
    queryFn: () => Promise<{ data: T | null; error: unknown }>,
    options: {
      cacheKey?: string;
      cacheTTL?: number;
      skipCache?: boolean;
      clientId?: string;
      endpoint?: string;
    } = {}
  ): Promise<{ data: T | null; error: unknown }> {
    const { cacheKey, cacheTTL = 60000, skipCache = false, clientId, endpoint } = options;

    // Check rate limit
    if (clientId && endpoint) {
      const rateLimitCheck = await enterpriseRateLimiter.checkRateLimit(clientId, endpoint);
      if (!rateLimitCheck.allowed) {
        return {
          data: null,
          error: new Error(`Rate limit exceeded. Try again in ${rateLimitCheck.resetIn}ms`),
        };
      }
    }

    // Check cache first
    if (cacheKey && !skipCache) {
      const cached = queryCache.get(cacheKey) as T | null;
      if (cached !== null) {
        return { data: cached, error: null };
      }
    }

    // Check circuit breaker
    if (!this.circuitBreaker.canRequest()) {
      return {
        data: null,
        error: new Error('Circuit breaker is open. Database temporarily unavailable.'),
      };
    }

    // Dedupe identical concurrent requests
    const dedupeKey = cacheKey || JSON.stringify(queryFn.toString());
    const existingRequest = this.requestQueue.get(dedupeKey);
    if (existingRequest) {
      return existingRequest as Promise<{ data: T | null; error: unknown }>;
    }

    const requestPromise = this.executeWithRetry(queryFn, cacheKey, cacheTTL);
    this.requestQueue.set(dedupeKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.requestQueue.delete(dedupeKey);
    }
  }

  private async executeWithRetry<T>(
    queryFn: () => Promise<{ data: T | null; error: unknown }>,
    cacheKey?: string,
    cacheTTL?: number,
    attempt = 0
  ): Promise<{ data: T | null; error: unknown }> {
    try {
      const result = await queryFn();

      if (result.error) {
        throw result.error;
      }

      // Record success
      this.circuitBreaker.recordSuccess();

      // Cache the result
      if (cacheKey && result.data) {
        queryCache.set(cacheKey, undefined, result.data, { ttl: cacheTTL });
      }

      return result;
    } catch (error) {
      // Check if we should retry
      if (attempt < this.retryConfig.maxRetries && isRetryableError(error, this.retryConfig)) {
        const delay = getBackoffDelay(attempt, this.retryConfig);
        console.warn(`[ResilientClient] Retry attempt ${attempt + 1} after ${delay}ms`, error);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.executeWithRetry(queryFn, cacheKey, cacheTTL, attempt + 1);
      }

      // Record failure
      this.circuitBreaker.recordFailure();

      return { data: null, error };
    }
  }

  /**
   * Execute a mutation (insert/update/delete) with retry
   */
  async mutate<T>(
    mutateFn: () => Promise<{ data: T | null; error: unknown }>,
    options: {
      invalidateTags?: string[];
      clientId?: string;
      endpoint?: string;
    } = {}
  ): Promise<{ data: T | null; error: unknown }> {
    const { invalidateTags, clientId, endpoint } = options;

    // Check rate limit for mutations
    if (clientId && endpoint) {
      const rateLimitCheck = await enterpriseRateLimiter.checkRateLimit(clientId, endpoint, {
        priority: 'high',
      });
      if (!rateLimitCheck.allowed) {
        return {
          data: null,
          error: new Error(`Rate limit exceeded for mutations. Try again in ${rateLimitCheck.resetIn}ms`),
        };
      }
    }

    // Check circuit breaker
    if (!this.circuitBreaker.canRequest()) {
      return {
        data: null,
        error: new Error('Circuit breaker is open. Database temporarily unavailable.'),
      };
    }

    const result = await this.executeWithRetry(mutateFn);

    // Invalidate cache on successful mutation
    if (!result.error && invalidateTags) {
      invalidateTags.forEach(tag => queryCache.invalidateByTag(tag));
    }

    return result;
  }

  /**
   * Batch multiple queries for efficiency
   */
  async batchQuery<T>(
    queries: Array<{
      key: string;
      queryFn: () => Promise<{ data: unknown; error: unknown }>;
      cacheTTL?: number;
    }>
  ): Promise<Record<string, { data: unknown; error: unknown }>> {
    const results: Record<string, { data: unknown; error: unknown }> = {};

    await Promise.all(
      queries.map(async ({ key, queryFn, cacheTTL }) => {
        results[key] = await this.query(queryFn, { cacheKey: key, cacheTTL });
      })
    );

    return results;
  }

  /**
   * Get health status
   */
  getHealthStatus(): {
    circuitBreaker: { state: CircuitState; failures: number; lastFailure: number };
    cacheStats: { size: number; hits: number; misses: number; hitRate: number };
    pendingRequests: number;
  } {
    const stats = queryCache.getStats();
    return {
      circuitBreaker: this.circuitBreaker.getStats(),
      cacheStats: {
        size: stats.size,
        hits: stats.hits,
        misses: stats.misses,
        hitRate: stats.hitRate,
      },
      pendingRequests: this.requestQueue.size,
    };
  }

  /**
   * Reset circuit breaker (for admin use)
   */
  resetCircuitBreaker(): void {
    this.circuitBreaker.reset();
  }
}

// Singleton instance
export const resilientClient = new ResilientSupabaseClient();

// Convenience wrappers for common operations
export async function resilientSelect<T>(
  table: string,
  query: string,
  options?: { cacheKey?: string; cacheTTL?: number }
): Promise<{ data: T[] | null; error: unknown }> {
  return resilientClient.query(
    async () => {
      const result = await supabase.from(table as any).select(query);
      return { data: result.data as T[] | null, error: result.error };
    },
    options
  );
}

export async function resilientInsert<T>(
  table: string,
  data: Record<string, unknown>,
  options?: { invalidateTags?: string[] }
): Promise<{ data: T | null; error: unknown }> {
  return resilientClient.mutate(
    async () => {
      const result = await supabase.from(table as any).insert(data).select().single();
      return { data: result.data as T | null, error: result.error };
    },
    options
  );
}

export async function resilientUpdate<T>(
  table: string,
  data: Record<string, unknown>,
  match: Record<string, unknown>,
  options?: { invalidateTags?: string[] }
): Promise<{ data: T | null; error: unknown }> {
  return resilientClient.mutate(
    async () => {
      let query = supabase.from(table as any).update(data);
      Object.entries(match).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
      const result = await query.select().single();
      return { data: result.data as T | null, error: result.error };
    },
    options
  );
}

export async function resilientDelete(
  table: string,
  match: Record<string, unknown>,
  options?: { invalidateTags?: string[] }
): Promise<{ data: null; error: unknown }> {
  return resilientClient.mutate(
    async () => {
      let query = supabase.from(table as any).delete();
      Object.entries(match).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
      const result = await query;
      return { data: null, error: result.error };
    },
    options
  );
}

export default resilientClient;
