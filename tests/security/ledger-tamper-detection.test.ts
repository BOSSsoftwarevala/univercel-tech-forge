/**
 * Security test — Ledger Tamper Detection
 * Hash chain integrity verification catches any modification.
 */

import { PaymentLedger } from '../../src/lib/payment/ledger-hash.js';

describe('Ledger Tamper Detection', () => {
  it('valid chain passes verification', () => {
    const ledger = new PaymentLedger();
    ledger.append({ orderId: 'o1', amount: 999, currency: 'INR', action: 'credit' });
    ledger.append({ orderId: 'o2', amount: 4999, currency: 'INR', action: 'credit' });
    expect(ledger.verify().valid).toBe(true);
  });

  it('modifying first entry amount breaks chain', () => {
    const ledger = new PaymentLedger();
    ledger.append({ orderId: 'o1', amount: 999, currency: 'INR', action: 'credit' });
    ledger.append({ orderId: 'o2', amount: 2000, currency: 'INR', action: 'credit' });

    ledger._tamperEntry(0, 1); // Attacker reduces amount

    const { valid, brokenAt } = ledger.verify();
    expect(valid).toBe(false);
    expect(brokenAt).toBe(0);
  });

  it('modifying middle entry breaks chain at that point', () => {
    const ledger = new PaymentLedger();
    for (let i = 0; i < 5; i++) {
      ledger.append({ orderId: `o${i}`, amount: 1000 * (i + 1), currency: 'INR', action: 'credit' });
    }

    ledger._tamperEntry(2, 99); // tamper middle

    const { valid } = ledger.verify();
    expect(valid).toBe(false);
  });

  it('modifying last entry breaks chain at that point', () => {
    const ledger = new PaymentLedger();
    ledger.append({ orderId: 'o1', amount: 500, currency: 'INR', action: 'credit' });
    ledger.append({ orderId: 'o2', amount: 750, currency: 'INR', action: 'credit' });
    ledger.append({ orderId: 'o3', amount: 1000, currency: 'INR', action: 'credit' });

    ledger._tamperEntry(2, 0); // zero-out last entry

    expect(ledger.verify().valid).toBe(false);
  });

  it('100-entry ledger still verifies correctly', () => {
    const ledger = new PaymentLedger();
    for (let i = 0; i < 100; i++) {
      ledger.append({ orderId: `bulk_${i}`, amount: 100, currency: 'INR', action: 'credit' });
    }
    expect(ledger.verify().valid).toBe(true);
    expect(ledger.length).toBe(100);
  });

  it('tampering any of 100 entries is detected', () => {
    const ledger = new PaymentLedger();
    for (let i = 0; i < 100; i++) {
      ledger.append({ orderId: `bulk2_${i}`, amount: 100, currency: 'INR', action: 'credit' });
    }

    // Tamper a random middle entry
    ledger._tamperEntry(50, 1);
    expect(ledger.verify().valid).toBe(false);
  });

  it('empty ledger is trivially valid', () => {
    const ledger = new PaymentLedger();
    expect(ledger.verify().valid).toBe(true);
    expect(ledger.verify().brokenAt).toBe(-1);
  });
});
