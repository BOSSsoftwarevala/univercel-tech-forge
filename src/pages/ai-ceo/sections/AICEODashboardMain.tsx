import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShieldAlert,
  Brain,
  Eye,
  Zap
} from "lucide-react";

// Mock data for dashboard widgets
const systemHealthMetrics = [
  { label: "API Uptime", value: 99.97, status: "healthy" },
  { label: "Database", value: 99.89, status: "healthy" },
  { label: "Edge Functions", value: 98.5, status: "warning" },
  { label: "Auth Services", value: 100, status: "healthy" },
];

const activeRisks = [
  { id: 1, title: "High withdrawal request from Franchise #234", level: "high", time: "2m ago" },
  { id: 2, title: "Unusual login pattern detected", level: "medium", time: "8m ago" },
  { id: 3, title: "SLA breach approaching for Region APAC", level: "medium", time: "15m ago" },
];

const pendingDecisions = [
  { id: 1, action: "Approve bulk user creation", requestedBy: "Admin #12", confidence: 87 },
  { id: 2, action: "Release franchise payment", requestedBy: "Finance Team", confidence: 92 },
  { id: 3, action: "Enable new region access", requestedBy: "Country Head", confidence: 78 },
];

const topPerformers = [
  { name: "Franchise #101", metric: "Sales", value: "+34%", trend: "up" },
  { name: "Region: Europe", metric: "SLA", value: "99.8%", trend: "up" },
  { name: "Support Team A", metric: "Resolution", value: "4.2h avg", trend: "up" },
];

const underperforming = [
  { name: "Franchise #445", metric: "Leads", value: "-12%", issue: "Low conversion" },
  { name: "Region: LATAM", metric: "Uptime", value: "97.2%", issue: "Server issues" },
];

const AICEODashboardMain = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center shadow-xl shadow-cyan-500/20">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI CEO Dashboard</h1>
            <p className="text-cyan-400/80">Autonomous Observer • Real-time Analysis</p>
          </div>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-2">
          <Eye className="w-4 h-4 mr-2" />
          OBSERVING ALL SYSTEMS
        </Badge>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active Risks", value: "3", icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10" },
          { label: "Pending Decisions", value: "12", icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Today's Actions", value: "847", icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "AI Confidence", value: "94%", icon: Zap, color: "text-violet-400", bg: "bg-violet-500/10" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Live System Health */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Live System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemHealthMetrics.map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{metric.value}%</span>
                    <div className={`w-2 h-2 rounded-full ${
                      metric.status === 'healthy' ? 'bg-emerald-400' : 'bg-yellow-400'
                    }`} />
                  </div>
                </div>
                <Progress 
                  value={metric.value} 
                  className={`h-1.5 ${metric.status === 'healthy' ? 'bg-emerald-500/20' : 'bg-yellow-500/20'}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Risks */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-orange-400" />
              Active Risks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-3">
                {activeRisks.map((risk) => (
                  <div 
                    key={risk.id} 
                    className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:border-orange-500/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-white">{risk.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{risk.time}</p>
                      </div>
                      <Badge className={
                        risk.level === 'high' 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }>
                        {risk.level}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Pending Decisions */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Pending Decisions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-3">
                {pendingDecisions.map((decision) => (
                  <div 
                    key={decision.id} 
                    className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:border-blue-500/30 transition-colors"
                  >
                    <p className="text-sm text-white">{decision.action}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-slate-500">By: {decision.requestedBy}</p>
                      <Badge className="bg-cyan-500/20 text-cyan-400">
                        {decision.confidence}% confident
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.map((performer, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{performer.name}</p>
                    <p className="text-xs text-slate-400">{performer.metric}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-medium">{performer.value}</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Underperforming Areas */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-400" />
              Underperforming Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {underperforming.map((item, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/20"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.issue}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 font-medium">{item.value}</span>
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Observer Notice */}
      <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-cyan-400" />
          <p className="text-sm text-cyan-400/80">
            <strong>AI CEO Notice:</strong> All observations are read-only. Recommendations require Boss/CEO approval for execution.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICEODashboardMain;
