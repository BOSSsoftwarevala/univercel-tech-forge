import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const id = pathParts[pathParts.length - 1];
    const categoryId = url.searchParams.get("category_id");

    switch (req.method) {
      case "GET": {
        // List subcategories, optionally filtered by category_id
        let query = supabaseClient
          .from("subcategories")
          .select("*, categories(name, modules(name))")
          .order("created_at", { ascending: false });

        if (categoryId) {
          query = query.eq("category_id", categoryId);
        }

        const { data: subcategories, error: listError } = await query;

        if (listError) throw listError;

        return new Response(JSON.stringify(subcategories), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "POST": {
        // Create new subcategory
        const { name, description, category_id } = await req.json();

        if (!name || !category_id) {
          return new Response(JSON.stringify({ error: "Name and category_id are required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { data: user } = await supabaseClient.auth.getUser();
        if (!user.user) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { data: newSubcategory, error: createError } = await supabaseClient
          .from("subcategories")
          .insert({
            name,
            description,
            category_id,
            created_by: user.user.id,
          })
          .select("*, categories(name, modules(name))")
          .single();

        if (createError) throw createError;

        return new Response(JSON.stringify(newSubcategory), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "PUT": {
        // Update subcategory
        if (!id || id === "subcategories-crud") {
          return new Response(JSON.stringify({ error: "Subcategory ID required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const updateData = await req.json();
        const { data: updatedSubcategory, error: updateError } = await supabaseClient
          .from("subcategories")
          .update(updateData)
          .eq("id", id)
          .select("*, categories(name, modules(name))")
          .single();

        if (updateError) throw updateError;

        return new Response(JSON.stringify(updatedSubcategory), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "DELETE": {
        // Delete subcategory
        if (!id || id === "subcategories-crud") {
          return new Response(JSON.stringify({ error: "Subcategory ID required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { error: deleteError } = await supabaseClient
          .from("subcategories")
          .delete()
          .eq("id", id);

        if (deleteError) throw deleteError;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default: {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});