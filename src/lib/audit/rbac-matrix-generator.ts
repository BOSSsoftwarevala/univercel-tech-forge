// ================================================================
// RBAC Matrix Generator - Generates role × feature × action matrix
// Part of Enterprise Integrity Hard Check
// ================================================================

import { ROLE_HIERARCHY } from '@/lib/rbac';

export type Action = 'create' | 'read' | 'update' | 'delete' | 'export' | 'approve' | 'assign';

export interface RBACMatrixCell {
  role: string;
  feature: string;
  actions: Action[];
  uiVisible: boolean;
  apiProtected: boolean;
  tenantScoped: boolean;
  notes?: string;
}

export interface RBACMatrixReport {
  roles: string[];
  features: string[];
  matrix: Record<string, Record<string, RBACMatrixCell>>;
  flatMatrix: RBACMatrixCell[];
  privilegeLeakageDetected: RBACMatrixCell[];
  missingApiGuards: RBACMatrixCell[];
  timestamp: string;
}

// All features in the system
export const ALL_FEATURES = [
  'leads', 'finance', 'demos', 'rnd', 'admin', 'support', 'legal',
  'hr', 'seo', 'performance', 'marketing', 'tasks', 'resellers', 'settings',
  'ai-console', 'api-security', 'server-management',
] as const;

// All roles in the system
export const ALL_ROLES = Object.keys(ROLE_HIERARCHY) as (keyof typeof ROLE_HIERARCHY)[];

