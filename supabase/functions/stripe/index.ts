/**
 * stripe
 *
 * Stripe payment integration — creates PaymentIntents and retrieves payment status.
 * Uses Stripe API directly (no SDK dependency) for Deno compatibility.
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { fetchWithRetry } from "../_shared/retry-handler.ts";
import { checkRateLimit, rateLimitExceededResponse } from "../_shared/rate-limiter.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") || "";
const STRIPE_API_BASE   = "https://api.stripe.com/v1";

const STRIPE_RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  timeout: 30000,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

function getClientIP(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  return input.replace(/[<>'"&]/g, "").trim().slice(0, 500);
}

function authHeader(): Record<string, string> {
  if (!STRIPE_SECRET_KEY) throw new Error("Stripe secret key not configured");
  return {
    Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
}

// ─── Create a Stripe PaymentIntent ──────────────────────────────────────────
async function createPaymentIntent(params: {
  amount: number; // in smallest currency unit (cents for USD)
  currency: string;
  order_id: string;
  customer_email?: string;
  description?: string;
  idempotency_key?: string;
}) {
  const body = new URLSearchParams({
    amount: String(Math.round(params.amount)),
    currency: params.currency.toLowerCase(),
    "metadata[order_id]": params.order_id,
    "automatic_payment_methods[enabled]": "true",
  });

  if (params.customer_email) body.set("receipt_email", params.customer_email);
  if (params.description) body.set("description", params.description.slice(0, 1000));

  const headers: Record<string, string> = {
    ...authHeader(),
  };
  if (params.idempotency_key) {
    headers["Idempotency-Key"] = params.idempotency_key;
  }

  const response = await fetchWithRetry(
    `${STRIPE_API_BASE}/payment_intents`,
    { method: "POST", headers, body: body.toString() },
    STRIPE_RETRY_CONFIG,
  );

  if (!response.ok) {
    const err = await response.text();
    console.error("Stripe create PaymentIntent error:", err);
    throw new Error("Failed to create Stripe PaymentIntent");
  }

  return await response.json();
}

// ─── Retrieve a Stripe PaymentIntent ─────────────────────────────────────────
async function retrievePaymentIntent(paymentIntentId: string) {
  const response = await fetchWithRetry(
    `${STRIPE_API_BASE}/payment_intents/${encodeURIComponent(paymentIntentId)}`,
    { method: "GET", headers: authHeader() },
    STRIPE_RETRY_CONFIG,
  );

  if (!response.ok) {
    const err = await response.text();
    console.error("Stripe retrieve PaymentIntent error:", err);
    throw new Error("Failed to retrieve Stripe PaymentIntent");
  }

  return await response.json();
}

// ─── Main handler ────────────────────────────────────────────────────────────
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const clientIP = getClientIP(req);
  const rateResult = checkRateLimit(clientIP, "payment");
  if (!rateResult.allowed) {
    return rateLimitExceededResponse(rateResult.resetIn);
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "";

    let body: Record<string, unknown> = {};
    if (req.method !== "GET") {
      try {
        body = await req.json();
      } catch {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid JSON" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    if (action === "create_payment_intent" || action === "") {
      const {
        amount_cents,
        currency = "usd",
        order_id,
        customer_email,
        description,
        idempotency_key,
      } = body as Record<string, unknown>;

      if (!amount_cents || !order_id) {
        return new Response(
          JSON.stringify({ success: false, error: "amount_cents and order_id are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const parsedAmount = Number(amount_cents);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid amount_cents" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const data = await createPaymentIntent({
        amount: parsedAmount,
        currency: sanitizeInput(String(currency)),
        order_id: sanitizeInput(String(order_id)),
        customer_email: customer_email ? sanitizeInput(String(customer_email)) : undefined,
        description: description ? sanitizeInput(String(description)) : undefined,
        idempotency_key: idempotency_key ? sanitizeInput(String(idempotency_key)) : undefined,
      });

      return new Response(JSON.stringify({ success: true, data }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else if (action === "retrieve") {
      const { payment_intent_id } = body as { payment_intent_id?: string };
      if (!payment_intent_id) {
        return new Response(
          JSON.stringify({ success: false, error: "payment_intent_id is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const data = await retrievePaymentIntent(sanitizeInput(String(payment_intent_id)));

      return new Response(JSON.stringify({ success: true, data }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Unknown action. Use ?action=create_payment_intent or ?action=retrieve",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
  } catch (err) {
    console.error("Stripe function error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
