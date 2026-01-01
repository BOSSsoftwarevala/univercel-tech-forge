import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Generate device fingerprint
const getDeviceFingerprint = (): string => {
  const nav = window.navigator;
  const screen = window.screen;
  const fingerprint = [
    nav.userAgent,
    nav.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    nav.hardwareConcurrency || 'unknown',
  ].join('|');
  
  // Simple hash
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};

interface SecurityContext {
  isAuthenticated: boolean;
  isValidSession: boolean;
  adminId: string | null;
  sessionId: string | null;
  scopeType: string | null;
  assignedScope: Record<string, unknown> | null;
  securityClearance: string | null;
  isSystemLocked: boolean;
  lockReason: string | null;
}

interface AuthorizationResult {
  authorized: boolean;
  reason?: string;
}

export function useSuperAdminSecurity() {
  const [securityContext, setSecurityContext] = useState<SecurityContext>({
    isAuthenticated: false,
    isValidSession: false,
    adminId: null,
    sessionId: null,
    scopeType: null,
    assignedScope: null,
    securityClearance: null,
    isSystemLocked: false,
    lockReason: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Validate session
  const validateSession = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSecurityContext(prev => ({ ...prev, isAuthenticated: false, isValidSession: false }));
        return false;
      }

      const storedToken = sessionStorage.getItem('sa_session_token');
      if (!storedToken) {
        setSecurityContext(prev => ({ ...prev, isAuthenticated: true, isValidSession: false }));
        return false;
      }

      const fingerprint = getDeviceFingerprint();
      
      const { data, error } = await supabase.rpc('validate_super_admin_session', {
        p_user_id: user.id,
        p_session_token: storedToken,
        p_ip_address: 'client',
        p_device_fingerprint: fingerprint
      });

      const result = data as Record<string, unknown> | null;
      
      if (error || !result?.valid) {
        sessionStorage.removeItem('sa_session_token');
        setSecurityContext({
          isAuthenticated: true,
          isValidSession: false,
          adminId: null,
          sessionId: null,
          scopeType: null,
          assignedScope: null,
          securityClearance: null,
          isSystemLocked: result?.reason === 'system_locked',
          lockReason: (result?.lock_reason as string) || null,
        });
        return false;
      }

      setSecurityContext({
        isAuthenticated: true,
        isValidSession: true,
        adminId: result.admin_id as string,
        sessionId: result.session_id as string,
        scopeType: result.scope_type as string,
        assignedScope: result.assigned_scope as Record<string, unknown>,
        securityClearance: result.security_clearance as string,
        isSystemLocked: false,
        lockReason: null,
      });
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }, []);

  // Create session after login
  const createSession = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const fingerprint = getDeviceFingerprint();
      
      const { data, error } = await supabase.rpc('create_super_admin_session', {
        p_user_id: user.id,
        p_device_fingerprint: fingerprint,
        p_ip_address: 'client',
        p_user_agent: navigator.userAgent
      });

      const result = data as Record<string, unknown> | null;
      
      if (error || !result?.success) {
        toast.error('Session creation failed: ' + ((result?.reason as string) || error?.message));
        return null;
      }

      sessionStorage.setItem('sa_session_token', result.session_token as string);
      setSessionToken(result.session_token as string);
      
      setSecurityContext({
        isAuthenticated: true,
        isValidSession: true,
        adminId: result.admin_id as string,
        sessionId: result.session_id as string,
        scopeType: result.scope_type as string,
        assignedScope: result.assigned_scope as Record<string, unknown>,
        securityClearance: null,
        isSystemLocked: false,
        lockReason: null,
      });

      return result;
    } catch (error) {
      console.error('Session creation error:', error);
      return null;
    }
  }, []);

  // Check authorization for action
  const checkAuthorization = useCallback(async (
    action: string,
    targetScope?: { continent?: string; country?: string }
  ): Promise<AuthorizationResult> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { authorized: false, reason: 'not_authenticated' };

      const { data, error } = await supabase.rpc('check_super_admin_authorization', {
        p_user_id: user.id,
        p_action: action,
        p_target_scope: targetScope || null
      });

      if (error) {
        return { authorized: false, reason: error.message };
      }

      const result = data as Record<string, unknown> | null;
      return {
        authorized: (result?.authorized as boolean) || false,
        reason: result?.reason as string | undefined
      };
    } catch (error) {
      return { authorized: false, reason: 'error' };
    }
  }, []);

  // Log action
  const logAction = useCallback(async (
    actionType: string,
    actionCategory: string,
    options?: {
      targetType?: string;
      targetId?: string;
      riskLevel?: 'normal' | 'high' | 'critical';
      reason?: string;
      previousState?: Record<string, unknown>;
      newState?: Record<string, unknown>;
      status?: 'success' | 'failed' | 'blocked';
    }
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !securityContext.adminId) return;

      await supabase.rpc('log_super_admin_action', {
        p_admin_id: user.id,
        p_action_type: actionType,
        p_action_category: actionCategory,
        p_target_type: options?.targetType || null,
        p_target_id: options?.targetId || null,
        p_risk_level: options?.riskLevel || 'normal',
        p_reason: options?.reason || null,
        p_previous_state: options?.previousState ? JSON.parse(JSON.stringify(options.previousState)) : null,
        p_new_state: options?.newState ? JSON.parse(JSON.stringify(options.newState)) : null,
        p_ip_address: 'client',
        p_status: options?.status || 'success'
      });
    } catch (error) {
      console.error('Action logging error:', error);
    }
  }, [securityContext.adminId]);

  // Terminate session
  const terminateSession = useCallback(async () => {
    const token = sessionStorage.getItem('sa_session_token');
    if (token) {
      await supabase
        .from('super_admin_sessions')
        .update({ is_active: false, terminated_at: new Date().toISOString(), termination_reason: 'logout' })
        .eq('session_token', token);
    }
    sessionStorage.removeItem('sa_session_token');
    setSecurityContext({
      isAuthenticated: false,
      isValidSession: false,
      adminId: null,
      sessionId: null,
      scopeType: null,
      assignedScope: null,
      securityClearance: null,
      isSystemLocked: false,
      lockReason: null,
    });
  }, []);

  // Check if target is within scope
  const isWithinScope = useCallback((target: { continent?: string; country?: string }): boolean => {
    if (!securityContext.assignedScope || securityContext.scopeType === 'global') {
      return true;
    }

    const scope = securityContext.assignedScope as { continents?: string[]; countries?: string[] };

    if (securityContext.scopeType === 'continent' && target.continent) {
      return scope.continents?.includes(target.continent) || false;
    }

    if (securityContext.scopeType === 'country' && target.country) {
      return scope.countries?.includes(target.country) || false;
    }

    return false;
  }, [securityContext.assignedScope, securityContext.scopeType]);

  // Initialize
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await validateSession();
      setIsLoading(false);
    };
    init();

    // Periodic validation (every 5 minutes)
    const interval = setInterval(validateSession, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [validateSession]);

  return {
    ...securityContext,
    isLoading,
    sessionToken,
    validateSession,
    createSession,
    checkAuthorization,
    logAction,
    terminateSession,
    isWithinScope,
    deviceFingerprint: getDeviceFingerprint(),
  };
}

