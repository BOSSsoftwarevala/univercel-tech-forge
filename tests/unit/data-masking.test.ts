/**
 * Unit tests — Data Masking (email, payment ID, license key)
 */

import {
  maskEmail,
  maskPaymentId,
  maskLicenseKey,
  maskCardNumber,
  shouldMaskPaymentField,
} from '../../src/lib/payment/data-masking.js';

describe('maskEmail', () => {
  it('masks local part keeping first 2 chars', () => {
    const masked = maskEmail('john.doe@example.com');
    expect(masked).toBe('jo***@***.com');
  });

  it('handles short local parts', () => {
    const masked = maskEmail('a@b.io');
    expect(masked).toBe('***@***.io');
  });

  it('handles missing @ sign', () => {
    expect(maskEmail('notanemail')).toBe('***@***.***');
  });

  it('preserves TLD', () => {
    expect(maskEmail('user@company.co.uk')).toContain('.uk');
  });

  it('does not expose full email', () => {
    const email = 'test.user@secretdomain.net';
    const masked = maskEmail(email);
    expect(masked).not.toBe(email);
    expect(masked).not.toContain('secretdomain');
  });
});

describe('maskPaymentId', () => {
  it('shows only last 4 chars prefixed with ****', () => {
    expect(maskPaymentId('PAY_1234567890ABCDEF')).toBe('****CDEF');
  });

  it('handles short IDs', () => {
    expect(maskPaymentId('ab')).toBe('****');
  });

  it('uppercases the visible portion', () => {
    expect(maskPaymentId('pay_xyz_abcd')).toBe('****ABCD');
  });
});

describe('maskLicenseKey', () => {
  it('shows first two segments, masks rest', () => {
    const masked = maskLicenseKey('LIC-ABCDEF-GHIJKL-MNOPQR');
    expect(masked).toBe('LIC-ABCDEF-****-****');
  });

  it('handles keys without segments', () => {
    expect(maskLicenseKey('NOTSEGMENTED')).toBe('****-****');
  });
});

describe('maskCardNumber', () => {
  it('shows only last 4 digits', () => {
    expect(maskCardNumber('4111 1111 1111 1111')).toBe('****-****-****-1111');
  });

  it('handles cards without spaces', () => {
    expect(maskCardNumber('5500005555555559')).toBe('****-****-****-5559');
  });

  it('handles short input', () => {
    expect(maskCardNumber('123')).toBe('****');
  });
});

describe('shouldMaskPaymentField', () => {
  it('boss_owner sees everything unmasked', () => {
    expect(shouldMaskPaymentField('email', 'boss_owner')).toBe(false);
    expect(shouldMaskPaymentField('card_number', 'boss_owner')).toBe(false);
  });

  it('admin sees everything unmasked', () => {
    expect(shouldMaskPaymentField('license_key', 'admin')).toBe(false);
  });

  it('webhook_service sees order IDs but not PII', () => {
    expect(shouldMaskPaymentField('email', 'webhook_service')).toBe(true);
    expect(shouldMaskPaymentField('card_number', 'webhook_service')).toBe(true);
  });

  it('regular user has payment_id and card_number masked', () => {
    expect(shouldMaskPaymentField('payment_id', 'user')).toBe(true);
    expect(shouldMaskPaymentField('card_number', 'user')).toBe(true);
  });
});
