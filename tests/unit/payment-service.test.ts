/**
 * Unit tests — Payment Service
 * Validates order creation, price-tamper detection, amount locking, and license gating.
 */

import {
  createOrder,
  updateOrderStatus,
  verifyPaymentAmount,
  generateLicenseKey,
  resetPaymentServiceState,
  checkIpRateLimit,
  checkUserRateLimit,
  type PaymentServiceConfig,
} from '../../src/lib/payment/payment-service.js';

const catalog: PaymentServiceConfig['productCatalog'] = [
  { id: 'prod_basic', name: 'Basic Plan', price: 999, currency: 'INR' },
  { id: 'prod_pro', name: 'Pro Plan', price: 2999, currency: 'INR' },
  { id: 'prod_usd', name: 'USD Plan', price: 49, currency: 'USD' },
];

const defaultConfig: PaymentServiceConfig = {
  productCatalog: catalog,
  maxOrdersPerHourPerIp: 5,
  maxOrdersPerDayPerUser: 10,
};

beforeEach(() => {
  resetPaymentServiceState();
});

// ─── Order Creation ─────────────────────────────────────────────────────────

describe('Order Creation', () => {
  it('creates a valid order with server-side locked amount', () => {
    const result = createOrder(
      { userId: 'user1', productId: 'prod_basic', idempotencyKey: 'key1', currency: 'INR' },
      defaultConfig,
      '1.2.3.4'
    );

    expect(result.success).toBe(true);
    if (!result.success) throw new Error('expected success');

    expect(result.order.lockedAmount).toBe(999);
    expect(result.order.status).toBe('pending');
    expect(result.order.webhookVerified).toBe(false);
  });

  it('rejects unknown product', () => {
    const result = createOrder(
      { userId: 'user1', productId: 'prod_unknown', idempotencyKey: 'key2', currency: 'INR' },
      defaultConfig,
      '1.2.3.4'
    );
    expect(result.success).toBe(false);
    if (result.success) throw new Error('expected failure');
    expect(result.error).toMatch(/INVALID_PRODUCT/);
  });

  it('rejects currency mismatch', () => {
    const result = createOrder(
      { userId: 'user1', productId: 'prod_basic', idempotencyKey: 'key3', currency: 'USD' },
      defaultConfig,
      '1.2.3.4'
    );
    expect(result.success).toBe(false);
    if (result.success) throw new Error('expected failure');
    expect(result.error).toMatch(/CURRENCY_MISMATCH/);
  });
});

// ─── Price Tampering ─────────────────────────────────────────────────────────

describe('Price Tampering Detection', () => {
  it('rejects order when client sends a lower amount', () => {
    const result = createOrder(
      {
        userId: 'user1',
        productId: 'prod_pro',
        idempotencyKey: 'key4',
        currency: 'INR',
        clientAmount: 1, // tampered!
      },
      defaultConfig,
      '1.2.3.4'
    );
    expect(result.success).toBe(false);
    if (result.success) throw new Error('expected failure');
    expect(result.error).toMatch(/PRICE_TAMPERED/);
  });

  it('rejects order when client sends zero amount', () => {
    const result = createOrder(
      {
        userId: 'user1',
        productId: 'prod_basic',
        idempotencyKey: 'key5',
        currency: 'INR',
        clientAmount: 0,
      },
      defaultConfig,
      '1.2.3.4'
    );
    expect(result.success).toBe(false);
    if (result.success) throw new Error('expected failure');
    expect(result.error).toMatch(/PRICE_TAMPERED/);
  });

  it('accepts order when client amount matches catalog', () => {
    const result = createOrder(
      {
        userId: 'user1',
        productId: 'prod_basic',
        idempotencyKey: 'key6',
        currency: 'INR',
        clientAmount: 999, // correct
      },
      defaultConfig,
      '1.2.3.4'
    );
    expect(result.success).toBe(true);
  });
});

// ─── Amount Locking ──────────────────────────────────────────────────────────

