import { motion } from "framer-motion";
import { 
  TrendingUp, Globe, Link2, Search, Users, Shield,
  BarChart3, Target, Zap, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface SEOMetricsProps {
  activeRegion: string;
}

const SEOMetrics = ({ activeRegion }: SEOMetricsProps) => {
  const metrics = [
    { 
      label: "Global Ranking", 
      value: "#12", 
      change: "+5", 
      trend: "up",
      icon: TrendingUp,
      color: "from-cyan-500 to-blue-500"
    },
    { 
      label: "Keyword Health", 
      value: "94%", 
      change: "+2.3%", 
      trend: "up",
      icon: Search,
      color: "from-emerald-500 to-teal-500"
    },
    { 
      label: "Traffic Prediction", 
      value: "45.2K", 
      change: "+18%", 
      trend: "up",
      icon: Users,
      color: "from-purple-500 to-pink-500"
    },
    { 
      label: "Backlink Authority", 
      value: "72", 
      change: "+8", 
      trend: "up",
      icon: Link2,
      color: "from-orange-500 to-amber-500"
    },
    { 
      label: "Social × SEO", 
      value: "89%", 
      change: "+5.2%", 
      trend: "up",
      icon: BarChart3,
      color: "from-blue-500 to-indigo-500"
    },
    { 
      label: "Spam Shield", 
      value: "Active", 
      change: "Clean", 
      trend: "up",
      icon: Shield,
      color: "from-green-500 to-emerald-500"
    },
  ];

  const trafficData = [
    { name: "Jan", organic: 4000, paid: 2400 },
    { name: "Feb", organic: 5000, paid: 2800 },
    { name: "Mar", organic: 6200, paid: 3200 },
    { name: "Apr", organic: 7800, paid: 3600 },
    { name: "May", organic: 9500, paid: 4000 },
    { name: "Jun", organic: 12000, paid: 4200 },
  ];

  const regionData = [
    { name: "Africa", value: 35, color: "#06b6d4" },
    { name: "Asia", value: 40, color: "#8b5cf6" },
    { name: "Middle East", value: 25, color: "#f59e0b" },
  ];

  const aiSuggestions = [
    { text: "Add 2 blogs for Real-Estate category", priority: "high" },
    { text: "Optimize meta tags for Hospital Software", priority: "medium" },
    { text: "Build 5 backlinks for POS industry", priority: "medium" },
    { text: "Update schema for School Management pages", priority: "low" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">SEO Dashboard</h2>
          <p className="text-slate-400">Real-time search domination metrics</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-sm font-semibold flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Run Full Optimization
        </motion.button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color} bg-opacity-20`}>
                <metric.icon className="w-5 h-5 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                metric.trend === "up" ? "text-green-400" : "text-red-400"
              }`}>
                {metric.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {metric.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-white">{metric.value}</p>
              <p className="text-sm text-slate-400">{metric.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Traffic Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Traffic Growth AI Prediction</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1e293b", 
                  border: "1px solid #334155",
                  borderRadius: "8px"
                }}
              />
              <Area type="monotone" dataKey="organic" stroke="#06b6d4" fillOpacity={1} fill="url(#colorOrganic)" />
              <Area type="monotone" dataKey="paid" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPaid)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Region Heatmap */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Market Heatmap</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="60%" height={250}>
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1e293b", 
                    border: "1px solid #334155",
                    borderRadius: "8px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {regionData.map((region) => (
                <div key={region.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: region.color }} />
                  <span className="text-sm text-slate-300">{region.name}</span>
                  <span className="text-sm font-bold text-white">{region.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Insight Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl border border-cyan-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Target className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">AI Insight — Today's Suggestions</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {aiSuggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg"
            >
              <div className={`w-2 h-2 rounded-full ${
                suggestion.priority === "high" ? "bg-red-400" :
                suggestion.priority === "medium" ? "bg-yellow-400" : "bg-green-400"
              }`} />
              <span className="text-sm text-slate-300">{suggestion.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SEOMetrics;
