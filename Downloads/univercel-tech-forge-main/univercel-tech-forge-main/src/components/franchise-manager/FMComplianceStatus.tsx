import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, AlertTriangle, CheckCircle, XCircle, MessageSquare, Scale, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

type ComplianceSeverity = 'low' | 'medium' | 'high' | 'critical';
type ComplianceStatus = 'open' | 'warned' | 'pending_review' | 'escalated' | 'resolved';

interface ComplianceIssue {
  id: string;
  franchiseId: string;
  franchiseName: string;
  territory: string;
  issueType: string;
  description: string;
  severity: ComplianceSeverity;
  status: ComplianceStatus;
  detectedAt: string;
  evidence: string;
}

const mockIssues: ComplianceIssue[] = [
  {
    id: 'CI-001',
    franchiseId: 'FR-003',
    franchiseName: 'SaaS Solutions Bangalore',
    territory: 'Bangalore East',
    issueType: 'Brand Misuse',
    description: 'Using unauthorized logo variations in marketing materials',
    severity: 'medium',
    status: 'open',
    detectedAt: '2024-01-14',
    evidence: 'Screenshot of marketing flyer with modified logo'
  },
  {
    id: 'CI-002',
    franchiseId: 'FR-002',
    franchiseName: 'Digital Dynamics Delhi',
    territory: 'Delhi North',
    issueType: 'Trademark Violation',
    description: 'Using trademarked terms incorrectly in sales pitches',
    severity: 'low',
    status: 'warned',
    detectedAt: '2024-01-12',
    evidence: 'Recorded sales call excerpt'
  },
  {
    id: 'CI-003',
    franchiseId: 'FR-003',
    franchiseName: 'SaaS Solutions Bangalore',
    territory: 'Bangalore East',
    issueType: 'Policy Breach',
    description: 'Operating in adjacent territory without approval',
    severity: 'high',
    status: 'pending_review',
    detectedAt: '2024-01-10',
    evidence: 'Lead submissions from non-assigned territory'
  }
];

export function FMComplianceStatus() {
  const [issues] = useState<ComplianceIssue[]>(mockIssues);
  const [selectedIssue, setSelectedIssue] = useState<ComplianceIssue | null>(null);
  const [showWarnDialog, setShowWarnDialog] = useState(false);
  const [showEscalateDialog, setShowEscalateDialog] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [escalateReason, setEscalateReason] = useState('');
  const [escalateTo, setEscalateTo] = useState<'legal' | 'pro'>('legal');

  const getSeverityBadge = (severity: ComplianceSeverity) => {
    const configs = {
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      critical: 'bg-destructive/20 text-destructive border-destructive/30'
    };
    return <Badge className={configs[severity]}>{severity.toUpperCase()}</Badge>;
  };

  const getStatusBadge = (status: ComplianceStatus) => {
    const configs = {
      open: 'bg-blue-500/20 text-blue-400',
      warned: 'bg-yellow-500/20 text-yellow-400',
      pending_review: 'bg-purple-500/20 text-purple-400',
      escalated: 'bg-orange-500/20 text-orange-400',
      resolved: 'bg-green-500/20 text-green-400'
    };
    return <Badge className={configs[status]}>{status.replace('_', ' ')}</Badge>;
  };

  const handleWarn = () => {
    if (!warningMessage.trim()) {
      toast.error('Warning message required');
      return;
    }
    toast.success('Warning Issued', {
      description: `Warning sent to ${selectedIssue?.franchiseName}`
    });
    setShowWarnDialog(false);
    setWarningMessage('');
    setSelectedIssue(null);
  };

  const handleEscalate = () => {
    if (!escalateReason.trim()) {
      toast.error('Escalation reason required');
      return;
    }
    toast.success('Issue Escalated', {
      description: `Escalated to ${escalateTo === 'legal' ? 'Legal Team' : 'Pro Manager'}`
    });
    setShowEscalateDialog(false);
    setEscalateReason('');
    setSelectedIssue(null);
  };

  const handleRecommendSuspension = (issue: ComplianceIssue) => {
    toast.info('Suspension Recommended', {
      description: `Recommendation sent to Admin for ${issue.franchiseName}`
    });
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Compliance & Policy Status
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-destructive/10 text-destructive">
              {issues.filter(i => i.severity === 'high' || i.severity === 'critical').length} High Priority
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {issues.map((issue, index) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${
                  issue.severity === 'high' || issue.severity === 'critical'
                    ? 'border-destructive/30 bg-destructive/5'
                    : 'border-border/50 bg-background/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{issue.issueType}</span>
                      {getSeverityBadge(issue.severity)}
                      {getStatusBadge(issue.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      <span>{issue.franchiseName}</span>
                      <span>•</span>
                      <span>{issue.territory}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">{issue.id}</Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Detected: {issue.detectedAt} • Evidence: {issue.evidence}
                  </div>
                  <div className="flex items-center gap-2">
                    {issue.status === 'open' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedIssue(issue);
                            setShowWarnDialog(true);
                          }}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Warn
                        </Button>
                        {(issue.severity === 'high' || issue.severity === 'critical') && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-orange-500 border-orange-500/30"
                            onClick={() => handleRecommendSuspension(issue)}
                          >
                            Recommend Suspension
                          </Button>
                        )}
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-purple-500 border-purple-500/30"
                      onClick={() => {
                        setSelectedIssue(issue);
                        setShowEscalateDialog(true);
                      }}
                    >
                      <Scale className="h-4 w-4 mr-1" />
                      Escalate
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        {/* Warn Dialog */}
        <Dialog open={showWarnDialog} onOpenChange={setShowWarnDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-yellow-500">
                <AlertTriangle className="h-5 w-5" />
                Issue Warning
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-sm font-medium">{selectedIssue?.issueType}</p>
                <p className="text-xs text-muted-foreground">{selectedIssue?.franchiseName}</p>
              </div>
              <Textarea
                placeholder="Warning message to franchise..."
                value={warningMessage}
                onChange={(e) => setWarningMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowWarnDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleWarn} className="bg-yellow-500 hover:bg-yellow-600">
                Send Warning
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Escalate Dialog */}
        <Dialog open={showEscalateDialog} onOpenChange={setShowEscalateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-purple-500" />
                Escalate Issue
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-sm font-medium">{selectedIssue?.issueType}</p>
                <p className="text-xs text-muted-foreground">{selectedIssue?.franchiseName}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={escalateTo === 'legal' ? 'default' : 'outline'}
                  onClick={() => setEscalateTo('legal')}
                  className="justify-center"
                >
                  <Scale className="h-4 w-4 mr-2" />
                  Legal Team
                </Button>
                <Button
                  variant={escalateTo === 'pro' ? 'default' : 'outline'}
                  onClick={() => setEscalateTo('pro')}
                  className="justify-center"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Pro Manager
                </Button>
              </div>
              <Textarea
                placeholder="Reason for escalation..."
                value={escalateReason}
                onChange={(e) => setEscalateReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEscalateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEscalate} className="bg-purple-500 hover:bg-purple-600">
                Escalate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
