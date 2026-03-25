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
  '/super-admin',
  '/developer-secure',
  '/dev-manager-secure',
  '/task-manager-secure',
  '/legal-manager-secure',
  '/pro-manager-secure'
];

export const useLeadManagerGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isBlocked = BLOCKED_ROUTES.some(route => 
      location.pathname.startsWith(route)
    );

    if (isBlocked) {
      toast.error('ACCESS DENIED: Route blocked for Lead Manager role');
      navigate('/lead-manager-secure', { replace: true });
    }

    // Disable clipboard operations
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error('Copy operation disabled for security');
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error('Paste operation disabled for security');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'p')) {
        e.preventDefault();
        toast.error('Keyboard shortcuts disabled for security');
      }
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        toast.error('Screenshot disabled for security');
      }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [location.pathname, navigate]);

  return { isGuarded: true };
};
