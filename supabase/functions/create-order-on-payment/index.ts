import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const {
      user_id,
      product_id,
      amount,
      payment_id,
      buyer_name,
      buyer_email,
      license_type,
    } = await req.json();

    if (!user_id || !product_id || !amount || !payment_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id,
        product_id,
        amount,
        payment_id,
        order_number: orderNumber,
        buyer_name,
        buyer_email,
        license_type,
        payment_status: "verified",
        status: "completed",
        is_verified: true,
        verified_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Generate license key
    const licenseKey = `LIC-${order.id.substring(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    // Create license
    const { data: license, error: licenseError } = await supabase
      .from("licenses")
      .insert({
        order_id: order.id,
        user_id,
        product_id,
        license_key: licenseKey,
        license_type: license_type || "standard",
        is_lifetime: license_type === "lifetime",
        expiry_date: license_type === "lifetime"
          ? null
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (licenseError) throw licenseError;

    // Update order with license_id
    await supabase
      .from("orders")
      .update({ license_id: license.id })
      .eq("id", order.id);

    // Log transaction using existing transactions schema
    await supabase.from("transactions").insert({
      type: "order_created",
      amount: Number(amount),
      status: "success",
      reference: order.order_number,
      related_user: user_id,
    });

    // Create notification for boss panel users
    const { data: bossUsers } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "boss_owner");

    if (bossUsers && bossUsers.length > 0) {
      const notifications = bossUsers.map((bu: { user_id: string }) => ({
        user_id: bu.user_id,
        title: "New Order Created",
        message: `New order ${order.order_number} for ₹${amount} from ${buyer_name}`,
        type: "order_created",
        event_type: "order_created",
        action_id: order.id,
        is_read: false,
      }));

      await supabase.from("user_notifications").insert(notifications);
    }

    return new Response(
      JSON.stringify({
        success: true,
        order,
        license: { license_key: licenseKey, ...license },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
