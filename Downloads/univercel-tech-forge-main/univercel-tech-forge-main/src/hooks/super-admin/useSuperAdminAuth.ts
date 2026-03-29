import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SuperAdminSession {
  id: string;
  user_id: string;
  session_token: string;
  assigned_scope: unknown[];
  login_at: string;
  ip_address: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { id: string; email: string } | null;
  session: SuperAdminSession | null;
  scope: unknown[];
}

const SA_SESSION_KEY = 'super_admin_session';
const SA_USER_KEY = 'super_admin_user';

export function useSuperAdminAuth() {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    session: null,
    scope: []
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const storedSession = localStorage.getItem(SA_SESSION_KEY);
      const storedUser = localStorage.getItem(SA_USER_KEY);
      
      if (storedSession && storedUser) {
        try {
          const session = JSON.parse(storedSession);
          const user = JSON.parse(storedUser);
          
          // Validate session with backend
          const { data: authData } = await supabase.auth.getSession();
          
          if (authData.session) {
            const { data, error } = await supabase.functions.invoke('super-admin-auth/validate', {
              headers: {
                Authorization: `Bearer ${authData.session.access_token}`
              }
            });
            
            if (data?.success && data?.valid) {
              setState({
                isAuthenticated: true,
                isLoading: false,
                user,
                session: data.data?.session || session,
                scope: data.data?.scope || []
              });
              return;
            }
          }
        } catch {
          console.error('Session validation failed');
        }
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
    };
    
    checkSession();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Get device fingerprint
      const deviceFingerprint = await generateDeviceFingerprint();
      
      const { data, error } = await supabase.functions.invoke('super-admin-auth/login', {
        body: { email, password },
        headers: {
          'x-device-fingerprint': deviceFingerprint
        }
      });

      if (error || !data?.success) {
        toast.error(data?.error || 'Login failed');
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }

      const { user, session, super_admin_session, scope } = data.data;

      // Store session data
      localStorage.setItem(SA_SESSION_KEY, JSON.stringify(super_admin_session));
      localStorage.setItem(SA_USER_KEY, JSON.stringify({ id: user.id, email: user.email }));

      setState({
        isAuthenticated: true,
        isLoading: false,
        user: { id: user.id, email: user.email },
        session: super_admin_session,
        scope: scope || []
      });

      toast.success('Login successful');
      return true;
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Login failed');
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  }, []);

  const logout = useCallback(async (reason?: string) => {
    try {
      const { data: authData } = await supabase.auth.getSession();
      
      if (authData.session) {
        await supabase.functions.invoke('super-admin-auth/logout', {
          body: { reason },
          headers: {
            Authorization: `Bearer ${authData.session.access_token}`
          }
        });
      }

      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local storage
      localStorage.removeItem(SA_SESSION_KEY);
      localStorage.removeItem(SA_USER_KEY);
      
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        session: null,
        scope: []
      });
      
      toast.success('Logged out successfully');
      navigate('/super-admin-system/login');
    }
  }, [navigate]);

  const forceLogout = useCallback(async (targetUserId: string, reason: string): Promise<boolean> => {
    try {
      const { data: authData } = await supabase.auth.getSession();
      if (!authData.session) return false;

      const { data, error } = await supabase.functions.invoke('super-admin-auth/force-logout', {
        body: { target_user_id: targetUserId, reason },
        headers: {
          Authorization: `Bearer ${authData.session.access_token}`
        }
      });

      if (error || !data?.success) {
        toast.error(data?.error || 'Force logout failed');
        return false;
      }

      toast.success('User force logged out');
      return true;
    } catch {
      toast.error('Force logout failed');
      return false;
    }
  }, []);

  const refreshSession = useCallback(async () => {
    const { data: authData } = await supabase.auth.getSession();
    if (!authData.session?.refresh_token) return;

    await supabase.functions.invoke('super-admin-auth/refresh', {
      body: { refresh_token: authData.session.refresh_token },
      headers: {
        Authorization: `Bearer ${authData.session.access_token}`
      }
    });
  }, []);

  return {
    ...state,
    login,
    logout,
    forceLogout,
    refreshSession
  };
}

async function generateDeviceFingerprint(): Promise<string> {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset()
  ];
  
  const str = components.join('|');
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
