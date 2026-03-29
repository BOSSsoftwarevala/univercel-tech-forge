declare const Deno: { env: { get(name: string): string | undefined } };
// @ts-ignore Deno runtime import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { withAuth, type RequestContext } from "../_shared/middleware.ts";
import { errorResponse, jsonResponse } from "../_shared/utils.ts";

const allowedRoles = new Set(["assist_manager", "super_admin", "master", "admin", "boss_owner"]);
const adminRoles = new Set(["assist_manager", "super_admin", "master", "admin", "boss_owner"]);
const controlScopes = new Set(["screen_view", "keyboard", "mouse", "file_transfer", "chat", "voice"]);

type AssistSettings = {
  default_duration_minutes: number;
  max_duration_minutes: number;
  auto_timeout_minutes: number;
  require_consent: boolean;
  approval_required: boolean;
  allow_file_transfer: boolean;
  allow_voice: boolean;
  working_hours_only: boolean;
  ai_risk_threshold: number;
  auto_escalate: boolean;
  auto_end_over_limit: boolean;
  mask_sensitive: boolean;
};

function normalizePath(path: string) {
  if (!path) return "/";
  return path.replace(/^\/functions\/v1\/api-assist-manager/, "") || "/";
}

function parseJsonBody(ctx: RequestContext) {
  return ctx.body || {};
}

function isAllowedRole(role: string) {
  return allowedRoles.has(role);
}

function nowIso() {
  return new Date().toISOString();
}

function maskUserIdentifier(identifier: string) {
  if (!identifier) return "USR-****";
  return `${identifier.slice(0, 3)}-****${identifier.slice(-2)}`;
}

function toArray(input: unknown) {
  return Array.isArray(input) ? input : [];
}

