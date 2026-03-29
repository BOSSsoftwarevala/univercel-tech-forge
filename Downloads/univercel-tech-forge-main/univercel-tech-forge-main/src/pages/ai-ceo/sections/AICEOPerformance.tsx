import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BarChart3,
  Target,
  Clock,
  Award,
  AlertCircle
} from "lucide-react";

// Mock performance data
const rolePerformance = [
  { role: "Franchises", score: 87, trend: "up", metric: "Sales conversion", change: "+12%" },
  { role: "Resellers", score: 72, trend: "stable", metric: "Lead closure", change: "+2%" },
  { role: "Support Team", score: 94, trend: "up", metric: "Resolution time", change: "-18%" },
  { role: "Sales Team", score: 68, trend: "down", metric: "New clients", change: "-8%" },
  { role: "Developers", score: 91, trend: "up", metric: "Deploy success", change: "+5%" },
];

const productivityMetrics = [
  { metric: "Avg Tasks/Day", value: "23.4", trend: "up", target: 20 },
  { metric: "Response Time", value: "4.2h", trend: "up", target: 6 },
  { metric: "Quality Score", value: "8.7/10", trend: "stable", target: 8.5 },
  { metric: "Completion Rate", value: "94%", trend: "up", target: 90 },
];

const correctiveActions = [
  { team: "Sales Team", issue: "Below target for 3 weeks", action: "Recommend training session", priority: "high" },
  { team: "Reseller #23", issue: "Low engagement", action: "Schedule check-in call", priority: "medium" },
  { team: "Region LATAM", issue: "SLA approaching breach", action: "Allocate additional resources", priority: "high" },
];

const AICEOPerformance = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-xl shadow-emerald-500/20">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Performance Intelligence</h1>
            <p className="text-cyan-400/80">Role and team performance analysis</p>
          </div>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <BarChart3 className="w-3 h-3 mr-1" />
          Real-time Analysis
        </Badge>
      </div>

      {/* Productivity Overview */}
      <div className="grid grid-cols-4 gap-4">
        {productivityMetrics.map((metric, i) => (
          <motion.div
            key={metric.metric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">{metric.metric}</span>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  ) : metric.trend === 'down' ? (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </div>
                <p className="text-xl font-bold text-white">{metric.value}</p>
                <p className="text-xs text-slate-500">Target: {metric.target}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Role Performance */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Role Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px]">
              <div className="space-y-4">
                {rolePerformance.map((role, i) => (
                  <motion.div
                    key={role.role}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{role.role}</span>
                        {role.trend === 'up' ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {role.change}
                          </Badge>
                        ) : role.trend === 'down' ? (
                          <Badge className="bg-red-500/20 text-red-400">
                            <TrendingDown className="w-3 h-3 mr-1" />
                            {role.change}
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-500/20 text-slate-400">
                            {role.change}
                          </Badge>
                        )}
                      </div>
                      <span className="text-lg font-bold text-cyan-400">{role.score}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={role.score} className="h-2 flex-1" />
                      <span className="text-xs text-slate-400">{role.metric}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Corrective Actions */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" />
              Suggested Corrective Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {correctiveActions.map((action, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    action.priority === 'high' 
                      ? 'bg-red-500/5 border-red-500/20' 
                      : 'bg-yellow-500/5 border-yellow-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className={`w-4 h-4 ${
                        action.priority === 'high' ? 'text-red-400' : 'text-yellow-400'
                      }`} />
                      <span className="font-medium text-white">{action.team}</span>
                    </div>
                    <Badge className={
                      action.priority === 'high' 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }>
                      {action.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 mb-1">{action.issue}</p>
                  <p className="text-sm text-cyan-400">→ {action.action}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Notice */}
      <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
        <div className="flex items-center gap-3">
          <Award className="w-5 h-5 text-emerald-400" />
          <p className="text-sm text-emerald-400/80">
            <strong>Performance Analysis:</strong> AI provides improvement suggestions based on historical patterns and peer benchmarks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICEOPerformance;
