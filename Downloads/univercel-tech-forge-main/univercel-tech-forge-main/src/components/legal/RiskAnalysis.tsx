import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Shield,
  Eye,
  Flag,
  Sparkles
} from "lucide-react";

const RiskAnalysis = () => {
  const riskFlags = [
    { id: 1, title: "Source Code Access Anomaly", category: "IP", risk: "high", detected: "2 hours ago", description: "Unusual download pattern from Dev-Q4T" },
    { id: 2, title: "Contract Expiry Cluster", category: "Contract", risk: "medium", detected: "1 day ago", description: "12 agreements expiring in next 30 days" },
    { id: 3, title: "Compliance Gap - GDPR", category: "Compliance", risk: "medium", detected: "3 days ago", description: "Data retention policy needs update" },
    { id: 4, title: "Payment Dispute Pattern", category: "Financial", risk: "low", detected: "5 days ago", description: "3 disputes from same region" },
  ];

  const riskMetrics = [
    { category: "IP Protection", score: 85, trend: "up", change: "+3%" },
    { category: "Contract Compliance", score: 92, trend: "stable", change: "0%" },
    { category: "Data Privacy", score: 88, trend: "down", change: "-2%" },
    { category: "Financial Risk", score: 94, trend: "up", change: "+5%" },
  ];

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "high":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/40">High Risk</Badge>;
      case "medium":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40">Medium Risk</Badge>;
      case "low":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">Low Risk</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Risk Analysis & Flags</h2>
          <p className="text-stone-500">AI-powered risk detection and monitoring</p>
        </div>
        <Badge className="bg-amber-600/20 text-amber-400 border-amber-600/40">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Monitoring Active
        </Badge>
      </div>

      {/* Risk Score Overview */}
      <div className="grid grid-cols-4 gap-4">
        {riskMetrics.map((metric, index) => (
          <motion.div
            key={metric.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-stone-900/80 border-stone-800/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-stone-400 text-sm">{metric.category}</p>
                  <div className={`flex items-center gap-1 text-xs ${
                    metric.trend === "up" ? "text-emerald-400" :
                    metric.trend === "down" ? "text-red-400" :
                    "text-stone-500"
                  }`}>
                    {metric.trend === "up" && <TrendingUp className="w-3 h-3" />}
                    {metric.trend === "down" && <TrendingDown className="w-3 h-3" />}
                    {metric.change}
                  </div>
                </div>
                <p className={`text-3xl font-bold ${
                  metric.score >= 90 ? "text-emerald-400" :
                  metric.score >= 80 ? "text-amber-400" :
                  "text-red-400"
                }`}>{metric.score}%</p>
                <Progress value={metric.score} className="h-1.5 mt-3 bg-stone-700" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Overall Risk Gauge */}
      <Card className="bg-stone-900/80 border-stone-800/50">
        <CardHeader className="border-b border-stone-800/50">
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            Overall Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center border-4 border-emerald-500/30"
                >
                  <div className="text-center">
                    <p className="text-4xl font-bold text-emerald-400">LOW</p>
                    <p className="text-xs text-stone-500">Risk Level</p>
                  </div>
                </motion.div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-stone-300">System is operating within safe parameters</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="text-stone-300">4 items require attention</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="text-stone-300">1 critical flag detected</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-stone-800/50 border border-stone-700/50">
              <p className="text-sm text-stone-500 mb-2">AI Recommendation</p>
              <p className="text-stone-300">Review source code access patterns and update GDPR retention policies within 7 days.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Flags */}
      <Card className="bg-stone-900/80 border-stone-800/50">
        <CardHeader className="border-b border-stone-800/50">
          <CardTitle className="text-white flex items-center gap-2">
            <Flag className="w-5 h-5 text-amber-500" />
            Active Risk Flags
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-stone-800/30">
            {riskFlags.map((flag, index) => (
              <motion.div
                key={flag.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 hover:bg-stone-800/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      flag.risk === "high" ? "bg-red-500/20" :
                      flag.risk === "medium" ? "bg-amber-500/20" :
                      "bg-blue-500/20"
                    }`}>
                      <AlertTriangle className={`w-5 h-5 ${
                        flag.risk === "high" ? "text-red-400" :
                        flag.risk === "medium" ? "text-amber-400" :
                        "text-blue-400"
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-medium">{flag.title}</h4>
                        {getRiskBadge(flag.risk)}
                        <Badge className="bg-stone-800/50 text-stone-400 border-stone-700/50 text-xs">
                          {flag.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-stone-500 mt-1">{flag.description}</p>
                      <p className="text-xs text-stone-600 mt-2">Detected: {flag.detected}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 rounded-lg bg-stone-800/50 border border-stone-700/50 text-stone-400 hover:text-amber-400 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAnalysis;
