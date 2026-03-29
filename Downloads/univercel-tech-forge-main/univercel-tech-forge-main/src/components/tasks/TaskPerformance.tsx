import { motion } from "framer-motion";
import { 
  TrendingUp, Clock, Users, Target, CheckCircle,
  AlertTriangle, BarChart3, Brain, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, RadialBarChart, RadialBar
} from "recharts";

const TaskPerformance = () => {
  const completionData = [
    { week: "W1", completed: 28, overdue: 4 },
    { week: "W2", completed: 35, overdue: 2 },
    { week: "W3", completed: 42, overdue: 5 },
    { week: "W4", completed: 38, overdue: 3 },
    { week: "W5", completed: 45, overdue: 1 },
    { week: "W6", completed: 52, overdue: 2 },
  ];

  const rolePerformance = [
    { role: "Developer", tasks: 180, completed: 165, avgTime: 4.2, successRate: 92 },
    { role: "Sales", tasks: 95, completed: 88, avgTime: 2.1, successRate: 93 },
    { role: "Support", tasks: 120, completed: 115, avgTime: 1.8, successRate: 96 },
    { role: "Franchise", tasks: 45, completed: 42, avgTime: 3.5, successRate: 93 },
  ];

  const aiAccuracy = [
    { name: "Time Estimation", ai: 85, human: 72, fill: "#8b5cf6" },
    { name: "Assignment Match", ai: 92, human: 78, fill: "#06b6d4" },
    { name: "Risk Prediction", ai: 88, human: 65, fill: "#10b981" },
  ];

  const kpis = [
    { label: "Avg Completion Time", value: "3.8h", change: "-0.4h", trend: "up", icon: Clock },
    { label: "Success Rate", value: "94.2%", change: "+2.1%", trend: "up", icon: CheckCircle },
    { label: "Overdues This Week", value: "3", change: "-5", trend: "up", icon: AlertTriangle },
    { label: "AI Accuracy", value: "88%", change: "+3%", trend: "up", icon: Brain },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Performance Tracking</h2>
        <p className="text-slate-400">Task completion analytics & AI insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-violet-500/20 rounded-lg">
                <kpi.icon className="w-5 h-5 text-violet-400" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                kpi.trend === "up" ? "text-green-400" : "text-red-400"
              }`}>
                {kpi.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {kpi.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
            <p className="text-sm text-slate-400">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Completion Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-violet-400" />
            Completion Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={completionData}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOverdue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="week" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1e293b", 
                  border: "1px solid #334155",
                  borderRadius: "8px"
                }}
              />
              <Area type="monotone" dataKey="completed" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorCompleted)" name="Completed" />
              <Area type="monotone" dataKey="overdue" stroke="#ef4444" fillOpacity={1} fill="url(#colorOverdue)" name="Overdue" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* AI vs Human Accuracy */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-violet-400" />
            AI vs Human Accuracy
          </h3>
          <div className="space-y-4">
            {aiAccuracy.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">{item.name}</span>
                  <div className="flex gap-4 text-xs">
                    <span className="text-violet-400">AI: {item.ai}%</span>
                    <span className="text-slate-400">Human: {item.human}%</span>
                  </div>
                </div>
                <div className="flex gap-2 h-2">
                  <div className="flex-1 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.ai}%` }}
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                    />
                  </div>
                  <div className="flex-1 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.human}%` }}
                      className="h-full bg-slate-500 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Role-Based Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-violet-400" />
          Role-Based Output
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {rolePerformance.map((role, index) => (
            <motion.div
              key={role.role}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-slate-800/50 rounded-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-white">{role.role}</span>
                <Badge className="bg-green-500/20 text-green-400">{role.successRate}%</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total Tasks</span>
                  <span className="text-white">{role.tasks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Completed</span>
                  <span className="text-green-400">{role.completed}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Avg Time</span>
                  <span className="text-violet-400">{role.avgTime}h</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TaskPerformance;
