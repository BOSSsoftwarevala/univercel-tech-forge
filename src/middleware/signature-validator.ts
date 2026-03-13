export interface SignedRequest {
  body: string;
  timestamp: string;
  signature: string;
}

async function hmacSha256(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function signRequest(
  body: string,
  secret: string,
  timestamp?: string,
): Promise<string> {
  const ts = timestamp ?? String(Math.floor(Date.now() / 1000));
  const message = `${ts}.${body}`;
  return hmacSha256(message, secret);
}

export function isRequestExpired(timestamp: string, maxAgeSeconds = 300): boolean {
  const ts = parseInt(timestamp, 10);
  if (isNaN(ts)) return true;
  const now = Math.floor(Date.now() / 1000);
  return Math.abs(now - ts) > maxAgeSeconds;
}

export async function validateSignature(
  req: SignedRequest,
  secret: string,
  maxAgeSeconds = 300,
): Promise<boolean> {
  if (isRequestExpired(req.timestamp, maxAgeSeconds)) return false;
  const expected = await signRequest(req.body, secret, req.timestamp);
  return expected === req.signature;
}
