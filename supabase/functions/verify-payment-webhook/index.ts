/**
 * verify-payment-webhook
 *
 * Receives and verifies webhooks from Flutterwave, Stripe, and PayU.
 * Only marks a payment as verified AFTER cryptographic signature checks pass.
 * Triggers license generation for verified successful payments.
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";
import {
  corsHeaders,
  errorResponse,
  jsonResponse,
  getSupabaseAdmin,
} from "../_shared/utils.ts";

const FLUTTERWAVE_SECRET_HASH = Deno.env.get("FLUTTERWAVE_SECRET_HASH") || "";
const STRIPE_WEBHOOK_SECRET    = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
const PAYU_SALT_KEY            = Deno.env.get("PAYU_SALT_KEY") || "";
const PAYU_MERCHANT_KEY        = Deno.env.get("PAYU_MERCHANT_KEY") || "";

// ─── Helper: hex-encode Uint8Array ─────────────────────────────────────────
function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ─── HMAC-SHA256 signature ───────────────────────────────────────────────────
async function hmacSha256(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return toHex(sig);
}

// ─── SHA-512 hash ────────────────────────────────────────────────────────────
async function sha512(data: string): Promise<string> {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-512", enc.encode(data));
  return toHex(buf);
}

// ─── Constant-time string compare ────────────────────────────────────────────
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// ─── Flutterwave verification ────────────────────────────────────────────────
function verifyFlutterwaveSignature(req: Request): boolean {
  const verifyHash = req.headers.get("verif-hash") || "";
  if (!FLUTTERWAVE_SECRET_HASH) return false;
  return safeEqual(verifyHash, FLUTTERWAVE_SECRET_HASH);
}

// ─── Stripe signature verification ──────────────────────────────────────────
async function verifyStripeSignature(
  rawBody: string,
  sigHeader: string,
): Promise<boolean> {
  if (!STRIPE_WEBHOOK_SECRET || !sigHeader) return false;

  // Parse Stripe-Signature header: t=timestamp,v1=hash
  const parts: Record<string, string> = {};
  for (const chunk of sigHeader.split(",")) {
    const [k, v] = chunk.split("=");
    parts[k] = v;
  }
  const timestamp = parts["t"];
  const v1 = parts["v1"];
  if (!timestamp || !v1) return false;

  // Reject events older than 5 minutes (replay-attack protection)
  const eventTime = parseInt(timestamp, 10) * 1000;
  if (Date.now() - eventTime > 5 * 60 * 1000) return false;

  const payload = `${timestamp}.${rawBody}`;
  const expected = await hmacSha256(STRIPE_WEBHOOK_SECRET, payload);
  return safeEqual(expected, v1);
}

// ─── PayU reverse-hash verification ─────────────────────────────────────────
async function verifyPayUSignature(payload: Record<string, string>): Promise<boolean> {
  if (!PAYU_SALT_KEY || !PAYU_MERCHANT_KEY) return false;

  const {
    txnid = "",
    amount = "",
    productinfo = "",
    firstname = "",
    email = "",
    status = "",
    hash = "",
    udf1 = "",
    udf2 = "",
    udf3 = "",
    udf4 = "",
    udf5 = "",
  } = payload;

  // Reverse hash: salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
  const hashStr = `${PAYU_SALT_KEY}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_MERCHANT_KEY}`;
  const expected = await sha512(hashStr);
  return safeEqual(expected, hash);
}

// ─── Update order + payment after verified webhook ───────────────────────────
async function finalizePayment(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  orderId: string,
  gatewayPaymentId: string,
  gateway: string,
  amount: number,
  currency: string,
  status: "success" | "failed",
  rawPayload: unknown,
  gatewayRef?: string,
) {
  const now = new Date().toISOString();

  // Upsert payment record
  const { data: payment, error: payErr } = await supabaseAdmin
    .from("payments")
    .upsert(
      {
        order_id: orderId,
        user_id: (
          await supabaseAdmin
            .from("orders")
            .select("user_id")
            .eq("id", orderId)
            .single()
        ).data?.user_id,
        gateway,
        gateway_payment_id: gatewayPaymentId,
        gateway_ref: gatewayRef,
        amount,
        currency,
        status,
        webhook_verified: true,
        webhook_payload: rawPayload,
        verified_at: now,
        updated_at: now,
      },
      { onConflict: "gateway,gateway_payment_id" },
    )
    .select()
    .single();

  if (payErr) {
    console.error("Payment upsert error:", payErr);
    return null;
  }

  // Update order status
  const orderStatus = status === "success" ? "completed" : "failed";
  await supabaseAdmin
    .from("orders")
    .update({ status: orderStatus, gateway_order_id: gatewayPaymentId, updated_at: now })
    .eq("id", orderId);

  return payment;
}

// ─── Main handler ────────────────────────────────────────────────────────────
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  const url = new URL(req.url);
  // Route: /verify-payment-webhook/{provider}
  const pathParts = url.pathname.split("/").filter(Boolean);
  const provider = pathParts[pathParts.length - 1]?.toLowerCase();

  const supabaseAdmin = getSupabaseAdmin();
  const rawBody = await req.text();

  try {
    if (provider === "flutterwave") {
      // ── Flutterwave ────────────────────────────────────────────────────────
      if (!verifyFlutterwaveSignature(req)) {
        console.warn("Flutterwave: invalid signature");
        return errorResponse("Invalid webhook signature", 401);
      }

      let payload: Record<string, unknown>;
      try {
        payload = JSON.parse(rawBody);
      } catch {
        return errorResponse("Invalid JSON", 400);
      }

      const event = payload as {
        event?: string;
        data?: {
          id?: number;
          tx_ref?: string;
          flw_ref?: string;
          amount?: number;
          currency?: string;
          status?: string;
          meta?: { order_id?: string };
        };
      };

      if (event.event !== "charge.completed") {
        return jsonResponse({ received: true }, 200);
      }

      const data = event.data || {};
      const orderId = data.meta?.order_id;
      if (!orderId) {
        return errorResponse("Missing order_id in webhook", 400);
      }

      const status = data.status === "successful" ? "success" : "failed";
      const payment = await finalizePayment(
        supabaseAdmin,
        orderId,
        String(data.id || ""),
        "flutterwave",
        Number(data.amount || 0),
        String(data.currency || "USD"),
        status as "success" | "failed",
        payload,
        data.flw_ref,
      );

      if (payment && status === "success") {
        await supabaseAdmin.from("payment_audit_logs").insert({
          order_id: orderId,
          payment_id: payment.id,
          user_id: payment.user_id,
          event_type: "flutterwave_webhook_verified",
          payload: { gateway_payment_id: data.id, flw_ref: data.flw_ref },
        });
      }

      return jsonResponse({ received: true }, 200);
    } else if (provider === "stripe") {
      // ── Stripe ─────────────────────────────────────────────────────────────
      const sigHeader = req.headers.get("stripe-signature") || "";
      const verified = await verifyStripeSignature(rawBody, sigHeader);
      if (!verified) {
        console.warn("Stripe: invalid signature");
        return errorResponse("Invalid webhook signature", 401);
      }

      let event: Record<string, unknown>;
      try {
        event = JSON.parse(rawBody);
      } catch {
        return errorResponse("Invalid JSON", 400);
      }

      const eventType = event.type as string;
      if (!["payment_intent.succeeded", "payment_intent.payment_failed"].includes(eventType)) {
        return jsonResponse({ received: true }, 200);
      }

      const pi = (event.object as Record<string, unknown>) ??
        ((event.data as Record<string, unknown>)?.object as Record<string, unknown>);

      const orderId = (pi?.metadata as Record<string, string>)?.order_id;
      if (!orderId) {
        return errorResponse("Missing order_id in payment intent metadata", 400);
      }

      const status = eventType === "payment_intent.succeeded" ? "success" : "failed";
      const amount = Number((pi?.amount as number) || 0) / 100; // Stripe uses cents
      const currency = String((pi?.currency as string) || "usd").toUpperCase();

      const payment = await finalizePayment(
        supabaseAdmin,
        orderId,
        String(pi?.id || ""),
        "stripe",
        amount,
        currency,
        status as "success" | "failed",
        event,
      );

      if (payment && status === "success") {
        await supabaseAdmin.from("payment_audit_logs").insert({
          order_id: orderId,
          payment_id: payment.id,
          user_id: payment.user_id,
          event_type: "stripe_webhook_verified",
          payload: { payment_intent_id: pi?.id },
        });
      }

      return jsonResponse({ received: true }, 200);
    } else if (provider === "payu") {
      // ── PayU ───────────────────────────────────────────────────────────────
      const formData: Record<string, string> = {};
      try {
        const fd = new URLSearchParams(rawBody);
        for (const [k, v] of fd.entries()) {
          formData[k] = v;
        }
      } catch {
        return errorResponse("Invalid form data", 400);
      }

      const valid = await verifyPayUSignature(formData);
      if (!valid) {
        console.warn("PayU: invalid signature");
        return errorResponse("Invalid webhook signature", 401);
      }

      const orderId = formData.udf3; // pass order_id in udf3
      if (!orderId) {
        return errorResponse("Missing order_id in PayU webhook (udf3)", 400);
      }

      const status = formData.status === "success" ? "success" : "failed";

      const payment = await finalizePayment(
        supabaseAdmin,
        orderId,
        formData.txnid || "",
        "payu",
        Number(formData.amount || 0),
        "INR",
        status as "success" | "failed",
        formData,
        formData.bank_ref_num,
      );

      if (payment && status === "success") {
        await supabaseAdmin.from("payment_audit_logs").insert({
          order_id: orderId,
          payment_id: payment.id,
          user_id: payment.user_id,
          event_type: "payu_webhook_verified",
          payload: { txnid: formData.txnid, bank_ref_num: formData.bank_ref_num },
        });
      }

      return jsonResponse({ received: true }, 200);
    } else {
      return errorResponse("Unknown payment provider", 400);
    }
  } catch (err) {
    console.error("verify-payment-webhook error:", err);
    return errorResponse("Internal server error", 500);
  }
});
