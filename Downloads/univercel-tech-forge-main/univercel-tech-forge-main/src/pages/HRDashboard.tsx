import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HRSidebar from '@/components/hr/HRSidebar';
import HRTopBar from '@/components/hr/HRTopBar';
import HRDashboard from '@/components/hr/HRDashboard';
import HiringPipeline from '@/components/hr/HiringPipeline';
import TrainingPrograms from '@/components/hr/TrainingPrograms';
import AIHRAssistant from '@/components/hr/AIHRAssistant';

const HRDashboardPage = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <HRDashboard />;
      case 'ai-assistant':
        return <AIHRAssistant />;
      case 'hiring':
        return <HiringPipeline />;
      case 'training':
        return <TrainingPrograms />;
      case 'candidates':
        return <HiringPipeline />;
      case 'onboarding':
        return (
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-4">Employee Onboarding</h2>
            <p className="text-slate-400">Onboarding workflow management - Coming soon</p>
          </div>
        );
      case 'performance':
        return (
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-4">Performance Reviews</h2>
            <p className="text-slate-400">Performance review system - Coming soon</p>
          </div>
        );
      case 'documents':
        return (
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-4">HR Documents</h2>
            <p className="text-slate-400">Document management - Coming soon</p>
          </div>
        );
      case 'positions':
        return (
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-4">Open Positions</h2>
            <p className="text-slate-400">Job positions management - Coming soon</p>
          </div>
        );
      case 'goals':
        return (
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-4">Goals & OKRs</h2>
            <p className="text-slate-400">Goal tracking system - Coming soon</p>
          </div>
        );
      case 'certifications':
        return (
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-4">Certifications</h2>
            <p className="text-slate-400">Certification tracking - Coming soon</p>
          </div>
        );
      case 'calendar':
        return (
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-4">HR Calendar</h2>
            <p className="text-slate-400">HR events calendar - Coming soon</p>
          </div>
        );
      default:
        return <HRDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950/20 to-slate-950 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.1),transparent_50%)]" />
        <svg className="absolute inset-0 w-full h-full opacity-5">
          <defs>
            <pattern id="hr-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="currentColor" className="text-violet-400" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hr-grid)" />
        </svg>
      </div>

      <div className="flex relative z-10">
        <HRSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <div className="flex-1 ml-[280px] flex flex-col">
          <HRTopBar />
          
          <main className="flex-1 p-6 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default HRDashboardPage;
