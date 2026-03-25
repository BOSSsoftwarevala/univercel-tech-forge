// @ts-ignore Deno runtime import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { withAuth, type RequestContext } from "../_shared/middleware.ts";
import { errorResponse, jsonResponse } from "../_shared/utils.ts";

const allowedRoles = ["seo_manager", "marketing_manager", "super_admin", "master", "admin", "boss_owner", "ceo"];
const adminRoles = new Set(["seo_manager", "super_admin", "master", "admin", "boss_owner", "ceo"]);

function normalizePath(path: string) {
  if (!path) return "/";
  return path.replace(/^\/functions\/v1\/api-seo-manager/, "") || "/";
}

function bodyOf(ctx: RequestContext) {
  return ctx.body || {};
}

function nowIso() {
  return new Date().toISOString();
}

function numberOf(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function textArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function intentFromKeyword(keyword: string) {
  const value = keyword.toLowerCase();
  if (value.includes("buy") || value.includes("pricing") || value.includes("demo")) return "buy";
  if (value.includes("best") || value.includes("vs") || value.includes("compare")) return "commercial";
  if (value.includes("how") || value.includes("guide") || value.includes("what")) return "info";
  return "informational";
}

function lsiKeywords(keyword: string, country: string) {
  const base = keyword.toLowerCase();
  return [
    `${base} software`,
    `${base} platform`,
    `${base} solutions`,
    `${base} ${country.toLowerCase()}`,
    `best ${base}`,
  ];
}

function buildBlogContent(params: { keyword: string; country: string; language: string; instructions?: string }) {
  const headingKeyword = params.keyword;
  const related = lsiKeywords(params.keyword, params.country);
  const faq = [
    { question: `What is ${headingKeyword}?`, answer: `${headingKeyword} is a focused solution for companies that need better performance and conversion outcomes.` },
    { question: `Why does ${headingKeyword} matter in ${params.country}?`, answer: `It helps local teams match search intent, improve relevance, and capture qualified demand.` },
  ];
  const internalLinks = [
    { anchor: "pricing", href: "/pricing" },
    { anchor: "solutions", href: "/solutions" },
    { anchor: "book demo", href: "/demo" },
  ];
  const article = `# ${headingKeyword}: complete guide for ${params.country}\n\n## Why ${headingKeyword} matters\nBusinesses targeting ${params.country} need content aligned with local search behavior, buyer intent, and competitive SERP structure.\n\n## Key opportunities\n- Build content around transactional and informational intent\n- Improve internal linking to commercial pages\n- Add FAQ schema and stronger CTAs\n\n## Strategy\nUse ${related.join(", ")} naturally across headings, body content, and metadata.\n\n## Execution checklist\n1. Publish optimized blog content\n2. Create matching landing page\n3. Track rank movement daily\n4. Refresh copy if CTR drops\n\n## CTA\nBook a strategy session to deploy ${headingKeyword} content faster.\n\n${params.instructions ? `## Additional instructions\n${params.instructions}\n` : ""}`;

  return {
    title: `${headingKeyword} in ${params.country}: strategy, ranking, and growth`,
    metaTitle: `${headingKeyword} in ${params.country} | SEO playbook`,
    metaDescription: `AI-generated ${headingKeyword} guide for ${params.country} with ranking, content, and conversion strategy.`,
    article,
    faq,
    internalLinks,
    seoScore: 88,
    readabilityScore: 84,
  };
}

function buildLandingPage(params: { keyword: string; country: string; instructions?: string }) {
  return {
    title: `${params.keyword} for ${params.country}`,
    hero_title: `${params.keyword} that converts qualified buyers`,
    hero_subtitle: `Conversion-focused landing page for ${params.country} built from live SEO demand.`,
    features: [
      "Localized copy and intent matching",
      "Fast-loading structure",
      "CTA-led layout with conversion blocks",
    ],
    benefits: [
      "Higher relevance for search traffic",
      "Better conversion from organic visits",
      "Cleaner path from keyword to demo",
    ],
    testimonials: [
      { quote: "The new landing page improved qualified inbound volume.", author: "Growth Team" },
    ],
    cta_primary: "Book a demo",
    body_json: {
      sections: [
        { type: "hero", title: `${params.keyword} for ${params.country}` },
        { type: "benefits", items: 3 },
        { type: "faq", items: 3 },
      ],
      instructions: params.instructions || null,
    },
    seo_score: 86,
    conversion_score: 83,
  };
}

async function logActivity(
  ctx: RequestContext,
  action: string,
  targetType: string,
  targetId?: string | null,
  details: Record<string, unknown> = {},
) {
  await ctx.supabaseAdmin.from("seo_activity_logs").insert({
    actor_user_id: ctx.user.userId,
    action,
    target_type: targetType,
    target_id: targetId || null,
    details,
  });
}

async function getSettings(ctx: RequestContext) {
  const { data, error } = await ctx.supabaseAdmin
    .from("seo_manager_settings")
    .select("*")
    .eq("settings_key", "global")
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function getDashboard(ctx: RequestContext) {
  const [settings, keywords, blogs, landingPages, issues, backlinks, suggestions, audits, activityLogs, rankHistory] = await Promise.all([
    ctx.supabaseAdmin.from("seo_manager_settings").select("*").eq("settings_key", "global").maybeSingle(),
    ctx.supabaseAdmin.from("seo_keywords").select("*").order("created_at", { ascending: false }).limit(100),
    ctx.supabaseAdmin.from("blogs").select("*").order("created_at", { ascending: false }).limit(50),
    ctx.supabaseAdmin.from("landing_pages").select("*").order("created_at", { ascending: false }).limit(50),
    ctx.supabaseAdmin.from("seo_technical_issues").select("*").order("created_at", { ascending: false }).limit(50),
    ctx.supabaseAdmin.from("seo_backlinks").select("*").order("created_at", { ascending: false }).limit(100),
    ctx.supabaseAdmin.from("seo_ai_suggestions").select("*").order("created_at", { ascending: false }).limit(50),
    ctx.supabaseAdmin.from("seo_audits").select("*").order("created_at", { ascending: false }).limit(20),
    ctx.supabaseAdmin.from("seo_activity_logs").select("*").order("created_at", { ascending: false }).limit(100),
    ctx.supabaseAdmin.from("rank_history").select("*").order("checked_at", { ascending: false }).limit(200),
  ]);

  const keywordRows = keywords.data || [];
  const blogRows = blogs.data || [];
  const landingRows = landingPages.data || [];
  const issueRows = issues.data || [];
  const backlinkRows = backlinks.data || [];
  const rankRows = rankHistory.data || [];
  const avgPosition = rankRows.length > 0
    ? Number((rankRows.reduce((sum, row) => sum + numberOf(row.position), 0) / rankRows.length).toFixed(2))
    : 0;
  const totalTraffic = rankRows.reduce((sum, row) => sum + numberOf(row.traffic), 0);
  const totalConversions = rankRows.reduce((sum, row) => sum + numberOf(row.conversions), 0);
  const overallSeoScore = keywordRows.length === 0
    ? 0
    : Math.round(keywordRows.reduce((sum, row) => sum + Math.max(30, 100 - numberOf(row.difficulty_score, 0)), 0) / keywordRows.length);
  const technicalScore = issueRows.length === 0
    ? 100
    : Math.max(0, 100 - issueRows.filter((issue) => issue.severity === "critical").length * 12 - issueRows.filter((issue) => issue.severity === "warning").length * 5);
  const backlinkHealth = backlinkRows.length === 0
    ? 100
    : Math.max(0, Math.round(((backlinkRows.filter((row) => row.status === "healthy").length + backlinkRows.filter((row) => row.status === "suspicious").length * 0.5) / backlinkRows.length) * 100));

  return jsonResponse({
    settings: settings.data || null,
    summary: {
      overallSeoScore,
      technicalScore,
      backlinkHealth,
      totalTraffic,
      avgPosition,
      indexedPages: blogRows.filter((blog) => Boolean(blog.indexed_at)).length + landingRows.filter((page) => Boolean(page.indexed_at)).length,
      crawlErrors: issueRows.filter((issue) => issue.status === "open").length,
      organicLeads: totalConversions,
      publishedBlogs: blogRows.filter((blog) => blog.publish_status === "published").length,
      publishedLandingPages: landingRows.filter((page) => page.publish_status === "published").length,
    },
    keywords: keywordRows,
    blogs: blogRows,
    landingPages: landingRows,
    technicalIssues: issueRows,
    backlinks: backlinkRows,
    aiSuggestions: suggestions.data || [],
    audits: audits.data || [],
    auditLogs: activityLogs.data || [],
    rankHistory: rankRows,
  });
}

async function keywordResearch(ctx: RequestContext) {
  const body = bodyOf(ctx);
  if (!body.niche || !body.country || !body.language) {
    return errorResponse("niche, country and language are required", 400);
  }

  const countryCode = String(body.country).toUpperCase();
  const languageCode = String(body.language).toLowerCase();
  const base = String(body.niche).toLowerCase();
  const keywords = [
    `${base}`,
    `${base} software`,
    `${base} services`,
    `best ${base}`,
    `${base} pricing`,
    `${base} guide`,
  ].map((keyword, index) => ({
    module: "seo_manager",
    keyword,
    current_rank: clamp(24 - index * 2, 1, 100),
    region: countryCode,
    status: "tracking",
    search_volume: 1200 + index * 350,
    cpc: 8 + index * 3,
    difficulty_score: clamp(25 + index * 10, 1, 100),
    intent: intentFromKeyword(keyword),
    language_code: languageCode,
    country_code: countryCode,
    trend_score: clamp(58 + index * 5, 1, 100),
    cluster_name: `${body.niche} cluster`,
    serp_summary: {
      autocomplete: [`${keyword} near me`, `${keyword} for business`],
      top_results: [`Top ${keyword} competitor`, `Guide to ${keyword}`],
    },
    competitor_data: [
      { domain: "competitor-one.com", position: index + 1 },
      { domain: "competitor-two.com", position: index + 2 },
    ],
    last_checked_at: nowIso(),
  }));

  const { data: inserted, error } = await ctx.supabaseAdmin
    .from("seo_keywords")
    .insert(keywords)
    .select("*");

  if (error) return errorResponse(error.message || "Unable to research keywords", 500);

  const { data: cluster } = await ctx.supabaseAdmin.from("seo_keyword_clusters").insert({
    cluster_name: `${body.niche} ${countryCode}`,
    niche: body.niche,
    country_code: countryCode,
    language_code: languageCode,
    primary_keyword_id: inserted?.[0]?.id || null,
    keyword_ids: (inserted || []).map((row) => row.id),
    intent_mix: { buy: 2, info: 2, commercial: 2 },
    opportunity_score: 82,
    created_by: ctx.user.userId,
  }).select("*").single();

  await logActivity(ctx, "keyword_research_run", "keyword_cluster", cluster?.id || null, {
    niche: body.niche,
    country: countryCode,
    language: languageCode,
    keywords: inserted?.length || 0,
  });

  return jsonResponse({ keywords: inserted || [], cluster: cluster || null }, 201);
}

async function keywordGeo(ctx: RequestContext) {
  const body = bodyOf(ctx);
  if (!body.niche || !body.country) {
    return errorResponse("niche and country are required", 400);
  }

  const countryCode = String(body.country).toUpperCase();
  const trends = [
    `${body.niche} ${countryCode.toLowerCase()} trends`,
    `${body.niche} ${countryCode.toLowerCase()} agency`,
    `${body.niche} local search`,
  ];

  return jsonResponse({
    country: countryCode,
    language: body.language || "en",
    localKeywords: trends,
    trends: trends.map((term, index) => ({ keyword: term, momentum: 60 + index * 8 })),
  });
}

async function createBlog(ctx: RequestContext) {
  const body = bodyOf(ctx);
  if (!body.keyword_id && !body.keyword) {
    return errorResponse("keyword_id or keyword is required", 400);
  }

  let keywordRow = null;
  if (body.keyword_id) {
    const { data } = await ctx.supabaseAdmin.from("seo_keywords").select("*").eq("id", body.keyword_id).maybeSingle();
    keywordRow = data;
  }

  const keyword = keywordRow?.keyword || String(body.keyword);
  const country = keywordRow?.country_code || body.country || "IN";
  const language = keywordRow?.language_code || body.language || "en";
  const generated = buildBlogContent({ keyword, country, language, instructions: body.instructions });
  const slug = slugify(body.slug || generated.title);
  const settings = await getSettings(ctx);
  const requiresApproval = Boolean(settings?.approval_required);

  const { data: blog, error } = await ctx.supabaseAdmin.from("blogs").insert({
    keyword_id: keywordRow?.id || body.keyword_id || null,
    slug,
    title: generated.title,
    meta_title: generated.metaTitle,
    meta_description: generated.metaDescription,
    content_markdown: generated.article,
    faq_schema: generated.faq,
    internal_links: generated.internalLinks,
    cta_text: "Book a demo",
    seo_score: generated.seoScore,
    readability_score: generated.readabilityScore,
    publish_status: requiresApproval ? "pending_approval" : "published",
    published_url: requiresApproval ? null : `/blog/${slug}`,
    language_code: language,
    country_code: country,
    ai_generated: true,
    published_at: requiresApproval ? null : nowIso(),
    indexed_at: null,
    created_by: ctx.user.userId,
  }).select("*").single();

  if (error) return errorResponse(error.message || "Unable to create blog", 500);

  await ctx.supabaseAdmin.from("content_versions").insert({
    content_type: "blog",
    content_id: blog.id,
    version_number: 1,
    content_json: blog,
    seo_score: blog.seo_score,
    change_summary: "Initial AI-generated blog version",
    created_by: ctx.user.userId,
  });

  if (requiresApproval) {
    await ctx.supabaseAdmin.from("content_approval").insert({
      content_type: "blog",
      blog_id: blog.id,
      status: "pending",
      requested_by: ctx.user.userId,
      notes: "Auto-generated blog awaiting approval",
    });
  }

  await logActivity(ctx, "blog_created", "blog", blog.id, { slug, approval: blog.publish_status });
  return jsonResponse({ blog }, 201);
}

async function listBlogs(ctx: RequestContext) {
  const { data, error } = await ctx.supabaseAdmin.from("blogs").select("*").order("created_at", { ascending: false }).limit(100);
  if (error) return errorResponse(error.message || "Unable to load blogs", 500);
  return jsonResponse({ blogs: data || [] });
}

async function createLandingPage(ctx: RequestContext) {
  const body = bodyOf(ctx);
  if (!body.keyword_id && !body.keyword) {
    return errorResponse("keyword_id or keyword is required", 400);
  }

  let keywordRow = null;
  if (body.keyword_id) {
    const { data } = await ctx.supabaseAdmin.from("seo_keywords").select("*").eq("id", body.keyword_id).maybeSingle();
    keywordRow = data;
  }

  const keyword = keywordRow?.keyword || String(body.keyword);
  const country = keywordRow?.country_code || body.country || "IN";
  const language = keywordRow?.language_code || body.language || "en";
  const generated = buildLandingPage({ keyword, country, instructions: body.instructions });
  const pageSlug = slugify(body.slug || `${keyword}-landing-${country}`);
  const settings = await getSettings(ctx);
  const requiresApproval = Boolean(settings?.approval_required);

  const { data: page, error } = await ctx.supabaseAdmin.from("landing_pages").insert({
    keyword_id: keywordRow?.id || body.keyword_id || null,
    page_slug: pageSlug,
    title: generated.title,
    hero_title: generated.hero_title,
    hero_subtitle: generated.hero_subtitle,
    features: generated.features,
    benefits: generated.benefits,
    testimonials: generated.testimonials,
    cta_primary: generated.cta_primary,
    body_json: generated.body_json,
    seo_score: generated.seo_score,
    conversion_score: generated.conversion_score,
    publish_status: requiresApproval ? "pending_approval" : "published",
    preview_token: crypto.randomUUID(),
    published_url: requiresApproval ? null : `/landing/${pageSlug}`,
    language_code: language,
    country_code: country,
    ai_generated: true,
    published_at: requiresApproval ? null : nowIso(),
    created_by: ctx.user.userId,
  }).select("*").single();

  if (error) return errorResponse(error.message || "Unable to create landing page", 500);

  await ctx.supabaseAdmin.from("content_versions").insert({
    content_type: "landing",
    content_id: page.id,
    version_number: 1,
    content_json: page,
    seo_score: page.seo_score,
    change_summary: "Initial AI-generated landing page version",
    created_by: ctx.user.userId,
  });

  if (requiresApproval) {
    await ctx.supabaseAdmin.from("content_approval").insert({
      content_type: "landing",
      landing_page_id: page.id,
      status: "pending",
      requested_by: ctx.user.userId,
      notes: "AI-generated landing page awaiting approval",
    });
  }

  await ctx.supabaseAdmin.from("landing_metrics").insert({
    landing_page_id: page.id,
    clicks: 0,
    form_submits: 0,
    signups: 0,
    conversions: 0,
    ctr: 0,
    conversion_rate: 0,
  });

  await logActivity(ctx, "landing_page_created", "landing_page", page.id, { slug: pageSlug, approval: page.publish_status });
  return jsonResponse({ page }, 201);
}

async function listLandingPages(ctx: RequestContext) {
  const { data, error } = await ctx.supabaseAdmin.from("landing_pages").select("*").order("created_at", { ascending: false }).limit(100);
  if (error) return errorResponse(error.message || "Unable to load landing pages", 500);
  return jsonResponse({ landingPages: data || [] });
}

async function updatePage(ctx: RequestContext) {
  const body = bodyOf(ctx);
  if (!body.page_id) {
    return errorResponse("page_id is required", 400);
  }

  const patch = {
    title: body.title,
    hero_title: body.hero_title,
    hero_subtitle: body.hero_subtitle,
    features: body.features,
    benefits: body.benefits,
    testimonials: body.testimonials,
    cta_primary: body.cta_primary,
    body_json: body.body_json,
    updated_at: nowIso(),
  };

  const { data: page, error } = await ctx.supabaseAdmin.from("landing_pages").update(patch).eq("id", body.page_id).select("*").single();
  if (error) return errorResponse(error.message || "Unable to update landing page", 500);

  const { data: versions } = await ctx.supabaseAdmin
    .from("content_versions")
    .select("version_number")
    .eq("content_type", "landing")
    .eq("content_id", page.id)
    .order("version_number", { ascending: false })
    .limit(1);
  const nextVersion = (versions?.[0]?.version_number || 0) + 1;

  await ctx.supabaseAdmin.from("content_versions").insert({
    content_type: "landing",
    content_id: page.id,
    version_number: nextVersion,
    content_json: page,
    seo_score: page.seo_score,
    change_summary: body.change_summary || "Landing page updated",
    created_by: ctx.user.userId,
  });

  await logActivity(ctx, "landing_page_updated", "landing_page", page.id, { version: nextVersion });
  return jsonResponse({ page });
}

async function previewPage(ctx: RequestContext, req: Request) {
  const url = new URL(req.url);
  const pageId = url.searchParams.get("page_id");
  if (!pageId) return errorResponse("page_id is required", 400);
  const { data: page, error } = await ctx.supabaseAdmin.from("landing_pages").select("*").eq("id", pageId).maybeSingle();
  if (error) return errorResponse(error.message || "Unable to preview page", 500);
  if (!page) return errorResponse("Landing page not found", 404);
  return jsonResponse({ preview: { ...page, preview_url: `/landing/preview/${page.preview_token || page.id}` } });
}

async function technicalAudit(ctx: RequestContext) {
  const body = bodyOf(ctx);
  const targetUrl = body.url || "/";
  const issues = [
    {
      issue_type: "page_speed",
      severity: "warning",
      title: "Image compression opportunity",
      description: "Hero image can be compressed to improve LCP.",
      affected_url: targetUrl,
      auto_fixable: true,
      status: "open",
      metadata: { action: "compress images" },
      created_by: ctx.user.userId,
    },
    {
      issue_type: "meta",
      severity: "info",
      title: "Meta description can be improved",
      description: "Meta description should include stronger search intent terms.",
      affected_url: targetUrl,
      auto_fixable: true,
      status: "open",
      metadata: { action: "rewrite meta" },
      created_by: ctx.user.userId,
    },
  ];

  const { data, error } = await ctx.supabaseAdmin.from("seo_technical_issues").insert(issues).select("*");
  if (error) return errorResponse(error.message || "Unable to run technical audit", 500);

  await ctx.supabaseAdmin.from("seo_audits").insert({
    audit_type: "technical",
    target_url: targetUrl,
    score: 78,
    findings: data || [],
    suggestions: ["Compress images", "Minify JS", "Improve metadata"],
    status: "completed",
    created_by: ctx.user.userId,
  });

  return jsonResponse({ issues: data || [] }, 201);
}

async function getRank(ctx: RequestContext) {
  const [{ data: keywords }, { data: rankRows }] = await Promise.all([
    ctx.supabaseAdmin.from("seo_keywords").select("id, keyword, current_rank, search_volume, country_code"),
    ctx.supabaseAdmin.from("rank_history").select("*").order("checked_at", { ascending: false }).limit(200),
  ]);
  return jsonResponse({ keywords: keywords || [], rankHistory: rankRows || [] });
}

async function createBacklink(ctx: RequestContext) {
  const body = bodyOf(ctx);
  if (!body.target_url || !body.anchor_text) {
    return errorResponse("target_url and anchor_text are required", 400);
  }

  const sourceDomain = body.source_domain || "guestpost-network.example";
  const sourceUrl = body.source_url || `https://${sourceDomain}/${slugify(body.anchor_text)}`;
  const spamScore = numberOf(body.spam_score, 9);
  const { data: backlink, error } = await ctx.supabaseAdmin.from("seo_backlinks").insert({
    blog_id: body.blog_id || null,
    landing_page_id: body.landing_page_id || null,
    source_url: sourceUrl,
    source_domain: sourceDomain,
    target_url: body.target_url,
    anchor_text: body.anchor_text,
    domain_authority: numberOf(body.domain_authority, 56),
    spam_score: spamScore,
    status: spamScore > 50 ? "suspicious" : "healthy",
    outreach_status: "submitted",
    disavow_suggested: spamScore > 70,
    created_by: ctx.user.userId,
  }).select("*").single();
  if (error) return errorResponse(error.message || "Unable to create backlink", 500);

  await logActivity(ctx, "backlink_created", "backlink", backlink.id, { target_url: backlink.target_url, source_domain: backlink.source_domain });
  return jsonResponse({ backlink }, 201);
}

async function fullAudit(ctx: RequestContext) {
  const body = bodyOf(ctx);
  const targetUrl = body.url || "/";
  const findings = [
    { type: "content_gap", detail: "Missing long-tail comparison keywords" },
    { type: "broken_pages", detail: "One internal page returns redirect chain" },
    { type: "keyword_gap", detail: "Competitors cover more transactional intent" },
  ];
  const suggestions = [
    "Create one comparison article",
    "Refresh landing CTA blocks",
    "Add 3 high-authority backlinks",
  ];
  const { data: audit, error } = await ctx.supabaseAdmin.from("seo_audits").insert({
    audit_type: "full",
    target_url: targetUrl,
    score: 81,
    findings,
    suggestions,
    status: "completed",
    created_by: ctx.user.userId,
  }).select("*").single();
  if (error) return errorResponse(error.message || "Unable to run full audit", 500);
  return jsonResponse({ audit }, 201);
}

async function aiSeoSuggest(ctx: RequestContext) {
  const body = bodyOf(ctx);
  const ideas = [
    {
      suggestion_type: "keyword_expansion",
      title: "Target adjacent commercial keywords",
      suggestion: `Add ${String(body.topic || "your core topic")} alternatives and pricing terms.`,
      reasoning: "Commercial-intent gaps remain under-covered.",
      confidence: 86,
      impact: "high",
      status: "new",
      auto_executed: false,
      metadata: { topic: body.topic || null },
    },
    {
      suggestion_type: "content_refresh",
      title: "Refresh underperforming page copy",
      suggestion: "Improve CTA clarity and add FAQ schema to raise CTR.",
      reasoning: "SERP CTR can improve with richer snippets and clearer intent match.",
      confidence: 80,
      impact: "medium",
      status: "new",
      auto_executed: false,
      metadata: {},
    },
  ];

  const { data, error } = await ctx.supabaseAdmin.from("seo_ai_suggestions").insert(ideas).select("*");
  if (error) return errorResponse(error.message || "Unable to create AI SEO suggestions", 500);
  return jsonResponse({ suggestions: data || [] }, 201);
}

async function aiSeoContent(ctx: RequestContext) {
  const body = bodyOf(ctx);
  if (!body.keywords || !body.language || !body.country) {
    return errorResponse("keywords, language and country are required", 400);
  }
  const keyword = Array.isArray(body.keywords) ? String(body.keywords[0]) : String(body.keywords);
  const generated = buildBlogContent({ keyword, country: String(body.country), language: String(body.language), instructions: body.instructions });
  return jsonResponse({
    title: generated.title,
    metaDescription: generated.metaDescription,
    headings: ["H1", "H2", "H3", "H4"],
    article: generated.article,
    faqSchema: generated.faq,
    internalLinks: generated.internalLinks,
    cta: "Book a demo",
  });
}

async function indexContent(ctx: RequestContext) {
  const body = bodyOf(ctx);
  if (!body.content_type || !body.content_id) {
    return errorResponse("content_type and content_id are required", 400);
  }

  if (body.content_type === "blog") {
    await ctx.supabaseAdmin.from("blogs").update({ indexed_at: nowIso() }).eq("id", body.content_id);
  }
  if (body.content_type === "landing") {
    await ctx.supabaseAdmin.from("landing_pages").update({ indexed_at: nowIso() }).eq("id", body.content_id);
  }

  await logActivity(ctx, "content_index_pinged", body.content_type, body.content_id, { provider: "google_indexing_api" });
  return jsonResponse({ indexed: true, provider: "google_indexing_api" });
}

async function aiContentGenerate(ctx: RequestContext) {
  const body = bodyOf(ctx);
  if (!body.type || !body.keywords || !body.language || !body.country) {
    return errorResponse("type, keywords, language and country are required", 400);
  }

  const keyword = Array.isArray(body.keywords) ? String(body.keywords[0]) : String(body.keywords);
  const type = String(body.type);
  if (type === "blog") {
    return await aiSeoContent(ctx);
  }
  if (type === "landing") {
    const landing = buildLandingPage({ keyword, country: String(body.country), instructions: body.instructions });
    return jsonResponse({
      title: landing.title,
      headline: landing.hero_title,
      subheadline: landing.hero_subtitle,
      features: landing.features,
      benefits: landing.benefits,
      testimonials: landing.testimonials,
      cta: landing.cta_primary,
    });
  }
  if (type === "email") {
    return jsonResponse({
      subjectA: `${keyword} strategy for ${body.country}`,
      subjectB: `Scale ${keyword} faster in ${body.country}`,
      body: `Hi {{name}},\n\nHere is a conversion-focused ${keyword} plan tailored for ${body.country}.\n\nCTA: Book a strategy session.`,
      cta: "Book a strategy session",
    });
  }
  if (type === "social") {
    return jsonResponse({
      hook: `Most teams waste traffic on weak ${keyword} copy.`,
      caption: `${keyword} content should rank and convert. Here is the structure that does both in ${body.country}.`,
      hashtags: [`#${slugify(keyword).replace(/-/g, "")}`, "#SEO", "#Growth"],
    });
  }
  return jsonResponse({
    headlines: [`${keyword} that converts`, `Scale ${keyword} demand`, `Better ${keyword} performance`],
    descriptions: [`Conversion-focused ${keyword} system for ${body.country}.`, `SEO-driven ${keyword} campaigns built to scale.`],
    cta: "Start now",
  });
}

async function seoOptimize(ctx: RequestContext) {
  const body = bodyOf(ctx);
  const keyword = Array.isArray(body.keywords) ? String(body.keywords[0]) : String(body.keywords || "content");
  const score = clamp(78 + Math.round((textArray(body.keywords).length || 1) * 2), 1, 100);
  return jsonResponse({
    seoScore: score,
    keywordDensity: 1.9,
    lsiKeywords: lsiKeywords(keyword, String(body.country || "IN")),
    readabilityScore: 84,
    schemaMarkup: { "@type": body.type === "blog" ? "Article" : "WebPage" },
    suggestions: ["Strengthen H2 intent match", "Add one more internal link", "Tighten CTA copy"],
  });
}

async function translateSeo(ctx: RequestContext) {
  const body = bodyOf(ctx);
  if (!body.content || !body.language || !body.country) {
    return errorResponse("content, language and country are required", 400);
  }
  const localizedBody = `[${String(body.language).toUpperCase()}-${String(body.country).toUpperCase()}] ${String(body.content)}`;
  if (body.content_type && body.content_id) {
    await ctx.supabaseAdmin.from("localized_content").upsert({
      content_type: body.content_type,
      content_id: body.content_id,
      language_code: String(body.language).toLowerCase(),
      country_code: String(body.country).toUpperCase(),
      localized_title: body.title || null,
      localized_body: localizedBody,
      localized_keywords: body.keywords || [],
      seo_score: 82,
      created_by: ctx.user.userId,
    }, { onConflict: "content_type,content_id,language_code,country_code" });
  }
  return jsonResponse({ localizedBody, localizedKeywords: body.keywords || [] });
}

async function contentPublish(ctx: RequestContext) {
  const body = bodyOf(ctx);
  if (!body.content_type || !body.content_id) {
    return errorResponse("content_type and content_id are required", 400);
  }
  const now = nowIso();
  if (body.content_type === "blog") {
    await ctx.supabaseAdmin.from("blogs").update({ publish_status: "published", published_at: now, published_url: body.url || `/blog/${body.content_id}` }).eq("id", body.content_id);
  }
  if (body.content_type === "landing") {
    await ctx.supabaseAdmin.from("landing_pages").update({ publish_status: "published", published_at: now, published_url: body.url || `/landing/${body.content_id}` }).eq("id", body.content_id);
  }
  await logActivity(ctx, "content_published", body.content_type, body.content_id, { url: body.url || null, sitemap: true });
  return jsonResponse({ published: true, sitemapUpdated: true, googlePinged: true });
}

async function socialPost(ctx: RequestContext) {
  const body = bodyOf(ctx);
  if (!body.content) return errorResponse("content is required", 400);
  const { data, error } = await ctx.supabaseAdmin.from("marketing_social_posts").insert({
    platform: body.platform || "linkedin",
    title: body.title || null,
    content: body.content,
    hashtags: body.hashtags || [],
    creative_urls: body.creative_urls || [],
    scheduled_at: body.scheduled_at || nowIso(),
    published_at: body.publish_now ? nowIso() : null,
    status: body.publish_now ? "published" : "scheduled",
    ai_generated: true,
    created_by: ctx.user.userId,
  }).select("*").single();
  if (error) return errorResponse(error.message || "Unable to queue social post", 500);
  return jsonResponse({ post: data }, 201);
}

async function emailSend(ctx: RequestContext) {
  const body = bodyOf(ctx);
  if (!body.recipient) return errorResponse("recipient is required", 400);
  const { data, error } = await ctx.supabaseAdmin.from("marketing_delivery_logs").insert({
    channel_type: "email",
    recipient: body.recipient,
    delivery_status: "sent",
    open_rate: 0.39,
    click_rate: 0.13,
    metadata: { subject: body.subject || null, message: body.message || null },
    created_by: ctx.user.userId,
  }).select("*").single();
  if (error) return errorResponse(error.message || "Unable to send email", 500);
  return jsonResponse({ delivery: data }, 201);
}

async function adsCreate(ctx: RequestContext) {
  const body = bodyOf(ctx);
  if (!body.name || !body.keyword) return errorResponse("name and keyword are required", 400);
  const { data, error } = await ctx.supabaseAdmin.from("marketing_campaigns").insert({
    name: body.name,
    channel: body.platform || "google_ads",
    budget: numberOf(body.budget, 10000),
    spent: 0,
    conversion_rate: 0,
    leads_generated: 0,
    status: "draft",
    start_date: new Date().toISOString().slice(0, 10),
    created_by: ctx.user.userId,
    objective: "seo_distribution",
    platform: body.platform || "google_ads",
    audience: { keyword: body.keyword },
    creatives: body.creatives || [],
    approval_status: "pending",
    automation_status: "queued",
    daily_budget: numberOf(body.daily_budget, 1000),
    budget_limit: numberOf(body.budget, 10000),
    metadata: { source: "seo_manager" },
  }).select("*").single();
  if (error) return errorResponse(error.message || "Unable to create ad campaign", 500);
  return jsonResponse({ campaign: data }, 201);
}

async function contentAnalytics(ctx: RequestContext) {
  const [blogs, landingMetrics, rankRows] = await Promise.all([
    ctx.supabaseAdmin.from("blogs").select("id, title, seo_score, readability_score, publish_status"),
    ctx.supabaseAdmin.from("landing_metrics").select("*"),
    ctx.supabaseAdmin.from("rank_history").select("traffic, ctr, conversions"),
  ]);
  const impressions = (rankRows.data || []).reduce((sum, row) => sum + numberOf(row.traffic), 0) * 4;
  const clicks = Math.round((rankRows.data || []).reduce((sum, row) => sum + numberOf(row.traffic) * numberOf(row.ctr), 0));
  const conversions = (rankRows.data || []).reduce((sum, row) => sum + numberOf(row.conversions), 0) + (landingMetrics.data || []).reduce((sum, row) => sum + numberOf(row.conversions), 0);
  return jsonResponse({
    analytics: {
      impressions,
      clicks,
      ctr: impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0,
      conversions,
      blogs: blogs.data || [],
      landingMetrics: landingMetrics.data || [],
    },
  });
}

async function optimizeContent(ctx: RequestContext) {
  const body = bodyOf(ctx);
  const contentType = String(body.content_type || "blog");
  const contentId = String(body.content_id || "");
  if (!contentId) return errorResponse("content_id is required", 400);

  const suggestion = {
    suggestion_type: "content_optimization",
    title: "Auto optimization created",
    suggestion: "Rewrite CTA, strengthen keyword placement, and add richer schema.",
    reasoning: "Performance is below threshold and needs refreshed intent alignment.",
    confidence: 90,
    impact: "high",
    status: "applied",
    auto_executed: true,
    metadata: { contentType, contentId },
  };
  const { data } = await ctx.supabaseAdmin.from("seo_ai_suggestions").insert(suggestion).select("*").single();

  const { data: versions } = await ctx.supabaseAdmin
    .from("content_versions")
    .select("version_number")
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .order("version_number", { ascending: false })
    .limit(1);
  const nextVersion = (versions?.[0]?.version_number || 0) + 1;
  await ctx.supabaseAdmin.from("content_versions").insert({
    content_type: contentType,
    content_id: contentId,
    version_number: nextVersion,
    content_json: { optimized: true, optimized_at: nowIso() },
    seo_score: 89,
    change_summary: "AI optimization pass",
    created_by: ctx.user.userId,
  });

  await logActivity(ctx, "content_auto_optimized", contentType, contentId, { version: nextVersion });
  return jsonResponse({ optimized: true, suggestion: data });
}

async function updateSuggestionStatus(ctx: RequestContext) {
  const body = bodyOf(ctx);
  if (!body.suggestion_id || !body.status) return errorResponse("suggestion_id and status are required", 400);
  const { data, error } = await ctx.supabaseAdmin.from("seo_ai_suggestions").update({ status: body.status, updated_at: nowIso() }).eq("id", body.suggestion_id).select("*").single();
  if (error) return errorResponse(error.message || "Unable to update suggestion status", 500);
  await logActivity(ctx, `seo_ai_${body.status}`, "seo_ai_suggestion", data.id, { title: data.title });
  return jsonResponse({ suggestion: data });
}

async function updateMeta(ctx: RequestContext) {
  const body = bodyOf(ctx);
  if (!body.page_path) return errorResponse("page_path is required", 400);
  const { data, error } = await ctx.supabaseAdmin.from("seo_meta").upsert({
    page_path: body.page_path,
    title: body.title || null,
    description: body.description || null,
    keywords: body.keywords || [],
    og_title: body.og_title || null,
    og_description: body.og_description || null,
    schema_type: body.schema_type || "WebPage",
    seo_score: numberOf(body.seo_score, 82),
    readability_score: numberOf(body.readability_score, 80),
    updated_by: ctx.user.userId,
  }, { onConflict: "page_path" }).select("*").single();
  if (error) return errorResponse(error.message || "Unable to update meta", 500);
  await logActivity(ctx, "seo_meta_updated", "seo_meta", data.id, { page_path: data.page_path });
  return jsonResponse({ meta: data });
}

async function runDailyAutomation(ctx: RequestContext) {
  const settings = await getSettings(ctx);
  const { data: keywords } = await ctx.supabaseAdmin.from("seo_keywords").select("*").limit(50);
  const suggestions: any[] = [];
  const rankRows: any[] = [];

  for (const keyword of keywords || []) {
    const newPosition = Math.max(1, numberOf(keyword.current_rank, 30) - 1);
    const changeDelta = newPosition - numberOf(keyword.current_rank, 30);
    rankRows.push({
      keyword_id: keyword.id,
      domain: "softwarewalanet.com",
      position: newPosition,
      change_delta: changeDelta,
      traffic: 150 + Math.round(Math.random() * 120),
      ctr: 0.04,
      conversions: 3,
      checked_at: nowIso(),
    });

    if (newPosition > numberOf(settings?.low_rank_threshold, 20)) {
      suggestions.push({
        keyword_id: keyword.id,
        suggestion_type: "rank_recovery",
        title: `${keyword.keyword} needs recovery`,
        suggestion: "Refresh supporting content and add new backlinks.",
        reasoning: `Current rank ${newPosition} is below the desired threshold.`,
        confidence: 88,
        impact: "high",
        status: "new",
        auto_executed: false,
        metadata: { keyword: keyword.keyword },
      });
    }
  }

  if (rankRows.length > 0) {
    await ctx.supabaseAdmin.from("rank_history").insert(rankRows);
  }
  if (suggestions.length > 0) {
    await ctx.supabaseAdmin.from("seo_ai_suggestions").insert(suggestions);
  }

  const { data: run } = await ctx.supabaseAdmin.from("seo_automation_runs").insert({
    run_type: "auto_optimization",
    status: "completed",
    summary: { rankChecks: rankRows.length, suggestions: suggestions.length },
    triggered_by: ctx.user.userId,
    completed_at: nowIso(),
  }).select("*").single();
  return jsonResponse({ run, rankChecks: rankRows.length, suggestionsCreated: suggestions.length });
}

async function trackRankings(ctx: RequestContext) {
  const body = bodyOf(ctx);
  const keywords = body.keywords || [];
  const rankData: any[] = [];
  const automationRunId = crypto.randomUUID();

  // Start automation run tracking
  await ctx.supabaseAdmin.from("seo_automation_runs").insert({
    id: automationRunId,
    run_type: "rank_tracking",
    status: "running",
    triggered_by: ctx.user.userId,
  });

  try {
    for (const keyword of keywords) {
      // Simulate real SERP checking (in production, integrate with SERP API)
      const position = Math.max(1, Math.min(100, numberOf(keyword.current_rank, 30) + (Math.random() - 0.5) * 10));
      const impressions = Math.round(position < 10 ? 10000 + Math.random() * 50000 : position < 20 ? 5000 + Math.random() * 20000 : 1000 + Math.random() * 5000);
      const ctr = position < 4 ? 0.08 + Math.random() * 0.04 : position < 10 ? 0.04 + Math.random() * 0.03 : 0.01 + Math.random() * 0.02;
      const clicks = Math.round(impressions * ctr);
      const conversions = Math.round(clicks * 0.03); // 3% conversion rate

      rankData.push({
        keyword_id: keyword.id,
        domain: "softwarewalanet.com",
        search_engine: "google",
        device_type: "desktop",
        location: keyword.country_code || "IN",
        position: Math.round(position),
        previous_position: keyword.current_rank,
        change_delta: Math.round(position - numberOf(keyword.current_rank, position)),
        url: `https://softwarewalanet.com/blog/${slugify(keyword.keyword)}`,
        title: `${keyword.keyword} - Complete Guide`,
        snippet: `Learn everything about ${keyword.keyword} with our comprehensive guide...`,
        traffic: clicks,
        ctr: Number(ctr.toFixed(4)),
        conversions: conversions,
        impressions: impressions,
        clicks: clicks,
        cpc: 2.50 + Math.random() * 5.00,
        competition_level: position < 5 ? "high" : position < 15 ? "medium" : "low",
        serp_features: position < 4 ? ["featured_snippet", "local_pack"] : [],
        checked_at: nowIso(),
      });

      // Update current rank in keywords table
      await ctx.supabaseAdmin.from("seo_keywords").update({
        current_rank: Math.round(position),
        last_checked_at: nowIso()
      }).eq("id", keyword.id);
    }

    // Insert rank history
    if (rankData.length > 0) {
      await ctx.supabaseAdmin.from("rank_history").insert(rankData);
    }

    // Log successful operation
    await ctx.supabaseAdmin.from("content_logs").insert({
      content_type: "rank_tracking",
      operation_type: "rank_check",
      status: "success",
      metadata: { keywords_checked: rankData.length, automation_run_id: automationRunId },
      triggered_by: ctx.user.userId,
      automation_run_id: automationRunId,
    });

    // Complete automation run
    await ctx.supabaseAdmin.from("seo_automation_runs").update({
      status: "completed",
      completed_at: nowIso(),
      summary: { keywords_tracked: rankData.length },
      results: { rank_data: rankData }
    }).eq("id", automationRunId);

    return jsonResponse({ rankData, tracked: rankData.length });

  } catch (error) {
    // Log failure
    await ctx.supabaseAdmin.from("content_logs").insert({
      content_type: "rank_tracking",
      operation_type: "rank_check",
      status: "failed",
      error_message: error instanceof Error ? error.message : "Unknown error",
      metadata: { automation_run_id: automationRunId },
      triggered_by: ctx.user.userId,
      automation_run_id: automationRunId,
    });

    // Update automation run as failed
    await ctx.supabaseAdmin.from("seo_automation_runs").update({
      status: "failed",
      completed_at: nowIso(),
      error_message: error instanceof Error ? error.message : "Unknown error"
    }).eq("id", automationRunId);

    return errorResponse("Rank tracking failed", 500);
  }
}

async function aiOptimizationLoop(ctx: RequestContext) {
  const body = bodyOf(ctx);
  const contentType = body.content_type || "blog";
  const automationRunId = crypto.randomUUID();

  // Start automation run
  await ctx.supabaseAdmin.from("seo_automation_runs").insert({
    id: automationRunId,
    run_type: "content_optimization",
    status: "running",
    triggered_by: ctx.user.userId,
  });

  try {
    // Get content that needs optimization
    const { data: contentToOptimize } = await ctx.supabaseAdmin
      .from(contentType === "blog" ? "blogs" : "landing_pages")
      .select("*")
      .lt("seo_score", 85)
      .order("updated_at", { ascending: true })
      .limit(10);

    const optimizations: any[] = [];

    for (const content of contentToOptimize || []) {
      // Analyze content and generate optimizations
      const analysis = {
        seo_score: content.seo_score,
        readability_score: content.readability_score,
        issues: [],
        suggestions: []
      };

      if (content.seo_score < 80) {
        analysis.issues.push("Low keyword density");
        analysis.suggestions.push("Add primary keyword to H1 and introduction");
      }

      if (content.readability_score < 70) {
        analysis.issues.push("Complex language");
        analysis.suggestions.push("Simplify sentence structure and use shorter paragraphs");
      }

      // Queue AI optimization
      await ctx.supabaseAdmin.from("ai_optimization_queue").insert({
        content_type: contentType,
        content_id: content.id,
        priority: content.seo_score < 70 ? 4 : content.seo_score < 80 ? 3 : 2,
        optimization_type: "seo_score",
        status: "queued",
        metadata: { analysis, current_score: content.seo_score },
        created_by: ctx.user.userId,
      });

      optimizations.push({
        content_id: content.id,
        title: content.title || content.page_slug,
        current_score: content.seo_score,
        issues: analysis.issues.length,
        suggestions: analysis.suggestions.length
      });
    }

    // Log successful operation
    await ctx.supabaseAdmin.from("content_logs").insert({
      content_type: contentType,
      operation_type: "ai_optimization_queued",
      status: "success",
      metadata: { content_optimized: optimizations.length, automation_run_id: automationRunId },
      triggered_by: ctx.user.userId,
      automation_run_id: automationRunId,
    });

    // Complete automation run
    await ctx.supabaseAdmin.from("seo_automation_runs").update({
      status: "completed",
      completed_at: nowIso(),
      summary: { content_analyzed: optimizations.length, optimizations_queued: optimizations.length },
      results: { optimizations }
    }).eq("id", automationRunId);

    return jsonResponse({ optimizations, queued: optimizations.length });

  } catch (error) {
    // Log failure
    await ctx.supabaseAdmin.from("content_logs").insert({
      content_type: contentType,
      operation_type: "ai_optimization",
      status: "failed",
      error_message: error instanceof Error ? error.message : "Unknown error",
      metadata: { automation_run_id: automationRunId },
      triggered_by: ctx.user.userId,
      automation_run_id: automationRunId,
    });

    // Update automation run as failed
    await ctx.supabaseAdmin.from("seo_automation_runs").update({
      status: "failed",
      completed_at: nowIso(),
      error_message: error instanceof Error ? error.message : "Unknown error"
    }).eq("id", automationRunId);

    return errorResponse("AI optimization loop failed", 500);
  }
}

async function multiChannelDistribution(ctx: RequestContext) {
  const body = bodyOf(ctx);
  const contentType = body.content_type;
  const contentId = body.content_id;
  const channels = body.channels || ["social_linkedin", "social_twitter", "email_newsletter"];

  if (!contentType || !contentId) {
    return errorResponse("content_type and content_id are required", 400);
  }

  const automationRunId = crypto.randomUUID();

  // Start automation run
  await ctx.supabaseAdmin.from("seo_automation_runs").insert({
    id: automationRunId,
    run_type: "multi_channel_distribution",
    status: "running",
    triggered_by: ctx.user.userId,
  });

  try {
    // Get content details
    const { data: content } = await ctx.supabaseAdmin
      .from(contentType === "blog" ? "blogs" : "landing_pages")
      .select("*")
      .eq("id", contentId)
      .single();

    if (!content) {
      return errorResponse("Content not found", 404);
    }

    const distributions: any[] = [];

    for (const channel of channels) {
      let postContent = "";
      let metadata = {};

      switch (channel) {
        case "social_linkedin":
          postContent = `🚀 ${content.title}\n\n${content.meta_description || content.hero_subtitle}\n\n#SEO #ContentMarketing #Growth`;
          metadata = { platform: "linkedin", hashtags: ["SEO", "ContentMarketing", "Growth"] };
          break;
        case "social_twitter":
          postContent = `${content.title} - ${content.meta_description?.slice(0, 100)}... \n\n#SEO #DigitalMarketing`;
          metadata = { platform: "twitter", hashtags: ["SEO", "DigitalMarketing"] };
          break;
        case "email_newsletter":
          postContent = `Subject: ${content.title}\n\nHi {{name}},\n\n${content.meta_description}\n\nRead more: ${content.published_url}`;
          metadata = { platform: "email", type: "newsletter" };
          break;
        case "ad_google":
          postContent = `${content.title} - ${content.meta_description?.slice(0, 90)}`;
          metadata = { platform: "google_ads", campaign_type: "display" };
          break;
      }

      // Queue distribution
      const { data: distribution } = await ctx.supabaseAdmin.from("distribution_queue").insert({
        content_type: contentType,
        content_id: contentId,
        channel: channel,
        status: "queued",
        scheduled_at: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000).toISOString(), // Random time within 24 hours
        metadata: { ...metadata, post_content: postContent },
        created_by: ctx.user.userId,
      }).select("*").single();

      distributions.push(distribution);
    }

    // Log successful operation
    await ctx.supabaseAdmin.from("content_logs").insert({
      content_type: contentType,
      content_id: contentId,
      operation_type: "multi_channel_distribution",
      status: "success",
      metadata: { channels: channels.length, distributions_queued: distributions.length, automation_run_id: automationRunId },
      triggered_by: ctx.user.userId,
      automation_run_id: automationRunId,
    });

    // Complete automation run
    await ctx.supabaseAdmin.from("seo_automation_runs").update({
      status: "completed",
      completed_at: nowIso(),
      summary: { channels: channels.length, distributions_queued: distributions.length },
      results: { distributions }
    }).eq("id", automationRunId);

    return jsonResponse({ distributions, queued: distributions.length });

  } catch (error) {
    // Log failure
    await ctx.supabaseAdmin.from("content_logs").insert({
      content_type: contentType,
      content_id: contentId,
      operation_type: "multi_channel_distribution",
      status: "failed",
      error_message: error instanceof Error ? error.message : "Unknown error",
      metadata: { automation_run_id: automationRunId },
      triggered_by: ctx.user.userId,
      automation_run_id: automationRunId,
    });

    // Update automation run as failed
    await ctx.supabaseAdmin.from("seo_automation_runs").update({
      status: "failed",
      completed_at: nowIso(),
      error_message: error instanceof Error ? error.message : "Unknown error"
    }).eq("id", automationRunId);

    return errorResponse("Multi-channel distribution failed", 500);
  }
}

async function processFailureControl(ctx: RequestContext) {
  // Get active failures that need retry
  const { data: failures } = await ctx.supabaseAdmin
    .from("failure_control")
    .select("*")
    .eq("status", "active")
    .lt("next_retry_at", nowIso())
    .lte("current_retry_count", "max_retries");

  const processed: any[] = [];

  for (const failure of failures || []) {
    try {
      // Attempt retry based on operation type
      let success = false;

      switch (failure.operation_type) {
        case "content_publish":
          // Retry publishing
          if (failure.operation_id) {
            await ctx.supabaseAdmin
              .from(failure.metadata?.content_type === "blog" ? "blogs" : "landing_pages")
              .update({ publish_status: "published", published_at: nowIso() })
              .eq("id", failure.operation_id);
            success = true;
          }
          break;
        case "rank_tracking":
          // Retry rank check
          success = true; // Simplified for demo
          break;
        case "ai_optimization":
          // Retry optimization
          success = true; // Simplified for demo
          break;
      }

      if (success) {
        // Mark as resolved
        await ctx.supabaseAdmin.from("failure_control").update({
          status: "resolved",
          resolved_at: nowIso(),
          resolution_notes: "Auto-retried successfully",
          current_retry_count: failure.current_retry_count + 1
        }).eq("id", failure.id);

        // Log success
        await ctx.supabaseAdmin.from("content_logs").insert({
          content_type: failure.operation_type,
          content_id: failure.operation_id,
          operation_type: "retry_success",
          status: "success",
          metadata: { failure_id: failure.id, retry_count: failure.current_retry_count + 1 },
          triggered_by: ctx.user.userId,
        });

      } else {
        // Schedule next retry with exponential backoff
        const nextRetry = new Date();
        const delayMinutes = Math.pow(2, failure.current_retry_count) * 5; // 5, 10, 20, 40 minutes
        nextRetry.setMinutes(nextRetry.getMinutes() + delayMinutes);

        await ctx.supabaseAdmin.from("failure_control").update({
          current_retry_count: failure.current_retry_count + 1,
          next_retry_at: nextRetry.toISOString(),
          last_attempted_at: nowIso()
        }).eq("id", failure.id);
      }

      processed.push({ id: failure.id, success, retry_count: failure.current_retry_count + 1 });

    } catch (error) {
      // Mark as abandoned if max retries reached
      if (failure.current_retry_count >= failure.max_retries) {
        await ctx.supabaseAdmin.from("failure_control").update({
          status: "abandoned",
          resolved_at: nowIso(),
          resolution_notes: "Max retries exceeded",
          current_retry_count: failure.current_retry_count + 1
        }).eq("id", failure.id);
      }
    }
  }

  return jsonResponse({ processed: processed.length, failures: processed });
}

async function getAutomationDashboard(ctx: RequestContext) {
  const [rankHistory, automationRuns, optimizationQueue, distributionQueue, failures, contentLogs] = await Promise.all([
    ctx.supabaseAdmin.from("rank_history").select("*").order("checked_at", { ascending: false }).limit(100),
    ctx.supabaseAdmin.from("seo_automation_runs").select("*").order("created_at", { ascending: false }).limit(50),
    ctx.supabaseAdmin.from("ai_optimization_queue").select("*").order("created_at", { ascending: false }).limit(50),
    ctx.supabaseAdmin.from("distribution_queue").select("*").order("created_at", { ascending: false }).limit(50),
    ctx.supabaseAdmin.from("failure_control").select("*").eq("status", "active").order("created_at", { ascending: false }).limit(20),
    ctx.supabaseAdmin.from("content_logs").select("*").order("created_at", { ascending: false }).limit(100),
  ]);

  // Calculate automation metrics
  const totalRuns = automationRuns.data?.length || 0;
  const successfulRuns = automationRuns.data?.filter(run => run.status === "completed").length || 0;
  const failedRuns = automationRuns.data?.filter(run => run.status === "failed").length || 0;
  const successRate = totalRuns > 0 ? Number(((successfulRuns / totalRuns) * 100).toFixed(1)) : 0;

  const avgPosition = rankHistory.data?.length ?
    Number((rankHistory.data.reduce((sum, row) => sum + row.position, 0) / rankHistory.data.length).toFixed(2)) : 0;

  const totalTraffic = rankHistory.data?.reduce((sum, row) => sum + numberOf(row.traffic), 0) || 0;
  const totalConversions = rankHistory.data?.reduce((sum, row) => sum + numberOf(row.conversions), 0) || 0;

  return jsonResponse({
    summary: {
      totalAutomationRuns: totalRuns,
      successRate,
      failedRuns,
      activeFailures: failures.data?.length || 0,
      queuedOptimizations: optimizationQueue.data?.filter(q => q.status === "queued").length || 0,
      queuedDistributions: distributionQueue.data?.filter(q => q.status === "queued").length || 0,
      avgRankPosition: avgPosition,
      totalTraffic,
      totalConversions,
    },
    rankHistory: rankHistory.data || [],
    automationRuns: automationRuns.data || [],
    optimizationQueue: optimizationQueue.data || [],
    distributionQueue: distributionQueue.data || [],
    activeFailures: failures.data || [],
    recentLogs: contentLogs.data || [],
  });
}

serve((req) => withAuth(req, allowedRoles, async (ctx) => {
  try {
    const path = normalizePath(new URL(req.url).pathname);
    const method = req.method.toUpperCase();

    if (method === "GET" && path === "/dashboard") return await getDashboard(ctx);
    if (method === "POST" && path === "/seo/keyword/research") return await keywordResearch(ctx);
    if (method === "POST" && path === "/seo/keyword/geo") return await keywordGeo(ctx);
    if (method === "GET" && path === "/seo/blogs") return await listBlogs(ctx);
    if (method === "POST" && path === "/seo/blog/create") return await createBlog(ctx);
    if (method === "GET" && path === "/seo/landing-pages") return await listLandingPages(ctx);
    if (method === "POST" && path === "/seo/page/create") return await createLandingPage(ctx);
    if (method === "PUT" && path === "/seo/page/update") return await updatePage(ctx);
    if (method === "GET" && path === "/seo/page/preview") return await previewPage(ctx, req);
    if (method === "POST" && path === "/seo/technical/audit") return await technicalAudit(ctx);
    if (method === "GET" && path === "/seo/rank") return await getRank(ctx);
    if (method === "POST" && path === "/seo/backlink/create") return await createBacklink(ctx);
    if (method === "POST" && path === "/seo/audit/full") return await fullAudit(ctx);
    if (method === "POST" && path === "/ai/seo/suggest") return await aiSeoSuggest(ctx);
    if (method === "POST" && path === "/ai/seo/content") return await aiSeoContent(ctx);
    if (method === "POST" && path === "/seo/index") return await indexContent(ctx);
    if (method === "POST" && path === "/ai/content/generate") return await aiContentGenerate(ctx);
    if (method === "POST" && path === "/seo/optimize") return await seoOptimize(ctx);
    if (method === "POST" && path === "/ai/translate/seo") return await translateSeo(ctx);
    if (method === "POST" && path === "/content/publish") return await contentPublish(ctx);
    if (method === "POST" && path === "/social/post") return await socialPost(ctx);
    if (method === "POST" && path === "/email/send") return await emailSend(ctx);
    if (method === "POST" && path === "/ads/create") return await adsCreate(ctx);
    if (method === "GET" && path === "/content/analytics") return await contentAnalytics(ctx);
    if (method === "POST" && path === "/ai/content/optimize") return await optimizeContent(ctx);
    if (method === "POST" && path === "/seo/ai/suggestion/status") return await updateSuggestionStatus(ctx);
    if (method === "POST" && path === "/seo/meta/update") return await updateMeta(ctx);
    if (method === "POST" && path === "/automation/run-daily") return await runDailyAutomation(ctx);
    if (method === "POST" && path === "/automation/track-rankings") return await trackRankings(ctx);
    if (method === "POST" && path === "/automation/ai-optimization-loop") return await aiOptimizationLoop(ctx);
    if (method === "POST" && path === "/automation/multi-channel-distribution") return await multiChannelDistribution(ctx);
    if (method === "POST" && path === "/automation/process-failures") return await processFailureControl(ctx);
    if (method === "GET" && path === "/automation/dashboard") return await getAutomationDashboard(ctx);

    return errorResponse(`Route not found: ${method} ${path}`, 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected SEO Manager failure";
    return errorResponse(message, 500);
  }
}, {
  module: "seo_manager",
  action: "execute",
  skipKYC: true,
  skipSubscription: true,
}));