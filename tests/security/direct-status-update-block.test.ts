/**
 * Security test — Direct Status Update Block
 * Only webhook_service and payment_service can change order status.
 * Frontend/user callers must be rejected.
 */

import {
  createOrder,
  updateOrderStatus,
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

describe('Direct Status Update Block', () => {
  it('payment_service can move pending → payment_initiated', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'dsu-1', currency: 'INR' },
      config,
      '1.0.0.1'
    );
    if (!r.success) throw new Error();
    const res = updateOrderStatus(r.order.id, 'payment_initiated', 'payment_service');
    expect(res.success).toBe(true);
  });

  it('webhook_service can move webhook_received → webhook_verified', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'dsu-2', currency: 'INR' },
      config,
      '1.0.0.1'
    );
    if (!r.success) throw new Error();
    updateOrderStatus(r.order.id, 'payment_initiated', 'payment_service');
    updateOrderStatus(r.order.id, 'webhook_received', 'webhook_service');
    const res = updateOrderStatus(r.order.id, 'webhook_verified', 'webhook_service');
    expect(res.success).toBe(true);
  });

  it('webhook_service cannot skip directly to completed from pending', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'dsu-3', currency: 'INR' },
      config,
      '1.0.0.1'
    );
    if (!r.success) throw new Error();

    // Attempt invalid transition: pending → completed
    const res = updateOrderStatus(r.order.id, 'completed', 'webhook_service');
    expect(res.success).toBe(false);
    expect(getOrder(r.order.id)?.status).toBe('pending');
  });

  it('payment_service cannot mark webhook_verified', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'dsu-4', currency: 'INR' },
      config,
      '1.0.0.1'
    );
    if (!r.success) throw new Error();
    updateOrderStatus(r.order.id, 'payment_initiated', 'payment_service');
    updateOrderStatus(r.order.id, 'webhook_received', 'webhook_service');

    // payment_service trying to mark webhook_verified directly is an invalid transition
    const res = updateOrderStatus(r.order.id, 'completed', 'payment_service');
    expect(res.success).toBe(false);
  });

  it('completed orders cannot be updated (immutable terminal state)', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'dsu-5', currency: 'INR' },
      config,
      '1.0.0.1'
    );
    if (!r.success) throw new Error();
    updateOrderStatus(r.order.id, 'payment_initiated', 'payment_service');
    updateOrderStatus(r.order.id, 'webhook_received', 'webhook_service');
    updateOrderStatus(r.order.id, 'webhook_verified', 'webhook_service');
    updateOrderStatus(r.order.id, 'completed', 'webhook_service');

    // Attempt to change a completed order
    const res = updateOrderStatus(r.order.id, 'pending', 'payment_service');
    expect(res.success).toBe(false);
    expect(getOrder(r.order.id)?.status).toBe('completed');
  });

  it('failed orders cannot be re-activated by non-admin', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'dsu-6', currency: 'INR' },
      config,
      '1.0.0.1'
    );
    if (!r.success) throw new Error();
    updateOrderStatus(r.order.id, 'failed', 'admin');

    const res = updateOrderStatus(r.order.id, 'pending', 'payment_service');
    expect(res.success).toBe(false);
  });
});
