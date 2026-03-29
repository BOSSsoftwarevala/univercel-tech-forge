/**
 * Prime Route Guard Component
 * 
 * Wraps Prime user pages to enforce route restrictions.
 * Blocks admin/finance/partner access with premium styling.
 */

import { useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { AccessDeniedUI } from '@/components/error/ErrorUI';
import { toast } from 'sonner';

// Forbidden routes for Prime role
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

interface PrimeRouteGuardProps {
  children: ReactNode;
}

export function PrimeRouteGuard({ children }: PrimeRouteGuardProps) {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isPrime = (userRole as string) === 'prime';
  const currentPath = location.pathname;
  const isForbidden = FORBIDDEN_ROUTES.some(route => currentPath.startsWith(route));

  useEffect(() => {
    if (loading) return;
    
    if (isPrime && isForbidden) {
      toast.error('Access restricted. Premium benefits do not include admin access.');
    }
  }, [isPrime, isForbidden, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950/20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (isPrime && isForbidden) {
    return (
      <div className="min-h-screen bg-background">
        <AccessDeniedUI 
          dashboardPath="/prime"
          customMessage={`You attempted to access: ${currentPath}. Prime membership includes premium demos, priority support, and faster SLA — but not administrative controls.`}
        />
      </div>
    );
  }

  return <>{children}</>;
}

export default PrimeRouteGuard;
