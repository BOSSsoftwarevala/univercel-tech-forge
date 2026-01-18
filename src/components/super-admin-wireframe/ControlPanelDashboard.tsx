/**
 * CONTROL PANEL DASHBOARD - 2×7 GRID LAYOUT
 * 14 boxes total, 2 columns × 7 rows
 * LOCKED STRUCTURE - NO CHANGES WITHOUT APPROVAL
 * FULLY DETAILED CONTENT PER BOX
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Users,
  Server,
  Brain,
  Activity,
  CheckCircle,
  Eye,
  Globe2,
  Building2,
  Headphones,
  Box,
  Terminal,
  DollarSign,
  AlertTriangle,
  Cpu,
  HardDrive,
  Zap,
  Clock,
  Shield,
  Wallet,
  BarChart3,
  Play,
  FileCheck,
  UserCheck,
  MapPin,
  Ticket,
  Package,
  RefreshCw,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// ===== LOCKED COLORS: Same as Sidebar Theme =====
const DASHBOARD_COLORS = {
  bg: '#0d1b2a',
  cardBg: 'rgba(15, 30, 50, 0.9)',
  cardBorder: 'rgba(30, 58, 95, 0.6)',
  cardBorderHover: 'rgba(37, 99, 235, 0.5)',
  text: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.7)',
  accent: '#2563eb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
};

// ===== STAT ITEM COMPONENT =====
const StatItem = memo<{ label: string; value: string | number; icon?: React.ElementType; color?: string; small?: boolean }>(
  ({ label, value, icon: Icon, color = DASHBOARD_COLORS.text, small }) => (
    <div className={cn("flex items-center justify-between", small ? "py-1" : "py-1.5")}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5" style={{ color }} />}
        <span className={cn("text-white/60", small ? "text-xs" : "text-sm")}>{label}</span>
      </div>
      <span className={cn("font-semibold", small ? "text-sm" : "text-base")} style={{ color }}>{value}</span>
    </div>
  )
);
StatItem.displayName = 'StatItem';

// ===== BOX 1: KEY STATS =====
const KeyStatsBox = memo(() => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-3">
      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
        <div className="text-2xl font-bold text-emerald-400">₹42.5L</div>
        <div className="text-xs text-white/60">Total Revenue</div>
      </div>
      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <div className="text-2xl font-bold text-blue-400">+18%</div>
        <div className="text-xs text-white/60">Growth</div>
      </div>
    </div>
    <StatItem label="Active Users" value="2,847" icon={Users} color={DASHBOARD_COLORS.info} />
    <StatItem label="Countries" value="12" icon={Globe2} color={DASHBOARD_COLORS.accent} />
    <StatItem label="Franchises" value="24" icon={Building2} color={DASHBOARD_COLORS.warning} />
  </div>
));
KeyStatsBox.displayName = 'KeyStatsBox';

// ===== BOX 2: SYSTEM HEALTH =====
const SystemHealthBox = memo(() => (
  <div className="space-y-3">
    <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
      <div className="flex items-center gap-2">
        <Server className="w-4 h-4 text-emerald-400" />
        <span className="text-sm text-white">Server Status</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-medium text-emerald-400">ONLINE</span>
      </div>
    </div>
    <div className="flex items-center justify-between p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
      <div className="flex items-center gap-2">
        <Brain className="w-4 h-4 text-cyan-400" />
        <span className="text-sm text-white">AI Status</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-xs font-medium text-cyan-400">ACTIVE</span>
      </div>
    </div>
    <StatItem label="Uptime" value="99.97%" icon={Clock} color={DASHBOARD_COLORS.success} />
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-white/60">Load</span>
        <span className="text-emerald-400">32%</span>
      </div>
      <Progress value={32} className="h-2 bg-white/10" />
    </div>
  </div>
));
SystemHealthBox.displayName = 'SystemHealthBox';

// ===== BOX 3: LIVE ACTIVITY =====
const LiveActivityBox = memo(() => {
  const activities = [
    { text: 'Admin John logged in', time: '2m ago', type: 'login' },
    { text: 'Deployment #4521 started', time: '5m ago', type: 'deploy' },
    { text: 'AI processed 45 tasks', time: '8m ago', type: 'ai' },
    { text: 'Server backup complete', time: '12m ago', type: 'system' },
    { text: 'New franchise registered', time: '18m ago', type: 'business' },
  ];
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'login': return 'text-blue-400';
      case 'deploy': return 'text-purple-400';
      case 'ai': return 'text-cyan-400';
      case 'system': return 'text-emerald-400';
      case 'business': return 'text-amber-400';
      default: return 'text-white/60';
    }
  };

  return (
    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
      {activities.map((item, i) => (
        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Activity className={cn("w-3.5 h-3.5 flex-shrink-0", getTypeColor(item.type))} />
            <span className="text-sm text-white/80 truncate">{item.text}</span>
          </div>
          <span className="text-xs text-white/40 ml-2 flex-shrink-0">{item.time}</span>
        </div>
      ))}
    </div>
  );
});
LiveActivityBox.displayName = 'LiveActivityBox';

// ===== BOX 4: APPROVALS / DEGREE BOX =====
const ApprovalsBox = memo(() => {
  const approvals = [
    { type: 'Role', count: 3, priority: 'high' },
    { type: 'Deployment', count: 2, priority: 'medium' },
    { type: 'Legal', count: 1, priority: 'low' },
    { type: 'Finance', count: 0, priority: 'none' },
  ];
  
  const totalPending = approvals.reduce((sum, a) => sum + a.count, 0);

  if (totalPending === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[180px] text-white/50">
        <CheckCircle className="w-10 h-10 mb-2 text-emerald-400" />
        <span className="text-sm">No Pending Approvals</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-bold text-white">{totalPending}</span>
        <span className="text-xs text-amber-400 px-2 py-1 rounded bg-amber-500/10">Pending</span>
      </div>
      {approvals.filter(a => a.count > 0).map((item, i) => (
        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white">{item.type} Approvals</span>
          </div>
          <span className={cn(
            "text-sm font-semibold px-2 py-0.5 rounded",
            item.priority === 'high' ? 'text-red-400 bg-red-500/10' :
            item.priority === 'medium' ? 'text-amber-400 bg-amber-500/10' :
            'text-blue-400 bg-blue-500/10'
          )}>{item.count}</span>
        </div>
      ))}
    </div>
  );
});
ApprovalsBox.displayName = 'ApprovalsBox';

// ===== BOX 5: CEO OVERVIEW =====
const CEOOverviewBox = memo(() => (
  <div className="space-y-3">
    <div className="grid grid-cols-3 gap-2">
      <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
        <div className="text-xl font-bold text-purple-400">24</div>
        <div className="text-xs text-white/60">Tasks</div>
      </div>
      <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
        <div className="text-xl font-bold text-amber-400">5</div>
        <div className="text-xs text-white/60">Pending</div>
      </div>
      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
        <div className="text-xl font-bold text-emerald-400">92%</div>
        <div className="text-xs text-white/60">Done</div>
      </div>
    </div>
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-white/60">Performance</span>
        <span className="text-emerald-400">Excellent</span>
      </div>
      <Progress value={92} className="h-2 bg-white/10" />
    </div>
  </div>
));
CEOOverviewBox.displayName = 'CEOOverviewBox';

// ===== BOX 6: VALA AI STATUS =====
const ValaAIStatusBox = memo(() => (
  <div className="space-y-3">
    <div className="flex items-center justify-between p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
      <span className="text-sm text-white">Active Jobs</span>
      <span className="text-lg font-bold text-cyan-400">12</span>
    </div>
    <StatItem label="Queue Count" value="45" icon={RefreshCw} color={DASHBOARD_COLORS.warning} small />
    <StatItem label="Last Action" value="2m ago" icon={Clock} color={DASHBOARD_COLORS.textMuted} small />
    <div className="grid grid-cols-3 gap-1 mt-2">
      <div className="text-center p-1.5 rounded bg-emerald-500/10">
        <div className="text-xs text-emerald-400">Clone</div>
        <div className="text-sm font-semibold text-white">OK</div>
      </div>
      <div className="text-center p-1.5 rounded bg-blue-500/10">
        <div className="text-xs text-blue-400">Deploy</div>
        <div className="text-sm font-semibold text-white">OK</div>
      </div>
      <div className="text-center p-1.5 rounded bg-purple-500/10">
        <div className="text-xs text-purple-400">Fix</div>
        <div className="text-sm font-semibold text-white">OK</div>
      </div>
    </div>
  </div>
));
ValaAIStatusBox.displayName = 'ValaAIStatusBox';

// ===== BOX 7: SERVER MANAGEMENT =====
const ServerManagementBox = memo(() => (
  <div className="space-y-3">
    <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-emerald-400" />
        <span className="text-sm text-white">Health</span>
      </div>
      <span className="text-sm font-semibold text-emerald-400">Excellent</span>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs text-white/60">CPU</span>
        </div>
        <span className="text-xs text-blue-400">45%</span>
      </div>
      <Progress value={45} className="h-1.5 bg-white/10" />
    </div>
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <HardDrive className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-xs text-white/60">RAM</span>
        </div>
        <span className="text-xs text-purple-400">62%</span>
      </div>
      <Progress value={62} className="h-1.5 bg-white/10" />
    </div>
    <StatItem label="Alerts" value="0" icon={AlertTriangle} color={DASHBOARD_COLORS.success} small />
  </div>
));
ServerManagementBox.displayName = 'ServerManagementBox';

// ===== BOX 8: CONTINENT / COUNTRY CONTROL =====
const ContinentCountryBox = memo(() => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-2">
      <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
        <div className="text-xl font-bold text-blue-400">4</div>
        <div className="text-xs text-white/60">Continents</div>
      </div>
      <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-center">
        <div className="text-xl font-bold text-cyan-400">12</div>
        <div className="text-xs text-white/60">Countries</div>
      </div>
    </div>
    <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-emerald-400" />
        <span className="text-sm text-white">Risk Level</span>
      </div>
      <span className="text-xs font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/20">LOW</span>
    </div>
  </div>
));
ContinentCountryBox.displayName = 'ContinentCountryBox';

// ===== BOX 9: FRANCHISE SUMMARY =====
const FranchiseSummaryBox = memo(() => (
  <div className="space-y-3">
    <div className="grid grid-cols-3 gap-2">
      <div className="p-2 rounded-lg bg-blue-500/10 text-center">
        <div className="text-lg font-bold text-blue-400">24</div>
        <div className="text-xs text-white/60">Total</div>
      </div>
      <div className="p-2 rounded-lg bg-emerald-500/10 text-center">
        <div className="text-lg font-bold text-emerald-400">22</div>
        <div className="text-xs text-white/60">Active</div>
      </div>
      <div className="p-2 rounded-lg bg-amber-500/10 text-center">
        <div className="text-lg font-bold text-amber-400">2</div>
        <div className="text-xs text-white/60">Pending</div>
      </div>
    </div>
    <StatItem label="Revenue Contribution" value="₹18.2L" icon={TrendingUp} color={DASHBOARD_COLORS.success} />
  </div>
));
FranchiseSummaryBox.displayName = 'FranchiseSummaryBox';

// ===== BOX 10: SALES & SUPPORT =====
const SalesSupportBox = memo(() => (
  <div className="space-y-3">
    <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
      <div className="flex items-center gap-2">
        <Ticket className="w-4 h-4 text-amber-400" />
        <span className="text-sm text-white">Open Tickets</span>
      </div>
      <span className="text-lg font-bold text-amber-400">34</span>
    </div>
    <StatItem label="Today Revenue" value="₹2.4L" icon={DollarSign} color={DASHBOARD_COLORS.success} />
    <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
      <span className="text-sm text-white">SLA Status</span>
      <span className="text-xs font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/20">ON TRACK</span>
    </div>
  </div>
));
SalesSupportBox.displayName = 'SalesSupportBox';

// ===== BOX 11: PRODUCT MANAGER =====
const ProductManagerBox = memo(() => (
  <div className="space-y-3">
    <div className="grid grid-cols-3 gap-2">
      <div className="p-2 rounded-lg bg-purple-500/10 text-center">
        <div className="text-lg font-bold text-purple-400">18</div>
        <div className="text-xs text-white/60">Total</div>
      </div>
      <div className="p-2 rounded-lg bg-emerald-500/10 text-center">
        <div className="text-lg font-bold text-emerald-400">14</div>
        <div className="text-xs text-white/60">Live</div>
      </div>
      <div className="p-2 rounded-lg bg-amber-500/10 text-center">
        <div className="text-lg font-bold text-amber-400">6</div>
        <div className="text-xs text-white/60">Updates</div>
      </div>
    </div>
    <StatItem label="Pending Requests" value="4" icon={Package} color={DASHBOARD_COLORS.warning} />
  </div>
));
ProductManagerBox.displayName = 'ProductManagerBox';

// ===== BOX 12: DEMO / LIVE SOFTWARE STATUS =====
const DemoStatusBox = memo(() => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-2">
      <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-center">
        <div className="text-xl font-bold text-violet-400">8</div>
        <div className="text-xs text-white/60">Active Demos</div>
      </div>
      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
        <div className="text-xl font-bold text-emerald-400">14</div>
        <div className="text-xs text-white/60">Live Software</div>
      </div>
    </div>
    <div className="flex items-center justify-between p-2 rounded-lg bg-blue-500/10">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-blue-400" />
        <span className="text-sm text-white">Conversion</span>
      </div>
      <span className="text-sm font-semibold text-blue-400">42%</span>
    </div>
  </div>
));
DemoStatusBox.displayName = 'DemoStatusBox';

// ===== BOX 13: FINANCE OVERVIEW =====
const FinanceOverviewBox = memo(() => (
  <div className="space-y-3">
    <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
      <div className="flex items-center gap-2">
        <Wallet className="w-4 h-4 text-emerald-400" />
        <span className="text-sm text-white">Wallet Balance</span>
      </div>
      <span className="text-lg font-bold text-emerald-400">₹8.5L</span>
    </div>
    <StatItem label="Payout Status" value="Processed" icon={CheckCircle} color={DASHBOARD_COLORS.success} />
    <div className="flex items-center justify-between p-2 rounded-lg bg-blue-500/10">
      <span className="text-sm text-white">Monthly Flow</span>
      <span className="text-sm font-semibold text-blue-400">+₹12.3L</span>
    </div>
  </div>
));
FinanceOverviewBox.displayName = 'FinanceOverviewBox';

// ===== BOX 14: ALERT SUMMARY =====
const AlertSummaryBox = memo(() => (
  <div className="space-y-2">
    <div className="flex items-center justify-between p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 transition-colors cursor-pointer">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-red-400" />
        <span className="text-sm text-white">Critical</span>
      </div>
      <span className="text-lg font-bold text-red-400">0</span>
    </div>
    <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-colors cursor-pointer">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-amber-400" />
        <span className="text-sm text-white">Warning</span>
      </div>
      <span className="text-lg font-bold text-amber-400">3</span>
    </div>
    <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15 transition-colors cursor-pointer">
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-blue-400" />
        <span className="text-sm text-white">Info</span>
      </div>
      <span className="text-lg font-bold text-blue-400">7</span>
    </div>
    <div className="text-center mt-2">
      <span className="text-xs text-white/40 hover:text-white/60 cursor-pointer">Click to view all alerts →</span>
    </div>
  </div>
));
AlertSummaryBox.displayName = 'AlertSummaryBox';

// ===== GRID BOX DEFINITIONS =====
const GRID_BOXES = [
  { id: 'key-stats', title: 'Key Stats', subtitle: 'Revenue / Users / Growth', icon: TrendingUp, color: DASHBOARD_COLORS.success, Component: KeyStatsBox },
  { id: 'system-health', title: 'System Health', subtitle: 'Server / AI / Uptime', icon: Server, color: DASHBOARD_COLORS.success, Component: SystemHealthBox },
  { id: 'live-activity', title: 'Live Activity', subtitle: 'Real-time Feed', icon: Activity, color: DASHBOARD_COLORS.accent, Component: LiveActivityBox },
  { id: 'approvals', title: 'Approvals Queue', subtitle: 'Role / Deploy / Legal / Finance', icon: CheckCircle, color: DASHBOARD_COLORS.warning, Component: ApprovalsBox },
  { id: 'ceo-overview', title: 'CEO Overview', subtitle: 'Tasks / Performance', icon: Eye, color: '#8b5cf6', Component: CEOOverviewBox },
  { id: 'vala-ai', title: 'VALA AI Status', subtitle: 'Jobs / Queue / Actions', icon: Brain, color: '#06b6d4', Component: ValaAIStatusBox },
  { id: 'server-status', title: 'Server Management', subtitle: 'Health / CPU / RAM', icon: Server, color: '#64748b', Component: ServerManagementBox },
  { id: 'continent-country', title: 'Continent / Country', subtitle: 'Regional Control', icon: Globe2, color: '#3b82f6', Component: ContinentCountryBox },
  { id: 'franchise-summary', title: 'Franchise Summary', subtitle: 'Partners / Revenue', icon: Building2, color: '#0ea5e9', Component: FranchiseSummaryBox },
  { id: 'sales-support', title: 'Sales & Support', subtitle: 'Tickets / Revenue / SLA', icon: Headphones, color: '#22c55e', Component: SalesSupportBox },
  { id: 'product-manager', title: 'Product Manager', subtitle: 'Products / Updates', icon: Box, color: '#a855f7', Component: ProductManagerBox },
  { id: 'demo-status', title: 'Demo / Live Software', subtitle: 'Demos / Conversion', icon: Terminal, color: '#6366f1', Component: DemoStatusBox },
  { id: 'finance-revenue', title: 'Finance Overview', subtitle: 'Wallet / Payout / Flow', icon: DollarSign, color: '#10b981', Component: FinanceOverviewBox },
  { id: 'alerts-summary', title: 'Alert Summary', subtitle: 'Critical / Warning / Info', icon: AlertTriangle, color: '#f59e0b', Component: AlertSummaryBox },
] as const;

// ===== SINGLE GRID BOX WRAPPER =====
const GridBox = memo<{
  box: typeof GRID_BOXES[number];
  index: number;
}>(({ box, index }) => {
  const Icon = box.icon;
  const ContentComponent = box.Component;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className="rounded-xl p-4 transition-all duration-200 hover:scale-[1.01] cursor-pointer min-h-[220px] flex flex-col"
      style={{
        background: DASHBOARD_COLORS.cardBg,
        border: `1px solid ${DASHBOARD_COLORS.cardBorder}`,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = DASHBOARD_COLORS.cardBorderHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = DASHBOARD_COLORS.cardBorder;
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3 pb-2 border-b border-white/10">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${box.color}20` }}
        >
          <Icon className="w-4.5 h-4.5" style={{ color: box.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">{box.title}</h3>
          <p className="text-xs text-white/50 truncate">{box.subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <ContentComponent />
      </div>
    </motion.div>
  );
});

GridBox.displayName = 'GridBox';

// ===== MAIN DASHBOARD COMPONENT =====
export const ControlPanelDashboard = memo(() => {
  return (
    <div 
      className="flex-1 p-6 overflow-auto"
      style={{ background: DASHBOARD_COLORS.bg }}
    >
      {/* Dashboard Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Master Control Panel</h1>
          <p className="text-white/60 text-sm mt-0.5">Boss / Owner Dashboard • 2×7 Grid</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">LIVE</span>
          </div>
          <div className="text-xs text-white/40">Last updated: Just now</div>
        </div>
      </div>

      {/* 2×7 GRID - 14 BOXES */}
      <div className="grid grid-cols-2 gap-4">
        {GRID_BOXES.map((box, index) => (
          <GridBox key={box.id} box={box} index={index} />
        ))}
      </div>
    </div>
  );
});

ControlPanelDashboard.displayName = 'ControlPanelDashboard';

export default ControlPanelDashboard;
