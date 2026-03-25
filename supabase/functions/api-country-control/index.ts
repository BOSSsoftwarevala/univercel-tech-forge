import { withEnhancedMiddleware } from '../_shared/enhanced-middleware.ts';
import { errorResponse, jsonResponse } from '../_shared/utils.ts';

const ALLOWED_ROLES = ['boss_owner', 'master', 'super_admin', 'ceo', 'admin', 'continent_super_admin', 'country_head', 'area_manager', 'finance_manager', 'marketing_manager', 'reseller_manager', 'franchise_manager', 'influencer_manager'];
const DEFAULT_COUNTRIES: Record<string, { name: string; continent: string }> = {
  IN: { name: 'India', continent: 'Asia' },
  NG: { name: 'Nigeria', continent: 'Africa' },
  US: { name: 'United States', continent: 'North America' },
  DE: { name: 'Germany', continent: 'Europe' },
  BR: { name: 'Brazil', continent: 'South America' },
  AU: { name: 'Australia', continent: 'Oceania' },
};

function getPath(req: Request) {
  return new URL(req.url).pathname.replace(/^.*\/api-country-control/, '') || '/';
}

function trim(path: string) {
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
}

function matches(path: string, ...candidates: string[]) {
  return candidates.includes(trim(path));
}

function lower(value: unknown) {
  return String(value || '').trim().toLowerCase();
}

function upper(value: unknown) {
  return String(value || '').trim().toUpperCase();
}

