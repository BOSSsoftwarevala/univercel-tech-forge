import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import SecureDeveloperDashboard from '@/pages/developer/SecureDeveloperDashboard';
import DeveloperRegistration from '@/pages/developer/DeveloperRegistration';
import InfluencerDashboard from '@/pages/InfluencerDashboard';
import CareerPortal from '@/pages/CareerPortal';

const LoadingState = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
);

export const DeveloperDashboardEntry = () => {
  const { loading, approvedRoles, userRole } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  if (approvedRoles.includes('developer') || userRole === 'developer' || approvedRoles.includes('super_admin') || userRole === 'super_admin') {
    return <SecureDeveloperDashboard />;
  }

  return <DeveloperRegistration />;
};

export const InfluencerDashboardEntry = () => {
  const { loading, approvedRoles, userRole } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  if (approvedRoles.includes('influencer') || userRole === 'influencer' || approvedRoles.includes('super_admin') || userRole === 'super_admin') {
    return <InfluencerDashboard />;
  }

  return <CareerPortal />;
};

export const JobsDashboardEntry = () => <CareerPortal />;

export const AdminDashboardEntry = () => <Navigate to="/app/control-center" replace />;

export const BossDashboardEntry = () => <Navigate to="/app/control-center" replace />;