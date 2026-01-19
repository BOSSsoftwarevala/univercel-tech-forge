import { ReactNode, useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

type RequireRoleProps = {
  allowed: string[];
  children: ReactNode;
  masterOnly?: boolean;
};

// Log unauthorized access attempts to audit_logs
const logUnauthorizedAccess = async (
  userId: string | undefined,
  userRole: string | null,
  attemptedPath: string,
  reason: string
) => {
  try {
    await supabase.from('audit_logs').insert({
      user_id: userId || null,
      role: userRole as any || null,
      module: 'security',
      action: 'unauthorized_access_attempt',
      meta_json: {
        attempted_path: attemptedPath,
        reason,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        blocked: true
      }
    });
  } catch (error) {
    console.error('Failed to log unauthorized access:', error);
  }
};

export default function RequireRole({ allowed, children, masterOnly = false }: RequireRoleProps) {
  const { user, userRole, loading, approvalStatus, isPrivileged, isBossOwner, wasForceLoggedOut } = useAuth();
  const location = useLocation();
  const hasLoggedRef = useRef(false);

  // Log unauthorized access attempts (only once per mount)
  useEffect(() => {
    if (loading || hasLoggedRef.current) return;

    const shouldLog = () => {
      // No user - not authenticated
      if (!user) return { log: false, reason: '' };
      
      // No role assigned
      if (!userRole) return { log: false, reason: '' };
      
      // Master-only check (now boss_owner)
      if (masterOnly && !isBossOwner) {
        return { log: true, reason: 'boss_owner_only_route' };
      }
      
      // Boss Owner bypasses all
      if (isBossOwner) return { log: false, reason: '' };
      
      // Check allowed roles
      if (!allowed.includes(userRole)) {
        // CEO can access non-boss_owner routes
        if (userRole === 'ceo' && !masterOnly) {
          return { log: false, reason: '' };
        }
        return { log: true, reason: 'role_not_allowed' };
      }
      
      // Approval check
      if (approvalStatus !== 'approved') {
        return { log: false, reason: '' }; // This is expected behavior, not unauthorized
      }
      
      return { log: false, reason: '' };
    };

    const { log, reason } = shouldLog();
    if (log && user?.id) {
      hasLoggedRef.current = true;
      logUnauthorizedAccess(user.id, userRole, location.pathname, reason);
    }
  }, [user, userRole, loading, approvalStatus, isBossOwner, masterOnly, allowed, location.pathname]);

  if (loading) {
    return (
      <div className="dark min-h-screen bg-background flex items-center justify-center">
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

  // Boss Owner-only routes
  if (masterOnly && !isBossOwner) {
    return <Navigate to="/access-denied" replace />;
  }

  // Boss Owner and CEO get direct access (bypass role check)
  if (isBossOwner) {
    return <>{children}</>;
  }

  // Check if user has one of the allowed roles
  if (!allowed.includes(userRole)) {
    // CEO can access anything except boss_owner-only
    if (userRole === 'ceo' && !masterOnly) {
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
