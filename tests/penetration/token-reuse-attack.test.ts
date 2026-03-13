/**
 * Penetration test — Token Reuse Attack
 * Expired JWT tokens must be rejected (cannot be reused).
 */

import { signJwt, verifyJwt } from '../../src/lib/payment/jwt-signer.js';

const SECRET = 'test-jwt-secret-key-for-penetration';

describe('Token Reuse Attack', () => {
  it('expired JWT is always rejected', () => {
    const expiredToken = signJwt(
      { sub: 'attacker', iss: 'payment', aud: 'backend', exp: Math.floor(Date.now() / 1000) - 1 },
      SECRET
    );
    const result = verifyJwt(expiredToken, SECRET);
    expect(result.valid).toBe(false);
    if (result.valid) throw new Error();
    expect(result.reason).toBe('TOKEN_EXPIRED');
  });

  it('token expired 1 hour ago is rejected', () => {
    const token = signJwt(
      { sub: 'attacker', iss: 'payment', aud: 'backend', exp: Math.floor(Date.now() / 1000) - 3600 },
      SECRET
    );
    expect(verifyJwt(token, SECRET).valid).toBe(false);
  });

  it('token expired 1 day ago is rejected', () => {
    const token = signJwt(
      { sub: 'attacker', iss: 'payment', aud: 'backend', exp: Math.floor(Date.now() / 1000) - 86400 },
      SECRET
    );
    expect(verifyJwt(token, SECRET).valid).toBe(false);
  });

  it('"none" algorithm attack token is rejected', () => {
    const noneHeader = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' }))
      .toString('base64')
      .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const payload = Buffer.from(JSON.stringify({ sub: 'admin', role: 'boss_owner', exp: 9999999999 }))
      .toString('base64')
      .replace(/=/g, '');
    const noneToken = `${noneHeader}.${payload}.`;

    const result = verifyJwt(noneToken, SECRET);
    expect(result.valid).toBe(false);
    if (result.valid) throw new Error();
    expect(result.reason).toBe('ALGORITHM_NONE_REJECTED');
  });

  it('token with tampered role claim is rejected', () => {
    const token = signJwt(
      { sub: 'user', iss: 'payment', aud: 'backend', role: 'user', exp: Math.floor(Date.now() / 1000) + 300 },
      SECRET
    );
    const [header, , sig] = token.split('.');
    const tamperedPayload = Buffer.from(
      JSON.stringify({ sub: 'user', iss: 'payment', aud: 'backend', role: 'boss_owner', exp: Math.floor(Date.now() / 1000) + 300 })
    ).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

    const tamperedToken = `${header}.${tamperedPayload}.${sig}`;
    expect(verifyJwt(tamperedToken, SECRET).valid).toBe(false);
  });

  it('valid short-lived token works within expiry', () => {
    const token = signJwt(
      { sub: 'webhook_service', iss: 'payment', aud: 'backend', exp: Math.floor(Date.now() / 1000) + 300 },
      SECRET
    );
    expect(verifyJwt(token, SECRET).valid).toBe(true);
  });

  it('10 expired tokens with different subs are all rejected', () => {
    for (let i = 0; i < 10; i++) {
      const token = signJwt(
        { sub: `attacker_${i}`, iss: 'payment', aud: 'backend', exp: Math.floor(Date.now() / 1000) - (i + 1) },
        SECRET
      );
      expect(verifyJwt(token, SECRET).valid).toBe(false);
    }
  });
});
