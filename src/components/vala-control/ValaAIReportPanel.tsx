import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, TrendingUp, AlertTriangle, Shield, 
  ArrowUpRight, Eye, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface BehaviorScore {
  valaId: string;
  score: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  flags: string[];
  lastUpdate: number;
}

interface ValaAIReportPanelProps {
  behaviors: BehaviorScore[];
  onSubmitReport?: () => void;
}

export function ValaAIReportPanel({ behaviors, onSubmitReport }: ValaAIReportPanelProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' };
      case 'medium': return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' };
      case 'high': return { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' };
      case 'critical': return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' };
      default: return { bg: 'bg-zinc-500/10', text: 'text-zinc-400', border: 'border-zinc-500/30' };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-mono font-semibold text-zinc-100 tracking-wider">
              AI BEHAVIOR ANALYSIS
            </h2>
            <p className="text-xs text-zinc-500 font-mono">
              Observation only • No execution rights
            </p>
          </div>
        </div>

        <Button
          onClick={onSubmitReport}
          size="sm"
          className="font-mono text-xs bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30"
        >
          <ArrowUpRight className="w-3 h-3 mr-2" />
          SUBMIT REPORT UPWARD
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
        <Eye className="w-4 h-4 text-zinc-500" />
        <p className="text-xs text-zinc-500 font-mono">
          AI observes silently. Generates behavior score & risk flags only. Cannot modify data.
        </p>
      </div>

      {/* Behavior Cards */}
      <div className="space-y-3">
        {behaviors.map((behavior, idx) => {
          const riskColors = getRiskColor(behavior.riskLevel);
          
          return (
            <motion.div
              key={behavior.valaId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-zinc-500" />
                  <span className="font-mono text-sm text-zinc-300">{behavior.valaId}</span>
                </div>
                <div className={`px-2 py-0.5 rounded text-xs font-mono ${riskColors.bg} ${riskColors.text} ${riskColors.border} border`}>
                  {behavior.riskLevel.toUpperCase()} RISK
                </div>
              </div>

              {/* Behavior Score */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-zinc-500 font-mono">BEHAVIOR SCORE</span>
                  <span className={`text-lg font-bold font-mono ${getScoreColor(behavior.score)}`}>
                    {behavior.score}
                  </span>
                </div>
                <Progress 
                  value={behavior.score} 
                  className="h-1.5 bg-zinc-800"
                />
              </div>

              {/* Flags */}
              {behavior.flags.length > 0 && (
                <div className="space-y-1">
                  <span className="text-xs text-zinc-500 font-mono">RISK FLAGS</span>
                  <div className="flex flex-wrap gap-1">
                    {behavior.flags.map((flag, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1 px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-400 font-mono"
                      >
                        <AlertTriangle className="w-3 h-3" />
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <div className="flex items-center gap-1 mt-3 text-xs text-zinc-600 font-mono">
                <TrendingUp className="w-3 h-3" />
                Last update: {new Date(behavior.lastUpdate).toLocaleTimeString()}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Report Notice */}
      <div className="flex items-center gap-2 p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg">
        <FileText className="w-4 h-4 text-purple-400" />
        <p className="text-xs text-purple-400 font-mono">
          Reports are submitted upward only. AI has no backward access.
        </p>
      </div>
    </div>
  );
}
