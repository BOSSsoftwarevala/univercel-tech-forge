/**
 * AES-256-GCM Encryption Layer
 *
 * Provides AES-256-GCM encryption/decryption for PII and payment data at rest.
 * Uses PBKDF2 key derivation with a random salt per encryption operation.
 *
 * Usage:
 *   const enc = await encryptField('4111111111111111', process.env.ENCRYPTION_KEY!);
 *   const plain = await decryptField(enc, process.env.ENCRYPTION_KEY!);
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_BYTES = 12;
const SALT_BYTES = 16;
const PBKDF2_ITERATIONS = 100_000;
const HASH = 'SHA-256';

export interface EncryptedField {
  /** Base64-encoded ciphertext (includes GCM auth tag appended by SubtleCrypto) */
  ciphertext: string;
  /** Base64-encoded 96-bit IV */
  iv: string;
  /** Base64-encoded 128-bit PBKDF2 salt */
  salt: string;
}

function toBase64(buf: ArrayBuffer | Uint8Array): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf instanceof ArrayBuffer ? buf : buf.buffer)));
}

function fromBase64(b64: string): Uint8Array {
  return new Uint8Array(
    atob(b64)
      .split('')
      .map((c) => c.charCodeAt(0)),
  );
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const raw = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: HASH },
    raw,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt'],
  );
}

/** Encrypt a plaintext string with AES-256-GCM. */
export async function encryptField(plaintext: string, password: string): Promise<EncryptedField> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const key = await deriveKey(password, salt);

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    new TextEncoder().encode(plaintext),
  );

  return {
    ciphertext: toBase64(encrypted),
    iv: toBase64(iv),
    salt: toBase64(salt),
  };
}

/** Decrypt an EncryptedField back to plaintext. */
export async function decryptField(enc: EncryptedField, password: string): Promise<string> {
  const salt = fromBase64(enc.salt);
  const iv = fromBase64(enc.iv);
  const ciphertext = fromBase64(enc.ciphertext);
  const key = await deriveKey(password, salt);

  const decrypted = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, ciphertext);
  return new TextDecoder().decode(decrypted);
}

/**
 * Compute SHA-256 hash of a string — safe to store in logs (no PII exposed).
 */
export async function hashForLog(value: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Compute HMAC-SHA256 signature.
 * Used for webhook signature verification and request signing.
 */
export async function hmacSha256(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: HASH },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Constant-time comparison to prevent timing attacks. */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
