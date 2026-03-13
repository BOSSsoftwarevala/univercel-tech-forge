/**
 * Unit tests — Idempotency Key Deduplication
 */

import {
  getIdempotentResult,
  recordIdempotentKey,
  removeIdempotentKey,
  clearIdempotencyStore,
  idempotencyStoreSize,
} from '../../src/lib/payment/idempotency.js';

beforeEach(() => clearIdempotencyStore());

describe('Idempotency Store', () => {
  it('returns null for an unknown key', () => {
    expect(getIdempotentResult('unknown-key')).toBeNull();
  });

  it('returns the resource ID after recording', () => {
    recordIdempotentKey('key-1', 'order_abc');
    expect(getIdempotentResult('key-1')).toBe('order_abc');
  });

  it('returns the same result for duplicate key (deduplication)', () => {
    recordIdempotentKey('key-2', 'order_xyz');

    // Simulate second attempt with same key — should get same order ID back
    const result = getIdempotentResult('key-2');
    expect(result).toBe('order_xyz');
  });

  it('returns null after removing a key', () => {
    recordIdempotentKey('key-3', 'order_del');
    removeIdempotentKey('key-3');
    expect(getIdempotentResult('key-3')).toBeNull();
  });

  it('tracks store size accurately', () => {
    expect(idempotencyStoreSize()).toBe(0);
    recordIdempotentKey('k1', 'o1');
    recordIdempotentKey('k2', 'o2');
    expect(idempotencyStoreSize()).toBe(2);
  });

  it('returns null for an expired key (TTL 0)', () => {
    recordIdempotentKey('expired-key', 'order_expired', -1); // negative TTL → already expired
    const result = getIdempotentResult('expired-key');
    expect(result).toBeNull();
  });

  it('multiple keys for different orders are independent', () => {
    recordIdempotentKey('keyA', 'orderA');
    recordIdempotentKey('keyB', 'orderB');
    expect(getIdempotentResult('keyA')).toBe('orderA');
    expect(getIdempotentResult('keyB')).toBe('orderB');
  });

  it('duplicate rapid clicks return same order (core protection)', () => {
    // First request completes and records
    recordIdempotentKey('click-idem-1', 'order_first');

    // Second rapid click tries same key — must get the same order
    const secondResult = getIdempotentResult('click-idem-1');
    expect(secondResult).toBe('order_first');
  });
});
