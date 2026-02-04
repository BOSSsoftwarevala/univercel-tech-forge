// Central System Event Pipeline API (single enforced entrypoint)
// Contract:
// POST   /api-system-event               -> insert into public.system_events
// PATCH  /api-system-event/:id           -> update status (approve/reject)

import {
  corsHeaders,
  errorResponse,
  getSupabaseAdmin,
  getSupabaseClient,
  getUserFromToken,
  jsonResponse,
  validateRequired,
  createAuditLog,
} from "../_shared/utils.ts";

type SystemEventStatus = "PENDING" | "APPROVED" | "REJECTED";

function normalizeStatus(input: unknown): SystemEventStatus {
  const s = String(input || "").toUpperCase();
  if (s === "APPROVED") return "APPROVED";
  if (s === "REJECTED") return "REJECTED";
  return "PENDING";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace("/api-system-event", "");
  const supabaseAdmin = getSupabaseAdmin();

  // Parse JSON body (if present)
  let body: any = {};
  try {
    if (req.method !== "GET") {
      body = await req.json();
    }
  } catch {
    body = {};
  }

  // Optional auth
  const authHeader = req.headers.get("Authorization") || "";
  let user: { userId: string; role: string; email: string } | null = null;
  try {
    if (authHeader.startsWith("Bearer ")) {
      const supabaseUser = getSupabaseClient(authHeader);
      user = await getUserFromToken(supabaseUser);
    }
  } catch {
    user = null;
  }

  // ------------------------------------------
  // POST / -> create system event
  // ------------------------------------------
  if (req.method === "POST" && (path === "" || path === "/")) {
    const validation = validateRequired(body, [
      "event_type",
      "source_role",
      "payload",
    ]);
    if (validation) return errorResponse(validation);

    const status = normalizeStatus(body.status);

    const insertRow = {
      event_type: String(body.event_type),
      source_role: String(body.source_role),
      // Prefer authenticated user id if available; otherwise accept provided (or null)
      source_user_id: user?.userId || (body.source_user_id || null),
      payload: body.payload && typeof body.payload === "object" ? body.payload : {},
      status,
    };

    const { data, error } = await supabaseAdmin
      .from("system_events")
      .insert(insertRow)
      .select("id")
      .single();

    if (error || !data?.id) {
      await createAuditLog(
        supabaseAdmin,
        user?.userId || null,
        user?.role || null,
        "system",
        "system_event_create_failed",
        { error: error?.message || "unknown" }
      );
      return errorResponse("Unable to create system event. Please try again.", 500);
    }

    await createAuditLog(
      supabaseAdmin,
      user?.userId || null,
      user?.role || null,
      "system",
      "system_event_created",
      { system_event_id: data.id, event_type: insertRow.event_type, status }
    );

    return jsonResponse({ event_id: data.id }, 201);
  }

  // ------------------------------------------
  // PATCH /:id -> update status
  // ------------------------------------------
  if (req.method === "PATCH") {
    const eventId = path.startsWith("/") ? path.slice(1) : path;
    if (!eventId) return errorResponse("Missing event id", 400);

    const validation = validateRequired(body, ["status"]);
    if (validation) return errorResponse(validation);

    const status = normalizeStatus(body.status);

    // Only authenticated users with DB permissions will succeed due to RLS.
    const { data, error } = await supabaseAdmin
      .from("system_events")
      .update({
        status,
        payload: body.payload && typeof body.payload === "object" ? body.payload : undefined,
      })
      .eq("id", eventId)
      .select("id,status")
      .single();

    if (error || !data) {
      await createAuditLog(
        supabaseAdmin,
        user?.userId || null,
        user?.role || null,
        "system",
        "system_event_update_failed",
        { system_event_id: eventId, error: error?.message || "unknown" }
      );
      return errorResponse("Unable to update system event.", 500);
    }

    await createAuditLog(
      supabaseAdmin,
      user?.userId || null,
      user?.role || null,
      "system",
      "system_event_updated",
      { system_event_id: eventId, status }
    );

    return jsonResponse({ id: data.id, status: data.status });
  }

  return errorResponse("Endpoint not found", 404);
});
