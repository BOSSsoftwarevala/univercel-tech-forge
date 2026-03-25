/**
 * Enterprise Rate Limiter with Sliding Window + Request Queueing
 * Optimized for high-volume enterprise usage
 */

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  burstLimit?: number;
  queueEnabled?: boolean;
  queueMaxSize?: number;
  priority?: 'low' | 'normal' | 'high' | 'critical';
}

interface RateLimitEntry {
  timestamps: number[];
  queuedRequests: QueuedRequest[];
}

interface QueuedRequest {
  id: string;
  priority: number;
  timestamp: number;
  resolve: (allowed: boolean) => void;
}

// Enterprise rate limits by endpoint type and user tier
export const ENTERPRISE_RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Authentication - strict limits
  auth: { windowMs: 60000, maxRequests: 10, burstLimit: 3 },
  auth_prime: { windowMs: 60000, maxRequests: 50, burstLimit: 10 },
  
  // Financial endpoints - moderate with queueing
  wallet: { windowMs: 60000, maxRequests: 100, queueEnabled: true, queueMaxSize: 50 },
  wallet_prime: { windowMs: 60000, maxRequests: 500, queueEnabled: true, queueMaxSize: 200 },
  billing: { windowMs: 60000, maxRequests: 50, queueEnabled: true },
  billing_prime: { windowMs: 60000, maxRequests: 300, queueEnabled: true },
  
  // Lead and task endpoints - high throughput
  leads: { windowMs: 60000, maxRequests: 500, burstLimit: 50 },
  leads_prime: { windowMs: 60000, maxRequests: 2000, burstLimit: 200 },
  tasks: { windowMs: 60000, maxRequests: 500, burstLimit: 50 },
  tasks_prime: { windowMs: 60000, maxRequests: 2000, burstLimit: 200 },
  
  // Realtime endpoints - highest limits
  chat: { windowMs: 60000, maxRequests: 300, burstLimit: 30 },
  chat_prime: { windowMs: 60000, maxRequests: 1500, burstLimit: 150 },
  buzzer: { windowMs: 60000, maxRequests: 500, burstLimit: 50 },
  buzzer_prime: { windowMs: 60000, maxRequests: 3000, burstLimit: 300 },
  timer: { windowMs: 60000, maxRequests: 300, burstLimit: 30 },
  
  // Demo endpoints - region-aware limits
  demo: { windowMs: 60000, maxRequests: 200, burstLimit: 20 },
  demo_prime: { windowMs: 60000, maxRequests: 1000, burstLimit: 100 },
  
  // Default
  default: { windowMs: 60000, maxRequests: 100, burstLimit: 10 },
  default_prime: { windowMs: 60000, maxRequests: 500, burstLimit: 50 },
};

