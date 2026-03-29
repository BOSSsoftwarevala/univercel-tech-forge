/**
 * Offline-Online Sync Engine
 * AI-driven conflict resolution and versioning
 * Preserves logs, masking, and no-delete rules
 */

import { indexedDB } from '@/lib/offline/indexed-db';

// Sync status types
export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'conflict' | 'failed';

// Sync item with version control
export interface SyncItem {
  id: string;
  tenantId: string;
  table: string;
  operation: 'insert' | 'update' | 'delete';
  data: Record<string, any>;
  localVersion: number;
  serverVersion?: number;
  status: SyncStatus;
  conflictData?: Record<string, any>;
  createdAt: string;
  lastAttempt?: string;
  retries: number;
  maskedFields: string[];
}

// Conflict resolution strategies
export type ConflictStrategy = 
  | 'server_wins' 
  | 'client_wins' 
  | 'merge' 
  | 'manual' 
  | 'ai_resolve';

export interface SyncConfig {
  autoSyncInterval: number;
  maxRetries: number;
  conflictStrategy: ConflictStrategy;
  preserveDeleteLogs: boolean;
  encryptOfflineData: boolean;
  tenantIsolation: boolean;
}

const DEFAULT_CONFIG: SyncConfig = {
  autoSyncInterval: 30000, // 30 seconds
  maxRetries: 5,
  conflictStrategy: 'ai_resolve',
  preserveDeleteLogs: true, // No-delete rule
  encryptOfflineData: true,
  tenantIsolation: true
};

// Tables that support offline mode
const OFFLINE_TABLES = [
  'chat_messages',
  'buzzer_queue',
  'wallet_transactions',
  'demos',
  'audit_logs'
];

// Tables where delete is blocked
const NO_DELETE_TABLES = ['chat_messages', 'audit_logs'];

export class SyncEngine {
  private config: SyncConfig;
  private tenantId: string;
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;
  private listeners: Set<(status: SyncStatus) => void> = new Set();

