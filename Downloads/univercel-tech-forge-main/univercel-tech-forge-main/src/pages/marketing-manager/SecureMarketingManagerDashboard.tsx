import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  LogOut, 
  Megaphone,
  RefreshCw
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useMarketingManagerGuard } from "@/hooks/useMarketingManagerGuard";
import { useMarketingManagerSystem } from "@/hooks/useMarketingManagerSystem";

// Import secure components
import MMActiveCampaigns from "@/components/marketing-manager/MMActiveCampaigns";
import MMCampaignPerformance from "@/components/marketing-manager/MMCampaignPerformance";
import MMChannelBreakdown from "@/components/marketing-manager/MMChannelBreakdown";
import MMContentQueue from "@/components/marketing-manager/MMContentQueue";
import MMAIOptimization from "@/components/marketing-manager/MMAIOptimization";
import MMComplianceStatus from "@/components/marketing-manager/MMComplianceStatus";
import MMReportsAudit from "@/components/marketing-manager/MMReportsAudit";
import MMCampaignCreator from "@/components/marketing-manager/MMCampaignCreator";

const SecureMarketingManagerDashboard = () => {
  const navigate = useNavigate();
  const { isSecure } = useMarketingManagerGuard();
  const system = useMarketingManagerSystem();
  const [sessionTime, setSessionTime] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "create" | "content" | "reports">("overview");

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
        description: "Live marketing data has been refreshed.",
      });
    });
  };

  const handleRunAutomation = () => {
    system.runAutomationMutation.mutate(undefined, {
      onSuccess: (result) => {
        toast({
          title: "Hourly Automation Complete",
          description: `${result.adjustedCampaigns.length} campaigns optimized, ${result.alertsCreated} alerts raised.`,
        });
      },
    });
  };

  const handleAnalyze = () => {
    system.analyzeMarketingMutation.mutate(undefined, {
      onSuccess: (result) => {
        toast({
          title: "AI Analysis Complete",
          description: `${result.created} new optimization insights were generated.`,
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
                <Megaphone className="h-6 w-6 text-teal-400" />
                <div>
                  <h1 className="text-lg font-bold text-slate-100">Marketing Manager</h1>
                  <p className="text-xs text-slate-400">DEMAND ENGINE</p>
                </div>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <Shield className="h-3 w-3 mr-1" />
                Secure Session
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-slate-700 bg-slate-800/70 text-slate-200"
                onClick={handleAnalyze}
                disabled={system.analyzeMarketingMutation.isPending}
              >
                AI Scan
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="h-8 border-teal-700 bg-teal-950/40 text-teal-300"
                onClick={handleRunAutomation}
                disabled={system.runAutomationMutation.isPending}
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
              { id: "create", label: "Create Campaign" },
              { id: "content", label: "Content" },
              { id: "reports", label: "Reports & Audit" },
            ].map((tab) => (
              <Button
                key={tab.id}
                size="sm"
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`h-7 text-xs ${
                  activeTab === tab.id 
                    ? "bg-teal-600 text-white" 
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
      <div className="px-6 py-2 bg-amber-500/10 border-b border-amber-500/20">
        <p className="text-xs text-amber-400 text-center">
          🔒 Security Active: Clipboard disabled • Screenshots blocked • Session time-limited • Approval and budget guardrails enforced
        </p>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {system.isLoading && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
              Loading live marketing operations...
            </div>
          )}

          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Row 1: Active Campaigns + Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MMActiveCampaigns system={system} />
                <MMCampaignPerformance system={system} />
              </div>

              {/* Row 2: Channel Breakdown + AI Optimization */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MMChannelBreakdown system={system} />
                <MMAIOptimization system={system} />
              </div>

              {/* Row 3: Compliance Status */}
              <MMComplianceStatus system={system} />
            </div>
          )}

          {activeTab === "create" && (
            <div className="max-w-2xl mx-auto">
              <MMCampaignCreator system={system} />
            </div>
          )}

          {activeTab === "content" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MMContentQueue system={system} />
              <MMAIOptimization system={system} />
            </div>
          )}

          {activeTab === "reports" && (
            <MMReportsAudit system={system} />
          )}
        </motion.div>
      </main>

      {/* Footer Security Notice */}
      <footer className="fixed bottom-0 left-0 right-0 px-6 py-2 bg-slate-900/95 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Marketing Manager • Demand Engine</span>
          <span>All actions logged • Immutable audit trail</span>
          <span>AI optimization live • Budget guard auto-enforced</span>
        </div>
      </footer>
    </div>
  );
};

export default SecureMarketingManagerDashboard;
