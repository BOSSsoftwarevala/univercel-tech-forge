import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Link2, Megaphone, Video, Palette, 
  Users, Wallet, Bell, Sparkles, MousePointer, Shield,
  Image, Trophy, PieChart, FileText, GraduationCap, Gift
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
import LiveClickTracker from '@/components/influencer/LiveClickTracker';
import AIFraudGuard from '@/components/influencer/AIFraudGuard';
import VisualAssetLibrary from '@/components/influencer/VisualAssetLibrary';
import LeaderboardRewards from '@/components/influencer/LeaderboardRewards';
import AudienceInsights from '@/components/influencer/AudienceInsights';
import CompliancePolicy from '@/components/influencer/CompliancePolicy';
import TrainingAcademy from '@/components/influencer/TrainingAcademy';
import OfferPromoCenter from '@/components/influencer/OfferPromoCenter';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'create-link', label: 'Create Link', icon: Link2 },
  { id: 'campaigns', label: 'Campaign Manager', icon: Megaphone },
  { id: 'click-tracker', label: 'Live Clicks', icon: MousePointer },
  { id: 'fraud-guard', label: 'AI Fraud Guard', icon: Shield, badge: 'AI' },
  { id: 'videos', label: 'Short Videos / Reels', icon: Video },
  { id: 'promo', label: 'Poster Generator', icon: Palette, badge: 'AI' },
  { id: 'assets', label: 'Asset Library', icon: Image },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'audience', label: 'Audience Insights', icon: PieChart },
  { id: 'leads', label: 'Leads & Conversion', icon: Users },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'offers', label: 'Offers & Promos', icon: Gift },
  { id: 'compliance', label: 'Compliance', icon: FileText },
  { id: 'training', label: 'Training Academy', icon: GraduationCap },
];

const InfluencerDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAIOptimizer, setShowAIOptimizer] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <InfluencerMetrics />;
      case 'create-link': return <LinkCreator />;
      case 'campaigns': return <CampaignManager />;
      case 'click-tracker': return <LiveClickTracker />;
      case 'fraud-guard': return <AIFraudGuard />;
      case 'videos': return <VideoReelsManager />;
      case 'promo': return <PromoGenerator />;
      case 'assets': return <VisualAssetLibrary />;
      case 'leaderboard': return <LeaderboardRewards />;
      case 'audience': return <AudienceInsights />;
      case 'leads':
      case 'wallet': return <LeadsWallet activeTab={activeSection} />;
      case 'offers': return <OfferPromoCenter />;
      case 'compliance': return <CompliancePolicy />;
      case 'training': return <TrainingAcademy />;
      default: return <InfluencerMetrics />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.1),transparent_50%)]" />
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
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-violet-400 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -40, 0], opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
            transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <InfluencerTopBar 
        onNotificationClick={() => setShowNotifications(true)}
        onAIClick={() => setShowAIOptimizer(true)}
      />

      <div className="flex pt-16">
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed left-0 top-16 bottom-0 w-64 bg-slate-900/60 backdrop-blur-xl border-r border-violet-500/20 z-40 overflow-y-auto"
        >
          <nav className="p-3 space-y-1">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-violet-500/20 to-cyan-500/10 border border-violet-500/50 text-violet-400'
                    : 'hover:bg-slate-800/50 text-slate-400 hover:text-violet-400'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-violet-500 to-cyan-500 text-white">
                    {item.badge}
                  </span>
                )}
              </motion.button>
            ))}
          </nav>

          <div className="absolute bottom-4 left-3 right-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-xs text-violet-400 font-semibold">Influence Score</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-white">8,420</span>
                <span className="text-xs text-emerald-400 mb-1">+12%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
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

        <main className="flex-1 ml-64 p-6 min-h-screen">
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

      <AnimatePresence>
        {showNotifications && <InfluencerNotifications onClose={() => setShowNotifications(false)} />}
        {showAIOptimizer && <AIOptimizerPanel isOpen={showAIOptimizer} onClose={() => setShowAIOptimizer(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default InfluencerDashboard;
