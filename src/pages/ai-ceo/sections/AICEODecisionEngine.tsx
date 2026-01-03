import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  Send
} from "lucide-react";

// Mock decisions data
const decisions = [
  { 
    id: 1, 
    action: "Approve franchise payout request ($8,500)", 
    requestedBy: "Franchise #234",
    type: "financial",
    aiDecision: "approve",
    confidence: 94,
    reasoning: "Clean transaction history, within limits, no fraud flags",
    historicalOutcome: "98% approval rate for similar"
  },
  { 
    id: 2, 
    action: "Delay bulk user creation (150 users)", 
    requestedBy: "Admin #8",
    type: "user_management",
    aiDecision: "delay",
    confidence: 78,
    reasoning: "Unusual volume, recommend manual review",
    historicalOutcome: "65% delayed for review historically"
  },
  { 
    id: 3, 
    action: "Reject permission escalation request", 
    requestedBy: "Country Head APAC",
    type: "security",
    aiDecision: "reject",
    confidence: 89,
    reasoning: "Request exceeds role boundaries, potential policy violation",
    historicalOutcome: "92% rejected for similar patterns"
  },
  { 
    id: 4, 
    action: "Escalate server access request to Boss", 
    requestedBy: "Developer #3",
    type: "infrastructure",
    aiDecision: "escalate",
    confidence: 85,
    reasoning: "Production access request requires explicit approval",
    historicalOutcome: "100% escalated per policy"
  },
];

const getDecisionColor = (decision: string) => {
  switch (decision) {
    case 'approve': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' };
    case 'reject': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' };
    case 'delay': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' };
    case 'escalate': return { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30' };
    default: return { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' };
  }
};

const getDecisionIcon = (decision: string) => {
  switch (decision) {
    case 'approve': return CheckCircle;
    case 'reject': return XCircle;
    case 'delay': return Clock;
    case 'escalate': return Send;
    default: return AlertTriangle;
  }
};

const AICEODecisionEngine = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/20">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Decision Engine</h1>
            <p className="text-cyan-400/80">AI-powered decision recommendations</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">
            <Brain className="w-3 h-3 mr-1" />
            ML Model v3.2
          </Badge>
        </div>
      </div>

      {/* Decision Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Approve", count: 156, icon: CheckCircle, color: "text-emerald-400" },
          { label: "Delay", count: 23, icon: Clock, color: "text-yellow-400" },
          { label: "Reject", count: 12, icon: XCircle, color: "text-red-400" },
          { label: "Escalate", count: 8, icon: Send, color: "text-violet-400" },
        ].map((stat, i) => (
          <Card key={stat.label} className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-4 flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <p className="text-lg font-bold text-white">{stat.count}</p>
                <p className="text-xs text-slate-400">{stat.label} Today</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Decision Queue */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-violet-400" />
            Active Decision Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[450px]">
            <div className="space-y-4">
              {decisions.map((decision, i) => {
                const colors = getDecisionColor(decision.aiDecision);
                const Icon = getDecisionIcon(decision.aiDecision);
                
                return (
                  <motion.div
                    key={decision.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-5 rounded-xl bg-slate-800/50 border ${colors.border} hover:shadow-lg transition-all`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${colors.text}`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{decision.action}</h3>
                          <p className="text-sm text-slate-400">Requested by: {decision.requestedBy}</p>
                        </div>
                      </div>
                      <Badge className={`${colors.bg} ${colors.text} uppercase`}>
                        {decision.aiDecision}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-400">AI Confidence:</span>
                        <div className="flex-1 flex items-center gap-2">
                          <Progress value={decision.confidence} className="h-2 flex-1" />
                          <span className={`text-sm font-medium ${colors.text}`}>{decision.confidence}%</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                        <p className="text-sm text-slate-400">
                          <Brain className="w-4 h-4 inline mr-2 text-violet-400" />
                          <strong className="text-violet-400">AI Reasoning:</strong> {decision.reasoning}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <TrendingUp className="w-3 h-3" />
                        <span>Historical: {decision.historicalOutcome}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-700/30 flex items-center justify-end gap-2">
                      <p className="text-xs text-slate-500 flex-1">Awaiting Boss/CEO approval</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* AI Notice */}
      <div className="p-4 rounded-lg bg-violet-500/5 border border-violet-500/20">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-violet-400" />
          <p className="text-sm text-violet-400/80">
            <strong>Decision Engine Notice:</strong> AI provides recommendations only. All decisions require explicit approval from Boss or CEO.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICEODecisionEngine;
