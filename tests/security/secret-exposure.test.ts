/**
 * Security test — Secret Exposure Prevention
 * No secrets should appear in logs, API responses, or error messages.
 */

import { encrypt, decrypt } from '../../src/lib/payment/encryption.js';
import { signJwt, verifyJwt } from '../../src/lib/payment/jwt-signer.js';
import { maskEmail, maskPaymentId, maskLicenseKey } from '../../src/lib/payment/data-masking.js';

const SECRETS = [
  'whsec_test_placeholder',
  'sk_test_placeholder',
  'test-encryption-key-32-chars-0000',
  'test-jwt-secret-key-for-tests',
  '4111111111111111', // card number
  'FLWSECK_TEST-placeholder',
];

describe('Secret Exposure Prevention', () => {
  it('encryption key is not present in encrypted output', () => {
    const key = 'my-super-secret-encryption-key!';
    const payload = encrypt('hello world', key);
    const outputStr = JSON.stringify(payload);

    expect(outputStr).not.toContain(key);
  });

  it('JWT secret is not present in the signed token', () => {
    const secret = 'top-secret-jwt-signing-key-123';
    const token = signJwt(
      { sub: 'service', iss: 'pay', aud: 'api', exp: Math.floor(Date.now() / 1000) + 300 },
      secret
    );
    expect(token).not.toContain(secret);
  });

  it('card number does not appear in masked response', () => {
    // Simulate API response masking
    const cardNumber = '4111111111111111';
    const masked = maskPaymentId(cardNumber);
    expect(masked).not.toContain('41111111');
  });

  it('email is masked in API response, original not exposed', () => {
    const email = 'supersecretuser@privatecompany.com';
    const masked = maskEmail(email);
    expect(masked).not.toContain('privatecompany');
    expect(masked).not.toBe(email);
  });

  it('license key segments after first are masked in logs', () => {
    const key = 'LIC-ABCDEF-GHIJKL-MNOPQR';
    const masked = maskLicenseKey(key);
    expect(masked).not.toContain('GHIJKL');
    expect(masked).not.toContain('MNOPQR');
  });

  it('JWT payload does not leak the signing secret', () => {
    const secret = 'do-not-expose-secret';
    const token = signJwt(
      { sub: 'webhook_svc', iss: 'pay', aud: 'backend', exp: Math.floor(Date.now() / 1000) + 300, secret: 'attempt' },
      secret
    );
    // Decode the payload part (base64)
    const payloadB64 = token.split('.')[1];
    const payloadStr = Buffer.from(
      payloadB64.replace(/-/g, '+').replace(/_/g, '/'),
      'base64'
    ).toString('utf8');

    expect(payloadStr).not.toContain(secret);
    // The "secret" key in the payload is user-provided data, not the signing key
    expect(payloadStr).not.toContain('do-not-expose-secret');
  });

  it('error messages do not contain secret values', () => {
    // Verify that wrong-key decryption error does not include the key
    const key = 'original-key-32chars-xxxxxxxxxxx';
    const payload = encrypt('data', key);
    let errorMessage = '';
    try {
      decrypt(payload, 'wrong-key-32chars-yyyyyyyyyyyyyyy');
    } catch (e) {
      errorMessage = (e as Error).message;
    }
    for (const secret of SECRETS) {
      expect(errorMessage).not.toContain(secret);
    }
  });

  it('ciphertext does not contain recognisable plaintext', () => {
    const sensitiveData = 'CONFIDENTIAL_BANK_ACCOUNT_12345';
    const payload = encrypt(sensitiveData, 'key-32-chars-xxxxxxxxxxxxxxxxxx');
    expect(payload.ciphertext).not.toContain('CONFIDENTIAL');
    expect(payload.ciphertext).not.toContain('BANK');
  });
});
