import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ListTodo, Rocket, Timer, Bug, Bot, 
  Play, Wallet, HeadphonesIcon, BookOpen, Bell, Zap,
  User, Radio
} from 'lucide-react';
import DeveloperTopBar from '@/components/developer/DeveloperTopBar';
import DeveloperMetrics from '@/components/developer/DeveloperMetrics';
import TaskManagement from '@/components/developer/TaskManagement';
import CodingView from '@/components/developer/CodingView';
import BugTracker from '@/components/developer/BugTracker';
import DeveloperWallet from '@/components/developer/DeveloperWallet';
import AIAssistantPanel from '@/components/developer/AIAssistantPanel';
import DeveloperNotifications from '@/components/developer/DeveloperNotifications';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Active Tasks', icon: ListTodo },
  { id: 'deploy', label: 'Code Deploy', icon: Rocket },
  { id: 'timer', label: 'Timer & Logs', icon: Timer },
  { id: 'bugs', label: 'Bug Tracker', icon: Bug },
  { id: 'ai', label: 'AI Assist', icon: Bot },
  { id: 'sandbox', label: 'Sandbox & Preview', icon: Play },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'support', label: 'Support Tickets', icon: HeadphonesIcon },
  { id: 'guidelines', label: 'System Guidelines', icon: BookOpen },
];

const DeveloperDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DeveloperMetrics />;
      case 'tasks':
      case 'deploy':
      case 'timer':
        return <TaskManagement />;
      case 'bugs':
        return <BugTracker />;
      case 'wallet':
        return <DeveloperWallet />;
      case 'ai':
        return (
          <div className="h-full">
            <AIAssistantPanel isOpen={true} onClose={() => setActiveSection('dashboard')} embedded />
          </div>
        );
      case 'sandbox':
        return <CodingView />;
      default:
        return <DeveloperMetrics />;
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
        {[...Array(20)].map((_, i) => (
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
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed left-0 top-16 bottom-0 w-64 bg-slate-900/60 backdrop-blur-xl border-r border-cyan-500/20 z-40"
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                  activeSection === item.id
                    ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                    : 'hover:bg-slate-800/50 text-slate-400 hover:text-cyan-400'
                }`}
              >
                <div className={`relative ${activeSection === item.id ? 'text-cyan-400' : ''}`}>
                  <item.icon className="w-5 h-5" />
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="sidebar-glow"
                      className="absolute inset-0 bg-cyan-400/30 blur-md rounded-full"
                    />
                  )}
                </div>
                <span className="font-medium">{item.label}</span>
                {activeSection === item.id && (
                  <motion.div
                    layoutId="active-indicator"
                    className="ml-auto w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-cyan-400 font-semibold">Performance</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: '87%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">Rating: 4.8/5.0</p>
            </div>
          </div>
        </motion.aside>

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
        {showAIPanel && !['ai'].includes(activeSection) && (
          <AIAssistantPanel isOpen={showAIPanel} onClose={() => setShowAIPanel(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeveloperDashboard;
