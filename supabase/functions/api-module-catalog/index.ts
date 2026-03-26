declare const Deno: { env: { get(name: string): string | undefined } };
// @ts-ignore Deno runtime import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { withAuth, type RequestContext } from "../_shared/middleware.ts";
import { errorResponse, jsonResponse } from "../_shared/utils.ts";

// Roles that can administrate modules / categories / subcategories
const ADMIN_ROLES = new Set([
  "admin",
  "super_admin",
  "boss_owner",
  "master",
  "ceo",
]);

// Roles that have read access by default (extended by module_access_roles table)
const READ_ROLES = new Set([
  "admin",
  "super_admin",
  "boss_owner",
  "master",
  "ceo",
  "user",
]);

function isAdmin(role: string): boolean {
  return ADMIN_ROLES.has(role);
}

function canRead(role: string): boolean {
  return READ_ROLES.has(role);
}

function normalizePath(path: string): string {
  return (path || "/").replace(/^\/functions\/v1\/api-module-catalog/, "") || "/";
}

// ============================================================
// MODULE CRUD
// ============================================================

async function listModules(ctx: RequestContext): Promise<Response> {
  if (!canRead(ctx.user.role)) return errorResponse("Forbidden", 403);

  const url = new URL(ctx.req.url);
  const status = url.searchParams.get("status");
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "50", 10)));
  const offset = (page - 1) * limit;

  let query = ctx.supabaseAdmin
    .from("module_definitions")
    .select("*", { count: "exact" })
    .order("sort_order", { ascending: true })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("status", status);

  const { data, error, count } = await query;
  if (error) return errorResponse(error.message, 500);

  return jsonResponse({
    success: true,
    data,
    pagination: { page, limit, total: count ?? 0, total_pages: Math.ceil((count ?? 0) / limit) },
  });
}

async function getModule(ctx: RequestContext, id: string): Promise<Response> {
  if (!canRead(ctx.user.role)) return errorResponse("Forbidden", 403);

  const { data, error } = await ctx.supabaseAdmin
    .from("module_definitions")
    .select("*, module_categories(*, module_subcategories(*))")
    .eq("id", id)
    .maybeSingle();

  if (error) return errorResponse(error.message, 500);
  if (!data) return errorResponse("Module not found", 404);

  return jsonResponse({ success: true, data });
}

async function createModule(ctx: RequestContext): Promise<Response> {
  if (!isAdmin(ctx.user.role)) return errorResponse("Admin access required", 403);

  const body = ctx.body as Record<string, unknown>;
  const { module_key, name, description, icon, status, is_critical, sort_order, config, metadata } = body;

  if (!module_key || !name) return errorResponse("module_key and name are required", 400);

  const { data, error } = await ctx.supabaseAdmin
    .from("module_definitions")
    .insert({
      module_key,
      name,
      description: description ?? null,
      icon: icon ?? null,
      status: status ?? "active",
      is_critical: is_critical ?? false,
      sort_order: sort_order ?? 0,
      config: config ?? {},
      metadata: metadata ?? {},
      created_by: ctx.user.id,
      updated_by: ctx.user.id,
    })
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  await ctx.supabaseAdmin.from("system_audit_logs").insert({
    action: "module_created",
    action_type: "module_management",
    performed_by: ctx.user.id,
    performed_by_role: ctx.user.role,
    target_type: "module_definition",
    target_id: data.id,
    details: { module_key, name },
  }).then(({ error: auditErr }) => {
    if (auditErr) console.error("[api-module-catalog] audit log failed:", auditErr.message);
  });

  return jsonResponse({ success: true, data }, 201);
}

async function updateModule(ctx: RequestContext, id: string): Promise<Response> {
  if (!isAdmin(ctx.user.role)) return errorResponse("Admin access required", 403);

  const body = ctx.body as Record<string, unknown>;
  const allowed = ["name", "description", "icon", "status", "is_critical", "sort_order", "config", "metadata"];
  const patch: Record<string, unknown> = { updated_by: ctx.user.id };
  for (const key of allowed) {
    if (key in body) patch[key] = body[key];
  }

  const { data, error } = await ctx.supabaseAdmin
    .from("module_definitions")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);
  if (!data) return errorResponse("Module not found", 404);

  return jsonResponse({ success: true, data });
}

