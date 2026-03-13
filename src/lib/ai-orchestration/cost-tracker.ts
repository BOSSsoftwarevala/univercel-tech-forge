import { supabase } from '@/integrations/supabase/client';

/** Per-token cost in USD for common AI models. */
export const MODEL_PRICING: Record<string, number> = {
  'gpt-4o':              0.000005,
  'gpt-4-turbo':         0.00001,
  'gpt-4':               0.00003,
  'gpt-3.5-turbo':       0.000001,
  'claude-3-opus':       0.000015,
  'claude-3-sonnet':     0.000003,
  'claude-3-haiku':      0.0000025,
  'gemini-1.5-pro':      0.0000035,
  'gemini-1.5-flash':    0.00000075,
  'mistral-large':       0.000004,
  'mistral-medium':      0.0000027,
};

const DEFAULT_TOKEN_COST = 0.000002;

export async function trackApiCost(
  tenantId: string,
  serviceId: string,
  tokensUsed: number,
  model: string,
  cost: number
) {
  return supabase.from('cost_tracking').insert({
    tenant_id: tenantId,
    service_id: serviceId,
    estimated_cost: estimateCost(model, tokensUsed),
    actual_cost: cost,
    model,
  }).select().single();
}

/** Estimates cost based on model pricing and estimated token count. */
export function estimateCost(model: string, tokensEstimated: number): number {
  const pricePerToken = MODEL_PRICING[model] ?? DEFAULT_TOKEN_COST;
  return pricePerToken * tokensEstimated;
}

export async function getCostSummary(tenantId: string, period: 'day' | 'week' | 'month') {
  return supabase
    .from('cost_tracking')
    .select('model, actual_cost, estimated_cost, created_at')
    .eq('tenant_id', tenantId)
    .gte('created_at', new Date(Date.now() - parsePeriodMs(period)).toISOString())
    .order('created_at', { ascending: false });
}

export async function getServiceCosts(tenantId: string, serviceId: string, days = 30) {
  const since = new Date(Date.now() - days * 86400000).toISOString();
  return supabase
    .from('cost_tracking')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('service_id', serviceId)
    .gte('created_at', since)
    .order('created_at', { ascending: false });
}

export async function getDailyCostBreakdown(tenantId: string, days = 30) {
  const since = new Date(Date.now() - days * 86400000).toISOString();
  return supabase
    .from('cost_tracking')
    .select('actual_cost, model, created_at, service_id')
    .eq('tenant_id', tenantId)
    .gte('created_at', since)
    .order('created_at', { ascending: true });
}

export async function checkBudgetLimits(
  tenantId: string,
  serviceId: string,
  estimatedCost: number
): Promise<{ allowed: boolean; reason?: string }> {
  const { data: service } = await supabase
    .from('api_services')
    .select('daily_limit, monthly_limit, is_paused, is_active')
    .eq('id', serviceId)
    .eq('tenant_id', tenantId)
    .single();

  if (!service) return { allowed: false, reason: 'Service not found' };
  if (!service.is_active) return { allowed: false, reason: 'Service is inactive' };
  if (service.is_paused) return { allowed: false, reason: 'Service is paused' };

  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  const monthStart = new Date(dayStart.getFullYear(), dayStart.getMonth(), 1);

  const [{ data: dailyRows }, { data: monthlyRows }] = await Promise.all([
    supabase
      .from('cost_tracking')
      .select('actual_cost')
      .eq('tenant_id', tenantId)
      .eq('service_id', serviceId)
      .gte('created_at', dayStart.toISOString()),
    supabase
      .from('cost_tracking')
      .select('actual_cost')
      .eq('tenant_id', tenantId)
      .eq('service_id', serviceId)
      .gte('created_at', monthStart.toISOString()),
  ]);

  const dailySpend = (dailyRows ?? []).reduce((s, r) => s + (r.actual_cost ?? 0), 0);
  const monthlySpend = (monthlyRows ?? []).reduce((s, r) => s + (r.actual_cost ?? 0), 0);

  if (service.daily_limit > 0 && dailySpend + estimatedCost > service.daily_limit) {
    return { allowed: false, reason: 'Daily budget limit exceeded' };
  }
  if (service.monthly_limit > 0 && monthlySpend + estimatedCost > service.monthly_limit) {
    return { allowed: false, reason: 'Monthly budget limit exceeded' };
  }

  return { allowed: true };
}

function parsePeriodMs(period: 'day' | 'week' | 'month'): number {
  if (period === 'day') return 86400000;
  if (period === 'week') return 7 * 86400000;
  return 30 * 86400000;
}
