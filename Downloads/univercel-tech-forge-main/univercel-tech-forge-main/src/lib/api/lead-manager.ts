import { callEdgeRoute } from '@/lib/api/edge-client';

async function getRoute<T>(path: string, query?: Record<string, string | number | boolean | undefined | null>) {
  const response = await callEdgeRoute<T>('api-leads', path, { query });
  return response.data;
}

async function mutateRoute<T>(path: string, body: Record<string, unknown>, method: 'POST' | 'PUT' | 'DELETE' = 'POST') {
  const response = await callEdgeRoute<T>('api-leads', path, { method, body });
  return response.data;
}

export interface LeadManagerLead {
  id: string;
  lead_id: string;
  name: string;
  phone: string;
  email: string;
  company?: string | null;
  source: string;
  status: string;
  stage: string;
  assigned_to?: string | null;
  assigned_to_name: string;
  assigned_to_role?: string | null;
  score: number;
  priority: string;
  created_at: string;
  updated_at?: string;
  country?: string | null;
  city?: string | null;
  region?: string | null;
  conversion_probability?: number;
  response_prediction?: number;
  best_call_time?: string | null;
  next_follow_up?: string | null;
  channel_name?: string | null;
  lead?: Record<string, unknown>;
}

export interface LeadManagerAlert {
  id: string;
  lead_id: string;
  alert_type: string;
  message: string;
  severity: string;
  is_active: boolean;
  requires_action: boolean;
  created_at: string;
}

export interface LeadManagerSourceSummary {
  source: string;
  leads: number;
  conversion_rate: number;
  campaign_id?: string | null;
  utm_source?: string | null;
  is_active?: boolean;
}

export interface LeadManagerTeamMember {
  user_id: string;
  role: string;
  name: string;
  email?: string | null;
  country?: string | null;
  is_active: boolean;
  workload: number;
}

export interface LeadManagerSuggestion {
  id: string;
  lead_id?: string | null;
  suggestion_type: string;
  title: string;
  summary: string;
  status: string;
  payload?: Record<string, unknown>;
  created_at: string;
}

export interface LeadManagerSettings {
  id: string;
  workspace_key: string;
  export_locked: boolean;
  auto_assign_enabled: boolean;
  auto_routing_enabled: boolean;
  ai_scoring_enabled: boolean;
  auto_followup_enabled: boolean;
  require_ai_approval: boolean;
  delay_alert_minutes: number;
  reminder_window_minutes: number;
  settings?: Record<string, unknown>;
}

export interface LeadManagerDashboardData {
  summary: {
    totalLeads: number;
    activeLeads: number;
    newLeadsToday: number;
    convertedLeads: number;
    lostLeads: number;
    hotLeads: number;
    coldLeads: number;
    conversionRate: number;
  };
  sourcePerformance: LeadManagerSourceSummary[];
  teamPerformance: Array<Record<string, unknown>>;
  recentLeads: LeadManagerLead[];
  pipeline: Array<{ stage: string; label: string; count: number; leads: LeadManagerLead[] }>;
  alerts: LeadManagerAlert[];
  aiStatus: {
    aiScoringActive: boolean;
    autoRoutingEnabled: boolean;
    autoFollowupEnabled: boolean;
    requireApproval: boolean;
  };
  suggestions: LeadManagerSuggestion[];
  settings: LeadManagerSettings | null;
}

export interface LeadManagerLeadDetail {
  lead: LeadManagerLead;
  history: {
    communications: Array<Record<string, unknown>>;
    followups: Array<Record<string, unknown>>;
    logs: Array<Record<string, unknown>>;
  };
}

