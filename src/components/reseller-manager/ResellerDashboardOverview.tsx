import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useGlobalActions } from '@/hooks/useGlobalActions';
import {
  Users,
  UserCheck,
  AlertTriangle,
  Clock,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import type { ResellerManagerSection } from './ResellerManagerSidebar';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  trend?: string;
  onClick: () => void;
}

function KPICard({ title, value, icon: Icon, color, trend, onClick }: KPICardProps) {
  return (
    <Card 
      className={`bg-slate-900/50 border-${color}-500/20 cursor-pointer hover:bg-slate-800/50 transition-all hover:scale-[1.02]`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg bg-${color}-500/20 flex items-center justify-center`}>
              <Icon className={`w-6 h-6 text-${color}-400`} />
            </div>
            <div>
              <div className="text-3xl font-bold text-white">{value}</div>
              <div className="text-xs text-slate-400">{title}</div>
            </div>
          </div>
          {trend && (
            <Badge variant="outline" className={`text-${color}-400 border-${color}-500/30`}>
              {trend}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ResellerDashboardOverviewProps {
  onNavigate: (section: ResellerManagerSection) => void;
}

export function ResellerDashboardOverview({ onNavigate }: ResellerDashboardOverviewProps) {
  const { logToAudit } = useGlobalActions();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await logToAudit('refresh_dashboard', 'reseller', { section: 'overview' });
    toast.loading('Refreshing data...', { id: 'refresh' });
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Dashboard data refreshed', { id: 'refresh' });
    setRefreshing(false);
  };

  const kpiData = [
    { title: 'Total Resellers', value: 247, icon: Users, color: 'blue', trend: '+12 this month', section: 'all-resellers' as ResellerManagerSection },
    { title: 'Active Resellers', value: 198, icon: UserCheck, color: 'emerald', trend: '80%', section: 'all-resellers' as ResellerManagerSection },
    { title: 'At-Risk Resellers', value: 14, icon: AlertTriangle, color: 'amber', section: 'issues' as ResellerManagerSection },
    { title: 'Pending Payouts', value: '₹4.2L', icon: Clock, color: 'purple', section: 'commissions' as ResellerManagerSection },
    { title: 'Open Issues', value: 23, icon: AlertCircle, color: 'red', section: 'issues' as ResellerManagerSection },
    { title: 'Monthly Revenue', value: '₹18.5L', icon: TrendingUp, color: 'cyan', trend: '+15%', section: 'performance' as ResellerManagerSection },
  ];

  const handleKPIClick = async (section: ResellerManagerSection, title: string) => {
    await logToAudit('kpi_click', 'reseller', { section, kpi: title });
    toast.info(`Navigating to ${title}`);
    onNavigate(section);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reseller Control Panel</h1>
          <p className="text-sm text-slate-400">Real-time overview of your reseller network</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiData.map((kpi) => (
          <KPICard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            color={kpi.color}
            trend={kpi.trend}
            onClick={() => handleKPIClick(kpi.section, kpi.title)}
          />
        ))}
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">AI Insights Ready</h3>
                <p className="text-sm text-slate-400">3 new recommendations</p>
              </div>
              <Button size="sm" onClick={() => onNavigate('ai-insights')} className="gap-1">
                View <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Pending Approvals</h3>
                <p className="text-sm text-slate-400">5 payouts awaiting</p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => onNavigate('commissions')} className="gap-1">
                Review <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Critical Escalations</h3>
                <p className="text-sm text-slate-400">2 need immediate attention</p>
              </div>
              <Button size="sm" variant="destructive" onClick={() => onNavigate('issues')} className="gap-1">
                Handle <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ResellerDashboardOverview;
