// ==============================================
// TOTP (Time-based One-Time Password) System
// ==============================================
// Implements RFC 6238 TOTP for 2FA authentication.
// Uses the Web Crypto API – no external dependencies.

export interface TOTPConfig {
  secret: string;
  digits?: number;
  period?: number;
  algorithm?: 'SHA-1' | 'SHA-256' | 'SHA-512';
}

export interface TOTPSetupResult {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
  manualEntryKey: string;
}

export interface TOTPVerifyResult {
  valid: boolean;
  remainingSeconds?: number;
}

// Base32 alphabet (RFC 4648)
const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

// Decode a base32-encoded string to a Uint8Array
function base32Decode(input: string): Uint8Array {
  const cleanInput = input.toUpperCase().replace(/=+$/, '').replace(/\s/g, '');
  const bits: number[] = [];

  for (const char of cleanInput) {
    const val = BASE32_CHARS.indexOf(char);
    if (val === -1) throw new Error(`Invalid base32 character: ${char}`);
    bits.push((val >> 4) & 1, (val >> 3) & 1, (val >> 2) & 1, (val >> 1) & 1, val & 1);
  }

  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = bits.slice(i * 8, i * 8 + 8).reduce((acc, b) => (acc << 1) | b, 0);
  }
  return bytes;
}

// Encode a Uint8Array to base32
function base32Encode(input: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let output = '';

  for (const byte of input) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32_CHARS[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_CHARS[(value << (5 - bits)) & 31];
  }

  return output;
}

// Generate a cryptographically-secure random TOTP secret (20 bytes → 32-char base32)
export function generateTOTPSecret(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return base32Encode(bytes);
}

// Generate a set of single-use backup recovery codes
export function generateBackupCodes(count = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const bytes = new Uint8Array(5);
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    // Format as XXXXX-XXXXX
    codes.push(`${hex.slice(0, 5).toUpperCase()}-${hex.slice(5, 10).toUpperCase()}`);
  }
  return codes;
}

// Compute HMAC-SHA-1 (the RFC 4226 mandated algorithm)
async function hmacSha1(keyBytes: Uint8Array, counter: bigint): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign'],
  );

  // Counter as big-endian 8-byte value
  const msg = new Uint8Array(8);
  let c = counter;
  for (let i = 7; i >= 0; i--) {
    msg[i] = Number(c & 0xffn);
    c >>= 8n;
  }

  const sig = await crypto.subtle.sign('HMAC', key, msg);
  return new Uint8Array(sig);
}

// Core HOTP generation (RFC 4226)
async function hotp(secret: string, counter: bigint, digits = 6): Promise<string> {
  const keyBytes = base32Decode(secret);
  const hash = await hmacSha1(keyBytes, counter);

  // Dynamic truncation
  const offset = hash[hash.length - 1] & 0x0f;
  const code =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  return (code % 10 ** digits).toString().padStart(digits, '0');
}

// Generate TOTP code for the current time window
export async function generateTOTP(config: TOTPConfig): Promise<string> {
  const { secret, digits = 6, period = 30 } = config;
  const counter = BigInt(Math.floor(Date.now() / 1000 / period));
  return hotp(secret, counter, digits);
}

// Verify a TOTP code (checks current window ±1 for clock drift)
export async function verifyTOTP(
  config: TOTPConfig,
  token: string,
): Promise<TOTPVerifyResult> {
  const { secret, digits = 6, period = 30 } = config;
  const now = Math.floor(Date.now() / 1000);
  const currentCounter = Math.floor(now / period);

  for (const delta of [-1, 0, 1]) {
    const expected = await hotp(secret, BigInt(currentCounter + delta), digits);
    if (expected === token) {
      const remainingSeconds = period - (now % period);
      return { valid: true, remainingSeconds };
    }
  }

  return { valid: false };
}

// Build an otpauth:// URI for QR-code provisioning
export function buildOtpAuthUri(params: {
  secret: string;
  issuer: string;
  accountName: string;
  digits?: number;
  period?: number;
}): string {
  const { secret, issuer, accountName, digits = 6, period = 30 } = params;
  const label = encodeURIComponent(`${issuer}:${accountName}`);
  return (
    `otpauth://totp/${label}` +
    `?secret=${secret}` +
    `&issuer=${encodeURIComponent(issuer)}` +
    `&algorithm=SHA1` +
    `&digits=${digits}` +
    `&period=${period}`
  );
}

// Full TOTP device setup – returns everything needed for registration
export function setupTOTP(accountName: string, issuer = 'SoftwareVala'): TOTPSetupResult {
  const secret = generateTOTPSecret();
  const uri = buildOtpAuthUri({ secret, issuer, accountName });
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(uri)}`;
  const backupCodes = generateBackupCodes(10);

  // Format secret in groups of 4 for manual entry
  const manualEntryKey = secret.match(/.{1,4}/g)?.join(' ') ?? secret;

  return { secret, qrCodeUrl, backupCodes, manualEntryKey };
}
