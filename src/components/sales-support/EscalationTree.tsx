import { motion } from "framer-motion";
import { AlertCircle, ArrowUp, Clock, User, Users, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const EscalationTree = () => {
  const escalationLevels = [
    { level: 1, name: "Sales Support", handler: "You", responseTime: "15 min", icon: User, color: "cyan" },
    { level: 2, name: "Franchise Manager", handler: "Regional Lead", responseTime: "30 min", icon: Users, color: "amber" },
    { level: 3, name: "Super Admin", handler: "HQ Team", responseTime: "1 hour", icon: Shield, color: "red" },
  ];

  const activeEscalations = [
    { id: "ESC-001", issue: "Pricing dispute - Tech Solutions", level: 2, status: "active", timeRemaining: "18 min", auto: false },
    { id: "ESC-002", issue: "Contract review needed - HealthCare Plus", level: 1, status: "pending", timeRemaining: "8 min", auto: true },
    { id: "ESC-003", issue: "Technical integration issue", level: 3, status: "resolved", timeRemaining: "-", auto: false },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return "bg-amber-500/20 text-amber-300";
      case "pending": return "bg-blue-500/20 text-blue-300";
      case "resolved": return "bg-emerald-500/20 text-emerald-300";
      default: return "bg-slate-500/20 text-slate-300";
    }
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      case 2: return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case 3: return "bg-red-500/20 text-red-300 border-red-500/30";
      default: return "bg-slate-500/20 text-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-100">Escalation Tree</h2>
          <p className="text-slate-400">Multi-level support escalation with auto-timers</p>
        </div>
        <Button className="bg-gradient-to-r from-red-500 to-amber-500 text-white">
          <ArrowUp className="w-4 h-4 mr-2" />
          Escalate Issue
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {escalationLevels.map((level, index) => {
          const Icon = level.icon;
          return (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-slate-900/50 border-${level.color}-500/30 relative overflow-hidden`}>
                <div className={`absolute top-0 left-0 w-1 h-full bg-${level.color}-500`} />
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={`bg-${level.color}-500/20 text-${level.color}-300`}>Level {level.level}</Badge>
                    <Clock className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg bg-${level.color}-500/20 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${level.color}-400`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-100">{level.name}</h3>
                      <p className="text-xs text-slate-400">{level.handler}</p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-400">
                    Response Time: <span className={`text-${level.color}-400`}>{level.responseTime}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-100 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-cyan-400" />
            Active Escalations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeEscalations.map((escalation, index) => (
              <motion.div
                key={escalation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-cyan-400 text-sm">{escalation.id}</span>
                    <Badge className={getLevelColor(escalation.level)}>Level {escalation.level}</Badge>
                    <Badge className={getStatusBadge(escalation.status)}>{escalation.status}</Badge>
                    {escalation.auto && (
                      <Badge className="bg-purple-500/20 text-purple-300">Auto-Escalated</Badge>
                    )}
                  </div>
                  {escalation.status !== "resolved" && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-300">{escalation.timeRemaining}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-slate-200 mb-3">{escalation.issue}</p>
                
                {escalation.status !== "resolved" && (
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <Progress value={escalation.status === "active" ? 60 : 80} className="h-2 bg-slate-700" />
                    </div>
                    <div className="flex gap-2">
                      {escalation.level < 3 && (
                        <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-300">
                          <ArrowUp className="w-3 h-3 mr-1" />
                          Escalate
                        </Button>
                      )}
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Resolve
                      </Button>
                    </div>
                  </div>
                )}
                
                {escalation.status === "resolved" && (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Resolved successfully</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-amber-900/30 to-red-900/30 border-amber-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="font-medium text-amber-100">Auto-Escalation Rules</h3>
              <p className="text-sm text-slate-400">Issues unresolved after 15 minutes will automatically escalate to the next level</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EscalationTree;
