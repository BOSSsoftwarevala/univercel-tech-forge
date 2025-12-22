import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

// Only master and super_admin get direct access
const PRIVILEGED_ROLES: string[] = ['master', 'super_admin'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: AppRole | null;
  approvalStatus: 'pending' | 'approved' | 'rejected' | null;
  isPrivileged: boolean;
  isMaster: boolean;
  isSuperAdmin: boolean;
  wasForceLoggedOut: boolean;
  signUp: (email: string, password: string, role: AppRole, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
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

  // Prevent race condition: SIGNED_IN event role fetch can run before we clear force-logout flag.
  const pendingSignInRef = useRef(false);


  // Computed properties
  const isPrivileged = userRole ? PRIVILEGED_ROLES.includes(userRole) : false;
  const isMaster = userRole === 'master';
  const isSuperAdmin = userRole === 'super_admin';

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

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // If this SIGNED_IN came from our own signIn() call, we will fetch role
        // after clearing any force-logout flag to avoid an immediate signOut race.
        if (event === 'SIGNED_IN' && pendingSignInRef.current) {
          return;
        }

        // Only fetch role on SIGNED_IN event or if not already checked
        if (session?.user && (event === 'SIGNED_IN' || !roleChecked)) {
          setTimeout(() => {
            fetchUserRoleAndStatus(session.user.id);
          }, 0);
        } else if (!session) {
          setUserRole(null);
          setApprovalStatus(null);
          setRoleChecked(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user && !roleChecked) {
        fetchUserRoleAndStatus(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [roleChecked]);

  // Periodic force logout check for non-master users
  useEffect(() => {
    if (!user || isMaster) return;

    const checkInterval = setInterval(() => {
      checkForceLogout(user.id);
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkInterval);
  }, [user, isMaster, checkForceLogout]);

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
        // Check if force logged out
        if (data.force_logged_out_at) {
          setWasForceLoggedOut(true);
          await supabase.auth.signOut();
          return;
        }

        setUserRole(data.role as AppRole);
        setApprovalStatus(data.approval_status as 'pending' | 'approved' | 'rejected');
        setRoleChecked(true);
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
            const newApprovalStatus = PRIVILEGED_ROLES.includes((fnData as any).data.role) ? 'approved' : 'pending';
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

  const signIn = async (email: string, password: string) => {
    pendingSignInRef.current = true;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Clear force logout flag on successful sign in BEFORE role/status fetch
      if (data.user) {
        await clearForceLogout(data.user.id);
        await fetchUserRoleAndStatus(data.user.id);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      pendingSignInRef.current = false;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
    setApprovalStatus(null);
    setWasForceLoggedOut(false);
  };

  // Master Admin only: Force logout a user
  const forceLogoutUser = async (targetUserId: string): Promise<{ error: Error | null }> => {
    try {
      if (!isMaster || !user) {
        throw new Error('Only Master Admin can force logout users');
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
      approvalStatus,
      isPrivileged,
      isMaster,
      isSuperAdmin,
      wasForceLoggedOut,
      signUp, 
      signIn, 
      signOut,
      refreshApprovalStatus,
      forceLogoutUser
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
