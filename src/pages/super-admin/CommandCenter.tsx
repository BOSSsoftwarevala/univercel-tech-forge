import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Crown, Users, Building2, Store, Code2, Zap, Star, Target,
  ListTodo, Package, Wallet, HeadphonesIcon, TrendingUp, Brain,
  Activity, Globe, Shield, Scale, Search, UserPlus, MessageSquare,
  Clock, RefreshCw, DollarSign, AlertTriangle, ChevronRight, ScanLine,
  Server, Megaphone, MonitorPlay, Handshake, LayoutDashboard, CheckCircle,
  ClipboardList, UserCog, Settings
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { SystemAuditPopup } from '@/components/system/SystemAuditPopup';

// Custom module item for display
interface ModuleItem {
  id: string;
  label: string;
  icon: LucideIcon;
  active: number;
  pending: number;
  done: number;
}

interface CategorySection {
  title: string;
  items: ModuleItem[];
}

const dashboardCategories: CategorySection[] = [
  {
    title: 'Platform Control',
    items: [
      { id: 'super_admin', label: 'Super Admin', icon: Crown, active: 2, pending: 0, done: 15 },
      { id: 'admin', label: 'Admin', icon: Shield, active: 5, pending: 1, done: 45 },
      { id: 'server_manager', label: 'Server Manager', icon: Server, active: 3, pending: 0, done: 28 },
    ]
  },
  {
    title: 'Business Managers',
    items: [
      { id: 'franchise_manager', label: 'Franchise Manager', icon: Building2, active: 4, pending: 2, done: 67 },
      { id: 'sales_support_manager', label: 'Sales & Support Manager', icon: HeadphonesIcon, active: 6, pending: 3, done: 156 },
      { id: 'reseller_manager', label: 'Reseller Manager', icon: Store, active: 3, pending: 1, done: 45 },
      { id: 'api_ai_manager', label: 'API / AI Manager', icon: Brain, active: 2, pending: 0, done: 34 },
      { id: 'influencer_manager', label: 'Influencer Manager', icon: Zap, active: 2, pending: 1, done: 23 },
      { id: 'seo_manager', label: 'SEO Manager', icon: Search, active: 3, pending: 0, done: 45 },
      { id: 'marketing_manager', label: 'Marketing Manager', icon: Megaphone, active: 4, pending: 1, done: 56 },
      { id: 'lead_manager', label: 'Lead Manager', icon: Target, active: 5, pending: 2, done: 128 },
      { id: 'pro_manager', label: 'Pro Manager', icon: Star, active: 2, pending: 1, done: 67 },
      { id: 'legal_manager', label: 'Legal Manager', icon: Scale, active: 2, pending: 0, done: 34 },
      { id: 'task_manager', label: 'Task Manager', icon: ListTodo, active: 4, pending: 1, done: 445 },
      { id: 'hr_manager', label: 'HR Manager', icon: UserPlus, active: 3, pending: 1, done: 23 },
      { id: 'developer_manager', label: 'Developer Manager', icon: Code2, active: 2, pending: 0, done: 21 },
    ]
  },
  {
    title: 'Partner Network',
    items: [
      { id: 'franchise', label: 'Franchise', icon: Building2, active: 23, pending: 5, done: 89 },
      { id: 'developer', label: 'Developer', icon: Code2, active: 47, pending: 8, done: 156 },
      { id: 'reseller', label: 'Reseller', icon: Store, active: 12, pending: 3, done: 78 },
      { id: 'influencer', label: 'Influencer', icon: Zap, active: 8, pending: 2, done: 45 },
    ]
  },
  {
    title: 'User Management',
    items: [
      { id: 'prime_user', label: 'Prime User', icon: Star, active: 34, pending: 5, done: 234 },
      { id: 'user', label: 'User', icon: Users, active: 156, pending: 12, done: 1245 },
    ]
  },
  {
    title: 'System & Support',
    items: [
      { id: 'frontend', label: 'Frontend', icon: MonitorPlay, active: 3, pending: 0, done: 45 },
      { id: 'safe_assist', label: 'Safe Assist', icon: Handshake, active: 5, pending: 2, done: 234 },
      { id: 'assist_manager', label: 'Assist Manager', icon: HeadphonesIcon, active: 4, pending: 1, done: 167 },
    ]
  },
  {
    title: 'Operations & Tracking',
    items: [
      { id: 'promise_tracker', label: 'Promise Tracker', icon: CheckCircle, active: 6, pending: 3, done: 289 },
      { id: 'promise_management', label: 'Promise Management', icon: ClipboardList, active: 4, pending: 2, done: 178 },
      { id: 'dashboard_management', label: 'Dashboard Management', icon: LayoutDashboard, active: 2, pending: 0, done: 56 },
    ]
  },
];

