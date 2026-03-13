import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { verifyTOTP, TOTPConfig } from '@/lib/security/2fa-totp';
import { checkRateLimit } from '@/lib/security/rate-limiter';
import { audit } from '@/lib/security/audit-enhanced';

type AppRole = Database['public']['Enums']['app_role'];

// Roles that get direct access without approval
// NOTE: master and super_admin merged into boss_owner
const PRIVILEGED_ROLES: string[] = ['boss_owner', 'master', 'super_admin', 'ceo'];
// Roles that get auto-approved on signup (no waiting)
const AUTO_APPROVED_ROLES: string[] = ['boss_owner', 'master', 'ceo', 'prime'];
// Roles that require 2FA on every login
const REQUIRE_2FA_ROLES: string[] = ['boss_owner', 'master', 'super_admin', 'ceo'];

export interface TwoFactorStatus {
  enabled: boolean;
  verified: boolean;
  method: 'totp' | 'sms' | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: AppRole | null;
  approvalStatus: 'pending' | 'approved' | 'rejected' | null;
  isPrivileged: boolean;
  isBossOwner: boolean; // Merged master + super_admin
  isCEO: boolean;
  wasForceLoggedOut: boolean;
  twoFactorStatus: TwoFactorStatus;
  signUp: (email: string, password: string, role: AppRole, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string, deviceFingerprint?: string) => Promise<{ error: Error | null }>;
  verifyTwoFactor: (token: string, totpSecret: string) => Promise<{ error: Error | null }>;
  generateDeviceFingerprint: () => string;
  signOut: () => Promise<void>;
  refreshApprovalStatus: () => Promise<void>;
  forceLogoutUser: (targetUserId: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  const [wasForceLoggedOut, setWasForceLoggedOut] = useState(false);
  const [roleChecked, setRoleChecked] = useState(false); // Cache flag
  const [twoFactorStatus, setTwoFactorStatus] = useState<TwoFactorStatus>({
    enabled: false,
    verified: false,
    method: null,
  });

  // Prevent race condition: SIGNED_IN event role fetch can run before we clear force-logout flag.
  const pendingSignInRef = useRef(false);

  // Computed properties (merged master + super_admin into boss_owner)
  const isPrivileged = userRole ? PRIVILEGED_ROLES.includes(userRole) : false;
  const isBossOwner = userRole === 'boss_owner' || userRole === 'master' || userRole === 'super_admin';
  const isCEO = userRole === 'ceo';

  // Track this browser-tab session start for force-logout comparisons
  const setSessionStartNow = useCallback(() => {
    try {
      const nowIso = new Date().toISOString();
      sessionStorage.setItem('session_start', nowIso);
      sessionStorage.setItem('last_activity', nowIso);
    } catch {
      // ignore
    }
  }, []);

  const clearSessionStart = useCallback(() => {
    try {
      sessionStorage.removeItem('session_start');
      sessionStorage.removeItem('last_activity');
      sessionStorage.removeItem('last_activity_update');
    } catch {
      // ignore
    }
  }, []);

  // Check if user was force logged out
  const checkForceLogout = useCallback(async (userId: string) => {
    try {
      const { data: logoutTime, error } = await supabase.rpc('check_force_logout', {
        check_user_id: userId,
      });

      if (error || !logoutTime) return false;

      let sessionStart = sessionStorage.getItem('session_start');
      if (!sessionStart) {
        // New tab / cleared sessionStorage: establish baseline and avoid false-positive force-logout loops.
        setSessionStartNow();
        sessionStart = sessionStorage.getItem('session_start');
      }

      const sessionStartTime = sessionStart ? new Date(sessionStart).getTime() : Date.now();
      const forceLogoutTime = new Date(String(logoutTime)).getTime();

      if (Number.isFinite(forceLogoutTime) && forceLogoutTime > sessionStartTime) {
        setWasForceLoggedOut(true);
        await supabase.auth.signOut();
        sessionStorage.clear();
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }, [setSessionStartNow]);
  // Clear force logout flag when user signs in
  const clearForceLogout = useCallback(async (userId: string) => {
    try {
      await supabase.rpc('clear_force_logout', { clear_user_id: userId });
      setWasForceLoggedOut(false);
    } catch {
      // Silent fail
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    // Track whether we already fetched role for this mount to avoid double-fetching
    let roleFetchedForUser: string | null = null;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);

        // Session start marker for force-logout comparisons (new login only)
        if (event === 'SIGNED_IN' && session?.user) {
          setSessionStartNow();
        }

        // If this SIGNED_IN came from our own signIn() call, we will fetch role
        // after clearing any force-logout flag to avoid an immediate signOut race.
        if (event === 'SIGNED_IN' && pendingSignInRef.current) {
          return;
        }

        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          if (roleFetchedForUser !== session.user.id) {
            roleFetchedForUser = session.user.id;
            setTimeout(() => {
              if (isMounted) fetchUserRoleAndStatus(session.user.id);
            }, 0);
          }
        } else if (event === 'SIGNED_OUT' || !session) {
          clearSessionStart();
          setUserRole(null);
          setApprovalStatus(null);
          setRoleChecked(false);

        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      setSession(session);
      setUser(session?.user ?? null);

      // If a session exists on first load (page refresh / new tab), ensure we have a baseline marker
      // so historical force-logout timestamps don't incorrectly terminate the session.
      if (session?.user && !sessionStorage.getItem('session_start')) {
        setSessionStartNow();
      }

      if (session?.user && roleFetchedForUser !== session.user.id) {
        roleFetchedForUser = session.user.id;
        fetchUserRoleAndStatus(session.user.id);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Periodic force logout check for non-boss_owner users
  useEffect(() => {
    if (!user || isBossOwner) return;

    const checkInterval = setInterval(() => {
      checkForceLogout(user.id);
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkInterval);
  }, [user, isBossOwner, checkForceLogout]);

  const fetchUserRoleAndStatus = async (userId: string) => {
    // Skip if already checked and approved
    if (roleChecked && approvalStatus === 'approved') {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, approval_status, force_logged_out_at')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        return;
      }

      if (data) {
        // Ensure we have a session baseline marker (important on refresh/new tab)
        let sessionStart = sessionStorage.getItem('session_start');
        if (!sessionStart) {
          setSessionStartNow();
          sessionStart = sessionStorage.getItem('session_start');
        }

        // Check if force logged out AFTER current session was established
        if (data.force_logged_out_at) {
          const forceLogoutTime = new Date(data.force_logged_out_at).getTime();
          const sessionStartTime = sessionStart ? new Date(sessionStart).getTime() : Date.now();

          // Only sign out if force_logged_out_at is NEWER than session start
          if (forceLogoutTime > sessionStartTime) {
            setWasForceLoggedOut(true);
            await supabase.auth.signOut();
            return;
          }
          // Otherwise it's an old flag from before login — ignore it
        }

        setUserRole(data.role as AppRole);
        setApprovalStatus(data.approval_status as 'pending' | 'approved' | 'rejected');
        setRoleChecked(true);

        // Determine whether this role requires 2FA
        if (REQUIRE_2FA_ROLES.includes(data.role)) {
          setTwoFactorStatus(prev => ({ ...prev, enabled: true }));
        }
        return;
      }

      // If missing, try to initialize from auth metadata
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const metaRole = currentUser?.user_metadata?.role as string | undefined;
      
      if (metaRole) {
        try {
          const { data: fnData, error: fnErr } = await supabase.functions.invoke('role-init', {
            body: { role: metaRole },
          });

          if (!fnErr && (fnData as any)?.data?.role) {
            setUserRole(((fnData as any).data.role) as AppRole);
            const newApprovalStatus = AUTO_APPROVED_ROLES.includes((fnData as any).data.role) ? 'approved' : 'pending';
            setApprovalStatus(newApprovalStatus as 'pending' | 'approved' | 'rejected');
            setRoleChecked(true);
          }
        } catch (fnError) {
          // Silent fail
        }
      }
    } catch (err) {
      // Silent fail
    }
  };

  const refreshApprovalStatus = async () => {
    if (user) {
      await fetchUserRoleAndStatus(user.id);
    }
  };

  const signUp = async (email: string, password: string, role: AppRole, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (error) throw error;

      // Create role entry and role-specific profile
      if (data.user) {
        // Initialize role via backend function
        await supabase.functions.invoke('role-init', { body: { role } });
        await createRoleProfile(data.user.id, role, email, fullName);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const createRoleProfile = async (userId: string, role: AppRole, email: string, fullName: string) => {
    const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');
    
    switch (role) {
      case 'developer':
        await supabase.from('developers').insert({
          user_id: userId,
          email,
          full_name: fullName,
          masked_email: maskedEmail,
          status: 'pending'
        });
        break;
      case 'franchise':
        await supabase.from('franchise_accounts').insert({
          user_id: userId,
          email,
          owner_name: fullName,
          business_name: `${fullName}'s Business`,
          phone: '',
          franchise_code: `FR-${Date.now().toString(36).toUpperCase()}`,
          masked_email: maskedEmail
        });
        break;
      case 'reseller':
        await supabase.from('reseller_accounts').insert({
          user_id: userId,
          email,
          full_name: fullName,
          phone: '',
          reseller_code: `RS-${Date.now().toString(36).toUpperCase()}`,
          masked_email: maskedEmail
        });
        break;
      case 'influencer':
        await supabase.from('influencer_accounts').insert({
          user_id: userId,
          email,
          full_name: fullName,
          masked_email: maskedEmail
        });
        break;
      case 'prime':
        await supabase.from('prime_user_profiles').insert({
          user_id: userId,
          email,
          full_name: fullName,
          masked_email: maskedEmail
        });
        break;
      default:
        break;
    }
  };

  const signIn = async (email: string, password: string, deviceFingerprint?: string) => {
    pendingSignInRef.current = true;

    // Client-side rate limiting for login attempts (keyed by email)
    const rateCheck = checkRateLimit(email, 'login');
    if (!rateCheck.allowed) {
      pendingSignInRef.current = false;
      const retryAfterSecs = Math.ceil((rateCheck.retryAfterMs ?? 0) / 1000);
      return { error: new Error(`Too many login attempts. Please wait ${retryAfterSecs} seconds.`) };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        setSessionStartNow();
      }

      if (data.user) {
        // Boss Owner should never be blocked by allowlist rules (break-glass access)
        let isBossOwner = false;
        try {
          // Use SECURITY DEFINER function - reliable even if RLS blocks direct table reads
          const [bossResult, masterResult, ceoResult] = await Promise.all([
            supabase.rpc('has_role', { _user_id: data.user.id, _role: 'boss_owner' }),
            supabase.rpc('has_role', { _user_id: data.user.id, _role: 'master' }),
            supabase.rpc('has_role', { _user_id: data.user.id, _role: 'ceo' }),
          ]);

          isBossOwner =
            bossResult.data === true || masterResult.data === true || ceoResult.data === true;
        } catch {
          // If role lookup fails, we fall back to normal login verification.
        }

        // Generate device fingerprint if not provided
        const fingerprint = deviceFingerprint || generateDeviceFingerprint();

        if (!isBossOwner) {
          // Get IP address (will be captured server-side, pass placeholder)
          const ipAddress = 'client-side';

          // Verify login is allowed via whitelist check
          const { data: verifyResult, error: verifyError } = await supabase.rpc('verify_login_allowed', {
            p_user_id: data.user.id,
            p_email: email,
            p_ip_address: ipAddress,
            p_device_fingerprint: fingerprint,
            p_user_agent: navigator.userAgent,
          });

          if (verifyError) {
            console.error('Login verification error:', verifyError);
            // Continue with login for boss/master even if verification fails
          } else if (verifyResult && typeof verifyResult === 'object') {
            const result = verifyResult as { allowed: boolean; reason?: string; message?: string };
            if (!result.allowed) {
              // Sign out and throw error
              await supabase.auth.signOut();
              throw new Error(result.message || 'Login not authorized');
            }
          }
        }

        // Clear force logout flag on successful sign in BEFORE role/status fetch
        await clearForceLogout(data.user.id);
        await fetchUserRoleAndStatus(data.user.id);

        await audit.loginAttempt(data.user.id, email, true, { deviceFingerprint: fingerprint });
      }

      return { error: null };
    } catch (error) {
      await audit.loginAttempt(null, email, false, { reason: (error as Error).message });
      return { error: error as Error };
    } finally {
      pendingSignInRef.current = false;
    }
  };

  // Verify a TOTP token for the current user
  const verifyTwoFactor = async (token: string, totpSecret: string): Promise<{ error: Error | null }> => {
    if (!user) return { error: new Error('Not authenticated') };

    // Rate-limit 2FA verification attempts
    const rateCheck = checkRateLimit(user.id, 'otp_verify');
    if (!rateCheck.allowed) {
      const retryAfterSecs = Math.ceil((rateCheck.retryAfterMs ?? 0) / 1000);
      return { error: new Error(`Too many attempts. Please wait ${retryAfterSecs} seconds.`) };
    }

    try {
      const config: TOTPConfig = { secret: totpSecret };
      const result = await verifyTOTP(config, token);

      if (!result.valid) {
        await audit.twoFactorFailed(user.id, 'totp');
        return { error: new Error('Invalid or expired verification code') };
      }

      setTwoFactorStatus({ enabled: true, verified: true, method: 'totp' });
      await audit.twoFactorVerified(user.id, 'totp');
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Generate device fingerprint for security tracking
  const generateDeviceFingerprint = (): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('fingerprint', 2, 2);
    }
    
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset().toString(),
      navigator.hardwareConcurrency?.toString() || '0',
      canvas.toDataURL()
    ];
    
    // Simple hash
    let hash = 0;
    const str = components.join('|');
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    clearSessionStart();
    setUser(null);
    setSession(null);
    setUserRole(null);
    setApprovalStatus(null);
    setWasForceLoggedOut(false);
    setTwoFactorStatus({ enabled: false, verified: false, method: null });
  };

  // Boss Owner only: Force logout a user
  const forceLogoutUser = async (targetUserId: string): Promise<{ error: Error | null }> => {
    try {
      if (!isBossOwner || !user) {
        throw new Error('Only Boss Owner can force logout users');
      }

      const { error } = await supabase.rpc('force_logout_user', {
        target_user_id: targetUserId,
        admin_user_id: user.id
      });

      if (error) throw error;

      await audit.privilegedAction(user.id, userRole ?? 'boss_owner', 'force_logout_user', {
        targetUserId,
      });

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      userRole, 
      approvalStatus,
      isPrivileged,
      isBossOwner,
      isCEO,
      wasForceLoggedOut,
      twoFactorStatus,
      signUp, 
      signIn,
      verifyTwoFactor,
      signOut,
      refreshApprovalStatus,
      forceLogoutUser,
      generateDeviceFingerprint
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

