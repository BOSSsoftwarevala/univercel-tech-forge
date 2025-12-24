// Software Vala Role System
// 
// NEW ROLE HIERARCHY (24 roles across 5 grades):
// 
// GRADE 0 – OWNERSHIP
//   1. master (Master Admin)
// 
// GRADE 1 – PLATFORM CONTROL
//   2. super_admin (Super Admin)
//   3. admin (Admin)
//   4. server_manager → mapped to 'admin' in DB
// 
// GRADE 2 – BUSINESS MANAGEMENT
//   5. franchise_manager → mapped to 'franchise' manager role
//   6. sales_support_manager → mapped to 'client_success' + 'support'
//   7. reseller_manager → mapped to 'reseller' manager role
//   8. api_ai_manager → mapped to 'ai_manager' + 'api_security'
//   9. influencer_manager → mapped to 'influencer' manager role
//   10. seo_manager
//   11. marketing_manager
//   12. lead_manager
//   13. pro_manager → mapped to 'demo_manager'
//   14. legal_manager → mapped to 'legal_compliance'
//   15. task_manager
//   16. hr_manager
//   17. developer_manager → mapped to 'performance_manager' + 'rnd_manager'
// 
// GRADE 3 – PARTNERS
//   18. franchise
//   19. developer
//   20. reseller
//   21. influencer
// 
// GRADE 4 – USERS
//   22. prime
//   23. user → mapped to 'client'
//   24. frontend → read-only UI layer

// Database-compatible AppRole type (matches Supabase enum)
export type AppRole = 
  | 'super_admin'
  | 'admin'
  | 'developer'
  | 'franchise'
  | 'reseller'
  | 'influencer'
  | 'prime'
  | 'seo_manager'
  | 'lead_manager'
  | 'task_manager'
  | 'demo_manager'
  | 'rnd_manager'
  | 'client_success'
  | 'performance_manager'
  | 'finance_manager'
  | 'marketing_manager'
  | 'legal_compliance'
  | 'hr_manager'
  | 'support'
  | 'ai_manager'
  | 'client'
  | 'api_security'
  | 'r_and_d'
  | 'master'
  // NEW ROLES (25-28)
  | 'safe_assist'
  | 'assist_manager'
  | 'promise_tracker'
  | 'promise_management';

// Grade classification for display/logic
export type RoleGrade = 0 | 1 | 2 | 3 | 4;

export const ROLE_GRADES: Record<AppRole, { grade: RoleGrade; gradeLabel: string; displayName: string }> = {
  // GRADE 0 – OWNERSHIP
  master: { grade: 0, gradeLabel: 'Ownership', displayName: 'Master Admin' },
  // GRADE 1 – PLATFORM CONTROL
  super_admin: { grade: 1, gradeLabel: 'Platform Control', displayName: 'Super Admin' },
  admin: { grade: 1, gradeLabel: 'Platform Control', displayName: 'Admin' },
  // GRADE 2 – BUSINESS MANAGEMENT (mapped from old roles)
  client_success: { grade: 2, gradeLabel: 'Business Management', displayName: 'Sales & Support Manager' },
  support: { grade: 2, gradeLabel: 'Business Management', displayName: 'Support Manager' },
  ai_manager: { grade: 2, gradeLabel: 'Business Management', displayName: 'API / AI Manager' },
  api_security: { grade: 2, gradeLabel: 'Business Management', displayName: 'API Security Manager' },
  seo_manager: { grade: 2, gradeLabel: 'Business Management', displayName: 'SEO Manager' },
  marketing_manager: { grade: 2, gradeLabel: 'Business Management', displayName: 'Marketing Manager' },
  lead_manager: { grade: 2, gradeLabel: 'Business Management', displayName: 'Lead Manager' },
  demo_manager: { grade: 2, gradeLabel: 'Business Management', displayName: 'Pro Manager' },
  legal_compliance: { grade: 2, gradeLabel: 'Business Management', displayName: 'Legal Manager' },
  task_manager: { grade: 2, gradeLabel: 'Business Management', displayName: 'Task Manager' },
  hr_manager: { grade: 2, gradeLabel: 'Business Management', displayName: 'HR Manager' },
  performance_manager: { grade: 2, gradeLabel: 'Business Management', displayName: 'Developer Manager' },
  rnd_manager: { grade: 2, gradeLabel: 'Business Management', displayName: 'R&D Manager' },
  finance_manager: { grade: 2, gradeLabel: 'Business Management', displayName: 'Finance Manager' },
  // GRADE 3 – PARTNERS
  franchise: { grade: 3, gradeLabel: 'Partners', displayName: 'Franchise' },
  developer: { grade: 3, gradeLabel: 'Partners', displayName: 'Developer' },
  reseller: { grade: 3, gradeLabel: 'Partners', displayName: 'Reseller' },
  influencer: { grade: 3, gradeLabel: 'Partners', displayName: 'Influencer' },
  // GRADE 4 – USERS
  prime: { grade: 4, gradeLabel: 'Users', displayName: 'Prime User' },
  client: { grade: 4, gradeLabel: 'Users', displayName: 'User' },
  r_and_d: { grade: 2, gradeLabel: 'Business Management', displayName: 'R&D' },
  // NEW ROLES (25-28)
  safe_assist: { grade: 2, gradeLabel: 'Business Management', displayName: 'Safe Assist' },
  assist_manager: { grade: 2, gradeLabel: 'Business Management', displayName: 'Assist Manager' },
  promise_tracker: { grade: 2, gradeLabel: 'Business Management', displayName: 'Promise Tracker' },
  promise_management: { grade: 2, gradeLabel: 'Business Management', displayName: 'Promise Management' },
};

