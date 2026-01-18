/**
 * System Health Dashboard
 * Unified monitoring for database, cache, connections, and infrastructure
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Database, 
  Wifi, 
  Server, 
  Shield, 
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Zap,
  HardDrive,
  Clock
} from 'lucide-react';
import { resilientClient } from '@/lib/database/resilient-client';
import { queryCache, walletCache, userCache, leadCache } from '@/lib/scaling/query-cache';
import { enterpriseRateLimiter, requestQueueManager } from '@/lib/scaling/rate-limiter-enterprise';
import { wsPool, httpManager } from '@/lib/scaling/connection-pool';
import { regionRouter } from '@/lib/scaling/region-router';
import { toast } from 'sonner';

interface HealthMetric {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  value: string | number;
  detail?: string;
}

export function SystemHealthDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [metrics, setMetrics] = useState<{
    database: HealthMetric[];
    cache: HealthMetric[];
    network: HealthMetric[];
    performance: HealthMetric[];
  }>({
    database: [],
    cache: [],
    network: [],
    performance: [],
  });

  const collectMetrics = () => {
    // Database metrics
    const dbHealth = resilientClient.getHealthStatus();
    const databaseMetrics: HealthMetric[] = [
      {
        name: 'Circuit Breaker',
        status: dbHealth.circuitBreaker.state === 'closed' ? 'healthy' : 
                dbHealth.circuitBreaker.state === 'half-open' ? 'warning' : 'critical',
        value: dbHealth.circuitBreaker.state,
        detail: `${dbHealth.circuitBreaker.failures} failures`,
      },
      {
        name: 'Pending Requests',
        status: dbHealth.pendingRequests < 10 ? 'healthy' : 
                dbHealth.pendingRequests < 50 ? 'warning' : 'critical',
        value: dbHealth.pendingRequests,
        detail: 'Active queries',
      },
      {
        name: 'Query Cache Hit Rate',
        status: dbHealth.cacheStats.hitRate > 0.7 ? 'healthy' : 
                dbHealth.cacheStats.hitRate > 0.4 ? 'warning' : 'critical',
        value: `${(dbHealth.cacheStats.hitRate * 100).toFixed(1)}%`,
        detail: `${dbHealth.cacheStats.hits} hits / ${dbHealth.cacheStats.misses} misses`,
      },
    ];

    // Cache metrics
    const queryCacheStats = queryCache.getStats();
    const walletCacheStats = walletCache.getStats();
    const userCacheStats = userCache.getStats();
    const leadCacheStats = leadCache.getStats();
    
    const cacheMetrics: HealthMetric[] = [
      {
        name: 'Query Cache',
        status: queryCacheStats.size < 1500 ? 'healthy' : 'warning',
        value: queryCacheStats.size,
        detail: `${queryCacheStats.evictions} evictions`,
      },
      {
        name: 'Wallet Cache',
        status: walletCacheStats.hitRate > 0.5 ? 'healthy' : 'warning',
        value: `${(walletCacheStats.hitRate * 100).toFixed(1)}%`,
        detail: `${walletCacheStats.size} entries`,
      },
      {
        name: 'User Cache',
        status: userCacheStats.size < 800 ? 'healthy' : 'warning',
        value: userCacheStats.size,
        detail: `Hit rate: ${(userCacheStats.hitRate * 100).toFixed(1)}%`,
      },
      {
        name: 'Lead Cache',
        status: leadCacheStats.hitRate > 0.3 ? 'healthy' : 'warning',
        value: `${(leadCacheStats.hitRate * 100).toFixed(1)}%`,
        detail: `${leadCacheStats.size} entries`,
      },
    ];

    // Network metrics
    const rateLimiterStats = enterpriseRateLimiter.getStats();
    const queueStats = requestQueueManager.getStats();
    const wsStats = wsPool.getStats();
    const httpStats = httpManager.getStats();
    const region = regionRouter.getUserRegion();
    const regionConfig = regionRouter.getRegionConfig();

    const networkMetrics: HealthMetric[] = [
      {
        name: 'Rate Limiter',
        status: rateLimiterStats.totalQueuedRequests < 50 ? 'healthy' : 
                rateLimiterStats.totalQueuedRequests < 200 ? 'warning' : 'critical',
        value: rateLimiterStats.totalQueuedRequests,
        detail: `${rateLimiterStats.totalEntries} active clients`,
      },
      {
        name: 'HTTP Queue',
        status: httpStats.queueLength < 20 ? 'healthy' : 'warning',
        value: httpStats.queueLength,
        detail: 'Pending requests',
      },
      {
        name: 'WebSocket Pools',
        status: Object.keys(wsStats).length > 0 ? 'healthy' : 'warning',
        value: Object.values(wsStats).reduce((sum, s) => sum + s.total, 0),
        detail: `${Object.values(wsStats).reduce((sum, s) => sum + s.active, 0)} active`,
      },
      {
        name: 'Region',
        status: 'healthy',
        value: region,
        detail: `${regionConfig?.name} - ${regionConfig?.latency}ms latency`,
      },
    ];

    // Performance metrics
    const performanceMetrics: HealthMetric[] = [
      {
        name: 'Memory Usage',
        status: (performance as any).memory?.usedJSHeapSize < 100000000 ? 'healthy' : 'warning',
        value: `${Math.round(((performance as any).memory?.usedJSHeapSize || 0) / 1024 / 1024)}MB`,
        detail: 'JS Heap',
      },
      {
        name: 'Page Load',
        status: 'healthy',
        value: `${Math.round(performance.now())}ms`,
        detail: 'Time since navigation',
      },
      {
        name: 'Network Quality',
        status: navigator.onLine ? 'healthy' : 'critical',
        value: navigator.onLine ? 'Online' : 'Offline',
        detail: (navigator as any).connection?.effectiveType || 'Unknown',
      },
      {
        name: 'Service Workers',
        status: 'serviceWorker' in navigator ? 'healthy' : 'warning',
        value: 'serviceWorker' in navigator ? 'Available' : 'Unavailable',
        detail: 'Offline support',
      },
    ];

    setMetrics({
      database: databaseMetrics,
      cache: cacheMetrics,
      network: networkMetrics,
      performance: performanceMetrics,
    });
    setLastUpdate(new Date());
  };

  useEffect(() => {
    collectMetrics();
    const interval = setInterval(collectMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    collectMetrics();
    toast.success('System health refreshed');
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleResetCircuitBreaker = () => {
    resilientClient.resetCircuitBreaker();
    collectMetrics();
    toast.success('Circuit breaker reset');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      healthy: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      critical: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return variants[status] || 'bg-slate-500/10 text-slate-500';
  };

  const overallHealth = () => {
    const allMetrics = [...metrics.database, ...metrics.cache, ...metrics.network, ...metrics.performance];
    const criticalCount = allMetrics.filter(m => m.status === 'critical').length;
    const warningCount = allMetrics.filter(m => m.status === 'warning').length;
    
    if (criticalCount > 0) return { status: 'critical', label: 'Critical Issues', color: 'text-red-500' };
    if (warningCount > 2) return { status: 'warning', label: 'Needs Attention', color: 'text-amber-500' };
    return { status: 'healthy', label: 'All Systems Operational', color: 'text-emerald-500' };
  };

  const health = overallHealth();

  const MetricCard = ({ metric }: { metric: HealthMetric }) => (
    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="flex items-center gap-3">
        {getStatusIcon(metric.status)}
        <div>
          <p className="text-sm font-medium text-white">{metric.name}</p>
          <p className="text-xs text-slate-400">{metric.detail}</p>
        </div>
      </div>
      <div className="text-right">
        <Badge className={getStatusBadge(metric.status)}>
          {metric.value}
        </Badge>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl">
            <Activity className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">System Health</h1>
            <p className="text-slate-400">Enterprise infrastructure monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            Updated: {lastUpdate.toLocaleTimeString()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="border-slate-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {health.status === 'healthy' ? (
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              ) : health.status === 'warning' ? (
                <AlertTriangle className="h-10 w-10 text-amber-500" />
              ) : (
                <XCircle className="h-10 w-10 text-red-500" />
              )}
              <div>
                <h2 className={`text-xl font-bold ${health.color}`}>{health.label}</h2>
                <p className="text-slate-400">
                  {metrics.database.length + metrics.cache.length + metrics.network.length + metrics.performance.length} metrics monitored
                </p>
              </div>
            </div>
            {health.status === 'critical' && (
              <Button variant="destructive" size="sm" onClick={handleResetCircuitBreaker}>
                Reset Circuit Breaker
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metrics Tabs */}
      <Tabs defaultValue="database" className="space-y-4">
        <TabsList className="bg-slate-800 border border-slate-700">
          <TabsTrigger value="database" className="data-[state=active]:bg-slate-700">
            <Database className="h-4 w-4 mr-2" />
            Database
          </TabsTrigger>
          <TabsTrigger value="cache" className="data-[state=active]:bg-slate-700">
            <HardDrive className="h-4 w-4 mr-2" />
            Cache
          </TabsTrigger>
          <TabsTrigger value="network" className="data-[state=active]:bg-slate-700">
            <Wifi className="h-4 w-4 mr-2" />
            Network
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-slate-700">
            <Zap className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="database">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-cyan-400" />
                Database Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {metrics.database.map((metric, idx) => (
                <MetricCard key={idx} metric={metric} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cache">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-purple-400" />
                Cache Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {metrics.cache.map((metric, idx) => (
                <MetricCard key={idx} metric={metric} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wifi className="h-5 w-5 text-green-400" />
                Network & Rate Limiting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {metrics.network.map((metric, idx) => (
                <MetricCard key={idx} metric={metric} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-400" />
                Runtime Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {metrics.performance.map((metric, idx) => (
                <MetricCard key={idx} metric={metric} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-cyan-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {metrics.database.filter(m => m.status === 'healthy').length}/{metrics.database.length}
                </p>
                <p className="text-xs text-cyan-400">DB Healthy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <HardDrive className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {queryCache.getStats().size}
                </p>
                <p className="text-xs text-purple-400">Cached Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Wifi className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {regionRouter.getUserRegion().toUpperCase()}
                </p>
                <p className="text-xs text-green-400">Active Region</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-amber-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {Math.round(performance.now() / 1000)}s
                </p>
                <p className="text-xs text-amber-400">Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SystemHealthDashboard;
