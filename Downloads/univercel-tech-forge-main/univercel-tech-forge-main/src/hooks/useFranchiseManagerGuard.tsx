import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

// Routes blocked for Franchise Manager role
const BLOCKED_ROUTES = [
  '/admin',
  '/finance',
  '/wallet',
  '/pricing',
  '/master-control',
  '/api-manager',
  '/security-command',
  '/vala-control',
  '/server',
  '/developer',
  '/super-admin'
];

export function useFranchiseManagerGuard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Block clipboard operations
  useEffect(() => {
    const blockClipboard = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error('Clipboard operations are disabled for security');
    };

    const blockScreenshot = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey && e.key === '4')) {
        e.preventDefault();
        toast.error('Screenshots are disabled for security');
      }
    };

    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('copy', blockClipboard);
    document.addEventListener('cut', blockClipboard);
    document.addEventListener('paste', blockClipboard);
    document.addEventListener('keydown', blockScreenshot);
    document.addEventListener('contextmenu', blockContextMenu);

    return () => {
      document.removeEventListener('copy', blockClipboard);
      document.removeEventListener('cut', blockClipboard);
      document.removeEventListener('paste', blockClipboard);
      document.removeEventListener('keydown', blockScreenshot);
      document.removeEventListener('contextmenu', blockContextMenu);
    };
  }, []);

  // Check route access
  const checkRouteAccess = useCallback((path: string): boolean => {
    return BLOCKED_ROUTES.some(route => path.startsWith(route));
  }, []);

  // Redirect if accessing blocked route
  useEffect(() => {
    if (checkRouteAccess(location.pathname)) {
      toast.error('Access Denied', {
        description: 'Franchise Managers cannot access this area'
      });
      navigate('/franchise-manager', { replace: true });
    }
  }, [location.pathname, checkRouteAccess, navigate]);

  return { checkRouteAccess };
}
