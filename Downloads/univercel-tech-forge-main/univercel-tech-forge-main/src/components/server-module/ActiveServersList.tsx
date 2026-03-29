/**
 * ACTIVE SERVERS LIST
 * Server cards with status, CPU/RAM, actions
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, Eye, Pause, Trash2, Activity, Clock,
  CheckCircle, AlertTriangle, WifiOff, MoreHorizontal
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ServerData {
  id: string;
  name: string;
  status: 'healthy' | 'at-risk' | 'offline';
  cpu: number;
  ram: number;
  disk: number;
  lastCheck: string;
  provider?: string;
}

const mockServers: ServerData[] = [
  { id: 'srv-1', name: 'Production Server 1', status: 'healthy', cpu: 45, ram: 62, disk: 38, lastCheck: '30 sec ago', provider: 'AWS' },
  { id: 'srv-2', name: 'Production Server 2', status: 'healthy', cpu: 32, ram: 48, disk: 41, lastCheck: '45 sec ago', provider: 'Hostinger' },
  { id: 'srv-3', name: 'EU Gateway', status: 'healthy', cpu: 58, ram: 71, disk: 55, lastCheck: '1 min ago', provider: 'DigitalOcean' },
  { id: 'srv-4', name: 'Asia Pacific Node', status: 'at-risk', cpu: 82, ram: 88, disk: 67, lastCheck: '20 sec ago', provider: 'Vultr' },
  { id: 'srv-5', name: 'Backup Server', status: 'healthy', cpu: 12, ram: 25, disk: 82, lastCheck: '2 min ago', provider: 'AWS' },
  { id: 'srv-6', name: 'Dev Server', status: 'healthy', cpu: 28, ram: 35, disk: 22, lastCheck: '1 min ago' },
];

const getStatusConfig = (status: ServerData['status']) => {
  switch (status) {
    case 'healthy':
      return { 
        icon: CheckCircle, 
        label: 'Healthy', 
        color: 'text-emerald-500', 
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20'
      };
    case 'at-risk':
      return { 
        icon: AlertTriangle, 
        label: 'At Risk', 
        color: 'text-amber-500', 
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20'
      };
    case 'offline':
      return { 
        icon: WifiOff, 
        label: 'Offline', 
        color: 'text-red-500', 
        bg: 'bg-red-500/10',
        border: 'border-red-500/20'
      };
  }
};

const getProgressColor = (value: number) => {
  if (value > 80) return 'bg-red-500';
  if (value > 60) return 'bg-amber-500';
  return 'bg-emerald-500';
};

export const ActiveServersList: React.FC = () => {
  const [servers, setServers] = useState<ServerData[]>(mockServers);
  const [selectedServer, setSelectedServer] = useState<ServerData | null>(null);
  const [pausedServers, setPausedServers] = useState<Set<string>>(new Set());

  const handlePauseMonitoring = (id: string) => {
    const isPaused = pausedServers.has(id);
    if (isPaused) {
      setPausedServers(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast.success('Monitoring resumed');
    } else {
      setPausedServers(prev => new Set(prev).add(id));
      toast.info('Monitoring paused for server');
    }
  };

  const handleRemove = (id: string) => {
    setServers(prev => prev.filter(s => s.id !== id));
    toast.success('Server removed from monitoring');
  };

  const handleView = (id: string) => {
    const server = servers.find(s => s.id === id);
    if (server) {
      setSelectedServer(server);
      toast.success(`Viewing: ${server.name}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Active Servers</h2>
          <p className="text-sm text-muted-foreground">{servers.length} servers monitored</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
          <span>Auto-updating</span>
        </div>
      </div>

      {/* Server Cards */}
      <div className="space-y-3">
        {servers.map((server, index) => {
          const statusConfig = getStatusConfig(server.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    {/* Left: Server Info */}
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", statusConfig.bg)}>
                        <Server className={cn("w-5 h-5", statusConfig.color)} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{server.name}</p>
                          {server.provider && (
                            <Badge variant="outline" className="text-xs">
                              {server.provider}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusIcon className={cn("w-3 h-3", statusConfig.color)} />
                          <span className={cn("text-xs", statusConfig.color)}>{statusConfig.label}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{server.lastCheck}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Resources */}
                    <div className="hidden md:flex items-center gap-6">
                      {[
                        { label: 'CPU', value: server.cpu },
                        { label: 'RAM', value: server.ram },
                        { label: 'Disk', value: server.disk },
                      ].map((resource) => (
                        <div key={resource.label} className="text-center w-16">
                          <p className="text-xs text-muted-foreground mb-1">{resource.label}</p>
                          <Progress 
                            value={resource.value} 
                            className="h-1.5"
                            // @ts-ignore
                            indicatorClassName={getProgressColor(resource.value)}
                          />
                          <p className={cn(
                            "text-xs mt-1 font-medium",
                            resource.value > 80 ? 'text-red-500' : 
                            resource.value > 60 ? 'text-amber-500' : 'text-muted-foreground'
                          )}>
                            {resource.value}%
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleView(server.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handlePauseMonitoring(server.id)}>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause Monitoring
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRemove(server.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {servers.length === 0 && (
        <Card className="bg-card/50 border-dashed">
          <CardContent className="p-8 text-center">
            <Server className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No servers added yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActiveServersList;
