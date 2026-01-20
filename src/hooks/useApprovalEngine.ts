/**
 * STEP 6: Approval Engine Hook
 * Boss-controlled approval workflow for sensitive actions
 * Approval Required → INSERT → STATUS PENDING → FREEZE EXECUTION
 * Boss Action → APPROVE/REJECT → CONTINUE/ROLLBACK
 */

import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useEnterpriseAudit } from './useEnterpriseAudit';
import { toast } from 'sonner';

export interface ApprovalRequest {
  id: string;
  requestType: string;
  requestData: Record<string, unknown>;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  requestedById: string;
  expiresAt?: string;
  riskScore?: number;
}

interface CreateApprovalParams {
  requestType: string;
  requestData: Record<string, unknown>;
  requiresBossApproval?: boolean;
  expiresInHours?: number;
  riskScore?: number;
}

export function useApprovalEngine() {
  const { user, userRole, isBossOwner } = useAuth();
  const { logAction, logFinancialAction } = useEnterpriseAudit();
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Create new approval request (freeze execution until approved)
   */
  const requestApproval = useCallback(async (params: CreateApprovalParams): Promise<ApprovalRequest | null> => {
    setLoading(true);
    
    try {
      const expiresAt = params.expiresInHours 
        ? new Date(Date.now() + params.expiresInHours * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // Default 24h

      const { data, error } = await supabase.from('approvals').insert([{
        request_type: params.requestType,
        request_data: params.requestData,
        requested_by_user_id: user?.id,
        status: 'pending',
        expires_at: expiresAt,
        risk_score: params.riskScore || 50,
      }] as any).select().single();

      if (error) throw error;

      // Log approval request
      await logAction({
        action: 'approval_requested',
        module: 'access_control',
        severity: params.riskScore && params.riskScore > 70 ? 'high' : 'medium',
        target_id: data.id,
        target_type: 'approval',
        metadata: {
          request_type: params.requestType,
          requires_boss: params.requiresBossApproval,
          risk_score: params.riskScore,
        }
      });

      toast.info('Approval request submitted', {
        description: 'Waiting for Boss/Admin approval'
      });

      const approval: ApprovalRequest = {
        id: data.id,
        requestType: data.request_type,
        requestData: data.request_data as Record<string, unknown>,
        status: data.status as ApprovalRequest['status'],
        requestedById: data.requested_by_user_id,
        expiresAt: data.expires_at || undefined,
        riskScore: data.risk_score || undefined,
      };

      setPendingApprovals(prev => [...prev, approval]);
      setLoading(false);
      return approval;
    } catch (error) {
      console.error('[ApprovalEngine] Request failed:', error);
      toast.error('Failed to submit approval request');
      setLoading(false);
      return null;
    }
  }, [user?.id, logAction]);

  /**
   * Approve a pending request (Boss only)
   */
  const approve = useCallback(async (
    approvalId: string,
    notes?: string
  ): Promise<boolean> => {
    if (!isBossOwner) {
      toast.error('Only Boss/Admin can approve requests');
      return false;
    }

    setLoading(true);

    try {
      // Update approval status
      const { error: updateError } = await supabase.from('approvals').update({
        status: 'approved',
      }).eq('id', approvalId);

      if (updateError) throw updateError;

      // Create approval decision record
      await supabase.from('approval_decisions').insert({
        approval_id: approvalId,
        super_admin_id: user?.id,
        decision: 'approved',
        decision_reason: notes || 'Approved by Boss',
        decision_time: new Date().toISOString(),
      });

      // Create approval step
      await supabase.from('approval_steps').insert({
        approval_id: approvalId,
        step_number: 1,
        approver_role: userRole || 'boss_owner',
        approver_id: user?.id,
        status: 'approved',
        decision_notes: notes,
        decided_at: new Date().toISOString(),
      });

      // Log approval
      await logAction({
        action: 'approval_granted',
        module: 'access_control',
        severity: 'high',
        target_id: approvalId,
        target_type: 'approval',
        metadata: { notes }
      });

      toast.success('Request approved');
      
      // Remove from pending
      setPendingApprovals(prev => prev.filter(a => a.id !== approvalId));
      setLoading(false);
      return true;
    } catch (error) {
      console.error('[ApprovalEngine] Approve failed:', error);
      toast.error('Failed to approve request');
      setLoading(false);
      return false;
    }
  }, [isBossOwner, user?.id, userRole, logAction]);

  /**
   * Reject a pending request (Boss only)
   */
  const reject = useCallback(async (
    approvalId: string,
    reason: string
  ): Promise<boolean> => {
    if (!isBossOwner) {
      toast.error('Only Boss/Admin can reject requests');
      return false;
    }

    setLoading(true);

    try {
      // Update approval status
      const { error: updateError } = await supabase.from('approvals').update({
        status: 'rejected',
      }).eq('id', approvalId);

      if (updateError) throw updateError;

      // Create approval decision record
      await supabase.from('approval_decisions').insert({
        approval_id: approvalId,
        super_admin_id: user?.id,
        decision: 'rejected',
        decision_reason: reason,
        decision_time: new Date().toISOString(),
      });

      // Create rejection step
      await supabase.from('approval_steps').insert({
        approval_id: approvalId,
        step_number: 1,
        approver_role: userRole || 'boss_owner',
        approver_id: user?.id,
        status: 'rejected',
        decision_notes: reason,
        decided_at: new Date().toISOString(),
      });

      // Log rejection
      await logAction({
        action: 'approval_rejected',
        module: 'access_control',
        severity: 'high',
        target_id: approvalId,
        target_type: 'approval',
        metadata: { reason }
      });

      toast.info('Request rejected');
      
      // Remove from pending
      setPendingApprovals(prev => prev.filter(a => a.id !== approvalId));
      setLoading(false);
      return true;
    } catch (error) {
      console.error('[ApprovalEngine] Reject failed:', error);
      toast.error('Failed to reject request');
      setLoading(false);
      return false;
    }
  }, [isBossOwner, user?.id, userRole, logAction]);

  /**
   * Check approval status
   */
  const checkStatus = useCallback(async (approvalId: string): Promise<ApprovalRequest['status'] | null> => {
    try {
      const { data, error } = await supabase
        .from('approvals')
        .select('status')
        .eq('id', approvalId)
        .single();

      if (error) throw error;
      return data.status as ApprovalRequest['status'];
    } catch {
      return null;
    }
  }, []);

  /**
   * Wait for approval (with polling)
   */
  const waitForApproval = useCallback(async (
    approvalId: string,
    timeoutMs: number = 60000,
    pollIntervalMs: number = 2000
  ): Promise<'approved' | 'rejected' | 'timeout'> => {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      const status = await checkStatus(approvalId);
      
      if (status === 'approved') return 'approved';
      if (status === 'rejected') return 'rejected';
      
      await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
    }

    return 'timeout';
  }, [checkStatus]);

  return {
    requestApproval,
    approve,
    reject,
    checkStatus,
    waitForApproval,
    pendingApprovals,
    loading,
    canApprove: isBossOwner,
  };
}
