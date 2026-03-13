/**
 * Security test — Service Isolation
 * Webhook service cannot access privileged boss/admin data.
 */

import { shouldMaskPaymentField } from '../../src/lib/payment/data-masking.js';
import { signJwt, verifyJwt } from '../../src/lib/payment/jwt-signer.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'test-jwt-secret-key-for-tests';

/** Simulate service-to-service authorization check */
function isServiceAuthorized(
  callerRole: string,
  resource: string
): boolean {
  const allowedResources: Record<string, string[]> = {
    webhook_service: ['orders', 'payments', 'webhooks'],
    payment_service: ['orders', 'payments', 'rate_limits'],
    boss_owner: ['orders', 'payments', 'webhooks', 'users', 'boss_data', 'ledger'],
    admin: ['orders', 'payments', 'webhooks', 'users', 'ledger'],
  };

  const allowed = allowedResources[callerRole] ?? [];
  return allowed.includes(resource);
}

describe('Service Isolation', () => {
  it('webhook_service can access orders', () => {
    expect(isServiceAuthorized('webhook_service', 'orders')).toBe(true);
  });

  it('webhook_service cannot access boss_data', () => {
    expect(isServiceAuthorized('webhook_service', 'boss_data')).toBe(false);
  });

  it('webhook_service cannot access user data', () => {
    expect(isServiceAuthorized('webhook_service', 'users')).toBe(false);
  });

  it('payment_service cannot access boss_data', () => {
    expect(isServiceAuthorized('payment_service', 'boss_data')).toBe(false);
  });

  it('only boss_owner can access boss_data', () => {
    expect(isServiceAuthorized('boss_owner', 'boss_data')).toBe(true);
    expect(isServiceAuthorized('admin', 'boss_data')).toBe(false);
    expect(isServiceAuthorized('webhook_service', 'boss_data')).toBe(false);
  });

  it('webhook_service JWT has correct role claim', () => {
    const exp = Math.floor(Date.now() / 1000) + 300;
    const token = signJwt(
      { sub: 'webhook_service', iss: 'payment-gateway', aud: 'backend', role: 'webhook_service', exp },
      JWT_SECRET
    );
    const result = verifyJwt(token, JWT_SECRET);
    expect(result.valid).toBe(true);
    if (!result.valid) throw new Error();
    expect(result.payload.role).toBe('webhook_service');
  });

  it('webhook_service role does not see unmasked email', () => {
    expect(shouldMaskPaymentField('email', 'webhook_service')).toBe(true);
  });

  it('webhook_service role does not see card numbers', () => {
    expect(shouldMaskPaymentField('card_number', 'webhook_service')).toBe(true);
  });

  it('boss_owner sees all data unmasked', () => {
    const sensitiveFields = ['email', 'card_number', 'license_key', 'payment_id'];
    for (const field of sensitiveFields) {
      expect(shouldMaskPaymentField(field, 'boss_owner')).toBe(false);
    }
  });

  it('unauthorized service token is rejected', () => {
    const exp = Math.floor(Date.now() / 1000) + 300;
    const token = signJwt(
      { sub: 'rogue_service', iss: 'unknown', aud: 'backend', exp },
      'wrong-secret'
    );
    const result = verifyJwt(token, JWT_SECRET);
    expect(result.valid).toBe(false);
  });
});
