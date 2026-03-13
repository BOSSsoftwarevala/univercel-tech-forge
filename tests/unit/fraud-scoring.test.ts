/**
 * Unit tests — Fraud Scoring (Risk Score Calculation)
 */

import { calculateFraudScore, type FraudSignals } from '../../src/lib/payment/fraud-scoring.js';

describe('Fraud Score Calculation', () => {
  it('scores 0 for a clean transaction', () => {
    const result = calculateFraudScore({});
    expect(result.score).toBe(0);
    expect(result.decision).toBe('allow');
    expect(result.reasons).toHaveLength(0);
  });

  it('adds score for each signal', () => {
    const result = calculateFraudScore({ isNewDevice: true, isNewIp: true });
    expect(result.score).toBeGreaterThan(0);
  });

  it('blocks when score ≥ 80 (FRAUD_BLOCK_THRESHOLD)', () => {
    const result = calculateFraudScore({
      isLikelyBot: true,          // +40
      priceAnomalyDetected: true, // +30
      countryMismatch: true,      // +15
    });
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.decision).toBe('block');
  });

  it('flags for review when score is 50–79', () => {
    const result = calculateFraudScore({
      isNewDevice: true,    // +15
      isNewIp: true,        // +10
      vpnDetected: true,    // +10
      countryMismatch: true,// +15
    });
    expect(result.score).toBeGreaterThanOrEqual(50);
    expect(result.decision).toBe('review');
  });

  it('allows when score < 50', () => {
    const result = calculateFraudScore({ isNewUser: true, unusualTimeOfDay: true });
    expect(result.score).toBeLessThan(50);
    expect(result.decision).toBe('allow');
  });

  it('failed payment attempts contribute to score', () => {
    const r1 = calculateFraudScore({ failedPaymentAttempts: 0 });
    const r3 = calculateFraudScore({ failedPaymentAttempts: 3 });
    expect(r3.score).toBeGreaterThan(r1.score);
    expect(r3.reasons.some(r => r.includes('FAILED_ATTEMPTS'))).toBe(true);
  });

  it('caps failed-attempts contribution at 40', () => {
    const r = calculateFraudScore({ failedPaymentAttempts: 100 });
    const rBase = calculateFraudScore({});
    expect(r.score - rBase.score).toBe(40);
  });

  it('velocity score increases with order count', () => {
    const r3 = calculateFraudScore({ velocityOrders: 3 });
    const r6 = calculateFraudScore({ velocityOrders: 6 });
    expect(r6.score).toBeGreaterThan(r3.score);
  });

  it('caps velocity contribution at 25', () => {
    const r = calculateFraudScore({ velocityOrders: 100 });
    const rBase = calculateFraudScore({});
    expect(r.score - rBase.score).toBeLessThanOrEqual(25);
  });

  it('caps total score at 100', () => {
    const allSignals: FraudSignals = {
      isNewUser: true,
      isNewDevice: true,
      isNewIp: true,
      vpnDetected: true,
      unusualTimeOfDay: true,
      failedPaymentAttempts: 20,
      velocityOrders: 20,
      priceAnomalyDetected: true,
      countryMismatch: true,
      isLikelyBot: true,
      highValueTransaction: true,
    };
    const result = calculateFraudScore(allSignals);
    expect(result.score).toBe(100);
    expect(result.decision).toBe('block');
  });

  it('includes reason codes for each triggered signal', () => {
    const result = calculateFraudScore({ isLikelyBot: true, countryMismatch: true });
    expect(result.reasons.some(r => r.includes('IS_LIKELY_BOT') || r.includes('BOT'))).toBe(true);
    expect(result.reasons.some(r => r.includes('COUNTRY_MISMATCH') || r.includes('COUNTRY'))).toBe(true);
  });
});
