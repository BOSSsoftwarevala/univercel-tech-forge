import React, { ReactNode } from 'react';
import { Shield, Lock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { hasPermission } from '@/utils/securityUtils';

interface PermissionGuardProps {
  children: ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  role?: string;
  roles?: string[];
  fallback?: ReactNode;
  showAccessDenied?: boolean;
  onAccessDenied?: () => void;
}

export function PermissionGuard({
  children,
  permission,
  permissions = [],
  requireAll = false,
  role,
  roles = [],
  fallback,
  showAccessDenied = false,
  onAccessDenied,
}: PermissionGuardProps) {
  const { user } = useAuth();
  
  const userRole = (user as any)?.role || null;
  const userPermissions = (user as any)?.permissions || [];

  // Check role access
  const hasRoleAccess = () => {
    if (!role && roles.length === 0) return true;
    if (role) return userRole === role;
    if (roles.length > 0) return roles.includes(userRole || '');
    return true;
  };

  // Check permission access
  const hasPermissionAccess = () => {
    const allPerms = permission ? [permission, ...permissions] : permissions;
    if (allPerms.length === 0) return true;

    // Boss owner has all permissions
    if (userRole === 'boss_owner') return true;

    if (requireAll) {
      return allPerms.every(p => hasPermission(userRole, p) || userPermissions.includes(p));
    }
    return allPerms.some(p => hasPermission(userRole, p) || userPermissions.includes(p));
  };

  const isAllowed = hasRoleAccess() && hasPermissionAccess();

  if (isAllowed) {
    return <>{children}</>;
  }

  if (onAccessDenied) {
    onAccessDenied();
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showAccessDenied) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Access Denied</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          You don't have permission to access this feature. Contact your administrator for access.
        </p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return null;
}

// Higher-order component version
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  permission: string,
  fallback?: ReactNode
) {
  return function WithPermissionComponent(props: P) {
    return (
      <PermissionGuard permission={permission} fallback={fallback} showAccessDenied>
        <WrappedComponent {...props} />
      </PermissionGuard>
    );
  };
}

// Role guard component
interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  return (
    <PermissionGuard roles={allowedRoles} fallback={fallback} showAccessDenied>
      {children}
    </PermissionGuard>
  );
}

// Feature flag guard
interface FeatureGuardProps {
  children: ReactNode;
  feature: string;
  fallback?: ReactNode;
}

export function FeatureGuard({ children, feature, fallback }: FeatureGuardProps) {
  // Check if feature is enabled (could be from context, API, or localStorage)
  const enabledFeatures = JSON.parse(localStorage.getItem('enabledFeatures') || '[]');
  const isEnabled = enabledFeatures.includes(feature) || enabledFeatures.includes('all');

  if (isEnabled) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-yellow-500" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Feature Not Available</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        This feature is not enabled for your account. Contact support for more information.
      </p>
    </div>
  );
}

export default PermissionGuard;
