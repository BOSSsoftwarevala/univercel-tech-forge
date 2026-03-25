import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { jsonResponse, errorResponse, validateRequired, getSupabaseAdmin, getSupabaseClient, corsHeaders } from "../_shared/utils.ts";

// Allow self-assign only these roles.
// Anything privileged (boss_owner, ceo, master, super_admin, etc.) must be assigned by Super Admin via admin tooling.
const SELF_ASSIGNABLE_ROLES = new Set([
  "developer",
  "franchise",
  "reseller",
  "influencer",
  "prime",
  "client",
]);

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace("/role-init", "");

  if (path === "" && req.method === "POST") {
    try {
      // Get auth header
      const authHeader = req.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return errorResponse("Unauthorized: Missing or invalid token", 401);
      }

      // Parse body
      const body = await req.json().catch(() => ({}));
      const validation = validateRequired(body, ["role"]);
      if (validation) return errorResponse(validation);

      const requestedRole = String(body.role || "").trim();
      if (!SELF_ASSIGNABLE_ROLES.has(requestedRole)) {
        return errorResponse("Forbidden: role cannot be self-assigned", 403);
      }

      // Get user from token
      const supabase = getSupabaseClient(authHeader);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error("Failed to get user from token:", userError);
        return errorResponse("Unauthorized: Invalid token", 401);
      }

      const supabaseAdmin = getSupabaseAdmin();

      // If role already exists, do not change it (prevents upgrades).
      const { data: existing, error: existingErr } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingErr) {
        console.error("Error checking existing role:", existingErr);
        return errorResponse(existingErr.message, 400);
      }

      if (existing?.role) {
        return jsonResponse({ user_id: user.id, role: existing.role, changed: false });
      }

      // Insert new role
      const { error } = await supabaseAdmin.from("user_roles").insert({
        user_id: user.id,
        role: requestedRole,
      });

      if (error) {
        console.error("Error inserting role:", error);
        return errorResponse(error.message, 400);
      }

      console.log(`Role ${requestedRole} assigned to user ${user.id}`);
      return jsonResponse({ user_id: user.id, role: requestedRole, changed: true }, 201);
    } catch (err) {
      const error = err as Error;
      console.error("Role-init error:", error);
      return errorResponse(error.message || "Internal server error", 500);
    }
  }

  return errorResponse("Not found", 404);
});
