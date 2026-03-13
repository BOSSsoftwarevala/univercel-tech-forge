import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, DollarSign, AlertTriangle, Activity, TrendingUp, TrendingDown,
  FileText, Server, Shield, Globe, BarChart3, Zap, Boxes, Eye,
  ArrowUpRight, Clock, CheckCircle, XCircle, AlertCircle, Cpu,
  HardDrive, Wifi, Database, FileBarChart, Download
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import {
  useResellerApplications, useFranchiseAccounts, useJobApplications,
  useDashboardMetrics, useDashboardRealtime,
} from '@/hooks/boss-panel/useDashboardData';
import { useBossDashboard } from '@/hooks/boss-panel/useBossDashboard';

// ─── 7D ENTERPRISE DESIGN TOKENS ─────────────────────────────
const T = {
  // Card gradient presets — deeper, richer, more dimensional
  g1: 'linear-gradient(135deg, hsla(217, 91%, 60%, 0.18) 0%, hsla(262, 83%, 58%, 0.08) 50%, hsla(217, 91%, 60%, 0.03) 100%)',
  g2: 'linear-gradient(135deg, hsla(160, 84%, 39%, 0.18) 0%, hsla(173, 80%, 40%, 0.08) 50%, hsla(160, 84%, 39%, 0.03) 100%)',
  g3: 'linear-gradient(135deg, hsla(38, 92%, 50%, 0.18) 0%, hsla(45, 93%, 47%, 0.08) 50%, hsla(38, 92%, 50%, 0.03) 100%)',
  g4: 'linear-gradient(135deg, hsla(346, 77%, 49%, 0.18) 0%, hsla(330, 80%, 60%, 0.08) 50%, hsla(346, 77%, 49%, 0.03) 100%)',
  g5: 'linear-gradient(135deg, hsla(262, 83%, 58%, 0.18) 0%, hsla(280, 87%, 65%, 0.08) 50%, hsla(262, 83%, 58%, 0.03) 100%)',
  g6: 'linear-gradient(135deg, hsla(199, 89%, 48%, 0.18) 0%, hsla(187, 85%, 53%, 0.08) 50%, hsla(199, 89%, 48%, 0.03) 100%)',
  // Colors — higher saturation, brighter
  blue: 'hsl(217, 92%, 65%)', green: 'hsl(160, 84%, 44%)', amber: 'hsl(38, 95%, 55%)',
  red: 'hsl(346, 82%, 55%)', purple: 'hsl(262, 85%, 63%)', cyan: 'hsl(199, 90%, 55%)',
  // Surfaces — richer glass
  glass: 'hsla(222, 47%, 11%, 0.72)',
  glassBorder: 'hsla(215, 40%, 35%, 0.25)',
  glassHighlight: 'hsla(215, 100%, 90%, 0.06)',
  text: 'hsl(210, 40%, 98%)', muted: 'hsl(215, 22%, 65%)', dim: 'hsl(215, 15%, 42%)',
  rowHover: 'hsla(217, 91%, 60%, 0.07)',
};

const PIE_COLORS = [T.blue, T.green, T.amber, T.red, T.purple, T.cyan];