// Sliding window rate limiter with request queueing
class EnterpriseRateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;
  
  constructor() {
    // Start cleanup every 60 seconds
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }
  
  private generateKey(clientId: string, endpoint: string, isPrime: boolean): string {
    return `${clientId}:${endpoint}:${isPrime ? 'prime' : 'common'}`;
  }
  
  private getConfig(endpoint: string, isPrime: boolean): RateLimitConfig {
    const key = isPrime ? `${endpoint}_prime` : endpoint;
    return ENTERPRISE_RATE_LIMITS[key] || 
           (isPrime ? ENTERPRISE_RATE_LIMITS.default_prime : ENTERPRISE_RATE_LIMITS.default);
  }
  
  async checkRateLimit(
    clientId: string,
    endpoint: string,
    options: {
      isPrime?: boolean;
      priority?: 'low' | 'normal' | 'high' | 'critical';
      waitIfLimited?: boolean;
    } = {}
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetIn: number;
    queued?: boolean;
    queuePosition?: number;
  }> {
    const { isPrime = false, priority = 'normal', waitIfLimited = false } = options;
    const key = this.generateKey(clientId, endpoint, isPrime);
    const config = this.getConfig(endpoint, isPrime);
    const now = Date.now();
    const windowStart = now - config.windowMs;
    
    // Get or create entry
    let entry = this.store.get(key);
    if (!entry) {
      entry = { timestamps: [], queuedRequests: [] };
      this.store.set(key, entry);
    }
    
    // Sliding window: remove expired timestamps
    entry.timestamps = entry.timestamps.filter(ts => ts > windowStart);
    
    // Check burst limit (requests in last second)
    const burstWindow = now - 1000;
    const burstCount = entry.timestamps.filter(ts => ts > burstWindow).length;
    const burstLimit = config.burstLimit || Math.ceil(config.maxRequests / 10);
    
    if (burstCount >= burstLimit) {
      // Burst limit exceeded
      if (waitIfLimited && config.queueEnabled) {
        return this.queueRequest(key, entry, config, priority);
      }
      return {
        allowed: false,
        remaining: 0,
        resetIn: 1000 - (now - entry.timestamps[entry.timestamps.length - burstLimit]),
      };
    }
    
    // Check window limit
    if (entry.timestamps.length >= config.maxRequests) {
      if (waitIfLimited && config.queueEnabled) {
        return this.queueRequest(key, entry, config, priority);
      }
      const oldestInWindow = entry.timestamps[0];
      return {
        allowed: false,
        remaining: 0,
        resetIn: oldestInWindow + config.windowMs - now,
      };
    }
    
    // Request allowed
    entry.timestamps.push(now);
    
    return {
      allowed: true,
      remaining: config.maxRequests - entry.timestamps.length,
      resetIn: config.windowMs,
    };
  }
  
  private async queueRequest(
    key: string,
    entry: RateLimitEntry,
    config: RateLimitConfig,
    priority: 'low' | 'normal' | 'high' | 'critical'
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetIn: number;
    queued: boolean;
    queuePosition: number;
  }> {
    const maxQueueSize = config.queueMaxSize || 100;
    
    if (entry.queuedRequests.length >= maxQueueSize) {
      return {
        allowed: false,
        remaining: 0,
        resetIn: config.windowMs,
        queued: false,
        queuePosition: -1,
      };
    }
    
    const priorityMap = { low: 1, normal: 2, high: 3, critical: 4 };
    const priorityValue = priorityMap[priority];
    
    return new Promise((resolve) => {
      const request: QueuedRequest = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        priority: priorityValue,
        timestamp: Date.now(),
        resolve: (allowed) => {
          resolve({
            allowed,
            remaining: config.maxRequests - entry.timestamps.length,
            resetIn: config.windowMs,
            queued: true,
            queuePosition: 0,
          });
        },
      };
      
      // Insert by priority (higher priority first)
      const insertIndex = entry.queuedRequests.findIndex(r => r.priority < priorityValue);
      if (insertIndex === -1) {
        entry.queuedRequests.push(request);
      } else {
        entry.queuedRequests.splice(insertIndex, 0, request);
      }
      
      // Process queue after delay
      setTimeout(() => this.processQueue(key), 100);
    });
  }
  
  private processQueue(key: string): void {
    const entry = this.store.get(key);
    if (!entry || entry.queuedRequests.length === 0) return;
    
    const now = Date.now();
    const config = this.getConfig(key.split(':')[1], key.includes(':prime'));
    const windowStart = now - config.windowMs;
    
    // Clean expired timestamps
    entry.timestamps = entry.timestamps.filter(ts => ts > windowStart);
    
    // Process queued requests
    while (entry.queuedRequests.length > 0 && entry.timestamps.length < config.maxRequests) {
      const request = entry.queuedRequests.shift();
      if (request) {
        entry.timestamps.push(now);
        request.resolve(true);
      }
    }
    
    // Schedule next processing if queue not empty
    if (entry.queuedRequests.length > 0) {
      setTimeout(() => this.processQueue(key), 100);
    }
  }
  
  private cleanup(): void {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes
    
    for (const [key, entry] of this.store.entries()) {
      // Remove entries with no recent activity
      const lastActivity = Math.max(
        ...entry.timestamps,
        ...entry.queuedRequests.map(r => r.timestamp),
        0
      );
      
      if (now - lastActivity > maxAge) {
        // Reject any remaining queued requests
        entry.queuedRequests.forEach(r => r.resolve(false));
        this.store.delete(key);
      }
    }
  }
  
  getStats(): {
    totalEntries: number;
    totalQueuedRequests: number;
    entriesByEndpoint: Record<string, number>;
  } {
    const entriesByEndpoint: Record<string, number> = {};
    let totalQueuedRequests = 0;
    
    for (const [key, entry] of this.store.entries()) {
      const endpoint = key.split(':')[1];
      entriesByEndpoint[endpoint] = (entriesByEndpoint[endpoint] || 0) + 1;
      totalQueuedRequests += entry.queuedRequests.length;
    }
    
    return {
      totalEntries: this.store.size,
      totalQueuedRequests,
      entriesByEndpoint,
    };
  }
  
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    
    // Reject all queued requests
    for (const entry of this.store.values()) {
      entry.queuedRequests.forEach(r => r.resolve(false));
    }
    this.store.clear();
  }
}

