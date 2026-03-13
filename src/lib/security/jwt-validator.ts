// ==============================================
// JWT Validator
// ==============================================
// Client-side validation helpers for JWTs issued
// by Supabase.  Full signature verification is
// delegated to the Supabase server; this module
// performs cheap structural + claims checks that
// catch obviously tampered / expired tokens before
// they are ever sent to the API.

export interface JWTClaims {
  sub?: string;
  email?: string;
  role?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
  exp?: number;
  iat?: number;
  iss?: string;
  aud?: string | string[];
}

export interface JWTValidationResult {
  valid: boolean;
  claims?: JWTClaims;
  reason?: string;
}

// Decode a JWT without verifying the signature (for claims inspection only)
export function decodeJWT(token: string): JWTClaims | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Base64url → base64 → JSON
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json) as JWTClaims;
  } catch {
    return null;
  }
}

// Fast structural + expiry validation (no crypto)
export function validateJWTStructure(token: string): JWTValidationResult {
  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'Token is empty or not a string' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, reason: 'Token does not have three parts' };
  }

  // Reject "none" algorithm
  try {
    const raw = parts[0].replace(/-/g, '+').replace(/_/g, '/');
    const padded = raw + '='.repeat((4 - (raw.length % 4)) % 4);
    const headerJson = atob(padded);
    const header = JSON.parse(headerJson) as { alg?: string };
    if (header.alg?.toLowerCase() === 'none') {
      return { valid: false, reason: 'Unsigned token (alg=none) rejected' };
    }
  } catch {
    return { valid: false, reason: 'Invalid token header' };
  }

  const claims = decodeJWT(token);
  if (!claims) {
    return { valid: false, reason: 'Invalid token payload' };
  }

  // Expiry check
  if (claims.exp && claims.exp < Math.floor(Date.now() / 1000)) {
    return { valid: false, claims, reason: 'Token has expired' };
  }

  // Not-before check (iat should be in the past)
  if (claims.iat && claims.iat > Math.floor(Date.now() / 1000) + 60) {
    return { valid: false, claims, reason: 'Token issued in the future' };
  }

  return { valid: true, claims };
}

// Check whether the JWT contains one of the expected roles
export function hasRequiredRole(
  token: string,
  allowedRoles: string[],
): boolean {
  const claims = decodeJWT(token);
  if (!claims) return false;

  const tokenRole =
    (claims.app_metadata as Record<string, unknown> | undefined)?.['role'] as string | undefined ??
    claims.role;

  return typeof tokenRole === 'string' && allowedRoles.includes(tokenRole);
}

// Compute seconds until the token expires (negative if already expired)
export function secondsUntilExpiry(token: string): number {
  const claims = decodeJWT(token);
  if (!claims?.exp) return 0;
  return claims.exp - Math.floor(Date.now() / 1000);
}

// Check whether the token should be proactively refreshed
// (expires within the given threshold, default 5 minutes)
export function shouldRefreshToken(token: string, thresholdSecs = 300): boolean {
  return secondsUntilExpiry(token) <= thresholdSecs;
}
