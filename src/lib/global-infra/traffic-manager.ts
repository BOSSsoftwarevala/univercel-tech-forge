/**
 * Global Traffic Management
 * Load balancing, DDoS protection, rate limiting per tenant
 * Preserves RBAC and tenant isolation
 */

import { Region, regionManager } from './region-manager';

export interface RateLimitConfig {
  requestsPerSecond: number;
  requestsPerMinute: number;
  burstLimit: number;
  tenantMultiplier: Record<string, number>;
}

export interface TrafficStats {
  region: Region;
  requestsPerSecond: number;
  activeConnections: number;
  bandwidth: number;
  blockedRequests: number;
  rateLimitedRequests: number;
}

export interface DDoSAlert {
  id: string;
  region: Region;
  type: 'volumetric' | 'protocol' | 'application';
  severity: 'low' | 'medium' | 'high' | 'critical';
  sourceIPs: string[];
  requestsBlocked: number;
  detectedAt: string;
  mitigatedAt?: string;
  status: 'active' | 'mitigating' | 'mitigated';
}

export interface TenantRateLimit {
  tenantId: string;
  currentRequests: number;
  limit: number;
  windowStart: number;
  blocked: boolean;
  blockedUntil?: number;
}

const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  requestsPerSecond: 100,
  requestsPerMinute: 3000,
  burstLimit: 200,
  tenantMultiplier: {
    franchise: 5.0,
    reseller: 3.0,
    prime: 2.0,
    developer: 1.5,
    influencer: 1.0
  }
};

export class TrafficManager {
  private rateLimitConfig: RateLimitConfig;
  private trafficStats: Map<Region, TrafficStats> = new Map();
  private tenantLimits: Map<string, TenantRateLimit> = new Map();
  private ddosAlerts: Map<string, DDoSAlert> = new Map();
  private blockedIPs: Set<string> = new Set();

  constructor(rateLimitConfig: Partial<RateLimitConfig> = {}) {
    this.rateLimitConfig = { ...DEFAULT_RATE_LIMIT, ...rateLimitConfig };
    this.initializeStats();
  }

  /**
   * Initialize traffic stats for all regions
   */
  private initializeStats(): void {
    regionManager.getActiveRegions().forEach(region => {
      this.trafficStats.set(region.id, {
        region: region.id,
        requestsPerSecond: 0,
        activeConnections: 0,
        bandwidth: 0,
        blockedRequests: 0,
        rateLimitedRequests: 0
      });
    });
  }

  /**
   * Check rate limit for tenant
   */
  checkRateLimit(tenantId: string, tenantType: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const multiplier = this.rateLimitConfig.tenantMultiplier[tenantType] || 1.0;
    const limit = Math.floor(this.rateLimitConfig.requestsPerMinute * multiplier);

    let tenantLimit = this.tenantLimits.get(tenantId);

    if (!tenantLimit) {
      tenantLimit = {
        tenantId,
        currentRequests: 0,
        limit,
        windowStart: now,
        blocked: false
      };
      this.tenantLimits.set(tenantId, tenantLimit);
    }

    // Reset window if expired
    if (now - tenantLimit.windowStart > 60000) {
      tenantLimit.currentRequests = 0;
      tenantLimit.windowStart = now;
      tenantLimit.blocked = false;
    }

    // Check if blocked
    if (tenantLimit.blocked && tenantLimit.blockedUntil) {
      if (now < tenantLimit.blockedUntil) {
        return { allowed: false, retryAfter: tenantLimit.blockedUntil - now };
      }
      tenantLimit.blocked = false;
    }

    // Check limit
    if (tenantLimit.currentRequests >= tenantLimit.limit) {
      tenantLimit.blocked = true;
      tenantLimit.blockedUntil = now + 60000; // Block for 1 minute
      return { allowed: false, retryAfter: 60000 };
    }

    tenantLimit.currentRequests++;
    this.tenantLimits.set(tenantId, tenantLimit);
    
    return { allowed: true };
  }

