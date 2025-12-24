// All 24 roles in the Software Vala system (matches database enum)
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
  | 'master';

// Role metadata for display
export const ROLE_CONFIG: Record<AppRole, {
  label: string;
  color: string;
  icon: string;
  modules: string[];
  tier: 'admin' | 'manager' | 'partner' | 'user';
}> = {
  super_admin: {
    label: 'Super Admin',
    color: '#ef4444',
    icon: 'Crown',
    modules: ['*'],
    tier: 'admin'
  },
  admin: {
    label: 'Admin',
    color: '#f97316',
    icon: 'Shield',
    modules: ['dashboard', 'users', 'settings', 'reports'],
    tier: 'admin'
  },
  developer: {
    label: 'Developer',
    color: '#8b5cf6',
    icon: 'Code2',
    modules: ['tasks', 'timer', 'wallet', 'chat'],
    tier: 'user'
  },
  franchise: {
    label: 'Franchise',
    color: '#3b82f6',
    icon: 'Building2',
    modules: ['leads', 'resellers', 'demos', 'wallet', 'chat'],
    tier: 'partner'
  },
  reseller: {
    label: 'Reseller',
    color: '#06b6d4',
    icon: 'Users',
    modules: ['leads', 'demos', 'wallet', 'chat'],
    tier: 'partner'
  },
  influencer: {
    label: 'Influencer',
    color: '#ec4899',
    icon: 'Sparkles',
    modules: ['links', 'analytics', 'wallet', 'chat'],
    tier: 'partner'
  },
  prime: {
    label: 'Prime User',
    color: '#f59e0b',
    icon: 'Star',
    modules: ['support', 'demos', 'chat'],
    tier: 'user'
  },
  seo_manager: {
    label: 'SEO Manager',
    color: '#22c55e',
    icon: 'Search',
    modules: ['seo', 'keywords', 'analytics', 'chat'],
    tier: 'manager'
  },
  lead_manager: {
    label: 'Lead Manager',
    color: '#14b8a6',
    icon: 'Target',
    modules: ['leads', 'pipeline', 'analytics', 'chat'],
    tier: 'manager'
  },
  task_manager: {
    label: 'Task Manager',
    color: '#6366f1',
    icon: 'ListTodo',
    modules: ['tasks', 'developers', 'performance', 'chat'],
    tier: 'manager'
  },
  demo_manager: {
    label: 'Demo Manager',
    color: '#a855f7',
    icon: 'Play',
    modules: ['demos', 'products', 'health', 'chat'],
    tier: 'manager'
  },
  rnd_manager: {
    label: 'R&D Manager',
    color: '#0ea5e9',
    icon: 'Lightbulb',
    modules: ['suggestions', 'roadmap', 'research', 'chat'],
    tier: 'manager'
  },
  client_success: {
    label: 'Client Success',
    color: '#10b981',
    icon: 'HeartHandshake',
    modules: ['clients', 'satisfaction', 'support', 'chat'],
    tier: 'manager'
  },
  performance_manager: {
    label: 'Performance Manager',
    color: '#f43f5e',
    icon: 'TrendingUp',
    modules: ['performance', 'developers', 'escalations', 'chat'],
    tier: 'manager'
  },
  finance_manager: {
    label: 'Finance Manager',
    color: '#84cc16',
    icon: 'Wallet',
    modules: ['wallets', 'payouts', 'commissions', 'reports', 'chat'],
    tier: 'manager'
  },
  marketing_manager: {
    label: 'Marketing Manager',
    color: '#d946ef',
    icon: 'Megaphone',
    modules: ['campaigns', 'influencers', 'analytics', 'chat'],
    tier: 'manager'
  },
  legal_compliance: {
    label: 'Legal & Compliance',
    color: '#78716c',
    icon: 'Scale',
    modules: ['documents', 'compliance', 'policies', 'chat'],
    tier: 'manager'
  },
  hr_manager: {
    label: 'HR Manager',
    color: '#fb923c',
    icon: 'UserPlus',
    modules: ['hiring', 'onboarding', 'team', 'chat'],
    tier: 'manager'
  },
  support: {
    label: 'Support',
    color: '#38bdf8',
    icon: 'Headphones',
    modules: ['tickets', 'chat', 'knowledge'],
    tier: 'user'
  },
  ai_manager: {
    label: 'AI Manager',
    color: '#c084fc',
    icon: 'Brain',
    modules: ['ai-console', 'cache', 'optimization', 'chat'],
    tier: 'manager'
  },
  client: {
    label: 'Client',
    color: '#94a3b8',
    icon: 'User',
    modules: ['demos', 'support'],
    tier: 'user'
  },
  api_security: {
    label: 'API Security',
    color: '#ef4444',
    icon: 'ShieldCheck',
    modules: ['api', 'security', 'logs', 'chat'],
    tier: 'manager'
  },
  r_and_d: {
    label: 'R&D',
    color: '#0ea5e9',
    icon: 'Beaker',
    modules: ['research', 'development', 'testing', 'chat'],
    tier: 'manager'
  },
  master: {
    label: 'Master',
    color: '#dc2626',
    icon: 'Crown',
    modules: ['*'],
    tier: 'admin'
  }
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
