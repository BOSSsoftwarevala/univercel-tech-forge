import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Download, Trash2, Pause, Play, Search, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success' | 'debug';
  message: string;
  source?: string;
}

interface BuildLogsViewerProps {
  logs?: LogEntry[];
  isLive?: boolean;
  className?: string;
}

const LEVEL_CONFIG: Record<string, { color: string; prefix: string; icon: React.ElementType }> = {
  info: { color: 'text-slate-400', prefix: 'INFO', icon: Info },
  warn: { color: 'text-amber-400', prefix: 'WARN', icon: AlertCircle },
  error: { color: 'text-red-400', prefix: 'ERR!', icon: AlertCircle },
  success: { color: 'text-emerald-400', prefix: ' OK ', icon: CheckCircle2 },
  debug: { color: 'text-slate-600', prefix: 'DBG ', icon: Info },
};

const DEMO_LOGS: LogEntry[] = [
  { id: '1', timestamp: '10:42:01', level: 'info', message: 'Starting build process...', source: 'vite' },
  { id: '2', timestamp: '10:42:01', level: 'info', message: 'Resolving dependencies (247 packages)', source: 'npm' },
  { id: '3', timestamp: '10:42:03', level: 'success', message: 'Dependencies resolved successfully', source: 'npm' },
  { id: '4', timestamp: '10:42:04', level: 'info', message: 'Compiling TypeScript...', source: 'tsc' },
  { id: '5', timestamp: '10:42:07', level: 'warn', message: 'Unused variable "tempData" in src/utils.ts:34', source: 'tsc' },
  { id: '6', timestamp: '10:42:09', level: 'success', message: 'TypeScript compilation complete', source: 'tsc' },
  { id: '7', timestamp: '10:42:09', level: 'info', message: 'Bundling assets...', source: 'vite' },
  { id: '8', timestamp: '10:42:12', level: 'info', message: 'Optimizing bundle size...', source: 'vite' },
  { id: '9', timestamp: '10:42:14', level: 'success', message: 'Build complete! dist/ 2.4 MB', source: 'vite' },
  { id: '10', timestamp: '10:42:14', level: 'info', message: 'Running post-build checks...', source: 'ci' },
  { id: '11', timestamp: '10:42:15', level: 'success', message: 'All checks passed. Ready to deploy.', source: 'ci' },
];

const BuildLogsViewer: React.FC<BuildLogsViewerProps> = ({
  logs: initialLogs = DEMO_LOGS,
  isLive = false,
  className,
}) => {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [isPaused, setIsPaused] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (!isPaused && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isPaused]);

  const handleClear = () => setLogs([]);

  const handleExport = () => {
    const text = logs.map((l) => `[${l.timestamp}] ${l.level.toUpperCase()} ${l.message}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'build-logs.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = logs.filter((l) => {
    const matchesFilter = filter === 'all' || l.level === filter;
    const matchesSearch = !search || l.message.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className={cn('flex flex-col rounded-xl bg-slate-950 border border-slate-800', className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-800">
        <Terminal className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-xs text-slate-400 font-medium">Build Logs</span>
        {isLive && (
          <span className="flex items-center gap-1 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-400">Live</span>
          </span>
        )}
        <div className="flex-1 relative ml-2">
          <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-600" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter logs..."
            className="h-6 text-[11px] pl-6 bg-slate-900 border-slate-700 text-slate-300 placeholder:text-slate-600"
          />
        </div>
        <div className="flex items-center gap-1">
          {(['all', 'error', 'warn', 'success'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={cn(
                'px-1.5 py-0.5 text-[10px] rounded transition-colors capitalize',
                filter === lvl ? 'bg-slate-700 text-slate-200' : 'text-slate-600 hover:text-slate-400'
              )}
            >
              {lvl}
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsPaused(!isPaused)}
          className="h-6 w-6 p-0 text-slate-500 hover:text-slate-300"
        >
          {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExport}
          className="h-6 w-6 p-0 text-slate-500 hover:text-slate-300"
        >
          <Download className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="h-6 w-6 p-0 text-slate-500 hover:text-red-400"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Log entries */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto p-2 font-mono text-[11px] space-y-0.5 min-h-0"
        style={{ maxHeight: '240px' }}
      >
        <AnimatePresence initial={false}>
          {filtered.map((entry) => {
            const config = LEVEL_CONFIG[entry.level];
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 px-1 py-0.5 rounded hover:bg-slate-900/60"
              >
                <span className="text-slate-700 shrink-0 w-14">{entry.timestamp}</span>
                <span className={cn('shrink-0 w-8 text-center rounded text-[9px]', config.color)}>
                  {config.prefix}
                </span>
                {entry.source && (
                  <span className="text-slate-700 shrink-0 w-10 truncate">{entry.source}</span>
                )}
                <span className={cn('flex-1 break-all', config.color)}>{entry.message}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-4 text-slate-700 text-xs">No log entries</div>
        )}
      </div>
    </div>
  );
};

export default BuildLogsViewer;
