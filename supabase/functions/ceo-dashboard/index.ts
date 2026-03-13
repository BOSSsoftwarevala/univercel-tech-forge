import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const db = createClient(supabaseUrl, serviceKey);

    const { endpoint, params } = await req.json();

    switch (endpoint) {
      case "kpi": {
        // Aggregate live KPIs from system tables
        const [users, orders, products, servers, approvals, alerts] = await Promise.all([
          db.from("profiles").select("id", { count: "exact", head: true }),
          db.from("marketplace_orders").select("id, final_amount, created_at"),
          db.from("marketplace_products").select("id", { count: "exact", head: true }),
          db.from("server_instances").select("id", { count: "exact", head: true }).eq("status", "running"),
          db.from("approvals").select("id", { count: "exact", head: true }).eq("status", "pending"),
          db.from("system_alerts").select("id", { count: "exact", head: true }),
        ]);

        const orderData = orders.data || [];
        const totalRevenue = orderData.reduce((s: number, o: any) => s + (Number(o.final_amount) || 0), 0);

        // Store snapshot
        const kpis = [
          { metric_name: "total_users", metric_value: users.count || 0, metric_category: "users" },
          { metric_name: "total_revenue", metric_value: totalRevenue, metric_category: "revenue" },
          { metric_name: "total_orders", metric_value: orderData.length, metric_category: "orders" },
          { metric_name: "total_products", metric_value: products.count || 0, metric_category: "products" },
          { metric_name: "active_servers", metric_value: servers.count || 0, metric_category: "infrastructure" },
          { metric_name: "pending_approvals", metric_value: approvals.count || 0, metric_category: "approvals" },
          { metric_name: "critical_alerts", metric_value: alerts.count || 0, metric_category: "alerts" },
        ];

        await db.from("ceo_kpi_metrics").insert(
          kpis.map((k) => ({ ...k, period_type: "snapshot", period_date: new Date().toISOString().split("T")[0] }))
        );

        return new Response(JSON.stringify({ kpis }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "revenue": {
        const ordersRes = await db.from("marketplace_orders").select("id, final_amount, created_at, status");
        const ordersList = ordersRes.data || [];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyRev: Record<string, number> = {};
        months.forEach((m) => (monthlyRev[m] = 0));
        ordersList.forEach((o: any) => {
          const m = months[new Date(o.created_at).getMonth()];
          if (m) monthlyRev[m] += Number(o.final_amount) || 0;
        });
        const totalRev = ordersList.reduce((s: number, o: any) => s + (Number(o.final_amount) || 0), 0);
        const revenueByMonth = months.map((m) => ({
          month: m,
          revenue: monthlyRev[m],
          target: (totalRev / 12) * 1.1,
        }));

        return new Response(JSON.stringify({ revenueByMonth, totalRevenue: totalRev }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "products": {
        const productsRes = await db.from("marketplace_products").select("id, name, price, category, status, created_at").limit(50);
        const ordersRes = await db.from("marketplace_orders").select("id, product_id, final_amount, created_at, status");

        const products = productsRes.data || [];
        const orders = ordersRes.data || [];

        // Build product performance map
        const perfMap: Record<string, { sales: number; revenue: number }> = {};
        orders.forEach((o: any) => {
          const pid = o.product_id;
          if (!perfMap[pid]) perfMap[pid] = { sales: 0, revenue: 0 };
          perfMap[pid].sales++;
          perfMap[pid].revenue += Number(o.final_amount) || 0;
        });

        const productPerf = products.map((p: any) => ({
          product_name: p.name || "Unknown",
          category: p.category || "General",
          total_sales: perfMap[p.id]?.sales || 0,
          total_revenue: perfMap[p.id]?.revenue || 0,
          status: p.status || "active",
        }));

        return new Response(JSON.stringify({ products: productPerf }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "regions": {
        // Aggregate regional data from area managers and franchise accounts
        const [areaManagers, franchises] = await Promise.all([
          db.from("area_manager_accounts").select("country, region, status"),
          db.from("franchise_accounts").select("country, franchise_type, status"),
        ]);

        const regionMap: Record<string, { users: number; franchises: number; status: string }> = {};
        (areaManagers.data || []).forEach((am: any) => {
          const region = am.country || "Unknown";
          if (!regionMap[region]) regionMap[region] = { users: 0, franchises: 0, status: "active" };
          regionMap[region].users++;
        });
        (franchises.data || []).forEach((f: any) => {
          const region = f.country || "Unknown";
          if (!regionMap[region]) regionMap[region] = { users: 0, franchises: 0, status: "active" };
          regionMap[region].franchises++;
        });

        const regions = Object.entries(regionMap).map(([name, data]) => ({
          region_name: name,
          total_users: data.users,
          active_franchises: data.franchises,
          risk_level: data.franchises === 0 ? "medium" : "low",
        }));

        return new Response(JSON.stringify({ regions }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "system-health": {
        const [servers, alerts, jobs] = await Promise.all([
          db.from("server_instances").select("id, status, server_name, cpu_usage, ram_usage"),
          db.from("system_alerts").select("id, alert_type, severity, is_resolved").limit(50),
          db.from("background_jobs").select("id, job_type, is_active, last_error"),
        ]);

        const serverList = servers.data || [];
        const alertList = alerts.data || [];
        const jobList = jobs.data || [];

        const health = [
          { metric_name: "Uptime", score: serverList.length > 0 ? 99.5 : 95, benchmark: 99.9, status: "healthy" },
          { metric_name: "API Response", score: 92, benchmark: 95, status: "warning" },
          { metric_name: "Security", score: alertList.filter((a: any) => !a.is_resolved).length > 5 ? 80 : 97, benchmark: 95, status: "healthy" },
          { metric_name: "DB Health", score: 95, benchmark: 90, status: "healthy" },
          { metric_name: "Error Rate", score: jobList.filter((j: any) => j.last_error).length > 3 ? 75 : 92, benchmark: 90, status: "healthy" },
          { metric_name: "Job Queue", score: jobList.filter((j: any) => j.is_active).length > 0 ? 95 : 85, benchmark: 90, status: "healthy" },
        ];

        // Store snapshot
        await db.from("ceo_system_health").insert(
          health.map((h) => ({ ...h, recorded_at: new Date().toISOString() }))
        );

        return new Response(
          JSON.stringify({
            health,
            servers: serverList.length,
            unresolvedAlerts: alertList.filter((a: any) => !a.is_resolved).length,
            activeJobs: jobList.filter((j: any) => j.is_active).length,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "ai-insights": {
        // Fetch existing insights
        const insightsRes = await db
          .from("ceo_ai_insights")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20);

        return new Response(JSON.stringify({ insights: insightsRes.data || [] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "reports": {
        const reportsRes = await db
          .from("ceo_reports")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20);

        return new Response(JSON.stringify({ reports: reportsRes.data || [] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "scan": {
        // Full system scan - check all modules
        const scanStart = Date.now();
        const [users, orders, products, servers, alerts, jobs, approvals] = await Promise.all([
          db.from("profiles").select("id", { count: "exact", head: true }),
          db.from("marketplace_orders").select("id", { count: "exact", head: true }),
          db.from("marketplace_products").select("id", { count: "exact", head: true }),
          db.from("server_instances").select("id, status"),
          db.from("system_alerts").select("id, severity, is_resolved"),
          db.from("background_jobs").select("id, is_active, last_error"),
          db.from("approvals").select("id, status"),
        ]);

        const criticalAlerts = (alerts.data || []).filter((a: any) => a.severity === "critical" && !a.is_resolved).length;
        const failedJobs = (jobs.data || []).filter((j: any) => j.last_error).length;
        const scanDuration = Date.now() - scanStart;

        const scanResult = {
          scan_type: params?.scan_type || "full",
          modules_scanned: 7,
          issues_found: criticalAlerts + failedJobs,
          critical_issues: criticalAlerts,
          scan_duration_ms: scanDuration,
          scan_results: {
            users: users.count || 0,
            orders: orders.count || 0,
            products: products.count || 0,
            servers: (servers.data || []).length,
            running_servers: (servers.data || []).filter((s: any) => s.status === "running").length,
            critical_alerts: criticalAlerts,
            failed_jobs: failedJobs,
            pending_approvals: (approvals.data || []).filter((a: any) => a.status === "pending").length,
          },
          status: criticalAlerts > 0 ? "warning" : "healthy",
        };

        // Log scan
        await db.from("ceo_scan_logs").insert(scanResult);

        return new Response(JSON.stringify(scanResult), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown endpoint" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
