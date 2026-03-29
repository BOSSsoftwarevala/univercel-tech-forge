// AIRA Executive Report Generator
// Produces Daily / Weekly / Monthly intelligence reports using AI analysis

import { corsHeaders, getSupabaseAdmin, getSupabaseClient, getUserFromToken, createAuditLog } from "../_shared/utils.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportType } = await req.json(); // "daily" | "weekly" | "monthly"
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const supabaseAdmin = getSupabaseAdmin();

    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Auth
    const authHeader = req.headers.get("Authorization") || "";
    let user: { userId: string; role: string; email: string } | null = null;
    try {
      if (authHeader.startsWith("Bearer ")) {
        const supabaseUser = getSupabaseClient(authHeader);
        user = await getUserFromToken(supabaseUser);
      }
    } catch { user = null; }

    // Gather live metrics
    const db = supabaseAdmin;
    const [usersRes, ordersRes, serversRes, alertsRes, auditRes, activityRes, approvalsRes] = await Promise.all([
      db.from("profiles").select("id", { count: "exact", head: true }),
      db.from("marketplace_orders").select("id, final_amount, created_at, status"),
      db.from("server_instances").select("id, status, server_name", { count: "exact" }),
      db.from("system_alerts").select("id, alert_type, severity, created_at").order("created_at", { ascending: false }).limit(50),
      db.from("audit_logs").select("id, module, action, timestamp").order("timestamp", { ascending: false }).limit(100),
      db.from("activity_log").select("id, action_type, severity_level, created_at").order("created_at", { ascending: false }).limit(100),
      db.from("approvals").select("id, status, request_type").eq("status", "pending"),
    ]);

    const totalUsers = usersRes.count || 0;
    const orders = ordersRes.data || [];
    const totalRevenue = orders.reduce((s: number, o: any) => s + (Number(o.final_amount) || 0), 0);
    const runningServers = (serversRes.data || []).filter((s: any) => s.status === "running").length;
    const totalServers = serversRes.count || 0;
    const alerts = alertsRes.data || [];
    const criticalAlerts = alerts.filter((a: any) => a.severity === "critical" || a.severity === "emergency").length;
    const pendingApprovals = (approvalsRes.data || []).length;
    const auditEvents = (auditRes.data || []).length;
    const recentActivity = (activityRes.data || []).slice(0, 10);

    const metricsContext = `
LIVE SYSTEM METRICS:
- Total Users: ${totalUsers}
- Total Revenue: ₹${totalRevenue.toLocaleString()}
- Total Orders: ${orders.length}
- Running Servers: ${runningServers}/${totalServers}
- Critical Alerts: ${criticalAlerts}
- Pending Approvals: ${pendingApprovals}
- Audit Events (recent): ${auditEvents}
- Recent Activity: ${recentActivity.map((a: any) => `${a.action_type} [${a.severity_level || 'info'}]`).join(", ")}
- Alert Types: ${alerts.slice(0, 10).map((a: any) => `${a.alert_type} (${a.severity})`).join(", ") || "None"}
`;

    const reportPrompts: Record<string, string> = {
      daily: `Generate a DAILY SYSTEM INTELLIGENCE REPORT for the CEO of Software Vala.

${metricsContext}

Structure the report as:
# Daily System Intelligence Report — ${new Date().toLocaleDateString()}

## 1. System Health
- Overall status assessment
- Service availability summary
- Performance metrics

## 2. Operational Alerts
- Critical issues requiring attention
- Warning-level issues
- Resolved issues

## 3. Deployment Summary
- Active servers and their status
- Recent deployments
- Infrastructure changes

## 4. Marketplace Activity
- Orders processed
- Revenue generated
- Product performance

Keep it concise, data-driven, and actionable.`,

      weekly: `Generate a WEEKLY GROWTH ANALYSIS report for the CEO of Software Vala.

${metricsContext}

Structure the report as:
# Weekly Growth Analysis — Week of ${new Date().toLocaleDateString()}

## 1. Revenue Trends
- Total revenue this period
- Revenue growth indicators
- Revenue by category insights

## 2. Product Performance
- Top performing products
- New listings
- Marketplace health

## 3. User Growth
- New user registrations
- Active user trends
- Engagement metrics

## 4. Operational Highlights
- Key achievements
- Areas of concern
- Upcoming priorities

Provide strategic insights with growth percentages where applicable.`,

      monthly: `Generate a MONTHLY STRATEGIC REPORT for the CEO of Software Vala.

${metricsContext}

Structure the report as:
# Monthly Strategic Report — ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}

## 1. Market Expansion Insights
- Geographic reach assessment
- New market opportunities
- Competitive positioning

## 2. Product Success Analysis
- Product portfolio performance
- Customer satisfaction indicators
- Feature adoption rates

## 3. Risk Alerts
- Security posture assessment
- Financial risk indicators
- Operational vulnerabilities

## 4. Growth Opportunities
- Strategic recommendations
- Investment priorities
- Innovation pipeline

Provide executive-level strategic analysis with forward-looking recommendations.`,
    };

    const prompt = reportPrompts[reportType] || reportPrompts.daily;

    // Stream the report
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are AIRA, the executive AI intelligence advisor for the CEO. Generate professional, data-driven executive reports. Use the real metrics provided. Be specific with numbers." },
          { role: "user", content: prompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Audit
    try {
      await createAuditLog(supabaseAdmin, user?.userId || null, user?.role || "ceo", "aira", "aira_report_generated", { reportType });
    } catch {}

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("AIRA report error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
