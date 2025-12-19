// Franchise Management API for Software Vala
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  withEnhancedMiddleware,
  applyMasking,
  notificationMiddleware,
} from "../_shared/enhanced-middleware.ts";
import {
  jsonResponse,
  errorResponse,
  validateRequired,
  createBuzzerAlert,
  maskEmail,
  maskPhone,
} from "../_shared/utils.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api-franchise", "");
  const method = req.method;

  // POST /franchise/register
  if (method === "POST" && path === "/register") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, [
        "business_name", "owner_name", "email", "phone", "city", "state"
      ]);
      if (validation) return errorResponse(validation);

      // Generate unique franchise code
      const franchiseCode = `FR-${Date.now().toString(36).toUpperCase()}`;

      const { data: franchise, error } = await ctx.supabaseAdmin
        .from("franchise_accounts")
        .insert({
          user_id: ctx.user!.userId,
          franchise_code: franchiseCode,
          business_name: ctx.body.business_name,
          owner_name: ctx.body.owner_name,
          email: ctx.body.email,
          phone: ctx.body.phone,
          masked_email: maskEmail(ctx.body.email),
          masked_phone: maskPhone(ctx.body.phone),
          city: ctx.body.city,
          state: ctx.body.state,
          country: ctx.body.country || "India",
          pincode: ctx.body.pincode,
          address: ctx.body.address,
          status: "pending",
          kyc_status: "pending",
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to register franchise. Please try again.");

      // Assign franchise role
      await ctx.supabaseAdmin.from("user_roles").upsert({
        user_id: ctx.user!.userId,
        role: "franchise",
      });

      // Notify admins
      await notificationMiddleware(ctx, "franchise.registration", {
        franchise_id: franchise.id,
        business_name: ctx.body.business_name,
        target_role: "admin",
      });

      return jsonResponse({
        message: "Your franchise registration has been submitted. Our team will review and contact you shortly.",
        franchise_code: franchiseCode,
        franchise: applyMasking(franchise, ctx.user!.role),
      }, 201);
    }, {
      module: "franchise",
      action: "register",
      requireAuth: true,
    });
  }

  // GET /franchise - List franchises (Admin) or own account
  if (method === "GET" && path === "") {
    return withEnhancedMiddleware(req, async (ctx) => {
      let query = ctx.supabaseAdmin.from("franchise_accounts").select(`
        *,
        franchise_territories(*),
        franchise_leads(count),
        franchise_commissions(sum:commission_amount)
      `);

      // Non-admins can only see their own franchise
      if (!["super_admin", "admin"].includes(ctx.user!.role)) {
        query = query.eq("user_id", ctx.user!.userId);
      }

      const { data, error } = await query;
      if (error) return errorResponse("Unable to retrieve franchise information.");

      return jsonResponse(applyMasking(data, ctx.user!.role));
    }, {
      module: "franchise",
      action: "list",
      allowedRoles: ["super_admin", "admin", "franchise", "sales"],
    });
  }

  // POST /franchise/assign-lead
  if (method === "POST" && path === "/assign-lead") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["franchise_id", "lead_id"]);
      if (validation) return errorResponse(validation);

      // Create franchise lead assignment
      const { data: lead, error } = await ctx.supabaseAdmin
        .from("franchise_leads")
        .insert({
          franchise_id: ctx.body.franchise_id,
          original_lead_id: ctx.body.lead_id,
          lead_name: ctx.body.lead_name || "Lead",
          status: "assigned",
          region: ctx.body.region,
          city: ctx.body.city,
          assigned_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to assign lead to franchise.");

      // Create buzzer alert
      await createBuzzerAlert(
        ctx.supabaseAdmin,
        "lead.new",
        "franchise",
        null,
        lead.id,
        "high",
        ctx.body.region
      );

      // Notify franchise
      await notificationMiddleware(ctx, "lead.new", {
        lead_id: lead.id,
        target_user_id: ctx.body.franchise_user_id,
        buzzer: true,
      });

      return jsonResponse({
        message: "Lead has been assigned to the franchise successfully.",
        lead: applyMasking(lead, ctx.user!.role),
      });
    }, {
      module: "franchise",
      action: "assign_lead",
      allowedRoles: ["super_admin", "admin", "lead_manager", "sales"],
    });
  }

  // POST /franchise/wallet/payout
  if (method === "POST" && path === "/wallet/payout") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["franchise_id", "amount"]);
      if (validation) return errorResponse(validation);

      // Verify franchise ownership or admin
      const { data: franchise } = await ctx.supabaseAdmin
        .from("franchise_accounts")
        .select("user_id")
        .eq("id", ctx.body.franchise_id)
        .single();

      if (!franchise) return errorResponse("Franchise not found.");
      if (franchise.user_id !== ctx.user!.userId && !["super_admin", "admin", "finance_manager"].includes(ctx.user!.role)) {
        return errorResponse("You are not authorized to request this payout.");
      }

      // Create payout request
      const { data: payout, error } = await ctx.supabaseAdmin
        .from("franchise_payouts")
        .insert({
          franchise_id: ctx.body.franchise_id,
          amount: ctx.body.amount,
          type: "commission",
          status: "pending",
          requested_at: new Date().toISOString(),
          payment_method: ctx.body.payment_method,
          bank_details: ctx.body.bank_details,
          notes: ctx.body.notes,
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to create payout request.");

      // Notify finance team
      await notificationMiddleware(ctx, "wallet.payout_request", {
        payout_id: payout.id,
        franchise_id: ctx.body.franchise_id,
        amount: ctx.body.amount,
        target_role: "finance_manager",
      });

      return jsonResponse({
        message: "Your payout request has been submitted. Our finance team will process it within 3-5 business days.",
        payout,
      });
    }, {
      module: "franchise",
      action: "request_payout",
      requireKYC: true,
    });
  }

  // POST /franchise/escalate
  if (method === "POST" && path === "/escalate") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["franchise_id", "subject", "description", "escalation_type"]);
      if (validation) return errorResponse(validation);

      const { data: escalation, error } = await ctx.supabaseAdmin
        .from("franchise_escalations")
        .insert({
          franchise_id: ctx.body.franchise_id,
          escalation_type: ctx.body.escalation_type,
          subject: ctx.body.subject,
          description: ctx.body.description,
          priority: ctx.body.priority || "normal",
          status: "open",
          attachments: ctx.body.attachments || [],
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to create escalation.");

      // Notify relevant team based on type
      const targetRole = ctx.body.escalation_type === "legal" ? "legal_compliance" : "admin";
      
      await createBuzzerAlert(
        ctx.supabaseAdmin,
        "legal.alert",
        targetRole,
        null,
        null,
        ctx.body.priority === "urgent" ? "urgent" : "high"
      );

      return jsonResponse({
        message: "Your escalation has been submitted. Our team will address it promptly.",
        escalation,
      }, 201);
    }, {
      module: "franchise",
      action: "escalate",
      allowedRoles: ["franchise", "super_admin", "admin"],
    });
  }

  // GET /franchise/territory
  if (method === "GET" && path === "/territory") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const franchiseId = url.searchParams.get("franchise_id");

      let query = ctx.supabaseAdmin.from("franchise_territories").select(`
        *,
        franchise_accounts!inner(user_id, business_name)
      `);

      if (franchiseId) {
        query = query.eq("franchise_id", franchiseId);
      } else if (!["super_admin", "admin"].includes(ctx.user!.role)) {
        query = query.eq("franchise_accounts.user_id", ctx.user!.userId);
      }

      const { data, error } = await query;
      if (error) return errorResponse("Unable to retrieve territory information.");

      return jsonResponse(data);
    }, {
      module: "franchise",
      action: "view_territory",
      allowedRoles: ["super_admin", "admin", "franchise", "sales"],
    });
  }

  // GET /franchise/commissions
  if (method === "GET" && path === "/commissions") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const franchiseId = url.searchParams.get("franchise_id");

      // Get franchise for user
      let targetFranchiseId = franchiseId;
      if (!targetFranchiseId && !["super_admin", "admin", "finance_manager"].includes(ctx.user!.role)) {
        const { data: franchise } = await ctx.supabaseAdmin
          .from("franchise_accounts")
          .select("id")
          .eq("user_id", ctx.user!.userId)
          .single();
        
        if (franchise) targetFranchiseId = franchise.id;
      }

      let query = ctx.supabaseAdmin.from("franchise_commissions").select("*");
      if (targetFranchiseId) {
        query = query.eq("franchise_id", targetFranchiseId);
      }
      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) return errorResponse("Unable to retrieve commission history.");

      // Calculate totals
      const totals = (data || []).reduce((acc: { pending: number; approved: number; credited: number }, c: any) => ({
        pending: acc.pending + (c.status === "pending" ? Number(c.commission_amount) : 0),
        approved: acc.approved + (c.status === "approved" ? Number(c.commission_amount) : 0),
        credited: acc.credited + (c.status === "credited" ? Number(c.commission_amount) : 0),
      }), { pending: 0, approved: 0, credited: 0 });

      return jsonResponse({
        commissions: data,
        totals,
      });
    }, {
      module: "franchise",
      action: "view_commissions",
      allowedRoles: ["super_admin", "admin", "finance_manager", "franchise"],
    });
  }

  return errorResponse("Endpoint not found", 404);
});
