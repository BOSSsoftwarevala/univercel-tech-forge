import { motion } from "framer-motion";
import { 
  Brain, TrendingUp, Target, AlertCircle, User,
  BarChart3, Zap, Award, History
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const LeadScoringPrediction = () => {
  const scoredLeads = [
    {
      id: "1",
      name: "Ahmed Hassan",
      score: 92,
      conversionProbability: 87,
      recommendedHandler: "vala(sales)4771",
      handlerReason: "87% success rate with POS leads",
      riskFactors: ["Budget confirmation pending"],
      signals: ["Multi-branch interest", "Urgent timeline", "Repeat visitor"],
    },
    {
      id: "2",
      name: "Priya Sharma",
      score: 95,
      conversionProbability: 94,
      recommendedHandler: "vala(franchise)2891",
      handlerReason: "92% success rate with Government education",
      riskFactors: [],
      signals: ["Government contract", "500+ student capacity", "Decision maker engaged"],
    },
    {
      id: "3",
      name: "Mohammed Al-Rashid",
      score: 78,
      conversionProbability: 65,
      recommendedHandler: "vala(sales)1234",
      handlerReason: "Healthcare vertical specialist",
      riskFactors: ["Long decision cycle", "Multiple stakeholders"],
      signals: ["Private hospital", "Full integration request"],
    },
    {
      id: "4",
      name: "Sarah Chen",
      score: 68,
      conversionProbability: 52,
      recommendedHandler: "vala(reseller)5678",
      handlerReason: "Local market expertise",
      riskFactors: ["Price sensitivity", "Competitor evaluation"],
      signals: ["Multi-location retail", "Quick response needed"],
    },
  ];

  const scoreDistribution = [
    { range: "90-100", count: 12, label: "Hot", color: "bg-red-500" },
    { range: "70-89", count: 28, label: "Warm", color: "bg-orange-500" },
    { range: "50-69", count: 34, label: "Moderate", color: "bg-yellow-500" },
    { range: "0-49", count: 18, label: "Cold", color: "bg-blue-500" },
  ];

  const aiInsights = [
    { metric: "Avg. Score Accuracy", value: "94%", trend: "+2%" },
    { metric: "Conversion Predictions", value: "89%", trend: "+5%" },
    { metric: "Handler Match Success", value: "87%", trend: "+3%" },
    { metric: "Risk Detection Rate", value: "92%", trend: "+1%" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-red-400";
    if (score >= 70) return "text-orange-400";
    if (score >= 50) return "text-yellow-400";
    return "text-blue-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-red-500/20 border-red-500/30";
    if (score >= 70) return "bg-orange-500/20 border-orange-500/30";
    if (score >= 50) return "bg-yellow-500/20 border-yellow-500/30";
    return "bg-blue-500/20 border-blue-500/30";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-400" />
            Lead Scoring & Conversion Prediction
          </h2>
          <p className="text-slate-400">AI-powered likelihood analysis and handler recommendation</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500">
          <Zap className="w-4 h-4 mr-2" />
          Recalculate All Scores
        </Button>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-4 gap-4">
        {aiInsights.map((insight, index) => (
          <motion.div
            key={insight.metric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <span className="text-xs text-green-400">{insight.trend}</span>
            </div>
            <p className="text-2xl font-bold text-white">{insight.value}</p>
            <p className="text-xs text-slate-400">{insight.metric}</p>
          </motion.div>
        ))}
      </div>

      {/* Score Distribution */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
        <h3 className="font-semibold text-white mb-4">Score Distribution</h3>
        <div className="flex items-end gap-4 h-32">
          {scoreDistribution.map((segment, index) => (
            <motion.div
              key={segment.range}
              initial={{ height: 0 }}
              animate={{ height: `${(segment.count / 34) * 100}%` }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex-1 flex flex-col justify-end"
            >
              <div className={`${segment.color} rounded-t-lg transition-all relative group`} style={{ height: "100%" }}>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-white font-bold">
                  {segment.count}
                </div>
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs font-medium text-white">{segment.label}</p>
                <p className="text-xs text-slate-500">{segment.range}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scored Leads */}
      <div className="space-y-4">
        <h3 className="font-semibold text-white">Scored Leads with Predictions</h3>
        
        {scoredLeads.map((lead, index) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4"
          >
            <div className="flex items-start gap-4">
              {/* Score Circle */}
              <div className={`w-20 h-20 rounded-xl flex flex-col items-center justify-center border ${getScoreBg(lead.score)}`}>
                <span className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
                  {lead.score}
                </span>
                <span className="text-xs text-slate-400">Score</span>
              </div>

              {/* Lead Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-white">{lead.name}</h4>
                  <Badge className="bg-green-500/20 text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {lead.conversionProbability}% conversion chance
                  </Badge>
                </div>

                {/* Signals */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {lead.signals.map((signal, i) => (
                    <Badge key={i} variant="outline" className="text-slate-400 text-xs">
                      {signal}
                    </Badge>
                  ))}
                </div>

                {/* Risk Factors */}
                {lead.riskFactors.length > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-orange-400">
                      Risk: {lead.riskFactors.join(", ")}
                    </span>
                  </div>
                )}
              </div>

              {/* Recommended Handler */}
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-3 w-64">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs text-indigo-400 font-medium">AI Recommendation</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">{lead.recommendedHandler}</span>
                </div>
                <p className="text-xs text-slate-400">{lead.handlerReason}</p>
                <Button size="sm" className="w-full mt-2 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30">
                  Assign Handler
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scoring Factors */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
        <h4 className="font-semibold text-white mb-3">Scoring Factors (Weighted)</h4>
        <div className="grid grid-cols-5 gap-3">
          {[
            { factor: "Budget Clarity", weight: 25 },
            { factor: "Timeline Urgency", weight: 20 },
            { factor: "Decision Authority", weight: 20 },
            { factor: "Engagement Level", weight: 15 },
            { factor: "Fit Score", weight: 20 },
          ].map((item, index) => (
            <div key={item.factor} className="p-3 bg-slate-800/50 rounded-lg text-center">
              <p className="text-white font-medium text-sm">{item.factor}</p>
              <p className="text-lg font-bold text-indigo-400">{item.weight}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadScoringPrediction;
