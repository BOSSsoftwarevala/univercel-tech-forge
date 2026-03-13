/**
 * AUTO REPAIR ENGINE
 * Automatic system repair: restart, reload, rebuild, redeploy
 * Tools: Docker, PM2, Nginx
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wrench, RotateCcw, Play, RefreshCw, Package, Globe,
  CheckCircle, Clock, AlertTriangle, Terminal, Zap, Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RepairAction {
  id: string;
  name: string;
  description: string;
  tool: 'Docker' | 'PM2' | 'Nginx' | 'System';
  icon: React.ElementType;
  status: 'idle' | 'running' | 'success' | 'failed';
}

interface RepairLog {
  id: string;
  action: string;
  server: string;
  tool: string;
  status: 'success' | 'failed';
  duration: string;
  timestamp: string;
}

const repairActions: RepairAction[] = [
  { id: '1', name: 'Restart Service', description: 'Restart a crashed or frozen service process', tool: 'PM2', icon: RotateCcw, status: 'idle' },
  { id: '2', name: 'Reload Application', description: 'Zero-downtime reload of the application', tool: 'PM2', icon: RefreshCw, status: 'idle' },
  { id: '3', name: 'Rebuild Container', description: 'Rebuild and restart Docker containers', tool: 'Docker', icon: Package, status: 'idle' },
  { id: '4', name: 'Restart Nginx', description: 'Reload Nginx configuration and restart', tool: 'Nginx', icon: Globe, status: 'idle' },
  { id: '5', name: 'Redeploy Application', description: 'Full rebuild and redeploy from repository', tool: 'System', icon: Play, status: 'idle' },
  { id: '6', name: 'Clear Cache', description: 'Flush Redis, CDN, and application caches', tool: 'System', icon: Zap, status: 'idle' },
];

const repairLogs: RepairLog[] = [
  { id: '1', action: 'Restart Service', server: 'AI Services Node', tool: 'PM2', status: 'success', duration: '4.2s', timestamp: '2026-03-08 14:24' },
  { id: '2', action: 'Rebuild Container', server: 'AI Services Node', tool: 'Docker', status: 'success', duration: '1m 12s', timestamp: '2026-03-08 14:22' },
  { id: '3', action: 'Restart Nginx', server: 'Production VPS', tool: 'Nginx', status: 'success', duration: '2.1s', timestamp: '2026-03-08 10:18' },
  { id: '4', action: 'Clear Cache', server: 'Production VPS', tool: 'System', status: 'success', duration: '0.8s', timestamp: '2026-03-07 22:35' },
  { id: '5', action: 'Restart Service', server: 'Production VPS', tool: 'PM2', status: 'success', duration: '3.8s', timestamp: '2026-03-07 08:14' },
  { id: '6', action: 'Redeploy Application', server: 'Staging Server', tool: 'System', status: 'failed', duration: '2m 45s', timestamp: '2026-03-06 16:00' },
];

const toolColors: Record<string, { color: string; bg: string }> = {
  Docker: { color: 'text-blue-400', bg: 'bg-blue-500/10' },
  PM2: { color: 'text-purple-400', bg: 'bg-purple-500/10' },
  Nginx: { color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  System: { color: 'text-amber-400', bg: 'bg-amber-500/10' },
};

export const AutoRepairEngine: React.FC = () => {
  const [actions, setActions] = useState(repairActions);

  const handleRun = (id: string) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, status: 'running' as const } : a));
    setTimeout(() => {
      setActions(prev => prev.map(a => a.id === id ? { ...a, status: 'success' as const } : a));
      toast.success('Repair action completed successfully');
      setTimeout(() => setActions(prev => prev.map(a => a.id === id ? { ...a, status: 'idle' as const } : a)), 3000);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Auto Repair Engine</h2>
          <p className="text-sm text-muted-foreground">Automated system repair using Docker, PM2 & Nginx</p>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-400 border-none">
          <Shield className="w-3 h-3 mr-1" /> Self-Healing Active
        </Badge>
      </div>

      {/* Repair Actions Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, i) => {
          const tc = toolColors[action.tool];
          const Icon = action.icon;
          return (
            <motion.div key={action.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
              <Card className="bg-card border-border hover:border-blue-500/30 transition-colors">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-lg ${tc.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${tc.color} ${action.status === 'running' ? 'animate-spin' : ''}`} />
                    </div>
                    <Badge variant="outline" className={`${tc.color} ${tc.bg} border-none text-xs`}>{action.tool}</Badge>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{action.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-xs"
                    disabled={action.status === 'running'}
                    onClick={() => handleRun(action.id)}
                  >
                    {action.status === 'running' ? <><RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Running...</> :
                     action.status === 'success' ? <><CheckCircle className="w-3 h-3 mr-1" /> Done</> :
                     <><Play className="w-3 h-3 mr-1" /> Execute</>}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Repair Log */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base text-foreground flex items-center gap-2">
            <Terminal className="w-5 h-5 text-muted-foreground" /> Repair History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {repairLogs.map((log, i) => {
              const tc = toolColors[log.tool];
              return (
                <motion.div key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    {log.status === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                    <div>
                      <p className="text-sm font-medium text-foreground">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.server}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <Badge variant="outline" className={`${tc.color} ${tc.bg} border-none`}>{log.tool}</Badge>
                    <span className="text-muted-foreground">{log.duration}</span>
                    <span className="text-muted-foreground">{log.timestamp}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoRepairEngine;