async function deleteModule(ctx: RequestContext, id: string): Promise<Response> {
  if (!isAdmin(ctx.user.role)) return errorResponse("Admin access required", 403);

  const { error } = await ctx.supabaseAdmin
    .from("module_definitions")
    .delete()
    .eq("id", id);

  if (error) return errorResponse(error.message, 500);

  await ctx.supabaseAdmin.from("system_audit_logs").insert({
    action: "module_deleted",
    action_type: "module_management",
    performed_by: ctx.user.id,
    performed_by_role: ctx.user.role,
    target_type: "module_definition",
    target_id: id,
    details: {},
  }).then(({ error: auditErr }) => {
    if (auditErr) console.error("[api-module-catalog] audit log failed:", auditErr.message);
  });

  return jsonResponse({ success: true, message: "Module deleted" });
}

// ============================================================
// CATEGORY CRUD
// ============================================================

async function listCategories(ctx: RequestContext, moduleId: string): Promise<Response> {
  if (!canRead(ctx.user.role)) return errorResponse("Forbidden", 403);

  const url = new URL(ctx.req.url);
  const status = url.searchParams.get("status");
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "50", 10)));
  const offset = (page - 1) * limit;

  let query = ctx.supabaseAdmin
    .from("module_categories")
    .select("*", { count: "exact" })
    .eq("module_id", moduleId)
    .order("sort_order", { ascending: true })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("status", status);

  const { data, error, count } = await query;
  if (error) return errorResponse(error.message, 500);

  return jsonResponse({
    success: true,
    data,
    pagination: { page, limit, total: count ?? 0, total_pages: Math.ceil((count ?? 0) / limit) },
  });
}

async function getCategory(ctx: RequestContext, categoryId: string): Promise<Response> {
  if (!canRead(ctx.user.role)) return errorResponse("Forbidden", 403);

  const { data, error } = await ctx.supabaseAdmin
    .from("module_categories")
    .select("*, module_subcategories(*)")
    .eq("id", categoryId)
    .maybeSingle();

  if (error) return errorResponse(error.message, 500);
  if (!data) return errorResponse("Category not found", 404);

  return jsonResponse({ success: true, data });
}

async function createCategory(ctx: RequestContext, moduleId: string): Promise<Response> {
  if (!isAdmin(ctx.user.role)) return errorResponse("Admin access required", 403);

  const body = ctx.body as Record<string, unknown>;
  const { category_key, name, description, icon, status, sort_order, config, metadata } = body;

  if (!category_key || !name) return errorResponse("category_key and name are required", 400);

  // Verify module exists
  const { data: mod } = await ctx.supabaseAdmin
    .from("module_definitions")
    .select("id")
    .eq("id", moduleId)
    .maybeSingle();
  if (!mod) return errorResponse("Module not found", 404);

  const { data, error } = await ctx.supabaseAdmin
    .from("module_categories")
    .insert({
      module_id: moduleId,
      category_key,
      name,
      description: description ?? null,
      icon: icon ?? null,
      status: status ?? "active",
      sort_order: sort_order ?? 0,
      config: config ?? {},
      metadata: metadata ?? {},
      created_by: ctx.user.id,
      updated_by: ctx.user.id,
    })
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  return jsonResponse({ success: true, data }, 201);
}

async function updateCategory(ctx: RequestContext, categoryId: string): Promise<Response> {
  if (!isAdmin(ctx.user.role)) return errorResponse("Admin access required", 403);

  const body = ctx.body as Record<string, unknown>;
  const allowed = ["name", "description", "icon", "status", "sort_order", "config", "metadata"];
  const patch: Record<string, unknown> = { updated_by: ctx.user.id };
  for (const key of allowed) {
    if (key in body) patch[key] = body[key];
  }

  const { data, error } = await ctx.supabaseAdmin
    .from("module_categories")
    .update(patch)
    .eq("id", categoryId)
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);
  if (!data) return errorResponse("Category not found", 404);

  return jsonResponse({ success: true, data });
}

async function deleteCategory(ctx: RequestContext, categoryId: string): Promise<Response> {
  if (!isAdmin(ctx.user.role)) return errorResponse("Admin access required", 403);

  const { error } = await ctx.supabaseAdmin
    .from("module_categories")
    .delete()
    .eq("id", categoryId);

  if (error) return errorResponse(error.message, 500);

  return jsonResponse({ success: true, message: "Category deleted" });
}

