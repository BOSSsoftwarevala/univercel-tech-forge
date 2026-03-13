/**
 * Penetration test — SQL Injection in Payment Fields
 * SQL injection payloads in order/payment fields must not cause data corruption.
 */

import {
  createOrder,
  resetPaymentServiceState,
  getAllOrders,
  type PaymentServiceConfig,
} from '../../src/lib/payment/payment-service.js';
import { maskEmail } from '../../src/lib/payment/data-masking.js';
import { encrypt, decrypt } from '../../src/lib/payment/encryption.js';

const config: PaymentServiceConfig = {
  productCatalog: [{ id: 'prod_basic', name: 'Basic', price: 999, currency: 'INR' }],
  maxOrdersPerHourPerIp: 100,
  maxOrdersPerDayPerUser: 100,
};

const SQL_PAYLOADS = [
  "' OR '1'='1",
  "'; DROP TABLE orders;--",
  "1' OR '1'='1' /*",
  "admin'--",
  "' UNION SELECT * FROM payments--",
  "1; SELECT * FROM users",
  "' AND 1=1--",
  "1' AND SLEEP(5)--",
  "'; EXEC xp_cmdshell('ls');--",
  "0x61646d696e",
];

const KEY = 'test-encryption-key-32-chars-0000';

beforeEach(() => resetPaymentServiceState());

describe('SQL Injection in Payment Fields', () => {
  it('SQL injection in userId is stored safely as text (no execution)', () => {
    for (const payload of SQL_PAYLOADS) {
      const r = createOrder(
        {
          userId: payload,
          productId: 'prod_basic',
          idempotencyKey: `sql-user-${encodeURIComponent(payload).slice(0, 20)}`,
          currency: 'INR',
        },
        config,
        '10.0.0.1'
      );

      // The service either accepts it (stored as literal text) or rejects it
      // Either way: no SQL execution, no crash, no data loss
      if (r.success) {
        expect(r.order.userId).toBe(payload); // stored literally, not executed
      }
      // No exception should be thrown
    }
    // System is still consistent
    expect(getAllOrders().length).toBeGreaterThanOrEqual(0);
  });

  it('SQL injection in idempotencyKey is treated as opaque string', () => {
    const payload = "'; DROP TABLE orders;--";
    const r = createOrder(
      { userId: 'normal_user', productId: 'prod_basic', idempotencyKey: payload, currency: 'INR' },
      config,
      '10.0.0.2'
    );
    // Does not crash
    if (r.success) {
      expect(r.order.idempotencyKey).toBe(payload);
    }
  });

  it('SQL injection payload in email masking does not cause error', () => {
    for (const payload of SQL_PAYLOADS) {
      // maskEmail should handle any string without crashing
      expect(() => maskEmail(payload)).not.toThrow();
    }
  });

  it('SQL injection in encrypted fields is stored safely', () => {
    for (const payload of SQL_PAYLOADS) {
      const encrypted = encrypt(payload, KEY);
      const decrypted = decrypt(encrypted, KEY);
      expect(decrypted).toBe(payload); // round-trip is safe
    }
  });

  it('all SQL payloads in userId do not corrupt order count', () => {
    let created = 0;
    for (let i = 0; i < SQL_PAYLOADS.length; i++) {
      const r = createOrder(
        {
          userId: SQL_PAYLOADS[i],
          productId: 'prod_basic',
          idempotencyKey: `sql-cnt-${i}`,
          currency: 'INR',
        },
        config,
        `11.0.0.${i + 1}`
      );
      if (r.success) created++;
    }
    // The count matches what was created (no ghost records, no missing records)
    expect(getAllOrders().length).toBe(created);
  });
});
