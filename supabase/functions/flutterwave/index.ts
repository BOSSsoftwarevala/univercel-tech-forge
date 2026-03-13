/**
 * flutterwave
 *
 * Flutterwave payment integration — creates payment links and verifies transactions.
 * Supports standard, recurring, and split payment types.
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

const FLW_SECRET_KEY  = Deno.env.get("FLUTTERWAVE_SECRET_KEY") || "";
const FLW_API_BASE    = "https://api.flutterwave.com/v3";
const FLW_BRAND_TITLE = Deno.env.get("MARKETPLACE_TITLE") || "Software Vala Marketplace";
const FLW_BRAND_LOGO  = Deno.env.get("MARKETPLACE_LOGO_URL") || "";

const FLW_RETRY_CONFIG = {
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

// ─── Create a Flutterwave payment link ──────────────────────────────────────
async function createPaymentLink(params: {
  tx_ref: string;
  amount: number;
  currency: string;
  redirect_url: string;
  customer: { email: string; name: string; phone_number?: string };
  meta?: Record<string, unknown>;
  title?: string;
  description?: string;
}) {
  if (!FLW_SECRET_KEY) throw new Error("Flutterwave secret key not configured");

  const response = await fetchWithRetry(
    `${FLW_API_BASE}/payments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: params.tx_ref,
        amount: params.amount,
        currency: params.currency,
        redirect_url: params.redirect_url,
        meta: params.meta || {},
        customer: params.customer,
        customizations: {
          title: params.title || FLW_BRAND_TITLE,
          description: params.description || "Software purchase",
          logo: FLW_BRAND_LOGO,
        },
      }),
    },
    FLW_RETRY_CONFIG,
  );

  if (!response.ok) {
    const err = await response.text();
    console.error("Flutterwave create payment error:", err);
    throw new Error("Failed to create Flutterwave payment link");
  }

  return await response.json();
}

// ─── Verify a Flutterwave transaction ───────────────────────────────────────
async function verifyTransaction(transactionId: string) {
  if (!FLW_SECRET_KEY) throw new Error("Flutterwave secret key not configured");

  const response = await fetchWithRetry(
    `${FLW_API_BASE}/transactions/${encodeURIComponent(transactionId)}/verify`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` },
    },
    FLW_RETRY_CONFIG,
  );

  if (!response.ok) {
    const err = await response.text();
    console.error("Flutterwave verify error:", err);
    throw new Error("Failed to verify Flutterwave transaction");
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

    if (action === "create_payment" || action === "") {
      const {
        tx_ref,
        amount,
        currency = "USD",
        redirect_url,
        customer_email,
        customer_name,
        customer_phone,
        order_id,
        title,
        description,
      } = body as Record<string, unknown>;

      if (!tx_ref || !amount || !redirect_url || !customer_email || !customer_name) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "tx_ref, amount, redirect_url, customer_email, customer_name are required",
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const parsedAmount = Number(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid amount" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const data = await createPaymentLink({
        tx_ref: sanitizeInput(String(tx_ref)),
        amount: parsedAmount,
        currency: sanitizeInput(String(currency)).toUpperCase(),
        redirect_url: String(redirect_url),
        customer: {
          email: sanitizeInput(String(customer_email)),
          name: sanitizeInput(String(customer_name)),
          phone_number: customer_phone ? sanitizeInput(String(customer_phone)) : undefined,
        },
        meta: order_id ? { order_id } : undefined,
        title: title ? sanitizeInput(String(title)) : undefined,
        description: description ? sanitizeInput(String(description)) : undefined,
      });

      return new Response(JSON.stringify({ success: true, data }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else if (action === "verify") {
      const { transaction_id } = body as { transaction_id?: string };
      if (!transaction_id) {
        return new Response(
          JSON.stringify({ success: false, error: "transaction_id is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const data = await verifyTransaction(sanitizeInput(String(transaction_id)));

      return new Response(JSON.stringify({ success: true, data }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      return new Response(
        JSON.stringify({ success: false, error: "Unknown action. Use ?action=create_payment or ?action=verify" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
  } catch (err) {
    console.error("Flutterwave function error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
