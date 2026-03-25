import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, ArrowLeft, Home, Sparkles, Coffee } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getBestModuleForRole } from '@/config/rbac';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

/**
 * AppAccessDenied – shown at /app/access-denied when a user visits a
 * module they don't have permission to access.
 */
const AppAccessDenied: React.FC = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();

  const handleGoToDashboard = () => {
    const best = getBestModuleForRole(userRole as AppRole | null);
    navigate(best ? best.path : '/app/user', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-xl">
          <CardHeader className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-2"
            >
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Lock className="w-10 h-10 text-amber-500" />
              </motion.div>
            </motion.div>
            <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
            <CardDescription className="text-base">
              You don't have permission to access this module.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-xl p-4 border border-green-500/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-400">Pro Tip</p>
                  <p className="text-xs text-muted-foreground">
                    Contact your admin to request access to this module.
                  </p>
                </div>
              </div>
            </motion.div>

            {user && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-muted/50 rounded-xl p-4"
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Your Current Role:</span>
                  <span className="font-medium capitalize bg-primary/10 text-primary px-3 py-1 rounded-full text-xs">
                    {userRole?.replace(/_/g, ' ') || 'Guest'}
                  </span>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                What you can do:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Go back to your permitted modules
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Request access upgrade from your admin
                </li>
              </ul>
            </motion.div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button onClick={handleGoToDashboard} className="w-full gap-2">
              <Home className="w-4 h-4" />
              Go to My Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)} className="w-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default AppAccessDenied;
