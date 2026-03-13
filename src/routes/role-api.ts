import { supabase } from '@/integrations/supabase/client';

export async function getRoleApiPermissions(tenantId: string, roleName?: string) {
  let query = supabase.from('role_api_permissions').select('*').eq('tenant_id', tenantId);
  if (roleName) query = query.eq('role_name', roleName);
  return query.order('role_name');
}

export async function updateRolePermission(id: string, data: Record<string, any>, tenantId: string) {
  return supabase.from('role_api_permissions').update(data).eq('id', id).eq('tenant_id', tenantId).select().single();
}

export async function createRolePermission(data: Record<string, any>, tenantId: string) {
  return supabase.from('role_api_permissions').insert({ ...data, tenant_id: tenantId }).select().single();
}

export async function getRoleUsageTracking(tenantId: string, roleName?: string) {
  let query = supabase.from('api_usage_logs').select('role_name, service_id, tokens_used, cost, created_at').eq('tenant_id', tenantId);
  if (roleName) query = query.eq('role_name', roleName);
  return query.order('created_at', { ascending: false }).limit(500);
}
