declare const Deno: { env: { get(name: string): string | undefined } };
// @ts-ignore Deno runtime import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { withAuth, type RequestContext } from "../_shared/middleware.ts";
import { errorResponse, jsonResponse } from "../_shared/utils.ts";

const allowedRoles = ["marketing_manager", "seo_manager", "super_admin", "master", "admin", "boss_owner", "ceo", "lead_manager"];
const adminRoles = new Set(["marketing_manager", "super_admin", "master", "admin", "boss_owner", "ceo"]);

function normalizePath(path: string) {
  if (!path) return "/";
  return path.replace(/^\/functions\/v1\/api-marketing-manager/, "") || "/";
}

function parseBody(ctx: RequestContext) {
  return ctx.body || {};
}

function nowIso() {
  return new Date().toISOString();
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function readNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

async function sha256(input: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function computeCampaignRoi(spent: number, revenue: number) {
  if (spent <= 0) return revenue > 0 ? 100 : 0;
  return Number((((revenue - spent) / spent) * 100).toFixed(2));
}

function summarizeChannels(campaigns: any[], deliveryLogs: any[], trafficEvents: any[]) {
  const stats = new Map<string, { channel: string; activeCampaigns: number; spend: number; revenue: number; leads: number; conversions: number; ctr: number; roi: number }>();

  campaigns.forEach((campaign) => {
    const channels = Array.isArray(campaign.channels) && campaign.channels.length > 0
      ? campaign.channels
      : [campaign.channel || campaign.platform || "unknown"];
    channels.forEach((channel: string) => {
      const current = stats.get(channel) || { channel, activeCampaigns: 0, spend: 0, revenue: 0, leads: 0, conversions: 0, ctr: 0, roi: 0 };
      current.activeCampaigns += campaign.status === "active" ? 1 : 0;
      current.spend += readNumber(campaign.spent);
      current.revenue += readNumber(campaign.revenue);
      current.leads += readNumber(campaign.leads_generated);
      current.conversions += readNumber(campaign.conversions);
      current.ctr += campaign.impressions > 0 ? readNumber(campaign.clicks) / readNumber(campaign.impressions) : 0;
      stats.set(channel, current);
    });
  });

  deliveryLogs.forEach((log) => {
    const key = log.channel_type || "unknown";
    const current = stats.get(key) || { channel: key, activeCampaigns: 0, spend: 0, revenue: 0, leads: 0, conversions: 0, ctr: 0, roi: 0 };
    current.ctr += readNumber(log.click_rate);
    stats.set(key, current);
  });

  trafficEvents.forEach((event) => {
    const key = event.source_channel || "unknown";
    const current = stats.get(key) || { channel: key, activeCampaigns: 0, spend: 0, revenue: 0, leads: 0, conversions: 0, ctr: 0, roi: 0 };
    if (event.event_type === "lead") current.leads += readNumber(event.sessions_count, 1);
    if (event.event_type === "conversion") current.conversions += readNumber(event.sessions_count, 1);
    stats.set(key, current);
  });

  return Array.from(stats.values()).map((item) => ({
    ...item,
    ctr: Number((item.ctr * 100).toFixed(2)),
    roi: computeCampaignRoi(item.spend, item.revenue),
  })).sort((a, b) => b.revenue - a.revenue);
}

function todayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

function normalizeCountryCode(value: unknown) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (raw.length === 2) return raw.toUpperCase();

  const map: Record<string, string> = {
    india: "IN",
    usa: "US",
    "united states": "US",
    "united arab emirates": "AE",
    uae: "AE",
    uk: "GB",
    "united kingdom": "GB",
  };

  return map[raw.toLowerCase()] || raw.slice(0, 2).toUpperCase();
}

function normalizeSourceChannel(value: unknown) {
  const raw = String(value || "website").trim().toLowerCase();
  const aliases: Record<string, string> = {
    facebook: "facebook",
    meta: "facebook",
    meta_ads: "facebook",
    google: "google",
    google_ads: "google",
    whatsapp: "whatsapp",
    website: "website",
    referral: "referral",
    marketplace: "marketplace",
    influencer: "influencer",
    seo: "seo",
    email: "email",
  };
  return aliases[raw] || raw;
}

function normalizePlatform(value: unknown) {
  const raw = String(value || "").trim().toLowerCase();
  const aliases: Record<string, string> = {
    google: "google_ads",
    google_ads: "google_ads",
    meta: "meta_ads",
    facebook: "meta_ads",
    instagram: "meta_ads",
    meta_ads: "meta_ads",
    youtube: "youtube_ads",
    youtube_ads: "youtube_ads",
    display: "display_ads",
    display_ads: "display_ads",
    linkedin: "linkedin_ads",
    linkedin_ads: "linkedin_ads",
    x: "twitter",
    twitter: "twitter",
    whatsapp: "whatsapp",
    tiktok: "tiktok",
    email: "email",
    sms: "sms",
    seo: "seo",
    influencer: "influencer",
  };
  return aliases[raw] || raw;
}

function toLeadSourceType(channel: string) {
  if (["website", "google", "facebook", "whatsapp", "seo", "email"].includes(channel)) return channel === "facebook" ? "social" : channel === "google" ? "website" : channel;
  if (channel === "referral") return "referral";
  if (channel === "influencer") return "influencer";
  if (channel === "marketplace") return "reseller";
  return "other";
}

function priorityFromScore(score: number) {
  if (score >= 80) return "hot";
  if (score >= 55) return "warm";
  return "cold";
}

function makeCsv(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map((row) => headers.map((header) => escape(row[header])).join(","))].join("\n");
}

async function logPrivacy(
  ctx: RequestContext,
  params: {
    action: string;
    targetType: string;
    targetId?: string | null;
    maskedFields?: string[];
    privacyStatus?: string;
    metadata?: Record<string, unknown>;
  },
) {
  await ctx.supabaseAdmin.from("marketing_privacy_logs").insert({
    actor_user_id: ctx.user.userId,
    action: params.action,
    target_type: params.targetType,
    target_id: params.targetId || null,
    masked_fields: params.maskedFields || [],
    privacy_status: params.privacyStatus || "masked",
    metadata: params.metadata || {},
  });
}

async function notifyUser(ctx: RequestContext, userId: string, message: string, roleTarget?: string) {
  await ctx.supabaseAdmin.from("user_notifications").insert({
    user_id: userId,
    type: "priority",
    message,
    event_type: "marketing_automation",
    action_label: "Open dashboard",
    action_url: "/marketing-manager",
    is_buzzer: true,
    role_target: roleTarget ? [roleTarget] : [],
  });
}

async function fetchAttributedLeads(ctx: RequestContext, sourceChannel?: string, createdAfter?: string) {
  let attributionQuery = ctx.supabaseAdmin
    .from("marketing_lead_attribution")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (sourceChannel) attributionQuery = attributionQuery.eq("source_channel", sourceChannel);
  if (createdAfter) attributionQuery = attributionQuery.gte("created_at", createdAfter);

  const { data: attributionRows, error } = await attributionQuery;
  if (error) throw error;

  const leadIds = Array.from(new Set((attributionRows || []).map((row) => row.lead_id).filter(Boolean)));
  const leadMap = new Map<string, any>();

  if (leadIds.length > 0) {
    const { data: leads, error: leadsError } = await ctx.supabaseAdmin
      .from("leads")
      .select("id, name, email, phone, status, priority, country, city, ai_score, conversion_probability, created_at")
      .in("id", leadIds);

    if (leadsError) throw leadsError;
    (leads || []).forEach((lead) => leadMap.set(lead.id, lead));
  }

  return (attributionRows || []).map((row) => ({
    ...row,
    lead: leadMap.get(row.lead_id) || null,
  }));
}

async function createRoutingLog(ctx: RequestContext, leadId: string, action: string, details: Record<string, unknown>) {
  await ctx.supabaseAdmin.from("lead_logs").insert({
    lead_id: leadId,
    action,
    action_type: "routing",
    details: JSON.stringify(details),
    performed_by: ctx.user.userId,
    performer_role: ctx.user.role,
    metadata: details,
  });
}

async function updateLeadAssignment(
  ctx: RequestContext,
  leadId: string,
  params: {
    assignedTo?: string | null;
    assignedRole?: string | null;
    status?: string;
    priority?: string;
    reason: string;
    metadata?: Record<string, unknown>;
  },
) {
  const patch: Record<string, unknown> = {
    assigned_to: params.assignedTo || null,
    assigned_role: params.assignedRole || null,
    status: params.status || "assigned",
    assigned_at: nowIso(),
  };
  if (params.priority) patch.priority = params.priority;

  const { data: updatedLead, error } = await ctx.supabaseAdmin
    .from("leads")
    .update(patch)
    .eq("id", leadId)
    .select("*")
    .single();

  if (error) throw error;

  await ctx.supabaseAdmin
    .from("marketing_lead_attribution")
    .update({
      assigned_to_user: params.assignedTo || null,
      assigned_to_role: params.assignedRole || null,
      metadata: params.metadata || {},
      updated_at: nowIso(),
    })
    .eq("lead_id", leadId);

  await createRoutingLog(ctx, leadId, params.reason, params.metadata || {});

  if (params.assignedTo) {
    await notifyUser(ctx, params.assignedTo, `A new lead has been assigned via ${params.reason}.`, params.assignedRole || undefined);
  }

  return updatedLead;
}

async function logActivity(
  ctx: RequestContext,
  params: {
    campaignId?: string | null;
    action: string;
    targetType: string;
    targetId?: string | null;
    details?: Record<string, unknown>;
  },
) {
  await ctx.supabaseAdmin.from("marketing_activity_logs").insert({
    campaign_id: params.campaignId || null,
    actor_user_id: ctx.user.userId,
    action: params.action,
    target_type: params.targetType,
    target_id: params.targetId || null,
    details: params.details || {},
  });
}

async function getSettings(ctx: RequestContext) {
  const { data, error } = await ctx.supabaseAdmin
    .from("marketing_manager_settings")
    .select("*")
    .eq("settings_key", "global")
    .maybeSingle();

  if (error) throw error;

  return data || {
    settings_key: "global",
    auto_campaign_engine: true,
    auto_social_publish: true,
    auto_followups: true,
    auto_budget_adjustment: true,
    hourly_optimization_enabled: true,
    manager_approval_required: true,
    budget_guard_enabled: true,
    default_budget: 25000,
    max_campaign_budget: 500000,
    low_ctr_threshold: 0.015,
    high_cpc_threshold: 150,
    low_conversion_threshold: 0.01,
  };
}

