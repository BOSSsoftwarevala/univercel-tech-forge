/**
 * Data masking utilities for payment-related sensitive fields.
 * Email, payment ID, and license key masking.
 */

/**
 * Mask an email address: jo***@***.com
 */
export function maskEmail(email: string): string {
  const atIdx = email.indexOf('@');
  if (atIdx < 0) return '***@***.***';

  const local = email.slice(0, atIdx);
  const domain = email.slice(atIdx + 1);
  const dotIdx = domain.lastIndexOf('.');
  const tld = dotIdx >= 0 ? domain.slice(dotIdx) : '';

  const maskedLocal = local.length > 2 ? local.slice(0, 2) + '***' : '***';
  const maskedDomain = '***' + tld;

  return `${maskedLocal}@${maskedDomain}`;
}

/**
 * Mask a payment ID: PAY_****_XXXX (show last 4 chars)
 */
export function maskPaymentId(paymentId: string): string {
  if (paymentId.length < 4) return '****';
  const visible = paymentId.slice(-4).toUpperCase();
  return `****${visible}`;
}

/**
 * Mask a license key: show only first segment
 * e.g. LIC-ABCDEF-GHIJKL-MNOPQR → LIC-ABCDEF-****-****
 */
export function maskLicenseKey(licenseKey: string): string {
  const parts = licenseKey.split('-');
  if (parts.length < 2) return '****-****';
  const masked = [parts[0], parts[1], ...parts.slice(2).map(() => '****')];
  return masked.join('-');
}

/**
 * Mask a card number: show only last 4 digits
 */
export function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 4) return '****';
  return `****-****-****-${digits.slice(-4)}`;
}

/**
 * Determine if a field should be masked based on viewer role.
 */
export function shouldMaskPaymentField(
  fieldName: string,
  viewerRole: 'boss_owner' | 'admin' | 'webhook_service' | 'user'
): boolean {
  if (viewerRole === 'boss_owner' || viewerRole === 'admin') return false;
  if (viewerRole === 'webhook_service') {
    // Webhook service sees order IDs but not user PII
    return ['email', 'card_number', 'license_key'].includes(fieldName);
  }
  // Regular users see masked payment IDs and license keys in logs
  return ['payment_id', 'card_number'].includes(fieldName);
}