// Singleton instance
export const enterpriseRateLimiter = new EnterpriseRateLimiter();

// Request queue manager for API throttling
export class RequestQueueManager {
  private queues = new Map<string, QueuedAPIRequest[]>();
  private processing = new Map<string, boolean>();
  private concurrencyLimits = new Map<string, number>();
  private activeRequests = new Map<string, number>();
  
  setConcurrencyLimit(endpoint: string, limit: number): void {
    this.concurrencyLimits.set(endpoint, limit);
  }
  
  async enqueue<T>(
    endpoint: string,
    requestFn: () => Promise<T>,
    priority: number = 0
  ): Promise<T> {
    const limit = this.concurrencyLimits.get(endpoint) || 10;
    const active = this.activeRequests.get(endpoint) || 0;
    
    if (active < limit) {
      // Execute immediately
      this.activeRequests.set(endpoint, active + 1);
      try {
        return await requestFn();
      } finally {
        this.activeRequests.set(endpoint, (this.activeRequests.get(endpoint) || 1) - 1);
        this.processNext(endpoint);
      }
    }
    
    // Queue the request
    return new Promise((resolve, reject) => {
      const queue = this.queues.get(endpoint) || [];
      queue.push({ requestFn, priority, resolve, reject });
      queue.sort((a, b) => b.priority - a.priority);
      this.queues.set(endpoint, queue);
    });
  }
  
  private async processNext(endpoint: string): Promise<void> {
    const queue = this.queues.get(endpoint);
    if (!queue || queue.length === 0) return;
    
    const limit = this.concurrencyLimits.get(endpoint) || 10;
    const active = this.activeRequests.get(endpoint) || 0;
    
    if (active >= limit) return;
    
    const request = queue.shift();
    if (!request) return;
    
    this.activeRequests.set(endpoint, active + 1);
    
    try {
      const result = await request.requestFn();
      request.resolve(result);
    } catch (error) {
      request.reject(error);
    } finally {
      this.activeRequests.set(endpoint, (this.activeRequests.get(endpoint) || 1) - 1);
      this.processNext(endpoint);
    }
  }
  
  getStats(): Record<string, { queued: number; active: number; limit: number }> {
    const stats: Record<string, { queued: number; active: number; limit: number }> = {};
    
    for (const [endpoint, limit] of this.concurrencyLimits.entries()) {
      stats[endpoint] = {
        queued: this.queues.get(endpoint)?.length || 0,
        active: this.activeRequests.get(endpoint) || 0,
        limit,
      };
    }
    
    return stats;
  }
}

interface QueuedAPIRequest {
  requestFn: () => Promise<unknown>;
  priority: number;
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}

export const requestQueueManager = new RequestQueueManager();

// Set default concurrency limits for high-volume endpoints
requestQueueManager.setConcurrencyLimit('wallet', 50);
requestQueueManager.setConcurrencyLimit('billing', 30);
requestQueueManager.setConcurrencyLimit('leads', 100);
requestQueueManager.setConcurrencyLimit('tasks', 100);
requestQueueManager.setConcurrencyLimit('chat', 200);
requestQueueManager.setConcurrencyLimit('buzzer', 150);
requestQueueManager.setConcurrencyLimit('demo', 80);
