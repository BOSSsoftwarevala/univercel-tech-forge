import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Globe, Search, BarChart3, Link2, FileText, Shield, 
  Zap, Target, TrendingUp, Bell,
  Sparkles, Map, Share2, FileCode, Megaphone, Mail, MessageSquare,
  Database, Calendar, MousePointer, Eye, Rocket, Settings, LogOut, Lock,
  Bot, Tag, Code2, Users, KeyRound, ArrowLeft
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import SEOTopBar from "@/components/seo/SEOTopBar";
import SEOMetrics from "@/components/seo/SEOMetrics";
import KeywordManager from "@/components/seo/KeywordManager";
import MetaTagEngine from "@/components/seo/MetaTagEngine";
import ContentGenerator from "@/components/seo/ContentGenerator";
import LeadIntelligence from "@/components/seo/LeadIntelligence";
import AdsAutomation from "@/components/seo/AdsAutomation";
import EmailAutomation from "@/components/seo/EmailAutomation";
import SocialCommentAutomation from "@/components/seo/SocialCommentAutomation";
import ChatMessageReply from "@/components/seo/ChatMessageReply";
import AutomationFlows from "@/components/seo/AutomationFlows";
// SECURITY: CombinedWallet import removed - SEO Manager cannot access financial controls
import ReportsAnalytics from "@/components/seo/ReportsAnalytics";
import SettingsIntegrations from "@/components/seo/SettingsIntegrations";
import AIInsightPanel from "@/components/seo/AIInsightPanel";
import CompetitorIntelligence from "@/components/seo/CompetitorIntelligence";
import TechnicalSEOPanel from "@/components/seo/TechnicalSEOPanel";
import AutomationScheduler from "@/components/seo/AutomationScheduler";
import AIReelsCreator from "@/components/seo/AIReelsCreator";

