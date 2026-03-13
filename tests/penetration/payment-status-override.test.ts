/**
 * Penetration test — Payment Status Override Attack
 * Attacker attempts to directly change order status to "completed" or "webhook_verified"
 * without going through the actual payment/webhook flow.
 */

import {
  createOrder,
  updateOrderStatus,
  generateLicenseKey,
  resetPaymentServiceState,
  getOrder,
  type PaymentServiceConfig,
} from '../../src/lib/payment/payment-service.js';

const config: PaymentServiceConfig = {
  productCatalog: [{ id: 'prod_basic', name: 'Basic', price: 999, currency: 'INR' }],
  maxOrdersPerHourPerIp: 10,
  maxOrdersPerDayPerUser: 20,
};

beforeEach(() => resetPaymentServiceState());

describe('Payment Status Override Attack', () => {
  it('attacker cannot directly set status to "completed" from pending', () => {
    const r = createOrder(
      { userId: 'attacker', productId: 'prod_basic', idempotencyKey: 'pso-1', currency: 'INR' },
      config,
      '192.168.1.1'
    );
    if (!r.success) throw new Error();

    const attack = updateOrderStatus(r.order.id, 'completed', 'payment_service');
    expect(attack.success).toBe(false);
    expect(getOrder(r.order.id)?.status).toBe('pending');
  });

  it('attacker cannot set status to "webhook_verified" from pending', () => {
    const r = createOrder(
      { userId: 'attacker', productId: 'prod_basic', idempotencyKey: 'pso-2', currency: 'INR' },
      config,
      '192.168.1.2'
    );
    if (!r.success) throw new Error();

    const attack = updateOrderStatus(r.order.id, 'webhook_verified', 'payment_service');
    expect(attack.success).toBe(false);
  });

  it('license cannot be obtained after status override attempt', () => {
    const r = createOrder(
      { userId: 'attacker', productId: 'prod_basic', idempotencyKey: 'pso-3', currency: 'INR' },
      config,
      '192.168.1.3'
    );
    if (!r.success) throw new Error();

    // Attack fails
    updateOrderStatus(r.order.id, 'webhook_verified', 'payment_service');

    // Still no license
    const lic = generateLicenseKey(r.order.id);
    expect('error' in lic).toBe(true);
  });

  it('attacker cannot reset a completed order to pending', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'pso-4', currency: 'INR' },
      config,
      '10.0.0.1'
    );
    if (!r.success) throw new Error();

    // Legitimate flow
    updateOrderStatus(r.order.id, 'payment_initiated', 'payment_service');
    updateOrderStatus(r.order.id, 'webhook_received', 'webhook_service');
    updateOrderStatus(r.order.id, 'webhook_verified', 'webhook_service');
    updateOrderStatus(r.order.id, 'completed', 'webhook_service');

    // Attacker tries to reset order to get a second license
    const resetAttack = updateOrderStatus(r.order.id, 'pending', 'payment_service');
    expect(resetAttack.success).toBe(false);
    expect(getOrder(r.order.id)?.status).toBe('completed');
  });

  it('status manipulation of non-existent order is rejected', () => {
    const r = updateOrderStatus('fake-order-999', 'completed', 'admin');
    expect(r.success).toBe(false);
    if (r.success) throw new Error();
    expect(r.error).toMatch(/ORDER_NOT_FOUND/);
  });
});
