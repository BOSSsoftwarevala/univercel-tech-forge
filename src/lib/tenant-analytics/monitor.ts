/**
 * Tenant Analytics & Monitoring
 * Per-tenant uptime, SLA, fraud detection, and BOSS alerts
 * Preserves existing monitoring infrastructure
 */

export interface TenantAnalytics {
  tenantId: string;
  uptime: number;
  slaCompliance: number;
  fraudScore: number;
  walletUsage: { earned: number; withdrawn: number; pending: number };
  chatActivity: number;
  lastAlert?: { type: string; timestamp: string };
}

export interface MonitoringConfig {
  uptimeThreshold: number;
  slaThreshold: number;
  fraudThreshold: number;
  alertInterval: number;
}

const DEFAULT_CONFIG: MonitoringConfig = {
  uptimeThreshold: 99.5,
  slaThreshold: 95,
  fraudThreshold: 70,
  alertInterval: 60000
};

export class TenantMonitor {
  private config: MonitoringConfig;
  private analytics: Map<string, TenantAnalytics> = new Map();
  private alertCallbacks: Set<(alert: any) => void> = new Set();

  constructor(config: Partial<MonitoringConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Update tenant analytics
  updateAnalytics(tenantId: string, data: Partial<TenantAnalytics>): void {
    const existing = this.analytics.get(tenantId) || {
      tenantId,
      uptime: 100,
      slaCompliance: 100,
      fraudScore: 0,
      walletUsage: { earned: 0, withdrawn: 0, pending: 0 },
      chatActivity: 0
    };

    this.analytics.set(tenantId, { ...existing, ...data });
    this.checkThresholds(tenantId);
  }

  // Check thresholds and alert
  private checkThresholds(tenantId: string): void {
    const data = this.analytics.get(tenantId);
    if (!data) return;

    if (data.uptime < this.config.uptimeThreshold) {
      this.sendAlert(tenantId, 'uptime_warning', `Uptime dropped to ${data.uptime}%`);
    }

    if (data.slaCompliance < this.config.slaThreshold) {
      this.sendAlert(tenantId, 'sla_breach', `SLA compliance at ${data.slaCompliance}%`);
    }

    if (data.fraudScore > this.config.fraudThreshold) {
      this.sendAlert(tenantId, 'fraud_detected', `Fraud score: ${data.fraudScore}`);
    }
  }

  // Send alert to BOSS
  private sendAlert(tenantId: string, type: string, message: string): void {
    const alert = {
      tenantId,
      type,
      message,
      escalatedTo: '👑 BOSS',
      timestamp: new Date().toISOString()
    };

    this.alertCallbacks.forEach(cb => cb(alert));
    
    // Update last alert
    const analytics = this.analytics.get(tenantId);
    if (analytics) {
      analytics.lastAlert = { type, timestamp: alert.timestamp };
      this.analytics.set(tenantId, analytics);
    }
  }

  // Subscribe to alerts
  onAlert(callback: (alert: any) => void): () => void {
    this.alertCallbacks.add(callback);
    return () => this.alertCallbacks.delete(callback);
  }

  // Get tenant analytics
  getAnalytics(tenantId: string): TenantAnalytics | null {
    return this.analytics.get(tenantId) || null;
  }

  // Get all analytics
  getAllAnalytics(): TenantAnalytics[] {
    return Array.from(this.analytics.values());
  }
}

export const tenantMonitor = new TenantMonitor();
export default TenantMonitor;
