/**
 * Security test — Encryption at Rest
 * Sensitive payment data must be encrypted before storage.
 */

import { encrypt, decrypt } from '../../src/lib/payment/encryption.js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY ?? 'test-encryption-key-32-chars-0000';

/** Simulated DB record with encrypted fields */
interface PaymentRecord {
  orderId: string;
  userId: string;
  encryptedCardNumber: ReturnType<typeof encrypt>;
  encryptedBankAccount: ReturnType<typeof encrypt>;
  encryptedEmail: ReturnType<typeof encrypt>;
  amount: number;
  currency: string;
}

function storePaymentRecord(params: {
  orderId: string;
  userId: string;
  cardNumber: string;
  bankAccount: string;
  email: string;
  amount: number;
  currency: string;
}): PaymentRecord {
  return {
    orderId: params.orderId,
    userId: params.userId,
    encryptedCardNumber: encrypt(params.cardNumber, ENCRYPTION_KEY),
    encryptedBankAccount: encrypt(params.bankAccount, ENCRYPTION_KEY),
    encryptedEmail: encrypt(params.email, ENCRYPTION_KEY),
    amount: params.amount,
    currency: params.currency,
  };
}

describe('Encryption at Rest', () => {
  it('card number is encrypted, not stored in plaintext', () => {
    const record = storePaymentRecord({
      orderId: 'ord-enc-1',
      userId: 'u1',
      cardNumber: '4111111111111111',
      bankAccount: 'ICICI-999888777',
      email: 'user@example.com',
      amount: 999,
      currency: 'INR',
    });

    // Ciphertext should not equal plaintext
    const ctHex = record.encryptedCardNumber.ciphertext;
    expect(ctHex).not.toContain('4111111111111111');
    expect(JSON.stringify(record)).not.toContain('4111111111111111');
  });

  it('bank account is encrypted in storage', () => {
    const record = storePaymentRecord({
      orderId: 'ord-enc-2',
      userId: 'u1',
      cardNumber: '5500005555555559',
      bankAccount: 'SBI-123456789',
      email: 'user2@example.com',
      amount: 4999,
      currency: 'INR',
    });
    expect(JSON.stringify(record)).not.toContain('SBI-123456789');
  });

  it('email is encrypted in storage', () => {
    const record = storePaymentRecord({
      orderId: 'ord-enc-3',
      userId: 'u1',
      cardNumber: '378282246310005',
      bankAccount: 'HDFC-000111',
      email: 'secret@company.com',
      amount: 999,
      currency: 'INR',
    });
    expect(JSON.stringify(record)).not.toContain('secret@company.com');
  });

  it('encrypted fields can be decrypted with correct key', () => {
    const record = storePaymentRecord({
      orderId: 'ord-enc-4',
      userId: 'u1',
      cardNumber: '4111111111111111',
      bankAccount: 'AXIS-777888999',
      email: 'test@domain.net',
      amount: 999,
      currency: 'INR',
    });

    expect(decrypt(record.encryptedCardNumber, ENCRYPTION_KEY)).toBe('4111111111111111');
    expect(decrypt(record.encryptedBankAccount, ENCRYPTION_KEY)).toBe('AXIS-777888999');
    expect(decrypt(record.encryptedEmail, ENCRYPTION_KEY)).toBe('test@domain.net');
  });

  it('decryption fails with wrong key', () => {
    const record = storePaymentRecord({
      orderId: 'ord-enc-5',
      userId: 'u1',
      cardNumber: '4111111111111111',
      bankAccount: 'WRONG-TEST',
      email: 'x@y.com',
      amount: 100,
      currency: 'INR',
    });
    expect(() => decrypt(record.encryptedCardNumber, 'wrong-key')).toThrow();
  });

  it('two records with same card number produce different ciphertexts (IV randomness)', () => {
    const r1 = storePaymentRecord({
      orderId: 'ord-enc-6a',
      userId: 'u1',
      cardNumber: '4111111111111111',
      bankAccount: 'X',
      email: 'a@b.com',
      amount: 100,
      currency: 'INR',
    });
    const r2 = storePaymentRecord({
      orderId: 'ord-enc-6b',
      userId: 'u2',
      cardNumber: '4111111111111111',
      bankAccount: 'X',
      email: 'a@b.com',
      amount: 100,
      currency: 'INR',
    });
    expect(r1.encryptedCardNumber.ciphertext).not.toBe(r2.encryptedCardNumber.ciphertext);
  });
});
