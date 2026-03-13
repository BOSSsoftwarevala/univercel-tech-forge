import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Link2, Megaphone, Video, Palette, 
  Users, Wallet, Bell, Sparkles, MousePointer, Shield,
  Image, Trophy, PieChart, FileText, GraduationCap, Gift,
  HeadphonesIcon, BarChart3, Share2, ArrowLeft, Lock, KeyRound, LogOut, Loader2, DollarSign
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useInfluencerGuard } from '@/hooks/useInfluencerGuard';
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
import InfluencerSupportTickets from '@/components/influencer/InfluencerSupportTickets';
import InfluencerWalletScreen from '@/components/influencer/InfluencerWalletScreen';
import InfluencerPerformanceRating from '@/components/influencer/InfluencerPerformanceRating';
import InfluencerCampaignHub from '@/components/influencer/InfluencerCampaignHub';
import SimpleShareCenter from '@/components/influencer/SimpleShareCenter';
import InfluencerStatusBanner from '@/components/influencer/InfluencerStatusBanner';
import InfluencerIDCard from '@/components/influencer/InfluencerIDCard';
import InfluencerRateChart from '@/components/influencer/InfluencerRateChart';
import AIBrandedPostGenerator from '@/components/influencer/AIBrandedPostGenerator';

const menuItems = [
  { id: 'share', label: '🔗 Share & Earn', icon: Share2, highlight: true },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'click-tracker', label: 'Live Clicks', icon: MousePointer },
  { id: 'wallet', label: 'Wallet & Payouts', icon: Wallet },
  { id: 'create-link', label: 'Create Link', icon: Link2 },
  { id: 'campaigns', label: 'Campaign Hub', icon: Megaphone },
  { id: 'fraud-guard', label: 'AI Fraud Guard', icon: Shield, badge: 'AI' },
  { id: 'videos', label: 'Short Videos / Reels', icon: Video },
  { id: 'rate-chart', label: 'Rate Chart', icon: DollarSign },
  { id: 'promo', label: 'AI Post Generator', icon: Palette, badge: 'AI' },
  { id: 'assets', label: 'Asset Library', icon: Image },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'audience', label: 'Audience Insights', icon: PieChart },
  { id: 'leads', label: 'Leads & Conversion', icon: Users },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'support', label: 'Support', icon: HeadphonesIcon },
  { id: 'offers', label: 'Offers & Promos', icon: Gift },
  { id: 'compliance', label: 'Compliance', icon: FileText },
  { id: 'training', label: 'Training Academy', icon: GraduationCap },
];

const InfluencerDashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { account, wallet, loading, canEarn, canPromote, canWithdraw, statusMessage } = useInfluencerGuard();
  const [activeSection, setActiveSection] = useState('share');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAIOptimizer, setShowAIOptimizer] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  // Show loader while checking account
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-violet-400" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'share': return <SimpleShareCenter />;
      case 'dashboard': return <InfluencerMetrics />;
      case 'create-link': return <LinkCreator />;
      case 'campaigns': return <InfluencerCampaignHub />;
      case 'click-tracker': return <LiveClickTracker />;
      case 'fraud-guard': return <AIFraudGuard />;
      case 'videos': return <VideoReelsManager />;
      case 'rate-chart': return <InfluencerRateChart />;
      case 'promo': return <AIBrandedPostGenerator />;
      case 'assets': return <VisualAssetLibrary />;
      case 'leaderboard': return <LeaderboardRewards />;
      case 'audience': return <AudienceInsights />;
      case 'leads': return <LeadsWallet activeTab={activeSection} />;
      case 'wallet': return <InfluencerWalletScreen />;
      case 'performance': return <InfluencerPerformanceRating />;
      case 'support': return <InfluencerSupportTickets />;
      case 'offers': return <OfferPromoCenter />;
      case 'compliance': return <CompliancePolicy />;
      case 'training': return <TrainingAcademy />;
      default: return <SimpleShareCenter />;
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
            {menuItems.map((item, index) => {
              const isHighlight = 'highlight' in item && item.highlight;
              return (
                <motion.button
                  key={item.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-violet-500/20 to-cyan-500/10 border border-violet-500/50 text-violet-400'
                      : isHighlight
                        ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 hover:border-emerald-400/50'
                        : 'hover:bg-slate-800/50 text-slate-400 hover:text-violet-400'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isHighlight && activeSection !== item.id ? 'text-emerald-400' : ''}`} />
                  <span className={`font-medium text-sm flex-1 text-left ${isHighlight && activeSection !== item.id ? 'text-emerald-400' : ''}`}>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-violet-500 to-cyan-500 text-white">
                      {item.badge}
                    </span>
                  )}
                  {isHighlight && activeSection !== item.id && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white animate-pulse">
                      START
                    </span>
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Influence Score Card */}
          <div className="absolute bottom-52 left-3 right-3">
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

          {/* Account Actions */}
          <div className="absolute bottom-4 left-3 right-3 space-y-1">
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-slate-800/50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium text-sm">Back to Dashboard</span>
            </button>
            <button 
              onClick={() => navigate('/change-password')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-slate-800/50 transition-all"
            >
              <Lock className="w-4 h-4" />
              <span className="font-medium text-sm">Change Password</span>
            </button>
            <button 
              onClick={() => navigate('/forgot-password')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-slate-800/50 transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span className="font-medium text-sm">Forgot Password</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium text-sm">Logout</span>
            </button>
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
