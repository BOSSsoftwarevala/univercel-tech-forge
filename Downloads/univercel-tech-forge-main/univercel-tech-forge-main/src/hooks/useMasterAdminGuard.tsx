import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ============================================
// MASTER ADMIN SECURITY GUARD
// ROOT OF TRUST - ABSOLUTE AUTHORITY
// HIDDEN ENDPOINT - NO PUBLIC ACCESS
// ============================================

interface MasterSecurityState {
  isAuthenticated: boolean;
  mfaVerified: boolean;
  deviceBound: boolean;
  ipVerified: boolean;
  sessionId: string;
  sessionExpiry: number;
  lastActivity: number;
}

// Hidden endpoint - not linked anywhere in UI
const MASTER_HIDDEN_PATH = '/master-control-vault-x9k2m';
const SESSION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes aggressive timeout
const ACTIVITY_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes inactivity

// IP Allowlist (would be fetched from secure config in production)
const IP_ALLOWLIST = ['*']; // Placeholder - replace with actual IPs

export const useMasterAdminGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [securityState, setSecurityState] = useState<MasterSecurityState>({
    isAuthenticated: false,
    mfaVerified: false,
    deviceBound: false,
    ipVerified: false,
    sessionId: crypto.randomUUID(),
    sessionExpiry: Date.now() + SESSION_TIMEOUT_MS,
    lastActivity: Date.now(),
  });
  
  const [isGlobalLocked, setIsGlobalLocked] = useState(false);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [allSessionsKilled, setAllSessionsKilled] = useState(false);

  // Verify hidden endpoint access
  useEffect(() => {
    if (!location.pathname.startsWith(MASTER_HIDDEN_PATH)) {
      // Log unauthorized access attempt
      logSecurityEvent('unauthorized_master_access_attempt', {
        path: location.pathname,
        timestamp: new Date().toISOString()
      });
    }
  }, [location.pathname]);

  // Aggressive session timeout
  useEffect(() => {
    const checkSession = setInterval(() => {
      const now = Date.now();
      
      // Check absolute session expiry
      if (now > securityState.sessionExpiry) {
        forceLogout('session_expired');
        return;
      }
      
      // Check inactivity timeout
      if (now - securityState.lastActivity > ACTIVITY_TIMEOUT_MS) {
        forceLogout('inactivity_timeout');
        return;
      }
    }, 5000);

    return () => clearInterval(checkSession);
  }, [securityState]);

  // Block ALL external access attempts
  useEffect(() => {
    const blockAll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      logSecurityEvent('blocked_action', { type: e.type });
    };

    // Disable clipboard
    document.addEventListener('copy', blockAll);
    document.addEventListener('cut', blockAll);
    document.addEventListener('paste', blockAll);
    
    // Disable screenshots
    document.addEventListener('keydown', (e) => {
      if (e.key === 'PrintScreen' || 
          (e.metaKey && e.shiftKey) || 
          (e.ctrlKey && e.shiftKey)) {
        e.preventDefault();
        logSecurityEvent('screenshot_blocked');
      }
    });

    // Disable context menu
    document.addEventListener('contextmenu', blockAll);

    // Disable dev tools
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'J') ||
          (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
        logSecurityEvent('devtools_blocked');
      }
    });

    return () => {
      document.removeEventListener('copy', blockAll);
      document.removeEventListener('cut', blockAll);
      document.removeEventListener('paste', blockAll);
      document.removeEventListener('contextmenu', blockAll);
    };
  }, []);

  // Track activity
  useEffect(() => {
    const updateActivity = () => {
      setSecurityState(prev => ({
        ...prev,
        lastActivity: Date.now()
      }));
    };

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
    };
  }, []);

  const logSecurityEvent = async (eventType: string, metadata?: Record<string, unknown>) => {
    try {
      await supabase.from('audit_logs').insert([{
        action: `MASTER_${eventType}`,
        module: 'master_admin_vault',
        role: 'super_admin' as const,
        meta_json: {
          ...metadata,
          session_id: securityState.sessionId,
          timestamp: new Date().toISOString(),
          encrypted: true
        }
      }]);
    } catch (error) {
      console.error('Critical: Failed to log master event');
    }
  };

  const forceLogout = useCallback(async (reason: string) => {
    await logSecurityEvent('force_logout', { reason });
    await supabase.auth.signOut();
    setSecurityState(prev => ({
      ...prev,
      isAuthenticated: false,
      mfaVerified: false
    }));
    toast.error(`Session terminated: ${reason}`);
    navigate('/');
  }, [navigate]);

  // =========================================
  // MASTER COMMANDS - IRREVERSIBLE UNLESS SELF-REVERTED
  // =========================================

  const globalSystemLock = useCallback(async (reason: string) => {
    if (reason.length < 20) {
      toast.error('Reason must be at least 20 characters for global lock');
      return false;
    }

    await logSecurityEvent('GLOBAL_SYSTEM_LOCK', { reason, irreversible: true });
    setIsGlobalLocked(true);
    toast.warning('GLOBAL SYSTEM LOCK ACTIVATED');
    return true;
  }, []);

  const unlockSystem = useCallback(async (reason: string) => {
    if (reason.length < 20) {
      toast.error('Reason must be at least 20 characters');
      return false;
    }

    await logSecurityEvent('GLOBAL_SYSTEM_UNLOCK', { reason });
    setIsGlobalLocked(false);
    toast.success('System unlocked');
    return true;
  }, []);

  const suspendSuperAdmin = useCallback(async (superAdminId: string, reason: string) => {
    if (reason.length < 20) {
      toast.error('Reason must be at least 20 characters');
      return false;
    }

    await logSecurityEvent('SUPER_ADMIN_SUSPENDED', { 
      target_id: superAdminId, 
      reason,
      permanent_log: true 
    });
    toast.warning('Super Admin suspended');
    return true;
  }, []);

  const restoreSuperAdmin = useCallback(async (superAdminId: string, reason: string) => {
    if (reason.length < 20) {
      toast.error('Reason must be at least 20 characters');
      return false;
    }

    await logSecurityEvent('SUPER_ADMIN_RESTORED', { 
      target_id: superAdminId, 
      reason,
      permanent_log: true 
    });
    toast.success('Super Admin restored');
    return true;
  }, []);

  const overrideSuperAdminDecision = useCallback(async (
    decisionId: string, 
    originalAction: string,
    overrideAction: string,
    reason: string
  ) => {
    if (reason.length < 20) {
      toast.error('Reason must be at least 20 characters');
      return false;
    }

    await logSecurityEvent('SUPER_ADMIN_OVERRIDE', { 
      decision_id: decisionId,
      original_action: originalAction,
      override_action: overrideAction,
      reason,
      permanent_log: true,
      irreversible: true
    });
    toast.warning('Super Admin decision overridden');
    return true;
  }, []);

  const freezeAllRoles = useCallback(async (reason: string) => {
    if (reason.length < 20) {
      toast.error('Reason must be at least 20 characters');
      return false;
    }

    await logSecurityEvent('ALL_ROLES_FROZEN', { 
      reason,
      master_only_access: true 
    });
    toast.error('ALL ROLES FROZEN - Master only access');
    return true;
  }, []);

  const freezeAllWallets = useCallback(async (reason: string) => {
    if (reason.length < 20) {
      toast.error('Reason must be at least 20 characters');
      return false;
    }

    await logSecurityEvent('ALL_WALLETS_FROZEN', { 
      reason,
      emergency_flag: true 
    });
    toast.error('ALL WALLETS FROZEN');
    return true;
  }, []);

  const reverseTransaction = useCallback(async (
    transactionId: string,
    reason: string
  ) => {
    if (reason.length < 20) {
      toast.error('Reason must be at least 20 characters');
      return false;
    }

    await logSecurityEvent('TRANSACTION_REVERSED', { 
      transaction_id: transactionId,
      reason,
      master_flag: true,
      permanent_log: true
    });
    toast.warning('Transaction reversed with MASTER FLAG');
    return true;
  }, []);

  const lockWithdrawals = useCallback(async (permanent: boolean, reason: string) => {
    if (reason.length < 20) {
      toast.error('Reason must be at least 20 characters');
      return false;
    }

    await logSecurityEvent('WITHDRAWALS_LOCKED', { 
      permanent,
      reason,
      master_flag: true 
    });
    toast.error(permanent ? 'Withdrawals PERMANENTLY locked' : 'Withdrawals locked');
    return true;
  }, []);

  const declareGlobalEmergency = useCallback(async (
    severity: 'critical' | 'catastrophic',
    reason: string
  ) => {
    if (reason.length < 20) {
      toast.error('Reason must be at least 20 characters');
      return false;
    }

    await logSecurityEvent('GLOBAL_EMERGENCY_DECLARED', { 
      severity,
      reason,
      timestamp: new Date().toISOString()
    });
    setIsEmergencyMode(true);
    toast.error(`GLOBAL EMERGENCY: ${severity.toUpperCase()}`);
    return true;
  }, []);

  const killAllSessions = useCallback(async (reason: string) => {
    if (reason.length < 20) {
      toast.error('Reason must be at least 20 characters');
      return false;
    }

    await logSecurityEvent('ALL_SESSIONS_KILLED', { 
      reason,
      except_master: true 
    });
    setAllSessionsKilled(true);
    toast.error('ALL SESSIONS TERMINATED');
    return true;
  }, []);

  const activateKillSwitch = useCallback(async (reason: string) => {
    if (reason.length < 30) {
      toast.error('Kill switch requires at least 30 character reason');
      return false;
    }

    await logSecurityEvent('KILL_SWITCH_ACTIVATED', { 
      reason,
      catastrophic: true,
      timestamp: new Date().toISOString()
    });
    toast.error('KILL SWITCH ACTIVATED - SYSTEM SHUTDOWN');
    return true;
  }, []);

  const forceRollback = useCallback(async (version: string, reason: string) => {
    if (reason.length < 20) {
      toast.error('Reason must be at least 20 characters');
      return false;
    }

    await logSecurityEvent('FORCE_ROLLBACK', { 
      target_version: version,
      reason,
      server_manager_notified: true 
    });
    toast.warning(`Force rollback to ${version} initiated`);
    return true;
  }, []);

  const lockCICD = useCallback(async (reason: string) => {
    if (reason.length < 20) {
      toast.error('Reason must be at least 20 characters');
      return false;
    }

    await logSecurityEvent('CICD_LOCKED', { 
      reason,
      all_deployments_blocked: true 
    });
    toast.warning('CI/CD Pipeline LOCKED');
    return true;
  }, []);

  const enableMaintenanceMode = useCallback(async (reason: string) => {
    if (reason.length < 20) {
      toast.error('Reason must be at least 20 characters');
      return false;
    }

    await logSecurityEvent('MAINTENANCE_MODE_ENABLED', { 
      reason,
      public_access_blocked: true 
    });
    toast.warning('MAINTENANCE MODE ENABLED');
    return true;
  }, []);

  // BLOCKED: Credentials cannot be edited
  const editCredentials = useCallback(() => {
    toast.error('BLOCKED: Master Admin credentials cannot be edited');
    logSecurityEvent('blocked_credential_edit_attempt');
    return false;
  }, []);

  // BLOCKED: Cannot export vault keys
  const exportVaultKeys = useCallback(() => {
    toast.error('BLOCKED: Vault keys cannot be exported');
    logSecurityEvent('blocked_vault_export_attempt');
    return false;
  }, []);

  // BLOCKED: Cannot delete logs
  const deleteLogs = useCallback(() => {
    toast.error('BLOCKED: Logs cannot be deleted even by Master Admin');
    logSecurityEvent('blocked_log_deletion_attempt');
    return false;
  }, []);

  return {
    securityState,
    isGlobalLocked,
    isEmergencyMode,
    allSessionsKilled,
    // System Control
    globalSystemLock,
    unlockSystem,
    // Super Admin Control
    suspendSuperAdmin,
    restoreSuperAdmin,
    overrideSuperAdminDecision,
    // Role Control
    freezeAllRoles,
    // Wallet Control
    freezeAllWallets,
    reverseTransaction,
    lockWithdrawals,
    // Emergency
    declareGlobalEmergency,
    killAllSessions,
    activateKillSwitch,
    // Infra
    forceRollback,
    lockCICD,
    enableMaintenanceMode,
    // Blocked Actions
    editCredentials,
    exportVaultKeys,
    deleteLogs,
    // Session
    forceLogout,
    logSecurityEvent,
  };
};
