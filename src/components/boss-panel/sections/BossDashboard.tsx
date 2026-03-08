import React from 'react';
import { 
  Users, 
  DollarSign, 
  AlertTriangle, 
  Activity,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Server,
  Shield,
  Boxes,
  Globe,
  BarChart3,
  Zap,
  Eye
} from 'lucide-react';
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Progress } from '@/components/ui/progress';
import {
  useResellerApplications,
  useFranchiseAccounts,
  useJobApplications,
  useDashboardMetrics,
  useDashboardRealtime,
} from '@/hooks/boss-panel/useDashboardData';
import { useBossDashboard } from '@/hooks/boss-panel/useBossDashboard';

// ─── SAP FIORI COLOR TOKENS ────────────────────────────────────
const SAP = {
  shell:       'hsl(214, 27%, 26%)',   // SAP shell bar
  blue:        'hsl(210, 100%, 46%)',  // SAP Brand Blue
  blueDark:    'hsl(210, 100%, 36%)',
  blueLight:   'hsl(210, 100%, 95%)',
  positive:    'hsl(145, 63%, 42%)',   // SAP Positive/Good
  critical:    'hsl(27, 100%, 50%)',   // SAP Critical/Warning
  negative:    'hsl(0, 78%, 55%)',     // SAP Negative/Error
  neutral:     'hsl(213, 14%, 55%)',   // SAP Neutral
  tileBg:      'hsl(0, 0%, 100%)',
  tileBorder:  'hsl(213, 18%, 90%)',
  sectionBg:   'hsl(210, 25%, 97%)',
  text:        'hsl(214, 27%, 19%)',
  textLight:   'hsl(213, 14%, 55%)',
  tableHeader: 'hsl(210, 25%, 97%)',
  tableHover:  'hsl(210, 25%, 95%)',
  tableStripe: 'hsl(210, 25%, 98.5%)',
};

// ─── SAP-STYLE SEMANTIC STATUS BADGE ───────────────────────────
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    approved: { bg: 'hsl(145, 63%, 94%)', text: SAP.positive, dot: SAP.positive, label: 'Approved' },
    active:   { bg: 'hsl(145, 63%, 94%)', text: SAP.positive, dot: SAP.positive, label: 'Active' },
    pending:  { bg: 'hsl(27, 100%, 94%)', text: SAP.critical, dot: SAP.critical, label: 'Pending' },
    rejected: { bg: 'hsl(0, 78%, 95%)',   text: SAP.negative, dot: SAP.negative, label: 'Rejected' },
  };
  const c = config[status] || config.pending;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium"
      style={{ background: c.bg, color: c.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}

// ─── SAP KPI NUMERIC TILE ──────────────────────────────────────
function KPITile({ 
  title, value, unit, trend, trendValue, icon: Icon, status 
}: { 
  title: string; value: string | number; unit?: string; trend?: 'up' | 'down' | 'neutral'; 
  trendValue?: string; icon: React.ElementType; status?: 'good' | 'warning' | 'critical' 
}) {
  const statusColor = status === 'good' ? SAP.positive : status === 'warning' ? SAP.critical : status === 'critical' ? SAP.negative : SAP.blue;
  return (
    <div
      className="flex flex-col justify-between p-4 rounded-lg transition-shadow hover:shadow-md"
      style={{
        background: SAP.tileBg,
        border: `1px solid ${SAP.tileBorder}`,
        borderLeft: `4px solid ${statusColor}`,
        minHeight: '120px',
      }}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wide" style={{ color: SAP.textLight }}>{title}</span>
        <Icon className="w-4 h-4" style={{ color: SAP.textLight }} />
      </div>
      <div className="mt-2">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tabular-nums" style={{ color: SAP.text }}>{value}</span>
          {unit && <span className="text-sm" style={{ color: SAP.textLight }}>{unit}</span>}
        </div>
        {trend && trendValue && (
          <div className="flex items-center gap-1 mt-1">
            {trend === 'up' ? (
              <TrendingUp className="w-3 h-3" style={{ color: SAP.positive }} />
            ) : trend === 'down' ? (
              <TrendingDown className="w-3 h-3" style={{ color: SAP.negative }} />
            ) : null}
            <span className="text-xs font-medium" style={{ color: trend === 'up' ? SAP.positive : trend === 'down' ? SAP.negative : SAP.neutral }}>
              {trendValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SAP SECTION HEADER ────────────────────────────────────────
function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center justify-between pb-3 mb-0" style={{ borderBottom: `1px solid ${SAP.tileBorder}` }}>
      <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: SAP.text }}>{title}</h2>
      {count !== undefined && (
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: SAP.blueLight, color: SAP.blue }}>
          {count}
        </span>
      )}
    </div>
  );
}

