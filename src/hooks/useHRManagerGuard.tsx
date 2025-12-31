import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

// Blocked routes for HR Manager
const BLOCKED_ROUTES = [
  '/admin',
  '/finance',
  '/wallet',
  '/pricing',
  '/demos',
  '/leads',
  '/master',
  '/vala'
];

// Allowed routes for HR Manager
const ALLOWED_ROUTES = [
  '/hr-manager',
  '/logout',
  '/settings'
];

export function useHRManagerGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userRole } = useAuth();

  useEffect(() => {
    const isBlocked = BLOCKED_ROUTES.some(route => 
      location.pathname.startsWith(route)
    );

    if (isBlocked) {
      console.warn(`[HR_MANAGER_GUARD] Blocked access attempt: ${location.pathname}`);
      navigate('/hr-manager', { replace: true });
      return;
    }

    const isAllowed = ALLOWED_ROUTES.some(route => 
      location.pathname.startsWith(route)
    );

    if (!isAllowed && location.pathname !== '/') {
      navigate('/hr-manager', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Audit log all navigation
  useEffect(() => {
    console.log(`[HR_MANAGER_AUDIT] Navigation: ${location.pathname} at ${new Date().toISOString()}`);
  }, [location.pathname]);

  return {
    isBlocked: BLOCKED_ROUTES.some(route => location.pathname.startsWith(route)),
    currentPath: location.pathname,
    userId: user?.id
  };
}

export default useHRManagerGuard;
