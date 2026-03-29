import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

/**
 * RBAC Module Configuration
 * Each entry defines a module available under /app/<id>.
 * `allowedRoles` is the minimal set; boss_owner/master always bypass.
 * `priority` controls which module is selected as the default when visiting /app.
 */
export interface AppModule {
  id: string;
  path: string;
  label: string;
  icon?: string;
  allowedRoles: AppRole[];
  /** Lower number = higher priority for default redirect */
  priority: number;
}

export const APP_MODULES: AppModule[] = [
  {
    id: 'control-center',
    path: '/app/control-center',
    label: 'Control Center',
    allowedRoles: ['boss_owner', 'master', 'super_admin', 'ceo', 'admin'],
    priority: 1,
  },
  {
    id: 'finance',
    path: '/app/finance',
    label: 'Finance',
    allowedRoles: ['finance_manager', 'boss_owner', 'master', 'super_admin', 'ceo'],
    priority: 2,
  },
  {
    id: 'leads',
    path: '/app/leads',
    label: 'Lead Manager',
    allowedRoles: ['lead_manager', 'boss_owner', 'master', 'super_admin', 'ceo'],
    priority: 3,
  },
  {
    id: 'sales',
    path: '/app/sales',
    label: 'Sales',
    allowedRoles: ['support', 'boss_owner', 'master', 'super_admin', 'ceo'],
    priority: 4,
  },
  {
    id: 'support',
    path: '/app/support',
    label: 'Support',
    allowedRoles: ['support', 'client_success', 'boss_owner', 'master', 'super_admin'],
    priority: 5,
  },
  {
    id: 'marketplace',
    path: '/app/marketplace',
    label: 'Marketplace',
    allowedRoles: ['boss_owner', 'master', 'super_admin', 'marketing_manager'],
    priority: 6,
  },
  {
    id: 'licenses',
    path: '/app/licenses',
    label: 'Licenses',
    allowedRoles: ['boss_owner', 'master', 'super_admin', 'finance_manager'],
    priority: 7,
  },
  {
    id: 'analytics',
    path: '/app/analytics',
    label: 'Analytics',
    allowedRoles: ['boss_owner', 'master', 'super_admin', 'ceo', 'performance_manager'],
    priority: 8,
  },
  {
    id: 'notifications',
    path: '/app/notifications',
    label: 'Notifications',
    allowedRoles: ['boss_owner', 'master', 'super_admin'],
    priority: 9,
  },
  {
    id: 'integrations',
    path: '/app/integrations',
    label: 'Integrations',
    allowedRoles: ['boss_owner', 'master', 'super_admin', 'api_security'],
    priority: 10,
  },
  {
    id: 'audit',
    path: '/app/audit',
    label: 'Audit Logs',
    allowedRoles: ['boss_owner', 'master', 'super_admin'],
    priority: 11,
  },
  {
    id: 'server',
    path: '/app/server',
    label: 'Server Manager',
    allowedRoles: ['server_manager', 'boss_owner', 'master'],
    priority: 12,
  },
  {
    id: 'ai',
    path: '/app/ai',
    label: 'AI Console',
    allowedRoles: ['ai_manager', 'boss_owner', 'master'],
    priority: 13,
  },
  {
    id: 'marketing',
    path: '/app/marketing',
    label: 'Marketing',
    allowedRoles: ['marketing_manager', 'boss_owner', 'master', 'super_admin'],
    priority: 14,
  },
  {
    id: 'seo',
    path: '/app/seo',
    label: 'SEO',
    allowedRoles: ['seo_manager', 'boss_owner', 'master', 'super_admin'],
    priority: 15,
  },
  {
    id: 'legal',
    path: '/app/legal',
    label: 'Legal',
    allowedRoles: ['legal_compliance', 'boss_owner', 'master'],
    priority: 16,
  },
  {
    id: 'tasks',
    path: '/app/tasks',
    label: 'Tasks',
    allowedRoles: ['task_manager', 'boss_owner', 'master', 'super_admin', 'ceo', 'performance_manager'],
    priority: 17,
  },
  {
    id: 'franchise',
    path: '/app/franchise',
    label: 'Franchise',
    allowedRoles: ['franchise', 'boss_owner', 'super_admin'],
    priority: 18,
  },
  {
    id: 'reseller',
    path: '/app/reseller',
    label: 'Reseller',
    allowedRoles: ['reseller', 'reseller_manager', 'boss_owner', 'super_admin'],
    priority: 19,
  },
  {
    id: 'influencer',
    path: '/app/influencer',
    label: 'Influencer',
    allowedRoles: ['influencer', 'boss_owner', 'super_admin'],
    priority: 20,
  },
  {
    id: 'developer',
    path: '/app/developer',
    label: 'Developer',
    allowedRoles: ['developer', 'boss_owner', 'super_admin'],
    priority: 21,
  },
  {
    id: 'user',
    path: '/app/user',
    label: 'My Dashboard',
    allowedRoles: ['user', 'client', 'prime', 'boss_owner', 'master', 'super_admin'],
    priority: 22,
  },
];

/**
 * Returns true if the given role has access to the module.
 * boss_owner and master always have access.
 */
export const canAccessModule = (role: AppRole | null, moduleId: string): boolean => {
  if (!role) return false;
  if (role === 'boss_owner' || role === 'master') return true;
  const mod = APP_MODULES.find((m) => m.id === moduleId);
  if (!mod) return false;
  return mod.allowedRoles.includes(role);
};

/**
 * Returns the first module the given role can access, sorted by priority.
 */
export const getBestModuleForRole = (role: AppRole | null): AppModule | null => {
  if (!role) return null;
  const sorted = [...APP_MODULES].sort((a, b) => a.priority - b.priority);
  return sorted.find((m) => canAccessModule(role, m.id)) ?? null;
};