async function getDashboard(ctx: RequestContext) {
  const [{ data: settings }, { data: campaigns }, { data: aiInsights }, { data: contentQueue }, { data: alerts }, { data: activityLogs }, { data: complianceLogs }, { data: reports }, { data: approvals }, { data: deliveryLogs }, { data: trafficEvents }] = await Promise.all([
    ctx.supabaseAdmin.from("marketing_manager_settings").select("*").eq("settings_key", "global").maybeSingle(),
    ctx.supabaseAdmin.from("marketing_campaigns").select("*").order("created_at", { ascending: false }).limit(50),
    ctx.supabaseAdmin.from("marketing_ai_insights").select("*").order("created_at", { ascending: false }).limit(50),
    ctx.supabaseAdmin.from("marketing_content_queue").select("*").order("created_at", { ascending: false }).limit(50),
    ctx.supabaseAdmin.from("marketing_alerts").select("*").order("created_at", { ascending: false }).limit(50),
    ctx.supabaseAdmin.from("marketing_activity_logs").select("*").order("created_at", { ascending: false }).limit(100),
    ctx.supabaseAdmin.from("marketing_compliance_logs").select("*").order("created_at", { ascending: false }).limit(50),
    ctx.supabaseAdmin.from("marketing_reports").select("*").order("generated_at", { ascending: false }).limit(20),
    ctx.supabaseAdmin.from("marketing_approvals").select("*").eq("status", "pending").order("created_at", { ascending: false }).limit(20),
    ctx.supabaseAdmin.from("marketing_delivery_logs").select("*").order("created_at", { ascending: false }).limit(100),
    ctx.supabaseAdmin.from("marketing_traffic_events").select("*").order("created_at", { ascending: false }).limit(200),
  ]);

  const campaignRows = campaigns || [];
  const totalSpend = campaignRows.reduce((sum, campaign) => sum + readNumber(campaign.spent), 0);
  const totalRevenue = campaignRows.reduce((sum, campaign) => sum + readNumber(campaign.revenue), 0);
  const totalImpressions = campaignRows.reduce((sum, campaign) => sum + readNumber(campaign.impressions), 0);
  const totalClicks = campaignRows.reduce((sum, campaign) => sum + readNumber(campaign.clicks), 0);
  const totalLeads = campaignRows.reduce((sum, campaign) => sum + readNumber(campaign.leads_generated), 0);
  const totalConversions = campaignRows.reduce((sum, campaign) => sum + readNumber(campaign.conversions), 0);
  const activeCampaigns = campaignRows.filter((campaign) => campaign.status === "active").length;
  const channels = summarizeChannels(campaignRows, deliveryLogs || [], trafficEvents || []);
  const complianceRows = complianceLogs || [];
  const passedChecks = complianceRows.filter((log) => log.status === "passed").length;
  const warningChecks = complianceRows.filter((log) => log.status === "warning").length;
  const failedChecks = complianceRows.filter((log) => log.status === "failed").length;
  const complianceScore = complianceRows.length === 0
    ? 100
    : Math.max(0, Math.round(((passedChecks + warningChecks * 0.5) / complianceRows.length) * 100));

  const latestReport = (reports || [])[0] || null;

  return jsonResponse({
    settings: settings || null,
    summary: {
      activeCampaigns,
      totalCampaigns: campaignRows.length,
      adSpend: Number(totalSpend.toFixed(2)),
      revenue: Number(totalRevenue.toFixed(2)),
      roi: computeCampaignRoi(totalSpend, totalRevenue),
      reach: totalImpressions,
      leadsToday: totalLeads,
      conversionRate: totalClicks > 0 ? Number(((totalConversions / totalClicks) * 100).toFixed(2)) : 0,
      activeChannels: channels.filter((channel) => channel.activeCampaigns > 0).length,
      pendingApprovals: (approvals || []).length,
      automationRunsHealthy: Boolean((settings as any)?.hourly_optimization_enabled),
    },
    campaigns: campaignRows,
    channels,
    aiInsights: aiInsights || [],
    contentQueue: contentQueue || [],
    alerts: alerts || [],
    approvals: approvals || [],
    auditLogs: activityLogs || [],
    reports: reports || [],
    latestReport,
    compliance: {
      score: complianceScore,
      checks: complianceRows,
      restrictedWords: ["guaranteed", "instant profit", "100% free forever", "no risk"],
      warnings: warningChecks,
      failures: failedChecks,
    },
  });
}

async function createCampaign(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.name || !body.channel || !body.budget) {
    return errorResponse("name, channel and budget are required", 400);
  }

  const settings = await getSettings(ctx);
  const budget = readNumber(body.budget);
  const dailyBudget = readNumber(body.daily_budget, Math.max(1000, budget / 30));
  const requiresApproval = settings.manager_approval_required || budget > readNumber(settings.default_budget) * 2;
  const channels = readArray<string>(body.channels).length > 0 ? readArray<string>(body.channels) : [body.channel];
  const campaignId = crypto.randomUUID();
  const autoReasoning = budget > readNumber(settings.max_campaign_budget) ? "Budget exceeds safe threshold" : "Ready for automated optimization";

  const insertPayload = {
    id: campaignId,
    name: body.name,
    channel: body.channel,
    budget,
    spent: 0,
    conversion_rate: 0,
    leads_generated: 0,
    status: requiresApproval ? "draft" : "active",
    start_date: body.start_date || new Date().toISOString().slice(0, 10),
    end_date: body.end_date || null,
    created_by: ctx.user.userId,
    objective: body.objective || "growth",
    platform: body.platform || body.channel,
    audience: body.targetAudience || {},
    creatives: readArray(body.creatives),
    approval_status: requiresApproval ? "pending" : "auto_approved",
    automation_status: requiresApproval ? "queued" : "running",
    daily_budget: dailyBudget,
    budget_limit: budget,
    revenue: 0,
    clicks: 0,
    impressions: 0,
    conversions: 0,
    roi_value: 0,
    ai_health_score: 82,
    compliance_status: "passed",
    launched_at: requiresApproval ? null : nowIso(),
    last_synced_at: nowIso(),
    metadata: {
      channels,
      targetingMode: body.targetingMode || "lookalike",
      auto_generated: true,
      niche: body.niche || "general",
    },
  };

  const { data: campaign, error } = await ctx.supabaseAdmin
    .from("marketing_campaigns")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) {
    return errorResponse(error.message || "Unable to create campaign", 500);
  }

  if (requiresApproval) {
    await ctx.supabaseAdmin.from("marketing_approvals").insert({
      campaign_id: campaign.id,
      approval_type: "campaign",
      status: "pending",
      requested_by: ctx.user.userId,
      notes: `Budget ${budget} requires manager approval before launch.`,
    });
  }

  const contentRows = channels.map((channel: string, index: number) => ({
    campaign_id: campaign.id,
    content_type: channel === "email" ? "email_template" : channel === "sms" ? "sms_template" : channel === "whatsapp" ? "whatsapp_template" : channel === "social" ? "social_post" : "ad_copy",
    title: `${body.name} ${channel} creative ${index + 1}`,
    body: `AI-generated ${channel} copy for ${body.name} focused on ${body.objective || "growth"}.`,
    status: requiresApproval ? "pending_approval" : "approved",
    ai_generated: true,
    metadata: {
      channel,
      suggested_cta: body.cta || "Book a demo",
    },
    created_by: ctx.user.userId,
  }));

  if (contentRows.length > 0) {
    await ctx.supabaseAdmin.from("marketing_content_queue").insert(contentRows);
  }

  await ctx.supabaseAdmin.from("marketing_ai_insights").insert({
    campaign_id: campaign.id,
    insight_type: "launch_strategy",
    title: requiresApproval ? "Campaign waiting for approval" : "Campaign launched with automation",
    suggestion: autoReasoning,
    reasoning: `Channels: ${channels.join(", ")}. Objective: ${body.objective || "growth"}.`,
    confidence: 87,
    impact: budget > readNumber(settings.default_budget) ? "high" : "medium",
    status: "new",
    auto_executed: !requiresApproval,
    metadata: {
      budget,
      dailyBudget,
      channels,
    },
  });

  await ctx.supabaseAdmin.from("marketing_reports").insert({
    report_type: "performance",
    title: `${campaign.name} launch report`,
    report_json: {
      campaign_id: campaign.id,
      status: campaign.status,
      approval_status: campaign.approval_status,
      created_at: campaign.created_at,
      channels,
      budget,
    },
    generated_by: ctx.user.userId,
  });

  await logActivity(ctx, {
    campaignId: campaign.id,
    action: "campaign_created",
    targetType: "campaign",
    targetId: campaign.id,
    details: {
      name: campaign.name,
      approval_status: campaign.approval_status,
      budget,
      channels,
    },
  });

  return jsonResponse({ campaign }, 201);
}

async function updateCampaignStatus(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.campaign_id || !body.status) {
    return errorResponse("campaign_id and status are required", 400);
  }

  const patch: Record<string, unknown> = {
    status: body.status,
    automation_status: body.status === "active" ? "running" : body.status === "paused" ? "paused" : body.status === "completed" ? "completed" : "stopped",
    last_synced_at: nowIso(),
  };

  if (body.status === "active") patch.launched_at = nowIso();
  if (body.status === "paused") patch.paused_at = nowIso();

  const { data: campaign, error } = await ctx.supabaseAdmin
    .from("marketing_campaigns")
    .update(patch)
    .eq("id", body.campaign_id)
    .select("*")
    .single();

  if (error) {
    return errorResponse(error.message || "Unable to update campaign status", 500);
  }

  await logActivity(ctx, {
    campaignId: campaign.id,
    action: "campaign_status_changed",
    targetType: "campaign",
    targetId: campaign.id,
    details: { status: body.status },
  });

  return jsonResponse({ campaign });
}

async function approveCampaign(ctx: RequestContext) {
  if (!adminRoles.has(ctx.user.role)) {
    return errorResponse("Manager approval access required", 403);
  }

  const body = parseBody(ctx);
  const approvalId = body.approval_id;
  const decision = body.decision;
  if (!approvalId || !decision) {
    return errorResponse("approval_id and decision are required", 400);
  }

  const { data: approval, error: approvalError } = await ctx.supabaseAdmin
    .from("marketing_approvals")
    .update({ status: decision, decided_by: ctx.user.userId, notes: body.notes || null, updated_at: nowIso() })
    .eq("id", approvalId)
    .select("*")
    .single();

  if (approvalError) {
    return errorResponse(approvalError.message || "Unable to update approval", 500);
  }

  if (approval.campaign_id) {
    await ctx.supabaseAdmin
      .from("marketing_campaigns")
      .update({
        approval_status: decision,
        status: decision === "approved" ? "active" : "draft",
        automation_status: decision === "approved" ? "running" : "paused",
        approved_by: decision === "approved" ? ctx.user.userId : null,
        approved_at: decision === "approved" ? nowIso() : null,
        launched_at: decision === "approved" ? nowIso() : null,
      })
      .eq("id", approval.campaign_id);

    await logActivity(ctx, {
      campaignId: approval.campaign_id,
      action: decision === "approved" ? "campaign_approved" : "campaign_rejected",
      targetType: "campaign_approval",
      targetId: approval.id,
      details: { notes: body.notes || null },
    });
  }

  if (approval.content_id) {
    await ctx.supabaseAdmin
      .from("marketing_content_queue")
      .update({ status: decision === "approved" ? "approved" : "rejected" })
      .eq("id", approval.content_id);
  }

  return jsonResponse({ approval });
}

async function updateInsightStatus(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.insight_id || !body.status) {
    return errorResponse("insight_id and status are required", 400);
  }

  const { data: insight, error } = await ctx.supabaseAdmin
    .from("marketing_ai_insights")
    .update({ status: body.status, updated_at: nowIso() })
    .eq("id", body.insight_id)
    .select("*")
    .single();

  if (error) {
    return errorResponse(error.message || "Unable to update insight", 500);
  }

  await logActivity(ctx, {
    campaignId: insight.campaign_id,
    action: `ai_insight_${body.status}`,
    targetType: "ai_insight",
    targetId: insight.id,
    details: { title: insight.title },
  });

  return jsonResponse({ insight });
}

