import { motion } from "framer-motion";
import { BarChart3, TrendingUp, MessageSquare, CheckCircle, Clock, Target, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const UsageAnalytics = () => {
  const metrics = [
    { label: "Total Projects", value: 24, change: "+3", trend: "up", icon: Target },
    { label: "Messages Sent", value: 1248, change: "+156", trend: "up", icon: MessageSquare },
    { label: "Success Rate", value: "96%", change: "+2%", trend: "up", icon: CheckCircle },
    { label: "Avg. Delivery", value: "2.3d", change: "-0.5d", trend: "up", icon: Clock },
  ];

  const monthlyData = [
    { month: "Jul", projects: 2, messages: 89, delivered: 2 },
    { month: "Aug", projects: 3, messages: 134, delivered: 3 },
    { month: "Sep", projects: 4, messages: 201, delivered: 4 },
    { month: "Oct", projects: 5, messages: 267, delivered: 5 },
    { month: "Nov", projects: 6, messages: 312, delivered: 5 },
    { month: "Dec", projects: 4, messages: 245, delivered: 4 },
  ];

  const deliveryPatterns = [
    { type: "On Time", percentage: 78, color: "bg-emerald-500" },
    { type: "Early", percentage: 15, color: "bg-blue-500" },
    { type: "Slight Delay", percentage: 5, color: "bg-amber-500" },
    { type: "Delayed", percentage: 2, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-amber-100">Usage Analytics</h2>
        <p className="text-stone-400">Comprehensive insights into your Prime account activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-stone-900/50 border-amber-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5 text-amber-400" />
                    <Badge className={metric.trend === "up" ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {metric.change}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-amber-100">{metric.value}</div>
                  <div className="text-xs text-stone-400">{metric.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-stone-900/50 border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-amber-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              Monthly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={data.month} className="flex items-center gap-4">
                  <span className="w-10 text-stone-400 text-sm">{data.month}</span>
                  <div className="flex-1 flex gap-2">
                    <div className="flex-1 bg-stone-800 rounded-full h-6 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.projects / 6) * 100}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-end pr-2"
                      >
                        <span className="text-xs text-stone-900 font-medium">{data.projects}</span>
                      </motion.div>
                    </div>
                  </div>
                  <span className="text-xs text-stone-500 w-20">{data.messages} msgs</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-stone-900/50 border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-amber-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              Delivery Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deliveryPatterns.map((pattern, index) => (
                <motion.div
                  key={pattern.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-stone-300">{pattern.type}</span>
                    <span className="text-amber-100 font-medium">{pattern.percentage}%</span>
                  </div>
                  <Progress value={pattern.percentage} className="h-3 bg-stone-800" />
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-amber-500/10 border border-emerald-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
                <div>
                  <div className="font-medium text-emerald-300">Excellent Performance</div>
                  <div className="text-xs text-stone-400">93% of projects delivered on or before deadline</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-stone-900/50 border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-amber-100">Account Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-stone-800/50 rounded-lg">
              <div className="text-3xl font-bold text-amber-100">24</div>
              <div className="text-sm text-stone-400">Total Projects</div>
              <div className="text-xs text-emerald-400 mt-1">All Time</div>
            </div>
            <div className="text-center p-4 bg-stone-800/50 rounded-lg">
              <div className="text-3xl font-bold text-amber-100">1,248</div>
              <div className="text-sm text-stone-400">Messages</div>
              <div className="text-xs text-emerald-400 mt-1">+156 this month</div>
            </div>
            <div className="text-center p-4 bg-stone-800/50 rounded-lg">
              <div className="text-3xl font-bold text-amber-100">48</div>
              <div className="text-sm text-stone-400">Support Tickets</div>
              <div className="text-xs text-emerald-400 mt-1">100% resolved</div>
            </div>
            <div className="text-center p-4 bg-stone-800/50 rounded-lg">
              <div className="text-3xl font-bold text-amber-100">4.9</div>
              <div className="text-sm text-stone-400">Avg. Rating</div>
              <div className="text-xs text-amber-400 mt-1">★★★★★</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageAnalytics;
