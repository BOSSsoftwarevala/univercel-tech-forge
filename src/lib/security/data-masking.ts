/**
 * Data Masking Layer
 *
 * Masks PII and payment identifiers before they appear in logs, API responses
 * sent to non-privileged roles, or any user-facing surface.
 *
 * Rules:
 *  - Email:       u***@example.com
 *  - Payment IDs: ****1234
 *  - License keys: ****-****-****-XXXX  (last 4 chars only)
 *  - Phone:       +91***7890
 *  - IP address:  10.x.x.x (last 3 octets replaced for IPv4)
 */

/** Mask an email address: jo***@example.com */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '***@***.***';
  const [local, domain] = email.split('@');
  if (local.length <= 1) return `${local}***@${domain}`;
  return `${local[0]}***@${domain}`;
}

/**
 * Mask a payment / transaction ID — shows only the last 4 characters.
 * e.g. "PAY-ABCDEF1234" → "****1234"
 */
export function maskPaymentId(id: string): string {
  if (!id || id.length < 4) return '****';
  return `****${id.slice(-4)}`;
}

/**
 * Mask a license key — shows only the last 4 characters of the final segment.
 * e.g. "XXXX-YYYY-ZZZZ-ABCD" → "****-****-****-ABCD"
 */
export function maskLicenseKey(key: string): string {
  if (!key) return '****-****-****-****';
  const segments = key.split('-');
  if (segments.length === 1) return `****${key.slice(-4)}`;
  const masked = segments.slice(0, -1).map(() => '****');
  masked.push(segments[segments.length - 1]);
  return masked.join('-');
}

/** Mask a phone number: +91***7890 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 6) return '***';
  return `${phone.slice(0, 3)}***${phone.slice(-4)}`;
}

/** Mask a full name: "John Doe" → "J*** D***" */
export function maskName(name: string): string {
  if (!name) return '***';
  return name
    .split(' ')
    .map((part) => (part.length > 0 ? `${part[0]}***` : '***'))
    .join(' ');
}

/**
 * Mask an IPv4 address for log safety: "192.168.1.100" → "192.x.x.x"
 */
export function maskIpAddress(ip: string): string {
  if (!ip) return 'x.x.x.x';
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.x.x.x`;
  }
  // IPv6 — keep first group only
  const groups = ip.split(':');
  return `${groups[0]}:****:****`;
}

/**
 * Mask a record of sensitive fields based on caller role.
 *
 * @param data   Raw data object (may contain PII)
 * @param role   Caller's role — 'boss_owner' and 'admin' receive unmasked data
 */
export function maskSensitiveRecord(
  data: Record<string, unknown>,
  role: string,
): Record<string, unknown> {
  // Privileged roles receive raw data
  if (role === 'boss_owner' || role === 'admin') return data;

  const out = { ...data };

  if (typeof out.email === 'string') out.email = maskEmail(out.email);
  if (typeof out.phone === 'string') out.phone = maskPhone(out.phone);
  if (typeof out.full_name === 'string') out.full_name = maskName(out.full_name);
  if (typeof out.license_key === 'string') out.license_key = maskLicenseKey(out.license_key);
  if (typeof out.payment_id === 'string') out.payment_id = maskPaymentId(out.payment_id);
  if (typeof out.gateway_ref === 'string') out.gateway_ref = maskPaymentId(out.gateway_ref);
  if (typeof out.ip_address === 'string') out.ip_address = maskIpAddress(out.ip_address);

  return out;
}
