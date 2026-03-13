// =============================================================================
// webhook-replay-handler — Deduplication & Anti-Replay Edge Function
//
// Receives payment webhook events and checks the webhook_replay_cache table
// before processing.  Duplicate gateway_refs are silently acknowledged
// (idempotent response) without reprocessing.
//
// Also enforces:
//  - HMAC-SHA256 signature verification
//  - Timestamp freshness check (reject if > 5 minutes old)
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

// Maximum age of a webhook event we accept (5 minutes)
const MAX_WEBHOOK_AGE_MS = 5 * 60 * 1000;

async function hmacSha256(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Verify a PayPal webhook signature using HMAC-SHA256 on the raw body. */
async function verifyWebhookSignature(
  rawBody: string,
  receivedSig: string | null,
  webhookSecret: string,
): Promise<boolean> {
  if (!receivedSig) return false;
  const expected = await hmacSha256(rawBody, webhookSecret);
  return timingSafeEqual(expected, receivedSig.toLowerCase());
}

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
  const rateLimit = checkRateLimit(clientIP, "payment", "payment");
  if (!rateLimit.allowed) return rateLimitExceededResponse(rateLimit.resetIn);

  const rawBody = await req.text();

  try {
    const payload = JSON.parse(rawBody);

    // ── Determine gateway from header or payload ──────────────────────────
    const gateway = (req.headers.get("x-gateway") ?? payload.gateway ?? "unknown").toLowerCase();

    // ── Signature verification ─────────────────────────────────────────────
    const webhookSecretKey = gateway === "paypal"
      ? "WEBHOOK_PAYPAL_SECRET"
      : gateway === "payu"
      ? "WEBHOOK_PAYU_SECRET"
      : "WEBHOOK_STRIPE_SECRET";

    const webhookSecret = Deno.env.get(webhookSecretKey);
    if (webhookSecret) {
      const receivedSig =
        req.headers.get("paypal-transmission-sig") ||
        req.headers.get("x-webhook-signature") ||
        req.headers.get("stripe-signature");

      const valid = await verifyWebhookSignature(rawBody, receivedSig, webhookSecret);
      if (!valid) {
        console.warn(`[webhook-replay-handler] Signature verification failed for gateway: ${gateway}`);
        return new Response(JSON.stringify({ error: "Invalid webhook signature" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ── Timestamp freshness ────────────────────────────────────────────────
    const eventTimestamp =
      payload.create_time || payload.event_time || payload.created_at || payload.timestamp;
    if (eventTimestamp) {
      const age = Date.now() - new Date(eventTimestamp).getTime();
      if (age > MAX_WEBHOOK_AGE_MS) {
        console.warn(`[webhook-replay-handler] Stale webhook rejected (age: ${age}ms)`);
        return new Response(JSON.stringify({ error: "Webhook event too old" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ── Extract gateway reference ──────────────────────────────────────────
    const gatewayRef =
      payload.id ||
      payload.transaction_id ||
      payload.txnid ||
      payload.gateway_ref;

    if (!gatewayRef) {
      return new Response(JSON.stringify({ error: "Missing gateway reference" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // ── Replay cache check ─────────────────────────────────────────────────
    const { data: cached } = await supabase
      .from("webhook_replay_cache")
      .select("id")
      .eq("gateway_ref", gatewayRef)
      .maybeSingle();

    if (cached) {
      // Duplicate — acknowledge without re-processing
      console.log(`[webhook-replay-handler] Duplicate webhook ignored: ${gatewayRef}`);
      return new Response(JSON.stringify({ success: true, duplicate: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Mark as processed in replay cache ─────────────────────────────────
    await supabase.from("webhook_replay_cache").insert({
      gateway_ref: gatewayRef,
      gateway,
    });

    // ── Append to immutable ledger ─────────────────────────────────────────
    await supabase.rpc("append_payment_ledger", {
      p_event_type: "webhook_received",
      p_order_id: payload.order_id ?? null,
      p_user_id: null,
      p_amount: parseFloat(
        payload.amount?.value ?? payload.amount ?? payload.txn_amount ?? "0",
      ),
      p_currency: payload.amount?.currency_code ?? payload.currency ?? "USD",
      p_gateway: gateway,
      p_gateway_ref: gatewayRef,
      p_event_data: { ip: clientIP, event_type: payload.event_type ?? "unknown" },
    });

    return new Response(JSON.stringify({ success: true, gateway_ref: gatewayRef }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[webhook-replay-handler]", (err as Error).message);
    return new Response(
      JSON.stringify({ success: false, error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
