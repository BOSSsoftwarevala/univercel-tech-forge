import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Brain, 
  AlertTriangle, 
  TrendingDown,
  Clock,
  Eye,
  Shield,
  CheckCircle,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface QualityAlert {
  id: string;
  pattern: string;
  description: string;
  affectedEntity: string;
  entityType: 'developer' | 'team' | 'project';
  severity: 'high' | 'medium' | 'low';
  suggestedAction: string;
  confidence: number;
  reasoning: string;
  detectedAt: string;
  acknowledged: boolean;
}

const mockAlerts: QualityAlert[] = [
  {
    id: 'QA-001',
    pattern: 'SLA Risk Pattern',
    description: 'Increasing SLA breach frequency detected across Team Alpha',
    affectedEntity: 'TEAM-ALPHA',
    entityType: 'team',
    severity: 'high',
    suggestedAction: 'Review workload distribution and consider temporary resource reallocation',
    confidence: 87,
    reasoning: 'Based on 14-day trend analysis: 3 breaches in week 1 vs 7 breaches in week 2. Correlation with new project assignments.',
    detectedAt: '2035-01-15 08:15',
    acknowledged: false
  },
  {
    id: 'QA-002',
    pattern: 'Underperformance Pattern',
    description: 'Developer showing 40% decline in completion rate over 30 days',
    affectedEntity: 'DEV-7823',
    entityType: 'developer',
    severity: 'medium',
    suggestedAction: 'Schedule 1:1 review to identify blockers. Do not apply penalty without investigation.',
    confidence: 92,
    reasoning: 'Completion rate dropped from 95% to 57%. No corresponding increase in task complexity. May indicate personal issues or burnout.',
    detectedAt: '2035-01-14 16:30',
    acknowledged: false
  },
  {
    id: 'QA-003',
    pattern: 'Code Quality Decline',
    description: 'Project Beta showing increased code review rejection rate',
    affectedEntity: 'PRJ-BETA',
    entityType: 'project',
    severity: 'medium',
    suggestedAction: 'Review code standards documentation. Consider mandatory pair programming for critical modules.',
    confidence: 78,
    reasoning: 'Rejection rate increased from 12% to 34% over 3 weeks. Pattern concentrated in backend modules.',
    detectedAt: '2035-01-14 11:45',
    acknowledged: true
  },
  {
    id: 'QA-004',
    pattern: 'Promise Overcommitment',
    description: 'Multiple developers accepting promises beyond capacity',
    affectedEntity: 'TEAM-GAMMA',
    entityType: 'team',
    severity: 'low',
    suggestedAction: 'Implement stricter promise acceptance controls. Recommend capacity visibility dashboard.',
    confidence: 71,
    reasoning: 'Average active promises per developer increased from 3 to 5.5. No corresponding productivity increase.',
    detectedAt: '2035-01-13 14:20',
    acknowledged: true
  }
];

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case 'high':
      return <Badge variant="destructive">High Risk</Badge>;
    case 'medium':
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Medium Risk</Badge>;
    default:
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Low Risk</Badge>;
  }
};

const getEntityBadge = (type: string) => {
  switch (type) {
    case 'developer':
      return <Badge variant="outline" className="border-purple-500/50 text-purple-400">Developer</Badge>;
    case 'team':
      return <Badge variant="outline" className="border-blue-500/50 text-blue-400">Team</Badge>;
    case 'project':
      return <Badge variant="outline" className="border-green-500/50 text-green-400">Project</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export const PMQualityAlerts: React.FC = () => {
  const [showReasoning, setShowReasoning] = useState<string | null>(null);

  const handleAcknowledge = (alert: QualityAlert) => {
    toast.success(`Alert ${alert.id} acknowledged`, {
      description: 'AI suggestion noted - no auto-apply'
    });
    console.log('[PRO-MANAGER] AI alert acknowledged:', alert.id);
  };

  const handleEscalate = (alert: QualityAlert) => {
    toast.warning(`Alert ${alert.id} escalated`, {
      description: 'Forwarded to Master Admin with AI analysis'
    });
    console.log('[PRO-MANAGER] AI alert escalated:', alert.id);
  };

  const unacknowledgedCount = mockAlerts.filter(a => !a.acknowledged).length;

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Quality Alerts
            {unacknowledgedCount > 0 && (
              <Badge variant="destructive" className="ml-2">{unacknowledgedCount}</Badge>
            )}
          </CardTitle>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
            <Brain className="h-3 w-3 mr-1" />
            Suggestion Only
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Disclaimer */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
          <p className="text-xs text-purple-300 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            AI suggestions require human review. Auto-apply is FORBIDDEN.
          </p>
        </div>

        <div className="space-y-3 max-h-[350px] overflow-y-auto">
          {mockAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border rounded-lg p-4 ${
                alert.acknowledged
                  ? 'bg-muted/20 border-border/30'
                  : alert.severity === 'high'
                  ? 'bg-red-500/5 border-red-500/30'
                  : 'bg-muted/30 border-border/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="font-mono text-xs text-muted-foreground">{alert.id}</span>
                    {getSeverityBadge(alert.severity)}
                    {alert.acknowledged && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Acknowledged
                      </Badge>
                    )}
                  </div>
                  <p className="font-medium text-sm">{alert.pattern}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <Brain className="h-3 w-3" />
                    {alert.confidence}% confidence
                  </div>
                  {getEntityBadge(alert.entityType)}
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>

              <div className="bg-muted/40 rounded p-2 mb-2">
                <p className="text-xs font-medium text-foreground mb-1">AI Suggested Action:</p>
                <p className="text-xs text-muted-foreground">{alert.suggestedAction}</p>
              </div>

              {/* Reasoning Toggle */}
              {showReasoning === alert.id ? (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded p-2 mb-2">
                  <p className="text-xs font-medium text-purple-300 mb-1">AI Reasoning:</p>
                  <p className="text-xs text-muted-foreground">{alert.reasoning}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-1 h-6 text-xs"
                    onClick={() => setShowReasoning(null)}
                  >
                    Hide Reasoning
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs h-6 mb-2"
                  onClick={() => setShowReasoning(alert.id)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View AI Reasoning
                </Button>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {alert.detectedAt}
                </span>
                <div className="flex gap-2">
                  {!alert.acknowledged && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => handleAcknowledge(alert)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Acknowledge
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-7 text-xs"
                    onClick={() => handleEscalate(alert)}
                  >
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    Escalate
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            <Brain className="h-3 w-3 inline mr-1" />
            AI detects patterns • Human decides actions
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
