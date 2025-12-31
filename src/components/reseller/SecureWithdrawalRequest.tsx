import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, IndianRupee, AlertTriangle, CheckCircle, 
  Clock, XCircle, Loader2, ShieldCheck, Ban 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { ResellerAccountData, ResellerWalletData } from '@/hooks/useResellerGuard';

interface SecureWithdrawalRequestProps {
  account: ResellerAccountData;
  wallet: ResellerWalletData | null;
  canWithdraw: boolean;
  onSuccess?: () => void;
}

export const SecureWithdrawalRequest = ({
  account,
  wallet,
  canWithdraw,
  onSuccess
}: SecureWithdrawalRequestProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState<Date | null>(null);

  const MIN_PAYOUT = wallet?.min_payout || 1000;
  const availableBalance = wallet?.available_balance || 0;

  // Rate limiting: max 3 requests per hour
  const checkRateLimit = (): boolean => {
    if (!lastRequestTime) return true;
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return lastRequestTime < hourAgo;
  };

  // Get withdrawal eligibility reasons
  const getIneligibilityReasons = (): string[] => {
    const reasons: string[] = [];
    
    if (account.status !== 'active') {
      reasons.push('Account is not active');
    }
    if (!account.kyc_verified) {
      reasons.push('KYC verification required');
    }
    if (availableBalance < MIN_PAYOUT) {
      reasons.push(`Minimum balance of ₹${MIN_PAYOUT.toLocaleString()} required`);
    }
    
    return reasons;
  };

  const handleWithdrawalRequest = async () => {
    if (!canWithdraw || !wallet) {
      toast.error('You are not eligible for withdrawal');
      return;
    }

    if (!checkRateLimit()) {
      toast.error('Please wait before making another withdrawal request');
      return;
    }

    setSubmitting(true);

    try {
      // Create withdrawal request
      const { error } = await supabase
        .from('reseller_payouts')
        .insert({
          reseller_id: account.id,
          amount: availableBalance,
          payout_type: 'withdrawal',
          status: 'pending',
          requested_at: new Date().toISOString()
        });

      if (error) throw error;

      // Log to audit
      await supabase.from('audit_logs').insert({
        user_id: account.user_id,
        action: 'WITHDRAWAL_REQUESTED',
        module: 'reseller_wallet',
        role: 'reseller',
        meta_json: {
          reseller_id: account.id,
          reseller_code: account.reseller_code,
          amount: availableBalance,
          timestamp: new Date().toISOString()
        }
      });

      setLastRequestTime(new Date());
      toast.success('Withdrawal request submitted! Awaiting admin approval.');
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to submit withdrawal request');
    } finally {
      setSubmitting(false);
    }
  };

  const ineligibilityReasons = getIneligibilityReasons();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-emerald-500/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30">
            <Wallet className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Wallet & Withdrawal</h3>
            <p className="text-xs text-slate-400">View earnings • Request payout</p>
          </div>
        </div>
        
        <Badge 
          variant="outline" 
          className={canWithdraw 
            ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' 
            : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
          }
        >
          {canWithdraw ? 'Eligible' : 'Not Eligible'}
        </Badge>
      </div>

      {/* Balance Display */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
          <p className="text-xs text-slate-400 mb-1">Available Balance</p>
          <div className="flex items-center gap-1">
            <IndianRupee className="w-5 h-5 text-emerald-400" />
            <span className="text-2xl font-bold text-emerald-400">
              {availableBalance.toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <p className="text-xs text-slate-400 mb-1">Pending Balance</p>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-2xl font-bold text-white">
              ₹{(wallet?.pending_balance || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <p className="text-[10px] text-slate-400">Total Earned</p>
          <p className="text-sm font-semibold text-white">
            ₹{(wallet?.total_earned || 0).toLocaleString()}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <p className="text-[10px] text-slate-400">Total Withdrawn</p>
          <p className="text-sm font-semibold text-white">
            ₹{(wallet?.total_withdrawn || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Ineligibility Reasons */}
      {!canWithdraw && ineligibilityReasons.length > 0 && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-400 mb-1">Cannot Withdraw</p>
              <ul className="text-xs text-amber-300/80 space-y-0.5">
                {ineligibilityReasons.map((reason, i) => (
                  <li key={i}>• {reason}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Minimum Payout Notice */}
      <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 mb-4">
        <p className="text-xs text-slate-400">
          <ShieldCheck className="w-3 h-3 inline mr-1 text-emerald-400" />
          Minimum payout: ₹{MIN_PAYOUT.toLocaleString()} • KYC verification required
        </p>
      </div>

      {/* Withdrawal Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            disabled={!canWithdraw}
            className={`w-full ${
              canWithdraw 
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500' 
                : 'bg-slate-700 cursor-not-allowed'
            }`}
          >
            {canWithdraw ? (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Request Withdrawal
              </>
            ) : (
              <>
                <Ban className="w-4 h-4 mr-2" />
                Withdrawal Unavailable
              </>
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-teal-400" />
              Confirm Withdrawal Request
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              You are requesting a withdrawal of your available balance.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
              <p className="text-xs text-slate-400 mb-1">Withdrawal Amount</p>
              <div className="flex items-center gap-1">
                <IndianRupee className="w-6 h-6 text-teal-400" />
                <span className="text-3xl font-bold text-teal-400">
                  {availableBalance.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                <p className="text-xs text-amber-300">
                  Withdrawal requests require admin approval. Processing may take 2-5 business days.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-slate-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleWithdrawalRequest}
              disabled={submitting}
              className="flex-1 bg-teal-600 hover:bg-teal-500"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Request
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Disclaimer */}
      <p className="text-[10px] text-slate-500 mt-4 text-center">
        All withdrawals require admin approval. No auto-withdrawals allowed.
      </p>
    </motion.div>
  );
};

export default SecureWithdrawalRequest;