// ─── MAIN DASHBOARD ────────────────────────────────────────────
export function BossDashboard() {
  const { data: resellerData, isLoading: rL } = useResellerApplications();
  const { data: franchiseData, isLoading: fL } = useFranchiseAccounts();
  const { data: jobData, isLoading: jL } = useJobApplications();
  const { data: metrics, isLoading: mL } = useDashboardMetrics();
  const { summary, systemHealth, isLoading: sL } = useBossDashboard();
  useDashboardRealtime();

  const loading = rL || fL || jL || mL || sL;
  const fmt = (n: number | undefined) => n?.toLocaleString() ?? '—';

  const revenueData = metrics?.revenueByMonth ?? Array.from({ length: 6 }, (_, i) => ({
    month: ['Jan','Feb','Mar','Apr','May','Jun'][i], revenue: 0, trend: 0
  }));

  const moduleBreakdown = systemHealth?.modules ?? [];
  const activeModules = moduleBreakdown.filter(m => m.status === 'active').length;
  const totalModules = moduleBreakdown.length || 1;

  // Application pipeline data
  const pipelineData = [
    { stage: 'Reseller', pending: resellerData?.pending ?? 0, approved: resellerData?.approved ?? 0, rejected: resellerData?.rejected ?? 0 },
    { stage: 'Franchise', pending: franchiseData?.pending ?? 0, approved: franchiseData?.active ?? 0, rejected: 0 },
    { stage: 'Jobs', pending: jobData?.pending ?? 0, approved: jobData?.approved ?? 0, rejected: jobData?.rejected ?? 0 },
  ];

  const recentApplications = [
    ...(resellerData?.recentApplications ?? []).map(a => ({ ...a, type: 'Reseller' })),
    ...(jobData?.recentApplications ?? []).map(a => ({ ...a, type: a.application_type, status: a.status })),
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-5" style={{ color: SAP.text }}>
      {/* ── SHELL: Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: SAP.text }}>Boss Command Center</h1>
          <p className="text-xs mt-0.5" style={{ color: SAP.textLight }}>
            Enterprise Overview • Last refreshed {new Date().toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium" style={{ background: 'hsl(145, 63%, 94%)', color: SAP.positive }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: SAP.positive }} />
            System Online
          </span>
        </div>
      </div>

      {/* ── ROW 1: KPI Tiles ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        <KPITile title="Total Revenue" value={`$${fmt(metrics?.totalRevenue)}`} icon={DollarSign} trend="up" trendValue="+12.4%" status="good" />
        <KPITile title="Active Users" value={fmt(metrics?.activeUsers)} icon={Users} trend="up" trendValue="+8.2%" status="good" />
        <KPITile title="New Users (30d)" value={fmt(metrics?.newUsers)} icon={TrendingUp} trend="up" trendValue="+15%" status="good" />
        <KPITile title="Reseller Apps" value={fmt(resellerData?.total)} icon={FileText} trend={resellerData?.pending ? 'up' : 'neutral'} trendValue={`${resellerData?.pending ?? 0} pending`} status={resellerData?.pending ? 'warning' : 'good'} />
        <KPITile title="Franchise Accts" value={fmt(franchiseData?.total)} icon={Globe} trend="neutral" trendValue={`${franchiseData?.active ?? 0} active`} status="good" />
        <KPITile title="System Health" value={`${summary?.systemHealth ?? 100}%`} icon={Activity} status={(summary?.systemHealth ?? 100) >= 90 ? 'good' : (summary?.systemHealth ?? 100) >= 70 ? 'warning' : 'critical'} trend="neutral" trendValue={`${activeModules}/${totalModules} modules`} />
      </div>

      {/* ── ROW 2: Charts + Pipeline ── */}
      <div className="grid grid-cols-12 gap-4">
        {/* Revenue Trend Chart */}
        <div className="col-span-12 lg:col-span-8 rounded-lg p-5" style={{ background: SAP.tileBg, border: `1px solid ${SAP.tileBorder}` }}>
          <SectionHeader title="Revenue Trend" />
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="sapBlueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={SAP.blue} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={SAP.blue} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={SAP.tileBorder} />
                <XAxis dataKey="month" stroke={SAP.textLight} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={SAP.textLight} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: SAP.tileBg,
                    border: `1px solid ${SAP.tileBorder}`,
                    borderRadius: '6px',
                    fontSize: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke={SAP.blue} strokeWidth={2} fill="url(#sapBlueGrad)" />
                <Area type="monotone" dataKey="trend" stroke={SAP.neutral} strokeWidth={1.5} fill="none" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Application Pipeline */}
        <div className="col-span-12 lg:col-span-4 rounded-lg p-5" style={{ background: SAP.tileBg, border: `1px solid ${SAP.tileBorder}` }}>
          <SectionHeader title="Application Pipeline" />
          <div className="mt-4 space-y-4">
            {pipelineData.map((p) => {
              const total = p.pending + p.approved + p.rejected || 1;
              return (
                <div key={p.stage}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium" style={{ color: SAP.text }}>{p.stage}</span>
                    <span className="text-xs tabular-nums" style={{ color: SAP.textLight }}>{p.pending + p.approved + p.rejected}</span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden" style={{ background: SAP.sectionBg }}>
                    <div className="h-full" style={{ width: `${(p.approved / total) * 100}%`, background: SAP.positive }} />
                    <div className="h-full" style={{ width: `${(p.pending / total) * 100}%`, background: SAP.critical }} />
                    <div className="h-full" style={{ width: `${(p.rejected / total) * 100}%`, background: SAP.negative }} />
                  </div>
                  <div className="flex gap-3 mt-1">
                    <span className="text-[10px]" style={{ color: SAP.positive }}>✓ {p.approved}</span>
                    <span className="text-[10px]" style={{ color: SAP.critical }}>⏳ {p.pending}</span>
                    {p.rejected > 0 && <span className="text-[10px]" style={{ color: SAP.negative }}>✕ {p.rejected}</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* System Modules Mini */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: SAP.text }}>System Modules</span>
              <span className="text-xs" style={{ color: SAP.positive }}>{activeModules}/{totalModules} active</span>
            </div>
            <Progress value={(activeModules / totalModules) * 100} className="h-1.5" />
            {moduleBreakdown.length > 0 && (
              <div className="mt-2 max-h-28 overflow-y-auto space-y-1">
                {moduleBreakdown.slice(0, 6).map((m) => (
                  <div key={m.name} className="flex items-center justify-between text-[11px] py-0.5">
                    <span style={{ color: SAP.text }}>{m.name}</span>
                    <StatusBadge status={m.status === 'active' ? 'approved' : m.status === 'maintenance' ? 'pending' : 'rejected'} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── ROW 3: Data Table + Quick Stats ── */}
      <div className="grid grid-cols-12 gap-4">
        {/* Recent Applications Table (SAP List Report style) */}
        <div className="col-span-12 lg:col-span-8 rounded-lg overflow-hidden" style={{ background: SAP.tileBg, border: `1px solid ${SAP.tileBorder}` }}>
          <div className="px-5 pt-4 pb-3">
            <SectionHeader title="Recent Applications" count={recentApplications.length} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: SAP.tableHeader }}>
                  <th className="text-left px-5 py-2.5 font-semibold uppercase tracking-wider" style={{ color: SAP.textLight, borderBottom: `1px solid ${SAP.tileBorder}` }}>Name</th>
                  <th className="text-left px-5 py-2.5 font-semibold uppercase tracking-wider" style={{ color: SAP.textLight, borderBottom: `1px solid ${SAP.tileBorder}` }}>Type</th>
                  <th className="text-left px-5 py-2.5 font-semibold uppercase tracking-wider" style={{ color: SAP.textLight, borderBottom: `1px solid ${SAP.tileBorder}` }}>Date</th>
                  <th className="text-left px-5 py-2.5 font-semibold uppercase tracking-wider" style={{ color: SAP.textLight, borderBottom: `1px solid ${SAP.tileBorder}` }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8" style={{ color: SAP.textLight }}>No applications found</td>
                  </tr>
                ) : (
                  recentApplications.map((app, i) => (
                    <tr
                      key={app.id}
                      className="transition-colors cursor-pointer"
                      style={{
                        background: i % 2 === 0 ? SAP.tileBg : SAP.tableStripe,
                        borderBottom: `1px solid ${SAP.tileBorder}`,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = SAP.tableHover)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? SAP.tileBg : SAP.tableStripe)}
                    >
                      <td className="px-5 py-3 font-medium" style={{ color: SAP.text }}>{app.full_name}</td>
                      <td className="px-5 py-3" style={{ color: SAP.textLight }}>{app.type}</td>
                      <td className="px-5 py-3 tabular-nums" style={{ color: SAP.textLight }}>
                        {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-3"><StatusBadge status={app.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="col-span-12 lg:col-span-4 space-y-3">
          {/* Alerts Card */}
          <div className="rounded-lg p-4" style={{ background: SAP.tileBg, border: `1px solid ${SAP.tileBorder}`, borderLeft: `4px solid ${(summary?.criticalAlerts ?? 0) > 0 ? SAP.negative : SAP.positive}` }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide" style={{ color: SAP.textLight }}>Critical Alerts</span>
              <AlertTriangle className="w-4 h-4" style={{ color: (summary?.criticalAlerts ?? 0) > 0 ? SAP.negative : SAP.neutral }} />
            </div>
            <p className="text-3xl font-bold mt-2 tabular-nums" style={{ color: (summary?.criticalAlerts ?? 0) > 0 ? SAP.negative : SAP.text }}>
              {summary?.criticalAlerts ?? 0}
            </p>
            <p className="text-xs mt-1" style={{ color: SAP.textLight }}>
              {(summary?.criticalAlerts ?? 0) === 0 ? 'All systems nominal' : 'Requires immediate attention'}
            </p>
          </div>

          {/* Super Admins Card */}
          <div className="rounded-lg p-4" style={{ background: SAP.tileBg, border: `1px solid ${SAP.tileBorder}`, borderLeft: `4px solid ${SAP.blue}` }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide" style={{ color: SAP.textLight }}>Super Admins</span>
              <Shield className="w-4 h-4" style={{ color: SAP.blue }} />
            </div>
            <p className="text-3xl font-bold mt-2 tabular-nums" style={{ color: SAP.text }}>{summary?.totalSuperAdmins ?? 0}</p>
            <p className="text-xs mt-1" style={{ color: SAP.textLight }}>Active administrators</p>
          </div>

          {/* Revenue Breakdown Mini */}
          <div className="rounded-lg p-4" style={{ background: SAP.tileBg, border: `1px solid ${SAP.tileBorder}`, borderLeft: `4px solid ${SAP.positive}` }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide" style={{ color: SAP.textLight }}>Revenue Summary</span>
              <BarChart3 className="w-4 h-4" style={{ color: SAP.positive }} />
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: SAP.text }}>Total Earned</span>
                <span className="text-sm font-bold tabular-nums" style={{ color: SAP.positive }}>${fmt(metrics?.totalRevenue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: SAP.text }}>Pending</span>
                <span className="text-sm font-medium tabular-nums" style={{ color: SAP.critical }}>{(resellerData?.pending ?? 0) + (jobData?.pending ?? 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: SAP.text }}>Approved</span>
                <span className="text-sm font-medium tabular-nums" style={{ color: SAP.positive }}>{(resellerData?.approved ?? 0) + (jobData?.approved ?? 0)}</span>
              </div>
            </div>
          </div>

          {/* Operations Summary */}
          <div className="rounded-lg p-4" style={{ background: SAP.tileBg, border: `1px solid ${SAP.tileBorder}`, borderLeft: `4px solid ${SAP.neutral}` }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide" style={{ color: SAP.textLight }}>Operations</span>
              <Zap className="w-4 h-4" style={{ color: SAP.neutral }} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="text-center p-2 rounded" style={{ background: SAP.sectionBg }}>
                <p className="text-lg font-bold tabular-nums" style={{ color: SAP.text }}>{summary?.activeContinents ?? 0}</p>
                <p className="text-[10px] uppercase" style={{ color: SAP.textLight }}>Continents</p>
              </div>
              <div className="text-center p-2 rounded" style={{ background: SAP.sectionBg }}>
                <p className="text-lg font-bold tabular-nums" style={{ color: SAP.text }}>{summary?.countriesLive ?? 0}</p>
                <p className="text-[10px] uppercase" style={{ color: SAP.textLight }}>Countries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
