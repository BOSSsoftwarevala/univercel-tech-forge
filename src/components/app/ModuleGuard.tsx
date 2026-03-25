import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { canAccessModule } from '@/config/rbac';
import { Loader2 } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface ModuleGuardProps {
  moduleId: string;
  children: ReactNode;
}

/**
 * ModuleGuard – RBAC guard for a specific /app/<module> route.
 *
 * - If loading: shows spinner.
 * - If not authenticated: redirects to /login.
 * - If authenticated but lacks permission: redirects to /app/access-denied.
 * - Otherwise: renders children.
 *
 * Access logic is delegated entirely to canAccessModule() (src/config/rbac.ts),
 * which already grants blanket access to boss_owner and master roles.
 */
const ModuleGuard: React.FC<ModuleGuardProps> = ({ moduleId, children }) => {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="dark min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!canAccessModule(userRole as AppRole | null, moduleId)) {
    return <Navigate to="/app/access-denied" replace />;
  }

  return <>{children}</>;
};

export default ModuleGuard;
