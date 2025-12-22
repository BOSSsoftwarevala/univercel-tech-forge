import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

// Privileged roles that get direct access without approval
const PRIVILEGED_ROLES: string[] = ['master', 'super_admin'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: AppRole | null;
  approvalStatus: 'pending' | 'approved' | 'rejected' | null;
  isPrivileged: boolean;
  signUp: (email: string, password: string, role: AppRole, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshApprovalStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);

  // Computed property: is the user privileged (master/super_admin)?
  const isPrivileged = userRole ? PRIVILEGED_ROLES.includes(userRole) : false;

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer fetching user role to prevent deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserRoleAndStatus(session.user.id);
          }, 0);
        } else {
          setUserRole(null);
          setApprovalStatus(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRoleAndStatus(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRoleAndStatus = async (userId: string) => {
    try {
      console.log('[Auth] Fetching role and approval status for user:', userId);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, approval_status')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('[Auth] Error fetching role:', error);
        return;
      }

      if (data) {
        console.log('[Auth] Role data:', data);
        setUserRole(data.role as AppRole);
        setApprovalStatus(data.approval_status as 'pending' | 'approved' | 'rejected');
        return;
      }

      console.log('[Auth] No role in database, checking auth metadata...');
      
      // If missing, try to initialize from auth metadata
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const metaRole = currentUser?.user_metadata?.role as string | undefined;
      
      if (metaRole) {
        console.log('[Auth] Found role in metadata:', metaRole);
        try {
          const { data: fnData, error: fnErr } = await supabase.functions.invoke('role-init', {
            body: { role: metaRole },
          });

          if (!fnErr && (fnData as any)?.data?.role) {
            console.log('[Auth] Role initialized via function:', (fnData as any).data.role);
            setUserRole(((fnData as any).data.role) as AppRole);
            // New users start as pending unless privileged
            const newApprovalStatus = PRIVILEGED_ROLES.includes((fnData as any).data.role) ? 'approved' : 'pending';
            setApprovalStatus(newApprovalStatus as 'pending' | 'approved' | 'rejected');
          } else if (fnErr) {
            console.error('[Auth] Role init function error:', fnErr);
          }
        } catch (fnError) {
          console.error('[Auth] Role init function failed:', fnError);
        }
      } else {
        console.warn('[Auth] No role found in database or metadata for user:', userId);
      }
    } catch (err) {
      console.error('[Auth] Error in fetchUserRoleAndStatus:', err);
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
        // Initialize role via backend function (prevents client-side role escalation and avoids RLS issues)
        await supabase.functions.invoke('role-init', { body: { role } });

        // Create role-specific profile
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
      // Other roles can be added by super_admin
      default:
        break;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
    setApprovalStatus(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      userRole, 
      approvalStatus,
      isPrivileged,
      signUp, 
      signIn, 
      signOut,
      refreshApprovalStatus
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
