import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { withAuth } from '../_shared/middleware.ts';
import { errorResponse, jsonResponse } from '../_shared/utils.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID') ?? '';
const PAYPAL_SECRET_KEY = Deno.env.get('PAYPAL_SECRET_KEY') ?? '';
const PAYPAL_API_URL = Deno.env.get('PAYPAL_ENVIRONMENT') === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET') ?? '';

let cachedToken: { token: string; expiresAt: number } | null = null;

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

async function capturePayPalOrder(accessToken: string, orderId: string) {
  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `capture-${orderId}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`PayPal capture failed: ${message}`);
  }

  return await response.json();
}

async function getPayPalOrder(accessToken: string, orderId: string) {
  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`PayPal order lookup failed: ${message}`);
  }

  return await response.json();
}

function extractCaptureDetails(payload: any) {
  const capture = payload?.purchase_units?.[0]?.payments?.captures?.[0] || null;
  const amount = Number(capture?.amount?.value || payload?.purchase_units?.[0]?.amount?.value || 0);
  return {
    paymentId: String(capture?.id || payload?.id || ''),
    amount,
    status: String(capture?.status || payload?.status || ''),
  };
}

async function computeHmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  return withAuth(req, ['franchise', 'reseller', 'prime', 'client', 'boss_owner', 'super_admin', 'admin'], async ({ supabaseAdmin, body, user }) => {
    if (!SUPABASE_URL || !PAYPAL_CLIENT_ID || !PAYPAL_SECRET_KEY || !WEBHOOK_SECRET) {
      return errorResponse('Payment verification environment is not configured', 503);
    }

    const orderId = String(body?.order_id || body?.orderId || '').trim();
    const providerOrderId = String(body?.token || body?.provider_order_id || body?.providerOrderId || '').trim();

    if (!orderId || !providerOrderId) {
      return errorResponse('order_id and provider order token are required', 400);
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from('marketplace_orders')
      .select('id, buyer_user_id, final_amount, external_reference, payment_status, order_status')
      .eq('id', orderId)
      .maybeSingle();

    if (orderError || !order) {
      return errorResponse('Marketplace order not found', 404);
    }

    if (order.buyer_user_id !== user.userId) {
      return errorResponse('Order ownership validation failed', 403);
    }

    if (order.payment_status === 'confirmed' || order.order_status === 'completed') {
      return jsonResponse({
        order_id: order.id,
        order_status: order.order_status,
        payment_status: order.payment_status,
        idempotent: true,
      });
    }

    if (order.external_reference && order.external_reference !== providerOrderId) {
      return errorResponse('Provider order mismatch', 400);
    }

    const accessToken = await getPayPalAccessToken();
    let capturePayload: any;

    try {
      capturePayload = await capturePayPalOrder(accessToken, providerOrderId);
    } catch {
      capturePayload = await getPayPalOrder(accessToken, providerOrderId);
    }

    const capture = extractCaptureDetails(capturePayload);

    if (!capture.paymentId || capture.status.toUpperCase() !== 'COMPLETED') {
      return errorResponse('Payment capture was not completed', 400);
    }

    if (Math.abs(Number(order.final_amount) - capture.amount) >= 0.01) {
      return errorResponse('Captured amount does not match order total', 400);
    }

    const webhookBody = JSON.stringify({
      order_id: order.id,
      payment_id: capture.paymentId,
      provider_order_id: providerOrderId,
      amount: capture.amount,
      status: capture.status,
    });

    const signature = await computeHmacHex(WEBHOOK_SECRET, webhookBody);
    const response = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/create-order-on-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-signature': `sha256=${signature}`,
      },
      body: webhookBody,
    });

    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.success) {
      return errorResponse(result?.error || 'Server-side order confirmation failed', 500);
    }

    return jsonResponse({
      order_id: order.id,
      payment_id: capture.paymentId,
      order_status: result.order_status || 'completed',
      payment_status: 'confirmed',
    });
  }, { module: 'marketplace', action: 'verify_payment', rateLimitType: 'payment' });
});