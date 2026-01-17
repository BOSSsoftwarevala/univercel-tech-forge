/**
 * SERVER LOGS
 * Read-only logs: connection, AI actions, alerts
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Filter, Search, Wifi, Brain, AlertTriangle,
  CheckCircle, Clock, Server, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'connection' | 'ai_action' | 'alert' | 'info';
  server: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
}

const mockLogs: LogEntry[] = [
  { id: '1', timestamp: '2025-01-17 14:32:15', type: 'ai_action', server: 'Production Server 1', message: 'AI optimized memory allocation', severity: 'success' },
  { id: '2', timestamp: '2025-01-17 14:31:42', type: 'connection', server: 'EU Gateway', message: 'SSH connection established', severity: 'info' },
  { id: '3', timestamp: '2025-01-17 14:30:18', type: 'alert', server: 'Asia Pacific Node', message: 'High CPU usage detected (82%)', severity: 'warning' },
  { id: '4', timestamp: '2025-01-17 14:28:55', type: 'ai_action', server: 'Asia Pacific Node', message: 'AI blocked suspicious IP 192.168.x.x', severity: 'success' },
  { id: '5', timestamp: '2025-01-17 14:25:33', type: 'connection', server: 'Backup Server', message: 'Backup sync completed', severity: 'success' },
  { id: '6', timestamp: '2025-01-17 14:22:10', type: 'info', server: 'Production Server 2', message: 'System health check passed', severity: 'info' },
  { id: '7', timestamp: '2025-01-17 14:18:45', type: 'alert', server: 'Asia Pacific Node', message: 'Memory usage above threshold', severity: 'warning' },
  { id: '8', timestamp: '2025-01-17 14:15:20', type: 'ai_action', server: 'Production Server 1', message: 'AI restarted nginx service', severity: 'success' },
  { id: '9', timestamp: '2025-01-17 14:12:00', type: 'connection', server: 'All Servers', message: 'Scheduled health check completed', severity: 'info' },
  { id: '10', timestamp: '2025-01-17 14:08:30', type: 'ai_action', server: 'EU Gateway', message: 'AI scaled up resources automatically', severity: 'success' },
];

const getTypeIcon = (type: LogEntry['type']) => {
  switch (type) {
    case 'connection': return Wifi;
    case 'ai_action': return Brain;
    case 'alert': return AlertTriangle;
    default: return FileText;
  }
};

const getTypeColor = (type: LogEntry['type']) => {
  switch (type) {
    case 'connection': return 'text-blue-500';
    case 'ai_action': return 'text-primary';
    case 'alert': return 'text-amber-500';
    default: return 'text-muted-foreground';
  }
};

const getSeverityBadge = (severity: LogEntry['severity']) => {
  switch (severity) {
    case 'success': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'warning': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  }
};

export const ServerLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.server.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || log.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">System Logs</h2>
          <p className="text-sm text-muted-foreground">Read-only activity logs</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40 bg-background border-border">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="connection">Connections</SelectItem>
            <SelectItem value="ai_action">AI Actions</SelectItem>
            <SelectItem value="alert">Alerts</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs List */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredLogs.map((log, index) => {
              const TypeIcon = getTypeIcon(log.type);
              
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0")}>
                      <TypeIcon className={cn("w-4 h-4", getTypeColor(log.type))} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground font-mono">{log.timestamp}</span>
                        <Badge className={cn("text-xs", getSeverityBadge(log.severity))}>
                          {log.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground">{log.message}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Server className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{log.server}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Info Notice */}
      <Card className="bg-muted/30 border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Logs are read-only and retained for 30 days. For audit purposes, all logs are immutable.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerLogs;
