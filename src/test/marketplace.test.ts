import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';
import { maskEmail, maskPhone, maskName, containsMaskedId, preserveMaskedIds, restoreMaskedIds } from '@/lib/masking';

describe('cn (class name utility)', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('deduplicates conflicting Tailwind classes', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });
});

describe('maskEmail', () => {
  it('masks a standard email address', () => {
    expect(maskEmail('john@example.com')).toBe('jo***@example.com');
  });

  it('handles emails with short local parts', () => {
    expect(maskEmail('ab@example.com')).toBe('ab***@example.com');
  });

  it('returns placeholder for invalid input', () => {
    expect(maskEmail('')).toBe('***@***.***');
    expect(maskEmail('notanemail')).toBe('***@***.***');
  });
});

describe('maskPhone', () => {
  it('masks a phone number', () => {
    expect(maskPhone('+919876543210')).toBe('+91****3210');
  });

  it('returns placeholder for short/empty input', () => {
    expect(maskPhone('')).toBe('***');
    expect(maskPhone('123')).toBe('***');
  });
});

describe('maskName', () => {
  it('masks a full name with first and last', () => {
    expect(maskName('John Doe')).toBe('John D***');
  });

  it('masks a single name', () => {
    expect(maskName('Alice')).toBe('Al***');
  });

  it('returns placeholder for empty input', () => {
    expect(maskName('')).toBe('***');
  });
});

describe('containsMaskedId', () => {
  it('detects a boss masked ID', () => {
    expect(containsMaskedId('👑 BOSS-01')).toBe(true);
  });

  it('detects a prime user masked ID', () => {
    expect(containsMaskedId('⭐ PRM-1234567')).toBe(true);
  });

  it('returns false for plain text', () => {
    expect(containsMaskedId('Hello World')).toBe(false);
  });
});

describe('preserveMaskedIds and restoreMaskedIds', () => {
  it('round-trips masked IDs through preserve/restore', () => {
    const original = 'User MGT-01 has joined';
    const { cleanText, maskedIds } = preserveMaskedIds(original);
    const restored = restoreMaskedIds(cleanText, maskedIds);
    expect(restored).toBe(original);
  });

  it('handles text with no masked IDs', () => {
    const text = 'No masked ids here';
    const { cleanText, maskedIds } = preserveMaskedIds(text);
    expect(cleanText).toBe(text);
    expect(maskedIds).toHaveLength(0);
  });
});

