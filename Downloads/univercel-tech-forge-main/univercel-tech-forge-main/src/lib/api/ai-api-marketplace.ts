import { callEdgeRoute } from '@/lib/api/edge-client';

export interface MarketplaceApi {
  id: string;
  name: string;
  provider: string | null;
  type: string | null;
  endpoint: string | null;
  status: 'running' | 'stopped' | 'error' | 'pending';
  billing_status: 'paid' | 'unpaid' | 'trial' | 'overdue';
  usage_count: number;
  last_call_at: string | null;
  cost_per_call: number | null;
  monthly_cost: number | null;
  auto_stop_on_unpaid: boolean | null;
  price_per_request: number;
  price_per_token: number;
  max_limit: number;
  speed_mode: 'economy' | 'standard' | 'priority';
  is_enabled: boolean;
  notes?: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface MarketplaceAlert {
  id: string;
  client_user_id: string;
  subscription_id?: string | null;
  api_service_id?: string | null;
  api_key_id?: string | null;
  alert_type: 'usage_80' | 'wallet_low' | 'api_error' | 'limit_exceeded' | 'billing_blocked';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
  read_at?: string | null;
  api_name?: string;
  client_name?: string;
}

export interface WalletInfo {
  id: string;
  available_balance: number;
  pending_balance: number;
  total_earned: number;
  total_withdrawn: number;
  currency: string;
}

export interface ClientSubscription {
  id: string;
  client_user_id: string;
  api_service_id: string;
  wallet_id?: string | null;
  plan_type: 'daily' | 'monthly' | 'per_use';
  status: 'active' | 'suspended' | 'expired' | 'blocked' | 'cancelled';
  usage_limit: number;
  usage_count: number;
  expiry_at?: string | null;
  last_used_at?: string | null;
  last_billed_at?: string | null;
  created_at: string;
  updated_at: string;
  service: MarketplaceApi;
  api_key: {
    id: string;
    masked_key: string;
    status: string;
    usage_count: number;
    usage_limit: number;
    expiry_at?: string | null;
  } | null;
}

export interface AdminDashboardSummary {
  totals: {
    apis: number;
    running: number;
    subscriptions: number;
    activeSubscriptions: number;
    monthlyRevenue: number;
    requests: number;
    unreadAlerts: number;
    criticalAlerts: number;
  };
}

export interface ApiHistoryResponse {
  service: MarketplaceApi;
  usage_logs: Array<{
    id: string;
    request_count: number;
    tokens_used: number;
    cost: number;
    status: string;
    error_message?: string | null;
    source: string;
    created_at: string;
  }>;
  subscriptions: Array<{
    id: string;
    client_user_id: string;
    status: string;
    usage_count: number;
    usage_limit: number;
    expiry_at?: string | null;
  }>;
}

export async function getAdminDashboard() {
  return callEdgeRoute<AdminDashboardSummary>('api-ai-marketplace', 'admin/dashboard');
}

export async function listAdminApis() {
  return callEdgeRoute<{ items: MarketplaceApi[] }>('api-ai-marketplace', 'admin/apis');
}

export async function createAdminApi(payload: Partial<MarketplaceApi>) {
  return callEdgeRoute<{ item: MarketplaceApi }>('api-ai-marketplace', 'admin/apis', {
    method: 'POST',
    body: payload,
  });
}

export async function updateAdminApi(apiId: string, payload: Partial<MarketplaceApi>) {
  return callEdgeRoute<{ item: MarketplaceApi }>('api-ai-marketplace', `admin/apis/${apiId}`, {
    method: 'POST',
    body: payload,
  });
}

export async function toggleAdminApi(apiId: string) {
  return callEdgeRoute<{ item: MarketplaceApi }>('api-ai-marketplace', `admin/apis/${apiId}/toggle`, {
    method: 'POST',
  });
}

export async function setAdminApiLimit(apiId: string, maxLimit: number) {
  return callEdgeRoute<{ item: MarketplaceApi }>('api-ai-marketplace', `admin/apis/${apiId}/limit`, {
    method: 'POST',
    body: { max_limit: maxLimit },
  });
}

export async function getAdminApiHistory(apiId: string) {
  return callEdgeRoute<ApiHistoryResponse>('api-ai-marketplace', `admin/apis/${apiId}/history`);
}

export async function listAdminAlerts() {
  return callEdgeRoute<{ items: MarketplaceAlert[] }>('api-ai-marketplace', 'admin/alerts');
}

export async function getClientCatalog() {
  return callEdgeRoute<{ wallet: WalletInfo; client: { id: string; name: string; email: string }; items: MarketplaceApi[] }>('api-ai-marketplace', 'client/catalog');
}

export async function getClientSubscriptions() {
  return callEdgeRoute<{ items: ClientSubscription[] }>('api-ai-marketplace', 'client/subscriptions');
}

export async function buyClientApi(payload: { api_id: string; plan_type: 'daily' | 'monthly' | 'per_use'; usage_limit?: number }) {
  return callEdgeRoute<{ subscription: ClientSubscription; api_key: string; masked_key: string; purchase_amount: number }>('api-ai-marketplace', 'client/buy', {
    method: 'POST',
    body: payload,
  });
}

export async function addClientMoney(amount: number) {
  return callEdgeRoute<{ balance_after: number }>('api-ai-marketplace', 'client/add-money', {
    method: 'POST',
    body: { amount },
  });
}

export async function getClientAlerts() {
  return callEdgeRoute<{ items: MarketplaceAlert[] }>('api-ai-marketplace', 'client/alerts');
}

export async function getClientAlertDetail(alertId: string) {
  return callEdgeRoute<{ item: MarketplaceAlert }>('api-ai-marketplace', `client/alerts/${alertId}`);
}

export async function markClientAlertRead(alertId: string) {
  return callEdgeRoute<{ item: MarketplaceAlert }>('api-ai-marketplace', `client/alerts/${alertId}/read`, {
    method: 'POST',
  });
}

export async function testClientSubscription(subscriptionId: string, payload?: { request_count?: number; tokens_used?: number; source?: string }) {
  return callEdgeRoute<{
    key_id: string;
    subscription_id: string;
    api_id: string;
    service_name: string;
    usage_count: number;
    usage_limit: number;
    cost: number;
    remaining_balance: number;
    blocked: boolean;
  }>('api-ai-marketplace', `client/subscriptions/${subscriptionId}/test`, {
    method: 'POST',
    body: payload || { request_count: 1, tokens_used: 0, source: 'client-test' },
  });
}