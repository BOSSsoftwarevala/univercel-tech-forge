/**
 * Payment Service - Order creation, validation, and amount locking
 * Bank-grade security: amount is locked at order creation, never trusted from frontend.
 */

export type OrderStatus =
  | 'pending'
  | 'payment_initiated'
  | 'webhook_received'
  | 'webhook_verified'
  | 'completed'
  | 'failed'
  | 'flagged_for_review';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: Currency;
}

export interface Order {
  id: string;
  userId: string;
  product: Product;
  /** Amount locked at creation — never modified after */
  lockedAmount: number;
  currency: Currency;
  status: OrderStatus;
  idempotencyKey: string;
  createdAt: number;
  updatedAt: number;
  webhookVerified: boolean;
  fraudScore: number;
  metadata: Record<string, unknown>;
}

export interface CreateOrderInput {
  userId: string;
  productId: string;
  idempotencyKey: string;
  /** Amount provided by client — validated against catalog */
  clientAmount?: number;
  currency: Currency;
  metadata?: Record<string, unknown>;
}

export interface PaymentServiceConfig {
  productCatalog: Product[];
  maxOrdersPerHourPerIp: number;
  maxOrdersPerDayPerUser: number;
}

/** In-memory order store for testing */
const orderStore = new Map<string, Order>();
/** Idempotency cache: key → orderId */
const idempotencyCache = new Map<string, string>();
/** Rate-limit counters: ip → { hour: count, reset: timestamp } */
const ipHourlyCounters = new Map<string, { count: number; reset: number }>();
/** Rate-limit counters: userId → { day: count, reset: timestamp } */
const userDailyCounters = new Map<string, { count: number; reset: number }>();

