import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SESSION_RECORD_STORAGE_KEY = 'sv.session-record-id';

interface SessionTimeoutOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
  enabled?: boolean;
}

export function useSessionTimeout(options: SessionTimeoutOptions = {}) {
  const {
    timeoutMinutes = 30,
    warningMinutes = 5,
    enabled = true
  } = options;

  const navigate = useNavigate();
  const lastActivityRef = useRef<Date>(new Date());
  const warningShownRef = useRef(false);
  const timeoutIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastHeartbeatRef = useRef(0);

  const syncSessionHeartbeat = useCallback(async () => {
    const sessionRecordId = window.localStorage.getItem(SESSION_RECORD_STORAGE_KEY);
    if (!sessionRecordId) {
      return;
    }

    const now = Date.now();
    if (now - lastHeartbeatRef.current < 30000) {
      return;
    }

    lastHeartbeatRef.current = now;

    const expiresAt = new Date(now + timeoutMinutes * 60 * 1000).toISOString();
    await supabase
      .from('user_sessions')
      .update({
        last_activity_at: new Date(now).toISOString(),
        expires_at: expiresAt,
      } as any)
      .eq('id', sessionRecordId);
  }, [timeoutMinutes]);

  const updateActivity = useCallback(() => {
    lastActivityRef.current = new Date();
    warningShownRef.current = false;
    sessionStorage.setItem('last_activity', new Date().toISOString());
    void syncSessionHeartbeat();
  }, [syncSessionHeartbeat]);

  const handleTimeout = useCallback(async () => {
    toast.error('Your session has expired due to inactivity');
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action: 'session_timeout',
          module: 'security',
          meta_json: { reason: 'inactivity' }
        });
      }
    } catch (e) {
      console.error('Failed to log session timeout:', e);
    }

    await supabase.auth.signOut();
    sessionStorage.clear();
    navigate('/session-expired');
  }, [navigate]);

  const showWarning = useCallback(() => {
    if (!warningShownRef.current) {
      warningShownRef.current = true;
      toast.warning(`Your session will expire in ${warningMinutes} minutes due to inactivity`, {
        duration: 10000,
        action: {
          label: 'Stay Logged In',
          onClick: updateActivity
        }
      });
    }
  }, [warningMinutes, updateActivity]);

  useEffect(() => {
    if (!enabled) return;

    const checkTimeout = () => {
      const now = new Date();
      const timeSinceActivity = (now.getTime() - lastActivityRef.current.getTime()) / 1000 / 60;
      
      if (timeSinceActivity >= timeoutMinutes) {
        handleTimeout();
      } else if (timeSinceActivity >= (timeoutMinutes - warningMinutes)) {
        showWarning();
      }
    };

    // Check every minute
    timeoutIdRef.current = setInterval(checkTimeout, 60000);

    // Track user activity
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll', 'mousemove'];
    const throttledUpdate = () => {
      const now = Date.now();
      const lastUpdate = parseInt(sessionStorage.getItem('last_activity_update') || '0');
      
      if (now - lastUpdate > 10000) { // Throttle to every 10 seconds
        updateActivity();
        sessionStorage.setItem('last_activity_update', now.toString());
      }
    };

    events.forEach(event => {
      window.addEventListener(event, throttledUpdate, { passive: true });
    });

    return () => {
      if (timeoutIdRef.current) {
        clearInterval(timeoutIdRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, throttledUpdate);
      });
    };
  }, [enabled, timeoutMinutes, warningMinutes, handleTimeout, showWarning, updateActivity]);

  return {
    updateActivity,
    lastActivity: lastActivityRef.current
  };
}
