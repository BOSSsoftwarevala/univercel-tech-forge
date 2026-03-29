declare const Deno: { env: { get(name: string): string | undefined } };
// @ts-ignore Deno runtime import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { withAuth, type RequestContext } from "../_shared/middleware.ts";
import { errorResponse, jsonResponse, maskEmail, maskName, maskPhone } from "../_shared/utils.ts";

const allowedRoles = ["lead_manager", "super_admin", "master", "boss_owner", "ceo", "admin", "sales", "franchise", "reseller", "marketing_manager", "client_success"];
const adminRoles = new Set(["lead_manager", "super_admin", "master", "boss_owner", "ceo", "admin"]);
const maskedRoles = new Set(["sales", "franchise", "reseller"]);

function normalizePath(path: string) {
  if (!path) return "/";
  return path.replace(/^\/functions\/v1\/api-leads/, "") || "/";
}

function parseBody(ctx: RequestContext) {
  return ctx.body || {};
}

function nowIso() {
  return new Date().toISOString();
}

function readString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function readNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function normalizeStage(input: string | null | undefined) {
  const value = (input || "").trim().toLowerCase();
  const mapping: Record<string, string> = {
    new: "new",
    assigned: "assigned",
    contacted: "contacted",
    "follow-up": "follow_up",
    followup: "follow_up",
    follow_up: "follow_up",
    qualified: "qualified",
    negotiation: "negotiation",
    won: "closed_won",
    converted: "closed_won",
    "closed won": "closed_won",
    closed_won: "closed_won",
    lost: "closed_lost",
    "closed lost": "closed_lost",
    closed_lost: "closed_lost",
    proposal: "negotiation",
    interested: "qualified",
  };

  return mapping[value] || value || "new";
}

function displayStage(status: string | null | undefined) {
  const value = status || "new";
  const mapping: Record<string, string> = {
    new: "New",
    assigned: "Assigned",
    contacted: "Contacted",
    follow_up: "Follow-Up",
    qualified: "Qualified",
    negotiation: "Negotiation",
    closed_won: "Won",
    closed_lost: "Lost",
  };

  return mapping[value] || value;
}

function priorityFromScore(score: number) {
  if (score >= 80) return "hot";
  if (score >= 55) return "warm";
  return "cold";
}

function shouldMaskContact(role: string) {
  return maskedRoles.has(role);
}

function isClosed(status: string | null | undefined) {
  return status === "closed_won" || status === "closed_lost";
}

async function getSettings(ctx: RequestContext) {
  const { data, error } = await ctx.supabaseAdmin
    .from("lead_manager_settings")
    .select("*")
    .eq("workspace_key", "primary")
    .maybeSingle();

  if (error) return null;
  if (data) return data;

  const { data: inserted } = await ctx.supabaseAdmin
    .from("lead_manager_settings")
    .insert({ workspace_key: "primary" })
    .select("*")
    .single();

  return inserted || null;
}

async function logLeadActivity(ctx: RequestContext, leadId: string, action: string, actionType: string, details?: string, metadata: Record<string, unknown> = {}) {
  await ctx.supabaseAdmin.from("lead_logs").insert({
    lead_id: leadId,
    action,
    action_type: actionType,
    details,
    performed_by: ctx.user.userId,
    performer_role: ctx.user.role,
    metadata,
  });

  // Also log to lead_events for comprehensive tracking
  await ctx.supabaseAdmin.from("lead_events").insert({
    lead_id: leadId,
    event_type: actionType,
    event_action: action,
    performed_by: ctx.user.userId,
    performer_role: ctx.user.role,
    metadata: { ...metadata, details },
  });
}

async function logSecurityEvent(ctx: RequestContext, eventType: string, metadata: Record<string, unknown>, leadId?: string, maskedView = false) {
  await ctx.supabaseAdmin.from("lead_security_events").insert({
    lead_id: leadId || null,
    event_type: eventType,
    actor_user_id: ctx.user.userId,
    actor_role: ctx.user.role,
    masked_view: maskedView,
    metadata,
  });
}

async function getTeamMembers(ctx: RequestContext) {
  const { data: roles, error } = await ctx.supabaseAdmin
    .from("user_roles")
    .select("user_id, role")
    .in("role", ["lead_manager", "sales", "franchise", "reseller"]);

  if (error) return [];

  const uniqueUserIds = Array.from(new Set((roles || []).map((item: any) => item.user_id).filter(Boolean)));
  const { data: profiles } = uniqueUserIds.length > 0
    ? await ctx.supabaseAdmin.from("profiles").select("user_id, full_name, display_name, email, country, is_active").in("user_id", uniqueUserIds)
    : { data: [] as any[] };

  const { data: workloads } = uniqueUserIds.length > 0
    ? await ctx.supabaseAdmin.from("leads").select("assigned_to, status").in("assigned_to", uniqueUserIds).is("deleted_at", null)
    : { data: [] as any[] };

  const workloadMap = new Map<string, number>();
  (workloads || []).forEach((lead: any) => {
    if (!lead.assigned_to || isClosed(lead.status)) return;
    workloadMap.set(lead.assigned_to, (workloadMap.get(lead.assigned_to) || 0) + 1);
  });

  return (roles || []).map((roleRow: any) => {
    const profile = (profiles || []).find((item: any) => item.user_id === roleRow.user_id);
    return {
      user_id: roleRow.user_id,
      role: roleRow.role,
      name: profile?.display_name || profile?.full_name || profile?.email || roleRow.user_id,
      email: profile?.email || null,
      country: profile?.country || null,
      is_active: profile?.is_active !== false,
      workload: workloadMap.get(roleRow.user_id) || 0,
    };
  });
}

function computeScore(input: { behavior?: number; clicks?: number; budget?: number; source?: string }) {
  const source = (input.source || "").toLowerCase();
  const sourceWeight: Record<string, number> = {
    google: 18,
    google_ads: 18,
    meta: 16,
    facebook: 16,
    linkedin: 14,
    website: 12,
    whatsapp: 15,
    referral: 20,
    api_import: 10,
    seo: 11,
    email: 9,
  };

  const score = Math.min(99, Math.round(20 + readNumber(input.behavior, 50) * 0.35 + Math.min(readNumber(input.clicks, 0), 100) * 0.15 + Math.min(readNumber(input.budget, 0) / 1000, 30) + (sourceWeight[source] || 8)));

  return {
    score,
    label: priorityFromScore(score),
    probability: Math.min(99, Math.max(8, Math.round(score * 0.92))),
    best_call_time: new Date(Date.now() + (score >= 80 ? 15 : score >= 55 ? 60 : 180) * 60 * 1000).toISOString(),
    response_prediction: Math.min(98, Math.max(5, Math.round(score * 0.87))),
  };
}

