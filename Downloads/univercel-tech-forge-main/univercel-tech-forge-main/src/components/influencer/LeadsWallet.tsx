import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Wallet, TrendingUp, Clock, CheckCircle2, 
  XCircle, ArrowUpRight, ArrowDownRight, Filter,
  Download, Eye, MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface LeadsWalletProps {
  activeTab?: string;
}

const leads = [
  { id: 1, name: 'Raj Enterprises', product: 'POS System', status: 'converted', value: 15000, date: '2 hours ago' },
  { id: 2, name: 'Green Valley School', product: 'School ERP', status: 'pending', value: 25000, date: '5 hours ago' },
  { id: 3, name: 'City Hospital', product: 'Hospital CRM', status: 'demo_scheduled', value: 35000, date: '1 day ago' },
  { id: 4, name: 'Prime Realty', product: 'Real Estate Suite', status: 'lost', value: 20000, date: '2 days ago' },
  { id: 5, name: 'Tech Solutions', product: 'HR System', status: 'converted', value: 18000, date: '3 days ago' },
];

const transactions = [
  { id: 1, type: 'credit', amount: 5250, description: 'Commission - POS System Sale', date: 'Today' },
  { id: 2, type: 'credit', amount: 3150, description: 'Commission - School ERP Sale', date: 'Yesterday' },
  { id: 3, type: 'withdrawal', amount: 25000, description: 'Bank Transfer', date: '2 days ago' },
  { id: 4, type: 'credit', amount: 2700, description: 'Commission - HR System Sale', date: '3 days ago' },
  { id: 5, type: 'bonus', amount: 5000, description: 'Monthly Top Performer Bonus', date: '5 days ago' },
];

const LeadsWallet = ({ activeTab = 'leads' }: LeadsWalletProps) => {
  const [tab, setTab] = useState(activeTab === 'wallet' ? 'wallet' : 'leads');

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { color: string; label: string }> = {
      converted: { color: 'emerald', label: 'Converted' },
      pending: { color: 'amber', label: 'Pending' },
      demo_scheduled: { color: 'cyan', label: 'Demo Scheduled' },
      lost: { color: 'red', label: 'Lost' },
    };
    const config = configs[status] || configs.pending;
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium bg-${config.color}-500/20 text-${config.color}-400`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl bg-slate-900/60 border border-slate-700/50 w-fit">
        <button
          onClick={() => setTab('leads')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            tab === 'leads'
              ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Leads & Conversion
          </span>
        </button>
        <button
          onClick={() => setTab('wallet')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            tab === 'wallet'
              ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Wallet
          </span>
        </button>
      </div>

      {tab === 'leads' ? (
        <>
          {/* Leads Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Leads', value: '1,247', icon: Users, color: 'violet', change: '+89 this week' },
              { label: 'Converted', value: '342', icon: CheckCircle2, color: 'emerald', change: '27.4% rate' },
              { label: 'Pending', value: '156', icon: Clock, color: 'amber', change: '12.5% of total' },
              { label: 'Total Value', value: '₹52.4L', icon: TrendingUp, color: 'cyan', change: '+₹8.2L this month' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-5 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
              >
                <stat.icon className={`w-6 h-6 text-${stat.color}-400 mb-3`} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="text-xs text-slate-500 mt-2">{stat.change}</p>
              </motion.div>
            ))}
          </div>

          {/* Leads Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Leads</h3>
              <button 
                onClick={() => toast.info("Filter options coming soon", { description: "Filter by status, date, and value" })}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Lead</th>
                    <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Product</th>
                    <th className="text-left py-3 px-4 text-sm text-slate-400 font-medium">Status</th>
                    <th className="text-right py-3 px-4 text-sm text-slate-400 font-medium">Value</th>
                    <th className="text-right py-3 px-4 text-sm text-slate-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, index) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-white">{lead.name}</p>
                          <p className="text-xs text-slate-500">{lead.date}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-300">{lead.product}</td>
                      <td className="py-4 px-4">{getStatusBadge(lead.status)}</td>
                      <td className="py-4 px-4 text-right text-white font-medium">₹{lead.value.toLocaleString()}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => toast.info(`Viewing lead: ${lead.name}`, { description: `Product: ${lead.product}` })}
                            className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => toast.success(`Opening chat with ${lead.name}`, { description: "Chat feature coming soon" })}
                            className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      ) : (
        <>
          {/* Wallet Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 border border-violet-500/30"
            >
              <Wallet className="w-8 h-8 text-violet-400 mb-4" />
              <p className="text-sm text-slate-400">Available Balance</p>
              <p className="text-3xl font-bold text-white mt-1">₹45,280</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toast.success("Withdrawal request initiated", { description: "Amount: ₹45,280 - Processing time: 2-3 business days" })}
                className="mt-4 w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-medium"
              >
                Withdraw
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-xl bg-slate-900/60 border border-amber-500/20"
            >
              <Clock className="w-8 h-8 text-amber-400 mb-4" />
              <p className="text-sm text-slate-400">Pending Commission</p>
              <p className="text-3xl font-bold text-white mt-1">₹12,400</p>
              <p className="text-xs text-amber-400 mt-4">5 conversions awaiting confirmation</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-xl bg-slate-900/60 border border-emerald-500/20"
            >
              <TrendingUp className="w-8 h-8 text-emerald-400 mb-4" />
              <p className="text-sm text-slate-400">Total Earned</p>
              <p className="text-3xl font-bold text-white mt-1">₹2,45,680</p>
              <p className="text-xs text-emerald-400 mt-4 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                +18% vs last month
              </p>
            </motion.div>
          </div>

          {/* Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Transaction History</h3>
              <button 
                onClick={() => toast.success("Exporting transactions...", { description: "Your transaction history will be downloaded as CSV" })}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            <div className="space-y-3">
              {transactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/30"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tx.type === 'credit' ? 'bg-emerald-500/20' :
                      tx.type === 'bonus' ? 'bg-violet-500/20' : 'bg-blue-500/20'
                    }`}>
                      {tx.type === 'withdrawal' ? (
                        <ArrowDownRight className="w-5 h-5 text-blue-400" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white">{tx.description}</p>
                      <p className="text-xs text-slate-500">{tx.date}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${
                    tx.type === 'withdrawal' ? 'text-blue-400' : 'text-emerald-400'
                  }`}>
                    {tx.type === 'withdrawal' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default LeadsWallet;
