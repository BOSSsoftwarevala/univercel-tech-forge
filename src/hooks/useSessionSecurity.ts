import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SessionSecurityState {
  isVerified: boolean;
  ipAddress: string | null;
  deviceFingerprint: string | null;
  lastActivity: Date;
  suspiciousActivity: boolean;
  geoLocation: { country: string; city: string; region: string } | null;
}

export const useSessionSecurity = (enforceIPLock = false) => {
  const { toast } = useToast();
  const [state, setState] = useState<SessionSecurityState>({
    isVerified: false,
    ipAddress: null,
    deviceFingerprint: null,
    lastActivity: new Date(),
    suspiciousActivity: false,
    geoLocation: null
  });

  // Generate device fingerprint
  const generateFingerprint = useCallback(async (): Promise<string> => {
    const components = [
      navigator.userAgent,
      navigator.language,
      new Date().getTimezoneOffset().toString(),
      screen.width + 'x' + screen.height,
      screen.colorDepth.toString(),
      navigator.hardwareConcurrency?.toString() || 'unknown',
      navigator.platform,
      // Canvas fingerprint
      (() => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillText('fingerprint', 2, 2);
            return canvas.toDataURL().slice(-50);
          }
        } catch {
          return 'canvas-not-available';
        }
        return 'canvas-error';
      })()
    ];

    const data = components.join('|');
    const encoder = new TextEncoder();
    const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    const hashArray = Array.from(new Uint8Array(buffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }, []);

  // Get IP and geo info
  const getIPInfo = useCallback(async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return {
        ip: data.ip,
        geo: {
          country: data.country_name,
          city: data.city,
          region: data.region
        }
      };
    } catch {
      return { ip: null, geo: null };
    }
  }, []);

  // Verify session
  const verifySession = useCallback(async () => {
    const fingerprint = await generateFingerprint();
    const { ip, geo } = await getIPInfo();

    // Get stored session info
    const storedFingerprint = sessionStorage.getItem('device_fingerprint');
    const storedIP = sessionStorage.getItem('session_ip');

    // Check for suspicious activity
    let suspicious = false;
    
    if (storedFingerprint && storedFingerprint !== fingerprint) {
      suspicious = true;
      toast({
        title: 'Security Alert',
        description: 'Device fingerprint mismatch detected.',
        variant: 'destructive'
      });
    }

    if (enforceIPLock && storedIP && storedIP !== ip) {
      suspicious = true;
      toast({
        title: 'IP Change Detected',
        description: 'Your session has been flagged for security review.',
        variant: 'destructive'
      });
      
      // Log security event
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('session_security' as any).insert({
            user_id: user.id,
            event_type: 'ip_change',
            old_ip: storedIP,
            new_ip: ip,
            device_fingerprint: fingerprint,
            is_suspicious: true
          });
        }
      } catch (error) {
        console.error('Failed to log security event:', error);
      }
    }

    // Store current session info
    sessionStorage.setItem('device_fingerprint', fingerprint);
    if (ip) sessionStorage.setItem('session_ip', ip);

    setState({
      isVerified: !suspicious,
      ipAddress: ip,
      deviceFingerprint: fingerprint,
      lastActivity: new Date(),
      suspiciousActivity: suspicious,
      geoLocation: geo
    });

    return !suspicious;
  }, [generateFingerprint, getIPInfo, enforceIPLock, toast]);

  // Activity tracking
  const updateActivity = useCallback(() => {
    setState(prev => ({ ...prev, lastActivity: new Date() }));
    sessionStorage.setItem('last_activity', new Date().toISOString());
  }, []);

  // Idle timeout
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    
    events.forEach(event => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [updateActivity]);

  // Initial verification
  useEffect(() => {
    verifySession();
  }, [verifySession]);

  // Mask sensitive data
  const maskData = useCallback((data: string, type: 'email' | 'phone'): string => {
    if (type === 'email') {
      const [local, domain] = data.split('@');
      return `${local.slice(0, 2)}****${local.slice(-1)}@${domain}`;
    } else if (type === 'phone') {
      return `${data.slice(0, 3)}****${data.slice(-3)}`;
    }
    return data;
  }, []);

  return {
    ...state,
    verifySession,
    updateActivity,
    maskData,
    generateOTP: async () => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem('pending_otp', otp);
      sessionStorage.setItem('otp_expires', (Date.now() + 300000).toString());
      return otp;
    },
    verifyOTP: (input: string): boolean => {
      const stored = sessionStorage.getItem('pending_otp');
      const expires = sessionStorage.getItem('otp_expires');
      
      if (!stored || !expires) return false;
      if (Date.now() > parseInt(expires)) {
        sessionStorage.removeItem('pending_otp');
        sessionStorage.removeItem('otp_expires');
        return false;
      }
      
      const valid = input === stored;
      if (valid) {
        sessionStorage.removeItem('pending_otp');
        sessionStorage.removeItem('otp_expires');
      }
      return valid;
    }
  };
};

export default useSessionSecurity;