async function sha256(input: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function readIp(req: Request) {
  return req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
}

function readDevice(req: Request) {
  return req.headers.get("user-agent") || "unknown-device";
}

async function requireAdmin(ctx: RequestContext) {
  if (!adminRoles.has(ctx.user.role)) {
    throw new Error("Assist Manager admin access required");
  }
}

async function getSettings(ctx: RequestContext): Promise<AssistSettings> {
  const { data, error } = await ctx.supabaseAdmin
    .from("assist_manager_settings")
    .select("settings_value")
    .eq("settings_key", "global")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return {
    default_duration_minutes: 30,
    max_duration_minutes: 120,
    auto_timeout_minutes: 15,
    require_consent: true,
    approval_required: true,
    allow_file_transfer: true,
    allow_voice: true,
    working_hours_only: false,
    ai_risk_threshold: 75,
    auto_escalate: true,
    auto_end_over_limit: true,
    mask_sensitive: true,
    ...(data?.settings_value || {}),
  };
}

async function writeAudit(
  ctx: RequestContext,
  params: {
    sessionDbId?: string | null;
    action: string;
    oldValue?: Record<string, unknown> | null;
    newValue?: Record<string, unknown> | null;
  },
  req: Request,
) {
  await ctx.supabaseAdmin.from("assist_manager_audit_logs").insert({
    session_id: params.sessionDbId || null,
    action: params.action,
    old_value: params.oldValue || null,
    new_value: params.newValue || null,
    user_id: ctx.user.userId,
    role: ctx.user.role,
    ip: ctx.clientIP || readIp(req),
    device: ctx.deviceId || readDevice(req),
    timestamp: nowIso(),
  });
}

async function writeSessionLog(
  ctx: RequestContext,
  sessionDbId: string,
  partial: Record<string, unknown>,
) {
  const { data: existing } = await ctx.supabaseAdmin
    .from("assist_manager_session_logs")
    .select("*")
    .eq("session_id", sessionDbId)
    .maybeSingle();

  if (!existing) {
    await ctx.supabaseAdmin.from("assist_manager_session_logs").insert({
      session_id: sessionDbId,
      ...partial,
    });
    return;
  }

  await ctx.supabaseAdmin
    .from("assist_manager_session_logs")
    .update(partial)
    .eq("id", existing.id);
}

async function logControlEvent(
  ctx: RequestContext,
  sessionDbId: string,
  actorUserId: string,
  eventType: string,
  payload: Record<string, unknown>,
  req: Request,
  controlStatus: "allowed" | "blocked" | "revoked" = "allowed",
) {
  await ctx.supabaseAdmin.from("assist_manager_control_events").insert({
    session_id: sessionDbId,
    actor_user_id: actorUserId,
    event_type: eventType,
    control_status: controlStatus,
    payload,
    ip: readIp(req),
    device: readDevice(req),
  });
}

async function findUserRole(ctx: RequestContext, userId: string) {
  const { data } = await ctx.supabaseAdmin
    .from("user_roles")
    .select("role, approval_status")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data?.role || null;
}

async function ensureDeviceAllowed(ctx: RequestContext, userId: string, deviceHash: string) {
  const { data, error } = await ctx.supabaseAdmin
    .from("assist_manager_device_access")
    .select("allowed")
    .eq("user_id", userId)
    .eq("device_hash", deviceHash)
    .maybeSingle();

  if (error) throw error;
  if (data && !data.allowed) {
    throw new Error("This device is blocked for assist sessions");
  }
}

async function getSessionById(ctx: RequestContext, sessionDbId: string) {
  const { data, error } = await ctx.supabaseAdmin
    .from("assist_manager_sessions")
    .select("*")
    .eq("id", sessionDbId)
    .single();

  if (error) throw error;
  return data;
}

async function getSessionByExternalId(ctx: RequestContext, externalId: string) {
  const { data, error } = await ctx.supabaseAdmin
    .from("assist_manager_sessions")
    .select("*")
    .eq("session_id", externalId)
    .single();

  if (error) throw error;
  return data;
}

async function listSessions(ctx: RequestContext, req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const limit = Math.min(100, Number(url.searchParams.get("limit") || 50));
  const scope = url.searchParams.get("scope") || "manager";

  let query = ctx.supabaseAdmin.from("assist_manager_sessions").select("*").order("created_at", { ascending: false }).limit(limit);

  if (status) {
    query = query.eq("status", status);
  }

  if (scope === "own") {
    query = query.or(`agent_id.eq.${ctx.user.userId},target_user_id.eq.${ctx.user.userId}`);
  } else if (!adminRoles.has(ctx.user.role)) {
    query = query.or(`agent_id.eq.${ctx.user.userId},target_user_id.eq.${ctx.user.userId}`);
  }

  const { data, error } = await query;
  if (error) throw error;

  return jsonResponse({
    sessions: data || [],
  });
}

async function getSessionDetail(ctx: RequestContext, sessionExternalId: string) {
  const session = await getSessionByExternalId(ctx, sessionExternalId);
  if (!adminRoles.has(ctx.user.role) && session.agent_id !== ctx.user.userId && session.target_user_id !== ctx.user.userId) {
    return errorResponse("Access denied", 403);
  }

  const [{ data: approvals }, { data: controlEvents }, { data: fileLogs }, { data: chatLogs }, { data: auditLogs }, { data: aiLogs }] = await Promise.all([
    ctx.supabaseAdmin.from("assist_manager_approvals").select("*").eq("session_id", session.id).order("created_at", { ascending: false }),
    ctx.supabaseAdmin.from("assist_manager_control_events").select("*").eq("session_id", session.id).order("created_at", { ascending: false }).limit(200),
    ctx.supabaseAdmin.from("assist_manager_file_logs").select("*").eq("session_id", session.id).order("created_at", { ascending: false }).limit(100),
    ctx.supabaseAdmin.from("assist_manager_chat_logs").select("*").eq("session_id", session.id).order("created_at", { ascending: false }).limit(200),
    ctx.supabaseAdmin.from("assist_manager_audit_logs").select("*").eq("session_id", session.id).order("timestamp", { ascending: false }).limit(200),
    ctx.supabaseAdmin.from("assist_manager_ai_logs").select("*").eq("session_id", session.id).order("created_at", { ascending: false }).limit(100),
  ]);

  return jsonResponse({
    session,
    approvals: approvals || [],
    controlEvents: controlEvents || [],
    fileLogs: fileLogs || [],
    chatLogs: chatLogs || [],
    auditLogs: auditLogs || [],
    aiLogs: aiLogs || [],
  });
}

async function createSession(ctx: RequestContext, req: Request) {
  await requireAdmin(ctx);
  const body = parseJsonBody(ctx);
  const settings = await getSettings(ctx);

  const assistType = String(body.assist_type || "").trim();
  const targetRole = String(body.target_role || "").trim();
  const targetUserId = String(body.target_user_id || "").trim();
  const purpose = String(body.purpose || "").trim();
  const permissionScope = toArray(body.permission_scope).map((item) => String(item));
  const durationInput = Number(body.max_duration_minutes || settings.default_duration_minutes || 30);

  if (!assistType || !["support", "dev", "sales"].includes(assistType)) {
    return errorResponse("assist_type must be support, dev, or sales", 400);
  }
  if (!targetRole || !targetUserId || !purpose) {
    return errorResponse("target_role, target_user_id, and purpose are required", 400);
  }
  if (!permissionScope.length) {
    return errorResponse("permission_scope is required", 400);
  }
  if (permissionScope.some((scope) => !controlScopes.has(scope))) {
    return errorResponse("permission_scope contains unsupported control values", 400);
  }

  const targetRoleResolved = await findUserRole(ctx, targetUserId);
  if (targetRoleResolved && targetRoleResolved !== targetRole) {
    return errorResponse("target_role does not match target_user_id", 400);
  }

  const sessionId = `ASM-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  const permissionToken = crypto.randomUUID();
  const permissionTokenHash = await sha256(permissionToken);
  const deviceHash = await sha256(readDevice(req));
  const ipAddress = readIp(req);
  const safeDuration = Math.max(5, Math.min(settings.max_duration_minutes || 120, durationInput));
  await ensureDeviceAllowed(ctx, ctx.user.userId, deviceHash);

  const relayPayload = {
    p_user_id: targetUserId,
  };
  const { data: relayData } = await ctx.supabaseAdmin.rpc("create_remote_assist_session", relayPayload as any).catch(() => ({ data: null }));
  const relaySessionId = (relayData as Record<string, unknown> | null)?.id as string | undefined;

  const sessionInsert = {
    session_id: sessionId,
    relay_session_id: relaySessionId || null,
    agent_id: ctx.user.userId,
    target_user_id: targetUserId,
    assist_type: assistType,
    target_role: targetRole,
    purpose,
    permission_scope: permissionScope,
    status: settings.approval_required ? "pending" : "approved",
    approval_required: settings.approval_required,
    permission_token_hash: permissionTokenHash,
    device_binding_hash: deviceHash,
    requester_ip: ipAddress,
    requester_device: readDevice(req),
    max_duration_minutes: safeDuration,
  };

  const { data: session, error } = await ctx.supabaseAdmin
    .from("assist_manager_sessions")
    .insert(sessionInsert)
    .select("*")
    .single();
  if (error) throw error;

  await ctx.supabaseAdmin.from("assist_manager_approvals").insert({
    session_id: session.id,
    target_user_id: targetUserId,
    requester_user_id: ctx.user.userId,
    status: "pending",
    ip: ipAddress,
    device: readDevice(req),
  });

  await ctx.supabaseAdmin.from("assist_manager_chat_logs").insert({
    session_id: session.id,
    sender_user_id: ctx.user.userId,
    message: `Assist session requested for ${purpose}`,
    message_type: "system",
  });

  await writeAudit(ctx, {
    sessionDbId: session.id,
    action: "assist_session_created",
    newValue: sessionInsert as unknown as Record<string, unknown>,
  }, req);

  return jsonResponse({
    session,
    approval_token_hint: maskUserIdentifier(targetUserId),
    signaling: {
      relay_session_id: relaySessionId || null,
      websocket_function: "safe-assist-relay",
      permission_token: permissionToken,
    },
  }, 201);
}

async function approveSession(ctx: RequestContext, req: Request) {
  const body = parseJsonBody(ctx);
  const sessionExternalId = String(body.session_id || "").trim();
  const decision = String(body.decision || body.status || "").trim();
  const reason = String(body.reason || "").trim();

  if (!sessionExternalId || !["approved", "denied"].includes(decision)) {
    return errorResponse("session_id and decision (approved|denied) are required", 400);
  }

  const session = await getSessionByExternalId(ctx, sessionExternalId);
  if (session.target_user_id !== ctx.user.userId && !adminRoles.has(ctx.user.role)) {
    return errorResponse("Only the target user or assist manager admin can approve", 403);
  }
  if (session.status !== "pending") {
    return errorResponse("Only pending sessions can be approved or denied", 400);
  }

  const updatePayload = decision === "approved"
    ? { status: "approved", approval_user_id: ctx.user.userId, approval_reason: reason || null, approval_granted_at: nowIso(), target_ip: ctx.clientIP || readIp(req), target_device: ctx.deviceId || readDevice(req) }
    : { status: "denied", denial_reason: reason || "Request denied", target_ip: ctx.clientIP || readIp(req), target_device: ctx.deviceId || readDevice(req) };

  await ctx.supabaseAdmin.from("assist_manager_sessions").update(updatePayload).eq("id", session.id);
  await ctx.supabaseAdmin.from("assist_manager_approvals").update({
    status: decision,
    response_reason: reason || null,
    responded_at: nowIso(),
    ip: ctx.clientIP || readIp(req),
    device: ctx.deviceId || readDevice(req),
  }).eq("session_id", session.id).eq("status", "pending");

  await writeAudit(ctx, {
    sessionDbId: session.id,
    action: decision === "approved" ? "assist_session_approved" : "assist_session_denied",
    oldValue: { status: session.status },
    newValue: updatePayload as unknown as Record<string, unknown>,
  }, req);

  return jsonResponse({ approved: decision === "approved" });
}

async function startSession(ctx: RequestContext, req: Request) {
  const body = parseJsonBody(ctx);
  const sessionExternalId = String(body.session_id || "").trim();
  const permissionToken = String(body.permission_token || "").trim();

  if (!sessionExternalId || !permissionToken) {
    return errorResponse("session_id and permission_token are required", 400);
  }

  const session = await getSessionByExternalId(ctx, sessionExternalId);
  if (session.agent_id !== ctx.user.userId && session.target_user_id !== ctx.user.userId && !adminRoles.has(ctx.user.role)) {
    return errorResponse("Access denied", 403);
  }
  if (session.status !== "approved") {
    return errorResponse("Session must be approved before starting", 400);
  }
  const tokenHash = await sha256(permissionToken);
  if (session.permission_token_hash !== tokenHash && !adminRoles.has(ctx.user.role)) {
    return errorResponse("Invalid permission token", 403);
  }

  const deviceHash = await sha256(readDevice(req));
  await ensureDeviceAllowed(ctx, ctx.user.userId, deviceHash);

  const startedAt = nowIso();
  const safeAssistSessionId = session.relay_session_id as string | null;
  if (safeAssistSessionId) {
    await ctx.supabaseAdmin.from("safe_assist_sessions").update({
      status: "active",
      started_at: startedAt,
      dual_verified: true,
      user_consent_given: true,
      agent_masked_id: maskUserIdentifier(ctx.user.userId),
    }).eq("id", safeAssistSessionId);
  }

  await ctx.supabaseAdmin.from("assist_manager_sessions").update({
    status: "active",
    start_requested_at: session.start_requested_at || startedAt,
    started_at: startedAt,
    target_ip: session.target_ip || readIp(req),
    target_device: session.target_device || readDevice(req),
  }).eq("id", session.id);

  await writeSessionLog(ctx, session.id, {
    start_time: startedAt,
    ip: readIp(req),
    device: readDevice(req),
  });

  await writeAudit(ctx, {
    sessionDbId: session.id,
    action: "assist_session_started",
    oldValue: { status: session.status },
    newValue: { status: "active", started_at: startedAt },
  }, req);

  return jsonResponse({
    session_id: session.session_id,
    relay_session_id: session.relay_session_id,
    websocket_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/safe-assist-relay?session_id=${session.relay_session_id || session.id}`,
    signaling_protocol: "webrtc+websocket",
    permissions: session.permission_scope,
  });
}

