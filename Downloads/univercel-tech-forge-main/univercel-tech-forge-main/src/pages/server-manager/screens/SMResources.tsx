import { motion } from 'framer-motion';
import { 
  Cpu, HardDrive, Network, Server, TrendingUp, 
  AlertTriangle, CheckCircle2, BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const resourceData = [
  { 
    server: 'prod-api-01', 
    cpu: { used: 4.2, total: 8, percent: 52 },
    ram: { used: 12.4, total: 16, percent: 78 },
    disk: { used: 120, total: 256, percent: 47 },
    bandwidth: { used: 450, total: 1000, percent: 45 }
  },
  { 
    server: 'prod-api-02', 
    cpu: { used: 3.8, total: 8, percent: 48 },
    ram: { used: 11.2, total: 16, percent: 70 },
    disk: { used: 89, total: 256, percent: 35 },
    bandwidth: { used: 380, total: 1000, percent: 38 }
  },
  { 
    server: 'prod-db-01', 
    cpu: { used: 6.8, total: 8, percent: 85 },
    ram: { used: 29.1, total: 32, percent: 91 },
    disk: { used: 420, total: 512, percent: 82 },
    bandwidth: { used: 180, total: 500, percent: 36 }
  },
];

const SMResources = () => {
  const getUsageColor = (percent: number) => {
    if (percent >= 90) return 'text-red-400';
    if (percent >= 70) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  // Calculate totals
  const totals = {
    cpu: { used: resourceData.reduce((a, b) => a + b.cpu.used, 0), total: resourceData.reduce((a, b) => a + b.cpu.total, 0) },
    ram: { used: resourceData.reduce((a, b) => a + b.ram.used, 0), total: resourceData.reduce((a, b) => a + b.ram.total, 0) },
    disk: { used: resourceData.reduce((a, b) => a + b.disk.used, 0), total: resourceData.reduce((a, b) => a + b.disk.total, 0) },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Resource Usage</h1>
        <p className="text-slate-400">Monitor CPU, memory, and storage across all servers</p>
      </div>

      {/* Total Resources */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span className="text-slate-400">Total CPU</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <p className="text-2xl font-bold text-white">{totals.cpu.used.toFixed(1)}</p>
              <span className="text-slate-500">/ {totals.cpu.total} cores</span>
            </div>
            <Progress value={(totals.cpu.used / totals.cpu.total) * 100} className="h-2 bg-slate-700" />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <HardDrive className="w-5 h-5 text-purple-400" />
              <span className="text-slate-400">Total RAM</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <p className="text-2xl font-bold text-white">{totals.ram.used.toFixed(1)}</p>
              <span className="text-slate-500">/ {totals.ram.total} GB</span>
            </div>
            <Progress value={(totals.ram.used / totals.ram.total) * 100} className="h-2 bg-slate-700" />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <HardDrive className="w-5 h-5 text-amber-400" />
              <span className="text-slate-400">Total Storage</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <p className="text-2xl font-bold text-white">{totals.disk.used}</p>
              <span className="text-slate-500">/ {totals.disk.total} GB</span>
            </div>
            <Progress value={(totals.disk.used / totals.disk.total) * 100} className="h-2 bg-slate-700" />
          </CardContent>
        </Card>
      </div>

      {/* Per-Server Resources */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Resource Allocation by Server
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {resourceData.map((server, i) => (
              <motion.div
                key={server.server}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Server className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-white font-medium">{server.server}</h3>
                  {server.cpu.percent >= 80 || server.ram.percent >= 80 ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-400 text-sm">CPU</span>
                      <span className={`text-sm font-medium ${getUsageColor(server.cpu.percent)}`}>
                        {server.cpu.percent}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getProgressColor(server.cpu.percent)} rounded-full transition-all`}
                        style={{ width: `${server.cpu.percent}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{server.cpu.used} / {server.cpu.total} cores</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-400 text-sm">RAM</span>
                      <span className={`text-sm font-medium ${getUsageColor(server.ram.percent)}`}>
                        {server.ram.percent}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getProgressColor(server.ram.percent)} rounded-full transition-all`}
                        style={{ width: `${server.ram.percent}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{server.ram.used} / {server.ram.total} GB</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-400 text-sm">Disk</span>
                      <span className={`text-sm font-medium ${getUsageColor(server.disk.percent)}`}>
                        {server.disk.percent}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getProgressColor(server.disk.percent)} rounded-full transition-all`}
                        style={{ width: `${server.disk.percent}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{server.disk.used} / {server.disk.total} GB</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-400 text-sm">Bandwidth</span>
                      <span className={`text-sm font-medium ${getUsageColor(server.bandwidth.percent)}`}>
                        {server.bandwidth.percent}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getProgressColor(server.bandwidth.percent)} rounded-full transition-all`}
                        style={{ width: `${server.bandwidth.percent}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{server.bandwidth.used} / {server.bandwidth.total} Mb/s</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SMResources;
