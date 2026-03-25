import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Zap,
  Skull,
  Bot,
  Lock,
  Play,
  FileWarning,
  AlertTriangle,
  Shield,
  Clock,
  CheckCircle
} from "lucide-react";

interface AAMEmergencyControlsProps {
  activeSubSection: string;
}

const AAMEmergencyControls = ({ activeSubSection }: AAMEmergencyControlsProps) => {
  const handleAction = (action: string) => {
    toast.success(`${action} executed successfully`);
  };

  const handleEmergencyAction = (action: string) => {
    toast.warning(`Emergency Action: ${action} - Confirm in modal`);
  };

  const emergencyActions = [
    {
      id: "kill-all",
      name: "Kill All APIs",
      description: "Immediately stop all API services",
      icon: <Skull className="w-8 h-8" />,
      color: "from-red-600 to-red-700",
      borderColor: "border-red-500/50",
      severity: "critical"
    },
    {
      id: "kill-ai",
      name: "Kill AI APIs Only",
      description: "Stop all AI-related APIs only",
      icon: <Bot className="w-8 h-8" />,
      color: "from-orange-500 to-red-500",
      borderColor: "border-orange-500/50",
      severity: "high"
    },
    {
      id: "lock-wallet",
      name: "Lock Wallet",
      description: "Freeze all wallet transactions",
      icon: <Lock className="w-8 h-8" />,
      color: "from-yellow-500 to-orange-500",
      borderColor: "border-yellow-500/50",
      severity: "high"
    },
    {
      id: "resume",
      name: "Resume System",
      description: "Restore normal API operations",
      icon: <Play className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500",
      borderColor: "border-green-500/50",
      severity: "normal"
    },
  ];

  const recentIncidents = [
    {
      id: "INC001",
      type: "Kill All APIs",
      triggeredBy: "admin@example.com",
      reason: "Cost spike detected - Monthly budget exceeded",
      time: "3 days ago",
      duration: "45 minutes",
      status: "resolved"
    },
    {
      id: "INC002",
      type: "Lock Wallet",
      triggeredBy: "finance@example.com",
      reason: "Suspicious transaction pattern",
      time: "1 week ago",
      duration: "2 hours",
      status: "resolved"
    },
    {
      id: "INC003",
      type: "Kill AI APIs",
      triggeredBy: "system",
      reason: "OpenAI rate limit exceeded",
      time: "2 weeks ago",
      duration: "15 minutes",
      status: "resolved"
    },
  ];

  const systemStatus = {
    apiStatus: "operational",
    aiStatus: "operational",
    walletStatus: "unlocked",
    lastCheck: "30 seconds ago"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Emergency Controls</h1>
          <p className="text-slate-400 text-sm mt-1">Critical system controls for emergencies</p>
        </div>
        <Badge variant="outline" className="text-green-400 border-green-400/30">
          <CheckCircle className="w-3 h-3 mr-1" />
          System Operational
        </Badge>
      </div>

      {/* Warning Banner */}
      <Card className="bg-red-500/10 border-red-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-300">Warning: Emergency Controls</p>
              <p className="text-xs text-red-400/80">These actions will immediately affect all system operations. Use with extreme caution.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Current System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-slate-800/50 border border-white/5">
              <p className="text-xs text-slate-400 mb-1">All APIs</p>
              <Badge variant="outline" className="text-green-400 border-green-400/30">
                {systemStatus.apiStatus}
              </Badge>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-white/5">
              <p className="text-xs text-slate-400 mb-1">AI APIs</p>
              <Badge variant="outline" className="text-green-400 border-green-400/30">
                {systemStatus.aiStatus}
              </Badge>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-white/5">
              <p className="text-xs text-slate-400 mb-1">Wallet</p>
              <Badge variant="outline" className="text-green-400 border-green-400/30">
                {systemStatus.walletStatus}
              </Badge>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-white/5">
              <p className="text-xs text-slate-400 mb-1">Last Check</p>
              <p className="text-sm text-white">{systemStatus.lastCheck}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {emergencyActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`bg-slate-900/50 border-2 ${action.borderColor} hover:shadow-lg transition-all`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color}`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white">{action.name}</h3>
                      <Badge
                        variant="outline"
                        className={
                          action.severity === 'critical'
                            ? 'text-red-400 border-red-400/30'
                            : action.severity === 'high'
                            ? 'text-orange-400 border-orange-400/30'
                            : 'text-green-400 border-green-400/30'
                        }
                      >
                        {action.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">{action.description}</p>
                    <Button
                      className={`w-full bg-gradient-to-r ${action.color} hover:opacity-90`}
                      onClick={() => handleEmergencyAction(action.name)}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Execute {action.name}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Incident Report */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <FileWarning className="w-5 h-5 text-yellow-400" />
              Recent Incidents
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-400 hover:text-purple-300"
              onClick={() => handleAction("Create Incident Report")}
            >
              <FileWarning className="w-4 h-4 mr-2" />
              New Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentIncidents.map((incident) => (
              <div
                key={incident.id}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-yellow-500/20">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{incident.type}</p>
                      <Badge variant="outline" className="text-green-400 border-green-400/30">
                        {incident.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{incident.reason}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span>By: {incident.triggeredBy}</span>
                      <span>•</span>
                      <span>Duration: {incident.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-400">{incident.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AAMEmergencyControls;
