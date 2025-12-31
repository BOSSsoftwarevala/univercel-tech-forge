import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Routes blocked for Influencer Manager - NO finance, pricing, admin access
const BLOCKED_ROUTES = [
  '/finance',
  '/wallet',
  '/pricing',
  '/admin',
  '/master',
  '/super-admin',
  '/payout',
  '/payouts',
  '/commission-edit',
  '/billing',
  '/server',
  '/developer',
  '/internal',
];

export function useInfluencerManagerGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Block clipboard operations
  useEffect(() => {
    const blockClipboard = (e: ClipboardEvent) => {
      e.preventDefault();
      toast({
        title: "Action Blocked",
        description: "Clipboard operations are disabled for security.",
        variant: "destructive",
      });
    };

    const blockScreenshot = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey && e.key === '4')) {
        e.preventDefault();
        toast({
          title: "Action Blocked",
          description: "Screenshots are disabled for security.",
          variant: "destructive",
        });
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
  }, [toast]);

  // Check route access
  const checkRouteAccess = useCallback((path: string): boolean => {
    return !BLOCKED_ROUTES.some(blocked => path.toLowerCase().startsWith(blocked.toLowerCase()));
  }, []);

  // Redirect if on blocked route
  useEffect(() => {
    if (!checkRouteAccess(location.pathname)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this area.",
        variant: "destructive",
      });
      navigate('/influencer-manager-secure');
    }
  }, [location.pathname, checkRouteAccess, navigate, toast]);

  return { checkRouteAccess };
}
