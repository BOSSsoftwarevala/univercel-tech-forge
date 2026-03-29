import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  Globe2, Users, Server, DollarSign, AlertTriangle, TrendingUp, Activity, RefreshCw, ShieldCheck, Radar, Loader2, Wrench
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { globalCommandApi, type GlobalActivityResponse, type GlobalMapResponse, type GlobalStatsResponse } from "@/lib/api/global-command";

export const UnifiedOverview = () => {
  const [stats, setStats] = useState<GlobalStatsResponse | null>(null);
  const [mapData, setMapData] = useState<GlobalMapResponse | null>(null);
  const [activity, setActivity] = useState<GlobalActivityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selfHealing, setSelfHealing] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [statsResponse, mapResponse, activityResponse] = await Promise.all([
        globalCommandApi.getStats(),
        globalCommandApi.getMap(),
        globalCommandApi.getActivity(),
      ]);
      setStats(statsResponse);
      setMapData(mapResponse);
      setActivity(activityResponse);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load global command center');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
    const intervalId = window.setInterval(() => {
      void loadDashboard();
    }, 30000);
    return () => window.clearInterval(intervalId);
  }, []);

  const runSelfHeal = async () => {
    try {
      setSelfHealing(true);
      const response = await globalCommandApi.runSelfHeal();
      toast.success(`Self-heal completed: ${response.healed} repair action(s) executed.`);
      await loadDashboard();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Self-heal failed');
    } finally {
      setSelfHealing(false);
    }
  };

  const formatRelativeTime = (value: string) => {
    const diffMinutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000));
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;
    return `${Math.round(diffHours / 24)} day ago`;
  };

  const statCards = stats ? [
    { label: 'Continents', value: stats.continents.toLocaleString(), icon: Globe2, accent: 'text-cyan-300 border-cyan-500/20 bg-cyan-500/10' },
    { label: 'Countries', value: stats.countries.toLocaleString(), icon: Radar, accent: 'text-sky-300 border-sky-500/20 bg-sky-500/10' },
    { label: 'Live Users', value: stats.users.toLocaleString(), icon: Users, accent: 'text-emerald-300 border-emerald-500/20 bg-emerald-500/10' },
    { label: 'Revenue', value: `₹${Math.round(stats.revenue).toLocaleString()}`, icon: DollarSign, accent: 'text-green-300 border-green-500/20 bg-green-500/10' },
    { label: 'Sales', value: stats.sales.toLocaleString(), icon: TrendingUp, accent: 'text-amber-300 border-amber-500/20 bg-amber-500/10' },
    { label: 'System Health', value: `${stats.system_health}%`, icon: ShieldCheck, accent: 'text-violet-300 border-violet-500/20 bg-violet-500/10' },
    { label: 'Servers Online', value: `${stats.servers.online}/${stats.servers.total}`, icon: Server, accent: 'text-red-300 border-red-500/20 bg-red-500/10' },
    { label: 'Open Alerts', value: stats.alerts.toLocaleString(), icon: AlertTriangle, accent: 'text-orange-300 border-orange-500/20 bg-orange-500/10' },
  ] : [];

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-slate-700/50 bg-slate-900/40">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Global Command Center</h1>
          <p className="text-muted-foreground">World control, real-time visibility, and self-heal orchestration across the full ecosystem</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10" onClick={() => void loadDashboard()}>
            <RefreshCw className="mr-1 h-4 w-4" /> Refresh
          </Button>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => void runSelfHeal()} disabled={selfHealing}>
            {selfHealing ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Wrench className="mr-1 h-4 w-4" />} Self-Heal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className={`border ${stat.accent} transition-all bg-slate-900/60`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-xl font-bold text-white">{stat.value}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-white/10 text-white/80">
                    live
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="bg-slate-900/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-cyan-400" />
              World Heatmap and Region Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {mapData?.regions.map((region) => (
                <div key={region.continent} className="rounded-xl border border-slate-700/50 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-white">{region.continent}</h3>
                      <p className="text-xs text-slate-400">Heat {region.heat}</p>
                    </div>
                    <Badge variant="outline" className={region.health >= 90 ? 'border-emerald-500/30 text-emerald-300' : region.health >= 75 ? 'border-amber-500/30 text-amber-300' : 'border-red-500/30 text-red-300'}>
                      {region.health}% health
                    </Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500">Users</p>
                      <p className="font-semibold text-white">{region.users}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Franchises</p>
                      <p className="font-semibold text-white">{region.franchises}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Resellers</p>
                      <p className="font-semibold text-white">{region.resellers}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Deployments</p>
                      <p className="font-semibold text-white">{region.deployments}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Alerts</p>
                      <p className="font-semibold text-white">{region.alerts}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Licenses</p>
                      <p className="font-semibold text-white">{region.licenses}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-white">System Connectors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats?.connectors.map((connector) => (
              <div key={connector.id} className="rounded-lg border border-slate-700/50 bg-slate-950/60 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{connector.display_name}</p>
                    <p className="text-xs text-slate-500">{connector.layer_name.replace(/_/g, ' ')}</p>
                  </div>
                  <Badge variant="outline" className={connector.status === 'operational' ? 'border-emerald-500/30 text-emerald-300' : connector.status === 'degraded' ? 'border-amber-500/30 text-amber-300' : 'border-red-500/30 text-red-300'}>
                    {connector.status}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>Health {connector.health_score}%</span>
                  <span>{connector.latency_ms} ms</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="bg-slate-900/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-400" />
              Live Activity Stream
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activity?.items.map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex items-start justify-between gap-3 rounded-lg border border-slate-700/40 bg-slate-950/50 p-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <Badge variant="outline" className={item.severity === 'critical' ? 'border-red-500/30 text-red-300' : item.severity === 'high' ? 'border-orange-500/30 text-orange-300' : 'border-cyan-500/30 text-cyan-300'}>
                        {item.severity}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{item.message}</p>
                  </div>
                  <span className="whitespace-nowrap text-xs text-slate-500">{formatRelativeTime(item.created_at)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-white">Global Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300">
            <div className="rounded-lg border border-slate-700/50 bg-slate-950/60 p-3">
              <p className="font-medium text-white">Zero blind spot</p>
              <p className="mt-1 text-slate-400">Every connector heartbeat, incident, and live event is aggregated into one world view.</p>
            </div>
            <div className="rounded-lg border border-slate-700/50 bg-slate-950/60 p-3">
              <p className="font-medium text-white">Auto heal before escalate</p>
              <p className="mt-1 text-slate-400">Down servers and degraded connectors are repaired first, then escalated to L2 or Boss if recovery fails.</p>
            </div>
            <div className="rounded-lg border border-slate-700/50 bg-slate-950/60 p-3">
              <p className="font-medium text-white">Risk and revenue linked</p>
              <p className="mt-1 text-slate-400">Finance, security, and infrastructure signals contribute to one global health score.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
