import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { jsonResponse, errorResponse, validateRequired } from "../_shared/utils.ts";
import { withAuth } from "../_shared/middleware.ts";

// Allow self-assign only these roles.
// Anything privileged must be assigned by Super Admin via admin tooling.
const SELF_ASSIGNABLE_ROLES = new Set([
  "developer",
  "franchise",
  "reseller",
  "influencer",
  "prime",
  "client",
]);

serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.replace("/role-init", "");

  if (path === "" && req.method === "POST") {
    return withAuth(req, [], async ({ supabaseAdmin, user, body }) => {
      const validation = validateRequired(body, ["role"]);
      if (validation) return errorResponse(validation);

      const requestedRole = String(body.role || "").trim();
      if (!SELF_ASSIGNABLE_ROLES.has(requestedRole)) {
        return errorResponse("Forbidden: role cannot be self-assigned", 403);
      }

      // If role already exists, do not change it (prevents upgrades).
      const { data: existing, error: existingErr } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", user.userId)
        .maybeSingle();

      if (existingErr) return errorResponse(existingErr.message, 400);

      if (existing?.role) {
        return jsonResponse({ user_id: user.userId, role: existing.role, changed: false });
      }

      const { error } = await supabaseAdmin.from("user_roles").insert({
        user_id: user.userId,
        role: requestedRole,
      });

      if (error) return errorResponse(error.message, 400);

      return jsonResponse({ user_id: user.userId, role: requestedRole, changed: true }, 201);
    }, { module: "auth", action: "role_init" });
  }

  return errorResponse("Not found", 404);
});