// Role metadata for display
export const ROLE_CONFIG: Record<AppRole, {
  label: string;
  color: string;
  icon: string;
  modules: string[];
  tier: 'ownership' | 'platform' | 'management' | 'partner' | 'user';
}> = {
  // GRADE 0 – OWNERSHIP
  master: {
    label: 'Master Admin',
    color: '#dc2626',
    icon: 'Crown',
    modules: ['*'],
    tier: 'ownership'
  },
  // GRADE 1 – PLATFORM CONTROL
  super_admin: {
    label: 'Super Admin',
    color: '#ef4444',
    icon: 'Shield',
    modules: ['*'],
    tier: 'platform'
  },
  admin: {
    label: 'Admin',
    color: '#f97316',
    icon: 'ShieldCheck',
    modules: ['dashboard', 'users', 'settings', 'reports'],
    tier: 'platform'
  },
  // GRADE 2 – BUSINESS MANAGEMENT
  client_success: {
    label: 'Sales & Support Manager',
    color: '#10b981',
    icon: 'HeartHandshake',
    modules: ['sales', 'support', 'tickets', 'satisfaction', 'chat'],
    tier: 'management'
  },
  support: {
    label: 'Support Manager',
    color: '#38bdf8',
    icon: 'Headphones',
    modules: ['tickets', 'chat', 'knowledge'],
    tier: 'management'
  },
  ai_manager: {
    label: 'API / AI Manager',
    color: '#c084fc',
    icon: 'Brain',
    modules: ['api', 'ai-console', 'security', 'optimization', 'chat'],
    tier: 'management'
  },
  api_security: {
    label: 'API Security Manager',
    color: '#ef4444',
    icon: 'ShieldCheck',
    modules: ['api', 'security', 'logs', 'chat'],
    tier: 'management'
  },
  seo_manager: {
    label: 'SEO Manager',
    color: '#22c55e',
    icon: 'Search',
    modules: ['seo', 'keywords', 'analytics', 'chat'],
    tier: 'management'
  },
  marketing_manager: {
    label: 'Marketing Manager',
    color: '#d946ef',
    icon: 'Megaphone',
    modules: ['campaigns', 'content', 'analytics', 'chat'],
    tier: 'management'
  },
  lead_manager: {
    label: 'Lead Manager',
    color: '#14b8a6',
    icon: 'Target',
    modules: ['leads', 'pipeline', 'analytics', 'chat'],
    tier: 'management'
  },
  demo_manager: {
    label: 'Pro Manager',
    color: '#f59e0b',
    icon: 'Star',
    modules: ['prime-users', 'demos', 'subscriptions', 'support', 'chat'],
    tier: 'management'
  },
  legal_compliance: {
    label: 'Legal Manager',
    color: '#78716c',
    icon: 'Scale',
    modules: ['documents', 'compliance', 'policies', 'chat'],
    tier: 'management'
  },
  task_manager: {
    label: 'Task Manager',
    color: '#8b5cf6',
    icon: 'ListTodo',
    modules: ['tasks', 'developers', 'performance', 'chat'],
    tier: 'management'
  },
  hr_manager: {
    label: 'HR Manager',
    color: '#fb923c',
    icon: 'UserPlus',
    modules: ['hiring', 'onboarding', 'team', 'chat'],
    tier: 'management'
  },
  performance_manager: {
    label: 'Developer Manager',
    color: '#0ea5e9',
    icon: 'Code2',
    modules: ['developers', 'code-review', 'performance', 'chat'],
    tier: 'management'
  },
  rnd_manager: {
    label: 'R&D Manager',
    color: '#0ea5e9',
    icon: 'Lightbulb',
    modules: ['research', 'development', 'testing', 'chat'],
    tier: 'management'
  },
  finance_manager: {
    label: 'Finance Manager',
    color: '#84cc16',
    icon: 'Wallet',
    modules: ['wallets', 'payouts', 'commissions', 'reports', 'chat'],
    tier: 'management'
  },
  r_and_d: {
    label: 'R&D',
    color: '#0ea5e9',
    icon: 'Beaker',
    modules: ['research', 'development', 'testing', 'chat'],
    tier: 'management'
  },
  // GRADE 3 – PARTNERS
  franchise: {
    label: 'Franchise',
    color: '#3b82f6',
    icon: 'Building2',
    modules: ['leads', 'resellers', 'demos', 'wallet', 'chat'],
    tier: 'partner'
  },
  developer: {
    label: 'Developer',
    color: '#8b5cf6',
    icon: 'Code',
    modules: ['tasks', 'timer', 'wallet', 'chat'],
    tier: 'partner'
  },
  reseller: {
    label: 'Reseller',
    color: '#06b6d4',
    icon: 'UserCheck',
    modules: ['leads', 'demos', 'wallet', 'chat'],
    tier: 'partner'
  },
  influencer: {
    label: 'Influencer',
    color: '#ec4899',
    icon: 'Zap',
    modules: ['links', 'analytics', 'wallet', 'chat'],
    tier: 'partner'
  },
  // GRADE 4 – USERS
  prime: {
    label: 'Prime User',
    color: '#f59e0b',
    icon: 'Crown',
    modules: ['support', 'demos', 'chat'],
    tier: 'user'
  },
  client: {
    label: 'User',
    color: '#94a3b8',
    icon: 'User',
    modules: ['demos', 'support'],
    tier: 'user'
  },
  // NEW ROLES (25-28)
  safe_assist: {
    label: 'Safe Assist',
    color: '#10b981',
    icon: 'HeartHandshake',
    modules: ['safe-assist', 'support', 'chat'],
    tier: 'management'
  },
  assist_manager: {
    label: 'Assist Manager',
    color: '#06b6d4',
    icon: 'Headphones',
    modules: ['assist', 'support', 'chat', 'tickets'],
    tier: 'management'
  },
  promise_tracker: {
    label: 'Promise Tracker',
    color: '#8b5cf6',
    icon: 'Target',
    modules: ['promises', 'tasks', 'tracking', 'chat'],
    tier: 'management'
  },
  promise_management: {
    label: 'Promise Management',
    color: '#f59e0b',
    icon: 'HandshakeIcon',
    modules: ['promises', 'tasks', 'approvals', 'analytics', 'chat'],
    tier: 'management'
  },
};

