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
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch metrics in parallel
    const [activitiesResult, productsResult, revenueResult] = await Promise.all([
      supabase
        .from("user_activities")
        .select("activity_type, user_id, created_at")
        .gte("created_at", thirtyDaysAgo),
      supabase
        .from("marketplace_products")
        .select("id, name, category, stars")
        .eq("is_private", false),
      supabase
        .from("orders")
        .select("amount, currency, created_at, status")
        .eq("status", "completed")
        .gte("created_at", thirtyDaysAgo),
    ]);

    const activities = activitiesResult.data || [];
    const products = productsResult.data || [];
    const orders = revenueResult.data || [];

    // Calculate metrics
    const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const uniqueUsers = new Set(activities.filter((a) => a.user_id).map((a) => a.user_id)).size;
    const recentActivities = activities.filter((a) => a.created_at >= sevenDaysAgo);
    const recentUsers = new Set(recentActivities.filter((a) => a.user_id).map((a) => a.user_id)).size;
    const retentionRate = uniqueUsers > 0 ? Math.round((recentUsers / uniqueUsers) * 100) : 0;

    const activityCounts: Record<string, number> = {};
    for (const a of activities) {
      activityCounts[a.activity_type] = (activityCounts[a.activity_type] || 0) + 1;
    }

    const conversionRate = activityCounts["view"] > 0
      ? Math.round(((activityCounts["buy"] || 0) / activityCounts["view"]) * 100 * 100) / 100
      : 0;

    // Regional performance (placeholder - real data from user profiles)
    const regionalPerformance = [
      { region: "South Asia", revenue: Math.round(totalRevenue * 0.45), users: Math.round(uniqueUsers * 0.4) },
      { region: "Southeast Asia", revenue: Math.round(totalRevenue * 0.25), users: Math.round(uniqueUsers * 0.25) },
      { region: "Middle East", revenue: Math.round(totalRevenue * 0.15), users: Math.round(uniqueUsers * 0.15) },
      { region: "Other", revenue: Math.round(totalRevenue * 0.15), users: Math.round(uniqueUsers * 0.2) },
    ];

    // System health (placeholder metrics)
    const systemHealth = {
      apiUptime: 99.9,
      avgResponseMs: 120,
      errorRate: 0.1,
      activeConnections: uniqueUsers,
    };

    // Generate AI insights if OpenAI is configured
    let aiInsights = null;
    if (OPENAI_API_KEY) {
      try {
        const insightPrompt = `You are a business intelligence AI. Given these metrics for a software marketplace:
- Total revenue (30 days): $${totalRevenue}
- Active users: ${uniqueUsers}
- Retention rate: ${retentionRate}%
- Conversion rate: ${conversionRate}%
- Total products: ${products.length}
- Top activity: ${Object.entries(activityCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "none"}

Provide 3 concise, actionable CEO insights in JSON format: {"insights": ["insight1", "insight2", "insight3"]}`;

        const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: insightPrompt }],
            max_tokens: 300,
            response_format: { type: "json_object" },
          }),
        });
        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const parsed = JSON.parse(aiData.choices?.[0]?.message?.content || "{}");
          aiInsights = parsed.insights || null;
        }
      } catch (aiError) {
        console.error("AI insights error:", aiError);
      }
    }

    return new Response(JSON.stringify({
      revenue: {
        total: totalRevenue,
        currency: "USD",
        period: "last_30_days",
        ordersCount: orders.length,
      },
      users: {
        active: uniqueUsers,
        recentWeek: recentUsers,
        retentionRate,
      },
      conversion: {
        rate: conversionRate,
        funnel: activityCounts,
      },
      products: {
        total: products.length,
        byCategory: products.reduce((acc, p) => {
          acc[p.category || "Other"] = (acc[p.category || "Other"] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
      regionalPerformance,
      systemHealth,
      aiInsights,
      generatedAt: now.toISOString(),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("CEO dashboard error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
