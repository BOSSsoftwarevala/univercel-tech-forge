import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IncidentCrisisTopBar from '@/components/incident-crisis/IncidentCrisisTopBar';
import IncidentCrisisSidebar from '@/components/incident-crisis/IncidentCrisisSidebar';
import CrisisCommandDashboard from '@/components/incident-crisis/CrisisCommandDashboard';
import AICrisisAnalyzer from '@/components/incident-crisis/AICrisisAnalyzer';
import CrisisNotifications from '@/components/incident-crisis/CrisisNotifications';

const IncidentCrisisDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
      case 'active-incidents':
      case 'monitoring':
      case 'alerts':
      case 'response-teams':
      case 'escalations':
      case 'servers':
      case 'timeline':
      case 'reports':
      case 'security':
      case 'performance':
      default:
        return <CrisisCommandDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white overflow-hidden">
      {/* Crisis Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Red Alert Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(249,115,22,0.06),transparent_50%)]" />
        
        {/* Subtle Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="crisis-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-red-400" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#crisis-grid)" />
        </svg>

        {/* Animated Alert Orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full blur-3xl"
            style={{
              left: `${15 + (i * 18) % 75}%`,
              top: `${10 + (i * 22) % 65}%`,
              background: i % 2 === 0 
                ? 'radial-gradient(circle, rgba(239,68,68,0.05), transparent)' 
                : 'radial-gradient(circle, rgba(249,115,22,0.04), transparent)',
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 6 + i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Pulsing Alert Ring */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-red-500/5"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.05, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Top Bar */}
      <IncidentCrisisTopBar 
        onNotificationClick={() => setShowNotifications(true)}
        onAIClick={() => setShowAIPanel(true)}
        activeIncidents={3}
      />

      <div className="flex pt-16">
        {/* Sidebar */}
        <IncidentCrisisSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8 min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Panels */}
      <AnimatePresence>
        {showNotifications && (
          <CrisisNotifications onClose={() => setShowNotifications(false)} />
        )}
      </AnimatePresence>

      <AICrisisAnalyzer isOpen={showAIPanel} onClose={() => setShowAIPanel(false)} />
    </div>
  );
};

export default IncidentCrisisDashboard;
