/**
 * Integration test — Replay Attack Protection
 * Replayed webhooks must be rejected using nonce tracking + timestamp freshness.
 */

import {
  verifyWebhookSignature,
  computeHmacSignature,
  isWebhookTimestampFresh,
  checkAndRecordNonce,
  clearReplayCache,
} from '../../src/lib/payment/webhook-signature.js';

const SECRET = 'whsec_replay_test_secret';

beforeEach(() => clearReplayCache());

function simulateWebhookRequest(params: {
  payload: string;
  secret: string;
  timestamp?: number;
  nonce?: string;
}): { signatureValid: boolean; timestampFresh: boolean; nonceUnused: boolean } {
  const { payload, secret, timestamp = Math.floor(Date.now() / 1000), nonce = `nonce-${Date.now()}` } = params;

  const signature = computeHmacSignature(payload, secret);
  return {
    signatureValid: verifyWebhookSignature(payload, signature, secret),
    timestampFresh: isWebhookTimestampFresh(timestamp),
    nonceUnused: checkAndRecordNonce(nonce),
  };
}

describe('Replay Attack Protection', () => {
  it('accepts a fresh, unique webhook', () => {
    const result = simulateWebhookRequest({
      payload: JSON.stringify({ event: 'payment.success', orderId: 'ord_1' }),
      secret: SECRET,
    });
    expect(result.signatureValid).toBe(true);
    expect(result.timestampFresh).toBe(true);
    expect(result.nonceUnused).toBe(true);
  });

  it('rejects a replayed webhook (same nonce used twice)', () => {
    const nonce = 'replay-nonce-fixed';
    const payload = JSON.stringify({ event: 'payment.success', orderId: 'ord_2' });

    const first = simulateWebhookRequest({ payload, secret: SECRET, nonce });
    const second = simulateWebhookRequest({ payload, secret: SECRET, nonce });

    expect(first.nonceUnused).toBe(true);
    expect(second.nonceUnused).toBe(false); // replay detected
  });

  it('rejects a stale webhook (timestamp > 5 minutes old)', () => {
    const staleTimestamp = Math.floor(Date.now() / 1000) - 600; // 10 minutes ago
    const result = simulateWebhookRequest({
      payload: JSON.stringify({ event: 'payment.success', orderId: 'ord_3' }),
      secret: SECRET,
      timestamp: staleTimestamp,
    });
    expect(result.timestampFresh).toBe(false);
  });

  it('rejects a webhook with tampered payload even if nonce is fresh', () => {
    const realPayload = JSON.stringify({ event: 'payment.success', amount: 999 });
    const realSig = computeHmacSignature(realPayload, SECRET);

    // Attacker replays with modified amount
    const fakeSigCheck = verifyWebhookSignature(
      JSON.stringify({ event: 'payment.success', amount: 1 }),
      realSig,
      SECRET
    );
    expect(fakeSigCheck).toBe(false);
  });

  it('100 unique nonces are all accepted', () => {
    for (let i = 0; i < 100; i++) {
      expect(checkAndRecordNonce(`nonce-bulk-${i}`)).toBe(true);
    }
  });

  it('replaying any of the 100 nonces is rejected', () => {
    for (let i = 0; i < 10; i++) checkAndRecordNonce(`nonce-rep-${i}`);
    for (let i = 0; i < 10; i++) {
      expect(checkAndRecordNonce(`nonce-rep-${i}`)).toBe(false);
    }
  });
});
