import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DeveloperTopBar from '@/components/developer/DeveloperTopBar';
import DeveloperSidebar from '@/components/developer/DeveloperSidebar';
import DeveloperCommandCenter from '@/components/developer/DeveloperCommandCenter';
import AIPortfolioBuilder from '@/components/developer/AIPortfolioBuilder';
import AISkillAssessment from '@/components/developer/AISkillAssessment';
import AIProductivityCoach from '@/components/developer/AIProductivityCoach';
import DevTaskAssignment from '@/components/developer/DevTaskAssignment';
import DevTimerProgress from '@/components/developer/DevTimerProgress';
import DevCodeSubmission from '@/components/developer/DevCodeSubmission';
import DevWalletPayout from '@/components/developer/DevWalletPayout';
import DeveloperNotifications from '@/components/developer/DeveloperNotifications';
import AIAssistantPanel from '@/components/developer/AIAssistantPanel';

const DeveloperDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DeveloperCommandCenter />;
      case 'portfolio':
        return <AIPortfolioBuilder />;
      case 'skills':
        return <AISkillAssessment />;
      case 'productivity':
        return <AIProductivityCoach />;
      case 'tasks':
        return <DevTaskAssignment />;
      case 'timer':
        return <DevTimerProgress />;
      case 'code':
        return <DevCodeSubmission />;
      case 'wallet':
        return <DevWalletPayout />;
      default:
        return <DeveloperCommandCenter />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.1),transparent_50%)]" />
        
        {/* Circuit Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="dev-circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 50 30 M 50 70 L 50 100 M 0 50 L 30 50 M 70 50 L 100 50" 
                stroke="currentColor" strokeWidth="0.5" fill="none" className="text-cyan-500" />
              <circle cx="50" cy="50" r="3" fill="currentColor" className="text-cyan-500" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dev-circuit)" />
        </svg>

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Top Bar */}
      <DeveloperTopBar 
        onNotificationClick={() => setShowNotifications(true)}
        onAIClick={() => setShowAIPanel(true)}
      />

      <div className="flex pt-16">
        {/* Sidebar */}
        <DeveloperSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6 min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
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
          <DeveloperNotifications onClose={() => setShowNotifications(false)} />
        )}
        {showAIPanel && (
          <AIAssistantPanel isOpen={showAIPanel} onClose={() => setShowAIPanel(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeveloperDashboard;
