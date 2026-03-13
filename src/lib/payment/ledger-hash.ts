/**
 * Payment Ledger — append-only hash chain for tamper detection.
 * Each entry references the previous entry's hash, creating an auditable chain.
 */

import { createHash } from 'node:crypto';

export interface LedgerEntry {
  sequence: number;
  orderId: string;
  amount: number;
  currency: string;
  action: 'debit' | 'credit' | 'refund' | 'fee';
  previousHash: string;
  dataHash: string;
  entryHash: string;
  timestamp: number;
}

const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

function sha256(data: string): string {
  return createHash('sha256').update(data, 'utf8').digest('hex');
}

/**
 * Hash the content of a ledger entry (excluding entryHash itself).
 */
function computeEntryHash(entry: Omit<LedgerEntry, 'entryHash'>): string {
  const content = JSON.stringify({
    sequence: entry.sequence,
    orderId: entry.orderId,
    amount: entry.amount,
    currency: entry.currency,
    action: entry.action,
    previousHash: entry.previousHash,
    dataHash: entry.dataHash,
    timestamp: entry.timestamp,
  });
  return sha256(content);
}

export class PaymentLedger {
  private entries: LedgerEntry[] = [];

  get length(): number {
    return this.entries.length;
  }

  /**
   * Append a new entry to the ledger.
   */
  append(params: {
    orderId: string;
    amount: number;
    currency: string;
    action: LedgerEntry['action'];
    metadata?: Record<string, unknown>;
  }): LedgerEntry {
    const previous = this.entries[this.entries.length - 1];
    const previousHash = previous ? previous.entryHash : GENESIS_HASH;
    const sequence = this.entries.length;
    const timestamp = Date.now();

    const dataHash = sha256(
      JSON.stringify({ ...params, timestamp })
    );

    const partial: Omit<LedgerEntry, 'entryHash'> = {
      sequence,
      orderId: params.orderId,
      amount: params.amount,
      currency: params.currency,
      action: params.action,
      previousHash,
      dataHash,
      timestamp,
    };

    const entry: LedgerEntry = {
      ...partial,
      entryHash: computeEntryHash(partial),
    };

    this.entries.push(entry);
    return entry;
  }

  /**
   * Verify the integrity of the entire chain.
   * Returns the index of the first broken entry, or -1 if all valid.
   */
  verify(): { valid: boolean; brokenAt: number } {
    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i];

      // Recompute hash
      const { entryHash, ...rest } = entry;
      const expected = computeEntryHash(rest);
      if (expected !== entryHash) {
        return { valid: false, brokenAt: i };
      }

      // Verify chain link
      const expectedPrev = i === 0 ? GENESIS_HASH : this.entries[i - 1].entryHash;
      if (entry.previousHash !== expectedPrev) {
        return { valid: false, brokenAt: i };
      }
    }
    return { valid: true, brokenAt: -1 };
  }

  getEntries(): Readonly<LedgerEntry[]> {
    return this.entries;
  }

  /** Simulate tampering for testing purposes. */
  _tamperEntry(index: number, amount: number): void {
    if (this.entries[index]) {
      this.entries[index] = { ...this.entries[index], amount };
    }
  }
}
