import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: AppRole | null;
  signUp: (email: string, password: string, role: AppRole, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<AppRole | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer fetching user role to prevent deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setUserRole(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (data && !error) {
        setUserRole(data.role as AppRole);
      }
    } catch (err) {
      console.error('Error fetching user role');
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
        // Insert user role
        await supabase.from('user_roles').insert({
          user_id: data.user.id,
          role: role
        });

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
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, userRole, signUp, signIn, signOut }}>
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
