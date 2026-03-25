import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  errorResponse,
  jsonResponse,
  sanitizeInput,
  validateRequired,
} from "../_shared/utils.ts";
import { withAuth, RequestContext } from "../_shared/middleware.ts";

const CHAT_MANAGER_ROLES = [
  "boss_owner",
  "master",
  "super_admin",
  "ceo",
  "admin",
  "api_security",
  "hr_manager",
  "legal_compliance",
  "support",
  "client_success",
];

const MAX_MESSAGE_LENGTH = 2000;

function normalizePath(path: string) {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function getRequestMeta(req: Request, rawBody: Record<string, unknown>) {
  const url = new URL(req.url);
  const pathFromUrl = url.pathname.replace(/^.*\/api-chat/, "") || "/";
  return {
    path: normalizePath(String(rawBody._path || pathFromUrl || "/")),
    method: String(rawBody._method || req.method || "GET").toUpperCase(),
    url,
  };
}

function getPayload(body: Record<string, unknown>) {
  const nextBody = { ...body };
  delete nextBody._path;
  delete nextBody._method;
  return nextBody;
}

function matches(path: string, ...candidates: string[]) {
  const normalized = path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
  return candidates.includes(normalized);
}

function isManager(role: string) {
  return CHAT_MANAGER_ROLES.includes(role);
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function sanitizeMessage(value: unknown) {
  const content = sanitizeInput(stripHtml(String(value || ""))).slice(0, MAX_MESSAGE_LENGTH).trim();
  return content;
}

function detectModeration(content: string) {
  const violations: string[] = [];
  const normalized = content.toLowerCase();
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(content);
  const hasPhone = /(?:\+?\d[\d\s().-]{8,}\d)/.test(content);
  const hasUrl = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|co|in|biz|me)\b)/i.test(content);
  const hasExternalContact = /(whatsapp|telegram|signal|skype|call me|text me|contact me|personal number|private mail)/i.test(normalized);
  const hasSensitiveFinance = /(cvv|otp|password|passcode|api key|secret|token|account number|bank account|ifsc|swift|routing number|credit card|debit card)/i.test(normalized);
  const hasAggression = /(hate you|idiot|stupid|threat|kill|destroy|revenge|useless)/i.test(normalized);

  let moderationStatus = "approved";
  let moderationScore = 5;
  let containsSensitiveData = false;
  let reason: string | null = null;

  if (hasEmail || hasPhone || hasUrl || hasExternalContact) {
    violations.push("contact_share");
    moderationStatus = "blocked";
    moderationScore = 92;
    containsSensitiveData = true;
    reason = "Outside contact sharing is not allowed in internal chat.";
  }

  if (hasSensitiveFinance) {
    violations.push("data_leak");
    moderationStatus = "blocked";
    moderationScore = Math.max(moderationScore, 98);
    containsSensitiveData = true;
    reason = "Sensitive credentials or financial data are blocked.";
  }

  if (hasAggression && moderationStatus !== "blocked") {
    violations.push("abuse");
    moderationStatus = "flagged";
    moderationScore = 56;
    reason = "Message flagged for aggressive language.";
  }

  return {
    moderationStatus,
    moderationScore,
    containsSensitiveData,
    violations,
    reason,
  };
}

function buildAiReply(content: string, moderation: ReturnType<typeof detectModeration>) {
  if (moderation.moderationStatus === "blocked") {
    return "AI shield stopped this message because it contained restricted contact or sensitive data. Rephrase it using internal references only.";
  }

  if (/help|assist|support|issue|problem|stuck|urgent|error|fail/i.test(content)) {
    return "AI routing is active. Your message has been classified for support follow-up and logged for manager visibility.";
  }

  if (/deploy|release|migration|server|incident|security/i.test(content)) {
    return "AI monitor tagged this update as operational. Related managers and live monitors can now trace this thread.";
  }

  return null;
}

