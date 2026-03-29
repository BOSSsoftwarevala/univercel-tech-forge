import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    const userRole = roleData?.role || "guest";
    // Boss owner has full access - can view, add, edit, delete, publish products
    const canManage = ["demo_manager", "boss_owner", "admin"].includes(userRole);
    const canEdit = ["demo_manager", "boss_owner"].includes(userRole);

    const url = new URL(req.url);
    const path = url.pathname.replace("/api-product-management", "");
    const body = req.method !== "GET" ? await req.json().catch(() => ({})) : {};

    // GET /categories - List all categories with subcategories
    if (path === "/categories" && req.method === "GET") {
      const { data, error } = await supabase
        .from("business_categories")
        .select(`*, subcategories:business_subcategories(*)`)
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      return new Response(JSON.stringify({ categories: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /products - List products with filters
    if (path === "/products" && req.method === "GET") {
      const categoryId = url.searchParams.get("category_id");
      const status = url.searchParams.get("status");
      const search = url.searchParams.get("search");
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "20");

      let query = supabase
        .from("products")
        .select(`
          *,
          category:business_categories(id, name, icon),
          subcategory:business_subcategories(id, name),
          demo_mappings:product_demo_mappings(demo_id, demos(id, title, demo_url, status))
        `, { count: "exact" });

      if (categoryId) query = query.eq("business_category_id", categoryId);
      if (status) query = query.eq("status", status);
      if (search) query = query.ilike("product_name", `%${search}%`);

      // Non-managers only see active products
      if (!canManage) query = query.eq("status", "active");

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;
      return new Response(JSON.stringify({ products: data, total: count, page, limit }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /products - Create product
    if (path === "/products" && req.method === "POST") {
      if (!canEdit) {
        return new Response(JSON.stringify({ error: "Permission denied" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { name, product_type, category_id, subcategory_id, description, demo_ids } = body;

      if (!name || !category_id || !subcategory_id) {
        return new Response(JSON.stringify({ error: "Name, category, and subcategory required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: product, error } = await supabase
        .from("products")
        .insert({
          product_name: name,
          product_type: product_type || "software",
          business_category_id: category_id,
          subcategory_id,
          description,
          status: "active",
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Link demos if provided
      if (demo_ids?.length > 0) {
        const mappings = demo_ids.map((demo_id: string) => ({
          product_id: product.product_id,
          demo_id,
          linked_by: user.id,
        }));
        await supabase.from("product_demo_mappings").insert(mappings);
      }

      // Log action
      await supabase.from("product_action_logs").insert({
        product_id: product.product_id,
        product_name: name,
        action: "product_created",
        action_details: { category_id, subcategory_id, demo_ids },
        performed_by: user.id,
        performer_role: userRole,
      });

      return new Response(JSON.stringify({ success: true, product }), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT /products/:id - Update product
    if (path.startsWith("/products/") && req.method === "PUT") {
      if (!canEdit) {
        return new Response(JSON.stringify({ error: "Permission denied" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const productId = path.split("/")[2];
      const { name, product_type, category_id, subcategory_id, description, status, demo_ids } = body;

      const updateData: Record<string, unknown> = {};
      if (name) updateData.product_name = name;
      if (product_type) updateData.product_type = product_type;
      if (category_id) updateData.business_category_id = category_id;
      if (subcategory_id) updateData.subcategory_id = subcategory_id;
      if (description !== undefined) updateData.description = description;
      if (status) updateData.status = status;

      const { data: product, error } = await supabase
        .from("products")
        .update(updateData)
        .eq("product_id", productId)
        .select()
        .single();

      if (error) throw error;

      // Update demo mappings if provided
      if (demo_ids !== undefined) {
        await supabase.from("product_demo_mappings").delete().eq("product_id", productId);
        if (demo_ids.length > 0) {
          const mappings = demo_ids.map((demo_id: string) => ({
            product_id: productId,
            demo_id,
            linked_by: user.id,
          }));
          await supabase.from("product_demo_mappings").insert(mappings);
        }
      }

      // Log action
      await supabase.from("product_action_logs").insert({
        product_id: productId,
        product_name: product.product_name,
        action: "product_updated",
        action_details: { changes: updateData, demo_ids },
        performed_by: user.id,
        performer_role: userRole,
      });

      return new Response(JSON.stringify({ success: true, product }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE /products/:id - Delete product
    if (path.startsWith("/products/") && req.method === "DELETE") {
      if (!canEdit) {
        return new Response(JSON.stringify({ error: "Permission denied" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const productId = path.split("/")[2];

      const { data: product } = await supabase
        .from("products")
        .select("product_name")
        .eq("product_id", productId)
        .single();

      await supabase.from("product_demo_mappings").delete().eq("product_id", productId);

      const { error } = await supabase.from("products").delete().eq("product_id", productId);
      if (error) throw error;

      // Log action
      await supabase.from("product_action_logs").insert({
        product_id: productId,
        product_name: product?.product_name || "Unknown",
        action: "product_deleted",
        action_details: {},
        performed_by: user.id,
        performer_role: userRole,
      });

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /logs - Get product action logs
    if (path === "/logs" && req.method === "GET") {
      if (!canManage) {
        return new Response(JSON.stringify({ error: "Permission denied" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabase
        .from("product_action_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return new Response(JSON.stringify({ logs: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