describe('Amount Locking', () => {
  it('locked amount cannot be changed after order creation', () => {
    const res = createOrder(
      { userId: 'user1', productId: 'prod_basic', idempotencyKey: 'key7', currency: 'INR' },
      defaultConfig,
      '1.2.3.4'
    );
    expect(res.success).toBe(true);
    if (!res.success) throw new Error();

    const originalAmount = res.order.lockedAmount;

    // Attempt mutation
    (res.order as { lockedAmount: number }).lockedAmount = 1;

    // Verify the stored order still has original amount
    const mismatch = verifyPaymentAmount(res.order.id, 1, 'INR');
    expect(mismatch.valid).toBe(false);

    const correct = verifyPaymentAmount(res.order.id, originalAmount, 'INR');
    expect(correct.valid).toBe(true);
  });
});

// ─── Status Transitions ──────────────────────────────────────────────────────

describe('Status Transitions', () => {
  let orderId: string;

  beforeEach(() => {
    const res = createOrder(
      { userId: 'user1', productId: 'prod_basic', idempotencyKey: 'keyT', currency: 'INR' },
      defaultConfig,
      '1.2.3.4'
    );
    if (!res.success) throw new Error();
    orderId = res.order.id;
  });

  it('allows valid transition: pending → payment_initiated', () => {
    const r = updateOrderStatus(orderId, 'payment_initiated', 'payment_service');
    expect(r.success).toBe(true);
  });

  it('rejects direct jump: pending → completed (by payment_service)', () => {
    const r = updateOrderStatus(orderId, 'completed', 'payment_service');
    expect(r.success).toBe(false);
  });

  it('admin can perform any transition', () => {
    const r = updateOrderStatus(orderId, 'completed', 'admin');
    expect(r.success).toBe(true);
  });
});

// ─── License Generation Gating ───────────────────────────────────────────────

describe('License Generation Gating', () => {
  it('rejects license before webhook verification', () => {
    const res = createOrder(
      { userId: 'user1', productId: 'prod_basic', idempotencyKey: 'keyL1', currency: 'INR' },
      defaultConfig,
      '1.2.3.4'
    );
    if (!res.success) throw new Error();

    const lic = generateLicenseKey(res.order.id);
    expect('error' in lic).toBe(true);
    if (!('error' in lic)) throw new Error();
    expect(lic.error).toMatch(/LICENSE_GATED/);
  });

  it('issues license after webhook_verified status', () => {
    const res = createOrder(
      { userId: 'user1', productId: 'prod_basic', idempotencyKey: 'keyL2', currency: 'INR' },
      defaultConfig,
      '1.2.3.4'
    );
    if (!res.success) throw new Error();

    updateOrderStatus(res.order.id, 'payment_initiated', 'payment_service');
    updateOrderStatus(res.order.id, 'webhook_received', 'webhook_service');
    updateOrderStatus(res.order.id, 'webhook_verified', 'webhook_service');

    const lic = generateLicenseKey(res.order.id);
    expect('key' in lic).toBe(true);
    if (!('key' in lic)) throw new Error();
    expect(lic.key).toMatch(/^LIC-/);
  });
});

// ─── Rate Limiting ───────────────────────────────────────────────────────────

describe('Rate Limiting', () => {
  it('IP rate limit: allows up to maxPerHour orders', () => {
    const ip = '10.0.0.1';
    for (let i = 0; i < 5; i++) {
      const r = checkIpRateLimit(ip, 5);
      expect(r.allowed).toBe(true);
      // simulate counting
      createOrder(
        { userId: `u${i}`, productId: 'prod_basic', idempotencyKey: `rk${i}`, currency: 'INR' },
        defaultConfig,
        ip
      );
    }
    const r = checkIpRateLimit(ip, 5);
    expect(r.allowed).toBe(false);
  });

  it('user rate limit: blocks after maxPerDay orders', () => {
    const userId = 'heavy_user';
    for (let i = 0; i < 10; i++) {
      createOrder(
        { userId, productId: 'prod_basic', idempotencyKey: `uk${i}`, currency: 'INR' },
        defaultConfig,
        `10.0.1.${i}`
      );
    }
    const r = checkUserRateLimit(userId, 10);
    expect(r.allowed).toBe(false);
  });
});
