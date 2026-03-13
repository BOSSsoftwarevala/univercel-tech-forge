/**
 * Payment Gateway Handler
 * Integrates Flutterwave, Stripe, and PayU for processing $249 USD payments.
 * Price is always hardcoded to 249 USD — frontend cannot override.
 */

import { supabase } from '@/integrations/supabase/client';
import { FIXED_PRICE, FIXED_CURRENCY } from './fixed-price-validator';

export type PaymentGateway = 'flutterwave' | 'stripe' | 'payu';

export interface PaymentInitParams {
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  gateway: PaymentGateway;
  idempotencyKey?: string;
}

export interface PaymentInitResult {
  success: boolean;
  orderId?: string;
  redirectUrl?: string;
  clientSecret?: string;
  error?: string;
}

/**
 * Initiate a payment by calling the backend create-order function.
 * Amount is always $249 USD — not passed from frontend.
 */
export async function initiatePayment(params: PaymentInitParams): Promise<PaymentInitResult> {
  try {
    const { data, error } = await supabase.functions.invoke('create-order', {
      body: {
        productId: params.productId,
        productName: params.productName,
        customerName: params.customerName,
        customerEmail: params.customerEmail,
        gateway: params.gateway,
        idempotencyKey: params.idempotencyKey || crypto.randomUUID(),
      },
    });

    if (error) {
      console.error('[PaymentGatewayHandler] create-order error:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      orderId: data.orderId,
      redirectUrl: data.redirectUrl,
      clientSecret: data.clientSecret,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Payment initiation failed';
    console.error('[PaymentGatewayHandler] initiatePayment error:', message);
    return { success: false, error: message };
  }
}

/**
 * Get the display label for a gateway.
 */
export function getGatewayLabel(gateway: PaymentGateway): string {
  const labels: Record<PaymentGateway, string> = {
    flutterwave: 'Flutterwave',
    stripe: 'Stripe',
    payu: 'PayU',
  };
  return labels[gateway] ?? gateway;
}

/**
 * Return the fixed price and currency for display only.
 * Actual amount is enforced server-side.
 */
export function getDisplayPrice(): { amount: number; currency: string; formatted: string } {
  return {
    amount: FIXED_PRICE,
    currency: FIXED_CURRENCY,
    formatted: `$${FIXED_PRICE} ${FIXED_CURRENCY}`,
  };
}
