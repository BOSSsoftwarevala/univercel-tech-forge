import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Server, Lock, Loader2, MapPin, RefreshCw, Shield, Wrench
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { globalCommandApi, type InfraResponse } from "@/lib/api/global-command";

const REGIONS = ['All', 'India', 'Asia', 'Middle East', 'Africa', 'Europe', 'USA'];

export const UnifiedServerInfra = () => {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [infra, setInfra] = useState<InfraResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selfHealing, setSelfHealing] = useState(false);

  const loadInfra = async () => {
    try {
      setLoading(true);
      const response = await globalCommandApi.getInfraStatus();
      setInfra(response);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load infrastructure status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadInfra();
  }, []);

  const runSelfHeal = async () => {
    try {
      setSelfHealing(true);
      const response = await globalCommandApi.runSelfHeal();
      toast.success(`Self-heal repaired ${response.healed} infrastructure issue(s).`);
      await loadInfra();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Self-heal failed');
    } finally {
      setSelfHealing(false);
    }
  };

  const servers = (infra?.servers || []) as Array<Record<string, unknown>>;

  const filteredServers = selectedRegion === 'All' 
    ? servers 
    : servers.filter((server) => String(server.country || server.continent || '').includes(selectedRegion));

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
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Server className="w-6 h-6 text-red-400" />
            Server & Infrastructure
          </h1>
          <p className="text-muted-foreground">Live server status, connector health, latency watch, and self-heal repair execution</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10" onClick={() => void loadInfra()}>
            <RefreshCw className="mr-1 h-4 w-4" /> Refresh
          </Button>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => void runSelfHeal()} disabled={selfHealing}>
            {selfHealing ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Wrench className="mr-1 h-4 w-4" />} Self-Heal
          </Button>
        </div>
      </div>

      {/* Region Tabs */}
      <div className="flex gap-2 flex-wrap">
        {REGIONS.map(region => (
          <Button
            key={region}
            size="sm"
            variant={selectedRegion === region ? "default" : "outline"}
            onClick={() => setSelectedRegion(region)}
            className={selectedRegion === region ? "bg-red-600" : ""}
          >
            <MapPin className="w-3 h-3 mr-1" />
            {region}
          </Button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="bg-slate-900/50 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{infra?.summary.online_servers ?? 0}</p>
            <p className="text-xs text-muted-foreground">Running</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-400">{infra?.summary.degraded_servers ?? 0}</p>
            <p className="text-xs text-muted-foreground">Degraded</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{infra?.summary.api_latency_ms ?? 0}</p>
            <p className="text-xs text-muted-foreground">API Latency ms</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-violet-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-violet-400">{infra?.summary.cdn_performance ?? 0}%</p>
            <p className="text-xs text-muted-foreground">CDN Performance</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{infra?.summary.open_alerts ?? 0}</p>
            <p className="text-xs text-muted-foreground">Open Alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Servers Table */}
      <Card className="bg-slate-900/50 border-border/50">
        <CardContent className="p-0">
          <div className="rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Server</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">IP / Domain</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Region</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Payment</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">CPU</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">RAM</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Storage</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">SSL</th>
                  <th className="text-right text-xs font-medium text-muted-foreground p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredServers.map((server) => (
                  <motion.tr 
                    key={String(server.id)} 
                    className="hover:bg-slate-800/30 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-medium text-white">{String(server.server_name || 'Server')}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-xs">
                        <p className="text-muted-foreground font-mono">{String(server.ip_address || 'n/a')}</p>
                        <p className="text-blue-400">{String(server.data_center || server.server_type || 'global')}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs">
                        <MapPin className="w-3 h-3 mr-1" />
                        {String(server.country || server.continent || 'Global')}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={String(server.status) === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'}>
                        {String(server.status) === 'active' ? '● ACTIVE' : String(server.status || 'unknown').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={String(server.backup_status) === 'healthy' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}>
                        {String(server.backup_status || 'warning').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3 w-20">
                      <div className="flex items-center gap-1">
                        <Progress value={Number(server.cpu_usage || 0)} className="h-2 w-12" />
                        <span className="text-xs text-muted-foreground">{Number(server.cpu_usage || 0)}%</span>
                      </div>
                    </td>
                    <td className="p-3 w-20">
                      <div className="flex items-center gap-1">
                        <Progress value={Number(server.ram_usage || 0)} className="h-2 w-12" />
                        <span className="text-xs text-muted-foreground">{Number(server.ram_usage || 0)}%</span>
                      </div>
                    </td>
                    <td className="p-3 w-20">
                      <div className="flex items-center gap-1">
                        <Progress value={Number(server.disk_usage || 0)} className="h-2 w-12" />
                        <span className="text-xs text-muted-foreground">{Number(server.disk_usage || 0)}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={String(server.security_risk_level || 'low') === 'low' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
                        <Lock className="w-3 h-3 mr-1" />
                        {String(server.security_risk_level || 'low')}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Badge variant="outline" className={Boolean(server.auto_scaling_enabled) ? 'border-emerald-500/30 text-emerald-300' : 'border-slate-500/30 text-slate-400'}>
                        {Boolean(server.auto_scaling_enabled) ? 'auto-scale' : 'manual'}
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
                {filteredServers.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-6 text-center text-sm text-slate-400">No servers found for the selected region.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-5 w-5 text-cyan-400" />
            Connector Health
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {infra?.connectors.map((connector) => (
            <div key={connector.id} className="rounded-lg border border-slate-700/50 bg-slate-950/60 p-4">
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
                <span>{connector.health_score}% health</span>
                <span>{connector.latency_ms} ms</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
