/**
 * Multi-Tenant Hook
 * React integration for multi-tenant, offline-hybrid system
 */

import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '@/lib/multi-tenant/tenant-context';
import { createSyncEngine, SyncEngine, SyncStatus } from '@/lib/offline-hybrid/sync-engine';
import { orchestrator } from '@/lib/ai-orchestration/orchestrator';
import { tenantMonitor } from '@/lib/tenant-analytics/monitor';
import { logModuleAction, logModuleError } from '@/utils/activityLogging';

const MODULE = 'marketplace-sync';

export interface MultiTenantState {
  isOnline: boolean;
  syncStatus: SyncStatus;
  pendingSyncs: number;
  conflicts: number;
  tenantMetrics: any;
}

export const useMultiTenantSync = () => {
  const { currentTenant, getMaskedTenantId } = useTenant();
  const [syncEngine, setSyncEngine] = useState<SyncEngine | null>(null);
  const [state, setState] = useState<MultiTenantState>({
    isOnline: navigator.onLine,
    syncStatus: 'synced',
    pendingSyncs: 0,
    conflicts: 0,
    tenantMetrics: null
  });

  // Initialize sync engine for tenant
  useEffect(() => {
    if (currentTenant) {
      const engine = createSyncEngine(currentTenant.id, {
        tenantIsolation: true,
        encryptOfflineData: true,
        preserveDeleteLogs: true
      });
      setSyncEngine(engine);

      const unsubscribe = engine.onStatusChange((status) => {
        setState(prev => ({ ...prev, syncStatus: status }));
      });

      return () => unsubscribe();
    }
  }, [currentTenant?.id]);

  // Update metrics periodically
  useEffect(() => {
    if (!currentTenant) return;

    const updateMetrics = async () => {
      if (syncEngine) {
        const stats = await syncEngine.getStats();
        setState(prev => ({
          ...prev,
          pendingSyncs: stats.pending,
          conflicts: stats.conflicts
        }));

        // Update orchestrator metrics
        orchestrator.updateMetrics(currentTenant.id, {
          pendingSyncs: stats.pending,
          lastActivity: new Date().toISOString()
        });
      }
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 30000);
    return () => clearInterval(interval);
  }, [currentTenant?.id, syncEngine]);

  // Queue offline operation
  const queueOperation = useCallback(async (
    table: string,
    operation: 'insert' | 'update' | 'delete',
    data: Record<string, any>
  ) => {
    if (!syncEngine) throw new Error('Sync engine not initialized');
    return syncEngine.queueOperation(table, operation, data);
  }, [syncEngine]);

  // Force sync
  const forceSync = useCallback(async () => {
    if (syncEngine && navigator.onLine) {
      try {
        await syncEngine.forceSync();
        logModuleAction(MODULE, 'marketplace_sync_completed', 'system', {
          metadata: { tenant_id: currentTenant?.id },
        });
      } catch (err) {
        logModuleError(MODULE, 'marketplace_sync_completed', 'system', err instanceof Error ? err.message : 'Sync failed');
      }
    }
  }, [syncEngine, currentTenant?.id]);

  // Get tenant analytics
  const getAnalytics = useCallback(() => {
    if (!currentTenant) return null;
    return tenantMonitor.getAnalytics(currentTenant.id);
  }, [currentTenant?.id]);

  return {
    ...state,
    maskedTenantId: getMaskedTenantId(),
    queueOperation,
    forceSync,
    getAnalytics,
    isInitialized: !!syncEngine
  };
};

export default useMultiTenantSync;
