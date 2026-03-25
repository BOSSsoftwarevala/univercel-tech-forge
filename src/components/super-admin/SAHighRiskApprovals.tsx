import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertTriangle, CheckCircle2, XCircle, Clock, Shield, User, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface ApprovalRequest {
  id: string;
  type: 'withdrawal' | 'role_activation' | 'franchise_approval' | 'admin_action';
  requester: string;
  requesterRole: string;
  amount?: number;
  description: string;
  riskLevel: 'high' | 'critical';
  timestamp: Date;
  aiFlags?: string[];
}

interface SAHighRiskApprovalsProps {
  onApprove: (id: string, reason: string) => Promise<boolean>;
  onReject: (id: string, reason: string) => Promise<boolean>;
}

const SAHighRiskApprovals = ({ onApprove, onReject }: SAHighRiskApprovalsProps) => {
  const [requests, setRequests] = useState<ApprovalRequest[]>([
    {
      id: 'apr-001',
      type: 'withdrawal',
      requester: 'VALA-8847',
      requesterRole: 'franchise',
      amount: 25000,
      description: 'Large withdrawal request - exceeds daily limit',
      riskLevel: 'critical',
      timestamp: new Date(Date.now() - 1800000),
      aiFlags: ['Unusual pattern', 'First large withdrawal']
    },
    {
      id: 'apr-002',
      type: 'role_activation',
      requester: 'VALA-9923',
      requesterRole: 'pending',
      description: 'Admin role activation request',
      riskLevel: 'high',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: 'apr-003',
      type: 'franchise_approval',
      requester: 'VALA-1156',
      requesterRole: 'applicant',
      description: 'New franchise registration - India region',
      riskLevel: 'high',
      timestamp: new Date(Date.now() - 7200000),
      aiFlags: ['Document verification pending']
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [reason, setReason] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [processing, setProcessing] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'withdrawal': return <Wallet className="w-4 h-4" />;
      case 'role_activation': return <Shield className="w-4 h-4" />;
      case 'franchise_approval': return <User className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getRiskColor = (level: string) => {
    return level === 'critical' 
      ? 'bg-red-500/20 text-red-400 border-red-500/30'
      : 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  };

  const handleAction = async () => {
    if (!selectedRequest || !actionType || reason.trim().length < 10) {
      toast.error('Reason must be at least 10 characters');
      return;
    }

    setProcessing(true);
    
    const success = actionType === 'approve'
      ? await onApprove(selectedRequest.id, reason)
      : await onReject(selectedRequest.id, reason);

    if (success) {
      setRequests(prev => prev.filter(r => r.id !== selectedRequest.id));
      setSelectedRequest(null);
      setReason('');
      setActionType(null);
    }
    
    setProcessing(false);
  };

  const openActionDialog = (request: ApprovalRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
    setReason('');
  };

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              High-Risk Approvals
            </CardTitle>
            <Badge variant="outline" className="bg-red-500/10 text-red-400">
              {requests.length} Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {requests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg bg-background/50 border border-border/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(request.type)}
                        <span className="font-medium capitalize">
                          {request.type.replace('_', ' ')}
                        </span>
                        <Badge variant="outline" className={getRiskColor(request.riskLevel)}>
                          {request.riskLevel}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {request.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>From: {request.requester}</span>
                        <span>Role: {request.requesterRole}</span>
                        {request.amount && (
                          <span className="text-amber-400 font-medium">
                            ${request.amount.toLocaleString()}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(request.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      {request.aiFlags && request.aiFlags.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {request.aiFlags.map((flag, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] bg-purple-500/10 text-purple-400">
                              AI: {flag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                        onClick={() => openActionDialog(request, 'approve')}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => openActionDialog(request, 'reject')}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {requests.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No pending high-risk approvals</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedRequest && !!actionType} onOpenChange={() => {
        setSelectedRequest(null);
        setActionType(null);
      }}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === 'approve' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              {actionType === 'approve' ? 'Approve' : 'Reject'} Request
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-background/50 border border-border/30">
              <p className="text-sm font-medium">{selectedRequest?.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Request ID: {selectedRequest?.id}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Reason (Required - min 10 characters)
              </label>
              <Textarea
                placeholder="Enter detailed reason for this action..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {reason.length}/10 characters minimum
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSelectedRequest(null);
              setActionType(null);
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={reason.trim().length < 10 || processing}
              className={actionType === 'approve' 
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-red-600 hover:bg-red-700'
              }
            >
              {processing ? 'Processing...' : `Confirm ${actionType === 'approve' ? 'Approval' : 'Rejection'}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SAHighRiskApprovals;
