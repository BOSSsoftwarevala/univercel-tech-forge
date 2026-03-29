import { callEdgeRoute } from '@/lib/api/edge-client';

async function getRoute<T>(path: string, query?: Record<string, string | undefined>) {
  const response = await callEdgeRoute<T>('api-country-control', path, { query });
  return response.data;
}

async function postRoute<T>(path: string, body?: Record<string, unknown>) {
  const response = await callEdgeRoute<T>('api-country-control', path, { method: 'POST', body });
  return response.data;
}

export interface CountryConnector {
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

export interface CountrySummary {
  regions: number;
  areas: number;
  managers: number;
  franchises: number;
  resellers: number;
  influencers: number;
  active_users: number;
  pending_approvals: number;
  open_alerts: number;
  revenue: number;
  performance: number;
  system_health: number;
  risk_level: 'low' | 'medium' | 'high';
  ai_risk_score: number;
}

export interface CountryDescriptor {
  code: string;
  name: string;
  continent: string;
}

export interface CountryOverviewResponse {
  country: CountryDescriptor;
  summary: CountrySummary;
  connectors: CountryConnector[];
}

export interface CountryRegion {
  id: string;
  key: string;
  name: string;
  cities: number;
  managers: number;
  status: 'active' | 'maintenance' | 'warning' | 'critical';
  performance: number;
  franchises: number;
  resellers: number;
  influencers: number;
  pendingApprovals: number;
  openIssues: number;
  revenue: number;
  activeUsers: number;
  health: number;
  managerNames: string[];
}

export interface CountryNetworkEntity {
  id: string;
  name: string;
  type: 'franchise' | 'reseller' | 'influencer' | 'issue';
  status: 'active' | 'pending' | 'warning' | 'critical';
  city: string;
  region: string;
  revenue: number;
  openIssues: number;
  lastActivity: string;
}

export interface CountryMapResponse {
  country: CountryDescriptor;
  regions: CountryRegion[];
  entities: CountryNetworkEntity[];
}

export interface CountryActivityItem {
  id: string;
  type: string;
  source: 'user' | 'ai' | 'system';
  message: string;
  target: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  created_at: string;
  actionable: boolean;
}

export interface CountryActivityResponse {
  transport: string;
  push_ready: boolean;
  items: CountryActivityItem[];
}

export interface CountryManager {
  id: string;
  user_id?: string | null;
  name: string;
  role: string;
  region: string;
  status: string;
  source: string;
  last_updated_at: string;
}

export interface CountryUserActivity {
  id: string;
  user_id: string;
  city: string;
  region: string;
  device: string;
  last_activity_at: string;
  status: string;
}

export interface CountryRegionsResponse {
  country: CountryDescriptor;
  regions: CountryRegion[];
  managers: CountryManager[];
  users: CountryUserActivity[];
  unassigned_regions: CountryRegion[];
}

export interface CountryNetworkResponse {
  country: CountryDescriptor;
  items: CountryNetworkEntity[];
  pending_total: number;
  influencer_leads: number;
}

export interface CountryAlertItem {
  id: string;
  title: string;
  message: string;
  severity: string;
  status: string;
  region: string;
  created_at: string;
}

export interface CountryReportsResponse {
  financial: {
    revenue: number;
    inflow_count: number;
    pending_payouts: number;
    target_growth_percent: number;
  };
  operations: {
    regions: number;
    areas: number;
    managers: number;
    servers_online: number;
  };
  alerts: CountryAlertItem[];
  recommendations: string[];
  settings: {
    auto_approve_resellers: boolean;
    auto_approve_influencers: boolean;
    auto_escalate_incidents: boolean;
    ai_growth_mode: string;
  };
}

export const countryControlApi = {
  getOverview(country?: string) {
    return getRoute<CountryOverviewResponse>('country/overview', { country });
  },
  getMap(country?: string) {
    return getRoute<CountryMapResponse>('country/map', { country });
  },
  getActivity(country?: string) {
    return getRoute<CountryActivityResponse>('country/activity', { country });
  },
  getRegions(country?: string) {
    return getRoute<CountryRegionsResponse>('country/regions', { country });
  },
  getNetwork(country?: string, type?: string) {
    return getRoute<CountryNetworkResponse>('country/network', { country, type });
  },
  getReports(country?: string) {
    return getRoute<CountryReportsResponse>('country/reports', { country });
  },
  createRegion(body: Record<string, unknown>) {
    return postRoute<Record<string, unknown>>('country/region/create', body);
  },
  assignManager(body: Record<string, unknown>) {
    return postRoute<Record<string, unknown>>('country/manager/assign', body);
  },
  takeNetworkDecision(body: Record<string, unknown>) {
    return postRoute<{ accepted: boolean; action: string; entity_type: string }>('country/network/decision', body);
  },
  respondIncident(body: Record<string, unknown>) {
    return postRoute<Record<string, unknown>>('country/incident/respond', body);
  },
  runSelfHeal(body: Record<string, unknown>) {
    return postRoute<{ healed: number; incidents_reviewed: number }>('country/self-heal', body);
  },
};