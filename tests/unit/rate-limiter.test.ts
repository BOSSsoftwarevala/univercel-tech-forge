/**
 * Unit tests — Token-bucket Rate Limiter
 */

import { RateLimiter, ipRateLimiter, userRateLimiter } from '../../src/lib/payment/rate-limiter.js';

afterEach(() => {
  ipRateLimiter.clear();
  userRateLimiter.clear();
});

describe('RateLimiter — basic token bucket', () => {
  it('allows requests up to capacity', () => {
    const limiter = new RateLimiter({ capacity: 3, refillRate: 3, refillIntervalMs: 60_000 });
    expect(limiter.consume('k1')).toBe(true);
    expect(limiter.consume('k1')).toBe(true);
    expect(limiter.consume('k1')).toBe(true);
  });

  it('rejects requests when bucket is empty', () => {
    const limiter = new RateLimiter({ capacity: 2, refillRate: 2, refillIntervalMs: 60_000 });
    limiter.consume('k1');
    limiter.consume('k1');
    expect(limiter.consume('k1')).toBe(false);
  });

  it('reports remaining tokens correctly', () => {
    const limiter = new RateLimiter({ capacity: 5, refillRate: 5, refillIntervalMs: 60_000 });
    limiter.consume('k1');
    limiter.consume('k1');
    expect(limiter.remaining('k1')).toBe(3);
  });

  it('reset restores full capacity for a key', () => {
    const limiter = new RateLimiter({ capacity: 3, refillRate: 3, refillIntervalMs: 60_000 });
    limiter.consume('k1');
    limiter.consume('k1');
    limiter.reset('k1');
    expect(limiter.remaining('k1')).toBe(3);
  });

  it('different keys have independent buckets', () => {
    const limiter = new RateLimiter({ capacity: 2, refillRate: 2, refillIntervalMs: 60_000 });
    limiter.consume('ip1');
    limiter.consume('ip1');
    expect(limiter.consume('ip1')).toBe(false);
    expect(limiter.consume('ip2')).toBe(true); // ip2 still has capacity
  });
});

describe('IP Rate Limiter — 5 orders/hour', () => {
  it('allows 5 requests from same IP', () => {
    for (let i = 0; i < 5; i++) {
      expect(ipRateLimiter.consume('192.168.1.1')).toBe(true);
    }
  });

  it('blocks 6th request from same IP', () => {
    for (let i = 0; i < 5; i++) ipRateLimiter.consume('192.168.1.2');
    expect(ipRateLimiter.consume('192.168.1.2')).toBe(false);
  });

  it('different IPs are independent', () => {
    for (let i = 0; i < 5; i++) ipRateLimiter.consume('10.0.0.1');
    expect(ipRateLimiter.consume('10.0.0.2')).toBe(true);
  });
});

describe('User Rate Limiter — 10 orders/day', () => {
  it('allows 10 requests for same user', () => {
    for (let i = 0; i < 10; i++) {
      expect(userRateLimiter.consume('user-A')).toBe(true);
    }
  });

  it('blocks 11th request for same user', () => {
    for (let i = 0; i < 10; i++) userRateLimiter.consume('user-B');
    expect(userRateLimiter.consume('user-B')).toBe(false);
  });
});
