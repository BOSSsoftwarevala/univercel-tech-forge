import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Globe, Search, BarChart3, Link2, FileText, Shield, 
  Wallet, Zap, Target, TrendingUp, Bell,
  Sparkles, Map, Share2, FileCode, 
  Database, Calendar, MousePointer, Eye, Rocket, Settings, LogOut, Lock
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import SEOTopBar from "@/components/seo/SEOTopBar";
import SEOMetrics from "@/components/seo/SEOMetrics";
import KeywordManager from "@/components/seo/KeywordManager";
import MetaTagEngine from "@/components/seo/MetaTagEngine";
import ContentGenerator from "@/components/seo/ContentGenerator";
import BacklinkManager from "@/components/seo/BacklinkManager";
import CompetitorIntelligence from "@/components/seo/CompetitorIntelligence";
import SEOAlerts from "@/components/seo/SEOAlerts";
import SEOWallet from "@/components/seo/SEOWallet";
import PerformanceReview from "@/components/seo/PerformanceReview";
import SpamGuard from "@/components/seo/SpamGuard";
import RegionalModes from "@/components/seo/RegionalModes";
import SocialSEOSync from "@/components/seo/SocialSEOSync";
import AIInsightPanel from "@/components/seo/AIInsightPanel";
import TechnicalSEOPanel from "@/components/seo/TechnicalSEOPanel";
import RankTracker from "@/components/seo/RankTracker";
import ContentDeployment from "@/components/seo/ContentDeployment";
import ProductSEOLibrary from "@/components/seo/ProductSEOLibrary";
import AutomationScheduler from "@/components/seo/AutomationScheduler";
import HeatmapBehavior from "@/components/seo/HeatmapBehavior";
import DemoSEOIntegration from "@/components/seo/DemoSEOIntegration";

const SEODashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [activeRegion, setActiveRegion] = useState<"global" | "africa" | "asia" | "middleeast">("global");
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "keywords", label: "Keyword Manager", icon: Search },
    { id: "meta", label: "Meta Engine", icon: FileText },
    { id: "content", label: "Content Generator", icon: Sparkles },
    { id: "technical", label: "Technical SEO", icon: FileCode },
    { id: "ranks", label: "Rank Tracker", icon: TrendingUp },
    { id: "library", label: "Product Library", icon: Database },
    { id: "deployment", label: "Deployment", icon: Rocket },
    { id: "backlinks", label: "Backlink Manager", icon: Link2 },
    { id: "competitors", label: "Competitor Intel", icon: Target },
    { id: "demo", label: "Demo SEO", icon: Eye },
    { id: "heatmap", label: "Heatmap", icon: MousePointer },
    { id: "scheduler", label: "Automation", icon: Calendar },
    { id: "regional", label: "Regional Modes", icon: Map },
    { id: "social", label: "Social × SEO", icon: Share2 },
    { id: "alerts", label: "Live Alerts", icon: Bell },
    { id: "spam", label: "Spam Guard", icon: Shield },
    { id: "wallet", label: "SEO Wallet", icon: Wallet },
    { id: "performance", label: "Performance", icon: TrendingUp },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard": return <SEOMetrics activeRegion={activeRegion} />;
      case "keywords": return <KeywordManager activeRegion={activeRegion} />;
      case "meta": return <MetaTagEngine />;
      case "content": return <ContentGenerator activeRegion={activeRegion} />;
      case "technical": return <TechnicalSEOPanel />;
      case "ranks": return <RankTracker activeRegion={activeRegion} />;
      case "library": return <ProductSEOLibrary />;
      case "deployment": return <ContentDeployment />;
      case "backlinks": return <BacklinkManager />;
      case "competitors": return <CompetitorIntelligence />;
      case "demo": return <DemoSEOIntegration />;
      case "heatmap": return <HeatmapBehavior />;
      case "scheduler": return <AutomationScheduler />;
      case "regional": return <RegionalModes activeRegion={activeRegion} onRegionChange={setActiveRegion} />;
      case "social": return <SocialSEOSync />;
      case "alerts": return <SEOAlerts />;
      case "spam": return <SpamGuard />;
      case "wallet": return <SEOWallet />;
      case "performance": return <PerformanceReview />;
      default: return <SEOMetrics activeRegion={activeRegion} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute top-20 right-20 w-96 h-96 opacity-10" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
          <Globe className="w-full h-full text-cyan-400" />
        </motion.div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {[...Array(3)].map((_, i) => (
            <motion.div key={i} className="absolute w-[600px] h-[600px] border border-cyan-500/20 rounded-full" style={{ left: -300, top: -300 }} animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 4, repeat: Infinity, delay: i * 1.3 }} />
          ))}
        </div>
      </div>

      <SEOTopBar onAIClick={() => setShowAIPanel(true)} activeRegion={activeRegion} />

      <div className="flex pt-16">
        {/* Sidebar */}
        <motion.aside initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-slate-900/50 backdrop-blur-xl border-r border-cyan-500/20 z-40 overflow-y-auto">
          <div className="p-4 space-y-1">
            {sidebarItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 group ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-300"
                    : "hover:bg-slate-800/50 text-slate-400 hover:text-cyan-300"
                }`}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className={`w-4 h-4 ${activeSection === item.id ? "text-cyan-400" : "group-hover:text-cyan-400"}`} />
                <span className="text-sm font-medium">{item.label}</span>
                {activeSection === item.id && (
                  <motion.div layoutId="activeIndicator" className="absolute left-0 w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full" />
                )}
              </motion.button>
            ))}
          </div>

          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-2 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              Run Optimization
            </motion.button>
            <div className="flex gap-2">
              <motion.button onClick={() => navigate('/change-password')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 py-2 px-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-sm font-medium text-cyan-300 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </motion.button>
              <motion.button onClick={() => navigate('/settings')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 py-2 px-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-sm font-medium text-cyan-300 flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </motion.button>
            </div>
            <motion.button onClick={handleLogout} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-2 px-4 bg-red-500/10 border border-red-500/30 rounded-lg text-sm font-medium text-red-400 flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6 overflow-auto">
          <motion.div key={activeSection} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {renderContent()}
          </motion.div>
        </main>
      </div>

      <AIInsightPanel isOpen={showAIPanel} onClose={() => setShowAIPanel(false)} />
    </div>
  );
};

export default SEODashboard;
