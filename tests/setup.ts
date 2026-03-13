// Global test setup - runs once before all test suites
export default async function setup(): Promise<void> {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.ENCRYPTION_KEY = 'test-encryption-key-32-chars-0000';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-tests';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_placeholder';
  process.env.RATE_LIMIT_ORDERS_PER_HOUR = '5';
  process.env.RATE_LIMIT_ORDERS_PER_DAY = '10';
  process.env.FRAUD_BLOCK_THRESHOLD = '80';
  process.env.FRAUD_REVIEW_THRESHOLD = '50';

  console.log('[Test Setup] Test environment initialized');
}
