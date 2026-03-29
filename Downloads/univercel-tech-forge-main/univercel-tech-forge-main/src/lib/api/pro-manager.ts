import { callEdgeRoute } from '@/lib/api/edge-client';

async function getRoute<T>(path: string, query?: Record<string, string | number | boolean | undefined | null>) {
  const response = await callEdgeRoute<T>('api-pro-manager', path, { query });
  return response.data;
}

async function postRoute<T>(path: string, body?: Record<string, unknown>) {
  const response = await callEdgeRoute<T>('api-pro-manager', path, { method: 'POST', body });
  return response.data;
}

export interface ProUserItem {
  id: string;
  user_id: string;
  name: string;
  company?: string | null;
  plan_type: string;
  status: string;
  start_date: string;
  expiry_date?: string | null;
  auto_renewal: boolean;
  support_tier: string;
  monthly_revenue: number;
  renewal_amount: number;
  last_payment_status: string;
  company_domain?: string | null;
  risk_level: string;
}

export interface ProLicenseItem {
  id: string;
  pro_user_id: string;
  license_key: string;
  domain?: string | null;
  device_id?: string | null;
  status: string;
  assigned_at: string;
  expires_at?: string | null;
  pro_users?: Pick<ProUserItem, 'id' | 'name' | 'company' | 'plan_type' | 'status'>;
}

export interface ProProductItem {
  id: string;
  pro_user_id: string;
  license_id: string;
  product_name: string;
  product_code?: string | null;
  status: string;
  version?: string | null;
  enabled_modules: string[];
  custom_changes?: string | null;
  pro_users?: Pick<ProUserItem, 'id' | 'name' | 'company'>;
  pro_licenses?: Pick<ProLicenseItem, 'id' | 'license_key' | 'domain' | 'status'>;
}

export interface ProTicketItem {
  id: string;
  pro_user_id: string;
  title: string;
  issue: string;
  priority: string;
  status: string;
  assigned_role?: string | null;
  response_due_at?: string | null;
  resolution_due_at?: string | null;
  resolved_at?: string | null;
  auto_fixed?: boolean;
  ai_summary?: string | null;
  pro_users?: Pick<ProUserItem, 'id' | 'name' | 'company' | 'status'>;
}

export interface ProBugItem {
  id: string;
  pro_user_id: string;
  issue: string;
  build_version?: string | null;
  severity: string;
  status: string;
  ai_attempts: number;
  linked_module?: string | null;
  dev_manager_status: string;
  pro_users?: Pick<ProUserItem, 'id' | 'name' | 'company'>;
}

export interface ProAssistItem {
  id: string;
  pro_user_id: string;
  assist_type: string;
  status: string;
  mode: string;
  priority_queue_position?: number | null;
  remote_session_enabled: boolean;
  notes?: string | null;
  created_at: string;
  pro_users?: Pick<ProUserItem, 'id' | 'name' | 'company'>;
}

export interface ProUsageItem {
  id: string;
  pro_user_id: string;
  period_key: string;
  api_usage: number;
  api_limit: number;
  storage_usage_gb: number;
  storage_limit_gb: number;
  feature_usage: Record<string, unknown>;
  warning_state: string;
  pro_users?: Pick<ProUserItem, 'id' | 'name' | 'company' | 'plan_type' | 'status'>;
}

export interface ProAlertItem {
  id: string;
  alert_type: string;
  severity: string;
  status: string;
  title: string;
  message: string;
  escalation_level: string;
  created_at: string;
  pro_users?: Pick<ProUserItem, 'id' | 'name' | 'company'>;
}

export interface ProCommunicationItem {
  id: string;
  channel: string;
  direction: string;
  subject?: string | null;
  summary: string;
  created_at: string;
  pro_users?: Pick<ProUserItem, 'id' | 'name' | 'company'>;
}

export interface ProRatingItem {
  id: string;
  rating: number;
  feedback?: string | null;
  source: string;
  churn_risk: string;
  created_at: string;
  pro_users?: Pick<ProUserItem, 'id' | 'name' | 'company' | 'status'>;
}

export interface ProComplianceItem {
  id: string;
  policy_type: string;
  status: string;
  notes?: string | null;
  created_at: string;
  pro_users?: Pick<ProUserItem, 'id' | 'name' | 'company' | 'status'>;
}

export interface ProAuditItem {
  id: string;
  action_type: string;
  actor_user_id?: string | null;
  actor_role?: string | null;
  pro_user_id?: string | null;
  entity_type?: string | null;
  entity_id?: string | null;
  payload: Record<string, unknown>;
  created_at: string;
}

