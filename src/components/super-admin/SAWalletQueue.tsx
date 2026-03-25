import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Wallet, CheckCircle2, XCircle, Snowflake, RotateCcw, AlertTriangle, Ban } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface WalletRequest {
  id: string;
  userId: string;
  userRole: string;
  type: 'withdrawal' | 'payout';
  amount: number;
  status: 'pending' | 'processing';
  requestedAt: Date;
  riskScore?: number;
  walletBalance: number;
}

interface SAWalletQueueProps {
  onApprove: (id: string, reason: string) => Promise<boolean>;
  onReject: (id: string, reason: string) => Promise<boolean>;
  onFreeze: (userId: string, reason: string) => Promise<boolean>;
  onReverse: (id: string, reason: string) => Promise<boolean>;
}

const SAWalletQueue = ({ onApprove, onReject, onFreeze, onReverse }: SAWalletQueueProps) => {
  const [requests, setRequests] = useState<WalletRequest[]>([
    {
      id: 'wal-001',
      userId: 'VALA-7721',
      userRole: 'influencer',
      type: 'withdrawal',
      amount: 5000,
      status: 'pending',
      requestedAt: new Date(Date.now() - 1200000),
      riskScore: 15,
      walletBalance: 8500,
    },
    {
      id: 'wal-002',
      userId: 'VALA-3345',
      userRole: 'franchise',
      type: 'payout',
      amount: 15000,
      status: 'pending',
      requestedAt: new Date(Date.now() - 2400000),
      riskScore: 45,
      walletBalance: 22000,
    },
    {
      id: 'wal-003',
      userId: 'VALA-9912',
      userRole: 'reseller',
      type: 'withdrawal',
      amount: 3500,
      status: 'processing',
      requestedAt: new Date(Date.now() - 3600000),
      riskScore: 8,
      walletBalance: 4200,
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<WalletRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'freeze' | 'reverse' | null>(null);
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const getRiskColor = (score?: number) => {
    if (!score) return 'text-muted-foreground';
    if (score < 20) return 'text-emerald-400';
    if (score < 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const handleAction = async () => {
    if (!selectedRequest || !actionType || reason.trim().length < 10) {
      toast.error('Reason must be at least 10 characters');
      return;
    }

    setProcessing(true);
    let success = false;

    switch (actionType) {
      case 'approve':
        success = await onApprove(selectedRequest.id, reason);
        break;
      case 'reject':
        success = await onReject(selectedRequest.id, reason);
        break;
      case 'freeze':
        success = await onFreeze(selectedRequest.userId, reason);
        break;
      case 'reverse':
        success = await onReverse(selectedRequest.id, reason);
        break;
    }

    if (success && (actionType === 'approve' || actionType === 'reject')) {
      setRequests(prev => prev.filter(r => r.id !== selectedRequest.id));
    }

    setSelectedRequest(null);
    setReason('');
    setActionType(null);
    setProcessing(false);
  };

  const handleBalanceEdit = () => {
    toast.error('BLOCKED: Manual balance edit is not permitted');
  };

  const openActionDialog = (request: WalletRequest, action: typeof actionType) => {
    setSelectedRequest(request);
    setActionType(action);
    setReason('');
  };

  const getActionTitle = () => {
    switch (actionType) {
      case 'approve': return 'Approve Transaction';
      case 'reject': return 'Reject Transaction';
      case 'freeze': return 'Freeze Wallet';
      case 'reverse': return 'Reverse Pending Payout';
      default: return 'Action';
    }
  };

  const getActionIcon = () => {
    switch (actionType) {
      case 'approve': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'reject': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'freeze': return <Snowflake className="w-5 h-5 text-blue-400" />;
      case 'reverse': return <RotateCcw className="w-5 h-5 text-amber-400" />;
      default: return null;
    }
  };

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Wallet & Withdrawal Queue
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-amber-500/10 text-amber-400">
                {requests.length} Pending
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground opacity-50 cursor-not-allowed"
                onClick={handleBalanceEdit}
              >
                <Ban className="w-4 h-4 mr-1" />
                Edit Balance
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {requests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg bg-background/50 border border-border/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm">{request.userId}</span>
                        <Badge variant="outline" className="text-xs">
                          {request.userRole}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={request.status === 'processing' 
                            ? 'bg-blue-500/10 text-blue-400' 
                            : 'bg-amber-500/10 text-amber-400'
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div>
                          <span className="text-muted-foreground">Request: </span>
                          <span className="font-medium text-primary">
                            ${request.amount.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Balance: </span>
                          <span className="font-medium">
                            ${request.walletBalance.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Risk: </span>
                          <span className={`font-medium ${getRiskColor(request.riskScore)}`}>
                            {request.riskScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                        onClick={() => openActionDialog(request, 'approve')}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => openActionDialog(request, 'reject')}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                        onClick={() => openActionDialog(request, 'freeze')}
                      >
                        <Snowflake className="w-4 h-4" />
                      </Button>
                      {request.status === 'processing' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                          onClick={() => openActionDialog(request, 'reverse')}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {requests.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No pending wallet requests</p>
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
              {getActionIcon()}
              {getActionTitle()}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-background/50 border border-border/30">
              <div className="flex justify-between items-center">
                <span className="font-mono">{selectedRequest?.userId}</span>
                <span className="text-primary font-medium">
                  ${selectedRequest?.amount.toLocaleString()}
                </span>
              </div>
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
            </div>

            {actionType === 'freeze' && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                Freezing will block all wallet operations for this user
              </div>
            )}
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
            >
              {processing ? 'Processing...' : 'Confirm Action'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SAWalletQueue;
