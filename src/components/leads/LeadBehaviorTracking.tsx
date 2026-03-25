import { motion } from "framer-motion";
import { 
  Activity, Clock, MessageSquare, TrendingUp, TrendingDown,
  User, Award, AlertTriangle, BarChart3, Star
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const LeadBehaviorTracking = () => {
  const handlers = [
    {
      id: "1",
      name: "vala(sales)4771",
      role: "Sales",
      responseTime: "2.3 min",
      communicationScore: 94,
      handlingQuality: 92,
      behaviorScore: 93,
      trend: "up",
      leadsHandled: 47,
      conversions: 23,
      violations: 0,
    },
    {
      id: "2",
      name: "vala(franchise)2891",
      role: "Franchise",
      responseTime: "3.1 min",
      communicationScore: 88,
      handlingQuality: 90,
      behaviorScore: 89,
      trend: "up",
      leadsHandled: 35,
      conversions: 18,
      violations: 0,
    },
    {
      id: "3",
      name: "vala(reseller)5678",
      role: "Reseller",
      responseTime: "8.5 min",
      communicationScore: 72,
      handlingQuality: 68,
      behaviorScore: 65,
      trend: "down",
      leadsHandled: 28,
      conversions: 8,
      violations: 2,
    },
    {
      id: "4",
      name: "vala(sales)1234",
      role: "Sales",
      responseTime: "4.2 min",
      communicationScore: 85,
      handlingQuality: 82,
      behaviorScore: 84,
      trend: "stable",
      leadsHandled: 41,
      conversions: 19,
      violations: 1,
    },
  ];

  const impactMetrics = [
    { 
      metric: "Response Time Impact", 
      description: "Leads responded within 5 min convert 3x more",
      icon: Clock,
      stat: "3x",
    },
    { 
      metric: "Communication Score", 
      description: "Higher scores correlate with 40% better conversion",
      icon: MessageSquare,
      stat: "40%",
    },
    { 
      metric: "Handling Quality", 
      description: "Quality above 85 = 2x customer satisfaction",
      icon: Award,
      stat: "2x",
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 75) return "text-yellow-400";
    if (score >= 60) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-500/20 border-green-500/30";
    if (score >= 75) return "bg-yellow-500/20 border-yellow-500/30";
    if (score >= 60) return "bg-orange-500/20 border-orange-500/30";
    return "bg-red-500/20 border-red-500/30";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-400" />
            Behavior Tracking
          </h2>
          <p className="text-slate-400">Handler performance and response metrics</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500">
          <BarChart3 className="w-4 h-4 mr-2" />
          Full Report
        </Button>
      </div>

      {/* Impact Metrics */}
      <div className="grid grid-cols-3 gap-4">
        {impactMetrics.map((item, index) => (
          <motion.div
            key={item.metric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <item.icon className="w-5 h-5 text-indigo-400" />
              <span className="text-2xl font-bold text-indigo-400">{item.stat}</span>
            </div>
            <p className="font-medium text-white mb-1">{item.metric}</p>
            <p className="text-xs text-slate-400">{item.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Handler Performance Table */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-700/50">
          <h3 className="font-semibold text-white">Handler Performance Scores</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="text-left p-4 text-xs text-slate-400 font-medium">Handler</th>
                <th className="text-center p-4 text-xs text-slate-400 font-medium">Response Time</th>
                <th className="text-center p-4 text-xs text-slate-400 font-medium">Comm. Score</th>
                <th className="text-center p-4 text-xs text-slate-400 font-medium">Quality</th>
                <th className="text-center p-4 text-xs text-slate-400 font-medium">Behavior Score</th>
                <th className="text-center p-4 text-xs text-slate-400 font-medium">Leads</th>
                <th className="text-center p-4 text-xs text-slate-400 font-medium">Conversions</th>
                <th className="text-center p-4 text-xs text-slate-400 font-medium">Violations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {handlers.map((handler, index) => (
                <motion.tr
                  key={handler.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{handler.name}</p>
                        <p className="text-xs text-slate-400">{handler.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={parseFloat(handler.responseTime) <= 5 ? "text-green-400" : "text-red-400"}>
                      {handler.responseTime}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={getScoreColor(handler.communicationScore)}>
                      {handler.communicationScore}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={getScoreColor(handler.handlingQuality)}>
                      {handler.handlingQuality}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className={`px-3 py-1 rounded-lg border ${getScoreBg(handler.behaviorScore)}`}>
                        <span className={`font-bold ${getScoreColor(handler.behaviorScore)}`}>
                          {handler.behaviorScore}
                        </span>
                      </div>
                      {handler.trend === "up" && <TrendingUp className="w-4 h-4 text-green-400" />}
                      {handler.trend === "down" && <TrendingDown className="w-4 h-4 text-red-400" />}
                    </div>
                  </td>
                  <td className="p-4 text-center text-white">{handler.leadsHandled}</td>
                  <td className="p-4 text-center text-green-400">{handler.conversions}</td>
                  <td className="p-4 text-center">
                    {handler.violations > 0 ? (
                      <Badge className="bg-red-500/20 text-red-400">
                        {handler.violations}
                      </Badge>
                    ) : (
                      <Badge className="bg-green-500/20 text-green-400">0</Badge>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Alerts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Top Performers This Month
          </h4>
          <div className="space-y-2">
            {handlers.filter(h => h.behaviorScore >= 85).map((handler, i) => (
              <div key={handler.id} className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">#{i + 1}</span>
                  <span className="text-white">{handler.name}</span>
                </div>
                <span className="text-green-400 font-bold">{handler.behaviorScore}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Improvement */}
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
          <h4 className="font-semibold text-orange-400 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Needs Improvement
          </h4>
          <div className="space-y-2">
            {handlers.filter(h => h.behaviorScore < 75).map((handler) => (
              <div key={handler.id} className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg">
                <span className="text-white">{handler.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-orange-400 font-bold">{handler.behaviorScore}</span>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-orange-400">
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Score Impact on Routing */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
        <h4 className="font-semibold text-white mb-3">Behavior Score Impact on Lead Routing</h4>
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
            <p className="text-green-400 font-bold">90+</p>
            <p className="text-xs text-slate-400">Priority routing</p>
          </div>
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-center">
            <p className="text-yellow-400 font-bold">75-89</p>
            <p className="text-xs text-slate-400">Normal routing</p>
          </div>
          <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg text-center">
            <p className="text-orange-400 font-bold">60-74</p>
            <p className="text-xs text-slate-400">Reduced assignments</p>
          </div>
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
            <p className="text-red-400 font-bold">Below 60</p>
            <p className="text-xs text-slate-400">Training required</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadBehaviorTracking;
