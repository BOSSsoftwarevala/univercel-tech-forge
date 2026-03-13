// =============================================================================
// verify-payment-gateway — Double Verification Edge Function
//
// Performs a secondary, out-of-band API call to the payment gateway to confirm
// that a captured payment matches the expected amount, currency, and timestamp.
// Rejects the payment if any field does not match.
// =============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitExceededResponse } from "../_shared/rate-limiter.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const PAYPAL_CLIENT_ID = Deno.env.get("PAYPAL_CLIENT_ID");
const PAYPAL_SECRET_KEY = Deno.env.get("PAYPAL_SECRET_KEY");
const PAYPAL_API_URL =
  Deno.env.get("PAYPAL_ENVIRONMENT") === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

function getClientIP(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

/** Retrieve a fresh PayPal access token. */
async function getPayPalToken(): Promise<string> {
  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`);
  const res = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error("Failed to obtain PayPal access token");
  const data = await res.json();
  return data.access_token as string;
}

/** Fetch order details directly from PayPal. */
async function verifyPayPalOrder(
  gatewayRef: string,
  expectedAmount: string,
  expectedCurrency: string,
): Promise<{ verified: boolean; reason?: string }> {
  try {
    const token = await getPayPalToken();
    const res = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${gatewayRef}`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) return { verified: false, reason: `PayPal API returned ${res.status}` };

    const order = await res.json();
    const capture = order?.purchase_units?.[0]?.payments?.captures?.[0];

    if (!capture) return { verified: false, reason: "No capture found in PayPal order" };
    if (capture.status !== "COMPLETED") {
      return { verified: false, reason: `Capture status: ${capture.status}` };
    }

    const gwAmount = parseFloat(capture.amount?.value ?? "0").toFixed(2);
    const gwCurrency = (capture.amount?.currency_code ?? "").toUpperCase();

    if (gwAmount !== parseFloat(expectedAmount).toFixed(2)) {
      return { verified: false, reason: `Amount mismatch: expected ${expectedAmount}, got ${gwAmount}` };
    }
    if (gwCurrency !== expectedCurrency.toUpperCase()) {
      return { verified: false, reason: `Currency mismatch: expected ${expectedCurrency}, got ${gwCurrency}` };
    }

    return { verified: true };
  } catch (err) {
    return { verified: false, reason: `Verification error: ${(err as Error).message}` };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const clientIP = getClientIP(req);
  const rateLimit = checkRateLimit(clientIP, "payment", "payment");
  if (!rateLimit.allowed) return rateLimitExceededResponse(rateLimit.resetIn);

  try {
    const { order_id, gateway, gateway_ref, expected_amount, expected_currency } =
      await req.json();

    if (!order_id || !gateway || !gateway_ref || !expected_amount || !expected_currency) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    let result: { verified: boolean; reason?: string };

    if (gateway === "paypal") {
      result = await verifyPayPalOrder(gateway_ref, expected_amount, expected_currency);
    } else {
      result = { verified: false, reason: `Unsupported gateway: ${gateway}` };
    }

    // Update payment record with verification outcome
    if (result.verified) {
      await supabase
        .from("payments")
        .update({ verified: true, verified_at: new Date().toISOString() })
        .eq("gateway_ref", gateway_ref);
    }

    // Append to immutable ledger
    await supabase.rpc("append_payment_ledger", {
      p_event_type: result.verified ? "payment_verified" : "payment_verification_failed",
      p_order_id: order_id,
      p_user_id: null,
      p_amount: parseFloat(expected_amount),
      p_currency: expected_currency,
      p_gateway: gateway,
      p_gateway_ref: gateway_ref,
      p_event_data: { reason: result.reason ?? null, ip: clientIP },
    });

    return new Response(JSON.stringify({ success: true, ...result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[verify-payment-gateway]", (err as Error).message);
    return new Response(
      JSON.stringify({ success: false, error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
