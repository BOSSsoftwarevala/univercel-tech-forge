import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  AlertTriangle,
  TrendingDown,
  Users,
  Clock,
  Eye,
  CheckCircle,
  Shield,
  Brain
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface QualityAlert {
  id: string;
  type: 'source_quality' | 'spam_surge' | 'low_conversion' | 'duplicate_wave';
  title: string;
  description: string;
  affectedSource: string;
  severity: 'high' | 'medium' | 'low';
  suggestedAction: string;
  confidence: number;
  detectedAt: string;
  acknowledged: boolean;
}

const mockAlerts: QualityAlert[] = [
  {
    id: 'QA-001',
    type: 'spam_surge',
    title: 'Spam Surge Detected',
    description: 'Influencer channel INF-3421 showing 340% increase in spam flagged leads',
    affectedSource: 'INF-3421',
    severity: 'high',
    suggestedAction: 'Review influencer partnership and implement stricter validation',
    confidence: 91,
    detectedAt: '2035-01-15 09:45',
    acknowledged: false
  },
  {
    id: 'QA-002',
    type: 'low_conversion',
    title: 'Low Conversion Rate Alert',
    description: 'API source HUBSPOT showing 12% conversion vs 30% average',
    affectedSource: 'API-HUBSPOT',
    severity: 'medium',
    suggestedAction: 'Audit API integration fields and lead scoring parameters',
    confidence: 87,
    detectedAt: '2035-01-15 08:30',
    acknowledged: false
  },
  {
    id: 'QA-003',
    type: 'duplicate_wave',
    title: 'Duplicate Submission Pattern',
    description: 'Frontend form receiving repeated submissions from same IP range',
    affectedSource: 'WEB-FORM',
    severity: 'medium',
    suggestedAction: 'Enable rate limiting and CAPTCHA for affected IP range',
    confidence: 78,
    detectedAt: '2035-01-14 22:15',
    acknowledged: true
  },
  {
    id: 'QA-004',
    type: 'source_quality',
    title: 'Source Quality Decline',
    description: 'Reseller RSL-7823 quality score dropped from 92% to 71%',
    affectedSource: 'RSL-7823',
    severity: 'low',
    suggestedAction: 'Schedule performance review with reseller partner',
    confidence: 82,
    detectedAt: '2035-01-14 18:00',
    acknowledged: true
  }
];

const getTypeBadge = (type: string) => {
  const configs: Record<string, { color: string; label: string }> = {
    spam_surge: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Spam Surge' },
    low_conversion: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Low Conversion' },
    duplicate_wave: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', label: 'Duplicates' },
    source_quality: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Quality Issue' }
  };
  const config = configs[type] || { color: 'bg-gray-500/20 text-gray-400', label: type };
  return <Badge className={config.color}>{config.label}</Badge>;
};

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case 'high':
      return <Badge variant="destructive">High</Badge>;
    case 'medium':
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Medium</Badge>;
    default:
      return <Badge variant="outline">Low</Badge>;
  }
};

export const LMAIQualityAlerts: React.FC = () => {
  const handleAcknowledge = (alert: QualityAlert) => {
    toast.success(`Alert ${alert.id} acknowledged`, {
      description: 'AI suggestion noted - manual action required'
    });
    console.log('[LEAD-MANAGER] AI alert acknowledged:', alert.id);
  };

  const handleViewDetails = (alert: QualityAlert) => {
    toast.info(`AI Logic for ${alert.id}`, {
      description: alert.suggestedAction
    });
  };

  const unacknowledgedCount = mockAlerts.filter(a => !a.acknowledged).length;

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Lead Quality Alerts
            {unacknowledgedCount > 0 && (
              <Badge variant="destructive" className="ml-2">{unacknowledgedCount}</Badge>
            )}
          </CardTitle>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
            <Brain className="h-3 w-3 mr-1" />
            Flag Only
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Disclaimer */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2">
          <p className="text-xs text-purple-300 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            AI suggests only. Auto-convert FORBIDDEN. AI logic visible.
          </p>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {mockAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border rounded-lg p-3 ${
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
                    {getTypeBadge(alert.type)}
                    {getSeverityBadge(alert.severity)}
                    {alert.acknowledged && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Ack
                      </Badge>
                    )}
                  </div>
                  <p className="font-medium text-sm">{alert.title}</p>
                </div>
                <div className="text-right text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Brain className="h-3 w-3" />
                    {alert.confidence}%
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>

              <div className="bg-muted/40 rounded p-2 mb-2">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">AI Suggestion:</span> {alert.suggestedAction}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {alert.detectedAt}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-xs"
                    onClick={() => handleViewDetails(alert)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Logic
                  </Button>
                  {!alert.acknowledged && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-xs"
                      onClick={() => handleAcknowledge(alert)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            <Brain className="h-3 w-3 inline mr-1" />
            Score by source, behavior, completeness • Priority routing suggested
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
