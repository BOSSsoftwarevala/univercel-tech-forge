import { supabase } from '@/integrations/supabase/client';

export async function getBillingRecords(tenantId: string) {
  return supabase.from('billing_records').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false });
}

export async function getInvoices(tenantId: string) {
  return supabase.from('invoices').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false });
}

export async function createInvoice(tenantId: string, billingRecordId: string) {
  return supabase.from('invoices').insert({ tenant_id: tenantId, billing_record_id: billingRecordId, status: 'pending', created_at: new Date().toISOString() }).select().single();
}

export async function getBillingByApi(tenantId: string, serviceId: string) {
  return supabase.from('billing_records').select('*').eq('tenant_id', tenantId).eq('service_id', serviceId).order('created_at', { ascending: false });
}

export async function getBillingByProduct(tenantId: string, productId: string) {
  return supabase.from('billing_records').select('*').eq('tenant_id', tenantId).eq('product_id', productId).order('created_at', { ascending: false });
}

export async function getBillingByRole(tenantId: string, roleName: string) {
  return supabase.from('billing_records').select('*').eq('tenant_id', tenantId).eq('role_name', roleName).order('created_at', { ascending: false });
}

export async function generateBillingSnapshot(tenantId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { data: usage, error } = await supabase
    .from('api_usage_logs')
    .select('service_id, tokens_used, cost')
    .eq('tenant_id', tenantId)
    .gte('created_at', startOfMonth);

  if (error) return { data: null, error };

  const aggregated: Record<string, { tokens: number; cost: number }> = {};
  for (const row of usage ?? []) {
    const key = row.service_id ?? 'unknown';
    if (!aggregated[key]) aggregated[key] = { tokens: 0, cost: 0 };
    aggregated[key].tokens += row.tokens_used ?? 0;
    aggregated[key].cost += row.cost ?? 0;
  }

  return { data: aggregated, error: null };
}
