import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Crown, Users, Building2, Store, Code2, Zap, Star, Target,
  ListTodo, Package, Wallet, HeadphonesIcon, TrendingUp, Brain,
  Activity, Globe, Shield, Scale, Search, UserPlus, MessageSquare,
  AlertTriangle, CheckCircle, Clock, Ban, RefreshCw, ChevronRight
} from 'lucide-react';
import { ROLE_CONFIG, AppRole } from '@/types/roles';

// Role status data
const roleStatuses: Array<{
  role: AppRole;
  active: number;
  pending: number;
  failed: number;
}> = [
  { role: 'super_admin', active: 2, pending: 0, failed: 0 },
  { role: 'admin', active: 5, pending: 1, failed: 0 },
  { role: 'developer', active: 47, pending: 8, failed: 2 },
  { role: 'franchise', active: 23, pending: 5, failed: 1 },
  { role: 'reseller', active: 156, pending: 12, failed: 3 },
  { role: 'influencer', active: 89, pending: 15, failed: 0 },
  { role: 'prime', active: 342, pending: 28, failed: 5 },
  { role: 'seo_manager', active: 3, pending: 0, failed: 0 },
  { role: 'lead_manager', active: 4, pending: 1, failed: 0 },
  { role: 'task_manager', active: 3, pending: 0, failed: 0 },
  { role: 'demo_manager', active: 2, pending: 1, failed: 0 },
  { role: 'rnd_manager', active: 2, pending: 0, failed: 0 },
  { role: 'client_success', active: 5, pending: 2, failed: 0 },
  { role: 'performance_manager', active: 2, pending: 0, failed: 0 },
  { role: 'finance_manager', active: 3, pending: 1, failed: 0 },
  { role: 'marketing_manager', active: 4, pending: 0, failed: 0 },
  { role: 'legal_compliance', active: 2, pending: 0, failed: 0 },
  { role: 'hr_manager', active: 2, pending: 1, failed: 0 },
  { role: 'support', active: 8, pending: 2, failed: 1 },
  { role: 'ai_manager', active: 1, pending: 0, failed: 0 },
  { role: 'client', active: 1247, pending: 89, failed: 12 },
];

const getIconForRole = (role: AppRole) => {
  const icons: Record<string, any> = {
    super_admin: Crown,
    admin: Shield,
    developer: Code2,
    franchise: Building2,
    reseller: Store,
    influencer: Zap,
    prime: Star,
    seo_manager: Search,
    lead_manager: Target,
    task_manager: ListTodo,
    demo_manager: Package,
    rnd_manager: Brain,
    client_success: HeadphonesIcon,
    performance_manager: TrendingUp,
    finance_manager: Wallet,
    marketing_manager: MessageSquare,
    legal_compliance: Scale,
    hr_manager: UserPlus,
    support: HeadphonesIcon,
    ai_manager: Brain,
    client: Users,
  };
  return icons[role] || Users;
};

