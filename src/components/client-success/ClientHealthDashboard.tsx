import { motion } from "framer-motion";
import { 
  Heart, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const clients = [
  {
    id: "1",
    name: "TechCorp Solutions",
    happinessScore: 92,
    onboardingStatus: "completed",
    activeIssues: 0,
    trend: "up",
    prediction: "satisfied",
    lastContact: "2 hours ago",
    ltv: "$45,000",
  },
  {
    id: "2",
    name: "GlobalRetail Inc",
    happinessScore: 78,
    onboardingStatus: "training",
    activeIssues: 1,
    trend: "stable",
    prediction: "neutral",
    lastContact: "1 day ago",
    ltv: "$32,000",
  },
  {
    id: "3",
    name: "StartupX",
    happinessScore: 45,
    onboardingStatus: "setup",
    activeIssues: 3,
    trend: "down",
    prediction: "at-risk",
    lastContact: "5 days ago",
    ltv: "$12,000",
  },
  {
    id: "4",
    name: "Enterprise Plus",
    happinessScore: 88,
    onboardingStatus: "completed",
    activeIssues: 0,
    trend: "up",
    prediction: "satisfied",
    lastContact: "4 hours ago",
    ltv: "$89,000",
  },
];

const getPredictionColor = (prediction: string) => {
  switch (prediction) {
    case "satisfied": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "neutral": return "bg-amber-100 text-amber-700 border-amber-200";
    case "at-risk": return "bg-rose-100 text-rose-700 border-rose-200";
    default: return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-rose-600";
};

const getScoreGradient = (score: number) => {
  if (score >= 80) return "from-emerald-500 to-teal-500";
  if (score >= 60) return "from-amber-500 to-orange-500";
  return "from-rose-500 to-red-500";
};

export const ClientHealthDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Client Health Dashboard
        </h2>
        <p className="text-slate-500 text-sm mt-1">Monitor client satisfaction and predict outcomes</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Avg Happiness", value: "76%", change: "+5%", icon: Heart, color: "teal" },
          { label: "Satisfied Clients", value: "142", change: "+12", icon: CheckCircle, color: "emerald" },
          { label: "At-Risk Clients", value: "8", change: "-2", icon: AlertTriangle, color: "rose" },
          { label: "Active Issues", value: "23", change: "-5", icon: Clock, color: "amber" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-4 bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg shadow-slate-200/50">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                <span className={`text-xs font-medium ${
                  stat.change.startsWith("+") ? "text-emerald-600" : "text-rose-600"
                }`}>{stat.change}</span>
              </div>
              <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Client Cards */}
      <div className="grid grid-cols-2 gap-4">
        {clients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-5 bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg hover:shadow-xl transition-all cursor-pointer group">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
                    {client.name}
                  </h3>
                  <p className="text-xs text-slate-500">LTV: {client.ltv}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getPredictionColor(client.prediction)}>
                    <Sparkles className="w-3 h-3 mr-1" />
                    {client.prediction}
                  </Badge>
                </div>
              </div>

              {/* Happiness Score Ring */}
              <div className="flex items-center gap-6 mb-4">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="6"
                    />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="35"
                      fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${client.happinessScore * 2.2} 220`}
                      initial={{ strokeDasharray: "0 220" }}
                      animate={{ strokeDasharray: `${client.happinessScore * 2.2} 220` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={client.happinessScore >= 80 ? "#10b981" : client.happinessScore >= 60 ? "#f59e0b" : "#ef4444"} />
                        <stop offset="100%" stopColor={client.happinessScore >= 80 ? "#14b8a6" : client.happinessScore >= 60 ? "#f97316" : "#dc2626"} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xl font-bold ${getScoreColor(client.happinessScore)}`}>
                      {client.happinessScore}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">Onboarding Progress</span>
                      <span className="text-teal-600 font-medium">{client.onboardingStatus}</span>
                    </div>
                    <Progress value={client.onboardingStatus === "completed" ? 100 : client.onboardingStatus === "training" ? 75 : 40} className="h-2" />
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 text-slate-500">
                      <AlertTriangle className="w-3 h-3" />
                      {client.activeIssues} issues
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      {client.lastContact}
                    </span>
                    <span className={`flex items-center gap-1 ${
                      client.trend === "up" ? "text-emerald-600" : client.trend === "down" ? "text-rose-600" : "text-amber-600"
                    }`}>
                      {client.trend === "up" ? <TrendingUp className="w-3 h-3" /> : client.trend === "down" ? <TrendingDown className="w-3 h-3" /> : null}
                      {client.trend}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Prediction */}
              <div className={`p-3 rounded-lg bg-gradient-to-r ${
                client.prediction === "satisfied" ? "from-emerald-50 to-teal-50 border-emerald-200" :
                client.prediction === "neutral" ? "from-amber-50 to-orange-50 border-amber-200" :
                "from-rose-50 to-red-50 border-rose-200"
              } border`}>
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${
                    client.prediction === "satisfied" ? "text-emerald-600" :
                    client.prediction === "neutral" ? "text-amber-600" : "text-rose-600"
                  }`} />
                  <span className="text-xs text-slate-600">
                    {client.prediction === "satisfied" 
                      ? "Client showing strong satisfaction signals. High retention probability."
                      : client.prediction === "neutral"
                        ? "Monitor engagement levels. Consider proactive outreach."
                        : "Immediate attention required. Risk of churn detected."
                    }
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