async function pauseSession(ctx: RequestContext, req: Request) {
  const body = parseJsonBody(ctx);
  const session = await getSessionByExternalId(ctx, String(body.session_id || ""));
  if (session.agent_id !== ctx.user.userId && !adminRoles.has(ctx.user.role)) {
    return errorResponse("Only the session agent or assist manager admin can pause the session", 403);
  }
  if (session.status !== "active") {
    return errorResponse("Only active sessions can be paused", 400);
  }

  const pausedAt = nowIso();
  await ctx.supabaseAdmin.from("assist_manager_sessions").update({ status: "paused", paused_at: pausedAt }).eq("id", session.id);
  await logControlEvent(ctx, session.id, ctx.user.userId, "pause", { reason: String(body.reason || "Paused by agent") }, req);
  await writeAudit(ctx, {
    sessionDbId: session.id,
    action: "assist_session_paused",
    oldValue: { status: session.status },
    newValue: { status: "paused", paused_at: pausedAt },
  }, req);
  return jsonResponse({ paused: true });
}

async function endSession(ctx: RequestContext, req: Request, emergency = false) {
  const body = parseJsonBody(ctx);
  const session = await getSessionByExternalId(ctx, String(body.session_id || ""));
  const allowed = adminRoles.has(ctx.user.role) || session.agent_id === ctx.user.userId || session.target_user_id === ctx.user.userId;
  if (!allowed) {
    return errorResponse("Access denied", 403);
  }

  const reason = String(body.reason || (emergency ? "Emergency stop" : "Session ended"));
  const endedAt = nowIso();
  await ctx.supabaseAdmin.from("assist_manager_sessions").update({
    status: "ended",
    ended_at: endedAt,
    emergency_stopped: emergency,
  }).eq("id", session.id);

  if (session.relay_session_id) {
    await ctx.supabaseAdmin.rpc("end_remote_assist_session", {
      p_session_id: session.relay_session_id,
      p_reason: reason,
    }).catch(() => null);
  }

  await logControlEvent(ctx, session.id, ctx.user.userId, emergency ? "emergency_stop" : "end", { reason }, req, emergency ? "revoked" : "allowed");
  await writeSessionLog(ctx, session.id, { end_time: endedAt });
  await writeAudit(ctx, {
    sessionDbId: session.id,
    action: emergency ? "assist_session_emergency_stopped" : "assist_session_ended",
    oldValue: { status: session.status },
    newValue: { status: "ended", emergency_stopped: emergency, ended_at: endedAt },
  }, req);

  return jsonResponse({ ended: true, emergency });
}

