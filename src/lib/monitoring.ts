// ==============================================
// System Monitoring Client Library
// Post-Deployment Monitoring for SOFTWARE VALA
// ==============================================

import { supabase } from '@/integrations/supabase/client';

// Monitoring thresholds (matching backend)
export const MONITORING_THRESHOLDS = {
  LATENCY_WARNING: 500,
  LATENCY_CRITICAL: 2000,
  ERROR_RATE_WARNING: 0.05,
  ERROR_RATE_CRITICAL: 0.15,
  UPTIME_WARNING: 99.5,
  UPTIME_CRITICAL: 95.0,
} as const;

// Health status types
export type HealthStatus = 'healthy' | 'warning' | 'degraded' | 'critical' | 'outage';

// Monitoring report interfaces
export interface UptimeReport {
  overall_status: HealthStatus;
  uptime_percent: string;
  avg_latency_ms: number;
  services: {
    name: string;
    status: HealthStatus;
    latency_ms: number;
  }[];
  checked_at: string;
}

export interface LatencyReport {
  endpoints: {
    name: string;
    latency_ms: number;
    status: 'fast' | 'warning' | 'slow';
  }[];
  avg_latency_ms: number;
  checked_at: string;
}

export interface WebSocketReport {
  realtime_status: HealthStatus;
  realtime_latency_ms: number;
  active_chat_connections: number;
  pending_buzzer_alerts: number;
  checked_at: string;
}

export interface WalletAuditReport {
  pending_payouts: number;
  pending_unified_transactions: number;
  pending_developer_transactions: number;
  total_pending: number;
  status: HealthStatus;
  large_pending_count: number;
  checked_at: string;
}

export interface DemoHealthReport {
  total_active_demos: number;
  healthy_demos: number;
  unhealthy_demos: number;
  critical_demos: number;
  category_breakdown: Record<string, number>;
  avg_health_score: number | string;
  checked_at: string;
}

export interface FraudSLAReport {
  fraud: {
    active_alerts: number;
    high_risk_users: number;
    commission_fraud_flags: number;
  };
  sla: {
    breaches_24h: number;
    recent_breaches: {
      task_id: string;
      developer_id: string;
      breach_reason: string;
    }[];
  };
  checked_at: string;
}

export interface ApiHealthReport {
  total_apis: number;
  healthy: number;
  unhealthy: number;
  health_percent: string;
  apis: {
    name: string;
    status: HealthStatus;
    latency_ms: number;
  }[];
  checked_at: string;
}

export interface BackupStatusReport {
  last_backup: string;
  hours_since_backup: string | null;
  status: 'healthy' | 'warning' | 'overdue' | 'unknown';
  backup_schedule: string;
  checked_at: string;
}

export interface ErrorReport {
  total_errors: number;
  period_hours: number;
  errors_by_module: Record<string, number>;
  recent_errors: {
    timestamp: string;
    module: string;
    action: string;
  }[];
  checked_at: string;
}

export interface FullMonitoringReport {
  overall_health: HealthStatus;
  summary: {
    api_status: HealthStatus;
    api_latency_ms: number;
    websocket_status: HealthStatus;
    websocket_latency_ms: number;
    errors_24h: number;
    pending_transactions: number;
    active_demos: number;
    fraud_alerts: number;
    sla_breaches: number;
  };
  generated_at: string;
  generated_by: string;
}

// API response wrapper
interface MonitoringResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Base monitoring fetch function
async function fetchMonitoring<T>(endpoint: string): Promise<T | null> {
  try {
    const { data, error } = await supabase.functions.invoke('api-monitor', {
      body: {},
      method: 'GET',
    });

    // Since we can't pass path in invoke, we'll use direct fetch
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/api-monitor${endpoint}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`Monitoring API error: ${response.status}`);
      return null;
    }

    const result: MonitoringResponse<T> = await response.json();
    return result.success ? result.data || null : null;
  } catch (error) {
    console.error('Monitoring fetch error:', error);
    return null;
  }
}

// ========================================
// Monitoring API Functions
// ========================================

/**
 * Quick health pulse check
 */
export async function getHealthPulse(): Promise<{
  status: HealthStatus;
  latency: number;
  timestamp: string;
} | null> {
  return fetchMonitoring('/pulse');
}

/**
 * Get uptime monitoring report
 */
export async function getUptimeReport(): Promise<UptimeReport | null> {
  return fetchMonitoring('/uptime');
}

/**
 * Get latency tracking report
 */
export async function getLatencyReport(): Promise<LatencyReport | null> {
  return fetchMonitoring('/latency');
}

/**
 * Get WebSocket stability report
 */
export async function getWebSocketReport(): Promise<WebSocketReport | null> {
  return fetchMonitoring('/websocket');
}

/**
 * Get wallet transaction audit report
 */
export async function getWalletAuditReport(): Promise<WalletAuditReport | null> {
  return fetchMonitoring('/wallet-audit');
}

/**
 * Get demo health report
 */
export async function getDemoHealthReport(): Promise<DemoHealthReport | null> {
  return fetchMonitoring('/demo-health');
}

