/**
 * Master Admin Control Center - Context Provider
 * Centralized state management for system state, locks, rentals, and flow management
 */

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  blackbox,
  checkSystemLock,
  getLiveActivity,
  subscribeLiveActivity,
  getUserRentals,
  getUserPermissions,
  registerDevice,
  generateDeviceFingerprint,
} from '@/services/masterAdminServices';

// ═══════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════

interface User {
  id: string;
  email: string;
  role: string;
  permissions: string[];
}

interface SystemLock {
  id: string;
  scope: string;
  reason: string;
  activatedAt: string;
  activatedBy: string;
}

interface Rental {
  id: string;
  featureCode: string;
  featureName: string;
  status: string;
  endTime: string;
}

interface LiveActivity {
  id: string;
  action: string;
  module: string;
  userId: string;
  severity: string;
  createdAt: string;
  payload: Record<string, any>;
}

interface MasterAdminState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // System state
  systemLocked: boolean;
  systemLocks: SystemLock[];
  
  // Rentals
  activeRentals: Rental[];
  
  // Live activity
  liveActivity: LiveActivity[];
  
  // Device
  deviceFingerprint: string | null;
  isTrustedDevice: boolean;
  
  // Risk
  riskScore: number;
  riskLevel: string;
}

interface MasterAdminContextType extends MasterAdminState {
  // Actions
  refreshUser: () => Promise<void>;
  refreshSystemLocks: () => Promise<void>;
  refreshRentals: () => Promise<void>;
  refreshLiveActivity: () => Promise<void>;
  
  // Helpers
  hasPermission: (permission: string) => boolean;
  hasRental: (featureCode: string) => boolean;
  canAccessModule: (moduleId: string, requiredPermission?: string, requiredRental?: string) => boolean;
  
  // Blackbox logging
  logAction: (eventType: string, module: string, entity?: string, entityId?: string, metadata?: Record<string, any>) => Promise<void>;
}

const MasterAdminContext = createContext<MasterAdminContextType | null>(null);

// ═══════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════

