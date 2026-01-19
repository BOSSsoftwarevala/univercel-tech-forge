/**
 * CONTROL PANEL DASHBOARD - FORCE STRUCTURE REBUILD
 * ===================================================
 * EXACT: 2 COLUMNS × 7 ROWS = 14 BOXES
 * ALL BOXES SAME SIZE - NO EXCEPTIONS
 * LOCKED STRUCTURE - BOSS APPROVAL REQUIRED FOR CHANGES
 * 
 * BOX MAP (LOCKED):
 * [1] KEY STATS         [2] SYSTEM HEALTH
 * [3] LIVE ACTIVITY     [4] APPROVALS
 * [5] CEO OVERVIEW      [6] VALA AI STATUS
 * [7] SERVER MGMT       [8] CONTINENT/COUNTRY
 * [9] FRANCHISE         [10] SALES & SUPPORT
 * [11] PRODUCT MGR      [12] DEMO/LIVE SOFTWARE
 * [13] FINANCE          [14] ALERT SUMMARY
 */

import { memo, forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
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
  Zap,
  FileCheck,
} from "lucide-react";

// ===== LOCKED COLORS (DO NOT CHANGE) =====
const COLORS = {
  bg: '#0a1628',
  cardBg: '#0f1d2f',
  cardBorder: '#1e3a5f',
  cardBorderHover: '#2563eb',
  text: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.6)',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
};

// ===== UNIFORM BOX HEIGHT =====
const BOX_HEIGHT = 'h-[200px]';

// ===== STAT ROW COMPONENT (Fixed forwardRef) =====
interface StatRowProps {
  label: string;
  value: string;
  color?: string;
}

const StatRow = memo(forwardRef<HTMLDivElement, StatRowProps>(({ label, value, color = COLORS.text }, ref) => (
  <div ref={ref} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
    <span className="text-sm text-white/60">{label}</span>
    <span className="text-sm font-semibold" style={{ color }}>{value}</span>
  </div>
)));
StatRow.displayName = 'StatRow';

// ===== BOX 1: KEY STATS =====
const Box1KeyStats = memo(() => (
  <div className="h-full flex flex-col">
    <StatRow label="Total Revenue" value="₹42.5L" color={COLORS.success} />
    <StatRow label="Growth" value="+18%" color={COLORS.success} />
    <StatRow label="Active Users" value="2,847" color={COLORS.info} />
    <StatRow label="Countries" value="12" color={COLORS.cyan} />
    <StatRow label="Franchises" value="24" color={COLORS.warning} />
  </div>
));
Box1KeyStats.displayName = 'Box1KeyStats';

// ===== BOX 2: SYSTEM HEALTH =====
const Box2SystemHealth = memo(() => (
  <div className="h-full flex flex-col">
    <div className="flex items-center justify-between py-1.5 border-b border-white/5">
      <div className="flex items-center gap-2">
        <Server className="w-4 h-4 text-emerald-400" />
        <span className="text-sm text-white/60">Server</span>
      </div>
      <span className="text-xs font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/20">ONLINE</span>
    </div>
    <div className="flex items-center justify-between py-1.5 border-b border-white/5">
      <div className="flex items-center gap-2">
        <Brain className="w-4 h-4 text-cyan-400" />
        <span className="text-sm text-white/60">AI Status</span>
      </div>
      <span className="text-xs font-semibold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/20">ACTIVE</span>
    </div>
    <StatRow label="Uptime" value="99.97%" color={COLORS.success} />
    <StatRow label="CPU Load" value="32%" color={COLORS.info} />
    <StatRow label="RAM Usage" value="58%" color={COLORS.purple} />
  </div>
));
Box2SystemHealth.displayName = 'Box2SystemHealth';

