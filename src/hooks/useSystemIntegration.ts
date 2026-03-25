/**
 * AI CEO — Full System Integration Hook
 * Provides real-time cross-module read, trigger, assign, and sync
 * for the AI CEO central brain.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { callEdgeRoute } from '@/lib/api/edge-client';
import { toast } from 'sonner';

// ─── Module Registry ────────────────────────────────────────────────────────

export const ALL_MODULES = [
  'boss_panel',
  'ceo_dashboard',
  'vala_ai',
  'server_manager',
  'ai_api_manager',
  'dev_manager',
  'product_manager',
  'demo_manager',
  'task_manager',
  'promise_tracker',
  'asset_manager',
  'marketing_manager',
  'sales_support',
  'franchise_manager',
  'user_system',
  'notification_system',
  'logs_system',
  'security_layer',
  'db_layer',
  'api_layer',
] as const;

export type ModuleId = typeof ALL_MODULES[number];

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ModuleStatus {
  id: ModuleId;
  label: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  lastScan: string;
  healthScore: number;
  activeUsers?: number;
  errorRate?: number;
  latencyMs?: number;
  openIssues: number;
}

export interface SystemScanResult {
  scannedAt: string;
  totalModules: number;
  healthyModules: number;
  warningModules: number;
  criticalModules: number;
  overallHealth: number;
  modules: ModuleStatus[];
}

export interface CrossModuleEvent {
  id: string;
  sourceModule: ModuleId;
  targetModule?: ModuleId;
  eventType: string;
  severity: 'info' | 'warning' | 'critical' | 'emergency';
  title: string;
  description: string;
  payload: Record<string, unknown>;
  requiresAction: boolean;
  createdAt: string;
  processedAt?: string;
}

export interface SecretaryBriefing {
  id: string;
  generatedAt: string;
  period: 'morning' | 'afternoon' | 'evening' | 'overnight';
  summary: string;
  urgentItems: BriefingItem[];
  pendingDecisions: BriefingItem[];
  moduleUpdates: ModuleUpdate[];
  scheduledActions: ScheduledAction[];
}

export interface BriefingItem {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  module: string;
  title: string;
  detail: string;
  actionRequired: boolean;
  dueAt?: string;
}

export interface ModuleUpdate {
  module: string;
  status: 'active' | 'idle' | 'error' | 'maintenance';
  lastActivity: string;
  summary: string;
}

export interface ScheduledAction {
  id: string;
  title: string;
  module: string;
  scheduledFor: string;
  status: 'pending' | 'executing' | 'done' | 'failed';
}

export interface SpySurveillanceReport {
  generatedAt: string;
  anomaliesDetected: AnomalyRecord[];
  activitySummary: ActivitySummary[];
  topAnomalyModules: string[];
  overallThreatLevel: 'low' | 'medium' | 'high' | 'critical';
  securityFlags: SecurityFlag[];
}

export interface AnomalyRecord {
  id: string;
  module: string;
  type: 'unusual_traffic' | 'auth_failure' | 'data_mismatch' | 'latency_spike' | 'error_surge' | 'suspicious_action';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: string;
  resolved: boolean;
}

export interface ActivitySummary {
  module: string;
  actionsLast1h: number;
  actionsLast24h: number;
  failureRate: number;
  topActions: string[];
}

export interface SecurityFlag {
  id: string;
  module: string;
  flag: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  flaggedAt: string;
  requiresBossApproval: boolean;
}

// ─── Module label map ───────────────────────────────────────────────────────

const MODULE_LABELS: Record<ModuleId, string> = {
  boss_panel: 'Boss Panel',
  ceo_dashboard: 'CEO Dashboard',
  vala_ai: 'Vala AI',
  server_manager: 'Server Manager',
  ai_api_manager: 'AI API Manager',
  dev_manager: 'Dev Manager',
  product_manager: 'Product Manager',
  demo_manager: 'Demo Manager',
  task_manager: 'Task Manager',
  promise_tracker: 'Promise Tracker',
  asset_manager: 'Asset Manager',
  marketing_manager: 'Marketing Manager',
  sales_support: 'Sales & Support',
  franchise_manager: 'Franchise Manager',
  user_system: 'User System',
  notification_system: 'Notification System',
  logs_system: 'Logs System',
  security_layer: 'Security Layer',
  db_layer: 'DB Layer',
  api_layer: 'API Layer',
};

// ─── DB → ModuleStatus mapper ────────────────────────────────────────────────

/** Weight applied to error rate (%) when computing health score */
const HEALTH_ERROR_RATE_WEIGHT = 10;
/** Points deducted per critical/open alert when computing health score */
const HEALTH_ALERT_DEDUCTION = 5;

