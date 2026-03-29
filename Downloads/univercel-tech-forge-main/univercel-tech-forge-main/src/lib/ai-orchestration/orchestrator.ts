/**
 * AI Orchestration Layer
 * Multi-tenant task routing, load balancing, and anomaly detection
 * Preserves existing RBAC, masking, and module architecture
 */

import { TenantRBACManager, AppRole } from '@/lib/multi-tenant/tenant-rbac';

// Orchestration events
export type OrchestrationEvent = 
  | 'task_route' 
  | 'load_balance' 
  | 'anomaly_detect' 
  | 'sync_trigger' 
  | 'conflict_resolve'
  | 'tenant_alert';

export interface OrchestrationConfig {
  autoRouteEnabled: boolean;
  loadBalanceThreshold: number;
  anomalyDetectionEnabled: boolean;
  syncInterval: number;
  alertEscalationEnabled: boolean;
}

export interface TenantMetrics {
  tenantId: string;
  activeConnections: number;
  pendingSyncs: number;
  chatLoad: number;
  buzzerQueue: number;
  walletTransactions: number;
  lastActivity: string;
}

const DEFAULT_CONFIG: OrchestrationConfig = {
  autoRouteEnabled: true,
  loadBalanceThreshold: 80,
  anomalyDetectionEnabled: true,
  syncInterval: 30000,
  alertEscalationEnabled: true
};

export class AIOrchestrator {
  private config: OrchestrationConfig;
  private tenantMetrics: Map<string, TenantMetrics> = new Map();
  private listeners: Map<OrchestrationEvent, Set<(...args: unknown[]) => void>> = new Map();

  constructor(config: Partial<OrchestrationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Auto-route tasks between tenants based on expertise
  async routeTask(task: { type: string; skills: string[]; priority: string }, availableTenants: string[]): Promise<string | null> {
    if (!this.config.autoRouteEnabled) return null;
    
    // Find best tenant based on load and skills
    let bestTenant: string | null = null;
    let lowestLoad = Infinity;

    for (const tenantId of availableTenants) {
      const metrics = this.tenantMetrics.get(tenantId);
      if (metrics && metrics.chatLoad < lowestLoad) {
        lowestLoad = metrics.chatLoad;
        bestTenant = tenantId;
      }
    }

    this.emit('task_route', { task, selectedTenant: bestTenant });
    return bestTenant;
  }

  // Auto-scale based on tenant demand
  async balanceLoad(tenantId: string): Promise<{ action: string; scale: number }> {
    const metrics = this.tenantMetrics.get(tenantId);
    if (!metrics) return { action: 'none', scale: 1 };

    const loadPercentage = (metrics.chatLoad + metrics.buzzerQueue) / 2;
    
    if (loadPercentage > this.config.loadBalanceThreshold) {
      this.emit('load_balance', { tenantId, action: 'scale_up' });
      return { action: 'scale_up', scale: Math.ceil(loadPercentage / 50) };
    }

    return { action: 'maintain', scale: 1 };
  }

  // Detect tenant-level anomalies
  async detectAnomalies(tenantId: string): Promise<string[]> {
    if (!this.config.anomalyDetectionEnabled) return [];
    
    const metrics = this.tenantMetrics.get(tenantId);
    if (!metrics) return [];

    const anomalies: string[] = [];

    if (metrics.pendingSyncs > 100) anomalies.push('high_sync_backlog');
    if (metrics.walletTransactions > 1000) anomalies.push('unusual_transaction_volume');
    if (metrics.buzzerQueue > 50) anomalies.push('buzzer_overload');

    if (anomalies.length > 0) {
      this.emit('anomaly_detect', { tenantId, anomalies });
    }

    return anomalies;
  }

  // Update tenant metrics
  updateMetrics(tenantId: string, metrics: Partial<TenantMetrics>): void {
    const existing = this.tenantMetrics.get(tenantId) || {
      tenantId,
      activeConnections: 0,
      pendingSyncs: 0,
      chatLoad: 0,
      buzzerQueue: 0,
      walletTransactions: 0,
      lastActivity: new Date().toISOString()
    };

    this.tenantMetrics.set(tenantId, { ...existing, ...metrics, lastActivity: new Date().toISOString() });
  }

  // Escalate alert to BOSS
  async escalateToBoss(tenantId: string, alertType: string, details: Record<string, any>): Promise<void> {
    if (!this.config.alertEscalationEnabled) return;

    this.emit('tenant_alert', {
      tenantId,
      alertType,
      details,
      escalatedTo: '👑 BOSS',
      timestamp: new Date().toISOString()
    });
  }

  // Event subscription
  on(event: OrchestrationEvent, callback: (...args: unknown[]) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.listeners.get(event)?.delete(callback);
  }

  private emit(event: OrchestrationEvent, data: any): void {
    this.listeners.get(event)?.forEach(cb => cb(data));
  }

  // Get all tenant metrics
  getAllMetrics(): TenantMetrics[] {
    return Array.from(this.tenantMetrics.values());
  }
}

export const orchestrator = new AIOrchestrator();
export default AIOrchestrator;
