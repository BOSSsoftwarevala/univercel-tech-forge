import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

// Privileged roles that bypass approval check
const PRIVILEGED_ROLES = ['master', 'super_admin'];

type RequireRoleProps = {
  allowed: string[];
  children: ReactNode;
};

export default function RequireRole({ allowed, children }: RequireRoleProps) {
  const { user, userRole, loading, approvalStatus, isPrivileged } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (!userRole) return <Navigate to="/pending-approval" replace />;

  // Check if user has one of the allowed roles
  if (!allowed.includes(userRole)) return <Navigate to="/access-denied" replace />;

  // Privileged roles get direct access
  if (isPrivileged) return <>{children}</>;

  // Non-privileged roles must be approved
  if (approvalStatus !== 'approved') {
    return <Navigate to="/pending-approval" replace />;
  }

  return <>{children}</>;
}
