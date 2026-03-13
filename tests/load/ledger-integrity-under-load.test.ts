/**
 * Load test — Ledger Integrity Under Load (100+ orders)
 * Hash chain must remain valid after many concurrent appends.
 */

import { PaymentLedger } from '../../src/lib/payment/ledger-hash.js';
import {
  createOrder,
  updateOrderStatus,
  resetPaymentServiceState,
  type PaymentServiceConfig,
} from '../../src/lib/payment/payment-service.js';

const config: PaymentServiceConfig = {
  productCatalog: [
    { id: 'prod_basic', name: 'Basic', price: 999, currency: 'INR' },
    { id: 'prod_pro', name: 'Pro', price: 4999, currency: 'INR' },
  ],
  maxOrdersPerHourPerIp: 1000,
  maxOrdersPerDayPerUser: 1000,
};

beforeEach(() => resetPaymentServiceState());

describe('Ledger Integrity Under Load', () => {
  it('100 ledger entries maintain chain integrity', () => {
    const ledger = new PaymentLedger();
    for (let i = 0; i < 100; i++) {
      ledger.append({
        orderId: `order_${i}`,
        amount: (i % 2 === 0) ? 999 : 4999,
        currency: 'INR',
        action: 'credit',
      });
    }

    expect(ledger.length).toBe(100);
    expect(ledger.verify().valid).toBe(true);
  });

  it('500 ledger entries — chain still valid', () => {
    const ledger = new PaymentLedger();
    for (let i = 0; i < 500; i++) {
      ledger.append({
        orderId: `bulk_order_${i}`,
        amount: 999,
        currency: 'INR',
        action: 'credit',
      });
    }
    expect(ledger.verify().valid).toBe(true);
  });

  it('tampering entry 50 out of 100 is detected immediately', () => {
    const ledger = new PaymentLedger();
    for (let i = 0; i < 100; i++) {
      ledger.append({ orderId: `t_${i}`, amount: 1000, currency: 'INR', action: 'credit' });
    }

    ledger._tamperEntry(50, 1); // zero-day tampering
    const { valid, brokenAt } = ledger.verify();
    expect(valid).toBe(false);
    expect(brokenAt).toBe(50);
  });

  it('cumulative total from ledger matches expected sum after 100 orders', () => {
    const ledger = new PaymentLedger();
    let expectedTotal = 0;

    for (let i = 0; i < 100; i++) {
      const amount = (i % 3 === 0) ? 4999 : 999;
      ledger.append({ orderId: `sum_${i}`, amount, currency: 'INR', action: 'credit' });
      expectedTotal += amount;
    }

    const actualTotal = ledger.getEntries().reduce((s, e) => s + e.amount, 0);
    expect(actualTotal).toBe(expectedTotal);
  });

  it('completed order amounts in ledger match payment service order amounts', () => {
    const ledger = new PaymentLedger();
    let paymentServiceTotal = 0;

    for (let i = 0; i < 20; i++) {
      const productId = i % 2 === 0 ? 'prod_basic' : 'prod_pro';
      const r = createOrder(
        { userId: `u${i}`, productId, idempotencyKey: `ledger_load_${i}`, currency: 'INR' },
        config,
        `3.0.${Math.floor(i / 10)}.${i % 10 + 1}`
      );
      if (!r.success) throw new Error(r.error);

      updateOrderStatus(r.order.id, 'payment_initiated', 'payment_service');
      updateOrderStatus(r.order.id, 'webhook_received', 'webhook_service');
      updateOrderStatus(r.order.id, 'webhook_verified', 'webhook_service');
      updateOrderStatus(r.order.id, 'completed', 'webhook_service');

      ledger.append({
        orderId: r.order.id,
        amount: r.order.lockedAmount,
        currency: 'INR',
        action: 'credit',
      });

      paymentServiceTotal += r.order.lockedAmount;
    }

    const ledgerTotal = ledger.getEntries().reduce((s, e) => s + e.amount, 0);
    expect(ledgerTotal).toBe(paymentServiceTotal);
    expect(ledger.verify().valid).toBe(true);
  });
});