async function controlSession(ctx: RequestContext, req: Request) {
  const body = parseJsonBody(ctx);
  const session = await getSessionByExternalId(ctx, String(body.session_id || ""));
  const eventType = String(body.event_type || body.control_type || "").trim();
  const scope = String(body.scope || "").trim();
  const payload = (body.payload || {}) as Record<string, unknown>;

  if (!eventType || !scope) {
    return errorResponse("event_type and scope are required", 400);
  }
  if (session.status !== "active") {
    return errorResponse("Control events require an active session", 400);
  }
  if (session.agent_id !== ctx.user.userId && !adminRoles.has(ctx.user.role)) {
    return errorResponse("Only the session agent or assist manager admin can send control events", 403);
  }

  const scopes = toArray(session.permission_scope).map((item) => String(item));
  if (!scopes.includes(scope)) {
    await logControlEvent(ctx, session.id, ctx.user.userId, eventType, payload, req, "blocked");
    return errorResponse(`Permission scope ${scope} is not granted for this session`, 403);
  }

  await logControlEvent(ctx, session.id, ctx.user.userId, eventType, { scope, ...payload }, req);
  return jsonResponse({ accepted: true });
}

async function sendFile(ctx: RequestContext, req: Request) {
  const body = parseJsonBody(ctx);
  const session = await getSessionByExternalId(ctx, String(body.session_id || ""));
  if (session.agent_id !== ctx.user.userId && session.target_user_id !== ctx.user.userId && !adminRoles.has(ctx.user.role)) {
    return errorResponse("Access denied", 403);
  }

  const fileName = String(body.file_name || "").trim();
  const fileSize = Number(body.file_size || 0);
  const mimeType = String(body.mime_type || "application/octet-stream");
  const checksum = String(body.checksum_sha256 || "").trim();
  const receiverUserId = String(body.receiver_user_id || session.target_user_id).trim();

  if (!fileName || !checksum) {
    return errorResponse("file_name and checksum_sha256 are required", 400);
  }
  if (!toArray(session.permission_scope).map((item) => String(item)).includes("file_transfer")) {
    return errorResponse("File transfer is not allowed for this session", 403);
  }

  const { data, error } = await ctx.supabaseAdmin.from("assist_manager_file_logs").insert({
    session_id: session.id,
    sender_user_id: ctx.user.userId,
    receiver_user_id: receiverUserId,
    file_name: fileName,
    file_size: fileSize,
    mime_type: mimeType,
    checksum_sha256: checksum,
    encrypted: true,
    transfer_status: "queued",
    chunk_count: Math.max(1, Number(body.chunk_count || 1)),
    metadata: body.metadata || {},
  }).select("*").single();
  if (error) throw error;

  await writeAudit(ctx, {
    sessionDbId: session.id,
    action: "assist_file_transfer_queued",
    newValue: { file_name: fileName, checksum_sha256: checksum, file_size: fileSize },
  }, req);

  return jsonResponse({ file: data }, 201);
}

