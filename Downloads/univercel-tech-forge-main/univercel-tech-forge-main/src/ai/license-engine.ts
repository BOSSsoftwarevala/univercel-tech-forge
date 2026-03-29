export interface LicenseLockConfig {
  userId: string | null;
  orderId: string | null;
  productId: string | null;
  deviceLock: boolean;
  domainLock: boolean;
  encrypted: boolean;
  expiryControl: boolean;
}

export function buildLicenseLock(input: { userId?: string | null; orderId?: string | null; productId?: string | null; domain?: string | null }) {
  return {
    userId: input.userId || null,
    orderId: input.orderId || null,
    productId: input.productId || null,
    deviceLock: true,
    domainLock: Boolean(input.domain),
    encrypted: true,
    expiryControl: true,
    domain: input.domain || null,
  } satisfies LicenseLockConfig & { domain: string | null };
}