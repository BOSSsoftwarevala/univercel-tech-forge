/**
 * Security test — Bot Defense
 * Device fingerprint blocks automated attacks.
 */

import { analyzeRequest, type RequestSignals } from '../../src/lib/payment/device-fingerprint.js';
import {
  createOrder,
  resetPaymentServiceState,
  type PaymentServiceConfig,
} from '../../src/lib/payment/payment-service.js';
import { calculateFraudScore } from '../../src/lib/payment/fraud-scoring.js';

const config: PaymentServiceConfig = {
  productCatalog: [{ id: 'prod_basic', name: 'Basic', price: 999, currency: 'INR' }],
  maxOrdersPerHourPerIp: 5,
  maxOrdersPerDayPerUser: 10,
};

beforeEach(() => resetPaymentServiceState());

/** Simulate bot-protected checkout */
function botProtectedCheckout(
  signals: RequestSignals,
  userId: string,
  ip: string,
  key: string
): { blocked: boolean; reason?: string } {
  const fp = analyzeRequest(signals);
  if (fp.isLikelyBot) return { blocked: true, reason: 'BOT_DETECTED' };

  const fraud = calculateFraudScore({ isLikelyBot: fp.isLikelyBot });
  if (fraud.decision === 'block') return { blocked: true, reason: 'FRAUD_SCORE' };

  const r = createOrder({ userId, productId: 'prod_basic', idempotencyKey: key, currency: 'INR' }, config, ip);
  if (!r.success) return { blocked: true, reason: r.error };
  return { blocked: false };
}

describe('Bot Defense', () => {
  it('allows a legitimate human user', () => {
    const result = botProtectedCheckout(
      {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120',
        acceptLanguage: 'en-US',
        acceptEncoding: 'gzip',
        requestsInLastMinute: 1,
        timeBetweenRequestsMs: 3000,
      },
      'human-user',
      '1.1.1.1',
      'bot-def-human'
    );
    expect(result.blocked).toBe(false);
  });

  it('blocks curl bot', () => {
    const result = botProtectedCheckout(
      { userAgent: 'curl/7.88.0' },
      'bot-user',
      '2.2.2.2',
      'bot-def-curl'
    );
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe('BOT_DETECTED');
  });

  it('blocks python-requests bot', () => {
    const result = botProtectedCheckout(
      { userAgent: 'python-requests/2.31.0' },
      'bot-user',
      '3.3.3.3',
      'bot-def-py'
    );
    expect(result.blocked).toBe(true);
  });

  it('blocks requests with missing user-agent', () => {
    const result = botProtectedCheckout(
      { userAgent: '' },
      'bot-user',
      '4.4.4.4',
      'bot-def-noua'
    );
    expect(result.blocked).toBe(true);
  });

  it('blocks inhuman click speed (50ms between requests)', () => {
    const result = botProtectedCheckout(
      {
        userAgent: 'Mozilla/5.0 Chrome/120',
        timeBetweenRequestsMs: 50, // impossibly fast
      },
      'bot-user',
      '5.5.5.5',
      'bot-def-speed'
    );
    expect(result.blocked).toBe(true);
  });

  it('blocks high-frequency scraper (100 req/min)', () => {
    const result = botProtectedCheckout(
      {
        userAgent: 'Mozilla/5.0 Chrome/120',
        requestsInLastMinute: 100,
      },
      'scraper',
      '6.6.6.6',
      'bot-def-freq'
    );
    expect(result.blocked).toBe(true);
  });

  it('10 bot attempts all blocked', () => {
    for (let i = 0; i < 10; i++) {
      const result = botProtectedCheckout(
        { userAgent: 'Go-http-client/1.1' },
        `bot${i}`,
        `7.0.0.${i}`,
        `bot-def-go-${i}`
      );
      expect(result.blocked).toBe(true);
    }
  });

  it('same fingerprint generated for same request', () => {
    const signals: RequestSignals = {
      userAgent: 'Mozilla/5.0 Chrome/120',
      acceptLanguage: 'en-US',
      xForwardedFor: '8.8.8.8',
    };
    const fp1 = analyzeRequest(signals);
    const fp2 = analyzeRequest(signals);
    expect(fp1.fingerprint).toBe(fp2.fingerprint);
  });
});
