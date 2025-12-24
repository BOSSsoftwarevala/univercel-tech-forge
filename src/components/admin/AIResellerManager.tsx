import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Users, Activity, TrendingUp, Award, Eye, Shield,
  Zap, Target, Clock, AlertTriangle, CheckCircle2, Star,
  DollarSign, Percent, BarChart3, Sparkles, UserCheck,
  UserX, RefreshCw, MessageSquare, Calendar, Filter, Search,
  ChevronDown, ArrowUpRight, ArrowDownRight, Bell, XCircle,
  CheckCheck, FileText, Gavel, Send, Wallet, CreditCard,
  MapPin, Phone, Mail, Plus, Settings, Ban, Gift
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Reseller {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  territory: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  joinDate: string;
  totalSales: number;
  totalCommission: number;
  commissionRate: number;
  aiCreditsBalance: number;
  aiCreditsUsed: number;
  leadsAssigned: number;
  leadsConverted: number;
  conversionRate: number;
  rating: number;
  aiScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  trend: 'up' | 'down' | 'stable';
  lastActive: string;
}

// SECURITY: 'withdrawal' type REMOVED from PendingApproval - Reseller Manager cannot approve payouts (Step 9 compliance)
interface PendingApproval {
  id: string;
  type: 'registration' | 'territory_change' | 'tier_upgrade' | 'ai_topup' | 'suspension_appeal';
  title: string;
  description: string;
  reseller: string;
  requestedAt: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected';
  amount?: number;
  aiRecommendation?: string;
}