const SEODashboard = () => {
  const [activeSection, setActiveSection] = useState("command");
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [activeRegion, setActiveRegion] = useState<"global" | "africa" | "asia" | "middleeast">("global");
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const userName = user?.email?.split('@')[0] || 'SEO Manager';
  const maskedId = `SEO-${user?.id?.slice(0, 4).toUpperCase() || 'XXXX'}`;
  const initials = userName.slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  // SECURITY: SEO Manager sidebar items - NO wallet/finance access per RBAC rules
  const sidebarItems = [
    { id: "command", label: "SEO Command Center", icon: Globe, category: "main" },
    { id: "ai-assistant", label: "AI SEO Assistant", icon: Sparkles, category: "ai" },
    { id: "reels", label: "AI Reels Creator", icon: Eye, category: "ai" },
    { id: "keywords", label: "Keyword Manager", icon: Search, category: "seo" },
    { id: "metatags", label: "AI Meta Tags", icon: Tag, category: "seo" },
    { id: "content", label: "AI Content Generator", icon: FileText, category: "seo" },
    { id: "technical", label: "Technical SEO", icon: Code2, category: "seo" },
    { id: "competitors", label: "Competitor Intelligence", icon: Users, category: "seo" },
    { id: "leads", label: "Lead Intelligence", icon: Target, category: "automation" },
    { id: "ads", label: "Ads Automation", icon: Megaphone, category: "automation" },
    { id: "email", label: "Email Automation", icon: Mail, category: "automation" },
    { id: "social", label: "Social Auto-Post", icon: Share2, category: "automation" },
    { id: "chat", label: "Chat Auto-Reply", icon: MessageSquare, category: "automation" },
    { id: "scheduler", label: "Auto Scheduler", icon: Calendar, category: "automation" },
    { id: "automation", label: "Automation Flows", icon: Zap, category: "automation" },
    // SECURITY: Wallet section removed - SEO Manager cannot access financial controls
    { id: "reports", label: "Reports & Analytics", icon: BarChart3, category: "other" },
    { id: "settings", label: "Settings & Integrations", icon: Settings, category: "other" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "command": return <SEOMetrics activeRegion={activeRegion} />;
      case "ai-assistant": 
        setShowAIPanel(true);
        return <SEOMetrics activeRegion={activeRegion} />;
      case "reels": return <AIReelsCreator />;
      case "keywords": return <KeywordManager activeRegion={activeRegion} />;
      case "metatags": return <MetaTagEngine />;
      case "content": return <ContentGenerator activeRegion={activeRegion} />;
      case "technical": return <TechnicalSEOPanel />;
      case "competitors": return <CompetitorIntelligence />;
      case "leads": return <LeadIntelligence />;
      case "ads": return <AdsAutomation />;
      case "email": return <EmailAutomation />;
      case "social": return <SocialCommentAutomation />;
      case "chat": return <ChatMessageReply />;
      case "scheduler": return <AutomationScheduler />;
      case "automation": return <AutomationFlows />;
      // SECURITY: Wallet case removed - SEO Manager cannot access financial controls
      case "reports": return <ReportsAnalytics />;
      case "settings": return <SettingsIntegrations />;
      default: return <SEOMetrics activeRegion={activeRegion} />;
    }
  };

  const categories = [
    { id: "main", label: null },
    { id: "ai", label: "AI Tools" },
    { id: "seo", label: "SEO Tools" },
    { id: "automation", label: "Automation" },
    { id: "other", label: "Management" },
  ];

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
        <motion.aside initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-slate-900/50 backdrop-blur-xl border-r border-cyan-500/20 z-40 overflow-y-auto">
          {/* User Profile */}
          <div className="p-4 border-b border-cyan-500/20">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10 ring-2 ring-cyan-500/50">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-white truncate">{userName}</h2>
                <p className="text-xs text-cyan-400/70 font-mono">{maskedId}</p>
              </div>
            </div>
            <Badge className="w-full justify-center bg-cyan-600/20 text-cyan-400 border-cyan-500/40 py-1">
              <Search className="w-3 h-3 mr-1.5" />
              SEO MANAGER
            </Badge>
          </div>

          {/* Navigation */}
          <div className="p-3 space-y-1 pb-48">
            {categories.map((category) => (
              <div key={category.id}>
                {category.label && (
                  <p className="text-xs text-slate-500 uppercase tracking-wider px-3 py-2 mt-2">{category.label}</p>
                )}
                {sidebarItems
                  .filter((item) => item.category === category.id)
                  .map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 group ${
                        activeSection === item.id
                          ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-300"
                          : "hover:bg-slate-800/50 text-slate-400 hover:text-cyan-300"
                      }`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon className={`w-4 h-4 ${activeSection === item.id ? "text-cyan-400" : "group-hover:text-cyan-400"}`} />
                      <span className="text-xs font-medium">{item.label}</span>
                      {activeSection === item.id && (
                        <motion.div layoutId="seo-activeIndicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      )}
                    </motion.button>
                  ))}
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-900/90 backdrop-blur-sm border-t border-cyan-500/20 space-y-2">
            <motion.button 
              onClick={() => setShowAIPanel(true)}
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4" />
              Open AI Assistant
            </motion.button>
            <motion.button onClick={() => navigate('/dashboard')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-2 px-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-xs font-medium text-cyan-300 flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Dashboard
            </motion.button>
            <div className="flex gap-2">
              <motion.button onClick={() => navigate('/change-password')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 py-2 px-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-xs font-medium text-cyan-300 flex items-center justify-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                Password
              </motion.button>
              <motion.button onClick={() => navigate('/settings')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 py-2 px-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-xs font-medium text-cyan-300 flex items-center justify-center gap-1">
                <Settings className="w-3.5 h-3.5" />
                Settings
              </motion.button>
            </div>
            <motion.button onClick={() => navigate('/forgot-password')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-2 px-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-xs font-medium text-cyan-300 flex items-center justify-center gap-1">
              <KeyRound className="w-3.5 h-3.5" />
              Forgot Password
            </motion.button>
            <motion.button onClick={handleLogout} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-2 px-4 bg-red-500/10 border border-red-500/30 rounded-lg text-sm font-medium text-red-400 flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 ml-72 p-6 overflow-auto">
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