// ===== BOX 3: LIVE ACTIVITY (ONLY HERE - NO OTHER LOCATION) =====
const Box3LiveActivity = memo(() => {
  const activities = [
    { text: 'Admin logged in', time: '2m' },
    { text: 'Deploy #4521 started', time: '5m' },
    { text: 'AI processed 45 tasks', time: '8m' },
    { text: 'Server backup completed', time: '12m' },
    { text: 'New franchise added', time: '18m' },
  ];
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {activities.map((a, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-white/80 truncate">{a.text}</span>
            </div>
            <span className="text-xs text-white/40 ml-2 flex-shrink-0">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
Box3LiveActivity.displayName = 'Box3LiveActivity';

// ===== BOX 4: APPROVALS (ONLY HERE - NO OTHER LOCATION) =====
const Box4Approvals = memo(() => {
  const approvals = [
    { type: 'Role Approvals', count: 3 },
    { type: 'Deployment', count: 2 },
    { type: 'Legal', count: 1 },
    { type: 'Finance', count: 0 },
  ];
  const total = approvals.reduce((s, a) => s + a.count, 0);
  
  if (total === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-white/50">
        <CheckCircle className="w-10 h-10 mb-2 text-emerald-400" />
        <span className="text-sm font-medium">No Pending Approvals</span>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      {approvals.map((a, i) => (
        <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
          <span className="text-sm text-white/60">{a.type}</span>
          <span className={cn("text-sm font-semibold", a.count > 0 ? "text-amber-400" : "text-white/30")}>{a.count}</span>
        </div>
      ))}
      <div className="mt-auto pt-2 border-t border-white/10">
        <div className="text-center text-amber-400 text-sm font-semibold">{total} Pending</div>
      </div>
    </div>
  );
});
Box4Approvals.displayName = 'Box4Approvals';

// ===== BOX 5: CEO OVERVIEW =====
const Box5CEOOverview = memo(() => (
  <div className="h-full flex flex-col">
    <StatRow label="Active Tasks" value="24" color={COLORS.purple} />
    <StatRow label="Pending Approvals" value="5" color={COLORS.warning} />
    <StatRow label="Completed Today" value="12" color={COLORS.success} />
    <StatRow label="Performance" value="92%" color={COLORS.success} />
    <StatRow label="Status" value="On Track" color={COLORS.success} />
  </div>
));
Box5CEOOverview.displayName = 'Box5CEOOverview';

// ===== BOX 6: VALA AI STATUS =====
const Box6ValaAI = memo(() => (
  <div className="h-full flex flex-col">
    <StatRow label="Active Jobs" value="12" color={COLORS.cyan} />
    <StatRow label="Queue Count" value="45" color={COLORS.warning} />
    <StatRow label="Last Action" value="2m ago" color={COLORS.textMuted} />
    <StatRow label="Clone Status" value="Ready" color={COLORS.success} />
    <StatRow label="Deploy Status" value="Ready" color={COLORS.success} />
  </div>
));
Box6ValaAI.displayName = 'Box6ValaAI';

// ===== BOX 7: SERVER MANAGEMENT =====
const Box7Server = memo(() => (
  <div className="h-full flex flex-col">
    <StatRow label="Health" value="Excellent" color={COLORS.success} />
    <StatRow label="CPU" value="45%" color={COLORS.info} />
    <StatRow label="RAM" value="62%" color={COLORS.purple} />
    <StatRow label="Storage" value="38%" color={COLORS.cyan} />
    <StatRow label="Alerts" value="0" color={COLORS.success} />
  </div>
));
Box7Server.displayName = 'Box7Server';

// ===== BOX 8: CONTINENT / COUNTRY CONTROL =====
const Box8ContinentCountry = memo(() => (
  <div className="h-full flex flex-col">
    <StatRow label="Active Continents" value="4" color={COLORS.info} />
    <StatRow label="Active Countries" value="12" color={COLORS.cyan} />
    <StatRow label="Top Region" value="Asia" color={COLORS.purple} />
    <StatRow label="Risk Level" value="Low" color={COLORS.success} />
    <StatRow label="Compliance" value="100%" color={COLORS.success} />
  </div>
));
Box8ContinentCountry.displayName = 'Box8ContinentCountry';

// ===== BOX 9: FRANCHISE SUMMARY =====
const Box9Franchise = memo(() => (
  <div className="h-full flex flex-col">
    <StatRow label="Total Franchises" value="24" color={COLORS.info} />
    <StatRow label="Active" value="22" color={COLORS.success} />
    <StatRow label="Pending" value="2" color={COLORS.warning} />
    <StatRow label="Revenue Share" value="₹18.2L" color={COLORS.success} />
    <StatRow label="Growth" value="+15%" color={COLORS.success} />
  </div>
));
Box9Franchise.displayName = 'Box9Franchise';

// ===== BOX 10: SALES & SUPPORT =====
const Box10SalesSupport = memo(() => (
  <div className="h-full flex flex-col">
    <StatRow label="Open Tickets" value="34" color={COLORS.warning} />
    <StatRow label="Today Revenue" value="₹2.4L" color={COLORS.success} />
    <StatRow label="Resolved Today" value="28" color={COLORS.success} />
    <StatRow label="SLA Status" value="On Track" color={COLORS.success} />
    <StatRow label="CSAT Score" value="4.7/5" color={COLORS.success} />
  </div>
));
Box10SalesSupport.displayName = 'Box10SalesSupport';

// ===== BOX 11: PRODUCT MANAGER =====
const Box11Product = memo(() => (
  <div className="h-full flex flex-col">
    <StatRow label="Total Products" value="18" color={COLORS.purple} />
    <StatRow label="Live Products" value="14" color={COLORS.success} />
    <StatRow label="In Development" value="4" color={COLORS.info} />
    <StatRow label="Update Requests" value="6" color={COLORS.warning} />
    <StatRow label="Pending Review" value="2" color={COLORS.warning} />
  </div>
));
Box11Product.displayName = 'Box11Product';

// ===== BOX 12: DEMO / LIVE SOFTWARE STATUS =====
const Box12Demo = memo(() => (
  <div className="h-full flex flex-col">
    <StatRow label="Active Demos" value="8" color={COLORS.purple} />
    <StatRow label="Live Software" value="14" color={COLORS.success} />
    <StatRow label="Conversion Rate" value="42%" color={COLORS.info} />
    <StatRow label="Demo Requests" value="12" color={COLORS.warning} />
    <StatRow label="Scheduled" value="5" color={COLORS.cyan} />
  </div>
));
Box12Demo.displayName = 'Box12Demo';

// ===== BOX 13: FINANCE OVERVIEW =====
const Box13Finance = memo(() => (
  <div className="h-full flex flex-col">
    <StatRow label="Wallet Balance" value="₹8.5L" color={COLORS.success} />
    <StatRow label="Payout Status" value="Processed" color={COLORS.success} />
    <StatRow label="Monthly Inflow" value="₹24.3L" color={COLORS.success} />
    <StatRow label="Monthly Outflow" value="₹12.1L" color={COLORS.warning} />
    <StatRow label="Net Profit" value="+₹12.2L" color={COLORS.success} />
  </div>
));
Box13Finance.displayName = 'Box13Finance';

// ===== BOX 14: ALERT SUMMARY (CLICK → FULL ALERT PAGE) =====
const Box14Alerts = memo(() => (
  <div className="h-full flex flex-col">
    <div className="flex items-center justify-between py-2 border-b border-white/5">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-red-400" />
        <span className="text-sm text-white/60">Critical</span>
      </div>
      <span className="text-lg font-bold text-red-400">0</span>
    </div>
    <div className="flex items-center justify-between py-2 border-b border-white/5">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-amber-400" />
        <span className="text-sm text-white/60">Warning</span>
      </div>
      <span className="text-lg font-bold text-amber-400">3</span>
    </div>
    <div className="flex items-center justify-between py-2 border-b border-white/5">
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-blue-400" />
        <span className="text-sm text-white/60">Info</span>
      </div>
      <span className="text-lg font-bold text-blue-400">7</span>
    </div>
    <div className="mt-auto pt-2 text-center">
      <button className="text-xs text-white/40 hover:text-white/80 transition-colors cursor-pointer">
        View All Alerts →
      </button>
    </div>
  </div>
));
Box14Alerts.displayName = 'Box14Alerts';

// ===== GRID BOX DEFINITIONS (LOCKED ORDER - DO NOT CHANGE) =====
const GRID_BOXES: { id: string; title: string; icon: React.ElementType; color: string; Component: React.FC }[] = [
  // ROW 1
  { id: 'key-stats', title: 'Key Stats', icon: TrendingUp, color: COLORS.success, Component: Box1KeyStats },
  { id: 'system-health', title: 'System Health', icon: Server, color: COLORS.success, Component: Box2SystemHealth },
  // ROW 2
  { id: 'live-activity', title: 'Live Activity', icon: Activity, color: COLORS.info, Component: Box3LiveActivity },
  { id: 'approvals', title: 'Approvals / Degree', icon: FileCheck, color: COLORS.warning, Component: Box4Approvals },
  // ROW 3
  { id: 'ceo-overview', title: 'CEO Overview', icon: Eye, color: COLORS.purple, Component: Box5CEOOverview },
  { id: 'vala-ai', title: 'VALA AI Status', icon: Brain, color: COLORS.cyan, Component: Box6ValaAI },
  // ROW 4
  { id: 'server-mgmt', title: 'Server Management', icon: Cpu, color: '#64748b', Component: Box7Server },
  { id: 'continent-country', title: 'Continent / Country', icon: Globe2, color: COLORS.info, Component: Box8ContinentCountry },
  // ROW 5
  { id: 'franchise', title: 'Franchise Summary', icon: Building2, color: '#0ea5e9', Component: Box9Franchise },
  { id: 'sales-support', title: 'Sales & Support', icon: Headphones, color: COLORS.success, Component: Box10SalesSupport },
  // ROW 6
  { id: 'product-mgr', title: 'Product Manager', icon: Box, color: COLORS.purple, Component: Box11Product },
  { id: 'demo-status', title: 'Demo / Live Software', icon: Terminal, color: '#6366f1', Component: Box12Demo },
  // ROW 7
  { id: 'finance', title: 'Finance Overview', icon: DollarSign, color: COLORS.success, Component: Box13Finance },
  { id: 'alerts', title: 'Alert Summary', icon: AlertTriangle, color: COLORS.warning, Component: Box14Alerts },
];

// ===== UNIFORM BOX COMPONENT =====
const UniformBox = memo<{ box: typeof GRID_BOXES[number]; index: number }>(({ box, index }) => {
  const Icon = box.icon;
  const Content = box.Component;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.15 }}
      className={cn(
        BOX_HEIGHT,
        "rounded-xl p-4 flex flex-col transition-all duration-150"
      )}
      style={{
        background: COLORS.cardBg,
        border: `1px solid ${COLORS.cardBorder}`,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.cardBorderHover; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.cardBorder; }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-3 mb-2 border-b border-white/10 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${box.color}20` }}>
          <Icon className="w-4 h-4" style={{ color: box.color }} />
        </div>
        <h3 className="text-sm font-semibold text-white">{box.title}</h3>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Content />
      </div>
    </motion.div>
  );
});
UniformBox.displayName = 'UniformBox';

// ===== MAIN DASHBOARD - EXACT 2×7 GRID STRUCTURE =====
export const ControlPanelDashboard = memo(() => {
  return (
    <div className="flex-1 h-full overflow-auto" style={{ background: COLORS.bg }}>
      {/* Header */}
      <div className="p-5 pb-3 flex items-center justify-between sticky top-0 z-10" style={{ background: COLORS.bg }}>
        <div>
          <h1 className="text-xl font-bold text-white">Master Control Panel</h1>
          <p className="text-xs text-white/50 mt-0.5">Boss / Owner • 2×7 Grid Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400">LIVE</span>
          </div>
        </div>
      </div>

      {/* 2×7 GRID - EXACT STRUCTURE - 14 UNIFORM BOXES */}
      <div className="px-5 pb-5">
        <div className="grid grid-cols-2 gap-4">
          {GRID_BOXES.map((box, index) => (
            <UniformBox key={box.id} box={box} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
});

ControlPanelDashboard.displayName = 'ControlPanelDashboard';
export default ControlPanelDashboard;