export function MasterAdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MasterAdminState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    systemLocked: false,
    systemLocks: [],
    activeRentals: [],
    liveActivity: [],
    deviceFingerprint: null,
    isTrustedDevice: false,
    riskScore: 0,
    riskLevel: 'normal'
  });

  // ─────────────────────────────────────────
  // REFRESH FUNCTIONS
  // ─────────────────────────────────────────

  const refreshUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setState(prev => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          isLoading: false
        }));
        return;
      }

      // Get role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      // Get permissions
      const permissions = await getUserPermissions();

      setState(prev => ({
        ...prev,
        user: {
          id: user.id,
          email: user.email || '',
          role: roleData?.role || 'user',
          permissions
        },
        isAuthenticated: true,
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const refreshSystemLocks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('master_system_locks')
        .select('*')
        .is('released_at', null)
        .order('activated_at', { ascending: false });

      if (error) throw error;

      const locks: SystemLock[] = (data || []).map(lock => ({
        id: lock.id,
        scope: lock.lock_scope,
        reason: lock.reason,
        activatedAt: lock.activated_at,
        activatedBy: lock.activated_by
      }));

      const hasGlobalLock = locks.some(lock => lock.scope === 'global');

      setState(prev => ({
        ...prev,
        systemLocked: hasGlobalLock,
        systemLocks: locks
      }));

      if (hasGlobalLock) {
        toast.warning('System is currently locked');
      }
    } catch (error) {
      console.error('Failed to refresh system locks:', error);
    }
  }, []);

  const refreshRentals = useCallback(async () => {
    try {
      const rentals = await getUserRentals();
      
      const activeRentals: Rental[] = rentals.map(r => ({
        id: r.id,
        featureCode: r.feature?.feature_code || '',
        featureName: r.feature?.module_name || '',
        status: r.status,
        endTime: r.end_time
      }));

      setState(prev => ({ ...prev, activeRentals }));
    } catch (error) {
      console.error('Failed to refresh rentals:', error);
    }
  }, []);

  const refreshLiveActivity = useCallback(async () => {
    try {
      const activity = await getLiveActivity(20);
      
      const liveActivity: LiveActivity[] = activity.map(a => ({
        id: a.id,
        action: a.action_name,
        module: a.source_module,
        userId: a.user_id,
        severity: a.severity,
        createdAt: a.created_at,
        payload: a.payload || {}
      }));

      setState(prev => ({ ...prev, liveActivity }));
    } catch (error) {
      console.error('Failed to refresh live activity:', error);
    }
  }, []);

  // ─────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────

  const hasPermission = useCallback((permission: string): boolean => {
    if (!state.user) return false;
    
    // Boss owner role has all permissions
    if (state.user.role === 'boss_owner') return true;
    
    return state.user.permissions.includes(permission) || 
           state.user.permissions.includes('all_permissions');
  }, [state.user]);

  const hasRental = useCallback((featureCode: string): boolean => {
    return state.activeRentals.some(
      r => r.featureCode === featureCode && r.status === 'active'
    );
  }, [state.activeRentals]);

  const canAccessModule = useCallback((
    moduleId: string, 
    requiredPermission?: string, 
    requiredRental?: string
  ): boolean => {
    // Check system lock
    if (state.systemLocked) return false;
    
    // Check authentication
    if (!state.isAuthenticated) return false;
    
    // Check permission if required
    if (requiredPermission && !hasPermission(requiredPermission)) return false;
    
    // Check rental if required
    if (requiredRental && !hasRental(requiredRental)) return false;
    
    return true;
  }, [state.systemLocked, state.isAuthenticated, hasPermission, hasRental]);

  // ─────────────────────────────────────────
  // BLACKBOX LOGGING
  // ─────────────────────────────────────────

  const logAction = useCallback(async (
    eventType: string, 
    module: string, 
    entity?: string, 
    entityId?: string,
    metadata?: Record<string, any>
  ) => {
    try {
      await blackbox.click(module, eventType, { entity, entityId, ...metadata });
    } catch (error) {
      console.error('Failed to log action:', error);
    }
  }, []);

  // ─────────────────────────────────────────
  // INITIALIZATION
  // ─────────────────────────────────────────

  useEffect(() => {
    // Initialize device fingerprint
    const initDevice = async () => {
      const fingerprint = await generateDeviceFingerprint();
      setState(prev => ({ ...prev, deviceFingerprint: fingerprint }));
      
      // Register device if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await registerDevice();
      }
    };

    initDevice();
  }, []);

  useEffect(() => {
    // Load initial data
    refreshUser();
    refreshSystemLocks();
    refreshRentals();
    refreshLiveActivity();
  }, [refreshUser, refreshSystemLocks, refreshRentals, refreshLiveActivity]);

  // Subscribe to live activity
  useEffect(() => {
    const unsubscribe = subscribeLiveActivity((payload) => {
      const newActivity: LiveActivity = {
        id: payload.new.id,
        action: payload.new.action_name,
        module: payload.new.source_module,
        userId: payload.new.user_id,
        severity: payload.new.severity,
        createdAt: payload.new.created_at,
        payload: payload.new.payload || {}
      };

      setState(prev => ({
        ...prev,
        liveActivity: [newActivity, ...prev.liveActivity.slice(0, 19)]
      }));
    });

    return unsubscribe;
  }, []);

  // Subscribe to system lock changes
  useEffect(() => {
    const channel = supabase
      .channel('system-locks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'master_system_locks'
        },
        () => {
          refreshSystemLocks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshSystemLocks]);

  // Subscribe to auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        refreshUser();
        refreshRentals();
        registerDevice();
      } else if (event === 'SIGNED_OUT') {
        setState(prev => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          activeRentals: []
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshUser, refreshRentals]);

  // Check system lock periodically
  useEffect(() => {
    const interval = setInterval(refreshSystemLocks, 30000);
    return () => clearInterval(interval);
  }, [refreshSystemLocks]);

  // ─────────────────────────────────────────
  // CONTEXT VALUE
  // ─────────────────────────────────────────

  const contextValue: MasterAdminContextType = {
    ...state,
    refreshUser,
    refreshSystemLocks,
    refreshRentals,
    refreshLiveActivity,
    hasPermission,
    hasRental,
    canAccessModule,
    logAction
  };

  return (
    <MasterAdminContext.Provider value={contextValue}>
      {children}
    </MasterAdminContext.Provider>
  );
}

// ═══════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════

export function useMasterAdmin(): MasterAdminContextType {
  const context = useContext(MasterAdminContext);
  
  if (!context) {
    throw new Error('useMasterAdmin must be used within a MasterAdminProvider');
  }
  
  return context;
}

// ═══════════════════════════════════════════
// SPECIALIZED HOOKS
// ═══════════════════════════════════════════

export function useSystemLock() {
  const { systemLocked, systemLocks, refreshSystemLocks } = useMasterAdmin();
  return { systemLocked, systemLocks, refreshSystemLocks };
}

export function useActiveRentals() {
  const { activeRentals, hasRental, refreshRentals } = useMasterAdmin();
  return { activeRentals, hasRental, refreshRentals };
}

export function useLiveActivityStream() {
  const { liveActivity, refreshLiveActivity } = useMasterAdmin();
  return { liveActivity, refreshLiveActivity };
}

export function usePermissions() {
  const { user, hasPermission } = useMasterAdmin();
  return { 
    permissions: user?.permissions || [], 
    role: user?.role || '',
    hasPermission 
  };
}
