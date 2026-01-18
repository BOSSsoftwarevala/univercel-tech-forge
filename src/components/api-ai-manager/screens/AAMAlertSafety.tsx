import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertTriangle,
  Wallet,
  Activity,
  TrendingUp,
  AlertCircle,
  Shield,
  Bell,
  CheckCircle,
  XCircle,
  Eye,
  Settings
} from "lucide-react";

interface AAMAlertSafetyProps {
  activeSubSection: string;
}

const AAMAlertSafety = ({ activeSubSection }: AAMAlertSafetyProps) => {
  const handleAction = (action: string) => {
    toast.success(`${action} executed successfully`);
  };

  const alertTypes = [
    {
      type: "Low Wallet Balance",
      icon: <Wallet className="w-5 h-5" />,
      color: "from-yellow-500 to-orange-500",
      threshold: "₹5,000",
      status: "active",
      lastTriggered: "2 hours ago",
      count: 3
    },
    {
      type: "API Overuse",
      icon: <Activity className="w-5 h-5" />,
      color: "from-red-500 to-pink-500",
      threshold: "85% of limit",
      status: "active",
      lastTriggered: "5 min ago",
      count: 12
    },
    {
      type: "Cost Spike",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "from-orange-500 to-red-500",
      threshold: "50% increase",
      status: "active",
      lastTriggered: "1 day ago",
      count: 2
    },
    {
      type: "Abnormal Usage",
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "from-purple-500 to-indigo-500",
      threshold: "3x normal",
      status: "active",
      lastTriggered: "3 days ago",
      count: 1
    },
    {
      type: "API Failure",
      icon: <AlertCircle className="w-5 h-5" />,
      color: "from-red-500 to-rose-500",
      threshold: ">10 failures/min",
      status: "active",
      lastTriggered: "12 min ago",
      count: 5
    },
    {
      type: "Security Breach",
      icon: <Shield className="w-5 h-5" />,
      color: "from-red-600 to-red-700",
      threshold: "Any attempt",
      status: "active",
      lastTriggered: "Never",
      count: 0
    },
  ];

  const activeAlerts = [
    {
      id: "ALT001",
      type: "API Overuse",
      severity: "high",
      message: "OpenAI GPT-4 has reached 85% of daily limit",
      time: "5 min ago",
      resolved: false
    },
    {
      id: "ALT002",
      type: "Low Wallet",
      severity: "medium",
      message: "Wallet balance below ₹5,000 threshold",
      time: "2 hours ago",
      resolved: false
    },
    {
      id: "ALT003",
      type: "API Failure",
      severity: "high",
      message: "SMS API experiencing high failure rate (1.2%)",
      time: "12 min ago",
      resolved: false
    },
    {
      id: "ALT004",
      type: "Cost Spike",
      severity: "low",
      message: "WhatsApp API cost increased by 25% today",
      time: "1 hour ago",
      resolved: true
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Alert & Safety System</h1>
          <p className="text-slate-400 text-sm mt-1">Monitor and manage all system alerts</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction("Configure Alerts")}
            className="border-white/20 text-slate-300 hover:bg-white/10"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
          <Button
            size="sm"
            onClick={() => handleAction("Clear All Resolved")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Clear Resolved
          </Button>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alertTypes.map((alert, index) => (
          <motion.div
            key={alert.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-slate-900/50 border-white/10 hover:border-purple-500/30 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${alert.color}`}>
                    {alert.icon}
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      alert.status === 'active'
                        ? 'text-green-400 border-green-400/30'
                        : 'text-slate-400 border-slate-400/30'
                    }
                  >
                    {alert.status}
                  </Badge>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium text-white">{alert.type}</p>
                  <p className="text-xs text-slate-400 mt-1">Threshold: {alert.threshold}</p>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <div>
                    <p className="text-xs text-slate-500">Last triggered</p>
                    <p className="text-xs text-slate-300">{alert.lastTriggered}</p>
                  </div>
                  <Badge variant="outline" className="text-purple-400 border-purple-400/30">
                    {alert.count} alerts
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active Alerts */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-400" />
              Active Alerts
            </CardTitle>
            <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
              {activeAlerts.filter(a => !a.resolved).length} Unresolved
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  alert.resolved
                    ? 'bg-slate-800/30 border-slate-700/50 opacity-60'
                    : alert.severity === 'high'
                    ? 'bg-red-500/10 border-red-500/30'
                    : alert.severity === 'medium'
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-blue-500/10 border-blue-500/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    alert.resolved
                      ? 'bg-slate-700'
                      : alert.severity === 'high'
                      ? 'bg-red-500/20'
                      : alert.severity === 'medium'
                      ? 'bg-yellow-500/20'
                      : 'bg-blue-500/20'
                  }`}>
                    {alert.resolved ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertTriangle className={`w-4 h-4 ${
                        alert.severity === 'high'
                          ? 'text-red-400'
                          : alert.severity === 'medium'
                          ? 'text-yellow-400'
                          : 'text-blue-400'
                      }`} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{alert.message}</p>
                      <Badge
                        variant="outline"
                        className={
                          alert.severity === 'high'
                            ? 'text-red-400 border-red-400/30'
                            : alert.severity === 'medium'
                            ? 'text-yellow-400 border-yellow-400/30'
                            : 'text-blue-400 border-blue-400/30'
                        }
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{alert.type} • {alert.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-400 hover:text-white"
                    onClick={() => handleAction(`View ${alert.id}`)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {!alert.resolved && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-green-400 hover:text-green-300"
                      onClick={() => handleAction(`Resolve ${alert.id}`)}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleAction(`Dismiss ${alert.id}`)}
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AAMAlertSafety;
