import React, { memo, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, TrendingDown, Users, Activity, Zap, 
  Globe, Server, Cpu, HardDrive, Wifi
} from 'lucide-react';

interface StatItem {
  id: string;
  label: string;
  value: number | string;
  change?: number;
  icon?: React.ReactNode;
  color?: string;
  suffix?: string;
  prefix?: string;
}

interface LiveStatsWidgetProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4 | 5 | 6;
  refreshInterval?: number;
  onRefresh?: () => Promise<StatItem[]>;
  className?: string;
  compact?: boolean;
}

const StatCard = memo(({ stat, compact }: { stat: StatItem; compact?: boolean }) => {
  const [displayValue, setDisplayValue] = useState(stat.value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (displayValue !== stat.value) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayValue(stat.value);
        setIsAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [stat.value, displayValue]);

  const isPositive = (stat.change ?? 0) >= 0;
  const changeColor = isPositive ? 'text-emerald-400' : 'text-red-400';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-slate-900/60 backdrop-blur-sm",
        "border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300",
        compact ? "p-3" : "p-4"
      )}
      style={{
        boxShadow: `0 0 20px ${stat.color || 'rgb(6, 182, 212)'}15`
      }}
    >
      {/* Glow effect */}
      <div 
        className="absolute -inset-1 opacity-20 blur-xl rounded-xl"
        style={{ backgroundColor: stat.color || 'rgb(6, 182, 212)' }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {stat.label}
          </span>
          {stat.icon && (
            <div 
              className="p-1.5 rounded-lg"
              style={{ backgroundColor: `${stat.color || 'rgb(6, 182, 212)'}20` }}
            >
              {stat.icon}
            </div>
          )}
        </div>

        <div className="flex items-end justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={String(displayValue)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "font-bold tracking-tight",
                compact ? "text-xl" : "text-2xl"
              )}
              style={{ color: stat.color || 'rgb(6, 182, 212)' }}
            >
              {stat.prefix}
              {typeof displayValue === 'number' 
                ? displayValue.toLocaleString() 
                : displayValue
              }
              {stat.suffix}
            </motion.div>
          </AnimatePresence>

          {stat.change !== undefined && (
            <div className={cn("flex items-center gap-1 text-xs", changeColor)}>
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{Math.abs(stat.change)}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Pulse animation for active updates */}
      {isAnimating && (
        <motion.div
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 border-2 rounded-xl"
          style={{ borderColor: stat.color || 'rgb(6, 182, 212)' }}
        />
      )}
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';

export const LiveStatsWidget = memo(({
  stats,
  columns = 4,
  refreshInterval = 5000,
  onRefresh,
  className,
  compact = false
}: LiveStatsWidgetProps) => {
  const [currentStats, setCurrentStats] = useState(stats);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const refresh = useCallback(async () => {
    if (onRefresh) {
      const newStats = await onRefresh();
      setCurrentStats(newStats);
      setLastUpdate(new Date());
    }
  }, [onRefresh]);

  useEffect(() => {
    if (!onRefresh) return;

    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [refresh, refreshInterval, onRefresh]);

  useEffect(() => {
    setCurrentStats(stats);
  }, [stats]);

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className={cn("grid gap-4", gridCols[columns])}>
        {currentStats.map((stat) => (
          <StatCard key={stat.id} stat={stat} compact={compact} />
        ))}
      </div>

      {/* Last update indicator */}
      <div className="flex items-center justify-end gap-2 text-xs text-slate-500">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Live • Updated {lastUpdate.toLocaleTimeString()}</span>
      </div>
    </div>
  );
});

LiveStatsWidget.displayName = 'LiveStatsWidget';

// System metrics widget
export const SystemMetrics = memo(() => {
  const [metrics, setMetrics] = useState({
    cpu: 45,
    memory: 62,
    network: 89,
    storage: 34,
    latency: 12,
    uptime: 99.99
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.min(100, Math.max(0, prev.memory + (Math.random() - 0.5) * 5)),
        network: Math.min(100, Math.max(0, prev.network + (Math.random() - 0.5) * 8)),
        storage: prev.storage + Math.random() * 0.1,
        latency: Math.max(1, prev.latency + (Math.random() - 0.5) * 3),
        uptime: 99.99
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const stats: StatItem[] = [
    { id: 'cpu', label: 'CPU Usage', value: Math.round(metrics.cpu), suffix: '%', icon: <Cpu className="w-4 h-4 text-cyan-400" />, color: '#06b6d4' },
    { id: 'memory', label: 'Memory', value: Math.round(metrics.memory), suffix: '%', icon: <Server className="w-4 h-4 text-purple-400" />, color: '#a855f7' },
    { id: 'network', label: 'Network', value: Math.round(metrics.network), suffix: '%', icon: <Wifi className="w-4 h-4 text-emerald-400" />, color: '#10b981' },
    { id: 'storage', label: 'Storage', value: Math.round(metrics.storage), suffix: '%', icon: <HardDrive className="w-4 h-4 text-amber-400" />, color: '#f59e0b' },
    { id: 'latency', label: 'Latency', value: Math.round(metrics.latency), suffix: 'ms', icon: <Zap className="w-4 h-4 text-rose-400" />, color: '#f43f5e' },
    { id: 'uptime', label: 'Uptime', value: metrics.uptime.toFixed(2), suffix: '%', icon: <Activity className="w-4 h-4 text-blue-400" />, color: '#3b82f6' },
  ];

  return <LiveStatsWidget stats={stats} columns={6} compact />;
});

SystemMetrics.displayName = 'SystemMetrics';
