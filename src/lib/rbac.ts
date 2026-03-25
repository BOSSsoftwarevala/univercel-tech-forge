// ==============================================
// RBAC (Role-Based Access Control) Core Module
// ==============================================
// This module provides centralized role management
// and access control logic for the entire application.

import { Database } from '@/integrations/supabase/types';

export type AppRole = Database['public']['Enums']['app_role'];

// Complete role hierarchy with numeric levels for comparison
// NOTE: master and super_admin merged into boss_owner
export const ROLE_HIERARCHY: Partial<Record<AppRole, number>> = {
  boss_owner: 110, // Boss Owner - highest level (merged master + super_admin)
  ceo: 105, // CEO - below Boss Owner
  server_manager: 95, // Infrastructure control - below CEO, above Area Manager
  area_manager: 90, // Now redirects to Country Head dashboard
  finance_manager: 85,
  legal_compliance: 80,
  hr_manager: 75,
  performance_manager: 70,
  rnd_manager: 65,
  r_and_d: 65, // Alias
  marketing_manager: 60,
  demo_manager: 55,
  task_manager: 50,
  lead_manager: 45,
  seo_manager: 40,
  client_success: 35,
  ai_manager: 30,
  api_security: 28, // API Security role
  support: 25,
  // New roles (25-28)
  safe_assist: 24, // Role 25 - AI-monitored remote support
  assist_manager: 23, // Role 26 - Manages Safe Assist agents
  promise_tracker: 22, // Role 27 - Developer promise monitoring
  promise_management: 21, // Role 28 - Organizational commitments
  franchise: 20,
  reseller: 15,
  developer: 12,
  influencer: 10,
  prime: 8,
  client: 5,
};

// Roles requiring IP lock enforcement
export const IP_LOCKED_ROLES: AppRole[] = ['franchise', 'reseller', 'prime', 'developer'];

// Roles requiring KYC verification
export const KYC_REQUIRED_ROLES: AppRole[] = ['franchise', 'reseller', 'developer', 'influencer'];

// Roles requiring active subscription
export const SUBSCRIPTION_REQUIRED_ROLES: AppRole[] = ['franchise', 'reseller', 'prime'];

