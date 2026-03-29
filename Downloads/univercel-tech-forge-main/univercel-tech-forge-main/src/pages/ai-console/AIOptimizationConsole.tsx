import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Activity, Gauge, DollarSign, Zap, Database, 
  Shield, AlertTriangle, Settings, LifeBuoy, Bell,
  Wallet, Server, ChevronRight, TrendingUp, Clock
} from 'lucide-react';
import AIConsoleSidebar from '@/components/ai-console/AIConsoleSidebar';
import AIConsoleHeader from '@/components/ai-console/AIConsoleHeader';
import LiveStatusColumn from '@/components/ai-console/LiveStatusColumn';
import SwitchingLogicColumn from '@/components/ai-console/SwitchingLogicColumn';
import ControlActionsColumn from '@/components/ai-console/ControlActionsColumn';
import AIConsoleFooter from '@/components/ai-console/AIConsoleFooter';
import TrafficMonitorScreen from '@/components/ai-console/screens/TrafficMonitorScreen';
import CacheLibraryScreen from '@/components/ai-console/screens/CacheLibraryScreen';
import CostAnalyticsScreen from '@/components/ai-console/screens/CostAnalyticsScreen';
import PermissionsScreen from '@/components/ai-console/screens/PermissionsScreen';
import FailSafeScreen from '@/components/ai-console/screens/FailSafeScreen';

type ScreenType = 'dashboard' | 'traffic' | 'cache' | 'analytics' | 'permissions' | 'failsafe' | 'mode-switcher' | 'cache-manager' | 'lite-manager' | 'cost-guardrail' | 'logs' | 'support';

const AIOptimizationConsole = () => {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('dashboard');
  const [currentMode, setCurrentMode] = useState<'generative' | 'lite' | 'cache'>('generative');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getModeColor = () => {
    switch (currentMode) {
      case 'generative': return 'neon-purple';
      case 'lite': return 'neon-cyan';
      case 'cache': return 'neon-green';
    }
  };

  const renderMainContent = () => {
    switch (activeScreen) {
      case 'traffic':
        return <TrafficMonitorScreen />;
      case 'cache':
      case 'cache-manager':
        return <CacheLibraryScreen />;
      case 'analytics':
      case 'cost-guardrail':
        return <CostAnalyticsScreen />;
      case 'permissions':
        return <PermissionsScreen />;
      case 'failsafe':
        return <FailSafeScreen />;
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            <LiveStatusColumn currentMode={currentMode} />
            <SwitchingLogicColumn currentMode={currentMode} />
            <ControlActionsColumn 
              currentMode={currentMode} 
              onModeChange={setCurrentMode} 
            />
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen bg-background flex flex-col transition-all duration-500 ${
      currentMode === 'generative' ? 'ai-mode-generative' : 
      currentMode === 'lite' ? 'ai-mode-lite' : 'ai-mode-cache'
    }`}>
      {/* Fixed Header */}
      <AIConsoleHeader currentMode={currentMode} />

      <div className="flex flex-1 pt-[120px]">
        {/* Fixed Left Sidebar */}
        <AIConsoleSidebar 
          activeScreen={activeScreen}
          onScreenChange={(screen) => setActiveScreen(screen as ScreenType)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Canvas */}
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} pb-20`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderMainContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Sticky Footer */}
      <AIConsoleFooter />
    </div>
  );
};

export default AIOptimizationConsole;
