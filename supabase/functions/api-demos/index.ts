import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  jsonResponse,
  errorResponse,
  validateRequired,
  createAuditLog,
  createBuzzerAlert,
  corsHeaders,
  getSupabaseAdmin,
  isValidUUID,
} from "../_shared/utils.ts";
import { withAuth, withPublic, RequestContext } from "../_shared/middleware.ts";

// Generate masked ID based on user type (7-digit for prime, 8-digit for common)
function generateMaskedId(isPrime: boolean): string {
  const digits = isPrime ? 7 : 8;
  const prefix = isPrime ? "P" : "C";
  const randomPart = Math.floor(Math.random() * Math.pow(10, digits - 1))
    .toString()
    .padStart(digits - 1, "0");
  return `${prefix}${randomPart}`;
}

// Detect region from various sources
function detectRegion(req: Request, body: any): string {
  // 1. Check explicit region in body
  if (body?.region && typeof body.region === "string") {
    return body.region.toUpperCase().slice(0, 2);
  }
  
  // 2. Check CF-IPCountry header (Cloudflare)
  const cfCountry = req.headers.get("cf-ipcountry");
  if (cfCountry) return cfCountry.toUpperCase();
  
  // 3. Check X-Country header
  const xCountry = req.headers.get("x-country");
  if (xCountry) return xCountry.toUpperCase();
  
  // 4. Check Accept-Language for locale hints
  const acceptLang = req.headers.get("accept-language");
  if (acceptLang) {
    const match = acceptLang.match(/[a-z]{2}-([A-Z]{2})/);
    if (match) return match[1];
  }
  
  // 5. Default fallback
  return "IN";
}

// Detect language from request
function detectLanguage(req: Request, body: any): string {
  if (body?.language && typeof body.language === "string") {
    return body.language.toLowerCase().slice(0, 2);
  }
  
  const acceptLang = req.headers.get("accept-language");
  if (acceptLang) {
    const primaryLang = acceptLang.split(",")[0].split("-")[0].toLowerCase();
    return primaryLang || "en";
  }
  
  return "en";
}

