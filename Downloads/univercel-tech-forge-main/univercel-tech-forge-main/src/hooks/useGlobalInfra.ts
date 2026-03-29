/**
 * Global Infrastructure React Hook
 * Provides access to multi-region, DR, CDN, and monitoring
 * Preserves existing offline-hybrid capabilities
 */

import { useState, useEffect, useCallback } from 'react';
import { regionManager, Region, RegionHealth } from '@/lib/global-infra/region-manager';
import { replicationManager, ReplicationItem } from '@/lib/global-infra/replication-manager';
import { disasterRecoveryManager, Incident } from '@/lib/global-infra/disaster-recovery';
import { cdnEdgeManager, EdgeNode } from '@/lib/global-infra/cdn-edge';
import { trafficManager, TrafficStats } from '@/lib/global-infra/traffic-manager';
import { globalMonitor, RegionMetrics, GlobalAlert } from '@/lib/global-infra/global-monitoring';
import { complianceManager, ComplianceZone } from '@/lib/global-infra/compliance-layer';

export interface GlobalInfraState {
  currentRegion: Region | null;
  regionHealth: RegionHealth[];
  pendingReplications: number;
  activeIncidents: Incident[];
  edgeNodes: EdgeNode[];
  trafficStats: TrafficStats[];
  regionMetrics: RegionMetrics[];
  activeAlerts: GlobalAlert[];
  isInitialized: boolean;
}

export const useGlobalInfra = () => {
  const [state, setState] = useState<GlobalInfraState>({
    currentRegion: null,
    regionHealth: [],
    pendingReplications: 0,
    activeIncidents: [],
    edgeNodes: [],
    trafficStats: [],
    regionMetrics: [],
    activeAlerts: [],
    isInitialized: false
  });

  // Initialize and detect region
  useEffect(() => {
    const initialize = async () => {
      const region = await regionManager.detectNearestRegion();
      
      setState(prev => ({
        ...prev,
        currentRegion: region,
        regionHealth: regionManager.getAllHealth(),
        edgeNodes: cdnEdgeManager.getAllEdges(),
        trafficStats: trafficManager.getAllStats(),
        regionMetrics: globalMonitor.getAllMetrics(),
        activeIncidents: disasterRecoveryManager.getActiveIncidents(),
        activeAlerts: globalMonitor.getActiveAlerts(),
        isInitialized: true
      }));
    };

    initialize();
  }, []);

  // Subscribe to region changes
  useEffect(() => {
    const unsubRegion = regionManager.onRegionChange((region) => {
      setState(prev => ({ ...prev, currentRegion: region }));
    });

    const unsubReplication = replicationManager.onReplication(() => {
      setState(prev => ({
        ...prev,
        pendingReplications: replicationManager.getPending().length
      }));
    });

    const unsubIncident = disasterRecoveryManager.onIncident((incident) => {
      setState(prev => ({
        ...prev,
        activeIncidents: [...prev.activeIncidents.filter(i => i.id !== incident.id), incident]
      }));
    });

    const unsubAlert = globalMonitor.onAlert((alert) => {
      setState(prev => ({
        ...prev,
        activeAlerts: [...prev.activeAlerts.filter(a => a.id !== alert.id), alert]
      }));
    });

    return () => {
      unsubRegion();
      unsubReplication();
      unsubIncident();
      unsubAlert();
    };
  }, []);

  // Periodic refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        regionHealth: regionManager.getAllHealth(),
        trafficStats: trafficManager.getAllStats(),
        regionMetrics: globalMonitor.getAllMetrics()
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Queue replication
  const queueReplication = useCallback(async (
    tenantId: string,
    table: string,
    operation: 'insert' | 'update' | 'delete',
    data: Record<string, any>
  ) => {
    if (!state.currentRegion) return null;
    return replicationManager.queueReplication(
      tenantId,
      table,
      operation,
      data,
      state.currentRegion
    );
  }, [state.currentRegion]);

  // Get failover region
  const getFailoverRegion = useCallback((): Region | null => {
    if (!state.currentRegion) return null;
    return regionManager.getFailoverRegion(state.currentRegion);
  }, [state.currentRegion]);

  // Check rate limit
  const checkRateLimit = useCallback((tenantId: string, tenantType: string) => {
    return trafficManager.checkRateLimit(tenantId, tenantType);
  }, []);

  // Get compliance zone
  const getComplianceZone = useCallback((): ComplianceZone | null => {
    if (!state.currentRegion) return null;
    return complianceManager.getComplianceZone(state.currentRegion);
  }, [state.currentRegion]);

  // Cache demo at edge
  const cacheDemo = useCallback(async (demoId: string, content: any) => {
    if (!state.currentRegion) return null;
    return cdnEdgeManager.cacheDemo(demoId, content, state.currentRegion);
  }, [state.currentRegion]);

  // Render masked ID at edge
  const renderMaskedId = useCallback((userId: string, idLength: number) => {
    return cdnEdgeManager.renderMaskedId(userId, idLength);
  }, []);

  // Get global summary
  const getGlobalSummary = useCallback(() => {
    return {
      region: globalMonitor.getSummary(),
      traffic: trafficManager.getSummary(),
      dr: disasterRecoveryManager.getStatus(),
      edge: cdnEdgeManager.getEdgeMetrics(),
      compliance: complianceManager.getSummary(),
      replication: replicationManager.getStats()
    };
  }, []);

  // Acknowledge alert
  const acknowledgeAlert = useCallback((alertId: string) => {
    globalMonitor.acknowledgeAlert(alertId);
    setState(prev => ({
      ...prev,
      activeAlerts: prev.activeAlerts.map(a => 
        a.id === alertId ? { ...a, acknowledgedAt: new Date().toISOString() } : a
      )
    }));
  }, []);

  return {
    ...state,
    queueReplication,
    getFailoverRegion,
    checkRateLimit,
    getComplianceZone,
    cacheDemo,
    renderMaskedId,
    getGlobalSummary,
    acknowledgeAlert
  };
};

export default useGlobalInfra;
