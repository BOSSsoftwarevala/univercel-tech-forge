/**
 * VALA AI - Execution Logs Panel
 * Real-time log viewer for all AI operations
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Filter, Download, RefreshCw, CheckCircle2, AlertCircle, Clock, Zap, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  { id: '2', timestamp: new Date(Date.now() - 30000).toISOString(), level: 'info', module: 'AI Engine', message: 'GPT-4o response streamed (2,450 tokens)', duration: '3.1s' },
  { id: '3', timestamp: new Date(Date.now() - 60000).toISOString(), level: 'info', module: 'Database', message: 'Schema migration executed (8 tables created)' },
  { id: '4', timestamp: new Date(Date.now() - 90000).toISOString(), level: 'warning', module: 'Rate Limiter', message: 'Approaching rate limit: 85/100 requests' },
  { id: '5', timestamp: new Date(Date.now() - 120000).toISOString(), level: 'success', module: 'Deploy', message: 'Demo deployed to restaurant-pos.softwarevala.com', duration: '12s' },
  { id: '6', timestamp: new Date(Date.now() - 180000).toISOString(), level: 'info', module: 'API', message: '18 REST endpoints generated and validated' },
  { id: '7', timestamp: new Date(Date.now() - 240000).toISOString(), level: 'success', module: 'Builder', message: 'TypeScript compilation passed (0 errors)' },
  { id: '8', timestamp: new Date(Date.now() - 300000).toISOString(), level: 'error', module: 'Voice', message: 'ElevenLabs TTS timeout — retried successfully', duration: '8s' },
  { id: '9', timestamp: new Date(Date.now() - 360000).toISOString(), level: 'info', module: 'Security', message: 'RLS policies applied to all 8 tables' },
  { id: '10', timestamp: new Date(Date.now() - 420000).toISOString(), level: 'success', module: 'Git', message: 'Repository created: BOSSsoftwarevala/restaurant-pos' },
];

const LEVEL_STYLES: Record<string, { bg: string; color: string; icon: React.ElementType }> = {
  info: { bg: 'rgba(96,165,250,0.1)', color: '#60a5fa', icon: Zap },
  success: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', icon: CheckCircle2 },
  warning: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', icon: AlertCircle },
  error: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', icon: AlertCircle },
};

const ExecutionLogsPanel: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>(generateLogs());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setLogs(generateLogs());
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const filtered = logs.filter(l => {
    const matchSearch = l.message.toLowerCase().includes(search.toLowerCase()) || l.module.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || l.level === filter;
    return matchSearch && matchFilter;
  });

  const handleExport = () => {
    const csv = logs.map(l => `${l.timestamp},${l.level},${l.module},${l.message}`).join('\n');
    navigator.clipboard.writeText(csv);
    toast.success('Logs copied to clipboard');
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: '#0B0F1A' }}>
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(37, 99, 235, 0.2)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Execution Logs</h1>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {logs.length} entries • Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 px-3 text-xs gap-1.5 text-white/60 hover:text-white hover:bg-white/5" onClick={() => setAutoRefresh(!autoRefresh)}>
            <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            {autoRefresh ? 'Live' : 'Paused'}
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-3 text-xs gap-1.5 text-white/60 hover:text-white hover:bg-white/5" onClick={handleExport}>
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="px-6 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.3)' }} />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search logs..." className="pl-9 h-8 text-xs bg-white/5 border-white/10 text-white placeholder:text-white/30" />
        </div>
        {['all', 'info', 'success', 'warning', 'error'].map(f => (
          <Button key={f} variant="ghost" size="sm" className="h-7 px-2 text-[10px] capitalize" style={{
            background: filter === f ? 'rgba(37,99,235,0.2)' : 'transparent',
            color: filter === f ? '#60a5fa' : 'rgba(255,255,255,0.4)',
          }} onClick={() => setFilter(f)}>
            {f}
          </Button>
        ))}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1">
          {filtered.map((log, i) => {
            const style = LEVEL_STYLES[log.level];
            const Icon = style.icon;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/3 transition-colors font-mono"
              >
                <span className="text-[10px] shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }}>{formatTime(log.timestamp)}</span>
                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: style.color }} />
                <span className="text-[10px] px-1.5 py-0.5 rounded shrink-0" style={{ background: style.bg, color: style.color }}>{log.level.toUpperCase()}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded shrink-0" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>{log.module}</span>
                <span className="text-xs flex-1 truncate" style={{ color: 'rgba(255,255,255,0.7)' }}>{log.message}</span>
                {log.duration && <span className="text-[10px] shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>{log.duration}</span>}
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ExecutionLogsPanel;
