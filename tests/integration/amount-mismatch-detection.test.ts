/**
 * Integration test — Amount Mismatch Detection
 * Payment amount from gateway must exactly match locked order amount.
 */

import {
  createOrder,
  verifyPaymentAmount,
  resetPaymentServiceState,
  type PaymentServiceConfig,
} from '../../src/lib/payment/payment-service.js';

const config: PaymentServiceConfig = {
  productCatalog: [
    { id: 'prod_basic', name: 'Basic', price: 999, currency: 'INR' },
    { id: 'prod_usd', name: 'USD Plan', price: 49, currency: 'USD' },
  ],
  maxOrdersPerHourPerIp: 10,
  maxOrdersPerDayPerUser: 20,
};

beforeEach(() => resetPaymentServiceState());

describe('Amount Mismatch Detection', () => {
  it('accepts exact amount match', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'am-1', currency: 'INR' },
      config,
      '1.2.3.4'
    );
    if (!r.success) throw new Error();
    expect(verifyPaymentAmount(r.order.id, 999, 'INR').valid).toBe(true);
  });

  it('rejects amount that is 1 rupee less', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'am-2', currency: 'INR' },
      config,
      '1.2.3.4'
    );
    if (!r.success) throw new Error();
    const check = verifyPaymentAmount(r.order.id, 998, 'INR');
    expect(check.valid).toBe(false);
    if (check.valid) throw new Error();
    expect(check.reason).toMatch(/AMOUNT_MISMATCH/);
  });

  it('rejects amount that is more than locked amount', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'am-3', currency: 'INR' },
      config,
      '1.2.3.4'
    );
    if (!r.success) throw new Error();
    expect(verifyPaymentAmount(r.order.id, 1000, 'INR').valid).toBe(false);
  });

  it('rejects zero amount', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'am-4', currency: 'INR' },
      config,
      '1.2.3.4'
    );
    if (!r.success) throw new Error();
    expect(verifyPaymentAmount(r.order.id, 0, 'INR').valid).toBe(false);
  });

  it('rejects negative amount', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'am-5', currency: 'INR' },
      config,
      '1.2.3.4'
    );
    if (!r.success) throw new Error();
    expect(verifyPaymentAmount(r.order.id, -999, 'INR').valid).toBe(false);
  });

  it('rejects currency mismatch (INR order, USD payment)', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'am-6', currency: 'INR' },
      config,
      '1.2.3.4'
    );
    if (!r.success) throw new Error();
    const check = verifyPaymentAmount(r.order.id, 999, 'USD');
    expect(check.valid).toBe(false);
    if (check.valid) throw new Error();
    expect(check.reason).toMatch(/CURRENCY_MISMATCH/);
  });

  it('rejects amount for non-existent order', () => {
    const check = verifyPaymentAmount('fake-order-id', 999, 'INR');
    expect(check.valid).toBe(false);
  });
});