async function translateContent(content: string, targetLanguage: string | null) {
  const normalizedLanguage = String(targetLanguage || "").trim().toLowerCase();
  if (!normalizedLanguage || normalizedLanguage === "en") {
    return { translatedContent: null, translatedLanguage: null };
  }

  const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!lovableApiKey) {
    return { translatedContent: null, translatedLanguage: null };
  }

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "Translate operational chat text exactly into the requested language. Preserve masked IDs, codes, numbers, and policy wording. Return only the translated text with no commentary.",
          },
          {
            role: "user",
            content: `Target language: ${normalizedLanguage}\n\nText:\n${content}`,
          },
        ],
        temperature: 0.1,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      return { translatedContent: null, translatedLanguage: null };
    }

    const payload = await response.json();
    const translatedContent = payload.choices?.[0]?.message?.content?.trim?.() || null;
    return {
      translatedContent,
      translatedLanguage: translatedContent ? normalizedLanguage : null,
    };
  } catch {
    return { translatedContent: null, translatedLanguage: null };
  }
}

async function getMaskedIdentity(supabaseAdmin: any, userId: string, role: string) {
  const { data } = await supabaseAdmin
    .from("masked_identities")
    .select("masked_email")
    .eq("user_id", userId)
    .maybeSingle();

  return data?.masked_email || `${String(role || "user").toUpperCase()}-${userId.slice(0, 6)}`;
}

async function getUserRoles(supabaseAdmin: any, userId: string) {
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  return (data || []).map((row: any) => row.role);
}

async function getAccessibleChannels(ctx: RequestContext) {
  const userRoles = await getUserRoles(ctx.supabaseAdmin, ctx.user.userId);
  const { data: memberships } = await ctx.supabaseAdmin
    .from("internal_chat_channel_members")
    .select("channel_id")
    .eq("user_id", ctx.user.userId);
  const membershipIds = new Set((memberships || []).map((row: any) => row.channel_id));

  const { data: channels } = await ctx.supabaseAdmin
    .from("internal_chat_channels")
    .select("*")
    .eq("is_active", true)
    .order("updated_at", { ascending: false });

  const accessible = (channels || []).filter((channel: any) => {
    if (isManager(ctx.user.role)) return true;
    if (channel.created_by === ctx.user.userId) return true;
    if (membershipIds.has(channel.id)) return true;
    return Array.isArray(channel.target_roles) && channel.target_roles.some((role: string) => userRoles.includes(role));
  });

  const channelIds = accessible.map((channel: any) => channel.id);
  const { data: status } = await ctx.supabaseAdmin
    .from("chat_user_status")
    .select("last_seen")
    .eq("user_id", ctx.user.userId)
    .maybeSingle();

  const lastSeen = status?.last_seen ? new Date(status.last_seen).getTime() : 0;
  const { data: recentMessages } = channelIds.length > 0
    ? await ctx.supabaseAdmin
        .from("internal_chat_messages")
        .select("id,channel_id,content,created_at")
        .in("channel_id", channelIds)
        .order("created_at", { ascending: false })
        .limit(500)
    : { data: [] };

  const grouped = new Map<string, any[]>();
  for (const message of recentMessages || []) {
    const bucket = grouped.get(message.channel_id) || [];
    bucket.push(message);
    grouped.set(message.channel_id, bucket);
  }

  return accessible.map((channel: any) => {
    const messages = grouped.get(channel.id) || [];
    const latest = messages[0];
    const unreadCount = messages.filter((message: any) => new Date(message.created_at).getTime() > lastSeen).length;

    return {
      id: channel.id,
      name: channel.name,
      description: channel.description || null,
      channelType: channel.channel_type,
      riskLevel: channel.risk_level || "normal",
      isFrozen: Boolean(channel.is_frozen),
      autoTranslateEnabled: Boolean(channel.auto_translate_enabled),
      allowAiAutoReply: Boolean(channel.allow_ai_auto_reply),
      unreadCount,
      lastMessageAt: latest?.created_at || null,
      lastMessagePreview: latest?.content || null,
    };
  });
}

async function ensureInternalAccess(ctx: RequestContext, channelId: string) {
  const { data } = await ctx.supabaseAdmin.rpc("can_access_internal_channel", {
    _user_id: ctx.user.userId,
    _channel_id: channelId,
  });

  if (data !== true) {
    throw new Error("Access denied to this channel");
  }

  const { data: channel } = await ctx.supabaseAdmin
    .from("internal_chat_channels")
    .select("*")
    .eq("id", channelId)
    .maybeSingle();

  if (!channel) {
    throw new Error("Channel not found");
  }

  return channel;
}

