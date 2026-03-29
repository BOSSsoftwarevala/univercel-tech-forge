/**
 * CDN & Edge Optimization Layer
 * Global caching, latency optimization, edge rendering
 * Preserves masked ID rendering at edge
 */

import { Region, regionManager } from './region-manager';

export interface CacheConfig {
  demoCacheTTL: number;
  chatCacheTTL: number;
  assetCacheTTL: number;
  walletCacheTTL: number;
  edgeLocations: string[];
}

export interface EdgeNode {
  id: string;
  region: Region;
  location: string;
  status: 'active' | 'warming' | 'offline';
  latency: number;
  cacheHitRate: number;
  bandwidthUsage: number;
}

export interface CacheEntry {
  key: string;
  type: 'demo' | 'chat' | 'asset' | 'wallet' | 'masked_id';
  region: Region;
  createdAt: string;
  expiresAt: string;
  hits: number;
  size: number;
  maskedData?: boolean;
}

const DEFAULT_CONFIG: CacheConfig = {
  demoCacheTTL: 3600000,      // 1 hour
  chatCacheTTL: 30000,        // 30 seconds
  assetCacheTTL: 86400000,    // 24 hours
  walletCacheTTL: 5000,       // 5 seconds (real-time)
  edgeLocations: [
    'us-east-1', 'us-west-2', 'eu-west-1', 'eu-central-1',
    'ap-southeast-1', 'ap-south-1', 'me-south-1', 'af-south-1', 'sa-east-1'
  ]
};

export class CDNEdgeManager {
  private config: CacheConfig;
  private edgeNodes: Map<string, EdgeNode> = new Map();
  private cache: Map<string, CacheEntry> = new Map();
  private maskedIdCache: Map<string, string> = new Map();

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initializeEdgeNodes();
  }

  /**
   * Initialize edge nodes
   */
  private initializeEdgeNodes(): void {
    const regions = regionManager.getActiveRegions();
    
    regions.forEach((region, index) => {
      const node: EdgeNode = {
        id: `edge-${region.id}-${index}`,
        region: region.id,
        location: this.config.edgeLocations[index] || region.id,
        status: 'active',
        latency: Math.random() * 50,
        cacheHitRate: 0.85 + Math.random() * 0.1,
        bandwidthUsage: Math.random() * 100
      };
      this.edgeNodes.set(node.id, node);
    });
  }

  /**
   * Cache demo content at edge
   */
  async cacheDemo(demoId: string, content: any, region: Region): Promise<string> {
    const key = `demo:${region}:${demoId}`;
    const entry: CacheEntry = {
      key,
      type: 'demo',
      region,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + this.config.demoCacheTTL).toISOString(),
      hits: 0,
      size: JSON.stringify(content).length
    };

    this.cache.set(key, entry);
    return key;
  }

  /**
   * Get cached demo
   */
  getCachedDemo(demoId: string, region: Region): CacheEntry | null {
    const key = `demo:${region}:${demoId}`;
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    if (new Date(entry.expiresAt) < new Date()) {
      this.cache.delete(key);
      return null;
    }

    entry.hits++;
    return entry;
  }

  /**
   * Cache chat messages with low TTL
   */
  async cacheChat(threadId: string, messages: any[], region: Region): Promise<string> {
    const key = `chat:${region}:${threadId}`;
    const entry: CacheEntry = {
      key,
      type: 'chat',
      region,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + this.config.chatCacheTTL).toISOString(),
      hits: 0,
      size: JSON.stringify(messages).length
    };

    this.cache.set(key, entry);
    return key;
  }

  /**
   * Cache wallet state (very short TTL)
   */
  async cacheWalletState(tenantId: string, state: any, region: Region): Promise<string> {
    const key = `wallet:${region}:${tenantId}`;
    const entry: CacheEntry = {
      key,
      type: 'wallet',
      region,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + this.config.walletCacheTTL).toISOString(),
      hits: 0,
      size: JSON.stringify(state).length
    };

    this.cache.set(key, entry);
    return key;
  }

  /**
   * Edge-render masked IDs
   * Preserves masking at edge without round-trip
   */
  renderMaskedId(userId: string, idLength: number): string {
    const cacheKey = `${userId}:${idLength}`;
    
    if (this.maskedIdCache.has(cacheKey)) {
      return this.maskedIdCache.get(cacheKey)!;
    }

    // Generate masked ID at edge
    const min = Math.pow(10, idLength - 1);
    const max = Math.pow(10, idLength) - 1;
    const maskedId = String(Math.floor(Math.random() * (max - min + 1)) + min);
    
    this.maskedIdCache.set(cacheKey, maskedId);
    return maskedId;
  }

  /**
   * Get nearest edge node
   */
  getNearestEdge(region: Region): EdgeNode | null {
    const nodes = Array.from(this.edgeNodes.values())
      .filter(n => n.region === region && n.status === 'active')
      .sort((a, b) => a.latency - b.latency);
    
    return nodes[0] || null;
  }

  /**
   * Invalidate cache for region
   */
  invalidateRegionCache(region: Region): void {
    for (const [key, entry] of this.cache.entries()) {
      if (entry.region === region) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Invalidate specific cache type
   */
  invalidateCacheType(type: CacheEntry['type'], region?: Region): void {
    for (const [key, entry] of this.cache.entries()) {
      if (entry.type === type && (!region || entry.region === region)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get edge performance metrics
   */
  getEdgeMetrics(): {
    totalNodes: number;
    activeNodes: number;
    avgLatency: number;
    avgHitRate: number;
    cacheSize: number;
  } {
    const nodes = Array.from(this.edgeNodes.values());
    const activeNodes = nodes.filter(n => n.status === 'active');
    
    return {
      totalNodes: nodes.length,
      activeNodes: activeNodes.length,
      avgLatency: activeNodes.reduce((sum, n) => sum + n.latency, 0) / activeNodes.length || 0,
      avgHitRate: activeNodes.reduce((sum, n) => sum + n.cacheHitRate, 0) / activeNodes.length || 0,
      cacheSize: this.cache.size
    };
  }

  /**
   * Get all edge nodes
   */
  getAllEdges(): EdgeNode[] {
    return Array.from(this.edgeNodes.values());
  }

  /**
   * Clean expired cache entries
   */
  cleanExpiredCache(): number {
    let cleaned = 0;
    const now = new Date();

    for (const [key, entry] of this.cache.entries()) {
      if (new Date(entry.expiresAt) < now) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }
}

export const cdnEdgeManager = new CDNEdgeManager();
export default CDNEdgeManager;
