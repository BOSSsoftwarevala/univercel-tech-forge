import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { callEdgeRoute } from '@/lib/api/edge-client';
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

interface DashboardMetrics {
  totalResellers: number;
  activeResellers: number;
  pendingApprovals: number;
  totalRevenue: number;
  payoutRequests: number;
  unreadNotifications: number;
}

interface DashboardResponse {
  scope: 'manager';
  metrics: DashboardMetrics;
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
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  const fetchDashboard = async () => {
    const response = await callEdgeRoute<DashboardResponse>('api-reseller', 'dashboard');
    setMetrics(response.data.metrics);
  };

  useEffect(() => {
    void fetchDashboard().catch((error) => {
      console.error('Failed to load reseller dashboard metrics', error);
      toast.error('Failed to load reseller dashboard');
    });
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    toast.loading('Refreshing data...', { id: 'refresh' });
    try {
      await fetchDashboard();
      toast.success('Dashboard data refreshed', { id: 'refresh' });
    } catch (error) {
      console.error('Failed to refresh reseller dashboard', error);
      toast.error('Refresh failed', { id: 'refresh' });
    } finally {
      setRefreshing(false);
    }
  };

  const atRiskResellers = metrics
    ? Math.max(metrics.totalResellers - metrics.activeResellers - metrics.pendingApprovals, 0)
    : '...';

  const kpiData = [
    {
      title: 'Total Resellers',
      value: metrics?.totalResellers ?? '...',
      icon: Users,
      color: 'blue',
      trend: metrics ? `${metrics.pendingApprovals} pending approvals` : undefined,
      section: 'all-resellers' as ResellerManagerSection,
    },
    {
      title: 'Active Resellers',
      value: metrics?.activeResellers ?? '...',
      icon: UserCheck,
      color: 'emerald',
      trend: metrics && metrics.totalResellers > 0
        ? `${Math.round((metrics.activeResellers / metrics.totalResellers) * 100)}%`
        : undefined,
      section: 'all-resellers' as ResellerManagerSection,
    },
    {
      title: 'At-Risk Resellers',
      value: atRiskResellers,
      icon: AlertTriangle,
      color: 'amber',
      section: 'issues' as ResellerManagerSection,
    },
    {
      title: 'Pending Payouts',
      value: metrics?.payoutRequests ?? '...',
      icon: Clock,
      color: 'purple',
      section: 'commissions' as ResellerManagerSection,
    },
    {
      title: 'Open Issues',
      value: metrics?.unreadNotifications ?? '...',
      icon: AlertCircle,
      color: 'red',
      section: 'issues' as ResellerManagerSection,
    },
    {
      title: 'Monthly Revenue',
      value: metrics ? `₹${(metrics.totalRevenue / 100000).toFixed(1)}L` : '...',
      icon: TrendingUp,
      color: 'cyan',
      trend: metrics ? 'Live order revenue' : undefined,
      section: 'performance' as ResellerManagerSection,
    },
  ];

  const handleKPIClick = (section: ResellerManagerSection, title: string) => {
    toast.info(`Navigating to ${title}`);
    onNavigate(section);
  };

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">AI Insights Ready</h3>
                <p className="text-sm text-slate-400">Unread alerts: {metrics?.unreadNotifications ?? '...'}</p>
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
                <p className="text-sm text-slate-400">{metrics?.payoutRequests ?? '...'} payouts awaiting</p>
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
                <p className="text-sm text-slate-400">{metrics?.unreadNotifications ?? '...'} alerts need review</p>
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