async function sendChat(ctx: RequestContext, req: Request) {
  const body = parseJsonBody(ctx);
  const session = await getSessionByExternalId(ctx, String(body.session_id || ""));
  const message = String(body.message || "").trim();
  const messageType = String(body.message_type || "chat");
  if (!message) {
    return errorResponse("message is required", 400);
  }
  if (session.status !== "active" && session.status !== "paused") {
    return errorResponse("Chat requires an active or paused session", 400);
  }

  const { data, error } = await ctx.supabaseAdmin.from("assist_manager_chat_logs").insert({
    session_id: session.id,
    sender_user_id: ctx.user.userId,
    message,
    message_type: messageType,
    metadata: body.metadata || {},
  }).select("*").single();
  if (error) throw error;
  return jsonResponse({ chat: data }, 201);
}

async function getDashboard(ctx: RequestContext) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [{ data: sessions }, { data: approvals }, { data: aiLogs }, { data: alerts }] = await Promise.all([
    ctx.supabaseAdmin.from("assist_manager_sessions").select("id,status,assist_type,created_at,started_at,ended_at,agent_id,target_user_id,emergency_stopped"),
    ctx.supabaseAdmin.from("assist_manager_approvals").select("id,status,created_at").gte("created_at", today.toISOString()),
    ctx.supabaseAdmin.from("assist_manager_ai_logs").select("id,risk_level,created_at").gte("created_at", today.toISOString()),
    ctx.supabaseAdmin.from("assist_manager_audit_logs").select("id,action,timestamp").gte("timestamp", today.toISOString()),
  ]);

  const allSessions = sessions || [];
  const activeSessions = allSessions.filter((item: any) => item.status === "active");
  const pendingRequests = allSessions.filter((item: any) => item.status === "pending");
  const approvedSessions = allSessions.filter((item: any) => item.status === "approved");
  const blockedSessions = allSessions.filter((item: any) => item.status === "blocked" || item.emergency_stopped);
  const aiAssisted = (aiLogs || []).length;
  const securityAlerts = (aiLogs || []).filter((item: any) => ["high", "critical"].includes(item.risk_level)).length;

  return jsonResponse({
    metrics: {
      activeSessions: activeSessions.length,
      pendingRequests: pendingRequests.length,
      approvedSessions: approvedSessions.length,
      blockedSessions: blockedSessions.length,
      aiAssisted,
      securityAlerts,
      totalSessions: allSessions.length,
      approvalsToday: (approvals || []).filter((item: any) => item.status === "approved").length,
      deniedToday: (approvals || []).filter((item: any) => item.status === "denied").length,
    },
    recentSessions: allSessions.slice(0, 12),
    recentAudit: (alerts || []).slice(0, 20),
  });
}

