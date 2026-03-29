import { callEdgeRoute } from '@/lib/api/edge-client';

async function getRoute<T>(path: string, query?: Record<string, string | number | boolean | undefined | null>) {
  const response = await callEdgeRoute<T>('api-franchise', path, { query });
  return response.data;
}

async function mutateRoute<T>(
  path: string,
  body: Record<string, unknown>,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
) {
  const response = await callEdgeRoute<T>('api-franchise', path, { method, body });
  return response.data;
}

export interface FranchiseRoleContext {
  display_role: string;
  module_name: string;
  system_role: string;
  dashboard_title: string;
  alias_map: Record<string, string>;
}

export interface FranchiseStore {
  id: string;
  store_code: string;
  store_name: string;
  city: string;
  state?: string | null;
  country: string;
  status: string;
  capacity: number;
  current_load: number;
  performance_score: number;
  live_users: number;
  live_leads: number;
  live_conversions: number;
  revenue_per_second: number;
  manager_user_id?: string | null;
  metadata?: Record<string, unknown>;
}

export interface FranchiseSupportTicket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  escalation_level: number;
  created_at: string;
}

export interface FranchiseFraudAlert {
  id: string;
  alert_type: string;
  severity: string;
  status: string;
  details: Record<string, unknown>;
  created_at: string;
}

export interface FranchiseWalletLedgerItem {
  id: string;
  transaction_type: string;
  category: string;
  amount: number;
  balance_after: number;
  description?: string | null;
  created_at: string;
}

export interface FranchiseAISuggestion {
  id: string;
  suggestion_type: string;
  title: string;
  summary: string;
  status: string;
  payload: Record<string, unknown>;
  created_at: string;
}

export interface FranchiseLiveDashboardData {
  franchise: Record<string, unknown>;
  metrics: {
    live_users: number;
    live_leads: number;
    live_conversions: number;
    revenue_per_second: number;
    active_stores: number;
    conversion_rate: number;
    auto_scale_triggered: boolean;
  };
  stores: FranchiseStore[];
  recent_leads: Array<Record<string, unknown>>;
  recent_payouts: Array<Record<string, unknown>>;
  fraud_alerts: FranchiseFraudAlert[];
  support_tickets: FranchiseSupportTicket[];
  role_context: FranchiseRoleContext;
}

export interface FranchiseManagerOverview {
  title: string;
  subtext: string;
  badges: string[];
  cards: {
    total_franchises: number;
    active: number;
    on_hold: number;
    total_staff: number;
    total_leads: number;
    revenue: number;
    catalog_products: number;
  };
  highlight_alert: boolean;
  role_context: FranchiseRoleContext;
}

export interface FranchiseListItem {
  id: string;
  franchise_name: string;
  staff_count: number;
  leads: number;
  revenue: number;
  status: string;
  deep_analytics: {
    city: string;
    state?: string | null;
    risk_level?: string | null;
    wallet_locked?: boolean;
  };
  ai_suggestion: string | null;
  actions: {
    view: string;
    manage: string;
    hold: string;
  };
}

export interface FranchiseManagerStaffItem {
  id: string;
  franchise_id: string;
  full_name: string;
  role: string;
  performance_score: number;
  activity_status: string;
  last_activity_at?: string | null;
  reward_status: string;
}

export interface FranchiseApprovalItem {
  id: string;
  franchise_id: string;
  request_type: string;
  request_title: string;
  request_description?: string | null;
  amount: number;
  requested_by_name: string;
  status: string;
  execution_blocked: boolean;
  approval_note?: string | null;
  created_at: string;
}

export interface FranchiseActivityItem {
  id: string;
  module: string;
  action: string;
  user_id?: string | null;
  role?: string | null;
  meta_json?: Record<string, unknown> | null;
  timestamp: string;
}

