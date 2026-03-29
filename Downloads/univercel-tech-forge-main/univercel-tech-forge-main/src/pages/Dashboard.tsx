import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { getDashboardRouteForRole, selectBestRole } from '@/lib/auth-routing';

/**
 * Role-Based Dashboard Router with Approval System
 * 
 * Flow:
 * 1. MASTER & SUPER_ADMIN → Direct access to their dashboard
 * 2. Other roles with approval_status = 'approved' → Their dashboard
 * 3. Other roles with approval_status = 'pending' → Pending approval page
 * 4. Other roles with approval_status = 'rejected' → Pending approval page (shows rejection)
 * 5. No role → Public demos page
 */
const Dashboard = () => {
  const { user, userRole, approvedRoles, roleAssignments, loading, isBossOwner, isCEO, switchRole } = useAuth();
  const navigate = useNavigate();
  const hasNavigated = useRef(false);
  const [status, setStatus] = useState<'loading' | 'checking' | 'redirecting'>('loading');

  useEffect(() => {
    // Prevent multiple navigations
    if (hasNavigated.current) return;

    // Wait for auth to finish loading
    if (loading) {
      setStatus('loading');
      return;
    }

    // If no user, redirect to public demos (not auth - allow browsing)
    if (!user) {
      hasNavigated.current = true;
      navigate('/demos/public', { replace: true });
      return;
    }

    setStatus('checking');

    const approvedRole = approvedRoles.length > 0 ? (userRole && approvedRoles.includes(userRole) ? userRole : selectBestRole(approvedRoles)) : null;

    // If no approved role exists yet, use pending approval flow.
    if (!approvedRole) {
      const hasRoles = roleAssignments.length > 0;
      const timeoutId = setTimeout(() => {
        if (!hasNavigated.current) {
          console.log('[Dashboard] No approved role found, redirecting to pending');
          hasNavigated.current = true;
          navigate(hasRoles ? '/pending-approval' : '/demos/public', { replace: true });
        }
      }, 3000);
      return () => clearTimeout(timeoutId);
    }

    if (approvedRole !== userRole) {
      void switchRole(approvedRole);
      return;
    }

    // BOSS OWNER: Goes to super admin dashboard (merged master + super_admin)
    if (isBossOwner) {
      console.log('[Dashboard] Boss Owner → /super-admin');
      setStatus('redirecting');
      hasNavigated.current = true;
      navigate('/super-admin', { replace: true });
      return;
    }

    // CEO: Goes to super admin command center
    if (isCEO) {
      console.log('[Dashboard] CEO → /super-admin');
      setStatus('redirecting');
      hasNavigated.current = true;
      navigate('/super-admin', { replace: true });
      return;
    }

    const targetRoute = getDashboardRouteForRole(approvedRole);
    console.log(`[Dashboard] Approved ${approvedRole} → ${targetRoute}`);
    setStatus('redirecting');
    hasNavigated.current = true;
    navigate(targetRoute, { replace: true });
  }, [approvedRoles, isBossOwner, isCEO, loading, navigate, roleAssignments.length, switchRole, user, userRole]);

  // Reset navigation flag when user changes (logout/login cycle)
  useEffect(() => {
    hasNavigated.current = false;
  }, [user?.id]);

  const getStatusMessage = () => {
    switch (status) {
      case 'loading':
        return 'Authenticating...';
      case 'checking':
        return 'Checking access permissions...';
      case 'redirecting':
        return `Redirecting to ${userRole?.replace(/_/g, ' ')} dashboard...`;
      default:
        return 'Please wait...';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
        <div>
          <h2 className="text-xl font-semibold text-foreground">Loading Dashboard</h2>
          <p className="text-muted-foreground mt-1">{getStatusMessage()}</p>
          {userRole && (
            <p className="text-xs text-muted-foreground/70 mt-2">
              Role: {userRole} | Status: {approvalStatus || 'checking'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;