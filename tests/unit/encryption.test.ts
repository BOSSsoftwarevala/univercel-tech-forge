/**
 * Unit tests — AES-256 Encryption/Decryption
 */

import { encrypt, decrypt, maskForStorage } from '../../src/lib/payment/encryption.js';

const SECRET = 'super-secret-test-key-32-chars-00';

describe('AES-256-GCM Encryption', () => {
  it('encrypts plaintext to a different ciphertext', () => {
    const payload = encrypt('sensitive-payment-data', SECRET);
    expect(payload.ciphertext).not.toBe('sensitive-payment-data');
    expect(payload.iv).toBeTruthy();
    expect(payload.salt).toBeTruthy();
    expect(payload.authTag).toBeTruthy();
  });

  it('produces unique ciphertext for identical inputs (IV randomness)', () => {
    const p1 = encrypt('same-data', SECRET);
    const p2 = encrypt('same-data', SECRET);
    expect(p1.ciphertext).not.toBe(p2.ciphertext);
    expect(p1.iv).not.toBe(p2.iv);
  });

  it('decrypts back to original plaintext', () => {
    const original = 'card_number:4111111111111111';
    const payload = encrypt(original, SECRET);
    const decrypted = decrypt(payload, SECRET);
    expect(decrypted).toBe(original);
  });

  it('encrypts empty string without error', () => {
    const payload = encrypt('', SECRET);
    const decrypted = decrypt(payload, SECRET);
    expect(decrypted).toBe('');
  });

  it('encrypts unicode / special characters correctly', () => {
    const original = '₹999.00 — पेमेंट';
    const payload = encrypt(original, SECRET);
    const decrypted = decrypt(payload, SECRET);
    expect(decrypted).toBe(original);
  });

  it('throws on wrong password (auth tag mismatch)', () => {
    const payload = encrypt('secret', SECRET);
    expect(() => decrypt(payload, 'wrong-password')).toThrow();
  });

  it('throws when ciphertext is tampered', () => {
    const payload = encrypt('secret', SECRET);
    const tampered = { ...payload, ciphertext: payload.ciphertext.replace(/.$/, '0') };
    expect(() => decrypt(tampered, SECRET)).toThrow();
  });

  it('throws when auth tag is tampered', () => {
    const payload = encrypt('secret', SECRET);
    const tampered = {
      ...payload,
      authTag: payload.authTag.slice(0, -2) + '00',
    };
    expect(() => decrypt(tampered, SECRET)).toThrow();
  });

  it('encrypts large payloads', () => {
    const large = 'A'.repeat(100_000);
    const payload = encrypt(large, SECRET);
    const decrypted = decrypt(payload, SECRET);
    expect(decrypted).toBe(large);
  });
});

describe('maskForStorage', () => {
  it('masks values longer than 4 chars', () => {
    expect(maskForStorage('4111111111111111')).toBe('41****11');
  });

  it('masks short values completely', () => {
    expect(maskForStorage('abc')).toBe('****');
  });
});
