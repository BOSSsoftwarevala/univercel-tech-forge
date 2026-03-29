import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Zap, CreditCard, TrendingUp, Clock, AlertTriangle,
  Sparkles, DollarSign, BarChart3, Wallet, ArrowUpRight,
  ArrowDownRight, RefreshCw, Shield, Plus, History, Eye,
  CheckCircle2, XCircle, Info, Cpu, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface AIUsageRecord {
  id: string;
  action: string;
  actualCost: number;
  billedAmount: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  tokens?: number;
}

interface TopUpPackage {
  id: string;
  credits: number;
  price: number;
  bonus?: number;
  popular?: boolean;
}

const ResellerAICredits = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TopUpPackage | null>(null);

  // AI Credits State (Prepaid System)
  const [aiCredits, setAiCredits] = useState({
    balance: 250.00,
    totalSpent: 1850.00,
    totalTopUps: 2100.00,
    pendingCharges: 12.50,
    markup: 2.0, // 2x markup (cost $10 = bill $20)
  });

  // Live AI Usage
  const [liveMetrics, setLiveMetrics] = useState({
    todayUsage: 45.00,
    weekUsage: 186.50,
    monthUsage: 892.00,
    requestsToday: 23,
    avgCostPerRequest: 1.96,
  });

  // Usage History
  const [usageHistory] = useState<AIUsageRecord[]>([
    { id: 'AI001', action: 'Lead Scoring Analysis', actualCost: 5.00, billedAmount: 10.00, timestamp: new Date(Date.now() - 300000), status: 'completed', tokens: 1250 },
    { id: 'AI002', action: 'Sales Pitch Generation', actualCost: 8.50, billedAmount: 17.00, timestamp: new Date(Date.now() - 900000), status: 'completed', tokens: 2100 },
    { id: 'AI003', action: 'Market Pulse Analysis', actualCost: 12.00, billedAmount: 24.00, timestamp: new Date(Date.now() - 1800000), status: 'completed', tokens: 3200 },
    { id: 'AI004', action: 'Competitor Intel Report', actualCost: 6.25, billedAmount: 12.50, timestamp: new Date(Date.now() - 3600000), status: 'pending', tokens: 1580 },
    { id: 'AI005', action: 'Commission Optimizer', actualCost: 3.50, billedAmount: 7.00, timestamp: new Date(Date.now() - 7200000), status: 'completed', tokens: 890 },
    { id: 'AI006', action: 'Territory Analyzer', actualCost: 4.75, billedAmount: 9.50, timestamp: new Date(Date.now() - 10800000), status: 'completed', tokens: 1200 },
  ]);

  // Top-Up Packages
  const topUpPackages: TopUpPackage[] = [
    { id: 'pkg1', credits: 50, price: 50 },
    { id: 'pkg2', credits: 100, price: 100, bonus: 10 },
    { id: 'pkg3', credits: 250, price: 250, bonus: 35, popular: true },
    { id: 'pkg4', credits: 500, price: 500, bonus: 100 },
    { id: 'pkg5', credits: 1000, price: 1000, bonus: 250 },
  ];

  const handleTopUp = (pkg: TopUpPackage) => {
    setSelectedPackage(pkg);
    setShowTopUpModal(true);
  };

  const confirmTopUp = () => {
    if (selectedPackage) {
      const totalCredits = selectedPackage.credits + (selectedPackage.bonus || 0);
      setAiCredits(prev => ({
        ...prev,
        balance: prev.balance + totalCredits,
        totalTopUps: prev.totalTopUps + selectedPackage.price,
      }));
      toast.success(`Added ₹${totalCredits} AI credits to your account!`);
      setShowTopUpModal(false);
      setSelectedPackage(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Brain className="w-6 h-6 text-white" />
            </div>
            AI Credits & Billing
          </h2>
          <p className="text-slate-400 mt-1">Prepaid AI system with 2x usage billing</p>
        </div>
        <Button 
          onClick={() => setShowTopUpModal(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Top Up Credits
        </Button>
      </div>

      {/* Important Notice */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30"
      >
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 mt-0.5" />
          <div>
            <p className="text-amber-400 font-medium">AI Usage Billing Policy</p>
            <p className="text-sm text-slate-400 mt-1">
              AI features are prepaid. For every <span className="text-emerald-400">$10 actual AI cost</span>, 
              you are billed <span className="text-purple-400">$20 from your credits</span> (2x markup). 
              Top up credits before using AI features.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Credit Balance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-slate-400">Credit Balance</span>
          </div>
          <p className="text-3xl font-bold text-white">₹{aiCredits.balance.toFixed(2)}</p>
          <p className="text-xs text-purple-400 mt-1">Available for AI usage</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-slate-400">Today's Usage</span>
          </div>
          <p className="text-3xl font-bold text-white">₹{liveMetrics.todayUsage.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-1">{liveMetrics.requestsToday} requests</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700"
        >
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-slate-400">This Month</span>
          </div>
          <p className="text-3xl font-bold text-white">₹{liveMetrics.monthUsage.toFixed(2)}</p>
          <p className="text-xs text-emerald-400 mt-1">+12% from last month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-xl bg-slate-800/50 border border-slate-700"
        >
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-slate-400">Avg Cost/Request</span>
          </div>
          <p className="text-3xl font-bold text-white">₹{liveMetrics.avgCostPerRequest.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-1">After 2x markup</p>
        </motion.div>
      </div>

      {/* Low Balance Warning */}
      {aiCredits.balance < 50 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
              <div>
                <p className="text-red-400 font-medium">Low Credit Balance!</p>
                <p className="text-sm text-slate-400">Top up now to continue using AI features</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowTopUpModal(true)}
              className="bg-red-500 hover:bg-red-600"
            >
              Top Up Now
            </Button>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage History</TabsTrigger>
          <TabsTrigger value="topup">Top Up Credits</TabsTrigger>
          <TabsTrigger value="billing">Billing Details</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Usage Breakdown */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  AI Usage Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Lead Scoring', usage: 45, color: 'cyan' },
                  { label: 'Pitch Generation', usage: 28, color: 'purple' },
                  { label: 'Market Analysis', usage: 15, color: 'amber' },
                  { label: 'Other Features', usage: 12, color: 'emerald' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-400">{item.label}</span>
                      <span className={`text-sm text-${item.color}-400`}>{item.usage}%</span>
                    </div>
                    <Progress value={item.usage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-cyan-400" />
                  Recent AI Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {usageHistory.slice(0, 4).map((record) => (
                  <div 
                    key={record.id}
                    className="p-3 rounded-lg bg-slate-700/30 border border-slate-600/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Brain className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{record.action}</p>
                        <p className="text-xs text-slate-500">{formatTime(record.timestamp)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-purple-400">-₹{record.billedAmount.toFixed(2)}</p>
                      <p className="text-xs text-slate-500">Cost: ₹{record.actualCost.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Billing Explanation */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-500/20">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">How AI Billing Works</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-cyan-500 text-black text-sm font-bold flex items-center justify-center">1</span>
                        <span className="text-cyan-400 font-medium">AI Processes</span>
                      </div>
                      <p className="text-sm text-slate-400">Actual AI cost: $10</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-black text-sm font-bold flex items-center justify-center">2</span>
                        <span className="text-amber-400 font-medium">2x Markup Applied</span>
                      </div>
                      <p className="text-sm text-slate-400">$10 × 2 = $20</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-500 text-black text-sm font-bold flex items-center justify-center">3</span>
                        <span className="text-emerald-400 font-medium">Credits Deducted</span>
                      </div>
                      <p className="text-sm text-slate-400">₹20 from balance</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage History Tab */}
        <TabsContent value="usage" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" />
                Complete Usage History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-sm text-slate-400">Action</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-400">Tokens</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-400">Actual Cost</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-400">Billed (2x)</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-400">Time</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usageHistory.map((record) => (
                      <tr key={record.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4 text-purple-400" />
                            <span className="text-white">{record.action}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{record.tokens?.toLocaleString()}</td>
                        <td className="py-3 px-4 text-slate-400">₹{record.actualCost.toFixed(2)}</td>
                        <td className="py-3 px-4 text-purple-400 font-bold">₹{record.billedAmount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-slate-500">{formatTime(record.timestamp)}</td>
                        <td className="py-3 px-4">{getStatusBadge(record.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Up Tab */}
        <TabsContent value="topup" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                Top Up AI Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {topUpPackages.map((pkg) => (
                  <motion.div
                    key={pkg.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-5 rounded-xl border cursor-pointer transition-all ${
                      pkg.popular 
                        ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/10 border-purple-500/50' 
                        : 'bg-slate-700/30 border-slate-600/50 hover:border-purple-500/30'
                    }`}
                    onClick={() => handleTopUp(pkg)}
                  >
                    {pkg.popular && (
                      <Badge className="bg-purple-500 text-white mb-3">Most Popular</Badge>
                    )}
                    <p className="text-3xl font-bold text-white mb-1">₹{pkg.credits}</p>
                    {pkg.bonus && (
                      <p className="text-sm text-emerald-400 mb-2">+₹{pkg.bonus} bonus!</p>
                    )}
                    <p className="text-sm text-slate-400 mb-4">
                      {pkg.bonus ? `Get ₹${pkg.credits + pkg.bonus} total` : `₹${pkg.credits} credits`}
                    </p>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500" size="sm">
                      Buy Now
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Details Tab */}
        <TabsContent value="billing" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  Billing Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-700/30 flex items-center justify-between">
                  <span className="text-slate-400">Total Top-Ups</span>
                  <span className="text-white font-bold">₹{aiCredits.totalTopUps.toFixed(2)}</span>
                </div>
                <div className="p-4 rounded-lg bg-slate-700/30 flex items-center justify-between">
                  <span className="text-slate-400">Total Spent</span>
                  <span className="text-purple-400 font-bold">₹{aiCredits.totalSpent.toFixed(2)}</span>
                </div>
                <div className="p-4 rounded-lg bg-slate-700/30 flex items-center justify-between">
                  <span className="text-slate-400">Pending Charges</span>
                  <span className="text-amber-400 font-bold">₹{aiCredits.pendingCharges.toFixed(2)}</span>
                </div>
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                  <span className="text-emerald-400">Current Balance</span>
                  <span className="text-emerald-400 font-bold text-xl">₹{aiCredits.balance.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  Billing Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-700/30 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Prepaid System</p>
                    <p className="text-sm text-slate-400">Add credits before using AI features</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-700/30 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">2x Markup Billing</p>
                    <p className="text-sm text-slate-400">$10 AI cost = $20 billed from credits</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-700/30 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">No Expiry</p>
                    <p className="text-sm text-slate-400">Credits never expire</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-700/30 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Bonus Credits</p>
                    <p className="text-sm text-slate-400">Extra credits on larger packages</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Top Up Modal */}
      <AnimatePresence>
        {showTopUpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTopUpModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-slate-900 border border-purple-500/30 p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-400" />
                Confirm Top Up
              </h3>
              
              {selectedPackage ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                    <p className="text-2xl font-bold text-white mb-1">₹{selectedPackage.credits}</p>
                    {selectedPackage.bonus && (
                      <p className="text-emerald-400">+₹{selectedPackage.bonus} bonus credits</p>
                    )}
                    <p className="text-slate-400 mt-2">
                      Total: ₹{selectedPackage.credits + (selectedPackage.bonus || 0)} credits
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowTopUpModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                      onClick={confirmTopUp}
                    >
                      Confirm Payment
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {topUpPackages.slice(0, 4).map((pkg) => (
                    <div
                      key={pkg.id}
                      className="p-4 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer hover:border-purple-500/50 transition-all"
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      <p className="text-xl font-bold text-white">₹{pkg.credits}</p>
                      {pkg.bonus && <p className="text-xs text-emerald-400">+₹{pkg.bonus} bonus</p>}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResellerAICredits;
