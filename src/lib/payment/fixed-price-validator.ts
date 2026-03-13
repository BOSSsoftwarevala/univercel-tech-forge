/**
 * Fixed Price Validator
 * Enforces the single flat price of $249 USD for all products.
 * No discounts, no overrides, no dynamic pricing.
 */

export const FIXED_PRICE = 249;
export const FIXED_CURRENCY = 'USD';

export interface PriceValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate that an amount equals the fixed price of $249 USD.
 * Rejects any attempt to override the price.
 */
export function validateFixedPrice(amount: number): PriceValidationResult {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return { valid: false, error: 'Amount must be a number' };
  }
  if (amount !== FIXED_PRICE) {
    return { valid: false, error: `Amount must be exactly $${FIXED_PRICE} USD. Received: $${amount}` };
  }
  return { valid: true };
}

/**
 * Validate that a currency is USD.
 */
export function validateCurrency(currency: string): PriceValidationResult {
  if (currency.toUpperCase() !== FIXED_CURRENCY) {
    return { valid: false, error: `Currency must be ${FIXED_CURRENCY}. Received: ${currency}` };
  }
  return { valid: true };
}

/**
 * Get the fixed checkout price. Always returns 249 regardless of input.
 * Frontend must not be trusted to supply the price.
 */
export function getFixedPrice(): number {
  return FIXED_PRICE;
}

/**
 * Format the fixed price for display.
 */
export function formatFixedPrice(): string {
  return `$${FIXED_PRICE} ${FIXED_CURRENCY}`;
}