async function logActivity(
  supabaseAdmin: any,
  payload: {
    channelId?: string | null;
    messageId?: string | null;
    userId?: string | null;
    activityType: string;
    activitySummary: string;
    metadata?: Record<string, unknown>;
  },
) {
  await supabaseAdmin.from("internal_chat_activity_log").insert({
    channel_id: payload.channelId || null,
    message_id: payload.messageId || null,
    user_id: payload.userId || null,
    activity_type: payload.activityType,
    activity_summary: payload.activitySummary,
    metadata: payload.metadata || {},
  });
}

async function upsertPresence(ctx: RequestContext, channelId?: string | null, isOnline = true) {
  await ctx.supabaseAdmin.from("chat_user_status").upsert(
    {
      user_id: ctx.user.userId,
      is_online: isOnline,
      last_seen: new Date().toISOString(),
      last_active_channel: channelId || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
}

async function createViolation(
  ctx: RequestContext,
  payload: {
    channelId: string;
    messageId?: string | null;
    type: string;
    level: number;
    description: string;
    detectedContent: string;
    actionTaken: string;
  },
) {
  await ctx.supabaseAdmin.from("chat_violations").insert({
    user_id: ctx.user.userId,
    channel_id: payload.channelId,
    message_id: payload.messageId || null,
    violation_type: payload.type,
    violation_level: payload.level,
    description: payload.description,
    detected_content: payload.detectedContent,
    action_taken: payload.actionTaken,
  });

  const { data: currentStatus } = await ctx.supabaseAdmin
    .from("chat_user_status")
    .select("violation_count")
    .eq("user_id", ctx.user.userId)
    .maybeSingle();

  const nextViolationCount = Number(currentStatus?.violation_count || 0) + 1;
  const muteUser = nextViolationCount >= 3 || payload.level >= 2;
  const mutedUntil = muteUser ? new Date(Date.now() + 30 * 60 * 1000).toISOString() : null;

  await ctx.supabaseAdmin.from("chat_user_status").upsert(
    {
      user_id: ctx.user.userId,
      is_online: true,
      is_muted: muteUser,
      muted_until: mutedUntil,
      mute_reason: muteUser ? payload.type : null,
      violation_count: nextViolationCount,
      last_seen: new Date().toISOString(),
      last_active_channel: payload.channelId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
}

async function createEscalation(
  ctx: RequestContext,
  payload: {
    channelId: string;
    messageId?: string | null;
    type: string;
    severity: string;
    reason: string;
    aiSummary: string;
    metadata?: Record<string, unknown>;
  },
) {
  await ctx.supabaseAdmin.from("internal_chat_escalations").insert({
    channel_id: payload.channelId,
    message_id: payload.messageId || null,
    user_id: ctx.user.userId,
    escalation_type: payload.type,
    severity: payload.severity,
    status: "open",
    reason: payload.reason,
    ai_summary: payload.aiSummary,
    metadata: payload.metadata || {},
  });
}

async function buildOverview(ctx: RequestContext) {
  const channels = await getAccessibleChannels(ctx);
  const [
    activeUsersResult,
    mutedUsersResult,
    flaggedMessagesResult,
    aiRepliesResult,
    escalationsResult,
    settingsResult,
  ] = await Promise.all([
    ctx.supabaseAdmin.from("chat_user_status").select("id", { count: "exact", head: true }).eq("is_online", true),
    ctx.supabaseAdmin.from("chat_user_status").select("id", { count: "exact", head: true }).eq("is_muted", true),
    ctx.supabaseAdmin.from("internal_chat_messages").select("id", { count: "exact", head: true }).eq("moderation_status", "flagged"),
    ctx.supabaseAdmin.from("internal_chat_messages").select("id", { count: "exact", head: true }).eq("message_type", "ai_auto_reply"),
    ctx.supabaseAdmin.from("internal_chat_escalations").select("id", { count: "exact", head: true }).eq("status", "open"),
    ctx.supabaseAdmin.from("internal_chat_control_settings").select("settings").eq("settings_key", "global").maybeSingle(),
  ]);

  return {
    currentUser: {
      userId: ctx.user.userId,
      role: ctx.user.role,
      maskedIdentity: await getMaskedIdentity(ctx.supabaseAdmin, ctx.user.userId, ctx.user.role),
      canManage: isManager(ctx.user.role),
    },
    stats: {
      channels: channels.length,
      activeUsers: activeUsersResult.count || 0,
      mutedUsers: mutedUsersResult.count || 0,
      openEscalations: escalationsResult.count || 0,
      flaggedMessages: flaggedMessagesResult.count || 0,
      aiReplies: aiRepliesResult.count || 0,
    },
    settings: settingsResult.data?.settings || {},
  };
}

async function buildChannelDetail(ctx: RequestContext, channelId: string) {
  const channel = await ensureInternalAccess(ctx, channelId);
  const { data: messages } = await ctx.supabaseAdmin
    .from("internal_chat_messages")
    .select("*")
    .eq("channel_id", channelId)
    .order("created_at", { ascending: true })
    .limit(200);

  const recentSenders = Array.from(new Set((messages || []).map((message: any) => message.sender_id).filter(Boolean)));
  const { data: statuses } = recentSenders.length > 0
    ? await ctx.supabaseAdmin
        .from("chat_user_status")
        .select("*")
        .in("user_id", recentSenders)
    : { data: [] };

  const statusMap = new Map((statuses || []).map((status: any) => [status.user_id, status]));
  const participants = recentSenders.map((userId: string) => {
    const status = statusMap.get(userId);
    const sampleMessage = (messages || []).find((message: any) => message.sender_id === userId);
    return {
      userId,
      role: sampleMessage?.sender_role || "user",
      maskedIdentity: sampleMessage?.sender_masked_name || `USER-${userId.slice(0, 6)}`,
      isOnline: Boolean(status?.is_online),
      isMuted: Boolean(status?.is_muted),
      mutedUntil: status?.muted_until || null,
      lastSeen: status?.last_seen || null,
    };
  });

  return {
    channel: {
      id: channel.id,
      name: channel.name,
      description: channel.description || null,
      channelType: channel.channel_type,
      riskLevel: channel.risk_level || "normal",
      isFrozen: Boolean(channel.is_frozen),
      autoTranslateEnabled: Boolean(channel.auto_translate_enabled),
      allowAiAutoReply: Boolean(channel.allow_ai_auto_reply),
      unreadCount: 0,
      lastMessageAt: messages?.[messages.length - 1]?.created_at || null,
      lastMessagePreview: messages?.[messages.length - 1]?.content || null,
    },
    messages: (messages || []).map((message: any) => ({
      id: message.id,
      channelId: message.channel_id,
      senderId: message.sender_id,
      senderRole: message.sender_role,
      senderMaskedName: message.sender_masked_name,
      content: message.content,
      translatedContent: message.translated_content || null,
      translatedLanguage: message.translated_language || null,
      messageType: message.message_type,
      moderationStatus: message.moderation_status || "approved",
      moderationScore: Number(message.moderation_score || 0),
      escalationStatus: message.escalation_status || "none",
      flagReason: message.flag_reason || null,
      createdAt: message.created_at,
    })),
    participants,
  };
}

async function handleInternalPermission(ctx: RequestContext) {
  return jsonResponse({
    canManage: isManager(ctx.user.role),
    maskedIdentity: await getMaskedIdentity(ctx.supabaseAdmin, ctx.user.userId, ctx.user.role),
    role: ctx.user.role,
  });
}

async function handleInternalChannels(ctx: RequestContext) {
  const channels = await getAccessibleChannels(ctx);
  return jsonResponse({ channels });
}

async function handleInternalChannel(ctx: RequestContext, body: Record<string, unknown>, meta: ReturnType<typeof getRequestMeta>) {
  const channelId = String(body.channel_id || meta.url.searchParams.get("channel_id") || "").trim();
  if (!channelId) return errorResponse("channel_id required");
  return jsonResponse(await buildChannelDetail(ctx, channelId));
}

async function handleInternalPresence(ctx: RequestContext, body: Record<string, unknown>) {
  await upsertPresence(ctx, String(body.channel_id || "") || null, body.is_online !== false);
  await logActivity(ctx.supabaseAdmin, {
    channelId: body.channel_id ? String(body.channel_id) : null,
    userId: ctx.user.userId,
    activityType: "presence",
    activitySummary: "User heartbeat updated",
    metadata: { is_online: body.is_online !== false },
  });
  return jsonResponse({ ok: true });
}

async function handleInternalSend(ctx: RequestContext, body: Record<string, unknown>) {
  const validation = validateRequired(body, ["channel_id", "content"]);
  if (validation) return errorResponse(validation);

  const channelId = String(body.channel_id);
  const content = sanitizeMessage(body.content);
  if (!content) return errorResponse("Message cannot be empty");

  const channel = await ensureInternalAccess(ctx, channelId);
  const { data: userStatus } = await ctx.supabaseAdmin
    .from("chat_user_status")
    .select("is_muted, muted_until")
    .eq("user_id", ctx.user.userId)
    .maybeSingle();

  if (userStatus?.is_muted && userStatus?.muted_until && new Date(userStatus.muted_until).getTime() > Date.now()) {
    return errorResponse("You are temporarily muted in internal chat.", 403);
  }

  if (channel.is_frozen && !isManager(ctx.user.role)) {
    return errorResponse("This channel is frozen by command control.", 403);
  }

  const moderation = detectModeration(content);
  await upsertPresence(ctx, channelId, true);

  if (moderation.moderationStatus === "blocked") {
    await createViolation(ctx, {
      channelId,
      type: moderation.violations[0] || "data_leak",
      level: 3,
      description: moderation.reason || "Blocked by internal chat shield",
      detectedContent: content,
      actionTaken: "blocked",
    });
    await createEscalation(ctx, {
      channelId,
      type: moderation.violations[0] || "data_leak",
      severity: "critical",
      reason: moderation.reason || "Blocked sensitive content",
      aiSummary: buildAiReply(content, moderation) || "Sensitive content blocked and escalated for boss monitor review.",
      metadata: { content_preview: content.slice(0, 120) },
    });
    await logActivity(ctx.supabaseAdmin, {
      channelId,
      userId: ctx.user.userId,
      activityType: "message_blocked",
      activitySummary: moderation.reason || "Message blocked by internal chat policy",
      metadata: { violations: moderation.violations },
    });
    return jsonResponse({ blocked: true, reason: moderation.reason || "Message blocked by internal chat policy." }, 200);
  }

  const maskedIdentity = await getMaskedIdentity(ctx.supabaseAdmin, ctx.user.userId, ctx.user.role);
  const translation = await translateContent(content, body.target_language ? String(body.target_language) : null);
  const { data: inserted, error } = await ctx.supabaseAdmin
    .from("internal_chat_messages")
    .insert({
      channel_id: channelId,
      sender_id: ctx.user.userId,
      sender_role: ctx.user.role,
      sender_masked_name: maskedIdentity,
      message_type: String(body.message_type || "text"),
      content,
      original_content: content,
      voice_transcript: body.voice_transcript ? String(body.voice_transcript) : null,
      is_masked: false,
      is_flagged: moderation.moderationStatus === "flagged",
      flag_reason: moderation.reason,
      moderation_status: moderation.moderationStatus,
      moderation_score: moderation.moderationScore,
      contains_sensitive_data: moderation.containsSensitiveData,
      translated_content: translation.translatedContent,
      translated_language: translation.translatedLanguage,
      ai_summary: buildAiReply(content, moderation),
      escalation_status: moderation.moderationStatus === "flagged" ? "monitoring" : "none",
      metadata: {
        target_language: body.target_language || null,
        voice_mode: body.message_type === "voice_note",
      },
      delivery_status: "delivered",
    })
    .select("*")
    .single();

  if (error || !inserted) return errorResponse(error?.message || "Failed to send secure message", 400);

  if (moderation.moderationStatus === "flagged") {
    await createViolation(ctx, {
      channelId,
      messageId: inserted.id,
      type: moderation.violations[0] || "abuse",
      level: 1,
      description: moderation.reason || "Message flagged for monitoring",
      detectedContent: content,
      actionTaken: "logged",
    });
  }

  let aiReplyData: any = null;
  if (channel.allow_ai_auto_reply) {
    const aiReply = buildAiReply(content, moderation);
    if (aiReply) {
      const { data: insertedAiReply } = await ctx.supabaseAdmin
        .from("internal_chat_messages")
        .insert({
          channel_id: channelId,
          sender_id: ctx.user.userId,
          sender_role: "admin",
          sender_masked_name: "AI-GUARD",
          message_type: "ai_auto_reply",
          content: aiReply,
          original_content: aiReply,
          moderation_status: "approved",
          moderation_score: 0,
          contains_sensitive_data: false,
          translated_content: null,
          translated_language: null,
          ai_summary: "Automated guard response",
          escalation_status: "none",
          metadata: { automated: true },
          delivery_status: "delivered",
        })
        .select("*")
        .single();

      aiReplyData = insertedAiReply || null;
    }
  }

  await logActivity(ctx.supabaseAdmin, {
    channelId,
    messageId: inserted.id,
    userId: ctx.user.userId,
    activityType: "message_sent",
    activitySummary: inserted.message_type === "voice_note" ? "Voice note transcript sent" : "Secure chat message sent",
    metadata: { moderation_status: moderation.moderationStatus },
  });

  return jsonResponse({
    blocked: false,
    message: {
      id: inserted.id,
      channelId: inserted.channel_id,
      senderId: inserted.sender_id,
      senderRole: inserted.sender_role,
      senderMaskedName: inserted.sender_masked_name,
      content: inserted.content,
      translatedContent: inserted.translated_content,
      translatedLanguage: inserted.translated_language,
      messageType: inserted.message_type,
      moderationStatus: inserted.moderation_status,
      moderationScore: Number(inserted.moderation_score || 0),
      escalationStatus: inserted.escalation_status,
      flagReason: inserted.flag_reason,
      createdAt: inserted.created_at,
    },
    aiReply: aiReplyData
      ? {
          id: aiReplyData.id,
          channelId: aiReplyData.channel_id,
          senderId: aiReplyData.sender_id,
          senderRole: aiReplyData.sender_role,
          senderMaskedName: aiReplyData.sender_masked_name,
          content: aiReplyData.content,
          translatedContent: aiReplyData.translated_content,
          translatedLanguage: aiReplyData.translated_language,
          messageType: aiReplyData.message_type,
          moderationStatus: aiReplyData.moderation_status,
          moderationScore: Number(aiReplyData.moderation_score || 0),
          escalationStatus: aiReplyData.escalation_status,
          flagReason: aiReplyData.flag_reason,
          createdAt: aiReplyData.created_at,
        }
      : null,
  }, 201);
}

async function handleInternalViolations(ctx: RequestContext) {
  if (!isManager(ctx.user.role)) return errorResponse("Forbidden", 403);
  const { data } = await ctx.supabaseAdmin
    .from("chat_violations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(25);

  return jsonResponse({
    violations: (data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      channelId: row.channel_id,
      messageId: row.message_id,
      violationType: row.violation_type,
      violationLevel: row.violation_level,
      description: row.description,
      actionTaken: row.action_taken,
      createdAt: row.created_at,
    })),
  });
}

async function handleInternalEscalations(ctx: RequestContext) {
  if (!isManager(ctx.user.role)) return errorResponse("Forbidden", 403);
  const { data } = await ctx.supabaseAdmin
    .from("internal_chat_escalations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(25);

  return jsonResponse({
    escalations: (data || []).map((row: any) => ({
      id: row.id,
      channelId: row.channel_id,
      messageId: row.message_id,
      userId: row.user_id,
      escalationType: row.escalation_type,
      severity: row.severity,
      status: row.status,
      reason: row.reason,
      aiSummary: row.ai_summary,
      createdAt: row.created_at,
    })),
  });
}

async function handleInternalFreeze(ctx: RequestContext, body: Record<string, unknown>) {
  if (!isManager(ctx.user.role)) return errorResponse("Forbidden", 403);
  const validation = validateRequired(body, ["channel_id"]);
  if (validation) return errorResponse(validation);

  await ctx.supabaseAdmin
    .from("internal_chat_channels")
    .update({
      is_frozen: body.freeze === true,
      frozen_by: body.freeze === true ? ctx.user.userId : null,
      frozen_at: body.freeze === true ? new Date().toISOString() : null,
    })
    .eq("id", String(body.channel_id));

  await logActivity(ctx.supabaseAdmin, {
    channelId: String(body.channel_id),
    userId: ctx.user.userId,
    activityType: body.freeze === true ? "channel_frozen" : "channel_unfrozen",
    activitySummary: body.freeze === true ? "Channel frozen by manager" : "Channel reopened by manager",
  });

  return jsonResponse({ ok: true });
}

async function handleInternalMute(ctx: RequestContext, body: Record<string, unknown>) {
  if (!isManager(ctx.user.role)) return errorResponse("Forbidden", 403);
  const validation = validateRequired(body, ["user_id"]);
  if (validation) return errorResponse(validation);

  const mutedMinutes = Math.max(5, Number(body.muted_minutes || 30));
  const mutedUntil = new Date(Date.now() + mutedMinutes * 60 * 1000).toISOString();

  await ctx.supabaseAdmin.from("chat_user_status").upsert(
    {
      user_id: String(body.user_id),
      is_muted: true,
      muted_until: mutedUntil,
      mute_reason: "manager_action",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  await logActivity(ctx.supabaseAdmin, {
    userId: ctx.user.userId,
    activityType: "user_muted",
    activitySummary: `User muted for ${mutedMinutes} minutes`,
    metadata: { target_user_id: body.user_id },
  });

  return jsonResponse({ ok: true });
}

async function handleInternalResolveEscalation(ctx: RequestContext, body: Record<string, unknown>) {
  if (!isManager(ctx.user.role)) return errorResponse("Forbidden", 403);
  const validation = validateRequired(body, ["escalation_id"]);
  if (validation) return errorResponse(validation);

  await ctx.supabaseAdmin
    .from("internal_chat_escalations")
    .update({
      status: "resolved",
      resolved_at: new Date().toISOString(),
      resolved_by: ctx.user.userId,
    })
    .eq("id", String(body.escalation_id));

  await logActivity(ctx.supabaseAdmin, {
    userId: ctx.user.userId,
    activityType: "escalation_resolved",
    activitySummary: "Manager resolved internal chat escalation",
    metadata: { escalation_id: body.escalation_id },
  });

  return jsonResponse({ ok: true });
}

async function handleLegacySend(ctx: RequestContext, body: Record<string, unknown>) {
  const validation = validateRequired(body, ["thread_id", "message_text"]);
  if (validation) return errorResponse(validation);

  const { data: thread } = await ctx.supabaseAdmin
    .from("chat_threads")
    .select("*")
    .eq("thread_id", body.thread_id)
    .single();

  if (!thread) return errorResponse("Thread not found", 404);

  const maskedSender = `${ctx.user.role.toUpperCase()}-${ctx.user.userId.slice(0, 4)}`;
  const sanitizedMessage = sanitizeMessage(body.message_text);
  if (!sanitizedMessage) return errorResponse("Message cannot be empty");

  const { data, error } = await ctx.supabaseAdmin.from("chat_messages").insert({
    thread_id: body.thread_id,
    sender_id: ctx.user.userId,
    masked_sender: maskedSender,
    message_text: sanitizedMessage,
    language: body.language || "en",
    cannot_edit: true,
    cannot_delete: true,
  }).select().single();

  if (error) return errorResponse(error.message, 400);

  return jsonResponse({
    message_id: data.message_id,
    masked_sender: maskedSender,
    sent_at: data.timestamp,
  }, 201);
}

async function handleLegacyThread(ctx: RequestContext, body: Record<string, unknown>, meta: ReturnType<typeof getRequestMeta>) {
  const threadId = String(body.thread_id || meta.url.searchParams.get("thread_id") || "");
  if (!threadId) return errorResponse("thread_id required");

  const { data: thread } = await ctx.supabaseAdmin
    .from("chat_threads")
    .select("*")
    .eq("thread_id", threadId)
    .single();

  if (!thread) return errorResponse("Thread not found", 404);
  if (thread.created_by !== ctx.user.userId && !["boss_owner", "admin", "super_admin"].includes(ctx.user.role)) {
    if (thread.related_role && thread.related_role !== ctx.user.role) {
      return errorResponse("Access denied to this thread", 403);
    }
  }

  const { data: messages } = await ctx.supabaseAdmin
    .from("chat_messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("timestamp", { ascending: true });

  return jsonResponse({
    thread: {
      id: thread.thread_id,
      created_at: thread.created_at,
      related_lead: thread.related_lead,
      related_task: thread.related_task,
      is_active: thread.is_active,
    },
    messages: (messages || []).map((message: any) => ({
      id: message.message_id,
      sender: message.masked_sender,
      text: message.message_text,
      language: message.language,
      translated: message.translated_text,
      timestamp: message.timestamp,
      can_edit: false,
      can_delete: false,
    })),
  });
}

async function handleLegacyCreateThread(ctx: RequestContext, body: Record<string, unknown>) {
  const { data, error } = await ctx.supabaseAdmin.from("chat_threads").insert({
    created_by: ctx.user.userId,
    related_lead: body.lead_id,
    related_task: body.task_id,
    related_role: body.role || ctx.user.role,
    is_active: true,
  }).select().single();

  if (error) return errorResponse(error.message, 400);
  return jsonResponse({ thread_id: data.thread_id, created_at: data.created_at }, 201);
}

async function handleLegacyThreads(ctx: RequestContext) {
  let query = ctx.supabaseAdmin
    .from("chat_threads")
    .select(`*, chat_messages (message_id, timestamp)`);

  if (!["super_admin", "admin", "boss_owner"].includes(ctx.user.role)) {
    query = query.or(`created_by.eq.${ctx.user.userId},related_role.eq.${ctx.user.role}`);
  }

  const { data, error } = await query.eq("is_active", true).order("created_at", { ascending: false });
  if (error) return errorResponse(error.message, 400);

  return jsonResponse({
    threads: (data || []).map((thread: any) => ({
      id: thread.thread_id,
      related_lead: thread.related_lead,
      related_task: thread.related_task,
      message_count: thread.chat_messages?.length || 0,
      last_message: thread.chat_messages?.[thread.chat_messages.length - 1]?.timestamp,
      created_at: thread.created_at,
    })),
  });
}

serve(async (req: Request) => {
  const rawBody = req.method === "POST" ? await req.clone().json().catch(() => ({})) : {};
  const meta = getRequestMeta(req, rawBody as Record<string, unknown>);

  return withAuth(req, [], async (ctx) => {
    const body = getPayload((ctx.body || {}) as Record<string, unknown>);

    try {
      if (matches(meta.path, "/internal/permission") && meta.method === "GET") {
        return await handleInternalPermission(ctx);
      }

      if (matches(meta.path, "/internal/overview") && meta.method === "GET") {
        return jsonResponse(await buildOverview(ctx));
      }

      if (matches(meta.path, "/internal/channels") && meta.method === "GET") {
        return await handleInternalChannels(ctx);
      }

      if (matches(meta.path, "/internal/channel") && meta.method === "GET") {
        return await handleInternalChannel(ctx, body, meta);
      }

      if (matches(meta.path, "/internal/presence") && meta.method === "POST") {
        return await handleInternalPresence(ctx, body);
      }

      if (matches(meta.path, "/internal/message/send") && meta.method === "POST") {
        return await handleInternalSend(ctx, body);
      }

      if (matches(meta.path, "/internal/violations") && meta.method === "GET") {
        return await handleInternalViolations(ctx);
      }

      if (matches(meta.path, "/internal/escalations") && meta.method === "GET") {
        return await handleInternalEscalations(ctx);
      }

      if (matches(meta.path, "/internal/channel/freeze") && meta.method === "POST") {
        return await handleInternalFreeze(ctx, body);
      }

      if (matches(meta.path, "/internal/user/mute") && meta.method === "POST") {
        return await handleInternalMute(ctx, body);
      }

      if (matches(meta.path, "/internal/escalations/resolve") && meta.method === "POST") {
        return await handleInternalResolveEscalation(ctx, body);
      }

      if ((matches(meta.path, "/send") && meta.method === "POST") || body.action === "send") {
        return await handleLegacySend(ctx, body);
      }

      if ((matches(meta.path, "/thread") && meta.method === "GET") || body.action === "get_thread") {
        return await handleLegacyThread(ctx, body, meta);
      }

      if ((matches(meta.path, "/thread/create") && meta.method === "POST") || body.action === "create_thread") {
        return await handleLegacyCreateThread(ctx, body);
      }

      if ((matches(meta.path, "/threads") && meta.method === "GET") || body.action === "list_threads") {
        return await handleLegacyThreads(ctx);
      }
    } catch (error) {
      return errorResponse(error instanceof Error ? error.message : "Internal chat request failed", 400);
    }

    return errorResponse("Not found", 404);
  }, { module: "chat", action: `${meta.method}:${meta.path}` });
});
