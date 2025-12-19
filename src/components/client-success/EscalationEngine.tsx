import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  ArrowUp, 
  User, 
  Code, 
  HeadphonesIcon, 
  BarChart3,
  Shield,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const escalations = [
  {
    id: "1",
    client: "StartupX",
    trigger: "Repeated complaints",
    description: "3 complaints about delivery delay in the last week",
    priority: "high",
    escalatedTo: "Support",
    escalatedBy: "AI",
    timestamp: "30 min ago",
    status: "pending",
  },
  {
    id: "2",
    client: "GlobalRetail Inc",
    trigger: "Delayed developer task",
    description: "Task overdue by 48 hours, client waiting for feature",
    priority: "critical",
    escalatedTo: "Developer",
    escalatedBy: "vala(cs)2341",
    timestamp: "2 hours ago",
    status: "in_progress",
  },
  {
    id: "3",
    client: "TechCorp Solutions",
    trigger: "Billing concern",
    description: "Client questioning invoice discrepancy",
    priority: "medium",
    escalatedTo: "Performance Manager",
    escalatedBy: "AI",
    timestamp: "4 hours ago",
    status: "resolved",
  },
  {
    id: "4",
    client: "Enterprise Plus",
    trigger: "Feature confusion",
    description: "Client unable to use reporting module after training",
    priority: "low",
    escalatedTo: "Support",
    escalatedBy: "vala(cs)4556",
    timestamp: "1 day ago",
    status: "resolved",
  },
];

const escalationTargets = [
  { id: "support", label: "Support", icon: HeadphonesIcon, count: 5 },
  { id: "developer", label: "Developer", icon: Code, count: 3 },
  { id: "performance", label: "Performance Manager", icon: BarChart3, count: 2 },
  { id: "admin", label: "Super Admin", icon: Shield, count: 1 },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical": return "bg-rose-100 text-rose-700 border-rose-200";
    case "high": return "bg-orange-100 text-orange-700 border-orange-200";
    case "medium": return "bg-amber-100 text-amber-700 border-amber-200";
    case "low": return "bg-slate-100 text-slate-700 border-slate-200";
    default: return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "resolved": return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    case "in_progress": return <Clock className="w-4 h-4 text-amber-500" />;
    case "pending": return <AlertTriangle className="w-4 h-4 text-rose-500" />;
    default: return <Clock className="w-4 h-4 text-slate-500" />;
  }
};

export const EscalationEngine = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Escalation Engine</h2>
        <p className="text-slate-500 text-sm mt-1">Automated issue escalation based on trigger rules</p>
      </div>

      {/* Escalation Targets Summary */}
      <div className="grid grid-cols-4 gap-4">
        {escalationTargets.map((target, index) => {
          const Icon = target.icon;
          return (
            <motion.div
              key={target.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-teal-50 to-amber-50 group-hover:from-teal-100 group-hover:to-amber-100 transition-all">
                    <Icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <span className="text-2xl font-bold text-teal-600">{target.count}</span>
                </div>
                <p className="text-sm text-slate-600">{target.label}</p>
                <p className="text-xs text-slate-400">Active escalations</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Trigger Rules */}
      <Card className="p-5 bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
        <h3 className="font-semibold text-slate-700 mb-4">Active Trigger Rules</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { trigger: "Repeated complaints (3+)", target: "Support", active: true },
            { trigger: "Delayed developer task (24h+)", target: "Developer", active: true },
            { trigger: "Billing concern raised", target: "Performance Manager", active: true },
            { trigger: "Feature confusion reported", target: "Support", active: true },
            { trigger: "Critical issue unresolved (48h+)", target: "Super Admin", active: true },
            { trigger: "Churn risk detected", target: "Client Success Lead", active: true },
          ].map((rule, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${rule.active ? "bg-emerald-500" : "bg-slate-300"}`} />
                <span className="text-sm text-slate-700">{rule.trigger}</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUp className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-teal-600 font-medium">{rule.target}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Escalation History */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-700">Recent Escalations</h3>
        {escalations.map((escalation, index) => (
          <motion.div
            key={escalation.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`p-4 bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg ${
              escalation.priority === "critical" ? "border-l-4 border-l-rose-500" :
              escalation.priority === "high" ? "border-l-4 border-l-orange-500" : ""
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-slate-100">
                    {getStatusIcon(escalation.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-slate-800">{escalation.client}</span>
                      <Badge className={getPriorityColor(escalation.priority)}>
                        {escalation.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {escalation.trigger}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{escalation.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <ArrowUp className="w-3 h-3" />
                        Escalated to: <span className="text-teal-600 font-medium">{escalation.escalatedTo}</span>
                      </span>
                      <span>By: {escalation.escalatedBy}</span>
                      <span>{escalation.timestamp}</span>
                    </div>
                  </div>
                </div>

                {escalation.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white text-xs">
                      Take Action
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      Reassign
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
