// =============================================================================
// generate-license — Backend-Only License Generation Edge Function
//
// Generates a software license key ONLY after a payment has been:
//  1. Successfully processed (payment.status = 'completed')
//  2. Double-verified against the gateway API (payment.verified = true)
//
// License generation is strictly backend-only:
//  - Uses service_role key
//  - Validates payment existence and verification before issuing
//  - Writes to immutable ledger
//  - Returns masked license key in non-admin responses
// =============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

/** Generate a cryptographically random license key: XXXX-XXXX-XXXX-XXXX */
function generateLicenseKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const segment = (): string => {
    const arr = new Uint8Array(4);
    crypto.getRandomValues(arr);
    return Array.from(arr)
      .map((b) => chars[b % chars.length])
      .join("");
  };
  return `${segment()}-${segment()}-${segment()}-${segment()}`;
}

/** Mask license key for non-admin display: ****-****-****-ABCD */
function maskLicenseKey(key: string): string {
  const parts = key.split("-");
  if (parts.length !== 4) return "****-****-****-????";
  return `****-****-****-${parts[3]}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // This endpoint must only be called from backend (service_role JWT)
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { payment_id, order_id, user_id, product_id } = await req.json();

    if (!payment_id || !order_id || !user_id) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // ── 1. Verify payment exists, is completed, and double-verified ───────
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("id, status, verified, amount, currency, gateway, gateway_ref")
      .eq("id", payment_id)
      .eq("order_id", order_id)
      .single();

    if (paymentError || !payment) {
      return new Response(
        JSON.stringify({ success: false, error: "Payment not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (payment.status !== "completed") {
      return new Response(
        JSON.stringify({ success: false, error: "Payment not completed" }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!payment.verified) {
      return new Response(
        JSON.stringify({ success: false, error: "Payment not verified by gateway" }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── 2. Check no license already issued for this payment ───────────────
    const { data: existing } = await supabase
      .from("licenses")
      .select("id, license_key")
      .eq("payment_id", payment_id)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({
          success: true,
          license_key_masked: maskLicenseKey(existing.license_key),
          duplicate: true,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── 3. Generate and store license ─────────────────────────────────────
    const licenseKey = generateLicenseKey();

    const { data: license, error: licenseError } = await supabase
      .from("licenses")
      .insert({
        payment_id,
        order_id,
        user_id,
        product_id: product_id ?? null,
        license_key: licenseKey,
        status: "active",
      })
      .select("id")
      .single();

    if (licenseError) throw new Error(licenseError.message);

    // ── 4. Update order status ─────────────────────────────────────────────
    await supabase
      .from("orders")
      .update({ status: "fulfilled", updated_at: new Date().toISOString() })
      .eq("id", order_id);

    // ── 5. Ledger entry ────────────────────────────────────────────────────
    await supabase.rpc("append_payment_ledger", {
      p_event_type: "license_generated",
      p_order_id: order_id,
      p_user_id: user_id,
      p_amount: payment.amount,
      p_currency: payment.currency,
      p_gateway: payment.gateway,
      p_gateway_ref: payment.gateway_ref,
      p_event_data: { license_id: license.id },
    });

    return new Response(
      JSON.stringify({
        success: true,
        license_id: license.id,
        // Return full key here — caller (internal service) will decide what to show user
        license_key: licenseKey,
        license_key_masked: maskLicenseKey(licenseKey),
      }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[generate-license]", (err as Error).message);
    return new Response(
      JSON.stringify({ success: false, error: "License generation failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
