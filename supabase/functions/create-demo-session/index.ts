/**
 * create-demo-session
 *
 * Creates a time-limited JWT-based demo access session for a marketplace application.
 * Works for both authenticated users and anonymous visitors.
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
  sanitizeInput,
  isValidUUID,
  checkRateLimit,
  rateLimitResponse,
} from "../_shared/utils.ts";

const DEMO_SESSION_DURATION_MINUTES =
  parseInt(Deno.env.get("DEMO_SESSION_DURATION_MINUTES") || "30", 10);

function getClientIP(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

async function generateSessionToken(
  applicationId: string,
  visitorIdentifier: string,
): Promise<string> {
  const entropy = `demo:${applicationId}:${visitorIdentifier}:${Date.now()}:${Math.random()}`;
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(entropy));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const clientIP = getClientIP(req);

  // Rate limit: 30 demo sessions per minute per IP
  const rateCheck = checkRateLimit(clientIP, "demo_access");
  if (!rateCheck.allowed) {
    return rateLimitResponse(rateCheck.resetIn);
  }

  try {
    let userId: string | null = null;
    let userRole: string | null = null;

    // Auth is optional for demo sessions
    const authHeader = req.headers.get("Authorization") || "";
    if (authHeader) {
      const tokenCheck = validateTokenFormat(authHeader);
      if (tokenCheck.valid) {
        const supabaseClient = getSupabaseClient(authHeader);
        const user = await getUserFromToken(supabaseClient);
        if (user) {
          userId = user.userId;
          userRole = user.role;
        }
      }
    }

    const supabaseAdmin = getSupabaseAdmin();

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return errorResponse("Invalid JSON body", 400);
    }

    const { application_id, visitor_email, visitor_name } = body as {
      application_id?: string;
      visitor_email?: string;
      visitor_name?: string;
    };

    if (!application_id || !isValidUUID(application_id)) {
      return errorResponse("Valid application_id is required", 400);
    }

    // Validate application exists and is active
    const { data: app, error: appError } = await supabaseAdmin
      .from("marketplace_applications")
      .select("id, name, is_active")
      .eq("id", application_id)
      .maybeSingle();

    if (appError || !app) {
      return errorResponse("Application not found", 404);
    }
    if (!app.is_active) {
      return errorResponse("Application demo is not available", 400);
    }

    const safeEmail = visitor_email
      ? sanitizeInput(String(visitor_email)).slice(0, 254)
      : null;
    const safeName = visitor_name
      ? sanitizeInput(String(visitor_name)).slice(0, 100)
      : null;

    const visitorIdentifier = userId || safeEmail || clientIP;
    const sessionToken = await generateSessionToken(application_id, visitorIdentifier);
    const expiresAt = new Date(
      Date.now() + DEMO_SESSION_DURATION_MINUTES * 60 * 1000,
    ).toISOString();

    const { data: session, error: sessionErr } = await supabaseAdmin
      .from("demo_sessions")
      .insert({
        user_id: userId,
        application_id,
        session_token: sessionToken,
        visitor_email: safeEmail,
        visitor_name: safeName,
        ip_address: clientIP,
        user_agent: req.headers.get("user-agent")?.slice(0, 256) || null,
        status: "active",
        expires_at: expiresAt,
        metadata: {
          application_name: app.name,
          created_by_role: userRole,
        },
      })
      .select()
      .single();

    if (sessionErr) {
      console.error("Demo session creation error:", sessionErr);
      return errorResponse("Failed to create demo session", 500);
    }

    return jsonResponse(
      {
        session: {
          id: session.id,
          session_token: session.session_token,
          application_id: session.application_id,
          expires_at: session.expires_at,
          status: session.status,
        },
      },
      201,
    );
  } catch (err) {
    console.error("create-demo-session error:", err);
    return errorResponse("Internal server error", 500);
  }
});
