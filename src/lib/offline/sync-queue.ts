/**
 * Offline Sync Queue
 * Queues actions when offline and syncs when connection returns
 */

import { indexedDB } from './indexed-db';
import { networkDetector } from '../network/network-detector';

interface QueuedAction {
  id: string;
  url: string;
  method: string;
  body?: unknown;
  headers?: Record<string, string>;
  priority: 'high' | 'normal' | 'low';
  timestamp: number;
  retries: number;
  maxRetries: number;
  lastError?: string;
}

type SyncCallback = (action: QueuedAction, success: boolean, error?: string) => void;

class OfflineSyncQueue {
  private syncing = false;
  private syncCallbacks: Set<SyncCallback> = new Set();
  private retryTimer: number | null = null;

  constructor() {
    this.setupNetworkListener();
  }

  private setupNetworkListener(): void {
    networkDetector.subscribe((info) => {
      if (info.isOnline && !this.syncing) {
        this.processQueue();
      }
    });
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async add(action: Omit<QueuedAction, 'id' | 'retries' | 'maxRetries'>): Promise<string> {
    const queuedAction: QueuedAction = {
      ...action,
      id: this.generateId(),
      retries: 0,
      maxRetries: 3
    };

    await indexedDB.set('sync_queue', queuedAction);
    
    // Try to sync immediately if online
    if (networkDetector.getInfo().isOnline) {
      this.processQueue();
    }

    return queuedAction.id;
  }

  async remove(id: string): Promise<void> {
    await indexedDB.delete('sync_queue', id);
  }

  async getQueue(): Promise<QueuedAction[]> {
    const actions = await indexedDB.getAll<QueuedAction>('sync_queue');
    
    // Sort by priority and timestamp
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    return actions.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.timestamp - b.timestamp;
    });
  }

  async getQueueSize(): Promise<number> {
    return indexedDB.count('sync_queue');
  }

  private async processQueue(): Promise<void> {
    if (this.syncing) return;
    
    const networkInfo = networkDetector.getInfo();
    if (!networkInfo.isOnline) return;

    this.syncing = true;

    try {
      const queue = await this.getQueue();
      
      for (const action of queue) {
        // Check network status before each request
        if (!networkDetector.getInfo().isOnline) break;

        const success = await this.processAction(action);
        
        if (success) {
          await this.remove(action.id);
          this.notifyCallbacks(action, true);
        } else {
          action.retries++;
          
          if (action.retries >= action.maxRetries) {
            // Max retries reached, mark as failed
            await this.remove(action.id);
            this.notifyCallbacks(action, false, 'Max retries exceeded');
          } else {
            // Update retry count
            await indexedDB.set('sync_queue', action);
          }
        }

        // Add delay between requests for slow networks
        if (networkInfo.quality === '2g') {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    } finally {
      this.syncing = false;
      
      // Schedule retry if queue not empty
      const remaining = await this.getQueueSize();
      if (remaining > 0) {
        this.scheduleRetry();
      }
    }
  }

  private async processAction(action: QueuedAction): Promise<boolean> {
    try {
      const response = await fetch(action.url, {
        method: action.method,
        headers: {
          'Content-Type': 'application/json',
          ...action.headers
        },
        body: action.body ? JSON.stringify(action.body) : undefined
      });

      return response.ok;
    } catch (error) {
      action.lastError = error instanceof Error ? error.message : 'Unknown error';
      return false;
    }
  }

  private scheduleRetry(): void {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }

    // Exponential backoff based on network quality
    const networkInfo = networkDetector.getInfo();
    const baseDelay = networkInfo.quality === '2g' ? 30000 : 10000;
    
    this.retryTimer = window.setTimeout(() => {
      this.processQueue();
    }, baseDelay);
  }

  private notifyCallbacks(action: QueuedAction, success: boolean, error?: string): void {
    this.syncCallbacks.forEach(callback => callback(action, success, error));
  }

  onSync(callback: SyncCallback): () => void {
    this.syncCallbacks.add(callback);
    return () => this.syncCallbacks.delete(callback);
  }

  async clear(): Promise<void> {
    await indexedDB.clear('sync_queue');
  }

  forceSync(): void {
    this.processQueue();
  }
}

export const offlineQueue = new OfflineSyncQueue();
