import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface ServerMetrics {
  server_id: string;
  cpu_percent: number;
  ram_percent: number;
  disk_percent: number;
  network_in: number;
  network_out: number;
  health_score: number;
  status: string;
  last_updated: string;
}

interface ServerAlert {
  id: string;
  server_id: string;
  alert_type: string;
  severity: string;
  message: string;
  is_resolved: boolean;
  created_at: string;
}

interface UseServerRealtimeReturn {
  metrics: Record<string, ServerMetrics>;
  alerts: ServerAlert[];
  isConnected: boolean;
  lastUpdate: Date | null;
  refreshMetrics: () => Promise<void>;
  startAutoRefresh: (intervalMs?: number) => void;
  stopAutoRefresh: () => void;
}

export function useServerRealtime(): UseServerRealtimeReturn {
  const [metrics, setMetrics] = useState<Record<string, ServerMetrics>>({});
  const [alerts, setAlerts] = useState<ServerAlert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // Fetch initial data
  const refreshMetrics = useCallback(async () => {
    try {
      // Fetch metrics cache
      const { data: metricsData } = await supabase
        .from('server_metrics_cache')
        .select('*');

      if (metricsData) {
        const metricsMap: Record<string, ServerMetrics> = {};
        metricsData.forEach((m) => {
          metricsMap[m.server_id] = m as ServerMetrics;
        });
        setMetrics(metricsMap);
      }

      // Fetch active alerts
      const { data: alertsData } = await supabase
        .from('server_alerts')
        .select('*')
        .eq('is_resolved', false)
        .order('created_at', { ascending: false })
        .limit(50);

      if (alertsData) {
        setAlerts(alertsData as ServerAlert[]);
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.error('[ServerRealtime] Refresh error:', error);
    }
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    let metricsChannel: RealtimeChannel;
    let alertsChannel: RealtimeChannel;

    const setupSubscriptions = async () => {
      // Subscribe to metrics cache changes
      metricsChannel = supabase
        .channel('server-metrics-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'server_metrics_cache'
          },
          (payload) => {
            console.log('[ServerRealtime] Metrics update:', payload);
            if (payload.new) {
              const newMetric = payload.new as ServerMetrics;
              setMetrics(prev => ({
                ...prev,
                [newMetric.server_id]: newMetric
              }));
              setLastUpdate(new Date());
            }
          }
        )
        .subscribe((status) => {
          console.log('[ServerRealtime] Metrics channel:', status);
          setIsConnected(status === 'SUBSCRIBED');
        });

      // Subscribe to alerts
      alertsChannel = supabase
        .channel('server-alerts-realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'server_alerts'
          },
          (payload) => {
            console.log('[ServerRealtime] New alert:', payload);
            if (payload.new) {
              setAlerts(prev => [payload.new as ServerAlert, ...prev.slice(0, 49)]);
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'server_alerts'
          },
          (payload) => {
            if (payload.new) {
              const updated = payload.new as ServerAlert;
              setAlerts(prev => 
                updated.is_resolved 
                  ? prev.filter(a => a.id !== updated.id)
                  : prev.map(a => a.id === updated.id ? updated : a)
              );
            }
          }
        )
        .subscribe();

      // Initial fetch
      await refreshMetrics();
    };

    setupSubscriptions();

    return () => {
      if (metricsChannel) supabase.removeChannel(metricsChannel);
      if (alertsChannel) supabase.removeChannel(alertsChannel);
    };
  }, [refreshMetrics]);

  // Auto-refresh controls
  const startAutoRefresh = useCallback((intervalMs = 5000) => {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
    }
    const interval = setInterval(refreshMetrics, intervalMs);
    setAutoRefreshInterval(interval);
  }, [autoRefreshInterval, refreshMetrics]);

  const stopAutoRefresh = useCallback(() => {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
      setAutoRefreshInterval(null);
    }
  }, [autoRefreshInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
      }
    };
  }, [autoRefreshInterval]);

  return {
    metrics,
    alerts,
    isConnected,
    lastUpdate,
    refreshMetrics,
    startAutoRefresh,
    stopAutoRefresh
  };
}

// Hook for dashboard summary with auto-refresh
export function useServerDashboard(autoRefreshMs = 5000) {
  const [summary, setSummary] = useState({
    total_servers: 0,
    online: 0,
    offline: 0,
    warnings: 0,
    critical_alerts: 0,
    avg_cpu: 0,
    avg_ram: 0,
    network_throughput: { in: 0, out: 0 }
  });
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    try {
      // Get servers
      const { data: servers } = await supabase
        .from('server_instances')
        .select('id, status')
        .neq('status', 'decommissioned');

      // Get metrics
      const { data: metrics } = await supabase
        .from('server_metrics_cache')
        .select('cpu_percent, ram_percent, network_in, network_out');

      // Get active alerts
      const { data: alerts } = await supabase
        .from('server_alerts')
        .select('severity')
        .eq('is_resolved', false);

      const total = servers?.length || 0;
      const online = servers?.filter(s => s.status === 'online').length || 0;
      const offline = servers?.filter(s => s.status === 'offline').length || 0;
      const warnings = alerts?.filter(a => a.severity === 'warning').length || 0;
      const critical = alerts?.filter(a => a.severity === 'critical').length || 0;

      const avgCpu = metrics?.length 
        ? metrics.reduce((acc, m) => acc + Number(m.cpu_percent || 0), 0) / metrics.length 
        : 0;
      const avgRam = metrics?.length 
        ? metrics.reduce((acc, m) => acc + Number(m.ram_percent || 0), 0) / metrics.length 
        : 0;
      const netIn = metrics?.reduce((acc, m) => acc + Number(m.network_in || 0), 0) || 0;
      const netOut = metrics?.reduce((acc, m) => acc + Number(m.network_out || 0), 0) || 0;

      setSummary({
        total_servers: total,
        online,
        offline,
        warnings,
        critical_alerts: critical,
        avg_cpu: Math.round(avgCpu * 100) / 100,
        avg_ram: Math.round(avgRam * 100) / 100,
        network_throughput: { in: netIn, out: netOut }
      });
    } catch (error) {
      console.error('[Dashboard] Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, autoRefreshMs);
    return () => clearInterval(interval);
  }, [fetchSummary, autoRefreshMs]);

  return { summary, loading, refresh: fetchSummary };
}

export default useServerRealtime;
