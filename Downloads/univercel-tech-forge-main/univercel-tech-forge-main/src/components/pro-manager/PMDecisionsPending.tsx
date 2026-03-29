import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  ClipboardList, 
  CheckCircle, 
  XCircle,
  Clock,
  DollarSign,
  ArrowUpRight,
  Shield,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface PendingDecision {
  id: string;
  type: 'exception' | 'extension' | 'override' | 'financial';
  subject: string;
  description: string;
  requestedBy: string;
  requestedAt: string;
  priority: 'critical' | 'high' | 'medium';
  isFinancial: boolean;
  amount?: number;
}

const mockDecisions: PendingDecision[] = [
  {
    id: 'DEC-001',
    type: 'exception',
    subject: 'SLA Exception Request - Project Delta',
    description: 'Request to waive SLA penalty due to external dependency delay (third-party API outage)',
    requestedBy: 'DM-3421',
    requestedAt: '2035-01-15 09:00',
    priority: 'high',
    isFinancial: false
  },
  {
    id: 'DEC-002',
    type: 'extension',
    subject: 'Deadline Extension - Feature XYZ',
    description: 'Request 48h extension for feature delivery due to scope expansion mid-sprint',
    requestedBy: 'TM-7823',
    requestedAt: '2035-01-14 16:30',
    priority: 'medium',
    isFinancial: false
  },
  {
    id: 'DEC-003',
    type: 'financial',
    subject: 'Penalty Waiver Request',
    description: 'Request to waive ₹15,000 penalty for DEV-4521 due to documented personal emergency',
    requestedBy: 'DM-3421',
    requestedAt: '2035-01-14 11:00',
    priority: 'high',
    isFinancial: true,
    amount: 15000
  },
  {
    id: 'DEC-004',
    type: 'override',
    subject: 'Priority Override - Bug Fix',
    description: 'Request to override task priority from medium to critical for security-related bug',
    requestedBy: 'LM-5432',
    requestedAt: '2035-01-15 08:15',
    priority: 'critical',
    isFinancial: false
  }
];

const getTypeBadge = (type: string, isFinancial: boolean) => {
  if (isFinancial) {
    return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Financial</Badge>;
  }
  switch (type) {
    case 'exception':
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Exception</Badge>;
    case 'extension':
      return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Extension</Badge>;
    case 'override':
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Override</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'critical':
      return <Badge variant="destructive">Critical</Badge>;
    case 'high':
      return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">High</Badge>;
    default:
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Medium</Badge>;
  }
};

export const PMDecisionsPending: React.FC = () => {
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [decisionNote, setDecisionNote] = useState('');

  const handleApprove = (decision: PendingDecision) => {
    if (decision.isFinancial) {
      toast.info(`Financial decision ${decision.id} recommended for approval`, {
        description: 'Forwarded to Finance for final approval'
      });
      console.log('[PRO-MANAGER] Financial recommendation:', decision.id, 'RECOMMEND APPROVE');
    } else {
      toast.success(`Decision ${decision.id} approved`, {
        description: 'Non-financial exception approved with logged justification'
      });
      console.log('[PRO-MANAGER] Decision approved:', decision.id);
    }
    setSelectedDecision(null);
    setDecisionNote('');
  };

  const handleReject = (decision: PendingDecision) => {
    if (!decisionNote.trim()) {
      toast.error('Rejection reason is mandatory');
      return;
    }
    toast.error(`Decision ${decision.id} rejected`, {
      description: 'Rejection logged with reason'
    });
    console.log('[PRO-MANAGER] Decision rejected:', decision.id, 'Reason:', decisionNote);
    setSelectedDecision(null);
    setDecisionNote('');
  };

  const handleRecommendUp = (decision: PendingDecision) => {
    if (!decisionNote.trim()) {
      toast.error('Recommendation note is mandatory');
      return;
    }
    toast.warning(`Decision ${decision.id} forwarded to Master Admin`, {
      description: 'With recommendation note attached'
    });
    console.log('[PRO-MANAGER] Decision forwarded:', decision.id);
    setSelectedDecision(null);
    setDecisionNote('');
  };

  const financialCount = mockDecisions.filter(d => d.isFinancial).length;
  const nonFinancialCount = mockDecisions.filter(d => !d.isFinancial).length;

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="h-5 w-5 text-primary" />
            Decisions Pending
            <Badge variant="destructive" className="ml-2">{mockDecisions.length}</Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/30 border border-border/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{nonFinancialCount}</p>
            <p className="text-xs text-muted-foreground">Non-Financial (Can Approve)</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <DollarSign className="h-4 w-4 text-amber-500" />
              <p className="text-2xl font-bold text-amber-400">{financialCount}</p>
            </div>
            <p className="text-xs text-muted-foreground">Financial (Recommend Only)</p>
          </div>
        </div>

        <div className="space-y-3 max-h-[350px] overflow-y-auto">
          {mockDecisions.map((decision, index) => (
            <motion.div
              key={decision.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border rounded-lg p-4 ${
                decision.isFinancial
                  ? 'bg-amber-500/5 border-amber-500/30'
                  : decision.priority === 'critical'
                  ? 'bg-red-500/5 border-red-500/30'
                  : 'bg-muted/30 border-border/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-sm">{decision.id}</span>
                    {getTypeBadge(decision.type, decision.isFinancial)}
                    {getPriorityBadge(decision.priority)}
                  </div>
                  <p className="font-medium text-sm">{decision.subject}</p>
                </div>
                {decision.isFinancial && decision.amount && (
                  <Badge variant="outline" className="border-amber-500/50 text-amber-400">
                    ₹{decision.amount.toLocaleString()}
                  </Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground mb-2">{decision.description}</p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  By: {decision.requestedBy}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {decision.requestedAt}
                </span>
              </div>

              {/* Decision Panel */}
              {selectedDecision === decision.id ? (
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <Textarea
                    placeholder={decision.isFinancial ? "Enter recommendation note..." : "Enter decision justification..."}
                    value={decisionNote}
                    onChange={(e) => setDecisionNote(e.target.value)}
                    className="text-sm min-h-[60px]"
                  />
                  <div className="flex gap-2">
                    {decision.isFinancial ? (
                      <>
                        <Button
                          size="sm"
                          className="flex-1 bg-amber-600 hover:bg-amber-700"
                          onClick={() => handleRecommendUp(decision)}
                        >
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          Recommend to Finance
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleApprove(decision)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleReject(decision)}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedDecision(null);
                        setDecisionNote('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedDecision(decision.id)}
                >
                  {decision.isFinancial ? 'Review & Recommend' : 'Review & Decide'}
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            <Shield className="h-3 w-3 inline mr-1" />
            Financial decisions = Recommend only • All decisions logged
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