function toNumber(value: unknown, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function round(value: number, decimals = 2) {
  return Number(value.toFixed(decimals));
}

function titleCase(value: string) {
  return value
    .split(/[_\-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function slugify(value: string) {
  return lower(value).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'national';
}

function normalizeStatus(value: unknown, pendingFallback = false) {
  const status = lower(value);
  if (status.includes('pending') || status.includes('review')) return 'pending';
  if (status.includes('warn')) return 'warning';
  if (status.includes('critical') || status.includes('blocked') || status.includes('suspend')) return 'critical';
  if (!status && pendingFallback) return 'pending';
  return 'active';
}

function normalizeUrgency(value: unknown) {
  const severity = lower(value);
  if (severity === 'critical') return 'critical';
  if (severity === 'high' || severity === 'warning') return 'high';
  if (severity === 'medium') return 'medium';
  return 'low';
}

function formatTimestamp(value: string | null | undefined) {
  if (!value) return 'Just now';
  const diffMinutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} day ago`;
}

async function safeSelect(supabaseAdmin: any, table: string, options: {
  select?: string;
  limit?: number;
  orderBy?: string;
  ascending?: boolean;
  filters?: Array<{ column: string; operator: 'eq' | 'in'; value: unknown }>;
} = {}) {
  let query = supabaseAdmin.from(table).select(options.select || '*');
  for (const filter of options.filters || []) {
    if (filter.operator === 'eq') query = query.eq(filter.column, filter.value);
    if (filter.operator === 'in') query = query.in(filter.column, filter.value as any);
  }
  if (options.orderBy) {
    query = query.order(options.orderBy, { ascending: options.ascending ?? false });
  }
  if (options.limit) {
    query = query.limit(options.limit);
  }
  const result = await query;
  if (result.error) return [] as any[];
  return result.data || [];
}

async function firstAvailableRows(supabaseAdmin: any, tables: string[], limit = 200) {
  for (const table of tables) {
    const rows = await safeSelect(supabaseAdmin, table, { limit, orderBy: 'created_at', ascending: false });
    if (rows.length > 0) return { table, rows };
  }
  return { table: tables[0] || 'unknown', rows: [] as any[] };
}

async function resolveCountryContext(supabaseAdmin: any, input?: string | null) {
  const requested = String(input || 'IN').trim();
  const requestedUpper = upper(requested);
  const requestedLower = lower(requested);

  const masterCountries = await safeSelect(supabaseAdmin, 'master_countries', { limit: 300, orderBy: 'name', ascending: true });
  const matched = masterCountries.find((row: any) => {
    return upper(row.iso_code) === requestedUpper || lower(row.name) === requestedLower;
  });

  if (matched) {
    const continent = (await safeSelect(supabaseAdmin, 'master_continents', { filters: [{ column: 'id', operator: 'eq', value: matched.continent_id }], limit: 1 }))[0];
    return {
      code: upper(matched.iso_code || requestedUpper),
      name: matched.name,
      continent: continent?.name || DEFAULT_COUNTRIES[upper(matched.iso_code || requestedUpper)]?.continent || 'Global',
    };
  }

  if (DEFAULT_COUNTRIES[requestedUpper]) {
    return {
      code: requestedUpper,
      name: DEFAULT_COUNTRIES[requestedUpper].name,
      continent: DEFAULT_COUNTRIES[requestedUpper].continent,
    };
  }

  const fallback = Object.entries(DEFAULT_COUNTRIES).find(([, details]) => lower(details.name) === requestedLower);
  if (fallback) {
    return {
      code: fallback[0],
      name: fallback[1].name,
      continent: fallback[1].continent,
    };
  }

  return {
    code: requestedUpper || 'IN',
    name: titleCase(requestedLower || 'india'),
    continent: 'Global',
  };
}

function rowMatchesCountry(row: any, country: { code: string; name: string }) {
  const candidates = [
    row?.country,
    row?.region_country,
    row?.country_code,
    row?.iso_code,
    row?.metadata?.country,
    row?.metadata?.country_code,
    row?.payload?.country,
    row?.payload?.country_code,
    row?.meta_json?.country,
    row?.meta_json?.country_code,
  ].filter(Boolean).map((value) => String(value).trim());

  if (candidates.length === 0) return false;
  return candidates.some((value) => {
    const normalized = lower(value);
    return normalized === lower(country.name) || normalized === lower(country.code);
  });
}

function extractRegion(row: any) {
  return String(
    row?.region_key
      || row?.region_name
      || row?.state
      || row?.region
      || row?.region_state
      || row?.territory_name
      || row?.metadata?.region
      || row?.metadata?.state
      || row?.payload?.region
      || row?.payload?.state
      || 'National Operations'
  ).trim();
}

function extractCity(row: any) {
  return String(
    row?.city
      || row?.region_city
      || row?.metadata?.city
      || row?.payload?.city
      || 'Country Hub'
  ).trim();
}

function extractName(row: any, fallback: string) {
  return String(
    row?.business_name
      || row?.store_name
      || row?.franchise_name
      || row?.reseller_name
      || row?.full_name
      || row?.name
      || row?.influencer_code
      || row?.email
      || fallback
  ).trim();
}

async function loadCountryDataset(supabaseAdmin: any, countryInput?: string | null) {
  const country = await resolveCountryContext(supabaseAdmin, countryInput);
  const [
    settingsRows,
    regionRegistry,
    managerAssignments,
    areaManagers,
    franchiseRows,
    resellerRows,
    territoryRows,
    influencerRows,
    influencerLeadRows,
    influencerFlagRows,
    financeRows,
    systemAlerts,
    securityAlerts,
    riskAlerts,
    sessions,
    serverRows,
    connectors,
    countryEvents,
    countryIncidents,
    franchiseEvents,
    resellerEvents,
    influencerEvents,
  ] = await Promise.all([
    safeSelect(supabaseAdmin, 'country_control_settings', { filters: [{ column: 'country_code', operator: 'eq', value: country.code }], limit: 1 }),
    safeSelect(supabaseAdmin, 'country_region_registry', { filters: [{ column: 'country_code', operator: 'eq', value: country.code }], orderBy: 'region_name', ascending: true, limit: 200 }),
    safeSelect(supabaseAdmin, 'country_manager_assignments', { filters: [{ column: 'country_code', operator: 'eq', value: country.code }], orderBy: 'created_at', ascending: false, limit: 200 }),
    safeSelect(supabaseAdmin, 'admin_area_manager', { limit: 300, orderBy: 'created_at', ascending: false }),
    safeSelect(supabaseAdmin, 'franchise_accounts', { limit: 1500, orderBy: 'created_at', ascending: false }),
    safeSelect(supabaseAdmin, 'reseller_accounts', { limit: 1500, orderBy: 'created_at', ascending: false }),
    firstAvailableRows(supabaseAdmin, ['territory_mapping', 'reseller_territory_map'], 2000),
    safeSelect(supabaseAdmin, 'influencer_accounts', { limit: 1500, orderBy: 'created_at', ascending: false }),
    safeSelect(supabaseAdmin, 'marketplace_influencer_leads', { limit: 500, orderBy: 'created_at', ascending: false }),
    safeSelect(supabaseAdmin, 'influencer_fraud_flags', { limit: 500, orderBy: 'created_at', ascending: false }),
    safeSelect(supabaseAdmin, 'finance_transactions', { limit: 2000, orderBy: 'created_at', ascending: false }),
    safeSelect(supabaseAdmin, 'system_alerts', { limit: 300, orderBy: 'created_at', ascending: false }),
    safeSelect(supabaseAdmin, 'security_live_alerts', { limit: 300, orderBy: 'created_at', ascending: false }),
    safeSelect(supabaseAdmin, 'risk_alerts', { limit: 300, orderBy: 'created_at', ascending: false }),
    safeSelect(supabaseAdmin, 'user_sessions', { limit: 1500, orderBy: 'last_activity_at', ascending: false }),
    safeSelect(supabaseAdmin, 'server_instances', { limit: 500, orderBy: 'updated_at', ascending: false }),
    safeSelect(supabaseAdmin, 'global_system_connectors', { limit: 50, orderBy: 'display_name', ascending: true }),
    safeSelect(supabaseAdmin, 'country_command_events', { filters: [{ column: 'country_code', operator: 'eq', value: country.code }], limit: 200, orderBy: 'created_at', ascending: false }),
    safeSelect(supabaseAdmin, 'country_command_incidents', { filters: [{ column: 'country_code', operator: 'eq', value: country.code }], limit: 200, orderBy: 'created_at', ascending: false }),
    safeSelect(supabaseAdmin, 'franchise_sync_events', { limit: 200, orderBy: 'created_at', ascending: false }),
    safeSelect(supabaseAdmin, 'reseller_sync_events', { limit: 200, orderBy: 'created_at', ascending: false }),
    safeSelect(supabaseAdmin, 'influencer_sync_events', { limit: 200, orderBy: 'created_at', ascending: false }),
  ]);

  const settings = settingsRows[0] || {
    country_code: country.code,
    country_name: country.name,
    continent: country.continent,
    ai_growth_mode: 'balanced',
    target_growth_percent: 12,
    target_health_percent: 95,
  };

  const territoryRowsFiltered = territoryRows.rows.filter((row: any) => rowMatchesCountry(row, country));
  const franchiseFiltered = franchiseRows.filter((row: any) => rowMatchesCountry(row, country));
  const resellerFiltered = resellerRows.filter((row: any) => rowMatchesCountry(row, country));
  const influencerFiltered = influencerRows.filter((row: any) => rowMatchesCountry(row, country));
  const financeFiltered = financeRows.filter((row: any) => rowMatchesCountry(row, country));
  const systemAlertsFiltered = systemAlerts.filter((row: any) => rowMatchesCountry(row, country));
  const securityAlertsFiltered = securityAlerts.filter((row: any) => rowMatchesCountry(row, country));
  const riskAlertsFiltered = riskAlerts.filter((row: any) => rowMatchesCountry(row, country));
  const sessionsFiltered = sessions.filter((row: any) => rowMatchesCountry(row, country));
  const serversFiltered = serverRows.filter((row: any) => rowMatchesCountry(row, country));
  const influencerLeadsFiltered = influencerLeadRows.filter((row: any) => rowMatchesCountry(row, country));
  const influencerFlagsFiltered = influencerFlagRows.filter((row: any) => rowMatchesCountry(row, country));
  const countryAreaManagers = areaManagers.filter((row: any) => lower(row.country) === lower(country.name) || upper(row.country) === country.code);
  const franchiseEventsFiltered = franchiseEvents.filter((row: any) => rowMatchesCountry(row.payload || {}, country) || rowMatchesCountry(row, country));
  const resellerEventsFiltered = resellerEvents.filter((row: any) => rowMatchesCountry(row.payload || {}, country) || rowMatchesCountry(row, country));
  const influencerEventsFiltered = influencerEvents.filter((row: any) => rowMatchesCountry(row.payload || {}, country) || rowMatchesCountry(row, country));

  const regionMap = new Map<string, any>();
  const ensureRegion = (regionName: string) => {
    const key = slugify(regionName);
    if (!regionMap.has(key)) {
      const registry = regionRegistry.find((item: any) => item.region_key === key);
      regionMap.set(key, {
        id: registry?.id || key,
        key,
        name: registry?.region_name || titleCase(regionName),
        status: registry?.status || 'active',
        cities: new Set<string>(),
        managers: 0,
        manager_names: new Set<string>(),
        performance: 0,
        franchises: 0,
        resellers: 0,
        influencers: 0,
        pendingApprovals: 0,
        openIssues: 0,
        revenue: 0,
        activeUsers: 0,
        health: 100,
      });
    }
    return regionMap.get(key);
  };

  regionRegistry.forEach((registry: any) => ensureRegion(registry.region_name || registry.region_key));

  franchiseFiltered.forEach((row: any) => {
    const region = ensureRegion(extractRegion(row));
    region.franchises += 1;
    region.cities.add(extractCity(row));
    region.pendingApprovals += normalizeStatus(row.status || row.verification_status, false) === 'pending' ? 1 : 0;
    region.revenue += toNumber(row.total_revenue || row.revenue || row.monthly_revenue || 0);
    region.activeUsers += toNumber(row.live_users || row.active_users || 0);
  });

  territoryRowsFiltered.forEach((row: any) => {
    const region = ensureRegion(extractRegion(row));
    region.resellers += 1;
    region.cities.add(extractCity(row));
  });

  resellerFiltered.forEach((row: any) => {
    const region = ensureRegion(extractRegion(row));
    region.resellers += 1;
    region.cities.add(extractCity(row));
    region.pendingApprovals += normalizeStatus(row.status || row.assignment_status, false) === 'pending' ? 1 : 0;
    region.revenue += toNumber(row.total_revenue || row.revenue || row.monthly_revenue || 0);
  });

  influencerFiltered.forEach((row: any) => {
    const region = ensureRegion(extractRegion(row));
    region.influencers += 1;
    region.cities.add(extractCity(row));
    region.pendingApprovals += normalizeStatus(row.status, false) === 'pending' ? 1 : 0;
    region.revenue += toNumber(row.total_earnings || row.total_revenue || 0);
  });

  managerAssignments.forEach((row: any) => {
    const region = ensureRegion(row.region_key || row.region_name || 'National Operations');
    region.managers += 1;
    region.manager_names.add(row.manager_name);
  });

  countryAreaManagers.forEach((row: any) => {
    const region = ensureRegion(row.current_activity || 'National Operations');
    region.managers += 1;
    region.manager_names.add(row.name || row.user_id);
  });

  [...countryIncidents, ...systemAlertsFiltered, ...securityAlertsFiltered, ...riskAlertsFiltered, ...influencerFlagsFiltered].forEach((row: any) => {
    const region = ensureRegion(extractRegion(row));
    region.openIssues += 1;
    region.health = Math.min(region.health, 92 - region.openIssues * 7);
  });

  sessionsFiltered.forEach((row: any) => {
    const region = ensureRegion(extractRegion(row));
    region.activeUsers += 1;
  });

  financeFiltered.forEach((row: any) => {
    const region = ensureRegion(extractRegion(row));
    if (String(row.direction || '').toLowerCase() === 'inflow') {
      region.revenue += toNumber(row.amount || 0);
    }
  });

  const regions = Array.from(regionMap.values()).map((region) => {
    const totalNetwork = region.franchises + region.resellers + region.influencers;
    const performance = totalNetwork === 0
      ? 72
      : Math.max(55, Math.min(99, round(70 + region.activeUsers / Math.max(totalNetwork, 1) + region.franchises * 1.2 - region.openIssues * 4 + region.managers * 2)));
    const health = Math.max(55, Math.min(100, round(region.health - region.pendingApprovals * 1.5)));
    const status = region.openIssues >= 4 ? 'critical' : region.pendingApprovals >= 5 || performance < 75 ? 'warning' : region.status;
    return {
      id: region.id,
      key: region.key,
      name: region.name,
      cities: region.cities.size || 1,
      managers: Math.max(region.managers, region.manager_names.size),
      status,
      performance,
      franchises: region.franchises,
      resellers: region.resellers,
      influencers: region.influencers,
      pendingApprovals: region.pendingApprovals,
      openIssues: region.openIssues,
      revenue: round(region.revenue),
      activeUsers: region.activeUsers,
      health,
      managerNames: Array.from(region.manager_names),
    };
  }).sort((left, right) => right.revenue - left.revenue || right.franchises - left.franchises);

  const networkEntities = [
    ...franchiseFiltered.map((row: any) => ({
      id: String(row.id),
      name: extractName(row, 'Franchise'),
      type: 'franchise',
      status: normalizeStatus(row.status || row.verification_status),
      city: extractCity(row),
      region: titleCase(extractRegion(row)),
      revenue: round(toNumber(row.total_revenue || row.revenue || row.monthly_revenue || 0)),
      openIssues: 0,
      lastActivity: formatTimestamp(row.updated_at || row.created_at),
    })),
    ...resellerFiltered.map((row: any) => ({
      id: String(row.id),
      name: extractName(row, 'Reseller'),
      type: 'reseller',
      status: normalizeStatus(row.status || row.assignment_status),
      city: extractCity(row),
      region: titleCase(extractRegion(row)),
      revenue: round(toNumber(row.total_revenue || row.revenue || row.monthly_revenue || 0)),
      openIssues: 0,
      lastActivity: formatTimestamp(row.updated_at || row.created_at),
    })),
    ...influencerFiltered.map((row: any) => ({
      id: String(row.id),
      name: extractName(row, 'Influencer'),
      type: 'influencer',
      status: normalizeStatus(row.status, false),
      city: extractCity(row),
      region: titleCase(extractRegion(row)),
      revenue: round(toNumber(row.total_earnings || row.total_revenue || 0)),
      openIssues: influencerFlagsFiltered.filter((flag: any) => String(flag.influencer_id) === String(row.id)).length,
      lastActivity: formatTimestamp(row.last_activity_at || row.updated_at || row.created_at),
    })),
  ].sort((left, right) => right.revenue - left.revenue).slice(0, 250);

  const issueEntities = countryIncidents.filter((row: any) => row.status === 'open').map((row: any) => ({
    id: String(row.id),
    name: row.title,
    type: 'issue',
    status: row.severity === 'critical' ? 'critical' : 'warning',
    city: extractCity(row),
    region: titleCase(extractRegion(row)),
    revenue: 0,
    openIssues: 1,
    lastActivity: formatTimestamp(row.updated_at || row.created_at),
  }));

  const activityItems = [
    ...countryEvents.map((row: any) => ({
      id: String(row.id),
      type: row.event_type,
      source: row.source,
      message: row.message,
      target: row.title,
      urgency: normalizeUrgency(row.severity),
      timestamp: formatTimestamp(row.created_at),
      created_at: row.created_at,
      actionable: ['high', 'critical'].includes(normalizeUrgency(row.severity)) || row.event_type.includes('approval'),
    })),
    ...countryIncidents.map((row: any) => ({
      id: String(row.id),
      type: row.incident_type,
      source: 'system',
      message: row.message,
      target: row.title,
      urgency: normalizeUrgency(row.severity),
      timestamp: formatTimestamp(row.updated_at || row.created_at),
      created_at: row.updated_at || row.created_at,
      actionable: row.status === 'open',
    })),
    ...franchiseEventsFiltered.map((row: any) => ({
      id: String(row.id),
      type: row.event_type || 'franchise_event',
      source: 'user',
      message: row.payload?.message || 'Franchise network update detected',
      target: row.payload?.city || row.payload?.business_name || 'Franchise Network',
      urgency: 'medium',
      timestamp: formatTimestamp(row.created_at),
      created_at: row.created_at,
      actionable: false,
    })),
    ...resellerEventsFiltered.map((row: any) => ({
      id: String(row.id),
      type: row.event_type || 'reseller_event',
      source: 'user',
      message: row.payload?.message || 'Reseller territory movement detected',
      target: row.payload?.territory_name || row.payload?.country || 'Reseller Network',
      urgency: 'medium',
      timestamp: formatTimestamp(row.created_at),
      created_at: row.created_at,
      actionable: false,
    })),
    ...influencerEventsFiltered.map((row: any) => ({
      id: String(row.id),
      type: row.event_type || 'influencer_event',
      source: 'ai',
      message: row.payload?.message || 'Influencer activity detected',
      target: row.payload?.campaign_name || row.payload?.country || 'Influencer Network',
      urgency: 'low',
      timestamp: formatTimestamp(row.created_at),
      created_at: row.created_at,
      actionable: false,
    })),
  ].sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime()).slice(0, 80);

  const revenue = round(regions.reduce((sum, row) => sum + toNumber(row.revenue), 0));
  const pendingApprovals = regions.reduce((sum, row) => sum + row.pendingApprovals, 0);
  const openAlerts = countryIncidents.filter((row: any) => row.status === 'open').length + systemAlertsFiltered.length + securityAlertsFiltered.length + riskAlertsFiltered.length;
  const activeUsers = regions.reduce((sum, row) => sum + row.activeUsers, 0);
  const performance = regions.length > 0 ? round(regions.reduce((sum, row) => sum + toNumber(row.performance), 0) / regions.length) : 75;
  const systemHealth = connectors.length > 0
    ? round(connectors.reduce((sum: number, row: any) => sum + toNumber(row.health_score, 100), 0) / connectors.length)
    : 96;
  const riskScore = round(Math.min(100, openAlerts * 7 + influencerFlagsFiltered.length * 4 + Math.max(0, pendingApprovals - 3) * 2));
  const riskLevel = riskScore >= 75 ? 'high' : riskScore >= 45 ? 'medium' : 'low';

  const recentUsers = sessionsFiltered.slice(0, 30).map((row: any) => ({
    id: String(row.id),
    user_id: row.user_id,
    city: extractCity(row),
    region: titleCase(extractRegion(row)),
    device: row.device_name || row.browser_name || row.os_name || 'Unknown Device',
    last_activity_at: row.last_activity_at || row.updated_at || row.created_at,
    status: row.is_active ? 'active' : 'inactive',
  }));

  const managers = managerAssignments.map((row: any) => ({
    id: String(row.id),
    user_id: row.manager_user_id,
    name: row.manager_name,
    role: row.manager_role,
    region: titleCase(row.region_key || 'national-operations').replace(/-/g, ' '),
    status: row.assignment_status,
    source: row.assignment_source,
    last_updated_at: row.updated_at,
  })).concat(countryAreaManagers.map((row: any) => ({
    id: String(row.id),
    user_id: row.user_id,
    name: row.name || `Area Manager ${String(row.user_id).slice(0, 6)}`,
    role: 'area_manager',
    region: titleCase(row.current_activity || 'national-operations').replace(/-/g, ' '),
    status: row.status,
    source: 'directory',
    last_updated_at: row.updated_at || row.last_login_time,
  })));

  const reports = {
    financial: {
      revenue,
      inflow_count: financeFiltered.filter((row: any) => lower(row.direction) === 'inflow').length,
      pending_payouts: financeFiltered.filter((row: any) => lower(row.status) === 'pending').length,
      target_growth_percent: toNumber(settings.target_growth_percent, 12),
    },
    operations: {
      regions: regions.length,
      areas: regions.reduce((sum, row) => sum + row.cities, 0),
      managers: managers.length,
      servers_online: serversFiltered.filter((row: any) => lower(row.status) === 'active').length,
    },
    alerts: countryIncidents.map((row: any) => ({
      id: String(row.id),
      title: row.title,
      message: row.message,
      severity: row.severity,
      status: row.status,
      region: titleCase(row.region_key || 'National Operations').replace(/-/g, ' '),
      created_at: row.created_at,
    })),
    recommendations: [
      `AI growth mode is ${settings.ai_growth_mode}; focus on ${regions[0]?.name || 'top revenue region'} to hit ${toNumber(settings.target_growth_percent, 12)}% growth.`,
      pendingApprovals > 6
        ? 'Approval queue is above target. Auto-route low-risk reseller and influencer reviews to the AI bench.'
        : 'Approval queue is under control. Keep manual review on high-value franchise applications only.',
      openAlerts > 4
        ? 'Country risk is elevated. Promote open operational incidents to continent oversight within one cycle.'
        : 'System health is within target. Keep auto-escalation enabled for payment and compliance incidents.',
    ],
    settings: {
      auto_approve_resellers: settings.auto_approve_resellers,
      auto_approve_influencers: settings.auto_approve_influencers,
      auto_escalate_incidents: settings.auto_escalate_incidents,
      ai_growth_mode: settings.ai_growth_mode,
    },
  };

  return {
    country,
    settings,
    overview: {
      country,
      summary: {
        regions: regions.length,
        areas: regions.reduce((sum, row) => sum + row.cities, 0),
        managers: managers.length,
        franchises: franchiseFiltered.length,
        resellers: networkEntities.filter((item) => item.type === 'reseller').length,
        influencers: networkEntities.filter((item) => item.type === 'influencer').length,
        active_users: activeUsers,
        pending_approvals: pendingApprovals,
        open_alerts: openAlerts,
        revenue,
        performance,
        system_health: systemHealth,
        risk_level: riskLevel,
        ai_risk_score: riskScore,
      },
      connectors: connectors.map((row: any) => ({
        id: String(row.id),
        system_key: row.system_key,
        display_name: row.display_name,
        layer_name: row.layer_name,
        status: row.status,
        health_score: toNumber(row.health_score, 100),
        latency_ms: toNumber(row.latency_ms, 0),
        auto_fix_enabled: !!row.auto_fix_enabled,
        last_heartbeat: row.last_heartbeat,
      })),
    },
    map: {
      country,
      regions,
      entities: [...networkEntities, ...issueEntities].slice(0, 320),
    },
    activity: {
      transport: 'supabase_realtime_websocket',
      push_ready: true,
      items: activityItems,
    },
    regions: {
      country,
      regions,
      managers,
      users: recentUsers,
      unassigned_regions: regions.filter((region) => !managers.some((manager) => lower(manager.region) === lower(region.name))),
    },
    network: {
      country,
      items: networkEntities,
      pending_total: pendingApprovals,
      influencer_leads: influencerLeadsFiltered.length,
    },
    reports,
  };
}

async function persistSnapshots(supabaseAdmin: any, dataset: any) {
  await Promise.all(dataset.map.regions.map((region: any) =>
    supabaseAdmin.from('country_region_snapshots').insert({
      country_code: dataset.country.code,
      country_name: dataset.country.name,
      region_key: region.key,
      region_name: region.name,
      active_users: region.activeUsers,
      franchises: region.franchises,
      resellers: region.resellers,
      influencers: region.influencers,
      managers: region.managers,
      areas: region.cities,
      pending_approvals: region.pendingApprovals,
      open_alerts: region.openIssues,
      revenue: region.revenue,
      performance_percent: region.performance,
      health_percent: region.health,
      risk_score: Math.min(100, region.openIssues * 15 + region.pendingApprovals * 5),
      metadata: { status: region.status },
      snapshot_at: new Date().toISOString(),
    })
  ));
}

async function createRegion(ctx: any, body: any) {
  const country = await resolveCountryContext(ctx.supabaseAdmin, body.country || body.country_code);
  const regionName = String(body.region_name || '').trim() || `Expansion Region ${Math.floor(Date.now() / 1000)}`;
  const regionKey = slugify(body.region_key || regionName);

  const { data, error } = await ctx.supabaseAdmin.from('country_region_registry').upsert({
    country_code: country.code,
    country_name: country.name,
    continent: country.continent,
    region_key: regionKey,
    region_name: titleCase(regionName),
    status: body.status || 'active',
    priority_tier: body.priority_tier || 'standard',
    metadata: body.metadata || {},
    created_by: ctx.user!.userId,
  }, { onConflict: 'country_code,region_key' }).select('*').single();

  if (error) throw error;

  await ctx.supabaseAdmin.from('country_growth_actions').insert({
    country_code: country.code,
    action_type: 'region_create',
    target_ref: data.region_name,
    requested_by: ctx.user!.userId,
    executed_by: 'country-control-api',
    action_details: { region_key: data.region_key },
  });

  await ctx.supabaseAdmin.from('country_command_events').insert({
    country_code: country.code,
    country_name: country.name,
    region_key: data.region_key,
    event_type: 'region_created',
    entity_type: 'region',
    entity_id: String(data.id),
    severity: 'medium',
    source: 'user',
    title: `Region created: ${data.region_name}`,
    message: `Country control created ${data.region_name} for ${country.name}.`,
    payload: { region_key: data.region_key },
    created_by: ctx.user!.userId,
  });

  return data;
}

async function assignManager(ctx: any, body: any) {
  const country = await resolveCountryContext(ctx.supabaseAdmin, body.country || body.country_code);
  const regionKey = slugify(body.region_key || body.region_name || 'national-operations');
  const managerName = String(body.manager_name || `AI Bench ${titleCase(regionKey)}`).trim();

  const { data, error } = await ctx.supabaseAdmin.from('country_manager_assignments').upsert({
    country_code: country.code,
    region_key: regionKey,
    manager_user_id: body.manager_user_id || null,
    manager_name: managerName,
    manager_role: body.manager_role || 'area_manager',
    assignment_status: body.assignment_status || 'active',
    assigned_by: ctx.user!.userId,
    assignment_source: body.assignment_source || (body.manager_user_id ? 'manual' : 'ai_bench'),
    metadata: body.metadata || {},
  }, { onConflict: 'country_code,region_key,manager_name' }).select('*').single();

  if (error) throw error;

  await ctx.supabaseAdmin.from('country_growth_actions').insert({
    country_code: country.code,
    action_type: 'manager_assign',
    target_ref: managerName,
    requested_by: ctx.user!.userId,
    executed_by: 'country-control-api',
    action_details: { region_key: data.region_key, manager_name: managerName },
  });

  await ctx.supabaseAdmin.from('country_command_events').insert({
    country_code: country.code,
    country_name: country.name,
    region_key: data.region_key,
    event_type: 'manager_assigned',
    entity_type: 'manager',
    entity_id: String(data.id),
    severity: 'medium',
    source: body.manager_user_id ? 'user' : 'ai',
    title: `Manager assigned: ${managerName}`,
    message: `${managerName} is now responsible for ${titleCase(regionKey)}.`,
    payload: { region_key: data.region_key, manager_user_id: body.manager_user_id || null },
    created_by: ctx.user!.userId,
  });

  return data;
}

async function takeNetworkDecision(ctx: any, body: any) {
  const country = await resolveCountryContext(ctx.supabaseAdmin, body.country || body.country_code);
  const action = String(body.action || 'approve').trim().toLowerCase();
  const entityType = String(body.entity_type || 'network').trim().toLowerCase();
  const entityName = String(body.entity_name || body.entity_id || 'network entity');
  const regionKey = slugify(body.region || body.region_key || 'national-operations');

  await ctx.supabaseAdmin.from('country_growth_actions').insert({
    country_code: country.code,
    action_type: 'network_decision',
    target_ref: entityName,
    requested_by: ctx.user!.userId,
    executed_by: 'country-control-api',
    action_details: { action, entity_type: entityType, entity_id: body.entity_id || null, region_key: regionKey },
  });

  await ctx.supabaseAdmin.from('country_command_events').insert({
    country_code: country.code,
    country_name: country.name,
    region_key: regionKey,
    event_type: `${entityType}_${action}`,
    entity_type: entityType,
    entity_id: body.entity_id ? String(body.entity_id) : null,
    severity: action === 'escalate' ? 'high' : 'medium',
    source: 'user',
    title: `${titleCase(entityType)} ${titleCase(action)}`,
    message: `${entityName} was marked as ${action} by country control.`,
    payload: body,
    created_by: ctx.user!.userId,
  });

  if (action === 'escalate') {
    await ctx.supabaseAdmin.from('country_command_incidents').insert({
      country_code: country.code,
      country_name: country.name,
      region_key: regionKey,
      incident_type: entityType === 'franchise' ? 'operational' : entityType === 'reseller' ? 'growth' : 'compliance',
      severity: 'high',
      status: 'open',
      title: `${titleCase(entityType)} escalation`,
      message: `${entityName} requires additional review at country level.`,
      escalation_level: 'Country Head',
      auto_fix_status: 'manual_required',
      metadata: { entity_id: body.entity_id || null, entity_type: entityType },
    });
  }

  return { accepted: true, action, entity_type: entityType };
}

async function respondIncident(ctx: any, body: any) {
  const incidentId = String(body.incident_id || '').trim();
  if (!incidentId) {
    throw new Error('incident_id is required');
  }

  const responseAction = String(body.action || 'resolve').trim().toLowerCase();
  const nextStatus = responseAction === 'resolve' ? 'resolved' : responseAction === 'auto_fix' ? 'auto_fixed' : 'escalated';
  const nextAutoFix = responseAction === 'auto_fix' ? 'executed' : responseAction === 'resolve' ? 'manual_required' : 'manual_required';

  const { data, error } = await ctx.supabaseAdmin.from('country_command_incidents').update({
    status: nextStatus,
    auto_fix_status: nextAutoFix,
    escalation_level: responseAction === 'escalate' ? 'Continent' : undefined,
    metadata: { action_taken: responseAction, responded_by: ctx.user!.userId },
  }).eq('id', incidentId).select('*').single();

  if (error) throw error;

  await ctx.supabaseAdmin.from('country_growth_actions').insert({
    country_code: data.country_code,
    action_type: 'incident_response',
    target_ref: data.title,
    requested_by: ctx.user!.userId,
    executed_by: 'country-control-api',
    action_details: { incident_id: incidentId, action: responseAction },
  });

  await ctx.supabaseAdmin.from('country_command_events').insert({
    country_code: data.country_code,
    country_name: data.country_name,
    region_key: data.region_key,
    event_type: `incident_${responseAction}`,
    entity_type: 'incident',
    entity_id: incidentId,
    severity: nextStatus === 'resolved' ? 'info' : 'high',
    source: 'user',
    title: `Incident ${titleCase(responseAction)}`,
    message: `${data.title} was ${responseAction} by country control.`,
    payload: { incident_id: incidentId },
    created_by: ctx.user!.userId,
  });

  return data;
}

async function runSelfHeal(ctx: any, body: any) {
  const dataset = await loadCountryDataset(ctx.supabaseAdmin, body.country || body.country_code);
  const openIncidents = dataset.reports.alerts.filter((item: any) => item.status === 'open');
  const healableIds = openIncidents.filter((item: any) => item.severity !== 'critical').map((item: any) => item.id);

  if (healableIds.length > 0) {
    await ctx.supabaseAdmin.from('country_command_incidents').update({
      status: 'auto_fixed',
      auto_fix_status: 'executed',
    }).in('id', healableIds);
  }

  await ctx.supabaseAdmin.from('country_growth_actions').insert({
    country_code: dataset.country.code,
    action_type: 'self_heal',
    target_ref: dataset.country.name,
    requested_by: ctx.user!.userId,
    executed_by: 'country-control-api',
    action_details: { healed: healableIds.length },
  });

  await ctx.supabaseAdmin.from('country_command_events').insert({
    country_code: dataset.country.code,
    country_name: dataset.country.name,
    event_type: 'self_heal_executed',
    severity: healableIds.length > 0 ? 'high' : 'info',
    source: 'ai',
    title: 'Country self-heal cycle completed',
    message: healableIds.length > 0
      ? `${healableIds.length} open incident(s) were auto-corrected.`
      : 'Self-heal cycle completed with no corrective actions required.',
    payload: { healed: healableIds.length },
    created_by: ctx.user!.userId,
  });

  return { healed: healableIds.length, incidents_reviewed: openIncidents.length };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok');
  }

  const url = new URL(req.url);
  const path = getPath(req);

  if (req.method === 'GET' && matches(path, '/country/overview')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const dataset = await loadCountryDataset(ctx.supabaseAdmin, url.searchParams.get('country'));
      await persistSnapshots(ctx.supabaseAdmin, dataset);
      return jsonResponse(dataset.overview);
    }, {
      module: 'country-control',
      action: 'overview',
      allowedRoles: ALLOWED_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'GET' && matches(path, '/country/map')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const dataset = await loadCountryDataset(ctx.supabaseAdmin, url.searchParams.get('country'));
      return jsonResponse(dataset.map);
    }, {
      module: 'country-control',
      action: 'map',
      allowedRoles: ALLOWED_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'GET' && matches(path, '/country/activity')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const dataset = await loadCountryDataset(ctx.supabaseAdmin, url.searchParams.get('country'));
      return jsonResponse(dataset.activity);
    }, {
      module: 'country-control',
      action: 'activity',
      allowedRoles: ALLOWED_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'GET' && matches(path, '/country/regions')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const dataset = await loadCountryDataset(ctx.supabaseAdmin, url.searchParams.get('country'));
      return jsonResponse(dataset.regions);
    }, {
      module: 'country-control',
      action: 'regions',
      allowedRoles: ALLOWED_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'GET' && matches(path, '/country/network')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const dataset = await loadCountryDataset(ctx.supabaseAdmin, url.searchParams.get('country'));
      const type = lower(url.searchParams.get('type') || 'all');
      const items = type === 'all' ? dataset.network.items : dataset.network.items.filter((item: any) => item.type === type);
      return jsonResponse({ ...dataset.network, items });
    }, {
      module: 'country-control',
      action: 'network',
      allowedRoles: ALLOWED_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'GET' && matches(path, '/country/reports')) {
    return withEnhancedMiddleware(req, async (ctx) => {
      const dataset = await loadCountryDataset(ctx.supabaseAdmin, url.searchParams.get('country'));
      return jsonResponse(dataset.reports);
    }, {
      module: 'country-control',
      action: 'reports',
      allowedRoles: ALLOWED_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'POST' && matches(path, '/country/region/create')) {
    return withEnhancedMiddleware(req, async (ctx) => jsonResponse(await createRegion(ctx, ctx.body || {})), {
      module: 'country-control',
      action: 'region_create',
      allowedRoles: ALLOWED_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'POST' && matches(path, '/country/manager/assign')) {
    return withEnhancedMiddleware(req, async (ctx) => jsonResponse(await assignManager(ctx, ctx.body || {})), {
      module: 'country-control',
      action: 'manager_assign',
      allowedRoles: ALLOWED_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'POST' && matches(path, '/country/network/decision')) {
    return withEnhancedMiddleware(req, async (ctx) => jsonResponse(await takeNetworkDecision(ctx, ctx.body || {})), {
      module: 'country-control',
      action: 'network_decision',
      allowedRoles: ALLOWED_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'POST' && matches(path, '/country/incident/respond')) {
    return withEnhancedMiddleware(req, async (ctx) => jsonResponse(await respondIncident(ctx, ctx.body || {})), {
      module: 'country-control',
      action: 'incident_respond',
      allowedRoles: ALLOWED_ROLES,
      detectFraud: true,
    });
  }

  if (req.method === 'POST' && matches(path, '/country/self-heal')) {
    return withEnhancedMiddleware(req, async (ctx) => jsonResponse(await runSelfHeal(ctx, ctx.body || {})), {
      module: 'country-control',
      action: 'self_heal',
      allowedRoles: ALLOWED_ROLES,
      detectFraud: true,
    });
  }

  return errorResponse('Country control route not found', 404);
});