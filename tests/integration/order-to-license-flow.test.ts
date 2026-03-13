/**
 * Integration test — Order-to-License complete flow
 * order → payment_initiated → webhook_received → webhook_verified → license generated
 */

import {
  createOrder,
  updateOrderStatus,
  verifyPaymentAmount,
  generateLicenseKey,
  resetPaymentServiceState,
  type PaymentServiceConfig,
} from '../../src/lib/payment/payment-service.js';
import { verifyWebhookSignature, checkAndRecordNonce, clearReplayCache, computeHmacSignature } from '../../src/lib/payment/webhook-signature.js';
import { recordIdempotentKey, getIdempotentResult, clearIdempotencyStore } from '../../src/lib/payment/idempotency.js';

const config: PaymentServiceConfig = {
  productCatalog: [{ id: 'prod_basic', name: 'Basic', price: 999, currency: 'INR' }],
  maxOrdersPerHourPerIp: 5,
  maxOrdersPerDayPerUser: 10,
};

const WEBHOOK_SECRET = 'whsec_integration_test';

beforeEach(() => {
  resetPaymentServiceState();
  clearIdempotencyStore();
  clearReplayCache();
});

describe('Order → Payment → Webhook → License Flow', () => {
  it('completes the full happy-path flow', () => {
    // 1. Create order
    const orderRes = createOrder(
      { userId: 'user1', productId: 'prod_basic', idempotencyKey: 'flow-key-1', currency: 'INR' },
      config,
      '10.0.0.1'
    );
    expect(orderRes.success).toBe(true);
    if (!orderRes.success) throw new Error();
    const { order } = orderRes;

    // Record idempotency
    recordIdempotentKey('flow-key-1', order.id);

    // 2. Payment initiated
    expect(updateOrderStatus(order.id, 'payment_initiated', 'payment_service').success).toBe(true);

    // 3. Simulate webhook receipt
    const webhookPayload = JSON.stringify({ orderId: order.id, amount: 999, currency: 'INR', event: 'payment.captured' });
    const sig = computeHmacSignature(webhookPayload, WEBHOOK_SECRET);
    expect(verifyWebhookSignature(webhookPayload, sig, WEBHOOK_SECRET)).toBe(true);

    // Record nonce to prevent replay
    const nonce = 'webhook-nonce-flow-1';
    expect(checkAndRecordNonce(nonce)).toBe(true);

    // 4. Verify amount matches
    const amountCheck = verifyPaymentAmount(order.id, 999, 'INR');
    expect(amountCheck.valid).toBe(true);

    // 5. Mark webhook_received then webhook_verified
    expect(updateOrderStatus(order.id, 'webhook_received', 'webhook_service').success).toBe(true);
    expect(updateOrderStatus(order.id, 'webhook_verified', 'webhook_service').success).toBe(true);

    // 6. Generate license — only now
    const lic = generateLicenseKey(order.id);
    expect('key' in lic).toBe(true);
    if (!('key' in lic)) throw new Error();
    expect(lic.key).toMatch(/^LIC-/);
  });

  it('idempotent second order attempt returns first order', () => {
    const first = createOrder(
      { userId: 'user1', productId: 'prod_basic', idempotencyKey: 'idem-flow-2', currency: 'INR' },
      config,
      '10.0.0.2'
    );
    expect(first.success).toBe(true);
    if (!first.success) throw new Error();

    // Second attempt with same key
    const second = createOrder(
      { userId: 'user1', productId: 'prod_basic', idempotencyKey: 'idem-flow-2', currency: 'INR' },
      config,
      '10.0.0.2'
    );
    expect(second.success).toBe(true);
    if (!second.success) throw new Error();
    expect(second.order.id).toBe(first.order.id);
  });
});
