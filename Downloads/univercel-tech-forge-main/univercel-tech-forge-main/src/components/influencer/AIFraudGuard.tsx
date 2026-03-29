import { motion } from "framer-motion";
import { Shield, AlertTriangle, Bot, Globe, CheckCircle, XCircle, Activity, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const AIFraudGuard = () => {
  const fraudStats = {
    totalClicks: 35630,
    validClicks: 34890,
    blockedClicks: 740,
    fraudRate: 2.1,
    botAttempts: 156,
    repeatIPs: 89,
  };

  const recentAlerts = [
    { id: 1, type: "bot", description: "Bot activity detected from 45.33.xx.xx", severity: "high", time: "2 min ago", action: "Blocked" },
    { id: 2, type: "repeat", description: "Repeat IP clicking pattern", severity: "medium", time: "15 min ago", action: "Flagged" },
    { id: 3, type: "suspicious", description: "Unusual click velocity spike", severity: "low", time: "1 hour ago", action: "Monitored" },
    { id: 4, type: "bot", description: "Known bot signature detected", severity: "high", time: "2 hours ago", action: "Blocked" },
  ];

  const protectionMetrics = [
    { name: "Bot Detection", status: "active", accuracy: 99.2 },
    { name: "IP Filtering", status: "active", accuracy: 98.5 },
    { name: "Behavior Analysis", status: "active", accuracy: 97.8 },
    { name: "Click Velocity", status: "active", accuracy: 99.1 },
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-500/20 text-red-300 border-red-500/30";
      case "medium": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "low": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default: return "bg-slate-500/20 text-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-violet-100">AI Fraud Guard</h2>
          <p className="text-slate-400">Automated protection against fake clicks and bot activity</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <Shield className="w-3 h-3 mr-1" />
          Protection Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">{fraudStats.validClicks.toLocaleString()}</div>
            <div className="text-xs text-slate-400">Valid Clicks</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-red-500/20">
          <CardContent className="p-4 text-center">
            <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-100">{fraudStats.blockedClicks}</div>
            <div className="text-xs text-slate-400">Blocked</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <Bot className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">{fraudStats.botAttempts}</div>
            <div className="text-xs text-slate-400">Bot Attempts</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-violet-500/20">
          <CardContent className="p-4 text-center">
            <Globe className="w-8 h-8 text-violet-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-violet-100">{fraudStats.repeatIPs}</div>
            <div className="text-xs text-slate-400">Repeat IPs Filtered</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-violet-500/20">
          <CardHeader>
            <CardTitle className="text-violet-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-violet-400" />
              Recent Fraud Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {alert.type === "bot" && <Bot className="w-4 h-4 text-red-400" />}
                    {alert.type === "repeat" && <Globe className="w-4 h-4 text-amber-400" />}
                    {alert.type === "suspicious" && <Eye className="w-4 h-4 text-blue-400" />}
                    <Badge className={getSeverityBadge(alert.severity)}>{alert.severity}</Badge>
                  </div>
                  <Badge className={alert.action === "Blocked" ? "bg-red-500/20 text-red-300" : "bg-amber-500/20 text-amber-300"}>
                    {alert.action}
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm">{alert.description}</p>
                <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-violet-500/20">
          <CardHeader>
            <CardTitle className="text-violet-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-violet-400" />
              Protection Systems
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {protectionMetrics.map((metric, index) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-slate-200 font-medium">{metric.name}</span>
                  </div>
                  <span className="text-emerald-400 text-sm">{metric.accuracy}% accuracy</span>
                </div>
                <Progress value={metric.accuracy} className="h-1.5 bg-slate-700" />
              </motion.div>
            ))}

            <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-violet-500/10 border border-emerald-500/20 rounded-lg mt-4">
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-emerald-400" />
                <div>
                  <div className="font-medium text-emerald-300">Fraud Rate: {fraudStats.fraudRate}%</div>
                  <div className="text-xs text-slate-400">Industry average: 8-12%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIFraudGuard;
