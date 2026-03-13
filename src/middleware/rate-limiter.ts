export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyPrefix?: string;
}

interface WindowEntry {
  count: number;
  windowStart: number;
}

export class RateLimiter {
  private config: RateLimitConfig;
  private store: Map<string, WindowEntry> = new Map();

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  private buildKey(key: string): string {
    return this.config.keyPrefix ? `${this.config.keyPrefix}:${key}` : key;
  }

  private getEntry(storeKey: string): WindowEntry {
    const now = Date.now();
    const entry = this.store.get(storeKey);
    if (!entry || now - entry.windowStart >= this.config.windowMs) {
      const fresh: WindowEntry = { count: 0, windowStart: now };
      this.store.set(storeKey, fresh);
      return fresh;
    }
    return entry;
  }

  isAllowed(key: string): boolean {
    const storeKey = this.buildKey(key);
    const entry = this.getEntry(storeKey);
    if (entry.count >= this.config.maxRequests) return false;
    entry.count += 1;
    return true;
  }

  getRemainingRequests(key: string): number {
    const storeKey = this.buildKey(key);
    const entry = this.getEntry(storeKey);
    return Math.max(0, this.config.maxRequests - entry.count);
  }

  reset(key: string): void {
    this.store.delete(this.buildKey(key));
  }
}

export const defaultRateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60_000,
  keyPrefix: 'default',
});
