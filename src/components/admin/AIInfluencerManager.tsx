import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, TrendingUp, DollarSign, Eye, MousePointer, 
  Award, Shield, AlertTriangle, CheckCircle, XCircle,
  Clock, Search, Filter, MoreVertical, Star, Zap,
  Youtube, Instagram, Facebook, Twitter, Link2,
  BarChart3, Target, Sparkles, Ban, UserCheck,
  ArrowUpRight, ArrowDownRight, Activity, Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

// Types
interface Influencer {
  id: string;
  name: string;
  maskedEmail: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
  commissionRate: number;
  performanceScore: number;
  riskScore: number;
  joinedAt: Date;
  lastActive: Date;
  platforms: string[];
  pendingPayout: number;
  lifetimePayout: number;
  fraudAlerts: number;
}

interface ApprovalRequest {
  id: string;
  type: 'registration' | 'withdrawal' | 'tier_upgrade' | 'payout' | 'suspension_appeal';
  influencerId: string;
  influencerName: string;
  amount?: number;
  currentTier?: string;
  requestedTier?: string;
  reason: string;
  submittedAt: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

// Sample data
const sampleInfluencers: Influencer[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    maskedEmail: 'ra****@gmail.com',
    tier: 'gold',
    status: 'active',
    totalClicks: 45670,
    totalConversions: 234,
    totalEarnings: 145000,
    commissionRate: 15,
    performanceScore: 87,
    riskScore: 12,
    joinedAt: new Date('2024-06-15'),
    lastActive: new Date(),
    platforms: ['youtube', 'instagram'],
    pendingPayout: 12500,
    lifetimePayout: 132500,
    fraudAlerts: 0
  },
  {
    id: '2',
    name: 'Priya Patel',
    maskedEmail: 'pr****@gmail.com',
    tier: 'platinum',
    status: 'active',
    totalClicks: 89450,
    totalConversions: 567,
    totalEarnings: 345000,
    commissionRate: 18,
    performanceScore: 94,
    riskScore: 5,
    joinedAt: new Date('2024-03-20'),
    lastActive: new Date(),
    platforms: ['youtube', 'instagram', 'facebook'],
    pendingPayout: 28000,
    lifetimePayout: 317000,
    fraudAlerts: 0
  },
  {
    id: '3',
    name: 'Amit Kumar',
    maskedEmail: 'am****@gmail.com',
    tier: 'silver',
    status: 'active',
    totalClicks: 23400,
    totalConversions: 89,
    totalEarnings: 67000,
    commissionRate: 12,
    performanceScore: 72,
    riskScore: 25,
    joinedAt: new Date('2024-08-10'),
    lastActive: new Date(Date.now() - 86400000),
    platforms: ['instagram', 'twitter'],
    pendingPayout: 5600,
    lifetimePayout: 61400,
    fraudAlerts: 1
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    maskedEmail: 'sn****@gmail.com',
    tier: 'diamond',
    status: 'active',
    totalClicks: 156780,
    totalConversions: 1234,
    totalEarnings: 780000,
    commissionRate: 20,
    performanceScore: 98,
    riskScore: 3,
    joinedAt: new Date('2023-12-01'),
    lastActive: new Date(),
    platforms: ['youtube', 'instagram', 'facebook', 'twitter'],
    pendingPayout: 45000,
    lifetimePayout: 735000,
    fraudAlerts: 0
  },
  {
    id: '5',
    name: 'Vikram Singh',
    maskedEmail: 'vi****@gmail.com',
    tier: 'bronze',
    status: 'pending',
    totalClicks: 1200,
    totalConversions: 8,
    totalEarnings: 3500,
    commissionRate: 10,
    performanceScore: 45,
    riskScore: 45,
    joinedAt: new Date('2024-12-01'),
    lastActive: new Date(),
    platforms: ['instagram'],
    pendingPayout: 800,
    lifetimePayout: 2700,
    fraudAlerts: 2
  }
];

