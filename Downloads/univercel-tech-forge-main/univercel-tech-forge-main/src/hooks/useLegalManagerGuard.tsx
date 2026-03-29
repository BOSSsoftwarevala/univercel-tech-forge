import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const BLOCKED_ROUTES = [
  '/admin',
  '/finance',
  '/wallet',
  '/pricing',
  '/server',
  '/master',
  '/vala',
  '/hr-manager',
  '/dev-manager',
  '/task-manager'
];

export const useLegalManagerGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isBlocked = BLOCKED_ROUTES.some(route => 
      location.pathname.startsWith(route)
    );

    if (isBlocked) {
      console.warn(`[LEGAL_MANAGER_GUARD] Blocked access attempt to: ${location.pathname}`);
      toast.error('Access Denied: Route not permitted for Legal Manager role');
      navigate('/legal-manager', { replace: true });
    }
  }, [location.pathname, navigate]);

  const logAction = (action: string, details: Record<string, any>) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      role: 'legal_manager',
      action,
      details,
      route: location.pathname,
      immutable: true
    };
    console.log('[LEGAL_MANAGER_LOG]', JSON.stringify(logEntry));
    return logEntry;
  };

  return { logAction };
};

export default useLegalManagerGuard;
