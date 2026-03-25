import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain,
  AlertTriangle,
  ArrowUp,
  Eye,
  Shield,
  Activity
} from "lucide-react";
import { useEnterpriseControl, ActionStatus, AIReport } from "@/contexts/EnterpriseControlContext";
import { toast } from "@/hooks/use-toast";

const AIHeadWorkspace = () => {
  const { 
    valaId, 
    isFrozen, 
    aiReports,
    getActionsForRole 
  } = useEnterpriseControl();

  const roleActions = getActionsForRole("ai_head").filter(a => 
    a.forwardedTo === "ai_head" || a.role === "ai_head"
  );

  const getRiskColor = (risk: AIReport["riskFlag"]) => {
    switch (risk) {
      case "low": return "bg-emerald-500/20 text-emerald-400";
      case "medium": return "bg-amber-500/20 text-amber-400";
      case "high": return "bg-red-500/20 text-red-400";
      case "critical": return "bg-red-600/30 text-red-300";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const handleForwardReport = (reportId: string) => {
    toast({ title: "Report Forwarded", description: "Behavior report sent to Master Admin." });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100">AI HEAD WORKSPACE</h2>
            <p className="text-xs text-slate-400 font-mono">VALA ID: {valaId}</p>
          </div>
          <Badge className="bg-pink-500/20 text-pink-400">
            <Brain className="h-3 w-3 mr-1" />
            AI HEAD
          </Badge>
        </div>
      </div>

      {/* Frozen Overlay */}
      {isFrozen && (
        <div className="absolute inset-0 bg-red-950/90 z-50 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-400">SESSION FROZEN</h2>
            <p className="text-sm text-red-300 mt-2">Contact Master Admin for unfreezing.</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* AI Rules Banner */}
        <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-pink-400 mt-0.5" />
            <div>
              <p className="text-xs text-pink-400 font-medium">AI HEAD RULES</p>
              <p className="text-xs text-pink-400/70 mt-1">
                • AI observes silently • Cannot execute, approve, or edit
                • Generates behavior score & risk flag • Submits report upward ONLY
              </p>
            </div>
          </div>
        </div>

        {/* Behavior Reports */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            BEHAVIOR & RISK REPORTS
          </h3>
          
          {aiReports.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-800/30 rounded-lg border border-slate-700/50">
              No behavior reports generated yet.
            </div>
          ) : (
            aiReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 space-y-4"
              >
                {/* Report Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">{report.id}</span>
                    <Badge className={getRiskColor(report.riskFlag)}>
                      RISK: {report.riskFlag.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(report.timestamp).toLocaleString()}
                  </span>
                </div>

                {/* Behavior Score */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 mb-1">BEHAVIOR SCORE</p>
                    <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          report.behaviorScore >= 80 ? "bg-emerald-500" :
                          report.behaviorScore >= 60 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${report.behaviorScore}%` }}
                      />
                    </div>
                  </div>
                  <span className={`text-2xl font-bold ${
                    report.behaviorScore >= 80 ? "text-emerald-400" :
                    report.behaviorScore >= 60 ? "text-amber-400" : "text-red-400"
                  }`}>
                    {report.behaviorScore}
                  </span>
                </div>

                {/* Target Info */}
                <div className="p-2 rounded bg-slate-900/50 font-mono text-xs text-slate-300">
                  <p><strong>Target VALA:</strong> {report.targetValaId.substring(0, 6)}****</p>
                  <p><strong>Target Role:</strong> {report.targetRole.toUpperCase()}</p>
                </div>

                {/* Observations */}
                <div className="space-y-1">
                  <p className="text-xs text-slate-400">OBSERVATIONS</p>
                  <ul className="space-y-1">
                    {report.observations.map((obs, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                        <Eye className="h-3 w-3 text-slate-500" />
                        {obs}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Forward to Master */}
                {!report.forwardedToMaster && (
                  <Button
                    onClick={() => handleForwardReport(report.id)}
                    className="w-full bg-purple-600 hover:bg-purple-500"
                  >
                    <ArrowUp className="h-4 w-4 mr-2" />
                    FORWARD REPORT TO MASTER ADMIN
                  </Button>
                )}

                {report.forwardedToMaster && (
                  <div className="flex items-center justify-center gap-2 text-purple-400 text-sm">
                    <ArrowUp className="h-4 w-4" />
                    Report forwarded to Master Admin
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AIHeadWorkspace;
