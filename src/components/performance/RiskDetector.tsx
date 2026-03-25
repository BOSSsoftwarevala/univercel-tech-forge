import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  Clock, 
  MessageSquare, 
  RefreshCw,
  AlertCircle,
  Shield,
  TrendingDown
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const riskFlags = [
  {
    id: "1",
    member: "vala(support)2341",
    role: "Support",
    riskLevel: "high",
    riskScore: 78,
    flags: [
      { type: "delays", label: "Repeated Delays", count: 5 },
      { type: "communication", label: "Poor Communication", count: 3 },
    ],
    trend: "worsening",
    lastUpdate: "2 hours ago",
    aiRecommendation: "Immediate workload review recommended. Consider training on time management.",
  },
  {
    id: "2",
    member: "vala(dev)8823",
    role: "Developer",
    riskLevel: "medium",
    riskScore: 52,
    flags: [
      { type: "rework", label: "High Rework Rate", count: 4 },
    ],
    trend: "stable",
    lastUpdate: "1 day ago",
    aiRecommendation: "Review requirements gathering process. Suggest code review before delivery.",
  },
  {
    id: "3",
    member: "vala(reseller)4456",
    role: "Reseller",
    riskLevel: "low",
    riskScore: 28,
    flags: [
      { type: "complaints", label: "Complaint Triggers", count: 2 },
    ],
    trend: "improving",
    lastUpdate: "3 days ago",
    aiRecommendation: "Minor attention needed. Continue monitoring engagement quality.",
  },
];

const getRiskColor = (level: string) => {
  switch (level) {
    case "high": return "bg-rose-500/20 text-rose-400 border-rose-500/50";
    case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
    case "low": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
    default: return "bg-slate-500/20 text-slate-400 border-slate-500/50";
  }
};

const getRiskBarColor = (level: string) => {
  switch (level) {
    case "high": return "from-rose-500 to-red-500";
    case "medium": return "from-amber-500 to-orange-500";
    case "low": return "from-emerald-500 to-green-500";
    default: return "from-slate-500 to-gray-500";
  }
};

const getFlagIcon = (type: string) => {
  switch (type) {
    case "delays": return <Clock className="w-3 h-3" />;
    case "communication": return <MessageSquare className="w-3 h-3" />;
    case "rework": return <RefreshCw className="w-3 h-3" />;
    case "complaints": return <AlertCircle className="w-3 h-3" />;
    default: return <AlertTriangle className="w-3 h-3" />;
  }
};

export const RiskDetector = () => {
  const highRiskCount = riskFlags.filter(r => r.riskLevel === "high").length;
  const mediumRiskCount = riskFlags.filter(r => r.riskLevel === "medium").length;
  const lowRiskCount = riskFlags.filter(r => r.riskLevel === "low").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          Performance Risk Detector
        </h2>
        <p className="text-slate-400 text-sm mt-1">Early warning system for performance issues — AI-powered detection</p>
      </div>

      {/* Risk Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { level: "High Risk", count: highRiskCount, color: "rose" },
          { level: "Medium Risk", count: mediumRiskCount, color: "amber" },
          { level: "Low Risk", count: lowRiskCount, color: "emerald" },
        ].map((stat, index) => (
          <motion.div
            key={stat.level}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`p-4 bg-slate-900/50 backdrop-blur-xl border-${stat.color}-500/30`}>
              <div className="flex items-center justify-between mb-2">
                <Shield className={`w-5 h-5 text-${stat.color}-400`} />
                <motion.span
                  className={`text-3xl font-bold text-${stat.color}-400`}
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {stat.count}
                </motion.span>
              </div>
              <p className="text-sm text-slate-400">{stat.level}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Risk Flags */}
      <div className="space-y-4">
        {riskFlags.map((risk, index) => (
          <motion.div
            key={risk.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`p-5 bg-slate-900/50 backdrop-blur-xl border-l-4 ${
              risk.riskLevel === "high" ? "border-l-rose-500" :
              risk.riskLevel === "medium" ? "border-l-amber-500" : "border-l-emerald-500"
            } border-cyan-500/20`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-white">{risk.member}</h3>
                    <Badge className="bg-cyan-500/20 text-cyan-400">{risk.role}</Badge>
                    <Badge className={getRiskColor(risk.riskLevel)}>
                      {risk.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">Last updated: {risk.lastUpdate}</p>
                </div>

                <div className="text-right">
                  <p className={`text-2xl font-bold ${
                    risk.riskLevel === "high" ? "text-rose-400" :
                    risk.riskLevel === "medium" ? "text-amber-400" : "text-emerald-400"
                  }`}>
                    {risk.riskScore}
                  </p>
                  <p className="text-xs text-slate-500">Risk Score</p>
                </div>
              </div>

              {/* Risk Score Bar */}
              <div className="mb-4">
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${getRiskBarColor(risk.riskLevel)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${risk.riskScore}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>

              {/* Flags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {risk.flags.map((flag, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50"
                  >
                    {getFlagIcon(flag.type)}
                    <span className="text-sm text-slate-300">{flag.label}</span>
                    <span className="text-xs text-rose-400 font-semibold">×{flag.count}</span>
                  </div>
                ))}
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${
                  risk.trend === "worsening" ? "bg-rose-500/10 text-rose-400" :
                  risk.trend === "improving" ? "bg-emerald-500/10 text-emerald-400" :
                  "bg-slate-500/10 text-slate-400"
                }`}>
                  <TrendingDown className={`w-3 h-3 ${risk.trend === "improving" ? "rotate-180" : ""}`} />
                  <span className="text-xs capitalize">{risk.trend}</span>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-cyan-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-cyan-300 font-semibold mb-1">AI Recommendation</p>
                    <p className="text-sm text-slate-300">{risk.aiRecommendation}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4">
                <Button size="sm" className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/50">
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="border-slate-700 text-slate-400">
                  Apply Corrective Action
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
