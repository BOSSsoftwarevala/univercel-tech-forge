/**
 * ROLE LIST - SINGLE SOURCE OF TRUTH
 * ===================================
 * Use these role names exactly (case-sensitive).
 * Do NOT rename roles in different screens.
 * Do NOT add extra roles.
 * Do NOT show roles to public users.
 */

export const ROLES = {
  USER: 'User',
  PRIME_USER: 'Prime User',
  SUPPORT_AGENT: 'Support Agent',
  CLIENT_SUCCESS_MANAGER: 'Client Success Manager',
  INCIDENT_CRISIS_RESPONSE_MANAGER: 'Incident & Crisis Response Manager',
  TASK_MANAGER: 'Task Manager',
  SEO_MANAGER: 'SEO Manager',
  MARKETING_MANAGER: 'Marketing Manager',
  LEAD_MANAGER: 'Lead Manager',
  PERFORMANCE_MANAGER: 'Performance Manager',
  DEMO_MANAGER: 'Demo Manager',
  PRODUCT_MANAGER: 'Product Manager',
  RND_MANAGER: 'R&D Manager',
  DEVELOPER: 'Developer',
  SALES_EXECUTIVE: 'Sales Executive',
  RESELLER: 'Reseller',
  FRANCHISE_MANAGER: 'Franchise Manager',
  FINANCE_MANAGER: 'Finance Manager',
  HR_HIRING_MANAGER: 'HR / Hiring Manager',
  LEGAL_COMPLIANCE_MANAGER: 'Legal & Compliance Manager',
  SUPER_ADMIN: 'Super Admin',
  MASTER_ADMIN: 'Master Admin',
} as const;

export type RoleName = typeof ROLES[keyof typeof ROLES];
export type RoleKey = keyof typeof ROLES;

// Ordered list (1-22) for hierarchy and display
export const ROLE_ORDER: RoleName[] = [
  ROLES.USER,
  ROLES.PRIME_USER,
  ROLES.SUPPORT_AGENT,
  ROLES.CLIENT_SUCCESS_MANAGER,
  ROLES.INCIDENT_CRISIS_RESPONSE_MANAGER,
  ROLES.TASK_MANAGER,
  ROLES.SEO_MANAGER,
  ROLES.MARKETING_MANAGER,
  ROLES.LEAD_MANAGER,
  ROLES.PERFORMANCE_MANAGER,
  ROLES.DEMO_MANAGER,
  ROLES.PRODUCT_MANAGER,
  ROLES.RND_MANAGER,
  ROLES.DEVELOPER,
  ROLES.SALES_EXECUTIVE,
  ROLES.RESELLER,
  ROLES.FRANCHISE_MANAGER,
  ROLES.FINANCE_MANAGER,
  ROLES.HR_HIRING_MANAGER,
  ROLES.LEGAL_COMPLIANCE_MANAGER,
  ROLES.SUPER_ADMIN,
  ROLES.MASTER_ADMIN,
];

