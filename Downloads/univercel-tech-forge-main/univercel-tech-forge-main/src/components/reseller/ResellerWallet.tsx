import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, Clock, Download, TrendingUp, Gift, Target,
  DollarSign, Percent, CheckCircle2, AlertTriangle, Shield, Eye, Brain,
  CreditCard, BarChart3, Zap, Star, Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const transactions = [
  { id: 1, type: 'commission', description: 'Commission - E-Commerce Platform (20%)', saleAmount: 50000, amount: 10000, date: '2 hours ago', status: 'completed' },
  { id: 2, type: 'commission', description: 'Commission - Hospital Management (20%)', saleAmount: 125000, amount: 25000, date: '1 day ago', status: 'completed' },
  { id: 3, type: 'commission', description: 'Commission - School ERP (20%)', saleAmount: 75000, amount: 15000, date: '2 days ago', status: 'pending' },
  { id: 4, type: 'withdrawal', description: 'Withdrawal to Bank', saleAmount: 0, amount: -50000, date: '3 days ago', status: 'completed' },
  { id: 5, type: 'commission', description: 'Commission - POS System (20%)', saleAmount: 40000, amount: 8000, date: '5 days ago', status: 'completed' },
  { id: 6, type: 'referral', description: 'Referral Bonus - New Reseller', saleAmount: 0, amount: 5000, date: '1 week ago', status: 'completed' },
  { id: 7, type: 'ai_usage', description: 'AI Credit Usage - Lead Scoring', saleAmount: 0, amount: -45, date: '2 hours ago', status: 'completed' },
  { id: 8, type: 'ai_topup', description: 'AI Credits Top-Up', saleAmount: 0, amount: 500, date: '1 week ago', status: 'completed' },
];

const payoutSchedule = [
  { period: 'This Week', amount: '₹35,000', status: 'processing' },
  { period: 'Next Week', amount: '₹22,500', status: 'pending' },
  { period: 'Month End Bonus', amount: '₹10,000', status: 'eligible' },
];

const recentSales = [
  { id: 1, product: 'E-Commerce Platform', client: '[MASKED]', saleValue: 50000, commission: 10000, date: 'Today' },
  { id: 2, product: 'Hospital Management', client: '[MASKED]', saleValue: 125000, commission: 25000, date: 'Yesterday' },
  { id: 3, product: 'School ERP', client: '[MASKED]', saleValue: 75000, commission: 15000, date: '2 days ago' },
];

