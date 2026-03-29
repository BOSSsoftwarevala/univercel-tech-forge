import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, AlertTriangle, CheckCircle, XCircle, Eye, Shield, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
type AlertStatus = 'pending_review' | 'investigating' | 'confirmed' | 'dismissed';

interface FraudAlert {
  id: string;
  franchiseId: string;
  franchiseName: string;
  territory: string;
  alertType: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  detectedAt: string;
  aiConfidence: number;
  patterns: string[];
  recommendation: string;
}

const mockAlerts: FraudAlert[] = [
  {
    id: 'AFA-001',
    franchiseId: 'FR-003',
    franchiseName: 'SaaS Solutions Bangalore',
    territory: 'Bangalore East',
    alertType: 'Lead Manipulation',
    description: 'AI detected pattern of lead submissions with similar metadata suggesting artificial generation',
    severity: 'high',
    status: 'pending_review',
    detectedAt: '2024-01-15 14:30',
    aiConfidence: 87,
    patterns: ['Same device fingerprint', 'Sequential submission times', 'Similar IP range'],
    recommendation: 'Investigate lead sources and verify authenticity'
  },
  {
    id: 'AFA-002',
    franchiseId: 'FR-002',
    franchiseName: 'Digital Dynamics Delhi',
    territory: 'Delhi North',
    alertType: 'Territory Breach',
    description: 'Activity detected from geographic coordinates outside assigned territory',
    severity: 'medium',
    status: 'investigating',
    detectedAt: '2024-01-14 09:15',
    aiConfidence: 72,
    patterns: ['GPS mismatch', 'Client addresses outside zone', 'Cross-territory referrals'],
    recommendation: 'Review client acquisition locations'
  },
  {
    id: 'AFA-003',
    franchiseId: 'FR-001',
    franchiseName: 'TechVentures Mumbai',
    territory: 'Mumbai Central',
    alertType: 'Unusual Activity Pattern',
    description: 'Spike in lead submissions during off-hours with low conversion',
    severity: 'low',
    status: 'pending_review',
    detectedAt: '2024-01-13 22:45',
    aiConfidence: 45,
    patterns: ['Late night submissions', 'Below average conversion', 'High volume burst'],
    recommendation: 'Monitor for continued patterns'
  }
];

export function FMAIFraudAlerts() {
  const [alerts] = useState<FraudAlert[]>(mockAlerts);
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');

  const getSeverityBadge = (severity: AlertSeverity) => {
    const configs = {
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      critical: 'bg-destructive/20 text-destructive border-destructive/30'
    };
    return <Badge className={configs[severity]}>{severity.toUpperCase()}</Badge>;
  };

  const getStatusBadge = (status: AlertStatus) => {
    const configs = {
      pending_review: 'bg-purple-500/20 text-purple-400',
      investigating: 'bg-blue-500/20 text-blue-400',
      confirmed: 'bg-destructive/20 text-destructive',
      dismissed: 'bg-muted text-muted-foreground'
    };
    return <Badge className={configs[status]}>{status.replace('_', ' ')}</Badge>;
  };

  const handleConfirmFraud = () => {
    toast.success('Fraud Confirmed', {
      description: 'Alert marked as confirmed. Appropriate action will be taken.'
    });
    setShowReviewDialog(false);
    setReviewNotes('');
    setSelectedAlert(null);
  };

  const handleDismissAlert = () => {
    if (!reviewNotes.trim()) {
      toast.error('Notes Required', {
        description: 'Please provide notes for dismissing this alert'
      });
      return;
    }
    toast.success('Alert Dismissed', {
      description: 'Alert dismissed with notes recorded'
    });
    setShowReviewDialog(false);
    setReviewNotes('');
    setSelectedAlert(null);
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Fraud & Abuse Alerts
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
              Auto-Suspend BLOCKED
            </Badge>
            <Badge variant="outline" className="bg-primary/10">
              {alerts.filter(a => a.status === 'pending_review').length} Pending Review
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* AI Notice */}
        <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 text-sm">
            <Brain className="h-4 w-4 text-primary" />
            <span className="font-medium">AI Detection Engine Active</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            AI suggests, humans decide. All enforcement actions require manual approval.
          </p>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${
                  alert.severity === 'high' || alert.severity === 'critical'
                    ? 'border-orange-500/30 bg-orange-500/5'
                    : 'border-border/50 bg-background/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className={`h-4 w-4 ${
                        alert.severity === 'high' || alert.severity === 'critical' 
                          ? 'text-orange-400' 
                          : 'text-muted-foreground'
                      }`} />
                      <span className="font-medium">{alert.alertType}</span>
                      {getSeverityBadge(alert.severity)}
                      {getStatusBadge(alert.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {alert.franchiseName} • {alert.territory}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs">
                      <Brain className="h-3 w-3 text-primary" />
                      <span className="font-medium">{alert.aiConfidence}%</span>
                      <span className="text-muted-foreground">confidence</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{alert.detectedAt}</div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>

                {/* Detected Patterns */}
                <div className="mb-3">
                  <div className="text-xs font-medium mb-2">Detected Patterns:</div>
                  <div className="flex flex-wrap gap-1">
                    {alert.patterns.map((pattern, i) => (
                      <Badge key={i} variant="outline" className="text-xs bg-muted/50">
                        {pattern}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* AI Recommendation */}
                <div className="p-2 rounded bg-primary/5 border border-primary/10 mb-3">
                  <div className="text-xs">
                    <span className="font-medium text-primary">AI Recommendation: </span>
                    <span className="text-muted-foreground">{alert.recommendation}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedAlert(alert);
                      setShowReviewDialog(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Review
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        {/* Review Dialog */}
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Review Fraud Alert
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{selectedAlert?.alertType}</span>
                  {selectedAlert && getSeverityBadge(selectedAlert.severity)}
                </div>
                <p className="text-sm text-muted-foreground">{selectedAlert?.description}</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  {selectedAlert?.franchiseName} • {selectedAlert?.territory}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium mb-2">AI Detected Patterns:</div>
                <div className="flex flex-wrap gap-1">
                  {selectedAlert?.patterns.map((pattern, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {pattern}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-2 rounded bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-2 text-xs">
                  <Brain className="h-3 w-3 text-primary" />
                  <span className="font-medium">AI Confidence: {selectedAlert?.aiConfidence}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedAlert?.recommendation}
                </p>
              </div>

              <Textarea
                placeholder="Review notes (required for dismissal)..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="min-h-[80px]"
              />

              <div className="p-2 rounded bg-destructive/10 border border-destructive/20">
                <p className="text-xs text-destructive flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Human decision required. AI cannot auto-suspend franchises.
                </p>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                Cancel
              </Button>
              <Button variant="outline" onClick={handleDismissAlert}>
                <XCircle className="h-4 w-4 mr-1" />
                Dismiss
              </Button>
              <Button onClick={handleConfirmFraud} className="bg-orange-500 hover:bg-orange-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                Confirm Fraud
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
