/**
 * Device fingerprint — bot detection heuristics for server-side use.
 * (Browser-specific fingerprinting is in CryptoEngine.ts / security.ts)
 */

export interface RequestSignals {
  userAgent: string;
  acceptLanguage?: string;
  acceptEncoding?: string;
  xForwardedFor?: string;
  referer?: string;
  requestsInLastMinute?: number;
  timeBetweenRequestsMs?: number;
}

export interface FingerprintResult {
  fingerprint: string;
  isLikelyBot: boolean;
  signals: string[];
}

const BOT_UA_PATTERNS = [
  /bot/i, /crawler/i, /spider/i, /curl/i, /wget/i,
  /python-requests/i, /java\//i, /go-http-client/i, /axios/i,
];

/**
 * Generate a request fingerprint and assess bot probability.
 */
export function analyzeRequest(signals: RequestSignals): FingerprintResult {
  const detectedSignals: string[] = [];
  let isLikelyBot = false;

  // 1. User-agent checks
  if (!signals.userAgent || signals.userAgent.trim() === '') {
    detectedSignals.push('MISSING_USER_AGENT');
    isLikelyBot = true;
  } else if (BOT_UA_PATTERNS.some(p => p.test(signals.userAgent))) {
    detectedSignals.push('BOT_USER_AGENT');
    isLikelyBot = true;
  }

  // 2. Missing typical browser headers
  if (!signals.acceptLanguage) {
    detectedSignals.push('MISSING_ACCEPT_LANGUAGE');
  }
  if (!signals.acceptEncoding) {
    detectedSignals.push('MISSING_ACCEPT_ENCODING');
  }

  // 3. Suspicious request rate
  if (signals.requestsInLastMinute !== undefined && signals.requestsInLastMinute > 30) {
    detectedSignals.push('HIGH_REQUEST_RATE');
    isLikelyBot = true;
  }

  // 4. Impossibly fast clicks (< 200ms between requests)
  if (
    signals.timeBetweenRequestsMs !== undefined &&
    signals.timeBetweenRequestsMs < 200
  ) {
    detectedSignals.push('INHUMAN_SPEED');
    isLikelyBot = true;
  }

  // Fingerprint: deterministic hash of stable signals
  const raw = [
    signals.userAgent ?? '',
    signals.acceptLanguage ?? '',
    signals.xForwardedFor ?? '',
  ].join('|');

  // Simple non-crypto hash for fingerprinting (use HMAC in production)
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (Math.imul(31, hash) + raw.charCodeAt(i)) | 0;
  }
  const fingerprint = (hash >>> 0).toString(16).padStart(8, '0');

  return { fingerprint, isLikelyBot, signals: detectedSignals };
}
