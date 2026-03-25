import { callEdgeRoute } from '@/lib/api/edge-client';

type HttpMethod = 'GET' | 'POST';

type ApiEnvelope<T> = {
  success: boolean;
  status: number;
  data: T;
  error?: string;
};

export type InternalChatOverview = {
  currentUser: {
    userId: string;
    role: string;
    maskedIdentity: string;
    canManage: boolean;
  };
  stats: {
    channels: number;
    activeUsers: number;
    mutedUsers: number;
    openEscalations: number;
    flaggedMessages: number;
    aiReplies: number;
  };
  settings: Record<string, unknown>;
};

export type InternalChatChannel = {
  id: string;
  name: string;
  description: string | null;
  channelType: string;
  riskLevel: string;
  isFrozen: boolean;
  autoTranslateEnabled: boolean;
  allowAiAutoReply: boolean;
  unreadCount: number;
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
};

export type InternalChatMessage = {
  id: string;
  channelId: string;
  senderId: string;
  senderRole: string;
  senderMaskedName: string;
  content: string;
  translatedContent: string | null;
  translatedLanguage: string | null;
  messageType: string;
  moderationStatus: string;
  moderationScore: number;
  escalationStatus: string;
  flagReason: string | null;
  createdAt: string;
};

export type InternalChatParticipant = {
  userId: string;
  role: string;
  maskedIdentity: string;
  isOnline: boolean;
  isMuted: boolean;
  mutedUntil: string | null;
  lastSeen: string | null;
};

export type InternalChatChannelDetail = {
  channel: InternalChatChannel;
  messages: InternalChatMessage[];
  participants: InternalChatParticipant[];
};

export type ChatViolation = {
  id: string;
  userId: string | null;
  channelId: string | null;
  messageId: string | null;
  violationType: string;
  violationLevel: number;
  description: string | null;
  actionTaken: string | null;
  createdAt: string;
};

export type ChatEscalation = {
  id: string;
  channelId: string | null;
  messageId: string | null;
  userId: string | null;
  escalationType: string;
  severity: string;
  status: string;
  reason: string | null;
  aiSummary: string | null;
  createdAt: string;
};

async function request<T>(path: string, method: HttpMethod, payload?: Record<string, unknown>) {
  const envelope = await callEdgeRoute<T>('api-chat', path.replace(/^\/+/, ''), {
    method,
    body: method === 'GET' ? undefined : payload,
    query: method === 'GET' ? (payload as Record<string, string | number | boolean | undefined | null> | undefined) : undefined,
    module: 'chat',
  });

  const normalized = {
    success: envelope.success,
    status: envelope.status,
    data: envelope.data,
  } as ApiEnvelope<T>;
  if (!normalized?.success) {
    throw new Error(normalized?.error || 'Internal chat request failed');
  }

  return normalized.data;
}

export const internalChatApi = {
  getOverview: () => request<InternalChatOverview>('/internal/overview', 'GET'),
  getPermission: () => request<{ canManage: boolean; maskedIdentity: string; role: string }>('/internal/permission', 'GET'),
  getChannels: () => request<{ channels: InternalChatChannel[] }>('/internal/channels', 'GET'),
  getChannel: (channelId: string) => request<InternalChatChannelDetail>('/internal/channel', 'GET', { channel_id: channelId }),
  sendMessage: (payload: { channelId: string; content: string; messageType?: string; voiceTranscript?: string | null; targetLanguage?: string | null }) =>
    request<{
      blocked?: boolean;
      reason?: string;
      message?: InternalChatMessage;
      aiReply?: InternalChatMessage | null;
    }>('/internal/message/send', 'POST', {
      channel_id: payload.channelId,
      content: payload.content,
      message_type: payload.messageType || 'text',
      voice_transcript: payload.voiceTranscript || null,
      target_language: payload.targetLanguage || null,
    }),
  updatePresence: (channelId?: string, isOnline = true) =>
    request<{ ok: boolean }>('/internal/presence', 'POST', { channel_id: channelId || null, is_online: isOnline }),
  getViolations: () => request<{ violations: ChatViolation[] }>('/internal/violations', 'GET'),
  getEscalations: () => request<{ escalations: ChatEscalation[] }>('/internal/escalations', 'GET'),
  freezeChannel: (channelId: string, freeze: boolean) =>
    request<{ ok: boolean }>('/internal/channel/freeze', 'POST', { channel_id: channelId, freeze }),
  muteUser: (userId: string, mutedMinutes: number) =>
    request<{ ok: boolean }>('/internal/user/mute', 'POST', { user_id: userId, muted_minutes: mutedMinutes }),
  resolveEscalation: (escalationId: string) =>
    request<{ ok: boolean }>('/internal/escalations/resolve', 'POST', { escalation_id: escalationId }),
};