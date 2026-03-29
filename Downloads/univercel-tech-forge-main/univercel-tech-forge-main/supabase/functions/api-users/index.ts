import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  jsonResponse,
  errorResponse,
  validateRequired,
  createAuditLog,
  maskEmail,
  maskPhone,
  maskName,
} from "../_shared/utils.ts";
import { withAuth, withSuperAdmin, RequestContext } from "../_shared/middleware.ts";

serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api/users", "").replace("/api/roles", "");

  // POST /users/create (Admin only)
  if (path === "/create" && req.method === "POST") {
    return withAuth(req, ["super_admin", "admin"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["email", "password", "role", "full_name"]);
      if (validation) return errorResponse(validation);

      // Create auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: body.email,
        password: body.password,
        email_confirm: true,
      });

      if (authError) return errorResponse(authError.message, 400);

      // Assign role - auto-approve since created by admin
      await supabaseAdmin.from("user_roles").insert({
        user_id: authData.user.id,
        role: body.role,
        approval_status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: user.userId,
      });

      return jsonResponse({
        message: "User created",
        user_id: authData.user.id,
        email: maskEmail(body.email),
        role: body.role,
      }, 201);
    }, { module: "users", action: "create" });
  }

  // GET /users
  if ((path === "" || path === "/") && req.method === "GET") {
    return withAuth(req, ["super_admin", "admin", "performance_manager"], async ({ supabaseAdmin, user }) => {
      const url = new URL(req.url);
      const role = url.searchParams.get("role");
      const status = url.searchParams.get("status");
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "50");
      const offset = (page - 1) * limit;

      let query = supabaseAdmin.from("user_roles").select(`
        id,
        user_id,
        role,
        created_at
      `);

      if (role) query = query.eq("role", role);

      const { data, error, count } = await query
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: false });

      if (error) return errorResponse(error.message, 400);

      // Mask sensitive data
      const maskedUsers = data?.map((u: any) => ({
        ...u,
        user_id: u.user_id.slice(0, 8) + "...",
      })) || [];

      return jsonResponse({
        users: maskedUsers,
        pagination: {
          page,
          limit,
          total: count || 0,
        },
      });
    }, { module: "users", action: "list" });
  }

  // PUT /users/update
  if (path === "/update" && req.method === "PUT") {
    return withAuth(req, ["super_admin", "admin"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["user_id"]);
      if (validation) return errorResponse(validation);

      // Update role if provided
      if (body.role) {
        await supabaseAdmin
          .from("user_roles")
          .update({ role: body.role })
          .eq("user_id", body.user_id);
      }

      // Update user metadata if provided
      if (body.email || body.password) {
        const updateData: any = {};
        if (body.email) updateData.email = body.email;
        if (body.password) updateData.password = body.password;

        await supabaseAdmin.auth.admin.updateUserById(body.user_id, updateData);
      }

      return jsonResponse({
        message: "User updated",
        user_id: body.user_id.slice(0, 8) + "...",
      });
    }, { module: "users", action: "update" });
  }

  // DELETE /users/remove
  if (path === "/remove" && req.method === "DELETE") {
    return withSuperAdmin(req, async ({ supabaseAdmin, body }) => {
      const validation = validateRequired(body, ["user_id"]);
      if (validation) return errorResponse(validation);

      // Soft delete - just deactivate
      await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", body.user_id);

      // Optionally delete auth user
      if (body.hard_delete) {
        await supabaseAdmin.auth.admin.deleteUser(body.user_id);
      }

      return jsonResponse({
        message: "User removed",
      });
    }, { module: "users", action: "remove" });
  }

  // POST /roles/create (Super Admin only)
  if (path === "/create" && req.method === "POST") {
    return withSuperAdmin(req, async ({ supabaseAdmin, body }) => {
      const validation = validateRequired(body, ["role_name", "description"]);
      if (validation) return errorResponse(validation);

      const { data, error } = await supabaseAdmin.from("roles").insert({
        role_name: body.role_name,
        description: body.description,
      }).select().single();

      if (error) return errorResponse(error.message, 400);

      return jsonResponse({
        message: "Role created",
        role: data,
      }, 201);
    }, { module: "roles", action: "create" });
  }

  // PUT /roles/permissions
  if (path === "/permissions" && req.method === "PUT") {
    return withSuperAdmin(req, async ({ supabaseAdmin, body }) => {
      const validation = validateRequired(body, ["role_id", "permissions"]);
      if (validation) return errorResponse(validation);

      // Remove existing permissions
      await supabaseAdmin
        .from("role_permissions")
        .delete()
        .eq("role_id", body.role_id);

      // Add new permissions
      const permissionInserts = body.permissions.map((p: string) => ({
        role_id: body.role_id,
        permission_id: p,
      }));

      const { error } = await supabaseAdmin
        .from("role_permissions")
        .insert(permissionInserts);

      if (error) return errorResponse(error.message, 400);

      return jsonResponse({
        message: "Permissions updated",
        role_id: body.role_id,
        permissions_count: body.permissions.length,
      });
    }, { module: "roles", action: "permissions_update" });
  }

  return errorResponse("Not found", 404);
});
