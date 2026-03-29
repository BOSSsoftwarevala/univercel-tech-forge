import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertTriangle, 
  ArrowUpRight, 
  Clock, 
  FileText,
  CheckCircle,
  XCircle,
  Shield,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Escalation {
  id: string;
  source: 'task_manager' | 'dev_manager' | 'legal';
  sourceId: string;
  subject: string;
  description: string;
  priority: 'critical' | 'high' | 'medium';
  status: 'pending' | 'in_review' | 'resolved' | 'forwarded';
  evidence: string[];
  createdAt: string;
  createdBy: string;
}

const mockEscalations: Escalation[] = [
  {
    id: 'ESC-001',
    source: 'task_manager',
    sourceId: 'TM-7823',
    subject: 'Repeated SLA Breaches - DEV-4521',
    description: 'Developer has breached SLA 3 times in the past week. Pattern indicates potential capacity issue.',
    priority: 'critical',
    status: 'pending',
    evidence: ['SLA-Report-0891.pdf', 'Timeline-Analysis.xlsx'],
    createdAt: '2035-01-15 09:30',
    createdBy: 'TM-SYSTEM'
  },
  {
    id: 'ESC-002',
    source: 'dev_manager',
    sourceId: 'DM-3421',
    subject: 'Quality Decline - Project Alpha',
    description: 'Code review rejection rate increased to 45% over past 2 weeks. Requires quality intervention.',
    priority: 'high',
    status: 'in_review',
    evidence: ['Quality-Metrics.pdf', 'Review-History.json'],
    createdAt: '2035-01-14 16:45',
    createdBy: 'DM-7821'
  },
  {
    id: 'ESC-003',
    source: 'legal',
    sourceId: 'LM-1234',
    subject: 'Policy Violation Report',
    description: 'Partner account flagged for potential trademark misuse. Requires quality review before action.',
    priority: 'medium',
    status: 'pending',
    evidence: ['Trademark-Report.pdf', 'Screenshots.zip'],
    createdAt: '2035-01-14 11:20',
    createdBy: 'LM-5432'
  }
];

const getSourceBadge = (source: string) => {
  switch (source) {
    case 'task_manager':
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Task Manager</Badge>;
    case 'dev_manager':
      return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Dev Manager</Badge>;
    case 'legal':
      return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Legal</Badge>;
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

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">Pending</Badge>;
    case 'in_review':
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">In Review</Badge>;
    case 'resolved':
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Resolved</Badge>;
    case 'forwarded':
      return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Forwarded</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export const PMEscalationsQueue: React.FC = () => {
  const [selectedEscalation, setSelectedEscalation] = useState<string | null>(null);
  const [decisionNote, setDecisionNote] = useState('');

  const handleResolve = (escalation: Escalation) => {
    if (!decisionNote.trim()) {
      toast.error('Decision note is mandatory');
      return;
    }
    toast.success(`Escalation ${escalation.id} resolved`, {
      description: 'Decision logged and parties notified'
    });
    console.log('[PRO-MANAGER] Escalation resolved:', escalation.id, 'Decision:', decisionNote);
    setSelectedEscalation(null);
    setDecisionNote('');
  };

  const handleForwardUp = (escalation: Escalation) => {
    if (!decisionNote.trim()) {
      toast.error('Reason for forwarding is mandatory');
      return;
    }
    toast.warning(`Escalation ${escalation.id} forwarded to Master Admin`, {
      description: 'With attached evidence and decision note'
    });
    console.log('[PRO-MANAGER] Escalation forwarded:', escalation.id);
    setSelectedEscalation(null);
    setDecisionNote('');
  };

  const pendingCount = mockEscalations.filter(e => e.status === 'pending').length;

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Escalations Queue
            {pendingCount > 0 && (
              <Badge variant="destructive" className="ml-2">{pendingCount}</Badge>
            )}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Evidence Mandatory
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {mockEscalations.map((escalation, index) => (
            <motion.div
              key={escalation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border rounded-lg p-4 ${
                escalation.priority === 'critical'
                  ? 'bg-red-500/5 border-red-500/30'
                  : 'bg-muted/30 border-border/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-sm">{escalation.id}</span>
                    {getSourceBadge(escalation.source)}
                    {getPriorityBadge(escalation.priority)}
                  </div>
                  <p className="font-medium text-sm">{escalation.subject}</p>
                </div>
                {getStatusBadge(escalation.status)}
              </div>

              <p className="text-xs text-muted-foreground mb-3">{escalation.description}</p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {escalation.createdAt}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {escalation.createdBy}
                </span>
              </div>

              {/* Evidence List */}
              <div className="flex flex-wrap gap-1 mb-3">
                {escalation.evidence.map((file, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    {file}
                  </Badge>
                ))}
              </div>

              {/* Decision Panel */}
              {selectedEscalation === escalation.id ? (
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <Textarea
                    placeholder="Enter your decision/resolution note (MANDATORY)..."
                    value={decisionNote}
                    onChange={(e) => setDecisionNote(e.target.value)}
                    className="text-sm min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleResolve(escalation)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Resolve with Decision
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleForwardUp(escalation)}
                    >
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      Forward to Master Admin
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedEscalation(null);
                        setDecisionNote('');
                      }}
                    >
                      <XCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedEscalation(escalation.id)}
                  disabled={escalation.status === 'resolved' || escalation.status === 'forwarded'}
                >
                  Review & Decide
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            <Shield className="h-3 w-3 inline mr-1" />
            All decisions are logged and immutable
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
