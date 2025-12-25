/**
 * Tenant-Level RBAC Enforcement
 * Extends existing RBAC with multi-tenant isolation
 * Preserves all existing role permissions
 */

import { supabase } from '@/integrations/supabase/client';

// Existing role types preserved
export type AppRole = 
  | 'super_admin' 
  | 'area_manager' 
  | 'franchise' 
  | 'reseller' 
  | 'prime' 
  | 'developer' 
  | 'influencer'
  | 'client_success'
  | 'qc'
  | 'marketing'
  | 'rnd';

// Tenant hierarchy levels
export const TENANT_HIERARCHY: Record<AppRole, number> = {
  super_admin: 0,  // 👑 BOSS - sees all
  area_manager: 1, // Region-based control
  franchise: 2,
  reseller: 3,
  prime: 4,
  developer: 5,
  influencer: 5,
  client_success: 5,
  qc: 5,
  marketing: 5,
  rnd: 5
};

// Cross-tenant permissions
export interface TenantPermission {
  canViewChildTenants: boolean;
  canManageChildTenants: boolean;
  canViewParentTenant: boolean;
  canCrossTenantChat: boolean;
  canViewCrossTenantWallet: boolean;
  maxChildDepth: number;
}

const TENANT_PERMISSIONS: Record<AppRole, TenantPermission> = {
  super_admin: {
    canViewChildTenants: true,
    canManageChildTenants: true,
    canViewParentTenant: true,
    canCrossTenantChat: true,
    canViewCrossTenantWallet: true,
    maxChildDepth: Infinity
  },
  area_manager: {
    canViewChildTenants: true,
    canManageChildTenants: true,
    canViewParentTenant: false,
    canCrossTenantChat: true,
    canViewCrossTenantWallet: false,  // Read-only
    maxChildDepth: Infinity
  },
  franchise: {
    canViewChildTenants: true,
    canManageChildTenants: true,
    canViewParentTenant: false,
    canCrossTenantChat: true,
    canViewCrossTenantWallet: true,
    maxChildDepth: 3
  },
  reseller: {
    canViewChildTenants: true,
    canManageChildTenants: true,
    canViewParentTenant: false,
    canCrossTenantChat: true,
    canViewCrossTenantWallet: false,
    maxChildDepth: 2
  },
  prime: {
    canViewChildTenants: false,
    canManageChildTenants: false,
    canViewParentTenant: false,
    canCrossTenantChat: true,
    canViewCrossTenantWallet: false,
    maxChildDepth: 0
  },
  developer: {
    canViewChildTenants: false,
    canManageChildTenants: false,
    canViewParentTenant: false,
    canCrossTenantChat: true,
    canViewCrossTenantWallet: false,
    maxChildDepth: 0
  },
  influencer: {
    canViewChildTenants: false,
    canManageChildTenants: false,
    canViewParentTenant: false,
    canCrossTenantChat: false,
    canViewCrossTenantWallet: false,
    maxChildDepth: 0
  },
  client_success: {
    canViewChildTenants: false,
    canManageChildTenants: false,
    canViewParentTenant: false,
    canCrossTenantChat: true,
    canViewCrossTenantWallet: false,
    maxChildDepth: 0
  },
  qc: {
    canViewChildTenants: false,
    canManageChildTenants: false,
    canViewParentTenant: false,
    canCrossTenantChat: true,
    canViewCrossTenantWallet: false,
    maxChildDepth: 0
  },
  marketing: {
    canViewChildTenants: false,
    canManageChildTenants: false,
    canViewParentTenant: false,
    canCrossTenantChat: true,
    canViewCrossTenantWallet: false,
    maxChildDepth: 0
  },
  rnd: {
    canViewChildTenants: false,
    canManageChildTenants: false,
    canViewParentTenant: false,
    canCrossTenantChat: true,
    canViewCrossTenantWallet: false,
    maxChildDepth: 0
  }
};

export class TenantRBACManager {
  private userId: string;
  private role: AppRole;
  private tenantId: string;

  constructor(userId: string, role: AppRole, tenantId: string) {
    this.userId = userId;
    this.role = role;
    this.tenantId = tenantId;
  }

  /**
   * Get tenant permissions for current role
   */
  getPermissions(): TenantPermission {
    return TENANT_PERMISSIONS[this.role];
  }

  /**
   * Check if user can access a specific tenant
   */
  async canAccessTenant(targetTenantId: string): Promise<boolean> {
    if (targetTenantId === this.tenantId) return true;
    
    const permissions = this.getPermissions();
    
    // Check hierarchy
    if (permissions.canViewChildTenants) {
      const isChild = await this.isChildTenant(targetTenantId);
      if (isChild) return true;
    }
    
    if (permissions.canViewParentTenant) {
      const isParent = await this.isParentTenant(targetTenantId);
      if (isParent) return true;
    }
    
    return false;
  }

  /**
   * Check if target is a child tenant
   */
  private async isChildTenant(targetTenantId: string): Promise<boolean> {
    // Query tenant hierarchy from database
    const { data } = await supabase
      .from('branch_map')
      .select('franchise_user_id')
      .eq('franchise_user_id', this.tenantId);
    
    // Simplified check - in production, traverse hierarchy
    return data?.some(b => b.franchise_user_id === targetTenantId) || false;
  }

  /**
   * Check if target is a parent tenant
   */
  private async isParentTenant(targetTenantId: string): Promise<boolean> {
    // Query parent from hierarchy
    return false; // Implement based on hierarchy structure
  }

  /**
   * Check cross-tenant action permission
   */
  canPerformCrossTenantAction(action: 'chat' | 'wallet' | 'manage' | 'view'): boolean {
    const permissions = this.getPermissions();
    
    switch (action) {
      case 'chat':
        return permissions.canCrossTenantChat;
      case 'wallet':
        return permissions.canViewCrossTenantWallet;
      case 'manage':
        return permissions.canManageChildTenants;
      case 'view':
        return permissions.canViewChildTenants;
      default:
        return false;
    }
  }

  /**
   * Get hierarchy level for role comparison
   */
  getHierarchyLevel(): number {
    return TENANT_HIERARCHY[this.role];
  }

  /**
   * Check if this role outranks another
   */
  outranks(otherRole: AppRole): boolean {
    return TENANT_HIERARCHY[this.role] < TENANT_HIERARCHY[otherRole];
  }

  /**
   * Validate tenant action with logging
   */
  async validateAndLog(
    action: string,
    targetTenantId: string,
    metadata?: Record<string, any>
  ): Promise<boolean> {
    const canAccess = await this.canAccessTenant(targetTenantId);
    
    // Log all cross-tenant access attempts
    try {
      await supabase.from('audit_logs').insert([{
        user_id: this.userId,
        module: 'tenant_rbac',
        action: action,
        role: this.role as any,
        meta_json: {
          source_tenant: this.tenantId,
          target_tenant: targetTenantId,
          allowed: canAccess,
          ...metadata,
          timestamp: new Date().toISOString()
        }
      }]);
    } catch (err) {
      console.error('Failed to log tenant access:', err);
    }

    if (!canAccess) {
      console.error(`RBAC_VIOLATION: ${this.role} cannot access tenant ${targetTenantId}`);
    }

    return canAccess;
  }
}

/**
 * Create RBAC manager for current user
 */
export const createTenantRBACManager = async (userId: string): Promise<TenantRBACManager | null> => {
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (!roleData) return null;

  return new TenantRBACManager(
    userId,
    roleData.role as AppRole,
    userId // tenant ID defaults to user ID
  );
};

export default TenantRBACManager;
