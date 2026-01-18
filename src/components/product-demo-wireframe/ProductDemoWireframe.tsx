/**
 * PRODUCT DEMO MANAGER - WIREFRAME STYLE
 * Low-fidelity enterprise SaaS dashboard
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WireframeSidebar } from './WireframeSidebar';
import { WireframeTopBar } from './WireframeTopBar';
import { WFDashboard } from './screens/WFDashboard';
import { WFDemoList } from './screens/WFDemoList';
import { WFDemoDetail } from './screens/WFDemoDetail';
import { WFScheduler } from './screens/WFScheduler';
import { WFLeads } from './screens/WFLeads';
import { WFAnalytics } from './screens/WFAnalytics';
import { WFSettings } from './screens/WFSettings';
import { WFContent } from './screens/WFContent';

export type WireframeScreen = 
  | 'dashboard'
  | 'demos'
  | 'demo-detail'
  | 'schedule'
  | 'content'
  | 'leads'
  | 'analytics'
  | 'settings';

interface ProductDemoWireframeProps {
  onBack?: () => void;
}

export const ProductDemoWireframe: React.FC<ProductDemoWireframeProps> = ({ onBack }) => {
  const [activeScreen, setActiveScreen] = useState<WireframeScreen>('dashboard');
  const [selectedDemoId, setSelectedDemoId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleDemoSelect = (demoId: string) => {
    setSelectedDemoId(demoId);
    setActiveScreen('demo-detail');
  };

  const handleBackToList = () => {
    setSelectedDemoId(null);
    setActiveScreen('demos');
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <WFDashboard onNavigate={setActiveScreen} />;
      case 'demos':
        return <WFDemoList onSelectDemo={handleDemoSelect} />;
      case 'demo-detail':
        return <WFDemoDetail demoId={selectedDemoId} onBack={handleBackToList} />;
      case 'schedule':
        return <WFScheduler />;
      case 'content':
        return <WFContent />;
      case 'leads':
        return <WFLeads />;
      case 'analytics':
        return <WFAnalytics />;
      case 'settings':
        return <WFSettings />;
      default:
        return <WFDashboard onNavigate={setActiveScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <WireframeSidebar 
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onBack={onBack}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-56'}`}>
        {/* Top Bar */}
        <WireframeTopBar />

        {/* Screen Content */}
        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen + (selectedDemoId || '')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ProductDemoWireframe;