// Define the full matrix
export const RBAC_FULL_MATRIX: RBACMatrixCell[] = [
  // Boss Owner - Full access
  { role: 'boss_owner', feature: 'leads', actions: ['create', 'read', 'update', 'delete', 'export', 'assign'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'boss_owner', feature: 'finance', actions: ['create', 'read', 'update', 'delete', 'export', 'approve'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'boss_owner', feature: 'demos', actions: ['create', 'read', 'update', 'delete'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'boss_owner', feature: 'admin', actions: ['create', 'read', 'update', 'delete', 'assign'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'boss_owner', feature: 'rnd', actions: ['create', 'read', 'update', 'delete', 'approve'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'boss_owner', feature: 'support', actions: ['create', 'read', 'update', 'delete', 'assign'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'boss_owner', feature: 'legal', actions: ['create', 'read', 'update', 'delete'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'boss_owner', feature: 'hr', actions: ['create', 'read', 'update', 'delete'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'boss_owner', feature: 'seo', actions: ['create', 'read', 'update', 'delete'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'boss_owner', feature: 'performance', actions: ['create', 'read', 'update', 'delete', 'approve'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'boss_owner', feature: 'marketing', actions: ['create', 'read', 'update', 'delete'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'boss_owner', feature: 'tasks', actions: ['create', 'read', 'update', 'delete', 'assign'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'boss_owner', feature: 'settings', actions: ['create', 'read', 'update', 'delete'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'boss_owner', feature: 'ai-console', actions: ['create', 'read', 'update', 'delete'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'boss_owner', feature: 'server-management', actions: ['create', 'read', 'update', 'delete'], uiVisible: true, apiProtected: true, tenantScoped: false },

  // CEO - Almost full access
  { role: 'ceo', feature: 'leads', actions: ['read', 'export'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'ceo', feature: 'finance', actions: ['read', 'export', 'approve'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'ceo', feature: 'demos', actions: ['read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'ceo', feature: 'admin', actions: ['read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'ceo', feature: 'rnd', actions: ['read', 'approve'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'ceo', feature: 'support', actions: ['read'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'ceo', feature: 'settings', actions: ['read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: false },

  // Finance Manager
  { role: 'finance_manager', feature: 'finance', actions: ['create', 'read', 'update', 'export', 'approve'], uiVisible: true, apiProtected: true, tenantScoped: true },
  { role: 'finance_manager', feature: 'leads', actions: [], uiVisible: false, apiProtected: true, tenantScoped: true, notes: 'No access to leads' },
  { role: 'finance_manager', feature: 'settings', actions: ['read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: true },

  // Lead Manager
  { role: 'lead_manager', feature: 'leads', actions: ['create', 'read', 'update', 'assign', 'export'], uiVisible: true, apiProtected: true, tenantScoped: true },
  { role: 'lead_manager', feature: 'finance', actions: [], uiVisible: false, apiProtected: true, tenantScoped: true, notes: 'No access to finance' },
  { role: 'lead_manager', feature: 'settings', actions: ['read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: true },

  // Demo Manager
  { role: 'demo_manager', feature: 'demos', actions: ['create', 'read', 'update', 'delete'], uiVisible: true, apiProtected: true, tenantScoped: true },
  { role: 'demo_manager', feature: 'settings', actions: ['read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: true },

  // R&D Manager
  { role: 'rnd_manager', feature: 'rnd', actions: ['create', 'read', 'update', 'approve'], uiVisible: true, apiProtected: true, tenantScoped: true },
  { role: 'rnd_manager', feature: 'settings', actions: ['read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: true },

  // Franchise
  { role: 'franchise', feature: 'leads', actions: ['create', 'read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: true },
  { role: 'franchise', feature: 'resellers', actions: ['read', 'assign'], uiVisible: true, apiProtected: true, tenantScoped: true },
  { role: 'franchise', feature: 'demos', actions: ['read'], uiVisible: true, apiProtected: true, tenantScoped: true },
  { role: 'franchise', feature: 'settings', actions: ['read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: true },

  // Reseller
  { role: 'reseller', feature: 'leads', actions: ['create', 'read'], uiVisible: true, apiProtected: true, tenantScoped: true },
  { role: 'reseller', feature: 'demos', actions: ['read'], uiVisible: true, apiProtected: true, tenantScoped: true },
  { role: 'reseller', feature: 'settings', actions: ['read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: true },

  // Developer
  { role: 'developer', feature: 'tasks', actions: ['read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: true },
  { role: 'developer', feature: 'demos', actions: ['read'], uiVisible: true, apiProtected: true, tenantScoped: true },
  { role: 'developer', feature: 'settings', actions: ['read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: true },

  // Support
  { role: 'support', feature: 'support', actions: ['create', 'read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: true },
  { role: 'support', feature: 'settings', actions: ['read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: true },

  // Legal
  { role: 'legal_compliance', feature: 'legal', actions: ['create', 'read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: true },
  { role: 'legal_compliance', feature: 'settings', actions: ['read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: true },

  // HR Manager
  { role: 'hr_manager', feature: 'hr', actions: ['create', 'read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'hr_manager', feature: 'settings', actions: ['read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: true },

  // SEO Manager
  { role: 'seo_manager', feature: 'seo', actions: ['create', 'read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: true },
  { role: 'seo_manager', feature: 'settings', actions: ['read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: true },

  // Performance Manager
  { role: 'performance_manager', feature: 'performance', actions: ['create', 'read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'performance_manager', feature: 'tasks', actions: ['read', 'assign'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'performance_manager', feature: 'settings', actions: ['read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: true },

  // Marketing Manager
  { role: 'marketing_manager', feature: 'marketing', actions: ['create', 'read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: true },
  { role: 'marketing_manager', feature: 'settings', actions: ['read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: true },

  // Client
  { role: 'client', feature: 'demos', actions: ['read'], uiVisible: true, apiProtected: true, tenantScoped: true },
  { role: 'client', feature: 'support', actions: ['create', 'read'], uiVisible: true, apiProtected: true, tenantScoped: true },
  { role: 'client', feature: 'settings', actions: ['read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: true },

  // Prime
  { role: 'prime', feature: 'demos', actions: ['read'], uiVisible: true, apiProtected: true, tenantScoped: true },
  { role: 'prime', feature: 'support', actions: ['create', 'read'], uiVisible: true, apiProtected: true, tenantScoped: true },
  { role: 'prime', feature: 'settings', actions: ['read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: true },

  // New roles
  { role: 'safe_assist', feature: 'support', actions: ['read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: true },
  { role: 'assist_manager', feature: 'support', actions: ['create', 'read', 'update', 'assign'], uiVisible: true, apiProtected: true, tenantScoped: true },
  { role: 'promise_tracker', feature: 'tasks', actions: ['read'], uiVisible: true, apiProtected: true, tenantScoped: false },
  { role: 'promise_management', feature: 'tasks', actions: ['read', 'update'], uiVisible: true, apiProtected: true, tenantScoped: false },
];

export function generateRBACMatrix(): RBACMatrixReport {
  const roles = [...new Set(RBAC_FULL_MATRIX.map(c => c.role))];
  const features = [...new Set(RBAC_FULL_MATRIX.map(c => c.feature))];

  // Build nested matrix
  const matrix: Record<string, Record<string, RBACMatrixCell>> = {};
  for (const role of roles) {
    matrix[role] = {};
    for (const feature of features) {
      const cell = RBAC_FULL_MATRIX.find(c => c.role === role && c.feature === feature);
      if (cell) {
        matrix[role][feature] = cell;
      }
    }
  }

  // Detect privilege leakage (lower roles with higher-privilege actions)
  const privilegeLeakageDetected = RBAC_FULL_MATRIX.filter(cell => {
    const roleLevel = ROLE_HIERARCHY[cell.role as keyof typeof ROLE_HIERARCHY] || 0;
    return (
      cell.actions.includes('delete') &&
      roleLevel < 45 &&
      !['boss_owner', 'ceo', 'demo_manager', 'finance_manager'].includes(cell.role)
    );
  });

  // Detect missing API guards
  const missingApiGuards = RBAC_FULL_MATRIX.filter(
    cell => !cell.apiProtected && cell.actions.length > 0
  );

  return {
    roles,
    features,
    matrix,
    flatMatrix: RBAC_FULL_MATRIX,
    privilegeLeakageDetected,
    missingApiGuards,
    timestamp: new Date().toISOString(),
  };
}
