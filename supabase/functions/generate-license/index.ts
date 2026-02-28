/**
 * generate-license
 *
 * Generates a license key ONLY after webhook-verified payment.
 * Called internally (service role) or by admin — never directly by users
 * for unverified payments.
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";
import {
  corsHeaders,
  errorResponse,
  jsonResponse,
  getSupabaseAdmin,
  getSupabaseClient,
  getUserFromToken,
  validateTokenFormat,
  isValidUUID,
  checkRateLimit,
  rateLimitResponse,
  createAuditLog,
} from "../_shared/utils.ts";

function getClientIP(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

// Generate a secure, unique license key (5 groups of 8 hex chars = 160 bits entropy)
async function generateLicenseKey(
  orderId: string,
  applicationId: string,
  userId: string,
): Promise<string> {
  const entropy = `${orderId}:${applicationId}:${userId}:${Date.now()}`;
  const enc = new TextEncoder();
  const hashBuf = await crypto.subtle.digest("SHA-256", enc.encode(entropy));
  const hex = Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

  // Format: XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX (5 groups of 8 = 40 chars, 160 bits)
  return [
    hex.slice(0, 8),
    hex.slice(8, 16),
    hex.slice(16, 24),
    hex.slice(24, 32),
    hex.slice(32, 40),
  ].join("-");
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const clientIP = getClientIP(req);

  const rateCheck = checkRateLimit(clientIP, "sensitive_action");
  if (!rateCheck.allowed) {
    return rateLimitResponse(rateCheck.resetIn);
  }

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const tokenCheck = validateTokenFormat(authHeader);
    if (!tokenCheck.valid) {
      return errorResponse(tokenCheck.error || "Unauthorized", 401);
    }

    const supabaseClient = getSupabaseClient(authHeader);
    const supabaseAdmin = getSupabaseAdmin();

    const user = await getUserFromToken(supabaseClient);
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return errorResponse("Invalid JSON body", 400);
    }

    const { order_id, license_type } = body as {
      order_id?: string;
      license_type?: string;
    };

    if (!order_id || !isValidUUID(order_id)) {
      return errorResponse("Valid order_id is required", 400);
    }

    const validLicenseTypes = ["standard", "premium", "enterprise", "trial"];
    const licType = validLicenseTypes.includes(String(license_type || "standard"))
      ? String(license_type || "standard")
      : "standard";

    // Fetch the order (must belong to caller or caller is admin)
    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .select("id, user_id, application_id, status, amount_usd, currency")
      .eq("id", order_id)
      .maybeSingle();

    if (orderErr || !order) {
      return errorResponse("Order not found", 404);
    }

    // Only the order owner or admin can generate a license
    const isAdmin =
      user.role === "boss_owner" || user.role === "admin";
    if (order.user_id !== user.userId && !isAdmin) {
      return errorResponse("Forbidden", 403);
    }

    // CRITICAL: Order must be 'completed' (set by webhook handler only)
    if (order.status !== "completed") {
      return errorResponse(
        "License can only be generated for completed (webhook-verified) orders",
        400,
      );
    }

    // Fetch verified payment for this order
    const { data: payment, error: payErr } = await supabaseAdmin
      .from("payments")
      .select("id, webhook_verified, status")
      .eq("order_id", order_id)
      .eq("webhook_verified", true)
      .eq("status", "success")
      .maybeSingle();

    if (payErr || !payment) {
      return errorResponse(
        "No webhook-verified successful payment found for this order",
        400,
      );
    }

    // Check if license already exists for this order
    const { data: existingLicense } = await supabaseAdmin
      .from("licenses")
      .select("id, license_key, status")
      .eq("order_id", order_id)
      .maybeSingle();

    if (existingLicense) {
      return jsonResponse({ license: existingLicense }, 200);
    }

    // Generate license key
    const licenseKey = await generateLicenseKey(
      order_id,
      order.application_id,
      order.user_id,
    );

    // Persist license
    const { data: license, error: licErr } = await supabaseAdmin
      .from("licenses")
      .insert({
        order_id,
        payment_id: payment.id,
        user_id: order.user_id,
        application_id: order.application_id,
        license_key: licenseKey,
        license_type: licType,
        status: "active",
        max_activations: 1,
        activations: 0,
        valid_from: new Date().toISOString(),
        issued_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (licErr) {
      console.error("License insert error:", licErr);
      return errorResponse("Failed to generate license", 500);
    }

    // Audit log
    await createAuditLog(supabaseAdmin, user.userId, user.role, "marketplace", "license_generated", {
      order_id,
      license_id: license.id,
      application_id: order.application_id,
      ip: clientIP,
    });

    await supabaseAdmin.from("payment_audit_logs").insert({
      order_id,
      payment_id: payment.id,
      user_id: order.user_id,
      event_type: "license_generated",
      actor_id: user.userId,
      actor_role: user.role,
      ip_address: clientIP,
      payload: {
        license_id: license.id,
        license_type: licType,
      },
    });

    return jsonResponse({ license }, 201);
  } catch (err) {
    console.error("generate-license error:", err);
    return errorResponse("Internal server error", 500);
  }
});
