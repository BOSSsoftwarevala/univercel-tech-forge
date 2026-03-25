import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getBestModuleForRole } from '@/config/rbac';
import { Loader2 } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

/**
 * AppIndex – smart redirect from /app to the best module for the current user.
 *
 * Priority order is defined in src/config/rbac.ts (APP_MODULES[].priority).
 * If no module is found, falls back to /app/user.
 */
const AppIndex: React.FC = () => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="dark min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const bestModule = getBestModuleForRole(userRole as AppRole | null);
  const target = bestModule ? bestModule.path : '/app/user';

  return <Navigate to={target} replace />;
};

export default AppIndex;