  /**
   * Check for DDoS patterns
   */
  detectDDoS(region: Region, requestVolume: number, sourceIP: string): DDoSAlert | null {
    const threshold = this.rateLimitConfig.requestsPerSecond * 10;
    
    if (requestVolume > threshold) {
      // Check if already tracking this attack
      const existingAlert = Array.from(this.ddosAlerts.values())
        .find(a => a.region === region && a.status === 'active');
      
      if (existingAlert) {
        if (!existingAlert.sourceIPs.includes(sourceIP)) {
          existingAlert.sourceIPs.push(sourceIP);
        }
        existingAlert.requestsBlocked += requestVolume;
        return existingAlert;
      }

      // Create new alert
      const alert: DDoSAlert = {
        id: crypto.randomUUID(),
        region,
        type: requestVolume > threshold * 5 ? 'volumetric' : 'application',
        severity: requestVolume > threshold * 10 ? 'critical' : 
                  requestVolume > threshold * 5 ? 'high' : 'medium',
        sourceIPs: [sourceIP],
        requestsBlocked: requestVolume,
        detectedAt: new Date().toISOString(),
        status: 'active'
      };

      this.ddosAlerts.set(alert.id, alert);
      this.blockIP(sourceIP);
      
      return alert;
    }

    return null;
  }

  /**
   * Block IP address
   */
  blockIP(ip: string): void {
    this.blockedIPs.add(ip);
  }

  /**
   * Unblock IP address
   */
  unblockIP(ip: string): void {
    this.blockedIPs.delete(ip);
  }

  /**
   * Check if IP is blocked
   */
  isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip);
  }

  /**
   * Mitigate DDoS attack
   */
  async mitigateDDoS(alertId: string): Promise<void> {
    const alert = this.ddosAlerts.get(alertId);
    if (!alert) return;

    alert.status = 'mitigating';
    
    // Block all source IPs
    alert.sourceIPs.forEach(ip => this.blockIP(ip));
    
    // Apply stricter rate limits for region
    const stats = this.trafficStats.get(alert.region);
    if (stats) {
      stats.blockedRequests += alert.requestsBlocked;
      this.trafficStats.set(alert.region, stats);
    }

    alert.status = 'mitigated';
    alert.mitigatedAt = new Date().toISOString();
    this.ddosAlerts.set(alertId, alert);
  }

  /**
   * Load balance request to best region
   */
  loadBalance(preferredRegion: Region): Region {
    const stats = this.trafficStats.get(preferredRegion);
    
    if (stats && stats.requestsPerSecond < this.rateLimitConfig.requestsPerSecond * 0.8) {
      return preferredRegion;
    }

    // Find least loaded region
    const allStats = Array.from(this.trafficStats.entries())
      .filter(([region]) => regionManager.isRegionHealthy(region))
      .sort(([, a], [, b]) => a.requestsPerSecond - b.requestsPerSecond);

    return allStats[0]?.[0] || preferredRegion;
  }

  /**
   * Update traffic stats
   */
  updateStats(region: Region, stats: Partial<TrafficStats>): void {
    const current = this.trafficStats.get(region);
    if (current) {
      this.trafficStats.set(region, { ...current, ...stats });
    }
  }

  /**
   * Get traffic stats for region
   */
  getStats(region: Region): TrafficStats | undefined {
    return this.trafficStats.get(region);
  }

  /**
   * Get all traffic stats
   */
  getAllStats(): TrafficStats[] {
    return Array.from(this.trafficStats.values());
  }

  /**
   * Get active DDoS alerts
   */
  getActiveDDoSAlerts(): DDoSAlert[] {
    return Array.from(this.ddosAlerts.values())
      .filter(a => a.status !== 'mitigated');
  }

  /**
   * Get global traffic summary
   */
  getSummary(): {
    totalRequests: number;
    totalBlocked: number;
    totalRateLimited: number;
    activeDDoS: number;
    blockedIPs: number;
  } {
    const stats = Array.from(this.trafficStats.values());
    
    return {
      totalRequests: stats.reduce((sum, s) => sum + s.requestsPerSecond, 0),
      totalBlocked: stats.reduce((sum, s) => sum + s.blockedRequests, 0),
      totalRateLimited: stats.reduce((sum, s) => sum + s.rateLimitedRequests, 0),
      activeDDoS: this.getActiveDDoSAlerts().length,
      blockedIPs: this.blockedIPs.size
    };
  }
}

export const trafficManager = new TrafficManager();
export default TrafficManager;