async function scoreLeadInternal(ctx: RequestContext, leadId: string, payload: Record<string, unknown>) {
  const { data: lead, error } = await ctx.supabaseAdmin.from("leads").select("id, source, budget_range").eq("id", leadId).maybeSingle();
  if (error || !lead) throw new Error("Lead not found for scoring");

  const budget = readNumber(payload.budget, readNumber(lead.budget_range, 0));
  const scoring = computeScore({
    behavior: readNumber(payload.behavior_score, 55),
    clicks: readNumber(payload.clicks, 0),
    budget,
    source: readString(payload.source, lead.source),
  });

  await ctx.supabaseAdmin.from("lead_scores").insert({
    lead_id: leadId,
    score_type: "ai_priority",
    score: scoring.score,
    confidence: 82,
    factors: {
      behavior: readNumber(payload.behavior_score, 55),
      clicks: readNumber(payload.clicks, 0),
      budget,
      source: readString(payload.source, lead.source),
    },
    model_version: "lead-ai-v2",
  });

  await ctx.supabaseAdmin.from("leads").update({
    ai_score: scoring.score,
    priority: scoring.label,
    conversion_probability: scoring.probability,
    response_prediction: scoring.response_prediction,
    best_call_time: scoring.best_call_time,
  }).eq("id", leadId);

  if (scoring.label === "hot") {
    await ctx.supabaseAdmin.from("lead_alerts").insert({
      lead_id: leadId,
      alert_type: "hot_lead",
      message: "Lead score above 80. Instant call recommended.",
      severity: "high",
      requires_action: true,
      target_users: [ctx.user.userId],
      target_roles: [ctx.user.role],
    });
  }

  await logLeadActivity(ctx, leadId, "AI score calculated", "ai_score", `Lead classified as ${scoring.label}`, { score: scoring.score, probability: scoring.probability });
  return scoring;
}

async function upsertSourceStats(ctx: RequestContext, sourceName: string) {
  const normalized = sourceName || "website";
  const { data: existing } = await ctx.supabaseAdmin.from("lead_sources").select("id, total_leads").eq("name", normalized).maybeSingle();
  if (existing) {
    await ctx.supabaseAdmin.from("lead_sources").update({ total_leads: (existing.total_leads || 0) + 1 }).eq("id", existing.id);
    return;
  }

  await ctx.supabaseAdmin.from("lead_sources").insert({ name: normalized, type: normalized, total_leads: 1 });
}

