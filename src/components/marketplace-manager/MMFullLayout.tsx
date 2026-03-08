import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MMFullSidebar } from './MMFullSidebar';
import { MMMarketplaceScreen } from './screens/MMMarketplaceScreen';
import { MMOrdersScreen } from './screens/MMOrdersScreen';
import { MMDevelopmentScreen } from './screens/MMDevelopmentScreen';
import { MMWalletScreen } from './screens/MMWalletScreen';
import { MMSupportScreen } from './screens/MMSupportScreen';
import { MMSettingsScreen } from './screens/MMSettingsScreen';
import { MMLibraryScreen } from './screens/MMLibraryScreen';
import { MMLicensesScreen } from './screens/MMLicensesScreen';
import AIRAClientChat from '@/components/aira/AIRAClientChat';

type MarketplaceScreen = 'marketplace' | 'my-orders' | 'development' | 'wallet' | 'support' | 'settings' | 'library' | 'licenses';

const SCREEN_PATHS: Record<MarketplaceScreen, string> = {
  marketplace: '',
  'my-orders': 'orders',
  development: 'development',
  wallet: 'wallet',
  support: 'support',
  settings: 'settings',
  library: 'library',
  licenses: 'licenses',
};

const getScreenFromPath = (pathname: string): MarketplaceScreen => {
  if (pathname.startsWith('/user/orders')) return 'my-orders';
  if (pathname.startsWith('/user/library')) return 'library';
  if (pathname.startsWith('/user/licenses')) return 'licenses';

  if (pathname.includes('/orders')) return 'my-orders';
  if (pathname.includes('/development')) return 'development';
  if (pathname.includes('/wallet')) return 'wallet';
  if (pathname.includes('/support')) return 'support';
  if (pathname.includes('/settings')) return 'settings';
  if (pathname.includes('/library')) return 'library';
  if (pathname.includes('/licenses')) return 'licenses';

  return 'marketplace';
};

export function MMFullLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeScreen, setActiveScreen] = useState<MarketplaceScreen>('marketplace');

  useEffect(() => {
    const nextScreen = getScreenFromPath(location.pathname);
    setActiveScreen((prev) => (prev === nextScreen ? prev : nextScreen));
  }, [location.pathname]);

  const handleScreenChange = (screen: string) => {
    const s = screen as MarketplaceScreen;
    setActiveScreen(s);

    // Library / Licenses go under /user/ path
    if (s === 'library') { navigate('/user/library'); return; }
    if (s === 'licenses') { navigate('/user/licenses'); return; }

    const suffix = SCREEN_PATHS[s];
    navigate(suffix ? `/marketplace/${suffix}` : '/marketplace');
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'marketplace': return <MMMarketplaceScreen />;
      case 'my-orders': return <MMOrdersScreen />;
      case 'development': return <MMDevelopmentScreen />;
      case 'wallet': return <MMWalletScreen />;
      case 'support': return <MMSupportScreen />;
      case 'settings': return <MMSettingsScreen />;
      case 'library': return <MMLibraryScreen />;
      case 'licenses': return <MMLicensesScreen />;
      default: return <MMMarketplaceScreen />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      <MMFullSidebar activeScreen={activeScreen} onScreenChange={handleScreenChange} />
      <main className="flex-1 overflow-auto">{renderScreen()}</main>
      <AIRAClientChat conversationType="general" />
    </div>
  );
}
