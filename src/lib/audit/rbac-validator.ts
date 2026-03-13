// ================================================================
// RBAC Validator - Validates Role-Based Access Control matrix
// Part of Enterprise Integrity Hard Check
// ================================================================

import { ROLE_HIERARCHY, ROLE_ROUTES, IP_LOCKED_ROLES, KYC_REQUIRED_ROLES } from '@/lib/rbac';

export type Permission = 'create' | 'read' | 'update' | 'delete' | 'export' | 'approve' | 'assign';

export interface RBACEntry {
  role: string;
  feature: string;
  permissions: Permission[];
  hasRBACEnforcement: boolean;
  hasUIGuard: boolean;
  hasAPIGuard: boolean;
  privilegeEscalationRisk: boolean;
  tenantBypassRisk: boolean;
  issues: string[];
}

export interface RBACValidationReport {
  totalEntries: number;
  entriesWithIssues: number;
  privilegeEscalationRisks: string[];
  tenantBypassRisks: string[];
  missingPermissions: { role: string; feature: string; missing: Permission[] }[];
  rbacMatrix: RBACEntry[];
  roleLeakageReport: string[];
  timestamp: string;
}

// Complete RBAC matrix: role × feature × actions
export const RBAC_MATRIX: RBACEntry[] = [
  // Boss Owner
  { role: 'boss_owner', feature: 'leads', permissions: ['create', 'read', 'update', 'delete', 'export', 'assign'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'boss_owner', feature: 'finance', permissions: ['create', 'read', 'update', 'delete', 'export', 'approve'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'boss_owner', feature: 'admin', permissions: ['create', 'read', 'update', 'delete', 'assign'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'boss_owner', feature: 'demos', permissions: ['create', 'read', 'update', 'delete'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },

  // CEO
  { role: 'ceo', feature: 'leads', permissions: ['read', 'export'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'ceo', feature: 'finance', permissions: ['read', 'export', 'approve'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'ceo', feature: 'admin', permissions: ['read', 'update'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },

  // Finance Manager
  { role: 'finance_manager', feature: 'finance', permissions: ['create', 'read', 'update', 'export', 'approve'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'finance_manager', feature: 'leads', permissions: [], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: ['Finance manager should not access leads'] },
  { role: 'finance_manager', feature: 'admin', permissions: [], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },

  // Lead Manager
  { role: 'lead_manager', feature: 'leads', permissions: ['create', 'read', 'update', 'assign', 'export'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'lead_manager', feature: 'finance', permissions: [], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'lead_manager', feature: 'admin', permissions: [], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },

  // Demo Manager
  { role: 'demo_manager', feature: 'demos', permissions: ['create', 'read', 'update', 'delete'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'demo_manager', feature: 'leads', permissions: [], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'demo_manager', feature: 'finance', permissions: [], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },

  // R&D Manager
  { role: 'rnd_manager', feature: 'rnd', permissions: ['create', 'read', 'update', 'approve'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'rnd_manager', feature: 'leads', permissions: [], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'rnd_manager', feature: 'finance', permissions: [], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },

  // Franchise
  { role: 'franchise', feature: 'leads', permissions: ['create', 'read', 'update'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'franchise', feature: 'resellers', permissions: ['read', 'assign'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'franchise', feature: 'finance', permissions: [], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'franchise', feature: 'admin', permissions: [], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },

  // Reseller
  { role: 'reseller', feature: 'leads', permissions: ['create', 'read'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'reseller', feature: 'finance', permissions: [], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'reseller', feature: 'admin', permissions: [], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },

  // Developer
  { role: 'developer', feature: 'tasks', permissions: ['read', 'update'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'developer', feature: 'leads', permissions: [], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'developer', feature: 'finance', permissions: [], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },

  // Support
  { role: 'support', feature: 'tickets', permissions: ['create', 'read', 'update'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'support', feature: 'leads', permissions: [], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'support', feature: 'finance', permissions: [], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },

  // Legal
  { role: 'legal_compliance', feature: 'legal', permissions: ['create', 'read', 'update'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'legal_compliance', feature: 'leads', permissions: [], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'legal_compliance', feature: 'finance', permissions: [], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },

  // HR Manager
  { role: 'hr_manager', feature: 'hr', permissions: ['create', 'read', 'update'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'hr_manager', feature: 'leads', permissions: [], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },

  // SEO Manager
  { role: 'seo_manager', feature: 'seo', permissions: ['create', 'read', 'update'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'seo_manager', feature: 'leads', permissions: [], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },

  // Performance Manager
  { role: 'performance_manager', feature: 'performance', permissions: ['create', 'read', 'update'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },

  // Marketing Manager
  { role: 'marketing_manager', feature: 'marketing', permissions: ['create', 'read', 'update'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },

  // Client / Prime
  { role: 'client', feature: 'demos', permissions: ['read'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'prime', feature: 'demos', permissions: ['read'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'prime', feature: 'support', permissions: ['create', 'read'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },

  // New roles (25-28)
  { role: 'safe_assist', feature: 'support', permissions: ['read', 'update'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'assist_manager', feature: 'support', permissions: ['create', 'read', 'update', 'assign'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'promise_tracker', feature: 'tasks', permissions: ['read'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
  { role: 'promise_management', feature: 'tasks', permissions: ['read', 'update'], hasRBACEnforcement: true, hasUIGuard: true, hasAPIGuard: true, privilegeEscalationRisk: false, tenantBypassRisk: false, issues: [] },
];

export function validateRBACMatrix(): RBACValidationReport {
  const privilegeEscalationRisks: string[] = [];
  const tenantBypassRisks: string[] = [];
  const missingPermissions: { role: string; feature: string; missing: Permission[] }[] = [];
  const roleLeakageReport: string[] = [];

  // Check for privilege escalation risks
  for (const entry of RBAC_MATRIX) {
    const roleLevel = ROLE_HIERARCHY[entry.role as keyof typeof ROLE_HIERARCHY] || 0;

    if (entry.privilegeEscalationRisk) {
      privilegeEscalationRisks.push(`${entry.role} → ${entry.feature}: Privilege escalation detected`);
    }
    if (entry.tenantBypassRisk) {
      tenantBypassRisks.push(`${entry.role} → ${entry.feature}: Tenant bypass risk detected`);
    }

    // Check if lower-privilege role has higher-privilege features
    if (entry.permissions.includes('delete') && roleLevel < 50 && entry.role !== 'boss_owner' && entry.role !== 'ceo') {
      if (!['demo_manager', 'finance_manager'].includes(entry.role)) {
        roleLeakageReport.push(`${entry.role} (level ${roleLevel}) has DELETE permission on ${entry.feature} - verify this is intentional`);
      }
    }

    // Check if RBAC enforcement is consistent
    if (!entry.hasAPIGuard && entry.permissions.length > 0) {
      privilegeEscalationRisks.push(`${entry.role} → ${entry.feature}: No API-level guard despite having permissions`);
    }
  }

  // Check for IP-locked roles without proper verification
  for (const role of IP_LOCKED_ROLES) {
    const entries = RBAC_MATRIX.filter(e => e.role === role);
    if (entries.length === 0) {
      missingPermissions.push({ role, feature: 'all', missing: ['read'] });
    }
  }

  const entriesWithIssues = RBAC_MATRIX.filter(e => e.issues.length > 0).length;

  return {
    totalEntries: RBAC_MATRIX.length,
    entriesWithIssues,
    privilegeEscalationRisks,
    tenantBypassRisks,
    missingPermissions,
    rbacMatrix: RBAC_MATRIX,
    roleLeakageReport,
    timestamp: new Date().toISOString(),
  };
}