async function updateContentStatus(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.content_id || !body.status) {
    return errorResponse("content_id and status are required", 400);
  }

  const { data: content, error } = await ctx.supabaseAdmin
    .from("marketing_content_queue")
    .update({ status: body.status, updated_at: nowIso() })
    .eq("id", body.content_id)
    .select("*")
    .single();

  if (error) {
    return errorResponse(error.message || "Unable to update content", 500);
  }

  if (body.status === "pending_approval") {
    await ctx.supabaseAdmin.from("marketing_approvals").insert({
      campaign_id: content.campaign_id,
      content_id: content.id,
      approval_type: "content",
      status: "pending",
      requested_by: ctx.user.userId,
      notes: `Content ${content.title} submitted for approval`,
    });
  }

  await logActivity(ctx, {
    campaignId: content.campaign_id,
    action: "content_status_changed",
    targetType: "content_queue",
    targetId: content.id,
    details: { status: body.status, title: content.title },
  });

  return jsonResponse({ content });
}

async function connectAdsAccount(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.platform || !body.account_id || !body.access_token) {
    return errorResponse("platform, account_id and access_token are required", 400);
  }

  const encrypted = await sha256(String(body.access_token));
  const { data: account, error } = await ctx.supabaseAdmin
    .from("marketing_ads_accounts")
    .upsert({
      platform: body.platform,
      account_id: body.account_id,
      account_name: body.account_name || body.account_id,
      access_token_encrypted: encrypted,
      token_hint: String(body.access_token).slice(0, 4),
      status: "connected",
      daily_spend_limit: readNumber(body.daily_spend_limit, 0),
      monthly_spend_limit: readNumber(body.monthly_spend_limit, 0),
      created_by: ctx.user.userId,
    }, { onConflict: "platform,account_id" })
    .select("platform, account_id, account_name, status, daily_spend_limit, monthly_spend_limit, updated_at")
    .single();

  if (error) {
    return errorResponse(error.message || "Unable to connect ads account", 500);
  }

  await logActivity(ctx, {
    action: "ads_account_connected",
    targetType: "ads_account",
    details: { platform: body.platform, account_id: body.account_id },
  });

  return jsonResponse({ account });
}

async function generateKeywords(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.niche || !body.country_code) {
    return errorResponse("niche and country_code are required", 400);
  }

  const base = String(body.niche).toLowerCase();
  const countryCode = String(body.country_code).toUpperCase();
  const generatedKeywords = [
    `${base} software`,
    `best ${base} tools`,
    `${base} automation`,
    `${base} company ${countryCode.toLowerCase()}`,
    `${base} services`,
    `${base} solutions`,
  ].map((keyword, index) => ({
    niche: body.niche,
    country_code: countryCode,
    keyword,
    search_volume: 900 + index * 250,
    difficulty_score: clamp(28 + index * 9, 1, 100),
    cpc: 12 + index * 4,
    competition_score: Number((0.24 + index * 0.09).toFixed(2)),
    trend_score: clamp(55 + index * 6, 1, 100),
    source: "api_marketing_manager",
    created_by: ctx.user.userId,
  }));

  const { data: keywords, error } = await ctx.supabaseAdmin
    .from("marketing_seo_keywords")
    .upsert(generatedKeywords, { onConflict: "country_code,keyword" })
    .select("*");

  if (error) {
    return errorResponse(error.message || "Unable to generate keywords", 500);
  }

  await logActivity(ctx, {
    action: "seo_keywords_generated",
    targetType: "seo_keyword",
    details: { niche: body.niche, country_code: countryCode, count: keywords?.length || 0 },
  });

  return jsonResponse({ keywords: keywords || [] });
}

async function listCountryKeywords(ctx: RequestContext, req: Request) {
  const url = new URL(req.url);
  const countryCode = url.searchParams.get("country_code");
  const niche = url.searchParams.get("niche");

  let query = ctx.supabaseAdmin.from("marketing_seo_keywords").select("*").order("search_volume", { ascending: false }).limit(100);
  if (countryCode) query = query.eq("country_code", countryCode.toUpperCase());
  if (niche) query = query.ilike("niche", `%${niche}%`);

  const { data, error } = await query;
  if (error) return errorResponse(error.message || "Unable to load keywords", 500);
  return jsonResponse({ keywords: data || [] });
}

async function runOnPageAudit(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.url) {
    return errorResponse("url is required", 400);
  }

  const findings = [
    "Meta description length is safe for search results",
    "Heading structure requires stronger keyword placement",
    "Primary CTA should appear above the fold for paid traffic",
  ];
  const suggestions = [
    "Add country-specific schema markup",
    "Compress hero image for better Core Web Vitals",
    "Inject target keyword in first paragraph and H2",
  ];

  const { data: audit, error } = await ctx.supabaseAdmin
    .from("marketing_seo_audits")
    .insert({
      entity_url: body.url,
      audit_type: "onpage",
      score: 81,
      findings,
      suggestions,
      status: "completed",
      created_by: ctx.user.userId,
    })
    .select("*")
    .single();

  if (error) return errorResponse(error.message || "Unable to create audit", 500);
  return jsonResponse({ audit });
}

async function createBacklink(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.target_url || !body.source_domain || !body.anchor_text) {
    return errorResponse("target_url, source_domain and anchor_text are required", 400);
  }

  const { data: backlink, error } = await ctx.supabaseAdmin
    .from("marketing_backlinks")
    .insert({
      campaign_id: body.campaign_id || null,
      target_url: body.target_url,
      source_domain: body.source_domain,
      anchor_text: body.anchor_text,
      backlink_type: body.backlink_type || "guest_post",
      status: "queued",
      authority_score: readNumber(body.authority_score, 42),
      created_by: ctx.user.userId,
    })
    .select("*")
    .single();

  if (error) return errorResponse(error.message || "Unable to create backlink record", 500);
  return jsonResponse({ backlink }, 201);
}

async function getRankings(ctx: RequestContext, req: Request) {
  const url = new URL(req.url);
  const domain = url.searchParams.get("domain") || "softwarewalanet.com";
  const countryCode = url.searchParams.get("country_code");

  const { data: keywords } = await ctx.supabaseAdmin
    .from("marketing_seo_keywords")
    .select("id, keyword, country_code")
    .order("search_volume", { ascending: false })
    .limit(25);

  const keywordIds = (keywords || []).filter((item) => !countryCode || item.country_code === countryCode.toUpperCase()).map((item) => item.id);
  let rankingQuery = ctx.supabaseAdmin.from("marketing_rankings").select("*").eq("domain", domain).order("checked_at", { ascending: false }).limit(100);
  if (keywordIds.length > 0) {
    rankingQuery = rankingQuery.in("keyword_id", keywordIds);
  }

  const { data: rankings, error } = await rankingQuery;
  if (error) return errorResponse(error.message || "Unable to load rankings", 500);
  return jsonResponse({ rankings: rankings || [] });
}

async function scheduleSocialPost(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.platform || !body.content || !body.scheduled_at) {
    return errorResponse("platform, content and scheduled_at are required", 400);
  }

  const { data: post, error } = await ctx.supabaseAdmin
    .from("marketing_social_posts")
    .insert({
      campaign_id: body.campaign_id || null,
      platform: body.platform,
      title: body.title || null,
      content: body.content,
      hashtags: readArray(body.hashtags),
      creative_urls: readArray(body.creative_urls),
      scheduled_at: body.scheduled_at,
      status: "scheduled",
      ai_generated: Boolean(body.ai_generated),
      created_by: ctx.user.userId,
    })
    .select("*")
    .single();

  if (error) return errorResponse(error.message || "Unable to schedule social post", 500);
  return jsonResponse({ post }, 201);
}

async function generateAiContent(ctx: RequestContext) {
  const body = parseBody(ctx);
  const channel = body.channel || "ad";
  const title = body.title || `AI ${channel} content`;
  const copy = `${title}: target ${body.audience || "warm leads"} with ${body.goal || "conversions"}. CTA: ${body.cta || "Start now"}.`;

  const { data: content, error } = await ctx.supabaseAdmin
    .from("marketing_content_queue")
    .insert({
      campaign_id: body.campaign_id || null,
      content_type: channel === "email" ? "email_template" : channel === "sms" ? "sms_template" : channel === "whatsapp" ? "whatsapp_template" : channel === "social" ? "social_post" : "ad_copy",
      title,
      body: copy,
      status: body.require_approval ? "pending_approval" : "approved",
      ai_generated: true,
      metadata: { channel, goal: body.goal || "conversions", audience: body.audience || "warm leads" },
      created_by: ctx.user.userId,
    })
    .select("*")
    .single();

  if (error) return errorResponse(error.message || "Unable to generate AI content", 500);
  return jsonResponse({ content }, 201);
}

async function captureLead(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.name || !body.email || !body.source_channel) {
    return errorResponse("name, email and source_channel are required", 400);
  }

  const { data: lead, error } = await ctx.supabaseAdmin
    .from("leads")
    .insert({
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      source: body.source_channel,
      status: "new",
      notes: body.intent_summary || "Captured from Marketing Manager automation",
      created_by: ctx.user.userId,
    })
    .select("id, name, email, phone, status, created_at")
    .single();

  if (error) return errorResponse(error.message || "Unable to capture lead", 500);

  const scoreValue = clamp(readNumber(body.score_value, body.source_channel === "google_ads" ? 88 : 67), 1, 100);
  const scoreLabel = scoreValue >= 80 ? "hot" : scoreValue >= 55 ? "warm" : "cold";
  await ctx.supabaseAdmin.from("marketing_lead_attribution").insert({
    lead_id: lead.id,
    campaign_id: body.campaign_id || null,
    source_channel: body.source_channel,
    source_platform: body.source_platform || body.source_channel,
    country_code: body.country_code || null,
    region: body.region || null,
    score_label: scoreLabel,
    score_value: scoreValue,
    intent_summary: body.intent_summary || null,
    assigned_to_role: body.assign_role || "lead_manager",
    metadata: body.metadata || {},
  });

  await ctx.supabaseAdmin.from("marketing_traffic_events").insert({
    campaign_id: body.campaign_id || null,
    source_channel: body.source_channel,
    event_type: "lead",
    sessions_count: 1,
    country_code: body.country_code || null,
    metadata: body.metadata || {},
  });

  return jsonResponse({ lead }, 201);
}

async function analyzeMarketing(ctx: RequestContext) {
  const { data: campaigns } = await ctx.supabaseAdmin
    .from("marketing_campaigns")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(25);
  const settings = await getSettings(ctx);

  const suggestions = (campaigns || []).slice(0, 8).map((campaign) => {
    const ctr = campaign.impressions > 0 ? readNumber(campaign.clicks) / readNumber(campaign.impressions) : 0;
    const conversionRate = campaign.clicks > 0 ? readNumber(campaign.conversions) / readNumber(campaign.clicks) : 0;
    const impact = ctr < readNumber(settings.low_ctr_threshold) || conversionRate < readNumber(settings.low_conversion_threshold) ? "high" : "medium";
    return {
      campaign_id: campaign.id,
      insight_type: ctr < readNumber(settings.low_ctr_threshold) ? "creative_refresh" : "budget_scale",
      title: ctr < readNumber(settings.low_ctr_threshold) ? `${campaign.name} needs new creative` : `${campaign.name} can scale safely`,
      suggestion: ctr < readNumber(settings.low_ctr_threshold)
        ? "Refresh ad copy, tighten audience, and test a stronger CTA."
        : "Increase budget by 15% and expand high-performing geographies.",
      reasoning: `CTR ${(ctr * 100).toFixed(2)}%, CVR ${(conversionRate * 100).toFixed(2)}%, spend ${readNumber(campaign.spent).toFixed(2)}`,
      confidence: ctr < readNumber(settings.low_ctr_threshold) ? 91 : 84,
      impact,
      status: "new",
      auto_executed: false,
      metadata: { ctr, conversionRate },
    };
  });

  if (suggestions.length > 0) {
    await ctx.supabaseAdmin.from("marketing_ai_insights").insert(suggestions);
  }

  return jsonResponse({ created: suggestions.length, insights: suggestions });
}

