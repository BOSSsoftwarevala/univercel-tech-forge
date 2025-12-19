import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, TrendingUp, TrendingDown, Clock, ArrowUpRight, 
  ArrowDownLeft, Download, Filter, Search, Calendar,
  CreditCard, Building, AlertTriangle, CheckCircle, X
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

const walletData = {
  available: 45280,
  pending: 12500,
  totalEarned: 285000,
  totalWithdrawn: 227220,
  penalties: 0,
  lastPayout: '2024-01-10'
};

const transactions = [
  { id: 1, type: 'credit', description: 'Commission - Winter Sale Campaign', amount: 2500, date: '2024-01-15', status: 'completed' },
  { id: 2, type: 'credit', description: 'Bonus - Target Achievement', amount: 5000, date: '2024-01-14', status: 'completed' },
  { id: 3, type: 'withdrawal', description: 'Bank Transfer', amount: -15000, date: '2024-01-10', status: 'completed' },
  { id: 4, type: 'credit', description: 'Commission - New Year Promo', amount: 3200, date: '2024-01-08', status: 'completed' },
  { id: 5, type: 'credit', description: 'CPA Conversion', amount: 500, date: '2024-01-07', status: 'pending' },
  { id: 6, type: 'penalty', description: 'Fraudulent Click Penalty', amount: -200, date: '2024-01-05', status: 'completed' },
];

const commissionRates = [
  { type: 'CPC', rate: '₹0.50', description: 'Per valid click' },
  { type: 'CPL', rate: '₹5.00', description: 'Per lead generated' },
  { type: 'CPA', rate: '₹50-500', description: 'Per sale (varies by product)' },
];

const tierBonuses = [
  { tier: 'Bronze', requirement: '0-50 conversions', bonus: '0%' },
  { tier: 'Silver', requirement: '51-150 conversions', bonus: '+5%' },
  { tier: 'Gold', requirement: '151-500 conversions', bonus: '+10%' },
  { tier: 'Platinum', requirement: '501-1000 conversions', bonus: '+15%' },
  { tier: 'Diamond', requirement: '1000+ conversions', bonus: '+25%' },
];

const InfluencerWalletScreen = () => {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (searchQuery && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

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
          disabled={walletData.available < 1000}
        >
          <ArrowUpRight className="w-4 h-4 mr-2" />
          Withdraw
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-emerald-400">Available Balance</span>
            <Wallet className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-white">₹{walletData.available.toLocaleString()}</p>
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
          <p className="text-3xl font-bold text-white">₹{walletData.pending.toLocaleString()}</p>
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
          <p className="text-3xl font-bold text-white">₹{walletData.totalEarned.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">Lifetime earnings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-cyan-400">Withdrawn</span>
            <ArrowDownLeft className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold text-white">₹{walletData.totalWithdrawn.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">Last: {walletData.lastPayout}</p>
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
            Commission Rates
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

        {/* Tier Bonuses */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-cyan-400" />
            Tier Bonuses
          </h3>
          <div className="space-y-2">
            {tierBonuses.map((tier, i) => (
              <div 
                key={i} 
                className={`flex items-center justify-between p-3 rounded-lg ${
                  tier.tier === 'Gold' ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-slate-900/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${
                    tier.tier === 'Gold' ? 'text-yellow-400' : 'text-white'
                  }`}>{tier.tier}</span>
                  <span className="text-xs text-slate-400">{tier.requirement}</span>
                </div>
                <Badge className={tier.tier === 'Gold' ? 'bg-yellow-500/20 text-yellow-400' : ''}>
                  {tier.bonus}
                </Badge>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">Your current tier: <span className="text-yellow-400 font-medium">Gold (+10% bonus)</span></p>
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
                <SelectItem value="withdrawal">Withdrawals</SelectItem>
                <SelectItem value="bonus">Bonuses</SelectItem>
                <SelectItem value="penalty">Penalties</SelectItem>
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
                  tx.type === 'credit' || tx.type === 'bonus' 
                    ? 'bg-emerald-500/20' 
                    : tx.type === 'penalty'
                    ? 'bg-red-500/20'
                    : 'bg-blue-500/20'
                }`}>
                  {tx.type === 'credit' || tx.type === 'bonus' ? (
                    <TrendingUp className={`w-4 h-4 ${tx.type === 'bonus' ? 'text-yellow-400' : 'text-emerald-400'}`} />
                  ) : tx.type === 'penalty' ? (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
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
                  {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                </span>
                {tx.status === 'pending' ? (
                  <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                )}
              </div>
            </motion.div>
          ))}
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
                  <p className="text-2xl font-bold text-white">₹{walletData.available.toLocaleString()}</p>
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
                    Bank Account: HDFC ****4521
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
                  disabled={!withdrawAmount || Number(withdrawAmount) < 1000 || Number(withdrawAmount) > walletData.available}
                >
                  Request Withdrawal
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