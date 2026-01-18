import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Target,
  Eye,
  CheckCircle,
  XCircle,
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';

const aiInsights = [
  { 
    id: 'AI-001', 
    promiseId: 'PRM-004', 
    title: 'Refund Promise - Order #8812', 
    delayRisk: 72, 
    missProbability: 45,
    suggestedAction: 'Escalate to Finance Manager immediately',
    escalationAdvice: 'Level 2 escalation recommended within 24 hours'
  },
  { 
    id: 'AI-002', 
    promiseId: 'PRM-006', 
    title: 'SLA Commitment - Premium Plan', 
    delayRisk: 35, 
    missProbability: 15,
    suggestedAction: 'Monitor closely, assign backup resource',
    escalationAdvice: 'No escalation needed currently'
  },
  { 
    id: 'AI-003', 
    promiseId: 'PRM-008', 
    title: 'Update Release - v2.5', 
    delayRisk: 58, 
    missProbability: 30,
    suggestedAction: 'Review scope with Dev Team B',
    escalationAdvice: 'Prepare Level 1 escalation for next week'
  },
];

const getRiskColor = (risk: number) => {
  if (risk >= 70) return 'text-red-400';
  if (risk >= 40) return 'text-yellow-400';
  return 'text-green-400';
};

const getRiskBg = (risk: number) => {
  if (risk >= 70) return 'bg-red-500';
  if (risk >= 40) return 'bg-yellow-500';
  return 'bg-green-500';
};

export default function PTAIInsights() {
  const logAction = (action: string, target: string) => {
    toast.info(`AI Suggestion: ${action}`, {
      description: `${target} • Requires manual approval`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Brain className="h-8 w-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Insights</h1>
            <p className="text-slate-400">AI-powered promise analysis (Assist Only)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">AI ACTIVE</Badge>
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">NO AUTO EXECUTION</Badge>
        </div>
      </div>

      {/* AI Notice */}
      <Card className="bg-purple-500/10 border-purple-500/30">
        <CardContent className="p-4 flex items-center gap-3">
          <Lightbulb className="h-5 w-5 text-purple-400" />
          <p className="text-purple-300">
            AI provides suggestions and risk analysis only. <strong>All actions require manual approval.</strong>
          </p>
        </CardContent>
      </Card>

      {/* AI Analysis Cards */}
      <div className="space-y-4">
        {aiInsights.map((insight) => (
          <Card key={insight.id} className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-slate-400">{insight.promiseId}</span>
                    <Badge className="bg-purple-500/20 text-purple-400">AI Analysis</Badge>
                  </div>
                  <h3 className="font-medium text-white">{insight.title}</h3>
                </div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => logAction('View Details', insight.promiseId)}>
                  <Eye className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Delay Risk</span>
                    <span className={`font-bold ${getRiskColor(insight.delayRisk)}`}>{insight.delayRisk}%</span>
                  </div>
                  <Progress value={insight.delayRisk} className={`h-2 ${getRiskBg(insight.delayRisk)}`} />
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Miss Probability</span>
                    <span className={`font-bold ${getRiskColor(insight.missProbability)}`}>{insight.missProbability}%</span>
                  </div>
                  <Progress value={insight.missProbability} className={`h-2 ${getRiskBg(insight.missProbability)}`} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-xs text-blue-400 mb-1 flex items-center gap-1">
                    <Target className="w-3 h-3" /> Suggested Action
                  </p>
                  <p className="text-sm text-slate-300">{insight.suggestedAction}</p>
                </div>
                <div className="p-2 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <p className="text-xs text-orange-400 mb-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Escalation Advice
                  </p>
                  <p className="text-sm text-slate-300">{insight.escalationAdvice}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800">
                <Button size="sm" variant="outline" onClick={() => logAction('Apply Suggestion', insight.promiseId)}>
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Apply (Requires Approval)
                </Button>
                <Button size="sm" variant="ghost" onClick={() => logAction('Dismiss', insight.promiseId)}>
                  <XCircle className="w-4 h-4 mr-2 text-slate-400" />
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
