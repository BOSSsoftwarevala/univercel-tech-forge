/**
 * Unit tests — Webhook Signature Verification (HMAC-SHA256)
 */

import {
  computeHmacSignature,
  verifyWebhookSignature,
  isWebhookTimestampFresh,
  checkAndRecordNonce,
  clearReplayCache,
} from '../../src/lib/payment/webhook-signature.js';

const WEBHOOK_SECRET = 'whsec_test_placeholder_for_unit';

describe('computeHmacSignature', () => {
  it('produces a 64-char hex string', () => {
    const sig = computeHmacSignature('{"event":"payment.success"}', WEBHOOK_SECRET);
    expect(sig).toHaveLength(64);
    expect(sig).toMatch(/^[0-9a-f]+$/);
  });

  it('is deterministic for same input', () => {
    const s1 = computeHmacSignature('payload', WEBHOOK_SECRET);
    const s2 = computeHmacSignature('payload', WEBHOOK_SECRET);
    expect(s1).toBe(s2);
  });

  it('differs with different secrets', () => {
    const s1 = computeHmacSignature('payload', WEBHOOK_SECRET);
    const s2 = computeHmacSignature('payload', 'other-secret');
    expect(s1).not.toBe(s2);
  });
});

describe('verifyWebhookSignature', () => {
  it('verifies a correct signature', () => {
    const payload = JSON.stringify({ event: 'payment.captured', amount: 999 });
    const sig = computeHmacSignature(payload, WEBHOOK_SECRET);
    expect(verifyWebhookSignature(payload, sig, WEBHOOK_SECRET)).toBe(true);
  });

  it('rejects a wrong signature', () => {
    const payload = JSON.stringify({ event: 'payment.captured' });
    expect(verifyWebhookSignature(payload, 'deadsignature00', WEBHOOK_SECRET)).toBe(false);
  });

  it('rejects a fake/injected webhook payload', () => {
    const realPayload = JSON.stringify({ event: 'payment.captured', amount: 999 });
    const realSig = computeHmacSignature(realPayload, WEBHOOK_SECRET);

    const fakePayload = JSON.stringify({ event: 'payment.captured', amount: 0 });
    expect(verifyWebhookSignature(fakePayload, realSig, WEBHOOK_SECRET)).toBe(false);
  });

  it('accepts signature with "sha256=" prefix (Stripe format)', () => {
    const payload = 'test_payload';
    const sig = `sha256=${computeHmacSignature(payload, WEBHOOK_SECRET)}`;
    expect(verifyWebhookSignature(payload, sig, WEBHOOK_SECRET)).toBe(true);
  });

  it('rejects partial signature match', () => {
    const payload = 'data';
    const realSig = computeHmacSignature(payload, WEBHOOK_SECRET);
    const truncated = realSig.slice(0, 32) + '0'.repeat(32);
    expect(verifyWebhookSignature(payload, truncated, WEBHOOK_SECRET)).toBe(false);
  });
});

describe('isWebhookTimestampFresh', () => {
  it('accepts timestamps within tolerance', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(isWebhookTimestampFresh(now - 100, 300)).toBe(true);
  });

  it('rejects stale timestamps (replay attack)', () => {
    const stale = Math.floor(Date.now() / 1000) - 600;
    expect(isWebhookTimestampFresh(stale, 300)).toBe(false);
  });

  it('rejects future timestamps', () => {
    const future = Math.floor(Date.now() / 1000) + 60;
    expect(isWebhookTimestampFresh(future, 300)).toBe(false);
  });
});

describe('Replay Protection (nonce cache)', () => {
  beforeEach(() => clearReplayCache());

  it('allows first use of a nonce', () => {
    expect(checkAndRecordNonce('nonce-abc-123')).toBe(true);
  });

  it('rejects second use of the same nonce', () => {
    checkAndRecordNonce('nonce-xyz-456');
    expect(checkAndRecordNonce('nonce-xyz-456')).toBe(false);
  });

  it('allows different nonces', () => {
    expect(checkAndRecordNonce('nonce-1')).toBe(true);
    expect(checkAndRecordNonce('nonce-2')).toBe(true);
  });
});
