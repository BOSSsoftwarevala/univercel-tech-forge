import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, UserPlus, Link2, Target, ShieldAlert, 
  FileCheck, GraduationCap, BarChart3, Award, Wallet,
  Users, Shield, Sparkles, Bell, Settings
} from 'lucide-react';
import InfluencerOnboarding from '@/components/influencer-manager/InfluencerOnboarding';
import SmartLinkGenerator from '@/components/influencer-manager/SmartLinkGenerator';
import ConversionAttribution from '@/components/influencer-manager/ConversionAttribution';
import FraudProtection from '@/components/influencer-manager/FraudProtection';
import ContentApproval from '@/components/influencer-manager/ContentApproval';
import TrainingHub from '@/components/influencer-manager/TrainingHub';
import PerformanceAnalytics from '@/components/influencer-manager/PerformanceAnalytics';
import TierBadgeSystem from '@/components/influencer-manager/TierBadgeSystem';
import PayoutWallet from '@/components/influencer-manager/PayoutWallet';
import CampaignCollaboration from '@/components/influencer-manager/CampaignCollaboration';
import ReputationGuard from '@/components/influencer-manager/ReputationGuard';
import AIContentAssistant from '@/components/influencer-manager/AIContentAssistant';
import InfluencerManagerNotifications from '@/components/influencer-manager/InfluencerManagerNotifications';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'onboarding', label: 'Influencer Onboarding', icon: UserPlus },
  { id: 'links', label: 'Smart Link Generator', icon: Link2, badge: 'UTM' },
  { id: 'conversion', label: 'Conversion Engine', icon: Target },
  { id: 'fraud', label: 'Fraud Protection', icon: ShieldAlert, badge: 'AI' },
  { id: 'content', label: 'Content Approval', icon: FileCheck },
  { id: 'training', label: 'Training Hub', icon: GraduationCap },
  { id: 'analytics', label: 'Performance Analytics', icon: BarChart3 },
  { id: 'tiers', label: 'Tier & Badge System', icon: Award },
  { id: 'payout', label: 'Payout & Wallet', icon: Wallet },
  { id: 'collaboration', label: 'Campaign Collaboration', icon: Users },
  { id: 'reputation', label: 'Reputation Guard', icon: Shield },
];

const InfluencerManager = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <PerformanceAnalytics />;
      case 'onboarding':
        return <InfluencerOnboarding />;
      case 'links':
        return <SmartLinkGenerator />;
      case 'conversion':
        return <ConversionAttribution />;
      case 'fraud':
        return <FraudProtection />;
      case 'content':
        return <ContentApproval />;
      case 'training':
        return <TrainingHub />;
      case 'analytics':
        return <PerformanceAnalytics />;
      case 'tiers':
        return <TierBadgeSystem />;
      case 'payout':
        return <PayoutWallet />;
      case 'collaboration':
        return <CampaignCollaboration />;
      case 'reputation':
        return <ReputationGuard />;
      default:
        return <PerformanceAnalytics />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.1),transparent_50%)]" />
        
        {/* Network Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-5">
          <defs>
            <pattern id="influencer-mgr-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1.5" fill="currentColor" className="text-purple-400" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.3" className="text-purple-500" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.3" className="text-purple-500" />
              <circle cx="0" cy="0" r="1" fill="currentColor" className="text-pink-400" />
              <circle cx="100" cy="100" r="1" fill="currentColor" className="text-pink-400" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#influencer-mgr-grid)" />
        </svg>

        {/* Floating Orbs */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? '#a855f7' : '#ec4899',
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Top Bar */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-purple-500/20 z-50 flex items-center justify-between px-6"
      >
        <div className="flex items-center gap-4">
          <motion.div
            className="relative"
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/30">
              IM
            </div>
          </motion.div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Influencer Manager
          </h1>
        </div>

        {/* Center Stats */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-slate-300">Active Influencers</span>
            <span className="text-lg font-bold text-white">2,847</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20">
            <Target className="w-4 h-4 text-pink-400" />
            <span className="text-sm text-slate-300">Conversions Today</span>
            <span className="text-lg font-bold text-white">1,234</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAIAssistant(true)}
            className="relative p-2.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-400/50 transition-all"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(true)}
            className="relative p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50"
          >
            <Bell className="w-5 h-5 text-slate-400" />
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute top-1 right-1 w-2.5 h-2.5 bg-pink-400 rounded-full"
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50"
          >
            <Settings className="w-5 h-5 text-slate-400" />
          </motion.button>
        </div>
      </motion.header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed left-0 top-16 bottom-0 w-72 bg-slate-900/60 backdrop-blur-xl border-r border-purple-500/20 z-40 overflow-y-auto"
        >
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/10 border border-purple-500/50 text-purple-400'
                    : 'hover:bg-slate-800/50 text-slate-400 hover:text-purple-400'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium flex-1 text-left text-sm">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    {item.badge}
                  </span>
                )}
              </motion.button>
            ))}
          </nav>

          {/* Sidebar Footer Stats */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="w-4 h-4 text-pink-400" />
                <span className="text-xs text-pink-400 font-semibold">Fraud Detection</span>
              </div>
              <div className="text-2xl font-bold text-white">99.7%</div>
              <div className="text-xs text-slate-400">Clean traffic rate</div>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 ml-72 p-6 min-h-screen">
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

      {/* Floating Panels */}
      <AnimatePresence>
        {showNotifications && (
          <InfluencerManagerNotifications onClose={() => setShowNotifications(false)} />
        )}
        {showAIAssistant && (
          <AIContentAssistant isOpen={showAIAssistant} onClose={() => setShowAIAssistant(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InfluencerManager;
