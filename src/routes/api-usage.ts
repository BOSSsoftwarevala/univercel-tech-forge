import { supabase } from '@/integrations/supabase/client';

export async function getApiUsage(tenantId: string, serviceId?: string, days = 30) {
  const since = new Date(Date.now() - days * 86400000).toISOString();
  let query = supabase.from('api_usage_logs').select('*').eq('tenant_id', tenantId).gte('created_at', since);
  if (serviceId) query = query.eq('service_id', serviceId);
  return query.order('created_at', { ascending: false });
}

export async function getUsageByService(tenantId: string) {
  return supabase
    .from('api_usage_logs')
    .select('service_id, tokens_used, cost, status, created_at')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(1000);
}

export async function getUsageByProduct(tenantId: string) {
  return supabase
    .from('api_usage_logs')
    .select('product_id, service_id, tokens_used, cost, created_at')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(1000);
}

export async function getFailureLogs(tenantId: string, serviceId?: string) {
  let query = supabase
    .from('api_usage_logs')
    .select('*')
    .eq('tenant_id', tenantId)
    .in('status', ['error', 'failed']);
  if (serviceId) query = query.eq('service_id', serviceId);
  return query.order('created_at', { ascending: false }).limit(200);
}

export async function getLatencyMetrics(tenantId: string, serviceId?: string) {
  let query = supabase
    .from('api_usage_logs')
    .select('service_id, latency_ms, created_at')
    .eq('tenant_id', tenantId);
  if (serviceId) query = query.eq('service_id', serviceId);
  return query.order('created_at', { ascending: false }).limit(500);
}
