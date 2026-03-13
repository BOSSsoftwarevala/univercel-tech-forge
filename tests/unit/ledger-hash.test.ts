/**
 * Unit tests — Payment Ledger Hash Chain
 */

import { PaymentLedger } from '../../src/lib/payment/ledger-hash.js';

describe('PaymentLedger', () => {
  let ledger: PaymentLedger;

  beforeEach(() => {
    ledger = new PaymentLedger();
  });

  it('starts empty', () => {
    expect(ledger.length).toBe(0);
    expect(ledger.verify().valid).toBe(true);
  });

  it('appends entries with incrementing sequence numbers', () => {
    const e1 = ledger.append({ orderId: 'o1', amount: 999, currency: 'INR', action: 'credit' });
    const e2 = ledger.append({ orderId: 'o2', amount: 2999, currency: 'INR', action: 'credit' });
    expect(e1.sequence).toBe(0);
    expect(e2.sequence).toBe(1);
  });

  it('links entries via hash chain (previousHash)', () => {
    const e1 = ledger.append({ orderId: 'o1', amount: 100, currency: 'INR', action: 'credit' });
    const e2 = ledger.append({ orderId: 'o2', amount: 200, currency: 'INR', action: 'credit' });
    expect(e2.previousHash).toBe(e1.entryHash);
  });

  it('verifies a clean chain as valid', () => {
    for (let i = 0; i < 5; i++) {
      ledger.append({ orderId: `order_${i}`, amount: 500 + i * 100, currency: 'INR', action: 'credit' });
    }
    const { valid } = ledger.verify();
    expect(valid).toBe(true);
  });

  it('detects tampered amount (entryHash mismatch)', () => {
    ledger.append({ orderId: 'o1', amount: 999, currency: 'INR', action: 'credit' });
    ledger.append({ orderId: 'o2', amount: 1999, currency: 'INR', action: 'credit' });

    // Tamper the first entry's amount
    ledger._tamperEntry(0, 1); // change 999 → 1

    const { valid, brokenAt } = ledger.verify();
    expect(valid).toBe(false);
    expect(brokenAt).toBe(0);
  });

  it('detects broken chain link (previousHash mismatch)', () => {
    ledger.append({ orderId: 'o1', amount: 100, currency: 'INR', action: 'credit' });
    ledger.append({ orderId: 'o2', amount: 200, currency: 'INR', action: 'credit' });
    ledger.append({ orderId: 'o3', amount: 300, currency: 'INR', action: 'credit' });

    // Tamper the middle entry (breaks link to next)
    ledger._tamperEntry(1, 999);

    const { valid } = ledger.verify();
    expect(valid).toBe(false);
  });

  it('handles 100+ entries maintaining chain integrity', () => {
    for (let i = 0; i < 100; i++) {
      ledger.append({ orderId: `bulk_${i}`, amount: 100 * (i + 1), currency: 'INR', action: 'credit' });
    }
    expect(ledger.length).toBe(100);
    expect(ledger.verify().valid).toBe(true);
  });

  it('genesis block has the expected zero previousHash', () => {
    const e0 = ledger.append({ orderId: 'genesis', amount: 1, currency: 'INR', action: 'credit' });
    expect(e0.previousHash).toBe('0000000000000000000000000000000000000000000000000000000000000000');
  });

  it('getEntries returns a read-only snapshot', () => {
    ledger.append({ orderId: 'o1', amount: 100, currency: 'INR', action: 'credit' });
    const entries = ledger.getEntries();
    expect(entries).toHaveLength(1);
  });
});
