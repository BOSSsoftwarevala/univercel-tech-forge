/**
 * Security test — API Rate Limiting
 * 5 orders/hour per IP and 10 orders/day per user.
 */

import {
  createOrder,
  resetPaymentServiceState,
  checkIpRateLimit,
  checkUserRateLimit,
  type PaymentServiceConfig,
} from '../../src/lib/payment/payment-service.js';
import { ipRateLimiter, userRateLimiter } from '../../src/lib/payment/rate-limiter.js';

const config: PaymentServiceConfig = {
  productCatalog: [{ id: 'prod_basic', name: 'Basic', price: 999, currency: 'INR' }],
  maxOrdersPerHourPerIp: 5,
  maxOrdersPerDayPerUser: 10,
};

beforeEach(() => {
  resetPaymentServiceState();
  ipRateLimiter.clear();
  userRateLimiter.clear();
});

describe('API Rate Limiting — 5 orders/hour per IP', () => {
  it('allows 5 orders from same IP', () => {
    let successCount = 0;
    for (let i = 0; i < 5; i++) {
      const r = createOrder(
        { userId: `user${i}`, productId: 'prod_basic', idempotencyKey: `rl-ip-${i}`, currency: 'INR' },
        config,
        '203.0.113.10'
      );
      if (r.success) successCount++;
    }
    expect(successCount).toBe(5);
  });

  it('blocks 6th order from same IP within the hour', () => {
    for (let i = 0; i < 5; i++) {
      createOrder(
        { userId: `user${i}`, productId: 'prod_basic', idempotencyKey: `rl-ip-6-${i}`, currency: 'INR' },
        config,
        '203.0.113.11'
      );
    }
    const r = createOrder(
      { userId: 'user6', productId: 'prod_basic', idempotencyKey: 'rl-ip-6-6', currency: 'INR' },
      config,
      '203.0.113.11'
    );
    expect(r.success).toBe(false);
    if (r.success) throw new Error();
    expect(r.error).toMatch(/RATE_LIMIT_IP/);
  });

  it('different IPs have independent counters', () => {
    // Fill up IP1
    for (let i = 0; i < 5; i++) {
      createOrder(
        { userId: `userX`, productId: 'prod_basic', idempotencyKey: `rl-ip2-a-${i}`, currency: 'INR' },
        config,
        '10.0.0.1'
      );
    }
    // IP2 should still be allowed
    const r = createOrder(
      { userId: 'userY', productId: 'prod_basic', idempotencyKey: 'rl-ip2-b-0', currency: 'INR' },
      config,
      '10.0.0.2'
    );
    expect(r.success).toBe(true);
  });
});

describe('API Rate Limiting — 10 orders/day per user', () => {
  it('allows 10 orders for same user (across different IPs)', () => {
    let successCount = 0;
    for (let i = 0; i < 10; i++) {
      const r = createOrder(
        { userId: 'heavyUser', productId: 'prod_basic', idempotencyKey: `rl-user-${i}`, currency: 'INR' },
        config,
        `5.0.0.${i + 1}`
      );
      if (r.success) successCount++;
    }
    expect(successCount).toBe(10);
  });

  it('blocks 11th order for same user within the day', () => {
    for (let i = 0; i < 10; i++) {
      createOrder(
        { userId: 'blockedUser', productId: 'prod_basic', idempotencyKey: `rl-bu-${i}`, currency: 'INR' },
        config,
        `6.0.0.${i + 1}`
      );
    }
    const r = createOrder(
      { userId: 'blockedUser', productId: 'prod_basic', idempotencyKey: 'rl-bu-10', currency: 'INR' },
      config,
      '6.0.0.11'
    );
    expect(r.success).toBe(false);
    if (r.success) throw new Error();
    expect(r.error).toMatch(/RATE_LIMIT_USER/);
  });
});

describe('checkIpRateLimit helper', () => {
  it('reports remaining slots accurately', () => {
    const ip = '77.0.0.1';
    const r1 = checkIpRateLimit(ip, 5);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(5);
  });
});
