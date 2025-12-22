import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  jsonResponse,
  errorResponse,
  validateRequired,
  createAuditLog,
  createBuzzerAlert,
  maskEmail,
  maskPhone,
  maskName,
} from "../_shared/utils.ts";
import { withAuth, RequestContext } from "../_shared/middleware.ts";

serve(async (req: Request) => {
  const url = new URL(req.url);
  // Fix: Correct path replacement pattern to match edge function name
  const path = url.pathname.replace(/^\/api-leads/, "").replace(/^\/api\/leads/, "");

  // POST /leads/create
  if (path === "/create" && req.method === "POST") {
    return withAuth(req, ["super_admin", "admin", "lead_manager", "franchise", "reseller", "sales"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["name", "phone", "email"]);
      if (validation) return errorResponse(validation);

      const { data, error } = await supabaseAdmin.from("leads").insert({
        lead_name: body.name,
        masked_phone: maskPhone(body.phone),
        masked_email: maskEmail(body.email),
        phone: body.phone,
        email: body.email,
        location: body.location,
        country: body.country,
        product_interest: body.product_interest,
        source: body.source || "direct",
        quality_score: body.quality_score || 50,
        status: "new",
        created_by: user.userId,
      }).select().single();

      if (error) return errorResponse(error.message, 400);

      // Create buzzer alert for new lead
      await createBuzzerAlert(supabaseAdmin, "new_lead", "lead_manager", null, data.id, "high");

      // Log lead creation
      await supabaseAdmin.from("lead_logs").insert({
        lead_id: data.id,
        activity: "Lead created",
        performed_by_user: user.userId,
      });

      return jsonResponse({
        message: "Lead created",
        lead_id: data.id,
        buzzer: true,
      }, 201, true);
    }, { module: "leads", action: "create" });
  }

  // PUT /leads/assign
  if (path === "/assign" && req.method === "PUT") {
    return withAuth(req, ["super_admin", "admin", "lead_manager", "franchise"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["lead_id", "assigned_to_user", "assigned_to_role"]);
      if (validation) return errorResponse(validation);

      const { data, error } = await supabaseAdmin
        .from("leads")
        .update({
          assigned_to: body.assigned_to_user,
          assigned_to_role: body.assigned_to_role,
          status: "assigned",
        })
        .eq("id", body.lead_id)
        .select()
        .single();

      if (error) return errorResponse(error.message, 400);

      // Create buzzer for assigned user
      await createBuzzerAlert(supabaseAdmin, "lead_assigned", body.assigned_to_role, null, data.id, "normal");

      await supabaseAdmin.from("lead_logs").insert({
        lead_id: body.lead_id,
        activity: `Lead assigned to ${body.assigned_to_role}`,
        performed_by_user: user.userId,
      });

      return jsonResponse({
        message: "Lead assigned",
        lead_id: data.id,
        assigned_to: body.assigned_to_role,
        buzzer: true,
      }, 200, true);
    }, { module: "leads", action: "assign" });
  }

  // PUT /leads/status
  if (path === "/status" && req.method === "PUT") {
    return withAuth(req, ["super_admin", "admin", "lead_manager", "franchise", "reseller", "sales"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["lead_id", "status"]);
      if (validation) return errorResponse(validation);

      const validStatuses = ["new", "assigned", "contacted", "qualified", "proposal", "negotiation", "won", "lost"];
      if (!validStatuses.includes(body.status)) {
        return errorResponse(`Invalid status. Use: ${validStatuses.join(", ")}`);
      }

      const { data, error } = await supabaseAdmin
        .from("leads")
        .update({ status: body.status })
        .eq("id", body.lead_id)
        .select()
        .single();

      if (error) return errorResponse(error.message, 400);

      await supabaseAdmin.from("lead_logs").insert({
        lead_id: body.lead_id,
        activity: `Status changed to ${body.status}`,
        performed_by_user: user.userId,
      });

      return jsonResponse({
        message: "Lead status updated",
        lead_id: data.id,
        status: body.status,
      });
    }, { module: "leads", action: "status_update" });
  }

  // POST /leads/convert
  if (path === "/convert" && req.method === "POST") {
    return withAuth(req, ["super_admin", "admin", "lead_manager", "franchise", "reseller", "sales"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["lead_id", "product_id", "revenue"]);
      if (validation) return errorResponse(validation);

      // Calculate commission based on role
      let commissionRate = 0.05; // 5% default
      if (user.role === "franchise") commissionRate = 0.15;
      if (user.role === "reseller") commissionRate = 0.10;

      const commission = body.revenue * commissionRate;

      const { data, error } = await supabaseAdmin.from("lead_conversions").insert({
        lead_id: body.lead_id,
        product_id: body.product_id,
        revenue: body.revenue,
        commission,
        converted_by: user.userId,
      }).select().single();

      if (error) return errorResponse(error.message, 400);

      // Update lead status
      await supabaseAdmin
        .from("leads")
        .update({ status: "won" })
        .eq("id", body.lead_id);

      // Add commission to user's wallet
      const { data: wallet } = await supabaseAdmin
        .from("wallets")
        .select("*")
        .eq("user_id", user.userId)
        .single();

      if (wallet) {
        await supabaseAdmin
          .from("wallets")
          .update({ balance: wallet.balance + commission })
          .eq("wallet_id", wallet.wallet_id);

        await supabaseAdmin.from("transactions").insert({
          wallet_id: wallet.wallet_id,
          type: "commission",
          amount: commission,
          reference: `Lead ${body.lead_id} conversion`,
          related_user: user.userId,
          related_role: user.role,
          related_sale: data.conversion_id,
        });
      }

      await supabaseAdmin.from("lead_logs").insert({
        lead_id: body.lead_id,
        activity: `Lead converted with revenue ${body.revenue}`,
        performed_by_user: user.userId,
      });

      return jsonResponse({
        message: "Lead converted successfully",
        conversion_id: data.conversion_id,
        revenue: body.revenue,
        commission,
      }, 201);
    }, { module: "leads", action: "convert" });
  }

  // GET /leads/buzzer
  if (path === "/buzzer" && req.method === "GET") {
    return withAuth(req, [], async ({ supabaseAdmin, user }) => {
      const { data: buzzers } = await supabaseAdmin
        .from("buzzer_queue")
        .select("*")
        .eq("role_target", user.role)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(10);

      const hasPending = buzzers && buzzers.length > 0;

      return jsonResponse({
        buzzer: hasPending,
        count: buzzers?.length || 0,
        alerts: buzzers?.map((b: any) => ({
          id: b.id,
          type: b.trigger_type,
          priority: b.priority,
          lead_id: b.lead_id,
          task_id: b.task_id,
          created_at: b.created_at,
        })) || [],
      }, 200, hasPending);
    }, { module: "leads", action: "buzzer_check" });
  }

  // GET /leads (list leads with masking)
  if ((path === "" || path === "/") && req.method === "GET") {
    return withAuth(req, ["super_admin", "admin", "lead_manager", "franchise", "reseller", "sales"], async ({ supabaseAdmin, user }) => {
      const urlParams = new URL(req.url);
      const status = urlParams.searchParams.get("status");
      const page = parseInt(urlParams.searchParams.get("page") || "1");
      const limit = parseInt(urlParams.searchParams.get("limit") || "50");

      let query = supabaseAdmin.from("leads").select("*", { count: "exact" });

      if (status) query = query.eq("status", status);

      // Role-based filtering
      if (user.role === "franchise" || user.role === "reseller") {
        query = query.eq("assigned_to", user.userId);
      }

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1)
        .order("created_at", { ascending: false });

      if (error) return errorResponse(error.message, 400);

      // Mask data based on role
      const maskedLeads = data?.map((lead: any) => ({
        id: lead.id,
        name: user.role === "developer" ? maskName(lead.lead_name) : lead.lead_name,
        phone: lead.masked_phone,
        email: lead.masked_email,
        location: lead.location,
        status: lead.status,
        quality_score: lead.quality_score,
        source: lead.source,
        created_at: lead.created_at,
      })) || [];

      return jsonResponse({
        leads: maskedLeads,
        pagination: { page, limit, total: count || 0 },
      });
    }, { module: "leads", action: "list" });
  }

  return errorResponse("Not found", 404);
});
