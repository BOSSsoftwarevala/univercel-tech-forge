import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { withAuth } from '../_shared/middleware.ts';
import { errorResponse, jsonResponse } from '../_shared/utils.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID') ?? '';
const PAYPAL_SECRET_KEY = Deno.env.get('PAYPAL_SECRET_KEY') ?? '';
const PAYPAL_API_URL = Deno.env.get('PAYPAL_ENVIRONMENT') === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

let cachedToken: { token: string; expiresAt: number } | null = null;

function getDiscountPercent(role: string) {
  switch (role) {
    case 'franchise':
      return 30;
    case 'reseller':
      return 15;
    case 'prime':
      return 10;
    default:
      return 0;
  }
}

function roundAmount(amount: number) {
  return Math.round(amount * 100) / 100;
}

function amountsMatch(left: number, right: number) {
  return Math.abs(left - right) < 0.01;
}

async function getPayPalAccessToken() {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to authenticate with PayPal');
  }

  const data = await response.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + ((data.expires_in || 3600) - 60) * 1000,
  };

  return data.access_token as string;
}

async function createPayPalOrder(accessToken: string, input: {
  amount: number;
  currency: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
}) {
  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `marketplace-${crypto.randomUUID()}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: input.currency,
            value: input.amount.toFixed(2),
          },
          description: input.description,
        },
      ],
      application_context: {
        return_url: input.returnUrl,
        cancel_url: input.cancelUrl,
        user_action: 'PAY_NOW',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create PayPal order: ${errorText}`);
  }

  return await response.json();
}

serve(async (req) => {
  return withAuth(req, ['franchise', 'reseller', 'prime', 'client', 'boss_owner', 'super_admin', 'admin'], async ({ supabaseAdmin, body, user }) => {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return errorResponse('Supabase environment is not configured', 503);
    }

    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET_KEY) {
      return errorResponse('PayPal credentials are not configured', 503);
    }

    const productId = String(body?.productId || body?.product_id || '').trim();
    const userId = String(body?.userId || body?.user_id || '').trim();
    const requestedAmountRaw = body?.amount;
    const requestedAmount = typeof requestedAmountRaw === 'undefined' || requestedAmountRaw === null || requestedAmountRaw === ''
      ? null
      : Number(requestedAmountRaw);
    const buyerName = String(body?.buyerName || '').trim();
    const buyerEmail = String(body?.buyerEmail || '').trim();
    const country = String(body?.country || '').trim();

    if (!productId || !userId) {
      return errorResponse('Missing required fields: productId, userId', 400);
    }

    if (userId !== user.userId) {
      return errorResponse('User validation failed', 403);
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('product_id, product_name, lifetime_price, monthly_price, is_active, status')
      .eq('product_id', productId)
      .limit(1)
      .maybeSingle();

    if (productError || !product) {
      return errorResponse('Product not found', 404);
    }

    if (product.is_active === false || ['inactive', 'parked', 'deleted'].includes(String(product.status || '').toLowerCase())) {
      return errorResponse('Product is not available for purchase', 400);
    }

    const grossAmount = roundAmount(Number(product.lifetime_price ?? product.monthly_price ?? 0));
    if (!Number.isFinite(grossAmount) || grossAmount <= 0) {
      return errorResponse('Product pricing is not configured', 400);
    }

    const discountPercent = getDiscountPercent(user.role);
    const finalAmount = roundAmount(grossAmount * ((100 - discountPercent) / 100));

    if (requestedAmount !== null && (!Number.isFinite(requestedAmount) || !amountsMatch(finalAmount, requestedAmount))) {
      return errorResponse('Amount mismatch. Checkout amount must match server pricing.', 400);
    }

    const { data: generatedOrderNumber, error: orderNumberError } = await supabaseAdmin.rpc('generate_marketplace_order_number');
    if (orderNumberError || !generatedOrderNumber) {
      return errorResponse(orderNumberError?.message || 'Unable to generate order number', 500);
    }

    const { data: insertedOrder, error: insertError } = await supabaseAdmin
      .from('marketplace_orders')
      .insert({
        order_number: generatedOrderNumber,
        buyer_user_id: user.userId,
        buyer_role: user.role,
        product_id: product.product_id,
        gross_amount: grossAmount,
        discount_percent: discountPercent,
        final_amount: finalAmount,
        payment_method: 'paypal',
        payment_status: 'pending_verification',
        order_status: 'payment_pending',
        requirements: {
          buyer_name: buyerName || null,
          buyer_email: buyerEmail || user.email,
          country: country || null,
        },
        metadata: {
          source: 'simple_checkout',
          requested_amount: requestedAmount ?? finalAmount,
          referral: {
            reseller_id: body?.reseller_id || null,
            franchise_id: body?.franchise_id || null,
            influencer_id: body?.influencer_id || null,
          },
        },
      })
      .select('id, order_number')
      .single();

    if (insertError || !insertedOrder) {
      return errorResponse(insertError?.message || 'Unable to create pending order', 500);
    }

    try {
      const accessToken = await getPayPalAccessToken();
      const origin = req.headers.get('origin') || new URL(req.url).origin;
      const paypalOrder = await createPayPalOrder(accessToken, {
        amount: finalAmount,
        currency: 'INR',
        description: `${product.product_name} (${insertedOrder.order_number})`,
        returnUrl: `${origin}/payment-success?order_id=${insertedOrder.id}`,
        cancelUrl: `${origin}/payment-failure?order_id=${insertedOrder.id}`,
      });

      const paymentUrl = Array.isArray(paypalOrder.links)
        ? paypalOrder.links.find((link: { rel?: string; href?: string }) => link.rel === 'approve')?.href
        : undefined;

      if (!paymentUrl || !paypalOrder.id) {
        throw new Error('PayPal approval URL is missing');
      }

      const { error: updateError } = await supabaseAdmin
        .from('marketplace_orders')
        .update({
          external_reference: paypalOrder.id,
          metadata: {
            source: 'simple_checkout',
            requested_amount: requestedAmount ?? finalAmount,
            provider: 'paypal',
            provider_order_id: paypalOrder.id,
            referral: {
              reseller_id: body?.reseller_id || null,
              franchise_id: body?.franchise_id || null,
              influencer_id: body?.influencer_id || null,
            },
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', insertedOrder.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      return jsonResponse({
        payment_url: paymentUrl,
        order_id: insertedOrder.id,
      }, 200);
    } catch (error) {
      await supabaseAdmin.from('marketplace_orders').delete().eq('id', insertedOrder.id);
      return errorResponse(error instanceof Error ? error.message : 'Unable to create payment session', 502);
    }
  }, { module: 'marketplace', action: 'create_payment', rateLimitType: 'payment' });
});