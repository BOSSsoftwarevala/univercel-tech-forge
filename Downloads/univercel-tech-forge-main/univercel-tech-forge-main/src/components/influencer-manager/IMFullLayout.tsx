import { useState } from 'react';
import IMFullSidebar from './IMFullSidebar';
import IMDashboard from './screens/IMDashboard';
import IMOnboarding from './screens/IMOnboarding';
import IMProfiles from './screens/IMProfiles';
import IMPlatformVerification from './screens/IMPlatformVerification';
import IMCampaignManagement from './screens/IMCampaignManagement';
import IMContentSubmissions from './screens/IMContentSubmissions';
import IMLeadTracking from './screens/IMLeadTracking';
import IMPerformanceAnalytics from './screens/IMPerformanceAnalytics';
import IMFraudDetection from './screens/IMFraudDetection';
import IMPayoutWallet from './screens/IMPayoutWallet';
import IMApprovalSuspension from './screens/IMApprovalSuspension';
import IMCommunication from './screens/IMCommunication';
import IMHistory from './screens/IMHistory';
import IMAuditLog from './screens/IMAuditLog';
import IMSettings from './screens/IMSettings';
import { useInfluencerManagerGuard } from '@/hooks/useInfluencerManagerGuard';

const IMFullLayout = () => {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  
  // Apply security guard
  useInfluencerManagerGuard();

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <IMDashboard />;
      case 'onboarding':
        return <IMOnboarding />;
      case 'profiles':
        return <IMProfiles />;
      case 'verification':
        return <IMPlatformVerification />;
      case 'campaigns':
        return <IMCampaignManagement />;
      case 'content':
        return <IMContentSubmissions />;
      case 'leads':
        return <IMLeadTracking />;
      case 'analytics':
        return <IMPerformanceAnalytics />;
      case 'fraud':
        return <IMFraudDetection />;
      case 'payout':
        return <IMPayoutWallet />;
      case 'approval':
        return <IMApprovalSuspension />;
      case 'communication':
        return <IMCommunication />;
      case 'history':
        return <IMHistory />;
      case 'audit':
        return <IMAuditLog />;
      case 'settings':
        return <IMSettings />;
      default:
        return <IMDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950">
      <IMFullSidebar activeScreen={activeScreen} onScreenChange={setActiveScreen} />
      <div className="flex-1 overflow-auto">
        {renderScreen()}
      </div>
    </div>
  );
};

export default IMFullLayout;
