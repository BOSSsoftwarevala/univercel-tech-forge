import { motion } from "framer-motion";
import { 
  TrendingUp, Eye, MousePointer, ArrowDownUp, 
  Target, Award, BarChart3
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const PerformanceReview = () => {
  const aiGrade = "A";
  const gradeColor = "text-green-400";

  const metrics = [
    { label: "Search Impressions", value: "2.4M", change: "+18%", trend: "up" },
    { label: "Click-Through Rate", value: "4.2%", change: "+0.8%", trend: "up" },
    { label: "Bounce Rate", value: "32%", change: "-5%", trend: "up" },
    { label: "Organic Conversions", value: "1,247", change: "+23%", trend: "up" },
  ];

  const impressionsData = [
    { date: "Week 1", impressions: 280000, clicks: 11200 },
    { date: "Week 2", impressions: 320000, clicks: 13440 },
    { date: "Week 3", impressions: 380000, clicks: 16340 },
    { date: "Week 4", impressions: 450000, clicks: 19350 },
    { date: "Week 5", impressions: 520000, clicks: 22360 },
    { date: "Week 6", impressions: 580000, clicks: 24940 },
  ];

  const conversionData = [
    { source: "Blog Posts", conversions: 420, rate: 3.8 },
    { source: "Landing Pages", conversions: 380, rate: 5.2 },
    { source: "Product Pages", conversions: 290, rate: 4.1 },
    { source: "FAQs", conversions: 157, rate: 2.9 },
  ];

  const performanceScores = [
    { metric: "Response Time", score: 92, target: 90 },
    { metric: "Content Quality", score: 88, target: 85 },
    { metric: "Technical SEO", score: 95, target: 90 },
    { metric: "User Experience", score: 86, target: 85 },
    { metric: "Mobile Performance", score: 91, target: 90 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Performance Review</h2>
          <p className="text-slate-400">Comprehensive SEO analytics & AI grading</p>
        </div>
        
        {/* AI Grade */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30"
        >
          <Award className="w-8 h-8 text-green-400" />
          <div>
            <p className="text-sm text-slate-400">AI Performance Grade</p>
            <p className={`text-4xl font-bold ${gradeColor}`}>{aiGrade}</p>
          </div>
        </motion.div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
          >
            <p className="text-sm text-slate-400 mb-1">{metric.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-white">{metric.value}</p>
              <Badge className={`${
                metric.trend === "up" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              }`}>
                {metric.change}
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Impressions & Clicks Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" />
            Search Impressions & Clicks
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={impressionsData}>
              <defs>
                <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1e293b", 
                  border: "1px solid #334155",
                  borderRadius: "8px"
                }}
              />
              <Area type="monotone" dataKey="impressions" stroke="#06b6d4" fillOpacity={1} fill="url(#colorImpressions)" />
              <Area type="monotone" dataKey="clicks" stroke="#10b981" fillOpacity={1} fill="url(#colorClicks)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Conversion by Source */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Conversions from Organic
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={conversionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#64748b" />
              <YAxis type="category" dataKey="source" stroke="#64748b" width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1e293b", 
                  border: "1px solid #334155",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="conversions" fill="#06b6d4" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Performance Scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          Performance Scores
        </h3>
        <div className="grid grid-cols-5 gap-4">
          {performanceScores.map((item, index) => (
            <motion.div
              key={item.metric}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-slate-800/50 rounded-lg text-center"
            >
              <p className="text-sm text-slate-400 mb-2">{item.metric}</p>
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="#334155"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke={item.score >= item.target ? "#10b981" : "#f59e0b"}
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${(item.score / 100) * 226} 226`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">
                  {item.score}
                </span>
              </div>
              <p className="text-xs text-slate-500">Target: {item.target}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PerformanceReview;
