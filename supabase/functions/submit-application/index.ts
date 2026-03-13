/**
 * submit-application
 *
 * Handles marketplace application form submissions.
 * Validates input, persists the application request, and notifies boss/admin.
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  corsHeaders,
  errorResponse,
  jsonResponse,
  getSupabaseAdmin,
  getSupabaseClient,
  getUserFromToken,
  validateTokenFormat,
  sanitizeInput,
  checkRateLimit,
  rateLimitResponse,
  createAuditLog,
  createBuzzerAlert,
} from "../_shared/utils.ts";

function getClientIP(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
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

    const { name, description, category, price_usd, currency } = body as {
      name?: string;
      description?: string;
      category?: string;
      price_usd?: number;
      currency?: string;
    };

    // Validate required fields
    if (!name || typeof name !== "string" || !name.trim()) {
      return errorResponse("Application name is required", 400);
    }
    if (!category || typeof category !== "string" || !category.trim()) {
      return errorResponse("Category is required", 400);
    }
    if (price_usd === undefined || price_usd === null) {
      return errorResponse("price_usd is required", 400);
    }
    const parsedPrice = Number(price_usd);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return errorResponse("price_usd must be a non-negative number", 400);
    }

    const safeName = sanitizeInput(String(name)).slice(0, 200);
    const safeDescription = description
      ? sanitizeInput(String(description)).slice(0, 2000)
      : null;
    const safeCategory = sanitizeInput(String(category)).slice(0, 100);
    const safeCurrency = currency
      ? sanitizeInput(String(currency)).slice(0, 10).toUpperCase()
      : "USD";

    // Generate a URL-safe slug from the name
    const slug =
      safeName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") +
      "-" +
      Date.now();

    const { data: application, error: appErr } = await supabaseAdmin
      .from("marketplace_applications")
      .insert({
        name: safeName,
        slug,
        description: safeDescription,
        category: safeCategory,
        price_usd: parsedPrice,
        currency: safeCurrency,
        is_active: false, // Requires boss approval before going live
        created_by: user.userId,
        metadata: {
          submitted_by_role: user.role,
          submitted_from_ip: clientIP,
        },
      })
      .select()
      .single();

    if (appErr) {
      console.error("Application submission error:", appErr);
      return errorResponse("Failed to submit application", 500);
    }

    // Notify boss/owner via buzzer
    await createBuzzerAlert(
      supabaseAdmin,
      "marketplace_application_submitted",
      "boss_owner",
      null,
      null,
      "high",
    );

    // Also create a system event for the boss panel pipeline
    await supabaseAdmin.from("system_events").insert({
      event_type: "marketplace_application_submitted",
      source_role: user.role,
      source_user_id: user.userId,
      payload: {
        application_id: application.id,
        name: safeName,
        category: safeCategory,
        price_usd: parsedPrice,
      },
      status: "PENDING",
    });

    // Audit log
    await createAuditLog(
      supabaseAdmin,
      user.userId,
      user.role,
      "marketplace",
      "application_submitted",
      {
        application_id: application.id,
        name: safeName,
        category: safeCategory,
        ip: clientIP,
      },
    );

    return jsonResponse({ application }, 201);
  } catch (err) {
    console.error("submit-application error:", err);
    return errorResponse("Internal server error", 500);
  }
});
