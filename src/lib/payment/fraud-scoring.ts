/**
 * Fraud scoring engine — risk score calculation for payment transactions.
 */

export interface FraudSignals {
  isNewUser?: boolean;
  isNewDevice?: boolean;
  isNewIp?: boolean;
  vpnDetected?: boolean;
  unusualTimeOfDay?: boolean;         // e.g. 2am–5am local time
  failedPaymentAttempts?: number;
  velocityOrders?: number;            // orders in last hour
  priceAnomalyDetected?: boolean;
  countryMismatch?: boolean;          // billing country ≠ IP country
  isLikelyBot?: boolean;
  highValueTransaction?: boolean;
}

export interface FraudScoreResult {
  score: number;              // 0–100
  decision: 'allow' | 'review' | 'block';
  reasons: string[];
}

const BLOCK_THRESHOLD = parseInt(process.env.FRAUD_BLOCK_THRESHOLD ?? '80', 10);
const REVIEW_THRESHOLD = parseInt(process.env.FRAUD_REVIEW_THRESHOLD ?? '50', 10);

const SIGNAL_WEIGHTS: Record<keyof FraudSignals, number> = {
  isNewUser: 5,
  isNewDevice: 15,
  isNewIp: 10,
  vpnDetected: 10,
  unusualTimeOfDay: 5,
  failedPaymentAttempts: 0,   // calculated separately
  velocityOrders: 0,           // calculated separately
  priceAnomalyDetected: 30,
  countryMismatch: 15,
  isLikelyBot: 40,
  highValueTransaction: 10,
};

/**
 * Calculate a fraud risk score (0–100) from transaction signals.
 */
export function calculateFraudScore(signals: FraudSignals): FraudScoreResult {
  const reasons: string[] = [];
  let score = 0;

  for (const [key, weight] of Object.entries(SIGNAL_WEIGHTS) as [keyof FraudSignals, number][]) {
    if (key === 'failedPaymentAttempts' || key === 'velocityOrders') continue;
    if (signals[key]) {
      score += weight;
      reasons.push(key.replace(/([A-Z])/g, '_$1').toUpperCase());
    }
  }

  // Failed payment attempts: +8 per attempt, up to +40
  if (signals.failedPaymentAttempts) {
    const contrib = Math.min(signals.failedPaymentAttempts * 8, 40);
    if (contrib > 0) {
      score += contrib;
      reasons.push(`FAILED_ATTEMPTS_${signals.failedPaymentAttempts}`);
    }
  }

  // Velocity: +5 per extra order beyond 2, up to +25
  if (signals.velocityOrders && signals.velocityOrders > 2) {
    const extra = signals.velocityOrders - 2;
    const contrib = Math.min(extra * 5, 25);
    score += contrib;
    reasons.push(`VELOCITY_${signals.velocityOrders}_ORDERS_PER_HOUR`);
  }

  score = Math.min(score, 100);

  const decision: FraudScoreResult['decision'] =
    score >= BLOCK_THRESHOLD
      ? 'block'
      : score >= REVIEW_THRESHOLD
      ? 'review'
      : 'allow';

  return { score, decision, reasons };
}
