/**
 * Token-bucket rate limiter — IP-based and user-based.
 */

interface Bucket {
  tokens: number;
  lastRefill: number;
}

export interface RateLimiterConfig {
  capacity: number;       // max tokens
  refillRate: number;     // tokens added per refillInterval
  refillIntervalMs: number;
}

export class RateLimiter {
  private buckets = new Map<string, Bucket>();
  private config: RateLimiterConfig;

  constructor(config: RateLimiterConfig) {
    this.config = config;
  }

  private refill(bucket: Bucket): void {
    const now = Date.now();
    const elapsed = now - bucket.lastRefill;
    const refillAmount =
      Math.floor(elapsed / this.config.refillIntervalMs) * this.config.refillRate;

    if (refillAmount > 0) {
      bucket.tokens = Math.min(this.config.capacity, bucket.tokens + refillAmount);
      bucket.lastRefill = now;
    }
  }

  /**
   * Attempt to consume one token.
   * Returns true if the request is allowed, false if rate-limited.
   */
  consume(key: string, tokens = 1): boolean {
    let bucket = this.buckets.get(key);
    if (!bucket) {
      bucket = { tokens: this.config.capacity, lastRefill: Date.now() };
      this.buckets.set(key, bucket);
    }

    this.refill(bucket);

    if (bucket.tokens < tokens) return false;

    bucket.tokens -= tokens;
    return true;
  }

  /** Remaining tokens for a key (without consuming). */
  remaining(key: string): number {
    const bucket = this.buckets.get(key);
    if (!bucket) return this.config.capacity;
    this.refill(bucket);
    return bucket.tokens;
  }

  reset(key: string): void {
    this.buckets.delete(key);
  }

  clear(): void {
    this.buckets.clear();
  }
}

/** IP-based limiter: 5 orders per hour */
export const ipRateLimiter = new RateLimiter({
  capacity: 5,
  refillRate: 5,
  refillIntervalMs: 60 * 60 * 1000,
});

/** User-based limiter: 10 orders per day */
export const userRateLimiter = new RateLimiter({
  capacity: 10,
  refillRate: 10,
  refillIntervalMs: 24 * 60 * 60 * 1000,
});
