// ==============================================
// Admin Approvals Queue
// Account Activation - Withdraw Forward - Role Changes
// High-Risk → Super Admin
// ==============================================

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileCheck, CheckCircle, XCircle, ArrowUpRight,
  User, Wallet, Shield, Clock, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAdminGuard } from '@/hooks/useAdminGuard';

interface ApprovalRequest {
  id: string;
  type: 'account_activation' | 'withdraw_forward' | 'role_change' | 'module_toggle';
  title: string;
  requester: string;
  requestedAt: string;
  priority: 'low' | 'medium' | 'high';
  riskLevel: 'low' | 'medium' | 'high';
  details: Record<string, string>;
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
}

export function AdminApprovalsQueue() {
  const { canApprove } = useAdminGuard();
  
  const [requests, setRequests] = useState<ApprovalRequest[]>([
    {
      id: 'req-001',
      type: 'account_activation',
      title: 'Activate Reseller Account',
      requester: 'RM-****42',
      requestedAt: '2024-01-30 14:30',
      priority: 'medium',
      riskLevel: 'low',
      details: { role: 'reseller', region: 'US-East' },
      status: 'pending',
    },
    {
      id: 'req-002',
      type: 'withdraw_forward',
      title: 'Withdrawal Request - $5,000',
      requester: 'FR-****18',
      requestedAt: '2024-01-30 13:15',
      priority: 'high',
      riskLevel: 'medium',
      details: { amount: '$5,000', method: 'Bank Transfer' },
      status: 'pending',
    },
    {
      id: 'req-003',
      type: 'role_change',
      title: 'Role Upgrade Request',
      requester: 'US-****99',
      requestedAt: '2024-01-30 12:00',
      priority: 'low',
      riskLevel: 'low',
      details: { from: 'client', to: 'influencer' },
      status: 'pending',
    },
    {
      id: 'req-004',
      type: 'account_activation',
      title: 'Activate Admin Account',
      requester: 'SA-****01',
      requestedAt: '2024-01-30 11:30',
      priority: 'high',
      riskLevel: 'high',
      details: { role: 'admin', region: 'Global' },
      status: 'pending',
    },
  ]);

  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'account_activation': return User;
      case 'withdraw_forward': return Wallet;
      case 'role_change': return Shield;
      default: return FileCheck;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleApprove = (request: ApprovalRequest) => {
    const { allowed, reason } = canApprove(request.type, request.riskLevel);
    
    if (!allowed) {
      toast.error(reason);
      return;
    }

    if (request.type === 'withdraw_forward') {
      // Withdrawals can only be forwarded, not directly approved
      handleEscalate(request.id, 'Finance processing required');
      return;
    }

    setRequests(prev => prev.map(r => 
      r.id === request.id ? { ...r, status: 'approved' as const } : r
    ));
    toast.success(`${request.title} approved`);
  };

  const handleReject = (requestId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }

    setRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: 'rejected' as const } : r
    ));
    setRejectionReason('');
    setSelectedRequest(null);
    toast.success('Request rejected');
  };

  const handleEscalate = (requestId: string, reason: string) => {
    setRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: 'escalated' as const } : r
    ));
    toast.info(`Escalated to Super Admin: ${reason}`);
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-primary" />
          Pending Approvals
        </h2>
        <Badge variant="outline">
          {pendingRequests.length} Pending
        </Badge>
      </div>

      {/* High-Risk Warning */}
      <Card className="bg-yellow-500/10 border-yellow-500/30">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-sm text-yellow-400">
            <AlertTriangle className="h-4 w-4" />
            <span>High-risk actions are automatically escalated to Super Admin. Wallet edits are blocked.</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {pendingRequests.map(request => {
          const TypeIcon = getTypeIcon(request.type);
          const isHighRisk = request.riskLevel === 'high';

          return (
            <Card key={request.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <TypeIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{request.title}</span>
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getRiskColor(request.riskLevel)}>
                          Risk: {request.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>Requester: {request.requester}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {request.requestedAt}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-3 rounded mb-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(request.details).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-muted-foreground capitalize">{key}:</span>
                        <span className="ml-2">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedRequest === request.id && (
                  <div className="mb-3">
                    <Textarea
                      placeholder="Enter rejection reason..."
                      value={rejectionReason}
                      onChange={e => setRejectionReason(e.target.value)}
                      className="mb-2"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {isHighRisk ? (
                    <Button
                      size="sm"
                      onClick={() => handleEscalate(request.id, 'High-risk action')}
                      className="text-xs"
                    >
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      Escalate to Super Admin
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request)}
                        className="text-xs bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {request.type === 'withdraw_forward' ? 'Forward' : 'Approve'}
                      </Button>
                      {selectedRequest === request.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(request.id)}
                            className="text-xs"
                          >
                            Confirm Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedRequest(null)}
                            className="text-xs"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedRequest(request.id)}
                          className="text-xs"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      )}
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEscalate(request.id, 'Manual escalation')}
                    className="text-xs ml-auto"
                  >
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    Escalate
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {pendingRequests.length === 0 && (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending approvals</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
