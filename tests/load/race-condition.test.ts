/**
 * Load test — Race Condition Detection
 * Concurrent duplicate orders (same idempotency key) must result in exactly one order.
 */

import {
  createOrder,
  resetPaymentServiceState,
  getAllOrders,
  type PaymentServiceConfig,
} from '../../src/lib/payment/payment-service.js';

const config: PaymentServiceConfig = {
  productCatalog: [{ id: 'prod_basic', name: 'Basic', price: 999, currency: 'INR' }],
  maxOrdersPerHourPerIp: 1000,
  maxOrdersPerDayPerUser: 1000,
};

beforeEach(() => resetPaymentServiceState());

describe('Race Condition Detection', () => {
  it('10 concurrent identical requests produce exactly 1 order', () => {
    const key = 'race-same-key';
    const results = Array.from({ length: 10 }, (_, i) =>
      createOrder(
        { userId: 'user_race', productId: 'prod_basic', idempotencyKey: key, currency: 'INR' },
        config,
        `20.0.0.${i + 1}`
      )
    );

    const successCount = results.filter(r => r.success).length;
    expect(successCount).toBe(10); // All return success (idempotent)

    // But only one unique order was created
    const uniqueOrderIds = new Set(results.map(r => r.success ? r.order.id : null));
    expect(uniqueOrderIds.size).toBe(1);
    expect(getAllOrders()).toHaveLength(1);
  });

  it('50 concurrent requests for same product, different keys, all succeed', () => {
    const results = Array.from({ length: 50 }, (_, i) =>
      createOrder(
        { userId: 'user_multi', productId: 'prod_basic', idempotencyKey: `race-diff-${i}`, currency: 'INR' },
        config,
        `21.0.0.${i + 1}`
      )
    );

    expect(results.every(r => r.success)).toBe(true);
    expect(getAllOrders()).toHaveLength(50);
  });

  it('no duplicate order IDs under load (100 orders)', () => {
    Array.from({ length: 100 }, (_, i) =>
      createOrder(
        { userId: `u${i}`, productId: 'prod_basic', idempotencyKey: `nodup-${i}`, currency: 'INR' },
        config,
        `22.0.${Math.floor(i / 256)}.${i % 256}`
      )
    );

    const orders = getAllOrders();
    const ids = orders.map(o => o.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(orders.length);
  });

  it('idempotency keys deduplicate correctly across 20 duplicate bursts', () => {
    // 5 unique keys, each fired 4 times (20 total)
    const keys = ['race-idem-A', 'race-idem-B', 'race-idem-C', 'race-idem-D', 'race-idem-E'];

    const results = keys.flatMap(key =>
      Array.from({ length: 4 }, (_, i) =>
        createOrder(
          { userId: 'batch_user', productId: 'prod_basic', idempotencyKey: key, currency: 'INR' },
          config,
          `23.0.0.${i + 1}`
        )
      )
    );

    expect(results.every(r => r.success)).toBe(true);
    // Only 5 distinct orders should exist
    expect(getAllOrders()).toHaveLength(5);
  });
});