export const franchiseApi = {
  async resolveRole() {
    return getRoute<{
      resolved_role: string;
      display_role: string;
      module_name: string;
      system_role: string;
      dashboard_title: string;
      alias_map: Record<string, string>;
    }>('role/resolve');
  },

  async getAccount() {
    return getRoute<{ items: Record<string, unknown>[]; role_context: FranchiseRoleContext }>('');
  },

  async getManagerOverview() {
    return getRoute<FranchiseManagerOverview>('franchise/manager/overview');
  },

  async getFranchiseList() {
    return getRoute<{ items: FranchiseListItem[]; role_context: FranchiseRoleContext }>('franchise/list');
  },

  async actOnFranchise(body: { franchise_id: string; action: 'hold' | 'resume'; reason?: string }) {
    return mutateRoute<{ franchise: Record<string, unknown>; role_context: FranchiseRoleContext }>('franchise/action', body);
  },

  async getFranchiseMap() {
    return getRoute<{
      city_wise_distribution: Array<{ city: string; franchises: number }>;
      traffic_density: Array<{ city: string; density: number }>;
      revenue_heatmap: Array<{ city: string; revenue: number }>;
      expansion_suggestions: Array<{ city: string; reason: string }>;
      role_context: FranchiseRoleContext;
    }>('franchise/map');
  },

  async getStaff() {
    return getRoute<{
      staff: FranchiseManagerStaffItem[];
      inactive_alerts: FranchiseManagerStaffItem[];
      top_staff: FranchiseManagerStaffItem[];
      role_context: FranchiseRoleContext;
    }>('franchise/staff');
  },

  async getRevenue() {
    return getRoute<{
      franchise_wise_revenue: Array<{ franchise_id: string; franchise_name: string; revenue: number; status: string }>;
      daily: Array<{ date: string; revenue: number }>;
      monthly: Array<{ month: string; revenue: number }>;
      investigation_triggered: boolean;
      role_context: FranchiseRoleContext;
    }>('franchise/revenue');
  },

  async getLeadsManager() {
    return getRoute<{
      leads: Array<Record<string, unknown>>;
      routing_queue: Array<Record<string, unknown>>;
      pipeline: Record<string, number>;
      ai_score_average: number;
      no_lead_loss: boolean;
      role_context: FranchiseRoleContext;
    }>('franchise/leads');
  },

  async getCustomerActivity() {
    return getRoute<{
      activity: Array<Record<string, unknown>>;
      totals: {
        new_customers: number;
        repeat_customers: number;
        churn_customers: number;
        predicted_churn_rate: number;
      };
      churn_prediction: number;
      role_context: FranchiseRoleContext;
    }>('customers/activity');
  },

  async getApprovals() {
    return getRoute<{
      approvals: FranchiseApprovalItem[];
      pending_count: number;
      blocked_execution: boolean;
      role_context: FranchiseRoleContext;
    }>('franchise/approvals');
  },

  async takeApprovalAction(body: { approval_id: string; decision: 'approve' | 'reject'; note?: string }) {
    return mutateRoute<{ approval: FranchiseApprovalItem; role_context: FranchiseRoleContext }>('approval/action', body);
  },

  async getReports() {
    return getRoute<{
      revenue: Array<{ franchise_name: string; revenue: number }>;
      leads: Array<{ franchise_name: string; total_leads: number; avg_score: number }>;
      performance: Array<{ franchise_name: string; active_staff: number; avg_performance: number }>;
      role_context: FranchiseRoleContext;
    }>('franchise/reports');
  },

  async getActivity() {
    return getRoute<{
      activity: FranchiseActivityItem[];
      append_only: boolean;
      editable: boolean;
      deletable: boolean;
      role_context: FranchiseRoleContext;
    }>('franchise/activity');
  },

  async getLiveDashboard() {
    return getRoute<FranchiseLiveDashboardData>('live-dashboard');
  },

  async getAdvancedStores() {
    return getRoute<{
      stores: FranchiseStore[];
      heatmap: Array<{ city: string; score: number; status: string }>;
      city_comparison: Array<{ city: string; leads: number; revenuePerSecond: number; stores: number }>;
      ranking: Array<FranchiseStore & { rank: number }>;
      role_context: FranchiseRoleContext;
    }>('stores/advanced');
  },

  async createStore(body: Record<string, unknown>) {
    return mutateRoute<{ store: FranchiseStore; role_context: FranchiseRoleContext }>('store/create', body);
  },

  async createFranchise(body: Record<string, unknown>) {
    return mutateRoute<{ franchise: Record<string, unknown>; role_context: FranchiseRoleContext }>('franchise/create', body);
  },

  async createLead(body: Record<string, unknown>) {
    return mutateRoute<{ lead: Record<string, unknown>; role_context: FranchiseRoleContext }>('lead/create', body);
  },

  async autoRouteLead(body: Record<string, unknown>) {
    return mutateRoute<{
      route: Record<string, unknown>;
      selected_store: FranchiseStore | null;
      no_idle_agent: boolean;
      role_context: FranchiseRoleContext;
    }>('lead/auto-route', body);
  },

  async getConversionEngine() {
    return getRoute<{
      funnel: Record<string, number>;
      high_intent_leads: number;
      payment_ready: number;
      total_sale_value: number;
      role_context: FranchiseRoleContext;
    }>('conversion/engine');
  },

  async autoOptimizeAds(body: Record<string, unknown> = {}) {
    return mutateRoute<{ actions: Array<Record<string, unknown>>; role_context: FranchiseRoleContext }>('ads/auto-optimize', body);
  },

  async validateRevenue(body: Record<string, unknown>) {
    return mutateRoute<{ validation: Record<string, unknown>; wallet_locked: boolean; role_context: FranchiseRoleContext }>('revenue/validate', body);
  },

  async processPayout(body: Record<string, unknown>) {
    return mutateRoute<{ payout: Record<string, unknown>; available_balance: number; role_context: FranchiseRoleContext }>('payout/process', body);
  },

  async withdrawWallet(body: Record<string, unknown>) {
    return mutateRoute<{ payout: Record<string, unknown>; available_balance: number; role_context: FranchiseRoleContext }>('wallet/withdraw', body);
  },

  async getWalletLedger() {
    return getRoute<{
      balance: number;
      wallet_locked: boolean;
      risk_level: string;
      ledger: FranchiseWalletLedgerItem[];
      payouts: Array<Record<string, unknown>>;
      role_context: FranchiseRoleContext;
    }>('wallet/ledger');
  },

  async runBrain(body: Record<string, unknown> = {}) {
    return mutateRoute<{ suggestions: FranchiseAISuggestion[]; suggest_only: boolean; role_context: FranchiseRoleContext }>('ai/franchise/brain', body);
  },

  async runManagerAI(body: Record<string, unknown> = {}) {
    return mutateRoute<{ suggestions: FranchiseAISuggestion[]; suggest_only: boolean; role_context: FranchiseRoleContext }>('ai/franchise-manager', body);
  },

  async getSupportPriority() {
    return getRoute<{ priority_queue: FranchiseSupportTicket[]; critical_count: number; role_context: FranchiseRoleContext }>('support/priority');
  },

  async createTicket(body: Record<string, unknown>) {
    return mutateRoute<{ ticket: FranchiseSupportTicket; role_context: FranchiseRoleContext }>('ticket/create', body);
  },

  async getAIReport() {
    return getRoute<{
      best_store: FranchiseStore | null;
      worst_store: FranchiseStore | null;
      top_agents: Array<Record<string, unknown>>;
      loss_areas: Array<Record<string, unknown>>;
      action_plan: string[];
      role_context: FranchiseRoleContext;
    }>('ai-report');
  },

  async getTerritory() {
    return getRoute<{ items: Record<string, unknown>[]; role_context: FranchiseRoleContext }>('territory');
  },

  async getCommissions() {
    return getRoute<{
      commissions: Array<Record<string, unknown>>;
      totals: { pending: number; approved: number; credited: number };
      role_context: FranchiseRoleContext;
    }>('commissions');
  },
};