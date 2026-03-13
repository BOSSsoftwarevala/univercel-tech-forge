import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  jsonResponse,
  errorResponse,
  validateRequired,
} from "../_shared/utils.ts";
import { withAuth, RequestContext } from "../_shared/middleware.ts";

serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api/products", "");

  // POST /products/create
  if (path === "/create" && req.method === "POST") {
    return withAuth(req, ["boss_owner", "admin", "product_manager"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["product_name", "category"]);
      if (validation) return errorResponse(validation);

      const { data, error } = await supabaseAdmin.from("products").insert({
        product_name: body.product_name,
        category: body.category,
        description: body.description,
        pricing_model: body.pricing_model || "one_time",
        lifetime_price: body.lifetime_price,
        monthly_price: body.monthly_price,
        features_json: body.features || {},
        tech_stack: body.tech_stack,
      }).select().single();

      if (error) return errorResponse(error.message, 400);

      return jsonResponse({
        message: "Product created",
        product_id: data.product_id,
      }, 201);
    }, { module: "products", action: "create" });
  }

  // POST /products/version
  if (path === "/version" && req.method === "POST") {
    return withAuth(req, ["boss_owner", "admin", "product_manager", "rd_department"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["product_id", "version_number"]);
      if (validation) return errorResponse(validation);

      const { data, error } = await supabaseAdmin.from("product_versions").insert({
        product_id: body.product_id,
        version_number: body.version_number,
        changes_notes: body.changes_notes,
        release_date: body.release_date || new Date().toISOString(),
      }).select().single();

      if (error) return errorResponse(error.message, 400);

      return jsonResponse({
        message: "Version added",
        version_id: data.version_id,
      }, 201);
    }, { module: "products", action: "add_version" });
  }

  // GET /products
  if ((path === "" || path === "/") && req.method === "GET") {
    return withAuth(req, [], async ({ supabaseAdmin, user }) => {
      const urlParams = new URL(req.url);
      const category = urlParams.searchParams.get("category");

      let query = supabaseAdmin.from("products").select(`
        *,
        product_versions (version_id, version_number, release_date)
      `);

      if (category) query = query.eq("category", category);

      const { data, error } = await query.order("product_name");

      if (error) return errorResponse(error.message, 400);

      return jsonResponse({
        products: data?.map((p: any) => ({
          product_id: p.product_id,
          name: p.product_name,
          category: p.category,
          description: p.description,
          pricing: {
            model: p.pricing_model,
            lifetime: p.lifetime_price,
            monthly: p.monthly_price,
          },
          tech_stack: p.tech_stack,
          versions: p.product_versions,
        })) || [],
      });
    }, { module: "products", action: "list" });
  }

  // PATCH /:id/assign - Assign product to a user/entity
  if (path.match(/^\/[\w-]+\/assign$/) && (req.method === "PATCH" || req.method === "POST")) {
    const productId = path.split("/")[1];
    return withAuth(req, ["boss_owner", "admin", "product_manager"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["assigned_to"]);
      if (validation) return errorResponse(validation);

      const { assigned_to, assignment_type = "user", notes } = body;

      const { data: product, error: fetchError } = await supabaseAdmin
        .from("products")
        .select("product_id, product_name")
        .eq("product_id", productId)
        .single();

      if (fetchError || !product) return errorResponse("Product not found", 404);

      const { error: updateError } = await supabaseAdmin
        .from("products")
        .update({
          assigned_to,
          assignment_type,
          assignment_notes: notes,
          assigned_by: user.userId,
          assigned_at: new Date().toISOString(),
        })
        .eq("product_id", productId);

      if (updateError) return errorResponse(updateError.message, 400);

      return jsonResponse({
        message: "Product assigned successfully",
        product_id: productId,
        assigned_to,
        assignment_type,
      });
    }, { module: "products", action: "assign" });
  }

  return errorResponse("Not found", 404);
});
