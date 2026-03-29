import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, TrendingUp, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle2, Download, Filter, Building2,
  Award, AlertCircle, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const FranchiseWalletCommission = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'commissions' | 'withdrawals' | 'bonuses'>('all');

  const walletData = {
    availableBalance: 127500,
    pendingCommissions: 35200,
    totalEarned: 485000,
    thisMonth: 62500,
    commissionRate: 15,
  };

  const transactions = [
    { id: 1, type: 'commission', description: 'Sale - E-Commerce Platform', leadName: '[MASKED]', amount: 15000, status: 'credited', date: '2 hours ago' },
    { id: 2, type: 'bonus', description: 'Target Achievement Bonus', amount: 10000, status: 'credited', date: '1 day ago' },
    { id: 3, type: 'commission', description: 'Sale - Hospital Management', leadName: '[MASKED]', amount: 22500, status: 'pending', date: '2 days ago' },
    { id: 4, type: 'withdrawal', description: 'Bank Transfer', amount: -50000, status: 'completed', date: '1 week ago' },
    { id: 5, type: 'commission', description: 'Sale - School ERP', leadName: '[MASKED]', amount: 18000, status: 'credited', date: '1 week ago' },
    { id: 6, type: 'referral', description: 'Referral Bonus - New Reseller', amount: 5000, status: 'credited', date: '2 weeks ago' },
  ];

  const handleWithdrawal = () => {
    toast({
      title: "Withdrawal Request",
      description: "Your withdrawal request has been submitted for approval.",
    });
  };

  const filteredTransactions = activeTab === 'all' 
    ? transactions 
    : transactions.filter(t => {
        if (activeTab === 'commissions') return t.type === 'commission';
        if (activeTab === 'withdrawals') return t.type === 'withdrawal';
        if (activeTab === 'bonuses') return t.type === 'bonus' || t.type === 'referral';
        return true;
      });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'commission':
        return <ArrowUpRight className="w-4 h-4 text-emerald-400" />;
      case 'bonus':
      case 'referral':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'withdrawal':
        return <ArrowDownRight className="w-4 h-4 text-blue-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'commission':
        return 'text-emerald-400';
      case 'bonus':
      case 'referral':
        return 'text-amber-400';
      case 'withdrawal':
        return 'text-blue-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Wallet & Commission</h1>
          <p className="text-slate-400">Track your earnings and manage withdrawals</p>
        </div>
        <Button onClick={handleWithdrawal} className="bg-indigo-500 hover:bg-indigo-600">
          <Download className="w-4 h-4 mr-2" />
          Request Withdrawal
        </Button>
      </div>

      {/* Security Notice */}
      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2">
        <Shield className="w-4 h-4 text-emerald-400" />
        <span className="text-sm text-emerald-400">All transactions are auditable. Client identities are masked for privacy.</span>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-5 h-5 text-indigo-400" />
            <span className="text-sm text-slate-400">Available Balance</span>
          </div>
          <p className="text-3xl font-bold text-white">₹{walletData.availableBalance.toLocaleString()}</p>
          <p className="text-xs text-emerald-400 mt-1">Ready to withdraw</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-slate-400">Pending Commission</span>
          </div>
          <p className="text-3xl font-bold text-white">₹{walletData.pendingCommissions.toLocaleString()}</p>
          <p className="text-xs text-amber-400 mt-1">Under review</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-slate-400">This Month</span>
          </div>
          <p className="text-3xl font-bold text-white">₹{walletData.thisMonth.toLocaleString()}</p>
          <p className="text-xs text-emerald-400 mt-1">+18% vs last month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-slate-400">Total Earned</span>
          </div>
          <p className="text-3xl font-bold text-white">₹{walletData.totalEarned.toLocaleString()}</p>
          <p className="text-xs text-purple-400 mt-1">All time</p>
        </motion.div>
      </div>

      {/* Commission Rate Info */}
      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
            <span className="text-xl font-bold text-indigo-400">{walletData.commissionRate}%</span>
          </div>
          <div>
            <p className="font-medium text-white">Your Commission Rate</p>
            <p className="text-sm text-slate-400">Applied to all successful sales</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Next Bonus at</p>
          <p className="font-medium text-amber-400">₹5L monthly sales</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
        <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-white">Bank Account</p>
            <p className="text-sm text-slate-400">HDFC Bank •••• 4523</p>
          </div>
          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">Verified</span>
        </div>
      </div>

      {/* Transaction History */}
      <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Transaction Ledger</h3>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'commissions', label: 'Commissions' },
            { id: 'bonuses', label: 'Bonuses' },
            { id: 'withdrawals', label: 'Withdrawals' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {filteredTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900/80 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  transaction.type === 'commission' ? 'bg-emerald-500/20' :
                  transaction.type === 'withdrawal' ? 'bg-blue-500/20' : 'bg-amber-500/20'
                }`}>
                  {getTypeIcon(transaction.type)}
                </div>
                <div>
                  <p className="font-medium text-white">{transaction.description}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{transaction.date}</span>
                    {transaction.leadName && <span>• Client: {transaction.leadName}</span>}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${getTypeColor(transaction.type)}`}>
                  {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                </p>
                <span className={`text-xs ${
                  transaction.status === 'credited' || transaction.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {transaction.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FranchiseWalletCommission;
