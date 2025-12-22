import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

/**
 * Role-Based Dashboard Router
 * Redirects users to their appropriate dashboard based on their role
 */
const Dashboard = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;

    // If no user, redirect to login
    if (!user) {
      navigate('/auth', { replace: true });
      return;
    }

    // If role is still being fetched, wait
    if (!userRole) {
      // Give a short delay for role to load
      const timeout = setTimeout(() => {
        // If still no role after delay, default to access denied
        if (!userRole) {
          navigate('/access-denied', { replace: true });
        }
      }, 2000);
      return () => clearTimeout(timeout);
    }

    // Role-based routing - Complete mapping for all 19+ roles
    const roleRoutes: Record<string, string> = {
      super_admin: '/super-admin',
      admin: '/super-admin', // Admin falls back to super-admin
      developer: '/developer',
      franchise: '/franchise',
      reseller: '/reseller',
      influencer: '/influencer',
      prime: '/prime',
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
      performance_manager: '/performance',
      demo_manager: '/demo-manager',
      ai_manager: '/ai-console',
      client: '/prime', // Default clients to prime dashboard
    };

    const targetRoute = roleRoutes[userRole] || '/access-denied';
    navigate(targetRoute, { replace: true });

  }, [user, userRole, loading, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
        <div>
          <h2 className="text-xl font-semibold text-foreground">Loading Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            {loading ? 'Authenticating...' : userRole ? `Redirecting to ${userRole.replace('_', ' ')} dashboard...` : 'Fetching your role...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
