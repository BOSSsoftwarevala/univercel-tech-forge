import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Brain, Eye, ArrowUpRight, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface LegalAlert {
  id: string;
  type: 'fraud_language' | 'copyright_misuse' | 'scam_pattern' | 'trademark_violation' | 'policy_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  detectedIn: string;
  confidence: number;
  detectedAt: string;
  status: 'pending' | 'reviewed' | 'escalated';
  aiSuggestion: string;
}

const mockAlerts: LegalAlert[] = [
  { 
    id: 'LA-001', 
    type: 'fraud_language', 
    severity: 'high', 
    title: 'Suspicious guarantee claims detected', 
    description: 'Partner page contains "100% guaranteed returns" language',
    detectedIn: 'Partner: RSL-4521',
    confidence: 92,
    detectedAt: '2024-01-15T09:30:00Z',
    status: 'pending',
    aiSuggestion: 'Recommend issuing warning and requiring content revision within 48 hours'
  },
  { 
    id: 'LA-002', 
    type: 'copyright_misuse', 
    severity: 'critical', 
    title: 'Unauthorized logo usage', 
    description: 'Third-party demo using brand logo without license',
    detectedIn: 'Demo: DM-7823',
    confidence: 98,
    detectedAt: '2024-01-15T08:15:00Z',
    status: 'pending',
    aiSuggestion: 'Recommend immediate takedown notice and suspension review'
  },
  { 
    id: 'LA-003', 
    type: 'scam_pattern', 
    severity: 'medium', 
    title: 'Potential phishing content', 
    description: 'User-submitted content mimics official login page',
    detectedIn: 'Content ID: CNT-9912',
    confidence: 78,
    detectedAt: '2024-01-15T10:00:00Z',
    status: 'reviewed',
    aiSuggestion: 'Recommend content removal and user warning'
  },
];

const LMLegalAlerts: React.FC = () => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fraud_language': return '⚠️';
      case 'copyright_misuse': return '©️';
      case 'scam_pattern': return '🎣';
      case 'trademark_violation': return '™️';
      default: return '📋';
    }
  };

  const handleReview = (alert: LegalAlert) => {
    console.log('[LEGAL_MANAGER] Alert reviewed:', {
      timestamp: new Date().toISOString(),
      action: 'alert_reviewed',
      alertId: alert.id,
      type: alert.type
    });
    toast.info('Alert marked as reviewed');
  };

  const handleEscalate = (alert: LegalAlert) => {
    console.log('[LEGAL_MANAGER] Alert escalated:', {
      timestamp: new Date().toISOString(),
      action: 'alert_escalated',
      alertId: alert.id,
      type: alert.type,
      aiSuggestion: alert.aiSuggestion
    });
    toast.success('Alert escalated to Admin for action');
  };

  const criticalCount = mockAlerts.filter(a => a.severity === 'critical').length;
  const highCount = mockAlerts.filter(a => a.severity === 'high').length;

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            AI Legal Alerts
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="destructive">{criticalCount} Critical</Badge>
            <Badge className="bg-orange-500/20 text-orange-400">{highCount} High</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                alert.severity === 'critical' ? 'bg-red-500/5 border-red-500/30' :
                alert.severity === 'high' ? 'bg-orange-500/5 border-orange-500/30' :
                'bg-background/50 border-border/50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-lg">{getTypeIcon(alert.type)}</span>
                    <span className="font-mono text-sm text-muted-foreground">{alert.id}</span>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {alert.confidence}% confidence
                    </Badge>
                    {alert.status === 'reviewed' && (
                      <Badge className="bg-blue-500/20 text-blue-400">Reviewed</Badge>
                    )}
                  </div>
                  <p className="font-medium mb-1">{alert.title}</p>
                  <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                  <p className="text-xs text-muted-foreground">Detected in: {alert.detectedIn}</p>
                  
                  <div className="mt-3 p-3 rounded bg-purple-500/10 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="h-4 w-4 text-purple-400" />
                      <span className="text-sm font-medium text-purple-400">AI Suggestion (Human Review Required)</span>
                    </div>
                    <p className="text-sm">{alert.aiSuggestion}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleReview(alert)}
                    className="gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    Review
                  </Button>
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={() => handleEscalate(alert)}
                    className="gap-1"
                  >
                    <ArrowUpRight className="h-3 w-3" />
                    Escalate
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4 p-3 rounded bg-muted/30 border border-border/50 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            AI suggestions require human review. Direct suspension is FORBIDDEN.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LMLegalAlerts;