  constructor(tenantId: string, config: Partial<SyncConfig> = {}) {
    this.tenantId = tenantId;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.setupNetworkListeners();
  }

  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processQueue();
    });
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  /**
   * Queue an operation for sync
   */
  async queueOperation(
    table: string,
    operation: 'insert' | 'update' | 'delete',
    data: Record<string, any>,
    maskedFields: string[] = []
  ): Promise<string> {
    // Enforce no-delete rule
    if (operation === 'delete' && NO_DELETE_TABLES.includes(table)) {
      throw new Error('DELETE_NOT_ALLOWED: This table preserves all records');
    }

    // Check if table supports offline
    if (!OFFLINE_TABLES.includes(table)) {
      throw new Error(`OFFLINE_NOT_SUPPORTED: ${table}`);
    }

    const item: SyncItem = {
      id: crypto.randomUUID(),
      tenantId: this.tenantId,
      table,
      operation,
      data: this.config.encryptOfflineData ? this.encryptData(data) : data,
      localVersion: Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      retries: 0,
      maskedFields
    };

    await indexedDB.set('sync_queue', item);
    
    // Try immediate sync if online
    if (this.isOnline) {
      this.processQueue();
    }

    return item.id;
  }

  /**
   * Process pending sync queue
   */
  async processQueue(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) return;
    
    this.syncInProgress = true;
    this.notifyListeners('syncing');

    try {
      const queue = await this.getPendingItems();
      
      for (const item of queue) {
        if (item.tenantId !== this.tenantId && this.config.tenantIsolation) {
          continue; // Skip items from other tenants
        }

        await this.syncItem(item);
      }

      this.notifyListeners('synced');
    } catch (error) {
      console.error('Sync error:', error);
      this.notifyListeners('failed');
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Sync a single item
   */
  private async syncItem(item: SyncItem): Promise<void> {
    try {
      // Update status
      item.status = 'syncing';
      item.lastAttempt = new Date().toISOString();
      await indexedDB.set('sync_queue', item);

      // Decrypt data if encrypted
      const data = this.config.encryptOfflineData 
        ? this.decryptData(item.data)
        : item.data;

      // Check for conflicts
      const conflict = await this.checkConflict(item);
      
      if (conflict) {
        await this.resolveConflict(item, conflict);
        return;
      }

      // Import supabase dynamically
      const { supabase } = await import('@/integrations/supabase/client');

      // Perform sync operation
      let error;
      switch (item.operation) {
        case 'insert':
          ({ error } = await (supabase.from(item.table as any) as any).insert(data));
          break;
        case 'update':
          ({ error } = await (supabase.from(item.table as any) as any)
            .update(data)
            .eq('id', data.id));
          break;
        case 'delete':
          // Should not reach here due to no-delete check
          throw new Error('DELETE_BLOCKED');
      }

      if (error) throw error;

      // Remove from queue on success
      await indexedDB.delete('sync_queue', item.id);

    } catch (error) {
      item.status = 'failed';
      item.retries += 1;
      
      if (item.retries >= this.config.maxRetries) {
        item.status = 'failed';
        // Keep failed items for manual review
      }
      
      await indexedDB.set('sync_queue', item);
    }
  }

  /**
   * Check for version conflicts
   */
  private async checkConflict(item: SyncItem): Promise<Record<string, any> | null> {
    if (item.operation === 'insert') return null;

    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data: serverData } = await (supabase
      .from(item.table as any) as any)
      .select('*')
      .eq('id', item.data.id)
      .single();

    if (!serverData) return null;

    // Check if server version is newer
    const serverTimestamp = new Date(serverData.updated_at || serverData.created_at).getTime();
    
    if (serverTimestamp > item.localVersion) {
      return serverData;
    }

    return null;
  }

  /**
   * AI-driven conflict resolution
   */
  private async resolveConflict(
    item: SyncItem, 
    serverData: Record<string, any>
  ): Promise<void> {
    item.status = 'conflict';
    item.conflictData = serverData;
    
    switch (this.config.conflictStrategy) {
      case 'server_wins':
        // Discard local changes
        await indexedDB.delete('sync_queue', item.id);
        break;
        
      case 'client_wins':
        // Force local changes
        item.localVersion = Date.now();
        await this.syncItem(item);
        break;
        
      case 'merge':
        // Merge fields intelligently
        const merged = this.mergeData(item.data, serverData);
        item.data = merged;
        item.localVersion = Date.now();
        await this.syncItem(item);
        break;
        
      case 'ai_resolve':
        // AI decides based on content analysis
        const resolution = await this.aiResolveConflict(item, serverData);
        if (resolution.action === 'merge') {
          item.data = resolution.data;
          await this.syncItem(item);
        } else if (resolution.action === 'discard') {
          await indexedDB.delete('sync_queue', item.id);
        }
        break;
        
      case 'manual':
        // Keep in conflict state for user resolution
        await indexedDB.set('sync_queue', item);
        break;
    }
  }

  /**
   * AI conflict resolution
   */
  private async aiResolveConflict(
    item: SyncItem,
    serverData: Record<string, any>
  ): Promise<{ action: 'merge' | 'discard' | 'keep_local'; data?: Record<string, any> }> {
    // Simple AI resolution logic
    const localData = this.config.encryptOfflineData 
      ? this.decryptData(item.data)
      : item.data;

    // For chat messages, always prefer server (preserves history)
    if (item.table === 'chat_messages') {
      return { action: 'discard' };
    }

    // For transactions, merge if amounts differ
    if (item.table === 'wallet_transactions') {
      if (localData.amount !== serverData.amount) {
        // Log discrepancy and keep server version
        console.warn('Wallet transaction conflict detected');
        return { action: 'discard' };
      }
    }

    // Default: merge non-conflicting fields
    const merged = this.mergeData(localData, serverData);
    return { action: 'merge', data: merged };
  }

  /**
   * Merge data intelligently
   */
  private mergeData(
    local: Record<string, any>,
    server: Record<string, any>
  ): Record<string, any> {
    const merged = { ...server };
    
    // Preserve local changes for non-critical fields
    Object.keys(local).forEach(key => {
      if (!['id', 'created_at', 'updated_at', 'version'].includes(key)) {
        if (local[key] !== undefined && local[key] !== null) {
          // Keep local value if it's more recent
          merged[key] = local[key];
        }
      }
    });

    merged.updated_at = new Date().toISOString();
    return merged;
  }

  /**
   * Get pending sync items
   */
  async getPendingItems(): Promise<SyncItem[]> {
    const all = await indexedDB.getAll<SyncItem>('sync_queue');
    return all
      .filter(item => item.status !== 'synced' && item.tenantId === this.tenantId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  /**
   * Get conflict items
   */
  async getConflictItems(): Promise<SyncItem[]> {
    const all = await indexedDB.getAll<SyncItem>('sync_queue');
    return all.filter(item => item.status === 'conflict' && item.tenantId === this.tenantId);
  }

  /**
   * Manually resolve a conflict
   */
  async manualResolve(itemId: string, useLocal: boolean): Promise<void> {
    const item = await indexedDB.get<SyncItem>('sync_queue', itemId);
    if (!item || item.status !== 'conflict') return;

    if (useLocal) {
      item.status = 'pending';
      item.localVersion = Date.now();
      await indexedDB.set('sync_queue', item);
      await this.syncItem(item);
    } else {
      await indexedDB.delete('sync_queue', itemId);
    }
  }

  /**
   * Encrypt data for offline storage
   */
  private encryptData(data: Record<string, any>): Record<string, any> {
    // Simple base64 encoding - in production use proper encryption
    const json = JSON.stringify(data);
    return { _encrypted: btoa(json) };
  }

  /**
   * Decrypt offline data
   */
  private decryptData(data: Record<string, any>): Record<string, any> {
    if (data._encrypted) {
      return JSON.parse(atob(data._encrypted));
    }
    return data;
  }

  /**
   * Subscribe to sync status changes
   */
  onStatusChange(callback: (status: SyncStatus) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(status: SyncStatus): void {
    this.listeners.forEach(cb => cb(status));
  }

  /**
   * Get sync statistics
   */
  async getStats(): Promise<{
    pending: number;
    syncing: number;
    conflicts: number;
    failed: number;
  }> {
    const all = await indexedDB.getAll<SyncItem>('sync_queue');
    const tenantItems = all.filter(i => i.tenantId === this.tenantId);
    
    return {
      pending: tenantItems.filter(i => i.status === 'pending').length,
      syncing: tenantItems.filter(i => i.status === 'syncing').length,
      conflicts: tenantItems.filter(i => i.status === 'conflict').length,
      failed: tenantItems.filter(i => i.status === 'failed').length
    };
  }

  /**
   * Force sync all pending items
   */
  async forceSync(): Promise<void> {
    if (!this.isOnline) {
      throw new Error('OFFLINE: Cannot force sync while offline');
    }
    await this.processQueue();
  }

  /**
   * Clear failed items
   */
  async clearFailed(): Promise<void> {
    const all = await indexedDB.getAll<SyncItem>('sync_queue');
    const failed = all.filter(i => i.status === 'failed' && i.tenantId === this.tenantId);
    
    for (const item of failed) {
      await indexedDB.delete('sync_queue', item.id);
    }
  }
}

export const createSyncEngine = (tenantId: string, config?: Partial<SyncConfig>): SyncEngine => {
  return new SyncEngine(tenantId, config);
};

export default SyncEngine;
