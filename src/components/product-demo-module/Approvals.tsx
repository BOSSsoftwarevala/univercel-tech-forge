/**
 * APPROVALS
 * Product Publish, Demo Live, Major Changes - Boss required
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, CheckCircle, XCircle, Clock, Package, 
  Monitor, FileText, AlertTriangle, Crown 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface ApprovalRequest {
  id: string;
  type: 'product-publish' | 'demo-live' | 'major-change';
  title: string;
  description: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'high' | 'medium' | 'low';
}

const approvalRequests: ApprovalRequest[] = [
  { 
    id: '1', 
    type: 'product-publish', 
    title: 'Publish Hotel Management v2.0',
    description: 'New product ready for marketplace release with all features tested.',
    requestedBy: 'Product Team',
    requestedAt: '2 hours ago',
    status: 'pending',
    priority: 'high'
  },
  { 
    id: '2', 
    type: 'demo-live', 
    title: 'Enable Live Demo for Client XYZ',
    description: 'Client requested full demo access for evaluation.',
    requestedBy: 'Sales Team',
    requestedAt: '4 hours ago',
    status: 'pending',
    priority: 'medium'
  },
  { 
    id: '3', 
    type: 'major-change', 
    title: 'Database Schema Migration',
    description: 'Critical schema changes for School ERP affecting 45 demos.',
    requestedBy: 'Dev Team',
    requestedAt: '1 day ago',
    status: 'pending',
    priority: 'high'
  },
  { 
    id: '4', 
    type: 'product-publish', 
    title: 'Publish Gym Management v1.5',
    description: 'Minor version update with bug fixes.',
    requestedBy: 'Product Team',
    requestedAt: '2 days ago',
    status: 'approved',
    priority: 'low'
  },
  { 
    id: '5', 
    type: 'demo-live', 
    title: 'Demo Extension Request',
    description: 'Client ABC requesting 30-day extension.',
    requestedBy: 'Support Team',
    requestedAt: '3 days ago',
    status: 'rejected',
    priority: 'low'
  },
];

const typeConfig = {
  'product-publish': { icon: Package, color: 'violet', label: 'Product Publish' },
  'demo-live': { icon: Monitor, color: 'emerald', label: 'Demo Live' },
  'major-change': { icon: FileText, color: 'amber', label: 'Major Change' },
};

const priorityConfig = {
  high: { color: 'red', label: 'High Priority' },
  medium: { color: 'yellow', label: 'Medium' },
  low: { color: 'green', label: 'Low' },
};

export const Approvals: React.FC = () => {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const pendingCount = approvalRequests.filter(r => r.status === 'pending').length;
  const approvedCount = approvalRequests.filter(r => r.status === 'approved').length;
  const rejectedCount = approvalRequests.filter(r => r.status === 'rejected').length;

  const handleApprove = (request: ApprovalRequest) => {
    toast.success(`Approved: ${request.title}`, {
      description: 'Request has been processed',
    });
  };

  const handleReject = (request: ApprovalRequest) => {
    setSelectedRequest(request);
    setShowRejectDialog(true);
  };

  const confirmReject = () => {
    if (rejectReason.length < 10) {
      toast.error('Rejection reason must be at least 10 characters');
      return;
    }
    toast.error(`Rejected: ${selectedRequest?.title}`, {
      description: rejectReason,
    });
    setShowRejectDialog(false);
    setRejectReason('');
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-violet-400" />
            Approvals Queue
          </h1>
          <p className="text-sm text-muted-foreground">
            Boss approval required for critical actions
          </p>
        </div>
        <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">
          <Crown className="w-3 h-3 mr-1" />
          Boss Only
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-2xl font-bold text-emerald-400">{approvedCount}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-2xl font-bold text-red-400">{rejectedCount}</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card className="bg-card/80 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Pending Approvals
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {approvalRequests.filter(r => r.status === 'pending').map((request, idx) => {
              const typeInfo = typeConfig[request.type];
              const prioInfo = priorityConfig[request.priority];
              const TypeIcon = typeInfo.icon;
              
              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-${typeInfo.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                        <TypeIcon className={`w-5 h-5 text-${typeInfo.color}-400`} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{request.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{request.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {typeInfo.label}
                          </Badge>
                          <Badge variant="outline" className={`text-xs bg-${prioInfo.color}-500/20 text-${prioInfo.color}-500`}>
                            {prioInfo.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            by {request.requestedBy} • {request.requestedAt}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleApprove(request)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleReject(request)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Decisions */}
      <Card className="bg-card/80 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Recent Decisions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {approvalRequests.filter(r => r.status !== 'pending').map((request) => {
              const typeInfo = typeConfig[request.type];
              const TypeIcon = typeInfo.icon;
              
              return (
                <div key={request.id} className="p-4 opacity-70">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TypeIcon className={`w-5 h-5 text-${typeInfo.color}-400`} />
                      <span className="text-sm text-foreground">{request.title}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={request.status === 'approved' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-red-500/20 text-red-400'
                      }
                    >
                      {request.status === 'approved' ? 'Approved' : 'Rejected'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <XCircle className="w-5 h-5" />
              Reject Request
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter rejection reason (min 10 characters)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmReject}>
                Confirm Rejection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
