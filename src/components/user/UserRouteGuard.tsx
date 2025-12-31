/**
 * User Route Guard Component
 * 
 * Wraps user pages to enforce route restrictions and block admin access.
 * Shows access denied for forbidden routes.
 */

import { useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-destructive/5 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="w-full max-w-md border-destructive/30">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <ShieldX className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Access Denied</CardTitle>
              <CardDescription>
                This area is restricted. You don't have permission to access this page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-center text-muted-foreground">
                You attempted to access: <code className="bg-muted px-2 py-1 rounded">{currentPath}</code>
              </p>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
                <Button
                  onClick={() => navigate('/user-dashboard')}
                  className="flex-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}

export default UserRouteGuard;
