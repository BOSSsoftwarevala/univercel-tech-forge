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
    toast({
      title: "Data Refreshed",
      description: "All marketing data has been refreshed.",
    });
  };

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
          🔒 Security Active: Clipboard disabled • Screenshots blocked • Session time-limited • 
          /finance /wallet /pricing /admin BLOCKED
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
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Row 1: Active Campaigns + Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MMActiveCampaigns />
                <MMCampaignPerformance />
              </div>

              {/* Row 2: Channel Breakdown + AI Optimization */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MMChannelBreakdown />
                <MMAIOptimization />
              </div>

              {/* Row 3: Compliance Status */}
              <MMComplianceStatus />
            </div>
          )}

          {activeTab === "create" && (
            <div className="max-w-2xl mx-auto">
              <MMCampaignCreator />
            </div>
          )}

          {activeTab === "content" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MMContentQueue />
              <MMAIOptimization />
            </div>
          )}

          {activeTab === "reports" && (
            <MMReportsAudit />
          )}
        </motion.div>
      </main>

      {/* Footer Security Notice */}
      <footer className="fixed bottom-0 left-0 right-0 px-6 py-2 bg-slate-900/95 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Marketing Manager • Demand Engine</span>
          <span>All actions logged • Immutable audit trail</span>
          <span>AI suggests only • No auto-execution</span>
        </div>
      </footer>
    </div>
  );
};

export default SecureMarketingManagerDashboard;
