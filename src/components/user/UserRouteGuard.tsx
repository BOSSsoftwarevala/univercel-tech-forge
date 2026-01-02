/**
 * User Route Guard Component
 * 
 * Wraps user pages to enforce route restrictions and block admin access.
 * Shows access denied for forbidden routes.
 */

import { useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AccessDeniedUI } from '@/components/error/ErrorUI';
import { toast } from 'sonner';
// Forbidden routes for User role
const FORBIDDEN_ROUTES = [
  '/admin',
  '/super-admin',
  '/master',
  '/master-admin',
  '/finance',
  '/promise-management',
  '/developer',
  '/franchise',
  '/reseller',
  '/influencer',
  '/security-command',
  '/server-manager',
  '/api-manager',
  '/marketing-manager',
  '/seo-manager',
  '/legal-manager',
  '/area-manager',
  '/continent-super-admin',
  '/safe-assist',
  '/assist-manager',
];

interface UserRouteGuardProps {
  children: ReactNode;
}

export function UserRouteGuard({ children }: UserRouteGuardProps) {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isUser = (userRole as string) === 'user';
  const currentPath = location.pathname;
  const isForbidden = FORBIDDEN_ROUTES.some(route => currentPath.startsWith(route));

  useEffect(() => {
    if (loading) return;
    
    // If user role and trying to access forbidden route
    if (isUser && isForbidden) {
      toast.error('Access denied. This area is restricted.');
    }
  }, [isUser, isForbidden, loading]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show access denied for users trying to access forbidden routes
  if (isUser && isForbidden) {
    return (
      <div className="min-h-screen bg-background">
        <AccessDeniedUI 
          dashboardPath="/user-dashboard"
          customMessage={`You attempted to access: ${currentPath}`}
        />
      </div>
    );
  }

  return <>{children}</>;
}

export default UserRouteGuard;
