import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

// Blocked routes for Reseller Manager - SECURITY CRITICAL
const BLOCKED_ROUTES = [
  '/admin',
  '/super-admin',
  '/finance',
  '/wallet',
  '/pricing',
  '/master-control',
  '/api-manager',
  '/security-command',
  '/vala-control',
  '/marketing-manager'
];

export const useResellerManagerGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Security: Disable clipboard operations
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error('Copy operation blocked for security');
    };
    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error('Cut operation blocked for security');
    };
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error('Paste operation blocked for security');
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  // Security: Block screenshots
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.shiftKey && e.key === 'S')) {
        e.preventDefault();
        toast.error('Screenshot blocked for security');
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast.error('Context menu disabled for security');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Check if route is blocked
  const checkRouteAccess = useCallback((path: string): boolean => {
    return BLOCKED_ROUTES.some(blocked => path.startsWith(blocked));
  }, []);

  // Block navigation to restricted routes
  useEffect(() => {
    if (checkRouteAccess(location.pathname)) {
      toast.error('Access Denied: This area is restricted for Reseller Managers');
      navigate('/reseller-manager-secure');
    }
  }, [location.pathname, checkRouteAccess, navigate]);

  return { checkRouteAccess };
};