// Currency mapping by region
const REGION_CURRENCY: Record<string, string> = {
  IN: "INR", US: "USD", GB: "GBP", EU: "EUR", AE: "AED",
  SA: "SAR", SG: "SGD", AU: "AUD", CA: "CAD", JP: "JPY",
  CN: "CNY", NG: "NGN", KE: "KES", ZA: "ZAR", BR: "BRL",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace("/api-demos", "");

  // ============ PUBLIC ENDPOINTS (No Auth Required) ============

  // GET /demos/public - Public demo listing (no login required)
  if (path === "/public" && req.method === "GET") {
    return withPublic(req, async ({ supabaseAdmin, body, clientIP }) => {
      const urlParams = new URL(req.url);
      const category = urlParams.searchParams.get("category");
      const limit = Math.min(100, parseInt(urlParams.searchParams.get("limit") || "50"));
      
      // Detect region for routing
      const region = detectRegion(req, body);
      const language = detectLanguage(req, body);
      const currency = REGION_CURRENCY[region] || "USD";

      let query = supabaseAdmin
        .from("demos")
        .select("id, title, category, description, tech_stack, status, health_score, created_at")
        .eq("status", "active");

      if (category) query = query.eq("category", category);

      const { data, error } = await query.order("created_at", { ascending: false }).limit(limit);

      if (error) return errorResponse(error.message, 400);

      // Return demos without real URLs (masked for public)
      const demos = data?.map((d: any) => ({
        id: d.id,
        title: d.title,
        category: d.category,
        description: d.description,
        tech_stack: d.tech_stack,
        status: d.status,
        health_score: d.health_score,
        preview_url: `/demo/preview/${d.id}`,
        created_at: d.created_at,
      })) || [];

      return jsonResponse({
        demos,
        region: { code: region, currency, language },
        total: demos.length,
      });
    }, { module: "demos", action: "public_list" });
  }

  // GET /demos/preview/:id - Public demo preview (no login required)
  if (path.startsWith("/preview/") && req.method === "GET") {
    const demoId = path.replace("/preview/", "");
    
    return withPublic(req, async ({ supabaseAdmin, clientIP, deviceId }) => {
      if (!isValidUUID(demoId)) {
        return errorResponse("Invalid demo ID", 400);
      }

      const { data: demo, error } = await supabaseAdmin
        .from("demos")
        .select("id, title, category, description, tech_stack, status, masked_url")
        .eq("id", demoId)
        .eq("status", "active")
        .single();

      if (error || !demo) {
        return errorResponse("Demo not found", 404);
      }

      // Log anonymous view
      await supabaseAdmin.from("demo_clicks").insert({
        demo_id: demoId,
        ip_address: clientIP,
        device_type: "unknown",
        browser: "unknown",
        session_duration: 0,
        converted: false,
      });

      return jsonResponse({
        demo: {
          id: demo.id,
          title: demo.title,
          category: demo.category,
          description: demo.description,
          tech_stack: demo.tech_stack,
          preview_url: demo.masked_url || null,
        },
        requires_login_for: ["save_progress", "contact_request", "purchase"],
      });
    }, { module: "demos", action: "preview" });
  }

  // ============ AUTHENTICATED ENDPOINTS ============

  // POST /demos/create
  if (path === "/create" && req.method === "POST") {
    return withAuth(req, ["super_admin", "admin", "demo_manager", "product_manager"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["title", "category", "url"]);
      if (validation) return errorResponse(validation);

      const { data, error } = await supabaseAdmin.from("demos").insert({
        title: body.title,
        category: body.category,
        url: body.url,
        description: body.description,
        tech_stack: body.tech_stack || "other",
        status: "active",
        created_by: user.userId,
      }).select().single();

      if (error) return errorResponse(error.message, 400);

      await createAuditLog(supabaseAdmin, user.userId, user.role, "demos", "create", {
        demo_id: data.id,
        title: body.title,
        category: body.category,
      });

      return jsonResponse({
        message: "Demo created",
        demo_id: data.id,
      }, 201);
    }, { module: "demos", action: "create" });
  }

  // PUT /demos/assign
  if (path === "/assign" && req.method === "PUT") {
    return withAuth(req, ["super_admin", "admin", "demo_manager", "franchise"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["demo_id", "assigned_to"]);
      if (validation) return errorResponse(validation);

      if (!isValidUUID(body.demo_id)) {
        return errorResponse("Invalid demo ID");
      }

      // Create rental link
      const maskedUrl = `https://demo.softwarevala.com/v/${Date.now().toString(36)}`;
      
      const { data: rental, error } = await supabaseAdmin.from("demo_rental_links").insert({
        demo_id: body.demo_id,
        requester_id: user.userId,
        requester_role: user.role,
        real_url: body.real_url || "",
        masked_url: maskedUrl,
        expires_at: body.expires_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        max_views: body.max_views || 100,
        status: "approved",
        approved_by: user.userId,
        approved_at: new Date().toISOString(),
      }).select().single();

      if (error) return errorResponse(error.message, 400);

      return jsonResponse({
        message: "Demo assigned",
        rental_id: rental.id,
        masked_url: maskedUrl,
        expires_at: rental.expires_at,
      });
    }, { module: "demos", action: "assign" });
  }

  // POST /demos/log (click tracking with masked ID)
  if (path === "/log" && req.method === "POST") {
    return withAuth(req, [], async ({ supabaseAdmin, body, user, clientIP }) => {
      const validation = validateRequired(body, ["demo_id"]);
      if (validation) return errorResponse(validation);

      if (!isValidUUID(body.demo_id)) {
        return errorResponse("Invalid demo ID");
      }

      // Determine if prime user (7-digit) or common user (8-digit)
      const isPrime = user.role === "prime";
      const maskedUserId = generateMaskedId(isPrime);

      // Log click with masked ID (no personal info)
      await supabaseAdmin.from("demo_clicks").insert({
        demo_id: body.demo_id,
        user_id: user.userId,
        user_role: user.role,
        ip_address: clientIP,
        device_type: body.device_type || "unknown",
        browser: body.browser || "unknown",
        referrer: body.referrer,
        session_duration: body.session_duration || 0,
        converted: body.converted || false,
        region: body.region,
        country: body.country,
      });

      // Update rental link views if applicable
      if (body.rental_id && isValidUUID(body.rental_id)) {
        await supabaseAdmin.rpc("increment_demo_views", { rental_id: body.rental_id }).catch(() => {
          // Ignore RPC errors silently
        });
      }

      // Log with masked ID for audit
      await createAuditLog(supabaseAdmin, user.userId, user.role, "demos", "click", {
        masked_user_id: maskedUserId,
        demo_id: body.demo_id,
        device: body.device_type,
        is_prime: isPrime,
      });

      return jsonResponse({ 
        logged: true,
        masked_id: maskedUserId,
      });
    }, { module: "demos", action: "log_click" });
  }

  // POST /demos/session (track session duration)
  if (path === "/session" && req.method === "POST") {
    return withAuth(req, [], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["demo_id", "duration_seconds"]);
      if (validation) return errorResponse(validation);

      if (!isValidUUID(body.demo_id)) {
        return errorResponse("Invalid demo ID");
      }

      const duration = Math.max(0, parseInt(body.duration_seconds) || 0);
      const exitPoint = body.exit_point || "unknown";

      // Update analytics
      const today = new Date().toISOString().split("T")[0];
      
      // Try to update existing analytics record or create new
      const { data: existing } = await supabaseAdmin
        .from("demo_analytics")
        .select("id, total_views, avg_duration_seconds")
        .eq("demo_id", body.demo_id)
        .eq("date", today)
        .single();

      if (existing) {
        const newAvg = Math.round(
          ((existing.avg_duration_seconds || 0) * (existing.total_views || 1) + duration) / 
          ((existing.total_views || 1) + 1)
        );
        
        await supabaseAdmin
          .from("demo_analytics")
          .update({ 
            avg_duration_seconds: newAvg,
            total_views: (existing.total_views || 0) + 1,
          })
          .eq("id", existing.id);
      } else {
        await supabaseAdmin.from("demo_analytics").insert({
          demo_id: body.demo_id,
          date: today,
          total_views: 1,
          avg_duration_seconds: duration,
        });
      }

      return jsonResponse({ recorded: true, duration_seconds: duration });
    }, { module: "demos", action: "session" });
  }

  // GET /demos/failures
  if (path === "/failures" && req.method === "GET") {
    return withAuth(req, ["super_admin", "admin", "demo_manager", "support", "incident"], async ({ supabaseAdmin, user }) => {
      const { data: failures } = await supabaseAdmin
        .from("demo_health")
        .select(`
          *,
          demos (id, title, url, category)
        `)
        .in("status", ["down", "degraded"])
        .order("checked_at", { ascending: false })
        .limit(50);

      // Get escalations
      const { data: escalations } = await supabaseAdmin
        .from("demo_escalations")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false });

      const hasActiveFailures = (failures?.length || 0) > 0;

      // If there are active failures, ensure alerts are sent
      if (hasActiveFailures) {
        await createBuzzerAlert(supabaseAdmin, "demo_failure", "incident", null, null, "critical");
        await createBuzzerAlert(supabaseAdmin, "demo_failure", "super_admin", null, null, "critical");
      }

      return jsonResponse({
        buzzer: hasActiveFailures,
        failures: failures?.map((f: any) => ({
          health_id: f.id,
          demo_id: f.demo_id,
          demo_title: f.demos?.title,
          status: f.status,
          error: f.error_message,
          response_time: f.response_time,
          checked_at: f.checked_at,
        })) || [],
        escalations: escalations?.map((e: any) => ({
          id: e.id,
          demo_id: e.demo_id,
          reason: e.reason,
          level: e.escalation_level,
          created_at: e.created_at,
        })) || [],
      }, 200, hasActiveFailures);
    }, { module: "demos", action: "failures" });
  }

  // GET /demos (list - authenticated)
  if ((path === "" || path === "/") && req.method === "GET") {
    return withAuth(req, ["super_admin", "admin", "demo_manager", "franchise", "reseller", "prime", "client"], async ({ supabaseAdmin, user }) => {
      const urlParams = new URL(req.url);
      const category = urlParams.searchParams.get("category");
      const status = urlParams.searchParams.get("status");

      let query = supabaseAdmin.from("demos").select("*");

      if (category) query = query.eq("category", category);
      if (status) query = query.eq("status", status);

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) return errorResponse(error.message, 400);

      // Mask URLs for non-admin users
      const isAdmin = ["super_admin", "admin", "demo_manager"].includes(user.role);
      const demos = data?.map((d: any) => ({
        id: d.id,
        title: d.title,
        category: d.category,
        description: d.description,
        tech_stack: d.tech_stack,
        status: d.status,
        health_score: d.health_score,
        url: isAdmin ? d.url : d.masked_url,
        created_at: d.created_at,
      })) || [];

      return jsonResponse({ demos });
    }, { module: "demos", action: "list" });
  }

  // POST /demos/health-check (internal)
  if (path === "/health-check" && req.method === "POST") {
    return withAuth(req, ["super_admin", "admin", "demo_manager"], async ({ supabaseAdmin, body, user }) => {
      const { data: demos } = await supabaseAdmin
        .from("demos")
        .select("id, url, title")
        .eq("status", "active");

      const results: any[] = [];
      let failureCount = 0;

      for (const demo of demos || []) {
        try {
          const start = Date.now();
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);
          
          const response = await fetch(demo.url, { 
            method: "HEAD", 
            signal: controller.signal 
          });
          
          clearTimeout(timeoutId);
          const responseTime = Date.now() - start;

          const status = response.ok ? "active" : "degraded";
          if (!response.ok) failureCount++;

          await supabaseAdmin.from("demo_health").insert({
            demo_id: demo.id,
            status,
            response_time: responseTime,
          });

          results.push({ demo_id: demo.id, title: demo.title, status, response_time: responseTime });

          // Create buzzer if down
          if (!response.ok) {
            await createBuzzerAlert(supabaseAdmin, "demo_degraded", "demo_manager", null, null, "high");
          }
        } catch (err) {
          failureCount++;
          const errorMessage = (err as Error).message;
          
          await supabaseAdmin.from("demo_health").insert({
            demo_id: demo.id,
            status: "down",
            error_message: errorMessage,
          });

          // Alert incident role and super admin for down demos
          await createBuzzerAlert(supabaseAdmin, "demo_failure", "incident", null, null, "critical");
          await createBuzzerAlert(supabaseAdmin, "demo_failure", "super_admin", null, null, "critical");

          results.push({ demo_id: demo.id, title: demo.title, status: "down", error: errorMessage });
        }
      }

      // Audit log
      await createAuditLog(supabaseAdmin, user.userId, user.role, "demos", "health_check", {
        total_checked: results.length,
        failures: failureCount,
      });

      return jsonResponse({
        checked: results.length,
        failures: failureCount,
        results,
      }, 200, failureCount > 0);
    }, { module: "demos", action: "health_check" });
  }

  return errorResponse("Not found", 404);
});
