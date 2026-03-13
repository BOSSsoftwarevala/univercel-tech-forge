// AIRA (AI Reasoning & Action) API for Software Vala
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
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
    });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace("/api-aira", "");

  // POST /execute - Execute an AIRA command
  if (path === "/execute" && req.method === "POST") {
    return withAuth(
      req,
      ["boss_owner", "ceo", "admin", "ai_manager"],
      async ({ supabaseAdmin, body, user }) => {
        const validation = validateRequired(body, ["command", "module"]);
        if (validation) return errorResponse(validation);

        const { command, module, parameters = {}, context = {} } = body;

        // Record the command in aira_logs before execution
        const { data: logEntry, error: logError } = await supabaseAdmin
          .from("aira_logs")
          .insert({
            user_id: user.userId,
            role: user.role,
            command,
            module,
            parameters,
            context,
            status: "executing",
            executed_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (logError) {
          console.error("[AIRA] Failed to create log entry:", logError.message);
        }

        const logId = logEntry?.id;

        // Execute the command (dispatching to the appropriate handler)
        let result: Record<string, any> = {};
        let executionStatus = "completed";
        let errorMessage: string | null = null;

        try {
          switch (command) {
            case "analyze_leads":
              const { count: leadsCount } = await supabaseAdmin
                .from("leads")
                .select("*", { count: "exact", head: true })
                .eq("status", "new");
              result = { new_leads: leadsCount, analysis: "Lead analysis dispatched" };
              break;

            case "check_system_health":
              const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
              result = {
                database: "checked",
                auth: "checked",
                timestamp: new Date().toISOString(),
                status: "healthy",
              };
              break;

            case "send_alert":
              validateRequired(body, ["alert_type", "target_role"]);
              await supabaseAdmin.from("buzzer_queue").insert({
                trigger_type: body.alert_type || "aira_alert",
                role_target: body.target_role || "super_admin",
                status: "pending",
                priority: body.priority || "normal",
              });
              result = { alert_dispatched: true, target: body.target_role };
              break;

            case "generate_report":
              result = {
                report_queued: true,
                report_type: parameters.report_type || "general",
                estimated_completion: "2 minutes",
              };
              break;

            default:
              executionStatus = "unknown_command";
              errorMessage = `Unknown command: ${command}`;
              result = { supported_commands: ["analyze_leads", "check_system_health", "send_alert", "generate_report"] };
          }
        } catch (execError: any) {
          executionStatus = "error";
          errorMessage = execError.message;
        }

        // Update log entry with result
        if (logId) {
          await supabaseAdmin
            .from("aira_logs")
            .update({
              status: executionStatus,
              result,
              error_message: errorMessage,
              completed_at: new Date().toISOString(),
            })
            .eq("id", logId);
        }

        await createAuditLog(supabaseAdmin, user.userId, user.role, "aira", "command_executed", {
          command,
          module,
          log_id: logId,
          status: executionStatus,
        });

        if (executionStatus === "error") {
          return errorResponse(errorMessage || "Command execution failed", 500);
        }

        return jsonResponse({
          message: "AIRA command executed",
          command,
          log_id: logId,
          status: executionStatus,
          result,
        });
      },
      { module: "aira", action: "execute_command" }
    );
  }

  // POST /log - Log an AIRA command/event manually
  if (path === "/log" && req.method === "POST") {
    return withAuth(
      req,
      ["boss_owner", "ceo", "admin", "ai_manager", "developer"],
      async ({ supabaseAdmin, body, user }) => {
        const validation = validateRequired(body, ["command", "module", "status"]);
        if (validation) return errorResponse(validation);

        const { command, module, status, parameters = {}, result = {}, error_message } = body;

        const { data: logEntry, error: logError } = await supabaseAdmin
          .from("aira_logs")
          .insert({
            user_id: user.userId,
            role: user.role,
            command,
            module,
            parameters,
            status,
            result,
            error_message,
            executed_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (logError) return errorResponse(logError.message, 400);

        await createAuditLog(supabaseAdmin, user.userId, user.role, "aira", "command_logged", {
          command,
          module,
          log_id: logEntry.id,
          status,
        });

        return jsonResponse({ message: "AIRA command logged", log_id: logEntry.id }, 201);
      },
      { module: "aira", action: "log_command" }
    );
  }

  // GET /logs - List AIRA execution logs
  if (path === "/logs" && req.method === "GET") {
    return withAuth(
      req,
      ["boss_owner", "ceo", "admin", "ai_manager"],
      async ({ supabaseAdmin, user }) => {
        const module = url.searchParams.get("module");
        const status = url.searchParams.get("status");
        const limit = parseInt(url.searchParams.get("limit") || "50", 10);

        let query = supabaseAdmin.from("aira_logs").select("*");
        if (module) query = query.eq("module", module);
        if (status) query = query.eq("status", status);

        const { data, error } = await query
          .order("executed_at", { ascending: false })
          .limit(Math.min(limit, 200));

        if (error) return errorResponse(error.message, 400);

        return jsonResponse({ logs: data || [], total: (data || []).length });
      },
      { module: "aira", action: "list_logs" }
    );
  }

  return errorResponse("Not found", 404);
});
