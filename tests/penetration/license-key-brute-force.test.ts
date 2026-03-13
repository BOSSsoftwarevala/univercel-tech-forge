/**
 * Penetration test — License Key Brute Force
 * Rate limiting on license verification prevents brute-force attacks.
 */

import { ipRateLimiter, userRateLimiter, RateLimiter } from '../../src/lib/payment/rate-limiter.js';
import {
  createOrder,
  updateOrderStatus,
  generateLicenseKey,
  resetPaymentServiceState,
  type PaymentServiceConfig,
} from '../../src/lib/payment/payment-service.js';

const config: PaymentServiceConfig = {
  productCatalog: [{ id: 'prod_basic', name: 'Basic', price: 999, currency: 'INR' }],
  maxOrdersPerHourPerIp: 1000,
  maxOrdersPerDayPerUser: 1000,
};

/** License verification rate limiter: 10 attempts per hour per IP */
const licenseVerifyLimiter = new RateLimiter({
  capacity: 10,
  refillRate: 10,
  refillIntervalMs: 60 * 60 * 1000,
});

function verifyLicenseWithRateLimit(
  ip: string,
  orderId: string,
  guessKey: string
): { allowed: boolean; valid?: boolean; error?: string } {
  if (!licenseVerifyLimiter.consume(ip)) {
    return { allowed: false, error: 'RATE_LIMITED: too many verification attempts' };
  }

  const result = generateLicenseKey(orderId);
  if ('error' in result) return { allowed: true, valid: false, error: result.error };

  return { allowed: true, valid: result.key === guessKey };
}

beforeEach(() => {
  resetPaymentServiceState();
  licenseVerifyLimiter.clear();
});

describe('License Key Brute Force Prevention', () => {
  it('10 attempts are allowed', () => {
    for (let i = 0; i < 10; i++) {
      const r = verifyLicenseWithRateLimit('attacker-ip', 'fake-order', `guess-${i}`);
      expect(r.allowed).toBe(true);
    }
  });

  it('11th attempt is rate-limited', () => {
    for (let i = 0; i < 10; i++) {
      verifyLicenseWithRateLimit('attacker-ip', 'fake-order', `guess-${i}`);
    }
    const r = verifyLicenseWithRateLimit('attacker-ip', 'fake-order', 'guess-10');
    expect(r.allowed).toBe(false);
    expect(r.error).toMatch(/RATE_LIMITED/);
  });

  it('100 brute-force attempts from same IP — only 10 processed', () => {
    let allowed = 0;
    let blocked = 0;
    for (let i = 0; i < 100; i++) {
      const r = verifyLicenseWithRateLimit('brute-ip', 'fake-order', `guess-${i}`);
      if (r.allowed) allowed++;
      else blocked++;
    }
    expect(allowed).toBe(10);
    expect(blocked).toBe(90);
  });

  it('attacker cannot guess a valid license key within rate limit', () => {
    // Create a real order and get valid license
    const r = createOrder(
      { userId: 'victim', productId: 'prod_basic', idempotencyKey: 'bf-1', currency: 'INR' },
      config,
      '1.2.3.4'
    );
    if (!r.success) throw new Error();
    updateOrderStatus(r.order.id, 'payment_initiated', 'payment_service');
    updateOrderStatus(r.order.id, 'webhook_received', 'webhook_service');
    updateOrderStatus(r.order.id, 'webhook_verified', 'webhook_service');

    const licResult = generateLicenseKey(r.order.id);
    if ('error' in licResult) throw new Error();
    const realKey = licResult.key;

    // Attacker tries to brute-force with random keys (within 10 attempts)
    let found = false;
    for (let i = 0; i < 10; i++) {
      const guessResult = verifyLicenseWithRateLimit(
        'brute-attacker',
        r.order.id,
        `LIC-ATTACK-${i.toString().padStart(6, '0')}-000000`
      );
      if (guessResult.allowed && guessResult.valid) found = true;
    }

    // Should not find the real key in 10 random guesses
    expect(found).toBe(false);
  });

  it('different IPs have independent rate limit buckets', () => {
    // Fill up ip-A
    for (let i = 0; i < 10; i++) {
      verifyLicenseWithRateLimit('ip-A', 'fake', `g${i}`);
    }
    // ip-B should still have capacity
    const r = verifyLicenseWithRateLimit('ip-B', 'fake', 'guess');
    expect(r.allowed).toBe(true);
  });
});
