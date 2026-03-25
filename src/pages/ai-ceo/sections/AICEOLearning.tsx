import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Database, 
  Brain,
  CheckCircle,
  XCircle,
  HelpCircle,
  TrendingUp,
  Clock,
  Zap
} from "lucide-react";

// Mock learning log data
const learningLogs = [
  {
    id: 1,
    observation: "Franchise #101 payment delayed pattern",
    suggestion: "Flag for manual review",
    bossDecision: "approved",
    outcome: "Fraud prevented - $5,200 saved",
    timestamp: "2 hours ago",
    learned: true
  },
  {
    id: 2,
    observation: "Bulk user creation request from Admin #8",
    suggestion: "Delay for verification",
    bossDecision: "overridden",
    outcome: "Legitimate batch import - no issues",
    timestamp: "5 hours ago",
    learned: true
  },
  {
    id: 3,
    observation: "Server CPU spike in APAC region",
    suggestion: "Scale up resources",
    bossDecision: "approved",
    outcome: "Prevented downtime during peak",
    timestamp: "Yesterday",
    learned: true
  },
  {
    id: 4,
    observation: "New user login from unusual location",
    suggestion: "Trigger MFA verification",
    bossDecision: "approved",
    outcome: "Legitimate travel - verified",
    timestamp: "2 days ago",
    learned: true
  },
  {
    id: 5,
    observation: "Support ticket surge detected",
    suggestion: "Allocate extra staff",
    bossDecision: "partially_approved",
    outcome: "Managed with 50% suggested resources",
    timestamp: "3 days ago",
    learned: true
  },
];

const learningStats = {
  totalObservations: 12847,
  accuracyRate: 94.2,
  improvementThisMonth: 2.1,
  decisionsAnalyzed: 3421
};

const getDecisionStyle = (decision: string) => {
  switch (decision) {
    case 'approved': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: CheckCircle };
    case 'overridden': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: HelpCircle };
    case 'partially_approved': return { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: CheckCircle };
    default: return { bg: 'bg-red-500/20', text: 'text-red-400', icon: XCircle };
  }
};

const AICEOLearning = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 via-pink-500 to-rose-600 flex items-center justify-center shadow-xl shadow-purple-500/20">
            <Database className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">System Learning Log</h1>
            <p className="text-cyan-400/80">AI observation and decision learning history</p>
          </div>
        </div>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
          <Brain className="w-3 h-3 mr-1" />
          Continuous Learning
        </Badge>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-2xl font-bold text-white">{learningStats.totalObservations.toLocaleString()}</p>
                <p className="text-xs text-slate-400">Total Observations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-2xl font-bold text-emerald-400">{learningStats.accuracyRate}%</p>
                <p className="text-xs text-slate-400">Accuracy Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-yellow-400">+{learningStats.improvementThisMonth}%</p>
                <p className="text-xs text-slate-400">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-violet-400" />
              <div>
                <p className="text-2xl font-bold text-white">{learningStats.decisionsAnalyzed.toLocaleString()}</p>
                <p className="text-xs text-slate-400">Decisions Analyzed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning History */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-400" />
            Learning History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[450px]">
            <div className="space-y-4">
              {learningLogs.map((log, i) => {
                const decisionStyle = getDecisionStyle(log.bossDecision);
                const DecisionIcon = decisionStyle.icon;
                
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/30 hover:border-purple-500/30 transition-all"
                  >
                    <div className="grid grid-cols-4 gap-4">
                      {/* Observation */}
                      <div>
                        <p className="text-xs text-slate-500 mb-1">AI Observed</p>
                        <p className="text-sm text-white">{log.observation}</p>
                      </div>

                      {/* Suggestion */}
                      <div>
                        <p className="text-xs text-slate-500 mb-1">AI Suggested</p>
                        <p className="text-sm text-cyan-400">{log.suggestion}</p>
                      </div>

                      {/* Boss Decision */}
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Boss Decided</p>
                        <Badge className={`${decisionStyle.bg} ${decisionStyle.text}`}>
                          <DecisionIcon className="w-3 h-3 mr-1" />
                          {log.bossDecision.replace('_', ' ')}
                        </Badge>
                      </div>

                      {/* Outcome */}
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Outcome</p>
                        <p className="text-sm text-emerald-400">{log.outcome}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700/30">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-400">{log.timestamp}</span>
                      </div>
                      {log.learned && (
                        <Badge className="bg-purple-500/20 text-purple-400">
                          <Brain className="w-3 h-3 mr-1" />
                          Pattern Learned
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* AI Notice */}
      <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-purple-400" />
          <p className="text-sm text-purple-400/80">
            <strong>Learning System:</strong> AI continuously learns from Boss/CEO decisions to improve future suggestions. All learnings are transparent and auditable.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICEOLearning;
