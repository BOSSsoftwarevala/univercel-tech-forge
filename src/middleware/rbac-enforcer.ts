import { supabase } from '@/integrations/supabase/client';

export type AppRole =
  | 'super_admin'
  | 'tenant_admin'
  | 'boss'
  | 'product_manager'
  | 'developer'
  | 'reseller'
  | 'franchise'
  | 'user'
  | 'support'
  | 'finance';

export interface RBACContext {
  userId: string;
  tenantId: string;
  role: AppRole;
}

export const ROLE_PERMISSIONS: Record<string, AppRole[]> = {
  'api_service:create': ['super_admin'],
  'api_service:read': ['super_admin', 'tenant_admin', 'boss', 'product_manager', 'developer'],
  'api_service:update': ['super_admin', 'tenant_admin'],
  'api_service:delete': ['super_admin'],
  'wallet:read': ['super_admin', 'tenant_admin', 'boss', 'finance'],
  'wallet:write': ['super_admin', 'boss', 'finance'],
  'wallet:lock': ['super_admin', 'boss'],
  'billing:read': ['super_admin', 'tenant_admin', 'boss', 'finance'],
  'billing:write': ['super_admin', 'boss', 'finance'],
  'alert:read': ['super_admin', 'tenant_admin', 'boss', 'support'],
  'alert:write': ['super_admin', 'boss'],
  'emergency:kill': ['super_admin', 'boss'],
  'emergency:resume': ['super_admin', 'boss'],
  'audit:read': ['super_admin', 'boss', 'support'],
  'audit:export': ['super_admin', 'boss'],
  'security:read': ['super_admin', 'boss', 'support'],
  'security:block': ['super_admin', 'boss'],
  'role:config': ['super_admin', 'tenant_admin'],
  'settings:read': ['super_admin', 'tenant_admin', 'boss'],
  'settings:write': ['super_admin', 'tenant_admin'],
  'usage:read': [
    'super_admin', 'tenant_admin', 'boss', 'product_manager', 'developer',
    'reseller', 'franchise', 'user', 'support',
  ],
  'optimizer:read': ['super_admin', 'boss'],
  'optimizer:execute': ['super_admin', 'boss'],
};

export function checkPermission(ctx: RBACContext, permission: string): boolean {
  const allowed = ROLE_PERMISSIONS[permission];
  if (!allowed) return false;
  return allowed.includes(ctx.role);
}

export function requirePermission(ctx: RBACContext, permission: string): void {
  if (!checkPermission(ctx, permission)) {
    throw new Error(`Access denied: role '${ctx.role}' does not have permission '${permission}'`);
  }
}

export function getRolePermissions(role: AppRole): string[] {
  return Object.entries(ROLE_PERMISSIONS)
    .filter(([, roles]) => roles.includes(role))
    .map(([permission]) => permission);
}

export async function getCurrentUserContext(): Promise<RBACContext | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const meta = user.user_metadata ?? {};
  const role = (meta.role ?? 'user') as AppRole;
  const tenantId = meta.tenant_id ?? '';

  return { userId: user.id, tenantId, role };
}
