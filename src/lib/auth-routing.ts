import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

export const ROLE_DASHBOARD_MAP: Partial<Record<AppRole, string>> = {
  boss_owner: '/dashboard/boss',
  master: '/dashboard/boss',
  super_admin: '/dashboard/admin',
  admin: '/dashboard/admin',
  ceo: '/dashboard/boss',
  country_head: '/super-admin-system/role-switch?role=country_head',
  area_manager: '/super-admin-system/role-switch?role=country_head',
  continent_super_admin: '/super-admin-system/role-switch?role=continent_super_admin',
  franchise: '/franchise',
  reseller: '/reseller',
  reseller_manager: '/reseller',
  influencer: '/dashboard/influencer',
  developer: '/dashboard/developer',
  server_manager: '/server-manager',
  api_security: '/api-integrations',
  ai_manager: '/ai-console',
  r_and_d: '/rnd-dashboard',
  rnd_manager: '/rnd-dashboard',
  lead_manager: '/lead-manager',
  marketing_manager: '/marketing',
  seo_manager: '/seo',
  client_success: '/client-success',
  performance_manager: '/performance',
  support: '/support',
  safe_assist: '/safe-assist',
  assist_manager: '/assist-manager',
  promise_tracker: '/promise-tracker',
  promise_management: '/promise-management',
  demo_manager: '/demo-manager',
  product_demo_manager: '/product-demo-manager',
  task_manager: '/task-manager',
  finance_manager: '/finance',
  hr_manager: '/hr',
  legal_compliance: '/legal',
  prime: '/prime',
  user: '/dashboard/user',
  client: '/dashboard/user',
};

const ROLE_PRIORITY: AppRole[] = [
  'boss_owner',
  'master',
  'super_admin',
  'ceo',
  'admin',
  'continent_super_admin',
  'country_head',
  'area_manager',
  'server_manager',
  'ai_manager',
  'finance_manager',
  'lead_manager',
  'marketing_manager',
  'support',
  'franchise',
  'reseller',
  'developer',
  'prime',
  'influencer',
  'user',
  'client',
];

export const selectBestRole = (roles: AppRole[]): AppRole | null => {
  if (roles.length === 0) {
    return null;
  }

  for (const role of ROLE_PRIORITY) {
    if (roles.includes(role)) {
      return role;
    }
  }

  return roles[0];
};

export const getDashboardRouteForRole = (role: AppRole | null) => {
  if (!role) {
    return '/dashboard/user';
  }

  return ROLE_DASHBOARD_MAP[role] || '/dashboard/user';
};