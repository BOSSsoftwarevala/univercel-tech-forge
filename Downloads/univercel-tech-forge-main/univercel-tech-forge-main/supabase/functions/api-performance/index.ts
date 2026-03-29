// Performance & Analytics API for Software Vala
import {
  withEnhancedMiddleware,
  applyMasking,
} from "../_shared/enhanced-middleware.ts";
import {
  jsonResponse,
  errorResponse,
} from "../_shared/utils.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api-performance", "");
  const method = req.method;

  // GET /performance - System overview
  if (method === "GET" && path === "") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const period = url.searchParams.get("period") || "month";
      
      const now = new Date();
      let startDate: Date;
      switch (period) {
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "year":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // Get various metrics
      const [
        { count: totalLeads },
        { count: closedLeads },
        { count: activeTasks },
        { count: completedTasks },
        { data: developers },
        { data: revenue },
      ] = await Promise.all([
        ctx.supabaseAdmin.from("leads").select("*", { count: "exact", head: true }).gte("created_at", startDate.toISOString()),
        ctx.supabaseAdmin.from("leads").select("*", { count: "exact", head: true }).eq("status", "closed").gte("created_at", startDate.toISOString()),
        ctx.supabaseAdmin.from("developer_tasks").select("*", { count: "exact", head: true }).eq("status", "in_progress"),
        ctx.supabaseAdmin.from("developer_tasks").select("*", { count: "exact", head: true }).eq("status", "completed").gte("completed_at", startDate.toISOString()),
        ctx.supabaseAdmin.from("developers").select("id, status, availability_status"),
        ctx.supabaseAdmin.from("invoices").select("amount, status").eq("status", "paid").gte("created_at", startDate.toISOString()),
      ]);

      const metrics = {
        period,
        leads: {
          total: totalLeads || 0,
          closed: closedLeads || 0,
          conversion_rate: totalLeads ? ((closedLeads || 0) / totalLeads * 100).toFixed(1) + "%" : "0%",
        },
        tasks: {
          active: activeTasks || 0,
          completed: completedTasks || 0,
        },
        developers: {
          total: developers?.length || 0,
          active: developers?.filter((d: any) => d.status === "active").length || 0,
          available: developers?.filter((d: any) => d.availability_status === "available").length || 0,
        },
        revenue: {
          total: revenue?.reduce((sum: number, r: any) => sum + Number(r.amount), 0) || 0,
          transactions: revenue?.length || 0,
        },
      };

      return jsonResponse(metrics);
    }, {
      module: "performance",
      action: "view_overview",
      allowedRoles: ["super_admin", "admin", "performance_manager"],
    });
  }

  // GET /performance/dev - Developer performance
  if (method === "GET" && path === "/dev") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const developerId = url.searchParams.get("developer_id");
      const period = url.searchParams.get("period") || "month";

      const now = new Date();
      let startDate: Date;
      switch (period) {
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "year":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      let query = ctx.supabaseAdmin.from("developers").select(`
        id,
        masked_email,
        status,
        availability_status,
        developer_tasks(
          id, status, quality_score, client_rating, task_amount, penalty_amount,
          started_at, completed_at, promised_delivery_at, actual_delivery_at
        ),
        dev_performance(
          final_score, score_speed, score_delivery, score_behavior
        ),
        developer_violations(
          id, violation_type, severity, penalty_amount
        )
      `);

      if (developerId) {
        query = query.eq("id", developerId);
      }

      const { data: developers, error } = await query;
      if (error) return errorResponse("Unable to retrieve developer performance.");

      const performanceData = (developers || []).map((dev: any) => {
        const tasks = dev.developer_tasks || [];
        const completedTasks = tasks.filter((t: any) => t.status === "completed");
        const onTimeTasks = completedTasks.filter((t: any) => 
          new Date(t.actual_delivery_at) <= new Date(t.promised_delivery_at)
        );
        
        const latestScore = dev.dev_performance?.[0];
        const violations = dev.developer_violations || [];

        return {
          developer_id: dev.id,
          masked_email: dev.masked_email,
          status: dev.status,
          availability: dev.availability_status,
          metrics: {
            total_tasks: tasks.length,
            completed_tasks: completedTasks.length,
            on_time_delivery_rate: completedTasks.length 
              ? ((onTimeTasks.length / completedTasks.length) * 100).toFixed(1) + "%"
              : "N/A",
            avg_quality_score: completedTasks.length
              ? (completedTasks.reduce((sum: number, t: any) => sum + (t.quality_score || 0), 0) / completedTasks.length).toFixed(1)
              : "N/A",
            avg_client_rating: completedTasks.length
              ? (completedTasks.reduce((sum: number, t: any) => sum + (t.client_rating || 0), 0) / completedTasks.length).toFixed(1)
              : "N/A",
            total_earnings: completedTasks.reduce((sum: number, t: any) => sum + Number(t.task_amount || 0), 0),
            total_penalties: violations.reduce((sum: number, v: any) => sum + Number(v.penalty_amount || 0), 0),
          },
          scores: latestScore ? {
            overall: latestScore.final_score,
            speed: latestScore.score_speed,
            delivery: latestScore.score_delivery,
            behavior: latestScore.score_behavior,
          } : null,
          violations: {
            total: violations.length,
            by_severity: {
              warning: violations.filter((v: any) => v.severity === "warning").length,
              minor: violations.filter((v: any) => v.severity === "minor").length,
              major: violations.filter((v: any) => v.severity === "major").length,
            },
          },
        };
      });

      return jsonResponse({
        period,
        developers: performanceData,
        summary: {
          total_developers: performanceData.length,
        avg_delivery_rate: performanceData.length
          ? (performanceData.reduce((sum: number, d: any) => {
              const rate = parseFloat(d.metrics.on_time_delivery_rate);
              return sum + (isNaN(rate) ? 0 : rate);
            }, 0) / performanceData.length).toFixed(1) + "%"
          : "N/A",
      },
      });
    }, {
      module: "performance",
      action: "view_developer_performance",
      allowedRoles: ["super_admin", "admin", "performance_manager", "task_manager"],
    });
  }

  // GET /performance/sales
  if (method === "GET" && path === "/sales") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const period = url.searchParams.get("period") || "month";

      const now = new Date();
      let startDate: Date;
      switch (period) {
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "year":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // Get sales data
      const { data: leads } = await ctx.supabaseAdmin
        .from("leads")
        .select("*")
        .gte("created_at", startDate.toISOString());

      const { data: invoices } = await ctx.supabaseAdmin
        .from("invoices")
        .select("*")
        .gte("created_at", startDate.toISOString());

      const salesMetrics = {
        period,
        leads: {
          total: leads?.length || 0,
          by_status: {
            new: leads?.filter((l: any) => l.status === "new").length || 0,
            contacted: leads?.filter((l: any) => l.status === "contacted").length || 0,
            qualified: leads?.filter((l: any) => l.status === "qualified").length || 0,
            closed: leads?.filter((l: any) => l.status === "closed").length || 0,
            lost: leads?.filter((l: any) => l.status === "lost").length || 0,
          },
          conversion_funnel: {
            new_to_contacted: leads?.length 
              ? ((leads.filter((l: any) => l.status !== "new").length / leads.length) * 100).toFixed(1) + "%"
              : "0%",
            contacted_to_qualified: leads?.filter((l: any) => l.status !== "new").length
              ? ((leads.filter((l: any) => ["qualified", "closed"].includes(l.status)).length / leads.filter((l: any) => l.status !== "new").length) * 100).toFixed(1) + "%"
              : "0%",
            qualified_to_closed: leads?.filter((l: any) => l.status === "qualified" || l.status === "closed").length
              ? ((leads.filter((l: any) => l.status === "closed").length / leads.filter((l: any) => ["qualified", "closed"].includes(l.status)).length) * 100).toFixed(1) + "%"
              : "0%",
          },
        },
        revenue: {
          total: invoices?.reduce((sum: number, i: any) => sum + Number(i.amount), 0) || 0,
          paid: invoices?.filter((i: any) => i.status === "paid").reduce((sum: number, i: any) => sum + Number(i.amount), 0) || 0,
          pending: invoices?.filter((i: any) => i.status === "pending").reduce((sum: number, i: any) => sum + Number(i.amount), 0) || 0,
          overdue: invoices?.filter((i: any) => i.status === "overdue").reduce((sum: number, i: any) => sum + Number(i.amount), 0) || 0,
        },
      };

      return jsonResponse(salesMetrics);
    }, {
      module: "performance",
      action: "view_sales_performance",
      allowedRoles: ["super_admin", "admin", "performance_manager", "sales", "lead_manager"],
    });
  }

  // GET /performance/reseller
  if (method === "GET" && path === "/reseller") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const { data: resellers } = await ctx.supabaseAdmin
        .from("reseller_accounts")
        .select(`
          id,
          reseller_code,
          masked_email,
          status,
          reseller_commissions(commission_amount, status),
          demo_rental_links(current_views)
        `);

      const performanceData = (resellers || []).map((reseller: any) => ({
        reseller_id: reseller.id,
        code: reseller.reseller_code,
        masked_email: reseller.masked_email,
        status: reseller.status,
        metrics: {
          total_commissions: reseller.reseller_commissions?.reduce((sum: number, c: any) => sum + Number(c.commission_amount || 0), 0) || 0,
          pending_commissions: reseller.reseller_commissions
            ?.filter((c: any) => c.status === "pending")
            ?.reduce((sum: number, c: any) => sum + Number(c.commission_amount || 0), 0) || 0,
          total_demo_views: reseller.demo_rental_links?.reduce((sum: number, l: any) => sum + (l.current_views || 0), 0) || 0,
        },
      }));

      return jsonResponse({
        resellers: performanceData,
        summary: {
          total_resellers: performanceData.length,
          active: performanceData.filter((r: any) => r.status === "active").length,
          total_commissions: performanceData.reduce((sum: number, r: any) => sum + r.metrics.total_commissions, 0),
        },
      });
    }, {
      module: "performance",
      action: "view_reseller_performance",
      allowedRoles: ["super_admin", "admin", "performance_manager", "franchise"],
    });
  }

  // GET /performance/franchise
  if (method === "GET" && path === "/franchise") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const { data: franchises } = await ctx.supabaseAdmin
        .from("franchise_accounts")
        .select(`
          id,
          franchise_code,
          business_name,
          masked_email,
          status,
          sales_target_monthly,
          franchise_leads(status),
          franchise_commissions(commission_amount, status),
          franchise_territories(territory_name)
        `);

      const performanceData = (franchises || []).map((franchise: any) => {
        const leads = franchise.franchise_leads || [];
        const commissions = franchise.franchise_commissions || [];
        const closedLeads = leads.filter((l: any) => l.status === "closed").length;
        const totalCommissions = commissions
          .filter((c: any) => c.status === "credited")
          .reduce((sum: number, c: any) => sum + Number(c.commission_amount || 0), 0);

        return {
          franchise_id: franchise.id,
          code: franchise.franchise_code,
          business_name: franchise.business_name,
          masked_email: franchise.masked_email,
          status: franchise.status,
          territories: franchise.franchise_territories?.map((t: any) => t.territory_name) || [],
          metrics: {
            total_leads: leads.length,
            closed_leads: closedLeads,
            conversion_rate: leads.length ? ((closedLeads / leads.length) * 100).toFixed(1) + "%" : "0%",
            total_commissions: totalCommissions,
            monthly_target: franchise.sales_target_monthly || 0,
            target_achievement: franchise.sales_target_monthly 
              ? ((totalCommissions / franchise.sales_target_monthly) * 100).toFixed(1) + "%"
              : "N/A",
          },
        };
      });

      return jsonResponse({
        franchises: performanceData,
        summary: {
          total_franchises: performanceData.length,
          active: performanceData.filter((f: any) => f.status === "active").length,
          total_commissions: performanceData.reduce((sum: number, f: any) => sum + f.metrics.total_commissions, 0),
        },
      });
    }, {
      module: "performance",
      action: "view_franchise_performance",
      allowedRoles: ["super_admin", "admin", "performance_manager"],
    });
  }

  return errorResponse("Endpoint not found", 404);
});
