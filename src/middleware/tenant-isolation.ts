import { supabase } from '@/integrations/supabase/client';

export function withTenantFilter<T>(query: any, tenantId: string): any {
  return query.eq('tenant_id', tenantId);
}

export async function validateTenantAccess(userId: string, tenantId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .eq('tenant_id', tenantId)
    .maybeSingle();
  if (error) return false;
  return data !== null;
}

export async function getCurrentTenantId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return user.user_metadata?.tenant_id ?? null;
}

export function assertSameTenant(userTenantId: string, resourceTenantId: string): void {
  if (userTenantId !== resourceTenantId) {
    throw new Error('Tenant mismatch: access to resource from a different tenant is not allowed');
  }
}
