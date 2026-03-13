/**
 * Integration test — Price Tampering Detection
 * Frontend cannot modify prices; server locks the amount from the catalog.
 */

import {
  createOrder,
  resetPaymentServiceState,
  type PaymentServiceConfig,
} from '../../src/lib/payment/payment-service.js';

const config: PaymentServiceConfig = {
  productCatalog: [
    { id: 'prod_basic', name: 'Basic', price: 999, currency: 'INR' },
    { id: 'prod_pro', name: 'Pro', price: 4999, currency: 'INR' },
  ],
  maxOrdersPerHourPerIp: 10,
  maxOrdersPerDayPerUser: 20,
};

beforeEach(() => resetPaymentServiceState());

describe('Price Tampering Detection', () => {
  it('rejects clientAmount = 1 (nearly-free attack)', () => {
    const r = createOrder(
      { userId: 'attacker', productId: 'prod_pro', idempotencyKey: 'pt-1', currency: 'INR', clientAmount: 1 },
      config,
      '1.2.3.4'
    );
    expect(r.success).toBe(false);
    if (r.success) throw new Error();
    expect(r.error).toMatch(/PRICE_TAMPERED/);
  });

  it('rejects clientAmount = 0 (free-order attack)', () => {
    const r = createOrder(
      { userId: 'attacker', productId: 'prod_basic', idempotencyKey: 'pt-2', currency: 'INR', clientAmount: 0 },
      config,
      '1.2.3.4'
    );
    expect(r.success).toBe(false);
  });

  it('rejects clientAmount = -1 (negative amount attack)', () => {
    const r = createOrder(
      { userId: 'attacker', productId: 'prod_basic', idempotencyKey: 'pt-3', currency: 'INR', clientAmount: -1 },
      config,
      '1.2.3.4'
    );
    expect(r.success).toBe(false);
  });

  it('rejects Pro plan price when trying to buy it at Basic plan price', () => {
    const r = createOrder(
      { userId: 'attacker', productId: 'prod_pro', idempotencyKey: 'pt-4', currency: 'INR', clientAmount: 999 },
      config,
      '1.2.3.4'
    );
    expect(r.success).toBe(false);
    if (r.success) throw new Error();
    expect(r.error).toMatch(/PRICE_TAMPERED/);
  });

  it('locked amount is always catalog price regardless of clientAmount omission', () => {
    const r = createOrder(
      { userId: 'user1', productId: 'prod_pro', idempotencyKey: 'pt-5', currency: 'INR' },
      config,
      '1.2.3.5'
    );
    expect(r.success).toBe(true);
    if (!r.success) throw new Error();
    expect(r.order.lockedAmount).toBe(4999); // catalog price, not whatever client sent
  });

  it('accepts correct catalog price from client', () => {
    const r = createOrder(
      { userId: 'user1', productId: 'prod_basic', idempotencyKey: 'pt-6', currency: 'INR', clientAmount: 999 },
      config,
      '1.2.3.6'
    );
    expect(r.success).toBe(true);
  });
});
