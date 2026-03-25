import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, AlertCircle, Send, Shield, 
  CheckCircle, XCircle, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FranchiseWalletData } from '@/hooks/useFranchiseGuard';
import { useAuth } from '@/hooks/useAuth';

interface FranchiseWithdrawalRequestProps {
  franchiseId: string;
  wallet: FranchiseWalletData | null;
  kycVerified: boolean;
  isActive: boolean;
}

const MIN_WITHDRAWAL = 1000;

export function FranchiseWithdrawalRequest({ 
  franchiseId, 
  wallet, 
  kycVerified,
  isActive
}: FranchiseWithdrawalRequestProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const availableBalance = wallet?.available_balance || 0;
  const canWithdraw = isActive && kycVerified && availableBalance >= MIN_WITHDRAWAL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const withdrawAmount = parseFloat(amount);
    
    if (!withdrawAmount || withdrawAmount < MIN_WITHDRAWAL) {
      toast.error(`Minimum withdrawal is ₹${MIN_WITHDRAWAL}`);
      return;
    }

    if (withdrawAmount > availableBalance) {
      toast.error('Insufficient balance');
      return;
    }

    setSubmitting(true);
    try {
      // Policy 5: Check for fraud patterns (repeated failed attempts)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data: recentRequests } = await supabase
        .from('payout_requests')
        .select('id')
        .eq('user_id', user?.id)
        .gte('timestamp', oneHourAgo);

      if ((recentRequests?.length || 0) >= 3) {
        toast.error('Too many withdrawal requests. Please try again later.');
        await supabase.from('finance_security_alerts').insert({
          alert_type: 'excessive_withdrawals',
          severity: 'high',
          user_id: user?.id,
          description: `Franchise ${franchiseId} made ${recentRequests?.length} withdrawal requests in 1 hour.`,
          metadata: { franchise_id: franchiseId, amount: withdrawAmount }
        } as any);
        return;
      }

      // Policy 6: Create transaction security lock
      const transactionId = `WDR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      await supabase.from('transaction_security_locks').insert({
        transaction_id: transactionId,
        lock_type: 'withdrawal',
        user_id: user?.id,
        amount: withdrawAmount,
        lock_status: 'locked',
        otp_verified: false,
        gateway_verified: false,
        boss_approved: false,
        metadata: { franchise_id: franchiseId }
      } as any);

      // Policy 3: Create payout request (requires Boss approval)
      const { error } = await supabase
        .from('payout_requests')
        .insert({
          user_id: user?.id,
          amount: withdrawAmount,
          status: 'pending',
          request_type: 'franchise_withdrawal',
          notes: `Franchise withdrawal request for ₹${withdrawAmount}. Requires OTP verification and Boss approval.`
        });

      if (error) throw error;

      // Policy 7: Immutable audit log
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'withdrawal_requested',
        module: 'franchise_wallet',
        role: 'franchise' as any,
        meta_json: { 
          amount: withdrawAmount,
          franchise_id: franchiseId,
          transaction_id: transactionId,
          security_lock: true,
          otp_required: true,
          boss_approval_required: true
        }
      });

      // Notify Boss
      const { data: bossUsers } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'boss_owner');

      if (bossUsers?.length) {
        await supabase.from('user_notifications').insert(
          bossUsers.map(b => ({
            user_id: b.user_id,
            type: 'approval_required',
            message: `Franchise withdrawal request: ₹${withdrawAmount.toLocaleString()} — Requires approval`,
            event_type: 'withdrawal_approval',
          }))
        );
      }

      toast.success('Withdrawal request submitted', {
        description: 'Pending OTP verification and Boss approval before processing.'
      });
      
      setAmount('');
    } catch (err: any) {
      console.error('Error submitting withdrawal:', err);
      toast.error('Failed to submit withdrawal request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-5 h-5 text-purple-400" />
        <h3 className="font-semibold text-white">Request Withdrawal</h3>
      </div>

      {/* Requirements Check */}
      <div className="space-y-2 mb-4">
        <div className={`flex items-center gap-2 p-2 rounded-lg ${
          isActive ? 'bg-emerald-500/10' : 'bg-red-500/10'
        }`}>
          {isActive ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <XCircle className="w-4 h-4 text-red-400" />
          )}
          <span className={`text-sm ${isActive ? 'text-emerald-400' : 'text-red-400'}`}>
            Account Active
          </span>
        </div>

        <div className={`flex items-center gap-2 p-2 rounded-lg ${
          kycVerified ? 'bg-emerald-500/10' : 'bg-amber-500/10'
        }`}>
          {kycVerified ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <Shield className="w-4 h-4 text-amber-400" />
          )}
          <span className={`text-sm ${kycVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
            {kycVerified ? 'KYC Verified' : 'KYC Pending'}
          </span>
        </div>

        <div className={`flex items-center gap-2 p-2 rounded-lg ${
          availableBalance >= MIN_WITHDRAWAL ? 'bg-emerald-500/10' : 'bg-slate-700/50'
        }`}>
          {availableBalance >= MIN_WITHDRAWAL ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-slate-400" />
          )}
          <span className={`text-sm ${
            availableBalance >= MIN_WITHDRAWAL ? 'text-emerald-400' : 'text-slate-400'
          }`}>
            Min ₹{MIN_WITHDRAWAL} balance (You have ₹{availableBalance.toLocaleString()})
          </span>
        </div>
      </div>

      {canWithdraw ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Withdrawal Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              min={MIN_WITHDRAWAL}
              max={availableBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Min ₹${MIN_WITHDRAWAL}`}
              className="mt-1 bg-slate-900/50 border-slate-700"
            />
            <p className="text-xs text-slate-500 mt-1">
              Available: ₹{availableBalance.toLocaleString()}
            </p>
          </div>

          <Button
            type="submit"
            disabled={submitting || !amount}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500"
          >
            {submitting ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Request
              </>
            )}
          </Button>

          <p className="text-xs text-slate-500 text-center">
            All withdrawals require admin approval
          </p>
        </form>
      ) : (
        <div className="p-4 rounded-lg bg-slate-900/50 text-center">
          <AlertCircle className="w-8 h-8 mx-auto text-amber-400 mb-2" />
          <p className="text-sm text-slate-400">
            Complete all requirements above to request a withdrawal.
          </p>
        </div>
      )}
    </motion.div>
  );
}
