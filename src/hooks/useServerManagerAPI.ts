import { callEdgeRoute } from '@/lib/api/edge-client';

const API_BASE = 'server-manager';

type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

function splitPathAndQuery(path: string) {
  const [pathname, queryString = ''] = path.split('?');
  return {
    pathname: pathname.replace(/^\/+/, ''),
    query: Object.fromEntries(new URLSearchParams(queryString).entries()),
  };
}

async function apiCall<T>(path: string, method: ApiMethod = 'GET', body?: unknown): Promise<T> {
  const { pathname, query } = splitPathAndQuery(path);
  const response = await callEdgeRoute<T>(API_BASE, pathname, {
    method,
    body,
    query,
  });

  return response.data;
}

export const serverManagerAPI = {
  // Dashboard
  getDashboardSummary: () => apiCall('/dashboard/summary'),
  getDashboardTrends: (range: string) => apiCall(`/dashboard/trends?range=${range}`),

  // Servers
  getServers: (filters?: { region?: string; status?: string; cluster?: string }) => {
    const params = new URLSearchParams(filters as Record<string, string>).toString();
    return apiCall(`/servers${params ? `?${params}` : ''}`);
  },
  getServer: (id: string) => apiCall(`/servers/${id}`),
  updateServer: (id: string, data: unknown) => apiCall(`/servers/${id}`, 'PUT', data),
  restartServer: (id: string) => apiCall(`/servers/${id}/restart`, 'POST'),
  shutdownServer: (id: string) => apiCall(`/servers/${id}/shutdown`, 'POST'),
  scaleServer: (id: string, resources: { cpu: number; ram: number; storage: number }) => 
    apiCall(`/servers/${id}/scale`, 'POST', resources),
  decommissionServer: (id: string) => apiCall(`/servers/${id}/decommission`, 'POST'),

  // Monitoring
  getLiveMetrics: (serverId: string) => apiCall(`/servers/${serverId}/metrics/live`),
  getHealthOverview: () => apiCall('/dashboard/health'),
  getServicesStatus: () => apiCall('/services/status'),
  restartService: (serviceId: string) => apiCall(`/services/${serviceId}/restart`, 'POST'),
  compareMetrics: (serverIds: string[], metric: string, timeRange: string) => 
    apiCall('/servers/metrics/compare', 'POST', { server_ids: serverIds, metric, time_range: timeRange }),

  // Alerts & Incidents
  getAlerts: (filters?: { severity?: string; status?: string; server_id?: string }) => {
    const params = new URLSearchParams(filters as Record<string, string>).toString();
    return apiCall(`/alerts${params ? `?${params}` : ''}`);
  },
  acknowledgeAlert: (id: string) => apiCall(`/alerts/${id}/acknowledge`, 'POST'),
  getIncidents: () => apiCall('/incidents'),
  createIncident: (data: unknown) => apiCall('/incidents', 'POST', data),
  updateIncidentStatus: (id: string, status: string) => apiCall(`/incidents/${id}/status`, 'PUT', { status }),
  escalateIncident: (id: string, target: string) => apiCall(`/incidents/${id}/escalate`, 'POST', { target }),
  resolveIncident: (id: string, notes: string) => apiCall(`/incidents/${id}/resolve`, 'PUT', { notes }),

  // Backups
  getBackupOverview: () => apiCall('/backups/overview'),
  restoreBackup: (backupId: string) => apiCall(`/backups/${backupId}/restore`, 'POST'),
  verifyBackup: (backupId: string) => apiCall(`/backups/${backupId}/verify`, 'POST'),

  // Database & Security
  getDatabaseHealth: () => apiCall('/database/health'),
  getSecretsOverview: () => apiCall('/security/secrets'),
  rotateSecret: (secretId: string) => apiCall(`/security/secrets/${secretId}/rotate`, 'POST'),

  // Security
  getServerSecurity: (serverId: string) => apiCall(`/servers/${serverId}/security`),
  addFirewallRule: (data: unknown) => apiCall('/firewall/rules', 'POST', data),
  lockdownServer: (serverId: string) => apiCall(`/servers/${serverId}/lockdown`, 'POST'),

  // Plans & Purchase
  getPlans: (filters?: { region?: string; type?: string }) => {
    const params = new URLSearchParams(filters as Record<string, string>).toString();
    return apiCall(`/server-plans${params ? `?${params}` : ''}`);
  },
  getRecommendedPlans: () => apiCall('/server-plans/recommended'),
  initPurchase: (planId: string, region: string) => 
    apiCall('/servers/purchase/init', 'POST', { plan_id: planId, region }),
  configurePurchase: (purchaseId: string, config: Record<string, unknown>) => 
    apiCall('/servers/purchase/configure', 'POST', { purchase_id: purchaseId, ...config }),
  confirmPurchase: (purchaseId: string, paymentMethod: string) => 
    apiCall('/servers/purchase/confirm', 'POST', { purchase_id: purchaseId, payment_method: paymentMethod }),

  // Billing
  getServerUsage: (serverId: string) => apiCall(`/servers/${serverId}/usage`),
  getBilling: () => apiCall('/billing/servers'),
  getForecast: () => apiCall('/billing/forecast'),

  // Logs
  getServerLogs: (serverId: string) => apiCall(`/servers/${serverId}/logs`),
  getAuditLogs: () => apiCall('/system/audit?module=server_manager'),
};

export default serverManagerAPI;