export const ResellerWallet = () => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Wallet Data with 20% commission
  const walletData = {
    totalBalance: 186500,
    pendingCommissions: 45000,
    totalEarned: 685000,
    thisMonth: 98500,
    commissionRate: 20, // Fixed 20%
    totalSalesValue: 3425000,
    withdrawableBalance: 141500,
    aiCreditsBalance: 455,
    aiCreditsUsed: 545,
  };

  const handleWithdrawal = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > walletData.withdrawableBalance) {
      toast.error('Amount exceeds withdrawable balance');
      return;
    }
    toast.success(`Withdrawal request of ₹${withdrawAmount} submitted for approval`);
    setWithdrawAmount('');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'commission':
        return <ArrowUpRight className="w-4 h-4 text-emerald-400" />;
      case 'withdrawal':
        return <ArrowDownLeft className="w-4 h-4 text-orange-400" />;
      case 'referral':
        return <Gift className="w-4 h-4 text-purple-400" />;
      case 'ai_usage':
        return <Brain className="w-4 h-4 text-pink-400" />;
      case 'ai_topup':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      default:
        return <DollarSign className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case 'commission':
        return 'bg-emerald-500/10';
      case 'withdrawal':
        return 'bg-orange-500/10';
      case 'referral':
        return 'bg-purple-500/10';
      case 'ai_usage':
        return 'bg-pink-500/10';
      case 'ai_topup':
        return 'bg-cyan-500/10';
      default:
        return 'bg-slate-500/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            Wallet & Commission
          </h2>
          <p className="text-slate-400 mt-1">Fixed 20% commission on every sale + AI Credits</p>
        </div>
        <Button 
          variant="outline" 
          className="border-emerald-500/30 text-emerald-400"
          onClick={() => toast.success('Statement downloaded successfully')}
        >
          <Download className="w-4 h-4 mr-2" />
          Download Statement
        </Button>
      </div>

      {/* Commission Rate Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Percent className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-400 font-semibold">Fixed 20% Commission Rate</p>
              <p className="text-sm text-slate-400">You earn 20% on every successful sale</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-400">20%</p>
            <p className="text-xs text-slate-500">Per Sale</p>
          </div>
        </div>
      </motion.div>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-slate-400">Total Balance</span>
          </div>
          <p className="text-2xl font-bold text-white">₹{walletData.totalBalance.toLocaleString()}</p>
          <p className="text-xs text-emerald-400 mt-1">+₹{walletData.thisMonth.toLocaleString()} this month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-slate-400">Total Earned</span>
          </div>
          <p className="text-2xl font-bold text-white">₹{walletData.totalEarned.toLocaleString()}</p>
          <p className="text-xs text-slate-500">Lifetime earnings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700"
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-slate-400">Pending</span>
          </div>
          <p className="text-2xl font-bold text-white">₹{walletData.pendingCommissions.toLocaleString()}</p>
          <p className="text-xs text-amber-400">Clearing soon</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700"
        >
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-slate-400">Sales Value</span>
          </div>
          <p className="text-2xl font-bold text-white">₹{(walletData.totalSalesValue / 100000).toFixed(1)}L</p>
          <p className="text-xs text-purple-400">Total sales generated</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-slate-400">AI Credits</span>
          </div>
          <p className="text-2xl font-bold text-white">₹{walletData.aiCreditsBalance}</p>
          <p className="text-xs text-purple-400">Prepaid balance</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="transactions">All Transactions</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Sales with Commission */}
            <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  Recent Sales & Commission (20%)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentSales.map((sale, index) => (
                  <motion.div
                    key={sale.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl bg-slate-700/30 border border-slate-600/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{sale.product}</p>
                          <p className="text-xs text-slate-400">{sale.client} • {sale.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">Sale: ₹{sale.saleValue.toLocaleString()}</p>
                        <p className="font-bold text-emerald-400">+₹{sale.commission.toLocaleString()}</p>
                        <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">20% Commission</Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Payout Schedule */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  Payout Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {payoutSchedule.map((payout, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                    <div>
                      <p className="text-sm font-medium text-white">{payout.period}</p>
                      <Badge variant="outline" className="mt-1 text-xs">{payout.status}</Badge>
                    </div>
                    <p className="font-bold text-white">{payout.amount}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Commission Calculator */}
          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/20">
                  <Percent className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Commission Calculator</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <p className="text-xs text-slate-400 mb-1">If Sale Value</p>
                      <p className="text-lg font-bold text-white">₹1,00,000</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-xs text-slate-400 mb-1">Commission Rate</p>
                        <p className="text-lg font-bold text-emerald-400">× 20%</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      <p className="text-xs text-emerald-400 mb-1">You Earn</p>
                      <p className="text-lg font-bold text-emerald-400">₹20,000</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commissions Tab */}
        <TabsContent value="commissions" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Commission History (20% Fixed Rate)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-sm text-slate-400">Transaction</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-400">Sale Value</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-400">Commission (20%)</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-400">Date</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.filter(t => t.type === 'commission').map((tx) => (
                      <tr key={tx.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                            <span className="text-white">{tx.description}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-400">₹{tx.saleAmount.toLocaleString()}</td>
                        <td className="py-3 px-4 text-emerald-400 font-bold">+₹{tx.amount.toLocaleString()}</td>
                        <td className="py-3 px-4 text-slate-500">{tx.date}</td>
                        <td className="py-3 px-4">
                          <Badge className={tx.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>
                            {tx.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Transactions Tab */}
        <TabsContent value="transactions" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                All Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {transactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="p-4 rounded-xl bg-slate-700/30 border border-slate-600/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeBg(tx.type)}`}>
                        {getTypeIcon(tx.type)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{tx.description}</p>
                        <p className="text-xs text-slate-400">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${tx.amount >= 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                        {tx.amount >= 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                      </p>
                      <Badge className={tx.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Withdraw Tab */}
        <TabsContent value="withdraw" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ArrowDownLeft className="w-5 h-5 text-orange-400" />
                  Withdraw Funds
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <p className="text-sm text-slate-400 mb-1">Withdrawable Balance</p>
                  <p className="text-3xl font-bold text-emerald-400">₹{walletData.withdrawableBalance.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Enter Amount</label>
                  <Input
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount to withdraw"
                    className="bg-slate-900 border-slate-700"
                    type="number"
                  />
                </div>
                <Button 
                  onClick={handleWithdrawal}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  disabled={!withdrawAmount}
                >
                  Request Withdrawal
                </Button>
                <p className="text-xs text-slate-500 text-center">
                  Withdrawals are processed within 2-3 business days
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  Withdrawal Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-700/30 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Minimum Withdrawal</p>
                    <p className="text-sm text-slate-400">₹5,000 minimum per request</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-700/30 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Processing Time</p>
                    <p className="text-sm text-slate-400">2-3 business days</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-700/30 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">No Fees</p>
                    <p className="text-sm text-slate-400">Zero withdrawal fees</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Monthly Target */}
      <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="font-semibold text-white">Monthly Commission Target</h3>
                <p className="text-sm text-slate-400">₹1,500 more to unlock Platinum tier bonus</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-emerald-400">85%</span>
          </div>
          <Progress value={85} className="h-3" />
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>₹0</span>
            <span className="text-emerald-400">Current: ₹{walletData.thisMonth.toLocaleString()}</span>
            <span>Target: ₹1,15,000</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};