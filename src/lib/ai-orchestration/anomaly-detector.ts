import { supabase } from '@/integrations/supabase/client';

export interface AnomalyMetrics {
  costSpike: number;
  latencySpike: number;
  errorRate: number;
}

export interface AnomalyLog {
  id: string;
  tenant_id: string;
  service_id: string;
  anomaly_type: string;
  risk_score: number;
  details: object;
  created_at: string;
}

const MAX_SPIKE_MULTIPLIER = 5;
const LATENCY_THRESHOLD_MS = 2000;
const COST_SPIKE_THRESHOLD = 1.5;
const ERROR_RATE_THRESHOLD = 0.1;

/**
 * Computes a 0–100 risk score from the provided metrics.
 * Each component is weighted: cost 40%, latency 30%, errors 30%.
 */
export function calculateRiskScore(metrics: AnomalyMetrics): number {
  const costComponent    = Math.min(metrics.costSpike * 40, 40);
  const latencyComponent = Math.min(metrics.latencySpike * 30, 30);
  const errorComponent   = Math.min(metrics.errorRate * 30, 30);
  return Math.round(costComponent + latencyComponent + errorComponent);
}

export async function detectAnomalies(tenantId: string, serviceId: string) {
  const windowStart = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const prevWindowStart = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  const [{ data: recentCosts }, { data: prevCosts }, { data: latency }, { data: failures }] =
    await Promise.all([
      supabase
        .from('cost_tracking')
        .select('actual_cost')
        .eq('tenant_id', tenantId)
        .eq('service_id', serviceId)
        .gte('created_at', windowStart),
      supabase
        .from('cost_tracking')
        .select('actual_cost')
        .eq('tenant_id', tenantId)
        .eq('service_id', serviceId)
        .gte('created_at', prevWindowStart)
        .lt('created_at', windowStart),
      supabase
        .from('latency_metrics')
        .select('latency_ms')
        .eq('tenant_id', tenantId)
        .eq('service_id', serviceId)
        .gte('measured_at', windowStart),
      supabase
        .from('api_failure_logs')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('service_id', serviceId)
        .gte('created_at', windowStart),
    ]);

  const recentTotal = (recentCosts ?? []).reduce((s, r) => s + (r.actual_cost ?? 0), 0);
  const prevTotal   = (prevCosts ?? []).reduce((s, r) => s + (r.actual_cost ?? 0), 0);
  const costSpike   = prevTotal > 0 ? Math.min(recentTotal / prevTotal, MAX_SPIKE_MULTIPLIER) : 0;

  const avgLatency = latency?.length
    ? (latency ?? []).reduce((s, r) => s + (r.latency_ms ?? 0), 0) / latency.length
    : 0;
  const latencySpike = avgLatency > LATENCY_THRESHOLD_MS
    ? Math.min(avgLatency / LATENCY_THRESHOLD_MS, MAX_SPIKE_MULTIPLIER)
    : 0;

  const totalCalls = (recentCosts?.length ?? 0) + (failures?.length ?? 0);
  const errorRate  = totalCalls > 0 ? Math.min((failures?.length ?? 0) / totalCalls, 1) : 0;

  const metrics: AnomalyMetrics = { costSpike, latencySpike, errorRate };
  const riskScore = calculateRiskScore(metrics);

  const anomalies: { type: string; riskScore: number; details: object }[] = [];

  if (costSpike > COST_SPIKE_THRESHOLD) {
    anomalies.push({
      type: 'cost_spike',
      riskScore,
      details: { costSpike, recentTotal, prevTotal, metrics },
    });
  }
  if (latencySpike > 0) {
    anomalies.push({
      type: 'latency_spike',
      riskScore,
      details: { latencySpike, avgLatency, metrics },
    });
  }
  if (errorRate > ERROR_RATE_THRESHOLD) {
    anomalies.push({
      type: 'high_error_rate',
      riskScore,
      details: { errorRate, failureCount: failures?.length ?? 0, totalCalls, metrics },
    });
  }

  for (const anomaly of anomalies) {
    await logAnomaly(tenantId, serviceId, anomaly.type, anomaly.riskScore, anomaly.details);
  }

  return { data: anomalies, metrics, riskScore, error: null };
}

export async function logAnomaly(
  tenantId: string,
  serviceId: string,
  anomalyType: string,
  riskScore: number,
  details: object
) {
  return supabase.from('anomaly_logs').insert({
    tenant_id: tenantId,
    service_id: serviceId,
    anomaly_type: anomalyType,
    risk_score: riskScore,
    details,
  }).select().single();
}

export async function getAnomalyLogs(tenantId: string, limit = 50) {
  return supabase
    .from('anomaly_logs')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(limit);
}

export async function triggerMitigation(
  tenantId: string,
  serviceId: string,
  action: 'pause' | 'reduce_rate' | 'switch_model'
) {
  if (action === 'pause') {
    const { data, error } = await supabase
      .from('api_services')
      .update({ is_paused: true })
      .eq('id', serviceId)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    await supabase.from('admin_action_logs').insert({
      tenant_id: tenantId,
      admin_id: tenantId,
      action: 'auto_pause_service',
      target: serviceId,
      reason: 'Anomaly mitigation triggered',
    });

    return { data, error };
  }

  if (action === 'reduce_rate') {
    const { data: svc } = await supabase
      .from('api_services')
      .select('daily_limit')
      .eq('id', serviceId)
      .eq('tenant_id', tenantId)
      .single();

    const newLimit = (svc?.daily_limit ?? 0) * 0.5;
    return supabase
      .from('api_services')
      .update({ daily_limit: newLimit })
      .eq('id', serviceId)
      .eq('tenant_id', tenantId)
      .select()
      .single();
  }

  if (action === 'switch_model') {
    const { data: svc } = await supabase
      .from('api_services')
      .select('provider')
      .eq('id', serviceId)
      .eq('tenant_id', tenantId)
      .single();

    const cheaper = findCheaperDowngrade(svc?.provider ?? '');
    if (!cheaper) return { data: null, error: new Error('No cheaper model available') };

    return supabase
      .from('api_services')
      .update({ provider: cheaper })
      .eq('id', serviceId)
      .eq('tenant_id', tenantId)
      .select()
      .single();
  }

  return { data: null, error: new Error(`Unknown mitigation action: ${action}`) };
}

function findCheaperDowngrade(model: string): string | null {
  const downgrades: Record<string, string> = {
    'gpt-4':           'gpt-4o',
    'gpt-4-turbo':     'gpt-4o',
    'gpt-4o':          'gpt-3.5-turbo',
    'claude-3-opus':   'claude-3-sonnet',
    'claude-3-sonnet': 'claude-3-haiku',
    'gemini-1.5-pro':  'gemini-1.5-flash',
    'mistral-large':   'mistral-medium',
  };
  return downgrades[model] ?? null;
}
