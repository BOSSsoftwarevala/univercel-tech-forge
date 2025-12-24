import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Inbox, AlertCircle, MessageCircle, 
  ArrowUpRight, BookOpen, BarChart3, Heart, FileText, Settings, LogOut, Lock,
  ArrowLeft, KeyRound
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import SupportTopBar from '@/components/support/SupportTopBar';
import SupportMetrics from '@/components/support/SupportMetrics';
import TicketInbox from '@/components/support/TicketInbox';
import PriorityQueue from '@/components/support/PriorityQueue';
import SolutionWiki from '@/components/support/SolutionWiki';
import PerformancePanel from '@/components/support/PerformancePanel';
import SupportNotifications from '@/components/support/SupportNotifications';
import AITroubleshooter from '@/components/support/AITroubleshooter';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inbox', label: 'Ticket Inbox', icon: Inbox, badge: '12' },
  { id: 'priority', label: 'Priority Queue', icon: AlertCircle, badge: '3' },
  { id: 'chat', label: 'Chat / Call Support', icon: MessageCircle },
  { id: 'escalation', label: 'Developer Escalation', icon: ArrowUpRight },
  { id: 'wiki', label: 'Solution Wiki', icon: BookOpen },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'behavior', label: 'Behavior Score', icon: Heart },
  { id: 'logs', label: 'Logs', icon: FileText },
];

const SupportDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <SupportMetrics />;
      case 'inbox':
        return <TicketInbox />;
      case 'priority':
        return <PriorityQueue />;
      case 'wiki':
        return <SolutionWiki />;
      case 'performance':
      case 'behavior':
        return <PerformancePanel />;
      default:
        return <SupportMetrics />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white overflow-hidden">
      {/* Calm Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(56,189,248,0.06),transparent_50%)]" />
        
        {/* Subtle Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="support-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-teal-400" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#support-grid)" />
        </svg>

        {/* Soft Floating Orbs */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full blur-3xl"
            style={{
              left: `${20 + (i * 15) % 80}%`,
              top: `${10 + (i * 20) % 70}%`,
              background: i % 2 === 0 
                ? 'radial-gradient(circle, rgba(20,184,166,0.04), transparent)' 
                : 'radial-gradient(circle, rgba(56,189,248,0.03), transparent)',
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Top Bar */}
      <SupportTopBar 
        onNotificationClick={() => setShowNotifications(true)}
        onAIClick={() => setShowAIPanel(true)}
      />

      <div className="flex pt-16">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed left-0 top-16 bottom-0 w-64 bg-slate-900/40 backdrop-blur-2xl border-r border-teal-500/10 z-40"
        >
          <nav className="p-5 space-y-1.5">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  activeSection === item.id
                    ? 'bg-teal-500/10 border border-teal-500/20 text-teal-400'
                    : 'hover:bg-slate-800/30 text-slate-400 hover:text-teal-400'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-colors ${
                  activeSection === item.id ? 'text-teal-400' : 'text-slate-500 group-hover:text-teal-400'
                }`} />
                <span className="font-medium flex-1 text-left text-sm">{item.label}</span>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    activeSection === item.id
                      ? 'bg-teal-500/20 text-teal-400'
                      : 'bg-slate-700/50 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </motion.button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-6 left-5 right-5 space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 rounded-xl bg-gradient-to-br from-teal-500/5 to-sky-500/5 border border-teal-500/10"
            >
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-teal-400" />
                <span className="text-sm text-teal-400 font-medium">Wellness Check</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                You're doing great today. 8 tickets resolved with 98% satisfaction.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-teal-500 to-sky-500"
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                  />
                </div>
                <span className="text-xs text-teal-400">85%</span>
              </div>
            </motion.div>
            
            {/* Account Actions */}
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-teal-500/20 text-teal-300 text-sm hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/change-password')}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-teal-500/20 text-teal-300 text-sm hover:bg-slate-800 transition-colors"
              >
                <Lock className="w-4 h-4" />
                Password
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-teal-500/20 text-teal-300 text-sm hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
            <button
              onClick={() => navigate('/forgot-password')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-teal-500/20 text-teal-300 text-sm hover:bg-slate-800 transition-colors"
            >
              <KeyRound className="w-4 h-4" />
              Forgot Password
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </motion.aside>

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
          <SupportNotifications onClose={() => setShowNotifications(false)} />
        )}
        {showAIPanel && (
          <AITroubleshooter isOpen={showAIPanel} onClose={() => setShowAIPanel(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupportDashboard;
