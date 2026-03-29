import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Brain, AlertTriangle, Eye, CheckCircle2, Ban, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface AIAlert {
  id: string;
  userId: string;
  alertType: string;
  riskScore: number;
  behaviorFlags: string[];
  details: string;
  detectedAt: Date;
  status: 'pending_review' | 'confirmed' | 'dismissed';
  aiRecommendation: 'monitor' | 'suspend' | 'freeze_wallet' | 'escalate';
}

const SAAIFraudAlerts = () => {
  const [alerts, setAlerts] = useState<AIAlert[]>([
    {
      id: 'ai-001',
      userId: 'VALA-7788',
      alertType: 'Unusual Transaction Pattern',
      riskScore: 87,
      behaviorFlags: ['Rapid withdrawals', 'New device', 'VPN detected'],
      details: 'User made 5 withdrawal requests in 2 hours from different devices',
      detectedAt: new Date(Date.now() - 1800000),
      status: 'pending_review',
      aiRecommendation: 'freeze_wallet',
    },
    {
      id: 'ai-002',
      userId: 'VALA-3421',
      alertType: 'Account Takeover Attempt',
      riskScore: 92,
      behaviorFlags: ['Multiple login failures', 'Password reset', 'Location change'],
      details: 'Possible account compromise detected - login from unusual location after failed attempts',
      detectedAt: new Date(Date.now() - 3600000),
      status: 'pending_review',
      aiRecommendation: 'suspend',
    },
    {
      id: 'ai-003',
      userId: 'VALA-5566',
      alertType: 'Commission Fraud Pattern',
      riskScore: 65,
      behaviorFlags: ['Self-referrals suspected', 'Circular transactions'],
      details: 'AI detected potential self-referral scheme across multiple accounts',
      detectedAt: new Date(Date.now() - 7200000),
      status: 'pending_review',
      aiRecommendation: 'escalate',
    },
  ]);

  const [selectedAlert, setSelectedAlert] = useState<AIAlert | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<'confirm' | 'dismiss' | null>(null);

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 60) return 'text-orange-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case 'freeze_wallet':
        return <Badge className="bg-blue-500/20 text-blue-400">Freeze Wallet</Badge>;
      case 'suspend':
        return <Badge className="bg-red-500/20 text-red-400">Suspend Account</Badge>;
      case 'escalate':
        return <Badge className="bg-purple-500/20 text-purple-400">Escalate to Master</Badge>;
      default:
        return <Badge className="bg-amber-500/20 text-amber-400">Monitor</Badge>;
    }
  };

  const handleAutoAction = () => {
    toast.error('BLOCKED: Automated actions require human confirmation');
  };

  const openConfirmDialog = (alert: AIAlert, action: 'confirm' | 'dismiss') => {
    setSelectedAlert(alert);
    setPendingAction(action);
    setActionReason('');
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = () => {
    if (!selectedAlert || !pendingAction || actionReason.trim().length < 10) {
      toast.error('Reason must be at least 10 characters');
      return;
    }

    setAlerts(prev => prev.map(a => 
      a.id === selectedAlert.id 
        ? { ...a, status: pendingAction === 'confirm' ? 'confirmed' : 'dismissed' }
        : a
    ));

    toast.success(`Alert ${pendingAction === 'confirm' ? 'confirmed' : 'dismissed'} with human verification`);
    setShowConfirmDialog(false);
    setSelectedAlert(null);
    setPendingAction(null);
    setActionReason('');
  };

  const pendingAlerts = alerts.filter(a => a.status === 'pending_review');

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              AI Fraud & Abuse Alerts
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-purple-500/10 text-purple-400">
                {pendingAlerts.length} Pending Review
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground opacity-50 cursor-not-allowed"
                onClick={handleAutoAction}
              >
                <Ban className="w-4 h-4 mr-1" />
                Auto-Ban
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            AI flags require human confirmation — No automated bans or freezes
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border ${
                    alert.status === 'pending_review' 
                      ? 'bg-background/50 border-border/30' 
                      : alert.status === 'confirmed'
                        ? 'bg-red-500/5 border-red-500/20'
                        : 'bg-muted/20 border-border/20 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className={`w-5 h-5 ${getRiskColor(alert.riskScore)}`} />
                        <span className="font-medium">{alert.alertType}</span>
                        <span className={`text-lg font-bold ${getRiskColor(alert.riskScore)}`}>
                          {alert.riskScore}%
                        </span>
                        {getRecommendationBadge(alert.aiRecommendation)}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-sm">{alert.userId}</span>
                        <Badge variant="outline" className={
                          alert.status === 'confirmed' ? 'bg-red-500/20 text-red-400' :
                          alert.status === 'dismissed' ? 'bg-muted text-muted-foreground' :
                          'bg-amber-500/20 text-amber-400'
                        }>
                          {alert.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert.details}
                      </p>
                      
                      <div className="flex flex-wrap gap-1">
                        {alert.behaviorFlags.map((flag, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] bg-red-500/10 text-red-400">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {alert.status === 'pending_review' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openConfirmDialog(alert, 'confirm')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review & Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-muted-foreground"
                          onClick={() => openConfirmDialog(alert, 'dismiss')}
                        >
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {alerts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No AI alerts at this time</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {pendingAction === 'confirm' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Ban className="w-5 h-5 text-muted-foreground" />
              )}
              Human Confirmation Required
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <p className="text-sm text-purple-400 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Recommendation: {selectedAlert?.aiRecommendation.replace('_', ' ')}
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-background/50 border border-border/30">
              <p className="font-medium">{selectedAlert?.alertType}</p>
              <p className="text-sm text-muted-foreground">{selectedAlert?.details}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Your Assessment (Required - min 10 characters)
              </label>
              <Textarea
                placeholder="Enter your review notes and reason for this decision..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={actionReason.trim().length < 10}
              className={pendingAction === 'confirm' 
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : ''
              }
            >
              {pendingAction === 'confirm' ? 'Confirm & Take Action' : 'Dismiss Alert'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SAAIFraudAlerts;
