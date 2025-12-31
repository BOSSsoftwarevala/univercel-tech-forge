import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

// Security configuration
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const ACTIVITY_CHECK_MS = 60 * 1000; // Check every minute

interface ValaSecurityState {
  valaId: string | null;
  sessionActive: boolean;
  sessionExpiresAt: number | null;
  securityLevel: 'standard' | 'elevated' | 'critical';
  isLocked: boolean;
  lastActivity: number;
  anomalyDetected: boolean;
}

interface ValaSecurityContextType extends ValaSecurityState {
  refreshSession: () => void;
  lockSession: (reason: string) => void;
  logAction: (action: string, checksum: string) => Promise<boolean>;
  generateChecksum: (data: any) => string;
  maskData: (data: string, visibleChars?: number) => string;
}

const ValaSecurityContext = createContext<ValaSecurityContextType | undefined>(undefined);

// Generate Vala ID from user ID (hash-based)
const generateValaId = (userId: string): string => {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `VALA-${Math.abs(hash).toString(36).toUpperCase().padStart(8, '0')}`;
};

// Simple checksum generation
const generateChecksum = (data: any): string => {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
};

export const ValaSecurityProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [state, setState] = useState<ValaSecurityState>({
    valaId: null,
    sessionActive: false,
    sessionExpiresAt: null,
    securityLevel: 'standard',
    isLocked: false,
    lastActivity: Date.now(),
    anomalyDetected: false,
  });

  // Block clipboard operations
  useEffect(() => {
    const blockCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      logSecurityEvent('clipboard_blocked', 'copy_attempt');
    };

    const blockCut = (e: ClipboardEvent) => {
      e.preventDefault();
      logSecurityEvent('clipboard_blocked', 'cut_attempt');
    };

    const blockPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      logSecurityEvent('clipboard_blocked', 'paste_attempt');
    };

    // Block context menu
    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      logSecurityEvent('context_menu_blocked', 'right_click');
    };

    // Block keyboard shortcuts
    const blockShortcuts = (e: KeyboardEvent) => {
      // Block Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+S, PrintScreen
      if (
        (e.ctrlKey && ['c', 'v', 'x', 's', 'p'].includes(e.key.toLowerCase())) ||
        e.key === 'PrintScreen' ||
        (e.ctrlKey && e.shiftKey && e.key === 'S')
      ) {
        e.preventDefault();
        logSecurityEvent('shortcut_blocked', e.key);
      }
    };

    document.addEventListener('copy', blockCopy);
    document.addEventListener('cut', blockCut);
    document.addEventListener('paste', blockPaste);
    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('keydown', blockShortcuts);

    return () => {
      document.removeEventListener('copy', blockCopy);
      document.removeEventListener('cut', blockCut);
      document.removeEventListener('paste', blockPaste);
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('keydown', blockShortcuts);
    };
  }, []);

  // Block screenshot attempts (visibility change detection)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        logSecurityEvent('visibility_change', 'tab_hidden');
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Session timeout management
  useEffect(() => {
    if (!user) return;

    const checkSession = () => {
      const now = Date.now();
      const idleTime = now - state.lastActivity;

      if (idleTime >= SESSION_TIMEOUT_MS) {
        setState(prev => ({ ...prev, isLocked: true, sessionActive: false }));
        logSecurityEvent('session_timeout', 'auto_lock');
      }
    };

    const interval = setInterval(checkSession, ACTIVITY_CHECK_MS);
    return () => clearInterval(interval);
  }, [user, state.lastActivity]);

  // Initialize Vala ID on user change
  useEffect(() => {
    if (user?.id) {
      const valaId = generateValaId(user.id);
      setState(prev => ({
        ...prev,
        valaId,
        sessionActive: true,
        sessionExpiresAt: Date.now() + SESSION_TIMEOUT_MS,
        lastActivity: Date.now(),
      }));
    } else {
      setState(prev => ({
        ...prev,
        valaId: null,
        sessionActive: false,
        sessionExpiresAt: null,
      }));
    }
  }, [user?.id]);

  // Track activity
  useEffect(() => {
    const updateActivity = () => {
      setState(prev => ({
        ...prev,
        lastActivity: Date.now(),
        sessionExpiresAt: Date.now() + SESSION_TIMEOUT_MS,
      }));
    };

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keypress', updateActivity);
    window.addEventListener('click', updateActivity);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keypress', updateActivity);
      window.removeEventListener('click', updateActivity);
    };
  }, []);

  const logSecurityEvent = async (eventType: string, detail: string) => {
    if (!user?.id) return;

    try {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        module: 'vala_security',
        action: eventType,
        meta_json: {
          detail,
          vala_id: state.valaId,
          timestamp: new Date().toISOString(),
          checksum: generateChecksum({ eventType, detail, time: Date.now() }),
        },
      });
    } catch (error) {
      console.error('Security log failed');
    }
  };

  const refreshSession = useCallback(() => {
    setState(prev => ({
      ...prev,
      lastActivity: Date.now(),
      sessionExpiresAt: Date.now() + SESSION_TIMEOUT_MS,
      isLocked: false,
    }));
  }, []);

  const lockSession = useCallback((reason: string) => {
    setState(prev => ({ ...prev, isLocked: true }));
    logSecurityEvent('manual_lock', reason);
  }, []);

  const logAction = useCallback(async (action: string, checksum: string): Promise<boolean> => {
    if (!user?.id || !state.valaId) return false;

    try {
      const { error } = await supabase.from('audit_logs').insert({
        user_id: user.id,
        module: 'vala_action',
        action,
        meta_json: {
          vala_id: state.valaId,
          checksum,
          timestamp: new Date().toISOString(),
          verified: true,
        },
      });

      return !error;
    } catch {
      return false;
    }
  }, [user?.id, state.valaId]);

  const maskData = useCallback((data: string, visibleChars: number = 4): string => {
    if (data.length <= visibleChars * 2) {
      return '*'.repeat(data.length);
    }
    const start = data.substring(0, visibleChars);
    const end = data.substring(data.length - visibleChars);
    const masked = '*'.repeat(Math.max(4, data.length - visibleChars * 2));
    return `${start}${masked}${end}`;
  }, []);

  return (
    <ValaSecurityContext.Provider
      value={{
        ...state,
        refreshSession,
        lockSession,
        logAction,
        generateChecksum,
        maskData,
      }}
    >
      {children}
    </ValaSecurityContext.Provider>
  );
};

export const useValaSecurity = () => {
  const context = useContext(ValaSecurityContext);
  if (!context) {
    throw new Error('useValaSecurity must be used within ValaSecurityProvider');
  }
  return context;
};

export default ValaSecurityContext;
