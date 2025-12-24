import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

type RequireRoleProps = {
  allowed: string[];
  children: ReactNode;
  masterOnly?: boolean;
};

export default function RequireRole({ allowed, children, masterOnly = false }: RequireRoleProps) {
  const { user, userRole, loading, approvalStatus, isPrivileged, isMaster, wasForceLoggedOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // If user was force logged out, redirect to auth
  if (wasForceLoggedOut) {
    return <Navigate to="/auth" replace />;
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (!userRole) return <Navigate to="/pending-approval" replace />;

  // Master-only routes
  if (masterOnly && !isMaster) {
    return <Navigate to="/access-denied" replace />;
  }

  // Master and Super Admin get direct access (bypass role check)
  if (isMaster) {
    return <>{children}</>;
  }

  // Check if user has one of the allowed roles
  if (!allowed.includes(userRole)) {
    // Super admin can access anything except master-only
    if (userRole === 'super_admin' && !masterOnly) {
      return <>{children}</>;
    }
    return <Navigate to="/access-denied" replace />;
  }

  // Non-privileged roles must be approved
  if (approvalStatus !== 'approved') {
    return <Navigate to="/pending-approval" replace />;
  }

  return <>{children}</>;
}
