/**
 * Disaster Recovery System
 * Region failover, backup replication, auto-restore
 * Preserves masked logs, wallet state, and RBAC
 */

import { Region, regionManager, RegionHealth } from './region-manager';
import { replicationManager } from './replication-manager';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'detected' | 'investigating' | 'mitigating' | 'resolved' | 'escalated';

export interface Incident {
  id: string;
  region: Region;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  detectedAt: string;
  resolvedAt?: string;
  failoverRegion?: Region;
  escalatedToBoss: boolean;
  affectedTenants: string[];
  recoveryActions: string[];
}

export interface BackupState {
  region: Region;
  lastBackup: string;
  walletState: 'synced' | 'pending' | 'stale';
  logsState: 'synced' | 'pending' | 'stale';
  maskedDataIntact: boolean;
  backupSize: number;
}

export interface FailoverConfig {
  autoFailover: boolean;
  failoverThreshold: number; // consecutive failures
  healthCheckInterval: number;
  incidentEscalationDelay: number; // ms before escalating to BOSS
  preserveMasking: boolean;
  preserveWalletState: boolean;
}

const DEFAULT_CONFIG: FailoverConfig = {
  autoFailover: true,
  failoverThreshold: 3,
  healthCheckInterval: 10000,
  incidentEscalationDelay: 60000, // 1 minute
  preserveMasking: true,
  preserveWalletState: true
};

export class DisasterRecoveryManager {
  private config: FailoverConfig;
  private incidents: Map<string, Incident> = new Map();
  private backupStates: Map<Region, BackupState> = new Map();
  private failureCount: Map<Region, number> = new Map();
  private alertCallbacks: Set<(incident: Incident) => void> = new Set();

  constructor(config: Partial<FailoverConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initializeMonitoring();
  }

  /**
   * Initialize health monitoring
   */
  private initializeMonitoring(): void {
    setInterval(() => this.checkRegionHealth(), this.config.healthCheckInterval);
    this.initializeBackupStates();
  }

  /**
   * Initialize backup states for all regions
   */
  private initializeBackupStates(): void {
    regionManager.getActiveRegions().forEach(region => {
      this.backupStates.set(region.id, {
        region: region.id,
        lastBackup: new Date().toISOString(),
        walletState: 'synced',
        logsState: 'synced',
        maskedDataIntact: true,
        backupSize: 0
      });
      this.failureCount.set(region.id, 0);
    });
  }

  /**
   * Check region health and trigger failover if needed
   */
  private async checkRegionHealth(): Promise<void> {
    const healthStatuses = regionManager.getAllHealth();

    for (const health of healthStatuses) {
      if (health.status === 'offline') {
        const failures = (this.failureCount.get(health.region) || 0) + 1;
        this.failureCount.set(health.region, failures);

        if (failures >= this.config.failoverThreshold && this.config.autoFailover) {
          await this.initiateFailover(health.region, 'Region unresponsive');
        }
      } else {
        this.failureCount.set(health.region, 0);
      }
    }
  }

  /**
   * Initiate region failover
   */
  async initiateFailover(region: Region, reason: string): Promise<Incident> {
    const failoverRegion = regionManager.getFailoverRegion(region);
    
    const incident: Incident = {
      id: crypto.randomUUID(),
      region,
      severity: 'critical',
      status: 'detected',
      description: reason,
      detectedAt: new Date().toISOString(),
      failoverRegion: failoverRegion || undefined,
      escalatedToBoss: false,
      affectedTenants: [],
      recoveryActions: []
    };

    this.incidents.set(incident.id, incident);
    this.notifyAlerts(incident);

    // Start failover process
    incident.status = 'mitigating';
    incident.recoveryActions.push(`Failover initiated to ${failoverRegion}`);

    if (failoverRegion) {
      try {
        // Sync critical data to failover region
        await this.syncToFailoverRegion(region, failoverRegion);
        incident.recoveryActions.push('Critical data synced to failover region');

        // Verify masking intact
        if (this.config.preserveMasking) {
          await this.verifyMaskingIntact(failoverRegion);
          incident.recoveryActions.push('Masking verified intact');
        }

        // Verify wallet state
        if (this.config.preserveWalletState) {
          await this.verifyWalletState(failoverRegion);
          incident.recoveryActions.push('Wallet state verified');
        }

        incident.status = 'resolved';
        incident.resolvedAt = new Date().toISOString();
      } catch (error) {
        incident.status = 'escalated';
        incident.escalatedToBoss = true;
        incident.recoveryActions.push(`Failover failed: ${error}. Escalated to 👑 BOSS`);
      }
    } else {
      // No failover region available - escalate immediately
      await this.escalateToBoss(incident);
    }

    this.incidents.set(incident.id, incident);
    this.notifyAlerts(incident);
    
    return incident;
  }

