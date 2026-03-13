import { supabase } from '@/integrations/supabase/client';

export async function getProductApiMappings(tenantId: string, productId?: string) {
  let query = supabase.from('product_api_mapping').select('*').eq('tenant_id', tenantId);
  if (productId) query = query.eq('product_id', productId);
  return query.order('created_at', { ascending: false });
}

export async function createProductApiMapping(data: Record<string, any>, tenantId: string) {
  return supabase.from('product_api_mapping').insert({ ...data, tenant_id: tenantId }).select().single();
}

export async function updateProductApiMapping(id: string, data: Record<string, any>, tenantId: string) {
  return supabase.from('product_api_mapping').update(data).eq('id', id).eq('tenant_id', tenantId).select().single();
}

export async function deleteProductApiMapping(id: string, tenantId: string) {
  return supabase.from('product_api_mapping').delete().eq('id', id).eq('tenant_id', tenantId);
}

export async function getProductApiUsage(tenantId: string, productId?: string) {
  let query = supabase.from('api_usage_logs').select('product_id, service_id, tokens_used, cost, created_at').eq('tenant_id', tenantId);
  if (productId) query = query.eq('product_id', productId);
  return query.order('created_at', { ascending: false }).limit(500);
}
