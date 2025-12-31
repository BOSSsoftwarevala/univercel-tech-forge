import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, AlertTriangle, Eye, Shield, TrendingUp, Activity, Lock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface FraudFlag {
  id: string;
  valaId: string;
  flagType: 'bot_traffic' | 'click_spam' | 'spike_anomaly' | 'pattern_match';
  confidence: number;
  description: string;
  aiReasoning: string;
  detectedAt: string;
  status: 'pending_review' | 'confirmed' | 'dismissed';
  metrics: {
    suspiciousClicks: number;
    totalClicks: number;
    fraudProbability: number;
  };
}

const mockFlags: FraudFlag[] = [
  {
    id: '1',
    valaId: 'VL-4827163',
    flagType: 'bot_traffic',
    confidence: 94,
    description: 'High volume of clicks from datacenter IPs detected',
    aiReasoning: 'Pattern analysis detected 847 clicks from 12 datacenter IP ranges within 2-hour window. Click timing shows <100ms intervals consistent with automated traffic. User agent strings are identical across all requests.',
    detectedAt: '2024-01-15 14:32',
    status: 'pending_review',
    metrics: { suspiciousClicks: 847, totalClicks: 1250, fraudProbability: 67.8 }
  },
  {
    id: '2',
    valaId: 'VL-2918374',
    flagType: 'click_spam',
    confidence: 78,
    description: 'Abnormal click velocity from single session',
    aiReasoning: 'Single browser session generated 312 clicks in 5 minutes. Mouse movement patterns show linear trajectories inconsistent with human behavior. No scroll events detected between clicks.',
    detectedAt: '2024-01-15 11:18',
    status: 'pending_review',
    metrics: { suspiciousClicks: 312, totalClicks: 450, fraudProbability: 69.3 }
  },
  {
    id: '3',
    valaId: 'VL-9173628',
    flagType: 'spike_anomaly',
    confidence: 65,
    description: 'Traffic spike 400% above baseline',
    aiReasoning: 'Traffic volume increased from 200 clicks/hour baseline to 890 clicks/hour without corresponding campaign changes. Geographic distribution shifted from multi-region to single region (92% from one city).',
    detectedAt: '2024-01-14 22:45',
    status: 'confirmed',
    metrics: { suspiciousClicks: 690, totalClicks: 890, fraudProbability: 77.5 }
  },
  {
    id: '4',
    valaId: 'VL-7382916',
    flagType: 'pattern_match',
    confidence: 52,
    description: 'Behavior pattern matches known fraud signature',
    aiReasoning: 'Click pattern matches signature #F-2847 associated with click farm operations. Referrer headers show manipulation. Session duration abnormally short (<2s average).',
    detectedAt: '2024-01-14 16:20',
    status: 'dismissed',
    metrics: { suspiciousClicks: 156, totalClicks: 3200, fraudProbability: 4.9 }
  },
];

export function IMAIFraudFlags() {
  const { toast } = useToast();
  const [flags, setFlags] = useState<FraudFlag[]>(mockFlags);
  const [expandedFlag, setExpandedFlag] = useState<string | null>(null);

  const handleConfirm = (flag: FraudFlag) => {
    setFlags(prev => prev.map(f => 
      f.id === flag.id ? { ...f, status: 'confirmed' as const } : f
    ));
    toast({
      title: "Fraud Confirmed",
      description: `Fraud flag for ${flag.valaId} confirmed. Recommend suspension.`,
    });
  };

  const handleDismiss = (flag: FraudFlag) => {
    setFlags(prev => prev.map(f => 
      f.id === flag.id ? { ...f, status: 'dismissed' as const } : f
    ));
    toast({
      title: "Flag Dismissed",
      description: `Fraud flag for ${flag.valaId} dismissed after review.`,
    });
  };

  const getFlagIcon = (type: string) => {
    switch (type) {
      case 'bot_traffic': return <Bot className="w-5 h-5 text-red-400" />;
      case 'click_spam': return <Activity className="w-5 h-5 text-amber-400" />;
      case 'spike_anomaly': return <TrendingUp className="w-5 h-5 text-blue-400" />;
      default: return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-red-400';
    if (confidence >= 60) return 'text-amber-400';
    return 'text-blue-400';
  };

  const pendingFlags = flags.filter(f => f.status === 'pending_review').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">AI Fraud Detection Flags</h2>
          <p className="text-sm text-muted-foreground">AI-powered detection • Human decision required</p>
        </div>
        <Badge variant="outline" className="bg-amber-500/10 text-amber-400">
          {pendingFlags} Pending Review
        </Badge>
      </div>

      {/* AI Limitations Notice */}
      <Card className="bg-primary/5 border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">AI Fraud Engine Rules</p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <Lock className="w-3 h-3" /> AI auto-suspend is BLOCKED - Human decision required
                </li>
                <li className="flex items-center gap-2">
                  <Eye className="w-3 h-3" /> AI reasoning is visible for transparency
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" /> All AI flags require manual review
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fraud Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Bot className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">2,005</div>
            <div className="text-xs text-muted-foreground">Suspicious Clicks Today</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{pendingFlags}</div>
            <div className="text-xs text-muted-foreground">Flags Pending Review</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{flags.filter(f => f.status === 'confirmed').length}</div>
            <div className="text-xs text-muted-foreground">Confirmed Today</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <XCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{flags.filter(f => f.status === 'dismissed').length}</div>
            <div className="text-xs text-muted-foreground">Dismissed Today</div>
          </CardContent>
        </Card>
      </div>

      {/* Fraud Flags List */}
      <div className="space-y-4">
        {flags.map((flag, index) => (
          <motion.div
            key={flag.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`bg-card/50 border-border/50 ${
              flag.status === 'pending_review' ? 'border-amber-500/30' :
              flag.status === 'confirmed' ? 'border-red-500/30' :
              'border-muted'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      {getFlagIcon(flag.flagType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-semibold text-foreground">{flag.valaId}</span>
                        <Badge variant="outline" className={
                          flag.status === 'pending_review' ? 'bg-amber-500/20 text-amber-400' :
                          flag.status === 'confirmed' ? 'bg-red-500/20 text-red-400' :
                          'bg-muted text-muted-foreground'
                        }>
                          {flag.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {flag.flagType.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{flag.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">Detected: {flag.detectedAt}</p>

                      {/* Confidence & Metrics */}
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">AI Confidence:</span>
                          <span className={`font-bold ${getConfidenceColor(flag.confidence)}`}>{flag.confidence}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Fraud Probability:</span>
                          <span className="font-bold text-foreground">{flag.metrics.fraudProbability}%</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Suspicious: {flag.metrics.suspiciousClicks}</span>
                          <span>Total: {flag.metrics.totalClicks}</span>
                        </div>
                        <Progress value={(flag.metrics.suspiciousClicks / flag.metrics.totalClicks) * 100} className="h-2" />
                      </div>

                      {/* Expandable AI Reasoning */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() => setExpandedFlag(expandedFlag === flag.id ? null : flag.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {expandedFlag === flag.id ? 'Hide' : 'Show'} AI Reasoning
                      </Button>

                      {expandedFlag === flag.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 p-3 bg-muted/30 rounded-lg"
                        >
                          <p className="text-sm font-medium text-foreground mb-2">AI Analysis:</p>
                          <p className="text-sm text-muted-foreground">{flag.aiReasoning}</p>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {flag.status === 'pending_review' && (
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleConfirm(flag)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Confirm Fraud
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDismiss(flag)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