// Masked ID configuration by role (digit counts)
// NOTE: master and super_admin merged into boss_owner
export const MASKED_ID_CONFIG: Record<string, { 
  prefix: string; 
  digits: number; 
  icon: string;
  displayName: string;
}> = {
  boss_owner: { prefix: '👑 BOSS', digits: 1, icon: 'Crown', displayName: 'Boss Owner' },
  ceo: { prefix: '🔱 CEO', digits: 2, icon: 'Crown', displayName: 'CEO' },
  server_manager: { prefix: 'SRV', digits: 2, icon: 'Server', displayName: 'Server Manager' },
  area_manager: { prefix: 'CTH', digits: 2, icon: 'MapPin', displayName: 'Country Head' }, // Merged
  task_manager: { prefix: 'EMP', digits: 3, icon: 'ListTodo', displayName: 'Task Manager' },
  rnd_manager: { prefix: 'EMP', digits: 3, icon: 'Lightbulb', displayName: 'R&D Manager' },
  r_and_d: { prefix: 'EMP', digits: 3, icon: 'Lightbulb', displayName: 'R&D' },
  hr_manager: { prefix: 'EMP', digits: 3, icon: 'UserPlus', displayName: 'HR Manager' },
  legal_compliance: { prefix: 'EMP', digits: 3, icon: 'Scale', displayName: 'Legal' },
  ai_manager: { prefix: 'EMP', digits: 3, icon: 'Bot', displayName: 'AI Manager' },
  api_security: { prefix: 'SEC', digits: 3, icon: 'Shield', displayName: 'API Security' },
  // New roles (25-28)
  safe_assist: { prefix: 'SFA', digits: 4, icon: 'ShieldCheck', displayName: 'Safe Assist' },
  assist_manager: { prefix: 'ASM', digits: 4, icon: 'Headphones', displayName: 'Assist Manager' },
  promise_tracker: { prefix: 'PTK', digits: 4, icon: 'Timer', displayName: 'Promise Tracker' },
  promise_management: { prefix: 'PMT', digits: 4, icon: 'FileCheck', displayName: 'Promise Management' },
  franchise: { prefix: 'FRN', digits: 4, icon: 'Building2', displayName: 'Franchise' },
  reseller: { prefix: 'RSL', digits: 5, icon: 'ShoppingBag', displayName: 'Reseller' },
  lead_manager: { prefix: 'SLS', digits: 5, icon: 'Target', displayName: 'Lead Manager' },
  support: { prefix: 'SUP', digits: 5, icon: 'Headphones', displayName: 'Support' },
  client_success: { prefix: 'SUP', digits: 5, icon: 'HeartHandshake', displayName: 'Client Success' },
  finance_manager: { prefix: 'FIN', digits: 5, icon: 'Wallet', displayName: 'Finance Manager' },
  performance_manager: { prefix: 'PFM', digits: 5, icon: 'TrendingUp', displayName: 'Performance Manager' },
  demo_manager: { prefix: 'DMO', digits: 5, icon: 'Monitor', displayName: 'Demo Manager' },
  seo_manager: { prefix: 'SEO', digits: 5, icon: 'Search', displayName: 'SEO Manager' },
  marketing_manager: { prefix: 'MKT', digits: 5, icon: 'Megaphone', displayName: 'Marketing Manager' },
  influencer: { prefix: 'INF', digits: 5, icon: 'Star', displayName: 'Influencer' },
  general: { prefix: 'GEN', digits: 6, icon: 'Users', displayName: 'General' },
  guest: { prefix: 'GEN', digits: 6, icon: 'Users', displayName: 'Guest' },
  client: { prefix: 'GEN', digits: 6, icon: 'User', displayName: 'Client' },
  prime: { prefix: '⭐ PRM', digits: 7, icon: 'Star', displayName: 'Prime' },
  common: { prefix: 'USR', digits: 8, icon: 'User', displayName: 'User' },
};

// Route access mapping for all roles
// NOTE: master and super_admin merged into boss_owner
export const ROLE_ROUTES: Partial<Record<AppRole, string[]>> = {
  boss_owner: ['*'], // Boss Owner has full access to everything
  ceo: ['*'], // CEO has full access
  server_manager: ['/server-manager', '/server-manager/*'], // Infrastructure only - no business data
  area_manager: ['/super-admin-system/role-switch', '/country-head/*'], // Redirects to Country Head
  developer: ['/developer', '/tasks', '/settings'],
  franchise: ['/franchise', '/leads', '/resellers', '/settings'],
  reseller: ['/reseller', '/leads', '/settings'],
  influencer: ['/influencer', '/links', '/analytics', '/settings'],
  prime: ['/prime', '/support', '/demos', '/settings'],
  client: ['/prime', '/support', '/settings'],
  seo_manager: ['/seo', '/keywords', '/analytics', '/settings'],
  lead_manager: ['/leads', '/pipeline', '/analytics', '/settings'],
  task_manager: ['/tasks', '/developers', '/performance', '/settings'],
  demo_manager: ['/demos', '/products', '/health', '/settings'],
  rnd_manager: ['/rnd', '/suggestions', '/roadmap', '/settings'],
  r_and_d: ['/rnd', '/suggestions', '/roadmap', '/settings'],
  client_success: ['/clients', '/satisfaction', '/support', '/settings'],
  performance_manager: ['/performance', '/developers', '/escalations', '/settings'],
  finance_manager: ['/finance', '/wallets', '/payouts', '/reports', '/settings'],
  marketing_manager: ['/marketing', '/campaigns', '/influencers', '/settings'],
  legal_compliance: ['/legal', '/documents', '/compliance', '/settings'],
  hr_manager: ['/hr', '/hiring', '/onboarding', '/settings'],
  support: ['/support', '/tickets', '/knowledge', '/settings'],
  ai_manager: ['/ai-console', '/cache', '/optimization', '/settings'],
  api_security: ['/api-integrations', '/security', '/settings'],
  // New roles (25-28)
  safe_assist: ['/safe-assist', '/sessions', '/ai-monitoring', '/settings'],
  assist_manager: ['/assist-manager', '/agents', '/performance', '/settings'],
  promise_tracker: ['/promise-tracker', '/promises', '/breaches', '/settings'],
  promise_management: ['/promise-management', '/commitments', '/departments', '/settings'],
};

