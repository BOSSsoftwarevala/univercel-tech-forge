import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, ArrowUpRight, X, AlertTriangle, Building, 
  CheckCircle, Clock, Shield, FileText, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SecureWithdrawalRequestProps {
  availableBalance: number;
  pendingBalance: number;
  canWithdraw: boolean;
  kycVerified: boolean;
  minPayout?: number;
  onSuccess?: () => void;
}

const MIN_PAYOUT_DEFAULT = 1000;

const SecureWithdrawalRequest = ({
  availableBalance,
  pendingBalance,
  canWithdraw,
  kycVerified,
  minPayout = MIN_PAYOUT_DEFAULT,
  onSuccess,
}: SecureWithdrawalRequestProps) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const parsedAmount = Number(amount) || 0;
  const isValidAmount = parsedAmount >= minPayout && parsedAmount <= availableBalance;

  const handleWithdrawalRequest = async () => {
    if (!user?.id || !isValidAmount || !agreedToTerms) return;

    setLoading(true);
    try {
      // Check existing pending requests (rate limit: 3 per hour enforced in DB)
      const { data: existingRequests, error: checkError } = await supabase
        .from('influencer_payout_requests')
        .select('id, created_at')
        .eq('influencer_id', user.id)
        .eq('status', 'pending')
        .gte('created_at', new Date(Date.now() - 3600000).toISOString());

      if (checkError) throw checkError;

      if (existingRequests && existingRequests.length >= 3) {
        toast.error('Rate Limit Exceeded', {
          description: 'You can only submit 3 withdrawal requests per hour.',
        });
        return;
      }

      // Submit withdrawal request
      const { error: insertError } = await supabase
        .from('influencer_payout_requests')
        .insert({
          influencer_id: user.id,
          amount: parsedAmount,
          status: 'pending',
          request_type: 'standard',
          bank_verified: false, // Admin must verify
        });

      if (insertError) throw insertError;

      // Log the action
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        role: 'influencer',
        module: 'wallet',
        action: 'withdrawal_request',
        meta_json: {
          amount: parsedAmount,
          available_balance: availableBalance,
          timestamp: new Date().toISOString(),
        },
      });

      toast.success('Withdrawal Request Submitted', {
        description: `₹${parsedAmount.toLocaleString()} will be processed after admin approval.`,
      });

      setShowModal(false);
      setAmount('');
      setAgreedToTerms(false);
      onSuccess?.();
    } catch (error) {
      console.error('Withdrawal request failed:', error);
      toast.error('Request Failed', {
        description: 'Could not submit withdrawal request. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Reasons why withdrawal might be blocked
  const getBlockReasons = (): string[] => {
    const reasons: string[] = [];
    if (!kycVerified) reasons.push('KYC verification required');
    if (availableBalance < minPayout) reasons.push(`Minimum payout is ₹${minPayout.toLocaleString()}`);
    return reasons;
  };

  const blockReasons = getBlockReasons();

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setShowModal(true)}
        disabled={!canWithdraw}
        className={`${
          canWithdraw
            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600'
            : 'bg-slate-600 cursor-not-allowed'
        }`}
      >
        {canWithdraw ? (
          <>
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Request Withdrawal
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 mr-2" />
            Withdrawals Locked
          </>
        )}
      </Button>

      {/* Show block reasons if not eligible */}
      {!canWithdraw && blockReasons.length > 0 && (
        <div className="mt-2 text-xs text-amber-400">
          {blockReasons.map((reason, i) => (
            <span key={i} className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {reason}
            </span>
          ))}
        </div>
      )}

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-slate-900 rounded-2xl border border-emerald-500/30 overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                      <Wallet className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Request Withdrawal</h3>
                      <p className="text-xs text-slate-400">Admin approval required</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowModal(false)} 
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                {/* Balance Display */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <p className="text-xs text-emerald-400 mb-1">Available</p>
                    <p className="text-2xl font-bold text-white">₹{availableBalance.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <p className="text-xs text-amber-400 mb-1">Pending</p>
                    <p className="text-2xl font-bold text-white">₹{pendingBalance.toLocaleString()}</p>
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Amount to Withdraw (Min: ₹{minPayout.toLocaleString()})
                  </label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Enter amount (₹${minPayout.toLocaleString()} - ₹${availableBalance.toLocaleString()})`}
                    className="bg-slate-800/50 border-slate-700 text-lg"
                    min={minPayout}
                    max={availableBalance}
                  />
                  {parsedAmount > 0 && !isValidAmount && (
                    <p className="text-xs text-red-400 mt-1">
                      {parsedAmount < minPayout 
                        ? `Minimum withdrawal is ₹${minPayout.toLocaleString()}`
                        : `Cannot exceed available balance of ₹${availableBalance.toLocaleString()}`
                      }
                    </p>
                  )}
                </div>

                {/* Bank Account Info */}
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Building className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-white">Bank Account (on file)</span>
                  </div>
                  <p className="text-xs text-slate-400 ml-8">
                    Processing time: 2-3 business days after approval
                  </p>
                </div>

                {/* Terms Agreement */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 rounded border-slate-600 bg-slate-800"
                  />
                  <span className="text-xs text-slate-400">
                    I understand this withdrawal request requires admin approval and is subject to 
                    verification. TDS will be deducted as per applicable regulations.
                  </span>
                </label>

                {/* Security Notice */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-violet-500/10 border border-violet-500/30">
                  <Shield className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-violet-300">
                    All withdrawal requests are logged and reviewed for fraud prevention. 
                    No auto-approval is allowed.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleWithdrawalRequest}
                  disabled={!isValidAmount || !agreedToTerms || loading}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                >
                  {loading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SecureWithdrawalRequest;