async function createTemplate(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.channel_type || !body.template_name || !body.body) {
    return errorResponse("channel_type, template_name and body are required", 400);
  }

  const restrictedWords = ["guaranteed", "instant profit", "no risk"];
  const contentLower = String(body.body).toLowerCase();
  const complianceStatus = restrictedWords.some((word) => contentLower.includes(word)) ? "warning" : "passed";

  const { data: template, error } = await ctx.supabaseAdmin
    .from("marketing_templates")
    .insert({
      channel_type: body.channel_type,
      template_name: body.template_name,
      subject_line: body.subject_line || null,
      body: body.body,
      variables: readArray(body.variables),
      compliance_status: complianceStatus,
      created_by: ctx.user.userId,
    })
    .select("*")
    .single();

  if (error) return errorResponse(error.message || "Unable to create template", 500);

  await ctx.supabaseAdmin.from("marketing_compliance_logs").insert({
    policy_name: `${body.channel_type}_template_scan`,
    status: complianceStatus,
    details: complianceStatus === "passed" ? "Template passed compliance scan" : "Template contains restricted language that needs review",
    metadata: { template_id: template.id, restrictedWords },
  });

  return jsonResponse({ template }, 201);
}

async function sendChannelMessage(ctx: RequestContext, channelType: "email" | "sms" | "whatsapp") {
  const body = parseBody(ctx);
  if (!body.recipient) {
    return errorResponse("recipient is required", 400);
  }

  const { data: delivery, error } = await ctx.supabaseAdmin
    .from("marketing_delivery_logs")
    .insert({
      campaign_id: body.campaign_id || null,
      template_id: body.template_id || null,
      channel_type: channelType,
      recipient: body.recipient,
      delivery_status: "sent",
      open_rate: channelType === "email" ? 0.41 : 0,
      click_rate: channelType === "email" ? 0.12 : channelType === "whatsapp" ? 0.21 : 0.08,
      metadata: { message: body.message || null, automation: true },
      created_by: ctx.user.userId,
    })
    .select("*")
    .single();

  if (error) return errorResponse(error.message || `Unable to send ${channelType}`, 500);
  return jsonResponse({ delivery }, 201);
}

async function listInfluencers(ctx: RequestContext) {
  const { data, error } = await ctx.supabaseAdmin
    .from("marketing_influencers")
    .select("*")
    .order("influencer_score", { ascending: false })
    .limit(100);

  if (error) return errorResponse(error.message || "Unable to load influencers", 500);
  return jsonResponse({ influencers: data || [] });
}

async function assignInfluencer(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.influencer_id || !body.campaign_id) {
    return errorResponse("influencer_id and campaign_id are required", 400);
  }

  const suspicious = Boolean(body.fake_follower_score && readNumber(body.fake_follower_score) > 70);
  const { data: assignment, error } = await ctx.supabaseAdmin
    .from("marketing_influencer_campaigns")
    .upsert({
      influencer_id: body.influencer_id,
      campaign_id: body.campaign_id,
      payout: readNumber(body.payout, 0),
      deliverables: readArray(body.deliverables),
      clicks: 0,
      conversions: 0,
      engagement: 0,
      suspicious,
      payout_status: suspicious ? "hold" : "pending",
    }, { onConflict: "influencer_id,campaign_id" })
    .select("*")
    .single();

  if (error) return errorResponse(error.message || "Unable to assign influencer", 500);
  return jsonResponse({ assignment });
}

async function influencerPerformance(ctx: RequestContext) {
  const { data, error } = await ctx.supabaseAdmin
    .from("marketing_influencer_campaigns")
    .select("*, marketing_influencers(name, platform, followers, influencer_score), marketing_campaigns(name)")
    .order("updated_at", { ascending: false })
    .limit(100);

  if (error) return errorResponse(error.message || "Unable to load influencer performance", 500);
  return jsonResponse({ influencerCampaigns: data || [] });
}

async function influencerPayout(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.assignment_id || !body.payout_status) {
    return errorResponse("assignment_id and payout_status are required", 400);
  }

  const { data, error } = await ctx.supabaseAdmin
    .from("marketing_influencer_campaigns")
    .update({ payout_status: body.payout_status, updated_at: nowIso() })
    .eq("id", body.assignment_id)
    .select("*")
    .single();

  if (error) return errorResponse(error.message || "Unable to update payout", 500);
  return jsonResponse({ assignment: data });
}

async function campaignReport(ctx: RequestContext, req: Request) {
  const url = new URL(req.url);
  const campaignId = url.searchParams.get("campaign_id");

  const { data: campaign, error } = await ctx.supabaseAdmin
    .from("marketing_campaigns")
    .select("*")
    .eq("id", campaignId)
    .maybeSingle();

  if (error) return errorResponse(error.message || "Unable to load campaign", 500);
  if (!campaign) return errorResponse("Campaign not found", 404);

  const report = {
    campaign,
    roi: computeCampaignRoi(readNumber(campaign.spent), readNumber(campaign.revenue)),
    health: campaign.ai_health_score,
    pacing: readNumber(campaign.budget) > 0 ? Number(((readNumber(campaign.spent) / readNumber(campaign.budget)) * 100).toFixed(2)) : 0,
  };

  return jsonResponse({ report });
}

async function retarget(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.campaign_id) {
    return errorResponse("campaign_id is required", 400);
  }

  await ctx.supabaseAdmin.from("marketing_traffic_events").insert({
    campaign_id: body.campaign_id,
    source_channel: body.source_channel || "retargeting",
    event_type: "retarget",
    sessions_count: readNumber(body.sessions_count, 1),
    country_code: body.country_code || null,
    metadata: { audience: body.audience || "site_visitors_30d" },
  });

  return jsonResponse({ queued: true });
}

async function aiCampaignSuggest(ctx: RequestContext) {
  const body = parseBody(ctx);
  const suggestion = {
    name: `${body.niche || "Growth"} Accelerator ${new Date().getUTCFullYear()}`,
    budget: readNumber(body.budget, 35000),
    channels: body.channels || ["google_ads", "meta_ads", "email"],
    objective: body.objective || "lead_generation",
    recommended_cta: body.cta || "Book free strategy call",
  };
  return jsonResponse({ suggestion });
}

async function analyticsTraffic(ctx: RequestContext) {
  const { data, error } = await ctx.supabaseAdmin
    .from("marketing_traffic_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return errorResponse(error.message || "Unable to load traffic analytics", 500);
  return jsonResponse({ events: data || [] });
}

async function analyticsFunnel(ctx: RequestContext) {
  const { data } = await ctx.supabaseAdmin.from("marketing_traffic_events").select("event_type, sessions_count");
  const totals = { visit: 0, click: 0, lead: 0, conversion: 0 };
  (data || []).forEach((row) => {
    if (row.event_type in totals) {
      totals[row.event_type as keyof typeof totals] += readNumber(row.sessions_count, 1);
    }
  });
  return jsonResponse({ funnel: totals });
}

async function analyticsChannel(ctx: RequestContext) {
  const [{ data: campaigns }, { data: deliveryLogs }, { data: trafficEvents }] = await Promise.all([
    ctx.supabaseAdmin.from("marketing_campaigns").select("*").limit(100),
    ctx.supabaseAdmin.from("marketing_delivery_logs").select("*").limit(100),
    ctx.supabaseAdmin.from("marketing_traffic_events").select("*").limit(200),
  ]);
  return jsonResponse({ channels: summarizeChannels(campaigns || [], deliveryLogs || [], trafficEvents || []) });
}

async function analyticsHistory(ctx: RequestContext) {
  const { data, error } = await ctx.supabaseAdmin
    .from("marketing_reports")
    .select("*")
    .order("generated_at", { ascending: false })
    .limit(50);
  if (error) return errorResponse(error.message || "Unable to load report history", 500);
  return jsonResponse({ reports: data || [] });
}

async function budgetAlert(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.campaign_id || !body.message) {
    return errorResponse("campaign_id and message are required", 400);
  }

  const { data: alert, error } = await ctx.supabaseAdmin
    .from("marketing_alerts")
    .insert({
      campaign_id: body.campaign_id,
      alert_type: body.alert_type || "budget",
      severity: body.severity || "high",
      title: body.title || "Budget guard alert",
      message: body.message,
      status: "open",
      metadata: body.metadata || {},
    })
    .select("*")
    .single();
  if (error) return errorResponse(error.message || "Unable to create alert", 500);
  return jsonResponse({ alert }, 201);
}

async function runHourlyAutomation(ctx: RequestContext) {
  const settings = await getSettings(ctx);
  const { data: campaigns } = await ctx.supabaseAdmin
    .from("marketing_campaigns")
    .select("*")
    .eq("status", "active")
    .limit(100);

  const adjustedCampaigns: string[] = [];
  const alertsToInsert: any[] = [];
  const insightsToInsert: any[] = [];

  for (const campaign of campaigns || []) {
    const ctr = campaign.impressions > 0 ? readNumber(campaign.clicks) / readNumber(campaign.impressions) : 0;
    const conversionRate = campaign.clicks > 0 ? readNumber(campaign.conversions) / readNumber(campaign.clicks) : 0;
    const spent = readNumber(campaign.spent);
    const budget = readNumber(campaign.budget);

    if (settings.budget_guard_enabled && budget > 0 && spent / budget >= 0.85) {
      alertsToInsert.push({
        campaign_id: campaign.id,
        alert_type: "budget_guard",
        severity: spent / budget >= 0.95 ? "critical" : "high",
        title: `${campaign.name} is close to budget limit`,
        message: `Spent ${spent.toFixed(2)} of ${budget.toFixed(2)}.`,
        status: "open",
        metadata: { spent, budget },
      });
    }

    if (settings.auto_budget_adjustment && ctr >= settings.low_ctr_threshold && conversionRate >= settings.low_conversion_threshold) {
      const nextBudget = Number((budget * 1.12).toFixed(2));
      await ctx.supabaseAdmin.from("marketing_campaigns").update({
        budget: nextBudget,
        budget_limit: nextBudget,
        last_synced_at: nowIso(),
        roi_value: computeCampaignRoi(spent, readNumber(campaign.revenue)),
        automation_status: "optimizing",
      }).eq("id", campaign.id);
      adjustedCampaigns.push(campaign.id);
      insightsToInsert.push({
        campaign_id: campaign.id,
        insight_type: "hourly_optimization",
        title: `${campaign.name} budget scaled automatically`,
        suggestion: `Budget increased from ${budget.toFixed(2)} to ${nextBudget.toFixed(2)} based on healthy CTR/CVR.`,
        reasoning: `CTR ${(ctr * 100).toFixed(2)}%, CVR ${(conversionRate * 100).toFixed(2)}%.`,
        confidence: 93,
        impact: "high",
        status: "applied",
        auto_executed: true,
        metadata: { previousBudget: budget, nextBudget },
      });
    }
  }

  if (alertsToInsert.length > 0) {
    await ctx.supabaseAdmin.from("marketing_alerts").insert(alertsToInsert);
  }
  if (insightsToInsert.length > 0) {
    await ctx.supabaseAdmin.from("marketing_ai_insights").insert(insightsToInsert);
  }

  const { data: run } = await ctx.supabaseAdmin
    .from("marketing_automation_runs")
    .insert({
      run_type: "hourly_optimization",
      status: "completed",
      summary: {
        adjustedCampaigns,
        alertsCreated: alertsToInsert.length,
        insightsCreated: insightsToInsert.length,
      },
      triggered_by: ctx.user.userId,
      completed_at: nowIso(),
    })
    .select("*")
    .single();

  return jsonResponse({
    run,
    adjustedCampaigns,
    alertsCreated: alertsToInsert.length,
    insightsCreated: insightsToInsert.length,
  });
}

