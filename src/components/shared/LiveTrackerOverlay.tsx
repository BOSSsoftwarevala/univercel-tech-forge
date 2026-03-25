import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Users, Clock, Zap, Globe, 
  TrendingUp, AlertCircle, CheckCircle, 
  X, Minimize2, Maximize2, Move
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface TrackerMetric {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  unit?: string;
  icon: any;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

interface LiveTrackerOverlayProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  minimizable?: boolean;
  showGlobal?: boolean;
}

export function LiveTrackerOverlay({ 
  position = 'bottom-right',
  minimizable = true,
  showGlobal = true
}: LiveTrackerOverlayProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [metrics, setMetrics] = useState<TrackerMetric[]>([
    { id: 'active_users', label: 'Active Users', value: 247, previousValue: 235, icon: Users, color: 'text-green-500', trend: 'up' },
    { id: 'api_latency', label: 'API Latency', value: 45, previousValue: 52, unit: 'ms', icon: Zap, color: 'text-cyan-500', trend: 'down' },
    { id: 'tasks_queue', label: 'Tasks Queue', value: 18, previousValue: 23, icon: Activity, color: 'text-orange-500', trend: 'down' },
    { id: 'uptime', label: 'Uptime', value: 99.97, previousValue: 99.95, unit: '%', icon: CheckCircle, color: 'text-emerald-500', trend: 'up' },
  ]);

  const [globalStats, setGlobalStats] = useState({
    totalRequests: 15234,
    successRate: 99.2,
    activeRegions: 12,
    peakLoad: 78,
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => {
        const change = (Math.random() - 0.5) * 10;
        const newValue = Math.max(0, metric.value + change);
        return {
          ...metric,
          previousValue: metric.value,
          value: Math.round(newValue * 100) / 100,
          trend: newValue > metric.value ? 'up' : newValue < metric.value ? 'down' : 'stable'
        };
      }));

      setGlobalStats(prev => ({
        ...prev,
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 50),
        peakLoad: Math.min(100, Math.max(50, prev.peakLoad + (Math.random() - 0.5) * 5)),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const positionClasses = {
    'top-right': 'top-20 right-4',
    'top-left': 'top-20 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  if (!isVisible) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`fixed ${positionClasses[position]} z-40 w-12 h-12 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/30 flex items-center justify-center hover:bg-primary/30 transition-colors`}
        onClick={() => setIsVisible(true)}
      >
        <Activity className="w-5 h-5 text-primary" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      drag
      dragMomentum={false}
      className={`fixed ${positionClasses[position]} z-40 ${isMinimized ? 'w-48' : 'w-72'}`}
    >
      <div className="glass-panel overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-3 border-b border-border/30 bg-background/50 flex items-center justify-between cursor-move">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
            <span className="text-xs font-mono font-medium text-foreground">LIVE TRACKER</span>
          </div>
          <div className="flex items-center gap-1">
            {minimizable && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <Maximize2 className="w-3 h-3" />
                ) : (
                  <Minimize2 className="w-3 h-3" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsVisible(false)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {/* Metrics */}
              <div className="p-3 space-y-3">
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  const change = ((metric.value - metric.previousValue) / metric.previousValue * 100).toFixed(1);
                  const isPositive = metric.trend === 'up';
                  
                  return (
                    <div key={metric.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-background/50 flex items-center justify-center ${metric.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground truncate">{metric.label}</span>
                          <motion.span
                            key={metric.value}
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-sm font-mono font-medium text-foreground"
                          >
                            {metric.value}{metric.unit}
                          </motion.span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className={`w-3 h-3 ${isPositive ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
                          <span className={`text-[10px] ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {change}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Global Stats */}
              {showGlobal && (
                <div className="p-3 border-t border-border/30 bg-background/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-xs font-mono font-medium text-foreground">GLOBAL STATUS</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 rounded-lg bg-background/50">
                      <p className="text-[10px] text-muted-foreground">Requests</p>
                      <motion.p 
                        key={globalStats.totalRequests}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        className="text-sm font-mono font-medium text-primary"
                      >
                        {globalStats.totalRequests.toLocaleString()}
                      </motion.p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-background/50">
                      <p className="text-[10px] text-muted-foreground">Regions</p>
                      <p className="text-sm font-mono font-medium text-cyan-500">{globalStats.activeRegions}</p>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-muted-foreground">System Load</span>
                      <span className="text-foreground font-mono">{globalStats.peakLoad.toFixed(1)}%</span>
                    </div>
                    <Progress value={globalStats.peakLoad} className="h-1" />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimized View */}
        {isMinimized && (
          <div className="p-2 flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
            <span className="text-xs font-mono text-muted-foreground">
              {metrics[0].value} users • {globalStats.peakLoad.toFixed(0)}% load
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default LiveTrackerOverlay;
