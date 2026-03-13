/**
 * Unit tests — JWT Signer (service-to-service authentication)
 */

import { signJwt, verifyJwt } from '../../src/lib/payment/jwt-signer.js';

const SECRET = 'test-jwt-secret-key-for-unit-tests';

describe('JWT Signing', () => {
  it('produces a three-part JWT', () => {
    const token = signJwt(
      { sub: 'webhook_service', iss: 'payment-gateway', aud: 'backend', exp: Math.floor(Date.now() / 1000) + 300 },
      SECRET
    );
    expect(token.split('.')).toHaveLength(3);
  });

  it('verifies a valid JWT successfully', () => {
    const exp = Math.floor(Date.now() / 1000) + 300;
    const token = signJwt({ sub: 'service_a', iss: 'payment', aud: 'api', exp }, SECRET);
    const result = verifyJwt(token, SECRET);

    expect(result.valid).toBe(true);
    if (!result.valid) throw new Error();
    expect(result.payload.sub).toBe('service_a');
  });

  it('rejects token with wrong secret', () => {
    const token = signJwt(
      { sub: 's', iss: 'i', aud: 'a', exp: Math.floor(Date.now() / 1000) + 300 },
      SECRET
    );
    const result = verifyJwt(token, 'wrong-secret');
    expect(result.valid).toBe(false);
    if (result.valid) throw new Error();
    expect(result.reason).toBe('INVALID_SIGNATURE');
  });

  it('rejects expired token', () => {
    const exp = Math.floor(Date.now() / 1000) - 10; // expired 10s ago
    const token = signJwt({ sub: 's', iss: 'i', aud: 'a', exp }, SECRET);
    const result = verifyJwt(token, SECRET);
    expect(result.valid).toBe(false);
    if (result.valid) throw new Error();
    expect(result.reason).toBe('TOKEN_EXPIRED');
  });

  it('rejects token with tampered payload', () => {
    const token = signJwt(
      { sub: 'user', iss: 'i', aud: 'a', exp: Math.floor(Date.now() / 1000) + 300 },
      SECRET
    );
    const [header, , sig] = token.split('.');
    // Replace payload with a tampered one (elevated role)
    const tamperedPayload = Buffer.from(
      JSON.stringify({ sub: 'admin', role: 'super_admin', exp: Math.floor(Date.now() / 1000) + 300 })
    )
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const tamperedToken = `${header}.${tamperedPayload}.${sig}`;
    const result = verifyJwt(tamperedToken, SECRET);
    expect(result.valid).toBe(false);
  });

  it('rejects "none" algorithm attack', () => {
    const noneHeader = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' }))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    const payload = Buffer.from(JSON.stringify({ sub: 'admin', exp: 9999999999 }))
      .toString('base64')
      .replace(/=/g, '');
    const token = `${noneHeader}.${payload}.`;
    const result = verifyJwt(token, SECRET);
    expect(result.valid).toBe(false);
    if (result.valid) throw new Error();
    expect(result.reason).toBe('ALGORITHM_NONE_REJECTED');
  });

  it('rejects malformed token (wrong number of parts)', () => {
    const result = verifyJwt('not.a.valid.jwt.token', SECRET);
    expect(result.valid).toBe(false);
  });

  it('includes iat in the token payload', () => {
    const before = Math.floor(Date.now() / 1000);
    const token = signJwt(
      { sub: 's', iss: 'i', aud: 'a', exp: Math.floor(Date.now() / 1000) + 300 },
      SECRET
    );
    const result = verifyJwt(token, SECRET);
    expect(result.valid).toBe(true);
    if (!result.valid) throw new Error();
    expect(result.payload.iat).toBeGreaterThanOrEqual(before);
  });
});
