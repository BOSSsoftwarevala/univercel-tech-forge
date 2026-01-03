import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CheckSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Eye,
  User,
  Clock,
  AlertTriangle,
  ShieldCheck
} from "lucide-react";

// Mock approval suggestions
const approvalSuggestions = [
  { 
    id: 1, 
    actionName: "Release franchise commission payment", 
    requestedBy: "Finance Team",
    role: "finance",
    riskLevel: "low",
    aiRecommendation: "approve",
    confidence: 96,
    reason: "All verifications passed, within policy limits"
  },
  { 
    id: 2, 
    actionName: "Enable production database access", 
    requestedBy: "Developer #5",
    role: "developer",
    riskLevel: "high",
    aiRecommendation: "review",
    confidence: 72,
    reason: "First-time access request, recommend supervisor approval"
  },
  { 
    id: 3, 
    actionName: "Approve new reseller onboarding", 
    requestedBy: "Sales Lead",
    role: "sales",
    riskLevel: "medium",
    aiRecommendation: "approve",
    confidence: 88,
    reason: "KYC complete, background check passed"
  },
  { 
    id: 4, 
    actionName: "Bulk discount override (15%)", 
    requestedBy: "Country Head EU",
    role: "country_head",
    riskLevel: "medium",
    aiRecommendation: "reject",
    confidence: 81,
    reason: "Exceeds regional discount policy by 5%"
  },
  { 
    id: 5, 
    actionName: "Extend trial period for client", 
    requestedBy: "Support Team",
    role: "support",
    riskLevel: "low",
    aiRecommendation: "approve",
    confidence: 94,
    reason: "High-value prospect, within extension policy"
  },
];

const getRecommendationStyle = (rec: string) => {
  switch (rec) {
    case 'approve': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: ThumbsUp };
    case 'reject': return { bg: 'bg-red-500/20', text: 'text-red-400', icon: ThumbsDown };
    case 'review': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: Eye };
    default: return { bg: 'bg-slate-500/20', text: 'text-slate-400', icon: AlertTriangle };
  }
};

const getRiskStyle = (risk: string) => {
  switch (risk) {
    case 'high': return 'bg-red-500/20 text-red-400';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400';
    default: return 'bg-emerald-500/20 text-emerald-400';
  }
};

const AICEOApprovals = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600 flex items-center justify-center shadow-xl shadow-blue-500/20">
            <CheckSquare className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Approval Suggestions</h1>
            <p className="text-cyan-400/80">AI-recommended approval decisions</p>
          </div>
        </div>
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          {approvalSuggestions.length} Pending
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <ThumbsUp className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-2xl font-bold text-emerald-400">3</p>
              <p className="text-xs text-slate-400">Recommend Approve</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/5 border-yellow-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <Eye className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-2xl font-bold text-yellow-400">1</p>
              <p className="text-xs text-slate-400">Recommend Review</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-500/5 border-red-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <ThumbsDown className="w-6 h-6 text-red-400" />
            <div>
              <p className="text-2xl font-bold text-red-400">1</p>
              <p className="text-xs text-slate-400">Recommend Reject</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suggestions List */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            Pending Approval Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[450px]">
            <div className="space-y-4">
              {approvalSuggestions.map((suggestion, i) => {
                const recStyle = getRecommendationStyle(suggestion.aiRecommendation);
                const RecIcon = recStyle.icon;
                
                return (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/30 hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-white">{suggestion.actionName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span className="text-sm text-slate-400">{suggestion.requestedBy}</span>
                          <Badge variant="outline" className="text-xs">{suggestion.role}</Badge>
                        </div>
                      </div>
                      <Badge className={getRiskStyle(suggestion.riskLevel)}>
                        {suggestion.riskLevel} risk
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${recStyle.bg}`}>
                        <RecIcon className={`w-4 h-4 ${recStyle.text}`} />
                        <span className={`text-sm font-medium ${recStyle.text} uppercase`}>
                          {suggestion.aiRecommendation}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs text-slate-400">Confidence:</span>
                        <Progress value={suggestion.confidence} className="h-1.5 flex-1" />
                        <span className="text-xs font-medium text-cyan-400">{suggestion.confidence}%</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-400 italic">
                      "{suggestion.reason}"
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-700/30 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>Awaiting decision</span>
                      </div>
                      <span className="text-xs text-cyan-400/60">Boss/CEO decides final</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* AI Notice */}
      <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
        <div className="flex items-center gap-3">
          <CheckSquare className="w-5 h-5 text-blue-400" />
          <p className="text-sm text-blue-400/80">
            <strong>Approval Notice:</strong> AI only suggests. Boss/CEO makes all final approval decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICEOApprovals;
