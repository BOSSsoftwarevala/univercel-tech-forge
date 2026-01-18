/**
 * DEV LOGS
 * Read-only build and deployment logs
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  CheckCircle,
  AlertTriangle,
  Info,
  Bot,
  Code,
  CloudUpload,
  Bug
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'build' | 'deploy' | 'fix' | 'ai' | 'info' | 'warning';
  message: string;
  project?: string;
}

const logs: LogEntry[] = [
  { id: '1', timestamp: '14:32:15', type: 'deploy', message: 'CRM-Pro v2.1.4 deployed to production', project: 'CRM-Pro' },
  { id: '2', timestamp: '14:30:42', type: 'ai', message: 'AI completed final testing - 847 tests passed' },
  { id: '3', timestamp: '14:28:11', type: 'build', message: 'Build completed successfully', project: 'CRM-Pro' },
  { id: '4', timestamp: '14:25:33', type: 'fix', message: 'Auto-fixed button click handler issue', project: 'Shop-Demo' },
  { id: '5', timestamp: '14:20:18', type: 'warning', message: 'High memory usage detected during build' },
  { id: '6', timestamp: '14:15:22', type: 'ai', message: 'AI analyzing requirements for new build' },
  { id: '7', timestamp: '14:10:05', type: 'info', message: 'Demo Factory generated 3 new demos' },
  { id: '8', timestamp: '14:05:41', type: 'build', message: 'Starting build for Analytics-Hub v3.0.0', project: 'Analytics-Hub' },
  { id: '9', timestamp: '13:58:12', type: 'deploy', message: 'Staging deployment completed', project: 'Analytics-Hub' },
  { id: '10', timestamp: '13:45:33', type: 'fix', message: 'Fixed 5 accessibility issues automatically' },
];

const typeConfig = {
  build: { icon: Code, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  deploy: { icon: CloudUpload, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  fix: { icon: Bug, color: 'text-amber-400', bg: 'bg-amber-500/20' },
  ai: { icon: Bot, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  info: { icon: Info, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/20' },
};

export const DevLogs: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            Logs
          </h1>
          <p className="text-sm text-muted-foreground">Read-only build and deployment logs</p>
        </div>
        <Badge variant="outline" className="text-muted-foreground">
          Live updates
        </Badge>
      </div>

      {/* Log Entries */}
      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-4">
          <div className="space-y-2 font-mono text-sm">
            {logs.map((log, index) => {
              const config = typeConfig[log.type];
              const Icon = config.icon;
              
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="flex items-start gap-3 py-2 border-b border-border/20 last:border-0"
                >
                  <span className="text-xs text-muted-foreground w-16 flex-shrink-0">
                    {log.timestamp}
                  </span>
                  <div className={cn("w-6 h-6 rounded flex items-center justify-center flex-shrink-0", config.bg)}>
                    <Icon className={cn("w-3.5 h-3.5", config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground truncate">{log.message}</p>
                    {log.project && (
                      <span className="text-xs text-muted-foreground">{log.project}</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {Object.entries(typeConfig).map(([type, config]) => {
          const Icon = config.icon;
          return (
            <div key={type} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className={cn("w-4 h-4 rounded flex items-center justify-center", config.bg)}>
                <Icon className={cn("w-2.5 h-2.5", config.color)} />
              </div>
              <span className="capitalize">{type}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
