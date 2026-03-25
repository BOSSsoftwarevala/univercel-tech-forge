import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  LogOut, 
  Search,
  RefreshCw,
  Globe,
  Users
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSEOManagerGuard } from "@/hooks/useSEOManagerGuard";
import { useSEOManagerSystem } from "@/hooks/useSEOManagerSystem";

// Import secure components
import SEOHealthOverview from "@/components/seo-manager/SEOHealthOverview";
import SEOKeywordPerformance from "@/components/seo-manager/SEOKeywordPerformance";
import SEOPageOptimization from "@/components/seo-manager/SEOPageOptimization";
import SEOTechnicalAlerts from "@/components/seo-manager/SEOTechnicalAlerts";
import SEOAISuggestions from "@/components/seo-manager/SEOAISuggestions";
import SEOBacklinkMonitor from "@/components/seo-manager/SEOBacklinkMonitor";
import SEOReportsAudit from "@/components/seo-manager/SEOReportsAudit";
import ContentGenerator from "@/components/seo/ContentGenerator";

const SecureSEOManagerDashboard = () => {
  const navigate = useNavigate();
  const { isSecure } = useSEOManagerGuard();
  const system = useSEOManagerSystem();
  const [sessionTime, setSessionTime] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "pages" | "content" | "backlinks" | "reports">("overview");

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Session timeout (30 minutes)
  useEffect(() => {
    if (sessionTime >= 1800) {
      toast({
        title: "Session Expired",
        description: "Your session has timed out for security.",
        variant: "destructive",
      });
      handleLogout();
    }
  }, [sessionTime]);

  const formatSessionTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLogout = () => {
    sessionStorage.clear();
    toast({
      title: "Session Ended",
      description: "You have been logged out. Session cleared.",
    });
    navigate("/auth");
  };

  const handleRefresh = () => {
    void system.dashboardQuery.refetch().then(() => {
      toast({
        title: "Data Refreshed",
        description: "Live SEO data has been refreshed.",
      });
    });
  };

  const handleDailyAutomation = () => {
    system.runDailyAutomationMutation.mutate(undefined, {
      onSuccess: (result) => {
        toast({
          title: "Daily SEO Loop Complete",
          description: `${String(result.rankChecks || 0)} rank checks and ${String(result.suggestionsCreated || 0)} optimization suggestions generated.`,
        });
      },
    });
  };

  const handleTechnicalScan = () => {
    system.runTechnicalAuditMutation.mutate("/", {
      onSuccess: (issues) => {
        toast({
          title: "Technical Audit Complete",
          description: `${issues.length} technical issues recorded for optimization flow.`,
        });
      },
    });
  };

  if (!isSecure) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Security Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-6 w-6 text-emerald-400" />
                <div>
                  <h1 className="text-lg font-bold text-slate-100">SEO Manager</h1>
                  <p className="text-xs text-slate-400">LONG-TERM GROWTH ENGINE</p>
                </div>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <Shield className="h-3 w-3 mr-1" />
                White-Hat Only
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              {/* Organic Leads (Read-Only) */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <Users className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-slate-300">Organic Leads:</span>
                <span className="text-sm font-bold text-purple-400">{(system.dashboard?.summary.organicLeads || 0).toLocaleString()}</span>
                <Badge className="text-[10px] bg-slate-700/50 text-slate-400">Read-Only</Badge>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="h-8 border-slate-700 bg-slate-800/70 text-slate-200"
                onClick={handleTechnicalScan}
                disabled={system.runTechnicalAuditMutation.isPending}
              >
                Technical Scan
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="h-8 border-emerald-700 bg-emerald-950/40 text-emerald-300"
                onClick={handleDailyAutomation}
                disabled={system.runDailyAutomationMutation.isPending}
              >
                Auto Optimize
              </Button>

              {/* Session Timer */}
              <div className="text-xs text-slate-400">
                Session: {formatSessionTime(sessionTime)}
              </div>

              {/* Refresh Button */}
              <Button
                size="sm"
                variant="ghost"
                className="h-8"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>

              {/* Logout */}
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-red-400 hover:text-red-300"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-3">
            {[
              { id: "overview", label: "Overview" },
              { id: "pages", label: "Page Optimization" },
              { id: "content", label: "AI Content" },
              { id: "backlinks", label: "Backlinks" },
              { id: "reports", label: "Reports & Audit" },
            ].map((tab) => (
              <Button
                key={tab.id}
                size="sm"
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`h-7 text-xs ${
                  activeTab === tab.id 
                    ? "bg-emerald-600 text-white" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Security Banner */}
      <div className="px-6 py-2 bg-emerald-500/10 border-b border-emerald-500/20">
        <p className="text-xs text-emerald-400 text-center">
          🌱 White-Hat SEO Only • Keyword → Content → Rank → Optimize loop active • Admin and finance routes blocked
        </p>
      </div>

      {/* Main Content */}
      <main className="p-6 pb-20">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {system.isLoading && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
              Loading live SEO operations...
            </div>
          )}

          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Row 1: Health + Keywords */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SEOHealthOverview system={system} />
                <SEOKeywordPerformance system={system} />
              </div>

              {/* Row 2: Technical + AI */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SEOTechnicalAlerts system={system} />
                <SEOAISuggestions system={system} />
              </div>
            </div>
          )}

          {activeTab === "pages" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SEOPageOptimization system={system} />
              <SEOAISuggestions system={system} />
            </div>
          )}

          {activeTab === "content" && (
            <ContentGenerator activeRegion="global" system={system} />
          )}

          {activeTab === "backlinks" && (
            <SEOBacklinkMonitor system={system} />
          )}

          {activeTab === "reports" && (
            <SEOReportsAudit system={system} />
          )}
        </motion.div>
      </main>

      {/* Footer Security Notice */}
      <footer className="fixed bottom-0 left-0 right-0 px-6 py-2 bg-slate-900/95 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>SEO Manager • Long-Term Growth Engine</span>
          <span>All changes logged & reversible • Immutable audit trail</span>
          <span>Daily ranking loop active • AI optimization with approval controls</span>
        </div>
      </footer>
    </div>
  );
};

export default SecureSEOManagerDashboard;
