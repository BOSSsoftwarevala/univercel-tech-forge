import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const BLOCKED_ROUTES = [
  '/admin',
  '/finance',
  '/wallet',
  '/pricing',
  '/master',
  '/vala',
  '/hr-manager',
  '/dev-manager',
  '/partner'
];

export const useTaskManagerGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isBlocked = BLOCKED_ROUTES.some(route => 
      location.pathname.startsWith(route)
    );

    if (isBlocked) {
      console.warn(`[TASK_MANAGER_GUARD] Blocked access attempt to: ${location.pathname}`);
      toast.error('Access Denied: Route not permitted for Task Manager role');
      navigate('/task-manager', { replace: true });
    }
  }, [location.pathname, navigate]);

  const logAction = (action: string, details: Record<string, any>) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      role: 'task_manager',
      action,
      details,
      route: location.pathname
    };
    console.log('[TASK_MANAGER_LOG]', JSON.stringify(logEntry));
    return logEntry;
  };

  return { logAction };
};

export default useTaskManagerGuard;
