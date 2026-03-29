/**
 * VALA AI - Execution Logs Panel
 */

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, RefreshCw, CheckCircle2, AlertCircle, Search, Zap } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  module: string;
  message: string;
  duration?: string;
}

const generateLogs = (): LogEntry[] => [
  { id: '1', timestamp: new Date().toISOString(), level: 'success', module: 'Builder', message: 'Project build completed successfully', duration: '4.2s' },
  { id: '2', timestamp: new Date(Date.now() - 30000).toISOString(), level: 'info', module: 'AI Engine', message: 'Response streamed (2,450 tokens)', duration: '3.1s' },
  { id: '3', timestamp: new Date(Date.now() - 60000).toISOString(), level: 'info', module: 'Database', message: 'Schema migration executed (8 tables created)' },
  { id: '4', timestamp: new Date(Date.now() - 90000).toISOString(), level: 'warning', module: 'Rate Limiter', message: 'Approaching rate limit: 85/100 requests' },
  { id: '5', timestamp: new Date(Date.now() - 120000).toISOString(), level: 'success', module: 'Deploy', message: 'Demo deployed to restaurant-pos.softwarevala.com', duration: '12s' },
  { id: '6', timestamp: new Date(Date.now() - 180000).toISOString(), level: 'error', module: 'Voice', message: 'TTS timeout — retried successfully', duration: '8s' },
];

const LEVEL_META: Record<LogEntry['level'], { icon: React.ElementType; badge: string; className: string }> = {
  info: { icon: Zap, badge: 'INFO', className: 'bg-primary/10 text-primary' },
  success: { icon: CheckCircle2, badge: 'OK', className: 'bg-primary/10 text-primary' },
  warning: { icon: AlertCircle, badge: 'WARN', className: 'bg-secondary/70 text-secondary-foreground' },
  error: { icon: AlertCircle, badge: 'ERR', className: 'bg-destructive/10 text-destructive' },
};

const formatTime = (iso: string) => {
  return new Date(iso).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const ExecutionLogsPanel: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>(generateLogs());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<LogEntry['level'] | 'all'>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => setLogs(generateLogs()), 10000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const filtered = useMemo(() => {
    return logs.filter(l => {
      const matchSearch = l.message.toLowerCase().includes(search.toLowerCase()) || l.module.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || l.level === filter;
      return matchSearch && matchFilter;
    });
  }, [filter, logs, search]);

  const handleExport = () => {
    const csv = logs.map(l => `${l.timestamp},${l.level},${l.module},${l.message}`).join('\n');
    navigator.clipboard.writeText(csv);
    toast.success('Logs copied');
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/15">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Execution Logs</h1>
            <p className="text-xs text-muted-foreground">{logs.length} entries • Auto-refresh {autoRefresh ? 'ON' : 'OFF'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="h-8 px-3 text-xs gap-1.5" onClick={() => setAutoRefresh(v => !v)}>
            <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            {autoRefresh ? 'Live' : 'Paused'}
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs gap-1.5" onClick={handleExport}>
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
        </div>
      </div>

      <div className="px-6 py-3 flex items-center gap-3 border-b border-border/40">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search logs..." className="pl-9 h-8 text-xs" />
        </div>
        {(['all', 'info', 'success', 'warning', 'error'] as const).map(f => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'ghost'}
            size="sm"
            className="h-7 px-2 text-[10px] capitalize"
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Card className="bg-card/60 border-border/50">
            <CardContent className="p-2">
              {filtered.map((log, i) => {
                const meta = LEVEL_META[log.level];
                const Icon = meta.icon;
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/30 transition-colors font-mono"
                  >
                    <span className="text-[10px] shrink-0 text-muted-foreground">{formatTime(log.timestamp)}</span>
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${meta.className}`}>{meta.badge}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded shrink-0 bg-muted/40 text-muted-foreground">{log.module}</span>
                    <span className="text-xs flex-1 truncate text-foreground/80">{log.message}</span>
                    {log.duration && <span className="text-[10px] shrink-0 text-muted-foreground">{log.duration}</span>}
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ExecutionLogsPanel;
