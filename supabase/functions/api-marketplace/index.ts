// Marketplace API for Software Vala
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  jsonResponse,
  errorResponse,
  validateRequired,
  createAuditLog,
} from "../_shared/utils.ts";
import { withAuth } from "../_shared/middleware.ts";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace("/api-marketplace", "");

  // POST /sync - Sync products to marketplace catalog
  if (path === "/sync" && req.method === "POST") {
    return withAuth(
      req,
      ["boss_owner", "ceo", "admin", "product_manager"],
      async ({ supabaseAdmin, body, user }) => {
        const { product_ids, sync_mode = "incremental" } = body || {};

        // Fetch products to sync
        let productsQuery = supabaseAdmin
          .from("products")
          .select("product_id, product_name, category, description, pricing_model, lifetime_price, monthly_price, tech_stack");

        if (product_ids && Array.isArray(product_ids) && product_ids.length > 0) {
          productsQuery = productsQuery.in("product_id", product_ids);
        }

        const { data: products, error: fetchError } = await productsQuery;
        if (fetchError) return errorResponse(fetchError.message, 400);

        const synced: string[] = [];
        const errors: string[] = [];

        for (const product of (products || [])) {
          const catalogEntry = {
            product_id: product.product_id,
            product_name: product.product_name,
            category: product.category,
            description: product.description,
            pricing_model: product.pricing_model,
            lifetime_price: product.lifetime_price,
            monthly_price: product.monthly_price,
            tech_stack: product.tech_stack,
            synced_at: new Date().toISOString(),
            sync_status: "active",
          };

          const { error: upsertError } = await supabaseAdmin
            .from("product_catalog")
            .upsert(catalogEntry, { onConflict: "product_id" });

          if (upsertError) {
            errors.push(`${product.product_id}: ${upsertError.message}`);
          } else {
            synced.push(product.product_id);
          }
        }

        await createAuditLog(supabaseAdmin, user.userId, user.role, "marketplace", "sync", {
          sync_mode,
          total: (products || []).length,
          synced: synced.length,
          errors: errors.length,
        });

        return jsonResponse({
          message: "Marketplace sync completed",
          synced_count: synced.length,
          error_count: errors.length,
          synced_product_ids: synced,
          errors: errors.length > 0 ? errors : undefined,
        });
      },
      { module: "marketplace", action: "sync" }
    );
  }

  // GET /catalog - List marketplace catalog
  if ((path === "/catalog" || path === "" || path === "/") && req.method === "GET") {
    return withAuth(req, [], async ({ supabaseAdmin }) => {
      const category = url.searchParams.get("category");
      const status = url.searchParams.get("status") || "active";

      let query = supabaseAdmin
        .from("product_catalog")
        .select("*")
        .eq("sync_status", status);

      if (category) query = query.eq("category", category);

      const { data, error } = await query.order("product_name");
      if (error) return errorResponse(error.message, 400);

      return jsonResponse({ catalog: data || [], total: (data || []).length });
    }, { module: "marketplace", action: "list_catalog" });
  }

  // POST /orders - Create a marketplace order
  if (path === "/orders" && req.method === "POST") {
    return withAuth(req, ["boss_owner", "ceo", "admin", "franchise", "reseller"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["product_id", "quantity"]);
      if (validation) return errorResponse(validation);

      const { product_id, quantity, buyer_id, notes } = body;

      const { data: catalogItem, error: catalogError } = await supabaseAdmin
        .from("product_catalog")
        .select("*")
        .eq("product_id", product_id)
        .eq("sync_status", "active")
        .single();

      if (catalogError || !catalogItem) {
        return errorResponse("Product not found in marketplace catalog", 404);
      }

      const unitPrice =
        catalogItem.pricing_model === "monthly"
          ? catalogItem.monthly_price
          : catalogItem.lifetime_price;

      const totalAmount = (unitPrice || 0) * quantity;

      const { data: order, error: orderError } = await supabaseAdmin
        .from("marketplace_orders")
        .insert({
          product_id,
          buyer_id: buyer_id || user.userId,
          created_by: user.userId,
          quantity,
          total_amount: totalAmount,
          notes,
          status: "pending",
          ordered_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (orderError) return errorResponse(orderError.message, 400);

      await createAuditLog(supabaseAdmin, user.userId, user.role, "marketplace", "order_created", {
        order_id: order.id,
        product_id,
        quantity,
        total_amount: totalAmount,
      });

      return jsonResponse({ message: "Order created", order_id: order.id, order }, 201);
    }, { module: "marketplace", action: "create_order" });
  }

  // GET /orders - List marketplace orders
  if (path === "/orders" && req.method === "GET") {
    return withAuth(req, ["boss_owner", "ceo", "admin", "finance_manager"], async ({ supabaseAdmin }) => {
      const status = url.searchParams.get("status");
      let query = supabaseAdmin.from("marketplace_orders").select("*");
      if (status) query = query.eq("status", status);
      const { data, error } = await query.order("ordered_at", { ascending: false });
      if (error) return errorResponse(error.message, 400);
      return jsonResponse({ orders: data || [], total: (data || []).length });
    }, { module: "marketplace", action: "list_orders" });
  }

  // PATCH /orders/:id/status - Update order status
  if (path.match(/^\/orders\/[\w-]+\/status$/) && req.method === "PATCH") {
    const orderId = path.split("/")[2];
    return withAuth(req, ["boss_owner", "ceo", "admin", "finance_manager"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["status"]);
      if (validation) return errorResponse(validation);

      const { error } = await supabaseAdmin
        .from("marketplace_orders")
        .update({ status: body.status, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (error) return errorResponse(error.message, 400);

      await createAuditLog(supabaseAdmin, user.userId, user.role, "marketplace", "order_status_updated", {
        order_id: orderId,
        new_status: body.status,
      });

      return jsonResponse({ message: "Order status updated", order_id: orderId, status: body.status });
    }, { module: "marketplace", action: "update_order_status" });
  }

  return errorResponse("Not found", 404);
});
