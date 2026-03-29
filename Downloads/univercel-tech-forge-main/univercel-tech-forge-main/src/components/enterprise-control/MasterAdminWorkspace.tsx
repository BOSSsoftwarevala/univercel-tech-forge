import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield,
  AlertTriangle,
  Unlock,
  RotateCcw,
  Eye,
  Activity,
  Crown,
  Lock
} from "lucide-react";
import { useEnterpriseControl, AIReport } from "@/contexts/EnterpriseControlContext";
import { toast } from "@/hooks/use-toast";

const MasterAdminWorkspace = () => {
  const { 
    valaId, 
    isFrozen,
    freezeReason,
    actions,
    aiReports,
    unfreezeSession,
    overrideAction,
    getAIReportsForMaster
  } = useEnterpriseControl();

  const allReports = getAIReportsForMaster();
  const flaggedReports = allReports.filter(r => r.riskFlag === "high" || r.riskFlag === "critical");

  const getRiskColor = (risk: AIReport["riskFlag"]) => {
    switch (risk) {
      case "low": return "bg-emerald-500/20 text-emerald-400";
      case "medium": return "bg-amber-500/20 text-amber-400";
      case "high": return "bg-red-500/20 text-red-400";
      case "critical": return "bg-red-600/30 text-red-300 animate-pulse";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const handleUnfreeze = () => {
    unfreezeSession(valaId);
  };

  const handleOverride = (actionId: string) => {
    overrideAction(actionId, valaId);
    toast({ title: "Override Applied", description: `Action ${actionId} overridden.` });
  };

  const handleDrillDown = (reportId: string) => {
    toast({ title: "Drill Down", description: `Viewing detailed report ${reportId}` });
  };

  // Summary stats
  const totalActions = actions.length;
  const pendingActions = actions.filter(a => a.status !== "forwarded").length;
  const flaggedCount = flaggedReports.length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-400" />
              MASTER ADMIN CONTROL
            </h2>
            <p className="text-xs text-slate-400 font-mono">VALA ID: {valaId}</p>
          </div>
          <Badge className="bg-amber-500/20 text-amber-400">
            <Shield className="h-3 w-3 mr-1" />
            FINAL AUTHORITY
          </Badge>
        </div>
      </div>

      {/* Frozen Session Alert */}
      {isFrozen && (
        <div className="m-4 p-4 rounded-lg bg-red-500/20 border border-red-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              <div>
                <p className="text-sm font-medium text-red-400">SESSION FROZEN</p>
                <p className="text-xs text-red-300">{freezeReason}</p>
              </div>
            </div>
            <Button onClick={handleUnfreeze} className="bg-red-600 hover:bg-red-500">
              <Unlock className="h-4 w-4 mr-2" />
              UNFREEZE
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 text-center"
          >
            <p className="text-3xl font-bold text-slate-100">{totalActions}</p>
            <p className="text-xs text-slate-400">TOTAL ACTIONS</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center"
          >
            <p className="text-3xl font-bold text-amber-400">{pendingActions}</p>
            <p className="text-xs text-amber-400">PENDING</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-center"
          >
            <p className="text-3xl font-bold text-red-400">{flaggedCount}</p>
            <p className="text-xs text-red-400">AI FLAGS</p>
          </motion.div>
        </div>

        {/* AI Flagged Reports */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            AI FLAGGED REPORTS (Drill-Down Available)
          </h3>
          
          {flaggedReports.length === 0 ? (
            <div className="p-4 text-center text-emerald-400 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              No high-risk flags. System operating normally.
            </div>
          ) : (
            flaggedReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getRiskColor(report.riskFlag)}>
                      {report.riskFlag.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-slate-200">
                      VALA: {report.targetValaId.substring(0, 6)}****
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDrillDown(report.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    DRILL DOWN
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400">Behavior Score:</span>
                  <span className={`text-lg font-bold ${
                    report.behaviorScore >= 70 ? "text-amber-400" : "text-red-400"
                  }`}>
                    {report.behaviorScore}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Override Controls */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            OVERRIDE CONTROLS (Master Only)
          </h3>
          
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 space-y-3">
            <p className="text-xs text-slate-400">
              Override blocked or frozen actions. All overrides are logged immutably.
            </p>
            
            {actions.filter(a => a.status === "blocked" || a.status === "frozen").length === 0 ? (
              <div className="p-4 text-center text-slate-500 bg-slate-900/50 rounded">
                No actions require override.
              </div>
            ) : (
              actions.filter(a => a.status === "blocked" || a.status === "frozen").map(action => (
                <div key={action.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded">
                  <div>
                    <span className="text-sm text-slate-200 font-mono">{action.id}</span>
                    <Badge className="ml-2 bg-red-500/20 text-red-400">{action.status}</Badge>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleOverride(action.id)}
                    className="bg-amber-600 hover:bg-amber-500"
                  >
                    <Unlock className="h-3 w-3 mr-1" />
                    OVERRIDE
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Append-Only Ledger Info */}
        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-start gap-2">
          <Lock className="h-4 w-4 text-purple-400 mt-0.5" />
          <div>
            <p className="text-xs text-purple-400 font-medium">APPEND-ONLY LEDGER</p>
            <p className="text-xs text-purple-400/70">
              All actions logged with VALA ID, timestamp, and action hash.
              No delete. No edit. Immutable trail.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterAdminWorkspace;
