import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  RefreshCw,
  Calendar,
  Clock,
  Award,
  Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const clientMetrics = {
  totalClients: 256,
  activeClients: 234,
  churnRisk: 8,
  expansionReady: 23,
  avgHealthScore: 78,
  totalARR: "$4.2M",
  nps: 72,
  csatScore: 4.6
};

const topClients = [
  { name: "TechCorp Industries", arr: "$450K", health: 95, trend: "up", expansion: true },
  { name: "GlobalRetail Inc", arr: "$380K", health: 88, trend: "up", expansion: true },
  { name: "StartupX", arr: "$120K", health: 72, trend: "down", expansion: false },
  { name: "Enterprise Solutions", arr: "$290K", health: 91, trend: "stable", expansion: true },
  { name: "SmallBiz Corp", arr: "$85K", health: 65, trend: "down", expansion: false }
];

const recentActivities = [
  { type: "renewal", client: "TechCorp", action: "Auto-renewed for 2 years", time: "2 hours ago", icon: RefreshCw },
  { type: "upsell", client: "GlobalRetail", action: "Upgraded to Enterprise plan", time: "5 hours ago", icon: TrendingUp },
  { type: "risk", client: "StartupX", action: "Flagged for churn review", time: "1 day ago", icon: AlertTriangle },
  { type: "success", client: "Enterprise Solutions", action: "Completed onboarding", time: "2 days ago", icon: CheckCircle },
];

const aiInsights = [
  { insight: "3 clients showing early churn signals - recommend proactive outreach", priority: "high" },
  { insight: "Enterprise Solutions ready for expansion conversation based on usage patterns", priority: "medium" },
  { insight: "Q4 renewals pipeline looks strong with 92% projected retention", priority: "low" },
  { insight: "NPS improved 8 points after new onboarding process implementation", priority: "info" }
];

export const ClientInsights = () => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-teal-600" />
            Client Intelligence Dashboard
          </h2>
          <p className="text-slate-500 text-sm mt-1">AI-powered insights and analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-slate-600">
            <Clock className="w-3 h-3 mr-1" />
            Last updated: 5 min ago
          </Badge>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Clients", value: clientMetrics.totalClients, icon: Users, color: "teal", change: "+12 this month" },
          { label: "Total ARR", value: clientMetrics.totalARR, icon: DollarSign, color: "emerald", change: "+18% YoY" },
          { label: "Avg Health Score", value: `${clientMetrics.avgHealthScore}%`, icon: Target, color: "blue", change: "+5 pts" },
          { label: "NPS Score", value: clientMetrics.nps, icon: Award, color: "violet", change: "+8 pts" }
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-4 bg-white/80 backdrop-blur-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{metric.label}</p>
                  <p className={`text-2xl font-bold text-${metric.color}-600 mt-1`}>{metric.value}</p>
                  <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    {metric.change}
                  </p>
                </div>
                <div className={`p-2 rounded-lg bg-${metric.color}-100`}>
                  <metric.icon className={`w-5 h-5 text-${metric.color}-600`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active Clients", value: clientMetrics.activeClients, total: clientMetrics.totalClients, color: "teal" },
          { label: "Churn Risk", value: clientMetrics.churnRisk, total: clientMetrics.totalClients, color: "rose" },
          { label: "Expansion Ready", value: clientMetrics.expansionReady, total: clientMetrics.totalClients, color: "violet" },
          { label: "CSAT Score", value: clientMetrics.csatScore, total: 5, color: "amber" }
        ].map((stat, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">{stat.label}</span>
              <span className={`font-bold text-${stat.color}-600`}>{stat.value}</span>
            </div>
            <Progress value={(stat.value / stat.total) * 100} className="h-2" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Top Clients */}
        <div className="col-span-7">
          <Card className="p-4">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-teal-600" />
              Top Clients by ARR
            </h3>
            <div className="space-y-3">
              {topClients.map((client, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-amber-700' : 'bg-slate-300'
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{client.name}</p>
                      <p className="text-sm text-slate-500">ARR: {client.arr}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">Health: {client.health}%</p>
                      <div className="flex items-center gap-1 text-xs">
                        {client.trend === 'up' && <ArrowUpRight className="w-3 h-3 text-emerald-500" />}
                        {client.trend === 'down' && <ArrowDownRight className="w-3 h-3 text-rose-500" />}
                        <span className={client.trend === 'up' ? 'text-emerald-600' : client.trend === 'down' ? 'text-rose-600' : 'text-slate-500'}>
                          {client.trend}
                        </span>
                      </div>
                    </div>
                    {client.expansion && (
                      <Badge className="bg-violet-100 text-violet-700">Expansion</Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="col-span-5 space-y-4">
          {/* AI Insights */}
          <Card className="p-4 bg-gradient-to-br from-teal-50 to-amber-50 border-teal-200/50">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              AI-Powered Insights
            </h3>
            <div className="space-y-3">
              {aiInsights.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-3 rounded-lg border ${
                    item.priority === 'high' ? 'bg-rose-50 border-rose-200' :
                    item.priority === 'medium' ? 'bg-amber-50 border-amber-200' :
                    item.priority === 'low' ? 'bg-emerald-50 border-emerald-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Zap className={`w-4 h-4 mt-0.5 ${
                      item.priority === 'high' ? 'text-rose-500' :
                      item.priority === 'medium' ? 'text-amber-500' :
                      item.priority === 'low' ? 'text-emerald-500' :
                      'text-blue-500'
                    }`} />
                    <p className="text-sm text-slate-700">{item.insight}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Recent Activities */}
          <Card className="p-4">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              Recent Activities
            </h3>
            <div className="space-y-3">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-2">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'renewal' ? 'bg-emerald-100' :
                    activity.type === 'upsell' ? 'bg-violet-100' :
                    activity.type === 'risk' ? 'bg-rose-100' :
                    'bg-teal-100'
                  }`}>
                    <activity.icon className={`w-4 h-4 ${
                      activity.type === 'renewal' ? 'text-emerald-600' :
                      activity.type === 'upsell' ? 'text-violet-600' :
                      activity.type === 'risk' ? 'text-rose-600' :
                      'text-teal-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{activity.client}</p>
                    <p className="text-xs text-slate-500">{activity.action}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
