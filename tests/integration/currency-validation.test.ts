/**
 * Integration test — Currency Validation
 */

import {
  createOrder,
  verifyPaymentAmount,
  resetPaymentServiceState,
  type PaymentServiceConfig,
} from '../../src/lib/payment/payment-service.js';

const config: PaymentServiceConfig = {
  productCatalog: [
    { id: 'prod_inr', name: 'INR Plan', price: 999, currency: 'INR' },
    { id: 'prod_usd', name: 'USD Plan', price: 49, currency: 'USD' },
    { id: 'prod_eur', name: 'EUR Plan', price: 39, currency: 'EUR' },
  ],
  maxOrdersPerHourPerIp: 10,
  maxOrdersPerDayPerUser: 20,
};

beforeEach(() => resetPaymentServiceState());

describe('Currency Validation', () => {
  it('allows INR order with INR payment', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_inr', idempotencyKey: 'cv-1', currency: 'INR' },
      config,
      '1.2.3.4'
    );
    expect(r.success).toBe(true);
    if (!r.success) throw new Error();
    expect(verifyPaymentAmount(r.order.id, 999, 'INR').valid).toBe(true);
  });

  it('allows USD order with USD payment', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_usd', idempotencyKey: 'cv-2', currency: 'USD' },
      config,
      '1.2.3.4'
    );
    expect(r.success).toBe(true);
    if (!r.success) throw new Error();
    expect(verifyPaymentAmount(r.order.id, 49, 'USD').valid).toBe(true);
  });

  it('rejects order for INR product but USD currency requested', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_inr', idempotencyKey: 'cv-3', currency: 'USD' },
      config,
      '1.2.3.4'
    );
    expect(r.success).toBe(false);
    if (r.success) throw new Error();
    expect(r.error).toMatch(/CURRENCY_MISMATCH/);
  });

  it('rejects payment in wrong currency for existing order', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_eur', idempotencyKey: 'cv-4', currency: 'EUR' },
      config,
      '1.2.3.4'
    );
    if (!r.success) throw new Error();

    // Try to pay in USD
    const check = verifyPaymentAmount(r.order.id, 39, 'USD');
    expect(check.valid).toBe(false);
    if (check.valid) throw new Error();
    expect(check.reason).toMatch(/CURRENCY_MISMATCH/);
  });

  it('locks currency at order creation, cannot be changed', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_inr', idempotencyKey: 'cv-5', currency: 'INR' },
      config,
      '1.2.3.4'
    );
    if (!r.success) throw new Error();
    expect(r.order.currency).toBe('INR');

    // Even if attacker tries to pay in different currency with same amount
    expect(verifyPaymentAmount(r.order.id, 999, 'USD').valid).toBe(false);
    expect(verifyPaymentAmount(r.order.id, 999, 'EUR').valid).toBe(false);
    expect(verifyPaymentAmount(r.order.id, 999, 'INR').valid).toBe(true);
  });
});
