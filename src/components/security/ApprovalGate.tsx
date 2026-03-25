import React, { useState, useEffect } from 'react';
import { Shield, Lock, Clock, CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface ApprovalGateProps {
  actionType: string;
  actionDescription: string;
  requiredRole?: string;
  onApproved: () => void;
  onDenied?: () => void;
  children: React.ReactNode;
  className?: string;
}

interface ApprovalRequest {
  id: string;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  created_at: string;
  expires_at: string;
  approved_by?: string;
  rejection_reason?: string;
}

const ApprovalGate: React.FC<ApprovalGateProps> = ({
  actionType,
  actionDescription,
  requiredRole = 'super_admin',
  onApproved,
  onDenied,
  children,
  className,
}) => {
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalRequest, setApprovalRequest] = useState<ApprovalRequest | null>(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [polling, setPolling] = useState(false);

  // Request approval
  const requestApproval = async () => {
    if (reason.length < 20) {
      toast.error('Please provide a detailed reason (minimum 20 characters)');
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in');
        return;
      }

      // Get user role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      const { data, error } = await supabase
        .from('action_approval_queue')
        .insert({
          user_id: user.id,
          user_role: roleData?.role || 'client',
          action_type: actionType,
          action_target: actionDescription,
          action_data: { reason, timestamp: new Date().toISOString() },
          approval_status: 'pending',
          expires_at: new Date(Date.now() + 1800000).toISOString(), // 30 min
        })
        .select()
        .single();

      if (error) throw error;

      setApprovalRequest({
        id: data.id,
        status: 'pending',
        created_at: data.created_at,
        expires_at: data.expires_at!,
      });

      toast.success('Approval request submitted', {
        description: 'Waiting for administrator approval...',
      });

      // Start polling for approval
      setPolling(true);
    } catch (err) {
      console.error('Failed to request approval:', err);
      toast.error('Failed to submit approval request');
    } finally {
      setSubmitting(false);
    }
  };

  // Poll for approval status
  useEffect(() => {
    if (!polling || !approvalRequest) return;

    const interval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('action_approval_queue')
          .select('approval_status, approved_by, rejection_reason')
          .eq('id', approvalRequest.id)
          .single();

        if (error) return;

        if (data.approval_status === 'approved') {
          setApprovalRequest(prev => prev ? { ...prev, status: 'approved', approved_by: data.approved_by || undefined } : null);
          setPolling(false);
          toast.success('Action approved!');
          onApproved();
          setShowApprovalDialog(false);
        } else if (data.approval_status === 'rejected') {
          setApprovalRequest(prev => prev ? { ...prev, status: 'denied', rejection_reason: data.rejection_reason || undefined } : null);
          setPolling(false);
          toast.error('Action denied', {
            description: data.rejection_reason || 'Your request was not approved.',
          });
          onDenied?.();
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);

    // Check expiry
    const expiryCheck = setInterval(() => {
      if (approvalRequest && new Date(approvalRequest.expires_at) < new Date()) {
        setApprovalRequest(prev => prev ? { ...prev, status: 'expired' } : null);
        setPolling(false);
        toast.error('Approval request expired');
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(expiryCheck);
    };
  }, [polling, approvalRequest, onApproved, onDenied]);

  // Trigger the approval dialog
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowApprovalDialog(true);
  };

  if (!showApprovalDialog) {
    return (
      <div onClick={handleClick} className={cn("cursor-pointer", className)}>
        {children}
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={() => !polling && setShowApprovalDialog(false)} />

      {/* Approval Dialog */}
      <Card className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-6 bg-slate-900 border-slate-700 z-50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Approval Required</h2>
            <p className="text-sm text-slate-400">This action requires administrator approval</p>
          </div>
        </div>

        {/* Action Details */}
        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">{actionType}</span>
          </div>
          <p className="text-sm text-slate-400">{actionDescription}</p>
        </div>

        {/* Request Status */}
        {approvalRequest ? (
          <div className="space-y-4">
            {approvalRequest.status === 'pending' && (
              <div className="flex items-center justify-center gap-3 p-6 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                <div>
                  <p className="text-white font-medium">Waiting for Approval</p>
                  <p className="text-sm text-slate-400">
                    Request will expire in {Math.max(0, Math.round((new Date(approvalRequest.expires_at).getTime() - Date.now()) / 60000))} minutes
                  </p>
                </div>
              </div>
            )}

            {approvalRequest.status === 'approved' && (
              <div className="flex items-center justify-center gap-3 p-6 rounded-lg bg-green-500/10 border border-green-500/30">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <div>
                  <p className="text-white font-medium">Approved</p>
                  <p className="text-sm text-slate-400">
                    Approved by {approvalRequest.approved_by || 'Administrator'}
                  </p>
                </div>
              </div>
            )}

            {approvalRequest.status === 'denied' && (
              <div className="flex items-center justify-center gap-3 p-6 rounded-lg bg-red-500/10 border border-red-500/30">
                <XCircle className="w-6 h-6 text-red-400" />
                <div>
                  <p className="text-white font-medium">Denied</p>
                  <p className="text-sm text-slate-400">
                    {approvalRequest.rejection_reason || 'Your request was not approved'}
                  </p>
                </div>
              </div>
            )}

            {approvalRequest.status === 'expired' && (
              <div className="flex items-center justify-center gap-3 p-6 rounded-lg bg-slate-500/10 border border-slate-500/30">
                <Clock className="w-6 h-6 text-slate-400" />
                <div>
                  <p className="text-white font-medium">Expired</p>
                  <p className="text-sm text-slate-400">
                    Please submit a new request
                  </p>
                </div>
              </div>
            )}

            {['denied', 'expired'].includes(approvalRequest.status) && (
              <Button
                onClick={() => {
                  setApprovalRequest(null);
                  setReason('');
                }}
                className="w-full"
                variant="outline"
              >
                Submit New Request
              </Button>
            )}

            <Button
              onClick={() => setShowApprovalDialog(false)}
              variant="ghost"
              className="w-full"
              disabled={polling}
            >
              {polling ? 'Please wait...' : 'Cancel'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Reason for this action *</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a detailed explanation for why this action is needed..."
                className="mt-2 bg-slate-800 border-slate-700 min-h-[100px]"
              />
              <p className="text-xs text-slate-500 mt-1">
                {reason.length}/20 characters minimum
              </p>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <p className="text-xs text-amber-300">
                All approval requests are logged and audited. Misuse may result in account suspension.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowApprovalDialog(false)}
                variant="outline"
                className="flex-1 border-slate-700"
              >
                Cancel
              </Button>
              <Button
                onClick={requestApproval}
                disabled={submitting || reason.length < 20}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Request Approval'
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </>
  );
};

export default ApprovalGate;
