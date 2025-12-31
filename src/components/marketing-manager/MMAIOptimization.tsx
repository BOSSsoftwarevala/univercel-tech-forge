import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AIAlert {
  id: string;
  type: "headline" | "copy" | "channel" | "ctr_prediction";
  title: string;
  suggestion: string;
  confidence: number;
  impact: "high" | "medium" | "low";
  campaign: string;
  status: "new" | "reviewed" | "applied" | "dismissed";
  reasoning: string;
}

const mockAlerts: AIAlert[] = [
  {
    id: "ai-001",
    type: "headline",
    title: "Headline Optimization",
    suggestion: "Replace 'Get Started Today' with 'Start Your Free Trial Now' for +15% CTR",
    confidence: 87,
    impact: "high",
    campaign: "Q1 Lead Generation",
    status: "new",
    reasoning: "Based on A/B test data from similar campaigns, action-oriented headlines with 'free' keyword perform better.",
  },
  {
    id: "ai-002",
    type: "copy",
    title: "Copy Enhancement",
    suggestion: "Shorten body copy by 20% and add social proof elements",
    confidence: 72,
    impact: "medium",
    campaign: "Brand Awareness Social",
    status: "reviewed",
    reasoning: "Analysis shows users engage more with concise copy and trust signals on this channel.",
  },
  {
    id: "ai-003",
    type: "channel",
    title: "Channel Recommendation",
    suggestion: "Increase Meta Ads budget by 15%, reduce Google Ads by 10%",
    confidence: 65,
    impact: "high",
    campaign: "Demo Request Campaign",
    status: "new",
    reasoning: "Current Meta CPA is 18% lower with similar lead quality scores.",
  },
  {
    id: "ai-004",
    type: "ctr_prediction",
    title: "CTR Prediction Alert",
    suggestion: "Expected CTR drop of 8% next week due to audience fatigue",
    confidence: 78,
    impact: "medium",
    campaign: "Q1 Lead Generation",
    status: "new",
    reasoning: "Frequency metrics indicate oversaturation. Consider creative refresh.",
  },
];

const MMAIOptimization = () => {
  const [alerts, setAlerts] = useState<AIAlert[]>(mockAlerts);
  const [showReasoning, setShowReasoning] = useState<string | null>(null);

  const getTypeIcon = (type: AIAlert["type"]) => {
    switch (type) {
      case "headline": return <Lightbulb className="h-4 w-4 text-amber-400" />;
      case "copy": return <Target className="h-4 w-4 text-purple-400" />;
      case "channel": return <TrendingUp className="h-4 w-4 text-cyan-400" />;
      case "ctr_prediction": return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getImpactBadge = (impact: AIAlert["impact"]) => {
    switch (impact) {
      case "high":
        return <Badge className="bg-red-500/20 text-red-400">High Impact</Badge>;
      case "medium":
        return <Badge className="bg-amber-500/20 text-amber-400">Medium Impact</Badge>;
      case "low":
        return <Badge className="bg-slate-500/20 text-slate-400">Low Impact</Badge>;
      default:
        return null;
    }
  };

  const handleReview = (id: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, status: "reviewed" } : a
    ));
    toast({
      title: "Alert Reviewed",
      description: `AI suggestion ${id} marked as reviewed. Action logged.`,
    });
  };

  const handleDismiss = (id: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, status: "dismissed" } : a
    ));
    toast({
      title: "Alert Dismissed",
      description: `AI suggestion ${id} dismissed. Reason will be logged.`,
    });
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-100">
            <Brain className="h-5 w-5 text-pink-400" />
            AI Optimization Alerts
          </CardTitle>
          <Badge variant="outline" className="bg-pink-500/20 text-pink-400 border-pink-500/30">
            {alerts.filter(a => a.status === "new").length} New
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Critical Warning */}
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-xs text-red-400 font-medium">
            ⚠️ AI AUTO-PUBLISH IS BLOCKED. All suggestions require manual review
            and approval workflow.
          </p>
        </div>

        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${
              alert.status === "dismissed" 
                ? "bg-slate-800/30 border-slate-700/30 opacity-60" 
                : "bg-slate-800/50 border-slate-700/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-slate-900/50">
                {getTypeIcon(alert.type)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-slate-100">{alert.title}</h4>
                    <p className="text-xs text-slate-400">{alert.campaign}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getImpactBadge(alert.impact)}
                    <Badge className="bg-slate-700/50 text-slate-300">
                      {alert.confidence}% confident
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-slate-200">{alert.suggestion}</p>

                {/* AI Reasoning (expandable) */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 text-xs text-blue-400 hover:text-blue-300 p-0"
                  onClick={() => setShowReasoning(showReasoning === alert.id ? null : alert.id)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  {showReasoning === alert.id ? "Hide" : "View"} AI Logic
                </Button>

                {showReasoning === alert.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 rounded bg-slate-900/50 text-xs text-slate-400"
                  >
                    <p className="font-medium text-slate-300 mb-1">AI Reasoning:</p>
                    <p>{alert.reasoning}</p>
                  </motion.div>
                )}

                {/* Actions */}
                {alert.status === "new" && (
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-emerald-400 hover:text-emerald-300"
                      onClick={() => handleReview(alert.id)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Mark Reviewed
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-red-400 hover:text-red-300"
                      onClick={() => handleDismiss(alert.id)}
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Dismiss
                    </Button>
                  </div>
                )}

                {alert.status === "reviewed" && (
                  <Badge className="bg-emerald-500/20 text-emerald-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Reviewed
                  </Badge>
                )}

                {alert.status === "dismissed" && (
                  <Badge className="bg-slate-500/20 text-slate-400">
                    <XCircle className="h-3 w-3 mr-1" />
                    Dismissed
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MMAIOptimization;
