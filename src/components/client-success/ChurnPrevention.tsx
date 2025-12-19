import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  TrendingDown, 
  Shield,
  Heart,
  BookOpen,
  MessageSquare,
  Handshake,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const atRiskClients = [
  {
    id: "1",
    name: "StartupX",
    riskScore: 78,
    triggers: ["Delivery delay", "Multiple complaints", "Low engagement"],
    prediction: "High cancellation risk within 30 days",
    suggestions: [
      { type: "training", label: "Offer personalized training session" },
      { type: "trust", label: "Schedule executive check-in call" },
      { type: "explain", label: "Provide detailed project timeline" },
    ],
    ltv: "$12,000",
    daysAsClient: 45,
  },
  {
    id: "2",
    name: "SmallBiz Corp",
    riskScore: 62,
    triggers: ["Feature confusion", "Low feature adoption"],
    prediction: "Moderate risk - may not renew",
    suggestions: [
      { type: "training", label: "Deploy feature walkthrough videos" },
      { type: "value", label: "Highlight unused premium features" },
    ],
    ltv: "$8,500",
    daysAsClient: 90,
  },
  {
    id: "3",
    name: "RetailPro",
    riskScore: 45,
    triggers: ["Billing inquiry", "Support ticket surge"],
    prediction: "Early warning - needs attention",
    suggestions: [
      { type: "explain", label: "Clarify billing structure" },
      { type: "trust", label: "Proactive support outreach" },
    ],
    ltv: "$24,000",
    daysAsClient: 180,
  },
];

const preventionStrategies = [
  { id: "value", label: "Value Addition", icon: Heart, desc: "Highlight underused features", color: "teal" },
  { id: "training", label: "Training", icon: BookOpen, desc: "Personalized education", color: "violet" },
  { id: "explain", label: "Explanation", icon: MessageSquare, desc: "Clear communication", color: "amber" },
  { id: "trust", label: "Trust Touchpoints", icon: Handshake, desc: "Relationship building", color: "emerald" },
];

const getRiskColor = (score: number) => {
  if (score >= 70) return "text-rose-600";
  if (score >= 50) return "text-amber-600";
  return "text-emerald-600";
};

const getRiskBg = (score: number) => {
  if (score >= 70) return "from-rose-50 to-red-50";
  if (score >= 50) return "from-amber-50 to-orange-50";
  return "from-emerald-50 to-teal-50";
};

export const ChurnPrevention = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Churn Prevention Algorithm</h2>
        <p className="text-slate-500 text-sm mt-1">AI-powered risk detection and retention strategies</p>
      </div>

      {/* Prevention Strategies */}
      <div className="grid grid-cols-4 gap-4">
        {preventionStrategies.map((strategy, index) => {
          const Icon = strategy.icon;
          return (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-4 bg-gradient-to-r from-${strategy.color}-50 to-white border-${strategy.color}-200/50 shadow-lg`}>
                <div className={`w-10 h-10 rounded-lg bg-${strategy.color}-100 flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 text-${strategy.color}-600`} />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm">{strategy.label}</h3>
                <p className="text-xs text-slate-500">{strategy.desc}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Important Notice */}
      <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/50 shadow-lg">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-amber-600" />
          <div>
            <p className="font-semibold text-amber-800">No Discounts Policy</p>
            <p className="text-sm text-amber-700">
              We retain clients through value, training, and trust — not discounts. 
              Focus on demonstrating ROI and building relationships.
            </p>
          </div>
        </div>
      </Card>

      {/* At-Risk Clients */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
          At-Risk Clients
        </h3>
        
        {atRiskClients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`p-5 bg-gradient-to-r ${getRiskBg(client.riskScore)} border-slate-200/50 shadow-lg`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-slate-800">{client.name}</h4>
                    <Badge className={`${client.riskScore >= 70 ? "bg-rose-100 text-rose-700" : client.riskScore >= 50 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {client.riskScore >= 70 ? "High Risk" : client.riskScore >= 50 ? "Medium Risk" : "Low Risk"}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">LTV: {client.ltv} | {client.daysAsClient} days as client</p>
                </div>
                
                <div className="text-right">
                  <p className={`text-3xl font-bold ${getRiskColor(client.riskScore)}`}>{client.riskScore}%</p>
                  <p className="text-xs text-slate-500">Risk Score</p>
                </div>
              </div>

              {/* Risk Gauge */}
              <div className="mb-4">
                <Progress value={client.riskScore} className="h-2" />
              </div>

              {/* Triggers */}
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2">Risk Triggers</p>
                <div className="flex flex-wrap gap-2">
                  {client.triggers.map((trigger, i) => (
                    <Badge key={i} variant="outline" className="bg-white/50 text-slate-600 text-xs">
                      <TrendingDown className="w-3 h-3 mr-1 text-rose-500" />
                      {trigger}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* AI Prediction */}
              <div className="p-3 rounded-lg bg-white/60 border border-slate-200/50 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <span className="text-xs font-semibold text-violet-700">AI Prediction</span>
                </div>
                <p className="text-sm text-slate-700">{client.prediction}</p>
              </div>

              {/* Suggested Actions */}
              <div className="space-y-2">
                <p className="text-xs text-slate-500">Recommended Retention Actions</p>
                <div className="flex flex-wrap gap-2">
                  {client.suggestions.map((suggestion, i) => {
                    const strategy = preventionStrategies.find(s => s.id === suggestion.type);
                    const Icon = strategy?.icon || Heart;
                    
                    return (
                      <motion.button
                        key={i}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-${strategy?.color || "slate"}-200 hover:bg-${strategy?.color || "slate"}-50 transition-all text-sm`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className={`w-4 h-4 text-${strategy?.color || "slate"}-600`} />
                        <span className="text-slate-700">{suggestion.label}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