export interface ProOverviewResponse {
  summary: {
    active_users: number;
    expired_users: number;
    revenue_at_risk: number;
    open_tickets: number;
    sla_breaches: number;
    high_priority_issues: number;
    pending_renewals: number;
    assist_sessions: number;
    low_rating_alerts: number;
    average_csat: number;
    compliance_flags: number;
    auto_fix_rate: number;
  };
  users: ProUserItem[];
  tickets: ProTicketItem[];
  alerts: ProAlertItem[];
  upgrades: Array<Record<string, unknown>>;
  usage: ProUsageItem[];
  ratings: ProRatingItem[];
  audit: ProAuditItem[];
}

export const proManagerApi = {
  getOverview() {
    return getRoute<ProOverviewResponse>('overview');
  },
  getUsers(query?: Record<string, string | number | boolean | undefined | null>) {
    return getRoute<{ users: ProUserItem[] }>('users', query);
  },
  getLicenses(limit?: number) {
    return getRoute<{ licenses: ProLicenseItem[] }>('licenses', { limit });
  },
  assignLicense(body: { pro_user_id: string; domain: string; device_id: string }) {
    return postRoute<{ license: ProLicenseItem }>('license/assign', body);
  },
  getProducts() {
    return getRoute<{ products: ProProductItem[] }>('products');
  },
  mapProduct(body: { pro_user_id: string; license_id: string; product_name: string; product_code?: string; version?: string; enabled_modules?: string[]; custom_changes?: string }) {
    return postRoute<{ mapping: ProProductItem }>('product/map', body);
  },
  getTickets(status?: string) {
    return getRoute<{ tickets: ProTicketItem[] }>('tickets', { status });
  },
  createTicket(body: { pro_user_id: string; title?: string; issue: string; priority?: string }) {
    return postRoute<{ ticket: ProTicketItem }>('ticket', body);
  },
  getBugs() {
    return getRoute<{ bugs: ProBugItem[] }>('bugs');
  },
  createBug(body: { pro_user_id: string; issue: string; severity?: string; build_version?: string; ticket_id?: string; linked_module?: string }) {
    return postRoute<{ bug: ProBugItem }>('bug', body);
  },
  getAssist() {
    return getRoute<{ assists: ProAssistItem[] }>('assist');
  },
  createAssist(body: { pro_user_id: string; ticket_id?: string; assist_type?: string; mode?: string; remote_session_enabled?: boolean; notes?: string; priority_queue_position?: number }) {
    return postRoute<{ assist: ProAssistItem }>('assist', body);
  },
  getSla() {
    return getRoute<{ sla: Array<ProTicketItem & { sla_status: string }> }>('sla');
  },
  getUpgrades() {
    return getRoute<{ upgrades: Array<Record<string, unknown>> }>('upgrades');
  },
  createUpgrade(body: { pro_user_id: string; new_tier: string; amount?: number; payment_method?: string; transaction_ref?: string; reason?: string }) {
    return postRoute<{ success: boolean; pro_user_id: string; new_tier: string }>('upgrade', body);
  },
  getRenewals() {
    return getRoute<{ renewals: ProUserItem[] }>('renewals');
  },
  processRenewal(body: { pro_user_id: string; duration_months?: number; payment_status?: string; auto_renewal?: boolean }) {
    return postRoute<{ success: boolean; pro_user_id: string; expiry_date: string; status: string }>('renewal', body);
  },
  getUsage(periodKey?: string) {
    return getRoute<{ usage: ProUsageItem[] }>('usage', { period_key: periodKey });
  },
  getCommunication() {
    return getRoute<{ communication: ProCommunicationItem[] }>('communication');
  },
  getAlerts() {
    return getRoute<{ alerts: ProAlertItem[] }>('alerts');
  },
  getSatisfaction() {
    return getRoute<{ ratings: ProRatingItem[] }>('satisfaction');
  },
  getCompliance() {
    return getRoute<{ compliance: ProComplianceItem[] }>('compliance');
  },
  getAudit(limit?: number) {
    return getRoute<{ audit: ProAuditItem[]; immutable: boolean }>('audit', { limit });
  },
  runHelpdesk(body: { user_id: string; issue: string; subject?: string; title?: string; priority?: string; create_ticket?: boolean }) {
    return postRoute<{ reply: string; ticket: ProTicketItem | null }>('ai/helpdesk', body);
  },
};