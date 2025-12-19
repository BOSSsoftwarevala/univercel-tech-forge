import { motion } from "framer-motion";
import { TrendingUp, Zap, ArrowUpRight, Star, Users, Target, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface LeadAmplificationEngineProps {
  fullView?: boolean;
}

const LeadAmplificationEngine = ({ fullView = false }: LeadAmplificationEngineProps) => {
  const highPotentialLeads = [
    { id: 1, source: "Enterprise Demo", score: 94, status: "hot", assignedTo: "Reseller-M3K", value: "₹5L" },
    { id: 2, source: "Franchise Page", score: 88, status: "warm", assignedTo: "Franchise-P2Q", value: "₹12L" },
    { id: 3, source: "LinkedIn Ad", score: 85, status: "hot", assignedTo: "Sales-A7X", value: "₹2.5L" },
    { id: 4, source: "Influencer Link", score: 82, status: "warm", assignedTo: "Reseller-K1L", value: "₹1.8L" },
  ];

  const amplificationStats = [
    { label: "Auto-Boosted", value: 156, change: 23, color: "emerald" },
    { label: "Routed to Resellers", value: 89, change: 12, color: "cyan" },
    { label: "Franchise Leads", value: 34, change: 8, color: "orange" },
  ];

  const conversionFunnel = [
    { stage: "Visitors", count: 12450, color: "slate" },
    { stage: "Engaged", count: 3420, color: "cyan" },
    { stage: "Leads", count: 847, color: "teal" },
    { stage: "Qualified", count: 312, color: "emerald" },
  ];

  return (
    <Card className={`bg-slate-900/50 border-teal-500/20 backdrop-blur-xl ${fullView ? "min-h-[700px]" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-teal-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Lead Amplification
          </CardTitle>
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
            <Zap className="w-3 h-3 mr-1" />
            AI Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amplification Stats */}
        <div className="grid grid-cols-3 gap-2">
          {amplificationStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg bg-${stat.color}-500/10 border border-${stat.color}-500/20 text-center`}
            >
              <p className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
              <span className={`text-xs text-${stat.color}-400`}>+{stat.change} today</span>
            </motion.div>
          ))}
        </div>

        {/* High Potential Leads */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            High-Potential Leads
          </h4>
          {highPotentialLeads.slice(0, fullView ? 4 : 3).map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  lead.status === "hot" ? "bg-orange-500/20" : "bg-amber-500/20"
                }`}>
                  <span className="text-lg font-bold text-white">{lead.score}</span>
                </div>
                <div>
                  <p className="text-sm text-slate-200">{lead.source}</p>
                  <p className="text-xs text-slate-500">→ {lead.assignedTo}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={lead.status === "hot" ? "bg-orange-500/20 text-orange-400" : "bg-amber-500/20 text-amber-400"}>
                  {lead.status}
                </Badge>
                <p className="text-xs text-emerald-400 mt-1">{lead.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Conversion Funnel */}
        {fullView && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
          >
            <h4 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-teal-400" />
              Conversion Funnel
            </h4>
            <div className="space-y-3">
              {conversionFunnel.map((stage, index) => (
                <div key={stage.stage} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">{stage.stage}</span>
                    <span className="text-slate-200 font-medium">{stage.count.toLocaleString()}</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stage.count / conversionFunnel[0].count) * 100}%` }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                      className={`h-full bg-${stage.color}-500 rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadAmplificationEngine;
