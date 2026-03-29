/**
 * Connection Pool Manager
 * Manages WebSocket and HTTP connections for enterprise scaling
 */

interface PoolConfig {
  maxConnections: number;
  minConnections: number;
  idleTimeout: number;
  acquireTimeout: number;
  healthCheckInterval: number;
}

interface PooledConnection {
  id: string;
  connection: WebSocket | null;
  isActive: boolean;
  lastUsed: number;
  createdAt: number;
  healthScore: number;
}

// WebSocket Connection Pool
export class WebSocketPool {
  private pools = new Map<string, PooledConnection[]>();
  private config: PoolConfig;
  private healthCheckInterval: ReturnType<typeof setInterval> | null = null;
  
  constructor(config: Partial<PoolConfig> = {}) {
    this.config = {
      maxConnections: config.maxConnections || 50,
      minConnections: config.minConnections || 5,
      idleTimeout: config.idleTimeout || 60000,
      acquireTimeout: config.acquireTimeout || 5000,
      healthCheckInterval: config.healthCheckInterval || 30000,
    };
    
    this.startHealthCheck();
  }
  
  private generateId(): string {
    return `ws-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
  
  async acquire(url: string): Promise<{ connection: WebSocket; release: () => void }> {
    const pool = this.pools.get(url) || [];
    
    // Find available connection
    const available = pool.find(c => !c.isActive && c.connection?.readyState === WebSocket.OPEN);
    
    if (available) {
      available.isActive = true;
      available.lastUsed = Date.now();
      return {
        connection: available.connection!,
        release: () => this.release(url, available.id),
      };
    }
    
    // Create new connection if pool not at max
    if (pool.length < this.config.maxConnections) {
      const connection = await this.createConnection(url);
      const pooled: PooledConnection = {
        id: this.generateId(),
        connection,
        isActive: true,
        lastUsed: Date.now(),
        createdAt: Date.now(),
        healthScore: 100,
      };
      
      pool.push(pooled);
      this.pools.set(url, pool);
      
      return {
        connection,
        release: () => this.release(url, pooled.id),
      };
    }
    
    // Wait for connection to become available
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection acquire timeout'));
      }, this.config.acquireTimeout);
      
      const checkInterval = setInterval(() => {
        const currentPool = this.pools.get(url) || [];
        const available = currentPool.find(c => !c.isActive && c.connection?.readyState === WebSocket.OPEN);
        
        if (available) {
          clearInterval(checkInterval);
          clearTimeout(timeout);
          available.isActive = true;
          available.lastUsed = Date.now();
          resolve({
            connection: available.connection!,
            release: () => this.release(url, available.id),
          });
        }
      }, 100);
    });
  }
  
  private async createConnection(url: string): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      
      const timeout = setTimeout(() => {
        ws.close();
        reject(new Error('Connection timeout'));
      }, 10000);
      
      ws.onopen = () => {
        clearTimeout(timeout);
        resolve(ws);
      };
      
      ws.onerror = (error) => {
        clearTimeout(timeout);
        reject(error);
      };
    });
  }
  
  private release(url: string, connectionId: string): void {
    const pool = this.pools.get(url);
    if (!pool) return;
    
    const connection = pool.find(c => c.id === connectionId);
    if (connection) {
      connection.isActive = false;
      connection.lastUsed = Date.now();
    }
  }
  
  private startHealthCheck(): void {
    this.healthCheckInterval = setInterval(() => {
      const now = Date.now();
      
      for (const [url, pool] of this.pools.entries()) {
        const updated = pool.filter(c => {
          // Remove closed connections
          if (!c.connection || c.connection.readyState !== WebSocket.OPEN) {
            return false;
          }
          
          // Remove idle connections above minimum
          if (!c.isActive && 
              now - c.lastUsed > this.config.idleTimeout && 
              pool.length > this.config.minConnections) {
            c.connection.close();
            return false;
          }
          
          return true;
        });
        
        this.pools.set(url, updated);
      }
    }, this.config.healthCheckInterval);
  }
  
  getStats(): Record<string, { total: number; active: number; idle: number }> {
    const stats: Record<string, { total: number; active: number; idle: number }> = {};
    
    for (const [url, pool] of this.pools.entries()) {
      const active = pool.filter(c => c.isActive).length;
      stats[url] = {
        total: pool.length,
        active,
        idle: pool.length - active,
      };
    }
    
    return stats;
  }
  
  async warmup(url: string, count: number = 5): Promise<void> {
    const pool = this.pools.get(url) || [];
    const toCreate = Math.min(count, this.config.maxConnections - pool.length);
    
    const promises = [];
    for (let i = 0; i < toCreate; i++) {
      promises.push(
        this.createConnection(url).then(connection => {
          pool.push({
            id: this.generateId(),
            connection,
            isActive: false,
            lastUsed: Date.now(),
            createdAt: Date.now(),
            healthScore: 100,
          });
        }).catch(() => {})
      );
    }
    
    await Promise.all(promises);
    this.pools.set(url, pool);
  }
  
  destroy(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    
    for (const pool of this.pools.values()) {
      pool.forEach(c => c.connection?.close());
    }
    this.pools.clear();
  }
}

// HTTP Connection Manager with Keep-Alive
export class HTTPConnectionManager {
  private activeRequests = new Map<string, number>();
  private maxConcurrent: number;
  private requestQueue: Array<{
    url: string;
    options: RequestInit;
    resolve: (response: Response) => void;
    reject: (error: Error) => void;
    priority: number;
  }> = [];
  
  constructor(maxConcurrent: number = 100) {
    this.maxConcurrent = maxConcurrent;
  }
  
  async fetch(
    url: string,
    options: RequestInit = {},
    priority: number = 0
  ): Promise<Response> {
    const host = new URL(url).host;
    const active = this.activeRequests.get(host) || 0;
    
    if (active < this.maxConcurrent) {
      return this.executeRequest(url, options);
    }
    
    // Queue the request
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ url, options, resolve, reject, priority });
      this.requestQueue.sort((a, b) => b.priority - a.priority);
    });
  }
  
  private async executeRequest(url: string, options: RequestInit): Promise<Response> {
    const host = new URL(url).host;
    this.activeRequests.set(host, (this.activeRequests.get(host) || 0) + 1);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Connection': 'keep-alive',
        },
      });
      return response;
    } finally {
      this.activeRequests.set(host, (this.activeRequests.get(host) || 1) - 1);
      this.processQueue(host);
    }
  }
  
  private processQueue(host: string): void {
    const active = this.activeRequests.get(host) || 0;
    if (active >= this.maxConcurrent || this.requestQueue.length === 0) return;
    
    const index = this.requestQueue.findIndex(r => new URL(r.url).host === host);
    if (index === -1) return;
    
    const request = this.requestQueue.splice(index, 1)[0];
    this.executeRequest(request.url, request.options)
      .then(request.resolve)
      .catch(request.reject);
  }
  
  getStats(): { activeByHost: Record<string, number>; queueLength: number } {
    return {
      activeByHost: Object.fromEntries(this.activeRequests),
      queueLength: this.requestQueue.length,
    };
  }
}

// Singleton instances
export const wsPool = new WebSocketPool();
export const httpManager = new HTTPConnectionManager();
