import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Link2, Megaphone, Video, Palette, 
  Users, Wallet, Bell, Sparkles
} from 'lucide-react';
import InfluencerTopBar from '@/components/influencer/InfluencerTopBar';
import InfluencerMetrics from '@/components/influencer/InfluencerMetrics';
import LinkCreator from '@/components/influencer/LinkCreator';
import CampaignManager from '@/components/influencer/CampaignManager';
import VideoReelsManager from '@/components/influencer/VideoReelsManager';
import PromoGenerator from '@/components/influencer/PromoGenerator';
import LeadsWallet from '@/components/influencer/LeadsWallet';
import InfluencerNotifications from '@/components/influencer/InfluencerNotifications';
import AIOptimizerPanel from '@/components/influencer/AIOptimizerPanel';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'create-link', label: 'Create Link', icon: Link2 },
  { id: 'campaigns', label: 'Campaign Manager', icon: Megaphone },
  { id: 'videos', label: 'Short Videos / Reels', icon: Video },
  { id: 'promo', label: 'Poster & Promo Generator', icon: Palette, badge: 'AI' },
  { id: 'leads', label: 'Leads & Conversion', icon: Users },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
];

const InfluencerDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAIOptimizer, setShowAIOptimizer] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <InfluencerMetrics />;
      case 'create-link':
        return <LinkCreator />;
      case 'campaigns':
        return <CampaignManager />;
      case 'videos':
        return <VideoReelsManager />;
      case 'promo':
        return <PromoGenerator />;
      case 'leads':
      case 'wallet':
        return <LeadsWallet activeTab={activeSection} />;
      default:
        return <InfluencerMetrics />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.1),transparent_50%)]" />
        
        {/* Social Network Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-5">
          <defs>
            <pattern id="influencer-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="1" fill="currentColor" className="text-cyan-400" />
              <line x1="40" y1="0" x2="40" y2="80" stroke="currentColor" strokeWidth="0.2" className="text-violet-500" />
              <line x1="0" y1="40" x2="80" y2="40" stroke="currentColor" strokeWidth="0.2" className="text-violet-500" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#influencer-grid)" />
        </svg>

        {/* Floating Particles */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-violet-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Top Bar */}
      <InfluencerTopBar 
        onNotificationClick={() => setShowNotifications(true)}
        onAIClick={() => setShowAIOptimizer(true)}
      />

      <div className="flex pt-16">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed left-0 top-16 bottom-0 w-72 bg-slate-900/60 backdrop-blur-xl border-r border-violet-500/20 z-40"
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-violet-500/20 to-cyan-500/10 border border-violet-500/50 text-violet-400'
                    : 'hover:bg-slate-800/50 text-slate-400 hover:text-violet-400'
                }`}
              >
                <div className={`relative ${activeSection === item.id ? 'text-violet-400' : ''}`}>
                  <item.icon className="w-5 h-5" />
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="influencer-sidebar-glow"
                      className="absolute inset-0 bg-violet-400/30 blur-md rounded-full"
                    />
                  )}
                </div>
                <span className="font-medium flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-gradient-to-r from-violet-500 to-cyan-500 text-white">
                    {item.badge}
                  </span>
                )}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="influencer-active-indicator"
                    className="w-2 h-2 bg-violet-400 rounded-full shadow-lg shadow-violet-400/50"
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Sidebar Stats */}
          <div className="absolute bottom-4 left-4 right-4 space-y-3">
            <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-violet-400 font-semibold">Influence Score</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-white">8,420</span>
                <span className="text-sm text-emerald-400 mb-1">+12%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden mt-3">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: '84%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
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
          <InfluencerNotifications onClose={() => setShowNotifications(false)} />
        )}
        {showAIOptimizer && (
          <AIOptimizerPanel isOpen={showAIOptimizer} onClose={() => setShowAIOptimizer(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InfluencerDashboard;
