// ============================================
// OVERVIEW — VERCEL CLONE DASHBOARD
// Clean, minimal, data-dense
// ============================================
import { useEffect, useState } from 'react';
import { 
  Server, Activity, Clock, AlertTriangle, Wifi, WifiOff, RefreshCw,
  CheckCircle2, ArrowUpRight, GitBranch, Rocket, Globe, Zap,
  TrendingUp, TrendingDown, ExternalLink, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useServerDashboard } from '@/hooks/useServerRealtime';
import { supabase } from '@/integrations/supabase/client';

const SMOverview = () => {
  const { summary, loading, refresh } = useServerDashboard(5000);
  const [recentAlerts, setRecentAlerts] = useState<Array<{
    id: string; message: string; severity: string; created_at: string;
  }>>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const { data } = await supabase
        .from('server_alerts')
        .select('id, message, severity, created_at')
        .eq('is_resolved', false)
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) setRecentAlerts(data);
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Servers', value: summary.total_servers, change: '+0', trend: 'up' },
    { label: 'Online', value: summary.online, change: '100%', trend: 'up' },
    { label: 'CPU Avg', value: `${Math.round(summary.avg_cpu)}%`, change: summary.avg_cpu > 70 ? 'High' : 'Normal', trend: summary.avg_cpu > 70 ? 'down' : 'up' },
    { label: 'Memory', value: `${Math.round(summary.avg_ram)}%`, change: summary.avg_ram > 80 ? 'Critical' : 'OK', trend: summary.avg_ram > 80 ? 'down' : 'up' },
  ];

  const recentDeploys = [
    { name: 'softwarewala.net', status: 'ready', branch: 'main', time: '2m ago', commit: 'a3f8c21' },
    { name: 'client-demo.softwarewala.net', status: 'ready', branch: 'main', time: '1h ago', commit: 'c1e9f67' },
    { name: 'api.softwarewala.net', status: 'error', branch: 'hotfix/cors', time: '3h ago', commit: 'e4a1b89' },
  ];

  const quickLinks = [
    { label: 'softwarewala.net', status: 'live', url: 'https://softwarewala.net' },
    { label: 'srv1183368.hstgr.cloud', status: 'live', url: '#' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Overview</h1>
          <p className="text-sm text-[#888] mt-1">Infrastructure health and recent activity</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-[#555]">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={refresh}
            disabled={loading}
            className="border-[#333] bg-transparent text-[#888] hover:text-white hover:bg-[#222] h-8 text-xs"
          >
            <RefreshCw className={`w-3 h-3 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Status Banner */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[#222] bg-[#0a0a0a]">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        <span className="text-sm text-[#ccc]">All systems operational</span>
        <span className="text-xs text-[#555] ml-auto">Updated just now</span>
      </div>

      {/* Stats Grid — Vercel Style */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            className="p-5 rounded-lg border border-[#222] bg-[#0a0a0a] hover:border-[#333] transition-colors"
          >
            <p className="text-xs text-[#888] uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-end justify-between mt-2">
              <p className="text-3xl font-bold text-white tabular-nums">
                {loading ? '—' : stat.value}
              </p>
              <span className={`flex items-center gap-1 text-xs ${
                stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-5 gap-6">
        {/* Recent Deployments — 3 cols */}
        <div className="col-span-3 border border-[#222] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[#222] flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Recent Deployments</h3>
            <button className="text-xs text-[#888] hover:text-white flex items-center gap-1 transition-colors">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {recentDeploys.map((deploy, i) => (
            <div 
              key={i} 
              className={`flex items-center gap-4 px-5 py-3.5 hover:bg-[#111] transition-colors ${
                i < recentDeploys.length - 1 ? 'border-b border-[#1a1a1a]' : ''
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${
                deploy.status === 'ready' ? 'text-emerald-500' : 'text-red-400'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{deploy.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1 text-xs text-[#666]">
                    <GitBranch className="w-3 h-3" /> {deploy.branch}
                  </span>
                  <span className="text-xs text-[#444] font-mono">{deploy.commit}</span>
                </div>
              </div>
              <span className="text-xs text-[#555]">{deploy.time}</span>
            </div>
          ))}
        </div>

        {/* Quick Links + Alerts — 2 cols */}
        <div className="col-span-2 space-y-4">
          {/* Domains */}
          <div className="border border-[#222] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#222]">
              <h3 className="text-sm font-medium text-white">Domains</h3>
            </div>
            {quickLinks.map((link, i) => (
              <div 
                key={i}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-[#111] transition-colors ${
                  i < quickLinks.length - 1 ? 'border-b border-[#1a1a1a]' : ''
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-[#666]" />
                <span className="text-sm text-[#ccc] flex-1">{link.label}</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <ArrowUpRight className="w-3 h-3 text-[#555]" />
              </div>
            ))}
          </div>

          {/* Active Alerts */}
          <div className="border border-[#222] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Alerts</h3>
              {recentAlerts.length > 0 && (
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-red-500/20 text-red-400">
                  {recentAlerts.length}
                </span>
              )}
            </div>
            {recentAlerts.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-[#555]">No active alerts</p>
              </div>
            ) : (
              recentAlerts.slice(0, 3).map((alert, i) => (
                <div 
                  key={alert.id}
                  className={`flex items-start gap-3 px-4 py-3 ${
                    i < Math.min(recentAlerts.length, 3) - 1 ? 'border-b border-[#1a1a1a]' : ''
                  }`}
                >
                  <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                    alert.severity === 'critical' ? 'text-red-400' : 'text-amber-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#ccc] truncate">{alert.message}</p>
                    <p className="text-[10px] text-[#555] mt-0.5">
                      {new Date(alert.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Resource Bars */}
          <div className="border border-[#222] rounded-lg p-4 space-y-4">
            <h3 className="text-sm font-medium text-white">Resources</h3>
            {[
              { label: 'CPU', value: summary.avg_cpu, color: '#3b82f6' },
              { label: 'Memory', value: summary.avg_ram, color: '#8b5cf6' },
              { label: 'Disk', value: 45, color: '#10b981' },
            ].map(r => (
              <div key={r.label} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888]">{r.label}</span>
                  <span className={`font-mono ${
                    r.value > 80 ? 'text-red-400' : 'text-[#888]'
                  }`}>{Math.round(r.value)}%</span>
                </div>
                <div className="h-1.5 bg-[#222] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, r.value)}%`, backgroundColor: r.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMOverview;
