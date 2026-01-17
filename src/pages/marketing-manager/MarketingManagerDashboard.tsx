import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Megaphone, Gift, MapPin, Image, Calendar, 
  TrendingUp, CheckCircle, FileText, Shield, LogOut, Activity,
  Layers, Brain, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Import screens
import MMOverview from "./screens/MMOverview";
import MMCampaigns from "./screens/MMCampaigns";
import MMCampaignBuilder from "./screens/MMCampaignBuilder";
import MMCampaignHierarchy from "./screens/MMCampaignHierarchy";
import MMAIAutomation from "./screens/MMAIAutomation";
import MMOffersFestivals from "./screens/MMOffersFestivals";
import MMLocationTargeting from "./screens/MMLocationTargeting";
import MMCreativesLibrary from "./screens/MMCreativesLibrary";
import MMSchedules from "./screens/MMSchedules";
import MMPerformance from "./screens/MMPerformance";
import MMApprovals from "./screens/MMApprovals";
import MMReports from "./screens/MMReports";
import MMAudit from "./screens/MMAudit";
import MMSEOManagement from "./screens/MMSEOManagement";
import MMLeadSources from "./screens/MMLeadSources";
import MMContentLibrary from "./screens/MMContentLibrary";
import MMROIAnalytics from "./screens/MMROIAnalytics";
const sidebarItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "campaigns", label: "Campaigns", icon: Megaphone },
  { id: "campaign-builder", label: "Campaign Builder", icon: Target },
  { id: "hierarchy", label: "Campaign Hierarchy", icon: Layers },
  { id: "seo", label: "SEO Management", icon: TrendingUp },
  { id: "lead-sources", label: "Lead Sources", icon: MapPin },
  { id: "content", label: "Content Library", icon: Image },
  { id: "offers", label: "Offers & Festivals", icon: Gift },
  { id: "targeting", label: "Location Targeting", icon: MapPin },
  { id: "schedules", label: "Schedules", icon: Calendar },
  { id: "analytics", label: "ROI Analytics", icon: TrendingUp },
  { id: "ai-automation", label: "AI Automation", icon: Brain },
  { id: "approvals", label: "Approvals", icon: CheckCircle },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "audit", label: "Audit", icon: Shield },
];

const MarketingManagerDashboard = () => {
  const [activeScreen, setActiveScreen] = useState("overview");
  const [campaignStatus, setCampaignStatus] = useState<"Stable" | "Warning" | "Critical">("Stable");
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    // Prevent copy/paste
    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error("Copy/Paste is disabled for security");
    };
    
    // Prevent screenshot (basic)
    const preventScreenshot = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || (e.metaKey && e.shiftKey && e.key === "4")) {
        e.preventDefault();
        toast.error("Screenshots are disabled for security");
      }
    };

    document.addEventListener("copy", preventCopy);
    document.addEventListener("paste", preventCopy);
    document.addEventListener("keydown", preventScreenshot);

    return () => {
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("paste", preventCopy);
      document.removeEventListener("keydown", preventScreenshot);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case "overview": return <MMOverview />;
      case "campaigns": return <MMCampaigns />;
      case "campaign-builder": return <MMCampaignBuilder />;
      case "hierarchy": return <MMCampaignHierarchy />;
      case "seo": return <MMSEOManagement />;
      case "lead-sources": return <MMLeadSources />;
      case "content": return <MMContentLibrary />;
      case "offers": return <MMOffersFestivals />;
      case "targeting": return <MMLocationTargeting />;
      case "schedules": return <MMSchedules />;
      case "analytics": return <MMROIAnalytics />;
      case "ai-automation": return <MMAIAutomation />;
      case "approvals": return <MMApprovals />;
      case "reports": return <MMReports />;
      case "audit": return <MMAudit />;
      default: return <MMOverview />;
    }
  };

  const getStatusColor = () => {
    switch (campaignStatus) {
      case "Stable": return "text-emerald-400 bg-emerald-500/20";
      case "Warning": return "text-yellow-400 bg-yellow-500/20";
      case "Critical": return "text-red-400 bg-red-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20 flex select-none">
      {/* Fixed Left Sidebar */}
      <aside className="w-64 bg-slate-900/80 border-r border-slate-700/50 flex flex-col fixed h-full">
        <div className="p-4 border-b border-slate-700/50">
          <h1 className="text-lg font-bold text-emerald-400">Marketing Manager</h1>
          <p className="text-xs text-slate-500">Campaign Control</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                activeScreen === item.id
                  ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Secure Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Fixed Top Header */}
        <header className="h-16 bg-slate-900/80 border-b border-slate-700/50 flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-10">
          <h2 className="text-lg font-semibold text-white">
            Marketing Manager — Campaign Control
          </h2>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getStatusColor()}`}>
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">Campaign Status: {campaignStatus}</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 mt-16 overflow-auto">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderScreen()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default MarketingManagerDashboard;
