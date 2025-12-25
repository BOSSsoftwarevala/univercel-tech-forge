/**
 * Influencer Command Center - Premium Dark Mode Dashboard
 * Role: INFLUENCER (Grade 3)
 * Strict data isolation - influencer can access only own data
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Share2, Megaphone, Link2, MousePointerClick, 
  Wallet, TrendingUp, Users, FolderOpen, HeadphonesIcon, Settings, 
  LogOut, Bell, User, Shield, Clock, Activity, Eye,
  ExternalLink, CheckCircle, AlertCircle, Lock, ArrowUpRight,
  ArrowDownRight, Zap, Target, BarChart3, Globe
} from 'lucide-react';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Sidebar navigation items for Influencer role only
const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Share2, label: 'Share & Earn' },
  { icon: Megaphone, label: 'Campaign Hub' },
  { icon: Link2, label: 'Create Link' },
  { icon: MousePointerClick, label: 'Live Clicks' },
  { icon: Wallet, label: 'Wallet & Payouts' },
  { icon: TrendingUp, label: 'Performance Insights' },
  { icon: Users, label: 'Audience Insights' },
  { icon: FolderOpen, label: 'Content Library' },
  { icon: HeadphonesIcon, label: 'Support' },
  { icon: Settings, label: 'Settings' },
];

// Mock KPI data
const kpiData = [
  { 
    label: 'Total Earnings', 
    value: '₹2,45,890', 
    pending: '₹12,500 pending',
    icon: Wallet, 
    trend: '+18.5%',
    trendUp: true,
    color: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-400',
    glowColor: 'shadow-emerald-500/20'
  },
  { 
    label: 'Total Followers', 
    value: '1.2M', 
    subtitle: '+45K this month',
    icon: Users, 
    trend: '+12.3%',
    trendUp: true,
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
    glowColor: 'shadow-blue-500/20'
  },
  { 
    label: 'Video Views', 
    value: '8.5M', 
    subtitle: '+2.1M this week',
    icon: Eye, 
    trend: '+24.7%',
    trendUp: true,
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-400',
    glowColor: 'shadow-purple-500/20'
  },
  { 
    label: 'Link Clicks', 
    value: '156.2K', 
    subtitle: '+8.4K this week',
    icon: MousePointerClick, 
    trend: '+9.2%',
    trendUp: true,
    color: 'from-orange-500/20 to-amber-500/20',
    iconColor: 'text-orange-400',
    glowColor: 'shadow-orange-500/20'
  },
  { 
    label: 'Social Shares', 
    value: '42.8K', 
    subtitle: 'High engagement',
    icon: Share2, 
    trend: '+15.6%',
    trendUp: true,
    color: 'from-pink-500/20 to-rose-500/20',
    iconColor: 'text-pink-400',
    glowColor: 'shadow-pink-500/20'
  },
  { 
    label: 'Conversions', 
    value: '3,847', 
    subtitle: '2.46% rate',
    icon: Target, 
    trend: '+5.8%',
    trendUp: true,
    color: 'from-teal-500/20 to-cyan-500/20',
    iconColor: 'text-teal-400',
    glowColor: 'shadow-teal-500/20'
  },
];

// Mock top performing links
const topLinks = [
  { 
    campaign: 'Summer Tech Sale', 
    platform: 'Instagram', 
    clicks: '45.2K', 
    conversions: '1,245', 
    earnings: '₹28,450', 
    status: 'active' 
  },
  { 
    campaign: 'Gaming Bundle Promo', 
    platform: 'YouTube', 
    clicks: '38.7K', 
    conversions: '892', 
    earnings: '₹22,300', 
    status: 'active' 
  },
  { 
    campaign: 'Flash Friday Deals', 
    platform: 'Twitter', 
    clicks: '21.4K', 
    conversions: '456', 
    earnings: '₹11,400', 
    status: 'paused' 
  },
  { 
    campaign: 'New Year Special', 
    platform: 'Facebook', 
    clicks: '15.8K', 
    conversions: '234', 
    earnings: '₹5,850', 
    status: 'ended' 
  },
];

// Mock security logs
const securityLogs = [
  { label: 'Last Login', value: 'Today, 10:45 AM', icon: Clock },
  { label: 'Last Payout', value: 'Dec 20, 2025', icon: Wallet },
  { label: 'Last Link Created', value: 'Dec 23, 2025', icon: Link2 },
  { label: 'Password Changed', value: '45 days ago', icon: Shield },
];

export default function InfluencerCommandCenter() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [liveClicks, setLiveClicks] = useState(156234);
  const [kycStatus, setKycStatus] = useState<'pending' | 'verified' | 'rejected'>('verified');

  // Simulate live clicks
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveClicks(prev => prev + Math.floor(Math.random() * 3));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getPlatformIcon = (platform: string) => {
    const colors: Record<string, string> = {
      Instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
      YouTube: 'bg-red-500',
      Twitter: 'bg-sky-500',
      Facebook: 'bg-blue-600',
    };
    return colors[platform] || 'bg-gray-500';
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      paused: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      ended: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return styles[status] || styles.ended;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#0d1526] to-[#0f1a2e] text-white flex">
      {/* Left Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-[#0d1526]/80 backdrop-blur-xl border-r border-white/5 flex flex-col"
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Software Vala</h1>
              <p className="text-xs text-gray-400">Influencer Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item, idx) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setActiveNav(item.label)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                activeNav === item.label
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </motion.button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-[#0d1526]/60 backdrop-blur-xl border-b border-white/5 px-8 py-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Influencer Command Center
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Your real-time performance analytics & insights
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Live Earnings Pill */}
              <motion.div 
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-semibold text-emerald-400">₹2,45,890</span>
                <span className="text-xs text-gray-400">Live</span>
              </motion.div>

              {/* Role Badge */}
              <RoleBadge role="influencer" size="md" />

              {/* Notifications */}
              <button className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold flex items-center justify-center">
                  5
                </span>
              </button>

              {/* Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {kpiData.map((kpi, idx) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className={cn(
                  "relative p-6 rounded-2xl bg-gradient-to-br",
                  kpi.color,
                  "border border-white/10 backdrop-blur-xl",
                  "hover:shadow-2xl transition-all duration-300",
                  kpi.glowColor
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("p-3 rounded-xl bg-white/10", kpi.iconColor)}>
                    <kpi.icon className="w-6 h-6" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    kpi.trendUp ? "text-emerald-400" : "text-red-400"
                  )}>
                    {kpi.trendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {kpi.trend}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{kpi.value}</h3>
                <p className="text-sm text-gray-400">{kpi.label}</p>
                {kpi.pending && (
                  <p className="text-xs text-amber-400 mt-2">{kpi.pending}</p>
                )}
                {kpi.subtitle && !kpi.pending && (
                  <p className="text-xs text-gray-500 mt-2">{kpi.subtitle}</p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Live Activity & Top Links Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Live Activity Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-2xl bg-[#111827]/80 backdrop-blur-xl border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <Activity className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-lg">Live Activity</h3>
              </div>

              {/* Live Clicks Counter */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">Live Clicks</p>
                <motion.div 
                  animate={{ scale: [1, 1.01, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-4xl font-bold text-cyan-400">
                    {liveClicks.toLocaleString()}
                  </span>
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                </motion.div>
              </div>

              {/* Active Campaigns */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">Active Campaigns</p>
                <span className="text-2xl font-bold text-white">12</span>
              </div>

              {/* AI Safety Badge */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-400">Fraud Guard Active</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">AI-powered protection enabled</p>
              </div>
            </motion.div>

            {/* Top Performing Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 p-6 rounded-2xl bg-[#111827]/80 backdrop-blur-xl border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-lg">Top Performing Links</h3>
                </div>
                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                  View All <ExternalLink className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="space-y-3">
                {topLinks.map((link, idx) => (
                  <motion.div
                    key={link.campaign}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold", getPlatformIcon(link.platform))}>
                        {link.platform.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{link.campaign}</p>
                        <p className="text-xs text-gray-400">{link.platform}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 text-sm">
                      <div className="text-center">
                        <p className="font-semibold text-white">{link.clicks}</p>
                        <p className="text-xs text-gray-400">Clicks</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-white">{link.conversions}</p>
                        <p className="text-xs text-gray-400">Conv.</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-emerald-400">{link.earnings}</p>
                        <p className="text-xs text-gray-400">Earned</p>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium border",
                        getStatusBadge(link.status)
                      )}>
                        {link.status.charAt(0).toUpperCase() + link.status.slice(1)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Wallet, KYC & Security Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Wallet & Payouts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-[#111827]/80 backdrop-blur-xl border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-lg">Wallet & Payouts</h3>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                  <p className="text-sm text-gray-400">Wallet Balance</p>
                  <p className="text-3xl font-bold text-emerald-400">₹2,45,890</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-xs text-gray-400">Withdrawable</p>
                    <p className="text-lg font-semibold text-white">₹2,33,390</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-xs text-gray-400">Pending</p>
                    <p className="text-lg font-semibold text-amber-400">₹12,500</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <p className="text-xs text-gray-400">Last Payout</p>
                  <p className="text-sm font-medium text-white">₹50,000 • Dec 20, 2025</p>
                </div>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      className={cn(
                        "w-full",
                        kycStatus === 'verified' 
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                          : "bg-gray-600 cursor-not-allowed"
                      )}
                      disabled={kycStatus !== 'verified'}
                    >
                      {kycStatus !== 'verified' && <Lock className="w-4 h-4 mr-2" />}
                      Request Payout
                    </Button>
                  </TooltipTrigger>
                  {kycStatus !== 'verified' && (
                    <TooltipContent>
                      <p>KYC verification required for payouts</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </motion.div>

            {/* KYC Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-[#111827]/80 backdrop-blur-xl border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-lg">KYC Status</h3>
              </div>

              <div className={cn(
                "p-6 rounded-xl border text-center mb-6",
                kycStatus === 'verified' 
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : kycStatus === 'pending'
                  ? "bg-amber-500/10 border-amber-500/30"
                  : "bg-red-500/10 border-red-500/30"
              )}>
                {kycStatus === 'verified' && (
                  <>
                    <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                    <p className="text-lg font-semibold text-emerald-400">Verified</p>
                    <p className="text-sm text-gray-400 mt-1">Your identity has been verified</p>
                  </>
                )}
                {kycStatus === 'pending' && (
                  <>
                    <Clock className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                    <p className="text-lg font-semibold text-amber-400">Pending</p>
                    <p className="text-sm text-gray-400 mt-1">Verification in progress</p>
                  </>
                )}
                {kycStatus === 'rejected' && (
                  <>
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                    <p className="text-lg font-semibold text-red-400">Rejected</p>
                    <p className="text-sm text-gray-400 mt-1">Document clarity issue</p>
                  </>
                )}
              </div>

              {kycStatus !== 'verified' && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2 text-amber-400 text-sm">
                    <Lock className="w-4 h-4" />
                    Payouts locked until verified
                  </div>
                </div>
              )}
            </motion.div>

            {/* Security & Compliance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-[#111827]/80 backdrop-blur-xl border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-violet-500/20">
                  <Shield className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="font-semibold text-lg">Security Log</h3>
              </div>

              <div className="space-y-3">
                {securityLogs.map((log, idx) => (
                  <div 
                    key={log.label}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <log.icon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{log.label}</span>
                    </div>
                    <span className="text-sm font-medium text-white">{log.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Performance & Audience Insights Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Insights */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-2xl bg-[#111827]/80 backdrop-blur-xl border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/20">
                    <BarChart3 className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-lg">Performance Insights</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-medium border border-cyan-500/30">
                  AI Powered
                </span>
              </div>

              {/* Conversion Trend Chart Placeholder */}
              <div className="h-40 mb-6 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 flex items-center justify-center">
                <div className="flex items-end gap-2 h-24">
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="w-8 rounded-t-lg bg-gradient-to-t from-cyan-500 to-blue-500"
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-xs text-gray-400">Click-to-Sale Rate</p>
                  <p className="text-2xl font-bold text-white">2.46%</p>
                  <p className="text-xs text-emerald-400 mt-1">+0.3% vs last month</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-xs text-gray-400">Best Content</p>
                  <p className="text-lg font-bold text-white">Reels</p>
                  <p className="text-xs text-gray-400 mt-1">3.2x avg performance</p>
                </div>
              </div>
            </motion.div>

            {/* Audience Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-2xl bg-[#111827]/80 backdrop-blur-xl border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-pink-500/20">
                  <Users className="w-5 h-5 text-pink-400" />
                </div>
                <h3 className="font-semibold text-lg">Audience Insights</h3>
              </div>

              {/* Platform Split */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">Platform Split</p>
                <div className="space-y-3">
                  {[
                    { platform: 'Instagram', percent: 45, color: 'from-purple-500 to-pink-500' },
                    { platform: 'YouTube', percent: 30, color: 'from-red-500 to-orange-500' },
                    { platform: 'Twitter', percent: 15, color: 'from-sky-400 to-blue-500' },
                    { platform: 'Facebook', percent: 10, color: 'from-blue-500 to-indigo-500' },
                  ].map((p) => (
                    <div key={p.platform}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white">{p.platform}</span>
                        <span className="text-sm text-gray-400">{p.percent}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${p.percent}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className={cn("h-full rounded-full bg-gradient-to-r", p.color)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engagement & Geo */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-xs text-gray-400">Engagement Rate</p>
                  <p className="text-2xl font-bold text-white">4.8%</p>
                  <p className="text-xs text-emerald-400 mt-1">Above average</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <p className="text-xs text-gray-400">Top Region</p>
                  </div>
                  <p className="text-lg font-bold text-white">India</p>
                  <p className="text-xs text-gray-400 mt-1">78% of audience</p>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
