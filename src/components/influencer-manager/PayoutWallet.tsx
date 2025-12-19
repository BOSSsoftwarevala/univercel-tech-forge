import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, Send, Clock, CheckCircle, XCircle, 
  AlertTriangle, DollarSign, TrendingUp, FileText, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const payoutRequests = [
  { id: 1, influencer: 'Priya Sharma', amount: 45000, status: 'pending', method: 'Bank Transfer', date: '2024-01-15', tier: 'Gold' },
  { id: 2, influencer: 'Rahul Verma', amount: 28500, status: 'approved', method: 'UPI', date: '2024-01-14', tier: 'Silver' },
  { id: 3, influencer: 'Sneha Patel', amount: 125000, status: 'processing', method: 'Bank Transfer', date: '2024-01-13', tier: 'Elite' },
  { id: 4, influencer: 'Amit Kumar', amount: 15000, status: 'completed', method: 'UPI', date: '2024-01-12', tier: 'Bronze' },
  { id: 5, influencer: 'Neha Singh', amount: 89000, status: 'frozen', method: 'Bank Transfer', date: '2024-01-11', tier: 'Gold' },
];

const walletStats = [
  { label: 'Total Distributed', value: '₹2.4Cr', change: '+18%', icon: Send },
  { label: 'Pending Payouts', value: '₹45L', change: '23 requests', icon: Clock },
  { label: 'This Month', value: '₹38L', change: '+24%', icon: TrendingUp },
  { label: 'Frozen Amount', value: '₹8.9L', change: '12 accounts', icon: AlertTriangle },
];

const PayoutWallet = () => {
  const [filter, setFilter] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Completed</Badge>;
      case 'approved':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Approved</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Processing</Badge>;
      case 'frozen':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Frozen</Badge>;
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Payout & Wallet Integration</h2>
          <p className="text-slate-400 mt-1">Manage commission distribution, payout requests, and tax compliance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Tax Reports
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Send className="w-4 h-4 mr-2" />
            Bulk Payout
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {walletStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-emerald-400">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Payout Requests */}
        <div className="col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-purple-500/20 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-pink-400" />
                Payout Requests
              </h3>
              <div className="flex gap-2">
                {['all', 'pending', 'processing', 'completed', 'frozen'].map((f) => (
                  <Button
                    key={f}
                    size="sm"
                    variant={filter === f ? 'default' : 'outline'}
                    onClick={() => setFilter(f)}
                    className={filter === f ? 'bg-purple-500' : ''}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {payoutRequests
                .filter(r => filter === 'all' || r.status === filter)
                .map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {request.influencer.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{request.influencer}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            request.tier === 'Elite' ? 'bg-purple-500/20 text-purple-400' :
                            request.tier === 'Gold' ? 'bg-yellow-500/20 text-yellow-400' :
                            request.tier === 'Silver' ? 'bg-slate-400/20 text-slate-300' :
                            'bg-amber-600/20 text-amber-400'
                          }`}>
                            {request.tier}
                          </span>
                        </div>
                        <div className="text-sm text-slate-400">{request.method} • {request.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">₹{request.amount.toLocaleString()}</div>
                        {getStatusBadge(request.status)}
                      </div>
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 h-8">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" className="bg-red-500/20 text-red-400 hover:bg-red-500/30 h-8">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Commission Rules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Commission Rules
            </h3>
            <div className="space-y-3">
              {[
                { tier: 'Bronze', base: '5%', multiplier: '1.0x' },
                { tier: 'Silver', base: '7%', multiplier: '1.2x' },
                { tier: 'Gold', base: '10%', multiplier: '1.5x' },
                { tier: 'Elite', base: '15%', multiplier: '2.0x' },
              ].map((rule) => (
                <div
                  key={rule.tier}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-slate-700/30"
                >
                  <span className="text-sm text-white">{rule.tier}</span>
                  <div className="text-right text-sm">
                    <span className="text-emerald-400">{rule.base}</span>
                    <span className="text-slate-400 mx-1">×</span>
                    <span className="text-purple-400">{rule.multiplier}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tax Compliance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Tax & GST Compliance</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">TDS Deducted</span>
                <span className="text-white">₹24.5L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">GST Collected</span>
                <span className="text-white">₹18.2L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pending KYC</span>
                <span className="text-yellow-400">23 accounts</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm">
              Download Tax Report
            </Button>
          </motion.div>

          {/* Freeze Rules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-red-500/20"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Payout Freeze Rules
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                Fraud detection triggered
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                KYC documents expired
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                Content policy violation
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                Manual review pending
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PayoutWallet;
