/**
 * SERVER HEALTH & LOAD
 * Real-time health metrics with AI alerts
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Cpu, MemoryStick, HardDrive, Wifi, 
  AlertTriangle, CheckCircle, TrendingUp, TrendingDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HealthMetric {
  server: string;
  cpu: number;
  ram: number;
  disk: number;
  network: number;
  status: 'optimal' | 'normal' | 'warning' | 'critical';
}

const healthData: HealthMetric[] = [
  { server: 'Production Server 1', cpu: 45, ram: 62, disk: 38, network: 85, status: 'normal' },
  { server: 'Production Server 2', cpu: 32, ram: 48, disk: 41, network: 92, status: 'optimal' },
  { server: 'EU Gateway', cpu: 58, ram: 71, disk: 55, network: 88, status: 'normal' },
  { server: 'Asia Pacific Node', cpu: 82, ram: 88, disk: 67, network: 78, status: 'warning' },
  { server: 'Backup Server', cpu: 12, ram: 25, disk: 82, network: 95, status: 'optimal' },
];

const getStatusBadge = (status: HealthMetric['status']) => {
  switch (status) {
    case 'optimal':
      return { text: 'Optimal', className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    case 'normal':
      return { text: 'Normal', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    case 'warning':
      return { text: 'Warning', className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    case 'critical':
      return { text: 'Critical', className: 'bg-red-500/20 text-red-400 border-red-500/30' };
  }
};

const getProgressColor = (value: number) => {
  if (value > 80) return 'bg-red-500';
  if (value > 60) return 'bg-amber-500';
  return 'bg-emerald-500';
};

export const ServerHealthLoad: React.FC = () => {
  // Calculate averages
  const avgCpu = Math.round(healthData.reduce((a, b) => a + b.cpu, 0) / healthData.length);
  const avgRam = Math.round(healthData.reduce((a, b) => a + b.ram, 0) / healthData.length);
  const avgDisk = Math.round(healthData.reduce((a, b) => a + b.disk, 0) / healthData.length);
  const avgNetwork = Math.round(healthData.reduce((a, b) => a + b.network, 0) / healthData.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Health & Load</h2>
          <p className="text-sm text-muted-foreground">Real-time resource monitoring</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
          <span>Live metrics</span>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Avg CPU', value: avgCpu, icon: Cpu, color: getProgressColor(avgCpu) },
          { label: 'Avg RAM', value: avgRam, icon: MemoryStick, color: getProgressColor(avgRam) },
          { label: 'Avg Disk', value: avgDisk, icon: HardDrive, color: getProgressColor(avgDisk) },
          { label: 'Network', value: avgNetwork, icon: Wifi, color: 'bg-blue-500' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <span className={cn(
                      "text-xs font-medium",
                      stat.value > 80 ? 'text-red-500' : 
                      stat.value > 60 ? 'text-amber-500' : 'text-emerald-500'
                    )}>
                      {stat.value}%
                    </span>
                  </div>
                  <Progress value={stat.value} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Per-Server Health */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base text-foreground">Server Health Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthData.map((server, index) => {
              const statusBadge = getStatusBadge(server.status);
              
              return (
                <motion.div
                  key={server.server}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{server.server}</p>
                      <Badge className={statusBadge.className}>{statusBadge.text}</Badge>
                    </div>
                    {server.status === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: 'CPU', value: server.cpu },
                      { label: 'RAM', value: server.ram },
                      { label: 'Disk', value: server.disk },
                      { label: 'Network', value: server.network },
                    ].map((metric) => (
                      <div key={metric.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{metric.label}</span>
                          <span className={cn(
                            "font-medium",
                            metric.value > 80 ? 'text-red-500' : 
                            metric.value > 60 ? 'text-amber-500' : 'text-muted-foreground'
                          )}>
                            {metric.value}%
                          </span>
                        </div>
                        <Progress value={metric.value} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Alerts */}
      <Card className="bg-amber-500/5 border-amber-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <div>
              <p className="font-medium text-foreground">1 Server Needs Attention</p>
              <p className="text-sm text-muted-foreground">
                Asia Pacific Node has high CPU (82%) and RAM (88%) usage. AI recommends scaling up resources.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerHealthLoad;
