/**
 * RESELLER DASHBOARD HOME - WHMCS STYLE
 * KPI cards, alerts, recent activity
 */
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp, Users, DollarSign, ShoppingCart, Percent, Clock,
  ArrowUpRight, ArrowDownRight, Bell, Activity, AlertTriangle
} from 'lucide-react';
import type { ResellerView } from '../ResellerWHMCSSidebar';

const WHMCS = {
  blue: '#4e73df',
  green: '#1cc88a',
  red: '#e74a3b',
  yellow: '#f6c23e',
  teal: '#36b9cc',
  dark: '#1a1f36',
  gray: '#858796',
  lightBg: '#f8f9fc',
  border: '#e3e6f0',
};

interface Props {
  activeView: string;
  onNavigate: (view: ResellerView) => void;
}

const kpiCards = [
  { id: 'total_sales', label: 'Total Sales', value: '₹0', icon: DollarSign, color: WHMCS.blue, section: 'sales_overview' as ResellerView },
  { id: 'total_commission', label: 'Total Commission', value: '₹0', icon: Percent, color: WHMCS.green, section: 'comm_overview' as ResellerView },
  { id: 'pending_payout', label: 'Pending Payout', value: '₹0', icon: Clock, color: WHMCS.yellow, section: 'pay_balance' as ResellerView },
  { id: 'active_clients', label: 'Active Clients', value: '0', icon: Users, color: WHMCS.teal, section: 'cli_active' as ResellerView },
  { id: 'total_orders', label: 'Total Orders', value: '0', icon: ShoppingCart, color: WHMCS.blue, section: 'ord_all' as ResellerView },
  { id: 'monthly_growth', label: 'Monthly Growth', value: '0%', icon: TrendingUp, color: WHMCS.green, section: 'rpt_performance' as ResellerView },
];

export default function ResellerWHMCSDashboard({ activeView, onNavigate }: Props) {
  if (activeView === 'dash_kpis') {
    return (
      <div className="space-y-4">
        <h2 className="text-[18px] font-bold" style={{ color: WHMCS.dark }}>KPI Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpiCards.map(kpi => (
            <KPICard key={kpi.id} {...kpi} onClick={() => onNavigate(kpi.section)} />
          ))}
        </div>
      </div>
    );
  }

  if (activeView === 'dash_alerts') {
    return (
      <div className="space-y-4">
        <h2 className="text-[18px] font-bold" style={{ color: WHMCS.dark }}>Alerts & Notifications</h2>
        <EmptyState icon={Bell} message="No new alerts" />
      </div>
    );
  }

  if (activeView === 'dash_activity') {
    return (
      <div className="space-y-4">
        <h2 className="text-[18px] font-bold" style={{ color: WHMCS.dark }}>Recent Activity</h2>
        <EmptyState icon={Activity} message="No recent activity" />
      </div>
    );
  }

  // Default: dash_overview
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[20px] font-bold" style={{ color: WHMCS.dark }}>Dashboard</h2>
        <p className="text-[13px] mt-1" style={{ color: WHMCS.gray }}>Welcome back to your reseller control panel</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {kpiCards.map(kpi => (
          <KPICard key={kpi.id} {...kpi} onClick={() => onNavigate(kpi.section)} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickCard title="Pending Orders" count={0} color={WHMCS.yellow} onClick={() => onNavigate('ord_pending')} />
        <QuickCard title="Open Tickets" count={0} color={WHMCS.red} onClick={() => onNavigate('sup_tickets')} />
        <QuickCard title="Payout Requests" count={0} color={WHMCS.green} onClick={() => onNavigate('pay_request')} />
      </div>

      {/* Recent Activity */}
      <Card className="border shadow-sm" style={{ borderColor: WHMCS.border }}>
        <CardContent className="p-6">
          <h3 className="text-[15px] font-semibold mb-4" style={{ color: WHMCS.dark }}>Recent Activity</h3>
          <EmptyState icon={Activity} message="No recent activity yet" />
        </CardContent>
      </Card>
    </div>
  );
}

function KPICard({ label, value, icon: Icon, color, onClick }: {
  label: string; value: string; icon: React.ElementType; color: string; onClick: () => void;
}) {
  return (
    <Card
      className="border cursor-pointer hover:shadow-md transition-shadow"
      style={{ borderColor: WHMCS.border, borderLeft: `4px solid ${color}` }}
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color }}>{label}</div>
          <div className="text-[22px] font-bold mt-1" style={{ color: WHMCS.dark }}>{value}</div>
        </div>
        <Icon className="w-8 h-8 opacity-20" style={{ color: WHMCS.gray }} />
      </CardContent>
    </Card>
  );
}

function QuickCard({ title, count, color, onClick }: { title: string; count: number; color: string; onClick: () => void }) {
  return (
    <Card className="border cursor-pointer hover:shadow-md transition-shadow" style={{ borderColor: WHMCS.border }} onClick={onClick}>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <div className="text-[13px] font-medium" style={{ color: WHMCS.dark }}>{title}</div>
          <div className="text-[24px] font-bold" style={{ color }}>{count}</div>
        </div>
        <ArrowUpRight className="w-5 h-5" style={{ color: WHMCS.gray }} />
      </CardContent>
    </Card>
  );
}

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="w-12 h-12 mb-3 opacity-20" style={{ color: WHMCS.gray }} />
      <p className="text-[13px]" style={{ color: WHMCS.gray }}>{message}</p>
    </div>
  );
}
