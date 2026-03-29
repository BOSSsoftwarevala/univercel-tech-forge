/**
 * Region-Based Routing & Multi-Tenant Performance
 * Optimizes traffic distribution and tenant isolation
 */

// Region configuration
export interface RegionConfig {
  code: string;
  name: string;
  timezone: string;
  currency: string;
  latency: number; // Expected latency in ms
  priority: number;
  endpoints: string[];
  active: boolean;
}

// Default region configurations
export const REGION_CONFIGS: Record<string, RegionConfig> = {
  'in-west': {
    code: 'in-west',
    name: 'India West (Mumbai)',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    latency: 20,
    priority: 1,
    endpoints: ['https://in-west.api.softwarevala.com'],
    active: true,
  },
  'in-south': {
    code: 'in-south',
    name: 'India South (Chennai)',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    latency: 25,
    priority: 2,
    endpoints: ['https://in-south.api.softwarevala.com'],
    active: true,
  },
  'us-east': {
    code: 'us-east',
    name: 'US East (Virginia)',
    timezone: 'America/New_York',
    currency: 'USD',
    latency: 150,
    priority: 3,
    endpoints: ['https://us-east.api.softwarevala.com'],
    active: true,
  },
  'eu-west': {
    code: 'eu-west',
    name: 'Europe West (London)',
    timezone: 'Europe/London',
    currency: 'EUR',
    latency: 100,
    priority: 4,
    endpoints: ['https://eu-west.api.softwarevala.com'],
    active: true,
  },
  'ap-southeast': {
    code: 'ap-southeast',
    name: 'Asia Pacific (Singapore)',
    timezone: 'Asia/Singapore',
    currency: 'SGD',
    latency: 80,
    priority: 5,
    endpoints: ['https://ap-southeast.api.softwarevala.com'],
    active: true,
  },
};

// Region router with latency-based selection
export class RegionRouter {
  private latencyCache = new Map<string, number>();
  private healthStatus = new Map<string, boolean>();
  private userRegion: string | null = null;
  
  constructor() {
    this.detectUserRegion();
  }
  
  private async detectUserRegion(): Promise<void> {
    try {
      // Use timezone as primary detection
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      if (timezone.includes('Kolkata') || timezone.includes('Calcutta')) {
        this.userRegion = 'in-west';
      } else if (timezone.includes('Singapore') || timezone.includes('Manila') || timezone.includes('Jakarta')) {
        this.userRegion = 'ap-southeast';
      } else if (timezone.includes('London') || timezone.includes('Paris') || timezone.includes('Berlin')) {
        this.userRegion = 'eu-west';
      } else if (timezone.includes('New_York') || timezone.includes('Chicago') || timezone.includes('Los_Angeles')) {
        this.userRegion = 'us-east';
      } else {
        // Default to India West
        this.userRegion = 'in-west';
      }
    } catch {
      this.userRegion = 'in-west';
    }
  }
  
  async measureLatency(region: string): Promise<number> {
    const config = REGION_CONFIGS[region];
    if (!config || !config.active) return Infinity;
    
    const cached = this.latencyCache.get(region);
    if (cached !== undefined) return cached;
    
    // Simulate latency measurement (in production, would ping actual endpoints)
    const latency = config.latency + Math.random() * 20;
    this.latencyCache.set(region, latency);
    
    return latency;
  }
  
  async getBestRegion(): Promise<string> {
    const latencies: Array<{ region: string; latency: number }> = [];
    
    for (const region of Object.keys(REGION_CONFIGS)) {
      if (REGION_CONFIGS[region].active && this.healthStatus.get(region) !== false) {
        const latency = await this.measureLatency(region);
        latencies.push({ region, latency });
      }
    }
    
    latencies.sort((a, b) => a.latency - b.latency);
    return latencies[0]?.region || this.userRegion || 'in-west';
  }
  
  async getEndpoint(service: string): Promise<string> {
    const region = await this.getBestRegion();
    const config = REGION_CONFIGS[region];
    
    // Return primary endpoint for the region
    return config?.endpoints[0] || 'https://api.softwarevala.com';
  }
  
  setRegionHealth(region: string, healthy: boolean): void {
    this.healthStatus.set(region, healthy);
  }
  
  getUserRegion(): string {
    return this.userRegion || 'in-west';
  }
  
  getRegionConfig(region?: string): RegionConfig {
    return REGION_CONFIGS[region || this.userRegion || 'in-west'];
  }
}

// Tenant and resource limit types
interface TenantConfig {
  id: string;
  tier: 'common' | 'prime';
  region: string;
  features: string[];
  quotas: Record<string, number>;
}

interface ResourceLimits {
  maxConcurrentRequests: number;
  maxStorageBytes: number;
  maxUsersPerTenant: number;
  maxLeadsPerDay: number;
  maxTasksPerDay: number;
  maxChatMessages: number;
}

// Multi-tenant isolation manager
export class TenantManager {
  private tenantCache = new Map<string, TenantConfig>();
  private resourceLimits = new Map<string, ResourceLimits>();
  
  private defaultLimits: Record<'common' | 'prime', ResourceLimits> = {
    common: {
      maxConcurrentRequests: 50,
      maxStorageBytes: 1024 * 1024 * 100,
      maxUsersPerTenant: 50,
      maxLeadsPerDay: 500,
      maxTasksPerDay: 200,
      maxChatMessages: 1000,
    },
    prime: {
      maxConcurrentRequests: 500,
      maxStorageBytes: 1024 * 1024 * 1024 * 10,
      maxUsersPerTenant: 1000,
      maxLeadsPerDay: 10000,
      maxTasksPerDay: 5000,
      maxChatMessages: 50000,
    },
  };
  
  getTenantLimits(tenantId: string, tier: 'common' | 'prime'): ResourceLimits {
    const cached = this.resourceLimits.get(tenantId);
    if (cached) return cached;
    const limits = { ...this.defaultLimits[tier] };
    this.resourceLimits.set(tenantId, limits);
    return limits;
  }
  
  checkQuota(
    tenantId: string,
    resource: keyof ResourceLimits,
    current: number
  ): { allowed: boolean; remaining: number; limit: number } {
    const limits = this.resourceLimits.get(tenantId);
    if (!limits) return { allowed: true, remaining: Infinity, limit: Infinity };
    const limit = limits[resource];
    return { allowed: current < limit, remaining: Math.max(0, limit - current), limit };
  }
}

// Singleton instances
export const regionRouter = new RegionRouter();
export const tenantManager = new TenantManager();
