import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useGlobalActions } from '@/hooks/useGlobalActions';
import {
  Brain,
  AlertTriangle,
  TrendingUp,
  Shield,
  DollarSign,
  Target,
  Users,
  ArrowRight,
  CheckCircle,
  XCircle,
  Lightbulb,
  Sparkles,
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'risk' | 'opportunity' | 'fraud' | 'anomaly';
  title: string;
  description: string;
  confidence: number;
  resellerId?: string;
  resellerName?: string;
  suggestedAction: string;
  priority: 'low' | 'medium' | 'high';
}

const mockInsights: AIInsight[] = [
  { id: 'AI001', type: 'risk', title: 'High Risk Reseller Detected', description: 'CloudFirst IT shows declining performance metrics with 3 consecutive weeks of missed targets.', confidence: 87, resellerId: '3', resellerName: 'CloudFirst IT', suggestedAction: 'Schedule performance review call', priority: 'high' },
  { id: 'AI002', type: 'opportunity', title: 'Growth Opportunity', description: 'TechSoft Solutions has 40% capacity remaining in their territory. Potential revenue increase of ₹3L/month.', confidence: 92, resellerId: '1', resellerName: 'TechSoft Solutions', suggestedAction: 'Assign additional leads to this reseller', priority: 'medium' },
  { id: 'AI003', type: 'fraud', title: 'Commission Anomaly Alert', description: 'Unusual pattern detected: 5 similar transactions from same IP in last 24 hours.', confidence: 74, resellerId: '5', resellerName: 'BritTech Partners', suggestedAction: 'Hold pending payouts and investigate', priority: 'high' },
  { id: 'AI004', type: 'anomaly', title: 'Refund Pattern Alert', description: 'Digital Dreams showing 3x higher refund rate than territory average.', confidence: 81, resellerId: '2', resellerName: 'Digital Dreams', suggestedAction: 'Review client onboarding process', priority: 'medium' },
  { id: 'AI005', type: 'opportunity', title: 'Top Performer Expansion', description: 'StartupBoost LLC consistently exceeds targets. Consider territory expansion or premium tier upgrade.', confidence: 95, resellerId: '4', resellerName: 'StartupBoost LLC', suggestedAction: 'Offer premium partnership tier', priority: 'low' },
];

const insightIcons: Record<string, any> = {
  risk: AlertTriangle,
  opportunity: TrendingUp,
  fraud: Shield,
  anomaly: Lightbulb,
};

const insightColors: Record<string, string> = {
  risk: 'text-red-400 bg-red-500/20',
  opportunity: 'text-emerald-400 bg-emerald-500/20',
  fraud: 'text-amber-400 bg-amber-500/20',
  anomaly: 'text-purple-400 bg-purple-500/20',
};

export function AIInsightsView() {
  const { logToAudit } = useGlobalActions();
  const [insights, setInsights] = useState<AIInsight[]>(mockInsights);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const handleAcceptSuggestion = async (insight: AIInsight) => {
    await logToAudit('accept_ai_insight', 'ai_task', { 
      insightId: insight.id, 
      type: insight.type,
      action: insight.suggestedAction 
    });
    toast.success(`Action initiated: ${insight.suggestedAction}`);
    setDismissedIds(prev => [...prev, insight.id]);
  };

  const handleDismiss = async (insight: AIInsight) => {
    await logToAudit('dismiss_ai_insight', 'ai_task', { insightId: insight.id, type: insight.type });
    toast.info('Insight dismissed');
    setDismissedIds(prev => [...prev, insight.id]);
  };

  const visibleInsights = insights.filter(i => !dismissedIds.includes(i.id));

  const riskCount = visibleInsights.filter(i => i.type === 'risk').length;
  const opportunityCount = visibleInsights.filter(i => i.type === 'opportunity').length;
  const fraudCount = visibleInsights.filter(i => i.type === 'fraud').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Insights</h2>
            <p className="text-sm text-slate-400">AI-powered recommendations for your reseller network</p>
          </div>
        </div>
        <Badge variant="outline" className="text-purple-400 border-purple-500/30 gap-1">
          <Sparkles className="w-3 h-3" />
          {visibleInsights.length} Active Insights
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <div>
              <p className="text-xl font-bold text-red-100">{riskCount}</p>
              <p className="text-xs text-red-400/80">Risky Resellers</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/10 border-emerald-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-xl font-bold text-emerald-100">{opportunityCount}</p>
              <p className="text-xs text-emerald-400/80">Growth Opportunities</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <Shield className="w-6 h-6 text-amber-400" />
            <div>
              <p className="text-xl font-bold text-amber-100">{fraudCount}</p>
              <p className="text-xs text-amber-400/80">Fraud Alerts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Disclaimer */}
      <Card className="bg-slate-800/30 border-slate-700/50">
        <CardContent className="p-3">
          <p className="text-xs text-slate-400 text-center">
            <Shield className="w-3 h-3 inline mr-1" />
            AI provides suggestions only. All critical actions require human approval. No auto-block or auto-suspend.
          </p>
        </CardContent>
      </Card>

      {/* Insight Cards */}
      <div className="space-y-3">
        {visibleInsights.map((insight) => {
          const Icon = insightIcons[insight.type];
          const colorClass = insightColors[insight.type];

          return (
            <Card key={insight.id} className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{insight.title}</span>
                      <Badge variant="outline" className={`${
                        insight.priority === 'high' ? 'text-red-400 border-red-500/30' :
                        insight.priority === 'medium' ? 'text-amber-400 border-amber-500/30' :
                        'text-slate-400 border-slate-600'
                      }`}>
                        {insight.priority} priority
                      </Badge>
                    </div>

                    {insight.resellerName && (
                      <p className="text-xs text-slate-500 mb-1">Reseller: {insight.resellerName}</p>
                    )}

                    <p className="text-sm text-slate-300 mb-3">{insight.description}</p>

                    {/* Confidence Score */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-400">AI Confidence</span>
                        <span className="text-white">{insight.confidence}%</span>
                      </div>
                      <Progress value={insight.confidence} className="h-1" />
                    </div>

                    {/* Suggested Action */}
                    <div className="p-2 bg-slate-800/50 rounded border border-slate-700/50 mb-3">
                      <p className="text-xs text-slate-400">Suggested Action:</p>
                      <p className="text-sm text-white">{insight.suggestedAction}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAcceptSuggestion(insight)} className="gap-1 bg-purple-600 hover:bg-purple-700">
                        <CheckCircle className="w-3 h-3" /> Accept & Execute
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDismiss(insight)} className="gap-1 text-slate-400">
                        <XCircle className="w-3 h-3" /> Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default AIInsightsView;
