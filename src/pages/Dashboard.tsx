import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

// Privileged roles with direct access (no approval needed)
const PRIVILEGED_ROLES = ['master', 'super_admin'];

// Strict role-to-dashboard mapping
const ROLE_DASHBOARD_MAP: Record<string, string> = {
  master: '/super-admin',
  super_admin: '/super-admin',
  admin: '/super-admin',
  developer: '/developer',
  franchise: '/franchise',
  reseller: '/reseller',
  influencer: '/influencer',
  prime: '/prime',
  client: '/demos/public',
  lead_manager: '/lead-manager',
  task_manager: '/task-manager',
  support: '/support',
  seo_manager: '/seo',
  finance_manager: '/finance',
  hr_manager: '/hr',
  legal_compliance: '/legal',
  marketing_manager: '/marketing',
  client_success: '/client-success',
  rnd_manager: '/rnd-dashboard',
  r_and_d: '/rnd-dashboard',
  performance_manager: '/performance',
  demo_manager: '/demo-manager',
  ai_manager: '/ai-console',
  api_security: '/api-integrations',
};

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
  const { user, userRole, approvalStatus, loading, isPrivileged } = useAuth();
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

    // If no role assigned yet, wait briefly then redirect to pending
    if (!userRole) {
      const timeoutId = setTimeout(() => {
        if (!hasNavigated.current) {
          console.log('[Dashboard] No role found, redirecting to pending');
          hasNavigated.current = true;
          navigate('/pending-approval', { replace: true });
        }
      }, 3000);
      return () => clearTimeout(timeoutId);
    }

    // PRIVILEGED ROLES: Direct access
    if (isPrivileged) {
      const targetRoute = ROLE_DASHBOARD_MAP[userRole] || '/super-admin';
      console.log(`[Dashboard] Privileged role: ${userRole} → ${targetRoute}`);
      setStatus('redirecting');
      hasNavigated.current = true;
      navigate(targetRoute, { replace: true });
      return;
    }

    // NON-PRIVILEGED ROLES: Check approval status
    if (approvalStatus === 'approved') {
      const targetRoute = ROLE_DASHBOARD_MAP[userRole];
      if (targetRoute) {
        console.log(`[Dashboard] Approved ${userRole} → ${targetRoute}`);
        setStatus('redirecting');
        hasNavigated.current = true;
        navigate(targetRoute, { replace: true });
      } else {
        console.warn(`[Dashboard] Unknown role: ${userRole}`);
        hasNavigated.current = true;
        navigate('/demos/public', { replace: true });
      }
    } else {
      // Pending or rejected - go to pending approval page
      console.log(`[Dashboard] ${userRole} approval status: ${approvalStatus}`);
      hasNavigated.current = true;
      navigate('/pending-approval', { replace: true });
    }
  }, [user, userRole, approvalStatus, loading, isPrivileged, navigate]);

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