const sampleApprovals: ApprovalRequest[] = [
  {
    id: '1',
    type: 'registration',
    influencerId: '6',
    influencerName: 'Neha Gupta',
    reason: 'New influencer application with 50K YouTube subscribers',
    submittedAt: new Date(Date.now() - 3600000),
    priority: 'medium'
  },
  {
    id: '2',
    type: 'withdrawal',
    influencerId: '1',
    influencerName: 'Rahul Sharma',
    amount: 12500,
    reason: 'Monthly payout request',
    submittedAt: new Date(Date.now() - 7200000),
    priority: 'high'
  },
  {
    id: '3',
    type: 'tier_upgrade',
    influencerId: '3',
    influencerName: 'Amit Kumar',
    currentTier: 'silver',
    requestedTier: 'gold',
    reason: 'Reached 25K clicks milestone',
    submittedAt: new Date(Date.now() - 14400000),
    priority: 'low'
  },
  {
    id: '4',
    type: 'suspension_appeal',
    influencerId: '7',
    influencerName: 'Ravi Verma',
    reason: 'Appeal against click fraud suspension - claims VPN usage',
    submittedAt: new Date(Date.now() - 86400000),
    priority: 'urgent'
  }
];

const tierColors: Record<string, string> = {
  bronze: 'bg-amber-700/20 text-amber-400 border-amber-500/30',
  silver: 'bg-slate-400/20 text-slate-300 border-slate-400/30',
  gold: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  platinum: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  diamond: 'bg-violet-500/20 text-violet-400 border-violet-500/30'
};

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  suspended: 'bg-red-500/20 text-red-400 border-red-500/30',
  inactive: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
};

const platformIcons: Record<string, any> = {
  youtube: Youtube,
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter
};

