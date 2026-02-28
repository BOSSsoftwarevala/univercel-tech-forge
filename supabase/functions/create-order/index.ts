// =============================================================================
// create-order — Secure Order Creation Edge Function
//
// Creates a new order with:
//  1. Idempotency key deduplication (prevent duplicate orders)
//  2. Fraud detection call (risk scoring)
//  3. IP-based rate limiting (5 orders/hour per IP)
//  4. Device fingerprint logging
//  5. Order expires in 30 minutes if not paid
//  6. All events written to immutable payment_event_ledger
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
const MAX_ORDERS_PER_IP_PER_HOUR = parseInt(
  Deno.env.get("MAX_ORDERS_PER_IP_PER_HOUR") ?? "5",
  10,
);

function getClientIP(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const clientIP = getClientIP(req);

  // ── IP rate limit: 5 orders/hour ─────────────────────────────────────────
  const rateLimit = checkRateLimit(clientIP, "payment", "payment");
  if (!rateLimit.allowed) {
    return rateLimitExceededResponse(rateLimit.resetIn);
  }

  try {
    const body = await req.json();
    const {
      user_id,
      product_id,
      amount,
      currency = "USD",
      gateway,
      idempotency_key,
      device_fingerprint,
      user_country,
    } = body;

    if (!user_id || !amount || !currency || !gateway) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // ── Idempotency check ─────────────────────────────────────────────────
    if (idempotency_key) {
      const { data: existing } = await supabase
        .from("orders")
        .select("id, status")
        .eq("idempotency_key", idempotency_key)
        .maybeSingle();

      if (existing) {
        return new Response(
          JSON.stringify({ success: true, order: existing, duplicate: true }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    // ── Create the order ──────────────────────────────────────────────────
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const { data: order, error: insertError } = await supabase
      .from("orders")
      .insert({
        user_id,
        product_id: product_id ?? null,
        idempotency_key: idempotency_key ?? null,
        amount,
        currency,
        status: "pending",
        gateway,
        ip_address: clientIP,
        device_fingerprint: device_fingerprint ?? null,
        expires_at: expiresAt,
      })
      .select("id")
      .single();

    if (insertError) throw new Error(insertError.message);

    // ── Fraud detection (async, non-blocking for order creation) ─────────
    let riskScore = 0;
    let fraudFlagged = false;
    try {
      const fraudRes = await fetch(
        `${SUPABASE_URL}/functions/v1/fraud-detection-engine`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            order_id: order.id,
            user_id,
            amount,
            currency,
            ip_address: clientIP,
            user_country: user_country ?? null,
          }),
          signal: AbortSignal.timeout(10_000),
        },
      );
      const fraudData = await fraudRes.json();
      riskScore = fraudData.risk_score ?? 0;
      fraudFlagged = fraudData.flagged ?? false;
    } catch (e) {
      console.warn("[create-order] Fraud check failed (non-fatal):", (e as Error).message);
    }

    // ── Ledger entry ───────────────────────────────────────────────────────
    await supabase.rpc("append_payment_ledger", {
      p_event_type: "order_created",
      p_order_id: order.id,
      p_user_id: user_id,
      p_amount: amount,
      p_currency: currency,
      p_gateway: gateway,
      p_gateway_ref: null,
      p_event_data: {
        ip: clientIP,
        risk_score: riskScore,
        fraud_flagged: fraudFlagged,
        device_fingerprint: device_fingerprint ?? null,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        order_id: order.id,
        expires_at: expiresAt,
        risk_score: riskScore,
        fraud_flagged: fraudFlagged,
      }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[create-order]", (err as Error).message);
    return new Response(
      JSON.stringify({ success: false, error: "Order creation failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
