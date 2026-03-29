import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function useForceLogoutCheck() {
  const navigate = useNavigate();

  const checkForceLogout = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: logoutTime } = await supabase.rpc('check_force_logout', {
        check_user_id: user.id
      });

      if (logoutTime) {
        const logoutDate = new Date(logoutTime);
        const sessionStart = sessionStorage.getItem('session_start');
        
        if (sessionStart && logoutDate > new Date(sessionStart)) {
          // Clear session and force logout
          await supabase.auth.signOut();
          sessionStorage.clear();
          
          toast.error('Your session has been terminated by an administrator', {
            duration: 5000
          });
          
          navigate('/auth');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Force logout check failed:', error);
      return false;
    }
  }, [navigate]);

  // Check on mount and periodically
  useEffect(() => {
    // Set session start time if not set
    if (!sessionStorage.getItem('session_start')) {
      sessionStorage.setItem('session_start', new Date().toISOString());
    }

    // Initial check
    checkForceLogout();

    // Check every 30 seconds
    const interval = setInterval(checkForceLogout, 30000);

    return () => clearInterval(interval);
  }, [checkForceLogout]);

  // Subscribe to realtime force logout events
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase
        .channel('force-logout')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'user_roles',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            const newData = payload.new as any;
            if (newData.force_logged_out_at) {
              checkForceLogout();
            }
          }
        )
        .subscribe();
    };

    setupRealtimeSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [checkForceLogout]);

  return { checkForceLogout };
}