async function listContentQueue(ctx: RequestContext) {
  const { data, error } = await ctx.supabaseAdmin
    .from("marketing_content_queue")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) return errorResponse(error.message || "Unable to load content queue", 500);
  return jsonResponse({ contentQueue: data || [] });
}

async function listAuditReports(ctx: RequestContext) {
  const { data, error } = await ctx.supabaseAdmin
    .from("marketing_activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return errorResponse(error.message || "Unable to load audit logs", 500);
  return jsonResponse({ auditLogs: data || [] });
}

async function getComplianceStatus(ctx: RequestContext) {
  const [{ data: compliance }, { data: templates }, { data: campaigns }] = await Promise.all([
    ctx.supabaseAdmin.from("marketing_compliance_logs").select("*").order("created_at", { ascending: false }).limit(100),
    ctx.supabaseAdmin.from("marketing_templates").select("id, template_name, compliance_status").limit(100),
    ctx.supabaseAdmin.from("marketing_campaigns").select("id, name, compliance_status").limit(100),
  ]);

  return jsonResponse({
    checks: compliance || [],
    templates: templates || [],
    campaigns: campaigns || [],
    restrictedWords: ["guaranteed", "instant profit", "100% free forever", "no risk"],
  });
}

async function getLiveCampaignStatus(ctx: RequestContext) {
  const { data, error } = await ctx.supabaseAdmin
    .from("marketing_campaigns")
    .select("id, name, status, approval_status, budget, spent, revenue, leads_generated, conversions, clicks, impressions, platform, channel, updated_at")
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error) return errorResponse(error.message || "Unable to load live campaign status", 500);

  const campaigns = (data || []).map((campaign) => ({
    ...campaign,
    roi: computeCampaignRoi(readNumber(campaign.spent), readNumber(campaign.revenue)),
  }));

  return jsonResponse({ campaigns });
}

async function getActiveChannels(ctx: RequestContext) {
  const [{ data: campaigns }, { data: deliveryLogs }, { data: trafficEvents }] = await Promise.all([
    ctx.supabaseAdmin.from("marketing_campaigns").select("*").limit(100),
    ctx.supabaseAdmin.from("marketing_delivery_logs").select("*").limit(200),
    ctx.supabaseAdmin.from("marketing_traffic_events").select("*").limit(200),
  ]);

  const channels = summarizeChannels(campaigns || [], deliveryLogs || [], trafficEvents || [])
    .filter((channel) => channel.activeCampaigns > 0 || channel.leads > 0 || channel.conversions > 0);

  return jsonResponse({ channels });
}

async function getLeadsToday(ctx: RequestContext) {
  const { start } = todayRange();
  const leads = await fetchAttributedLeads(ctx, undefined, start);
  const breakdownMap = new Map<string, { source: string; total: number; hot: number; warm: number; cold: number }>();

  leads.forEach((row) => {
    const source = normalizeSourceChannel(row.source_channel);
    const current = breakdownMap.get(source) || { source, total: 0, hot: 0, warm: 0, cold: 0 };
    current.total += 1;
    if (row.score_label === "hot") current.hot += 1;
    else if (row.score_label === "warm") current.warm += 1;
    else current.cold += 1;
    breakdownMap.set(source, current);
  });

  return jsonResponse({
    total_leads: leads.length,
    breakdown: Array.from(breakdownMap.values()).sort((a, b) => b.total - a.total),
  });
}

async function getCostVsResult(ctx: RequestContext) {
  const { data, error } = await ctx.supabaseAdmin
    .from("marketing_campaigns")
    .select("name, spent, revenue, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return errorResponse(error.message || "Unable to load cost vs result analytics", 500);

  const points = (data || []).map((row) => ({
    label: row.name,
    spend: readNumber(row.spent),
    revenue: readNumber(row.revenue),
    roi: computeCampaignRoi(readNumber(row.spent), readNumber(row.revenue)),
  }));
  const spend = points.reduce((sum, item) => sum + item.spend, 0);
  const revenue = points.reduce((sum, item) => sum + item.revenue, 0);

  return jsonResponse({ spend, revenue, roi: computeCampaignRoi(spend, revenue), points });
}

async function getConversionAnalytics(ctx: RequestContext) {
  const { data, error } = await ctx.supabaseAdmin
    .from("marketing_campaigns")
    .select("clicks, conversions, leads_generated")
    .limit(200);

  if (error) return errorResponse(error.message || "Unable to load conversion analytics", 500);

  const clicks = (data || []).reduce((sum, row) => sum + readNumber(row.clicks), 0);
  const conversions = (data || []).reduce((sum, row) => sum + readNumber(row.conversions), 0);
  const leads = (data || []).reduce((sum, row) => sum + readNumber(row.leads_generated), 0);

  return jsonResponse({
    clicks,
    conversions,
    leads,
    conversion: clicks > 0 ? Number(((conversions / clicks) * 100).toFixed(2)) : 0,
  });
}

async function getAdsPlatform(ctx: RequestContext, platform: string) {
  const normalizedPlatform = normalizePlatform(platform);
  const { data, error } = await ctx.supabaseAdmin
    .from("marketing_campaigns")
    .select("*")
    .or(`platform.eq.${normalizedPlatform},channel.eq.${normalizedPlatform}`)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return errorResponse(error.message || `Unable to load ${normalizedPlatform} campaigns`, 500);

  const campaigns = data || [];
  const spend = campaigns.reduce((sum, item) => sum + readNumber(item.spent), 0);
  const revenue = campaigns.reduce((sum, item) => sum + readNumber(item.revenue), 0);
  const clicks = campaigns.reduce((sum, item) => sum + readNumber(item.clicks), 0);
  const conversions = campaigns.reduce((sum, item) => sum + readNumber(item.conversions), 0);
  const leads = campaigns.reduce((sum, item) => sum + readNumber(item.leads_generated), 0);

  return jsonResponse({
    platform: normalizedPlatform,
    campaigns,
    summary: {
      spend,
      revenue,
      clicks,
      conversions,
      leads,
      roi: computeCampaignRoi(spend, revenue),
    },
  });
}

async function budgetControl(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.campaign_id) {
    return errorResponse("campaign_id is required", 400);
  }

  const { data: campaign, error } = await ctx.supabaseAdmin
    .from("marketing_campaigns")
    .select("*")
    .eq("id", body.campaign_id)
    .single();

  if (error) return errorResponse(error.message || "Unable to load campaign for budget control", 500);

  const spent = readNumber(campaign.spent);
  const revenue = readNumber(campaign.revenue);
  const currentBudget = readNumber(campaign.budget);
  const roi = computeCampaignRoi(spent, revenue);
  const direction = body.direction || (roi >= readNumber(body.roi_threshold, 25) ? "increase" : "decrease");
  const multiplier = direction === "increase" ? 1.12 : 0.9;
  const nextBudget = Number((currentBudget * multiplier).toFixed(2));

  const { data: updatedCampaign, error: updateError } = await ctx.supabaseAdmin
    .from("marketing_campaigns")
    .update({
      budget: nextBudget,
      budget_limit: nextBudget,
      automation_status: "optimizing",
      roi_value: roi,
      last_synced_at: nowIso(),
    })
    .eq("id", campaign.id)
    .select("*")
    .single();

  if (updateError) return errorResponse(updateError.message || "Unable to adjust campaign budget", 500);

  await ctx.supabaseAdmin.from("marketing_ai_insights").insert({
    campaign_id: campaign.id,
    insight_type: "budget_control",
    title: `${campaign.name} budget ${direction}d automatically`,
    suggestion: `Budget changed from ${currentBudget.toFixed(2)} to ${nextBudget.toFixed(2)}.`,
    reasoning: `ROI is ${roi.toFixed(2)}%.`,
    confidence: 88,
    impact: direction === "increase" ? "high" : "medium",
    status: "applied",
    auto_executed: true,
    metadata: { previousBudget: currentBudget, nextBudget, roi, direction },
  });

  await logActivity(ctx, {
    campaignId: campaign.id,
    action: "budget_control_applied",
    targetType: "campaign",
    targetId: campaign.id,
    details: { previousBudget: currentBudget, nextBudget, roi, direction },
  });

  return jsonResponse({ campaign: updatedCampaign, roi, previousBudget: currentBudget, nextBudget, direction });
}

async function getSocialPlatform(ctx: RequestContext, platform: string) {
  const normalizedPlatform = normalizePlatform(platform);
  const platformValue = normalizedPlatform === "meta_ads" ? "facebook" : normalizedPlatform;
  const { data, error } = await ctx.supabaseAdmin
    .from("marketing_social_posts")
    .select("*")
    .eq("platform", platformValue)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return errorResponse(error.message || `Unable to load ${platformValue} posts`, 500);
  const published = (data || []).filter((post) => post.status === "published").length;
  const scheduled = (data || []).filter((post) => post.status === "scheduled").length;
  return jsonResponse({ platform: platformValue, posts: data || [], summary: { total: (data || []).length, published, scheduled } });
}

async function getLeadSource(ctx: RequestContext, sourceChannel: string) {
  const leads = await fetchAttributedLeads(ctx, normalizeSourceChannel(sourceChannel));
  return jsonResponse({ source: normalizeSourceChannel(sourceChannel), leads, total: leads.length });
}

async function routeByCountry(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.lead_id) {
    return errorResponse("lead_id is required", 400);
  }

  const { data: lead, error } = await ctx.supabaseAdmin
    .from("leads")
    .select("*")
    .eq("id", body.lead_id)
    .single();
  if (error) return errorResponse(error.message || "Lead not found", 404);

  const countryCode = normalizeCountryCode(body.country_code || lead.country);
  const { data: rule } = await ctx.supabaseAdmin
    .from("routing_rules_country")
    .select("*")
    .eq("country_code", countryCode)
    .eq("is_active", true)
    .maybeSingle();

  const assignedRole = rule?.assigned_role || body.assigned_role || "lead_manager";
  const assignedTo = rule?.assigned_user_id || null;
  const updatedLead = await updateLeadAssignment(ctx, lead.id, {
    assignedTo,
    assignedRole,
    status: "assigned",
    reason: "country_routing",
    metadata: {
      routeType: "country",
      countryCode,
      teamName: rule?.team_name || null,
      routingRuleId: rule?.id || null,
    },
  });

  return jsonResponse({
    lead: updatedLead,
    routing: {
      route_type: "country",
      country_code: countryCode,
      team_name: rule?.team_name || null,
      assigned_role: assignedRole,
      assigned_user_id: assignedTo,
    },
  });
}