// ─── ANIMATION PRESETS ───────────────────────────────────────
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.08 } } };
const rise = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 400, damping: 28 } } };
const float = { initial: { y: 0 }, animate: { y: [-1.5, 1.5, -1.5], transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' as const } } };

// ─── REUSABLE COMPONENTS ─────────────────────────────────────
const Glass = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div variants={rise} className={`rounded-2xl overflow-hidden ${className}`}
    style={{ 
      background: T.glass, 
      backdropFilter: 'blur(20px) saturate(1.4)', 
      border: `1px solid ${T.glassBorder}`,
      boxShadow: `0 8px 32px -8px hsla(222,47%,4%,0.5), inset 0 1px 0 hsla(215,100%,90%,0.04)`,
    }}>
    {children}
  </motion.div>
);

const SH = ({ title, count, icon: Icon }: { title: string; count?: number; icon?: React.ElementType }) => (
  <div className="flex items-center justify-between pb-2.5 mb-3" style={{ borderBottom: `1px solid ${T.glassBorder}` }}>
    <div className="flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4" style={{ color: T.blue }} />}
      <h3 className="text-[13px] font-bold uppercase tracking-wider" style={{ color: T.text }}>{title}</h3>
    </div>
    {count !== undefined && (
      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" 
        style={{ background: `${T.blue}18`, color: T.blue, border: `1px solid ${T.blue}25` }}>{count}</span>
    )}
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const c: Record<string, { bg: string; fg: string; label: string }> = {
    active: { bg: `${T.green}18`, fg: T.green, label: 'Active' },
    approved: { bg: `${T.green}18`, fg: T.green, label: 'Approved' },
    pending: { bg: `${T.amber}18`, fg: T.amber, label: 'Pending' },
    rejected: { bg: `${T.red}18`, fg: T.red, label: 'Rejected' },
    maintenance: { bg: `${T.amber}18`, fg: T.amber, label: 'Maint.' },
    critical: { bg: `${T.red}18`, fg: T.red, label: 'Critical' },
    warning: { bg: `${T.amber}18`, fg: T.amber, label: 'Warning' },
    healthy: { bg: `${T.green}18`, fg: T.green, label: 'Healthy' },
  };
  const s = c[status] || c.pending;
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
      style={{ background: s.bg, color: s.fg, border: `1px solid ${s.fg}22`, boxShadow: `0 0 8px ${s.fg}10` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.fg, boxShadow: `0 0 4px ${s.fg}` }} />
      {s.label}
    </span>
  );
};

