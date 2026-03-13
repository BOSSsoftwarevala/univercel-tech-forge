import { supabase } from '@/integrations/supabase/client';

export async function getAlertRules(tenantId: string) {
  return supabase.from('alert_rules').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false });
}

export async function createAlertRule(data: Record<string, any>, tenantId: string) {
  return supabase.from('alert_rules').insert({ ...data, tenant_id: tenantId }).select().single();
}

export async function updateAlertRule(id: string, data: Record<string, any>, tenantId: string) {
  return supabase.from('alert_rules').update(data).eq('id', id).eq('tenant_id', tenantId).select().single();
}

export async function deleteAlertRule(id: string, tenantId: string) {
  return supabase.from('alert_rules').delete().eq('id', id).eq('tenant_id', tenantId);
}

export async function getAlerts(tenantId: string, status?: string) {
  let query = supabase.from('alerts').select('*').eq('tenant_id', tenantId);
  if (status) query = query.eq('status', status);
  return query.order('created_at', { ascending: false });
}

export async function resolveAlert(id: string, tenantId: string) {
  return supabase.from('alerts').update({ status: 'resolved', resolved_at: new Date().toISOString() }).eq('id', id).eq('tenant_id', tenantId).select().single();
}

export async function getAnomalyLogs(tenantId: string) {
  return supabase.from('anomaly_logs').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false }).limit(200);
}
