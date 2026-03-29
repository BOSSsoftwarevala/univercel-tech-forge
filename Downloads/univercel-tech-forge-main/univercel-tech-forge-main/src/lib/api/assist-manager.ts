import { callEdgeRoute } from '@/lib/api/edge-client';

export interface AssistManagerSession {
  id: string;
  session_id: string;
  relay_session_id: string | null;
  agent_id: string;
  target_user_id: string;
  assist_type: 'support' | 'dev' | 'sales';
  target_role: string;
  purpose: string;
  permission_scope: string[];
  status: 'pending' | 'approved' | 'denied' | 'active' | 'paused' | 'ended' | 'expired' | 'blocked';
  approval_required: boolean;
  approval_user_id: string | null;
  approval_reason: string | null;
  approval_granted_at: string | null;
  denial_reason: string | null;
  requester_ip: string | null;
  requester_device: string | null;
  target_ip: string | null;
  target_device: string | null;
  ai_risk_score: number;
  emergency_stopped: boolean;
  started_at: string | null;
  paused_at: string | null;
  ended_at: string | null;
  max_duration_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface AssistManagerApproval {
  id: string;
  session_id: string;
  target_user_id: string;
  requester_user_id: string;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  response_reason: string | null;
  ip: string | null;
  device: string | null;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
  assist_manager_sessions?: AssistManagerSession;
}

export interface AssistManagerFileLog {
  id: string;
  session_id: string;
  sender_user_id: string;
  receiver_user_id: string;
  file_name: string;
  file_size: number;
  mime_type: string | null;
  checksum_sha256: string;
  encrypted: boolean;
  transfer_status: 'queued' | 'transferring' | 'completed' | 'blocked' | 'failed';
  chunk_count: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AssistManagerChatLog {
  id: string;
  session_id: string;
  sender_user_id: string;
  message: string;
  message_type: 'chat' | 'system' | 'voice_status';
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface AssistManagerAuditLog {
  id: string;
  session_id: string | null;
  action: string;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  user_id: string | null;
  role: string | null;
  ip: string | null;
  device: string | null;
  timestamp: string;
}

export interface AssistManagerAILog {
  id: string;
  session_id: string;
  event_type: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  analysis: Record<string, unknown>;
  suggestion: string | null;
  auto_executed: boolean;
  created_at: string;
}

export interface AssistManagerSettings {
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
}

export interface AssistDashboardResponse {
  metrics: {
    activeSessions: number;
    pendingRequests: number;
    approvedSessions: number;
    blockedSessions: number;
    aiAssisted: number;
    securityAlerts: number;
    totalSessions: number;
    approvalsToday: number;
    deniedToday: number;
  };
  recentSessions: AssistManagerSession[];
  recentAudit: AssistManagerAuditLog[];
}

export interface CreateAssistSessionInput {
  assist_type: 'support' | 'dev' | 'sales';
  target_role: string;
  target_user_id: string;
  purpose: string;
  permission_scope: string[];
  max_duration_minutes?: number;
}

export async function getAssistManagerDashboard() {
  const response = await callEdgeRoute<AssistDashboardResponse>('api-assist-manager', 'dashboard');
  return response.data;
}

export async function listAssistManagerSessions(query?: { status?: string; scope?: string; limit?: number }) {
  const response = await callEdgeRoute<{ sessions: AssistManagerSession[] }>('api-assist-manager', 'assist/list', { query });
  return response.data.sessions;
}

export async function createAssistManagerSession(input: CreateAssistSessionInput) {
  const response = await callEdgeRoute<{
    session: AssistManagerSession;
    approval_token_hint: string;
    signaling: {
      relay_session_id: string | null;
      websocket_function: string;
      permission_token: string;
    };
  }>('api-assist-manager', 'assist/session/create', { method: 'POST', body: input });
  return response.data;
}

export async function approveAssistManagerSession(input: { session_id: string; decision: 'approved' | 'denied'; reason?: string }) {
  const response = await callEdgeRoute<{ approved: boolean }>('api-assist-manager', 'assist/approve', { method: 'POST', body: input });
  return response.data;
}

export async function startAssistManagerSession(input: { session_id: string; permission_token: string }) {
  const response = await callEdgeRoute<{
    session_id: string;
    relay_session_id: string | null;
    websocket_url: string;
    signaling_protocol: string;
    permissions: string[];
  }>('api-assist-manager', 'assist/start', { method: 'POST', body: input });
  return response.data;
}

export async function pauseAssistManagerSession(input: { session_id: string; reason?: string }) {
  const response = await callEdgeRoute<{ paused: boolean }>('api-assist-manager', 'assist/pause', { method: 'POST', body: input });
  return response.data;
}

export async function endAssistManagerSession(input: { session_id: string; reason?: string }) {
  const response = await callEdgeRoute<{ ended: boolean; emergency: boolean }>('api-assist-manager', 'assist/end', { method: 'POST', body: input });
  return response.data;
}

export async function emergencyStopAssistManagerSession(input: { session_id: string; reason?: string }) {
  const response = await callEdgeRoute<{ ended: boolean; emergency: boolean }>('api-assist-manager', 'assist/emergency-stop', { method: 'POST', body: input });
  return response.data;
}

export async function sendAssistManagerControlEvent(input: { session_id: string; event_type: string; scope: string; payload?: Record<string, unknown> }) {
  const response = await callEdgeRoute<{ accepted: boolean }>('api-assist-manager', 'assist/control', { method: 'POST', body: input });
  return response.data;
}

export async function sendAssistManagerFile(input: { session_id: string; receiver_user_id?: string; file_name: string; file_size: number; mime_type?: string; checksum_sha256: string; chunk_count?: number; metadata?: Record<string, unknown> }) {
  const response = await callEdgeRoute<{ file: AssistManagerFileLog }>('api-assist-manager', 'assist/file/send', { method: 'POST', body: input });
  return response.data.file;
}

export async function sendAssistManagerChat(input: { session_id: string; message: string; message_type?: 'chat' | 'system' | 'voice_status'; metadata?: Record<string, unknown> }) {
  const response = await callEdgeRoute<{ chat: AssistManagerChatLog }>('api-assist-manager', 'assist/chat/send', { method: 'POST', body: input });
  return response.data.chat;
}

export async function getAssistManagerSessionDetail(sessionId: string) {
  const response = await callEdgeRoute<{
    session: AssistManagerSession;
    approvals: AssistManagerApproval[];
    controlEvents: Array<Record<string, unknown>>;
    fileLogs: AssistManagerFileLog[];
    chatLogs: AssistManagerChatLog[];
    auditLogs: AssistManagerAuditLog[];
    aiLogs: AssistManagerAILog[];
  }>('api-assist-manager', `assist/session/${sessionId}`);
  return response.data;
}

export async function getAssistManagerPendingApprovals() {
  const response = await callEdgeRoute<{ approvals: AssistManagerApproval[] }>('api-assist-manager', 'pending-approvals');
  return response.data.approvals;
}

export async function getAssistManagerSettings() {
  const response = await callEdgeRoute<{ settings: AssistManagerSettings }>('api-assist-manager', 'settings');
  return response.data.settings;
}

export async function updateAssistManagerSettings(settings: Partial<AssistManagerSettings>) {
  const response = await callEdgeRoute<{ settings: AssistManagerSettings }>('api-assist-manager', 'settings', { method: 'PUT', body: { settings } });
  return response.data.settings;
}

export async function getAssistManagerAiLogs(sessionId?: string) {
  const response = await callEdgeRoute<{ logs: AssistManagerAILog[] }>('api-assist-manager', 'ai/logs', { query: sessionId ? { session_id: sessionId } : undefined });
  return response.data.logs;
}