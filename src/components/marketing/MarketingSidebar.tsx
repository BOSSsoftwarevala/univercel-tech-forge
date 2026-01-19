import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Megaphone, 
  LayoutDashboard, 
  Rocket, 
  Users, 
  Zap, 
  BarChart3, 
  FolderOpen, 
  Globe,
  TrendingUp,
  Sparkles,
  Brain,
  LogOut,
  Settings,
  Lock,
  ArrowLeft,
  KeyRound,
  ChevronDown,
  ChevronRight,
  Search,
  FileText,
  Target,
  Share2,
  Mail,
  Bell,
  Shield,
  MapPin,
  DollarSign,
  MessageSquare,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Video,
  Calendar,
  RefreshCw,
  AlertTriangle,
  Eye,
  Activity
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MarketingSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

interface SubItem {
  id: string;
  label: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  subItems?: SubItem[];
}

const MarketingSidebar = ({ activeSection, setActiveSection }: MarketingSidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["overview"]);
  
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Marketing Manager';
  const maskedId = user?.id ? `MKT-${user.id.substring(0, 4).toUpperCase()}` : 'MKT-0000';
  
  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };
  
  const menuItems: MenuItem[] = [
    { 
      id: "overview", 
      label: "Marketing Overview", 
      icon: LayoutDashboard,
      subItems: [
        { id: "overview-campaigns", label: "Live Campaign Status" },
        { id: "overview-channels", label: "Active Channels" },
        { id: "overview-leads", label: "Leads Today" },
        { id: "overview-cost", label: "Cost vs Result" },
        { id: "overview-conversion", label: "Conversion Rate" },
      ]
    },
    { 
      id: "seo", 
      label: "SEO Management", 
      icon: Search,
      subItems: [
        { id: "seo-keywords", label: "Keyword Research" },
        { id: "seo-country", label: "Country-wise Keywords" },
        { id: "seo-onpage", label: "On-page SEO" },
        { id: "seo-offpage", label: "Off-page SEO" },
        { id: "seo-technical", label: "Technical SEO" },
        { id: "seo-audit", label: "SEO Audit" },
        { id: "seo-ranking", label: "Ranking Tracker" },
      ]
    },
    { 
      id: "content", 
      label: "Content Marketing", 
      icon: FileText,
      subItems: [
        { id: "content-blog", label: "Blog Manager" },
        { id: "content-landing", label: "Landing Pages" },
        { id: "content-ai", label: "AI Content Generator" },
        { id: "content-local", label: "Local Language Content" },
        { id: "content-approval", label: "Content Approval Queue" },
      ]
    },
    { 
      id: "ads", 
      label: "Paid Ads Manager", 
      icon: Target,
      subItems: [
        { id: "ads-google", label: "Google Ads" },
        { id: "ads-meta", label: "Meta Ads" },
        { id: "ads-youtube", label: "YouTube Ads" },
        { id: "ads-display", label: "Display Ads" },
        { id: "ads-budget", label: "Budget Control" },
        { id: "ads-roi", label: "ROI Tracking" },
      ]
    },
    { 
      id: "social", 
      label: "Social Media Marketing", 
      icon: Share2,
      subItems: [
        { id: "social-facebook", label: "Facebook" },
        { id: "social-instagram", label: "Instagram" },
        { id: "social-linkedin", label: "LinkedIn" },
        { id: "social-twitter", label: "Twitter / X" },
        { id: "social-tiktok", label: "TikTok" },
        { id: "social-scheduler", label: "Auto Post Scheduler" },
      ]
    },
    { 
      id: "leads", 
      label: "Lead Generation", 
      icon: TrendingUp,
      subItems: [
        { id: "leads-website", label: "Website Leads" },
        { id: "leads-facebook", label: "Facebook Leads" },
        { id: "leads-google", label: "Google Leads" },
        { id: "leads-whatsapp", label: "WhatsApp Leads" },
        { id: "leads-referral", label: "Referral Leads" },
        { id: "leads-marketplace", label: "Marketplace Leads" },
      ]
    },
    { 
      id: "routing", 
      label: "Lead Routing & Scoring", 
      icon: RefreshCw,
      subItems: [
        { id: "routing-country", label: "Country-based Routing" },
        { id: "routing-franchise", label: "Franchise Routing" },
        { id: "routing-reseller", label: "Reseller Routing" },
        { id: "routing-scoring", label: "Lead Scoring AI" },
        { id: "routing-priority", label: "Priority Assignment" },
      ]
    },
    { 
      id: "campaigns", 
      label: "Campaign Management", 
      icon: Rocket,
      subItems: [
        { id: "campaigns-create", label: "Create Campaign" },
        { id: "campaigns-edit", label: "Edit Campaign" },
        { id: "campaigns-pause", label: "Pause / Resume" },
        { id: "campaigns-approval", label: "Campaign Approval" },
        { id: "campaigns-summary", label: "Performance Summary" },
      ]
    },
    { 
      id: "regional", 
      label: "Regional Marketing", 
      icon: Globe,
      subItems: [
        { id: "regional-continent", label: "Continent Campaigns" },
        { id: "regional-country", label: "Country Campaigns" },
        { id: "regional-city", label: "City-level Targeting" },
        { id: "regional-language", label: "Language Targeting" },
        { id: "regional-festival", label: "Festival Campaigns" },
      ]
    },
    { 
      id: "influencer", 
      label: "Influencer Marketing", 
      icon: Users,
      subItems: [
        { id: "influencer-list", label: "Influencer List" },
        { id: "influencer-assign", label: "Campaign Assign" },
        { id: "influencer-performance", label: "Performance Tracking" },
        { id: "influencer-fake", label: "Fake Traffic Detection" },
        { id: "influencer-payout", label: "Payout Control" },
      ]
    },
    { 
      id: "email-sms", 
      label: "Email & SMS Marketing", 
      icon: Mail,
      subItems: [
        { id: "email-campaigns", label: "Email Campaigns" },
        { id: "sms-campaigns", label: "SMS Campaigns" },
        { id: "whatsapp-broadcast", label: "WhatsApp Broadcast" },
        { id: "template-manager", label: "Template Manager" },
        { id: "delivery-reports", label: "Delivery Reports" },
      ]
    },
    { 
      id: "automation", 
      label: "Marketing Automation", 
      icon: Zap,
      subItems: [
        { id: "automation-followup", label: "Auto Follow-up" },
        { id: "automation-retargeting", label: "Auto Retargeting" },
        { id: "automation-ai", label: "AI Campaign Suggestions" },
        { id: "automation-budget", label: "Auto Budget Adjustment" },
      ]
    },
    { 
      id: "analytics", 
      label: "Analytics & Reports", 
      icon: BarChart3,
      subItems: [
        { id: "analytics-traffic", label: "Traffic Analytics" },
        { id: "analytics-funnel", label: "Conversion Funnel" },
        { id: "analytics-channel", label: "Channel Comparison" },
        { id: "analytics-export", label: "Export Reports" },
      ]
    },
    { 
      id: "alerts", 
      label: "Alerts & Approvals", 
      icon: Bell,
      subItems: [
        { id: "alerts-budget", label: "Budget Exceed Alert" },
        { id: "alerts-campaign", label: "Campaign Approval" },
        { id: "alerts-performance", label: "Low Performance Alert" },
        { id: "alerts-ai", label: "AI Suggestions Review" },
      ]
    },
    { 
      id: "logs", 
      label: "Logs & Compliance", 
      icon: Shield,
      subItems: [
        { id: "logs-activity", label: "Marketing Activity Logs" },
        { id: "logs-compliance", label: "Compliance Check" },
        { id: "logs-privacy", label: "Data Privacy Logs" },
        { id: "logs-masked", label: "Masked Data View" },
      ]
    },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-72 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl border-r border-teal-500/20 flex flex-col h-screen"
    >
      {/* Header with User Info */}
      <div className="p-4 border-b border-teal-500/20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <Megaphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-teal-200 to-cyan-400 bg-clip-text text-transparent">
              Marketing
            </h1>
            <p className="text-[10px] text-teal-500/70">Full Growth & Acquisition Control</p>
          </div>
        </div>
        
        {/* User Info & Role Badge */}
        <div className="mt-3 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-white truncate">{userName}</span>
            <Badge className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-[9px] px-1.5 py-0">
              MARKETING MGR
            </Badge>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{maskedId}</span>
        </div>
        
        {/* AI Status */}
        <motion.div 
          className="mt-2 p-2 rounded-lg bg-gradient-to-r from-teal-500/10 to-cyan-600/5 border border-teal-500/20"
          animate={{ boxShadow: ["0 0 15px rgba(20,184,166,0.1)", "0 0 25px rgba(20,184,166,0.2)", "0 0 15px rgba(20,184,166,0.1)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-teal-400" />
            <span className="text-xs text-teal-300 font-medium">AI Optimizer Active</span>
          </div>
          <p className="mt-0.5 text-[10px] text-slate-500">Analyzing 8 campaigns</p>
        </motion.div>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedMenus.includes(item.id);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isParentActive = activeSection.startsWith(item.id);
          
          return (
            <div key={item.id}>
              <motion.button
                onClick={() => {
                  if (hasSubItems) {
                    toggleMenu(item.id);
                  } else {
                    setActiveSection(item.id);
                  }
                }}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isParentActive
                    ? "bg-gradient-to-r from-teal-500/20 to-cyan-600/10 text-teal-300 border border-teal-500/30"
                    : "text-slate-400 hover:text-teal-300 hover:bg-teal-500/5"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isParentActive ? "text-teal-400" : ""}`} />
                <span className="text-xs font-medium flex-1 text-left truncate">{item.label}</span>
                {hasSubItems && (
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-3 h-3" />
                  </motion.div>
                )}
              </motion.button>
              
              {/* Sub Items */}
              <AnimatePresence>
                {hasSubItems && isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 pl-3 border-l border-teal-500/20 mt-1 space-y-0.5">
                      {item.subItems?.map((subItem) => {
                        const isActive = activeSection === subItem.id;
                        return (
                          <motion.button
                            key={subItem.id}
                            onClick={() => setActiveSection(subItem.id)}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200 ${
                              isActive
                                ? "bg-teal-500/20 text-teal-300"
                                : "text-slate-500 hover:text-teal-300 hover:bg-teal-500/5"
                            }`}
                          >
                            <ChevronRight className="w-2.5 h-2.5" />
                            <span className="text-[11px] truncate">{subItem.label}</span>
                            {isActive && (
                              <motion.div
                                layoutId="mktSubActiveIndicator"
                                className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400"
                                initial={false}
                              />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-3 border-t border-teal-500/20 space-y-2 shrink-0">
        <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] text-emerald-300">ROI</span>
          </div>
          <span className="text-sm font-bold text-emerald-400">342%</span>
        </div>
        
        <div className="flex items-center justify-between p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <div className="flex items-center gap-2">
            <Rocket className="w-3 h-3 text-orange-400" />
            <span className="text-[10px] text-orange-300">Active Campaigns</span>
          </div>
          <span className="text-sm font-bold text-orange-400">12</span>
        </div>
      </div>
      
      {/* Footer Actions */}
      <div className="p-3 border-t border-teal-500/20 space-y-1.5 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-8 text-xs text-slate-400 hover:text-teal-300 hover:bg-teal-500/10"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="w-3 h-3 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-7 text-[10px] text-slate-400 hover:text-teal-300 hover:bg-teal-500/10"
            onClick={() => navigate('/change-password')}
          >
            <Lock className="w-3 h-3 mr-1" />
            Password
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-7 text-[10px] text-slate-400 hover:text-teal-300 hover:bg-teal-500/10"
            onClick={() => navigate('/settings')}
          >
            <Settings className="w-3 h-3 mr-1" />
            Settings
          </Button>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="w-full h-8 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20"
        >
          <LogOut className="w-3 h-3 mr-2" />
          Sign Out
        </Button>
      </div>
    </motion.aside>
  );
};

export default MarketingSidebar;
