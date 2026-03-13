/**
 * Integration test — Daily Reconciliation Accuracy
 * Ledger entries must exactly match order totals; discrepancies are detected.
 */

import { PaymentLedger } from '../../src/lib/payment/ledger-hash.js';
import {
  createOrder,
  updateOrderStatus,
  resetPaymentServiceState,
  getAllOrders,
  type PaymentServiceConfig,
} from '../../src/lib/payment/payment-service.js';

const config: PaymentServiceConfig = {
  productCatalog: [
    { id: 'prod_basic', name: 'Basic', price: 999, currency: 'INR' },
    { id: 'prod_pro', name: 'Pro', price: 4999, currency: 'INR' },
  ],
  maxOrdersPerHourPerIp: 100,
  maxOrdersPerDayPerUser: 100,
};

beforeEach(() => resetPaymentServiceState());

/** Simulate completing an order and appending to ledger */
function completeAndRecord(
  ledger: PaymentLedger,
  userId: string,
  productId: string,
  key: string,
  ip: string
): number {
  const r = createOrder({ userId, productId, idempotencyKey: key, currency: 'INR' }, config, ip);
  if (!r.success) throw new Error(r.error);
  const { order } = r;

  updateOrderStatus(order.id, 'payment_initiated', 'payment_service');
  updateOrderStatus(order.id, 'webhook_received', 'webhook_service');
  updateOrderStatus(order.id, 'webhook_verified', 'webhook_service');
  updateOrderStatus(order.id, 'completed', 'webhook_service');

  ledger.append({ orderId: order.id, amount: order.lockedAmount, currency: order.currency, action: 'credit' });
  return order.lockedAmount;
}

describe('Reconciliation Accuracy', () => {
  it('total ledger credits match sum of completed order amounts', () => {
    const ledger = new PaymentLedger();
    let expectedTotal = 0;

    expectedTotal += completeAndRecord(ledger, 'u1', 'prod_basic', 'rec-1', '1.0.0.1');
    expectedTotal += completeAndRecord(ledger, 'u2', 'prod_pro', 'rec-2', '1.0.0.2');
    expectedTotal += completeAndRecord(ledger, 'u3', 'prod_basic', 'rec-3', '1.0.0.3');

    const ledgerTotal = ledger.getEntries().reduce((sum, e) => sum + e.amount, 0);
    expect(ledgerTotal).toBe(expectedTotal);
  });

  it('detects mismatch when ledger is tampered', () => {
    const ledger = new PaymentLedger();
    completeAndRecord(ledger, 'u1', 'prod_basic', 'rec-t1', '1.0.0.4');
    completeAndRecord(ledger, 'u2', 'prod_basic', 'rec-t2', '1.0.0.5');

    // Tamper one ledger entry (simulates fraud)
    ledger._tamperEntry(0, 1); // change 999 → 1

    const { valid } = ledger.verify();
    expect(valid).toBe(false);
  });

  it('ledger chain remains valid after 20 legitimate entries', () => {
    const ledger = new PaymentLedger();
    for (let i = 0; i < 20; i++) {
      completeAndRecord(ledger, `u${i}`, 'prod_basic', `rec-bulk-${i}`, `1.0.1.${i}`);
    }
    expect(ledger.length).toBe(20);
    expect(ledger.verify().valid).toBe(true);
  });

  it('count of completed orders matches ledger entries', () => {
    const ledger = new PaymentLedger();
    for (let i = 0; i < 5; i++) {
      completeAndRecord(ledger, `u${i}`, 'prod_pro', `rec-cnt-${i}`, `2.0.0.${i}`);
    }
    const completedOrders = getAllOrders().filter(o => o.status === 'completed');
    expect(completedOrders.length).toBe(ledger.length);
  });
});
