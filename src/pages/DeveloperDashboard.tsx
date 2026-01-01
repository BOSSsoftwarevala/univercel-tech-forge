import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DeveloperTopBarComplete from '@/components/developer/DeveloperTopBarComplete';
import DeveloperSidebarComplete from '@/components/developer/DeveloperSidebarComplete';
import DeveloperCommandCenterComplete from '@/components/developer/sections/DeveloperCommandCenterComplete';
import DeveloperBugsSection from '@/components/developer/sections/DeveloperBugsSection';
import DeveloperPerformanceSection from '@/components/developer/sections/DeveloperPerformanceSection';
import DeveloperSettingsSection from '@/components/developer/sections/DeveloperSettingsSection';
import DeveloperAISection from '@/components/developer/sections/DeveloperAISection';
import DevTaskAssignment from '@/components/developer/DevTaskAssignment';
import DevTimerProgress from '@/components/developer/DevTimerProgress';
import DevCodeSubmission from '@/components/developer/DevCodeSubmission';
import DeveloperNotifications from '@/components/developer/DeveloperNotifications';
import AIAssistantPanel from '@/components/developer/AIAssistantPanel';

const DeveloperDashboard = () => {
  const [activeSection, setActiveSection] = useState('command-center');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState('00:45:30');

  const renderContent = () => {
    switch (activeSection) {
      case 'command-center':
        return <DeveloperCommandCenterComplete />;
      case 'tasks':
        return <DevTaskAssignment />;
      case 'bugs':
        return <DeveloperBugsSection />;
      case 'code-submission':
        return <DevCodeSubmission />;
      case 'timer':
        return <DevTimerProgress />;
      case 'ai-assistant':
        return <DeveloperAISection />;
      case 'performance':
        return <DeveloperPerformanceSection />;
      case 'settings':
        return <DeveloperSettingsSection />;
      default:
        return <DeveloperCommandCenterComplete />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>

      {/* Top Bar */}
      <DeveloperTopBarComplete
        timerRunning={timerRunning}
        elapsedTime={elapsedTime}
        onToggleTimer={() => setTimerRunning(!timerRunning)}
        onNotificationClick={() => setShowNotifications(true)}
        onAIClick={() => setShowAIPanel(true)}
      />

      <div className="flex pt-16">
        {/* Sidebar */}
        <DeveloperSidebarComplete
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
