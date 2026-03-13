import { supabase } from '@/integrations/supabase/client';

export async function getApiServices(tenantId: string) {
  return supabase.from('api_services').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false });
}

export async function getApiServiceById(id: string, tenantId: string) {
  return supabase.from('api_services').select('*').eq('id', id).eq('tenant_id', tenantId).single();
}

export async function createApiService(data: Record<string, any>, tenantId: string) {
  return supabase.from('api_services').insert({ ...data, tenant_id: tenantId }).select().single();
}

export async function updateApiService(id: string, data: Record<string, any>, tenantId: string) {
  return supabase.from('api_services').update(data).eq('id', id).eq('tenant_id', tenantId).select().single();
}

export async function pauseApiService(id: string, tenantId: string) {
  return supabase.from('api_services').update({ is_active: false, status: 'paused' }).eq('id', id).eq('tenant_id', tenantId).select().single();
}

export async function resumeApiService(id: string, tenantId: string) {
  return supabase.from('api_services').update({ is_active: true, status: 'active' }).eq('id', id).eq('tenant_id', tenantId).select().single();
}

export async function deleteApiService(id: string, tenantId: string) {
  return supabase.from('api_services').delete().eq('id', id).eq('tenant_id', tenantId);
}

export async function getServiceHealthStatus(serviceId: string, tenantId: string) {
  const { data, error } = await supabase
    .from('api_usage_logs')
    .select('status, created_at')
    .eq('service_id', serviceId)
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) return { data: null, error };

  const logs = data ?? [];
  const total = logs.length;
  const failed = logs.filter(l => l.status === 'error' || l.status === 'failed').length;
  const healthy = total === 0 || failed / total < 0.1;

  return { data: { healthy, total, failed }, error: null };
}