export const leadManagerApi = {
  async getDashboard() {
    return getRoute<LeadManagerDashboardData>('dashboard');
  },

  async getAllLeads() {
    return getRoute<{ leads: LeadManagerLead[]; total: number }>('leads/all');
  },

  async getNewLeads() {
    return getRoute<{ leads: LeadManagerLead[]; total: number }>('leads/new');
  },

  async getConvertedLeads() {
    return getRoute<{ leads: LeadManagerLead[]; total: number }>('leads/converted');
  },

  async getLostLeads() {
    return getRoute<{ leads: LeadManagerLead[]; total: number }>('leads/lost');
  },

  async getConversionRate() {
    return getRoute<{ conversion_rate: number; total: number; converted: number }>('leads/conversion-rate');
  },

  async searchLeads(query: Record<string, string | number | boolean | undefined | null>) {
    return getRoute<{ leads: LeadManagerLead[]; total: number }>('leads/search', query);
  },

  async getStageLeads(stage: string) {
    return getRoute<{ leads: LeadManagerLead[]; total: number }>('leads', { stage });
  },

  async getLead(leadId: string) {
    return getRoute<LeadManagerLeadDetail>(`leads/${encodeURIComponent(leadId)}`);
  },

  async updateLead(body: Record<string, unknown>) {
    return mutateRoute<{ lead: LeadManagerLead }>('leads/update', body, 'PUT');
  },

  async deleteLead(body: Record<string, unknown>) {
    return mutateRoute<{ deleted: boolean; lead_id: string }>('leads/delete', body, 'DELETE');
  },

  async captureLead(body: Record<string, unknown>) {
    return mutateRoute<{ lead: LeadManagerLead; routing?: Record<string, unknown>; scoring?: Record<string, unknown>; flow: string[] }>('leads/capture', body);
  },

  async assignLead(body: Record<string, unknown>) {
    return mutateRoute<{ lead: LeadManagerLead }>('leads/assign', body);
  },

  async reassignLead(body: Record<string, unknown>) {
    return mutateRoute<{ lead: LeadManagerLead }>('leads/reassign', body);
  },

  async autoAssignLead(body: Record<string, unknown>) {
    return mutateRoute<{ lead: LeadManagerLead; assignee: LeadManagerTeamMember }>('leads/auto-assign', body);
  },

  async updateLeadStatus(body: Record<string, unknown>) {
    return mutateRoute<{ lead: LeadManagerLead }>('leads/status', body);
  },

  async moveLeadStage(body: Record<string, unknown>) {
    return mutateRoute<{ lead: LeadManagerLead }>('leads/move-stage', body);
  },

  async qualifyLead(body: Record<string, unknown>) {
    return mutateRoute<{ lead: LeadManagerLead }>('leads/qualify', body);
  },

  async scoreLead(body: Record<string, unknown>) {
    return mutateRoute<{ score: number; label: string; probability: number; best_call_time: string; response_prediction: number }>('ai/lead-score', body);
  },

  async scheduleFollowup(body: Record<string, unknown>) {
    return mutateRoute<{ followup: Record<string, unknown> }>('leads/followup', body);
  },

  async createReminder(body: Record<string, unknown>) {
    return mutateRoute<{ reminder: Record<string, unknown> }>('leads/reminder', body);
  },

  async getLeadHistory(leadId: string) {
    return getRoute<{ communications: Array<Record<string, unknown>>; followups: Array<Record<string, unknown>>; logs: Array<Record<string, unknown>> }>('leads/history', { lead_id: leadId });
  },

  async convertLead(body: Record<string, unknown>) {
    return mutateRoute<{ conversion: Record<string, unknown> }>('leads/convert', body);
  },

  async getAnalytics() {
    return getRoute<Record<string, unknown>>('leads/analytics');
  },

  async getReports() {
    return getRoute<Record<string, unknown>>('leads/reports');
  },

  async getSources() {
    return getRoute<{ sources: LeadManagerSourceSummary[] }>('leads/sources');
  },

  async logCall(body: Record<string, unknown>) {
    return mutateRoute<{ communication: Record<string, unknown> }>('leads/call', body);
  },

  async sendWhatsApp(body: Record<string, unknown>) {
    return mutateRoute<{ communication: Record<string, unknown> }>('whatsapp/send', body);
  },

  async sendEmail(body: Record<string, unknown>) {
    return mutateRoute<{ communication: Record<string, unknown> }>('email/send', body);
  },

  async markLost(body: Record<string, unknown>) {
    return mutateRoute<{ lead: LeadManagerLead }>('leads/lost', body);
  },

  async getActivityLogs() {
    return getRoute<{ logs: Array<Record<string, unknown>> }>('logs/lead-activity');
  },

  async getSecurityAccess() {
    return getRoute<{ matrix: Array<Record<string, unknown>> }>('security/access');
  },

  async getMaskedContacts() {
    return getRoute<{ masked: LeadManagerLead[] }>('security/masked');
  },

  async setExportLock(locked: boolean) {
    return mutateRoute<{ settings: LeadManagerSettings }>('security/export-lock', { locked });
  },

  async getSecurityAudit() {
    return getRoute<{ audit_logs: Array<Record<string, unknown>> }>('security/audit');
  },

  async getRolesPermissions() {
    return getRoute<{ permissions: Array<Record<string, unknown>> }>('roles/permissions');
  },

  async getAISuggestions(body: Record<string, unknown>) {
    return mutateRoute<{ suggestions: LeadManagerSuggestion[] }>('ai/lead/suggestions', body);
  },

  async approveAISuggestion(body: Record<string, unknown>) {
    return mutateRoute<{ suggestion: LeadManagerSuggestion }>('ai/approve', body);
  },

  async getChannel(name: string) {
    return getRoute<{ channel: string; leads: number; spend: number; conversions: number; conversion_rate: number }>(`channels/${encodeURIComponent(name)}`);
  },

  async getTeamMembers() {
    return getRoute<{ members: LeadManagerTeamMember[] }>('team/members');
  },

  async getAlerts() {
    return getRoute<{ alerts: LeadManagerAlert[] }>('alerts/leads');
  },

  async createLeadDelayAlert(body: Record<string, unknown>) {
    return mutateRoute<{ alert: LeadManagerAlert; overdue: boolean }>('alerts/lead-delay', body);
  },

  async getIntegrations() {
    return getRoute<{ integrations: Array<Record<string, unknown>> }>('integrations');
  },

  async getSettings() {
    return getRoute<{ settings: LeadManagerSettings | null }>('settings/lead');
  },
};