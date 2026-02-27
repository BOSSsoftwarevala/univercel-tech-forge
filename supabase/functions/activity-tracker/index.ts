import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const url = new URL(req.url);
    const action = url.pathname.split("/").pop();

    if (req.method === "POST" && action !== "dashboard") {
      // Log user activity
      const {
        userId,
        sessionId,
        activityType,
        productId,
        metadata = {},
      } = await req.json();

      if (!activityType) {
        return new Response(JSON.stringify({ error: "activityType is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") || "unknown";

      const { data, error } = await supabase.from("user_activities").insert({
        user_id: userId || null,
        session_id: sessionId || null,
        activity_type: activityType,
        product_id: productId || null,
        metadata,
        client_ip: clientIP,
        user_agent: req.headers.get("user-agent") || null,
        created_at: new Date().toISOString(),
      }).select("id").single();

      if (error) {
        console.error("Activity log error:", error);
        return new Response(JSON.stringify({ error: "Failed to log activity" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ logged: true, id: data?.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET dashboard analytics
    const { data: summary, error: summaryError } = await supabase
      .from("user_activities")
      .select("activity_type, product_id, created_at")
      .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false })
      .limit(1000);

    if (summaryError) {
      console.error("Analytics query error:", summaryError);
    }

    const activities = summary || [];
    const activityCounts: Record<string, number> = {};
    const productViews: Record<string, number> = {};
    const conversionFunnel = { view: 0, click: 0, demo: 0, apply: 0, buy: 0 };

    for (const a of activities) {
      activityCounts[a.activity_type] = (activityCounts[a.activity_type] || 0) + 1;
      if (a.product_id) {
        productViews[a.product_id] = (productViews[a.product_id] || 0) + 1;
      }
      if (a.activity_type in conversionFunnel) {
        conversionFunnel[a.activity_type as keyof typeof conversionFunnel]++;
      }
    }

    return new Response(JSON.stringify({
      totalActivities: activities.length,
      activityCounts,
      topProducts: Object.entries(productViews)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([id, views]) => ({ id, views })),
      conversionFunnel,
      period: "last_30_days",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Activity tracker error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