// Check if user has required role level
export function hasRoleLevel(userRole: AppRole | null, requiredRole: AppRole): boolean {
  if (!userRole) return false;
  if (userRole === 'boss_owner') return true; // Boss Owner bypasses all
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
}

// Check if user has any of the specified roles
export function hasAnyRole(userRole: AppRole | null, allowedRoles: AppRole[]): boolean {
  if (!userRole) return false;
  if (userRole === 'boss_owner') return true; // Boss Owner bypasses all
  return allowedRoles.includes(userRole);
}

// Check if user can access a specific route
export function canAccessRoute(userRole: AppRole | null, route: string): boolean {
  if (!userRole) return false;
  if (userRole === 'boss_owner') return true; // Boss Owner has full access
  if (userRole === 'ceo') return true; // CEO has full access
  
  const allowedRoutes = ROLE_ROUTES[userRole] || [];
  if (allowedRoutes.includes('*')) return true;
  
  return allowedRoutes.some(allowed => route.startsWith(allowed));
}

// Check if role requires IP lock
export function requiresIPLock(role: AppRole | null): boolean {
  if (!role) return false;
  return IP_LOCKED_ROLES.includes(role);
}

// Check if role requires KYC
export function requiresKYC(role: AppRole | null): boolean {
  if (!role) return false;
  return KYC_REQUIRED_ROLES.includes(role);
}

// Check if role requires subscription
export function requiresSubscription(role: AppRole | null): boolean {
  if (!role) return false;
  return SUBSCRIPTION_REQUIRED_ROLES.includes(role);
}

// Generate masked ID based on role
export function generateMaskedId(role: AppRole | string, seed: string): { maskedId: string; config: typeof MASKED_ID_CONFIG[keyof typeof MASKED_ID_CONFIG] } {
  const hash = seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const config = MASKED_ID_CONFIG[role as keyof typeof MASKED_ID_CONFIG] || MASKED_ID_CONFIG.common;
  
  const numericId = String(hash % Math.pow(10, config.digits)).padStart(config.digits, '0');
  const maskedId = config.prefix.includes('👑') || config.prefix.includes('⭐') 
    ? `${config.prefix}-${numericId}`
    : `${config.prefix}-${numericId}`;
  
  return { maskedId, config };
}

// Validate role is one of the 24 known roles
export function isValidRole(role: string): role is AppRole {
  return Object.keys(ROLE_HIERARCHY).includes(role);
}

// Get dashboard route for role
// NOTE: master and super_admin merged into boss_owner
export function getDashboardRoute(role: AppRole): string {
  const routeMap: Partial<Record<AppRole, string>> = {
    boss_owner: '/super-admin', // Boss Owner uses super-admin dashboard
    master: '/super-admin', // Master is merged with boss_owner
    ceo: '/super-admin', // CEO uses super-admin dashboard
    area_manager: '/super-admin-system/role-switch?role=country_head', // Redirects to Country Head
    developer: '/developer',
    franchise: '/franchise',
    reseller: '/reseller',
    influencer: '/influencer',
    prime: '/prime',
    client: '/prime',
    lead_manager: '/leads',
    task_manager: '/tasks',
    seo_manager: '/seo',
    finance_manager: '/finance',
    hr_manager: '/hr',
    legal_compliance: '/legal',
    marketing_manager: '/marketing',
    client_success: '/clients',
    rnd_manager: '/rnd',
    r_and_d: '/rnd',
    performance_manager: '/performance',
    demo_manager: '/demos',
    ai_manager: '/ai-console',
    api_security: '/api-integrations',
    support: '/support',
    // New roles (25-28)
    safe_assist: '/safe-assist',
    assist_manager: '/assist-manager',
    promise_tracker: '/promise-tracker',
    promise_management: '/promise-management',
  };
  
  return routeMap[role] || '/settings';
}
