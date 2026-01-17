import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

// ============================================
// ROLE → DASHBOARD ROUTING (ENTERPRISE LOCKED)
// ============================================
// Every role MUST have a valid dashboard route
// NO BLANK SCREEN • NO DEAD END • NO FALLBACK LOOP

const ROLE_DASHBOARD_MAP: Record<string, string> = {
  // ═══════════════════════════════════════════
  // TIER 1: BOSS / SUPER ADMIN
  // ═══════════════════════════════════════════
  boss_owner: '/super-admin',
  master: '/super-admin',
  super_admin: '/super-admin',
  admin: '/super-admin',
  ceo: '/super-admin',

  // ═══════════════════════════════════════════
  // TIER 2: COUNTRY / AREA MANAGEMENT
  // ═══════════════════════════════════════════
  country_head: '/super-admin-system/role-switch?role=country_head',
  area_manager: '/super-admin-system/role-switch?role=country_head',

  // ═══════════════════════════════════════════
  // TIER 3: PARTNER ROLES
  // ═══════════════════════════════════════════
  franchise: '/franchise',
  reseller: '/reseller',
  reseller_manager: '/reseller',
  influencer: '/influencer',

  // ═══════════════════════════════════════════
  // TIER 4: DEVELOPMENT & TECHNICAL
  // ═══════════════════════════════════════════
  developer: '/developer',
  server_manager: '/server-manager',
  api_security: '/api-integrations',
  ai_manager: '/ai-console',
  r_and_d: '/rnd-dashboard',
  rnd_manager: '/rnd-dashboard',

  // ═══════════════════════════════════════════
  // TIER 5: SALES & MARKETING
  // ═══════════════════════════════════════════
  lead_manager: '/lead-manager',
  marketing_manager: '/marketing',
  seo_manager: '/seo',
  client_success: '/client-success',
  performance_manager: '/performance',

  // ═══════════════════════════════════════════
  // TIER 6: SUPPORT & SERVICE
  // ═══════════════════════════════════════════
  support: '/support',
  safe_assist: '/safe-assist',
  assist_manager: '/assist-manager',
  promise_tracker: '/promise-tracker',
  promise_management: '/promise-management',

  // ═══════════════════════════════════════════
  // TIER 7: PRODUCT & DEMO
  // ═══════════════════════════════════════════
  demo_manager: '/demo-manager',
  product_demo_manager: '/product-demo-manager',

  // ═══════════════════════════════════════════
  // TIER 8: OPERATIONS & COMPLIANCE
  // ═══════════════════════════════════════════
  task_manager: '/task-manager',
  finance_manager: '/finance',
  hr_manager: '/hr',
  legal_compliance: '/legal',

  // ═══════════════════════════════════════════
  // TIER 9: END USER ROLES
  // ═══════════════════════════════════════════
  prime: '/prime',
  client: '/user/dashboard',
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
  const { user, userRole, approvalStatus, loading, isPrivileged, isBossOwner, isCEO } = useAuth();
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

    // NON-PRIVILEGED ROLES: Check approval status
    if (approvalStatus === 'approved') {
      const targetRoute = ROLE_DASHBOARD_MAP[userRole];
      if (targetRoute) {
        console.log(`[Dashboard] Approved ${userRole} → ${targetRoute}`);
        setStatus('redirecting');
        hasNavigated.current = true;
        navigate(targetRoute, { replace: true });
      } else {
        // FALLBACK: Unknown role → User dashboard (NO blank screen)
        console.warn(`[Dashboard] Unknown role: ${userRole}, using fallback`);
        hasNavigated.current = true;
        navigate('/user/dashboard', { replace: true });
      }
    } else if (approvalStatus === 'rejected') {
      // Rejected → Show clear message
      console.log(`[Dashboard] ${userRole} rejected`);
      hasNavigated.current = true;
      navigate('/pending-approval?status=rejected', { replace: true });
    } else {
      // Pending → Approval page
      console.log(`[Dashboard] ${userRole} pending approval`);
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