import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Target, Clock, Star, Award, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const SalesPerformanceDashboard = () => {
  const metrics = [
    { label: "Conversions", value: 24, target: 30, unit: "", icon: Target, color: "cyan" },
    { label: "Revenue", value: 58000, target: 75000, unit: "$", icon: DollarSign, color: "emerald" },
    { label: "Avg. Handle Time", value: 4.2, target: 5, unit: " min", icon: Clock, color: "amber" },
    { label: "Satisfaction", value: 4.8, target: 5, unit: "/5", icon: Star, color: "purple" },
  ];

  const weeklyData = [
    { day: "Mon", conversions: 4, calls: 12, demos: 8 },
    { day: "Tue", conversions: 6, calls: 15, demos: 10 },
    { day: "Wed", conversions: 3, calls: 10, demos: 6 },
    { day: "Thu", conversions: 5, calls: 14, demos: 9 },
    { day: "Fri", conversions: 6, calls: 18, demos: 11 },
  ];

  const leaderboard = [
    { rank: 1, name: "Sarah Chen", conversions: 28, revenue: "$68,500", avatar: "SC" },
    { rank: 2, name: "Mike Johnson", conversions: 24, revenue: "$58,200", avatar: "MJ" },
    { rank: 3, name: "Emily Davis", conversions: 22, revenue: "$52,800", avatar: "ED" },
    { rank: 4, name: "You", conversions: 24, revenue: "$58,000", avatar: "YO", isYou: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-100">Performance Dashboard</h2>
          <p className="text-slate-400">Track your sales metrics and ranking</p>
        </div>
        <Badge className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-2">
          <Award className="w-4 h-4 mr-2" />
          Top Performer This Week
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const percentage = (metric.value / metric.target) * 100;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-slate-900/50 border-${metric.color}-500/20`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 text-${metric.color}-400`} />
                    <Badge className={percentage >= 100 ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700 text-slate-300"}>
                      {percentage >= 100 ? "Target Met" : `${Math.round(percentage)}%`}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-slate-100">
                    {metric.unit === "$" ? `$${metric.value.toLocaleString()}` : `${metric.value}${metric.unit}`}
                  </div>
                  <div className="text-xs text-slate-400">{metric.label}</div>
                  <Progress value={Math.min(percentage, 100)} className="h-1.5 mt-2 bg-slate-800" />
                  <div className="text-xs text-slate-500 mt-1">
                    Target: {metric.unit === "$" ? `$${metric.target.toLocaleString()}` : `${metric.target}${metric.unit}`}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <span className="w-10 text-slate-400 text-sm">{day.day}</span>
                  <div className="flex-1 flex gap-2">
                    <div className="flex-1 bg-slate-800 rounded-full h-6 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(day.conversions / 8) * 100}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-end pr-2"
                      >
                        <span className="text-xs text-white font-medium">{day.conversions}</span>
                      </motion.div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <span className="text-slate-500">{day.calls} calls</span>
                    <span className="text-slate-500">{day.demos} demos</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Team Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    member.isYou ? "bg-cyan-500/20 border border-cyan-500/30" : "bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      member.rank === 1 ? "bg-amber-500 text-white" :
                      member.rank === 2 ? "bg-slate-400 text-white" :
                      member.rank === 3 ? "bg-amber-700 text-white" :
                      "bg-slate-700 text-slate-300"
                    }`}>
                      {member.rank}
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center text-cyan-300 font-medium text-sm">
                      {member.avatar}
                    </div>
                    <div>
                      <span className={`font-medium ${member.isYou ? "text-cyan-300" : "text-slate-200"}`}>
                        {member.name}
                      </span>
                      {member.isYou && <Badge className="ml-2 bg-cyan-500/20 text-cyan-300 text-xs">You</Badge>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-400">{member.revenue}</div>
                    <div className="text-xs text-slate-500">{member.conversions} conversions</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-purple-100">Behavior Score</h3>
                <p className="text-slate-400">Based on response time, quality, and customer feedback</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-purple-300">92</div>
              <div className="text-sm text-slate-400">Excellent</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesPerformanceDashboard;