// ============================================================
// SUBCATEGORY CRUD
// ============================================================

async function listSubcategories(ctx: RequestContext, categoryId: string): Promise<Response> {
  if (!canRead(ctx.user.role)) return errorResponse("Forbidden", 403);

  const url = new URL(ctx.req.url);
  const status = url.searchParams.get("status");
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "50", 10)));
  const offset = (page - 1) * limit;

  let query = ctx.supabaseAdmin
    .from("module_subcategories")
    .select("*", { count: "exact" })
    .eq("category_id", categoryId)
    .order("sort_order", { ascending: true })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("status", status);

  const { data, error, count } = await query;
  if (error) return errorResponse(error.message, 500);

  return jsonResponse({
    success: true,
    data,
    pagination: { page, limit, total: count ?? 0, total_pages: Math.ceil((count ?? 0) / limit) },
  });
}

async function getSubcategory(ctx: RequestContext, subcategoryId: string): Promise<Response> {
  if (!canRead(ctx.user.role)) return errorResponse("Forbidden", 403);

  const { data, error } = await ctx.supabaseAdmin
    .from("module_subcategories")
    .select("*")
    .eq("id", subcategoryId)
    .maybeSingle();

  if (error) return errorResponse(error.message, 500);
  if (!data) return errorResponse("Subcategory not found", 404);

  return jsonResponse({ success: true, data });
}

async function createSubcategory(ctx: RequestContext, categoryId: string): Promise<Response> {
  if (!isAdmin(ctx.user.role)) return errorResponse("Admin access required", 403);

  const body = ctx.body as Record<string, unknown>;
  const { subcategory_key, name, description, icon, status, sort_order, config, metadata } = body;

  if (!subcategory_key || !name) return errorResponse("subcategory_key and name are required", 400);

  // Verify category exists and get module_id
  const { data: cat } = await ctx.supabaseAdmin
    .from("module_categories")
    .select("id, module_id")
    .eq("id", categoryId)
    .maybeSingle();
  if (!cat) return errorResponse("Category not found", 404);

  const { data, error } = await ctx.supabaseAdmin
    .from("module_subcategories")
    .insert({
      category_id: categoryId,
      module_id: cat.module_id,
      subcategory_key,
      name,
      description: description ?? null,
      icon: icon ?? null,
      status: status ?? "active",
      sort_order: sort_order ?? 0,
      config: config ?? {},
      metadata: metadata ?? {},
      created_by: ctx.user.id,
      updated_by: ctx.user.id,
    })
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  return jsonResponse({ success: true, data }, 201);
}

async function updateSubcategory(ctx: RequestContext, subcategoryId: string): Promise<Response> {
  if (!isAdmin(ctx.user.role)) return errorResponse("Admin access required", 403);

  const body = ctx.body as Record<string, unknown>;
  const allowed = ["name", "description", "icon", "status", "sort_order", "config", "metadata"];
  const patch: Record<string, unknown> = { updated_by: ctx.user.id };
  for (const key of allowed) {
    if (key in body) patch[key] = body[key];
  }

  const { data, error } = await ctx.supabaseAdmin
    .from("module_subcategories")
    .update(patch)
    .eq("id", subcategoryId)
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);
  if (!data) return errorResponse("Subcategory not found", 404);

  return jsonResponse({ success: true, data });
}

async function deleteSubcategory(ctx: RequestContext, subcategoryId: string): Promise<Response> {
  if (!isAdmin(ctx.user.role)) return errorResponse("Admin access required", 403);

  const { error } = await ctx.supabaseAdmin
    .from("module_subcategories")
    .delete()
    .eq("id", subcategoryId);

  if (error) return errorResponse(error.message, 500);

  return jsonResponse({ success: true, message: "Subcategory deleted" });
}

// ============================================================
// MODULE ACCESS ROLES CRUD
// ============================================================

async function listModuleRoles(ctx: RequestContext, moduleId: string): Promise<Response> {
  if (!isAdmin(ctx.user.role)) return errorResponse("Admin access required", 403);

  const { data, error } = await ctx.supabaseAdmin
    .from("module_access_roles")
    .select("*")
    .eq("module_id", moduleId)
    .order("role");

  if (error) return errorResponse(error.message, 500);

  return jsonResponse({ success: true, data });
}

