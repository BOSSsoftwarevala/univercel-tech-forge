import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

// Strict role-to-dashboard mapping (31 roles - ALL ROLES COVERED)
// MASTER gets a separate dashboard, SUPER_ADMIN gets the command center
const ROLE_DASHBOARD_MAP: Record<string, string> = {
  // Tier 1: Admin Roles
  master: '/master-admin',
  super_admin: '/super-admin',
  admin: '/super-admin',
  
  // Tier 2: Partner Roles
  franchise: '/franchise',
  reseller: '/reseller',
  influencer: '/influencer',
  
  // Tier 3: User Roles
  developer: '/developer',
  prime: '/prime',
  client: '/demos/public',
  support: '/support',
  
  // Tier 4: Manager Roles
  lead_manager: '/lead-manager',
  task_manager: '/task-manager',
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
  
  // Tier 5: Specialized Roles
  area_manager: '/area-manager',
  server_manager: '/server-manager',
  product_demo_manager: '/product-demo-manager',
  
  // Tier 6: Support System Roles
  safe_assist: '/safe-assist',
  assist_manager: '/assist-manager',
  promise_tracker: '/promise-tracker',
  promise_management: '/promise-management',
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
  const { user, userRole, approvalStatus, loading, isPrivileged, isMaster, isSuperAdmin } = useAuth();
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

    // MASTER ADMIN: Goes to master admin dashboard
    if (isMaster) {
      console.log('[Dashboard] Master Admin → /master-admin');
      setStatus('redirecting');
      hasNavigated.current = true;
      navigate('/master-admin', { replace: true });
      return;
    }

    // SUPER ADMIN: Goes to super admin command center
    if (isSuperAdmin) {
      console.log('[Dashboard] Super Admin → /super-admin');
      setStatus('redirecting');
      hasNavigated.current = true;
      navigate('/super-admin', { replace: true });
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