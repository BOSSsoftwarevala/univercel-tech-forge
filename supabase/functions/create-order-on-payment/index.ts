import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

/**
 * create-order-on-payment
 *
 * - Accepts POST requests from a payment webhook.
 * - Requires HMAC verification via the x-webhook-signature header.
 * - Confirms an existing marketplace order only after matching order_id, payment_id, and amount.
 * - Enqueues marketplace order processing after confirmation.
 *
 * Env expected:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - WEBHOOK_SECRET
 *
 * Note: This function does not create orders from webhook payloads.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-signature",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET") ?? "";
const VALA_FACTORY_INTERNAL_TOKEN = Deno.env.get("VALA_FACTORY_INTERNAL_TOKEN") ?? WEBHOOK_SECRET;

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

function timingSafeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
}

function isSuccessStatus(status: string) {
  return ['success', 'succeeded', 'completed', 'confirmed', 'paid'].includes(status.toLowerCase());
}

function amountsMatch(left: number, right: number) {
  return Math.abs(left - right) < 0.01;
}

function normalizeFactoryModule(value: unknown) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);
}

function inferFactorySystemType(product: Record<string, any>) {
  const haystack = `${String(product.product_type || "")} ${String(product.category || "")} ${String(product.description || "")}`.toLowerCase();
  if (haystack.includes("school")) return "school";
  if (haystack.includes("hospital") || haystack.includes("clinic")) return "hospital";
  if (haystack.includes("transport") || haystack.includes("fleet")) return "transport";
  if (haystack.includes("marketplace") || haystack.includes("commerce")) return "marketplace";
  if (haystack.includes("crm")) return "crm";
  if (haystack.includes("erp")) return "erp";
  return normalizeFactoryModule(product.product_type) || "custom";
}

function inferFactoryModules(product: Record<string, any>) {
  const features = Array.isArray(product.features_json) ? product.features_json : [];
  const mappedFeatures = features
    .map((feature) => normalizeFactoryModule(typeof feature === "string" ? feature : feature?.name || feature?.title || ""))
    .filter(Boolean);
  return Array.from(new Set([
    "auth_core",
    "dashboard",
    ...mappedFeatures,
    normalizeFactoryModule(product.category),
    normalizeFactoryModule(product.product_type),
  ].filter(Boolean)));
}

async function activateValaFactoryProject(payload: Record<string, unknown>) {
  if (!VALA_FACTORY_INTERNAL_TOKEN) {
    return { skipped: true, reason: "missing_internal_token" };
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/api-vala-factory/marketplace/activate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-vala-internal-token": VALA_FACTORY_INTERNAL_TOKEN,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(typeof data?.error === "string" ? data.error : "VALA factory activation failed");
  }

  return data;
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

  // Mandatory HMAC verification
  try {
    if (!WEBHOOK_SECRET) {
      return new Response(
        JSON.stringify({ error: 'Webhook secret is not configured' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sigHeader = req.headers.get("x-webhook-signature") || req.headers.get("x-signature");
    if (!sigHeader) {
      console.warn("[create-order] missing signature header");
      return new Response(
        JSON.stringify({ error: "Missing signature header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const expected = await computeHmacHex(WEBHOOK_SECRET, bodyText);
    const received = sigHeader.startsWith("sha256=") ? sigHeader.split("=", 2)[1] : sigHeader;
    if (!timingSafeEqual(expected, received)) {
      console.warn("[create-order] signature mismatch");
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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

  const orderId = String(body.order_id ?? '').trim();
  const paymentId = String(body.payment_id ?? '').trim();
  const providerOrderId = String(body.provider_order_id ?? body.order_reference ?? '').trim();
  const status = String(body.status ?? '').trim();
  const amount = Number(body.amount);

  if (!orderId || !paymentId || typeof amount === 'undefined' || !status) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: order_id, payment_id, amount, status' }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return new Response(
      JSON.stringify({ error: "Invalid amount" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (!isSuccessStatus(status)) {
    return new Response(
      JSON.stringify({ error: 'Payment status is not successful' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { data: order, error: orderError } = await supabase
      .from('marketplace_orders')
      .select('id, buyer_user_id, buyer_role, product_id, order_number, final_amount, payment_status, order_status, external_reference, payment_id, metadata')
      .eq('id', orderId)
      .maybeSingle();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: 'Marketplace order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (order.payment_id && order.payment_id === paymentId && String(order.payment_status || '').toLowerCase() === 'confirmed') {
      return new Response(
        JSON.stringify({ success: true, order_id: order.id, idempotent: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!amountsMatch(Number(order.final_amount), amount)) {
      return new Response(
        JSON.stringify({ error: 'Amount does not match order total' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (providerOrderId && order.external_reference && order.external_reference !== providerOrderId) {
      return new Response(
        JSON.stringify({ error: 'Provider order reference mismatch' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const nextMetadata = {
      ...(order.metadata && typeof order.metadata === 'object' ? order.metadata : {}),
      webhook_verified_at: new Date().toISOString(),
      webhook_status: status,
    };

    const { error: updateError } = await supabase
      .from('marketplace_orders')
      .update({
        payment_status: 'confirmed',
        order_status: 'confirmed',
        payment_id: paymentId,
        external_reference: providerOrderId || order.external_reference || paymentId,
        metadata: nextMetadata,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id)
      .or('payment_status.eq.pending_verification,payment_status.eq.pending,payment_status.eq.confirmed');

    if (updateError) {
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await supabase.from('marketplace_order_events').insert({
      order_id: order.id,
      event_type: 'payment_verified',
      event_status: 'confirmed',
      payload: {
        payment_id: paymentId,
        provider_order_id: providerOrderId || null,
        amount,
        status,
      },
    });

    const { data: existingQueue } = await supabase
      .from('order_processing_queue')
      .select('id')
      .eq('order_id', order.id)
      .limit(1);

    if (!existingQueue || existingQueue.length === 0) {
      const now = new Date().toISOString();
      await supabase.from('order_processing_queue').insert([
        {
          order_id: order.id,
          step_name: 'payment_confirmed',
          step_order: 1,
          status: 'completed',
          started_at: now,
          completed_at: now,
          metadata: { payment_id: paymentId },
        },
        {
          order_id: order.id,
          step_name: 'license_generated',
          step_order: 2,
          status: 'pending',
          metadata: {},
        },
        {
          order_id: order.id,
          step_name: 'notification_sent',
          step_order: 3,
          status: 'pending',
          metadata: {},
        },
      ]);
    }

    let licenseKey: string | null = null;
    const { data: existingLicense } = await supabase
      .from('marketplace_licenses')
      .select('id, license_key')
      .eq('order_id', order.id)
      .maybeSingle();

    if (existingLicense) {
      licenseKey = existingLicense.license_key;
    } else {
      const { data: generatedLicenseKey } = await supabase.rpc('generate_marketplace_license_key');
      const { data: createdLicense, error: licenseError } = await supabase
        .from('marketplace_licenses')
        .insert({
          order_id: order.id,
          buyer_user_id: order.buyer_user_id,
          product_id: order.product_id,
          license_key: generatedLicenseKey,
          metadata: {
            payment_id: paymentId,
            domain_lock: order.metadata?.domain_lock || null,
          },
        })
        .select('license_key')
        .single();

      if (licenseError) {
        return new Response(
          JSON.stringify({ error: licenseError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      licenseKey = createdLicense?.license_key || generatedLicenseKey;
      await supabase.from('marketplace_order_events').insert({
        order_id: order.id,
        event_type: 'license_generated',
        event_status: 'active',
        payload: { license_key: licenseKey },
      });
    }

    await supabase.from('transactions').insert({
      type: 'marketplace_purchase',
      amount: Number(order.final_amount),
      reference: order.order_number,
      related_user: order.buyer_user_id,
      related_role: order.buyer_role,
      status: 'success',
    });

    const { data: sourceProduct } = await supabase
      .from('products')
      .select('product_id, product_name, product_type, category, description, tech_stack, features_json')
      .eq('product_id', order.product_id)
      .maybeSingle();

    let valaActivation: Record<string, any> | null = null;
    let valaActivationError: string | null = null;
    if (sourceProduct) {
      try {
        valaActivation = await activateValaFactoryProject({
          user_id: order.buyer_user_id,
          order_id: order.id,
          product_id: order.product_id,
          license_key: licenseKey,
          domain_lock: order.metadata?.domain_lock || null,
          system_type: inferFactorySystemType(sourceProduct),
          modules: inferFactoryModules(sourceProduct),
          pricing: { amount: Number(order.final_amount), currency: 'INR' },
          target_platform: String(sourceProduct.tech_stack || '').toLowerCase().includes('android') ? 'apk' : 'web',
          build_type: String(sourceProduct.tech_stack || '').toLowerCase().includes('android') ? 'apk-release' : 'pwa',
        });
      } catch (factoryError) {
        valaActivationError = factoryError instanceof Error ? factoryError.message : String(factoryError);
      }

      const nextOrderMetadata = {
        ...(nextMetadata || {}),
        vala_factory_project_id: valaActivation?.project?.id || null,
        vala_factory_product_id: valaActivation?.product?.id || null,
        vala_factory_license_id: valaActivation?.license?.id || null,
        vala_factory_error: valaActivationError,
      };

      await supabase
        .from('marketplace_orders')
        .update({ metadata: nextOrderMetadata, updated_at: new Date().toISOString() })
        .eq('id', order.id);

      await supabase
        .from('marketplace_licenses')
        .update({
          metadata: {
            payment_id: paymentId,
            domain_lock: order.metadata?.domain_lock || null,
            vala_factory_project_id: valaActivation?.project?.id || null,
            vala_factory_product_id: valaActivation?.product?.id || null,
          },
        })
        .eq('order_id', order.id);
    }

    await supabase.from('user_notifications').insert([
      {
        user_id: order.buyer_user_id,
        type: 'success',
        message: `Purchase successful for order ${order.order_number}.`,
        event_type: 'purchase_success',
        action_label: 'Open dashboard',
        action_url: '/user-dashboard',
        role_target: [String(order.buyer_role)],
      },
      ...(valaActivation?.project?.id ? [{
        user_id: order.buyer_user_id,
        type: 'info',
        message: `VALA AI Builder activated for ${sourceProduct?.product_name || order.order_number}.`,
        event_type: 'vala_builder_activated',
        action_label: 'Open VALA Builder',
        action_url: `/vala-builder?project=${valaActivation.project.id}`,
        role_target: [String(order.buyer_role)],
      }] : []),
    ]);

    const { data: bossUsers } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'boss_owner');

    if (bossUsers && bossUsers.length > 0) {
      await supabase.from('user_notifications').insert(
        bossUsers.map((entry: { user_id: string }) => ({
          user_id: entry.user_id,
          type: 'info',
          message: `New marketplace order ${order.order_number} confirmed.`,
          event_type: 'new_order',
          action_label: 'Review order',
          action_url: '/boss-panel',
          role_target: ['boss_owner'],
          is_buzzer: true,
        })),
      );
    }

    await supabase
      .from('marketplace_orders')
      .update({
        order_status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);

    await supabase.from('marketplace_order_events').insert([
      {
        order_id: order.id,
        event_type: 'transaction_recorded',
        event_status: 'success',
        payload: { payment_id: paymentId },
      },
      {
        order_id: order.id,
        event_type: 'notification_sent',
        event_status: 'success',
        payload: { buyer_user_id: order.buyer_user_id },
      },
      {
        order_id: order.id,
        event_type: 'order_completed',
        event_status: 'completed',
        payload: { license_key: licenseKey },
      },
      ...(valaActivation?.project?.id ? [{
        order_id: order.id,
        event_type: 'vala_builder_activated',
        event_status: 'ready',
        payload: {
          factory_project_id: valaActivation.project.id,
          factory_product_id: valaActivation?.product?.id || null,
        },
      }] : []),
      ...(valaActivationError ? [{
        order_id: order.id,
        event_type: 'vala_builder_activation_failed',
        event_status: 'retry_required',
        payload: { error: valaActivationError },
      }] : []),
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        order_id: order.id,
        payment_id: paymentId,
        order_status: 'completed',
        license_key: licenseKey,
        vala_factory_project_id: valaActivation?.project?.id || null,
        vala_factory_product_id: valaActivation?.product?.id || null,
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
