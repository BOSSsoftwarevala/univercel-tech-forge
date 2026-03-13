/**
 * API Usage & Cost Tracker
 * Logs every AI/API call with tokens, cost, duration, and status.
 * Provides monthly aggregation and cost-threshold alerting.
 */

import { supabase } from '@/integrations/supabase/client';

export interface UsageRecord {
  serviceId: string;
  tenantId?: string;
  userId?: string;
  endpoint: string;
  requestTokens?: number;
  responseTokens?: number;
  costAmount?: number;
  status: 'success' | 'failed' | 'rate_limited' | 'fallback_used';
  fallbackServiceId?: string;
  errorMessage?: string;
  responseTimeMs?: number;
}

export interface MonthlyCostSummary {
  serviceId: string;
  serviceName?: string;
  totalCost: number;
  totalCalls: number;
  successCalls: number;
  failedCalls: number;
  month: string; // e.g. '2026-02'
}

export interface CostAlert {
  serviceId: string;
  serviceName?: string;
  currentCost: number;
  maxMonthlyCost: number;
  thresholdPercent: number;
  level: 'warn_75' | 'warn_90' | 'exceeded_100';
}

/**
 * Log a single API service call.
 */
export async function logUsage(record: UsageRecord): Promise<void> {
  const { error } = await supabase.from('api_service_usage').insert({
    service_id: record.serviceId,
    tenant_id: record.tenantId ?? null,
    user_id: record.userId ?? null,
    endpoint: record.endpoint,
    request_tokens: record.requestTokens ?? null,
    response_tokens: record.responseTokens ?? null,
    cost_amount: record.costAmount ?? null,
    status: record.status,
    fallback_service_id: record.fallbackServiceId ?? null,
    error_message: record.errorMessage ?? null,
    response_time_ms: record.responseTimeMs ?? null,
  });

  if (error) {
    console.warn('[UsageTracker] Failed to log usage:', error.message);
  }
}

/**
 * Get monthly cost summary per service (for the current calendar month).
 */
export async function getMonthlyCostSummary(
  tenantId?: string
): Promise<MonthlyCostSummary[]> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();

  let query = supabase
    .from('api_service_usage')
    .select('service_id, cost_amount, status')
    .gte('created_at', monthStart)
    .lte('created_at', monthEnd);

  if (tenantId) {
    query = query.eq('tenant_id', tenantId);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  const map = new Map<string, MonthlyCostSummary>();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  for (const row of data) {
    if (!row.service_id) continue;
    const entry = map.get(row.service_id) ?? {
      serviceId: row.service_id,
      totalCost: 0,
      totalCalls: 0,
      successCalls: 0,
      failedCalls: 0,
      month,
    };
    entry.totalCost += Number(row.cost_amount ?? 0);
    entry.totalCalls += 1;
    if (row.status === 'success') entry.successCalls += 1;
    if (row.status === 'failed') entry.failedCalls += 1;
    map.set(row.service_id, entry);
  }

  return Array.from(map.values());
}

/**
 * Check cost thresholds and return active alerts for all services.
 */
export async function checkCostAlerts(): Promise<CostAlert[]> {
  const { data: services, error } = await supabase
    .from('api_services')
    .select('id, service_name, max_monthly_cost')
    .eq('status', 'active')
    .not('max_monthly_cost', 'is', null);

  if (error || !services) return [];

  const summaries = await getMonthlyCostSummary();
  const summaryMap = new Map(summaries.map(s => [s.serviceId, s]));

  const alerts: CostAlert[] = [];

  for (const svc of services) {
    const maxCost = Number(svc.max_monthly_cost);
    if (!maxCost) continue;
    const summary = summaryMap.get(svc.id);
    const currentCost = summary?.totalCost ?? 0;
    const ratio = currentCost / maxCost;

    let level: CostAlert['level'] | null = null;
    if (ratio >= 1.0) level = 'exceeded_100';
    else if (ratio >= 0.9) level = 'warn_90';
    else if (ratio >= 0.75) level = 'warn_75';

    if (level) {
      alerts.push({
        serviceId: svc.id,
        serviceName: svc.service_name,
        currentCost,
        maxMonthlyCost: maxCost,
        thresholdPercent: Math.round(ratio * 100),
        level,
      });
    }
  }

  return alerts;
}

/**
 * Get detailed usage logs (paginated).
 */
export async function getUsageDetails(opts: {
  serviceId?: string;
  tenantId?: string;
  page?: number;
  pageSize?: number;
}) {
  const { serviceId, tenantId, page = 1, pageSize = 50 } = opts;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('api_service_usage')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (serviceId) query = query.eq('service_id', serviceId);
  if (tenantId) query = query.eq('tenant_id', tenantId);

  const { data, count, error } = await query;
  return { data: data ?? [], count: count ?? 0, error };
}