async function getSettingsRoute(ctx: RequestContext) {
  await requireAdmin(ctx);
  const settings = await getSettings(ctx);
  return jsonResponse({ settings });
}

async function updateSettingsRoute(ctx: RequestContext, req: Request) {
  await requireAdmin(ctx);
  const body = parseJsonBody(ctx);
  const existing = await getSettings(ctx);
  const settings = {
    ...existing,
    ...(body.settings || body),
  };
  await ctx.supabaseAdmin.from("assist_manager_settings").upsert({
    settings_key: "global",
    settings_value: settings,
    updated_by: ctx.user.userId,
  }, { onConflict: "settings_key" });
  await writeAudit(ctx, {
    action: "assist_settings_updated",
    oldValue: existing as unknown as Record<string, unknown>,
    newValue: settings as unknown as Record<string, unknown>,
  }, req);
  return jsonResponse({ settings });
}

async function getPendingApprovals(ctx: RequestContext) {
  const query = ctx.supabaseAdmin.from("assist_manager_approvals").select("*, assist_manager_sessions(*)").eq("status", "pending").order("created_at", { ascending: false });
  const filtered = adminRoles.has(ctx.user.role) ? query : query.eq("target_user_id", ctx.user.userId);
  const { data, error } = await filtered;
  if (error) throw error;
  return jsonResponse({ approvals: data || [] });
}

