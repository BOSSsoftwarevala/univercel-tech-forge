// ==============================================
// Server Manager Security Guard
// INFRA GUARDIAN - ZERO TRUST
// ==============================================

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SecurityState {
  isAuthorized: boolean;
  sessionStarted: Date | null;
  sessionTimeRemaining: number;
  isSystemFrozen: boolean;
  violations: string[];
}

const BLOCKED_ROUTES = [
  '/admin',
  '/finance',
  '/wallet',
  '/pricing',
  '/partner',
  '/franchise',
  '/reseller',
  '/leads',
  '/clients',
  '/sales',
  '/support',
  '/users',
  '/profiles',
  '/pii',
];

const SESSION_DURATION = 45 * 60 * 1000; // 45 minutes for server ops

export function useServerManagerGuard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [securityState, setSecurityState] = useState<SecurityState>({
    isAuthorized: false,
    sessionStarted: null,
    sessionTimeRemaining: SESSION_DURATION,
    isSystemFrozen: false,
    violations: [],
  });

  // Block unauthorized routes
  useEffect(() => {
    const currentPath = location.pathname.toLowerCase();
    const isBlocked = BLOCKED_ROUTES.some(route => currentPath.startsWith(route));
    
    if (isBlocked) {
      toast.error('ACCESS DENIED: Business/Admin UI access blocked for Server Manager');
      navigate('/server-manager');
      
      setSecurityState(prev => ({
        ...prev,
        violations: [...prev.violations, `Blocked route attempt: ${currentPath}`],
      }));
    }
  }, [location.pathname, navigate]);

  // Disable clipboard operations
  useEffect(() => {
    const blockCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error('SECURITY: Copy operations disabled');
    };
    
    const blockPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error('SECURITY: Paste operations disabled');
    };
    
    const blockKeyboard = (e: KeyboardEvent) => {
      // Block PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        toast.error('SECURITY: Screenshots blocked');
      }
      // Block Ctrl+C, Ctrl+V, Ctrl+X
      if (e.ctrlKey && ['c', 'v', 'x'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      // Block F12 / DevTools
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        toast.error('SECURITY: Developer tools blocked');
      }
    };

    document.addEventListener('copy', blockCopy);
    document.addEventListener('paste', blockPaste);
    document.addEventListener('cut', blockCopy);
    document.addEventListener('keydown', blockKeyboard);

    return () => {
      document.removeEventListener('copy', blockCopy);
      document.removeEventListener('paste', blockPaste);
      document.removeEventListener('cut', blockCopy);
      document.removeEventListener('keydown', blockKeyboard);
    };
  }, []);

  // Session timer
  useEffect(() => {
    if (!securityState.sessionStarted) {
      setSecurityState(prev => ({
        ...prev,
        sessionStarted: new Date(),
        isAuthorized: true,
      }));
    }

    const timer = setInterval(() => {
      setSecurityState(prev => {
        const elapsed = Date.now() - (prev.sessionStarted?.getTime() || Date.now());
        const remaining = Math.max(0, SESSION_DURATION - elapsed);
        
        if (remaining <= 0) {
          toast.error('SESSION EXPIRED: Re-authentication required');
          navigate('/login');
          return { ...prev, isSystemFrozen: true, sessionTimeRemaining: 0 };
        }
        
        if (remaining <= 5 * 60 * 1000 && remaining > 4.9 * 60 * 1000) {
          toast.warning('Session expires in 5 minutes');
        }
        
        return { ...prev, sessionTimeRemaining: remaining };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, securityState.sessionStarted]);

  const formatTimeRemaining = () => {
    const minutes = Math.floor(securityState.sessionTimeRemaining / 60000);
    const seconds = Math.floor((securityState.sessionTimeRemaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const requireApproval = async (action: string, severity: 'low' | 'medium' | 'high' | 'critical') => {
    if (severity === 'critical' || severity === 'high') {
      toast.warning(`Action "${action}" requires Admin approval`);
      return { approved: false, pendingApproval: true };
    }
    return { approved: true, pendingApproval: false };
  };

  return {
    ...securityState,
    formatTimeRemaining,
    requireApproval,
  };
}
