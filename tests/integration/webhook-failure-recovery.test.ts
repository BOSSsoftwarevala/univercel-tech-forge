/**
 * Integration test — Webhook Failure Recovery
 * When a webhook fails, the order can be re-verified when the webhook re-fires.
 */

import {
  createOrder,
  updateOrderStatus,
  verifyPaymentAmount,
  generateLicenseKey,
  resetPaymentServiceState,
  getOrder,
  type PaymentServiceConfig,
} from '../../src/lib/payment/payment-service.js';
import {
  verifyWebhookSignature,
  computeHmacSignature,
  checkAndRecordNonce,
  clearReplayCache,
} from '../../src/lib/payment/webhook-signature.js';

const config: PaymentServiceConfig = {
  productCatalog: [{ id: 'prod_basic', name: 'Basic', price: 999, currency: 'INR' }],
  maxOrdersPerHourPerIp: 10,
  maxOrdersPerDayPerUser: 20,
};
const SECRET = 'whsec_recovery_test';

beforeEach(() => {
  resetPaymentServiceState();
  clearReplayCache();
});

/** Process a webhook attempt and return whether it succeeded */
function processWebhook(orderId: string, amount: number, nonce: string): boolean {
  const payload = JSON.stringify({ orderId, amount, currency: 'INR', event: 'payment.captured' });
  const sig = computeHmacSignature(payload, SECRET);

  if (!verifyWebhookSignature(payload, sig, SECRET)) return false;
  if (!checkAndRecordNonce(nonce)) return false;
  if (!verifyPaymentAmount(orderId, amount, 'INR').valid) return false;

  updateOrderStatus(orderId, 'webhook_received', 'webhook_service');
  updateOrderStatus(orderId, 'webhook_verified', 'webhook_service');
  return true;
}

describe('Webhook Failure Recovery', () => {
  it('order stays in payment_initiated if webhook fails (wrong amount)', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'wfr-1', currency: 'INR' },
      config,
      '1.2.3.4'
    );
    if (!r.success) throw new Error();
    updateOrderStatus(r.order.id, 'payment_initiated', 'payment_service');

    // Webhook fires with wrong amount
    const failedWebhook = processWebhook(r.order.id, 1, 'nonce-wfr-1');
    expect(failedWebhook).toBe(false);

    // Order should still be in payment_initiated
    expect(getOrder(r.order.id)?.status).toBe('payment_initiated');
  });

  it('order auto-recovers when correct webhook re-fires', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'wfr-2', currency: 'INR' },
      config,
      '1.2.3.4'
    );
    if (!r.success) throw new Error();
    updateOrderStatus(r.order.id, 'payment_initiated', 'payment_service');

    // First webhook — fails (wrong nonce would be fine, wrong amount fails)
    processWebhook(r.order.id, 1, 'nonce-wfr-first');
    expect(getOrder(r.order.id)?.status).toBe('payment_initiated');

    // Second webhook — correct
    const recovered = processWebhook(r.order.id, 999, 'nonce-wfr-second');
    expect(recovered).toBe(true);
    expect(getOrder(r.order.id)?.status).toBe('webhook_verified');
  });

  it('license is issued after successful recovery webhook', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'wfr-3', currency: 'INR' },
      config,
      '1.2.3.4'
    );
    if (!r.success) throw new Error();
    updateOrderStatus(r.order.id, 'payment_initiated', 'payment_service');

    const ok = processWebhook(r.order.id, 999, 'nonce-wfr-3-ok');
    expect(ok).toBe(true);

    const lic = generateLicenseKey(r.order.id);
    expect('key' in lic).toBe(true);
  });

  it('duplicate recovery webhooks are rejected (replay protection)', () => {
    const r = createOrder(
      { userId: 'u1', productId: 'prod_basic', idempotencyKey: 'wfr-4', currency: 'INR' },
      config,
      '1.2.3.4'
    );
    if (!r.success) throw new Error();
    updateOrderStatus(r.order.id, 'payment_initiated', 'payment_service');

    const nonce = 'nonce-dup-recovery';
    processWebhook(r.order.id, 999, nonce);

    // Try to replay the same webhook
    const replay = processWebhook(r.order.id, 999, nonce);
    expect(replay).toBe(false);
  });
});
