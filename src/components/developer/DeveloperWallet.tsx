import { motion } from 'framer-motion';
import { 
  Wallet, TrendingUp, Clock, CheckCircle2, AlertCircle, 
  ArrowUpRight, Zap, Gift, Trophy
} from 'lucide-react';

const transactions = [
  { id: 1, type: 'credit', amount: 5000, description: 'Task TSK-045 completed', date: 'Today', status: 'completed' },
  { id: 2, type: 'credit', amount: 2500, description: 'Fast delivery bonus', date: 'Today', status: 'completed' },
  { id: 3, type: 'pending', amount: 8000, description: 'Task TSK-044 - awaiting approval', date: 'Yesterday', status: 'pending' },
  { id: 4, type: 'credit', amount: 12000, description: 'Task TSK-043 completed', date: '2 days ago', status: 'completed' },
  { id: 5, type: 'withdrawal', amount: 25000, description: 'Bank transfer', date: '3 days ago', status: 'completed' },
];

const DeveloperWallet = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Wallet & Payouts</h2>
          <p className="text-slate-400 mt-1">Track your earnings and withdrawals</p>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <Wallet className="w-8 h-8 text-cyan-400" />
            <span className="text-xs text-cyan-400 font-medium px-2 py-1 rounded bg-cyan-500/20">Available</span>
          </div>
          <p className="text-sm text-slate-400 mb-1">Available Balance</p>
          <motion.p
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            ₹45,280
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/20"
          >
            Withdraw
          </motion.button>
        </motion.div>

        {/* Pending */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-xl bg-slate-900/60 border border-amber-500/20 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-amber-400" />
            <span className="text-xs text-amber-400 font-medium px-2 py-1 rounded bg-amber-500/20">Pending</span>
          </div>
          <p className="text-sm text-slate-400 mb-1">Pending Commission</p>
          <motion.p
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            ₹12,400
          </motion.p>
          <p className="mt-4 text-sm text-amber-400/70">3 tasks awaiting approval</p>
        </motion.div>

        {/* Total Earned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-xl bg-slate-900/60 border border-emerald-500/20 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium px-2 py-1 rounded bg-emerald-500/20">Lifetime</span>
          </div>
          <p className="text-sm text-slate-400 mb-1">Total Earned</p>
          <motion.p
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            ₹2,45,680
          </motion.p>
          <p className="mt-4 text-sm text-emerald-400/70 flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" />
            +18% this month
          </p>
        </motion.div>
      </div>

      {/* Bonuses Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-xl"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-cyan-400" />
          Bonus Rewards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-cyan-400" />
              <div>
                <p className="text-white font-medium">Fast Delivery</p>
                <p className="text-sm text-slate-400">+₹500 per early task</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-amber-400" />
              <div>
                <p className="text-white font-medium">Quality Score</p>
                <p className="text-sm text-slate-400">+10% for 5-star rating</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <div>
                <p className="text-white font-medium">Zero Bugs</p>
                <p className="text-sm text-slate-400">+₹1,000 bonus</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-xl"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Transaction History</h3>
        <div className="space-y-3">
          {transactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  tx.type === 'credit' ? 'bg-emerald-500/20' :
                  tx.type === 'pending' ? 'bg-amber-500/20' : 'bg-blue-500/20'
                }`}>
                  {tx.type === 'credit' && <ArrowUpRight className="w-5 h-5 text-emerald-400" />}
                  {tx.type === 'pending' && <Clock className="w-5 h-5 text-amber-400" />}
                  {tx.type === 'withdrawal' && <Wallet className="w-5 h-5 text-blue-400" />}
                </div>
                <div>
                  <p className="text-white font-medium">{tx.description}</p>
                  <p className="text-sm text-slate-500">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  tx.type === 'credit' ? 'text-emerald-400' :
                  tx.type === 'pending' ? 'text-amber-400' : 'text-blue-400'
                }`}>
                  {tx.type === 'withdrawal' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                </p>
                <p className={`text-xs ${
                  tx.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {tx.status === 'completed' ? 'Completed' : 'Pending'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DeveloperWallet;