async function routeToFranchise(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.lead_id) {
    return errorResponse("lead_id is required", 400);
  }

  const { data: lead, error } = await ctx.supabaseAdmin.from("leads").select("*").eq("id", body.lead_id).single();
  if (error) return errorResponse(error.message || "Lead not found", 404);

  let query = ctx.supabaseAdmin
    .from("franchise_accounts")
    .select("id, user_id, business_name, city, state, country, pincode, status")
    .eq("status", "active")
    .eq("country", body.country || lead.country || "India")
    .limit(25);

  const { data: franchises, error: franchiseError } = await query;
  if (franchiseError) return errorResponse(franchiseError.message || "Unable to load franchise routing pool", 500);

  const franchise = (franchises || []).sort((left, right) => {
    const leftScore = Number(left.city === (body.city || lead.city)) * 3 + Number(left.pincode === body.pincode) * 4;
    const rightScore = Number(right.city === (body.city || lead.city)) * 3 + Number(right.pincode === body.pincode) * 4;
    return rightScore - leftScore;
  })[0];

  if (!franchise) return errorResponse("No active franchise found for this territory", 404);

  const updatedLead = await updateLeadAssignment(ctx, lead.id, {
    assignedTo: franchise.user_id,
    assignedRole: "franchise",
    status: "assigned",
    reason: "franchise_routing",
    metadata: {
      routeType: "franchise",
      franchiseId: franchise.id,
      businessName: franchise.business_name,
      city: franchise.city,
      pincode: franchise.pincode,
    },
  });

  await ctx.supabaseAdmin.from("franchise_leads").insert({
    franchise_id: franchise.id,
    original_lead_id: lead.id,
    lead_name: lead.name,
    masked_contact: lead.masked_phone || lead.phone,
    industry: lead.industry,
    region: lead.region,
    city: lead.city,
    lead_score: lead.ai_score,
    status: "assigned",
  });

  return jsonResponse({ lead: updatedLead, routing: { route_type: "franchise", franchise } });
}

async function routeToReseller(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.lead_id) {
    return errorResponse("lead_id is required", 400);
  }

  const { data: lead, error } = await ctx.supabaseAdmin.from("leads").select("*").eq("id", body.lead_id).single();
  if (error) return errorResponse(error.message || "Lead not found", 404);

  const [{ data: resellers, error: resellerError }, { data: profiles, error: profileError }] = await Promise.all([
    ctx.supabaseAdmin.from("resellers").select("id, user_id, franchise_id, status").eq("status", "active").limit(100),
    ctx.supabaseAdmin.from("reseller_profiles").select("reseller_id, business_name, city, state, country, postal_code").limit(100),
  ]);

  if (resellerError) return errorResponse(resellerError.message || "Unable to load reseller pool", 500);
  if (profileError) return errorResponse(profileError.message || "Unable to load reseller profiles", 500);

  const activeProfiles = (profiles || []).map((profile) => {
    const reseller = (resellers || []).find((item) => item.id === profile.reseller_id);
    return reseller ? { ...profile, reseller } : null;
  }).filter(Boolean) as any[];

  const target = activeProfiles.sort((left, right) => {
    const leftScore = Number(left.country === (body.country || lead.country)) * 2 + Number(left.city === (body.city || lead.city)) * 3 + Number(left.postal_code === body.postal_code) * 4;
    const rightScore = Number(right.country === (body.country || lead.country)) * 2 + Number(right.city === (body.city || lead.city)) * 3 + Number(right.postal_code === body.postal_code) * 4;
    return rightScore - leftScore;
  })[0];

  if (!target) return errorResponse("No active reseller found for this territory", 404);

  const updatedLead = await updateLeadAssignment(ctx, lead.id, {
    assignedTo: target.reseller.user_id || null,
    assignedRole: "reseller",
    status: "assigned",
    reason: "reseller_routing",
    metadata: {
      routeType: "reseller",
      resellerId: target.reseller.id,
      businessName: target.business_name,
      city: target.city,
      country: target.country,
    },
  });

  return jsonResponse({ lead: updatedLead, routing: { route_type: "reseller", reseller: target } });
}

async function scoreLead(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.lead_id) {
    return errorResponse("lead_id is required", 400);
  }

  const { data: lead, error } = await ctx.supabaseAdmin.from("leads").select("*").eq("id", body.lead_id).single();
  if (error) return errorResponse(error.message || "Lead not found", 404);

  const source = normalizeSourceChannel(body.source || lead.source);
  const budgetSignal = clamp(readNumber(body.budget, parseFloat(String(lead.budget_range || "0").replace(/[^\d.]/g, "")) || 0) / 1000, 0, 20);
  const clickSignal = clamp(readNumber(body.clicks, 0) / 25, 0, 20);
  const behaviorSignal = clamp(readNumber(body.behavior_score, 50) / 5, 0, 20);
  const sourceSignal = source === "google" ? 24 : source === "website" ? 20 : source === "whatsapp" ? 18 : source === "referral" ? 16 : source === "facebook" ? 14 : 10;
  const score = clamp(Math.round(sourceSignal + budgetSignal + clickSignal + behaviorSignal), 1, 100);
  const priority = priorityFromScore(score);
  const probability = clamp(Number((score * 0.92).toFixed(2)), 1, 99.99);

  await ctx.supabaseAdmin.from("lead_scores").insert({
    lead_id: lead.id,
    score_type: "marketing_ai",
    score,
    confidence: 0.89,
    factors: { source, budgetSignal, clickSignal, behaviorSignal, sourceSignal },
    model_version: "marketing-god-mode-v1",
  });

  const { data: updatedLead, error: updateError } = await ctx.supabaseAdmin
    .from("leads")
    .update({ ai_score: score, priority, conversion_probability: probability })
    .eq("id", lead.id)
    .select("*")
    .single();

  if (updateError) return errorResponse(updateError.message || "Unable to update lead score", 500);

  await ctx.supabaseAdmin
    .from("marketing_lead_attribution")
    .update({ score_label: priority, score_value: score, updated_at: nowIso() })
    .eq("lead_id", lead.id);

  await createRoutingLog(ctx, lead.id, "lead_scored", { score, priority, probability, source });

  return jsonResponse({ lead: updatedLead, score, label: priority, probability });
}

async function assignLeadPriority(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.lead_id) {
    return errorResponse("lead_id is required", 400);
  }

  const { data: lead, error } = await ctx.supabaseAdmin.from("leads").select("*").eq("id", body.lead_id).single();
  if (error) return errorResponse(error.message || "Lead not found", 404);

  const priority = body.priority || lead.priority || priorityFromScore(readNumber(lead.ai_score, 50));
  const scheduleOffsetMinutes = priority === "hot" ? 10 : priority === "warm" ? 240 : 1440;
  const scheduledAt = new Date(Date.now() + scheduleOffsetMinutes * 60 * 1000).toISOString();
  const assignedTo = lead.assigned_to || ctx.user.userId;

  await ctx.supabaseAdmin.from("lead_follow_ups").insert({
    lead_id: lead.id,
    scheduled_at: scheduledAt,
    follow_up_type: priority === "hot" ? "instant_callback" : priority === "warm" ? "sales_email" : "nurture_sequence",
    notes: `Priority assignment ${priority}`,
    ai_suggested_message: priority === "hot" ? "Call within 10 minutes." : priority === "warm" ? "Send product deck and WhatsApp follow-up." : "Add to nurture sequence.",
    assigned_to: assignedTo,
  });

  if (priority === "hot") {
    await ctx.supabaseAdmin.from("lead_alerts").insert({
      lead_id: lead.id,
      alert_type: "priority_hot",
      message: `Hot lead ${lead.name} requires immediate action`,
      severity: "critical",
      target_users: assignedTo ? [assignedTo] : [],
      target_roles: lead.assigned_role ? [lead.assigned_role] : [],
      auto_escalate_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });
  }

  const { data: updatedLead, error: updateError } = await ctx.supabaseAdmin
    .from("leads")
    .update({ priority, next_follow_up: scheduledAt })
    .eq("id", lead.id)
    .select("*")
    .single();

  if (updateError) return errorResponse(updateError.message || "Unable to assign lead priority", 500);
  return jsonResponse({ lead: updatedLead, queue: priority === "hot" ? "instant_assign" : "nurture_queue", scheduled_at: scheduledAt });
}

async function updateCampaign(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.campaign_id) {
    return errorResponse("campaign_id is required", 400);
  }

  const patch: Record<string, unknown> = {};
  ["name", "platform", "channel", "objective", "status", "approval_status"].forEach((field) => {
    if (body[field] !== undefined) patch[field] = body[field];
  });
  if (body.budget !== undefined) {
    patch.budget = readNumber(body.budget);
    patch.budget_limit = readNumber(body.budget);
  }
  if (body.targetAudience !== undefined) patch.audience = body.targetAudience;
  if (body.creatives !== undefined) patch.creatives = readArray(body.creatives);
  patch.last_synced_at = nowIso();

  const { data: campaign, error } = await ctx.supabaseAdmin
    .from("marketing_campaigns")
    .update(patch)
    .eq("id", body.campaign_id)
    .select("*")
    .single();
  if (error) return errorResponse(error.message || "Unable to update campaign", 500);

  await logActivity(ctx, {
    campaignId: campaign.id,
    action: "campaign_updated",
    targetType: "campaign",
    targetId: campaign.id,
    details: patch,
  });

  return jsonResponse({ campaign });
}

async function toggleCampaign(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.campaign_id) {
    return errorResponse("campaign_id is required", 400);
  }

  const { data: campaign, error } = await ctx.supabaseAdmin.from("marketing_campaigns").select("id, status").eq("id", body.campaign_id).single();
  if (error) return errorResponse(error.message || "Unable to load campaign", 500);

  const status = campaign.status === "active" ? "paused" : "active";
  return await updateCampaignStatus({ ...ctx, body: { campaign_id: campaign.id, status } } as RequestContext);
}

async function getCampaignPerformance(ctx: RequestContext, req: Request) {
  const url = new URL(req.url);
  const campaignId = url.searchParams.get("campaign_id");
  let query = ctx.supabaseAdmin.from("marketing_campaigns").select("*").order("created_at", { ascending: false }).limit(100);
  if (campaignId) query = query.eq("id", campaignId);

  const { data, error } = await query;
  if (error) return errorResponse(error.message || "Unable to load campaign performance", 500);

  const campaigns = (data || []).map((campaign) => ({
    ...campaign,
    roi: computeCampaignRoi(readNumber(campaign.spent), readNumber(campaign.revenue)),
    pacing: readNumber(campaign.budget) > 0 ? Number(((readNumber(campaign.spent) / readNumber(campaign.budget)) * 100).toFixed(2)) : 0,
  }));
  return jsonResponse({ campaigns });
}

async function createRegionalCampaign(ctx: RequestContext, regionType: "continent" | "country" | "city" | "language" | "festival") {
  const body = parseBody(ctx);
  const regionValue = body.region_value || body.country || body.city || body.language || body.festival_name;
  if (!regionValue) {
    return errorResponse("region_value is required", 400);
  }

  let campaignId = body.campaign_id || null;
  if (!campaignId) {
    const budget = readNumber(body.budget, 15000);
    const { data: campaign, error } = await ctx.supabaseAdmin
      .from("marketing_campaigns")
      .insert({
        name: body.name || `${regionType.toUpperCase()} ${regionValue} Campaign`,
        channel: body.channel || "regional",
        platform: body.platform || "regional",
        objective: body.objective || "lead_generation",
        budget,
        budget_limit: budget,
        daily_budget: readNumber(body.daily_budget, Math.max(1000, budget / 30)),
        status: "active",
        approval_status: "auto_approved",
        automation_status: "running",
        audience: body.targetAudience || {},
        creatives: readArray(body.creatives),
        created_by: ctx.user.userId,
        launched_at: nowIso(),
        last_synced_at: nowIso(),
      })
      .select("id")
      .single();
    if (error) return errorResponse(error.message || "Unable to create regional campaign base", 500);
    campaignId = campaign.id;
  }

  let festivalMeta: Record<string, unknown> = {};
  if (regionType === "festival") {
    const { data: festival } = await ctx.supabaseAdmin
      .from("festival_calendar")
      .select("name, month, day, country_codes, default_discount")
      .ilike("name", `%${String(regionValue)}%`)
      .maybeSingle();
    festivalMeta = festival || {};
  }

  const { data: regionalCampaign, error } = await ctx.supabaseAdmin
    .from("marketing_regional_campaigns")
    .insert({
      campaign_id: campaignId,
      region_type: regionType,
      region_value: regionValue,
      language_code: body.language_code || null,
      budget_override: readNumber(body.budget_override, 0),
      status: body.status || "active",
      starts_at: body.starts_at || null,
      ends_at: body.ends_at || null,
      metadata: { ...(body.metadata || {}), ...festivalMeta },
      created_by: ctx.user.userId,
    })
    .select("*")
    .single();

  if (error) return errorResponse(error.message || "Unable to create regional campaign", 500);
  return jsonResponse({ regionalCampaign }, 201);
}

