/**
 * Penetration test — Fake Webhook Injection
 * Webhooks with invalid/forged signatures must be rejected.
 */

import {
  verifyWebhookSignature,
  computeHmacSignature,
} from '../../src/lib/payment/webhook-signature.js';

const REAL_SECRET = 'whsec_real_production_secret_xxx';
const FAKE_SECRET = 'whsec_attacker_forged_secret_yyy';

describe('Fake Webhook Injection', () => {
  it('webhook signed with wrong secret is rejected', () => {
    const payload = JSON.stringify({ event: 'payment.captured', amount: 999 });
    const fakeSig = computeHmacSignature(payload, FAKE_SECRET);

    expect(verifyWebhookSignature(payload, fakeSig, REAL_SECRET)).toBe(false);
  });

  it('empty signature is rejected', () => {
    const payload = JSON.stringify({ event: 'payment.captured' });
    expect(verifyWebhookSignature(payload, '', REAL_SECRET)).toBe(false);
  });

  it('all-zeros signature is rejected', () => {
    const payload = JSON.stringify({ event: 'payment.captured' });
    expect(verifyWebhookSignature(payload, '0'.repeat(64), REAL_SECRET)).toBe(false);
  });

  it('modified payload with original signature is rejected', () => {
    const realPayload = JSON.stringify({ event: 'payment.captured', amount: 999, orderId: 'ord_1' });
    const realSig = computeHmacSignature(realPayload, REAL_SECRET);

    // Attacker modifies the amount
    const fakePayload = JSON.stringify({ event: 'payment.captured', amount: 0, orderId: 'ord_1' });
    expect(verifyWebhookSignature(fakePayload, realSig, REAL_SECRET)).toBe(false);
  });

  it('completely fabricated webhook (random signature) is rejected', () => {
    const payload = JSON.stringify({ event: 'payment.captured', amount: 999 });
    const randomSig = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    expect(verifyWebhookSignature(payload, randomSig, REAL_SECRET)).toBe(false);
  });

  it('10 different fake webhook payloads are all rejected', () => {
    for (let i = 0; i < 10; i++) {
      const payload = JSON.stringify({ event: 'payment.captured', amount: 999, attempt: i });
      const fakeSig = computeHmacSignature(payload, `wrong-secret-${i}`);
      expect(verifyWebhookSignature(payload, fakeSig, REAL_SECRET)).toBe(false);
    }
  });

  it('legitimate webhook with real secret is accepted', () => {
    const payload = JSON.stringify({ event: 'payment.captured', amount: 999, orderId: 'ord_real' });
    const realSig = computeHmacSignature(payload, REAL_SECRET);
    expect(verifyWebhookSignature(payload, realSig, REAL_SECRET)).toBe(true);
  });

  it('length extension attack (appended data) is rejected', () => {
    const realPayload = JSON.stringify({ event: 'payment.captured', amount: 999 });
    const realSig = computeHmacSignature(realPayload, REAL_SECRET);

    // Attacker appends extra fields to payload but uses original signature
    const extendedPayload = realPayload + ',"extra":"malicious_data"}';
    expect(verifyWebhookSignature(extendedPayload, realSig, REAL_SECRET)).toBe(false);
  });
});
