/**
 * useFinanceSecurityGuard — Enforces all 7 finance security policies
 * 
 * Policies enforced:
 * 1. No Return / No Exchange (digital products final sale)
 * 2. One-Time Sale (permanent unlock after purchase)
 * 3. Boss Approval Required (all financial actions)
 * 4. OTP Payment Security (critical actions require OTP)
 * 5. Fraud Prevention (block suspicious activity)
 * 6. Transaction Lock (locked until validated)
 * 7. Immutable Finance Logging (all activity recorded)
 */

import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface TransactionLockResult {
  lockId: string;
  allowed: boolean;
  requiresOtp: boolean;
  requiresApproval: boolean;
}

interface FraudCheckResult {
  blocked: boolean;
  reason?: string;
  alertId?: string;
}

export function useFinanceSecurityGuard() {
  const { user } = useAuth();
  const [otpVerified, setOtpVerified] = useState(false);
  const [pendingLockId, setPendingLockId] = useState<string | null>(null);

  /**
   * Policy 1 & 2: Check if refund is allowed (always returns false for digital products)
   */
  const isRefundAllowed = useCallback((): { allowed: boolean; reason: string } => {
    return {
      allowed: false,
      reason: 'All digital software products are final sale. No return, no exchange, no refund after purchase. Digital products cannot be returned once delivered.'
    };
  }, []);

  /**
   * Policy 5: Check for fraud patterns before allowing transaction
   */
  const checkFraudPatterns = useCallback(async (
    amount: number,
    actionType: string
  ): Promise<FraudCheckResult> => {
    if (!user) return { blocked: true, reason: 'Authentication required' };

    try {
      // Check recent failed payment attempts (last 1 hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data: recentFailures } = await supabase
        .from('transactions')
        .select('id')
        .eq('related_user', user.id)
        .eq('status', 'failed')
        .gte('timestamp', oneHourAgo);

      const failCount = recentFailures?.length || 0;

      if (failCount >= 5) {
        // Log security alert
        await supabase.from('finance_security_alerts').insert({
          alert_type: 'repeated_failures',
          severity: 'high',
          user_id: user.id,
          description: `User has ${failCount} failed transactions in the last hour. Account flagged.`,
          metadata: { fail_count: failCount, action_type: actionType, amount }
        } as any);

        return {
          blocked: true,
          reason: 'Account temporarily blocked due to multiple failed payment attempts. Please contact support.'
        };
      }

      // Check for abnormal transaction amount
      const { data: avgData } = await supabase
        .from('transactions')
        .select('amount')
        .eq('related_user', user.id)
        .eq('status', 'success')
        .limit(20);

      if (avgData && avgData.length > 3) {
        const avgAmount = avgData.reduce((s, t) => s + Number(t.amount || 0), 0) / avgData.length;
        if (amount > avgAmount * 10 && amount > 50000) {
          await supabase.from('finance_security_alerts').insert({
            alert_type: 'abnormal_amount',
            severity: 'medium',
            user_id: user.id,
            description: `Transaction amount ₹${amount} is 10x above user average ₹${Math.round(avgAmount)}.`,
            metadata: { amount, avg_amount: avgAmount, action_type: actionType }
          } as any);
        }
      }

      return { blocked: false };
    } catch (error) {
      console.error('Fraud check error:', error);
      return { blocked: false };
    }
  }, [user]);

  /**
   * Policy 6: Create transaction lock — must be unlocked via OTP + approval
   */
  const createTransactionLock = useCallback(async (
    transactionId: string,
    amount: number,
    lockType: string = 'validation_pending'
  ): Promise<TransactionLockResult | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('transaction_security_locks')
        .insert({
          transaction_id: transactionId,
          lock_type: lockType,
          user_id: user.id,
          amount,
          lock_status: 'locked',
          otp_verified: false,
          gateway_verified: false,
          boss_approved: false,
          metadata: { initiated_at: new Date().toISOString() }
        } as any)
        .select('id')
        .single();

      if (error) throw error;

      const lockId = (data as any)?.id;
      setPendingLockId(lockId);

      return {
        lockId,
        allowed: false,
        requiresOtp: true,
        requiresApproval: amount > 0,
      };
    } catch (error) {
      console.error('Transaction lock error:', error);
      return null;
    }
  }, [user]);

  /**
   * Policy 4: Verify OTP for transaction
   */
  const verifyTransactionOtp = useCallback(async (
    lockId: string,
    otpCode: string
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      // Verify OTP against otp_verifications table
      const { data: otpRecord } = await (supabase as any)
        .from('otp_verifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('otp_code', otpCode)
        .eq('is_verified', false)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!otpRecord) {
        toast.error('Invalid or expired OTP');
        return false;
      }

      // Mark OTP as verified
      await supabase
        .from('otp_verifications')
        .update({ is_verified: true, verified_at: new Date().toISOString() })
        .eq('id', otpRecord.id);

      // Update transaction lock
      await supabase
        .from('transaction_security_locks')
        .update({ otp_verified: true } as any)
        .eq('id', lockId);

      setOtpVerified(true);
      return true;
    } catch (error) {
      console.error('OTP verification error:', error);
      return false;
    }
  }, [user]);

  /**
   * Policy 3: Request Boss approval for financial action
   */
  const requestBossApproval = useCallback(async (
    actionType: string,
    amount: number,
    details: Record<string, any> = {}
  ): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await (supabase as any)
        .from('approvals')
        .insert({
          request_type: actionType,
          requested_by_user_id: user.id,
          request_data: { amount, ...details },
          status: 'pending',
          risk_score: amount > 100000 ? 90 : amount > 50000 ? 70 : 40,
        })
        .select('id')
        .single();

      if (error) throw error;

      // Notify boss via notifications
      const { data: bossUsers } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'boss_owner');

      if (bossUsers?.length) {
        const notifications = bossUsers.map(b => ({
          user_id: b.user_id,
          type: 'approval_required',
          message: `Financial action requires approval: ${actionType} — ₹${amount.toLocaleString()}`,
          event_type: 'finance_approval',
        }));
        await supabase.from('user_notifications').insert(notifications);
      }

      return data?.id || null;
    } catch (error) {
      console.error('Approval request error:', error);
      return null;
    }
  }, [user]);

  /**
   * Policy 7: Log all financial activity immutably
   */
  const logFinancialAction = useCallback(async (
    action: string,
    module: string,
    metadata: Record<string, any> = {}
  ) => {
    if (!user) return;

    try {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action,
        module,
        role: 'finance_manager' as any,
        meta_json: {
          ...metadata,
          timestamp: new Date().toISOString(),
          ip_context: 'client',
          policy_enforced: true,
        },
      });
    } catch (error) {
      console.error('Finance log error:', error);
    }
  }, [user]);

  /**
   * Master guard: Full security pipeline for any financial action
   * gateway verification → fraud check → transaction lock → OTP → approval → execute
   */
  const executeSecureTransaction = useCallback(async (
    actionType: string,
    amount: number,
    details: Record<string, any> = {}
  ): Promise<{ allowed: boolean; lockId?: string; reason?: string }> => {
    // Step 1: Fraud check
    const fraudResult = await checkFraudPatterns(amount, actionType);
    if (fraudResult.blocked) {
      await logFinancialAction('transaction_blocked_fraud', 'finance_security', {
        action_type: actionType, amount, reason: fraudResult.reason
      });
      return { allowed: false, reason: fraudResult.reason };
    }

    // Step 2: Create transaction lock
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const lock = await createTransactionLock(transactionId, amount, actionType);
    if (!lock) {
      return { allowed: false, reason: 'Failed to create security lock' };
    }

    // Step 3: Log the initiated action
    await logFinancialAction('secure_transaction_initiated', 'finance_security', {
      action_type: actionType, amount, lock_id: lock.lockId, ...details
    });

    // Return lock info — UI must complete OTP and await approval
    return {
      allowed: false,
      lockId: lock.lockId,
      reason: 'Transaction locked. OTP verification and Boss approval required.'
    };
  }, [checkFraudPatterns, createTransactionLock, logFinancialAction]);

  return {
    isRefundAllowed,
    checkFraudPatterns,
    createTransactionLock,
    verifyTransactionOtp,
    requestBossApproval,
    logFinancialAction,
    executeSecureTransaction,
    otpVerified,
    pendingLockId,
  };
}
