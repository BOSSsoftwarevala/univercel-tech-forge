import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

/**
 * create-order-on-payment
 *
 * - Accepts POST requests from payment webhook or server-side caller to create an order after payment.
 * - Optional HMAC verification: set WEBHOOK_SECRET env var and send the hex HMAC in the `x-webhook-signature` header.
 * - Provides idempotency by checking existing orders with the same payment_id.
 * - Validates amount against the product price (if available) to avoid tampering.
 * - Attempts basic rollback on partial failures (best-effort).
 *
 * Env expected:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - WEBHOOK_SECRET (optional, for HMAC verification)
 *
 * Note: Adjust table names/columns to match your schema if they differ.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-signature",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET") ?? "";

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/* Utility: compute HMAC-SHA256 as hex of message using Web Crypto */
async function computeHmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const keyData = enc.encode(secret);
  const msgData = enc.encode(message);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, msgData);
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  // Read raw body first to enable optional signature verification
  let bodyText: string;
  try {
    bodyText = await req.text();
  } catch (e) {
    console.error("[create-order] failed to read body:", e);
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Optional HMAC verification
  try {
    if (WEBHOOK_SECRET) {
      const sigHeader = req.headers.get("x-webhook-signature") || req.headers.get("x-signature");
      if (!sigHeader) {
        console.warn("[create-order] missing signature header");
        return new Response(
          JSON.stringify({ error: "Missing signature header" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const expected = await computeHmacHex(WEBHOOK_SECRET, bodyText);
      // Accept header either as raw hex or prefixed (e.g., sha256=...)
      const received = sigHeader.startsWith("sha256=") ? sigHeader.split("=", 2)[1] : sigHeader;
      if (!crypto.timingSafeEqual) {
        // Fallback compare (not timing safe) if env doesn't provide it — rarely the case in Deno
        if (expected !== received) {
          console.warn("[create-order] signature mismatch");
          return new Response(
            JSON.stringify({ error: "Invalid signature" }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } else {
        // timingSafeEqual requires Uint8Array
        const a = new TextEncoder().encode(expected);
        const b = new TextEncoder().encode(received);
        if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
          console.warn("[create-order] signature mismatch");
          return new Response(
            JSON.stringify({ error: "Invalid signature" }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }
  } catch (e) {
    console.error("[create-order] signature verification error:", e);
    return new Response(
      JSON.stringify({ error: "Signature verification failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Parse JSON body
  let body: any;
  try {
    body = bodyText ? JSON.parse(bodyText) : {};
  } catch (err) {
    console.error("[create-order] invalid JSON:", err);
    return new Response(
      JSON.stringify({ error: "Invalid JSON" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const {
    user_id,
    product_id,
    amount,
    currency = "INR",
    payment_id,
    buyer_name,
    buyer_email,
    license_type,
  } = body;

  if (!user_id || !product_id || !payment_id || typeof amount === "undefined") {
    return new Response(
      JSON.stringify({ error: "Missing required fields: user_id, product_id, amount, payment_id" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return new Response(
      JSON.stringify({ error: "Invalid amount" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Idempotency: return existing order if payment_id already processed
    const { data: existingOrders, error: existingErr } = await supabase
      .from("orders")
      .select("*")
      .eq("payment_id", payment_id)
      .limit(1);

    if (existingErr) {
      console.warn("[create-order] idempotency check error:", existingErr);
    } else if (existingOrders && existingOrders.length > 0) {
      const existing = existingOrders[0];
      return new Response(
        JSON.stringify({ success: true, order: existing, note: "idempotent: order already exists for this payment_id" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Optional: validate product & price (if product table and price exist)
    let productRow: any = null;
    try {
      const { data: prodData, error: prodErr } = await supabase
        .from("marketplace_products")
        .select("id, price, price_cents, currency")
        .eq("id", product_id)
        .limit(1)
        .single();

      if (!prodErr && prodData) productRow = prodData;

      if (productRow) {
        // If product has price_cents or price, validate roughly (allow small rounding diffs)
        const expectedCents = productRow.price_cents ?? (typeof productRow.price === "number" ? Math.round(productRow.price * 100) : null);
        if (expectedCents !== null) {
          const providedCents = Math.round(numericAmount * 100);
          if (Math.abs(providedCents - expectedCents) > 1) {
            console.warn("[create-order] amount mismatch vs product price", { providedCents, expectedCents });
            // Not returning error by default — change to error to be strict:
            return new Response(
              JSON.stringify({ error: "Amount does not match product price" }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }
      }
    } catch (e) {
      console.warn("[create-order] product price check failed:", e);
    }

    // Generate a unique order_number
    const orderNumber = `ORD-${Date.now()}-${crypto.randomUUID().replace(/-/g, "").substring(0, 9).toUpperCase()}`;

    // Insert order row
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id,
        product_id,
        amount: numericAmount,
        currency,
        payment_id,
        order_number: orderNumber,
        buyer_name: buyer_name ?? null,
        buyer_email: buyer_email ?? null,
        license_type: license_type ?? null,
        payment_status: "verified",
        status: "processing", // set to processing; later steps may set to completed
        is_verified: true,
        verified_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("[create-order] failed to insert order:", orderError);
      return new Response(
        JSON.stringify({ error: orderError?.message ?? "Failed to create order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate license key (idempotent if retry sees order with license_id later)
    const licenseKey = `LIC-${String(order.id).substring(0, 8).toUpperCase()}-${crypto.randomUUID().replace(/-/g, "").substring(0, 12).toUpperCase()}`;

    // Insert license
    let license: any = null;
    const expiry = license_type === "lifetime" ? null : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    try {
      const { data: licenseData, error: licenseError } = await supabase
        .from("licenses")
        .insert({
          order_id: order.id,
          user_id,
          product_id,
          license_key: licenseKey,
          license_type: license_type ?? "standard",
          is_lifetime: license_type === "lifetime",
          expiry_date: expiry,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (licenseError || !licenseData) {
        console.error("[create-order] license creation failed:", licenseError);
        // Attempt rollback of order (best-effort)
        await supabase.from("orders").delete().eq("id", order.id);
        return new Response(
          JSON.stringify({ error: licenseError?.message ?? "Failed to create license; order rolled back" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      license = licenseData;
    } catch (e) {
      console.error("[create-order] license creation exception:", e);
      // rollback order
      await supabase.from("orders").delete().eq("id", order.id);
      return new Response(
        JSON.stringify({ error: "License creation failed; order rolled back" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update order with license_id and mark completed
    try {
      const { error: updErr } = await supabase
        .from("orders")
        .update({ license_id: license.id, status: "completed", completed_at: new Date().toISOString() })
        .eq("id", order.id);

      if (updErr) {
        console.warn("[create-order] failed to update order with license_id:", updErr);
      }
    } catch (e) {
      console.warn("[create-order] update order error:", e);
    }

    // Log transaction
    try {
      await supabase.from("transactions").insert({
        type: "order_created",
        amount: Number(numericAmount),
        currency,
        status: "success",
        reference: order.order_number,
        related_user: user_id,
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn("[create-order] failed to log transaction:", e);
    }

    // Create notifications for boss panel users (best-effort)
    try {
      const { data: bossUsers } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "boss_owner");

      if (bossUsers && bossUsers.length > 0) {
        const notifications = bossUsers.map((bu: { user_id: string }) => ({
          user_id: bu.user_id,
          title: "New Order Created",
          message: `New order ${order.order_number} for ₹${numericAmount} from ${buyer_name ?? "customer"}`,
          type: "order_created",
          event_type: "order_created",
          action_id: order.id,
          is_read: false,
          created_at: new Date().toISOString(),
        }));

        await supabase.from("user_notifications").insert(notifications);
      }
    } catch (e) {
      console.warn("[create-order] notification insert failed:", e);
    }

    // Optionally: invoke any serverless function or webhook for downstream processing
    try {
      // If you have a Supabase Edge Function to dispatch webhooks or start pipelines, call it:
      // await supabase.functions.invoke('marketplace-webhook-dispatch', { body: JSON.stringify({ event_type: 'order_created', order_id: order.id }) });
    } catch (e) {
      console.warn("[create-order] downstream function invoke failed:", e);
    }

    // Success response
    return new Response(
      JSON.stringify({
        success: true,
        order,
        license: { license_key: licenseKey, ...license },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[create-order] Error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