async function loadLeadRows(ctx: RequestContext, filters: Record<string, unknown> = {}) {
  let query = ctx.supabaseAdmin.from("leads").select("*").is("deleted_at", null);

  const stage = normalizeStage(readString(filters.stage));
  const source = readString(filters.source);
  const assigned = readString(filters.assigned);
  const search = readString(filters.q);
  const date = readString(filters.date);

  if (stage && stage !== "all") query = query.eq("status", stage);
  if (source) query = query.eq("source", source);
  if (assigned) query = query.eq("assigned_to", assigned);
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,company.ilike.%${search}%`);
  if (date === "today") query = query.gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw new Error(error.message || "Failed to load leads");
  return data || [];
}

async function shapeLeadRows(ctx: RequestContext, rows: any[]) {
  const assigneeIds = Array.from(new Set(rows.map((row) => row.assigned_to).filter(Boolean)));
  const { data: profiles } = assigneeIds.length > 0
    ? await ctx.supabaseAdmin.from("profiles").select("user_id, full_name, display_name, email").in("user_id", assigneeIds)
    : { data: [] as any[] };

  const profileMap = new Map((profiles || []).map((profile: any) => [profile.user_id, profile]));
  const maskContacts = shouldMaskContact(ctx.user.role);

  return rows.map((row) => {
    const assignee = row.assigned_to ? profileMap.get(row.assigned_to) : null;
    return {
      id: row.id,
      lead_id: row.id,
      name: maskContacts ? maskName(row.name) : row.name,
      phone: maskContacts ? (row.masked_phone || maskPhone(row.phone || "")) : row.phone,
      email: maskContacts ? (row.masked_email || maskEmail(row.email || "")) : row.email,
      masked_phone: row.masked_phone,
      masked_email: row.masked_email,
      company: row.company,
      source: row.source,
      status: row.status,
      stage: displayStage(row.status),
      assigned_to: row.assigned_to,
      assigned_to_name: assignee ? (assignee.display_name || assignee.full_name || assignee.email) : (row.assigned_role || "Unassigned"),
      assigned_to_role: row.assigned_role,
      score: row.ai_score,
      priority: row.priority,
      created_at: row.created_at,
      updated_at: row.updated_at,
      country: row.country,
      city: row.city,
      region: row.region,
      company_size: row.requirements,
      conversion_probability: row.conversion_probability,
      response_prediction: row.response_prediction,
      best_call_time: row.best_call_time,
      next_follow_up: row.next_follow_up,
      channel_name: row.channel_name || row.source,
      lead: row,
    };
  });
}

async function getAnalytics(ctx: RequestContext) {
  const { data: rows, error } = await ctx.supabaseAdmin.from("leads").select("id, source, status, ai_score, assigned_to, created_at").is("deleted_at", null);
  if (error) throw new Error(error.message || "Failed to load analytics");

  const leads = rows || [];
  const todayCutoff = Date.now() - 24 * 60 * 60 * 1000;
  const total = leads.length;
  const converted = leads.filter((lead: any) => lead.status === "closed_won").length;
  const lost = leads.filter((lead: any) => lead.status === "closed_lost").length;
  const today = leads.filter((lead: any) => new Date(lead.created_at).getTime() >= todayCutoff).length;
  const active = leads.filter((lead: any) => !isClosed(lead.status)).length;
  const hot = leads.filter((lead: any) => readNumber(lead.ai_score) >= 80).length;
  const cold = leads.filter((lead: any) => readNumber(lead.ai_score) < 55).length;
  const conversionRate = total > 0 ? Number(((converted / total) * 100).toFixed(2)) : 0;

  const sourceMap = new Map<string, { source: string; total: number; converted: number }>();
  leads.forEach((lead: any) => {
    const source = lead.source || "website";
    const entry = sourceMap.get(source) || { source, total: 0, converted: 0 };
    entry.total += 1;
    if (lead.status === "closed_won") entry.converted += 1;
    sourceMap.set(source, entry);
  });

  const teamMap = new Map<string, { assigned_to: string; leads: number; converted: number }>();
  leads.forEach((lead: any) => {
    const key = lead.assigned_to || "unassigned";
    const entry = teamMap.get(key) || { assigned_to: key, leads: 0, converted: 0 };
    entry.leads += 1;
    if (lead.status === "closed_won") entry.converted += 1;
    teamMap.set(key, entry);
  });

  return {
    summary: {
      totalLeads: total,
      activeLeads: active,
      newLeadsToday: today,
      convertedLeads: converted,
      lostLeads: lost,
      hotLeads: hot,
      coldLeads: cold,
      conversionRate,
    },
    sourcePerformance: Array.from(sourceMap.values()).map((entry) => ({
      source: entry.source,
      leads: entry.total,
      conversion_rate: entry.total > 0 ? Number(((entry.converted / entry.total) * 100).toFixed(2)) : 0,
    })),
    teamPerformance: Array.from(teamMap.values()).map((entry) => ({
      assigned_to: entry.assigned_to,
      leads: entry.leads,
      converted: entry.converted,
      conversion_rate: entry.leads > 0 ? Number(((entry.converted / entry.leads) * 100).toFixed(2)) : 0,
    })),
  };
}

async function getLeadDashboard(ctx: RequestContext) {
  const analytics = await getAnalytics(ctx);
  const recentRows = await loadLeadRows(ctx, {});
  const recentLeads = await shapeLeadRows(ctx, recentRows.slice(0, 8));
  const { data: alerts } = await ctx.supabaseAdmin.from("lead_alerts").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(10);
  const { data: suggestions } = await ctx.supabaseAdmin.from("lead_ai_suggestions").select("*").order("created_at", { ascending: false }).limit(6);
  const settings = await getSettings(ctx);

  const pipelineStages = ["new", "assigned", "contacted", "follow_up", "qualified", "negotiation", "closed_won", "closed_lost"];
  const pipeline = pipelineStages.map((stage) => ({
    stage,
    label: displayStage(stage),
    leads: recentLeads.filter((lead) => lead.status === stage),
    count: recentRows.filter((lead: any) => lead.status === stage).length,
  }));

  return {
    ...analytics,
    recentLeads,
    pipeline,
    alerts: alerts || [],
    aiStatus: {
      aiScoringActive: !!settings?.ai_scoring_enabled,
      autoRoutingEnabled: !!settings?.auto_routing_enabled,
      autoFollowupEnabled: !!settings?.auto_followup_enabled,
      requireApproval: !!settings?.require_ai_approval,
    },
    suggestions: suggestions || [],
    settings,
  };
}

async function manualAssignLead(ctx: RequestContext, body: Record<string, unknown>, reason = "manual_assign") {
  const leadId = readString(body.lead_id);
  const assigneeId = readString(body.agent_id || body.assigned_to_user || body.assigned_to);
  const assignedRole = readString(body.assigned_role || body.role || "sales");
  if (!leadId || !assigneeId) throw new Error("lead_id and assignee are required");

  const { data: lead, error } = await ctx.supabaseAdmin.from("leads").update({
    assigned_to: assigneeId,
    assigned_role: assignedRole,
    assigned_at: nowIso(),
    last_routed_at: nowIso(),
    status: "assigned",
  }).eq("id", leadId).is("deleted_at", null).select("*").single();

  if (error || !lead) throw new Error(error?.message || "Lead not found");

  await ctx.supabaseAdmin.from("lead_assignments").insert({
    lead_id: leadId,
    assigned_to: assigneeId,
    assigned_by: ctx.user.userId,
    assigned_role: assignedRole,
    reason,
    auto_assigned: reason !== "manual_assign" && reason !== "reassign",
    assignment_score: readNumber(body.assignment_score, lead.ai_score || 0),
  });

  await logLeadActivity(ctx, leadId, reason === "reassign" ? "Lead reassigned" : "Lead assigned", "assignment", readString(body.notes, reason), { assigneeId, assignedRole });
  return lead;
}

async function autoAssignLead(ctx: RequestContext, body: Record<string, unknown>) {
  const leadId = readString(body.lead_id);
  if (!leadId) throw new Error("lead_id is required");

  const { data: lead, error } = await ctx.supabaseAdmin.from("leads").select("*").eq("id", leadId).is("deleted_at", null).maybeSingle();
  if (error || !lead) throw new Error(error?.message || "Lead not found");

  const members = (await getTeamMembers(ctx)).filter((member: any) => member.is_active);
  const countryMatches = members.filter((member: any) => !lead.country || !member.country || member.country === lead.country);
  const candidatePool = countryMatches.length > 0 ? countryMatches : members;
  if (candidatePool.length === 0) throw new Error("No team members available for auto assignment");

  const roleRank: Record<string, number> = { sales: 1, franchise: 2, reseller: 3, lead_manager: 4 };
  const candidate = [...candidatePool].sort((left: any, right: any) => {
    const workloadDiff = left.workload - right.workload;
    if (workloadDiff !== 0) return workloadDiff;
    return (roleRank[left.role] || 99) - (roleRank[right.role] || 99);
  })[0];

  const assignedLead = await manualAssignLead(ctx, {
    lead_id: leadId,
    agent_id: candidate.user_id,
    assigned_role: candidate.role,
    notes: `Auto assigned by country/workload engine${lead.country ? ` (${lead.country})` : ""}`,
    assignment_score: lead.ai_score || 0,
  }, "auto_assign");

  return { lead: assignedLead, assignee: candidate };
}

async function createLeadReminder(ctx: RequestContext, body: Record<string, unknown>) {
  const leadId = readString(body.lead_id);
  const scheduledAt = readString(body.date || body.scheduled_at || body.reminder_at, new Date(Date.now() + 60 * 60 * 1000).toISOString());
  if (!leadId) throw new Error("lead_id is required");

  const { data: lead } = await ctx.supabaseAdmin.from("leads").select("assigned_to").eq("id", leadId).maybeSingle();
  const assignedTo = readString(body.assigned_to || lead?.assigned_to || ctx.user.userId);

  const { data, error } = await ctx.supabaseAdmin.from("lead_follow_ups").insert({
    lead_id: leadId,
    scheduled_at: scheduledAt,
    follow_up_type: readString(body.type || body.follow_up_type, "call"),
    notes: readString(body.notes),
    ai_suggested_message: readString(body.ai_message),
    assigned_to: assignedTo,
  }).select("*").single();

  if (error) throw new Error(error.message || "Failed to create follow-up");

  await ctx.supabaseAdmin.from("leads").update({ next_follow_up: scheduledAt }).eq("id", leadId);
  await logLeadActivity(ctx, leadId, "Follow-up scheduled", "followup", readString(body.notes, "Reminder created"), { scheduled_at: scheduledAt });
  return data;
}

async function createDelayAlert(ctx: RequestContext, body: Record<string, unknown>) {
  const leadId = readString(body.lead_id);
  if (!leadId) throw new Error("lead_id is required");

  const settings = await getSettings(ctx);
  const threshold = readNumber(body.minutes, settings?.delay_alert_minutes || 10);
  const { data: lead, error } = await ctx.supabaseAdmin.from("leads").select("id, name, created_at, last_contact_at, assigned_to, status").eq("id", leadId).maybeSingle();
  if (error || !lead) throw new Error(error?.message || "Lead not found");

  const baseTime = new Date(lead.last_contact_at || lead.created_at).getTime();
  const overdue = Date.now() - baseTime >= threshold * 60 * 1000;
  const message = overdue ? `Lead not contacted within ${threshold} minutes.` : `Lead delay alert created proactively for ${threshold}-minute SLA.`;

  const { data, error: alertError } = await ctx.supabaseAdmin.from("lead_alerts").insert({
    lead_id: leadId,
    alert_type: "lead_delay",
    message,
    severity: overdue ? "high" : "medium",
    requires_action: true,
    target_users: lead.assigned_to ? [lead.assigned_to] : [ctx.user.userId],
    target_roles: [lead.assigned_to ? "sales" : ctx.user.role],
    auto_escalate_at: new Date(Date.now() + threshold * 60 * 1000).toISOString(),
  }).select("*").single();

  if (alertError) throw new Error(alertError.message || "Failed to create alert");

  await logLeadActivity(ctx, leadId, "Lead delay alert", "alert", message);
  return { alert: data, overdue };
}

async function getLeadHistory(ctx: RequestContext, leadId: string) {
  const [{ data: communications }, { data: followups }, { data: logs }] = await Promise.all([
    ctx.supabaseAdmin.from("lead_communications").select("*").eq("lead_id", leadId).order("created_at", { ascending: false }),
    ctx.supabaseAdmin.from("lead_follow_ups").select("*").eq("lead_id", leadId).order("created_at", { ascending: false }),
    ctx.supabaseAdmin.from("lead_logs").select("*").eq("lead_id", leadId).order("created_at", { ascending: false }),
  ]);

  return { communications: communications || [], followups: followups || [], logs: logs || [] };
}

async function getLeadById(ctx: RequestContext, leadId: string) {
  const { data: lead, error } = await ctx.supabaseAdmin.from("leads").select("*").eq("id", leadId).is("deleted_at", null).maybeSingle();
  if (error || !lead) throw new Error(error?.message || "Lead not found");

  const [history, shaped] = await Promise.all([getLeadHistory(ctx, leadId), shapeLeadRows(ctx, [lead])]);
  await logSecurityEvent(ctx, "lead_view", { lead_id: leadId }, leadId, shouldMaskContact(ctx.user.role));
  return { lead: shaped[0], history };
}

async function updateLead(ctx: RequestContext, body: Record<string, unknown>) {
  const leadId = readString(body.lead_id || body.id);
  if (!leadId) throw new Error("lead_id is required");

  const updates: Record<string, unknown> = {};
  const fields = ["name", "phone", "email", "company", "source", "country", "city", "region", "requirements", "budget_range", "channel_name", "external_reference"];
  fields.forEach((field) => {
    if (body[field] !== undefined) updates[field] = body[field];
  });
  if (body.status !== undefined) updates.status = normalizeStage(readString(body.status));
  if (body.priority !== undefined) updates.priority = body.priority;
  if (body.next_follow_up !== undefined) updates.next_follow_up = body.next_follow_up;
  updates.updated_at = nowIso();

  const { data, error } = await ctx.supabaseAdmin.from("leads").update(updates).eq("id", leadId).is("deleted_at", null).select("*").single();
  if (error) throw new Error(error.message || "Failed to update lead");

  await logLeadActivity(ctx, leadId, "Lead updated", "update", "Lead details edited", updates);
  return data;
}

async function moveLeadStage(ctx: RequestContext, body: Record<string, unknown>) {
  const leadId = readString(body.lead_id);
  const newStage = normalizeStage(readString(body.new_stage || body.status));
  if (!leadId || !newStage) throw new Error("lead_id and new_stage are required");

  // Get current lead status for event logging
  const { data: currentLead } = await ctx.supabaseAdmin
    .from("leads")
    .select("status")
    .eq("id", leadId)
    .is("deleted_at", null)
    .single();

  const { data, error } = await ctx.supabaseAdmin.from("leads").update({
    status: newStage,
    updated_at: nowIso(),
    ...(newStage === "closed_lost" ? { closed_at: nowIso(), closed_reason: readString(body.reason) } : {}),
  }).eq("id", leadId).is("deleted_at", null).select("*").single();
  if (error) throw new Error(error.message || "Failed to move lead stage");

  // Log to lead_events table
  await ctx.supabaseAdmin.from("lead_events").insert({
    lead_id: leadId,
    event_type: "stage_change",
    event_action: "stage_moved",
    old_value: currentLead?.status,
    new_value: newStage,
    performed_by: ctx.user.userId,
    performer_role: ctx.user.role,
    metadata: { reason: readString(body.reason), notes: readString(body.notes) },
  });

  await logLeadActivity(ctx, leadId, "Stage moved", "stage", `Lead moved to ${displayStage(newStage)}`);
  if (newStage === "closed_won") {
    await ctx.supabaseAdmin.from("lead_conversions").insert({
      lead_id: leadId,
      revenue: readNumber(body.revenue, data.conversion_value || 0),
      commission: 0,
      converted_by: ctx.user.userId,
    });
  }
  return data;
}

async function convertLead(ctx: RequestContext, body: Record<string, unknown>) {
  const leadId = readString(body.lead_id);
  if (!leadId) throw new Error("lead_id is required");
  const revenue = readNumber(body.revenue, 0);

  const { data, error } = await ctx.supabaseAdmin.from("lead_conversions").insert({
    lead_id: leadId,
    product_id: body.product_id || null,
    revenue,
    commission: 0,
    converted_by: ctx.user.userId,
  }).select("*").single();

  if (error) throw new Error(error.message || "Failed to convert lead");

  await ctx.supabaseAdmin.from("leads").update({ status: "closed_won", closed_at: nowIso(), conversion_value: revenue }).eq("id", leadId);
  await logLeadActivity(ctx, leadId, "Lead converted", "conversion", `Lead converted with revenue ${revenue}`);
  return data;
}

async function markLost(ctx: RequestContext, body: Record<string, unknown>) {
  const leadId = readString(body.lead_id);
  const reason = readString(body.reason, 'not_interested');
  const notes = readString(body.notes);
  if (!leadId) throw new Error("lead_id is required");

  const { data, error } = await ctx.supabaseAdmin.from("leads").update({
    status: "closed_lost",
    closed_at: nowIso(),
    updated_at: nowIso(),
  }).eq("id", leadId).is("deleted_at", null).select("*").single();

  if (error || !data) throw new Error(error?.message || "Lead not found");

  await ctx.supabaseAdmin.from("lead_logs").insert({
    lead_id: leadId,
    action: "Lead marked as lost",
    action_type: "loss",
    details: `Reason: ${reason}${notes ? ` - ${notes}` : ''}`,
    performed_by: ctx.user.userId,
    performer_role: ctx.user.role,
    metadata: { reason, notes },
  });

  await ctx.supabaseAdmin.from("lead_events").insert({
    lead_id: leadId,
    event_type: "loss",
    event_action: "marked_lost",
    old_value: data.status,
    new_value: "closed_lost",
    performed_by: ctx.user.userId,
    performer_role: ctx.user.role,
    metadata: { reason, notes },
  });

  return data;
}

async function checkSLABreaches(ctx: RequestContext) {
  const now = nowIso();

  // Check for leads without assignment for too long
  const { data: unassignedLeads } = await ctx.supabaseAdmin
    .from("leads")
    .select("id, name, created_at, source")
    .is("assigned_to", null)
    .eq("status", "new")
    .lt("created_at", new Date(Date.now() - 2 * 60 * 1000).toISOString()) // 2 minutes
    .is("deleted_at", null);

  for (const lead of unassignedLeads || []) {
    await ctx.supabaseAdmin.from("lead_alerts").insert({
      lead_id: lead.id,
      alert_type: "assignment_delay",
      message: `Lead ${lead.name} unassigned for ${Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60))} minutes`,
      severity: "high",
      requires_action: true,
      target_users: [], // All lead managers
      target_roles: ["lead_manager", "admin"],
    });

    // Auto-assign if possible
    try {
      await autoAssignLead(ctx, { lead_id: lead.id });
    } catch (error) {
      // Log failure to retry queue
      await ctx.supabaseAdmin.from("lead_retry_queue").insert({
        operation: "auto_assign",
        lead_id: lead.id,
        payload: { lead_id: lead.id },
        priority: 3,
        error_message: error.message,
      });
    }
  }

  // Check for leads without follow-up
  const { data: leadsWithoutFollowup } = await ctx.supabaseAdmin
    .from("leads")
    .select("id, name, status, assigned_at")
    .not("status", "closed_won")
    .not("status", "closed_lost")
    .is("next_follow_up", null)
    .is("deleted_at", null);

  for (const lead of leadsWithoutFollowup || []) {
    const assignedMinutes = lead.assigned_at ? Math.floor((Date.now() - new Date(lead.assigned_at).getTime()) / (1000 * 60)) : 0;
    if (assignedMinutes > 30) { // 30 minutes without follow-up
      await ctx.supabaseAdmin.from("lead_alerts").insert({
        lead_id: lead.id,
        alert_type: "followup_missing",
        message: `Lead ${lead.name} has no follow-up scheduled (${assignedMinutes} minutes since assignment)`,
        severity: "medium",
        requires_action: true,
        target_users: lead.assigned_to ? [lead.assigned_to] : [],
        target_roles: ["lead_manager"],
      });
    }
  }

  return (unassignedLeads?.length || 0) + (leadsWithoutFollowup?.length || 0);
}

async function processRetryQueue(ctx: RequestContext) {
  const { data: pendingRetries } = await ctx.supabaseAdmin
    .from("lead_retry_queue")
    .select("*")
    .eq("status", "pending")
    .lte("next_retry_at", nowIso())
    .order("priority", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(10);

  for (const retry of pendingRetries || []) {
    try {
      if (retry.operation === "auto_assign") {
        await autoAssignLead(ctx, retry.payload);
      } else if (retry.operation === "send_notification") {
        // Process notification retry
        console.log("Retrying notification:", retry.payload);
      }

      await ctx.supabaseAdmin
        .from("lead_retry_queue")
        .update({
          status: "completed",
          completed_at: nowIso(),
        })
        .eq("id", retry.id);

    } catch (error) {
      const newRetryCount = retry.retry_count + 1;

      if (newRetryCount >= retry.max_retries) {
        await ctx.supabaseAdmin
          .from("lead_retry_queue")
          .update({
            status: "failed",
            error_message: error.message,
          })
          .eq("id", retry.id);
      } else {
        const nextRetry = new Date(Date.now() + Math.pow(2, newRetryCount) * 60 * 1000);
        await ctx.supabaseAdmin
          .from("lead_retry_queue")
          .update({
            retry_count: newRetryCount,
            next_retry_at: nextRetry.toISOString(),
          })
          .eq("id", retry.id);
      }
    }
  }

  return pendingRetries?.length || 0;
}

async function logCronJob(ctx: RequestContext, jobName: string, status: "started" | "completed" | "failed", details?: Record<string, unknown>) {
  await ctx.supabaseAdmin
    .from("lead_cron_job_logs")
    .insert({
      job_name: jobName,
      status: status,
      details: details || {},
      executed_at: nowIso(),
    });
}

async function sendChannelMessage(ctx: RequestContext, channel: "email" | "whatsapp" | "call", body: Record<string, unknown>) {
  const leadId = readString(body.lead_id);
  if (!leadId) throw new Error("lead_id is required");

  const { data, error } = await ctx.supabaseAdmin.from("lead_communications").insert({
    lead_id: leadId,
    channel,
    direction: "outbound",
    subject: readString(body.subject),
    message: readString(body.message),
    notes: readString(body.notes),
    outcome: readString(body.outcome, channel === "call" ? "completed" : "queued"),
    next_action_at: body.next_action_at || null,
    performed_by: ctx.user.userId,
    metadata: {
      template: body.template || null,
      provider: body.provider || (channel === "call" ? "voip-simulated" : "internal-queue"),
    },
  }).select("*").single();

  if (error) throw new Error(error.message || `Failed to log ${channel}`);

  const leadUpdates: Record<string, unknown> = { updated_at: nowIso() };
  if (channel === "call") {
    leadUpdates.status = "contacted";
    leadUpdates.last_contact_at = nowIso();
  }
  await ctx.supabaseAdmin.from("leads").update(leadUpdates).eq("id", leadId);

  await logLeadActivity(ctx, leadId, `${channel.toUpperCase()} action`, channel, readString(body.notes, `${channel} sent`));
  return data;
}

async function getSourceData(ctx: RequestContext) {
  const analytics = await getAnalytics(ctx);
  const { data: sourceRows } = await ctx.supabaseAdmin.from("lead_sources").select("*").order("total_leads", { ascending: false });
  return (analytics.sourcePerformance || []).map((entry: any) => {
    const sourceMeta = (sourceRows || []).find((row: any) => row.name === entry.source || row.type === entry.source);
    return { ...entry, campaign_id: sourceMeta?.campaign_id || null, utm_source: sourceMeta?.utm_source || null, is_active: sourceMeta?.is_active ?? true };
  });
}

async function createAISuggestions(ctx: RequestContext, body: Record<string, unknown>) {
  const leadId = readString(body.lead_id);
  const { data: lead } = leadId ? await ctx.supabaseAdmin.from("leads").select("id, name, ai_score, next_follow_up, source").eq("id", leadId).maybeSingle() : { data: null };

  const baseLeadName = lead?.name || "Lead portfolio";
  const score = readNumber(lead?.ai_score, 58);
  const suggestions = [
    { lead_id: lead?.id || null, suggestion_type: "followup", title: `Follow up ${baseLeadName}`, summary: score >= 80 ? "High-intent lead. Follow up within 15 minutes." : "Schedule a same-day follow-up with a tailored intro.", payload: { recommended_minutes: score >= 80 ? 15 : 120 }, created_by: ctx.user.userId },
    { lead_id: lead?.id || null, suggestion_type: "call_time", title: `Best time to call ${baseLeadName}`, summary: score >= 80 ? "Call before the next 30 minutes for peak response." : "Call during the next business-hour window.", payload: { best_call_time: new Date(Date.now() + (score >= 80 ? 30 : 120) * 60 * 1000).toISOString() }, created_by: ctx.user.userId },
    { lead_id: lead?.id || null, suggestion_type: "conversion_probability", title: `Conversion probability for ${baseLeadName}`, summary: `Predicted close probability ${Math.min(98, Math.round(score * 0.9))}% based on source and engagement.`, payload: { probability: Math.min(98, Math.round(score * 0.9)) }, created_by: ctx.user.userId },
  ];

  const { data, error } = await ctx.supabaseAdmin.from("lead_ai_suggestions").insert(suggestions).select("*");
  if (error) throw new Error(error.message || "Failed to create AI suggestions");
  return data || [];
}

async function approveAISuggestion(ctx: RequestContext, body: Record<string, unknown>) {
  const suggestionId = readString(body.suggestion_id);
  if (!suggestionId) throw new Error("suggestion_id is required");

  const { data, error } = await ctx.supabaseAdmin.from("lead_ai_suggestions").update({
    status: readBoolean(body.execute, false) ? "executed" : "approved",
    approved_by: ctx.user.userId,
    approved_at: nowIso(),
  }).eq("id", suggestionId).select("*").single();

  if (error) throw new Error(error.message || "Failed to approve AI suggestion");
  if (readBoolean(body.execute, false) && data.lead_id && data.suggestion_type === "followup") {
    await createLeadReminder(ctx, {
      lead_id: data.lead_id,
      type: "call",
      scheduled_at: data.payload?.recommended_minutes ? new Date(Date.now() + Number(data.payload.recommended_minutes) * 60 * 1000).toISOString() : new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      notes: data.summary,
    });
  }
  return data;
}

async function getChannelSummary(ctx: RequestContext, channelName: string) {
  const normalized = channelName.toLowerCase();
  const sourceMatch: Record<string, string[]> = {
    google: ["google", "google_ads"],
    meta: ["meta", "facebook"],
    linkedin: ["linkedin"],
    email: ["email"],
    seo: ["seo", "website"],
  };

  const matchingSources = sourceMatch[normalized] || [normalized];
  const { data: leads } = await ctx.supabaseAdmin.from("leads").select("id, status").in("source", matchingSources as any).is("deleted_at", null);
  const { data: campaigns } = await ctx.supabaseAdmin.from("marketing_campaigns").select("channel, spent, revenue").eq("channel", normalized).limit(50);
  const leadCount = (leads || []).length;
  const converted = (leads || []).filter((lead: any) => lead.status === "closed_won").length;
  const spend = (campaigns || []).reduce((sum: number, item: any) => sum + readNumber(item.spent, 0), 0);

  return {
    channel: normalized,
    leads: leadCount,
    spend,
    conversions: converted,
    conversion_rate: leadCount > 0 ? Number(((converted / leadCount) * 100).toFixed(2)) : 0,
  };
}

serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = normalizePath(url.pathname);
  const method = req.method.toUpperCase();

  try {
    if (method === "GET" && path === "/dashboard") {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse(await getLeadDashboard(ctx)), { module: "leads", action: "dashboard" });
    }

    if (method === "GET" && path === "/leads/all") {
      return withAuth(req, allowedRoles, async (ctx) => {
        const rows = await loadLeadRows(ctx);
        return jsonResponse({ leads: await shapeLeadRows(ctx, rows), total: rows.length });
      }, { module: "leads", action: "all" });
    }

    if (method === "GET" && path === "/leads/new") {
      return withAuth(req, allowedRoles, async (ctx) => {
        const rows = await loadLeadRows(ctx, { stage: "new" });
        return jsonResponse({ leads: await shapeLeadRows(ctx, rows), total: rows.length });
      }, { module: "leads", action: "new" });
    }

    if (method === "GET" && path === "/leads/converted") {
      return withAuth(req, allowedRoles, async (ctx) => {
        const rows = await loadLeadRows(ctx, { stage: "won" });
        return jsonResponse({ leads: await shapeLeadRows(ctx, rows), total: rows.length });
      }, { module: "leads", action: "converted" });
    }

    if (method === "GET" && path === "/leads/lost") {
      return withAuth(req, allowedRoles, async (ctx) => {
        const rows = await loadLeadRows(ctx, { stage: "lost" });
        return jsonResponse({ leads: await shapeLeadRows(ctx, rows), total: rows.length });
      }, { module: "leads", action: "lost" });
    }

    if (method === "GET" && path === "/leads/conversion-rate") {
      return withAuth(req, allowedRoles, async (ctx) => {
        const analytics = await getAnalytics(ctx);
        return jsonResponse({ conversion_rate: analytics.summary.conversionRate, total: analytics.summary.totalLeads, converted: analytics.summary.convertedLeads });
      }, { module: "leads", action: "conversion_rate" });
    }

    if (method === "GET" && path === "/leads/search") {
      return withAuth(req, allowedRoles, async (ctx) => {
        const rows = await loadLeadRows(ctx, {
          q: url.searchParams.get("q"),
          source: url.searchParams.get("source"),
          status: url.searchParams.get("status"),
          stage: url.searchParams.get("stage") || url.searchParams.get("status"),
          date: url.searchParams.get("date"),
          assigned: url.searchParams.get("assigned"),
        });
        return jsonResponse({ leads: await shapeLeadRows(ctx, rows), total: rows.length });
      }, { module: "leads", action: "search" });
    }

    if (method === "GET" && (path === "/" || path === "/leads")) {
      return withAuth(req, allowedRoles, async (ctx) => {
        const stage = url.searchParams.get("stage") || "all";
        const rows = await loadLeadRows(ctx, { stage });
        return jsonResponse({ leads: await shapeLeadRows(ctx, rows), total: rows.length, stage });
      }, { module: "leads", action: "list" });
    }

    if (method === "POST" && path === "/leads/capture") {
      return withAuth(req, allowedRoles, async (ctx) => {
        const body = parseBody(ctx);
        if (!body.name || !body.phone) return errorResponse("name and phone are required", 400);

        const payload = {
          name: body.name,
          email: readString(body.email),
          phone: readString(body.phone),
          company: readString(body.company),
          source: readString(body.source, "website"),
          region: readString(body.region),
          city: readString(body.city),
          country: readString(body.country, "India"),
          requirements: readString(body.requirements),
          budget_range: readString(body.budget_range || body.budget),
          channel_name: readString(body.channel_name || body.source),
          external_reference: readString(body.external_reference),
          created_by: ctx.user.userId,
          status: "new",
        };

        const { data, error } = await ctx.supabaseAdmin.from("leads").insert(payload).select("*").single();
        if (error || !data) return errorResponse(error?.message || "Failed to capture lead", 400);

        await upsertSourceStats(ctx, payload.source);
        await logLeadActivity(ctx, data.id, "Lead captured", "capture", "Lead entered the system", { source: payload.source });

        const settings = await getSettings(ctx);
        const scoring = settings?.ai_scoring_enabled ? await scoreLeadInternal(ctx, data.id, body) : null;
        const routing = settings?.auto_assign_enabled || settings?.auto_routing_enabled ? await autoAssignLead(ctx, { lead_id: data.id }) : null;

        return jsonResponse({
          lead: (await shapeLeadRows(ctx, [data]))[0],
          routing,
          scoring,
          flow: ["captured", routing ? "assigned" : "queued", scoring ? "scored" : "pending_score"],
        }, 201, true);
      }, { module: "leads", action: "capture" });
    }

    if (method === "POST" && path === "/leads/assign") {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse({ lead: await manualAssignLead(ctx, parseBody(ctx)) }), { module: "leads", action: "assign" });
    }

    if (method === "POST" && path === "/leads/reassign") {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse({ lead: await manualAssignLead(ctx, parseBody(ctx), "reassign") }), { module: "leads", action: "reassign" });
    }

    if (method === "POST" && (path === "/leads/auto-assign" || path === "/routing/auto")) {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse(await autoAssignLead(ctx, parseBody(ctx))), { module: "leads", action: "auto_assign" });
    }

    if (method === "POST" && path === "/leads/status") {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse({ lead: await moveLeadStage(ctx, { ...parseBody(ctx), new_stage: parseBody(ctx).status }) }), { module: "leads", action: "status" });
    }

    if (method === "POST" && path === "/leads/move-stage") {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse({ lead: await moveLeadStage(ctx, parseBody(ctx)) }), { module: "leads", action: "move_stage" });
    }

    if (method === "POST" && path === "/leads/qualify") {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse({ lead: await moveLeadStage(ctx, { ...parseBody(ctx), new_stage: "qualified" }) }), { module: "leads", action: "qualify" });
    }

    if (method === "POST" && path === "/ai/lead-score") {
      return withAuth(req, allowedRoles, async (ctx) => {
        const body = parseBody(ctx);
        const leadId = readString(body.lead_id);
        if (!leadId) return errorResponse("lead_id is required", 400);
        const scoring = await scoreLeadInternal(ctx, leadId, body);
        return jsonResponse(scoring);
      }, { module: "leads", action: "ai_score" });
    }

    if (method === "POST" && path === "/leads/followup") {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse({ followup: await createLeadReminder(ctx, parseBody(ctx)) }), { module: "leads", action: "followup" });
    }

    if (method === "POST" && path === "/leads/reminder") {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse({ reminder: await createLeadReminder(ctx, parseBody(ctx)) }), { module: "leads", action: "reminder" });
    }

    if (method === "GET" && path === "/leads/history") {
      return withAuth(req, allowedRoles, async (ctx) => {
        const leadId = readString(url.searchParams.get("lead_id"));
        if (!leadId) return errorResponse("lead_id is required", 400);
        return jsonResponse(await getLeadHistory(ctx, leadId));
      }, { module: "leads", action: "history" });
    }

    if (method === "POST" && path === "/leads/convert") {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse({ conversion: await convertLead(ctx, parseBody(ctx)) }), { module: "leads", action: "convert" });
    }

    if (method === "POST" && path === "/leads/lost") {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse({ lead: await markLost(ctx, parseBody(ctx)) }), { module: "leads", action: "mark_lost" });
    }

    if (method === "POST" && path === "/cron/sla-check") {
      return withAuth(req, Array.from(adminRoles), async (ctx) => {
        await logCronJob(ctx, "sla_breach_check", "started");
        const breaches = await checkSLABreaches(ctx);
        await logCronJob(ctx, "sla_breach_check", "completed", { breaches_handled: breaches });
        return jsonResponse({ breaches_handled: breaches });
      }, { module: "leads", action: "cron_sla" });
    }

    if (method === "POST" && path === "/cron/retry-queue") {
      return withAuth(req, Array.from(adminRoles), async (ctx) => {
        await logCronJob(ctx, "retry_queue_processing", "started");
        const processed = await processRetryQueue(ctx);
        await logCronJob(ctx, "retry_queue_processing", "completed", { items_processed: processed });
        return jsonResponse({ items_processed: processed });
      }, { module: "leads", action: "cron_retry" });
    }

    if (method === "GET" && path === "/leads/analytics") {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse(await getAnalytics(ctx)), { module: "leads", action: "analytics" });
    }

    if (method === "GET" && path === "/leads/reports") {
      return withAuth(req, allowedRoles, async (ctx) => {
        const analytics = await getAnalytics(ctx);
        const rows = await loadLeadRows(ctx);
        return jsonResponse({ ...analytics, recent: await shapeLeadRows(ctx, rows.slice(0, 15)) });
      }, { module: "leads", action: "reports" });
    }

    if (method === "GET" && path === "/leads/sources") {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse({ sources: await getSourceData(ctx) }), { module: "leads", action: "sources" });
    }

    if (method === "POST" && (path === "/leads/call-log" || path === "/leads/call")) {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse({ communication: await sendChannelMessage(ctx, "call", parseBody(ctx)) }), { module: "leads", action: "call" });
    }

    if (method === "POST" && path === "/whatsapp/send") {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse({ communication: await sendChannelMessage(ctx, "whatsapp", parseBody(ctx)) }), { module: "leads", action: "whatsapp" });
    }

    if (method === "POST" && path === "/email/send") {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse({ communication: await sendChannelMessage(ctx, "email", parseBody(ctx)) }), { module: "leads", action: "email" });
    }

    if (method === "POST" && path === "/leads/lost") {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse({ lead: await moveLeadStage(ctx, { ...parseBody(ctx), new_stage: "lost" }) }), { module: "leads", action: "lost" });
    }

    if (method === "GET" && path === "/logs/lead-activity") {
      return withAuth(req, allowedRoles, async (ctx) => {
        const { data, error } = await ctx.supabaseAdmin.from("lead_logs").select("*").order("created_at", { ascending: false }).limit(100);
        if (error) return errorResponse(error.message || "Failed to load activity logs", 400);
        return jsonResponse({ logs: data || [] });
      }, { module: "leads", action: "activity_logs" });
    }

    if (method === "GET" && path === "/security/access") {
      return withAuth(req, allowedRoles, async () => jsonResponse({
        matrix: [
          { role: "Admin", access: "full access" },
          { role: "Lead Manager", access: "edit + assign + approve AI" },
          { role: "Agent", access: "limited + masked exports" },
        ],
      }), { module: "leads", action: "security_access" });
    }

    if (method === "GET" && path === "/security/masked") {
      return withAuth(req, allowedRoles, async (ctx) => {
        const rows = await loadLeadRows(ctx, {});
        const shaped = await shapeLeadRows({ ...ctx, user: { ...ctx.user, role: "sales" } }, rows.slice(0, 10));
        await logSecurityEvent(ctx, "masked_contact_view", { sample_count: shaped.length }, undefined, true);
        return jsonResponse({ masked: shaped });
      }, { module: "leads", action: "security_masked" });
    }

    if (method === "POST" && path === "/security/export-lock") {
      return withAuth(req, Array.from(adminRoles), async (ctx) => {
        const body = parseBody(ctx);
        const { data, error } = await ctx.supabaseAdmin.from("lead_manager_settings").update({ export_locked: readBoolean(body.locked, true) }).eq("workspace_key", "primary").select("*").single();
        if (error) return errorResponse(error.message || "Failed to update export lock", 400);
        await logSecurityEvent(ctx, "export_lock_changed", { export_locked: data.export_locked });
        return jsonResponse({ settings: data });
      }, { module: "leads", action: "export_lock" });
    }

    if (method === "GET" && path === "/security/audit") {
      return withAuth(req, Array.from(adminRoles), async (ctx) => {
        const { data, error } = await ctx.supabaseAdmin.from("lead_security_events").select("*").order("created_at", { ascending: false }).limit(100);
        if (error) return errorResponse(error.message || "Failed to load audit logs", 400);
        return jsonResponse({ audit_logs: data || [] });
      }, { module: "leads", action: "security_audit" });
    }

    if (method === "GET" && path === "/roles/permissions") {
      return withAuth(req, allowedRoles, async (ctx) => {
        const { data } = await ctx.supabaseAdmin.from("role_permissions").select("role_name, permission_name, module_name, action").eq("module_name", "leads");
        return jsonResponse({ permissions: data || [] });
      }, { module: "leads", action: "roles_permissions" });
    }

    if (method === "POST" && path === "/ai/lead/suggestions") {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse({ suggestions: await createAISuggestions(ctx, parseBody(ctx)) }), { module: "leads", action: "ai_suggestions" });
    }

    if (method === "POST" && path === "/ai/approve") {
      return withAuth(req, Array.from(adminRoles), async (ctx) => jsonResponse({ suggestion: await approveAISuggestion(ctx, parseBody(ctx)) }), { module: "leads", action: "ai_approve" });
    }

    if (method === "GET" && path.startsWith("/channels/")) {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse(await getChannelSummary(ctx, path.replace("/channels/", ""))), { module: "leads", action: "channel_summary" });
    }

    if (method === "GET" && path === "/team/members") {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse({ members: await getTeamMembers(ctx) }), { module: "leads", action: "team_members" });
    }

    if (method === "GET" && path === "/alerts/leads") {
      return withAuth(req, allowedRoles, async (ctx) => {
        const { data, error } = await ctx.supabaseAdmin.from("lead_alerts").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(100);
        if (error) return errorResponse(error.message || "Failed to load alerts", 400);
        return jsonResponse({ alerts: data || [] });
      }, { module: "leads", action: "alerts" });
    }

    if (method === "POST" && path === "/alerts/lead-delay") {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse(await createDelayAlert(ctx, parseBody(ctx))), { module: "leads", action: "lead_delay" });
    }

    if (method === "GET" && path === "/integrations") {
      return withAuth(req, allowedRoles, async () => jsonResponse({ integrations: [
        { name: "Marketing Manager", status: "connected", flow: "Marketing -> Lead Manager" },
        { name: "Automation", status: "connected", flow: "Reminder + auto follow-up" },
        { name: "CRM / Sales", status: "connected", flow: "Lead -> Sales -> Revenue" },
        { name: "WhatsApp / Email", status: "connected", flow: "Omnichannel outreach" },
      ] }), { module: "leads", action: "integrations" });
    }

    if (method === "GET" && path === "/settings/lead") {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse({ settings: await getSettings(ctx) }), { module: "leads", action: "settings" });
    }

    if (method === "GET" && /^\/leads\/[0-9a-f-]+$/i.test(path)) {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse(await getLeadById(ctx, path.split("/").pop() || "")), { module: "leads", action: "detail" });
    }

    if (method === "PUT" && path === "/leads/update") {
      return withAuth(req, allowedRoles, async (ctx) => jsonResponse({ lead: await updateLead(ctx, parseBody(ctx)) }), { module: "leads", action: "update" });
    }

    if (method === "DELETE" && path === "/leads/delete") {
      return withAuth(req, Array.from(adminRoles), async (ctx) => {
        const body = parseBody(ctx);
        const leadId = readString(body.lead_id || body.id);
        if (!leadId) return errorResponse("lead_id is required", 400);
        const { data, error } = await ctx.supabaseAdmin.from("leads").update({ deleted_at: nowIso() }).eq("id", leadId).select("id").single();
        if (error) return errorResponse(error.message || "Failed to delete lead", 400);
        await logLeadActivity(ctx, leadId, "Lead deleted", "delete", "Lead soft deleted");
        return jsonResponse({ deleted: true, lead_id: data.id });
      }, { module: "leads", action: "delete" });
    }

    return errorResponse("Not found", 404);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unexpected lead manager error", 500);
  }
});