function generateId(): string {
  return `order_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function resetPaymentServiceState(): void {
  orderStore.clear();
  idempotencyCache.clear();
  ipHourlyCounters.clear();
  userDailyCounters.clear();
}

export function getOrder(orderId: string): Order | undefined {
  const o = orderStore.get(orderId);
  return o ? { ...o } : undefined;
}

export function getAllOrders(): Order[] {
  return Array.from(orderStore.values());
}

/**
 * Check IP-based rate limit (max 5 orders/hour by default).
 */
export function checkIpRateLimit(
  ip: string,
  maxPerHour: number = parseInt(process.env.RATE_LIMIT_ORDERS_PER_HOUR ?? '5', 10)
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;

  let counter = ipHourlyCounters.get(ip);
  if (!counter || now > counter.reset) {
    counter = { count: 0, reset: now + windowMs };
    ipHourlyCounters.set(ip, counter);
  }

  if (counter.count >= maxPerHour) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: maxPerHour - counter.count };
}

/**
 * Check user-based rate limit (max 10 orders/day by default).
 */
export function checkUserRateLimit(
  userId: string,
  maxPerDay: number = parseInt(process.env.RATE_LIMIT_ORDERS_PER_DAY ?? '10', 10)
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowMs = 24 * 60 * 60 * 1000;

  let counter = userDailyCounters.get(userId);
  if (!counter || now > counter.reset) {
    counter = { count: 0, reset: now + windowMs };
    userDailyCounters.set(userId, counter);
  }

  if (counter.count >= maxPerDay) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: maxPerDay - counter.count };
}

function incrementIpCounter(ip: string): void {
  const counter = ipHourlyCounters.get(ip);
  if (counter) counter.count++;
}

function incrementUserCounter(userId: string): void {
  const counter = userDailyCounters.get(userId);
  if (counter) counter.count++;
}

/**
 * Create an order with server-side amount locking.
 * The client-provided amount is validated against the product catalog.
 * If it doesn't match, the order is rejected (price-tampering protection).
 */
export function createOrder(
  input: CreateOrderInput,
  config: PaymentServiceConfig,
  ip: string
): { success: true; order: Order } | { success: false; error: string } {
  // 1. Idempotency check
  const existingOrderId = idempotencyCache.get(input.idempotencyKey);
  if (existingOrderId) {
    const existingOrder = orderStore.get(existingOrderId);
    if (existingOrder) {
      return { success: true, order: existingOrder };
    }
  }

  // 2. Rate limiting
  const ipLimit = checkIpRateLimit(ip, config.maxOrdersPerHourPerIp);
  if (!ipLimit.allowed) {
    return { success: false, error: 'RATE_LIMIT_IP: Too many orders from this IP' };
  }

  const userLimit = checkUserRateLimit(input.userId, config.maxOrdersPerDayPerUser);
  if (!userLimit.allowed) {
    return { success: false, error: 'RATE_LIMIT_USER: Daily order limit exceeded' };
  }

  // 3. Validate product exists in catalog
  const product = config.productCatalog.find(p => p.id === input.productId);
  if (!product) {
    return { success: false, error: 'INVALID_PRODUCT: Product not found in catalog' };
  }

  // 4. Currency match
  if (product.currency !== input.currency) {
    return { success: false, error: 'CURRENCY_MISMATCH: Order currency does not match product currency' };
  }

  // 5. Price-tampering detection — lock server-side amount
  if (input.clientAmount !== undefined && input.clientAmount !== product.price) {
    return { success: false, error: 'PRICE_TAMPERED: Client amount does not match catalog price' };
  }

  // 6. Create order with locked amount
  const now = Date.now();
  const order: Order = {
    id: generateId(),
    userId: input.userId,
    product,
    lockedAmount: product.price, // LOCKED — never trusts frontend amount
    currency: product.currency,
    status: 'pending',
    idempotencyKey: input.idempotencyKey,
    createdAt: now,
    updatedAt: now,
    webhookVerified: false,
    fraudScore: 0,
    metadata: input.metadata ?? {},
  };

  orderStore.set(order.id, order);
  idempotencyCache.set(input.idempotencyKey, order.id);
  incrementIpCounter(ip);
  incrementUserCounter(input.userId);

  return { success: true, order: { ...order } }; // defensive copy
}

/**
 * Update order status — only callable internally (not from frontend).
 * Transitions are validated to prevent invalid state changes.
 */
export function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  callerRole: 'webhook_service' | 'payment_service' | 'admin'
): { success: true } | { success: false; error: string } {
  const order = orderStore.get(orderId);
  if (!order) {
    return { success: false, error: 'ORDER_NOT_FOUND' };
  }

  // Validate allowed transitions
  const allowed = isStatusTransitionAllowed(order.status, newStatus, callerRole);
  if (!allowed) {
    return { success: false, error: `INVALID_TRANSITION: ${order.status} → ${newStatus} by ${callerRole}` };
  }

  order.status = newStatus;
  order.updatedAt = Date.now();
  if (newStatus === 'webhook_verified') {
    order.webhookVerified = true;
  }

  return { success: true };
}

function isStatusTransitionAllowed(
  current: OrderStatus,
  next: OrderStatus,
  role: string
): boolean {
  if (role === 'admin') return true;

  const transitions: Record<OrderStatus, OrderStatus[]> = {
    pending: ['payment_initiated', 'failed'],
    payment_initiated: ['webhook_received', 'failed'],
    webhook_received: ['webhook_verified', 'failed'],
    webhook_verified: ['completed'],
    completed: [],
    failed: [],
    flagged_for_review: ['failed', 'completed'],
  };

  return transitions[current]?.includes(next) ?? false;
}

/**
 * Verify payment amount matches locked order amount.
 * Rejects if there's any discrepancy.
 */
export function verifyPaymentAmount(
  orderId: string,
  paidAmount: number,
  paidCurrency: Currency
): { valid: true } | { valid: false; reason: string } {
  const order = orderStore.get(orderId);
  if (!order) {
    return { valid: false, reason: 'ORDER_NOT_FOUND' };
  }

  if (order.currency !== paidCurrency) {
    return { valid: false, reason: `CURRENCY_MISMATCH: expected ${order.currency}, got ${paidCurrency}` };
  }

  if (Math.abs(paidAmount - order.lockedAmount) > 0.001) {
    return { valid: false, reason: `AMOUNT_MISMATCH: expected ${order.lockedAmount}, got ${paidAmount}` };
  }

  return { valid: true };
}

/**
 * Generate license key — only after webhook_verified=true.
 */
export function generateLicenseKey(orderId: string): { key: string } | { error: string } {
  const order = orderStore.get(orderId);
  if (!order) {
    return { error: 'ORDER_NOT_FOUND' };
  }
  if (!order.webhookVerified) {
    return { error: 'LICENSE_GATED: webhook not verified' };
  }
  if (order.status !== 'webhook_verified' && order.status !== 'completed') {
    return { error: `LICENSE_GATED: order status is ${order.status}` };
  }

  // Generate deterministic license key based on order
  const raw = `${order.id}|${order.userId}|${order.product.id}|${order.lockedAmount}`;
  const encoded = Buffer.from(raw).toString('base64').replace(/[^A-Z0-9]/gi, '').toUpperCase();
  const key = `LIC-${encoded.slice(0, 6)}-${encoded.slice(6, 12)}-${encoded.slice(12, 18)}`;

  return { key };
}