// Module Activity Card Component - For custom dashboard items
interface ModuleActivityCardProps {
  item: ModuleItem;
  index: number;
}

const ModuleActivityCard = ({ item, index }: ModuleActivityCardProps) => {
  const Icon = item.icon;
  const total = item.active + item.pending + item.done;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative p-5 rounded-2xl bg-slate-800/80 border border-teal-500/20 backdrop-blur-xl overflow-hidden cursor-pointer group"
      style={{
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Corner Glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-teal-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <motion.div 
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg"
          whileHover={{ rotate: 5 }}
          style={{
            boxShadow: '0 8px 24px rgba(20, 184, 166, 0.4)',
          }}
        >
          <Icon className="h-6 w-6 text-white" />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white tracking-wide truncate">{item.label}</h3>
          <p className="text-xs text-slate-400">Live Activity</p>
        </div>
        
        <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mr-1.5 animate-pulse" />
          {total}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 relative z-10">
        {/* Pending */}
        <motion.div 
          className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-8 h-8 mx-auto mb-1 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <span className="text-amber-400 font-bold text-sm">{item.pending}</span>
          </div>
          <p className="text-[10px] text-amber-300/80 uppercase tracking-wider font-medium">Pending</p>
        </motion.div>

        {/* Active */}
        <motion.div 
          className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-center relative"
          whileHover={{ scale: 1.05 }}
        >
          {item.active > 0 && (
            <div className="absolute top-1.5 right-1.5">
              <span className="flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-400"></span>
              </span>
            </div>
          )}
          <div className="w-8 h-8 mx-auto mb-1 rounded-lg bg-teal-500/20 flex items-center justify-center">
            <span className="text-teal-400 font-bold text-sm">{item.active}</span>
          </div>
          <p className="text-[10px] text-teal-300/80 uppercase tracking-wider font-medium">Active</p>
        </motion.div>

        {/* Done */}
        <motion.div 
          className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-8 h-8 mx-auto mb-1 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <span className="text-emerald-400 font-bold text-sm">{item.done > 999 ? `${(item.done/1000).toFixed(1)}k` : item.done}</span>
          </div>
          <p className="text-[10px] text-emerald-300/80 uppercase tracking-wider font-medium">Done</p>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 relative z-10">
        <div className="h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(item.done / Math.max(total, 1)) * 100}%` }}
            transition={{ duration: 1, delay: 0.3 + index * 0.03 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Stats Card for Command Center Header
const HeaderStatCard = ({ 
  title, 
  value, 
  subValue, 
  icon: Icon, 
  trend, 
  trendUp = true 
}: {
  title: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}) => (
  <motion.div 
    className="relative p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-sm overflow-hidden group"
    whileHover={{ scale: 1.02, y: -2 }}
    style={{
      boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
    }}
  >
    <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
    
    <div className="flex items-start justify-between mb-2">
      <div className="p-2 rounded-lg bg-slate-700/50">
        <Icon className="h-4 w-4 text-teal-400" />
      </div>
      {trend && (
        <Badge 
          variant="outline" 
          className={`text-[10px] ${trendUp ? 'text-emerald-400 border-emerald-500/30' : 'text-rose-400 border-rose-500/30'}`}
        >
          {trendUp ? '↑' : '↓'} {trend}
        </Badge>
      )}
    </div>
    
    <div className="space-y-0.5">
      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{title}</p>
      <div className="flex items-baseline gap-1.5">
        <motion.p 
          className="text-xl font-bold text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          {value}
        </motion.p>
        {subValue && (
          <span className="text-xs text-slate-400">{subValue}</span>
        )}
      </div>
    </div>
  </motion.div>
);

const SuperAdminCommandCenter = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAudit, setShowAudit] = useState(false);
  const [liveStats, setLiveStats] = useState({
    totalLeads: 4523,
    activeDevelopers: 47,
    demosOnline: 156,
    totalRevenue: 12450000,
  });

  // Audit popup is now manual-only (via button) - removed auto-trigger to avoid annoying users

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        totalLeads: prev.totalLeads + Math.floor(Math.random() * 3),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout roleOverride="super_admin">
      {/* System Audit Popup */}
      <SystemAuditPopup isVisible={showAudit} onClose={() => setShowAudit(false)} />
      
      {/* Welcome Animation Overlay */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-2xl"
                style={{ boxShadow: '0 0 60px rgba(20, 184, 166, 0.5)' }}
              >
                <Crown className="w-14 h-14 text-white" />
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-white mb-4"
              >
                Welcome, Boss
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-slate-400"
              >
                Command Center Initializing...
              </motion.p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.7, duration: 1.5 }}
                className="h-1 bg-gradient-to-r from-teal-500 to-cyan-500 mt-8 mx-auto max-w-md rounded-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6 bg-slate-900 min-h-screen -m-6 p-6">
        {/* Command Center Header */}
        <motion.div 
          className="space-y-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                className="relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg" style={{ boxShadow: '0 8px 24px rgba(20, 184, 166, 0.4)' }}>
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
              </motion.div>
              
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  SUPER ADMIN COMMAND CENTER
                </h1>
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  All Systems Operational • Live Monitoring
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 px-3 py-1">
                <Activity className="h-3 w-3 mr-1.5 animate-pulse" />
                LIVE
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-teal-500/30 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20"
                onClick={() => setShowAudit(true)}
              >
                <ScanLine className="w-4 h-4" />
                Run Audit
              </Button>
              <Button variant="outline" size="sm" className="gap-2 border-slate-600 bg-slate-800/50 text-slate-300 hover:bg-slate-700">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <HeaderStatCard
              title="Booking Trajectory"
              value="1,950"
              subValue=".00"
              icon={Target}
              trend="15%"
              trendUp={true}
            />
            <HeaderStatCard
              title="Active Value"
              value={`₹${(liveStats.totalRevenue / 100000).toFixed(0)}L`}
              subValue="450K pending"
              icon={DollarSign}
              trend="8%"
              trendUp={true}
            />
            <HeaderStatCard
              title="Sales Funnel"
              value="7.50%"
              subValue="4.39% prev"
              icon={TrendingUp}
              trend="3.11%"
              trendUp={true}
            />
            <HeaderStatCard
              title="Growth Rate"
              value=".65%"
              subValue=".12% prev"
              icon={Zap}
              trend="0.53%"
              trendUp={true}
            />
          </div>
        </motion.div>

        {/* Developer Timer Preview */}
        <motion.div 
          className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-teal-400" />
              Active Developer Timers
            </h3>
            <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 text-xs">{liveStats.activeDevelopers} Running</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { name: 'DEV***042', task: 'API Integration', time: '02:34:12', progress: 65 },
              { name: 'DEV***018', task: 'UI Fixes', time: '01:15:45', progress: 40 },
              { name: 'DEV***089', task: 'Bug Fix', time: '00:45:30', progress: 80 },
              { name: 'DEV***034', task: 'Feature Dev', time: '03:12:00', progress: 25 },
              { name: 'DEV***056', task: 'Testing', time: '00:30:15', progress: 90 },
              { name: 'DEV***071', task: 'Docs', time: '01:00:00', progress: 55 },
            ].map((dev, idx) => (
              <motion.div 
                key={idx} 
                className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-600/50"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
              >
                <p className="text-[10px] text-slate-400 truncate">{dev.name}</p>
                <p className="text-xs font-mono text-teal-400">{dev.time}</p>
                <div className="mt-1.5 h-1 rounded-full bg-slate-700 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${dev.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                  />
                </div>
                <p className="text-[9px] text-slate-500 mt-1 truncate">{dev.task}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Categorized Dashboard Modules - All 28 Items */}
        {dashboardCategories.map((category, catIdx) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + catIdx * 0.1 }}
            className="space-y-4"
          >
            {/* Category Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-teal-400 to-cyan-500" />
                <div>
                  <h2 className="text-lg font-bold text-white">{category.title}</h2>
                  <p className="text-xs text-slate-400">{category.items.length} modules • Real-time monitoring</p>
                </div>
              </div>
              <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400 mr-1.5 animate-pulse" />
                Live
              </Badge>
            </div>

            {/* Category Module Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {category.items.map((item, idx) => (
                <ModuleActivityCard
                  key={item.id}
                  item={item}
                  index={catIdx * 10 + idx}
                />
              ))}
            </div>
          </motion.div>
        ))}

        {/* AI Insights & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* AI Insights */}
          <motion.div 
            className="p-5 rounded-2xl bg-slate-800/60 border border-teal-500/20 backdrop-blur-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">AI Insights</h3>
                <p className="text-[10px] text-slate-400">Powered by Vala Intelligence</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { insight: 'Lead conversion rate up 15% this week', type: 'positive' },
                { insight: '3 developers approaching SLA deadline', type: 'warning' },
                { insight: 'Mumbai region showing highest growth', type: 'info' },
              ].map((item, idx) => (
                <motion.div 
                  key={idx} 
                  className={`p-3 rounded-xl border ${
                    item.type === 'positive' 
                      ? 'bg-emerald-500/10 border-emerald-500/30' 
                      : item.type === 'warning' 
                      ? 'bg-amber-500/10 border-amber-500/30' 
                      : 'bg-teal-500/10 border-teal-500/30'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                >
                  <div className="flex items-start gap-2">
                    {item.type === 'positive' && <TrendingUp className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />}
                    {item.type === 'warning' && <Clock className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />}
                    {item.type === 'info' && <Globe className="h-4 w-4 text-teal-400 mt-0.5 shrink-0" />}
                    <p className="text-xs text-slate-200">{item.insight}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Critical Alerts */}
          <motion.div 
            className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Critical Alerts</h3>
                <p className="text-[10px] text-slate-400">Requires immediate attention</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { type: 'critical', title: 'Demo Offline', desc: 'E-commerce v2.1 down', time: '2m ago' },
                { type: 'warning', title: 'SLA Breach', desc: 'Task #4521 exceeded', time: '8m ago' },
                { type: 'info', title: 'New Franchise', desc: 'Mumbai South approved', time: '3h ago' },
              ].map((alert, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className={`p-3 rounded-xl border ${
                    alert.type === 'critical' 
                      ? 'bg-rose-500/10 border-rose-500/30' 
                      : alert.type === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-teal-500/10 border-teal-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-xs text-white">{alert.title}</p>
                      <p className="text-[10px] text-slate-400">{alert.desc}</p>
                    </div>
                    <span className="text-[10px] text-slate-500">{alert.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full gap-2 mt-3 text-xs text-slate-400 hover:text-white">
              View All Alerts
              <ChevronRight className="w-3 h-3" />
            </Button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminCommandCenter;
