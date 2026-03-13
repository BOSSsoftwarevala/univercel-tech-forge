/**
 * Integration test — License Generation Gating
 * License key is only generated after webhook_verified = true.
 */

import {
  createOrder,
  updateOrderStatus,
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

describe('License Generation Gating', () => {
  it('denies license in "pending" status', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'lg-1', currency: 'INR' },
      config,
      '1.2.3.4'
    );
    if (!r.success) throw new Error();
    const lic = generateLicenseKey(r.order.id);
    expect('error' in lic).toBe(true);
  });

  it('denies license in "payment_initiated" status', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'lg-2', currency: 'INR' },
      config,
      '1.2.3.4'
    );
    if (!r.success) throw new Error();
    updateOrderStatus(r.order.id, 'payment_initiated', 'payment_service');
    expect('error' in generateLicenseKey(r.order.id)).toBe(true);
  });

  it('denies license in "webhook_received" (not yet verified)', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'lg-3', currency: 'INR' },
      config,
      '1.2.3.4'
    );
    if (!r.success) throw new Error();
    updateOrderStatus(r.order.id, 'payment_initiated', 'payment_service');
    updateOrderStatus(r.order.id, 'webhook_received', 'webhook_service');
    expect('error' in generateLicenseKey(r.order.id)).toBe(true);
  });

  it('grants license only after webhook_verified', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'lg-4', currency: 'INR' },
      config,
      '1.2.3.4'
    );
    if (!r.success) throw new Error();
    updateOrderStatus(r.order.id, 'payment_initiated', 'payment_service');
    updateOrderStatus(r.order.id, 'webhook_received', 'webhook_service');
    updateOrderStatus(r.order.id, 'webhook_verified', 'webhook_service');

    const lic = generateLicenseKey(r.order.id);
    expect('key' in lic).toBe(true);
    if (!('key' in lic)) throw new Error();
    expect(lic.key).toMatch(/^LIC-/);
  });

  it('license key is deterministic (same order → same key)', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'lg-5', currency: 'INR' },
      config,
      '1.2.3.4'
    );
    if (!r.success) throw new Error();
    updateOrderStatus(r.order.id, 'payment_initiated', 'payment_service');
    updateOrderStatus(r.order.id, 'webhook_received', 'webhook_service');
    updateOrderStatus(r.order.id, 'webhook_verified', 'webhook_service');

    const lic1 = generateLicenseKey(r.order.id);
    const lic2 = generateLicenseKey(r.order.id);
    if (!('key' in lic1) || !('key' in lic2)) throw new Error();
    expect(lic1.key).toBe(lic2.key);
  });

  it('denies license for failed order', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'lg-6', currency: 'INR' },
      config,
      '1.2.3.4'
    );
    if (!r.success) throw new Error();
    updateOrderStatus(r.order.id, 'failed', 'admin');
    expect('error' in generateLicenseKey(r.order.id)).toBe(true);
  });
});
