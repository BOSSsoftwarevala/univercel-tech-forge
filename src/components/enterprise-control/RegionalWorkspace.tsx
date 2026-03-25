import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Globe,
  Eye
} from "lucide-react";
import { useEnterpriseControl, ActionStatus } from "@/contexts/EnterpriseControlContext";
import { toast } from "@/hooks/use-toast";

const RegionalWorkspace = () => {
  const { 
    valaId, 
    isFrozen, 
    forwardAction,
    getActionsForRole 
  } = useEnterpriseControl();

  const roleActions = getActionsForRole("regional").filter(a => 
    a.forwardedTo === "regional" || a.role === "regional"
  );

  const getStatusBadge = (status: ActionStatus) => {
    const styles: Record<ActionStatus, string> = {
      pending: "bg-slate-500/20 text-slate-400",
      debug: "bg-blue-500/20 text-blue-400",
      check: "bg-cyan-500/20 text-cyan-400",
      locked: "bg-amber-500/20 text-amber-400",
      forwarded: "bg-emerald-500/20 text-emerald-400",
      blocked: "bg-red-500/20 text-red-400",
      frozen: "bg-red-500/20 text-red-400",
    };
    return <Badge className={styles[status]}>{status.toUpperCase()}</Badge>;
  };

  const handleReview = (actionId: string) => {
    toast({ title: "Reviewing", description: `Reviewing action ${actionId}...` });
  };

  const handleForward = async (actionId: string) => {
    await forwardAction(actionId);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100">REGIONAL CONTROL</h2>
            <p className="text-xs text-slate-400 font-mono">VALA ID: {valaId}</p>
          </div>
          <Badge className="bg-blue-500/20 text-blue-400">
            <Globe className="h-3 w-3 mr-1" />
            AREA / REGIONAL
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
        {/* Info Banner */}
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-xs text-blue-400">
            📋 Review and approve actions forwarded from Operation level.
            All approvals move UPWARD only. No backward access.
          </p>
        </div>

        {/* Incoming Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-300">INCOMING ACTIONS</h3>
          
          {roleActions.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-800/30 rounded-lg border border-slate-700/50">
              No actions pending review.
            </div>
          ) : (
            roleActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 space-y-3"
              >
                {/* Action Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">{action.id}</span>
                    {getStatusBadge(action.status)}
                  </div>
                  <span className="text-xs text-slate-500">
                    From: {action.role.toUpperCase()}
                  </span>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-2">
                  {["pending", "debug", "check", "locked", "forwarded"].map((step, i) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        ["pending", "debug", "check", "locked", "forwarded"].indexOf(action.status) >= i
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                          : "bg-slate-800 text-slate-500 border border-slate-700"
                      }`}>
                        {i + 1}
                      </div>
                      {i < 4 && (
                        <ArrowRight className={`h-4 w-4 mx-1 ${
                          ["pending", "debug", "check", "locked", "forwarded"].indexOf(action.status) > i
                            ? "text-blue-400"
                            : "text-slate-600"
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Masked Data */}
                <div className="p-2 rounded bg-slate-900/50 font-mono text-xs text-slate-300">
                  <p><strong>Type:</strong> {action.actionType}</p>
                  <p><strong>Checksum:</strong> {action.checksum}</p>
                  <p><strong>Origin:</strong> {action.valaId.substring(0, 4)}****</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleReview(action.id)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    REVIEW
                  </Button>
                  {action.status === "forwarded" && action.forwardedTo === "regional" && (
                    <Button
                      onClick={() => handleForward(action.id)}
                      className="flex-1 bg-purple-600 hover:bg-purple-500"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      FORWARD TO AI HEAD
                    </Button>
                  )}
                </div>

                {action.forwardedTo === "ai_head" && (
                  <div className="flex items-center justify-center gap-2 text-purple-400 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    Forwarded to AI HEAD
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

export default RegionalWorkspace;
