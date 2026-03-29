import { callEdgeRoute } from '@/lib/api/edge-client';

async function getRoute<T>(path: string, query?: Record<string, string | number | boolean | undefined | null>) {
  const response = await callEdgeRoute<T>('api-security', path, { query });
  return response.data;
}

async function postRoute<T>(path: string, body?: Record<string, unknown>) {
  const response = await callEdgeRoute<T>('api-security', path, { method: 'POST', body });
  return response.data;
}

export interface SecuritySummary {
  active_sessions: number;
  suspicious_sessions: number;
  open_alerts: number;
  blocked_attempts_24h: number;
  '2fa_adoption_rate': number;
  locked_accounts: number;
  finance_high_risk_payouts: number;
  zero_trust_enabled: boolean;
}

export interface SecuritySessionItem {
  id: string;
  user_id: string;
  ip_address?: string | null;
  masked_ip?: string;
  device_info?: string | null;
  device_fingerprint?: string | null;
  device_label?: string;
  active_role?: string | null;
  browser?: string | null;
  os?: string | null;
  location?: string | null;
  geo_country?: string | null;
  geo_city?: string | null;
  login_at?: string | null;
  last_activity_at?: string | null;
  expires_at?: string | null;
  is_active?: boolean | null;
  auth_strength?: string | null;
  forced_reauth?: boolean | null;
  risk_score?: number | null;
  revoked_reason?: string | null;
}

export interface SecurityAlertItem {
  id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: string;
  title: string;
  message: string;
  user_id?: string | null;
  session_id?: string | null;
  related_ip?: string | null;
  risk_score?: number | null;
  created_at: string;
}

export interface SecurityLogItem {
  id: string;
  event_type: string;
  user_id?: string | null;
  user_role?: string | null;
  ip_address?: string | null;
  masked_ip?: string;
  device_fingerprint?: string | null;
  action_details?: Record<string, unknown> | null;
  created_at: string;
}

export interface SecurityThreatHotspot {
  type: string;
  count: number;
  maxSeverity: string;
}

export interface SecurityOverviewResponse {
  summary: SecuritySummary;
  controls: Record<string, unknown> | null;
  recent_alerts: SecurityAlertItem[];
  recent_logs: SecurityLogItem[];
  high_risk_sessions: SecuritySessionItem[];
  threat_hotspots: SecurityThreatHotspot[];
  finance_watch: Array<Record<string, unknown>>;
  risk_profiles: Array<Record<string, unknown>>;
  permission_matrix: Record<string, string[]>;
}

export interface SecuritySessionsResponse {
  sessions: SecuritySessionItem[];
  summary: {
    active_count: number;
    forced_reauth_count: number;
    high_risk_count: number;
  };
}

export interface SecurityAlertsResponse {
  alerts: SecurityAlertItem[];
  counts: {
    total: number;
    active: number;
    blocked: number;
    resolved: number;
  };
}

export interface SecurityLogsResponse {
  logs: SecurityLogItem[];
  immutable: boolean;
  editable: boolean;
  deletable: boolean;
}

export interface SecurityPermissionResponse {
  user_role: string;
  manager_access: boolean;
  permission_matrix: Record<string, string[]>;
}

export interface SecurityScanFinding {
  type: string;
  severity: string;
  count: number;
  detail: string;
}

export interface SecurityScanResponse {
  success: boolean;
  blocked: boolean;
  risk_score: number;
  findings: SecurityScanFinding[];
}

export const securityApi = {
  async getOverview() {
    return getRoute<SecurityOverviewResponse>('overview');
  },

  async getSessions(query?: Record<string, string | number | boolean | undefined | null>) {
    return getRoute<SecuritySessionsResponse>('sessions', query);
  },

  async revokeSession(sessionId: string, reason?: string) {
    return postRoute<{ success: boolean; session_id: string; revoked: boolean }>('sessions/logout', {
      session_id: sessionId,
      reason,
    });
  },

  async getAlerts(limit?: number) {
    return getRoute<SecurityAlertsResponse>('alerts', { limit });
  },

  async respondToAlert(alertId: string, status: 'acknowledged' | 'investigating' | 'blocked' | 'resolved', notes?: string) {
    return postRoute<{ success: boolean; alert: SecurityAlertItem }>('alerts/respond', {
      alert_id: alertId,
      status,
      notes,
    });
  },

  async getLogs(limit?: number) {
    return getRoute<SecurityLogsResponse>('logs', { limit });
  },

  async getPermission() {
    return getRoute<SecurityPermissionResponse>('permission');
  },

  async enable2FA(body: {
    preferred_method: 'email' | 'sms' | 'authenticator';
    require_otp_for_login?: boolean;
    require_otp_for_actions?: boolean;
    phone_number?: string;
    generate_backup_codes?: boolean;
  }) {
    return postRoute<{
      settings: Record<string, unknown>;
      backup_codes: string[];
      authenticator_secret: string | null;
    }>('2fa/enable', body);
  },

  async runScan(body?: { scope?: string; user_id?: string }) {
    return postRoute<SecurityScanResponse>('scan', body || {});
  },

  async signOutEverywhere(userId?: string) {
    return postRoute<{ success: boolean; target_user_id: string; signed_out_everywhere: boolean }>('emergency/signout-everywhere', {
      user_id: userId,
    });
  },

  async disableAccount(userId: string, reason: string, email?: string) {
    return postRoute<{ success: boolean; target_user_id: string; account_disabled: boolean; alert_id: string | null }>('emergency/disable-account', {
      user_id: userId,
      reason,
      email,
    });
  },

  async getAuthPermission() {
    const response = await callEdgeRoute<SecurityPermissionResponse>('api-auth', 'permission');
    return response.data;
  },
};