async function upsertModuleRole(ctx: RequestContext, moduleId: string): Promise<Response> {
  if (!isAdmin(ctx.user.role)) return errorResponse("Admin access required", 403);

  const body = ctx.body as Record<string, unknown>;
  const { role, can_read, can_write, can_delete, can_admin } = body;
  if (!role) return errorResponse("role is required", 400);

  const { data, error } = await ctx.supabaseAdmin
    .from("module_access_roles")
    .upsert({
      module_id: moduleId,
      role,
      can_read: can_read ?? true,
      can_write: can_write ?? false,
      can_delete: can_delete ?? false,
      can_admin: can_admin ?? false,
    }, { onConflict: "module_id,role" })
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  return jsonResponse({ success: true, data });
}

// ============================================================
// ROUTER
// Route: GET|POST    /modules
// Route: GET|PUT|DEL /modules/:moduleId
// Route: GET|POST    /modules/:moduleId/categories
// Route: GET|PUT|DEL /modules/:moduleId/categories/:categoryId
// Route: GET|POST    /modules/:moduleId/categories/:categoryId/subcategories
// Route: GET|PUT|DEL /modules/:moduleId/categories/:categoryId/subcategories/:subcategoryId
// Route: GET|POST    /modules/:moduleId/roles
// ============================================================

// UUID v4 pattern
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isUUID(s: string): boolean {
  return UUID_RE.test(s);
}

async function router(ctx: RequestContext): Promise<Response> {
  const path = normalizePath(new URL(ctx.req.url).pathname);
  const method = ctx.req.method.toUpperCase();
  const segments = path.split("/").filter(Boolean);

  // /modules
  if (segments.length === 0 || (segments.length === 1 && segments[0] === "modules")) {
    if (method === "GET")  return listModules(ctx);
    if (method === "POST") return createModule(ctx);
    return errorResponse("Method not allowed", 405);
  }

  const [, moduleId, sec, categoryId, fourth, subcategoryId] = ["", ...segments];

  // /modules/:id  or  /modules/:id/...
  if (!isUUID(moduleId)) return errorResponse("Invalid module ID", 400);

  if (!sec) {
    if (method === "GET")    return getModule(ctx, moduleId);
    if (method === "PUT" || method === "PATCH") return updateModule(ctx, moduleId);
    if (method === "DELETE") return deleteModule(ctx, moduleId);
    return errorResponse("Method not allowed", 405);
  }

  // /modules/:id/roles
  if (sec === "roles") {
    if (method === "GET")  return listModuleRoles(ctx, moduleId);
    if (method === "POST" || method === "PUT") return upsertModuleRole(ctx, moduleId);
    return errorResponse("Method not allowed", 405);
  }

  // /modules/:id/categories
  if (sec === "categories" && !categoryId) {
    if (method === "GET")  return listCategories(ctx, moduleId);
    if (method === "POST") return createCategory(ctx, moduleId);
    return errorResponse("Method not allowed", 405);
  }

  // /modules/:id/categories/:catId  or deeper
  if (sec === "categories" && categoryId) {
    if (!isUUID(categoryId)) return errorResponse("Invalid category ID", 400);

    if (!fourth) {
      if (method === "GET")    return getCategory(ctx, categoryId);
      if (method === "PUT" || method === "PATCH") return updateCategory(ctx, categoryId);
      if (method === "DELETE") return deleteCategory(ctx, categoryId);
      return errorResponse("Method not allowed", 405);
    }

    // /modules/:id/categories/:catId/subcategories
    if (fourth === "subcategories" && !subcategoryId) {
      if (method === "GET")  return listSubcategories(ctx, categoryId);
      if (method === "POST") return createSubcategory(ctx, categoryId);
      return errorResponse("Method not allowed", 405);
    }

    // /modules/:id/categories/:catId/subcategories/:subId
    if (fourth === "subcategories" && subcategoryId) {
      if (!isUUID(subcategoryId)) return errorResponse("Invalid subcategory ID", 400);
      if (method === "GET")    return getSubcategory(ctx, subcategoryId);
      if (method === "PUT" || method === "PATCH") return updateSubcategory(ctx, subcategoryId);
      if (method === "DELETE") return deleteSubcategory(ctx, subcategoryId);
      return errorResponse("Method not allowed", 405);
    }
  }

  return errorResponse("Not found", 404);
}

// ============================================================
// ENTRY POINT
// ============================================================
serve(withAuth(router));
