import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, FileText, Scale, MessageSquare, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ComplianceIssue {
  id: string;
  valaId: string;
  issueType: 'trademark' | 'policy' | 'content' | 'disclosure';
  description: string;
  severity: 'warning' | 'violation';
  detectedAt: string;
  status: 'open' | 'warned' | 'escalated';
}

const mockIssues: ComplianceIssue[] = [
  { id: '1', valaId: 'VL-7382916', issueType: 'trademark', description: 'Using competitor brand name in promotional content', severity: 'violation', detectedAt: '2024-01-15', status: 'open' },
  { id: '2', valaId: 'VL-4827163', issueType: 'disclosure', description: 'Missing #ad or #sponsored disclosure in posts', severity: 'warning', detectedAt: '2024-01-14', status: 'warned' },
  { id: '3', valaId: 'VL-2918374', issueType: 'content', description: 'Claims not aligned with approved messaging', severity: 'warning', detectedAt: '2024-01-14', status: 'open' },
  { id: '4', valaId: 'VL-9173628', issueType: 'policy', description: 'Promoting in restricted region', severity: 'violation', detectedAt: '2024-01-13', status: 'escalated' },
];

const policyChecklist = [
  { id: 1, policy: 'Brand Guidelines Compliance', status: 'compliant', lastCheck: '2024-01-15' },
  { id: 2, policy: 'Disclosure Requirements', status: 'issues', lastCheck: '2024-01-15' },
  { id: 3, policy: 'Trademark Usage Rules', status: 'issues', lastCheck: '2024-01-15' },
  { id: 4, policy: 'Content Approval Process', status: 'compliant', lastCheck: '2024-01-14' },
  { id: 5, policy: 'Region Restrictions', status: 'compliant', lastCheck: '2024-01-14' },
];

export function IMComplianceStatus() {
  const { toast } = useToast();
  const [issues, setIssues] = useState<ComplianceIssue[]>(mockIssues);
  const [showWarnDialog, setShowWarnDialog] = useState(false);
  const [showEscalateDialog, setShowEscalateDialog] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<ComplianceIssue | null>(null);
  const [warningMessage, setWarningMessage] = useState('');
  const [escalationNote, setEscalationNote] = useState('');

  const handleWarn = () => {
    if (!warningMessage.trim()) {
      toast({
        title: "Warning Message Required",
        description: "Please provide a warning message.",
        variant: "destructive",
      });
      return;
    }

    if (selectedIssue) {
      setIssues(prev => prev.map(i => 
        i.id === selectedIssue.id ? { ...i, status: 'warned' as const } : i
      ));
      toast({
        title: "Warning Issued",
        description: `Warning sent to ${selectedIssue.valaId}. Action logged.`,
      });
    }
    setShowWarnDialog(false);
    setWarningMessage('');
    setSelectedIssue(null);
  };

  const handleEscalate = () => {
    if (!escalationNote.trim()) {
      toast({
        title: "Escalation Note Required",
        description: "Please provide details for escalation.",
        variant: "destructive",
      });
      return;
    }

    if (selectedIssue) {
      setIssues(prev => prev.map(i => 
        i.id === selectedIssue.id ? { ...i, status: 'escalated' as const } : i
      ));
      toast({
        title: "Issue Escalated",
        description: `Issue escalated to Legal/Admin for ${selectedIssue.valaId}. Action logged.`,
      });
    }
    setShowEscalateDialog(false);
    setEscalationNote('');
    setSelectedIssue(null);
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'trademark': return <Scale className="w-4 h-4 text-red-400" />;
      case 'policy': return <FileText className="w-4 h-4 text-amber-400" />;
      case 'disclosure': return <MessageSquare className="w-4 h-4 text-blue-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    }
  };

  const openIssues = issues.filter(i => i.status === 'open').length;
  const escalatedIssues = issues.filter(i => i.status === 'escalated').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Compliance & Policy Status</h2>
          <p className="text-sm text-muted-foreground">Trademark safety • Policy enforcement • Legal coordination</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-amber-500/10 text-amber-400">
            {openIssues} Open Issues
          </Badge>
          <Badge variant="outline" className="bg-red-500/10 text-red-400">
            {escalatedIssues} Escalated
          </Badge>
        </div>
      </div>

      {/* Policy Checklist */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Policy Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {policyChecklist.map((policy) => (
              <div key={policy.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  {policy.status === 'compliant' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  )}
                  <span className="text-foreground">{policy.policy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Last check: {policy.lastCheck}</span>
                  <Badge variant="outline" className={
                    policy.status === 'compliant' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-amber-500/20 text-amber-400'
                  }>
                    {policy.status === 'compliant' ? 'COMPLIANT' : 'ISSUES'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Compliance Issues */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Active Compliance Issues
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {issues.map((issue, index) => (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg ${
                issue.severity === 'violation' ? 'bg-red-500/10 border border-red-500/30' : 'bg-amber-500/10 border border-amber-500/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mt-1">
                    {getIssueIcon(issue.issueType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-foreground">{issue.valaId}</span>
                      <Badge variant="outline" className={
                        issue.severity === 'violation' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                      }>
                        {issue.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {issue.issueType.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Detected: {issue.detectedAt}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Badge variant="outline" className={
                    issue.status === 'open' ? 'bg-blue-500/20 text-blue-400' :
                    issue.status === 'warned' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }>
                    {issue.status.toUpperCase()}
                  </Badge>
                  
                  {issue.status === 'open' && (
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedIssue(issue);
                          setShowWarnDialog(true);
                        }}
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Warn
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-400 border-red-500/30"
                        onClick={() => {
                          setSelectedIssue(issue);
                          setShowEscalateDialog(true);
                        }}
                      >
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        Escalate
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Warn Dialog */}
      <Dialog open={showWarnDialog} onOpenChange={setShowWarnDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Warning</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Warning <span className="font-mono font-semibold">{selectedIssue?.valaId}</span> for: {selectedIssue?.description}
            </p>
            <div>
              <label className="text-sm font-medium">Warning Message (Required)</label>
              <Textarea
                placeholder="Write your warning message..."
                value={warningMessage}
                onChange={(e) => setWarningMessage(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWarnDialog(false)}>Cancel</Button>
            <Button onClick={handleWarn}>Send Warning</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Escalate Dialog */}
      <Dialog open={showEscalateDialog} onOpenChange={setShowEscalateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escalate to Legal/Admin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-sm text-red-300">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                This will escalate the issue to Legal and Admin teams for review.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Escalating issue for <span className="font-mono font-semibold">{selectedIssue?.valaId}</span>
            </p>
            <div>
              <label className="text-sm font-medium">Escalation Note (Required)</label>
              <Textarea
                placeholder="Provide details for the Legal/Admin team..."
                value={escalationNote}
                onChange={(e) => setEscalationNote(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEscalateDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleEscalate}>Confirm Escalation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