// Hook for high-risk action confirmation
export function useHighRiskAction() {
  const [isPending, setIsPending] = useState(false);
  const security = useSuperAdminSecurity();

  const executeHighRiskAction = useCallback(async <T>(
    action: () => Promise<T>,
    options: {
      actionType: string;
      actionCategory: string;
      targetType?: string;
      targetId?: string;
      reason: string;
      previousState?: Record<string, unknown>;
    }
  ): Promise<{ success: boolean; result?: T; error?: string }> => {
    setIsPending(true);

    try {
      // Check authorization
      const authResult = await security.checkAuthorization(options.actionType);
      if (!authResult.authorized) {
        await security.logAction(options.actionType, options.actionCategory, {
          ...options,
          riskLevel: 'high',
          status: 'blocked'
        });
        return { success: false, error: authResult.reason };
      }

      // Execute action
      const result = await action();

      // Log success
      await security.logAction(options.actionType, options.actionCategory, {
        ...options,
        riskLevel: 'high',
        status: 'success'
      });

      return { success: true, result };
    } catch (error) {
      // Log failure
      await security.logAction(options.actionType, options.actionCategory, {
        ...options,
        riskLevel: 'high',
        status: 'failed'
      });

      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    } finally {
      setIsPending(false);
    }
  }, [security]);

  return { executeHighRiskAction, isPending };
}
