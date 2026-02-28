import { supabase } from '@/integrations/supabase/client';

export async function getAccessLogs(tenantId: string, limit = 200) {
  return supabase.from('api_access_logs').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false }).limit(limit);
}

export async function getAbuseEvents(tenantId: string) {
  return supabase.from('abuse_events').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false }).limit(200);
}

export async function blockUser(tenantId: string, userId: string, reason: string, adminId: string) {
  return supabase.from('audit_logs').insert({
    tenant_id: tenantId,
    user_id: adminId,
    action: 'block_user',
    entity_type: 'security',
    details: { blocked_user_id: userId, reason },
  });
}

export async function getIpWhitelist(tenantId: string) {
  return supabase.from('ip_whitelist').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false });
}

export async function addIpRule(tenantId: string, ip: string, description: string) {
  return supabase.from('ip_whitelist').insert({ tenant_id: tenantId, ip_address: ip, description }).select().single();
}

export async function removeIpRule(id: string, tenantId: string) {
  return supabase.from('ip_whitelist').delete().eq('id', id).eq('tenant_id', tenantId);
}

export async function getApiKeys(tenantId: string) {
  return supabase.from('api_keys').select('id, name, api_key_prefix, created_at, status').eq('user_id', tenantId).order('created_at', { ascending: false });
}

export async function rotateApiKey(id: string, tenantId: string) {
  return supabase.from('api_keys').update({ status: 'rotated' }).eq('id', id).eq('user_id', tenantId).select().single();
}

export async function getRateLimitEvents(tenantId: string) {
  return supabase.from('rate_limit_logs').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false }).limit(200);
}
