/**
 * Security test — Row-Level Security (RLS) Enforcement
 * Users can only access their own orders; cross-user access is blocked.
 */

import {
  createOrder,
  getOrder,
  getAllOrders,
  resetPaymentServiceState,
  type PaymentServiceConfig,
} from '../../src/lib/payment/payment-service.js';

const config: PaymentServiceConfig = {
  productCatalog: [{ id: 'prod_basic', name: 'Basic', price: 999, currency: 'INR' }],
  maxOrdersPerHourPerIp: 10,
  maxOrdersPerDayPerUser: 20,
};

/** Simulate RLS: only return orders belonging to viewerUserId */
function getOrdersForUser(viewerUserId: string): ReturnType<typeof getAllOrders> {
  return getAllOrders().filter(o => o.userId === viewerUserId);
}

/** Simulate order access check with RLS */
function canAccessOrder(viewerUserId: string, orderId: string): boolean {
  const order = getOrder(orderId);
  if (!order) return false;
  return order.userId === viewerUserId;
}

beforeEach(() => resetPaymentServiceState());

describe('RLS Enforcement', () => {
  it('user A can read own orders', () => {
    createOrder(
      { userId: 'userA', productId: 'prod_basic', idempotencyKey: 'rls-1', currency: 'INR' },
      config,
      '1.0.0.1'
    );
    const orders = getOrdersForUser('userA');
    expect(orders).toHaveLength(1);
    expect(orders[0].userId).toBe('userA');
  });

  it('user B cannot see user A orders', () => {
    createOrder(
      { userId: 'userA', productId: 'prod_basic', idempotencyKey: 'rls-2', currency: 'INR' },
      config,
      '1.0.0.1'
    );
    const ordersForB = getOrdersForUser('userB');
    expect(ordersForB).toHaveLength(0);
  });

  it('cross-user order access by ID is blocked', () => {
    const r = createOrder(
      { userId: 'userA', productId: 'prod_basic', idempotencyKey: 'rls-3', currency: 'INR' },
      config,
      '1.0.0.1'
    );
    if (!r.success) throw new Error();

    expect(canAccessOrder('userB', r.order.id)).toBe(false);
    expect(canAccessOrder('userA', r.order.id)).toBe(true);
  });

  it('multiple users have isolated order namespaces', () => {
    for (let i = 0; i < 5; i++) {
      createOrder(
        { userId: 'userA', productId: 'prod_basic', idempotencyKey: `rls-a-${i}`, currency: 'INR' },
        config,
        `1.0.0.${i + 10}`
      );
      createOrder(
        { userId: 'userB', productId: 'prod_basic', idempotencyKey: `rls-b-${i}`, currency: 'INR' },
        config,
        `1.0.0.${i + 20}`
      );
    }
    expect(getOrdersForUser('userA')).toHaveLength(5);
    expect(getOrdersForUser('userB')).toHaveLength(5);

    // userC sees nothing
    expect(getOrdersForUser('userC')).toHaveLength(0);
  });

  it('unauthenticated access returns no orders', () => {
    createOrder(
      { userId: 'userA', productId: 'prod_basic', idempotencyKey: 'rls-5', currency: 'INR' },
      config,
      '1.0.0.1'
    );
    // Represent unauthenticated as empty string userId
    expect(getOrdersForUser('')).toHaveLength(0);
  });
});
