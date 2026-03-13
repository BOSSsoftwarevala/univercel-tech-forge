/**
 * Penetration test — Price Modification Attack
 * Attacker attempts to modify product price from the frontend before checkout.
 */

import {
  createOrder,
  resetPaymentServiceState,
  type PaymentServiceConfig,
} from '../../src/lib/payment/payment-service.js';

const config: PaymentServiceConfig = {
  productCatalog: [
    { id: 'prod_basic', name: 'Basic', price: 999, currency: 'INR' },
    { id: 'prod_enterprise', name: 'Enterprise', price: 99999, currency: 'INR' },
  ],
  maxOrdersPerHourPerIp: 20,
  maxOrdersPerDayPerUser: 50,
};

const ATTACKER_IP = '192.168.0.100';

beforeEach(() => resetPaymentServiceState());

describe('Price Modification Attack', () => {
  it('clientAmount = 1 is rejected (almost-free attack)', () => {
    const r = createOrder(
      { userId: 'attacker', productId: 'prod_basic', idempotencyKey: 'pma-1', currency: 'INR', clientAmount: 1 },
      config,
      ATTACKER_IP
    );
    expect(r.success).toBe(false);
    if (r.success) throw new Error();
    expect(r.error).toMatch(/PRICE_TAMPERED/);
  });

  it('clientAmount = 0.01 (fractional attack) is rejected', () => {
    const r = createOrder(
      { userId: 'attacker', productId: 'prod_enterprise', idempotencyKey: 'pma-2', currency: 'INR', clientAmount: 0.01 },
      config,
      ATTACKER_IP
    );
    expect(r.success).toBe(false);
  });

  it('clientAmount = -99999 (negative amount attack) is rejected', () => {
    const r = createOrder(
      { userId: 'attacker', productId: 'prod_enterprise', idempotencyKey: 'pma-3', currency: 'INR', clientAmount: -99999 },
      config,
      ATTACKER_IP
    );
    expect(r.success).toBe(false);
  });

  it('clientAmount = 99998 (one less than enterprise price) is rejected', () => {
    const r = createOrder(
      { userId: 'attacker', productId: 'prod_enterprise', idempotencyKey: 'pma-4', currency: 'INR', clientAmount: 99998 },
      config,
      ATTACKER_IP
    );
    expect(r.success).toBe(false);
  });

  it('clientAmount = 9999999 (overflow attempt) is rejected', () => {
    const r = createOrder(
      { userId: 'attacker', productId: 'prod_basic', idempotencyKey: 'pma-5', currency: 'INR', clientAmount: 9999999 },
      config,
      ATTACKER_IP
    );
    expect(r.success).toBe(false);
  });

  it('clientAmount = NaN is rejected (or uses catalog price)', () => {
    const r = createOrder(
      { userId: 'attacker', productId: 'prod_basic', idempotencyKey: 'pma-6', currency: 'INR', clientAmount: NaN },
      config,
      ATTACKER_IP
    );
    // NaN !== 999, so should be rejected
    expect(r.success).toBe(false);
  });

  it('server-locked amount is always catalog price regardless of attack', () => {
    // Even if bypass attempt sneaks through, locked amount is from catalog
    const r = createOrder(
      { userId: 'user', productId: 'prod_basic', idempotencyKey: 'pma-7', currency: 'INR' },
      config,
      '10.0.0.1'
    );
    expect(r.success).toBe(true);
    if (!r.success) throw new Error();
    expect(r.order.lockedAmount).toBe(999); // ALWAYS from catalog
  });
});
