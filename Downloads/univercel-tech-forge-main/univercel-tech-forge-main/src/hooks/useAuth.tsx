import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useGlobalAppStore } from '@/stores/globalAppStore';

type AppRole = Database['public']['Enums']['app_role'];

type ApprovalStatus = 'pending' | 'approved' | 'rejected' | null;

type RoleAssignment = {
  role: AppRole;
  approvalStatus: ApprovalStatus;
  forceLoggedOutAt: string | null;
};

// Roles that get direct access without approval
// NOTE: master and super_admin merged into boss_owner
const PRIVILEGED_ROLES: string[] = ['boss_owner', 'master', 'super_admin', 'ceo'];
// Roles that get auto-approved on signup (no waiting)
const AUTO_APPROVED_ROLES: string[] = ['boss_owner', 'master', 'ceo', 'prime'];
const ACTIVE_ROLE_STORAGE_KEY = 'sv.active-role';
const SESSION_RECORD_STORAGE_KEY = 'sv.session-record-id';
const ROLE_PRIORITY: AppRole[] = [
  'boss_owner',
  'master',
  'super_admin',
  'ceo',
  'admin',
  'continent_super_admin',
  'country_head',
  'area_manager',
  'server_manager',
  'ai_manager',
  'finance_manager',
  'lead_manager',
  'marketing_manager',
  'support',
  'franchise',
  'reseller',
  'developer',
  'prime',
  'influencer',
  'user',
  'client',
];

const getStoredActiveRole = (): AppRole | null => {
  const value = window.localStorage.getItem(ACTIVE_ROLE_STORAGE_KEY);
  return (value as AppRole | null) || null;
};

const setStoredActiveRole = (role: AppRole | null) => {
  if (!role) {
    window.localStorage.removeItem(ACTIVE_ROLE_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(ACTIVE_ROLE_STORAGE_KEY, role);
};

const getStoredSessionRecordId = (): string | null => window.localStorage.getItem(SESSION_RECORD_STORAGE_KEY);

const setStoredSessionRecordId = (sessionRecordId: string | null) => {
  if (!sessionRecordId) {
    window.localStorage.removeItem(SESSION_RECORD_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_RECORD_STORAGE_KEY, sessionRecordId);
};

const selectPreferredRole = (roles: AppRole[]): AppRole | null => {
  if (roles.length === 0) {
    return null;
  }

  for (const role of ROLE_PRIORITY) {
    if (roles.includes(role)) {
      return role;
    }
  }

  return roles[0];
};

const inferBrowser = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('edg')) return 'Edge';
  if (userAgent.includes('chrome')) return 'Chrome';
  if (userAgent.includes('safari')) return 'Safari';
  if (userAgent.includes('firefox')) return 'Firefox';
  return 'Unknown';
};

const inferOs = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('windows')) return 'Windows';
  if (userAgent.includes('mac os')) return 'macOS';
  if (userAgent.includes('android')) return 'Android';
  if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ios')) return 'iOS';
  if (userAgent.includes('linux')) return 'Linux';
  return 'Unknown';
};