async function runFollowup(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.lead_id && !body.recipient) {
    return errorResponse("lead_id or recipient is required", 400);
  }

  let lead: any = null;
  if (body.lead_id) {
    const result = await ctx.supabaseAdmin.from("leads").select("*").eq("id", body.lead_id).maybeSingle();
    lead = result.data;
  }

  const recipientEmail = body.email || lead?.email || body.recipient;
  const recipientWhatsapp = body.phone || lead?.phone || body.recipient;
  const channels = readArray<string>(body.channels).length > 0 ? readArray<string>(body.channels) : ["whatsapp", "email"];
  const assignedTo = lead?.assigned_to || ctx.user.userId;
  const logs: any[] = [];

  for (const channel of channels) {
    const recipient = channel === "email" ? recipientEmail : recipientWhatsapp;
    if (!recipient) continue;
    const { data: delivery } = await ctx.supabaseAdmin
      .from("marketing_delivery_logs")
      .insert({
        campaign_id: body.campaign_id || null,
        template_id: body.template_id || null,
        channel_type: channel,
        recipient,
        delivery_status: "sent",
        open_rate: channel === "email" ? 0.39 : 0,
        click_rate: channel === "whatsapp" ? 0.18 : channel === "sms" ? 0.07 : 0.11,
        metadata: { lead_id: lead?.id || null, automation: true, followup: true },
        created_by: ctx.user.userId,
      })
      .select("*")
      .single();
    if (delivery) logs.push(delivery);
  }

  if (lead) {
    await ctx.supabaseAdmin.from("lead_follow_ups").insert({
      lead_id: lead.id,
      scheduled_at: nowIso(),
      follow_up_type: "automation_followup",
      notes: body.notes || "Auto follow-up sent from marketing automation",
      ai_suggested_message: body.message || "Shared product value proposition and next steps.",
      assigned_to: assignedTo,
      is_completed: true,
      completed_at: nowIso(),
      outcome: "sent",
    });

    await ctx.supabaseAdmin.from("leads").update({ status: "follow_up", last_contact_at: nowIso() }).eq("id", lead.id);
  }

  await ctx.supabaseAdmin.from("marketing_automation_runs").insert({
    run_type: "followup",
    status: "completed",
    summary: { lead_id: lead?.id || null, channels, sent: logs.length },
    triggered_by: ctx.user.userId,
    completed_at: nowIso(),
  });

  return jsonResponse({ sent: logs.length, logs });
}

async function autoBudgetAdjust(ctx: RequestContext) {
  return await budgetControl(ctx);
}

async function listAiSuggestions(ctx: RequestContext) {
  const body = parseBody(ctx);
  const suggestion = {
    name: `${body.niche || "Growth"} Expansion`,
    budget: readNumber(body.budget, 25000),
    channels: readArray<string>(body.channels).length > 0 ? readArray<string>(body.channels) : ["google_ads", "meta_ads", "email"],
    target: body.target || "high-intent visitors",
    actions: [
      "Increase spend on channels with ROI above 25%",
      "Launch retargeting for warm visitors",
      "Translate top campaign creatives into regional languages",
    ],
  };
  return jsonResponse({ suggestion });
}

async function exportAnalytics(ctx: RequestContext) {
  const [{ data: campaigns }, { data: trafficEvents }, { data: channels }] = await Promise.all([
    ctx.supabaseAdmin.from("marketing_campaigns").select("name, platform, status, spent, revenue, leads_generated, conversions"),
    ctx.supabaseAdmin.from("marketing_traffic_events").select("source_channel, event_type, sessions_count, country_code, created_at").limit(200),
    ctx.supabaseAdmin.from("marketing_delivery_logs").select("channel_type, delivery_status, recipient, click_rate, open_rate, created_at").limit(200),
  ]);

  const rows = [
    ...(campaigns || []).map((campaign) => ({ type: "campaign", ...campaign })),
    ...(trafficEvents || []).map((event) => ({ type: "traffic", ...event })),
    ...(channels || []).map((delivery) => ({ type: "delivery", ...delivery })),
  ];

  return jsonResponse({ format: "csv", csv: makeCsv(rows), rows });
}

async function performanceAlert(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.campaign_id) {
    return errorResponse("campaign_id is required", 400);
  }

  const message = body.message || "Campaign performance dropped below configured threshold.";
  const { data: alert, error } = await ctx.supabaseAdmin
    .from("marketing_alerts")
    .insert({
      campaign_id: body.campaign_id,
      alert_type: "performance",
      severity: body.severity || "high",
      title: body.title || "Low performance detected",
      message,
      status: "open",
      metadata: body.metadata || {},
    })
    .select("*")
    .single();
  if (error) return errorResponse(error.message || "Unable to create performance alert", 500);
  return jsonResponse({ alert }, 201);
}

async function listMarketingLogs(ctx: RequestContext) {
  return await listAuditReports(ctx);
}

async function listPrivacyLogs(ctx: RequestContext) {
  const { data, error } = await ctx.supabaseAdmin
    .from("marketing_privacy_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return errorResponse(error.message || "Unable to load privacy logs", 500);
  return jsonResponse({ privacyLogs: data || [] });
}

async function marketingAnalytics(ctx: RequestContext) {
  const { data, error } = await ctx.supabaseAdmin
    .from("marketing_delivery_logs")
    .select("channel_type, open_rate, click_rate, delivery_status")
    .limit(500);
  if (error) return errorResponse(error.message || "Unable to load marketing analytics", 500);

  const stats = (data || []).reduce((acc, row) => {
    const key = row.channel_type;
    if (!acc[key]) acc[key] = { channel: key, sent: 0, delivered: 0, openRate: 0, clickRate: 0 };
    acc[key].sent += 1;
    acc[key].delivered += row.delivery_status === "sent" || row.delivery_status === "delivered" ? 1 : 0;
    acc[key].openRate += readNumber(row.open_rate);
    acc[key].clickRate += readNumber(row.click_rate);
    return acc;
  }, {} as Record<string, any>);

  const analytics = Object.values(stats).map((item: any) => ({
    ...item,
    openRate: item.sent > 0 ? Number(((item.openRate / item.sent) * 100).toFixed(2)) : 0,
    clickRate: item.sent > 0 ? Number(((item.clickRate / item.sent) * 100).toFixed(2)) : 0,
  }));

  return jsonResponse({ analytics });
}

async function syncInfluencers(ctx: RequestContext) {
  const body = parseBody(ctx);
  const source = String(body.source || body.platform || "instagram").toLowerCase();
  const payload = readArray<any>(body.influencers);
  const candidates = payload.length > 0 ? payload : [
    {
      name: `${source.toUpperCase()} Growth Partner`,
      platform: source,
      followers: 125000,
      engagement_rate: 0.048,
      niche: body.niche || "marketing",
      country: body.country || "India",
      verified: false,
    },
  ];

  const rows = candidates.map((item) => ({
    name: item.name,
    platform: normalizePlatform(item.platform || source),
    followers: readNumber(item.followers, 0),
    engagement_rate: readNumber(item.engagement_rate, 0),
    niche: item.niche || item.category || body.niche || "general",
    category: item.niche || item.category || body.niche || "general",
    country: item.country || body.country || "India",
    fake_follower_score: clamp(readNumber(item.fake_follower_score, 10), 0, 100),
    influencer_score: clamp(readNumber(item.influencer_score, 75), 0, 100),
    verified: Boolean(item.verified),
    metadata: { source, synced_from: source, external_id: item.external_id || null },
    last_synced_at: nowIso(),
  }));

  const { data, error } = await ctx.supabaseAdmin.from("marketing_influencers").insert(rows).select("*");
  if (error) return errorResponse(error.message || "Unable to sync influencers", 500);
  return jsonResponse({ influencers: data || [] }, 201);
}

async function runInfluencerFraudCheck(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.influencer_id) {
    return errorResponse("influencer_id is required", 400);
  }

  const { data: influencer, error } = await ctx.supabaseAdmin.from("marketing_influencers").select("*").eq("id", body.influencer_id).single();
  if (error) return errorResponse(error.message || "Influencer not found", 404);

  const abnormalSpike = clamp(readNumber(body.abnormal_spike_score, 0), 0, 100);
  const engagementPenalty = influencer.engagement_rate > 0.18 || influencer.engagement_rate < 0.005 ? 18 : 0;
  const suspiciousScore = clamp(Math.round(readNumber(influencer.fake_follower_score, 0) * 0.7 + abnormalSpike * 0.3 + engagementPenalty), 0, 100);
  const payoutStatus = suspiciousScore >= 65 ? "hold" : influencer.payout_status;
  const influencerScore = clamp(100 - suspiciousScore, 1, 100);

  const { data: updatedInfluencer, error: updateError } = await ctx.supabaseAdmin
    .from("marketing_influencers")
    .update({
      fake_follower_score: suspiciousScore,
      payout_status: payoutStatus,
      influencer_score: influencerScore,
      fraud_notes: suspiciousScore >= 65 ? "Fraud risk detected during marketing review" : "Passed fraud review",
      updated_at: nowIso(),
    })
    .eq("id", influencer.id)
    .select("*")
    .single();

  if (updateError) return errorResponse(updateError.message || "Unable to update influencer fraud status", 500);
  return jsonResponse({ influencer: updatedInfluencer, suspicious_score: suspiciousScore, flagged: suspiciousScore >= 65 });
}

async function influencerPayoutControl(ctx: RequestContext) {
  const body = parseBody(ctx);
  if (!body.assignment_id && !body.influencer_id) {
    return errorResponse("assignment_id or influencer_id is required", 400);
  }

  let assignment: any = null;
  if (body.assignment_id) {
    const result = await ctx.supabaseAdmin.from("marketing_influencer_campaigns").select("*").eq("id", body.assignment_id).maybeSingle();
    assignment = result.data;
  }

  const influencerId = body.influencer_id || assignment?.influencer_id;
  const { data: influencer, error } = await ctx.supabaseAdmin.from("marketing_influencers").select("*").eq("id", influencerId).single();
  if (error) return errorResponse(error.message || "Influencer not found", 404);

  const requestedStatus = body.payout_status || "approved";
  const fraudAdjustmentPercent = influencer.fake_follower_score >= 65 ? Math.min(40, Math.round(influencer.fake_follower_score * 0.35)) : 0;
  const baseAmount = readNumber(body.payout_amount, assignment?.payout || 0);
  const payoutAmount = Number((baseAmount * (1 - fraudAdjustmentPercent / 100)).toFixed(2));

  if (assignment) {
    await ctx.supabaseAdmin
      .from("marketing_influencer_campaigns")
      .update({ payout_status: fraudAdjustmentPercent > 0 && requestedStatus === "paid" ? "hold" : requestedStatus, updated_at: nowIso() })
      .eq("id", assignment.id);
  }

  const { data: payoutLog, error: payoutError } = await ctx.supabaseAdmin
    .from("marketing_influencer_payout_logs")
    .insert({
      influencer_id: influencer.id,
      assignment_id: assignment?.id || null,
      payout_amount: payoutAmount,
      payout_status: fraudAdjustmentPercent > 0 && requestedStatus === "paid" ? "held" : requestedStatus,
      fraud_adjustment_percent: fraudAdjustmentPercent,
      payout_reason: body.payout_reason || "Campaign payout processed",
      reference_note: body.reference_note || null,
      processed_by: ctx.user.userId,
      processed_at: nowIso(),
      metadata: { baseAmount, influencerScore: influencer.influencer_score },
    })
    .select("*")
    .single();
  if (payoutError) return errorResponse(payoutError.message || "Unable to write influencer payout log", 500);

  return jsonResponse({ payout: payoutLog, influencer, base_amount: baseAmount, payout_amount: payoutAmount });
}

