import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Search, 
  Code, 
  Globe, 
  TrendingUp, 
  Zap, 
  AlertTriangle, 
  BarChart3, 
  Shield,
  LogOut,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Import screens
import SEOOverview from "./screens/SEOOverview";
import SEOPages from "./screens/SEOPages";
import SEOKeywords from "./screens/SEOKeywords";
import SEOMetaRules from "./screens/SEOMetaRules";
import SEOIndexingCrawl from "./screens/SEOIndexingCrawl";
import SEOPerformance from "./screens/SEOPerformance";
import SEOAutomation from "./screens/SEOAutomation";
import SEOIssuesFixes from "./screens/SEOIssuesFixes";
import SEOReports from "./screens/SEOReports";
import SEOAudit from "./screens/SEOAudit";
import SEOBacklinks from "./screens/SEOBacklinks";
import SEOCompetitors from "./screens/SEOCompetitors";
import SEOSettings from "./screens/SEOSettings";

const sidebarItems = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "keywords", label: "Keyword Tracker", icon: Search },
  { id: "performance", label: "Performance", icon: TrendingUp },
  { id: "pages", label: "Pages Analysis", icon: FileText },
  { id: "backlinks", label: "Backlink Monitor", icon: Activity },
  { id: "competitors", label: "Competitors", icon: Globe },
  { id: "indexing", label: "Indexing & Crawl", icon: Globe },
  { id: "meta-rules", label: "Meta & Schema", icon: Code },
  { id: "automation", label: "Automation Engine", icon: Zap },
  { id: "issues", label: "Issues & Fixes", icon: AlertTriangle },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "audit", label: "Audit Trail", icon: Shield },
  { id: "settings", label: "Settings", icon: BarChart3 },
];

const SEOManagerDashboard = () => {
  const [activeScreen, setActiveScreen] = useState("overview");
  const [seoHealth, setSeoHealth] = useState<"Good" | "Warning" | "Critical">("Good");
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
      case "overview": return <SEOOverview />;
      case "pages": return <SEOPages />;
      case "keywords": return <SEOKeywords />;
      case "meta-rules": return <SEOMetaRules />;
      case "indexing": return <SEOIndexingCrawl />;
      case "performance": return <SEOPerformance />;
      case "automation": return <SEOAutomation />;
      case "issues": return <SEOIssuesFixes />;
      case "reports": return <SEOReports />;
      case "audit": return <SEOAudit />;
      case "backlinks": return <SEOBacklinks />;
      case "competitors": return <SEOCompetitors />;
      case "settings": return <SEOSettings />;
      default: return <SEOOverview />;
    }
  };

  const getHealthColor = () => {
    switch (seoHealth) {
      case "Good": return "text-emerald-400 bg-emerald-500/20";
      case "Warning": return "text-yellow-400 bg-yellow-500/20";
      case "Critical": return "text-red-400 bg-red-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/20 flex select-none">
      {/* Fixed Left Sidebar */}
      <aside className="w-64 bg-slate-900/80 border-r border-slate-700/50 flex flex-col fixed h-full">
        <div className="p-4 border-b border-slate-700/50">
          <h1 className="text-lg font-bold text-cyan-400">SEO Manager</h1>
          <p className="text-xs text-slate-500">Optimization Center</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                activeScreen === item.id
                  ? "bg-cyan-600/20 text-cyan-400 border border-cyan-500/30"
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
            SEO Manager — Optimization Center
          </h2>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getHealthColor()}`}>
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">SEO Health: {seoHealth}</span>
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

export default SEOManagerDashboard;
