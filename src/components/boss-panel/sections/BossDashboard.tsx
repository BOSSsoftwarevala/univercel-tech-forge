import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 

} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';




const PIE_COLORS = [T.blue, T.green, T.amber, T.red, T.purple, T.cyan];



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


// ─── MAIN DASHBOARD ──────────────────────────────────────────
export function BossDashboard() {


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


            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