async function getAiLogs(ctx: RequestContext, req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id");
  let query = ctx.supabaseAdmin.from("assist_manager_ai_logs").select("*").order("created_at", { ascending: false }).limit(100);
  if (sessionId) {
    const session = await getSessionByExternalId(ctx, sessionId);
    query = query.eq("session_id", session.id);
  }
  const { data, error } = await query;
  if (error) throw error;
  return jsonResponse({ logs: data || [] });
}

async function runTimer(ctx: RequestContext, req: Request) {
  await requireAdmin(ctx);
  const settings = await getSettings(ctx);
  const now = new Date();
  const { data: active } = await ctx.supabaseAdmin.from("assist_manager_sessions").select("*").in("status", ["active", "approved", "paused"]);

  let ended = 0;
  let blocked = 0;
  for (const session of active || []) {
    if (!session.started_at || !settings.auto_end_over_limit) {
      continue;
    }

    const elapsedMinutes = Math.floor((now.getTime() - new Date(session.started_at).getTime()) / 60000);
    if (elapsedMinutes > Number(session.max_duration_minutes || settings.max_duration_minutes || 120)) {
      await ctx.supabaseAdmin.from("assist_manager_sessions").update({
        status: "ended",
        ended_at: nowIso(),
      }).eq("id", session.id);
      await writeAudit(ctx, {
        sessionDbId: session.id,
        action: "assist_session_auto_ended",
        oldValue: { status: session.status },
        newValue: { status: "ended", reason: "duration_limit" },
      }, req);
      ended += 1;
    }

    if (Number(session.ai_risk_score || 0) >= Number(settings.ai_risk_threshold || 75)) {
      await ctx.supabaseAdmin.from("assist_manager_ai_logs").insert({
        session_id: session.id,
        event_type: "risk_threshold_exceeded",
        risk_level: Number(session.ai_risk_score || 0) >= 90 ? "critical" : "high",
        analysis: { ai_risk_score: session.ai_risk_score, action: settings.auto_escalate ? "escalate" : "notify" },
        suggestion: settings.auto_escalate ? "Emergency stop recommended" : "Review risky control activity",
        auto_executed: false,
      });
      blocked += 1;
    }
  }

  return jsonResponse({ ended, blocked });
}

serve((req) => withAuth(req, Array.from(allowedRoles), async (ctx) => {
  try {
    if (!isAllowedRole(ctx.user.role)) {
      return errorResponse("Assist Manager access denied", 403);
    }

    const path = normalizePath(new URL(req.url).pathname);
    const method = req.method.toUpperCase();

    if (method === "GET" && path === "/dashboard") return await getDashboard(ctx);
    if (method === "GET" && path === "/settings") return await getSettingsRoute(ctx);
    if (method === "PUT" && path === "/settings") return await updateSettingsRoute(ctx, req);
    if (method === "GET" && path === "/pending-approvals") return await getPendingApprovals(ctx);
    if (method === "GET" && path === "/ai/logs") return await getAiLogs(ctx, req);
    if (method === "POST" && path === "/timer/run") return await runTimer(ctx, req);
    if (method === "GET" && path === "/assist/list") return await listSessions(ctx, req);
    if (method === "POST" && path === "/assist/session/create") return await createSession(ctx, req);
    if (method === "POST" && path === "/assist/approve") return await approveSession(ctx, req);
    if (method === "POST" && path === "/assist/start") return await startSession(ctx, req);
    if (method === "POST" && path === "/assist/pause") return await pauseSession(ctx, req);
    if (method === "POST" && path === "/assist/end") return await endSession(ctx, req, false);
    if (method === "POST" && path === "/assist/emergency-stop") return await endSession(ctx, req, true);
    if (method === "POST" && path === "/assist/control") return await controlSession(ctx, req);
    if (method === "POST" && path === "/assist/file/send") return await sendFile(ctx, req);
    if (method === "POST" && path === "/assist/chat/send") return await sendChat(ctx, req);

    const detailMatch = path.match(/^\/assist\/session\/([^/]+)$/);
    if (method === "GET" && detailMatch) {
      return await getSessionDetail(ctx, detailMatch[1]);
    }

    return errorResponse("Assist Manager route not found", 404);
  } catch (error) {
    console.error("[api-assist-manager]", error);
    return errorResponse(error instanceof Error ? error.message : "Unexpected Assist Manager error", 500);
  }
}, {
  module: "assist-manager",
  action: "assist-manager-api",
  skipSubscription: true,
  skipKYC: true,
}));