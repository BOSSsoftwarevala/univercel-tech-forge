import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Scale,
  ArrowUpRight,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

interface ComplianceIssue {
  id: string;
  resellerId: string;
  resellerName: string;
  issueType: 'trademark' | 'policy' | 'brand_misuse' | 'unauthorized_claim';
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  detectedAt: string;
  status: 'open' | 'warned' | 'escalated' | 'resolved';
  evidence?: string;
}

const mockIssues: ComplianceIssue[] = [
  {
    id: '1',
    resellerId: 'VL-RS-4521',
    resellerName: 'Quick Sales Corp',
    issueType: 'trademark',
    description: 'Using modified company logo in promotional materials',
    severity: 'high',
    detectedAt: '2024-01-15T09:00:00Z',
    status: 'open',
    evidence: 'Screenshot captured on landing page'
  },
  {
    id: '2',
    resellerId: 'VL-RS-7832',
    resellerName: 'Metro Distributors',
    issueType: 'unauthorized_claim',
    description: 'Claiming exclusive partnership status without authorization',
    severity: 'critical',
    detectedAt: '2024-01-14T14:30:00Z',
    status: 'warned'
  },
  {
    id: '3',
    resellerId: 'VL-RS-2198',
    resellerName: 'Southern Sales Hub',
    issueType: 'policy',
    description: 'Promotional messaging violates pricing policy',
    severity: 'medium',
    detectedAt: '2024-01-13T11:15:00Z',
    status: 'escalated'
  }
];

export const RMComplianceStatus: React.FC = () => {
  const [issues, setIssues] = useState<ComplianceIssue[]>(mockIssues);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState('');
  const [escalationNote, setEscalationNote] = useState('');

  const handleWarn = (id: string) => {
    if (!warningMessage.trim()) {
      toast.error('Warning message is required');
      return;
    }
    setIssues(prev => 
      prev.map(issue => 
        issue.id === id ? { ...issue, status: 'warned' as const } : issue
      )
    );
    toast.success('Warning issued and logged');
    setWarningMessage('');
    setSelectedIssue(null);
  };

  const handleRecommendSuspension = (id: string) => {
    toast.success('Suspension recommendation sent to Admin');
    setSelectedIssue(null);
  };

  const handleEscalate = (id: string, team: 'legal' | 'admin') => {
    if (!escalationNote.trim()) {
      toast.error('Escalation note is required');
      return;
    }
    setIssues(prev => 
      prev.map(issue => 
        issue.id === id ? { ...issue, status: 'escalated' as const } : issue
      )
    );
    toast.success(`Escalated to ${team === 'legal' ? 'Legal Team' : 'Admin'}`);
    setEscalationNote('');
    setSelectedIssue(null);
  };

  const getIssueTypeIcon = (type: string) => {
    switch (type) {
      case 'trademark':
        return <Shield className="h-4 w-4" />;
      case 'policy':
        return <FileText className="h-4 w-4" />;
      case 'brand_misuse':
        return <AlertTriangle className="h-4 w-4" />;
      case 'unauthorized_claim':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      critical: 'bg-red-500/10 text-red-500 border-red-500/30',
      high: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
      medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
      low: 'bg-blue-500/10 text-blue-500 border-blue-500/30'
    };
    return <Badge className={colors[severity as keyof typeof colors] || colors.low}>{severity.toUpperCase()}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const config = {
      open: { color: 'bg-red-500/10 text-red-500', label: 'Open' },
      warned: { color: 'bg-yellow-500/10 text-yellow-500', label: 'Warned' },
      escalated: { color: 'bg-purple-500/10 text-purple-500', label: 'Escalated' },
      resolved: { color: 'bg-green-500/10 text-green-500', label: 'Resolved' }
    };
    const cfg = config[status as keyof typeof config] || config.open;
    return <Badge className={cfg.color}>{cfg.label}</Badge>;
  };

  const openCount = issues.filter(i => i.status === 'open').length;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Scale className="h-5 w-5 text-primary" />
            Compliance & Policy Status
          </CardTitle>
          <Badge variant="outline" className={openCount > 0 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}>
            {openCount} Open Issues
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {issues.map((issue) => (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-border rounded-lg p-4 bg-background"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    issue.severity === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                  }`}>
                    {getIssueTypeIcon(issue.issueType)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground capitalize">
                      {issue.issueType.replace('_', ' ')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {issue.resellerName} ({issue.resellerId})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getSeverityBadge(issue.severity)}
                  {getStatusBadge(issue.status)}
                </div>
              </div>

              <p className="text-sm text-foreground mb-2">{issue.description}</p>
              
              {issue.evidence && (
                <p className="text-xs text-muted-foreground mb-3">
                  Evidence: {issue.evidence}
                </p>
              )}

              <p className="text-xs text-muted-foreground mb-3">
                Detected: {new Date(issue.detectedAt).toLocaleString()}
              </p>

              {selectedIssue === issue.id ? (
                <div className="border-t border-border pt-4 space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Warning Message:
                    </label>
                    <Textarea
                      value={warningMessage}
                      onChange={(e) => setWarningMessage(e.target.value)}
                      placeholder="Compose warning message to reseller..."
                      className="bg-background border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Escalation Note:
                    </label>
                    <Textarea
                      value={escalationNote}
                      onChange={(e) => setEscalationNote(e.target.value)}
                      placeholder="Provide context for escalation..."
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleWarn(issue.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Issue Warning
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                      onClick={() => handleRecommendSuspension(issue.id)}
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Recommend Suspension
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-purple-500/50 text-purple-500 hover:bg-purple-500/10"
                      onClick={() => handleEscalate(issue.id, 'legal')}
                    >
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      Escalate Legal
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-blue-500/50 text-blue-500 hover:bg-blue-500/10"
                      onClick={() => handleEscalate(issue.id, 'admin')}
                    >
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      Escalate Admin
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        setSelectedIssue(null);
                        setWarningMessage('');
                        setEscalationNote('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                issue.status === 'open' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedIssue(issue.id)}
                  >
                    Take Action
                  </Button>
                )
              )}
            </motion.div>
          ))}
        </div>

        {issues.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500 opacity-50" />
            <p>No compliance issues</p>
          </div>
        )}

        <div className="mt-4 p-3 bg-muted/30 border border-border rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Compliance Actions:</strong> Warn → Recommend Suspension → Escalate Legal/Admin
            <br />
            All actions are logged immutably.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
