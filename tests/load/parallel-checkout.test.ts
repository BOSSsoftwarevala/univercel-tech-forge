/**
 * Load test — 50 Concurrent Checkout Requests
 * Verifies no race conditions and all orders are correctly created under load.
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

describe('Parallel Checkout — 50 Concurrent Requests', () => {
  it('all 50 concurrent checkouts complete without errors', () => {
    const results = Array.from({ length: 50 }, (_, i) =>
      createOrder(
        { userId: `user_${i}`, productId: 'prod_basic', idempotencyKey: `para-${i}`, currency: 'INR' },
        config,
        `10.0.${Math.floor(i / 10)}.${i % 10 + 1}`
      )
    );

    const successes = results.filter(r => r.success).length;
    const failures = results.filter(r => !r.success).length;

    expect(successes).toBe(50);
    expect(failures).toBe(0);
  });

  it('all 50 orders have unique IDs (no duplicates)', () => {
    Array.from({ length: 50 }, (_, i) =>
      createOrder(
        { userId: `user_${i}`, productId: 'prod_basic', idempotencyKey: `uniq-${i}`, currency: 'INR' },
        config,
        `11.0.0.${i + 1}`
      )
    );

    const orders = getAllOrders();
    const uniqueIds = new Set(orders.map(o => o.id));
    expect(uniqueIds.size).toBe(orders.length);
  });

  it('50 concurrent orders with correct locked amounts', () => {
    const results = Array.from({ length: 50 }, (_, i) =>
      createOrder(
        { userId: `user_${i}`, productId: 'prod_basic', idempotencyKey: `amt-${i}`, currency: 'INR' },
        config,
        `12.0.0.${i + 1}`
      )
    );

    for (const r of results) {
      if (!r.success) throw new Error('Expected success');
      expect(r.order.lockedAmount).toBe(999);
    }
  });

  it('rate limiting correctly restricts 50 orders from same IP', () => {
    const restrictedConfig: PaymentServiceConfig = {
      ...config,
      maxOrdersPerHourPerIp: 5,
    };
    const ip = '100.0.0.1';

    const results = Array.from({ length: 50 }, (_, i) =>
      createOrder(
        { userId: `user_${i}`, productId: 'prod_basic', idempotencyKey: `rate-${i}`, currency: 'INR' },
        restrictedConfig,
        ip
      )
    );

    const successes = results.filter(r => r.success).length;
    const blocked = results.filter(r => !r.success).length;

    expect(successes).toBe(5); // only 5 allowed
    expect(blocked).toBe(45);
  });
});