const buildDeviceInfo = (deviceFingerprint: string, activeRole: AppRole | null) => {
  const browser = inferBrowser();
  const os = inferOs();
  return JSON.stringify({
    fingerprint: deviceFingerprint,
    activeRole,
    browser,
    os,
    label: `${browser} on ${os}`,
    userAgent: navigator.userAgent,
    lastSeenAt: new Date().toISOString(),
  });
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: AppRole | null;
  activeRole: AppRole | null;
  userRoles: AppRole[];
  approvedRoles: AppRole[];
  roleAssignments: RoleAssignment[];
  approvalStatus: ApprovalStatus;
  isPrivileged: boolean;
  isBossOwner: boolean; // Merged master + super_admin
  isCEO: boolean;
  wasForceLoggedOut: boolean;
  signUp: (email: string, password: string, role: AppRole, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string, deviceFingerprint?: string) => Promise<{ error: Error | null }>;
  generateDeviceFingerprint: () => string;
  switchRole: (role: AppRole) => Promise<boolean>;
  hasRole: (role: AppRole) => boolean;
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
  const [roleAssignments, setRoleAssignments] = useState<RoleAssignment[]>([]);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>(null);
  const [wasForceLoggedOut, setWasForceLoggedOut] = useState(false);

  // Prevent race condition: SIGNED_IN event role fetch can run before we clear force-logout flag.
  const pendingSignInRef = useRef(false);
  const sessionRecordIdRef = useRef<string | null>(getStoredSessionRecordId());
  const setStoreActiveRole = useGlobalAppStore((state) => state.setActiveRole);
  const setStoreUserId = useGlobalAppStore((state) => state.setUserId);
  const setStoreSessionId = useGlobalAppStore((state) => state.setSessionId);
  const resetGlobalStore = useGlobalAppStore((state) => state.resetStore);

  const userRoles = useMemo(() => roleAssignments.map((assignment) => assignment.role), [roleAssignments]);
  const approvedRoles = useMemo(
    () => roleAssignments.filter((assignment) => assignment.approvalStatus === 'approved').map((assignment) => assignment.role),
    [roleAssignments],
  );

  // Computed properties (merged master + super_admin into boss_owner)
  const isPrivileged = approvedRoles.some((role) => PRIVILEGED_ROLES.includes(role));
  const isBossOwner = approvedRoles.some((role) => role === 'boss_owner' || role === 'master' || role === 'super_admin');
  const isCEO = approvedRoles.includes('ceo');

  const syncActiveRole = useCallback((role: AppRole | null) => {
    setUserRole(role);
    setStoreActiveRole(role);
    setStoredActiveRole(role);
  }, [setStoreActiveRole]);

  useEffect(() => {
    const activeAssignment = roleAssignments.find((assignment) => assignment.role === userRole);
    setApprovalStatus(activeAssignment?.approvalStatus ?? null);
  }, [roleAssignments, userRole]);

  // Check if user was force logged out
  const checkForceLogout = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('check_force_logout', { 
        check_user_id: userId 
      });
      
      if (!error && data) {
        setWasForceLoggedOut(true);
        await supabase.auth.signOut();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }, []);

  // Clear force logout flag when user signs in
  const clearForceLogout = useCallback(async (userId: string) => {
    try {
      await supabase.rpc('clear_force_logout', { clear_user_id: userId });
      setWasForceLoggedOut(false);
    } catch (err) {
      // Silent fail
    }
  }, []);

  const upsertSessionRecord = useCallback(async (userId: string, activeRole: AppRole | null, deviceFingerprint?: string) => {
    const fingerprint = deviceFingerprint || generateDeviceFingerprint();
    const deviceInfo = buildDeviceInfo(fingerprint, activeRole);
    const existingSessionId = sessionRecordIdRef.current;
    const now = new Date();
    const sessionExpiresAt = new Date(now.getTime() + (24 * 60 * 60 * 1000)).toISOString();
    const browser = inferBrowser();
    const os = inferOs();
    const sessionTokenHash = window.btoa(`${userId}:${fingerprint}`).slice(0, 64);
    const sessionPayload = {
      is_active: true,
      logout_at: null,
      login_at: now.toISOString(),
      last_activity_at: now.toISOString(),
      expires_at: sessionExpiresAt,
      device_info: deviceInfo,
      ip_address: 'client-side',
      device_fingerprint: fingerprint,
      browser,
      os,
      auth_strength: 'password',
      forced_reauth: false,
      risk_score: 0,
      session_token_hash: sessionTokenHash,
      revoked_reason: null,
    };

    if (existingSessionId) {
      const { error } = await supabase
        .from('user_sessions')
        .update(sessionPayload as any)
        .eq('id', existingSessionId)
        .eq('user_id', userId);

      if (!error) {
        setStoreSessionId(existingSessionId);
        return existingSessionId;
      }
    }

    const { data, error } = await supabase
      .from('user_sessions')
      .insert({
        user_id: userId,
        ...sessionPayload,
      } as any)
      .select('id')
      .single();

    if (error || !data?.id) {
      return null;
    }

    sessionRecordIdRef.current = data.id;
    setStoredSessionRecordId(data.id);
    setStoreSessionId(data.id);
    return data.id;
  }, [setStoreSessionId]);

  const closeSessionRecord = useCallback(async () => {
    const sessionRecordId = sessionRecordIdRef.current;

    if (!sessionRecordId) {
      setStoreSessionId(null);
      return;
    }

    await supabase
      .from('user_sessions')
      .update({
        is_active: false,
        logout_at: new Date().toISOString(),
        revoked_reason: 'user_signout',
      } as any)
      .eq('id', sessionRecordId);

    sessionRecordIdRef.current = null;
    setStoredSessionRecordId(null);
    setStoreSessionId(null);
  }, [setStoreSessionId]);

  const switchRole = useCallback(async (role: AppRole) => {
    const allowedRoles = approvedRoles.length > 0 ? approvedRoles : userRoles;

    if (!allowedRoles.includes(role)) {
      return false;
    }

    syncActiveRole(role);

    if (user) {
      await upsertSessionRecord(user.id, role);
    }

    return true;
  }, [approvedRoles, syncActiveRole, upsertSessionRecord, user, userRoles]);

  const hasRole = useCallback((role: AppRole) => userRoles.includes(role), [userRoles]);

  const hydrateAccessState = useCallback(async (userId: string, preferredRole?: AppRole | null) => {
    let { data, error } = await supabase
      .from('user_roles')
      .select('role, approval_status, force_logged_out_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      return;
    }

    if ((!data || data.length === 0) && session?.user?.user_metadata?.role) {
      await supabase.functions.invoke('role-init', {
        body: { role: session.user.user_metadata.role },
      });

      const retry = await supabase
        .from('user_roles')
        .select('role, approval_status, force_logged_out_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      data = retry.data;
      error = retry.error;
      if (error) {
        return;
      }
    }

    const nextAssignments: RoleAssignment[] = (data || []).map((row) => ({
      role: row.role as AppRole,
      approvalStatus: (row.approval_status as ApprovalStatus) ?? null,
      forceLoggedOutAt: row.force_logged_out_at,
    }));

    const hasForcedLogout = nextAssignments.some((assignment) => assignment.forceLoggedOutAt);
    if (hasForcedLogout) {
      setWasForceLoggedOut(true);
      await supabase.auth.signOut();
      return;
    }

    setRoleAssignments(nextAssignments);

    const approved = nextAssignments.filter((assignment) => assignment.approvalStatus === 'approved').map((assignment) => assignment.role);
    const allRoles = nextAssignments.map((assignment) => assignment.role);
    const storedRole = getStoredActiveRole();
    const allowedRoles = approved.length > 0 ? approved : allRoles;
    const resolvedRole = [preferredRole, storedRole, userRole, selectPreferredRole(allowedRoles)].find(
      (role): role is AppRole => Boolean(role && allowedRoles.includes(role)),
    ) || null;

    syncActiveRole(resolvedRole);
    setWasForceLoggedOut(false);
    setStoreUserId(userId);

    if (resolvedRole) {
      await upsertSessionRecord(userId, resolvedRole);
    }
  }, [setStoreUserId, syncActiveRole, upsertSessionRecord, userRole]);

  useEffect(() => {
    let isMounted = true;

    const applySessionState = async (nextSession: Session | null, event?: string) => {
      if (!isMounted) {
        return;
      }

      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (!nextSession?.user) {
        await closeSessionRecord();
        setRoleAssignments([]);
        setUserRole(null);
        setApprovalStatus(null);
        setWasForceLoggedOut(false);
        setStoreUserId(null);
        resetGlobalStore();
        setLoading(false);
        return;
      }

      if (event === 'SIGNED_IN' && pendingSignInRef.current) {
        return;
      }

      setLoading(true);
      await hydrateAccessState(nextSession.user.id);
      if (isMounted) {
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      void applySessionState(nextSession, event);
    });

    void (async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      await applySessionState(initialSession, 'INITIAL_SESSION');
    })();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [closeSessionRecord, hydrateAccessState, resetGlobalStore, setStoreUserId]);

  // Periodic force logout check for non-boss_owner users
  useEffect(() => {
    if (!user || isBossOwner) return;

    const checkInterval = setInterval(() => {
      checkForceLogout(user.id);
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkInterval);
  }, [user, isBossOwner, checkForceLogout]);

  const refreshApprovalStatus = async () => {
    if (user) {
      await hydrateAccessState(user.id, userRole);
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
        syncActiveRole(role);
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

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

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
        await hydrateAccessState(data.user.id);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      pendingSignInRef.current = false;
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
    await closeSessionRecord();
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRoleAssignments([]);
    setUserRole(null);
    setApprovalStatus(null);
    setWasForceLoggedOut(false);
    setStoreUserId(null);
    resetGlobalStore();
    setStoredActiveRole(null);
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
      activeRole: userRole,
      userRoles,
      approvedRoles,
      roleAssignments,
      approvalStatus,
      isPrivileged,
      isBossOwner,
      isCEO,
      wasForceLoggedOut,
      signUp, 
      signIn,
      switchRole,
      hasRole,
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
