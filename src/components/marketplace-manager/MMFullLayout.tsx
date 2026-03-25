import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MMFullSidebar } from './MMFullSidebar';
import { MMMarketplaceScreen } from './screens/MMMarketplaceScreen';
import { MMOrdersScreen } from './screens/MMOrdersScreen';
import { MMDevelopmentScreen } from './screens/MMDevelopmentScreen';
import { MMWalletScreen } from './screens/MMWalletScreen';
import { MMSupportScreen } from './screens/MMSupportScreen';
import { MMSettingsScreen } from './screens/MMSettingsScreen';

const allowedScreens = new Set(['marketplace', 'my-orders', 'development', 'wallet', 'support', 'settings']);

export function MMFullLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const screenFromUrl = searchParams.get('screen');
  const [activeScreen, setActiveScreen] = useState(
    screenFromUrl && allowedScreens.has(screenFromUrl) ? screenFromUrl : 'marketplace',
  );

  useEffect(() => {
    if (screenFromUrl && allowedScreens.has(screenFromUrl) && screenFromUrl !== activeScreen) {
      setActiveScreen(screenFromUrl);
    }
  }, [activeScreen, screenFromUrl]);

  const handleScreenChange = (screen: string) => {
    setActiveScreen(screen);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('screen', screen);
    setSearchParams(nextParams, { replace: true });
  };

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
        onScreenChange={handleScreenChange} 
      />
      <main className="flex-1 overflow-auto">
        {renderScreen()}
      </main>
    </div>
  );
}