function buildModuleStatuses(
  healthRows: Array<{ service?: string; metric?: string; status?: string; error_rate?: number; latency?: number; uptime?: number; timestamp?: string }>,
  alertRows: Array<{ source_module?: string; severity?: string; status?: string }>,
  taskRows: Array<{ entity_type?: string; status?: string }>,
  eventRows: Array<{ source_module?: string }>,
): ModuleStatus[] {
  return ALL_MODULES.map((moduleId) => {
    const serviceKey = moduleId.replace(/_/g, '-');
    const moduleHealth = healthRows.filter(
      (row) => (row.service || '').includes(serviceKey) || (row.service || '').includes(moduleId),
    );
    const moduleAlerts = alertRows.filter(
      (row) =>
        (row.source_module || '').includes(serviceKey) ||
        (row.source_module || '').includes(moduleId),
    );
    const criticalAlerts = moduleAlerts.filter(
      (a) => ['critical', 'emergency'].includes(a.severity || '') && ['open', 'acknowledged'].includes(a.status || ''),
    );

    const latestHealth = moduleHealth[0];
    const uptime = latestHealth?.uptime ?? 100;
    const errorRate = latestHealth?.error_rate ?? 0;
    const latency = latestHealth?.latency ?? null;
    const healthScore = Math.max(
      0,
      Math.min(
        100,
        Math.round((uptime || 100) - (errorRate || 0) * HEALTH_ERROR_RATE_WEIGHT - criticalAlerts.length * HEALTH_ALERT_DEDUCTION),
      ),
    );

    let status: ModuleStatus['status'] = 'healthy';
    if (criticalAlerts.length > 0 || healthScore < 50) status = 'critical';
    else if (healthScore < 80 || errorRate > 0.1) status = 'warning';
    else if (!latestHealth) status = 'unknown';

    const openTasks = taskRows.filter(
      (t) =>
        (t.entity_type || '').includes(serviceKey) &&
        !['done', 'completed', 'cancelled'].includes(t.status || ''),
    ).length;

    return {
      id: moduleId,
      label: MODULE_LABELS[moduleId],
      status,
      lastScan: latestHealth?.timestamp ?? new Date().toISOString(),
      healthScore,
      errorRate: errorRate ?? undefined,
      latencyMs: latency ?? undefined,
      openIssues: criticalAlerts.length + openTasks,
    };
  });
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSystemIntegration() {
  const [scanResult, setScanResult] = useState<SystemScanResult | null>(null);
  const [events, setEvents] = useState<CrossModuleEvent[]>([]);
  const [briefing, setBriefing] = useState<SecretaryBriefing | null>(null);
  const [surveillance, setSurveillance] = useState<SpySurveillanceReport | null>(null);
  const [scanning, setScanning] = useState(false);
  const [loadingBriefing, setLoadingBriefing] = useState(false);
  const [loadingSurveillance, setLoadingSurveillance] = useState(false);
  const realtimeRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // ── Full system scan ─────────────────────────────────────────────────────

  const runFullScan = useCallback(async (): Promise<SystemScanResult | null> => {
    setScanning(true);
    try {
      const [healthResult, alertsResult, tasksResult, eventsResult] = await Promise.all([
        supabase.from('system_health').select('service, metric, status, error_rate, latency, uptime, timestamp').order('timestamp', { ascending: false }).limit(200),
        supabase.from('alerts').select('source_module, severity, status').is('deleted_at', null).limit(500),
        supabase.from('tasks').select('entity_type, status').is('deleted_at', null).limit(500),
        supabase.from('system_events').select('source_module').order('created_at', { ascending: false }).limit(500),
      ]);

      const modules = buildModuleStatuses(
        healthResult.data ?? [],
        alertsResult.data ?? [],
        tasksResult.data ?? [],
        eventsResult.data ?? [],
      );

      const healthy = modules.filter((m) => m.status === 'healthy').length;
      const warning = modules.filter((m) => m.status === 'warning').length;
      const critical = modules.filter((m) => m.status === 'critical').length;
      const overallHealth = Math.round(modules.reduce((s, m) => s + m.healthScore, 0) / modules.length);

      const result: SystemScanResult = {
        scannedAt: new Date().toISOString(),
        totalModules: modules.length,
        healthyModules: healthy,
        warningModules: warning,
        criticalModules: critical,
        overallHealth,
        modules,
      };

      setScanResult(result);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'System scan failed';
      toast.error(msg);
      return null;
    } finally {
      setScanning(false);
    }
  }, []);

  // ── Cross-module events ──────────────────────────────────────────────────

  const loadEvents = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('system_events')
        .select('id, source_module, target_module, event_type, severity, title, description, payload, requires_action, created_at, processed_at')
        .order('created_at', { ascending: false })
        .limit(50);

      if (data) {
        setEvents(
          data.map((row) => ({
            id: row.id,
            sourceModule: (row.source_module ?? 'api_layer') as ModuleId,
            targetModule: row.target_module as ModuleId | undefined,
            eventType: row.event_type ?? 'unknown',
            severity: (row.severity ?? 'info') as CrossModuleEvent['severity'],
            title: row.title ?? 'System Event',
            description: row.description ?? '',
            payload: (row.payload as Record<string, unknown>) ?? {},
            requiresAction: Boolean(row.requires_action),
            createdAt: row.created_at ?? new Date().toISOString(),
            processedAt: row.processed_at ?? undefined,
          })),
        );
      }
    } catch (err) {
      console.error('[SystemIntegration] loadEvents error:', err);
    }
  }, []);

  // ── Secretary briefing ──────────────────────────────────────────────────

  const generateBriefing = useCallback(async (): Promise<SecretaryBriefing | null> => {
    setLoadingBriefing(true);
    try {
      const response = await callEdgeRoute<{ briefing: SecretaryBriefing }>('api-ceo', 'secretary/briefing');
      if (response.data?.briefing) {
        setBriefing(response.data.briefing);
        return response.data.briefing;
      }
      return null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Briefing generation failed';
      toast.error(msg);
      return null;
    } finally {
      setLoadingBriefing(false);
    }
  }, []);

  // ── Spy surveillance ─────────────────────────────────────────────────────

  const runSurveillance = useCallback(async (): Promise<SpySurveillanceReport | null> => {
    setLoadingSurveillance(true);
    try {
      const response = await callEdgeRoute<{ report: SpySurveillanceReport }>('api-ceo', 'spy/surveillance');
      if (response.data?.report) {
        setSurveillance(response.data.report);
        return response.data.report;
      }
      return null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Surveillance scan failed';
      toast.error(msg);
      return null;
    } finally {
      setLoadingSurveillance(false);
    }
  }, []);

  // ── Module action trigger ─────────────────────────────────────────────────

  const triggerModuleAction = useCallback(
    async (moduleId: ModuleId, action: string, payload: Record<string, unknown> = {}): Promise<boolean> => {
      try {
        await callEdgeRoute<{ status: string }>('api-ceo', 'module/action', {
          method: 'POST',
          body: { module: moduleId, action, payload },
        });
        toast.success(`Action '${action}' triggered on ${MODULE_LABELS[moduleId]}`);
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : `Action failed on ${MODULE_LABELS[moduleId]}`;
        toast.error(msg);
        return false;
      }
    },
    [],
  );

  // ── Real-time subscription (system_events channel) ───────────────────────

  useEffect(() => {
    void loadEvents();

    const channel = supabase
      .channel('system_integration_events')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'system_events' },
        (payload) => {
          const row = payload.new as Record<string, unknown>;
          setEvents((prev) => [
            {
              id: String(row.id ?? ''),
              sourceModule: (row.source_module ?? 'api_layer') as ModuleId,
              targetModule: row.target_module as ModuleId | undefined,
              eventType: String(row.event_type ?? 'unknown'),
              severity: (row.severity ?? 'info') as CrossModuleEvent['severity'],
              title: String(row.title ?? 'System Event'),
              description: String(row.description ?? ''),
              payload: (row.payload as Record<string, unknown>) ?? {},
              requiresAction: Boolean(row.requires_action),
              createdAt: String(row.created_at ?? new Date().toISOString()),
              processedAt: row.processed_at ? String(row.processed_at) : undefined,
            },
            ...prev.slice(0, 49),
          ]);
        },
      )
      .subscribe();

    realtimeRef.current = channel;

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadEvents]);

  return {
    // Scan
    scanResult,
    scanning,
    runFullScan,
    // Events
    events,
    loadEvents,
    // Secretary
    briefing,
    loadingBriefing,
    generateBriefing,
    // Spy
    surveillance,
    loadingSurveillance,
    runSurveillance,
    // Action control
    triggerModuleAction,
    MODULE_LABELS,
  };
}
