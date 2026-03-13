/**
 * Security test — Unauthorized Payment Insert Attempt
 * Direct inserts into the payments table (bypassing the payment flow) must be blocked.
 */

import {
  createOrder,
  updateOrderStatus,
  verifyPaymentAmount,
  generateLicenseKey,
  resetPaymentServiceState,
  type PaymentServiceConfig,
} from '../../src/lib/payment/payment-service.js';

const config: PaymentServiceConfig = {
  productCatalog: [{ id: 'prod_basic', name: 'Basic', price: 999, currency: 'INR' }],
  maxOrdersPerHourPerIp: 10,
  maxOrdersPerDayPerUser: 20,
};

beforeEach(() => resetPaymentServiceState());

describe('Unauthorized Payment Insert Attempt', () => {
  it('cannot generate license without going through payment flow', () => {
    // Attacker tries to get license without creating order via proper flow
    const lic = generateLicenseKey('nonexistent-order-id');
    expect('error' in lic).toBe(true);
    if (!('error' in lic)) throw new Error();
    expect(lic.error).toMatch(/ORDER_NOT_FOUND/);
  });

  it('cannot verify payment for a non-existent order', () => {
    const check = verifyPaymentAmount('fake-order-xyz', 999, 'INR');
    expect(check.valid).toBe(false);
  });

  it('order must be created first before any status update', () => {
    const r = updateOrderStatus('nonexistent', 'webhook_verified', 'webhook_service');
    expect(r.success).toBe(false);
    if (r.success) throw new Error();
    expect(r.error).toMatch(/ORDER_NOT_FOUND/);
  });

  it('webhook_verified status requires traversing full state machine', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'upi-1', currency: 'INR' },
      config,
      '1.2.3.4'
    );
    if (!r.success) throw new Error();

    // Attempt to jump directly to webhook_verified from pending
    const jump = updateOrderStatus(r.order.id, 'webhook_verified', 'webhook_service');
    expect(jump.success).toBe(false);

    // Still can't get license
    const lic = generateLicenseKey(r.order.id);
    expect('error' in lic).toBe(true);
  });

  it('full state machine must be traversed to unlock license', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'upi-2', currency: 'INR' },
      config,
      '1.2.3.4'
    );
    if (!r.success) throw new Error();

    // Proper flow
    updateOrderStatus(r.order.id, 'payment_initiated', 'payment_service');
    updateOrderStatus(r.order.id, 'webhook_received', 'webhook_service');
    updateOrderStatus(r.order.id, 'webhook_verified', 'webhook_service');

    const lic = generateLicenseKey(r.order.id);
    expect('key' in lic).toBe(true);
  });

  it('amount verification fails for arbitrary amounts', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'upi-3', currency: 'INR' },
      config,
      '1.2.3.4'
    );
    if (!r.success) throw new Error();

    // Various unauthorized amounts
    for (const amount of [0, 1, -999, 99999, 998.99]) {
      expect(verifyPaymentAmount(r.order.id, amount, 'INR').valid).toBe(false);
    }
  });
});
