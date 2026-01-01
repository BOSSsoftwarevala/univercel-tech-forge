import { useEffect, useState } from 'react';
import { Server, Activity, Clock, AlertTriangle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useServerDashboard } from '@/hooks/useServerRealtime';
import { supabase } from '@/integrations/supabase/client';

const SMOverview = () => {
  const { summary, loading, refresh } = useServerDashboard(5000);
  const [recentAlerts, setRecentAlerts] = useState<Array<{
    id: string;
    message: string;
    severity: string;
    created_at: string;
  }>>([]);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Fetch recent alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      const { data } = await supabase
        .from('server_alerts')
        .select('id, message, severity, created_at')
        .eq('is_resolved', false)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (data) setRecentAlerts(data);
      setLastUpdate(new Date());
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Total Servers', value: summary.total_servers.toString(), icon: Server, color: 'text-blue-600' },
    { label: 'Online', value: summary.online.toString(), icon: Activity, color: 'text-green-600' },
    { label: 'Offline', value: summary.offline.toString(), icon: WifiOff, color: 'text-red-600' },
    { label: 'Warnings', value: summary.warnings.toString(), icon: AlertTriangle, color: 'text-yellow-600' },
    { label: 'Critical Alerts', value: summary.critical_alerts.toString(), icon: AlertTriangle, color: 'text-red-600' },
  ];

  const resourceData = [
    { label: 'CPU', value: summary.avg_cpu, color: 'bg-cyan-500' },
    { label: 'RAM', value: summary.avg_ram, color: 'bg-purple-500' },
    { label: 'Network In', value: Math.min(100, summary.network_throughput.in / 10), color: 'bg-green-500' },
    { label: 'Network Out', value: Math.min(100, summary.network_throughput.out / 5), color: 'bg-orange-500' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-stone-800">Live Overview</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-stone-500">
            {isAutoRefresh ? (
              <Wifi className="w-4 h-4 text-green-500 animate-pulse" />
            ) : (
              <WifiOff className="w-4 h-4 text-stone-400" />
            )}
            <span>Auto-refresh {isAutoRefresh ? 'ON' : 'OFF'}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refresh();
              setLastUpdate(new Date());
            }}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant={isAutoRefresh ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
          >
            {isAutoRefresh ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </div>

      {lastUpdate && (
        <p className="text-xs text-stone-400">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </p>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5 bg-white rounded-xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-stone-500 mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>
                  {loading ? '...' : stat.value}
                </p>
              </div>
              <div className="w-10 h-10 bg-stone-50 rounded-lg flex items-center justify-center">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resource Heatmap */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Resource Utilization (Live)</h3>
        <div className="grid grid-cols-4 gap-6">
          {resourceData.map((res) => (
            <div key={res.label} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-stone-600">{res.label}</span>
                <span className={`text-sm font-bold ${
                  res.value > 80 ? 'text-red-600' : res.value > 60 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {loading ? '...' : `${Math.round(res.value)}%`}
                </span>
              </div>
              <div className="h-4 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${res.color} rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(100, res.value)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Recent Alerts</h3>
        {recentAlerts.length === 0 ? (
          <p className="text-stone-500 text-sm">No active alerts</p>
        ) : (
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${getSeverityColor(alert.severity)}`} />
                  <span className="text-sm text-stone-700">{alert.message}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                    {alert.severity}
                  </Badge>
                  <span className="text-xs text-stone-400">
                    {new Date(alert.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-stone-500">
        🔄 Real-time data — Auto-refreshing every 5 seconds
      </p>
    </div>
  );
};

export default SMOverview;