serve((req) => withAuth(req, allowedRoles, async (ctx) => {
  try {
    const path = normalizePath(new URL(req.url).pathname);
    const method = req.method.toUpperCase();

    if (method === "GET" && (path === "/dashboard" || path === "/marketing/live-stats")) {
      return await getDashboard(ctx);
    }

    if (method === "GET" && path === "/settings") {
      return jsonResponse({ settings: await getSettings(ctx) });
    }

    if (method === "GET" && path === "/campaigns") {
      const { data, error } = await ctx.supabaseAdmin.from("marketing_campaigns").select("*").order("created_at", { ascending: false }).limit(100);
      if (error) return errorResponse(error.message || "Unable to load campaigns", 500);
      return jsonResponse({ campaigns: data || [] });
    }

    if (method === "GET" && path === "/channels") {
      return await analyticsChannel(ctx);
    }

    if (method === "GET" && path === "/campaigns/live-status") {
      return await getLiveCampaignStatus(ctx);
    }

    if (method === "GET" && path === "/channels/active") {
      return await getActiveChannels(ctx);
    }

    if (method === "GET" && path === "/leads/today") {
      return await getLeadsToday(ctx);
    }

    if (method === "GET" && path === "/analytics/cost-result") {
      return await getCostVsResult(ctx);
    }

    if (method === "GET" && path === "/analytics/conversion") {
      return await getConversionAnalytics(ctx);
    }

    if (method === "GET" && path === "/content/queue") {
      return await listContentQueue(ctx);
    }

    if (method === "GET" && path === "/reports/audit") {
      return await listAuditReports(ctx);
    }

    if (method === "GET" && path === "/compliance/status") {
      return await getComplianceStatus(ctx);
    }

    if (method === "POST" && path === "/ads/connect") {
      return await connectAdsAccount(ctx);
    }

    if (method === "POST" && path === "/ads/campaign/create") {
      return await createCampaign(ctx);
    }

    if (method === "POST" && path === "/campaign/create") {
      return await createCampaign(ctx);
    }

    if (method === "POST" && path === "/marketing/campaign/create") {
      return await createCampaign(ctx);
    }

    if (method === "PUT" && path === "/campaign/update") {
      return await updateCampaign(ctx);
    }

    if (method === "POST" && path === "/campaign/toggle") {
      return await toggleCampaign(ctx);
    }

    if (method === "GET" && path === "/campaign/performance") {
      return await getCampaignPerformance(ctx, req);
    }

    if (method === "GET" && path === "/ads/google") {
      return await getAdsPlatform(ctx, "google_ads");
    }

    if (method === "GET" && path === "/ads/meta") {
      return await getAdsPlatform(ctx, "meta_ads");
    }

    if (method === "GET" && path === "/ads/youtube") {
      return await getAdsPlatform(ctx, "youtube_ads");
    }

    if (method === "GET" && path === "/ads/display") {
      return await getAdsPlatform(ctx, "display_ads");
    }

    if (method === "POST" && path === "/ads/budget-control") {
      return await budgetControl(ctx);
    }

    if (method === "POST" && path === "/ads/campaign/status") {
      return await updateCampaignStatus(ctx);
    }

    if (method === "GET" && path === "/ads/roi") {
      const { data } = await ctx.supabaseAdmin.from("marketing_campaigns").select("spent, revenue").limit(200);
      const spend = (data || []).reduce((sum, row) => sum + readNumber(row.spent), 0);
      const revenue = (data || []).reduce((sum, row) => sum + readNumber(row.revenue), 0);
      return jsonResponse({ spend, revenue, roi: computeCampaignRoi(spend, revenue) });
    }

    if (method === "POST" && path === "/social/post/schedule") {
      return await scheduleSocialPost(ctx);
    }

    if (method === "POST" && path === "/social/schedule") {
      return await scheduleSocialPost(ctx);
    }

    if (method === "GET" && path.startsWith("/social/")) {
      const platform = path.replace("/social/", "");
      return await getSocialPlatform(ctx, platform);
    }

    if (method === "POST" && path === "/ai/content") {
      return await generateAiContent(ctx);
    }

    if (method === "POST" && path === "/leads/capture") {
      return await captureLead(ctx);
    }

    if (method === "GET" && path === "/leads/website") {
      return await getLeadSource(ctx, "website");
    }

    if (method === "GET" && path === "/leads/facebook") {
      return await getLeadSource(ctx, "facebook");
    }

    if (method === "GET" && path === "/leads/google") {
      return await getLeadSource(ctx, "google");
    }

    if (method === "GET" && path === "/leads/whatsapp") {
      return await getLeadSource(ctx, "whatsapp");
    }

    if (method === "GET" && path === "/leads/referral") {
      return await getLeadSource(ctx, "referral");
    }

    if (method === "GET" && path === "/leads/marketplace") {
      return await getLeadSource(ctx, "marketplace");
    }

    if (method === "POST" && path === "/routing/country") {
      return await routeByCountry(ctx);
    }

    if (method === "POST" && path === "/routing/franchise") {
      return await routeToFranchise(ctx);
    }

    if (method === "POST" && path === "/routing/reseller") {
      return await routeToReseller(ctx);
    }

    if (method === "POST" && path === "/routing/priority") {
      return await assignLeadPriority(ctx);
    }

    if (method === "POST" && path === "/ai/lead-score") {
      return await scoreLead(ctx);
    }

    if (method === "POST" && path === "/campaign/approve") {
      return await approveCampaign(ctx);
    }

    if (method === "POST" && path === "/region/continent") {
      return await createRegionalCampaign(ctx, "continent");
    }

    if (method === "POST" && path === "/region/country") {
      return await createRegionalCampaign(ctx, "country");
    }

    if (method === "POST" && path === "/region/city") {
      return await createRegionalCampaign(ctx, "city");
    }

    if (method === "POST" && path === "/region/language") {
      return await createRegionalCampaign(ctx, "language");
    }

    if (method === "POST" && path === "/region/festival") {
      return await createRegionalCampaign(ctx, "festival");
    }

    if (method === "POST" && path === "/content/status") {
      return await updateContentStatus(ctx);
    }

    if (method === "POST" && path === "/ai/insight/status") {
      return await updateInsightStatus(ctx);
    }

    if (method === "POST" && path === "/ai/marketing/analyze") {
      return await analyzeMarketing(ctx);
    }

    if (method === "POST" && path === "/seo/keywords") {
      return await generateKeywords(ctx);
    }

    if (method === "GET" && path === "/seo/country-keywords") {
      return await listCountryKeywords(ctx, req);
    }

    if (method === "POST" && path === "/seo/onpage/analyze") {
      return await runOnPageAudit(ctx);
    }

    if (method === "POST" && path === "/seo/backlinks/create") {
      return await createBacklink(ctx);
    }

    if (method === "GET" && path === "/seo/rank") {
      return await getRankings(ctx, req);
    }

    if (method === "GET" && path === "/influencer/list") {
      return await listInfluencers(ctx);
    }

    if (method === "GET" && path === "/influencers/list") {
      return await listInfluencers(ctx);
    }

    if (method === "POST" && path === "/influencers/sync") {
      return await syncInfluencers(ctx);
    }

    if (method === "POST" && path === "/influencer/assign") {
      return await assignInfluencer(ctx);
    }

    if (method === "POST" && path === "/influencers/assign") {
      return await assignInfluencer(ctx);
    }

    if (method === "GET" && path === "/influencer/performance") {
      return await influencerPerformance(ctx);
    }

    if (method === "GET" && path === "/influencers/performance") {
      return await influencerPerformance(ctx);
    }

    if (method === "POST" && path === "/influencers/fraud-check") {
      return await runInfluencerFraudCheck(ctx);
    }

    if (method === "POST" && path === "/influencer/payout") {
      return await influencerPayout(ctx);
    }

    if (method === "POST" && path === "/influencers/payout") {
      return await influencerPayoutControl(ctx);
    }

    if (method === "POST" && path === "/template/create") {
      return await createTemplate(ctx);
    }

    if (method === "POST" && path === "/marketing/send") {
      const channelType = String((ctx.body as Record<string, unknown>)?.channel || "email").toLowerCase();
      if (channelType === "sms") return await sendChannelMessage(ctx, "sms");
      if (channelType === "whatsapp") return await sendChannelMessage(ctx, "whatsapp");
      return await sendChannelMessage(ctx, "email");
    }

    if (method === "POST" && path === "/email/send") {
      return await sendChannelMessage(ctx, "email");
    }

    if (method === "POST" && path === "/sms/send") {
      return await sendChannelMessage(ctx, "sms");
    }

    if (method === "POST" && path === "/whatsapp/send") {
      return await sendChannelMessage(ctx, "whatsapp");
    }

    if (method === "GET" && path === "/campaign/report") {
      return await campaignReport(ctx, req);
    }

    if (method === "POST" && path === "/ads/retarget") {
      return await retarget(ctx);
    }

    if (method === "POST" && path === "/automation/retarget") {
      return await retarget(ctx);
    }

    if (method === "POST" && path === "/automation/followup") {
      return await runFollowup(ctx);
    }

    if (method === "POST" && path === "/automation/budget") {
      return await autoBudgetAdjust(ctx);
    }

    if (method === "POST" && path === "/ai/campaign/suggest") {
      return await aiCampaignSuggest(ctx);
    }

    if (method === "POST" && path === "/ai/suggestions") {
      return await listAiSuggestions(ctx);
    }

    if (method === "POST" && path === "/marketing/analytics") {
      return await marketingAnalytics(ctx);
    }

    if (method === "GET" && path === "/analytics/traffic") {
      return await analyticsTraffic(ctx);
    }

    if (method === "GET" && path === "/analytics/funnel") {
      return await analyticsFunnel(ctx);
    }

    if (method === "GET" && path === "/analytics/channel") {
      return await analyticsChannel(ctx);
    }

    if (method === "GET" && path === "/analytics/history") {
      return await analyticsHistory(ctx);
    }

    if (method === "GET" && path === "/analytics/export") {
      return await exportAnalytics(ctx);
    }

    if (method === "POST" && path === "/alerts/budget") {
      return await budgetAlert(ctx);
    }

    if (method === "POST" && path === "/alerts/performance") {
      return await performanceAlert(ctx);
    }

    if (method === "GET" && path === "/logs/marketing") {
      return await listMarketingLogs(ctx);
    }

    if (method === "GET" && path === "/compliance/check") {
      return await getComplianceStatus(ctx);
    }

    if (method === "GET" && path === "/logs/privacy") {
      return await listPrivacyLogs(ctx);
    }

    if (method === "POST" && path === "/automation/run-hourly") {
      return await runHourlyAutomation(ctx);
    }

    return errorResponse(`Route not found: ${method} ${path}`, 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected marketing manager failure";
    return errorResponse(message, 500);
  }
}, {
  module: "marketing_manager",
  action: "execute",
  skipKYC: true,
  skipSubscription: true,
}));