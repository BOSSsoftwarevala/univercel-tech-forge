import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Scale, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  FileText,
  AlertTriangle,
  Eye,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LegalReviewCase } from '@/types/compliance';
import { ROLE_CONFIG } from '@/types/roles';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LegalReviewPanelProps {
  cases?: LegalReviewCase[];
  onApprove?: (caseId: string, notes: string) => void;
  onReject?: (caseId: string, notes: string) => void;
}

// Mock cases for demo
const mockCases: LegalReviewCase[] = [
  {
    id: 'legal-001',
    userId: 'user-001',
    userEmail: 'developer@example.com',
    userRole: 'developer',
    reviewType: 'verification',
    status: 'pending',
    priority: 'high',
    submittedAt: '2024-01-20T10:00:00Z',
    documents: ['government_id_front.jpg', 'government_id_back.jpg', 'liveness_photo.jpg'],
    riskScore: 15,
  },
  {
    id: 'legal-002',
    userId: 'user-002',
    userEmail: 'reseller@example.com',
    userRole: 'reseller',
    reviewType: 'penalty_appeal',
    status: 'in_review',
    priority: 'medium',
    assignedTo: 'Legal Admin',
    submittedAt: '2024-01-19T14:30:00Z',
    documents: ['appeal_letter.pdf', 'supporting_docs.pdf'],
    riskScore: 45,
    notes: 'User claims the discount was pre-approved verbally',
  },
  {
    id: 'legal-003',
    userId: 'user-003',
    userEmail: 'franchise@example.com',
    userRole: 'franchise',
    reviewType: 'escalation',
    status: 'pending',
    priority: 'critical',
    submittedAt: '2024-01-20T08:15:00Z',
    documents: ['contract_dispute.pdf'],
    riskScore: 72,
  },
];

const getPriorityColor = (priority: LegalReviewCase['priority']) => {
  switch (priority) {
    case 'critical':
      return 'bg-red-500/10 text-red-500 border-red-500/30';
    case 'high':
      return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
    default:
      return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
  }
};

const getStatusColor = (status: LegalReviewCase['status']) => {
  switch (status) {
    case 'approved':
      return 'bg-green-500/10 text-green-500 border-green-500/30';
    case 'rejected':
      return 'bg-red-500/10 text-red-500 border-red-500/30';
    case 'in_review':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
    default:
      return 'bg-muted/50 text-muted-foreground border-muted';
  }
};

export const LegalReviewPanel = ({ 
  cases = mockCases,
  onApprove,
  onReject
}: LegalReviewPanelProps) => {
  const [selectedCase, setSelectedCase] = useState<LegalReviewCase | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isApproving, setIsApproving] = useState(false);

  const pendingCount = cases.filter(c => c.status === 'pending').length;
  const inReviewCount = cases.filter(c => c.status === 'in_review').length;
  const criticalCount = cases.filter(c => c.priority === 'critical').length;

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!selectedCase) return;
    
    setIsApproving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (action === 'approve') {
      onApprove?.(selectedCase.id, reviewNotes);
      toast.success('Case approved successfully');
    } else {
      onReject?.(selectedCase.id, reviewNotes);
      toast.success('Case rejected');
    }
    
    setIsApproving(false);
    setSelectedCase(null);
    setReviewNotes('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-yellow-500/5 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
                <p className="text-xs text-yellow-500">Pending Review</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/5 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-500">{inReviewCount}</p>
                <p className="text-xs text-blue-500">In Review</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-500/5 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-500">{criticalCount}</p>
                <p className="text-xs text-red-500">Critical Priority</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cases Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5" />
            Legal Review Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cases.map((c, index) => {
              const roleConfig = ROLE_CONFIG[c.userRole];
              
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${roleConfig?.color}20` }}
                    >
                      <User className="w-5 h-5" style={{ color: roleConfig?.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{c.userEmail}</span>
                        <Badge variant="outline" className="text-xs">
                          {roleConfig?.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {c.reviewType.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {c.documents.length} documents
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Risk: {c.riskScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={getPriorityColor(c.priority)}>
                      {c.priority.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(c.status)}>
                      {c.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedCase(c)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Review
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={!!selectedCase} onOpenChange={(open) => !open && setSelectedCase(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Legal Review: {selectedCase?.reviewType.replace('_', ' ')}
            </DialogTitle>
            <DialogDescription>
              Review the case details and make a decision
            </DialogDescription>
          </DialogHeader>

          {selectedCase && (
            <div className="space-y-4 py-4">
              {/* Case Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>User</Label>
                  <p className="text-sm">{selectedCase.userEmail}</p>
                </div>
                <div>
                  <Label>Role</Label>
                  <p className="text-sm">{ROLE_CONFIG[selectedCase.userRole]?.label}</p>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Badge className={getPriorityColor(selectedCase.priority)}>
                    {selectedCase.priority.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label>Risk Score</Label>
                  <Badge variant={selectedCase.riskScore > 50 ? 'destructive' : 'secondary'}>
                    {selectedCase.riskScore}%
                  </Badge>
                </div>
              </div>

              {/* Documents */}
              <div>
                <Label>Documents</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCase.documents.map((doc, i) => (
                    <Badge key={i} variant="outline" className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {doc}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Existing Notes */}
              {selectedCase.notes && (
                <div>
                  <Label>Case Notes</Label>
                  <div className="bg-muted/50 rounded-lg p-3 mt-2">
                    <p className="text-sm">{selectedCase.notes}</p>
                  </div>
                </div>
              )}

              {/* Review Notes */}
              <div>
                <Label>Review Decision Notes (Internal)</Label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Enter your review notes..."
                  className="mt-2"
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setSelectedCase(null)}
              disabled={isApproving}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => handleAction('reject')}
              disabled={isApproving}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </Button>
            <Button 
              onClick={() => handleAction('approve')}
              disabled={isApproving}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* System Rules Notice */}
      <Card className="bg-muted/20 border-muted">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="font-medium">System Rules</h4>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• No verification = No access</li>
                <li>• No approval = No activation</li>
                <li>• All decisions are logged in immutable audit trail</li>
                <li>• Super Admin & Legal have final authority</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{children}</p>
);

export default LegalReviewPanel;
