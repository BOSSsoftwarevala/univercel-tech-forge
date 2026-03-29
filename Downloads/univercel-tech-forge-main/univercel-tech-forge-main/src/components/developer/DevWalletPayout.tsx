import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, TrendingUp, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle2, AlertCircle, CreditCard,
  Building2, Download, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const DevWalletPayout = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'earnings' | 'pending' | 'payouts'>('all');

  const walletData = {
    availableBalance: 45200,
    pendingEarnings: 8500,
    totalEarned: 285000,
    thisMonth: 53700,
  };

  const transactions = [
    { id: 1, type: 'earning', description: 'Payment Gateway Integration', amount: 2500, status: 'completed', date: '2 hours ago', taskId: 'TSK-001' },
    { id: 2, type: 'earning', description: 'Bug Fix - Dashboard', amount: 800, status: 'completed', date: '5 hours ago', taskId: 'TSK-002' },
    { id: 3, type: 'bonus', description: 'Early Completion Bonus', amount: 500, status: 'completed', date: '1 day ago', taskId: 'TSK-001' },
    { id: 4, type: 'payout', description: 'Bank Transfer', amount: -25000, status: 'completed', date: '3 days ago', payoutId: 'PAY-001' },
    { id: 5, type: 'pending', description: 'API Documentation', amount: 1500, status: 'pending', date: 'Pending review', taskId: 'TSK-003' },
    { id: 6, type: 'penalty', description: 'Late Delivery Deduction', amount: -200, status: 'completed', date: '1 week ago', taskId: 'TSK-004' },
  ];

  const filteredTransactions = activeTab === 'all' 
    ? transactions 
    : transactions.filter(t => {
        if (activeTab === 'earnings') return t.type === 'earning' || t.type === 'bonus';
        if (activeTab === 'pending') return t.status === 'pending';
        if (activeTab === 'payouts') return t.type === 'payout';
        return true;
      });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'earning':
      case 'bonus':
        return <ArrowUpRight className="w-4 h-4 text-emerald-400" />;
      case 'payout':
        return <ArrowDownRight className="w-4 h-4 text-blue-400" />;
      case 'penalty':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'earning':
      case 'bonus':
        return 'text-emerald-400';
      case 'payout':
        return 'text-blue-400';
      case 'penalty':
        return 'text-red-400';
      case 'pending':
        return 'text-amber-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Wallet & Payouts</h1>
          <p className="text-slate-400">Manage your earnings and withdrawals</p>
        </div>
        <Button className="bg-cyan-500 hover:bg-cyan-600">
          <Download className="w-4 h-4 mr-2" />
          Request Payout
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-5 h-5 text-cyan-400" />
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
            <span className="text-sm text-slate-400">Pending Earnings</span>
          </div>
          <p className="text-3xl font-bold text-white">₹{walletData.pendingEarnings.toLocaleString()}</p>
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
          <p className="text-xs text-emerald-400 mt-1">+12% vs last month</p>
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

      {/* Payment Methods */}
      <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Payment Methods</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-white">Bank Account</p>
              <p className="text-sm text-slate-400">HDFC •••• 4523</p>
            </div>
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">Primary</span>
          </div>
          <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 border-dashed">
            <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-slate-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-400">Add Payment Method</p>
              <p className="text-sm text-slate-500">UPI, Bank, or Card</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Transaction History</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'earnings', label: 'Earnings' },
            { id: 'pending', label: 'Pending' },
            { id: 'payouts', label: 'Payouts' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
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
                  transaction.type === 'earning' || transaction.type === 'bonus' ? 'bg-emerald-500/20' :
                  transaction.type === 'payout' ? 'bg-blue-500/20' :
                  transaction.type === 'penalty' ? 'bg-red-500/20' : 'bg-amber-500/20'
                }`}>
                  {getTypeIcon(transaction.type)}
                </div>
                <div>
                  <p className="font-medium text-white">{transaction.description}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{transaction.date}</span>
                    {transaction.taskId && <span>• {transaction.taskId}</span>}
                    {transaction.payoutId && <span>• {transaction.payoutId}</span>}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${getTypeColor(transaction.type)}`}>
                  {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                </p>
                <span className={`text-xs ${
                  transaction.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'
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

export default DevWalletPayout;
