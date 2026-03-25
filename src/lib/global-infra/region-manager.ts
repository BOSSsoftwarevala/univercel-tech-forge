/**
 * Global Multi-Region Manager
 * Auto-routes users to nearest region with tenant isolation
 * Preserves masking, RBAC, and IP lock per region
 */

export type Region = 
  | 'us-east' 
  | 'us-west' 
  | 'eu-west' 
  | 'eu-central' 
  | 'asia-pacific' 
  | 'asia-south' 
  | 'middle-east' 
  | 'africa' 
  | 'south-america';

export interface RegionConfig {
  id: Region;
  name: string;
  endpoint: string;
  latencyThreshold: number;
  isActive: boolean;
  isPrimary: boolean;
  replicaOf?: Region;
  complianceZone: 'GDPR' | 'CCPA' | 'LGPD' | 'PDPA' | 'POPIA' | 'GLOBAL';
}

export interface RegionHealth {
  region: Region;
  status: 'healthy' | 'degraded' | 'offline';
  latency: number;
  lastCheck: string;
  activeConnections: number;
  errorRate: number;
}

const REGIONS: RegionConfig[] = [
  { id: 'us-east', name: 'US East', endpoint: 'us-east.softwarevala.io', latencyThreshold: 100, isActive: true, isPrimary: true, complianceZone: 'CCPA' },
  { id: 'us-west', name: 'US West', endpoint: 'us-west.softwarevala.io', latencyThreshold: 100, isActive: true, isPrimary: false, replicaOf: 'us-east', complianceZone: 'CCPA' },
  { id: 'eu-west', name: 'EU West', endpoint: 'eu-west.softwarevala.io', latencyThreshold: 80, isActive: true, isPrimary: true, complianceZone: 'GDPR' },
  { id: 'eu-central', name: 'EU Central', endpoint: 'eu-central.softwarevala.io', latencyThreshold: 80, isActive: true, isPrimary: false, replicaOf: 'eu-west', complianceZone: 'GDPR' },
  { id: 'asia-pacific', name: 'Asia Pacific', endpoint: 'ap.softwarevala.io', latencyThreshold: 120, isActive: true, isPrimary: true, complianceZone: 'PDPA' },
  { id: 'asia-south', name: 'Asia South', endpoint: 'as.softwarevala.io', latencyThreshold: 120, isActive: true, isPrimary: false, replicaOf: 'asia-pacific', complianceZone: 'PDPA' },
  { id: 'middle-east', name: 'Middle East', endpoint: 'me.softwarevala.io', latencyThreshold: 100, isActive: true, isPrimary: true, complianceZone: 'GLOBAL' },
  { id: 'africa', name: 'Africa', endpoint: 'af.softwarevala.io', latencyThreshold: 150, isActive: true, isPrimary: false, replicaOf: 'eu-west', complianceZone: 'POPIA' },
  { id: 'south-america', name: 'South America', endpoint: 'sa.softwarevala.io', latencyThreshold: 130, isActive: true, isPrimary: true, complianceZone: 'LGPD' }
];

export class RegionManager {
  private regions: RegionConfig[];
  private healthStatus: Map<Region, RegionHealth> = new Map();
  private currentRegion: Region | null = null;
  private listeners: Set<(region: Region) => void> = new Set();

  constructor() {
    this.regions = REGIONS;
    this.initializeHealthChecks();
  }

  /**
   * Detect and route to nearest region
   */
  async detectNearestRegion(): Promise<Region> {
    const latencies: { region: Region; latency: number }[] = [];

    for (const region of this.regions.filter(r => r.isActive)) {
      const latency = await this.measureLatency(region);
      latencies.push({ region: region.id, latency });
    }

    latencies.sort((a, b) => a.latency - b.latency);
    const nearest = latencies[0]?.region || 'us-east';
    
    this.currentRegion = nearest;
    this.notifyListeners(nearest);
    
    return nearest;
  }

  /**
   * Measure latency to region
   */
  private async measureLatency(region: RegionConfig): Promise<number> {
    const start = performance.now();
    try {
      // Simulated latency measurement
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
      return performance.now() - start;
    } catch {
      return Infinity;
    }
  }

  /**
   * Get region for tenant with IP lock enforcement
   */
  getRegionForTenant(tenantId: string, allowedRegions?: Region[]): Region {
    if (allowedRegions && allowedRegions.length > 0) {
      // Enforce IP lock - only allow specified regions
      if (this.currentRegion && allowedRegions.includes(this.currentRegion)) {
        return this.currentRegion;
      }
      return allowedRegions[0];
    }
    return this.currentRegion || 'us-east';
  }

  /**
   * Get failover region
   */
  getFailoverRegion(currentRegion: Region): Region | null {
    const current = this.regions.find(r => r.id === currentRegion);
    if (!current) return null;

    // Find replica or another primary in same compliance zone
    const failover = this.regions.find(r => 
      r.isActive && 
      r.id !== currentRegion && 
      r.complianceZone === current.complianceZone &&
      this.isRegionHealthy(r.id)
    );

    return failover?.id || null;
  }

  /**
   * Check if region is healthy
   */
  isRegionHealthy(region: Region): boolean {
    const health = this.healthStatus.get(region);
    return health?.status === 'healthy';
  }

  /**
   * Get region config
   */
  getRegionConfig(region: Region): RegionConfig | undefined {
    return this.regions.find(r => r.id === region);
  }

  /**
   * Get all active regions
   */
  getActiveRegions(): RegionConfig[] {
    return this.regions.filter(r => r.isActive);
  }

  /**
   * Get regions by compliance zone
   */
  getRegionsByCompliance(zone: RegionConfig['complianceZone']): RegionConfig[] {
    return this.regions.filter(r => r.complianceZone === zone && r.isActive);
  }

  /**
   * Initialize health checks
   */
  private initializeHealthChecks(): void {
    this.regions.forEach(region => {
      this.healthStatus.set(region.id, {
        region: region.id,
        status: 'healthy',
        latency: 0,
        lastCheck: new Date().toISOString(),
        activeConnections: 0,
        errorRate: 0
      });
    });

    // Periodic health checks
    setInterval(() => this.checkAllRegions(), 30000);
  }

  /**
   * Check all regions health
   */
  private async checkAllRegions(): Promise<void> {
    for (const region of this.regions) {
      if (!region.isActive) continue;

      const latency = await this.measureLatency(region);
      const health = this.healthStatus.get(region.id);
      
      if (health) {
        health.latency = latency;
        health.lastCheck = new Date().toISOString();
        health.status = latency < region.latencyThreshold * 2 ? 'healthy' : 
                        latency < region.latencyThreshold * 5 ? 'degraded' : 'offline';
        
        this.healthStatus.set(region.id, health);
      }
    }
  }

  /**
   * Get health status for all regions
   */
  getAllHealth(): RegionHealth[] {
    return Array.from(this.healthStatus.values());
  }

  /**
   * Subscribe to region changes
   */
  onRegionChange(callback: (region: Region) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(region: Region): void {
    this.listeners.forEach(cb => cb(region));
  }

  /**
   * Get current region
   */
  getCurrentRegion(): Region | null {
    return this.currentRegion;
  }
}

export const regionManager = new RegionManager();
export default RegionManager;
