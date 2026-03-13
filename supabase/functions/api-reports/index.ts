// Reports Export API for Software Vala
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  jsonResponse,
  errorResponse,
  validateRequired,
  createAuditLog,
} from "../_shared/utils.ts";
import { withAuth } from "../_shared/middleware.ts";

// Convert array of objects to CSV string
function toCSV(rows: Record<string, any>[]): string {
  if (!rows || rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const csvRows = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const val = row[h];
          if (val === null || val === undefined) return "";
          const str = String(val);
          return str.includes(",") || str.includes('"') || str.includes("\n")
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        })
        .join(",")
    ),
  ];
  return csvRows.join("\n");
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
    });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace("/api-reports", "");

  // POST /export - Export report data
  if (path === "/export" && req.method === "POST") {
    return withAuth(
      req,
      ["boss_owner", "ceo", "admin", "finance_manager", "performance_manager", "hr_manager"],
      async ({ supabaseAdmin, body, user }) => {
        const validation = validateRequired(body, ["report_type", "format"]);
        if (validation) return errorResponse(validation);

        const { report_type, format, filters = {}, date_from, date_to } = body;

        const allowedFormats = ["csv", "json"];
        if (!allowedFormats.includes(format)) {
          return errorResponse(`Unsupported format. Use: ${allowedFormats.join(", ")}`, 400);
        }

        let reportData: Record<string, any>[] = [];
        let reportTitle = report_type;

        switch (report_type) {
          case "leads": {
            let q = supabaseAdmin.from("leads").select("id, name, email, phone, status, source, created_at");
            if (date_from) q = q.gte("created_at", date_from);
            if (date_to) q = q.lte("created_at", date_to);
            if (filters.status) q = q.eq("status", filters.status);
            const { data, error } = await q.order("created_at", { ascending: false });
            if (error) return errorResponse(error.message, 400);
            reportData = data || [];
            reportTitle = "Leads Report";
            break;
          }
          case "wallet_transactions": {
            let q = supabaseAdmin
              .from("developer_wallet_transactions")
              .select("id, user_id, amount, type, status, created_at");
            if (date_from) q = q.gte("created_at", date_from);
            if (date_to) q = q.lte("created_at", date_to);
            if (filters.status) q = q.eq("status", filters.status);
            const { data, error } = await q.order("created_at", { ascending: false });
            if (error) return errorResponse(error.message, 400);
            reportData = data || [];
            reportTitle = "Wallet Transactions Report";
            break;
          }
          case "demos": {
            let q = supabaseAdmin
              .from("demos")
              .select("id, title, status, health_score, created_at, expires_at");
            if (date_from) q = q.gte("created_at", date_from);
            if (date_to) q = q.lte("created_at", date_to);
            if (filters.status) q = q.eq("status", filters.status);
            const { data, error } = await q.order("created_at", { ascending: false });
            if (error) return errorResponse(error.message, 400);
            reportData = data || [];
            reportTitle = "Demos Report";
            break;
          }
          case "audit_logs": {
            let q = supabaseAdmin
              .from("audit_logs")
              .select("id, user_id, role, module, action, created_at");
            if (date_from) q = q.gte("created_at", date_from);
            if (date_to) q = q.lte("created_at", date_to);
            if (filters.module) q = q.eq("module", filters.module);
            const { data, error } = await q.order("created_at", { ascending: false }).limit(5000);
            if (error) return errorResponse(error.message, 400);
            reportData = data || [];
            reportTitle = "Audit Logs Report";
            break;
          }
          case "system_health": {
            let q = supabaseAdmin.from("system_health").select("*");
            if (date_from) q = q.gte("checked_at", date_from);
            if (date_to) q = q.lte("checked_at", date_to);
            const { data, error } = await q.order("checked_at", { ascending: false }).limit(1000);
            if (error) return errorResponse(error.message, 400);
            reportData = data || [];
            reportTitle = "System Health Report";
            break;
          }
          default:
            return errorResponse(
              `Unknown report_type: ${report_type}. Supported: leads, wallet_transactions, demos, audit_logs, system_health`,
              400
            );
        }

        await createAuditLog(supabaseAdmin, user.userId, user.role, "reports", "export", {
          report_type,
          format,
          row_count: reportData.length,
          date_from,
          date_to,
        });

        if (format === "csv") {
          const csv = toCSV(reportData);
          return new Response(csv, {
            status: 200,
            headers: {
              "Content-Type": "text/csv",
              "Content-Disposition": `attachment; filename="${report_type}_${new Date().toISOString().split("T")[0]}.csv"`,
              "Access-Control-Allow-Origin": "*",
            },
          });
        }

        return jsonResponse({
          report_title: reportTitle,
          report_type,
          generated_at: new Date().toISOString(),
          row_count: reportData.length,
          data: reportData,
        });
      },
      { module: "reports", action: "export" }
    );
  }

  // GET /list - List available report types
  if (path === "/list" && req.method === "GET") {
    return withAuth(
      req,
      ["boss_owner", "ceo", "admin", "finance_manager", "performance_manager", "hr_manager"],
      async () => {
        return jsonResponse({
          available_reports: [
            { type: "leads", label: "Leads Report", formats: ["csv", "json"] },
            { type: "wallet_transactions", label: "Wallet Transactions", formats: ["csv", "json"] },
            { type: "demos", label: "Demos Report", formats: ["csv", "json"] },
            { type: "audit_logs", label: "Audit Logs", formats: ["csv", "json"] },
            { type: "system_health", label: "System Health", formats: ["csv", "json"] },
          ],
        });
      },
      { module: "reports", action: "list_types" }
    );
  }

  return errorResponse("Not found", 404);
});
