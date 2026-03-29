import { callEdgeRoute } from '@/lib/api/edge-client';

async function getRoute<T>(path: string) {
  const response = await callEdgeRoute<T>('api-global-command', path);
  return response.data;
}

async function postRoute<T>(path: string, body?: Record<string, unknown>) {
  const response = await callEdgeRoute<T>('api-global-command', path, { method: 'POST', body });
  return response.data;
}

export interface GlobalConnector {
  id: string;
  system_key: string;
  display_name: string;
  layer_name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  health_score: number;
  latency_ms: number;
  auto_fix_enabled: boolean;
  last_heartbeat: string;
}

export interface GlobalStatsResponse {
  continents: number;
  countries: number;
  users: number;
  franchises: number;
  resellers: number;
  products: number;
  sales: number;
  revenue: number;
  system_health: number;
  alerts: number;
  servers: {
    total: number;
    online: number;
    degraded: number;
  };
  connectors: GlobalConnector[];
}

export interface GlobalMapRegion {
  continent: string;
  users: number;
  franchises: number;
  resellers: number;
  deployments: number;
  alerts: number;
  licenses: number;
  revenue: number;
  heat: number;
  health: number;
}

export interface GlobalMapResponse {
  mode: string;
  drilldown_enabled: boolean;
  zoom_enabled: boolean;
  regions: GlobalMapRegion[];
}

export interface GlobalActivityItem {
  id: string;
  type: string;
  title: string;
  message: string;
  created_at: string;
  severity: string;
}

export interface GlobalActivityResponse {
  transport: string;
  push_ready: boolean;
  items: GlobalActivityItem[];
}

export interface InfraSummary {
  total_servers: number;
  online_servers: number;
  degraded_servers: number;
  open_alerts: number;
  db_load: number;
  api_latency_ms: number;
  cdn_performance: number;
  auto_scaling_ready: boolean;
}

export interface InfraResponse {
  summary: InfraSummary;
  servers: Array<Record<string, unknown>>;
  connectors: GlobalConnector[];
  alerts: Array<Record<string, unknown>>;
}

export interface SelfHealResponse {
  healed: number;
  incidents_reviewed: number;
  down_servers_recovered: number;
}

export const globalCommandApi = {
  getStats() {
    return getRoute<GlobalStatsResponse>('global/stats');
  },
  getMap() {
    return getRoute<GlobalMapResponse>('global/map');
  },
  getActivity() {
    return getRoute<GlobalActivityResponse>('global/activity');
  },
  getInfraStatus() {
    return getRoute<InfraResponse>('infra/status');
  },
  runSelfHeal() {
    return postRoute<SelfHealResponse>('global/self-heal');
  },
};
