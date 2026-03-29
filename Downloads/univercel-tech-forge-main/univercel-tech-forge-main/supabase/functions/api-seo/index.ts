// SEO & Marketing API for Software Vala
import {
  withEnhancedMiddleware,
  withPublicEndpoint,
  generateSeoTags,
} from "../_shared/enhanced-middleware.ts";
import {
  jsonResponse,
  errorResponse,
  validateRequired,
} from "../_shared/utils.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api-seo", "");
  const method = req.method;

  // POST /seo/meta/generate
  if (method === "POST" && path === "/meta/generate") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["title"]);
      if (validation) return errorResponse(validation);

      // Generate SEO tags using our utility
      const seoTags = generateSeoTags({
        title: ctx.body.title,
        description: ctx.body.description,
        category: ctx.body.category,
      });

      // AI-enhanced suggestions (simulated - would use actual AI in production)
      const suggestions = {
        ...seoTags,
        og_title: seoTags.meta_title,
        og_description: seoTags.meta_description,
        twitter_card: "summary_large_image",
        structured_data: {
          "@context": "https://schema.org",
          "@type": ctx.body.schema_type || "Product",
          name: ctx.body.title,
          description: seoTags.meta_description,
          brand: {
            "@type": "Organization",
            name: "Software Vala",
          },
        },
        alt_titles: [
          `${ctx.body.title} - Best Solution`,
          `${ctx.body.title} | Software Vala`,
          `Get ${ctx.body.title} Today`,
        ],
        focus_keywords: seoTags.keywords.slice(0, 5),
        long_tail_keywords: [
          `best ${ctx.body.title.toLowerCase()} software`,
          `${ctx.body.title.toLowerCase()} for business`,
          `affordable ${ctx.body.title.toLowerCase()}`,
        ],
      };

      // Save to SEO records
      await ctx.supabaseAdmin.from("seo_records").insert({
        entity_type: ctx.body.entity_type || "product",
        entity_id: ctx.body.entity_id,
        meta_title: seoTags.meta_title,
        meta_description: seoTags.meta_description,
        keywords: seoTags.keywords,
        structured_data: suggestions.structured_data,
        created_by: ctx.user!.userId,
      });

      return jsonResponse({
        message: "SEO metadata generated successfully.",
        seo: suggestions,
      });
    }, {
      module: "seo",
      action: "generate_meta",
      allowedRoles: ["super_admin", "admin", "seo_manager", "marketing_manager"],
    });
  }

  // POST /seo/keywords
  if (method === "POST" && path === "/keywords") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["seed_keyword"]);
      if (validation) return errorResponse(validation);

      const seedKeyword = ctx.body.seed_keyword.toLowerCase();
      const region = ctx.body.region || "IN";

      // Generate keyword suggestions (would use actual keyword research API)
      const suggestions = {
        primary: seedKeyword,
        related: [
          `${seedKeyword} software`,
          `${seedKeyword} solution`,
          `${seedKeyword} platform`,
          `best ${seedKeyword}`,
          `${seedKeyword} for small business`,
          `${seedKeyword} pricing`,
          `${seedKeyword} free trial`,
          `${seedKeyword} comparison`,
        ],
        long_tail: [
          `how to use ${seedKeyword} for business`,
          `${seedKeyword} vs competitors`,
          `${seedKeyword} implementation guide`,
          `benefits of ${seedKeyword}`,
        ],
        questions: [
          `what is ${seedKeyword}?`,
          `how does ${seedKeyword} work?`,
          `why choose ${seedKeyword}?`,
          `is ${seedKeyword} worth it?`,
        ],
        local: region === "IN" ? [
          `${seedKeyword} india`,
          `${seedKeyword} bangalore`,
          `${seedKeyword} mumbai`,
          `${seedKeyword} delhi`,
        ] : [],
      };

      // Save keyword research
      await ctx.supabaseAdmin.from("seo_keyword_research").insert({
        seed_keyword: seedKeyword,
        region,
        suggestions,
        created_by: ctx.user!.userId,
      });

      return jsonResponse({
        message: "Keyword research completed.",
        keywords: suggestions,
      });
    }, {
      module: "seo",
      action: "research_keywords",
      allowedRoles: ["super_admin", "admin", "seo_manager", "marketing_manager"],
    });
  }

  // POST /seo/schedule
  if (method === "POST" && path === "/schedule") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["content_type", "title", "scheduled_at"]);
      if (validation) return errorResponse(validation);

      const { data: schedule, error } = await ctx.supabaseAdmin
        .from("seo_content_schedule")
        .insert({
          content_type: ctx.body.content_type, // blog, social, press
          title: ctx.body.title,
          content: ctx.body.content,
          keywords: ctx.body.keywords || [],
          platforms: ctx.body.platforms || ["website"],
          scheduled_at: ctx.body.scheduled_at,
          status: "scheduled",
          created_by: ctx.user!.userId,
          meta_data: ctx.body.meta_data || {},
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to schedule content.");

      return jsonResponse({
        message: "Content scheduled successfully.",
        schedule,
      });
    }, {
      module: "seo",
      action: "schedule_content",
      allowedRoles: ["super_admin", "admin", "seo_manager", "marketing_manager"],
    });
  }

  // GET /seo/rank
  if (method === "GET" && path === "/rank") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const keyword = url.searchParams.get("keyword");
      const domain = url.searchParams.get("domain") || "softwarevala.com";

      // Get historical rank data
      const { data: rankings } = await ctx.supabaseAdmin
        .from("seo_rank_tracking")
        .select("*")
        .eq("domain", domain)
        .ilike("keyword", keyword ? `%${keyword}%` : "%")
        .order("checked_at", { ascending: false })
        .limit(100);

      // Aggregate metrics
      interface RankingRecord {
        keyword: string;
        position: number;
        checked_at: string;
      }
      const keywordStats = new Map();
      
      (rankings || []).forEach((r: RankingRecord) => {
        if (!keywordStats.has(r.keyword)) {
          keywordStats.set(r.keyword, {
            keyword: r.keyword,
            current_position: r.position,
            previous_position: null,
            best_position: r.position,
            history: [],
          });
        }
        const stat = keywordStats.get(r.keyword);
        stat.history.push({ position: r.position, date: r.checked_at });
        if (r.position < stat.best_position) stat.best_position = r.position;
      });

      return jsonResponse({
        domain,
        keywords: Array.from(keywordStats.values()),
        summary: {
          total_keywords: keywordStats.size,
          top_10: Array.from(keywordStats.values()).filter(k => k.current_position <= 10).length,
          top_50: Array.from(keywordStats.values()).filter(k => k.current_position <= 50).length,
        },
      });
    }, {
      module: "seo",
      action: "view_rankings",
      allowedRoles: ["super_admin", "admin", "seo_manager", "marketing_manager"],
    });
  }

  // POST /marketing/campaign
  if (method === "POST" && path === "/marketing/campaign") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["name", "type", "budget", "start_date", "end_date"]);
      if (validation) return errorResponse(validation);

      const { data: campaign, error } = await ctx.supabaseAdmin
        .from("marketing_campaigns")
        .insert({
          name: ctx.body.name,
          type: ctx.body.type, // email, social, ppc, content
          budget: ctx.body.budget,
          start_date: ctx.body.start_date,
          end_date: ctx.body.end_date,
          target_audience: ctx.body.target_audience || {},
          channels: ctx.body.channels || [],
          goals: ctx.body.goals || {},
          status: "draft",
          created_by: ctx.user!.userId,
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to create campaign.");

      return jsonResponse({
        message: "Marketing campaign created successfully.",
        campaign,
      }, 201);
    }, {
      module: "marketing",
      action: "create_campaign",
      allowedRoles: ["super_admin", "admin", "marketing_manager"],
    });
  }

  // POST /marketing/assign-influencer
  if (method === "POST" && path === "/marketing/assign-influencer") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["campaign_id", "influencer_id"]);
      if (validation) return errorResponse(validation);

      const { data: assignment, error } = await ctx.supabaseAdmin
        .from("campaign_influencer_assignments")
        .insert({
          campaign_id: ctx.body.campaign_id,
          influencer_id: ctx.body.influencer_id,
          commission_rate: ctx.body.commission_rate || 5,
          deliverables: ctx.body.deliverables || [],
          deadline: ctx.body.deadline,
          status: "pending",
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to assign influencer to campaign.");

      return jsonResponse({
        message: "Influencer assigned to campaign successfully.",
        assignment,
      });
    }, {
      module: "marketing",
      action: "assign_influencer",
      allowedRoles: ["super_admin", "admin", "marketing_manager"],
    });
  }

  // GET /marketing/analytics
  if (method === "GET" && path === "/marketing/analytics") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const campaignId = url.searchParams.get("campaign_id");

      let query = ctx.supabaseAdmin.from("marketing_campaigns").select(`
        *,
        campaign_influencer_assignments(count),
        campaign_analytics(*)
      `);

      if (campaignId) {
        query = query.eq("id", campaignId);
      }

      const { data: campaigns, error } = await query;
      if (error) return errorResponse("Unable to retrieve campaign analytics.");

      // Calculate aggregate metrics
      interface CampaignRecord {
        budget: number | string;
        status: string;
      }
      const totals = {
        total_campaigns: campaigns?.length || 0,
        total_budget: campaigns?.reduce((sum: number, c: CampaignRecord) => sum + Number(c.budget), 0) || 0,
        active_campaigns: campaigns?.filter((c: CampaignRecord) => c.status === "active").length || 0,
      };

      return jsonResponse({
        campaigns,
        totals,
      });
    }, {
      module: "marketing",
      action: "view_analytics",
      allowedRoles: ["super_admin", "admin", "marketing_manager", "seo_manager"],
    });
  }

  return errorResponse("Endpoint not found", 404);
});
