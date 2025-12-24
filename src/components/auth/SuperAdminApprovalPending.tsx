import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Clock, Shield, CheckCircle, XCircle, Loader2, Bell } from "lucide-react";

interface SuperAdminApprovalPendingProps {
  isOpen: boolean;
  onClose: () => void;
  approvalQueueId: string | null;
  onApprovalComplete: (approved: boolean, approvalId?: string) => void;
}

export function SuperAdminApprovalPending({
  isOpen,
  onClose,
  approvalQueueId,
  onApprovalComplete
}: SuperAdminApprovalPendingProps) {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [waitTime, setWaitTime] = useState(0);
  const [approvalData, setApprovalData] = useState<any>(null);

  useEffect(() => {
    if (!isOpen || !approvalQueueId) return;

    // Start wait timer
    const timer = setInterval(() => {
      setWaitTime(prev => prev + 1);
    }, 1000);

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`approval-${approvalQueueId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'action_approval_queue',
          filter: `id=eq.${approvalQueueId}`
        },
        (payload) => {
          const newData = payload.new as any;
          setApprovalData(newData);
          
          if (newData.approval_status === 'approved') {
            setStatus('approved');
            toast.success('Action approved by Super Admin!');
            setTimeout(() => {
              onApprovalComplete(true, newData.id);
            }, 1500);
          } else if (newData.approval_status === 'rejected') {
            setStatus('rejected');
            toast.error(`Action rejected: ${newData.rejection_reason || 'No reason provided'}`);
            setTimeout(() => {
              onApprovalComplete(false);
            }, 2000);
          }
        }
      )
      .subscribe();

    // Initial fetch
    const fetchStatus = async () => {
      const { data } = await supabase
        .from('action_approval_queue')
        .select('*')
        .eq('id', approvalQueueId)
        .single();
      
      if (data) {
        setApprovalData(data);
        if (data.approval_status === 'approved') {
          setStatus('approved');
          onApprovalComplete(true, data.id);
        } else if (data.approval_status === 'rejected') {
          setStatus('rejected');
          onApprovalComplete(false);
        }
      }
    };
    
    fetchStatus();

    return () => {
      clearInterval(timer);
      channel.unsubscribe();
    };
  }, [isOpen, approvalQueueId, onApprovalComplete]);

  const formatWaitTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusDisplay = () => {
    switch (status) {
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
          text: 'Approved',
          description: 'Your action has been approved by Super Admin'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/30',
          text: 'Rejected',
          description: approvalData?.rejection_reason || 'Your action was rejected'
        };
      default:
        return {
          icon: Clock,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30',
          text: 'Pending Approval',
          description: 'Waiting for Super Admin to review your request'
        };
    }
  };

  const statusDisplay = getStatusDisplay();
  const StatusIcon = statusDisplay.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Super Admin Approval Required
          </DialogTitle>
          <DialogDescription>
            This action requires approval from a Super Administrator
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className={`p-6 rounded-lg ${statusDisplay.bgColor} border ${statusDisplay.borderColor} text-center`}>
            <StatusIcon className={`h-12 w-12 mx-auto mb-3 ${statusDisplay.color}`} />
            <Badge variant={status === 'approved' ? 'default' : status === 'rejected' ? 'destructive' : 'secondary'}>
              {statusDisplay.text}
            </Badge>
            <p className="text-sm text-muted-foreground mt-2">{statusDisplay.description}</p>
          </div>

          {status === 'pending' && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Waiting time</span>
                  <span className="font-mono">{formatWaitTime(waitTime)}</span>
                </div>
                <Progress value={(waitTime % 60) * 1.67} className="h-1" />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <div className="text-sm">
                  <p className="font-medium">Processing your request...</p>
                  <p className="text-muted-foreground">Super Admin will be notified immediately</p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <Bell className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="text-xs">
                  <p className="font-medium text-foreground">Real-time Updates</p>
                  <p className="text-muted-foreground">
                    You'll be notified as soon as the Super Admin takes action. 
                    You can close this dialog and continue working - the action will proceed once approved.
                  </p>
                </div>
              </div>
            </>
          )}

          {approvalData && (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Request ID</span>
                <span className="font-mono">{approvalData.id?.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Action Type</span>
                <Badge variant="outline">{approvalData.action_type}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">OTP Verified</span>
                <span>{approvalData.otp_verified ? '✓ Yes' : '✗ No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Password Verified</span>
                <span>{approvalData.password_verified ? '✓ Yes' : '✗ No'}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          {status === 'pending' && (
            <Button variant="outline" onClick={onClose}>
              Continue in Background
            </Button>
          )}
          {(status === 'approved' || status === 'rejected') && (
            <Button onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}