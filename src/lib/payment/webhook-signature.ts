/**
 * Webhook Signature Verification — HMAC-SHA256
 * Validates that incoming webhooks are genuinely from the payment gateway.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Compute HMAC-SHA256 signature of a payload.
 */
export function computeHmacSignature(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload, 'utf8').digest('hex');
}

/**
 * Verify that the provided signature matches the expected HMAC of the payload.
 * Uses timing-safe comparison to prevent timing attacks.
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = computeHmacSignature(payload, secret);

  // Normalise: strip any "sha256=" prefix that some gateways include
  const clean = signature.startsWith('sha256=') ? signature.slice(7) : signature;

  const expectedBuf = Buffer.from(expected, 'hex');
  const providedBuf = Buffer.from(clean, 'hex');

  if (expectedBuf.length !== providedBuf.length) return false;

  return timingSafeEqual(expectedBuf, providedBuf);
}

/**
 * Replay-attack protection:
 * Check that the webhook timestamp is within an acceptable window.
 *
 * @param webhookTimestamp  Unix timestamp (seconds) from the webhook header
 * @param toleranceSeconds  Maximum allowed age in seconds (default 300 = 5 min)
 */
export function isWebhookTimestampFresh(
  webhookTimestamp: number,
  toleranceSeconds = 300
): boolean {
  const now = Math.floor(Date.now() / 1000);
  const age = now - webhookTimestamp;
  return age >= 0 && age <= toleranceSeconds;
}

/** In-memory replay cache for tests.  Production should use Redis. */
const replayCache = new Set<string>();

/**
 * Check and record a webhook nonce to prevent replay attacks.
 * Returns false if the nonce has already been seen.
 */
export function checkAndRecordNonce(nonce: string): boolean {
  if (replayCache.has(nonce)) return false;
  replayCache.add(nonce);
  return true;
}

export function clearReplayCache(): void {
  replayCache.clear();
}