const AIResellerManager = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [approvalNote, setApprovalNote] = useState('');

  // Live Metrics
  const [liveMetrics, setLiveMetrics] = useState({
    totalResellers: 156,
    activeToday: 89,
    totalSalesValue: 4850000,
    totalCommissionsPaid: 970000,
    aiCreditsConsumed: 45600,
    pendingApprovals: 8,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        ...prev,
        activeToday: Math.max(70, Math.min(100, prev.activeToday + Math.floor((Math.random() - 0.5) * 5))),
        totalSalesValue: prev.totalSalesValue + Math.floor(Math.random() * 10000),
        aiCreditsConsumed: prev.aiCreditsConsumed + Math.floor(Math.random() * 50),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Reseller Data
  const [resellers] = useState<Reseller[]>([
    {
      id: 'RSL001', name: 'Rajesh Enterprises', avatar: 'RE', email: 'rajesh@enterprise.com',
      phone: '+91 98765 43210', territory: 'Mumbai West', status: 'active', tier: 'platinum',
      joinDate: '2024-01-15', totalSales: 1250000, totalCommission: 250000, commissionRate: 20,
      aiCreditsBalance: 850, aiCreditsUsed: 1250, leadsAssigned: 45, leadsConverted: 38,
      conversionRate: 84, rating: 4.9, aiScore: 95, riskLevel: 'low', trend: 'up', lastActive: '2 min ago'
    },
    {
      id: 'RSL002', name: 'Sharma Solutions', avatar: 'SS', email: 'sharma@solutions.in',
      phone: '+91 87654 32109', territory: 'Delhi NCR', status: 'active', tier: 'gold',
      joinDate: '2024-02-20', totalSales: 890000, totalCommission: 178000, commissionRate: 20,
      aiCreditsBalance: 320, aiCreditsUsed: 680, leadsAssigned: 32, leadsConverted: 24,
      conversionRate: 75, rating: 4.7, aiScore: 88, riskLevel: 'low', trend: 'up', lastActive: '15 min ago'
    },
    {
      id: 'RSL003', name: 'Tech Partners Pune', avatar: 'TP', email: 'tech@partners.com',
      phone: '+91 76543 21098', territory: 'Pune', status: 'active', tier: 'silver',
      joinDate: '2024-03-10', totalSales: 450000, totalCommission: 90000, commissionRate: 20,
      aiCreditsBalance: 150, aiCreditsUsed: 350, leadsAssigned: 28, leadsConverted: 18,
      conversionRate: 64, rating: 4.4, aiScore: 72, riskLevel: 'medium', trend: 'stable', lastActive: '1 hour ago'
    },
    {
      id: 'RSL004', name: 'Digital First', avatar: 'DF', email: 'info@digitalfirst.in',
      phone: '+91 65432 10987', territory: 'Bangalore', status: 'suspended', tier: 'bronze',
      joinDate: '2024-04-05', totalSales: 120000, totalCommission: 24000, commissionRate: 20,
      aiCreditsBalance: 0, aiCreditsUsed: 200, leadsAssigned: 15, leadsConverted: 6,
      conversionRate: 40, rating: 3.2, aiScore: 45, riskLevel: 'high', trend: 'down', lastActive: '3 days ago'
    },
    {
      id: 'RSL005', name: 'Growth Hub', avatar: 'GH', email: 'hello@growthhub.com',
      phone: '+91 54321 09876', territory: 'Chennai', status: 'pending', tier: 'bronze',
      joinDate: '2024-06-01', totalSales: 0, totalCommission: 0, commissionRate: 20,
      aiCreditsBalance: 100, aiCreditsUsed: 0, leadsAssigned: 0, leadsConverted: 0,
      conversionRate: 0, rating: 0, aiScore: 50, riskLevel: 'medium', trend: 'stable', lastActive: 'Never'
    },
  ]);

  // SECURITY: Pending Approvals - 'withdrawal' type REMOVED per Step 9 (Commission Separation)
  // Reseller Manager CANNOT: Edit commissions, Approve payouts, Trigger withdrawals
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([
    {
      id: 'APR001', type: 'registration', title: 'New Reseller Registration',
      description: 'Growth Hub from Chennai requests to join as reseller',
      reseller: 'Growth Hub', requestedAt: new Date(Date.now() - 300000),
      priority: 'medium', status: 'pending',
      aiRecommendation: 'Recommended - Territory has growth potential'
    },
    // SECURITY: Withdrawal approval REMOVED - handled by Finance Manager only
    {
      id: 'APR003', type: 'tier_upgrade', title: 'Tier Upgrade Request',
      description: 'Sharma Solutions requests upgrade to Platinum tier',
      reseller: 'Sharma Solutions', requestedAt: new Date(Date.now() - 1800000),
      priority: 'medium', status: 'pending',
      aiRecommendation: 'Consider - 2 more months of performance needed'
    },
    {
      id: 'APR004', type: 'suspension_appeal', title: 'Suspension Appeal',
      description: 'Digital First appeals against account suspension',
      reseller: 'Digital First', requestedAt: new Date(Date.now() - 7200000),
      priority: 'high', status: 'pending',
      aiRecommendation: 'Review carefully - Multiple policy violations'
    },
    {
      id: 'APR005', type: 'ai_topup', title: 'AI Credits Top-Up Request',
      description: 'Tech Partners Pune requests ₹500 AI credits',
      reseller: 'Tech Partners Pune', requestedAt: new Date(Date.now() - 3600000),
      priority: 'low', status: 'pending', amount: 500,
      aiRecommendation: 'Auto-approve eligible - Payment verified'
    },
  ]);

  const handleApprove = (approval: PendingApproval) => {
    setPendingApprovals(prev => 
      prev.map(a => a.id === approval.id ? { ...a, status: 'approved' as const } : a)
    );
    setShowApprovalModal(false);
    setSelectedApproval(null);
    setApprovalNote('');
    toast.success(`Approved: ${approval.title}`);
  };

  const handleReject = (approval: PendingApproval) => {
    setPendingApprovals(prev => 
      prev.map(a => a.id === approval.id ? { ...a, status: 'rejected' as const } : a)
    );
    setShowApprovalModal(false);
    setSelectedApproval(null);
    setApprovalNote('');
    toast.error(`Rejected: ${approval.title}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>;
      case 'inactive': return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Inactive</Badge>;
      case 'suspended': return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Suspended</Badge>;
      case 'pending': return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pending</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'platinum': return <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Platinum</Badge>;
      case 'gold': return <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">Gold</Badge>;
      case 'silver': return <Badge className="bg-gradient-to-r from-slate-400 to-slate-500 text-white">Silver</Badge>;
      case 'bronze': return <Badge className="bg-gradient-to-r from-orange-700 to-orange-800 text-white">Bronze</Badge>;
      default: return <Badge variant="outline">{tier}</Badge>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low': return <Badge className="bg-emerald-500/20 text-emerald-400">Low Risk</Badge>;
      case 'medium': return <Badge className="bg-amber-500/20 text-amber-400">Medium Risk</Badge>;
      case 'high': return <Badge className="bg-red-500/20 text-red-400">High Risk</Badge>;
      default: return <Badge variant="outline">{risk}</Badge>;
    }
  };

  // SECURITY: 'withdrawal' type REMOVED from approval badge types - Finance Manager only
  const getApprovalTypeBadge = (type: string) => {
    const types: Record<string, { color: string; label: string }> = {
      registration: { color: 'cyan', label: 'Registration' },
      // SECURITY: 'withdrawal' REMOVED - Reseller Manager cannot approve payouts
      territory_change: { color: 'purple', label: 'Territory' },
      tier_upgrade: { color: 'amber', label: 'Tier Upgrade' },
      ai_topup: { color: 'pink', label: 'AI Credits' },
      suspension_appeal: { color: 'red', label: 'Appeal' },
    };
    const t = types[type] || { color: 'slate', label: type };
    return <Badge className={`bg-${t.color}-500/20 text-${t.color}-400 border-${t.color}-500/30`}>{t.label}</Badge>;
  };

  const pendingCount = pendingApprovals.filter(a => a.status === 'pending').length;

  const filteredResellers = resellers.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.territory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
              <Users className="w-6 h-6 text-white" />
            </div>
            AI Reseller Manager
          </h1>
          <p className="text-slate-400 mt-1">20% fixed commission • AI billing with 2x markup</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className={`border-slate-700 relative ${pendingCount > 0 ? 'border-amber-500/50' : ''}`}
            onClick={() => setActiveTab("approvals")}
          >
            <Gavel className="w-4 h-4 mr-2" />
            Pending Approvals
            {pendingCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                {pendingCount}
              </span>
            )}
          </Button>
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-500">
            <Plus className="w-4 h-4 mr-2" />
            Add Reseller
          </Button>
        </div>
      </div>

      {/* Live Metrics Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-emerald-500/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-medium">Live Network Status</span>
          </div>
          <div className="flex gap-8">
            {[
              { label: "Total Resellers", value: liveMetrics.totalResellers, icon: Users, color: "emerald" },
              { label: "Active Today", value: liveMetrics.activeToday, icon: UserCheck, color: "cyan" },
              { label: "Total Sales", value: `₹${(liveMetrics.totalSalesValue / 100000).toFixed(1)}L`, icon: DollarSign, color: "amber" },
              { label: "Commissions Paid", value: `₹${(liveMetrics.totalCommissionsPaid / 100000).toFixed(1)}L`, icon: Wallet, color: "purple" },
              { label: "AI Credits Used", value: `₹${(liveMetrics.aiCreditsConsumed / 1000).toFixed(1)}K`, icon: Brain, color: "pink" },
            ].map((metric, i) => (
              <div key={i} className="flex items-center gap-2">
                <metric.icon className={`w-4 h-4 text-${metric.color}-400`} />
                <span className="text-sm text-slate-400">{metric.label}:</span>
                <span className={`font-bold text-${metric.color}-400`}>{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Commission Rate Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Percent className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-emerald-400 font-semibold">Fixed 20% Commission Rate for All Resellers</p>
              <p className="text-sm text-slate-400">AI usage billed at 2x markup (₹10 cost = ₹20 billed)</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">20%</p>
              <p className="text-xs text-slate-500">Commission</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">2x</p>
              <p className="text-xs text-slate-500">AI Markup</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="approvals" className="relative">
            Approvals
            {pendingCount > 0 && (
              <span className="ml-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="resellers">All Resellers</TabsTrigger>
          <TabsTrigger value="performance">Performance AI</TabsTrigger>
          <TabsTrigger value="ai-billing">AI Billing</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Pending Alert */}
          {pendingCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-amber-400 animate-bounce" />
                  <div>
                    <p className="text-amber-400 font-medium">{pendingCount} Actions Pending Your Approval</p>
                    <p className="text-sm text-slate-400">Registrations, withdrawals, and tier upgrades</p>
                  </div>
                </div>
                <Button onClick={() => setActiveTab("approvals")} className="bg-amber-500 hover:bg-amber-600 text-black">
                  Review Now
                </Button>
              </div>
            </motion.div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Active Resellers", value: resellers.filter(r => r.status === 'active').length, icon: UserCheck, color: "emerald" },
              { label: "Platinum Tier", value: resellers.filter(r => r.tier === 'platinum').length, icon: Award, color: "purple" },
              { label: "Avg Conversion", value: "68%", icon: Target, color: "cyan" },
              { label: "Pending Actions", value: pendingCount, icon: Gavel, color: pendingCount > 0 ? "red" : "slate" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-xl bg-slate-800/50 border border-slate-700"
              >
                <stat.icon className={`w-6 h-6 text-${stat.color}-400 mb-3`} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <span className="text-sm text-slate-400">{stat.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Top Performers */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Top Performing Resellers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {resellers.filter(r => r.status === 'active').slice(0, 3).map((reseller, i) => (
                  <motion.div
                    key={reseller.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-5 rounded-xl border ${
                      i === 0 ? "bg-amber-500/10 border-amber-500/30" :
                      i === 1 ? "bg-slate-500/10 border-slate-400/30" :
                      "bg-orange-900/20 border-orange-700/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                        i === 0 ? "bg-gradient-to-br from-amber-400 to-amber-600" :
                        i === 1 ? "bg-gradient-to-br from-slate-400 to-slate-600" :
                        "bg-gradient-to-br from-orange-700 to-orange-900"
                      }`}>
                        {reseller.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{reseller.name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-sm text-amber-400">{reseller.rating}</span>
                          {getTierBadge(reseller.tier)}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-slate-800/50">
                        <p className="text-lg font-bold text-emerald-400">₹{(reseller.totalSales / 100000).toFixed(1)}L</p>
                        <p className="text-xs text-slate-500">Sales</p>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-800/50">
                        <p className="text-lg font-bold text-purple-400">{reseller.conversionRate}%</p>
                        <p className="text-xs text-slate-500">Conversion</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Gavel className="w-5 h-5 text-amber-400" />
                Pending Approvals ({pendingCount})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingApprovals.filter(a => a.status === 'pending').length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">All Caught Up!</h3>
                  <p className="text-slate-400">No pending approvals.</p>
                </div>
              ) : (
                pendingApprovals.filter(a => a.status === 'pending').map((approval, i) => (
                  <motion.div
                    key={approval.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-5 rounded-xl border ${
                      approval.priority === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                      approval.priority === 'high' ? 'bg-orange-500/10 border-orange-500/30' :
                      'bg-slate-700/30 border-slate-600/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getApprovalTypeBadge(approval.type)}
                          <Badge className={
                            approval.priority === 'critical' ? 'bg-red-500 text-white animate-pulse' :
                            approval.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-slate-500/20 text-slate-400'
                          }>{approval.priority}</Badge>
                        </div>
                        <h4 className="text-lg font-semibold text-white mb-1">{approval.title}</h4>
                        <p className="text-sm text-slate-400 mb-3">{approval.description}</p>
                        
                        {approval.amount && (
                          <p className="text-emerald-400 font-bold mb-3">Amount: ₹{approval.amount.toLocaleString()}</p>
                        )}

                        {approval.aiRecommendation && (
                          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                            <div className="flex items-center gap-2 mb-1">
                              <Brain className="w-4 h-4 text-purple-400" />
                              <span className="text-xs text-purple-400 font-medium">AI Recommendation</span>
                            </div>
                            <p className="text-sm text-slate-300">{approval.aiRecommendation}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-6">
                        <Button
                          onClick={() => handleApprove(approval)}
                          className="bg-emerald-500 hover:bg-emerald-600"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReject(approval)}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Resellers Tab */}
        <TabsContent value="resellers" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  All Resellers
                </CardTitle>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10 w-64 bg-slate-900 border-slate-700"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredResellers.map((reseller, i) => (
                <motion.div
                  key={reseller.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-xl bg-slate-700/30 border border-slate-600/50"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 min-w-[220px]">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center font-bold text-white text-lg">
                          {reseller.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${
                          reseller.status === "active" ? "bg-emerald-500" :
                          reseller.status === "pending" ? "bg-amber-500" : "bg-red-500"
                        }`} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{reseller.name}</p>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(reseller.status)}
                          {getTierBadge(reseller.tier)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-400 min-w-[120px]">
                      <MapPin className="w-4 h-4" />
                      {reseller.territory}
                    </div>

                    <div className="grid grid-cols-4 gap-4 flex-1 text-center">
                      <div>
                        <p className="text-xs text-slate-400">Sales</p>
                        <p className="text-lg font-bold text-emerald-400">₹{(reseller.totalSales / 100000).toFixed(1)}L</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Commission (20%)</p>
                        <p className="text-lg font-bold text-purple-400">₹{(reseller.totalCommission / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Conversion</p>
                        <p className="text-lg font-bold text-cyan-400">{reseller.conversionRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">AI Credits</p>
                        <p className="text-lg font-bold text-pink-400">₹{reseller.aiCreditsBalance}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {reseller.status === 'active' ? (
                        <Button size="sm" variant="outline" className="border-red-500/50 text-red-400">
                          <Ban className="w-4 h-4 mr-1" />
                          Suspend
                        </Button>
                      ) : reseller.status === 'suspended' ? (
                        <Button size="sm" variant="outline" className="border-emerald-500/50 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Activate
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance AI Tab */}
        <TabsContent value="performance" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-emerald-400" />
                  AI Performance Scores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resellers.filter(r => r.status === 'active').map((reseller) => (
                  <div key={reseller.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center font-bold text-white text-sm">
                      {reseller.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white">{reseller.name}</span>
                        <span className="text-sm text-purple-400">{reseller.aiScore}%</span>
                      </div>
                      <Progress value={reseller.aiScore} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  Risk Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {resellers.filter(r => r.riskLevel !== 'low').map(reseller => (
                  <div key={reseller.id} className={`p-3 rounded-lg border ${
                    reseller.riskLevel === 'high' ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`w-4 h-4 ${reseller.riskLevel === 'high' ? 'text-red-400' : 'text-amber-400'}`} />
                        <div>
                          <p className="text-sm font-medium text-white">{reseller.name}</p>
                          <p className="text-xs text-slate-400">
                            {reseller.riskLevel === 'high' ? 'Low conversion rate' : 'Performance declining'}
                          </p>
                        </div>
                      </div>
                      {getRiskBadge(reseller.riskLevel)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Billing Tab */}
        <TabsContent value="ai-billing" className="mt-6 space-y-6">
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-500/20">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">AI Billing Overview (2x Markup)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-slate-800/50">
                      <p className="text-sm text-slate-400">Total AI Credits Sold</p>
                      <p className="text-2xl font-bold text-purple-400">₹{(liveMetrics.aiCreditsConsumed * 1.5).toFixed(0)}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-800/50">
                      <p className="text-sm text-slate-400">Actual AI Cost</p>
                      <p className="text-2xl font-bold text-cyan-400">₹{(liveMetrics.aiCreditsConsumed / 2).toFixed(0)}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-800/50">
                      <p className="text-sm text-slate-400">Markup Revenue</p>
                      <p className="text-2xl font-bold text-emerald-400">₹{(liveMetrics.aiCreditsConsumed / 2).toFixed(0)}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-800/50">
                      <p className="text-sm text-slate-400">Active AI Users</p>
                      <p className="text-2xl font-bold text-amber-400">{resellers.filter(r => r.aiCreditsUsed > 0).length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-pink-400" />
                Reseller AI Credit Balances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-sm text-slate-400">Reseller</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-400">Balance</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-400">Used</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-400">Billed (2x)</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resellers.map(reseller => (
                      <tr key={reseller.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                              {reseller.avatar}
                            </div>
                            <span className="text-white">{reseller.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-purple-400 font-bold">₹{reseller.aiCreditsBalance}</td>
                        <td className="py-3 px-4 text-slate-400">₹{reseller.aiCreditsUsed}</td>
                        <td className="py-3 px-4 text-pink-400">₹{reseller.aiCreditsUsed * 2}</td>
                        <td className="py-3 px-4">
                          {reseller.aiCreditsBalance < 50 ? (
                            <Badge className="bg-red-500/20 text-red-400">Low Balance</Badge>
                          ) : (
                            <Badge className="bg-emerald-500/20 text-emerald-400">Active</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Approval History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingApprovals.filter(a => a.status !== 'pending').map(approval => (
                <div
                  key={approval.id}
                  className="p-4 rounded-xl bg-slate-700/30 border border-slate-600/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    {approval.status === 'approved' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                    <div>
                      <p className="text-white font-medium">{approval.title}</p>
                      <p className="text-sm text-slate-400">{approval.reseller}</p>
                    </div>
                  </div>
                  <Badge className={approval.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
                    {approval.status}
                  </Badge>
                </div>
              ))}
              {pendingApprovals.filter(a => a.status !== 'pending').length === 0 && (
                <div className="text-center py-8 text-slate-400">No history yet</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIResellerManager;