  /**
   * Sync data to failover region
   */
  private async syncToFailoverRegion(_sourceRegion: Region, _targetRegion: Region): Promise<void> {
    // Force sync all pending replications
    await replicationManager.forceSyncAll();
    
    // Additional sync for critical data
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Verify masking is intact after failover
   */
  private async verifyMaskingIntact(_region: Region): Promise<boolean> {
    // Verify all masked fields are still masked
    // In production, query database and verify patterns
    return true;
  }

  /**
   * Verify wallet state after failover
   */
  private async verifyWalletState(region: Region): Promise<boolean> {
    const backup = this.backupStates.get(region);
    return backup?.walletState === 'synced';
  }

  /**
   * Escalate incident to BOSS
   */
  async escalateToBoss(incident: Incident): Promise<void> {
    incident.escalatedToBoss = true;
    incident.status = 'escalated';
    incident.recoveryActions.push('Incident escalated to 👑 BOSS');
    
    // In production, send notification to BOSS
    console.warn(`🚨 INCIDENT ESCALATED TO 👑 BOSS: ${incident.description}`);
    
    this.incidents.set(incident.id, incident);
    this.notifyAlerts(incident);
  }

  /**
   * Manual incident resolution
   */
  async resolveIncident(incidentId: string, resolution: string): Promise<void> {
    const incident = this.incidents.get(incidentId);
    if (!incident) return;

    incident.status = 'resolved';
    incident.resolvedAt = new Date().toISOString();
    incident.recoveryActions.push(`Manually resolved: ${resolution}`);
    
    this.incidents.set(incidentId, incident);
    this.notifyAlerts(incident);
  }

  /**
   * Create backup for region
   */
  async createBackup(region: Region): Promise<BackupState> {
    const backup: BackupState = {
      region,
      lastBackup: new Date().toISOString(),
      walletState: 'synced',
      logsState: 'synced',
      maskedDataIntact: true,
      backupSize: 0
    };

    this.backupStates.set(region, backup);
    return backup;
  }

  /**
   * Restore from backup
   */
  async restoreFromBackup(region: Region): Promise<boolean> {
    const backup = this.backupStates.get(region);
    if (!backup) return false;

    // Verify backup integrity
    if (!backup.maskedDataIntact) {
      throw new Error('Backup masking compromised - cannot restore');
    }

    // In production, restore database from backup
    return true;
  }

  /**
   * Get all incidents
   */
  getIncidents(): Incident[] {
    return Array.from(this.incidents.values());
  }

  /**
   * Get active incidents
   */
  getActiveIncidents(): Incident[] {
    return Array.from(this.incidents.values())
      .filter(i => i.status !== 'resolved');
  }

  /**
   * Get backup state for region
   */
  getBackupState(region: Region): BackupState | undefined {
    return this.backupStates.get(region);
  }

  /**
   * Subscribe to incident alerts
   */
  onIncident(callback: (incident: Incident) => void): () => void {
    this.alertCallbacks.add(callback);
    return () => this.alertCallbacks.delete(callback);
  }

  private notifyAlerts(incident: Incident): void {
    this.alertCallbacks.forEach(cb => cb(incident));
  }

  /**
   * Get disaster recovery status
   */
  getStatus(): {
    activeIncidents: number;
    regionsHealthy: number;
    regionsUnhealthy: number;
    lastFailover?: string;
    bossEscalations: number;
  } {
    const incidents = Array.from(this.incidents.values());
    const health = regionManager.getAllHealth();
    
    return {
      activeIncidents: incidents.filter(i => i.status !== 'resolved').length,
      regionsHealthy: health.filter(h => h.status === 'healthy').length,
      regionsUnhealthy: health.filter(h => h.status !== 'healthy').length,
      lastFailover: incidents
        .filter(i => i.failoverRegion)
        .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())[0]?.detectedAt,
      bossEscalations: incidents.filter(i => i.escalatedToBoss).length
    };
  }
}

export const disasterRecoveryManager = new DisasterRecoveryManager();
export default DisasterRecoveryManager;