// Get modules a role can access
export function getRoleModules(role: AppRole): string[] {
  const config = ROLE_CONFIG[role];
  if (config.modules.includes('*')) {
    return Object.values(ROLE_CONFIG).flatMap(r => r.modules).filter((v, i, a) => a.indexOf(v) === i && v !== '*');
  }
  return config.modules;
}

// Check if role can access module
export function canAccessModule(role: AppRole, module: string): boolean {
  const config = ROLE_CONFIG[role];
  return config.modules.includes('*') || config.modules.includes(module);
}

// Get role grade
export function getRoleGrade(role: AppRole): RoleGrade {
  return ROLE_GRADES[role].grade;
}

// Check if role has higher or equal authority
export function hasAuthorityOver(userRole: AppRole, targetRole: AppRole): boolean {
  return getRoleGrade(userRole) <= getRoleGrade(targetRole);
}

// Get all roles by grade
export function getRolesByGrade(grade: RoleGrade): AppRole[] {
  return (Object.keys(ROLE_GRADES) as AppRole[]).filter(role => ROLE_GRADES[role].grade === grade);
}

// Get display name for role (uses new naming convention)
export function getRoleDisplayName(role: AppRole): string {
  return ROLE_GRADES[role]?.displayName || ROLE_CONFIG[role]?.label || role;
}