const SuperAdminCommandCenter = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [liveStats, setLiveStats] = useState({
    totalLeads: 4523,
    activeDevelopers: 47,
    demosOnline: 156,
    totalRevenue: 12450000,
    walletBalance: 8750000,
    pendingPayouts: 2340000,
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
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
      {/* Welcome Animation Overlay */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background flex items-center justify-center"
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
                className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary via-neon-teal to-primary flex items-center justify-center"
              >
                <Crown className="w-16 h-16 text-primary-foreground" />
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl font-mono font-bold neon-text mb-4"
              >
                Welcome, Boss
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-muted-foreground"
              >
                Command Center Initializing...
              </motion.p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.7, duration: 1.5 }}
                className="h-1 bg-gradient-to-r from-primary to-neon-teal mt-8 mx-auto max-w-md rounded-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-mono font-bold neon-text">Command Center</h1>
            <p className="text-muted-foreground">Real-time system overview</p>
          </div>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Live Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            icon={Target}
            label="Total Leads"
            value={liveStats.totalLeads.toLocaleString()}
            trend="+12%"
            color="primary"
          />
          <StatCard
            icon={Code2}
            label="Active Devs"
            value={liveStats.activeDevelopers.toString()}
            trend="+3"
            color="neon-teal"
          />
          <StatCard
            icon={Package}
            label="Demos Online"
            value={liveStats.demosOnline.toString()}
            trend="98%"
            color="neon-green"
          />
          <StatCard
            icon={Wallet}
            label="Total Revenue"
            value={`₹${(liveStats.totalRevenue / 100000).toFixed(1)}L`}
            trend="+18%"
            color="neon-orange"
          />
          <StatCard
            icon={Wallet}
            label="Wallet Balance"
            value={`₹${(liveStats.walletBalance / 100000).toFixed(1)}L`}
            trend=""
            color="primary"
          />
          <StatCard
            icon={Clock}
            label="Pending Payouts"
            value={`₹${(liveStats.pendingPayouts / 100000).toFixed(1)}L`}
            trend="12 requests"
            color="neon-orange"
          />
        </div>

        {/* 21 Role Status Boxes */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              21 Role Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {roleStatuses.map((status, index) => {
                const config = ROLE_CONFIG[status.role];
                const Icon = getIconForRole(status.role);
                const total = status.active + status.pending + status.failed;
                const healthPercent = total > 0 ? (status.active / total) * 100 : 100;

                return (
                  <motion.div
                    key={status.role}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="p-3 rounded-lg bg-secondary/30 border border-border/30 hover:border-primary/30 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${config.color}20`, color: config.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{config.label}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-neon-green">
                          <CheckCircle className="w-3 h-3" />
                          {status.active}
                        </span>
                        <span className="flex items-center gap-1 text-neon-orange">
                          <Clock className="w-3 h-3" />
                          {status.pending}
                        </span>
                        {status.failed > 0 && (
                          <span className="flex items-center gap-1 text-destructive">
                            <Ban className="w-3 h-3" />
                            {status.failed}
                          </span>
                        )}
                      </div>
                      <Progress value={healthPercent} className="h-1" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* World Map Panel */}
          <Card className="glass-panel lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Global Branch Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 relative bg-secondary/30 rounded-lg overflow-hidden">
                {/* Simplified World Map Visualization */}
                <div className="absolute inset-0 grid-lines opacity-30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Globe className="w-24 h-24 text-primary/30 mx-auto animate-float" />
                    <p className="text-muted-foreground mt-4">23 Active Branches</p>
                    <div className="flex items-center justify-center gap-4 mt-2">
                      <Badge variant="secondary">India: 18</Badge>
                      <Badge variant="secondary">UAE: 3</Badge>
                      <Badge variant="secondary">USA: 2</Badge>
                    </div>
                  </div>
                </div>
                {/* Branch Indicators */}
                {[
                  { x: '30%', y: '35%', name: 'Mumbai', count: 5 },
                  { x: '35%', y: '40%', name: 'Delhi', count: 4 },
                  { x: '32%', y: '50%', name: 'Bangalore', count: 3 },
                  { x: '65%', y: '25%', name: 'Dubai', count: 3 },
                  { x: '15%', y: '30%', name: 'New York', count: 2 },
                ].map((branch, i) => (
                  <motion.div
                    key={branch.name}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="absolute group cursor-pointer"
                    style={{ left: branch.x, top: branch.y }}
                  >
                    <div className="relative">
                      <motion.div
                        animate={{
                          boxShadow: ['0 0 0 0 hsl(var(--primary) / 0.4)', '0 0 0 10px hsl(var(--primary) / 0)', '0 0 0 0 hsl(var(--primary) / 0)'],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-4 h-4 rounded-full bg-primary"
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-card px-2 py-1 rounded text-xs whitespace-nowrap">
                        {branch.name}: {branch.count} branches
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Alerts */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-neon-orange" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { type: 'critical', title: 'Demo Offline', desc: 'E-commerce v2.1 down for 15m', time: '2m ago' },
                { type: 'warning', title: 'SLA Breach', desc: 'Task #4521 exceeded deadline', time: '8m ago' },
                { type: 'warning', title: 'Payout Pending', desc: '₹2.4L awaiting approval', time: '1h ago' },
                { type: 'info', title: 'New Franchise', desc: 'Mumbai South approved', time: '3h ago' },
              ].map((alert, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-3 rounded-lg border ${
                    alert.type === 'critical' 
                      ? 'bg-destructive/10 border-destructive/30' 
                      : alert.type === 'warning'
                      ? 'bg-neon-orange/10 border-neon-orange/30'
                      : 'bg-primary/10 border-primary/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">{alert.desc}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                </motion.div>
              ))}
              <Button variant="ghost" className="w-full gap-2">
                View All Alerts
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Developer Timer & Demo Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Developer Timers */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-neon-green" />
                Active Developer Timers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'DEV-A7X2', task: 'CRM API Integration', time: '02:34:18', progress: 65, status: 'coding' },
                { name: 'DEV-K9M1', task: 'Mobile App Bug Fix', time: '01:12:45', progress: 80, status: 'testing' },
                { name: 'DEV-P3L8', task: 'Dashboard UI', time: '00:45:22', progress: 30, status: 'coding' },
              ].map((dev, i) => (
                <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">{dev.name}</Badge>
                      <span className="text-sm">{dev.task}</span>
                    </div>
                    <span className="font-mono text-primary">{dev.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={dev.progress} className="flex-1" />
                    <Badge variant={dev.status === 'coding' ? 'default' : 'secondary'} className="text-xs">
                      {dev.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Demo Health Monitor */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Demo Health Monitor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'E-commerce Pro', uptime: 99.9, status: 'online', category: 'E-commerce' },
                { name: 'CRM Enterprise', uptime: 100, status: 'online', category: 'CRM' },
                { name: 'Restaurant POS', uptime: 98.5, status: 'degraded', category: 'POS' },
                { name: 'HR Management', uptime: 0, status: 'offline', category: 'HR' },
              ].map((demo, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30">
                  <div className={`w-3 h-3 rounded-full ${
                    demo.status === 'online' ? 'bg-neon-green status-dot-online' :
                    demo.status === 'degraded' ? 'bg-neon-orange status-dot-warning' :
                    'bg-destructive status-dot-critical'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{demo.name}</p>
                    <p className="text-xs text-muted-foreground">{demo.category}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono text-sm ${
                      demo.uptime >= 99 ? 'text-neon-green' :
                      demo.uptime >= 95 ? 'text-neon-orange' :
                      'text-destructive'
                    }`}>
                      {demo.uptime}%
                    </p>
                    <Badge variant={demo.status === 'online' ? 'secondary' : 'destructive'} className="text-xs">
                      {demo.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, trend, color }: {
  icon: any;
  label: string;
  value: string;
  trend: string;
  color: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="metric-card"
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl bg-${color}/20 flex items-center justify-center`}>
        <Icon className={`w-5 h-5 text-${color}`} />
      </div>
      <div>
        <p className="text-2xl font-mono font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
        {trend && (
          <span className="text-xs text-neon-green">{trend}</span>
        )}
      </div>
    </div>
  </motion.div>
);

export default SuperAdminCommandCenter;
