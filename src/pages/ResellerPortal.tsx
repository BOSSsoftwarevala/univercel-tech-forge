import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Wallet, CreditCard, Bell, 
  HeadphonesIcon, Settings, LogOut, Shield, ChevronLeft, 
  ChevronRight, User, TrendingUp, Target, Clock, 
  CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight,
  IndianRupee, Lock, FileText, Banknote, AlertTriangle,
  BadgeCheck, XCircle, MessageSquare, Eye
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import softwareValaLogo from '@/assets/software-vala-logo.png';

// Reseller-only sidebar items
const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: Users, badge: 8 },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'commissions', label: 'Commissions', icon: CreditCard },
  { id: 'payouts', label: 'Payouts', icon: Banknote },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3 },
  { id: 'tickets', label: 'Support Tickets', icon: HeadphonesIcon },
  { id: 'kyc', label: 'KYC Status', icon: Shield },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const ResellerPortal = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  useEffect(() => {
    // Simulate initial data load
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  // Mock data - in production, fetch from Supabase with reseller_id filter
  const dashboardData = {
    activeLeads: { value: 24, change: 5, trend: 'up' as const },
    walletBalance: { value: 45200, change: 8500, trend: 'up' as const, lastUpdated: '2 min ago' },
    conversionRate: { value: 32, change: 4, trend: 'up' as const },
    monthlyTarget: { value: 72, target: 100 },
  };

  const recentLeads = [
    { id: '1', name: 'Rajesh Kumar', company: 'Tech Solutions Pvt', score: 85, status: 'new', time: '2h ago' },
    { id: '2', name: 'Priya Sharma', company: 'Global Enterprises', score: 72, status: 'contacted', time: '4h ago' },
    { id: '3', name: 'Amit Verma', company: 'StartUp India Co', score: 90, status: 'converted', time: '6h ago' },
    { id: '4', name: 'Sneha Patel', company: 'Digital First Ltd', score: 68, status: 'new', time: '1d ago' },
  ];

  const commissions = {
    totalEarned: 125000,
    pending: 15000,
    approved: 8500,
    onHold: 3000,
  };

  const payouts = [
    { id: '1', amount: 25000, status: 'approved', date: '2024-01-15' },
    { id: '2', amount: 15000, status: 'pending', date: '2024-01-18' },
    { id: '3', amount: 10000, status: 'rejected', date: '2024-01-10', reason: 'KYC documents expired' },
  ];

  const kycStatus = {
    status: 'verified' as 'pending' | 'verified' | 'rejected',
    verifiedAt: '2024-01-01',
    reason: null,
  };

  const limits = {
    daily: { current: 15000, max: 50000 },
    monthly: { current: 45000, max: 200000 },
  };

  const notifications = [
    { id: '1', type: 'lead', message: 'New lead assigned: ABC Corp', time: '10m ago', urgent: true },
    { id: '2', type: 'commission', message: 'Commission credited: ₹2,500', time: '1h ago', urgent: false },
    { id: '3', type: 'payout', message: 'Payout approved: ₹15,000', time: '3h ago', urgent: false },
    { id: '4', type: 'security', message: 'Login from new device detected', time: '1d ago', urgent: true },
  ];

  const securityInfo = {
    lastLogin: '2024-01-18 14:30 IST',
    lastWalletActivity: '2024-01-18 12:15 IST',
    lastPayoutAction: '2024-01-15 16:45 IST',
    lastPasswordChange: '2024-01-01 10:00 IST',
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      contacted: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      converted: 'bg-green-500/20 text-green-400 border-green-500/30',
      pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      approved: 'bg-green-500/20 text-green-400 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
      verified: 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return styles[status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const canRequestPayout = kycStatus.status === 'verified' && limits.daily.current < limits.daily.max;

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Active Leads */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-slate-900/60 backdrop-blur-xl border-teal-500/20 hover:border-teal-500/40 transition-all rounded-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-5 relative">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20">
                  <Users className="w-5 h-5 text-teal-400" />
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  +{dashboardData.activeLeads.change} today
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-white">{dashboardData.activeLeads.value}</p>
                <p className="text-sm text-slate-400 mt-1">Active Leads</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Wallet Balance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-slate-900/60 backdrop-blur-xl border-cyan-500/20 hover:border-cyan-500/40 transition-all rounded-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-5 relative">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <Wallet className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  +₹{dashboardData.walletBalance.change.toLocaleString()}
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-white">₹{dashboardData.walletBalance.value.toLocaleString()}</p>
                <p className="text-sm text-slate-400 mt-1">Wallet Balance</p>
                <p className="text-xs text-slate-500 mt-0.5">Updated {dashboardData.walletBalance.lastUpdated}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Conversion Rate */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-slate-900/60 backdrop-blur-xl border-emerald-500/20 hover:border-emerald-500/40 transition-all rounded-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-5 relative">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  +{dashboardData.conversionRate.change}%
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-white">{dashboardData.conversionRate.value}%</p>
                <p className="text-sm text-slate-400 mt-1">Conversion Rate</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Target */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-slate-900/60 backdrop-blur-xl border-amber-500/20 hover:border-amber-500/40 transition-all rounded-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-5 relative">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <Target className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-xs text-amber-400">{dashboardData.monthlyTarget.value}% complete</span>
              </div>
              <div className="mt-4">
                <div className="flex items-end gap-1">
                  <p className="text-3xl font-bold text-white">{dashboardData.monthlyTarget.value}</p>
                  <p className="text-lg text-slate-500 mb-1">/ {dashboardData.monthlyTarget.target}</p>
                </div>
                <p className="text-sm text-slate-400 mt-1">Monthly Target</p>
                <Progress value={dashboardData.monthlyTarget.value} className="mt-2 h-1.5 bg-slate-800" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Leads Panel */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="bg-slate-900/60 backdrop-blur-xl border-teal-500/20 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-400" />
              Recent Leads
              <Badge variant="outline" className="ml-2 bg-teal-500/10 text-teal-400 border-teal-500/30">
                Your Leads Only
              </Badge>
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/10">
              View All <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLeads.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No leads yet</p>
                  <p className="text-sm text-slate-500">Your assigned leads will appear here</p>
                </div>
              ) : (
                recentLeads.map((lead, index) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-teal-500/30 hover:bg-slate-800/60 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-500/30 to-cyan-500/30 flex items-center justify-center border border-teal-500/20">
                        <span className="text-teal-300 font-semibold">{lead.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{lead.name}</p>
                        <p className="text-sm text-slate-400">{lead.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <Badge className={`${getStatusBadge(lead.status)} border`}>
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-teal-400">{lead.score}</p>
                        <p className="text-xs text-slate-500">Score</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">{lead.time}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-teal-400 hover:text-teal-300 hover:bg-teal-500/10">
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wallet & Commission Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card className="bg-slate-900/60 backdrop-blur-xl border-cyan-500/20 rounded-2xl h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cyan-400" />
                Wallet & Commissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20">
                  <p className="text-sm text-slate-400">Total Earned</p>
                  <p className="text-xl font-bold text-green-400">₹{commissions.totalEarned.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
                  <p className="text-sm text-slate-400">Pending</p>
                  <p className="text-xl font-bold text-amber-400">₹{commissions.pending.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/5 border border-cyan-500/20">
                  <p className="text-sm text-slate-400">Approved</p>
                  <p className="text-xl font-bold text-cyan-400">₹{commissions.approved.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/5 border border-red-500/20">
                  <p className="text-sm text-slate-400">On Hold</p>
                  <p className="text-xl font-bold text-red-400">₹{commissions.onHold.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payout Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Card className="bg-slate-900/60 backdrop-blur-xl border-emerald-500/20 rounded-2xl h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Banknote className="w-5 h-5 text-emerald-400" />
                Payouts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Limits */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-slate-400">Daily Limit</p>
                    <p className="text-xs text-slate-500">₹{limits.daily.current.toLocaleString()} / ₹{limits.daily.max.toLocaleString()}</p>
                  </div>
                  <Progress value={(limits.daily.current / limits.daily.max) * 100} className="h-1.5 bg-slate-700" />
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-slate-400">Monthly Limit</p>
                    <p className="text-xs text-slate-500">₹{limits.monthly.current.toLocaleString()} / ₹{limits.monthly.max.toLocaleString()}</p>
                  </div>
                  <Progress value={(limits.monthly.current / limits.monthly.max) * 100} className="h-1.5 bg-slate-700" />
                </div>
              </div>

              {/* Request Payout Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button 
                        className={`w-full ${canRequestPayout 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white' 
                          : 'bg-slate-700 text-slate-400 cursor-not-allowed'}`}
                        disabled={!canRequestPayout}
                      >
                        <Banknote className="w-4 h-4 mr-2" />
                        Request Payout
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {!canRequestPayout && (
                    <TooltipContent className="bg-slate-800 border-slate-700">
                      <p>{kycStatus.status !== 'verified' ? 'Complete KYC verification first' : 'Daily limit exceeded'}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>

              {/* Recent Payouts */}
              <div className="space-y-2">
                {payouts.length === 0 ? (
                  <div className="text-center py-4">
                    <Banknote className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">No payouts yet</p>
                  </div>
                ) : (
                  payouts.map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                      <div>
                        <p className="text-white font-medium">₹{payout.amount.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">{payout.date}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusBadge(payout.status)} border`}>
                          {payout.status === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {payout.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                          {payout.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                          {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                        </Badge>
                        {payout.reason && <p className="text-xs text-red-400 mt-1">{payout.reason}</p>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KYC Status Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          <Card className={`bg-slate-900/60 backdrop-blur-xl rounded-2xl h-full ${
            kycStatus.status === 'verified' ? 'border-green-500/20' : 
            kycStatus.status === 'rejected' ? 'border-red-500/20' : 'border-amber-500/20'
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-400" />
                KYC Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl ${
                  kycStatus.status === 'verified' ? 'bg-green-500/10 border border-green-500/30' :
                  kycStatus.status === 'rejected' ? 'bg-red-500/10 border border-red-500/30' :
                  'bg-amber-500/10 border border-amber-500/30'
                }`}>
                  {kycStatus.status === 'verified' ? (
                    <BadgeCheck className="w-8 h-8 text-green-400" />
                  ) : kycStatus.status === 'rejected' ? (
                    <XCircle className="w-8 h-8 text-red-400" />
                  ) : (
                    <Clock className="w-8 h-8 text-amber-400" />
                  )}
                </div>
                <div>
                  <Badge className={`${getStatusBadge(kycStatus.status)} border mb-1`}>
                    {kycStatus.status.charAt(0).toUpperCase() + kycStatus.status.slice(1)}
                  </Badge>
                  {kycStatus.verifiedAt && (
                    <p className="text-xs text-slate-500">Verified on {kycStatus.verifiedAt}</p>
                  )}
                  {kycStatus.reason && (
                    <p className="text-xs text-red-400 mt-1">{kycStatus.reason}</p>
                  )}
                </div>
              </div>
              {kycStatus.status !== 'verified' && (
                <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-amber-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-400 font-medium">Payouts Locked</p>
                      <p className="text-xs text-slate-400">Complete KYC to unlock payouts</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
          <Card className="bg-slate-900/60 backdrop-blur-xl border-teal-500/20 rounded-2xl h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-teal-400" />
                Notifications
                {notifications.filter(n => n.urgent).length > 0 && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 border">
                    {notifications.filter(n => n.urgent).length} urgent
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                    notif.urgent 
                      ? 'bg-red-500/10 border-red-500/30' 
                      : 'bg-slate-800/40 border-slate-700/50'
                  }`}>
                    <div className={`p-1.5 rounded-lg ${notif.urgent ? 'bg-red-500/20' : 'bg-teal-500/20'}`}>
                      {notif.urgent ? (
                        <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{notif.message}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {notif.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security & Trust */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
          <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-500/20 rounded-2xl h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-slate-400" />
                Security Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Last Login</span>
                  <span className="text-slate-300 font-mono text-xs">{securityInfo.lastLogin}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Last Wallet Activity</span>
                  <span className="text-slate-300 font-mono text-xs">{securityInfo.lastWalletActivity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Last Payout</span>
                  <span className="text-slate-300 font-mono text-xs">{securityInfo.lastPayoutAction}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Password Changed</span>
                  <span className="text-slate-300 font-mono text-xs">{securityInfo.lastPasswordChange}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );

  const renderPlaceholder = (title: string, icon: React.ReactNode) => (
    <div className="flex flex-col items-center justify-center h-96">
      <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 mb-4">
        {icon}
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
      <p className="text-slate-400">This section is coming soon</p>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl bg-slate-800/50" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-2xl bg-slate-800/50" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-48 rounded-2xl bg-slate-800/50" />
            <Skeleton className="h-48 rounded-2xl bg-slate-800/50" />
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'leads': return renderPlaceholder('Leads', <Users className="w-12 h-12 text-teal-400" />);
      case 'wallet': return renderPlaceholder('Wallet', <Wallet className="w-12 h-12 text-cyan-400" />);
      case 'commissions': return renderPlaceholder('Commissions', <CreditCard className="w-12 h-12 text-emerald-400" />);
      case 'payouts': return renderPlaceholder('Payouts', <Banknote className="w-12 h-12 text-green-400" />);
      case 'notifications': return renderPlaceholder('Notifications', <Bell className="w-12 h-12 text-amber-400" />);
      case 'tickets': return renderPlaceholder('Support Tickets', <HeadphonesIcon className="w-12 h-12 text-purple-400" />);
      case 'kyc': return renderPlaceholder('KYC Status', <Shield className="w-12 h-12 text-teal-400" />);
      case 'settings': return renderPlaceholder('Settings', <Settings className="w-12 h-12 text-slate-400" />);
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(220,50%,5%)] via-[hsl(200,50%,8%)] to-[hsl(220,50%,5%)] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.08),transparent_50%)]" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="grid-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="currentColor" className="text-teal-400" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-teal-500/20 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <img src={softwareValaLogo} alt="Software Vala" className="h-9 w-auto object-contain" />
          <div className="h-6 w-px bg-slate-700" />
          <div>
            <p className="text-sm text-white font-medium">Welcome back, Reseller</p>
            <p className="text-xs text-slate-400">Grade 3 Partner</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Role Badge */}
          <Badge className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-400 border-teal-500/30 border px-3 py-1">
            <User className="w-3 h-3 mr-1.5" />
            ROLE: RESELLER
          </Badge>
          
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-teal-400 hover:border-teal-500/30 transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">3</span>
          </motion.button>
          
          {/* Profile Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center cursor-pointer"
          >
            <span className="text-white font-semibold text-sm">R</span>
          </motion.div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Left Sidebar */}
        <aside className={`fixed left-0 top-16 bottom-0 ${collapsed ? 'w-20' : 'w-64'} bg-slate-900/60 backdrop-blur-xl border-r border-teal-500/20 z-40 transition-all duration-300`}>
          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-6 w-6 h-6 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Navigation */}
          <nav className="p-4 space-y-1.5 mt-4">
            {sidebarItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                whileHover={{ x: collapsed ? 0 : 4 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/10 border border-teal-500/40 text-teal-400 shadow-lg shadow-teal-500/10'
                    : 'hover:bg-slate-800/50 text-slate-400 hover:text-teal-400 border border-transparent'
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${activeSection === item.id ? 'text-teal-400' : ''}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-medium flex-1 text-left text-sm"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!collapsed && item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-teal-500/20 text-teal-400 border border-teal-500/30">
                    {item.badge}
                  </span>
                )}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-teal-400"
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Logout */}
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all ${collapsed ? 'justify-center' : ''}`}
            >
              <LogOut className="w-5 h-5" />
              {!collapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 ${collapsed ? 'ml-20' : 'ml-64'} p-6 min-h-screen transition-all duration-300`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ResellerPortal;