/**
 * Get fraud and SLA report
 */
export async function getFraudSLAReport(): Promise<FraudSLAReport | null> {
  return fetchMonitoring('/fraud-sla');
}

/**
 * Get API health report
 */
export async function getApiHealthReport(): Promise<ApiHealthReport | null> {
  return fetchMonitoring('/api-health');
}

/**
 * Get backup status report
 */
export async function getBackupStatusReport(): Promise<BackupStatusReport | null> {
  return fetchMonitoring('/backup-status');
}

/**
 * Get error report
 * @param hours Number of hours to look back (default 24)
 */
export async function getErrorReport(hours = 24): Promise<ErrorReport | null> {
  return fetchMonitoring(`/errors?hours=${hours}`);
}

/**
 * Get full monitoring report
 */
export async function getFullMonitoringReport(): Promise<FullMonitoringReport | null> {
  return fetchMonitoring('/full-report');
}

/**
 * Trigger a manual monitoring check
 */
export async function triggerManualCheck(checkType?: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/api-monitor/trigger-check`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ checkType }),
      }
    );

    return response.ok;
  } catch {
    return false;
  }
}

// ========================================
// Client-Side Monitoring Utilities
// ========================================

/**
 * Get health status color for UI
 */
export function getHealthStatusColor(status: HealthStatus): string {
  switch (status) {
    case 'healthy':
      return 'text-green-500';
    case 'warning':
      return 'text-yellow-500';
    case 'degraded':
      return 'text-orange-500';
    case 'critical':
    case 'outage':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}

/**
 * Get health status badge variant
 */
export function getHealthStatusVariant(status: HealthStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'healthy':
      return 'default';
    case 'warning':
    case 'degraded':
      return 'secondary';
    case 'critical':
    case 'outage':
      return 'destructive';
    default:
      return 'outline';
  }
}

/**
 * Format latency for display
 */
export function formatLatency(ms: number): string {
  if (ms < 100) return `${ms}ms (fast)`;
  if (ms < 500) return `${ms}ms (good)`;
  if (ms < 1000) return `${ms}ms (slow)`;
  return `${(ms / 1000).toFixed(1)}s (critical)`;
}

/**
 * Calculate overall system health from multiple reports
 */
export function calculateOverallHealth(reports: {
  uptime?: UptimeReport | null;
  latency?: LatencyReport | null;
  websocket?: WebSocketReport | null;
  api?: ApiHealthReport | null;
}): HealthStatus {
  const statuses: HealthStatus[] = [];

  if (reports.uptime) {
    statuses.push(reports.uptime.overall_status);
  }

  if (reports.websocket) {
    statuses.push(reports.websocket.realtime_status);
  }

  if (reports.api) {
    const healthPercent = parseFloat(reports.api.health_percent);
    if (healthPercent < 80) statuses.push('critical');
    else if (healthPercent < 90) statuses.push('degraded');
    else if (healthPercent < 95) statuses.push('warning');
    else statuses.push('healthy');
  }

  // Return worst status
  if (statuses.includes('outage') || statuses.includes('critical')) return 'critical';
  if (statuses.includes('degraded')) return 'degraded';
  if (statuses.includes('warning')) return 'warning';
  return 'healthy';
}

/**
 * Log client-side error for monitoring
 */
export async function logClientError(
  error: Error,
  context: Record<string, any> = {}
): Promise<void> {
  try {
    await supabase.from('audit_logs').insert({
      module: 'client_error',
      action: 'error_logged',
      meta_json: {
        message: error.message,
        stack: error.stack?.substring(0, 500),
        ...context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      },
    });
  } catch (e) {
    console.error('Failed to log client error:', e);
  }
}

/**
 * Performance monitoring - track page load times
 */
export function trackPagePerformance(): void {
  if (typeof window === 'undefined' || !window.performance) return;

  window.addEventListener('load', () => {
    setTimeout(async () => {
      const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (!timing) return;

      const metrics = {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        connection: timing.connectEnd - timing.connectStart,
        ttfb: timing.responseStart - timing.requestStart,
        domLoad: timing.domContentLoadedEventEnd - timing.startTime,
        fullLoad: timing.loadEventEnd - timing.startTime,
      };

      // Log if any metric is concerning
      if (metrics.fullLoad > 5000 || metrics.ttfb > 1000) {
        await supabase.from('audit_logs').insert({
          module: 'performance',
          action: 'slow_page_load',
          meta_json: {
            ...metrics,
            url: window.location.pathname,
            timestamp: new Date().toISOString(),
          },
        });
      }
    }, 0);
  });
}

// Export monitoring config for reference
export const MONITORING_CONFIG = {
  thresholds: MONITORING_THRESHOLDS,
  checkIntervals: {
    pulse: 30000,      // 30 seconds
    uptime: 60000,     // 1 minute
    full: 300000,      // 5 minutes
  },
  alertLevels: ['healthy', 'warning', 'degraded', 'critical', 'outage'] as const,
} as const;
