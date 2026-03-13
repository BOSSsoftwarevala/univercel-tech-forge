import { supabase } from '@/integrations/supabase/client';

export async function getLimits(tenantId: string) {
  return supabase.from('service_limits').select('*').eq('tenant_id', tenantId);
}

export async function updateLimits(tenantId: string, serviceId: string, limits: Record<string, any>) {
  const { data: existing } = await supabase.from('service_limits').select('id').eq('tenant_id', tenantId).eq('service_id', serviceId).maybeSingle();
  if (existing) {
    return supabase.from('service_limits').update(limits).eq('tenant_id', tenantId).eq('service_id', serviceId).select().single();
  }
  return supabase.from('service_limits').insert({ tenant_id: tenantId, service_id: serviceId, ...limits }).select().single();
}

export async function getThresholds(tenantId: string) {
  return supabase.from('alert_thresholds').select('*').eq('tenant_id', tenantId);
}

export async function updateThresholds(tenantId: string, metric: string, warning: number, critical: number) {
  const { data: existing } = await supabase.from('alert_thresholds').select('id').eq('tenant_id', tenantId).eq('metric', metric).maybeSingle();
  if (existing) {
    return supabase.from('alert_thresholds').update({ warning_threshold: warning, critical_threshold: critical }).eq('tenant_id', tenantId).eq('metric', metric).select().single();
  }
  return supabase.from('alert_thresholds').insert({ tenant_id: tenantId, metric, warning_threshold: warning, critical_threshold: critical }).select().single();
}

export async function getNotificationPrefs(tenantId: string, userId: string) {
  return supabase.from('notification_preferences').select('*').eq('tenant_id', tenantId).eq('user_id', userId).maybeSingle();
}

export async function updateNotificationPrefs(tenantId: string, userId: string, prefs: Record<string, any>) {
  const { data: existing } = await supabase.from('notification_preferences').select('id').eq('tenant_id', tenantId).eq('user_id', userId).maybeSingle();
  if (existing) {
    return supabase.from('notification_preferences').update(prefs).eq('tenant_id', tenantId).eq('user_id', userId).select().single();
  }
  return supabase.from('notification_preferences').insert({ tenant_id: tenantId, user_id: userId, ...prefs }).select().single();
}

export async function getConfigHistory(tenantId: string) {
  return supabase.from('audit_logs').select('*').eq('tenant_id', tenantId).in('action', ['update_limits', 'update_thresholds', 'update_notification_prefs', 'settings:write']).order('created_at', { ascending: false }).limit(100);
}
