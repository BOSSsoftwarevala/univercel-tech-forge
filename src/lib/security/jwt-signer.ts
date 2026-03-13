/**
 * Service-to-Service JWT Signer
 *
 * Creates and verifies compact signed tokens used by backend edge functions
 * to authenticate internal API calls (zero-trust service mesh).
 *
 * Algorithm: HMAC-SHA256 over a manually constructed JWT
 * (no external library dependency required in Deno / browser environments).
 */

const DEFAULT_EXPIRY_SECONDS = 300; // 5 minutes

export interface ServiceTokenPayload {
  /** Issuing service identifier */
  iss: string;
  /** Intended audience (target service) */
  aud: string;
  /** Subject (operation / resource) */
  sub: string;
  /** Issued-at epoch seconds */
  iat: number;
  /** Expiry epoch seconds */
  exp: number;
  /** Optional additional claims */
  [key: string]: unknown;
}

function base64UrlEncode(input: string): string {
  return btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64UrlDecode(input: string): string {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
  return atob(b64);
}

async function sign(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return base64UrlEncode(String.fromCharCode(...new Uint8Array(sig)));
}

/**
 * Create a signed service JWT.
 *
 * @param payload   Custom claims to embed
 * @param secret    HMAC-SHA256 signing secret (from environment)
 * @param expirySeconds  Token lifetime in seconds (default 300)
 */
export async function createServiceToken(
  payload: Omit<ServiceTokenPayload, 'iat' | 'exp'>,
  secret: string,
  expirySeconds: number = DEFAULT_EXPIRY_SECONDS,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: ServiceTokenPayload = {
    ...payload,
    iat: now,
    exp: now + expirySeconds,
  };

  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64UrlEncode(JSON.stringify(fullPayload));
  const signingInput = `${header}.${body}`;
  const signature = await sign(signingInput, secret);

  return `${signingInput}.${signature}`;
}

/**
 * Verify a service JWT and return the decoded payload.
 * Throws if the token is invalid, expired, or has a bad signature.
 */
export async function verifyServiceToken(
  token: string,
  secret: string,
  expectedAudience?: string,
): Promise<ServiceTokenPayload> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Malformed service token');

  const [headerB64, bodyB64, sigB64] = parts;

  // Re-compute expected signature
  const signingInput = `${headerB64}.${bodyB64}`;
  const expectedSig = await sign(signingInput, secret);

  // Constant-time comparison
  if (expectedSig.length !== sigB64.length) throw new Error('Invalid service token signature');
  let mismatch = 0;
  for (let i = 0; i < expectedSig.length; i++) {
    mismatch |= expectedSig.charCodeAt(i) ^ sigB64.charCodeAt(i);
  }
  if (mismatch !== 0) throw new Error('Invalid service token signature');

  // Decode and validate payload
  const payload: ServiceTokenPayload = JSON.parse(base64UrlDecode(bodyB64));
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp < now) throw new Error('Service token expired');
  if (payload.iat > now + 60) throw new Error('Service token issued in the future');
  if (expectedAudience && payload.aud !== expectedAudience) {
    throw new Error(`Service token audience mismatch: expected ${expectedAudience}`);
  }

  return payload;
}
