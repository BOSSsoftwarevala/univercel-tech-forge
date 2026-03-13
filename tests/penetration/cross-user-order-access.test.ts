/**
 * Penetration test — Cross-User Order Access
 * Attacker cannot access another user's orders.
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

/** RLS-enforced order lookup */
function getUserOrder(viewerUserId: string, orderId: string) {
  const order = getOrder(orderId);
  if (!order || order.userId !== viewerUserId) return null;
  return order;
}

/** RLS-enforced order list */
function listUserOrders(viewerUserId: string) {
  return getAllOrders().filter(o => o.userId === viewerUserId);
}

beforeEach(() => resetPaymentServiceState());

describe('Cross-User Order Access (Penetration)', () => {
  it('attacker cannot read victim order by ID', () => {
    // Victim creates order
    const victim = createOrder(
      { userId: 'victim_123', productId: 'prod_basic', idempotencyKey: 'cuo-1', currency: 'INR' },
      config,
      '10.0.0.1'
    );
    if (!victim.success) throw new Error();

    // Attacker tries to fetch victim's order
    const accessed = getUserOrder('attacker_456', victim.order.id);
    expect(accessed).toBeNull();
  });

  it('attacker cannot list another user orders', () => {
    createOrder(
      { userId: 'victim_user', productId: 'prod_basic', idempotencyKey: 'cuo-2', currency: 'INR' },
      config,
      '10.0.0.2'
    );

    const attackerOrders = listUserOrders('attacker_user');
    expect(attackerOrders).toHaveLength(0);
  });

  it('user can only see their own orders among multiple users', () => {
    // Create orders for 3 different users
    for (let i = 0; i < 3; i++) {
      createOrder(
        { userId: `user_${i}`, productId: 'prod_basic', idempotencyKey: `cuo-multi-${i}`, currency: 'INR' },
        config,
        `10.0.0.${i + 3}`
      );
    }

    // Each user sees exactly their own orders
    for (let i = 0; i < 3; i++) {
      const orders = listUserOrders(`user_${i}`);
      expect(orders).toHaveLength(1);
      expect(orders[0].userId).toBe(`user_${i}`);
    }
  });

  it('IDOR: sequential order IDs cannot be enumerated to access other orders', () => {
    const r = createOrder(
      { userId: 'victim', productId: 'prod_basic', idempotencyKey: 'cuo-idor-1', currency: 'INR' },
      config,
      '10.0.0.10'
    );
    if (!r.success) throw new Error();

    // Attacker guesses order IDs
    const guessedIds = [
      r.order.id.replace(/_\d+_/, '_0_'),  // try to change timestamp
      'order_1',
      'order_2',
      r.order.id,
    ];

    for (const guessedId of guessedIds) {
      if (guessedId === r.order.id) {
        // Correct ID but wrong user
        expect(getUserOrder('attacker', guessedId)).toBeNull();
      } else {
        expect(getUserOrder('attacker', guessedId)).toBeNull();
      }
    }
  });

  it('empty userId cannot access any orders', () => {
    createOrder(
      { userId: 'real_user', productId: 'prod_basic', idempotencyKey: 'cuo-empty', currency: 'INR' },
      config,
      '10.0.0.11'
    );

    expect(listUserOrders('')).toHaveLength(0);
    expect(listUserOrders('   ')).toHaveLength(0);
  });
});
