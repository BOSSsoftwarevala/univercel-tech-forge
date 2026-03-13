/**
 * Security test — Audit Log Immutability
 * Once written, audit log entries cannot be modified or deleted.
 */

export interface AuditEntry {
  id: string;
  timestamp: number;
  userId: string;
  action: string;
  resourceId: string;
  metadata: Record<string, unknown>;
  hash: string; // SHA-256 of entry content for tamper detection
}

import { createHash } from 'node:crypto';

function hashEntry(entry: Omit<AuditEntry, 'hash'>): string {
  return createHash('sha256')
    .update(JSON.stringify(entry))
    .digest('hex');
}

/** Append-only audit log store */
class AuditLog {
  private entries: AuditEntry[] = [];

  append(params: Omit<AuditEntry, 'id' | 'hash' | 'timestamp'>): AuditEntry {
    const partial = {
      id: `audit_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      timestamp: Date.now(),
      ...params,
    };
    const entry: AuditEntry = { ...partial, hash: hashEntry(partial) };
    this.entries.push(entry);
    return entry;
  }

  getAll(): Readonly<AuditEntry[]> {
    return [...this.entries]; // defensive copy
  }

  /** Verify hash integrity of all entries */
  verifyIntegrity(): { valid: boolean; tamperedIds: string[] } {
    const tamperedIds: string[] = [];
    for (const entry of this.entries) {
      const { hash, ...rest } = entry;
      const expected = hashEntry(rest);
      if (expected !== hash) tamperedIds.push(entry.id);
    }
    return { valid: tamperedIds.length === 0, tamperedIds };
  }

  /** Attempt to delete — always throws (immutable) */
  delete(_id: string): never {
    throw new Error('AUDIT_LOG_IMMUTABLE: deletion not permitted');
  }

  /** Attempt to update — always throws (immutable) */
  update(_id: string, _changes: Partial<AuditEntry>): never {
    throw new Error('AUDIT_LOG_IMMUTABLE: updates not permitted');
  }

  /** Simulate external tamper for test purposes */
  _tamperEntry(id: string, newAction: string): void {
    const entry = this.entries.find(e => e.id === id);
    if (entry) entry.action = newAction;
  }

  get size(): number {
    return this.entries.length;
  }
}

describe('Audit Log Immutability', () => {
  let auditLog: AuditLog;

  beforeEach(() => {
    auditLog = new AuditLog();
  });

  it('records an entry with correct fields', () => {
    const entry = auditLog.append({
      userId: 'u1',
      action: 'order_created',
      resourceId: 'ord_1',
      metadata: { amount: 999 },
    });
    expect(entry.hash).toBeTruthy();
    expect(entry.action).toBe('order_created');
  });

  it('audit log delete throws — deletion not permitted', () => {
    const entry = auditLog.append({ userId: 'u1', action: 'login', resourceId: 'u1', metadata: {} });
    expect(() => auditLog.delete(entry.id)).toThrow(/AUDIT_LOG_IMMUTABLE/);
  });

  it('audit log update throws — updates not permitted', () => {
    const entry = auditLog.append({ userId: 'u1', action: 'payment_verified', resourceId: 'ord_1', metadata: {} });
    expect(() => auditLog.update(entry.id, { action: 'deleted' })).toThrow(/AUDIT_LOG_IMMUTABLE/);
  });

  it('hash integrity check passes for unmodified entries', () => {
    for (let i = 0; i < 5; i++) {
      auditLog.append({ userId: `u${i}`, action: `action_${i}`, resourceId: `res_${i}`, metadata: {} });
    }
    const { valid } = auditLog.verifyIntegrity();
    expect(valid).toBe(true);
  });

  it('hash integrity check detects tampering', () => {
    const e = auditLog.append({ userId: 'u1', action: 'webhook_verified', resourceId: 'ord_1', metadata: {} });
    auditLog._tamperEntry(e.id, 'payment_deleted'); // simulate fraud

    const { valid, tamperedIds } = auditLog.verifyIntegrity();
    expect(valid).toBe(false);
    expect(tamperedIds).toContain(e.id);
  });

  it('getAll returns a defensive copy (mutations do not affect internal state)', () => {
    auditLog.append({ userId: 'u1', action: 'test', resourceId: 'r1', metadata: {} });
    const entries = auditLog.getAll() as AuditEntry[];
    entries.pop();
    expect(auditLog.size).toBe(1);
  });
});
