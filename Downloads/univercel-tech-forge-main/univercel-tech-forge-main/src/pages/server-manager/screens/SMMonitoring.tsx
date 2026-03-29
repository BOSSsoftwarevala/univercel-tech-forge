import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Cpu, HardDrive, Network, Clock, 
  RefreshCw, Pause, Play, TrendingUp, TrendingDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SMMonitoring = () => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [timeRange, setTimeRange] = useState('1h');
  const [cpuData, setCpuData] = useState<number[]>([]);
  const [ramData, setRamData] = useState<number[]>([]);

  // Simulate real-time data
  useEffect(() => {
    const generateData = () => {
      setCpuData(Array.from({ length: 20 }, () => Math.floor(Math.random() * 40) + 30));
      setRamData(Array.from({ length: 20 }, () => Math.floor(Math.random() * 30) + 50));
    };
    generateData();
    
    if (autoRefresh) {
      const interval = setInterval(generateData, 3000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const currentMetrics = {
    cpu: { value: 42, trend: 'up', change: '+3%' },
    ram: { value: 68, trend: 'down', change: '-2%' },
    disk: { value: 55, trend: 'up', change: '+1%' },
    network: { in: 125, out: 89 },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Monitoring</h1>
          <p className="text-slate-400">Real-time infrastructure metrics and performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="15m">Last 15m</SelectItem>
              <SelectItem value="1h">Last 1h</SelectItem>
              <SelectItem value="6h">Last 6h</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            className={`border-cyan-500/30 ${autoRefresh ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400'}`}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {autoRefresh ? 'Auto Refresh ON' : 'Auto Refresh OFF'}
          </Button>
        </div>
      </div>

      {/* Current Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <span className="text-slate-400 text-sm">CPU Usage</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-400">
                {currentMetrics.cpu.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {currentMetrics.cpu.change}
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{currentMetrics.cpu.value}%</p>
            <Progress value={currentMetrics.cpu.value} className="h-2 bg-slate-700" />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-purple-400" />
                <span className="text-slate-400 text-sm">RAM Usage</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-amber-400">
                {currentMetrics.ram.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {currentMetrics.ram.change}
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{currentMetrics.ram.value}%</p>
            <Progress value={currentMetrics.ram.value} className="h-2 bg-slate-700" />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-amber-400" />
                <span className="text-slate-400 text-sm">Disk I/O</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{currentMetrics.disk.value}%</p>
            <Progress value={currentMetrics.disk.value} className="h-2 bg-slate-700" />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Network className="w-5 h-5 text-emerald-400" />
              <span className="text-slate-400 text-sm">Network I/O</span>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-lg font-bold text-emerald-400">{currentMetrics.network.in} Mb/s</p>
                <p className="text-xs text-slate-500">Inbound</p>
              </div>
              <div>
                <p className="text-lg font-bold text-cyan-400">{currentMetrics.network.out} Mb/s</p>
                <p className="text-xs text-slate-500">Outbound</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              CPU Usage Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end gap-1">
              {cpuData.map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${value}%` }}
                  transition={{ duration: 0.5, delay: i * 0.02 }}
                  className="flex-1 bg-gradient-to-t from-cyan-500/50 to-cyan-400/30 rounded-t"
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>-{timeRange}</span>
              <span>Now</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-purple-400" />
              RAM Usage Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end gap-1">
              {ramData.map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${value}%` }}
                  transition={{ duration: 0.5, delay: i * 0.02 }}
                  className="flex-1 bg-gradient-to-t from-purple-500/50 to-purple-400/30 rounded-t"
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>-{timeRange}</span>
              <span>Now</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Anomaly Highlights */}
      <Card className="bg-slate-900/50 border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            Anomaly Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { server: 'prod-db-01', metric: 'RAM', value: '91%', time: '5 min ago', severity: 'warning' },
              { server: 'prod-api-01', metric: 'CPU Spike', value: '85%', time: '12 min ago', severity: 'info' },
            ].map((anomaly, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${anomaly.severity === 'warning' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                  <div>
                    <p className="text-white font-medium">{anomaly.server}</p>
                    <p className="text-slate-400 text-sm">{anomaly.metric}: {anomaly.value}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Clock className="w-3 h-3" />
                  {anomaly.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SMMonitoring;
