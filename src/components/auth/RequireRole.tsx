import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

type RequireRoleProps = {
  allowed: string[];
  children: ReactNode;
};

export default function RequireRole({ allowed, children }: RequireRoleProps) {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (!userRole) return <Navigate to="/access-denied" replace />;

  if (!allowed.includes(userRole)) return <Navigate to="/access-denied" replace />;

  return <>{children}</>;
}
