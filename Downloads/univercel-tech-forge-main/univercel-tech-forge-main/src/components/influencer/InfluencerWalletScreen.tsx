import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, TrendingUp, Clock, ArrowUpRight,
  ArrowDownLeft, Download, Filter, Search, Calendar,
  CreditCard, Building, AlertTriangle, CheckCircle, X, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { influencerApi, type InfluencerWalletResponse } from '@/lib/api/influencer';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatRate(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: value > 0 && value < 1 ? 2 : 0,
    maximumFractionDigits: value > 0 && value < 1 ? 2 : 0,
  }).format(value || 0);
}

const InfluencerWalletScreen = () => {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [walletData, setWalletData] = useState<InfluencerWalletResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadWallet = async () => {
      try {
        setLoading(true);
        const response = await influencerApi.getWallet();
        if (mounted) {
          setWalletData(response);
        }
      } catch (error) {
        if (mounted) {
          toast.error('Wallet load failed', {
            description: error instanceof Error ? error.message : 'Unable to load wallet data.',
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadWallet();

    return () => {
      mounted = false;
    };
  }, []);

  const transactions = useMemo(() => (walletData?.ledger || []).map((entry) => ({
    id: entry.id,
    type: entry.amount >= 0
      ? (String(entry.description || '').toLowerCase().includes('referral') ? 'referral' : 'credit')
      : 'withdrawal',
    description: entry.description || 'Wallet movement',
    amount: Number(entry.amount) || 0,
    date: new Date(entry.created_at).toLocaleDateString('en-IN'),
    status: entry.status || 'completed',
  })), [walletData]);

  const commissionRates = useMemo(() => {
    const rate = walletData?.platform_rate;
    return [
      { type: 'Reach', rate: formatRate(Number(rate?.rate_per_real_reach) || 0), description: 'Per verified reach unit' },
      { type: 'Engagement', rate: formatRate(Number(rate?.rate_per_engagement) || 0), description: 'Per tracked engagement unit' },
      { type: 'CPL', rate: formatRate(Number(rate?.cpl_rate) || 0), description: 'Per qualified lead' },
      { type: 'CPA', rate: formatRate(Number(rate?.cpa_rate) || 0), description: 'Per approved sale' },
      { type: 'L1 / L2', rate: '10% / 5%', description: 'Referral override on child earnings' },
    ];
  }, [walletData]);

  const filteredTransactions = transactions.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (searchQuery && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleWithdraw = async () => {
    const amount = Number(withdrawAmount);
    if (!amount || amount < 1000) return;

    try {
      setSubmitting(true);
      await influencerApi.requestPayout({ amount, payment_method: 'bank_transfer' });
      toast.success('Withdrawal requested', {
        description: 'The payout request has been submitted to finance.',
      });
      setShowWithdraw(false);
      setWithdrawAmount('');
      const refreshedWallet = await influencerApi.getWallet();
      setWalletData(refreshedWallet);
    } catch (error) {
      toast.error('Withdrawal failed', {
        description: error instanceof Error ? error.message : 'Unable to request payout.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const wallet = walletData?.wallet;
  const breakdown = walletData?.breakdown;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Wallet className="w-6 h-6 text-emerald-400" />
            </div>
            Wallet & Payouts
          </h2>
          <p className="text-slate-400 mt-1">Track earnings, commissions, and request withdrawals</p>
        </div>
        <Button 
          onClick={() => setShowWithdraw(true)}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
          disabled={loading || (wallet?.available_balance || 0) < 1000}
        >
          <ArrowUpRight className="w-4 h-4 mr-2" />
          Withdraw
        </Button>
      </div>

      {loading && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-slate-900/60 p-5 text-slate-200">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
          <span>Loading wallet and commission journal...</span>
        </div>
      )}

      {/* Balance Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-emerald-400">Available Balance</span>
            <Wallet className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-white">{formatCurrency(wallet?.available_balance || 0)}</p>
          <p className="text-xs text-slate-400 mt-1">Ready to withdraw</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-yellow-400">Pending</span>
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white">{formatCurrency(wallet?.pending_balance || 0)}</p>
          <p className="text-xs text-slate-400 mt-1">Awaiting approval</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-violet-400">Total Earned</span>
            <TrendingUp className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-3xl font-bold text-white">{formatCurrency(wallet?.total_earned || 0)}</p>
          <p className="text-xs text-slate-400 mt-1">Lifetime earnings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-cyan-400">Referral Earnings</span>
            <ArrowDownLeft className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold text-white">{formatCurrency(breakdown?.referral_earnings || 0)}</p>
          <p className="text-xs text-slate-400 mt-1">L1 and L2 override earnings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-pink-400">Campaign Earnings</span>
            <TrendingUp className="w-5 h-5 text-pink-400" />
          </div>
          <p className="text-3xl font-bold text-white">{formatCurrency(breakdown?.campaign_earnings || 0)}</p>
          <p className="text-xs text-slate-400 mt-1">Last payout: {breakdown?.last_payout_at ? new Date(breakdown.last_payout_at).toLocaleDateString('en-IN') : 'Not paid yet'}</p>
        </motion.div>
      </div>

      {/* Commission Rates & Tier System */}
      <div className="grid grid-cols-2 gap-6">
        {/* Commission Rates */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-violet-400" />
            Commission Engine Rates
          </h3>
          <div className="space-y-3">
            {commissionRates.map((rate, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
                <div>
                  <p className="font-medium text-white">{rate.type}</p>
                  <p className="text-xs text-slate-400">{rate.description}</p>
                </div>
                <span className="text-lg font-bold text-emerald-400">{rate.rate}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Wallet Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-cyan-400" />
            Wallet Breakdown
          </h3>
          <div className="space-y-2">
            {[
              { label: 'Referral Earnings', value: formatCurrency(breakdown?.referral_earnings || 0), accent: 'text-cyan-400' },
              { label: 'Campaign Earnings', value: formatCurrency(breakdown?.campaign_earnings || 0), accent: 'text-pink-400' },
              { label: 'Bonus Earnings', value: formatCurrency(breakdown?.bonus_earnings || 0), accent: 'text-yellow-400' },
              { label: 'Pending Payout Total', value: formatCurrency(breakdown?.pending_payout_total || 0), accent: 'text-amber-400' },
              { label: 'Total Withdrawn', value: formatCurrency(wallet?.total_withdrawn || 0), accent: 'text-emerald-400' },
            ].map((tier, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between rounded-lg bg-slate-900/50 p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-white">{tier.label}</span>
                </div>
                <Badge className={`bg-slate-800 ${tier.accent}`}>
                  {tier.value}
                </Badge>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">Duplicate payouts are blocked by source keys and referral journal references.</p>
        </motion.div>
      </div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Transaction History</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-9 w-48 bg-slate-900/50 border-slate-700"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-36 bg-slate-900/50 border-slate-700">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="credit">Credits</SelectItem>
                <SelectItem value="referral">Referrals</SelectItem>
                <SelectItem value="withdrawal">Withdrawals</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {filteredTransactions.map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/80 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  tx.type === 'credit' || tx.type === 'referral' 
                    ? 'bg-emerald-500/20' 
                    : 'bg-blue-500/20'
                }`}>
                  {tx.type === 'credit' || tx.type === 'referral' ? (
                    <TrendingUp className={`w-4 h-4 ${tx.type === 'referral' ? 'text-cyan-400' : 'text-emerald-400'}`} />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-blue-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-white">{tx.description}</p>
                  <p className="text-xs text-slate-400">{tx.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-lg font-bold ${
                  tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                </span>
                {tx.status === 'pending' ? (
                  <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                )}
              </div>
            </motion.div>
          ))}
          {!loading && filteredTransactions.length === 0 && (
            <div className="rounded-lg bg-slate-900/50 p-4 text-sm text-slate-500">
              No wallet transactions match the current filters.
            </div>
          )}
        </div>
      </motion.div>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdraw && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowWithdraw(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-slate-900 rounded-2xl border border-emerald-500/20 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Request Withdrawal</h3>
                  <button onClick={() => setShowWithdraw(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <p className="text-sm text-emerald-400">Available Balance</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(wallet?.available_balance || 0)}</p>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Amount to Withdraw</label>
                  <Input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount (min ₹1,000)"
                    className="bg-slate-800/50 border-slate-700"
                  />
                </div>

                <div className="p-3 rounded-lg bg-slate-800/50 text-sm text-slate-400">
                  <p className="flex items-center gap-2 mb-1">
                    <Building className="w-4 h-4" />
                    Bank Account: Primary payout account on file
                  </p>
                  <p className="text-xs">Processing time: 2-3 business days</p>
                </div>

                <div className="flex items-start gap-2 text-xs text-yellow-400">
                  <AlertTriangle className="w-4 h-4 mt-0.5" />
                  <p>Withdrawal requests are subject to verification. TDS applicable as per regulations.</p>
                </div>
              </div>

              <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowWithdraw(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500"
                  onClick={() => void handleWithdraw()}
                  disabled={submitting || !withdrawAmount || Number(withdrawAmount) < 1000 || Number(withdrawAmount) > (wallet?.available_balance || 0)}
                >
                  {submitting ? 'Submitting...' : 'Request Withdrawal'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InfluencerWalletScreen;