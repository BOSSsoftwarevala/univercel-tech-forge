import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Eye, AlertTriangle, TrendingUp, Shield, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface BehaviorScore {
  category: string;
  score: number;
  trend: 'stable' | 'improving' | 'declining';
  flags: string[];
}

interface RiskFlag {
  id: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: string;
  actionRequired: boolean;
}

interface AIObservationPanelProps {
  valaId: string;
  behaviorScores: BehaviorScore[];
  riskFlags: RiskFlag[];
  overallRiskScore: number;
}

export function AIObservationPanel({
  valaId,
  behaviorScores,
  riskFlags,
  overallRiskScore
}: AIObservationPanelProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 bg-red-950/50 border-red-800/50';
      case 'high': return 'text-orange-400 bg-orange-950/50 border-orange-800/50';
      case 'medium': return 'text-yellow-400 bg-yellow-950/50 border-yellow-800/50';
      default: return 'text-blue-400 bg-blue-950/50 border-blue-800/50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return '[&>div]:bg-green-500';
    if (score >= 60) return '[&>div]:bg-yellow-500';
    if (score >= 40) return '[&>div]:bg-orange-500';
    return '[&>div]:bg-red-500';
  };

  return (
    <Card className="bg-neutral-900/50 border-neutral-800 select-none">
      <CardHeader className="border-b border-neutral-800">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-neutral-300">
            <div className="w-8 h-8 rounded bg-purple-950/50 flex items-center justify-center">
              <Brain className="h-4 w-4 text-purple-400" />
            </div>
            AI Observation
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-neutral-800 text-neutral-400 border-neutral-700">
              <Eye className="h-3 w-3 mr-1" />
              READ-ONLY
            </Badge>
            <Badge variant="outline" className="bg-neutral-800 text-neutral-400 border-neutral-700">
              <Lock className="h-3 w-3 mr-1" />
              NO EXECUTE
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* AI Constraints Notice */}
        <div className="p-3 rounded bg-purple-950/20 border border-purple-900/30">
          <p className="text-xs text-purple-300 flex items-center gap-2">
            <Brain className="h-3 w-3" />
            AI observes silently • Cannot execute, approve, or edit • Reports upward only
          </p>
        </div>

        {/* Overall Risk Score */}
        <div className="text-center">
          <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Overall Risk Score</div>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`text-4xl font-mono font-bold ${getScoreColor(100 - overallRiskScore)}`}
          >
            {overallRiskScore}
          </motion.div>
          <Progress 
            value={overallRiskScore} 
            className={`h-2 mt-3 bg-neutral-800 ${getProgressColor(100 - overallRiskScore)}`}
          />
        </div>

        {/* Behavior Scores */}
        <div>
          <div className="text-xs text-neutral-500 uppercase tracking-wider mb-3">Behavior Analysis</div>
          <div className="space-y-3">
            {behaviorScores.map((score, index) => (
              <motion.div
                key={score.category}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded bg-neutral-950 border border-neutral-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-400">{score.category}</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-sm ${getScoreColor(score.score)}`}>
                      {score.score}%
                    </span>
                    {score.trend === 'improving' && (
                      <TrendingUp className="h-3 w-3 text-green-400" />
                    )}
                    {score.trend === 'declining' && (
                      <TrendingUp className="h-3 w-3 text-red-400 transform rotate-180" />
                    )}
                  </div>
                </div>
                <Progress 
                  value={score.score} 
                  className={`h-1 bg-neutral-800 ${getProgressColor(score.score)}`}
                />
                {score.flags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {score.flags.map((flag, i) => (
                      <Badge key={i} variant="outline" className="text-xs bg-neutral-900 text-neutral-500 border-neutral-700">
                        {flag}
                      </Badge>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Risk Flags */}
        <div>
          <div className="text-xs text-neutral-500 uppercase tracking-wider mb-3">Risk Flags</div>
          <div className="space-y-2">
            {riskFlags.length === 0 ? (
              <div className="p-3 rounded bg-green-950/20 border border-green-900/30 text-center">
                <Shield className="h-4 w-4 text-green-400 mx-auto mb-1" />
                <span className="text-xs text-green-400">No risk flags detected</span>
              </div>
            ) : (
              riskFlags.map((flag, index) => (
                <motion.div
                  key={flag.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded border ${getRiskColor(flag.level)}`}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm">{flag.description}</div>
                      <div className="text-xs opacity-60 mt-1">{flag.detectedAt}</div>
                    </div>
                    <Badge variant="outline" className="text-xs uppercase">
                      {flag.level}
                    </Badge>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Report Status */}
        <div className="pt-4 border-t border-neutral-800">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Report submitted upward only</span>
            <span className="font-mono">Target: {valaId}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