const AIInfluencerManager = () => {
  const [influencers] = useState<Influencer[]>(sampleInfluencers);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(sampleApprovals);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);

  // Metrics
  const totalInfluencers = influencers.length;
  const activeInfluencers = influencers.filter(i => i.status === 'active').length;
  const totalClicks = influencers.reduce((sum, i) => sum + i.totalClicks, 0);
  const totalConversions = influencers.reduce((sum, i) => sum + i.totalConversions, 0);
  const totalEarnings = influencers.reduce((sum, i) => sum + i.totalEarnings, 0);
  const pendingPayouts = influencers.reduce((sum, i) => sum + i.pendingPayout, 0);
  const avgPerformance = Math.round(influencers.reduce((sum, i) => sum + i.performanceScore, 0) / influencers.length);
  const highRiskCount = influencers.filter(i => i.riskScore > 40).length;

  const filteredInfluencers = influencers.filter(inf => {
    const matchesSearch = inf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inf.maskedEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'all' || inf.tier === tierFilter;
    const matchesStatus = statusFilter === 'all' || inf.status === statusFilter;
    return matchesSearch && matchesTier && matchesStatus;
  });

  const handleApprove = (id: string, type: string) => {
    setApprovals(prev => prev.filter(a => a.id !== id));
    toast.success(`${type.replace('_', ' ')} approved successfully`);
  };

  const handleReject = (id: string, type: string) => {
    setApprovals(prev => prev.filter(a => a.id !== id));
    toast.error(`${type.replace('_', ' ')} rejected`);
  };

  const handleSuspend = (influencer: Influencer) => {
    toast.warning(`${influencer.name} has been suspended`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500 to-violet-500">
              <Users className="w-8 h-8 text-white" />
            </div>
            AI Influencer Management
          </h1>
          <p className="text-slate-400 mt-1">Monitor, manage and optimize influencer performance</p>
        </div>
        <div className="flex gap-3">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-2">
            <Activity className="w-4 h-4 mr-2" />
            {activeInfluencers} Active
          </Badge>
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            {approvals.length} Pending
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {[
          { label: 'Total Influencers', value: totalInfluencers, icon: Users, color: 'violet', trend: '+12%' },
          { label: 'Active', value: activeInfluencers, icon: UserCheck, color: 'emerald', trend: '+5%' },
          { label: 'Total Clicks', value: formatNumber(totalClicks), icon: MousePointer, color: 'cyan', trend: '+18%' },
          { label: 'Conversions', value: formatNumber(totalConversions), icon: Target, color: 'pink', trend: '+22%' },
          { label: 'Total Earnings', value: formatCurrency(totalEarnings), icon: DollarSign, color: 'amber', trend: '+15%' },
          { label: 'Pending Payouts', value: formatCurrency(pendingPayouts), icon: Clock, color: 'orange', trend: '' },
          { label: 'Avg Performance', value: `${avgPerformance}%`, icon: BarChart3, color: 'blue', trend: '+3%' },
          { label: 'High Risk', value: highRiskCount, icon: AlertTriangle, color: 'red', trend: '' },
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-4 rounded-xl bg-slate-800/50 border border-${metric.color}-500/20`}
          >
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className={`w-4 h-4 text-${metric.color}-400`} />
              <span className="text-xs text-slate-400">{metric.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-lg font-bold text-white">{metric.value}</span>
              {metric.trend && (
                <span className="text-xs text-emerald-400 flex items-center">
                  <ArrowUpRight className="w-3 h-3" />
                  {metric.trend}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="influencers" className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="influencers" className="data-[state=active]:bg-violet-500">
            <Users className="w-4 h-4 mr-2" />
            All Influencers
          </TabsTrigger>
          <TabsTrigger value="approvals" className="data-[state=active]:bg-violet-500">
            <Clock className="w-4 h-4 mr-2" />
            Approvals ({approvals.length})
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-violet-500">
            <BarChart3 className="w-4 h-4 mr-2" />
            Performance AI
          </TabsTrigger>
          <TabsTrigger value="fraud" className="data-[state=active]:bg-violet-500">
            <Shield className="w-4 h-4 mr-2" />
            Fraud Monitor
          </TabsTrigger>
        </TabsList>

        {/* All Influencers Tab */}
        <TabsContent value="influencers" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search influencers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700"
                />
              </div>
            </div>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="diamond">Diamond</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Influencer Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredInfluencers.map((influencer, index) => (
              <motion.div
                key={influencer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/60 border-slate-700/50 hover:border-violet-500/30 transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg">
                          {influencer.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{influencer.name}</h3>
                          <p className="text-sm text-slate-400">{influencer.maskedEmail}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={tierColors[influencer.tier]}>
                          {influencer.tier.toUpperCase()}
                        </Badge>
                        <Badge className={statusColors[influencer.status]}>
                          {influencer.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Platforms */}
                    <div className="flex gap-2 mb-4">
                      {influencer.platforms.map(platform => {
                        const Icon = platformIcons[platform];
                        return (
                          <div key={platform} className="p-2 rounded-lg bg-slate-800/50 border border-slate-700">
                            <Icon className="w-4 h-4 text-slate-400" />
                          </div>
                        );
                      })}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <div className="text-center p-2 rounded-lg bg-slate-800/30">
                        <p className="text-lg font-bold text-white">{formatNumber(influencer.totalClicks)}</p>
                        <p className="text-xs text-slate-500">Clicks</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-slate-800/30">
                        <p className="text-lg font-bold text-emerald-400">{influencer.totalConversions}</p>
                        <p className="text-xs text-slate-500">Conversions</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-slate-800/30">
                        <p className="text-lg font-bold text-amber-400">{formatCurrency(influencer.totalEarnings)}</p>
                        <p className="text-xs text-slate-500">Earnings</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-slate-800/30">
                        <p className="text-lg font-bold text-violet-400">{influencer.commissionRate}%</p>
                        <p className="text-xs text-slate-500">Commission</p>
                      </div>
                    </div>

                    {/* Performance & Risk */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Performance</span>
                          <span className="text-emerald-400">{influencer.performanceScore}%</span>
                        </div>
                        <Progress value={influencer.performanceScore} className="h-2 bg-slate-700" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Risk Score</span>
                          <span className={influencer.riskScore > 40 ? 'text-red-400' : influencer.riskScore > 20 ? 'text-amber-400' : 'text-emerald-400'}>
                            {influencer.riskScore}%
                          </span>
                        </div>
                        <Progress 
                          value={influencer.riskScore} 
                          className={`h-2 ${influencer.riskScore > 40 ? 'bg-red-900' : 'bg-slate-700'}`}
                        />
                      </div>
                    </div>

                    {/* Fraud Alerts */}
                    {influencer.fraudAlerts > 0 && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 mb-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-red-400">
                            {influencer.fraudAlerts} fraud alert(s) detected
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-slate-600"
                        onClick={() => setSelectedInfluencer(influencer)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      {influencer.pendingPayout > 0 && (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-500"
                        >
                          <DollarSign className="w-4 h-4 mr-1" />
                          {formatCurrency(influencer.pendingPayout)}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => handleSuspend(influencer)}
                      >
                        <Ban className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="space-y-4">
          {approvals.length === 0 ? (
            <Card className="bg-slate-900/60 border-slate-700/50">
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">All Caught Up!</h3>
                <p className="text-slate-400">No pending approvals at the moment</p>
              </CardContent>
            </Card>
          ) : (
            approvals.map((approval, index) => (
              <motion.div
                key={approval.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-slate-900/60 border-l-4 ${
                  approval.priority === 'urgent' ? 'border-l-red-500' :
                  approval.priority === 'high' ? 'border-l-orange-500' :
                  approval.priority === 'medium' ? 'border-l-amber-500' : 'border-l-slate-500'
                }`}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          approval.type === 'registration' ? 'bg-violet-500/20' :
                          approval.type === 'withdrawal' ? 'bg-emerald-500/20' :
                          approval.type === 'tier_upgrade' ? 'bg-amber-500/20' :
                          'bg-red-500/20'
                        }`}>
                          {approval.type === 'registration' && <UserCheck className="w-6 h-6 text-violet-400" />}
                          {approval.type === 'withdrawal' && <DollarSign className="w-6 h-6 text-emerald-400" />}
                          {approval.type === 'tier_upgrade' && <ArrowUpRight className="w-6 h-6 text-amber-400" />}
                          {approval.type === 'suspension_appeal' && <Shield className="w-6 h-6 text-red-400" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white capitalize">
                              {approval.type.replace('_', ' ')}
                            </h3>
                            <Badge className={
                              approval.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                              approval.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                              approval.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-slate-500/20 text-slate-400'
                            }>
                              {approval.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-400">{approval.influencerName}</p>
                          <p className="text-sm text-slate-500 mt-1">{approval.reason}</p>
                          {approval.amount && (
                            <p className="text-lg font-bold text-emerald-400 mt-2">
                              {formatCurrency(approval.amount)}
                            </p>
                          )}
                          {approval.currentTier && (
                            <p className="text-sm text-slate-400 mt-1">
                              {approval.currentTier} → {approval.requestedTier}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApprove(approval.id, approval.type)}
                          className="bg-emerald-600 hover:bg-emerald-500"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReject(approval.id, approval.type)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>

        {/* Performance AI Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <Card className="bg-slate-900/60 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {influencers
                  .sort((a, b) => b.performanceScore - a.performanceScore)
                  .slice(0, 5)
                  .map((inf, index) => (
                    <div key={inf.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-amber-500 text-black' :
                          index === 1 ? 'bg-slate-400 text-black' :
                          index === 2 ? 'bg-amber-700 text-white' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-white">{inf.name}</p>
                          <p className="text-xs text-slate-400">{inf.tier} tier</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-400">{inf.performanceScore}%</p>
                        <p className="text-xs text-slate-400">{formatNumber(inf.totalClicks)} clicks</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-gradient-to-br from-violet-500/10 to-pink-500/10 border-violet-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  AI Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { insight: 'Sneha Reddy is trending 45% above average - consider Diamond bonus', type: 'positive' },
                  { insight: 'Amit Kumar shows declining engagement - recommend outreach', type: 'warning' },
                  { insight: '3 influencers ready for tier upgrade based on performance', type: 'info' },
                  { insight: 'Instagram performing 23% better than YouTube this week', type: 'positive' },
                  { insight: 'Vikram Singh flagged for unusual click patterns', type: 'danger' }
                ].map((item, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    item.type === 'positive' ? 'bg-emerald-500/10 border-emerald-500/30' :
                    item.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                    item.type === 'danger' ? 'bg-red-500/10 border-red-500/30' :
                    'bg-blue-500/10 border-blue-500/30'
                  }`}>
                    <p className={`text-sm ${
                      item.type === 'positive' ? 'text-emerald-400' :
                      item.type === 'warning' ? 'text-amber-400' :
                      item.type === 'danger' ? 'text-red-400' :
                      'text-blue-400'
                    }`}>
                      {item.insight}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Tier Distribution */}
          <Card className="bg-slate-900/60 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-violet-400" />
                Tier Distribution & Commission Rates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {['bronze', 'silver', 'gold', 'platinum', 'diamond'].map(tier => {
                  const count = influencers.filter(i => i.tier === tier).length;
                  const percentage = Math.round((count / totalInfluencers) * 100);
                  const commissionRates: Record<string, number> = {
                    bronze: 10, silver: 12, gold: 15, platinum: 18, diamond: 20
                  };
                  return (
                    <div key={tier} className={`p-4 rounded-xl border ${tierColors[tier]} text-center`}>
                      <p className="text-2xl font-bold text-white mb-1">{count}</p>
                      <p className="text-sm capitalize mb-2">{tier}</p>
                      <p className="text-xs text-slate-400">{percentage}% of total</p>
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <p className="text-lg font-bold text-emerald-400">{commissionRates[tier]}%</p>
                        <p className="text-xs text-slate-500">Commission</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fraud Monitor Tab */}
        <TabsContent value="fraud" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fraud Stats */}
            <Card className="bg-slate-900/60 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  Fraud Detection Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Click Fraud Detected', value: 234, change: '-12%', color: 'emerald' },
                  { label: 'Fake Conversions Blocked', value: 45, change: '-8%', color: 'emerald' },
                  { label: 'VPN/Proxy Clicks', value: 1234, change: '+5%', color: 'amber' },
                  { label: 'Bot Traffic Blocked', value: 567, change: '-23%', color: 'emerald' },
                  { label: 'Duplicate IP Clicks', value: 89, change: '-15%', color: 'emerald' }
                ].map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <span className="text-slate-400">{stat.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{stat.value}</span>
                      <span className={`text-xs text-${stat.color}-400`}>{stat.change}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* High Risk Influencers */}
            <Card className="bg-slate-900/60 border-red-500/30 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  High Risk Influencers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {influencers
                    .filter(i => i.riskScore > 20)
                    .sort((a, b) => b.riskScore - a.riskScore)
                    .map(inf => (
                      <div key={inf.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                            inf.riskScore > 40 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {inf.riskScore}%
                          </div>
                          <div>
                            <p className="font-medium text-white">{inf.name}</p>
                            <p className="text-sm text-slate-400">{inf.maskedEmail}</p>
                            {inf.fraudAlerts > 0 && (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mt-1">
                                {inf.fraudAlerts} Alert{inf.fraudAlerts > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-slate-600">
                            <Eye className="w-4 h-4 mr-1" />
                            Investigate
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                            onClick={() => handleSuspend(inf)}
                          >
                            <Ban className="w-4 h-4 mr-1" />
                            Suspend
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Influencer Detail Modal */}
      <AnimatePresence>
        {selectedInfluencer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedInfluencer(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center text-white font-bold text-2xl">
                    {selectedInfluencer.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedInfluencer.name}</h2>
                    <p className="text-slate-400">{selectedInfluencer.maskedEmail}</p>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setSelectedInfluencer(null)}>
                  <XCircle className="w-6 h-6" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-800/50">
                  <p className="text-sm text-slate-400">Total Clicks</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(selectedInfluencer.totalClicks)}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50">
                  <p className="text-sm text-slate-400">Conversions</p>
                  <p className="text-2xl font-bold text-emerald-400">{selectedInfluencer.totalConversions}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50">
                  <p className="text-sm text-slate-400">Total Earnings</p>
                  <p className="text-2xl font-bold text-amber-400">{formatCurrency(selectedInfluencer.totalEarnings)}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50">
                  <p className="text-sm text-slate-400">Lifetime Payout</p>
                  <p className="text-2xl font-bold text-violet-400">{formatCurrency(selectedInfluencer.lifetimePayout)}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Process Payout ({formatCurrency(selectedInfluencer.pendingPayout)})
                </Button>
                <Button variant="outline" className="border-amber-500/30 text-amber-400">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Upgrade Tier
                </Button>
                <Button variant="outline" className="border-red-500/30 text-red-400">
                  <Ban className="w-4 h-4 mr-2" />
                  Suspend
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Add Trophy icon import
const Trophy = Award;

export default AIInfluencerManager;
