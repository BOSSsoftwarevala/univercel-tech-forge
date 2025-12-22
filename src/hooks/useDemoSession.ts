import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface DemoSessionData {
  demoId: string;
  startTime: number;
  duration: number;
  exitPoint: string | null;
  isTracking: boolean;
}

interface UseDemoSessionOptions {
  onSessionEnd?: (data: DemoSessionData) => void;
  autoTrack?: boolean;
}

export function useDemoSession(demoId: string, options: UseDemoSessionOptions = {}) {
  const { user } = useAuth();
  const [session, setSession] = useState<DemoSessionData>({
    demoId,
    startTime: 0,
    duration: 0,
    exitPoint: null,
    isTracking: false,
  });
  
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasLoggedRef = useRef(false);

  // Start tracking session
  const startSession = useCallback(() => {
    if (session.isTracking) return;
    
    const now = Date.now();
    startTimeRef.current = now;
    hasLoggedRef.current = false;
    
    setSession(prev => ({
      ...prev,
      startTime: now,
      duration: 0,
      isTracking: true,
      exitPoint: null,
    }));

    // Update duration every second
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setSession(prev => ({ ...prev, duration: elapsed }));
    }, 1000);

    // Log initial click if authenticated
    if (user) {
      supabase.functions.invoke('api-demos/log', {
        body: {
          demo_id: demoId,
          device_type: getDeviceType(),
          browser: getBrowser(),
          referrer: document.referrer || null,
          session_duration: 0,
          converted: false,
        }
      }).catch(console.error);
    }
  }, [demoId, user, session.isTracking]);

  // End tracking session
  const endSession = useCallback(async (exitPoint?: string) => {
    if (!session.isTracking || hasLoggedRef.current) return;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const finalDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
    hasLoggedRef.current = true;

    const finalSession: DemoSessionData = {
      demoId,
      startTime: startTimeRef.current,
      duration: finalDuration,
      exitPoint: exitPoint || 'unknown',
      isTracking: false,
    };

    setSession(finalSession);

    // Log session to backend if authenticated
    if (user && finalDuration > 0) {
      try {
        await supabase.functions.invoke('api-demos/session', {
          body: {
            demo_id: demoId,
            duration_seconds: finalDuration,
            exit_point: exitPoint || 'close',
          }
        });
      } catch (err) {
        console.error('Failed to log session:', err);
      }
    }

    options.onSessionEnd?.(finalSession);
  }, [demoId, user, session.isTracking, options]);

  // Log conversion
  const logConversion = useCallback(async () => {
    if (!user) return false;
    
    try {
      await supabase.functions.invoke('api-demos/log', {
        body: {
          demo_id: demoId,
          converted: true,
          session_duration: session.duration,
        }
      });
      return true;
    } catch (err) {
      console.error('Failed to log conversion:', err);
      return false;
    }
  }, [demoId, user, session.duration]);

  // Auto-start if enabled
  useEffect(() => {
    if (options.autoTrack && demoId) {
      startSession();
    }
  }, [options.autoTrack, demoId, startSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Don't log on unmount if already logged
      if (session.isTracking && !hasLoggedRef.current) {
        endSession('unmount');
      }
    };
  }, [endSession, session.isTracking]);

  // Handle page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && session.isTracking) {
        endSession('tab_switch');
      } else if (!document.hidden && !session.isTracking && options.autoTrack) {
        startSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [session.isTracking, options.autoTrack, startSession, endSession]);

  // Handle beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (session.isTracking) {
        endSession('page_leave');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [session.isTracking, endSession]);

  return {
    session,
    startSession,
    endSession,
    logConversion,
    isTracking: session.isTracking,
    duration: session.duration,
    formatDuration: () => formatDuration(session.duration),
  };
}

// Helper functions
function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'chrome';
  if (ua.includes('Firefox')) return 'firefox';
  if (ua.includes('Safari')) return 'safari';
  if (ua.includes('Edge')) return 'edge';
  if (ua.includes('Opera')) return 'opera';
  return 'unknown';
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
