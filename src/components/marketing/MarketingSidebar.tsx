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
      className="w-64 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl border-r border-teal-500/20 flex flex-col h-screen"
    >
      {/* Compact Header */}
      <div className="px-3 py-2 border-b border-teal-500/20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <Megaphone className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold bg-gradient-to-r from-teal-200 to-cyan-400 bg-clip-text text-transparent">
              Marketing Manager
            </h1>
            <div className="flex items-center gap-1">
              <Badge className="bg-teal-500/20 text-teal-300 text-[8px] px-1 py-0 h-4">
                {maskedId}
              </Badge>
              <span className="text-[9px] text-teal-400 flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> AI Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Compact Scrollable */}
      <nav className="flex-1 px-1.5 py-1 space-y-px overflow-y-auto scrollbar-thin scrollbar-thumb-teal-500/20 scrollbar-track-transparent">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedMenus.includes(item.id);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isParentActive = activeSection.startsWith(item.id);
          
          return (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (hasSubItems) {
                    toggleMenu(item.id);
                  } else {
                    setActiveSection(item.id);
                  }
                }}
                className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-all duration-150 ${
                  isParentActive
                    ? "bg-teal-500/20 text-teal-300"
                    : "text-slate-400 hover:text-teal-300 hover:bg-teal-500/5"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isParentActive ? "text-teal-400" : ""}`} />
                <span className="text-[11px] font-medium flex-1 text-left truncate">{item.label}</span>
                {hasSubItems && (
                  <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                )}
              </button>
              
              {/* Sub Items - Compact */}
              <AnimatePresence>
                {hasSubItems && isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-3 pl-2 border-l border-teal-500/20 py-0.5 space-y-px">
                      {item.subItems?.map((subItem) => {
                        const isActive = activeSection === subItem.id;
                        return (
                          <button
                            key={subItem.id}
                            onClick={() => setActiveSection(subItem.id)}
                            className={`w-full flex items-center gap-1 px-1.5 py-1 rounded text-left transition-all duration-150 ${
                              isActive
                                ? "bg-teal-500/15 text-teal-300"
                                : "text-slate-500 hover:text-teal-300 hover:bg-teal-500/5"
                            }`}
                          >
                            <ChevronRight className="w-2 h-2 shrink-0" />
                            <span className="text-[10px] truncate">{subItem.label}</span>
                          </button>
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

      {/* Compact Footer with Stats + Actions */}
      <div className="px-2 py-1.5 border-t border-teal-500/20 shrink-0">
        {/* Mini Stats Row */}
        <div className="flex gap-1.5 mb-1.5">
          <div className="flex-1 flex items-center justify-between px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400">342% ROI</span>
          </div>
          <div className="flex-1 flex items-center justify-between px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20">
            <Rocket className="w-3 h-3 text-orange-400" />
            <span className="text-[10px] font-bold text-orange-400">12 Active</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-6 text-[9px] text-slate-400 hover:text-teal-300 hover:bg-teal-500/10 px-1"
            onClick={() => navigate('/super-admin-system/role-switch?role=boss_owner')}
          >
            <ArrowLeft className="w-2.5 h-2.5 mr-0.5" />
            Back
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-6 text-[9px] text-slate-400 hover:text-teal-300 hover:bg-teal-500/10 px-1"
            onClick={() => navigate('/settings')}
          >
            <Settings className="w-2.5 h-2.5 mr-0.5" />
            Settings
          </Button>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="h-6 text-[9px] text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2"
          >
            <LogOut className="w-2.5 h-2.5" />
          </Button>
        </div>
      </div>
    </motion.aside>
  );
};

export default MarketingSidebar;
