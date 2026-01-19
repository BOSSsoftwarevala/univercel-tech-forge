import React, { useState } from 'react';
import { MMFullSidebar } from './MMFullSidebar';
import { MMMarketplaceScreen } from './screens/MMMarketplaceScreen';
import { MMOrdersScreen } from './screens/MMOrdersScreen';
import { MMDevelopmentScreen } from './screens/MMDevelopmentScreen';
import { MMWalletScreen } from './screens/MMWalletScreen';
import { MMSupportScreen } from './screens/MMSupportScreen';
import { MMSettingsScreen } from './screens/MMSettingsScreen';

export function MMFullLayout() {
  const [activeScreen, setActiveScreen] = useState('marketplace');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'marketplace':
        return <MMMarketplaceScreen />;
      case 'my-orders':
        return <MMOrdersScreen />;
      case 'development':
        return <MMDevelopmentScreen />;
      case 'wallet':
        return <MMWalletScreen />;
      case 'support':
        return <MMSupportScreen />;
      case 'settings':
        return <MMSettingsScreen />;
      default:
        return <MMMarketplaceScreen />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      <MMFullSidebar 
        activeScreen={activeScreen} 
        onScreenChange={setActiveScreen} 
      />
      <main className="flex-1 overflow-auto">
        {renderScreen()}
      </main>
    </div>
  );
}
