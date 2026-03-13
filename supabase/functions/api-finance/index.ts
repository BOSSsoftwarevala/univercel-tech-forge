// Finance API for Software Vala - Commission Management
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  jsonResponse,
  errorResponse,
  validateRequired,
  createAuditLog,
  isValidUUID,
} from "../_shared/utils.ts";
import { withAuth } from "../_shared/middleware.ts";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      },
    });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace("/api-finance", "");

  // PATCH /commission/approve - Approve a commission payment
  if (path === "/commission/approve" && (req.method === "PATCH" || req.method === "POST")) {
    return withAuth(
      req,
      ["boss_owner", "ceo", "admin", "finance_manager"],
      async ({ supabaseAdmin, body, user }) => {
        const validation = validateRequired(body, ["commission_id"]);
        if (validation) return errorResponse(validation);

        const { commission_id, notes } = body;

        if (!isValidUUID(commission_id)) {
          return errorResponse("Invalid commission_id format", 400);
        }

        // Fetch the commission record
        const { data: commission, error: fetchError } = await supabaseAdmin
          .from("commissions")
          .select("*")
          .eq("id", commission_id)
          .single();

        if (fetchError || !commission) {
          return errorResponse("Commission record not found", 404);
        }

        if (commission.status !== "pending") {
          return errorResponse(`Commission is already ${commission.status}`, 409);
        }

        // Approve the commission
        const { error: updateError } = await supabaseAdmin
          .from("commissions")
          .update({
            status: "approved",
            approved_by: user.userId,
            approved_at: new Date().toISOString(),
            notes: notes || commission.notes,
          })
          .eq("id", commission_id);

        if (updateError) return errorResponse(updateError.message, 400);

        await createAuditLog(supabaseAdmin, user.userId, user.role, "finance", "commission_approved", {
          commission_id,
          amount: commission.amount,
          payee_id: commission.payee_id,
        });

        return jsonResponse({
          message: "Commission approved successfully",
          commission_id,
          amount: commission.amount,
          status: "approved",
        });
      },
      { module: "finance", action: "commission_approve" }
    );
  }

  // PATCH /commission/reject - Reject a commission payment
  if (path === "/commission/reject" && (req.method === "PATCH" || req.method === "POST")) {
    return withAuth(
      req,
      ["boss_owner", "ceo", "admin", "finance_manager"],
      async ({ supabaseAdmin, body, user }) => {
        const validation = validateRequired(body, ["commission_id", "reason"]);
        if (validation) return errorResponse(validation);

        const { commission_id, reason } = body;

        if (!isValidUUID(commission_id)) {
          return errorResponse("Invalid commission_id format", 400);
        }

        const { data: commission, error: fetchError } = await supabaseAdmin
          .from("commissions")
          .select("*")
          .eq("id", commission_id)
          .single();

        if (fetchError || !commission) {
          return errorResponse("Commission record not found", 404);
        }

        if (commission.status !== "pending") {
          return errorResponse(`Commission is already ${commission.status}`, 409);
        }

        const { error: updateError } = await supabaseAdmin
          .from("commissions")
          .update({
            status: "rejected",
            rejected_by: user.userId,
            rejected_at: new Date().toISOString(),
            rejection_reason: reason,
          })
          .eq("id", commission_id);

        if (updateError) return errorResponse(updateError.message, 400);

        await createAuditLog(supabaseAdmin, user.userId, user.role, "finance", "commission_rejected", {
          commission_id,
          reason,
          payee_id: commission.payee_id,
        });

        return jsonResponse({
          message: "Commission rejected",
          commission_id,
          status: "rejected",
        });
      },
      { module: "finance", action: "commission_reject" }
    );
  }

  // GET /commission/pending - List pending commissions
  if (path === "/commission/pending" && req.method === "GET") {
    return withAuth(
      req,
      ["boss_owner", "ceo", "admin", "finance_manager"],
      async ({ supabaseAdmin }) => {
        const { data, error } = await supabaseAdmin
          .from("commissions")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (error) return errorResponse(error.message, 400);

        return jsonResponse({ commissions: data || [], total: (data || []).length });
      },
      { module: "finance", action: "list_pending_commissions" }
    );
  }

  // GET /commission - List all commissions with optional filters
  if (path === "/commission" && req.method === "GET") {
    return withAuth(
      req,
      ["boss_owner", "ceo", "admin", "finance_manager"],
      async ({ supabaseAdmin }) => {
        const status = url.searchParams.get("status");
        const payee_id = url.searchParams.get("payee_id");

        let query = supabaseAdmin.from("commissions").select("*");
        if (status) query = query.eq("status", status);
        if (payee_id) query = query.eq("payee_id", payee_id);

        const { data, error } = await query.order("created_at", { ascending: false });
        if (error) return errorResponse(error.message, 400);

        return jsonResponse({ commissions: data || [], total: (data || []).length });
      },
      { module: "finance", action: "list_commissions" }
    );
  }

  return errorResponse("Not found", 404);
});
