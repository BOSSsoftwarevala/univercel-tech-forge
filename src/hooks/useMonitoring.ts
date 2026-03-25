// ==============================================
// Monitoring React Hook
// Real-time system health monitoring for UI
// ==============================================

import { useState, useEffect, useCallback } from 'react';
import {
  getFullMonitoringReport,
  getHealthPulse,
  getUptimeReport,
  getWebSocketReport,
  getWalletAuditReport,
  getDemoHealthReport,
  getFraudSLAReport,
  getApiHealthReport,
  getBackupStatusReport,
  getErrorReport,
  FullMonitoringReport,
  UptimeReport,
  WebSocketReport,
  WalletAuditReport,
  DemoHealthReport,
  FraudSLAReport,
  ApiHealthReport,
  BackupStatusReport,
  ErrorReport,
  HealthStatus,
  MONITORING_CONFIG,
} from '@/lib/monitoring';

interface MonitoringState {
  isLoading: boolean;
  lastUpdated: Date | null;
  error: string | null;
  fullReport: FullMonitoringReport | null;
  uptime: UptimeReport | null;
  websocket: WebSocketReport | null;
  walletAudit: WalletAuditReport | null;
  demoHealth: DemoHealthReport | null;
  fraudSla: FraudSLAReport | null;
  apiHealth: ApiHealthReport | null;
  backupStatus: BackupStatusReport | null;
  errors: ErrorReport | null;
}

interface UseMonitoringOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  modules?: ('full' | 'uptime' | 'websocket' | 'wallet' | 'demo' | 'fraud' | 'api' | 'backup' | 'errors')[];
}

export function useMonitoring(options: UseMonitoringOptions = {}) {
  const {
    autoRefresh = true,
    refreshInterval = MONITORING_CONFIG.checkIntervals.full,
    modules = ['full'],
  } = options;

  const [state, setState] = useState<MonitoringState>({
    isLoading: true,
    lastUpdated: null,
    error: null,
    fullReport: null,
    uptime: null,
    websocket: null,
    walletAudit: null,
    demoHealth: null,
    fraudSla: null,
    apiHealth: null,
    backupStatus: null,
    errors: null,
  });

  const refresh = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const updates: Partial<MonitoringState> = {};

      // Fetch requested modules in parallel
      const fetchers: Promise<void>[] = [];

      if (modules.includes('full')) {
        fetchers.push(
          getFullMonitoringReport().then(data => {
            updates.fullReport = data;
          })
        );
      }

      if (modules.includes('uptime')) {
        fetchers.push(
          getUptimeReport().then(data => {
            updates.uptime = data;
          })
        );
      }

      if (modules.includes('websocket')) {
        fetchers.push(
          getWebSocketReport().then(data => {
            updates.websocket = data;
          })
        );
      }

      if (modules.includes('wallet')) {
        fetchers.push(
          getWalletAuditReport().then(data => {
            updates.walletAudit = data;
          })
        );
      }

      if (modules.includes('demo')) {
        fetchers.push(
          getDemoHealthReport().then(data => {
            updates.demoHealth = data;
          })
        );
      }

      if (modules.includes('fraud')) {
        fetchers.push(
          getFraudSLAReport().then(data => {
            updates.fraudSla = data;
          })
        );
      }

      if (modules.includes('api')) {
        fetchers.push(
          getApiHealthReport().then(data => {
            updates.apiHealth = data;
          })
        );
      }

      if (modules.includes('backup')) {
        fetchers.push(
          getBackupStatusReport().then(data => {
            updates.backupStatus = data;
          })
        );
      }

      if (modules.includes('errors')) {
        fetchers.push(
          getErrorReport().then(data => {
            updates.errors = data;
          })
        );
      }

      await Promise.all(fetchers);

      setState(prev => ({
        ...prev,
        ...updates,
        isLoading: false,
        lastUpdated: new Date(),
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch monitoring data',
      }));
    }
  }, [modules]);

  // Initial fetch
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refresh]);

  return {
    ...state,
    refresh,
  };
}

// Quick pulse hook for lightweight health checks
export function useHealthPulse(intervalMs = MONITORING_CONFIG.checkIntervals.pulse) {
  const [pulse, setPulse] = useState<{
    status: HealthStatus;
    latency: number;
    timestamp: string;
  } | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const checkPulse = async () => {
      const result = await getHealthPulse();
      if (result) {
        setPulse(result);
        setIsOnline(result.status !== 'outage');
      } else {
        setIsOnline(false);
      }
    };

    checkPulse();
    const interval = setInterval(checkPulse, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  return { pulse, isOnline };
}

// Export for convenience
export type { MonitoringState, UseMonitoringOptions };
