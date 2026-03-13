/**
 * Load test — Multiple Webhooks for Same Order (Concurrency)
 * Only the first valid webhook should update status; duplicates rejected.
 */

import {
  createOrder,
  updateOrderStatus,
  getOrder,
  resetPaymentServiceState,
  type PaymentServiceConfig,
} from '../../src/lib/payment/payment-service.js';
import {
  verifyWebhookSignature,
  computeHmacSignature,
  checkAndRecordNonce,
  clearReplayCache,
  isWebhookTimestampFresh,
} from '../../src/lib/payment/webhook-signature.js';
import { verifyPaymentAmount } from '../../src/lib/payment/payment-service.js';

const config: PaymentServiceConfig = {
  productCatalog: [{ id: 'prod_basic', name: 'Basic', price: 999, currency: 'INR' }],
  maxOrdersPerHourPerIp: 1000,
  maxOrdersPerDayPerUser: 1000,
};

const SECRET = 'whsec_concurrency_test';

beforeEach(() => {
  resetPaymentServiceState();
  clearReplayCache();
});

function processWebhookAttempt(orderId: string, nonce: string, amount: number): boolean {
  const payload = JSON.stringify({ orderId, amount, currency: 'INR', event: 'payment.captured' });
  const sig = computeHmacSignature(payload, SECRET);
  const now = Math.floor(Date.now() / 1000);

  if (!verifyWebhookSignature(payload, sig, SECRET)) return false;
  if (!isWebhookTimestampFresh(now)) return false;
  if (!checkAndRecordNonce(nonce)) return false;
  if (!verifyPaymentAmount(orderId, amount, 'INR').valid) return false;

  const r1 = updateOrderStatus(orderId, 'webhook_received', 'webhook_service');
  if (!r1.success) return false;
  const r2 = updateOrderStatus(orderId, 'webhook_verified', 'webhook_service');
  return r2.success;
}

describe('Webhook Concurrency', () => {
  it('first webhook succeeds, duplicates are rejected', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'wc-1', currency: 'INR' },
      config,
      '1.0.0.1'
    );
    if (!r.success) throw new Error();
    updateOrderStatus(r.order.id, 'payment_initiated', 'payment_service');

    const nonce = 'concurrent-nonce-1';
    const first = processWebhookAttempt(r.order.id, nonce, 999);
    expect(first).toBe(true);

    // Duplicate with same nonce — replay attack
    const duplicate = processWebhookAttempt(r.order.id, nonce, 999);
    expect(duplicate).toBe(false);
  });

  it('5 concurrent webhooks for same order — exactly 1 succeeds', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'wc-2', currency: 'INR' },
      config,
      '1.0.0.1'
    );
    if (!r.success) throw new Error();
    updateOrderStatus(r.order.id, 'payment_initiated', 'payment_service');

    // All with unique nonces but same order
    const results = Array.from({ length: 5 }, (_, i) =>
      processWebhookAttempt(r.order.id, `wc-nonce-${i}`, 999)
    );

    // First should succeed, rest fail (invalid transition from webhook_verified)
    const successCount = results.filter(Boolean).length;
    expect(successCount).toBe(1);
    expect(getOrder(r.order.id)?.status).toBe('webhook_verified');
  });

  it('10 orders each receive 1 webhook — all process correctly', () => {
    const orders = Array.from({ length: 10 }, (_, i) => {
      const r = createOrder(
        { userId: `u${i}`, productId: 'prod_basic', idempotencyKey: `wc-multi-${i}`, currency: 'INR' },
        config,
        `2.0.0.${i + 1}`
      );
      if (!r.success) throw new Error();
      updateOrderStatus(r.order.id, 'payment_initiated', 'payment_service');
      return r.order;
    });

    const results = orders.map((order, i) =>
      processWebhookAttempt(order.id, `multi-nonce-${i}`, 999)
    );

    expect(results.every(Boolean)).toBe(true);
    for (const order of orders) {
      expect(getOrder(order.id)?.webhookVerified).toBe(true);
    }
  });
});
