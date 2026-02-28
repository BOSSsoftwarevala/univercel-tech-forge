// Notifications Settings API for Software Vala
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
        "Access-Control-Allow-Methods": "GET, PATCH, OPTIONS",
      },
    });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace("/api-notifications", "");

  // GET /settings - Retrieve current notification settings for the authenticated user
  if (path === "/settings" && req.method === "GET") {
    return withAuth(req, [], async ({ supabaseAdmin, user }) => {
      const { data, error } = await supabaseAdmin
        .from("notification_settings")
        .select("*")
        .eq("user_id", user.userId)
        .single();

      if (error && error.code !== "PGRST116") {
        return errorResponse(error.message, 400);
      }

      // Return defaults if no record exists yet
      const defaults = {
        user_id: user.userId,
        email_enabled: true,
        sms_enabled: false,
        push_enabled: true,
        in_app_enabled: true,
        lead_alerts: true,
        task_alerts: true,
        payment_alerts: true,
        system_alerts: true,
        marketing_emails: false,
        digest_frequency: "daily",
        quiet_hours_start: null,
        quiet_hours_end: null,
      };

      return jsonResponse({ settings: data || defaults });
    }, { module: "notifications", action: "get_settings" });
  }

  // PATCH /settings - Save/update notification settings for the authenticated user
  if (path === "/settings" && (req.method === "PATCH" || req.method === "POST")) {
    return withAuth(req, [], async ({ supabaseAdmin, body, user }) => {
      if (!body || Object.keys(body).length === 0) {
        return errorResponse("No settings provided to update", 400);
      }

      const allowedFields = [
        "email_enabled",
        "sms_enabled",
        "push_enabled",
        "in_app_enabled",
        "lead_alerts",
        "task_alerts",
        "payment_alerts",
        "system_alerts",
        "marketing_emails",
        "digest_frequency",
        "quiet_hours_start",
        "quiet_hours_end",
      ];

      // Filter to only allowed fields to prevent injection
      const updateData: Record<string, any> = { user_id: user.userId, updated_at: new Date().toISOString() };
      for (const field of allowedFields) {
        if (field in body) {
          updateData[field] = body[field];
        }
      }

      const { data, error } = await supabaseAdmin
        .from("notification_settings")
        .upsert(updateData, { onConflict: "user_id" })
        .select()
        .single();

      if (error) return errorResponse(error.message, 400);

      await createAuditLog(supabaseAdmin, user.userId, user.role, "notifications", "settings_updated", {
        updated_fields: Object.keys(updateData).filter((k) => k !== "user_id" && k !== "updated_at"),
      });

      return jsonResponse({ message: "Notification settings saved", settings: data });
    }, { module: "notifications", action: "save_settings" });
  }

  return errorResponse("Not found", 404);
});