// ─── KPI CARD (7D) ───────────────────────────────────────────
function KPI({ title, value, trend, trendVal, icon: Icon, gradient, accent }: {
  title: string; value: string; trend?: 'up'|'down'|'flat'; trendVal?: string;
  icon: React.ElementType; gradient: string; accent: string;
}) {
  return (
    <motion.div variants={rise}
      whileHover={{ scale: 1.04, y: -4, boxShadow: `0 20px 60px -12px ${accent}30` }}
      className="relative group cursor-pointer overflow-hidden rounded-2xl"
      style={{ 
        background: gradient, 
        backdropFilter: 'blur(24px) saturate(1.5)', 
        border: `1px solid ${T.glassBorder}`, 
        minHeight: '130px',
        boxShadow: `0 4px 20px -4px ${accent}15`,
      }}>
      {/* Ambient glow overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: `radial-gradient(circle at 70% 30%, ${accent}12 0%, transparent 60%)` }} />
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"
        style={{ background: accent }} />
      <motion.div variants={float} initial="initial" animate="animate"
        className="absolute top-3.5 right-3.5 w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${accent}15`, border: `1px solid ${accent}22`, boxShadow: `0 0 12px ${accent}15` }}>
        <Icon className="w-4.5 h-4.5" style={{ color: accent }} />
      </motion.div>
      <div className="relative z-10 p-5">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: T.muted }}>{title}</span>
        <p className="text-[28px] font-black tabular-nums tracking-tight mt-2 leading-none" style={{ color: T.text }}>{value}</p>
        {trend && trendVal && (
          <div className="flex items-center gap-1 mt-2.5">
            <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full"
              style={{ 
                background: trend === 'up' ? `${T.green}12` : trend === 'down' ? `${T.red}12` : `${T.dim}12`,
                border: `1px solid ${trend === 'up' ? `${T.green}20` : trend === 'down' ? `${T.red}20` : `${T.dim}15`}`,
              }}>
              {trend === 'up' && <TrendingUp className="w-3 h-3" style={{ color: T.green }} />}
              {trend === 'down' && <TrendingDown className="w-3 h-3" style={{ color: T.red }} />}
              <span className="text-[10px] font-bold" style={{ color: trend === 'up' ? T.green : trend === 'down' ? T.red : T.muted }}>
                {trendVal}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────
export function BossDashboard() {
  const { data: resellerData } = useResellerApplications();
  const { data: franchiseData } = useFranchiseAccounts();
  const { data: jobData } = useJobApplications();
  const { data: metrics } = useDashboardMetrics();
  const { summary, systemHealth } = useBossDashboard();
  useDashboardRealtime();

  const fmt = (n: number | undefined) => n?.toLocaleString() ?? '—';
  const revenueData = metrics?.revenueByMonth ?? Array.from({ length: 6 }, (_, i) => ({
    month: ['Jan','Feb','Mar','Apr','May','Jun'][i], revenue: Math.floor(Math.random()*80000+20000), trend: Math.floor(Math.random()*60000+15000)
  }));
  const modules = systemHealth?.modules ?? [];
  const activeM = modules.filter(m => m.status === 'active').length;
  const totalM = modules.length || 1;

  // Mock data for new panels
  const moduleStatusData = [
    { name: 'Auth', status: 'active', uptime: 99.9, requests: '12.4K' },
    { name: 'Payments', status: 'active', uptime: 99.7, requests: '8.2K' },
    { name: 'AI Engine', status: 'active', uptime: 98.5, requests: '45.1K' },
    { name: 'Notifications', status: 'maintenance', uptime: 95.2, requests: '3.1K' },
    { name: 'Analytics', status: 'active', uptime: 99.8, requests: '22.7K' },
    { name: 'Storage', status: 'active', uptime: 99.9, requests: '6.8K' },
  ];

  const alertsData = [
    { id: 1, type: 'critical', message: 'CPU spike on server EU-West-2', time: '2m ago', module: 'Infrastructure' },
    { id: 2, type: 'warning', message: 'Payment gateway latency >500ms', time: '8m ago', module: 'Payments' },
    { id: 3, type: 'warning', message: 'Failed login attempts from IP range', time: '15m ago', module: 'Security' },
    { id: 4, type: 'healthy', message: 'Database backup completed', time: '22m ago', module: 'Storage' },
    { id: 5, type: 'healthy', message: 'SSL certificates renewed', time: '1h ago', module: 'Security' },
  ];

  const userActivityData = Array.from({ length: 12 }, (_, i) => ({
    hour: `${(i * 2).toString().padStart(2, '0')}:00`,
    active: Math.floor(Math.random() * 400 + 100),
    new: Math.floor(Math.random() * 50 + 10),
  }));

  const revenueBreakdown = [
    { name: 'Subscriptions', value: 45, color: T.blue },
    { name: 'Marketplace', value: 25, color: T.green },
    { name: 'Enterprise', value: 20, color: T.purple },
    { name: 'Other', value: 10, color: T.amber },
  ];

  const recentApplications = [
    ...(resellerData?.recentApplications ?? []).map(a => ({ ...a, type: 'Reseller' })),
    ...(jobData?.recentApplications ?? []).map(a => ({ ...a, type: a.application_type, status: a.status })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 6);

  return (
    <motion.div className="space-y-5" variants={stagger} initial="hidden" animate="show" style={{ color: T.text }}>
      {/* ─── HEADER ─── */}
      <motion.div variants={rise} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight" style={{ color: T.text }}>Boss Command Center</h1>
          <p className="text-[11px] mt-0.5 font-medium" style={{ color: T.muted }}>
            Enterprise Dashboard • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <motion.div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: `${T.green}10`, border: `1px solid ${T.green}20` }}
          animate={{ boxShadow: [`0 0 12px ${T.green}10`, `0 0 20px ${T.green}18`, `0 0 12px ${T.green}10`] }}
          transition={{ duration: 3, repeat: Infinity }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: T.green }} />
          <span className="text-[11px] font-bold" style={{ color: T.green }}>All Systems Operational</span>
        </motion.div>
      </motion.div>

      {/* ─── SYSTEM OVERVIEW KPIs ─── */}
      <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <KPI title="Total Revenue" value={`$${fmt(metrics?.totalRevenue)}`} icon={DollarSign} trend="up" trendVal="+12.4%" gradient={T.g1} accent={T.blue} />
        <KPI title="Active Users" value={fmt(metrics?.activeUsers)} icon={Users} trend="up" trendVal="+8.2%" gradient={T.g2} accent={T.green} />
        <KPI title="New Users (30d)" value={fmt(metrics?.newUsers)} icon={TrendingUp} trend="up" trendVal="+15%" gradient={T.g3} accent={T.amber} />
        <KPI title="Applications" value={fmt(resellerData?.total)} icon={FileText} trend={resellerData?.pending ? 'up' : 'flat'} trendVal={`${resellerData?.pending ?? 0} pending`} gradient={T.g4} accent={T.red} />
        <KPI title="Franchises" value={fmt(franchiseData?.total)} icon={Globe} trend="flat" trendVal={`${franchiseData?.active ?? 0} active`} gradient={T.g5} accent={T.purple} />
        <KPI title="System Health" value={`${summary?.systemHealth ?? 100}%`} icon={Activity} trend="flat" trendVal={`${activeM}/${totalM} modules`} gradient={T.g6} accent={T.cyan} />
      </motion.div>

      {/* ─── ROW 2: MODULE STATUS + ALERTS ─── */}
      <motion.div variants={stagger} className="grid grid-cols-12 gap-4">
        {/* Module Status Panel */}
        <Glass className="col-span-12 lg:col-span-7 p-5">
          <SH title="Module Status" icon={Boxes} count={moduleStatusData.length} />
          <div className="space-y-2">
            {moduleStatusData.map((m, i) => (
              <motion.div key={m.name} variants={rise}
                className="flex items-center gap-4 px-3 py-2.5 rounded-lg transition-colors"
                style={{ background: 'transparent' }}
                whileHover={{ backgroundColor: T.rowHover }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
                  style={{ background: `${PIE_COLORS[i % PIE_COLORS.length]}15` }}>
                  <Cpu className="w-4 h-4" style={{ color: PIE_COLORS[i % PIE_COLORS.length] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold" style={{ color: T.text }}>{m.name}</p>
                  <p className="text-[10px]" style={{ color: T.muted }}>{m.requests} req/day</p>
                </div>
                <div className="text-right mr-2">
                  <p className="text-xs font-mono font-bold tabular-nums" style={{ color: m.uptime >= 99 ? T.green : T.amber }}>
                    {m.uptime}%
                  </p>
                  <p className="text-[9px] uppercase" style={{ color: T.dim }}>uptime</p>
                </div>
                <StatusBadge status={m.status} />
              </motion.div>
            ))}
          </div>
        </Glass>

        {/* Alerts Panel */}
        <Glass className="col-span-12 lg:col-span-5 p-5">
          <SH title="System Alerts" icon={AlertTriangle} count={alertsData.filter(a => a.type !== 'healthy').length} />
          <div className="space-y-2">
            {alertsData.map((a) => (
              <motion.div key={a.id} variants={rise}
                className="flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors"
                whileHover={{ backgroundColor: T.rowHover }}>
                <div className="mt-0.5">
                  {a.type === 'critical' && <AlertCircle className="w-4 h-4" style={{ color: T.red }} />}
                  {a.type === 'warning' && <AlertTriangle className="w-4 h-4" style={{ color: T.amber }} />}
                  {a.type === 'healthy' && <CheckCircle className="w-4 h-4" style={{ color: T.green }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold" style={{ color: T.text }}>{a.message}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px]" style={{ color: T.muted }}>{a.module}</span>
                    <span className="text-[10px]" style={{ color: T.dim }}>•</span>
                    <span className="text-[10px] font-mono" style={{ color: T.dim }}>{a.time}</span>
                  </div>
                </div>
                <StatusBadge status={a.type} />
              </motion.div>
            ))}
          </div>
        </Glass>
      </motion.div>

      {/* ─── ROW 3: FINANCIAL + USER ACTIVITY ─── */}
      <motion.div variants={stagger} className="grid grid-cols-12 gap-4">
        {/* Financial Overview */}
        <Glass className="col-span-12 lg:col-span-8 p-5">
          <SH title="Financial Overview" icon={DollarSign} />
          <div className="grid grid-cols-12 gap-4">
            {/* Revenue Chart */}
            <div className="col-span-8">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad7d" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={T.blue} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={T.blue} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.glassBorder} />
                  <XAxis dataKey="month" stroke={T.dim} fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke={T.dim} fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: T.glass, backdropFilter: 'blur(16px)', border: `1px solid ${T.glassBorder}`, borderRadius: '10px', fontSize: '11px', color: T.text }} />
                  <Area type="monotone" dataKey="revenue" stroke={T.blue} strokeWidth={2.5} fill="url(#revGrad7d)" />
                  <Area type="monotone" dataKey="trend" stroke={T.dim} strokeWidth={1} fill="none" strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Pie Breakdown */}
            <div className="col-span-4 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={revenueBreakdown} cx="50%" cy="50%" innerRadius={35} outerRadius={55}
                    paddingAngle={3} dataKey="value" stroke="none">
                    {revenueBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 w-full mt-1">
                {revenueBreakdown.map(r => (
                  <div key={r.name} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                      <span style={{ color: T.muted }}>{r.name}</span>
                    </div>
                    <span className="font-bold tabular-nums" style={{ color: T.text }}>{r.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Glass>

        {/* User Activity Panel */}
        <Glass className="col-span-12 lg:col-span-4 p-5">
          <SH title="User Activity" icon={Users} />
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.glassBorder} />
              <XAxis dataKey="hour" stroke={T.dim} fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke={T.dim} fontSize={9} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: '10px', fontSize: '11px', color: T.text }} />
              <Bar dataKey="active" fill={T.blue} radius={[3, 3, 0, 0]} opacity={0.8} />
              <Bar dataKey="new" fill={T.green} radius={[3, 3, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3 px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded" style={{ background: T.blue }} />
              <span className="text-[10px] font-medium" style={{ color: T.muted }}>Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded" style={{ background: T.green }} />
              <span className="text-[10px] font-medium" style={{ color: T.muted }}>New Signups</span>
            </div>
          </div>
          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {[
              { label: 'Continents', value: summary?.activeContinents ?? 6, color: T.blue },
              { label: 'Countries', value: summary?.countriesLive ?? 45, color: T.cyan },
            ].map(s => (
              <motion.div key={s.label} whileHover={{ scale: 1.04 }}
                className="text-center py-2.5 rounded-lg"
                style={{ background: `${s.color}08`, border: `1px solid ${s.color}18` }}>
                <p className="text-xl font-black tabular-nums" style={{ color: T.text }}>{s.value}</p>
                <p className="text-[9px] uppercase font-bold tracking-wider mt-0.5" style={{ color: T.muted }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </Glass>
      </motion.div>

      {/* ─── ROW 4: REPORTS TABLE + QUICK CARDS ─── */}
      <motion.div variants={stagger} className="grid grid-cols-12 gap-4">
        {/* Reports / Applications Table */}
        <Glass className="col-span-12 lg:col-span-8">
          <div className="px-5 pt-4 pb-2">
            <SH title="Recent Applications & Reports" icon={FileBarChart} count={recentApplications.length} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: 'hsla(222, 47%, 15%, 0.4)' }}>
                  {['Name', 'Type', 'Date', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-2.5 font-bold uppercase tracking-wider text-[10px]"
                      style={{ color: T.muted, borderBottom: `1px solid ${T.glassBorder}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentApplications.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8" style={{ color: T.dim }}>No data</td></tr>
                ) : recentApplications.map((app, i) => (
                  <motion.tr key={app.id} variants={rise}
                    className="cursor-pointer transition-colors" style={{ borderBottom: `1px solid ${T.glassBorder}` }}
                    whileHover={{ backgroundColor: T.rowHover }}>
                    <td className="px-5 py-3 font-semibold" style={{ color: T.text }}>{app.full_name}</td>
                    <td className="px-5 py-3" style={{ color: T.muted }}>{app.type}</td>
                    <td className="px-5 py-3 font-mono tabular-nums" style={{ color: T.dim }}>
                      {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={app.status} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Glass>

        {/* Quick Stat Cards */}
        <motion.div variants={stagger} className="col-span-12 lg:col-span-4 space-y-3">
          {/* Critical Alerts */}
          <motion.div variants={rise} whileHover={{ scale: 1.02, y: -2 }}
            className="rounded-xl p-4 relative overflow-hidden"
            style={{ background: (summary?.criticalAlerts ?? 0) > 0 ? T.g4 : T.g2, backdropFilter: 'blur(16px)', border: `1px solid ${(summary?.criticalAlerts ?? 0) > 0 ? `${T.red}25` : `${T.green}25`}` }}>
            <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-2xl opacity-15" style={{ background: (summary?.criticalAlerts ?? 0) > 0 ? T.red : T.green }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: T.muted }}>Critical Alerts</span>
                <AlertTriangle className="w-4 h-4" style={{ color: (summary?.criticalAlerts ?? 0) > 0 ? T.red : T.dim }} />
              </div>
              <p className="text-3xl font-black mt-2 tabular-nums" style={{ color: (summary?.criticalAlerts ?? 0) > 0 ? T.red : T.text }}>{summary?.criticalAlerts ?? 0}</p>
              <p className="text-[10px] mt-1 font-medium" style={{ color: T.muted }}>{(summary?.criticalAlerts ?? 0) === 0 ? 'All nominal' : 'Needs attention'}</p>
            </div>
          </motion.div>

          {/* Super Admins */}
          <motion.div variants={rise} whileHover={{ scale: 1.02, y: -2 }}
            className="rounded-xl p-4 relative overflow-hidden"
            style={{ background: T.g5, backdropFilter: 'blur(16px)', border: `1px solid ${T.purple}25` }}>
            <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-2xl opacity-15" style={{ background: T.purple }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: T.muted }}>Super Admins</span>
                <Shield className="w-4 h-4" style={{ color: T.purple }} />
              </div>
              <p className="text-3xl font-black mt-2 tabular-nums" style={{ color: T.text }}>{summary?.totalSuperAdmins ?? 0}</p>
              <p className="text-[10px] mt-1 font-medium" style={{ color: T.muted }}>Active administrators</p>
            </div>
          </motion.div>

          {/* Revenue Summary */}
          <motion.div variants={rise} whileHover={{ scale: 1.02, y: -2 }}
            className="rounded-xl p-4 relative overflow-hidden"
            style={{ background: T.g1, backdropFilter: 'blur(16px)', border: `1px solid ${T.blue}25` }}>
            <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-2xl opacity-15" style={{ background: T.blue }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: T.muted }}>Revenue Summary</span>
                <BarChart3 className="w-4 h-4" style={{ color: T.blue }} />
              </div>
              <div className="space-y-2">
                {[
                  { l: 'Total Earned', v: `$${fmt(metrics?.totalRevenue)}`, c: T.green },
                  { l: 'Pending', v: String((resellerData?.pending ?? 0) + (jobData?.pending ?? 0)), c: T.amber },
                  { l: 'Approved', v: String((resellerData?.approved ?? 0) + (jobData?.approved ?? 0)), c: T.green },
                ].map(r => (
                  <div key={r.l} className="flex justify-between items-center">
                    <span className="text-[11px]" style={{ color: T.muted }}>{r.l}</span>
                    <span className="text-sm font-black tabular-nums" style={{ color: r.c }}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
