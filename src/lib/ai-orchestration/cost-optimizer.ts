import { supabase } from '@/integrations/supabase/client';
import { MODEL_PRICING, estimateCost } from './cost-tracker';

interface Recommendation {
  serviceId: string;
  currentModel: string;
  suggestedModel: string;
  estimatedSavingsPercent: number;
  reason: string;
}

interface CostSimulation {
  currentModel: string;
  newModel: string;
  avgDailyTokens: number;
  currentDailyCost: number;
  newDailyCost: number;
  savingsPerDay: number;
  savingsPercent: number;
}

export async function getOptimizationRecommendations(
  tenantId: string
): Promise<{ data: Recommendation[]; error: any }> {
  const { data: services, error } = await supabase
    .from('api_services')
    .select('id, name, provider')
    .eq('tenant_id', tenantId)
    .eq('is_active', true);

  if (error) return { data: [], error };

  const { data: costRows } = await supabase
    .from('cost_tracking')
    .select('service_id, model, actual_cost')
    .eq('tenant_id', tenantId)
    .gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString());

  const recommendations: Recommendation[] = [];

  for (const svc of services ?? []) {
    const rows = (costRows ?? []).filter(r => r.service_id === svc.id);
    if (!rows.length) continue;

    const modelUsage: Record<string, { cost: number; count: number }> = {};
    for (const r of rows) {
      if (!r.model) continue;
      if (!modelUsage[r.model]) modelUsage[r.model] = { cost: 0, count: 0 };
      modelUsage[r.model].cost += r.actual_cost ?? 0;
      modelUsage[r.model].count += 1;
    }

    for (const [model, stats] of Object.entries(modelUsage)) {
      const cheaperAlternative = findCheaperModel(model);
      if (!cheaperAlternative) continue;

      const currentPrice = MODEL_PRICING[model] ?? 0;
      const newPrice = MODEL_PRICING[cheaperAlternative] ?? 0;
      const savingsPercent = currentPrice > 0
        ? Math.round(((currentPrice - newPrice) / currentPrice) * 100)
        : 0;

      if (savingsPercent >= 20) {
        recommendations.push({
          serviceId: svc.id,
          currentModel: model,
          suggestedModel: cheaperAlternative,
          estimatedSavingsPercent: savingsPercent,
          reason: `Switching from ${model} to ${cheaperAlternative} could save ~${savingsPercent}% based on last 7 days usage`,
        });
      }
    }
  }

  return { data: recommendations, error: null };
}

export async function switchModel(
  tenantId: string,
  serviceId: string,
  newModel: string,
  reason: string
) {
  const { data: current } = await supabase
    .from('api_services')
    .select('provider')
    .eq('id', serviceId)
    .eq('tenant_id', tenantId)
    .single();

  await supabase.from('config_change_logs').insert({
    tenant_id: tenantId,
    changed_by: tenantId,
    key: `service:${serviceId}:model`,
    old_value: current?.provider ?? '',
    new_value: newModel,
    changed_at: new Date().toISOString(),
  });

  return supabase
    .from('api_services')
    .update({ provider: newModel })
    .eq('id', serviceId)
    .eq('tenant_id', tenantId)
    .select()
    .single();
}

export async function rollbackModelSwitch(tenantId: string, serviceId: string) {
  const { data: log } = await supabase
    .from('config_change_logs')
    .select('old_value')
    .eq('tenant_id', tenantId)
    .eq('key', `service:${serviceId}:model`)
    .order('changed_at', { ascending: false })
    .limit(1)
    .single();

  if (!log?.old_value) return { data: null, error: new Error('No previous model found to roll back to') };

  return supabase
    .from('api_services')
    .update({ provider: log.old_value })
    .eq('id', serviceId)
    .eq('tenant_id', tenantId)
    .select()
    .single();
}

export function simulateCostChange(
  currentModel: string,
  newModel: string,
  avgDailyTokens: number
): CostSimulation {
  const currentDailyCost = estimateCost(currentModel, avgDailyTokens);
  const newDailyCost = estimateCost(newModel, avgDailyTokens);
  const savingsPerDay = currentDailyCost - newDailyCost;
  const savingsPercent = currentDailyCost > 0
    ? Math.round((savingsPerDay / currentDailyCost) * 100)
    : 0;

  return {
    currentModel,
    newModel,
    avgDailyTokens,
    currentDailyCost,
    newDailyCost,
    savingsPerDay,
    savingsPercent,
  };
}

export async function getModelSwitchHistory(tenantId: string, serviceId: string) {
  return supabase
    .from('config_change_logs')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('key', `service:${serviceId}:model`)
    .order('changed_at', { ascending: false });
}

function findCheaperModel(model: string): string | null {
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
