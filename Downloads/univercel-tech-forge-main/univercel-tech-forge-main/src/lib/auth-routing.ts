import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

export const ROLE_DASHBOARD_MAP: Partial<Record<AppRole, string>> = {
  boss_owner: '/app/control-center',
  master: '/app/control-center',
  super_admin: '/app/control-center',
  admin: '/app/control-center',
  ceo: '/app/control-center',
  country_head: '/super-admin-system/role-switch?role=country_head',
  area_manager: '/super-admin-system/role-switch?role=country_head',
  continent_super_admin: '/super-admin-system/role-switch?role=continent_super_admin',
  franchise: '/app/franchise',
  reseller: '/app/reseller',
  reseller_manager: '/app/reseller',
  influencer: '/app/influencer',
  developer: '/app/developer',
  server_manager: '/app/server',
  api_security: '/app/integrations',
  ai_manager: '/app/ai',
  r_and_d: '/rnd-dashboard',
  rnd_manager: '/rnd-dashboard',
  lead_manager: '/app/leads',
  marketing_manager: '/app/marketing',
  seo_manager: '/app/seo',
  client_success: '/app/support',
  performance_manager: '/app/analytics',
  support: '/app/support',
  safe_assist: '/safe-assist',
  assist_manager: '/assist-manager',
  promise_tracker: '/promise-tracker',
  promise_management: '/promise-management',
  demo_manager: '/demo-manager',
  product_demo_manager: '/product-demo-manager',
  task_manager: '/app/tasks',
  finance_manager: '/app/finance',
  hr_manager: '/hr',
  legal_compliance: '/app/legal',
  prime: '/prime',
  user: '/app/user',
  client: '/app/user',
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
    return '/app/user';
  }

  return ROLE_DASHBOARD_MAP[role] || '/app/user';
};