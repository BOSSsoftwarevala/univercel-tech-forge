/**
 * DEMO MANAGER ENTERPRISE - FULL LAYOUT
 * Main container combining sidebar + content
 * Enterprise-grade demo management
 */

import React, { useState } from 'react';
import { DMESidebar, DMESection } from './DMESidebar';
import { DMEOverviewScreen } from './screens/DMEOverviewScreen';
import { DMELibraryScreen } from './screens/DMELibraryScreen';
import { DMEHealthScreen } from './screens/DMEHealthScreen';
import { DMESecurityScreen } from './screens/DMESecurityScreen';
import { DMESettingsScreen } from './screens/DMESettingsScreen';
import { DMEAddDemoScreen } from './screens/DMEAddDemoScreen';
import { DMEDemoListScreen } from './screens/DMEDemoListScreen';
import { DMEDemoAccessScreen } from './screens/DMEDemoAccessScreen';
import { DMEDemoContentScreen } from './screens/DMEDemoContentScreen';
import { DMEDemoUpgradeScreen } from './screens/DMEDemoUpgradeScreen';
import { DMEDemoIssuesScreen } from './screens/DMEDemoIssuesScreen';
import { DMEMarketplaceSyncScreen } from './screens/DMEMarketplaceSyncScreen';

interface DMEFullLayoutProps {
  initialSection?: DMESection;
  onBack?: () => void;
}

export const DMEFullLayout: React.FC<DMEFullLayoutProps> = ({
  initialSection = 'overview',
  onBack
}) => {
  const [activeSection, setActiveSection] = useState<DMESection>(initialSection);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DMEOverviewScreen />;
      case 'add-demo':
        return <DMEAddDemoScreen />;
      case 'demo-list':
        return <DMEDemoListScreen />;
      case 'demo-access':
        return <DMEDemoAccessScreen />;
      case 'demo-content':
        return <DMEDemoContentScreen />;
      case 'demo-upgrade':
        return <DMEDemoUpgradeScreen />;
      case 'demo-issues':
        return <DMEDemoIssuesScreen />;
      case 'marketplace-sync':
        return <DMEMarketplaceSyncScreen />;
      case 'library':
        return <DMELibraryScreen />;
      case 'health':
        return <DMEHealthScreen />;
      case 'security':
        return <DMESecurityScreen />;
      case 'settings':
        return <DMESettingsScreen />;
      default:
        return <DMEOverviewScreen />;
    }
  };

  return (
    <div className="flex h-full w-full bg-background">
      <DMESidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onBack={onBack}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default DMEFullLayout;
