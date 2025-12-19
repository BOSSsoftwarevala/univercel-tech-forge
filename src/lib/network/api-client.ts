/**
 * Lightweight API Client
 * Optimized for low-bandwidth networks with compression, retry, and caching
 */

import { networkDetector } from './network-detector';
import { offlineQueue } from '../offline/sync-queue';
import { cacheManager } from '../offline/cache-manager';

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
  cache?: boolean;
  cacheTTL?: number; // seconds
  priority?: 'high' | 'normal' | 'low';
  offlineQueue?: boolean;
  retries?: number;
  timeout?: number;
  compress?: boolean;
}

interface APIResponse<T = unknown> {
  data: T | null;
  error: string | null;
  status: number;
  fromCache: boolean;
  cached_at?: number;
}

const DEFAULT_CONFIG: RequestConfig = {
  method: 'GET',
  cache: true,
  cacheTTL: 300, // 5 minutes
  priority: 'normal',
  offlineQueue: true,
  retries: 3,
  timeout: 30000,
  compress: true
};

// Exponential backoff calculation
function getBackoffDelay(attempt: number, baseDelay = 1000): number {
  return Math.min(baseDelay * Math.pow(2, attempt), 30000) + Math.random() * 1000;
}

// Compress request body for bandwidth savings
function compressPayload(data: unknown): string {
  const json = JSON.stringify(data);
  // Simple compression: remove whitespace (actual gzip done by server)
  return json.replace(/\s+/g, '');
}

// Generate cache key from URL and body
function generateCacheKey(url: string, body?: unknown): string {
  const bodyHash = body ? btoa(JSON.stringify(body)).slice(0, 20) : '';
  return `api:${url}:${bodyHash}`;
}

class LightweightAPIClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private pendingRequests: Map<string, Promise<APIResponse>> = new Map();

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip, deflate, br'
    };
  }

  private async executeRequest<T>(
    url: string,
    config: RequestConfig,
    attempt = 0
  ): Promise<APIResponse<T>> {
    const fullURL = this.baseURL + url;
    const cacheKey = generateCacheKey(fullURL, config.body);
    const networkInfo = networkDetector.getInfo();

    // Check cache first for GET requests
    if (config.method === 'GET' && config.cache) {
      const cached = await cacheManager.get<T>(cacheKey);
      if (cached) {
        return {
          data: cached.data,
          error: null,
          status: 200,
          fromCache: true,
          cached_at: cached.timestamp
        };
      }
    }

    // Handle offline state
    if (!networkInfo.isOnline) {
      if (config.offlineQueue && config.method !== 'GET') {
        await offlineQueue.add({
          url: fullURL,
          method: config.method || 'POST',
          body: config.body,
          headers: { ...this.defaultHeaders, ...config.headers },
          priority: config.priority || 'normal',
          timestamp: Date.now()
        });
        return {
          data: null,
          error: null,
          status: 202, // Accepted for later processing
          fromCache: false
        };
      }
      return {
        data: null,
        error: 'No internet connection',
        status: 0,
        fromCache: false
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      // Adjust timeout for slow networks
      const adjustedTimeout = networkInfo.quality === '2g' 
        ? (config.timeout || 30000) * 2 
        : config.timeout;

      const response = await fetch(fullURL, {
        method: config.method,
        headers: {
          ...this.defaultHeaders,
          ...config.headers,
          // Add low-bandwidth hint
          'X-Data-Mode': networkInfo.dataMode,
          'X-Network-Quality': networkInfo.quality
        },
        body: config.body ? compressPayload(config.body) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json() as T;

      // Cache successful GET responses
      if (config.method === 'GET' && config.cache) {
        await cacheManager.set(cacheKey, data, config.cacheTTL);
      }

      return {
        data,
        error: null,
        status: response.status,
        fromCache: false
      };
    } catch (error) {
      // Retry with exponential backoff
      if (attempt < (config.retries || 3)) {
        const delay = getBackoffDelay(attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.executeRequest<T>(url, config, attempt + 1);
      }

      // Queue for later if offline-capable
      if (config.offlineQueue && config.method !== 'GET') {
        await offlineQueue.add({
          url: fullURL,
          method: config.method || 'POST',
          body: config.body,
          headers: { ...this.defaultHeaders, ...config.headers },
          priority: config.priority || 'normal',
          timestamp: Date.now()
        });
      }

      return {
        data: null,
        error: error instanceof Error ? error.message : 'Request failed',
        status: 0,
        fromCache: false
      };
    }
  }

  // Deduplicate concurrent identical requests
  async request<T>(url: string, config: RequestConfig = {}): Promise<APIResponse<T>> {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };
    const requestKey = `${mergedConfig.method}:${url}:${JSON.stringify(config.body)}`;

    // Return existing pending request if duplicate
    if (this.pendingRequests.has(requestKey)) {
      return this.pendingRequests.get(requestKey) as Promise<APIResponse<T>>;
    }

    const promise = this.executeRequest<T>(url, mergedConfig);
    this.pendingRequests.set(requestKey, promise);

    try {
      return await promise;
    } finally {
      this.pendingRequests.delete(requestKey);
    }
  }

  async get<T>(url: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<APIResponse<T>> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  async post<T>(url: string, body: unknown, config?: Omit<RequestConfig, 'method'>): Promise<APIResponse<T>> {
    return this.request<T>(url, { ...config, method: 'POST', body });
  }

  async put<T>(url: string, body: unknown, config?: Omit<RequestConfig, 'method'>): Promise<APIResponse<T>> {
    return this.request<T>(url, { ...config, method: 'PUT', body });
  }

  async delete<T>(url: string, config?: Omit<RequestConfig, 'method'>): Promise<APIResponse<T>> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  clearAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }
}

export const apiClient = new LightweightAPIClient();
export type { APIResponse, RequestConfig };
