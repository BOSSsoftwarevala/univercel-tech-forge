import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

// Blocked routes for Developer Manager
const BLOCKED_ROUTES = [
  '/admin',
  '/finance',
  '/wallet',
  '/pricing',
  '/master',
  '/demos',
  '/users',
  '/vala'
];

// Allowed routes for Developer Manager
const ALLOWED_ROUTES = [
  '/dev-manager',
  '/logout',
  '/settings'
];

export interface DevManagerStats {
  totalDevelopers: number;
  activeTasks: number;
  atRiskTasks: number;
  blockedTasks: number;
  overdueCount: number;
}

export function useDevManagerGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userRole } = useAuth();

  useEffect(() => {
    // Check if trying to access blocked route
    const isBlocked = BLOCKED_ROUTES.some(route => 
      location.pathname.startsWith(route)
    );

    if (isBlocked) {
      navigate('/dev-manager', { replace: true });
      return;
    }

    // Check if on allowed route
    const isAllowed = ALLOWED_ROUTES.some(route => 
      location.pathname.startsWith(route)
    );

    if (!isAllowed && location.pathname !== '/') {
      navigate('/dev-manager', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Navigation logging handled by action_logs table

  return {
    isBlocked: BLOCKED_ROUTES.some(route => location.pathname.startsWith(route)),
    currentPath: location.pathname,
    userId: user?.id
  };
}

export default useDevManagerGuard;
