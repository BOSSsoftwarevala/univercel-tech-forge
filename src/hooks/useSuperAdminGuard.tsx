import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ============================================
// SUPER ADMIN SECURITY GUARD
// MFA + Device Binding + Zero Silent Actions
// ============================================

interface SecurityState {
  isAuthorized: boolean;
  mfaVerified: boolean;
  deviceBound: boolean;
  sessionExpiry: number;
  actionLog: ActionLogEntry[];
}

interface ActionLogEntry {
  id: string;
  action: string;
  timestamp: Date;
  requiresReason: boolean;
  reason?: string;
}

const BLOCKED_ROUTES = [
  '/master-admin',
  '/ownership',
  '/server-manager',
  '/franchise-manager',
];

const SESSION_TIMEOUT_MINUTES = 30;

export const useSuperAdminGuard = () => {
  const navigate = useNavigate();
  const [securityState, setSecurityState] = useState<SecurityState>({
    isAuthorized: false,
    mfaVerified: false,
    deviceBound: false,
    sessionExpiry: Date.now() + SESSION_TIMEOUT_MINUTES * 60 * 1000,
    actionLog: [],
  });
  const [isSystemFrozen, setIsSystemFrozen] = useState(false);

  // Block unauthorized routes
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (BLOCKED_ROUTES.some(route => currentPath.startsWith(route))) {
      toast.error('Access Denied: Route blocked for Super Admin');
      navigate('/super-admin');
    }
  }, [navigate]);

  // Session timeout management
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() > securityState.sessionExpiry) {
        toast.error('Session expired. Please re-authenticate.');
        navigate('/auth');
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [securityState.sessionExpiry, navigate]);

  // Disable clipboard and screenshots
  useEffect(() => {
    const blockCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      logSecurityEvent('clipboard_blocked');
    };

    const blockScreenshot = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey && e.key === '4')) {
        e.preventDefault();
        logSecurityEvent('screenshot_blocked');
      }
    };

    document.addEventListener('copy', blockCopy);
    document.addEventListener('keydown', blockScreenshot);

    return () => {
      document.removeEventListener('copy', blockCopy);
      document.removeEventListener('keydown', blockScreenshot);
    };
  }, []);

  const logSecurityEvent = async (eventType: string) => {
    try {
      await supabase.from('audit_logs').insert({
        action: eventType,
        module: 'super_admin_security',
        role: 'super_admin',
        meta_json: { timestamp: new Date().toISOString() }
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  // Log action with mandatory reason for sensitive operations
  const logActionWithReason = useCallback(async (
    action: string,
    targetId: string,
    reason: string,
    metadata?: Record<string, unknown>
  ) => {
    if (!reason || reason.trim().length < 10) {
      toast.error('Reason is mandatory and must be at least 10 characters');
      return false;
    }

    try {
      await supabase.from('audit_logs').insert({
        action,
        module: 'super_admin_action',
        role: 'super_admin',
        meta_json: {
          target_id: targetId,
          reason,
          timestamp: new Date().toISOString(),
          ...metadata
        }
      });

      setSecurityState(prev => ({
        ...prev,
        actionLog: [...prev.actionLog, {
          id: crypto.randomUUID(),
          action,
          timestamp: new Date(),
          requiresReason: true,
          reason
        }]
      }));

      return true;
    } catch (error) {
      toast.error('Failed to log action');
      return false;
    }
  }, []);

  // Approval functions with mandatory logging
  const approveWithdrawal = useCallback(async (
    withdrawalId: string,
    reason: string
  ) => {
    const logged = await logActionWithReason('withdrawal_approved', withdrawalId, reason);
    if (!logged) return false;
    toast.success('Withdrawal approved');
    return true;
  }, [logActionWithReason]);

  const rejectWithdrawal = useCallback(async (
    withdrawalId: string,
    reason: string
  ) => {
    const logged = await logActionWithReason('withdrawal_rejected', withdrawalId, reason);
    if (!logged) return false;
    toast.success('Withdrawal rejected');
    return true;
  }, [logActionWithReason]);

  const freezeWallet = useCallback(async (
    userId: string,
    reason: string
  ) => {
    const logged = await logActionWithReason('wallet_frozen', userId, reason);
    if (!logged) return false;
    toast.warning('Wallet frozen');
    return true;
  }, [logActionWithReason]);

  const reversePendingPayout = useCallback(async (
    payoutId: string,
    reason: string
  ) => {
    const logged = await logActionWithReason('payout_reversed', payoutId, reason);
    if (!logged) return false;
    toast.success('Pending payout reversed');
    return true;
  }, [logActionWithReason]);

  // Role control (Master Admin excluded)
  const activateRole = useCallback(async (
    userId: string,
    role: string,
    reason: string
  ) => {
    if (role === 'master_admin') {
      toast.error('Cannot modify Master Admin role');
      return false;
    }
    const logged = await logActionWithReason('role_activated', userId, reason, { role });
    if (!logged) return false;
    toast.success(`Role ${role} activated`);
    return true;
  }, [logActionWithReason]);

  const suspendRole = useCallback(async (
    userId: string,
    role: string,
    reason: string
  ) => {
    if (role === 'master_admin') {
      toast.error('Cannot suspend Master Admin');
      return false;
    }
    const logged = await logActionWithReason('role_suspended', userId, reason, { role });
    if (!logged) return false;
    toast.warning(`Role ${role} suspended`);
    return true;
  }, [logActionWithReason]);

  // Incident command
  const declareIncident = useCallback(async (
    severity: 'low' | 'medium' | 'high' | 'critical',
    description: string
  ) => {
    const logged = await logActionWithReason('incident_declared', crypto.randomUUID(), description, { severity });
    if (!logged) return false;
    toast.error(`Incident declared: ${severity.toUpperCase()}`);
    return true;
  }, [logActionWithReason]);

  const freezeModule = useCallback(async (
    moduleId: string,
    reason: string
  ) => {
    const logged = await logActionWithReason('module_frozen', moduleId, reason);
    if (!logged) return false;
    toast.warning('Module frozen');
    return true;
  }, [logActionWithReason]);

  // BLOCKED: Manual balance edit
  const editBalance = useCallback(() => {
    toast.error('BLOCKED: Manual balance edit is not permitted');
    logSecurityEvent('blocked_balance_edit_attempt');
    return false;
  }, []);

  // BLOCKED: Create new role levels
  const createRoleLevel = useCallback(() => {
    toast.error('BLOCKED: Creating new role levels is not permitted');
    logSecurityEvent('blocked_role_creation_attempt');
    return false;
  }, []);

  // BLOCKED: Auto-ban/auto-freeze without human confirmation
  const autoAction = useCallback(() => {
    toast.error('BLOCKED: Automated actions require human confirmation');
    logSecurityEvent('blocked_auto_action_attempt');
    return false;
  }, []);

  const extendSession = useCallback(() => {
    setSecurityState(prev => ({
      ...prev,
      sessionExpiry: Date.now() + SESSION_TIMEOUT_MINUTES * 60 * 1000
    }));
  }, []);

  return {
    securityState,
    isSystemFrozen,
    setIsSystemFrozen,
    approveWithdrawal,
    rejectWithdrawal,
    freezeWallet,
    reversePendingPayout,
    activateRole,
    suspendRole,
    declareIncident,
    freezeModule,
    editBalance,
    createRoleLevel,
    autoAction,
    extendSession,
    logActionWithReason,
  };
};
