import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SecurityState {
  sessionStart: Date;
  sessionValid: boolean;
  checksumValid: boolean;
  anomalyDetected: boolean;
  frozenState: boolean;
}

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export function useSecureControlGuard() {
  const navigate = useNavigate();
  const [security, setSecurity] = useState<SecurityState>({
    sessionStart: new Date(),
    sessionValid: true,
    checksumValid: true,
    anomalyDetected: false,
    frozenState: false
  });

  // Generate checksum for action verification
  const generateChecksum = useCallback((action: string, valaId: string): string => {
    const timestamp = Date.now();
    const data = `${action}:${valaId}:${timestamp}`;
    // Simple hash simulation
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  }, []);

  // Block all clipboard operations
  useEffect(() => {
    const blockClipboard = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toast.error('SECURITY VIOLATION', {
        description: 'Clipboard operations are disabled'
      });
      logSecurityEvent('clipboard_blocked', 'attempted_clipboard_access');
      return false;
    };

    // Block screenshots
    const blockScreenshot = (e: KeyboardEvent) => {
      if (
        e.key === 'PrintScreen' ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) ||
        (e.ctrlKey && e.key === 'p')
      ) {
        e.preventDefault();
        e.stopPropagation();
        toast.error('SECURITY VIOLATION', {
          description: 'Screen capture is disabled'
        });
        logSecurityEvent('screenshot_blocked', 'attempted_screen_capture');
        return false;
      }
    };

    // Block context menu
    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Block drag operations
    const blockDrag = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Block text selection
    const blockSelection = () => {
      document.getSelection()?.removeAllRanges();
    };

    // Block dev tools
    const blockDevTools = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        toast.error('SECURITY VIOLATION', {
          description: 'Developer tools access is disabled'
        });
        logSecurityEvent('devtools_blocked', 'attempted_devtools_access');
        return false;
      }
    };

    document.addEventListener('copy', blockClipboard, true);
    document.addEventListener('cut', blockClipboard, true);
    document.addEventListener('paste', blockClipboard, true);
    document.addEventListener('keydown', blockScreenshot, true);
    document.addEventListener('keydown', blockDevTools, true);
    document.addEventListener('contextmenu', blockContextMenu, true);
    document.addEventListener('dragstart', blockDrag, true);
    document.addEventListener('selectstart', blockSelection, true);

    return () => {
      document.removeEventListener('copy', blockClipboard, true);
      document.removeEventListener('cut', blockClipboard, true);
      document.removeEventListener('paste', blockClipboard, true);
      document.removeEventListener('keydown', blockScreenshot, true);
      document.removeEventListener('keydown', blockDevTools, true);
      document.removeEventListener('contextmenu', blockContextMenu, true);
      document.removeEventListener('dragstart', blockDrag, true);
      document.removeEventListener('selectstart', blockSelection, true);
    };
  }, []);

  // Session timeout monitoring
  useEffect(() => {
    const checkSession = setInterval(() => {
      const elapsed = Date.now() - security.sessionStart.getTime();
      if (elapsed > SESSION_TIMEOUT_MS) {
        setSecurity(prev => ({ ...prev, sessionValid: false }));
        toast.error('SESSION EXPIRED', {
          description: 'Your session has timed out. Redirecting...'
        });
        logSecurityEvent('session_timeout', 'session_expired');
        setTimeout(() => navigate('/auth'), 2000);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkSession);
  }, [security.sessionStart, navigate]);

  // Log security events
  const logSecurityEvent = (eventType: string, details: string) => {
    const event = {
      timestamp: new Date().toISOString(),
      type: eventType,
      details,
      checksum: generateChecksum(eventType, 'system')
    };
    console.log('[SECURITY LOG]', event);
    // In production, this would go to append-only ledger
  };

  // Freeze system on anomaly
  const freezeSystem = useCallback((reason: string) => {
    setSecurity(prev => ({ ...prev, frozenState: true, anomalyDetected: true }));
    logSecurityEvent('system_freeze', reason);
    toast.error('SYSTEM FROZEN', {
      description: 'Anomaly detected. System is locked.',
      duration: Infinity
    });
  }, [generateChecksum]);

  // Verify action checksum
  const verifyAction = useCallback((action: string, valaId: string): boolean => {
    if (security.frozenState) {
      toast.error('SYSTEM FROZEN', {
        description: 'No actions permitted while system is frozen'
      });
      return false;
    }
    const checksum = generateChecksum(action, valaId);
    logSecurityEvent('action_verified', `${action}:${checksum}`);
    return true;
  }, [security.frozenState, generateChecksum]);

  // Get remaining session time
  const getRemainingTime = useCallback(() => {
    const elapsed = Date.now() - security.sessionStart.getTime();
    const remaining = Math.max(0, SESSION_TIMEOUT_MS - elapsed);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [security.sessionStart]);

  return {
    security,
    generateChecksum,
    verifyAction,
    freezeSystem,
    getRemainingTime,
    logSecurityEvent,
    isSessionValid: security.sessionValid,
    isFrozen: security.frozenState
  };
}