// Badge colors for each role (using design system tokens)
export const ROLE_COLORS: Record<RoleName, { bg: string; text: string; border: string }> = {
  [ROLES.USER]: { bg: 'bg-slate-500/20', text: 'text-slate-300', border: 'border-slate-500/30' },
  [ROLES.PRIME_USER]: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30' },
  [ROLES.SUPPORT_AGENT]: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
  [ROLES.CLIENT_SUCCESS_MANAGER]: { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30' },
  [ROLES.INCIDENT_CRISIS_RESPONSE_MANAGER]: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30' },
  [ROLES.TASK_MANAGER]: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' },
  [ROLES.SEO_MANAGER]: { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30' },
  [ROLES.MARKETING_MANAGER]: { bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-500/30' },
  [ROLES.LEAD_MANAGER]: { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  [ROLES.PERFORMANCE_MANAGER]: { bg: 'bg-teal-500/20', text: 'text-teal-300', border: 'border-teal-500/30' },
  [ROLES.DEMO_MANAGER]: { bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/30' },
  [ROLES.PRODUCT_MANAGER]: { bg: 'bg-violet-500/20', text: 'text-violet-300', border: 'border-violet-500/30' },
  [ROLES.RND_MANAGER]: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  [ROLES.DEVELOPER]: { bg: 'bg-lime-500/20', text: 'text-lime-300', border: 'border-lime-500/30' },
  [ROLES.SALES_EXECUTIVE]: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30' },
  [ROLES.RESELLER]: { bg: 'bg-rose-500/20', text: 'text-rose-300', border: 'border-rose-500/30' },
  [ROLES.FRANCHISE_MANAGER]: { bg: 'bg-fuchsia-500/20', text: 'text-fuchsia-300', border: 'border-fuchsia-500/30' },
  [ROLES.FINANCE_MANAGER]: { bg: 'bg-sky-500/20', text: 'text-sky-300', border: 'border-sky-500/30' },
  [ROLES.HR_HIRING_MANAGER]: { bg: 'bg-amber-600/20', text: 'text-amber-400', border: 'border-amber-600/30' },
  [ROLES.LEGAL_COMPLIANCE_MANAGER]: { bg: 'bg-gray-500/20', text: 'text-gray-300', border: 'border-gray-500/30' },
  [ROLES.SUPER_ADMIN]: { bg: 'bg-gradient-to-r from-purple-500/30 to-blue-500/30', text: 'text-purple-200', border: 'border-purple-500/50' },
  [ROLES.MASTER_ADMIN]: { bg: 'bg-gradient-to-r from-amber-500/30 to-red-500/30', text: 'text-amber-200', border: 'border-amber-500/50' },
};

// Role descriptions for tooltips/info
export const ROLE_DESCRIPTIONS: Record<RoleName, string> = {
  [ROLES.USER]: 'Standard platform user',
  [ROLES.PRIME_USER]: 'Premium user with enhanced features',
  [ROLES.SUPPORT_AGENT]: 'Handles customer support tickets',
  [ROLES.CLIENT_SUCCESS_MANAGER]: 'Manages client relationships and success',
  [ROLES.INCIDENT_CRISIS_RESPONSE_MANAGER]: 'Handles incidents and crisis situations',
  [ROLES.TASK_MANAGER]: 'Manages and assigns tasks',
  [ROLES.SEO_MANAGER]: 'Manages search engine optimization',
  [ROLES.MARKETING_MANAGER]: 'Manages marketing campaigns',
  [ROLES.LEAD_MANAGER]: 'Manages leads and conversions',
  [ROLES.PERFORMANCE_MANAGER]: 'Monitors and optimizes performance',
  [ROLES.DEMO_MANAGER]: 'Manages product demos',
  [ROLES.PRODUCT_MANAGER]: 'Manages product development',
  [ROLES.RND_MANAGER]: 'Manages research and development',
  [ROLES.DEVELOPER]: 'Builds and maintains the platform',
  [ROLES.SALES_EXECUTIVE]: 'Handles sales operations',
  [ROLES.RESELLER]: 'Authorized reseller partner',
  [ROLES.FRANCHISE_MANAGER]: 'Manages franchise operations',
  [ROLES.FINANCE_MANAGER]: 'Manages financial operations',
  [ROLES.HR_HIRING_MANAGER]: 'Manages HR and hiring',
  [ROLES.LEGAL_COMPLIANCE_MANAGER]: 'Manages legal and compliance',
  [ROLES.SUPER_ADMIN]: 'Full administrative access',
  [ROLES.MASTER_ADMIN]: 'Highest level system administrator',
};

// Helper function to get role index (1-22)
export const getRoleIndex = (role: RoleName): number => {
  return ROLE_ORDER.indexOf(role) + 1;
};

// Helper function to check if role is admin level
export const isAdminRole = (role: RoleName): boolean => {
  return role === ROLES.SUPER_ADMIN || role === ROLES.MASTER_ADMIN;
};

// Helper function to check if role is manager level
export const isManagerRole = (role: RoleName): boolean => {
  return role.includes('Manager');
};

// Helper function to get role by index
export const getRoleByIndex = (index: number): RoleName | undefined => {
  return ROLE_ORDER[index - 1];
};
