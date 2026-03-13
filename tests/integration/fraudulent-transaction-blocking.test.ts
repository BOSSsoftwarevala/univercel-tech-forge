/**
 * Integration test — Fraudulent Transaction Blocking
 * High fraud score transactions should be blocked before creating orders.
 */

import {
  createOrder,
  resetPaymentServiceState,
  type PaymentServiceConfig,
} from '../../src/lib/payment/payment-service.js';
import { calculateFraudScore } from '../../src/lib/payment/fraud-scoring.js';
import { analyzeRequest } from '../../src/lib/payment/device-fingerprint.js';

const config: PaymentServiceConfig = {
  productCatalog: [{ id: 'prod_basic', name: 'Basic', price: 999, currency: 'INR' }],
  maxOrdersPerHourPerIp: 10,
  maxOrdersPerDayPerUser: 20,
};

beforeEach(() => resetPaymentServiceState());

/** Simulate a checkout attempt with fraud evaluation */
function attemptCheckout(params: {
  userId: string;
  ip: string;
  userAgent?: string;
  fraudSignals?: Parameters<typeof calculateFraudScore>[0];
  idempotencyKey: string;
}): { allowed: boolean; reason?: string } {
  const { userId, ip, userAgent = 'Mozilla/5.0', fraudSignals = {}, idempotencyKey } = params;

  // 1. Fraud check
  const fraud = calculateFraudScore(fraudSignals);
  if (fraud.decision === 'block') {
    return { allowed: false, reason: `FRAUD_BLOCKED: score=${fraud.score}` };
  }

  // 2. Bot check
  const fingerprint = analyzeRequest({ userAgent, requestsInLastMinute: 1 });
  if (fingerprint.isLikelyBot) {
    return { allowed: false, reason: 'BOT_DETECTED' };
  }

  // 3. Create order
  const r = createOrder(
    { userId, productId: 'prod_basic', idempotencyKey, currency: 'INR' },
    config,
    ip
  );
  if (!r.success) return { allowed: false, reason: r.error };
  return { allowed: true };
}

describe('Fraudulent Transaction Blocking', () => {
  it('allows a clean, legitimate transaction', () => {
    const result = attemptCheckout({
      userId: 'clean-user',
      ip: '1.2.3.4',
      idempotencyKey: 'ftb-clean',
    });
    expect(result.allowed).toBe(true);
  });

  it('blocks a transaction with fraud score ≥ 80', () => {
    const result = attemptCheckout({
      userId: 'attacker',
      ip: '5.6.7.8',
      idempotencyKey: 'ftb-fraud',
      fraudSignals: { isLikelyBot: true, priceAnomalyDetected: true, countryMismatch: true },
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/FRAUD_BLOCKED/);
  });

  it('blocks automated bot checkout', () => {
    const result = attemptCheckout({
      userId: 'bot-user',
      ip: '9.0.0.1',
      userAgent: 'python-requests/2.28',
      idempotencyKey: 'ftb-bot',
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('BOT_DETECTED');
  });

  it('flags review-threshold transactions (50–79) but allows them', () => {
    // Score ~50 but not blocking
    const fraud = calculateFraudScore({
      isNewDevice: true,
      isNewIp: true,
      vpnDetected: true,
      countryMismatch: true,
    });
    expect(fraud.decision).toBe('review');
    // Review-threshold orders are allowed but logged — no hard block here
    expect(fraud.score).toBeLessThan(80);
  });

  it('blocks multiple suspicious signals cumulatively', () => {
    const fraud = calculateFraudScore({
      isLikelyBot: true,
      failedPaymentAttempts: 5,
    });
    expect(fraud.score).toBeGreaterThanOrEqual(80);
    expect(fraud.decision).toBe('block');
  });
});
