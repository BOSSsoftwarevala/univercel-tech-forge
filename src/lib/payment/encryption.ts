/**
 * AES-256-GCM Encryption / Decryption using Node.js built-in crypto
 * Provides encrypt/decrypt with PBKDF2 key derivation.
 */

import { createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256-bit
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const ITERATIONS = 100_000;
const DIGEST = 'sha256';
const AUTH_TAG_LENGTH = 16;

export interface EncryptedPayload {
  ciphertext: string; // hex
  iv: string;         // hex
  salt: string;       // hex
  authTag: string;    // hex
}

/**
 * Derive a 256-bit key from a password + salt using PBKDF2.
 */
function deriveKey(password: string, salt: Buffer): Buffer {
  return pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST);
}

/**
 * Encrypt plaintext using AES-256-GCM with PBKDF2 key derivation.
 */
export function encrypt(plaintext: string, password: string): EncryptedPayload {
  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);
  const key = deriveKey(password, salt);

  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    ciphertext: encrypted.toString('hex'),
    iv: iv.toString('hex'),
    salt: salt.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

/**
 * Decrypt an EncryptedPayload using AES-256-GCM.
 * Throws if authentication tag verification fails.
 */
export function decrypt(payload: EncryptedPayload, password: string): string {
  const salt = Buffer.from(payload.salt, 'hex');
  const iv = Buffer.from(payload.iv, 'hex');
  const ciphertext = Buffer.from(payload.ciphertext, 'hex');
  const authTag = Buffer.from(payload.authTag, 'hex');

  const key = deriveKey(password, salt);

  const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString('utf8');
}

/**
 * Mask a sensitive field value for storage display (not encryption).
 */
export function maskForStorage(value: string): string {
  if (value.length <= 4) return '****';
  return value.slice(0, 2) + '****' + value.slice(-2);
}
