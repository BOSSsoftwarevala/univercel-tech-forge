import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, CheckCircle, Timer, TrendingUp, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SLAItem {
  id: string;
  type: string;
  subject: string;
  targetHours: number;
  elapsedMinutes: number;
  status: "on_track" | "at_risk" | "breached" | "completed";
  assignee: string;
}

const SLATimerPanel = () => {
  const [slaItems, setSlaItems] = useState<SLAItem[]>([
    { id: "SLA-001", type: "Bug Fix", subject: "Payment Gateway Issue", targetHours: 2, elapsedMinutes: 45, status: "on_track", assignee: "Senior Dev" },
    { id: "SLA-002", type: "Feature", subject: "Dashboard Customization", targetHours: 4, elapsedMinutes: 180, status: "at_risk", assignee: "Expert Team" },
    { id: "SLA-003", type: "Support", subject: "API Documentation Query", targetHours: 1, elapsedMinutes: 65, status: "breached", assignee: "Tech Lead" },
    { id: "SLA-004", type: "Hosting", subject: "SSL Certificate Renewal", targetHours: 2, elapsedMinutes: 30, status: "completed", assignee: "DevOps" },
  ]);

  // Simulated real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSlaItems(prev => prev.map(item => ({
        ...item,
        elapsedMinutes: item.status !== "completed" ? item.elapsedMinutes + 1 : item.elapsedMinutes
      })));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "on_track":
        return { color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30", icon: CheckCircle, label: "On Track" };
      case "at_risk":
        return { color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30", icon: AlertTriangle, label: "At Risk" };
      case "breached":
        return { color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30", icon: AlertTriangle, label: "SLA Breached" };
      case "completed":
        return { color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30", icon: CheckCircle, label: "Completed" };
      default:
        return { color: "text-stone-400", bg: "bg-stone-500/20", border: "border-stone-500/30", icon: Clock, label: "Unknown" };
    }
  };

  const formatTimeRemaining = (item: SLAItem) => {
    const targetMinutes = item.targetHours * 60;
    const remaining = targetMinutes - item.elapsedMinutes;
    if (remaining <= 0) return "Overdue";
    const hours = Math.floor(remaining / 60);
    const mins = remaining % 60;
    return `${hours}h ${mins}m`;
  };

  const getProgress = (item: SLAItem) => {
    const targetMinutes = item.targetHours * 60;
    return Math.min((item.elapsedMinutes / targetMinutes) * 100, 100);
  };

  const stats = {
    total: slaItems.length,
    onTrack: slaItems.filter(i => i.status === "on_track").length,
    atRisk: slaItems.filter(i => i.status === "at_risk").length,
    breached: slaItems.filter(i => i.status === "breached").length,
    complianceRate: Math.round((slaItems.filter(i => i.status !== "breached").length / slaItems.length) * 100)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-amber-100">SLA Monitoring</h2>
          <p className="text-stone-400">Real-time SLA countdown with 2-hour guarantee</p>
        </div>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30"
        >
          <Award className="w-5 h-5 text-amber-400" />
          <span className="text-amber-300 font-semibold">{stats.complianceRate}% SLA Compliance</span>
        </motion.div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-stone-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <Timer className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">{stats.total}</div>
            <div className="text-sm text-stone-400">Active SLAs</div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">{stats.onTrack}</div>
            <div className="text-sm text-stone-400">On Track</div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">{stats.atRisk}</div>
            <div className="text-sm text-stone-400">At Risk</div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-red-500/20">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-100">{stats.breached}</div>
            <div className="text-sm text-stone-400">Breached</div>
          </CardContent>
        </Card>
      </div>

      {/* SLA Items */}
      <div className="space-y-4">
        {slaItems.map((item, index) => {
          const config = getStatusConfig(item.status);
          const StatusIcon = config.icon;
          const progress = getProgress(item);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-stone-900/50 ${config.border} hover:shadow-lg transition-all`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge className={`${config.bg} ${config.color} border ${config.border}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                      <span className="text-amber-400 font-mono text-sm">{item.id}</span>
                      <Badge variant="outline" className="border-stone-600 text-stone-400">{item.type}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${config.color}`} />
                      <span className={`font-bold ${config.color}`}>{formatTimeRemaining(item)}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-amber-100 mb-2">{item.subject}</h3>
                  
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-stone-400">Assigned: <span className="text-amber-300">{item.assignee}</span></span>
                    <span className="text-stone-500">Target: {item.targetHours}h | Elapsed: {Math.floor(item.elapsedMinutes / 60)}h {item.elapsedMinutes % 60}m</span>
                  </div>

                  <div className="relative">
                    <Progress 
                      value={progress} 
                      className={`h-3 bg-stone-800 ${
                        item.status === "breached" ? "[&>div]:bg-red-500" :
                        item.status === "at_risk" ? "[&>div]:bg-amber-500" :
                        "[&>div]:bg-emerald-500"
                      }`}
                    />
                    {item.status === "breached" && (
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <span className="text-xs text-red-400 font-medium">COMPENSATION ELIGIBLE</span>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Compensation Notice */}
      <Card className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 border-amber-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-amber-400" />
            <div>
              <h4 className="text-amber-200 font-medium">SLA Guarantee Active</h4>
              <p className="text-sm text-stone-400">If any SLA is breached, compensation will be automatically credited to your wallet</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SLATimerPanel;
