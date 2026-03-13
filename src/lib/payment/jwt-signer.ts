/**
 * JWT Signer — service-to-service authentication tokens.
 * Uses HMAC-SHA256 for signing (symmetric, suitable for internal services).
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

export interface JwtPayload {
  sub: string;       // subject (service name or user id)
  iss: string;       // issuer
  aud: string;       // audience
  iat: number;       // issued at (seconds)
  exp: number;       // expiry (seconds)
  role?: string;
  [key: string]: unknown;
}

function base64url(input: string | Buffer): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64urlDecode(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = (4 - (padded.length % 4)) % 4;
  return Buffer.from(padded + '='.repeat(pad), 'base64').toString('utf8');
}

/**
 * Sign a JWT with HMAC-SHA256.
 */
export function signJwt(payload: Omit<JwtPayload, 'iat'>, secret: string): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000) }));
  const signature = createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${header}.${body}.${signature}`;
}

export type VerifyResult =
  | { valid: true; payload: JwtPayload }
  | { valid: false; reason: string };

/**
 * Verify a JWT: checks signature and expiry.
 */
export function verifyJwt(token: string, secret: string): VerifyResult {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, reason: 'MALFORMED_TOKEN' };
  }

  const [header, body, signature] = parts;

  // Prevent algorithm confusion attack — reject 'none'
  let headerObj: { alg: string };
  try {
    headerObj = JSON.parse(base64urlDecode(header));
  } catch {
    return { valid: false, reason: 'MALFORMED_HEADER' };
  }
  if (headerObj.alg === 'none' || !headerObj.alg) {
    return { valid: false, reason: 'ALGORITHM_NONE_REJECTED' };
  }

  // Verify signature using timing-safe comparison
  const expectedSig = createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return { valid: false, reason: 'INVALID_SIGNATURE' };
  }

  // Decode payload
  let payload: JwtPayload;
  try {
    payload = JSON.parse(base64urlDecode(body)) as JwtPayload;
  } catch {
    return { valid: false, reason: 'MALFORMED_PAYLOAD' };
  }

  // Check expiry
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    return { valid: false, reason: 'TOKEN_EXPIRED' };
  }

  return { valid: true, payload };
}
