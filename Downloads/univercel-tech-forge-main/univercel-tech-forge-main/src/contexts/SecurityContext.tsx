import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useForceLogoutCheck } from '@/hooks/useForceLogoutCheck';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { toast } from 'sonner';

interface SecurityContextType {
  isSecure: boolean;
  deviceFingerprint: string | null;
  ipAddress: string | null;
  sessionStarted: Date | null;
  isTrustedDevice: boolean;
  checkDeviceTrust: () => Promise<boolean>;
  logSecurityEvent: (eventType: string, details: Record<string, any>) => Promise<void>;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

export function SecurityProvider({ children }: { children: ReactNode }) {
  const [isSecure, setIsSecure] = useState(true);
  const [deviceFingerprint, setDeviceFingerprint] = useState<string | null>(null);
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [sessionStarted, setSessionStarted] = useState<Date | null>(null);
  const [isTrustedDevice, setIsTrustedDevice] = useState(false);

  // Use force logout check
  useForceLogoutCheck();
  
  // Use session timeout (30 minutes default)
  useSessionTimeout({ timeoutMinutes: 30, warningMinutes: 5 });

  // Generate device fingerprint on mount
  useEffect(() => {
    const generateFingerprint = async () => {
      const components = [
        navigator.userAgent,
        navigator.language,
        screen.width,
        screen.height,
        screen.colorDepth,
        new Date().getTimezoneOffset(),
        navigator.hardwareConcurrency || 0,
        navigator.platform
      ];
      
      const fingerprint = components.join('|');
      const encoder = new TextEncoder();
      const data = encoder.encode(fingerprint);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setDeviceFingerprint(hash);
      sessionStorage.setItem('device_fingerprint', hash);
    };

    generateFingerprint();
    setSessionStarted(new Date());

    // Get IP address
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => {
        setIpAddress(data.ip);
        sessionStorage.setItem('session_ip', data.ip);
      })
      .catch(() => {});
  }, []);

  // Check if current device is trusted
  const checkDeviceTrust = async (): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !deviceFingerprint) return false;

      const { data } = await supabase.rpc('is_device_trusted', {
        p_user_id: user.id,
        p_fingerprint: deviceFingerprint
      });

      setIsTrustedDevice(data || false);
      return data || false;
    } catch {
      return false;
    }
  };

  // Log security events
  const logSecurityEvent = async (eventType: string, details: Record<string, any>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        module: 'security',
        action: eventType,
        meta_json: {
          ...details,
          device_fingerprint: deviceFingerprint,
          ip_address: ipAddress,
          timestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error('Failed to log security event:', err);
    }
  };

  // Check device trust on auth change
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        checkDeviceTrust();
      } else if (event === 'SIGNED_OUT') {
        setIsTrustedDevice(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [deviceFingerprint]);

  // Block copy/dev tools in production
  useEffect(() => {
    if (import.meta.env.PROD) {
      // Block context menu on sensitive elements
      const handleContextMenu = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('[data-secure]')) {
          e.preventDefault();
          toast.warning('This action is not allowed for security reasons');
          logSecurityEvent('context_menu_blocked', { element: target.tagName });
        }
      };

      // Block keyboard shortcuts
      const handleKeydown = (e: KeyboardEvent) => {
        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
          (e.ctrlKey && e.key === 'u')
        ) {
          e.preventDefault();
          logSecurityEvent('dev_tools_blocked', { key: e.key });
        }
      };

      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeydown);

      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeydown);
      };
    }
  }, []);

  return (
    <SecurityContext.Provider value={{
      isSecure,
      deviceFingerprint,
      ipAddress,
      sessionStarted,
      isTrustedDevice,
      checkDeviceTrust,
      logSecurityEvent
    }}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}
