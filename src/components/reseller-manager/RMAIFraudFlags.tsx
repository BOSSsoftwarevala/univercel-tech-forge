import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, 
  AlertTriangle,
  Copy,
  Zap,
  TrendingDown,
  Eye,
  Shield,
  CheckCircle,
  XCircle,
  Brain
} from 'lucide-react';
import { toast } from 'sonner';

interface AIFraudFlag {
  id: string;
  resellerId: string;
  resellerName: string;
  flagType: 'spam_pattern' | 'duplicate_abuse' | 'low_intent' | 'velocity_anomaly';
  severity: 'critical' | 'high' | 'medium';
  confidence: number;
  aiReasoning: string;
  detectedAt: string;
  status: 'pending_review' | 'confirmed' | 'dismissed';
  affectedLeads: number;
}

const mockFlags: AIFraudFlag[] = [
  {
    id: '1',
    resellerId: 'VL-RS-8923',
    resellerName: 'Rapid Leads Inc',
    flagType: 'spam_pattern',
    severity: 'critical',
    confidence: 94,
    aiReasoning: 'Detected repetitive lead patterns with similar phone numbers varying by single digit. 23 leads submitted within 5 minutes with sequential contact details. Pattern matches known spam behavior.',
    detectedAt: '2024-01-15T10:30:00Z',
    status: 'pending_review',
    affectedLeads: 47
  },
  {
    id: '2',
    resellerId: 'VL-RS-4567',
    resellerName: 'East Zone Traders',
    flagType: 'duplicate_abuse',
    severity: 'high',
    confidence: 87,
    aiReasoning: 'Same lead data submitted under different customer names. Email domain patterns indicate same source. Cross-referencing shows 15 duplicate submissions across 3 different territories.',
    detectedAt: '2024-01-14T16:45:00Z',
    status: 'pending_review',
    affectedLeads: 28
  },
  {
    id: '3',
    resellerId: 'VL-RS-1234',
    resellerName: 'Quick Connect Sales',
    flagType: 'low_intent',
    severity: 'medium',
    confidence: 72,
    aiReasoning: 'Lead quality analysis shows 89% of leads have incomplete data or invalid contact information. Conversion rate is 0.3% compared to network average of 12%.',
    detectedAt: '2024-01-13T09:20:00Z',
    status: 'confirmed',
    affectedLeads: 156
  },
  {
    id: '4',
    resellerId: 'VL-RS-7890',
    resellerName: 'Metro Distribution',
    flagType: 'velocity_anomaly',
    severity: 'high',
    confidence: 81,
    aiReasoning: 'Unusual spike detected: 500% increase in lead submissions over 24-hour period. No corresponding marketing campaign registered. Pattern suggests automated submission.',
    detectedAt: '2024-01-12T22:15:00Z',
    status: 'dismissed',
    affectedLeads: 89
  }
];

export const RMAIFraudFlags: React.FC = () => {
  const [flags, setFlags] = useState<AIFraudFlag[]>(mockFlags);
  const [selectedFlag, setSelectedFlag] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const handleConfirm = (id: string) => {
    if (!reviewNotes.trim()) {
      toast.error('Review notes are required for confirmation');
      return;
    }
    setFlags(prev => 
      prev.map(flag => 
        flag.id === id ? { ...flag, status: 'confirmed' as const } : flag
      )
    );
    toast.success('Fraud flag confirmed - action logged');
    setReviewNotes('');
    setSelectedFlag(null);
  };

  const handleDismiss = (id: string) => {
    if (!reviewNotes.trim()) {
      toast.error('Review notes are required for dismissal');
      return;
    }
    setFlags(prev => 
      prev.map(flag => 
        flag.id === id ? { ...flag, status: 'dismissed' as const } : flag
      )
    );
    toast.success('Flag dismissed - decision logged');
    setReviewNotes('');
    setSelectedFlag(null);
  };

  const getFlagIcon = (type: string) => {
    switch (type) {
      case 'spam_pattern':
        return <AlertTriangle className="h-4 w-4" />;
      case 'duplicate_abuse':
        return <Copy className="h-4 w-4" />;
      case 'low_intent':
        return <TrendingDown className="h-4 w-4" />;
      case 'velocity_anomaly':
        return <Zap className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'high':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const pendingFlags = flags.filter(f => f.status === 'pending_review');

  return (
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Bot className="h-5 w-5 text-purple-500" />
            AI Quality Engine - Fraud Flags
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/30">
              <Brain className="h-3 w-3 mr-1" />
              AI Assisted
            </Badge>
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
              <Shield className="h-3 w-3 mr-1" />
              Auto-Suspend BLOCKED
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {pendingFlags.length} flags pending human review • AI suggests, humans decide
        </p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {flags.map((flag) => (
            <motion.div
              key={flag.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-lg p-4 ${
                flag.status === 'dismissed' 
                  ? 'bg-muted/20 border-border opacity-60' 
                  : 'bg-background border-border'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getSeverityColor(flag.severity)}`}>
                    {getFlagIcon(flag.flagType)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground capitalize">
                      {flag.flagType.replace('_', ' ')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {flag.resellerName} ({flag.resellerId})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(flag.severity)}>
                    {flag.severity.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className={
                    flag.status === 'pending_review' ? 'bg-yellow-500/10 text-yellow-500' :
                    flag.status === 'confirmed' ? 'bg-red-500/10 text-red-500' :
                    'bg-green-500/10 text-green-500'
                  }>
                    {flag.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              {/* AI Confidence */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-muted-foreground">AI Confidence:</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[200px]">
                  <div 
                    className={`h-full rounded-full ${
                      flag.confidence >= 90 ? 'bg-red-500' : 
                      flag.confidence >= 75 ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${flag.confidence}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-foreground">{flag.confidence}%</span>
              </div>

              {/* AI Reasoning - Transparent */}
              <div className="bg-muted/30 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium text-purple-400">AI Reasoning (Transparent)</span>
                </div>
                <p className="text-sm text-muted-foreground">{flag.aiReasoning}</p>
              </div>

              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-muted-foreground">
                  Affected Leads: <strong className="text-foreground">{flag.affectedLeads}</strong>
                </span>
                <span className="text-muted-foreground">
                  Detected: {new Date(flag.detectedAt).toLocaleString()}
                </span>
              </div>

              {selectedFlag === flag.id ? (
                <div className="border-t border-border pt-4 space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Human Review Notes (required):
                    </label>
                    <Textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Document your review findings and decision rationale..."
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleConfirm(flag.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Confirm Fraud
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-green-500/50 text-green-500 hover:bg-green-500/10"
                      onClick={() => handleDismiss(flag.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Dismiss Flag
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        setSelectedFlag(null);
                        setReviewNotes('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                flag.status === 'pending_review' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedFlag(flag.id)}
                  >
                    Review Flag
                  </Button>
                )
              )}
            </motion.div>
          ))}
        </div>

        {flags.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Bot className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>No fraud flags detected</p>
          </div>
        )}

        <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Brain className="h-4 w-4 text-purple-400 mt-0.5" />
            <p className="text-xs text-purple-400">
              <strong>AI Quality Engine:</strong> Detects spam patterns, duplicate abuse, and low-intent traffic.
              <br />
              AI cannot auto-suspend. All decisions require human confirmation.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
