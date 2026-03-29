import { motion } from "framer-motion";
import { 
  Gauge, 
  Zap, 
  Clock, 
  MessageSquare, 
  Target,
  Shield,
  TrendingUp,
  TrendingDown,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const teamMembers = [
  {
    id: "1",
    name: "vala(dev)4412",
    role: "Developer",
    upi: 92,
    breakdown: { speed: 95, quality: 90, communication: 88, success: 94, behavior: 93 },
    trend: "up",
    aiReason: "On-time delivery streak: 14 tasks",
  },
  {
    id: "2",
    name: "vala(sales)4771",
    role: "Sales",
    upi: 87,
    breakdown: { speed: 89, quality: 85, communication: 92, success: 82, behavior: 88 },
    trend: "up",
    aiReason: "High client sentiment scores this week",
  },
  {
    id: "3",
    name: "vala(support)2341",
    role: "Support",
    upi: 78,
    breakdown: { speed: 72, quality: 80, communication: 85, success: 75, behavior: 82 },
    trend: "down",
    aiReason: "Score reduced due to 3 delayed responses",
  },
  {
    id: "4",
    name: "vala(reseller)8821",
    role: "Reseller",
    upi: 84,
    breakdown: { speed: 86, quality: 82, communication: 88, success: 80, behavior: 85 },
    trend: "stable",
    aiReason: "Consistent lead conversion rates",
  },
];

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-emerald-400";
  if (score >= 80) return "text-cyan-400";
  if (score >= 70) return "text-amber-400";
  return "text-rose-400";
};

const getScoreGradient = (score: number) => {
  if (score >= 90) return "from-emerald-500 to-cyan-500";
  if (score >= 80) return "from-cyan-500 to-blue-500";
  if (score >= 70) return "from-amber-500 to-orange-500";
  return "from-rose-500 to-red-500";
};

export const UniversalPerformanceIndex = () => {
  const avgUPI = 85.3;
  const categories = [
    { label: "Speed", icon: Zap, value: 86 },
    { label: "Quality", icon: Target, value: 84 },
    { label: "Communication", icon: MessageSquare, value: 88 },
    { label: "Success Rate", icon: TrendingUp, value: 83 },
    { label: "Behavior", icon: Shield, value: 87 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          Universal Performance Index (UPI 2035)
        </h2>
        <p className="text-slate-400 text-sm mt-1">Single score combining all performance metrics — No manual input, system calculated</p>
      </div>

      {/* Overall UPI */}
      <Card className="p-8 bg-slate-900/50 backdrop-blur-xl border-cyan-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Main Score Ring */}
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="rgba(6, 182, 212, 0.1)"
                  strokeWidth="12"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="url(#upiGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${avgUPI * 4.4} 440`}
                  initial={{ strokeDasharray: "0 440" }}
                  animate={{ strokeDasharray: `${avgUPI * 4.4} 440` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="upiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span 
                  className="text-4xl font-bold text-cyan-400"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {avgUPI}
                </motion.span>
                <span className="text-sm text-slate-400">Team Average</span>
              </div>
              
              {/* Holographic Effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(6, 182, 212, 0.2)",
                    "0 0 40px rgba(6, 182, 212, 0.4)",
                    "0 0 20px rgba(6, 182, 212, 0.2)",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            {/* Category Breakdown */}
            <div className="space-y-3">
              {categories.map((cat, index) => {
                const Icon = cat.icon;
                return (
                  <motion.div
                    key={cat.label}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="p-2 rounded-lg bg-cyan-500/10">
                      <Icon className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="w-32">
                      <p className="text-sm text-slate-300">{cat.label}</p>
                    </div>
                    <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${getScoreGradient(cat.value)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.value}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <span className={`text-sm font-semibold ${getScoreColor(cat.value)}`}>
                      {cat.value}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* AI Insight */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/30 max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-300">AI Analysis</span>
            </div>
            <p className="text-sm text-slate-300">
              Team performance trending upward. Developer efficiency peaked this week. 
              Focus area: Support response times need attention.
            </p>
          </div>
        </div>
      </Card>

      {/* Individual Scores */}
      <div className="grid grid-cols-2 gap-4">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-5 bg-slate-900/50 backdrop-blur-xl border-cyan-500/20 hover:border-cyan-500/40 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{member.name}</h3>
                    <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">
                      {member.role}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.span 
                    className={`text-3xl font-bold ${getScoreColor(member.upi)}`}
                    animate={{ opacity: [1, 0.8, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {member.upi}
                  </motion.span>
                  {member.trend === "up" && <TrendingUp className="w-5 h-5 text-emerald-400" />}
                  {member.trend === "down" && <TrendingDown className="w-5 h-5 text-rose-400" />}
                </div>
              </div>

              {/* Mini Breakdown */}
              <div className="grid grid-cols-5 gap-2 mb-3">
                {Object.entries(member.breakdown).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="h-12 bg-slate-800/50 rounded relative overflow-hidden">
                      <motion.div
                        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${getScoreGradient(value)}`}
                        initial={{ height: 0 }}
                        animate={{ height: `${value}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 capitalize">{key.slice(0, 4)}</p>
                  </div>
                ))}
              </div>

              {/* AI Justification */}
              <div className="p-2 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  {member.aiReason}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
