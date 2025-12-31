/**
 * Master Admin Control Center - Flow Management Hooks
 * Handles: Login flow, Module access, Sidebar navigation, Session lifecycle
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  blackbox,
  checkAccess,
  checkSystemLock,
  checkRentalActive,
  registerDevice,
  generateDeviceFingerprint,
  getUserRentals,
  getUserPermissions,
  AccessCheckResult
} from '@/services/masterAdminServices';

// ═══════════════════════════════════════════
// LOGIN FLOW HOOK
// ═══════════════════════════════════════════

interface LoginFlowState {
  isLoading: boolean;
  requiresCaptcha: boolean;
  isAnomaly: boolean;
  anomalyReasons: string[];
  riskScore: number;
  failedAttempts: number;
}

export function useLoginFlow() {
  const navigate = useNavigate();
  const [state, setState] = useState<LoginFlowState>({
    isLoading: false,
    requiresCaptcha: false,
    isAnomaly: false,
    anomalyReasons: [],
    riskScore: 0,
    failedAttempts: 0
  });

  const checkLoginSecurity = useCallback(async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const fingerprint = await generateDeviceFingerprint();
      
      const { data, error } = await supabase.rpc('master_check_login_security', {
        p_email: email,
        p_ip_address: null,
        p_device_fingerprint: fingerprint,
        p_geo_location: null
      });
      
      if (error) throw error;
      
      const result = data as unknown as {
        require_captcha: boolean;
        is_anomaly: boolean;
        anomaly_reasons: string[];
        risk_score: number;
        failed_attempts: number;
      };
      
      setState({
        isLoading: false,
        requiresCaptcha: result.require_captcha,
        isAnomaly: result.is_anomaly,
        anomalyReasons: result.anomaly_reasons || [],
        riskScore: result.risk_score,
        failedAttempts: result.failed_attempts
      });
      
      return result;
    } catch (error) {
      console.error('Login security check failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return null;
    }
  }, []);

  const performLogin = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Check system lock first
      const lockStatus = await checkSystemLock();
      if (lockStatus.locked && lockStatus.scope === 'global') {
        await blackbox.login(false, { reason: 'system_locked' });
        toast.error('System is currently locked. Please try again later.');
        setState(prev => ({ ...prev, isLoading: false }));
        return { success: false, reason: 'system_locked' };
      }
      
      // Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        await blackbox.login(false, { email, error: error.message });
        
        // Log failed attempt
        const fingerprint = await generateDeviceFingerprint();
        await supabase.from('master_login_attempts').insert({
          email,
          ip_address: 'client',
          device_fingerprint: fingerprint,
          attempt_type: 'failed_password',
          failure_reason: error.message
        });
        
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          failedAttempts: prev.failedAttempts + 1,
          requiresCaptcha: prev.failedAttempts >= 2
        }));
        
        return { success: false, reason: error.message };
      }
      
      // Success - register device and log
      await registerDevice();
      await blackbox.login(true, { email });
      
      // Log successful attempt
      const fingerprint = await generateDeviceFingerprint();
      await supabase.from('master_login_attempts').insert({
        user_id: data.user?.id,
        email,
        ip_address: 'client',
        device_fingerprint: fingerprint,
        attempt_type: 'success',
        session_id: data.session?.access_token?.substring(0, 20)
      });
      
      // Get user role for redirect
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user?.id)
        .single();
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      // Redirect based on role
      const role = roleData?.role || 'user';
      const redirectPath = getRedirectPath(role);
      navigate(redirectPath);
      
      return { success: true, role };
    } catch (error) {
      console.error('Login failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return { success: false, reason: 'Unknown error' };
    }
  }, [navigate]);

  const performLogout = useCallback(async () => {
    try {
      await blackbox.logout();
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [navigate]);

  return {
    ...state,
    checkLoginSecurity,
    performLogin,
    performLogout
  };
}

function getRedirectPath(role: string): string {
  switch (role) {
    case 'master':
      return '/master-control';
    case 'super_admin':
      return '/super-admin';
    case 'admin':
      return '/admin';
    default:
      return '/dashboard';
  }
}

// ═══════════════════════════════════════════
// MODULE ACCESS HOOK
// ═══════════════════════════════════════════

interface ModuleAccessState {
  isLoading: boolean;
  isAllowed: boolean;
  denialReason?: string;
  riskScore: number;
  checks: AccessCheckResult['checks'] | null;
}

export function useModuleAccess(moduleName: string, action = 'view') {
  const [state, setState] = useState<ModuleAccessState>({
    isLoading: true,
    isAllowed: false,
    riskScore: 0,
    checks: null
  });

  useEffect(() => {
    let mounted = true;

    const checkModuleAccess = async () => {
      try {
        // Check access
        const result = await checkAccess(action, moduleName);
        
        if (!mounted) return;
        
        // Log the view attempt
        await blackbox.view(moduleName);
        
        setState({
          isLoading: false,
          isAllowed: result.allowed,
          denialReason: result.denial_reason,
          riskScore: result.risk_score,
          checks: result.checks
        });
        
        if (!result.allowed) {
          toast.error(`Access Denied: ${result.denial_reason}`);
        }
      } catch (error) {
        if (!mounted) return;
        setState({
          isLoading: false,
          isAllowed: false,
          denialReason: 'Access check failed',
          riskScore: 0,
          checks: null
        });
      }
    };

    checkModuleAccess();

    return () => { mounted = false; };
  }, [moduleName, action]);

  return state;
}

// ═══════════════════════════════════════════
// SIDEBAR NAVIGATION HOOK
// ═══════════════════════════════════════════

export interface SidebarModule {
  id: string;
  name: string;
  icon: string;
  path: string;
  permission: string;
  requiresRental?: boolean;
  rentalFeature?: string;
}

interface SidebarState {
  modules: SidebarModule[];
  activeModule: string | null;
  isLoading: boolean;
}

export function useSidebarNavigation(allModules: SidebarModule[]) {
  const navigate = useNavigate();
  const [state, setState] = useState<SidebarState>({
    modules: [],
    activeModule: null,
    isLoading: true
  });

  useEffect(() => {
    let mounted = true;

    const loadAllowedModules = async () => {
      try {
        const permissions = await getUserPermissions();
        const rentals = await getUserRentals();
        const activeRentalFeatures = rentals.map(r => r.feature?.feature_code);

        const allowedModules = allModules.filter(module => {
          // Check permission
          const hasPermission = permissions.includes(module.permission) || 
                               permissions.includes('all_modules');
          
          // Check rental if required
          if (module.requiresRental && module.rentalFeature) {
            return hasPermission && activeRentalFeatures.includes(module.rentalFeature);
          }
          
          return hasPermission;
        });

        if (!mounted) return;

        setState({
          modules: allowedModules,
          activeModule: null,
          isLoading: false
        });
      } catch (error) {
        if (!mounted) return;
        setState({
          modules: [],
          activeModule: null,
          isLoading: false
        });
      }
    };

    loadAllowedModules();

    return () => { mounted = false; };
  }, [allModules]);

  const navigateToModule = useCallback(async (module: SidebarModule) => {
    // Log the click
    await blackbox.click('sidebar', module.id, { path: module.path });
    
    // Check access before navigating
    const result = await checkAccess('view', module.id);
    
    if (!result.allowed) {
      toast.error(`Access Denied: ${result.denial_reason}`);
      return false;
    }
    
    setState(prev => ({ ...prev, activeModule: module.id }));
    navigate(module.path);
    return true;
  }, [navigate]);

  return {
    ...state,
    navigateToModule
  };
}

// ═══════════════════════════════════════════
// SESSION LIFECYCLE HOOK
// ═══════════════════════════════════════════

interface SessionState {
  isActive: boolean;
  sessionStart: Date | null;
  lastActivity: Date;
  systemLocked: boolean;
  lockReason?: string;
}

export function useSessionLifecycle(timeoutMinutes = 30) {
  const navigate = useNavigate();
  const [state, setState] = useState<SessionState>({
    isActive: false,
    sessionStart: null,
    lastActivity: new Date(),
    systemLocked: false
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update activity
  const updateActivity = useCallback(() => {
    setState(prev => ({ ...prev, lastActivity: new Date() }));
  }, []);

  // Check system lock periodically
  useEffect(() => {
    const checkLock = async () => {
      const lockStatus = await checkSystemLock();
      
      if (lockStatus.locked) {
        setState(prev => ({ 
          ...prev, 
          systemLocked: true, 
          lockReason: lockStatus.reason 
        }));
        
        if (lockStatus.scope === 'global') {
          toast.error('System has been locked. You will be logged out.');
          await blackbox.logout();
          await supabase.auth.signOut();
          navigate('/auth');
        }
      } else {
        setState(prev => ({ ...prev, systemLocked: false, lockReason: undefined }));
      }
    };

    checkIntervalRef.current = setInterval(checkLock, 30000); // Check every 30 seconds
    checkLock(); // Initial check

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [navigate]);

  // Session timeout
  useEffect(() => {
    const handleActivity = () => {
      updateActivity();
      
      // Reset timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(async () => {
        toast.warning('Session expired due to inactivity');
        await blackbox.logout();
        await supabase.auth.signOut();
        navigate('/auth');
      }, timeoutMinutes * 60 * 1000);
    };

    // Track activity events
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Initial timeout
    handleActivity();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [navigate, timeoutMinutes, updateActivity]);

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await registerDevice();
        setState(prev => ({
          ...prev,
          isActive: true,
          sessionStart: new Date()
        }));
      }
    };

    initSession();
  }, []);

  return {
    ...state,
    updateActivity
  };
}

// ═══════════════════════════════════════════
// RENTAL VALIDATION HOOK
// ═══════════════════════════════════════════

export function useRentalValidation(featureCode: string) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const validateRental = async () => {
      setIsLoading(true);
      const valid = await checkRentalActive(featureCode);
      
      if (mounted) {
        setIsValid(valid);
        setIsLoading(false);
      }
    };

    validateRental();

    // Revalidate every minute
    const interval = setInterval(validateRental, 60000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [featureCode]);

  return { isValid, isLoading };
}

// ═══════════════════════════════════════════
// RISK MONITORING HOOK
// ═══════════════════════════════════════════

export function useRiskMonitoring() {
  const [riskScore, setRiskScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState<'normal' | 'caution' | 'watch' | 'high' | 'critical'>('normal');

  useEffect(() => {
    let mounted = true;

    const fetchRiskScore = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('risk_scores')
          .select('current_score, risk_level')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (mounted && data) {
          setRiskScore(data.current_score || 0);
          setRiskLevel(data.risk_level as any || 'normal');
        }
      } catch (error) {
        console.error('Risk score fetch failed:', error);
      }
    };

    fetchRiskScore();

    // Subscribe to changes
    const channel = supabase
      .channel('risk-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'risk_scores'
        },
        (payload) => {
          if (mounted) {
            setRiskScore(payload.new.current_score || 0);
            setRiskLevel(payload.new.risk_level || 'normal');
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { riskScore, riskLevel };
}
