/**
 * process-payment Edge Function
 * Processes a payment via Flutterwave, Stripe, or PayU.
 * Amount is re-validated server-side as $249 USD before calling the gateway.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const FIXED_PRICE = 249;
const FIXED_CURRENCY = "USD";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid auth token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { orderId, gateway, customerName, customerEmail, redirectUrl } = body;

    if (!orderId || !gateway || !customerName || !customerEmail) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: orderId, gateway, customerName, customerEmail" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch order and re-validate amount server-side
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, amount, currency, status, user_id")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Backend enforcement: reject if amount is not exactly $249
    if (Number(order.amount) !== FIXED_PRICE) {
      console.error(`[process-payment] SECURITY: Order ${orderId} has invalid amount ${order.amount}`);
      return new Response(JSON.stringify({ error: "Invalid order amount" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (order.status !== "pending") {
      return new Response(JSON.stringify({ error: `Order is already ${order.status}` }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        order_id: orderId,
        amount: FIXED_PRICE,
        currency: FIXED_CURRENCY,
        gateway,
        status: "pending",
      })
      .select()
      .single();

    if (paymentError) {
      console.error("[process-payment] DB error creating payment:", paymentError);
      return new Response(JSON.stringify({ error: "Failed to create payment record" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build gateway-specific checkout payload
    let gatewayPayload: Record<string, unknown> = {};

    if (gateway === "flutterwave") {
      const flwPublicKey = Deno.env.get("FLUTTERWAVE_PUBLIC_KEY");
      if (!flwPublicKey) throw new Error("Flutterwave credentials not configured");
      gatewayPayload = {
        public_key: flwPublicKey,
        tx_ref: payment.id,
        amount: FIXED_PRICE,
        currency: FIXED_CURRENCY,
        customer: { email: customerEmail, name: customerName },
        customizations: { title: "SoftwareWala Purchase", description: `Order ${orderId}` },
        redirect_url: redirectUrl || `${Deno.env.get("APP_BASE_URL") || ""}/payment/success`,
      };
    } else if (gateway === "stripe") {
      gatewayPayload = {
        paymentId: payment.id,
        amount: FIXED_PRICE * 100, // Stripe uses cents
        currency: FIXED_CURRENCY.toLowerCase(),
        description: `Order ${orderId}`,
        customerEmail,
      };
    } else if (gateway === "payu") {
      gatewayPayload = {
        paymentId: payment.id,
        amount: String(FIXED_PRICE),
        currency: FIXED_CURRENCY,
        customerName,
        customerEmail,
        orderId,
      };
    }

    // Audit log
    await supabase.from("payment_audit_log").insert({
      event_type: "payment_initiated",
      order_id: orderId,
      payment_id: payment.id,
      details: { gateway, amount: FIXED_PRICE, currency: FIXED_CURRENCY },
    });

    console.log(`[process-payment] Payment ${payment.id} initiated via ${gateway} for order ${orderId}`);

    return new Response(
      JSON.stringify({ paymentId: payment.id, gateway, gatewayPayload }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[process-payment] Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
