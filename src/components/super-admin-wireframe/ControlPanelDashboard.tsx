/**
 * CONTROL PANEL DASHBOARD - 2×7 GRID LAYOUT
 * 14 boxes total, 2 columns × 7 rows
 * LOCKED STRUCTURE - NO CHANGES WITHOUT APPROVAL
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
  Zap,
  Clock,
} from "lucide-react";

// ===== LOCKED COLORS: Same as Sidebar Theme =====
const DASHBOARD_COLORS = {
  bg: '#0d1b2a',
  cardBg: 'rgba(15, 30, 50, 0.8)',
  cardBorder: 'rgba(30, 58, 95, 0.5)',
  cardBorderHover: 'rgba(37, 99, 235, 0.4)',
  text: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.7)',
  accent: '#2563eb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};

// ===== GRID BOX DEFINITIONS (2×7 = 14 boxes) =====
const GRID_BOXES = [
  // ROW 1
  { id: 'key-stats', title: 'Key Stats', subtitle: 'Revenue / Users', icon: TrendingUp, color: DASHBOARD_COLORS.success },
  { id: 'system-health', title: 'System Health', subtitle: 'Running / AI Active', icon: Server, color: DASHBOARD_COLORS.success },
  // ROW 2
  { id: 'live-activity', title: 'Live Activity', subtitle: 'Real-time Feed', icon: Activity, color: DASHBOARD_COLORS.accent },
  { id: 'approvals', title: 'Approvals Queue', subtitle: 'Degree / Permissions', icon: CheckCircle, color: DASHBOARD_COLORS.warning },
  // ROW 3
  { id: 'ceo-overview', title: 'CEO Overview', subtitle: 'Executive Summary', icon: Eye, color: '#8b5cf6' },
  { id: 'vala-ai', title: 'VALA AI Status', subtitle: 'Tasks & Processing', icon: Brain, color: '#06b6d4' },
  // ROW 4
  { id: 'server-status', title: 'Server Status', subtitle: 'Infrastructure', icon: Server, color: '#64748b' },
  { id: 'continent-country', title: 'Continent / Country', subtitle: 'Regional Control', icon: Globe2, color: '#3b82f6' },
  // ROW 5
  { id: 'franchise-summary', title: 'Franchise Summary', subtitle: 'Partner Overview', icon: Building2, color: '#0ea5e9' },
  { id: 'sales-support', title: 'Sales & Support', subtitle: 'Performance Stats', icon: Headphones, color: '#22c55e' },
  // ROW 6
  { id: 'product-manager', title: 'Product Manager', subtitle: 'Development Status', icon: Box, color: '#a855f7' },
  { id: 'demo-status', title: 'Demo / Live Software', subtitle: 'Deployment Status', icon: Terminal, color: '#6366f1' },
  // ROW 7
  { id: 'finance-revenue', title: 'Finance / Revenue', subtitle: 'Cash Flow', icon: DollarSign, color: '#10b981' },
  { id: 'alerts-summary', title: 'Alerts Summary', subtitle: 'System Notifications', icon: AlertTriangle, color: '#f59e0b' },
] as const;

// ===== MOCK DATA FOR BOXES =====
const getMockData = (boxId: string) => {
  switch (boxId) {
    case 'key-stats':
      return { primary: '₹24.5L', secondary: '1,247 Users', trend: '+12%' };
    case 'system-health':
      return { primary: 'Healthy', secondary: 'AI: Active', status: 'online' };
    case 'live-activity':
      return { 
        items: [
          { text: 'New lead registered', time: '2m ago' },
          { text: 'Task #4521 completed', time: '5m ago' },
          { text: 'Server backup done', time: '12m ago' },
        ]
      };
    case 'approvals':
      return { pending: 5, priority: 2, text: 'Pending Approvals' };
    case 'ceo-overview':
      return { primary: 'On Track', secondary: 'Q4 Goals: 78%' };
    case 'vala-ai':
      return { primary: '156', secondary: 'Tasks Processed', status: 'active' };
    case 'server-status':
      return { primary: '99.9%', secondary: 'Uptime', servers: 8 };
    case 'continent-country':
      return { continents: 4, countries: 12, active: 'Asia' };
    case 'franchise-summary':
      return { total: 24, active: 22, pending: 2 };
    case 'sales-support':
      return { sales: '₹8.2L', tickets: 34, resolved: 89 };
    case 'product-manager':
      return { inProgress: 6, completed: 12, backlog: 8 };
    case 'demo-status':
      return { live: 3, staging: 2, demos: 15 };
    case 'finance-revenue':
      return { revenue: '₹42.3L', expenses: '₹18.1L', profit: '+58%' };
    case 'alerts-summary':
      return { critical: 0, warnings: 3, info: 7 };
    default:
      return { primary: '--', secondary: 'No Data' };
  }
};

// ===== SINGLE GRID BOX COMPONENT =====
const GridBox = memo<{
  box: typeof GRID_BOXES[number];
  index: number;
}>(({ box, index }) => {
  const Icon = box.icon;
  const data = getMockData(box.id);

  const renderContent = () => {
    if (box.id === 'live-activity' && 'items' in data) {
      return (
        <div className="space-y-2 mt-2">
          {data.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-white/80 truncate flex-1">{item.text}</span>
              <span className="text-white/50 text-xs ml-2">{item.time}</span>
            </div>
          ))}
        </div>
      );
    }

    if (box.id === 'approvals' && 'pending' in data) {
      return (
        <div className="mt-2">
          <div className="text-3xl font-bold text-white">{data.pending}</div>
          <div className="text-sm text-white/60">{data.text}</div>
          {data.priority > 0 && (
            <div className="mt-2 flex items-center gap-2 text-amber-400 text-sm">
              <Zap className="w-4 h-4" />
              <span>{data.priority} High Priority</span>
            </div>
          )}
        </div>
      );
    }

    if (box.id === 'alerts-summary' && 'critical' in data) {
      return (
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-red-400 text-sm">Critical</span>
            <span className="text-white font-semibold">{data.critical}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-amber-400 text-sm">Warnings</span>
            <span className="text-white font-semibold">{data.warnings}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-400 text-sm">Info</span>
            <span className="text-white font-semibold">{data.info}</span>
          </div>
        </div>
      );
    }

    // Default layout for most boxes
    return (
      <div className="mt-2">
        {'primary' in data && (
          <div className="text-2xl font-bold text-white">{data.primary}</div>
        )}
        {'secondary' in data && (
          <div className="text-sm text-white/60">{data.secondary}</div>
        )}
        {'trend' in data && (
          <div className="mt-1 text-sm text-emerald-400">{data.trend}</div>
        )}
        {'status' in data && (
          <div className="mt-1 flex items-center gap-2">
            <span className={cn(
              "w-2 h-2 rounded-full",
              data.status === 'online' || data.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
            )} />
            <span className="text-xs text-white/60 capitalize">{data.status}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className="rounded-xl p-5 transition-all duration-200 hover:scale-[1.01] cursor-pointer"
      style={{
        background: DASHBOARD_COLORS.cardBg,
        border: `1px solid ${DASHBOARD_COLORS.cardBorder}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = DASHBOARD_COLORS.cardBorderHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = DASHBOARD_COLORS.cardBorder;
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${box.color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color: box.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white truncate">{box.title}</h3>
          <p className="text-xs text-white/50 truncate">{box.subtitle}</p>
        </div>
        <Clock className="w-4 h-4 text-white/30" />
      </div>

      {/* Content */}
      {renderContent()}
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Control Panel Dashboard</h1>
        <p className="text-white/60 text-sm mt-1">System Overview • 2×7 Grid Layout</p>
      </div>

      {/* 2×7 GRID - 14 BOXES */}
      <div className="grid grid-cols-2 gap-4">
        {GRID_BOXES.map((box, index) => (
          <GridBox key={box.id} box={box} index={index} />
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-6 text-center text-white/40 text-xs">
        Click any role in sidebar to access detailed dashboard
      </div>
    </div>
  );
});

ControlPanelDashboard.displayName = 'ControlPanelDashboard';

export default ControlPanelDashboard;
