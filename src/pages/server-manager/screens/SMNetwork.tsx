import { motion } from 'framer-motion';
import { 
  Network, Globe, ArrowDownRight, ArrowUpRight, 
  Activity, Shield, AlertTriangle, Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const networkStats = {
  totalInbound: 1250,
  totalOutbound: 890,
  activeConnections: 4520,
  peakConnections: 8900,
  packetsDropped: 12,
  latency: 23,
};

const trafficByRegion = [
  { region: 'India', code: 'IN', inbound: 450, outbound: 320, latency: 12 },
  { region: 'Singapore', code: 'SG', inbound: 280, outbound: 210, latency: 35 },
  { region: 'US East', code: 'US', inbound: 320, outbound: 240, latency: 180 },
  { region: 'EU Frankfurt', code: 'EU', inbound: 200, outbound: 120, latency: 145 },
];

const recentEvents = [
  { type: 'spike', message: 'Traffic spike detected from IN region', time: '2 min ago', severity: 'warning' },
  { type: 'connection', message: 'New CDN edge node connected', time: '15 min ago', severity: 'info' },
  { type: 'drop', message: '5 packets dropped on prod-api-01', time: '1 hour ago', severity: 'warning' },
];

const SMNetwork = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Network & Traffic</h1>
        <p className="text-slate-400">Monitor network performance and traffic patterns</p>
      </div>

      {/* Network Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownRight className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400 text-sm">Inbound</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">{networkStats.totalInbound} Mb/s</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpRight className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-400 text-sm">Outbound</span>
            </div>
            <p className="text-2xl font-bold text-cyan-400">{networkStats.totalOutbound} Mb/s</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span className="text-slate-400 text-sm">Connections</span>
            </div>
            <p className="text-2xl font-bold text-white">{networkStats.activeConnections.toLocaleString()}</p>
            <p className="text-xs text-slate-500">Peak: {networkStats.peakConnections.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400 text-sm">Avg Latency</span>
            </div>
            <p className="text-2xl font-bold text-white">{networkStats.latency}ms</p>
          </CardContent>
        </Card>
      </div>

      {/* Traffic by Region */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            Traffic by Region
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trafficByRegion.map((region, i) => (
              <motion.div
                key={region.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                      {region.code}
                    </Badge>
                    <span className="text-white font-medium">{region.region}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-mono">{region.inbound} Mb/s</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="w-4 h-4 text-cyan-400" />
                      <span className="text-cyan-400 font-mono">{region.outbound} Mb/s</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300 font-mono">{region.latency}ms</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Inbound Load</span>
                      <span className="text-emerald-400">{Math.round((region.inbound / 500) * 100)}%</span>
                    </div>
                    <Progress value={(region.inbound / 500) * 100} className="h-1.5 bg-slate-700" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Outbound Load</span>
                      <span className="text-cyan-400">{Math.round((region.outbound / 400) * 100)}%</span>
                    </div>
                    <Progress value={(region.outbound / 400) * 100} className="h-1.5 bg-slate-700" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network Events */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            Recent Network Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEvents.map((event, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-3">
                  {event.severity === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Activity className="w-4 h-4 text-cyan-400" />
                  )}
                  <span className="text-white">{event.message}</span>
                </div>
                <span className="text-slate-400 text-sm">{event.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SMNetwork;
