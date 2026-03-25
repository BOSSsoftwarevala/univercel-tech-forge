import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Clock, 
  Cpu, 
  HardDrive, 
  Network, 
  Gauge,
  TrendingUp
} from 'lucide-react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitorAdvanced';
import { cn } from '@/lib/utils';

export function PerformanceMonitorPanel() {
  const { metrics, score, grade, scoreColor } = usePerformanceMonitor();

  const formatMs = (ms: number | null) => {
    if (ms === null) return '—';
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance Monitor
            </CardTitle>
            <CardDescription>Real-time performance metrics</CardDescription>
          </div>
          <div className="text-right">
            <div className={cn("text-3xl font-bold", scoreColor)}>{score}</div>
            <Badge variant="outline" className={scoreColor}>Grade {grade}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Core Web Vitals */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Core Web Vitals
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="FCP"
              description="First Contentful Paint"
              value={formatMs(metrics.fcp)}
              target="< 1.2s"
              status={getStatus(metrics.fcp, 1200, 2400)}
            />
            <MetricCard
              label="LCP"
              description="Largest Contentful Paint"
              value={formatMs(metrics.lcp)}
              target="< 2.5s"
              status={getStatus(metrics.lcp, 2500, 4000)}
            />
            <MetricCard
              label="FID"
              description="First Input Delay"
              value={formatMs(metrics.fid)}
              target="< 100ms"
              status={getStatus(metrics.fid, 100, 300)}
            />
            <MetricCard
              label="CLS"
              description="Cumulative Layout Shift"
              value={metrics.cls?.toFixed(3) || '—'}
              target="< 0.1"
              status={metrics.cls !== null ? getStatus(metrics.cls * 1000, 100, 250) : 'neutral'}
            />
          </div>
        </div>

        {/* System Metrics */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            System Metrics
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-muted-foreground" />
                FPS
              </span>
              <span className={cn(
                "font-medium",
                metrics.fps >= 55 ? "text-green-500" : 
                metrics.fps >= 30 ? "text-yellow-500" : "text-red-500"
              )}>
                {metrics.fps} fps
              </span>
            </div>
            <Progress value={(metrics.fps / 60) * 100} className="h-2" />

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                Memory Usage
              </span>
              <span className="font-medium">
                {metrics.memoryUsage ? `${metrics.memoryUsage} MB` : '—'}
              </span>
            </div>
            {metrics.memoryUsage && (
              <Progress 
                value={Math.min((metrics.memoryUsage / 300) * 100, 100)} 
                className="h-2" 
              />
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                DOM Nodes
              </span>
              <span className={cn(
                "font-medium",
                metrics.domNodes <= 1500 ? "text-green-500" : 
                metrics.domNodes <= 2500 ? "text-yellow-500" : "text-red-500"
              )}>
                {metrics.domNodes}
              </span>
            </div>
            <Progress 
              value={Math.min((metrics.domNodes / 3000) * 100, 100)} 
              className="h-2" 
            />
          </div>
        </div>

        {/* Network Metrics */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Network className="h-4 w-4" />
            Network
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-muted-foreground">TTFB</div>
              <div className="font-medium">{formatMs(metrics.ttfb)}</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-muted-foreground">Requests</div>
              <div className="font-medium">{metrics.requestCount}</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 col-span-2">
              <div className="text-muted-foreground">Total Transfer</div>
              <div className="font-medium">{metrics.totalTransferSize} KB</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricCard({ 
  label, 
  description, 
  value, 
  target, 
  status 
}: { 
  label: string; 
  description: string; 
  value: string; 
  target: string;
  status: 'good' | 'warning' | 'bad' | 'neutral';
}) {
  const statusColors = {
    good: 'border-green-500/30 bg-green-500/5',
    warning: 'border-yellow-500/30 bg-yellow-500/5',
    bad: 'border-red-500/30 bg-red-500/5',
    neutral: 'border-border bg-muted/30',
  };

  const valueColors = {
    good: 'text-green-500',
    warning: 'text-yellow-500',
    bad: 'text-red-500',
    neutral: 'text-muted-foreground',
  };

  return (
    <div className={cn("p-3 rounded-lg border", statusColors[status])}>
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium">{label}</span>
        <span className={cn("text-lg font-bold", valueColors[status])}>{value}</span>
      </div>
      <div className="text-xs text-muted-foreground">
        <div>{description}</div>
        <div>Target: {target}</div>
      </div>
    </div>
  );
}

function getStatus(value: number | null, goodThreshold: number, badThreshold: number): 'good' | 'warning' | 'bad' | 'neutral' {
  if (value === null) return 'neutral';
  if (value <= goodThreshold) return 'good';
  if (value <= badThreshold) return 'warning';
  return 'bad';
}