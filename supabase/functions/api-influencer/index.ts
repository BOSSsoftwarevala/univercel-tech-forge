// Influencer Management API for Software Vala
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
  const path = url.pathname.replace("/api-influencer", "");
  const method = req.method;

  // POST /influencer/register
  if (method === "POST" && path === "/register") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["name", "email", "phone", "platform", "followers_count"]);
      if (validation) return errorResponse(validation);

      const influencerCode = `INF-${Date.now().toString(36).toUpperCase()}`;

      const { data: influencer, error } = await ctx.supabaseAdmin
        .from("influencer_accounts")
        .insert({
          user_id: ctx.user!.userId,
          influencer_code: influencerCode,
          name: ctx.body.name,
          email: ctx.body.email,
          phone: ctx.body.phone,
          masked_email: maskEmail(ctx.body.email),
          masked_phone: maskPhone(ctx.body.phone),
          platform: ctx.body.platform, // instagram, youtube, twitter, linkedin
          social_handle: ctx.body.social_handle,
          followers_count: ctx.body.followers_count,
          niche: ctx.body.niche,
          city: ctx.body.city,
          state: ctx.body.state,
          country: ctx.body.country || "India",
          status: "pending",
          kyc_status: "pending",
          commission_rate: 5.00, // Default 5%
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to register as influencer. Please try again.");

      // Assign influencer role
      await ctx.supabaseAdmin.from("user_roles").upsert({
        user_id: ctx.user!.userId,
        role: "influencer",
      });

      return jsonResponse({
        message: "Your influencer registration has been submitted. We'll review your profile shortly.",
        influencer_code: influencerCode,
        influencer: applyMasking(influencer, ctx.user!.role),
      }, 201);
    }, {
      module: "influencer",
      action: "register",
      requireAuth: true,
    });
  }

  // POST /influencer/link/create
  if (method === "POST" && path === "/link/create") {
    return withEnhancedMiddleware(req, async (ctx) => {
      // Get influencer account
      const { data: influencer } = await ctx.supabaseAdmin
        .from("influencer_accounts")
        .select("id, influencer_code, status")
        .eq("user_id", ctx.user!.userId)
        .single();

      if (!influencer) return errorResponse("Influencer account not found.");
      if (influencer.status !== "active") return errorResponse("Your influencer account is not yet active.");

      // Generate unique tracking link
      const trackingCode = crypto.randomUUID().split("-")[0];
      const trackingUrl = `softwarevala.com/ref/${influencer.influencer_code}/${trackingCode}`;

      const { data: link, error } = await ctx.supabaseAdmin
        .from("influencer_links")
        .insert({
          influencer_id: influencer.id,
          tracking_code: trackingCode,
          tracking_url: trackingUrl,
          campaign_name: ctx.body.campaign_name || "General",
          target_product: ctx.body.product_id,
          target_demo: ctx.body.demo_id,
          utm_source: ctx.body.utm_source || "influencer",
          utm_medium: ctx.body.utm_medium || "social",
          utm_campaign: ctx.body.utm_campaign,
          is_active: true,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to create tracking link.");

      return jsonResponse({
        message: "Tracking link created successfully.",
        tracking_url: `https://${trackingUrl}`,
        campaign: link.campaign_name,
      });
    }, {
      module: "influencer",
      action: "create_link",
      allowedRoles: ["influencer", "super_admin", "admin", "marketing_manager"],
    });
  }

  // GET /influencer/clicks
  if (method === "GET" && path === "/clicks") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const period = url.searchParams.get("period") || "month";

      // Get influencer account
      let influencerId = url.searchParams.get("influencer_id");
      
      if (!influencerId && ctx.user!.role === "influencer") {
        const { data: influencer } = await ctx.supabaseAdmin
          .from("influencer_accounts")
          .select("id")
          .eq("user_id", ctx.user!.userId)
          .single();
        if (influencer) influencerId = influencer.id;
      }

      if (!influencerId) return errorResponse("Influencer ID required.");

      // Get click data
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

      const { data: clicks } = await ctx.supabaseAdmin
        .from("influencer_clicks")
        .select(`
          *,
          influencer_links(campaign_name, tracking_code)
        `)
        .eq("influencer_id", influencerId)
        .gte("clicked_at", startDate.toISOString())
        .order("clicked_at", { ascending: false });

      // Aggregate stats
      const stats = {
        total_clicks: clicks?.length || 0,
        unique_visitors: new Set(clicks?.map((c: any) => c.ip_address)).size,
        conversions: clicks?.filter((c: any) => c.converted).length || 0,
        by_device: {} as Record<string, number>,
        by_region: {} as Record<string, number>,
        by_campaign: {} as Record<string, number>,
      };

      clicks?.forEach((click: any) => {
        const device = click.device_type || "unknown";
        const region = click.region || "unknown";
        const campaign = click.influencer_links?.campaign_name || "direct";

        stats.by_device[device] = (stats.by_device[device] || 0) + 1;
        stats.by_region[region] = (stats.by_region[region] || 0) + 1;
        stats.by_campaign[campaign] = (stats.by_campaign[campaign] || 0) + 1;
      });

      return jsonResponse({
        period,
        stats,
        recent_clicks: clicks?.slice(0, 50),
      });
    }, {
      module: "influencer",
      action: "view_clicks",
      allowedRoles: ["influencer", "super_admin", "admin", "marketing_manager"],
    });
  }

  // GET /influencer/earnings
  if (method === "GET" && path === "/earnings") {
    return withEnhancedMiddleware(req, async (ctx) => {
      // Get influencer account
      let influencerId = url.searchParams.get("influencer_id");
      
      if (!influencerId && ctx.user!.role === "influencer") {
        const { data: influencer } = await ctx.supabaseAdmin
          .from("influencer_accounts")
          .select("id")
          .eq("user_id", ctx.user!.userId)
          .single();
        if (influencer) influencerId = influencer.id;
      }

      if (!influencerId) return errorResponse("Influencer ID required.");

      // Get earnings
      const { data: earnings } = await ctx.supabaseAdmin
        .from("influencer_earnings")
        .select("*")
        .eq("influencer_id", influencerId)
        .order("created_at", { ascending: false });

      // Get wallet balance
      const { data: wallet } = await ctx.supabaseAdmin
        .from("influencer_wallet")
        .select("*")
        .eq("influencer_id", influencerId)
        .single();

      const totals = {
        total_earned: earnings?.reduce((sum: number, e: any) => sum + Number(e.amount), 0) || 0,
        pending: earnings?.filter((e: any) => e.status === "pending").reduce((sum: number, e: any) => sum + Number(e.amount), 0) || 0,
        paid: earnings?.filter((e: any) => e.status === "paid").reduce((sum: number, e: any) => sum + Number(e.amount), 0) || 0,
        available_balance: wallet?.available_balance || 0,
      };

      return jsonResponse({
        totals,
        earnings: earnings || [],
        wallet,
      });
    }, {
      module: "influencer",
      action: "view_earnings",
      allowedRoles: ["influencer", "super_admin", "admin", "finance_manager"],
    });
  }

  // POST /influencer/payout
  if (method === "POST" && path === "/payout") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["amount"]);
      if (validation) return errorResponse(validation);

      // Get influencer account
      const { data: influencer } = await ctx.supabaseAdmin
        .from("influencer_accounts")
        .select("id")
        .eq("user_id", ctx.user!.userId)
        .single();

      if (!influencer) return errorResponse("Influencer account not found.");

      // Get wallet balance
      const { data: wallet } = await ctx.supabaseAdmin
        .from("influencer_wallet")
        .select("*")
        .eq("influencer_id", influencer.id)
        .single();

      if (!wallet || Number(wallet.available_balance) < ctx.body.amount) {
        return errorResponse("Insufficient balance for this payout request.");
      }

      // Create payout request
      const { data: payout, error } = await ctx.supabaseAdmin
        .from("influencer_payouts")
        .insert({
          influencer_id: influencer.id,
          amount: ctx.body.amount,
          status: "pending",
          payment_method: ctx.body.payment_method || "bank_transfer",
          bank_details: ctx.body.bank_details,
          requested_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to create payout request.");

      // Update wallet
      await ctx.supabaseAdmin
        .from("influencer_wallet")
        .update({
          available_balance: Number(wallet.available_balance) - ctx.body.amount,
          pending_payout: Number(wallet.pending_payout || 0) + ctx.body.amount,
        })
        .eq("influencer_id", influencer.id);

      await notificationMiddleware(ctx, "wallet.payout_request", {
        payout_id: payout.id,
        amount: ctx.body.amount,
        target_role: "finance_manager",
      });

      return jsonResponse({
        message: "Your payout request has been submitted. Payments are processed within 5-7 business days.",
        payout,
      });
    }, {
      module: "influencer",
      action: "request_payout",
      allowedRoles: ["influencer"],
      requireKYC: true,
    });
  }

  // GET /influencer - List influencers
  if (method === "GET" && path === "") {
    return withEnhancedMiddleware(req, async (ctx) => {
      let query = ctx.supabaseAdmin.from("influencer_accounts").select(`
        *,
        influencer_links(count),
        influencer_earnings(sum:amount)
      `);

      if (ctx.user!.role === "influencer") {
        query = query.eq("user_id", ctx.user!.userId);
      }

      const status = url.searchParams.get("status");
      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (error) return errorResponse("Unable to retrieve influencer information.");

      return jsonResponse(applyMasking(data, ctx.user!.role));
    }, {
      module: "influencer",
      action: "list",
      allowedRoles: ["super_admin", "admin", "marketing_manager", "influencer"],
    });
  }

  return errorResponse("Endpoint not found", 404);
});
