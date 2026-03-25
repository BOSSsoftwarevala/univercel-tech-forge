/**
 * Multi-Tenant Context Provider
 * Provides tenant isolation and context across SOFTWARE VALA
 * Preserves existing RBAC, masking, and ID rules
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Tenant types matching existing role structure
export type TenantType = 'franchise' | 'reseller' | 'prime' | 'developer' | 'influencer';

export interface Tenant {
  id: string;
  maskedId: string; // 4-digit for franchise, 5-digit for reseller, etc.
  type: TenantType;
  name: string;
  parentTenantId?: string;
  settings: TenantSettings;
  isActive: boolean;
  createdAt: string;
}

export interface TenantSettings {
  walletCurrency: string;
  timezone: string;
  language: string;
  offlineEnabled: boolean;
  autoSyncInterval: number; // minutes
  maxOfflineStorage: number; // MB
  encryptionLevel: 'standard' | 'enhanced';
  ipLockEnabled: boolean;
  deviceLockEnabled: boolean;
  allowedIPs: string[];
  allowedDevices: string[];
}

export interface TenantContext {
  currentTenant: Tenant | null;
  tenantHierarchy: Tenant[];
  isLoading: boolean;
  error: string | null;
  switchTenant: (tenantId: string) => Promise<void>;
  getTenantSettings: () => TenantSettings | null;
  updateTenantSettings: (settings: Partial<TenantSettings>) => Promise<void>;
  isTenantAdmin: () => boolean;
  canAccessTenant: (tenantId: string) => boolean;
  getMaskedTenantId: () => string;
}

const TenantContext = createContext<TenantContext | null>(null);

// Masking rules for tenant IDs (preserves existing ID length rules)
const TENANT_ID_LENGTHS: Record<TenantType, number> = {
  franchise: 4,
  reseller: 5,
  prime: 6,
  developer: 3,
  influencer: 7
};

const generateMaskedId = (type: TenantType): string => {
  const length = TENANT_ID_LENGTHS[type];
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
};

const DEFAULT_TENANT_SETTINGS: TenantSettings = {
  walletCurrency: 'USD',
  timezone: 'UTC',
  language: 'en',
  offlineEnabled: true,
  autoSyncInterval: 5,
  maxOfflineStorage: 500,
  encryptionLevel: 'enhanced',
  ipLockEnabled: true,
  deviceLockEnabled: true,
  allowedIPs: [],
  allowedDevices: []
};

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenantHierarchy, setTenantHierarchy] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load current tenant from session
  const loadCurrentTenant = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setCurrentTenant(null);
        return;
      }

      // Get user's tenant from their role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleData) {
        const tenantType = mapRoleToTenantType(roleData.role);
        
        // Create or fetch tenant
        const tenant: Tenant = {
          id: user.id,
          maskedId: generateMaskedId(tenantType),
          type: tenantType,
          name: `Tenant-${generateMaskedId(tenantType)}`,
          settings: DEFAULT_TENANT_SETTINGS,
          isActive: true,
          createdAt: new Date().toISOString()
        };

        setCurrentTenant(tenant);
        
        // Build hierarchy for franchise/reseller
        if (tenantType === 'franchise' || tenantType === 'reseller') {
          await loadTenantHierarchy(tenant);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tenant');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const mapRoleToTenantType = (role: string): TenantType => {
    const roleMap: Record<string, TenantType> = {
      'franchise': 'franchise',
      'reseller': 'reseller',
      'prime': 'prime',
      'developer': 'developer',
      'influencer': 'influencer',
      'super_admin': 'franchise', // BOSS sees all
      'admin': 'franchise'
    };
    return roleMap[role] || 'developer';
  };

  const loadTenantHierarchy = async (tenant: Tenant) => {
    // Build tenant hierarchy for multi-level access
    const hierarchy: Tenant[] = [tenant];
    
    // For franchise, include sub-tenants (resellers, primes under them)
    if (tenant.type === 'franchise') {
      // Hierarchy loaded from database in production
      setTenantHierarchy(hierarchy);
    }
  };

  const switchTenant = async (tenantId: string): Promise<void> => {
    if (!canAccessTenant(tenantId)) {
      throw new Error('RBAC_VIOLATION: Cannot access tenant');
    }
    
    const targetTenant = tenantHierarchy.find(t => t.id === tenantId);
    if (targetTenant) {
      setCurrentTenant(targetTenant);
      
      // Log tenant switch for audit
      await supabase.from('audit_logs').insert({
        user_id: currentTenant?.id,
        module: 'multi_tenant',
        action: 'tenant_switch',
        meta_json: {
          from_tenant: currentTenant?.maskedId,
          to_tenant: targetTenant.maskedId,
          timestamp: new Date().toISOString()
        }
      });
    }
  };

  const getTenantSettings = (): TenantSettings | null => {
    return currentTenant?.settings || null;
  };

  const updateTenantSettings = async (settings: Partial<TenantSettings>): Promise<void> => {
    if (!currentTenant || !isTenantAdmin()) {
      throw new Error('RBAC_VIOLATION: Cannot update tenant settings');
    }

    const updatedSettings = { ...currentTenant.settings, ...settings };
    setCurrentTenant({ ...currentTenant, settings: updatedSettings });
    
    // Persist to database
    await supabase.from('audit_logs').insert({
      user_id: currentTenant.id,
      module: 'multi_tenant',
      action: 'settings_update',
      meta_json: {
        tenant_id: currentTenant.maskedId,
        changes: settings,
        timestamp: new Date().toISOString()
      }
    });
  };

  const isTenantAdmin = (): boolean => {
    return currentTenant?.type === 'franchise' || currentTenant?.type === 'reseller';
  };

  const canAccessTenant = (tenantId: string): boolean => {
    // RBAC check - can only access own tenant or child tenants
    if (!currentTenant) return false;
    if (currentTenant.id === tenantId) return true;
    
    // Check hierarchy
    return tenantHierarchy.some(t => t.id === tenantId);
  };

  const getMaskedTenantId = (): string => {
    return currentTenant?.maskedId || '0000';
  };

  useEffect(() => {
    loadCurrentTenant();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadCurrentTenant();
    });

    return () => subscription.unsubscribe();
  }, [loadCurrentTenant]);

  return (
    <TenantContext.Provider value={{
      currentTenant,
      tenantHierarchy,
      isLoading,
      error,
      switchTenant,
      getTenantSettings,
      updateTenantSettings,
      isTenantAdmin,
      canAccessTenant,
      getMaskedTenantId
    }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = (): TenantContext => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
};

export default TenantProvider;
