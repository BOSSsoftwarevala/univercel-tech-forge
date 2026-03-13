/**
 * Idempotency key deduplication store.
 * Ensures duplicate requests (e.g. rapid double-clicks) produce the same result.
 */

export interface IdempotencyRecord {
  key: string;
  resourceId: string;
  createdAt: number;
  ttlMs: number;
}

const store = new Map<string, IdempotencyRecord>();

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Check if an idempotency key has already been processed.
 * Returns the existing resource ID or null if not found / expired.
 */
export function getIdempotentResult(key: string): string | null {
  const record = store.get(key);
  if (!record) return null;

  const age = Date.now() - record.createdAt;
  if (age >= record.ttlMs) {
    store.delete(key);
    return null;
  }

  return record.resourceId;
}

/**
 * Record an idempotency key after a successful operation.
 */
export function recordIdempotentKey(
  key: string,
  resourceId: string,
  ttlMs = DEFAULT_TTL_MS
): void {
  store.set(key, { key, resourceId, createdAt: Date.now(), ttlMs });
}

/**
 * Remove a key (e.g. when an operation failed and should be retryable).
 */
export function removeIdempotentKey(key: string): void {
  store.delete(key);
}

export function clearIdempotencyStore(): void {
  store.clear();
}

export function idempotencyStoreSize(): number {
  return store.size;
}
