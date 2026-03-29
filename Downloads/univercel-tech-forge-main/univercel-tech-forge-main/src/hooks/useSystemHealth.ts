/**
 * SYSTEM HEALTH HOOK
 * Monitors all services with primary + shadow server status
 */
import { useState, useEffect, useCallback } from 'react';

export type ServiceStatus = 'healthy' | 'degraded' | 'critical' | 'offline' | 'standby';

export interface SystemHealthData {
  serviceName: string;
  primaryStatus: ServiceStatus;
  shadowStatus: ServiceStatus;
  lastSyncTime: string;
  responseTimeAvgMs: number;
  errorCount24h: number;
  uptimePercent: number;
}

interface UseSystemHealthReturn {
  healthData: SystemHealthData[];
  isLoading: boolean;
  error: string | null;
  refreshHealth: () => Promise<void>;
  getServiceStatus: (serviceName: string) => SystemHealthData | undefined;
  overallStatus: ServiceStatus;
}

const DEFAULT_SERVICES: SystemHealthData[] = [
  { serviceName: 'auth-service', primaryStatus: 'healthy', shadowStatus: 'standby', lastSyncTime: new Date().toISOString(), responseTimeAvgMs: 45, errorCount24h: 0, uptimePercent: 99.99 },
  { serviceName: 'database-service', primaryStatus: 'healthy', shadowStatus: 'standby', lastSyncTime: new Date().toISOString(), responseTimeAvgMs: 28, errorCount24h: 0, uptimePercent: 99.99 },
  { serviceName: 'api-gateway', primaryStatus: 'healthy', shadowStatus: 'standby', lastSyncTime: new Date().toISOString(), responseTimeAvgMs: 52, errorCount24h: 0, uptimePercent: 99.98 },
  { serviceName: 'ai-engine', primaryStatus: 'healthy', shadowStatus: 'standby', lastSyncTime: new Date().toISOString(), responseTimeAvgMs: 89, errorCount24h: 0, uptimePercent: 99.95 },
  { serviceName: 'storage-service', primaryStatus: 'healthy', shadowStatus: 'standby', lastSyncTime: new Date().toISOString(), responseTimeAvgMs: 35, errorCount24h: 0, uptimePercent: 99.99 },
  { serviceName: 'notification-service', primaryStatus: 'healthy', shadowStatus: 'standby', lastSyncTime: new Date().toISOString(), responseTimeAvgMs: 42, errorCount24h: 0, uptimePercent: 99.97 },
];

export function useSystemHealth(): UseSystemHealthReturn {
  const [healthData, setHealthData] = useState<SystemHealthData[]>(DEFAULT_SERVICES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshHealth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate health check - in production this would query the system_health table
      // For now, use default services with simulated live updates
      const updatedServices = DEFAULT_SERVICES.map(service => ({
        ...service,
        lastSyncTime: new Date().toISOString(),
        responseTimeAvgMs: service.responseTimeAvgMs + Math.floor(Math.random() * 10) - 5,
      }));

      setHealthData(updatedServices);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch system health');
      setHealthData(DEFAULT_SERVICES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getServiceStatus = useCallback((serviceName: string) => {
    return healthData.find(s => s.serviceName === serviceName);
  }, [healthData]);

  const overallStatus: ServiceStatus = healthData.some(s => s.primaryStatus === 'critical' || s.primaryStatus === 'offline')
    ? 'critical'
    : healthData.some(s => s.primaryStatus === 'degraded')
    ? 'degraded'
    : 'healthy';

  useEffect(() => {
    refreshHealth();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshHealth, 30000);
    return () => clearInterval(interval);
  }, [refreshHealth]);

  return {
    healthData,
    isLoading,
    error,
    refreshHealth,
    getServiceStatus,
    overallStatus,
  };
}

export default useSystemHealth;
