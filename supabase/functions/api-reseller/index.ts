// Reseller Management API for Software Vala
import {
  withEnhancedMiddleware,
  applyMasking,
  notificationMiddleware,
} from "../_shared/enhanced-middleware.ts";
import {
  jsonResponse,
  errorResponse,
  validateRequired,
  maskEmail,
  maskPhone,
} from "../_shared/utils.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api-reseller", "");
  const method = req.method;

  // POST /reseller/register
  if (method === "POST" && path === "/register") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["business_name", "email", "phone", "city"]);
      if (validation) return errorResponse(validation);

      const resellerCode = `RS-${Date.now().toString(36).toUpperCase()}`;

      const { data: reseller, error } = await ctx.supabaseAdmin
        .from("reseller_accounts")
        .insert({
          user_id: ctx.user!.userId,
          reseller_code: resellerCode,
          business_name: ctx.body.business_name,
          owner_name: ctx.body.owner_name || ctx.body.business_name,
          email: ctx.body.email,
          phone: ctx.body.phone,
          masked_email: maskEmail(ctx.body.email),
          masked_phone: maskPhone(ctx.body.phone),
          city: ctx.body.city,
          state: ctx.body.state,
          country: ctx.body.country || "India",
          status: "pending",
          kyc_status: "pending",
          commission_rate: 10.00, // Default 10%
          franchise_id: ctx.body.franchise_id, // Optional parent franchise
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to register as reseller. Please try again.");

      // Assign reseller role
      await ctx.supabaseAdmin.from("user_roles").upsert({
        user_id: ctx.user!.userId,
        role: "reseller",
      });

      return jsonResponse({
        message: "Your reseller registration has been submitted successfully.",
        reseller_code: resellerCode,
        reseller: applyMasking(reseller, ctx.user!.role),
      }, 201);
    }, {
      module: "reseller",
      action: "register",
      requireAuth: true,
    });
  }

  // POST /reseller/demo/share
  if (method === "POST" && path === "/demo/share") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["demo_id"]);
      if (validation) return errorResponse(validation);

      // Get reseller's account
      const { data: reseller } = await ctx.supabaseAdmin
        .from("reseller_accounts")
        .select("id, reseller_code")
        .eq("user_id", ctx.user!.userId)
        .single();

      if (!reseller) return errorResponse("Reseller account not found.");

      // Generate masked sharing link
      const shareCode = crypto.randomUUID().split("-")[0];
      const maskedUrl = `demo.softwarevala.com/${reseller.reseller_code}/${shareCode}`;

      const { data: rentalLink, error } = await ctx.supabaseAdmin
        .from("demo_rental_links")
        .insert({
          demo_id: ctx.body.demo_id,
          requester_id: ctx.user!.userId,
          requester_role: "reseller",
          reseller_id: reseller.id,
          real_url: ctx.body.real_url || "",
          masked_url: maskedUrl,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          max_views: ctx.body.max_views || 100,
          status: "active",
          access_type: "share",
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to create demo sharing link.");

      return jsonResponse({
        message: "Demo sharing link created successfully.",
        share_url: `https://${maskedUrl}`,
        expires_at: rentalLink.expires_at,
        max_views: rentalLink.max_views,
      });
    }, {
      module: "reseller",
      action: "share_demo",
      allowedRoles: ["reseller", "franchise", "super_admin", "admin"],
      requireSubscription: true,
    });
  }

  // POST /reseller/commission
  if (method === "POST" && path === "/commission") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["reseller_id", "sale_amount", "lead_id"]);
      if (validation) return errorResponse(validation);

      // Get reseller commission rate
      const { data: reseller } = await ctx.supabaseAdmin
        .from("reseller_accounts")
        .select("commission_rate, franchise_id")
        .eq("id", ctx.body.reseller_id)
        .single();

      if (!reseller) return errorResponse("Reseller not found.");

      const commissionRate = reseller.commission_rate || 10;
      const commissionAmount = (ctx.body.sale_amount * commissionRate) / 100;

      const { data: commission, error } = await ctx.supabaseAdmin
        .from("reseller_commissions")
        .insert({
          reseller_id: ctx.body.reseller_id,
          lead_id: ctx.body.lead_id,
          sale_amount: ctx.body.sale_amount,
          commission_rate: commissionRate,
          commission_amount: commissionAmount,
          status: "pending",
          description: ctx.body.description || `Commission for sale: ₹${ctx.body.sale_amount}`,
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to record commission.");

      // If reseller has parent franchise, calculate franchise override
      if (reseller.franchise_id) {
        const franchiseOverride = commissionAmount * 0.1; // 10% override
        await ctx.supabaseAdmin.from("franchise_commissions").insert({
          franchise_id: reseller.franchise_id,
          lead_id: ctx.body.lead_id,
          sale_amount: ctx.body.sale_amount,
          commission_rate: 1, // 1% override
          commission_amount: franchiseOverride,
          type: "reseller_override",
          status: "pending",
        });
      }

      await notificationMiddleware(ctx, "wallet.credit", {
        amount: commissionAmount,
        type: "commission",
        target_user_id: ctx.body.reseller_user_id,
      });

      return jsonResponse({
        message: "Commission recorded successfully.",
        commission,
      });
    }, {
      module: "reseller",
      action: "record_commission",
      allowedRoles: ["super_admin", "admin", "finance_manager", "sales"],
    });
  }

  // GET /reseller/performance
  if (method === "GET" && path === "/performance") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const resellerId = url.searchParams.get("reseller_id");
      const period = url.searchParams.get("period") || "month"; // week, month, year

      let targetResellerId = resellerId;
      if (!targetResellerId && ctx.user!.role === "reseller") {
        const { data: reseller } = await ctx.supabaseAdmin
          .from("reseller_accounts")
          .select("id")
          .eq("user_id", ctx.user!.userId)
          .single();
        if (reseller) targetResellerId = reseller.id;
      }

      // Calculate date range
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

      // Get performance metrics
      const { data: commissions } = await ctx.supabaseAdmin
        .from("reseller_commissions")
        .select("*")
        .eq("reseller_id", targetResellerId)
        .gte("created_at", startDate.toISOString());

      const { data: clicks } = await ctx.supabaseAdmin
        .from("demo_clicks")
        .select("*")
        .eq("reseller_id", targetResellerId)
        .gte("clicked_at", startDate.toISOString());

      const totalSales = (commissions || []).reduce((sum, c) => sum + Number(c.sale_amount), 0);
      const totalCommission = (commissions || []).reduce((sum, c) => sum + Number(c.commission_amount), 0);
      const conversions = (commissions || []).length;
      const totalClicks = (clicks || []).length;
      const conversionRate = totalClicks > 0 ? ((conversions / totalClicks) * 100).toFixed(2) : 0;

      return jsonResponse({
        period,
        metrics: {
          total_sales: totalSales,
          total_commission: totalCommission,
          total_conversions: conversions,
          total_clicks: totalClicks,
          conversion_rate: `${conversionRate}%`,
        },
        commissions: commissions || [],
      });
    }, {
      module: "reseller",
      action: "view_performance",
      allowedRoles: ["super_admin", "admin", "reseller", "franchise", "sales"],
    });
  }

  // GET /reseller - List resellers
  if (method === "GET" && path === "") {
    return withEnhancedMiddleware(req, async (ctx) => {
      let query = ctx.supabaseAdmin.from("reseller_accounts").select(`
        *,
        reseller_commissions(count),
        demo_rental_links(count)
      `);

      // Filter by franchise if applicable
      const franchiseId = url.searchParams.get("franchise_id");
      if (franchiseId) {
        query = query.eq("franchise_id", franchiseId);
      } else if (ctx.user!.role === "franchise") {
        const { data: franchise } = await ctx.supabaseAdmin
          .from("franchise_accounts")
          .select("id")
          .eq("user_id", ctx.user!.userId)
          .single();
        if (franchise) {
          query = query.eq("franchise_id", franchise.id);
        }
      } else if (ctx.user!.role === "reseller") {
        query = query.eq("user_id", ctx.user!.userId);
      }

      const { data, error } = await query;
      if (error) return errorResponse("Unable to retrieve reseller information.");

      return jsonResponse(applyMasking(data, ctx.user!.role));
    }, {
      module: "reseller",
      action: "list",
      allowedRoles: ["super_admin", "admin", "franchise", "reseller", "sales"],
    });
  }

  return errorResponse("Endpoint not found", 404);
});
