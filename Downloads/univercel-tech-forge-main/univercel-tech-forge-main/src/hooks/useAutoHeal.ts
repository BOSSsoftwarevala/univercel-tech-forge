/**
 * AI Auto-Healing Hook
 * Provides self-healing, monitoring, and optimization capabilities
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Health status types
interface ComponentHealth {
  status: 'ok' | 'degraded' | 'critical';
  [key: string]: any;
}

interface SystemHealth {
  timestamp: string;
  status: 'healthy' | 'degraded' | 'critical';
  components: {
    chat: ComponentHealth;
    buzzer: ComponentHealth;
    demos: ComponentHealth;
    wallet: ComponentHealth;
  };
}

interface SystemMetrics {
  period: string;
  metrics: {
    chatMessages: number;
    apiCalls: number;
    buzzerAlerts: number;
    walletTransactions: number;
  };
  timestamp: string;
}

interface HealingAction {
  action: string;
  result: any;
}

interface AutoHealState {
  isMonitoring: boolean;
  health: SystemHealth | null;
  metrics: SystemMetrics | null;
  lastHealingRun: string | null;
  healingActions: HealingAction[];
  suspiciousActivity: any[];
  fraudPatterns: any[];
  predictions: any;
}

export function useAutoHeal(autoStart = false) {
  const { toast } = useToast();
  const [state, setState] = useState<AutoHealState>({
    isMonitoring: false,
    health: null,
    metrics: null,
    lastHealingRun: null,
    healingActions: [],
    suspiciousActivity: [],
    fraudPatterns: [],
    predictions: null,
  });

  const monitoringInterval = useRef<NodeJS.Timeout | null>(null);
  const healingInterval = useRef<NodeJS.Timeout | null>(null);

  // =========================================================================
  // API CALLS
  // =========================================================================

  const callAutoHeal = useCallback(async (action: string, data?: any) => {
    try {
      const { data: result, error } = await supabase.functions.invoke('ai-auto-heal', {
        body: { action, data },
      });

      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Auto-heal ${action} failed:`, error);
      return null;
    }
  }, []);

  // =========================================================================
  // HEALTH MONITORING
  // =========================================================================

  const runHealthCheck = useCallback(async () => {
    const result = await callAutoHeal('health_check');
    if (result?.health) {
      setState(prev => ({ ...prev, health: result.health }));

      // Alert on degraded/critical status
      if (result.health.status === 'critical') {
        toast({
          title: '🚨 System Critical',
          description: 'Multiple components degraded. Auto-healing initiated.',
          variant: 'destructive',
        });
        // Auto-trigger healing
        await runSelfHealing();
      } else if (result.health.status === 'degraded') {
        toast({
          title: '⚠️ System Degraded',
          description: 'Some components need attention.',
        });
      }
    }
    return result?.health;
  }, [callAutoHeal, toast]);

  const getMetrics = useCallback(async () => {
    const result = await callAutoHeal('get_metrics');
    if (result?.metrics) {
      setState(prev => ({ ...prev, metrics: result }));
    }
    return result?.metrics;
  }, [callAutoHeal]);

  // =========================================================================
  // SELF-HEALING
  // =========================================================================

  const runSelfHealing = useCallback(async () => {
    const result = await callAutoHeal('heal_system');
    if (result?.success) {
      setState(prev => ({
        ...prev,
        lastHealingRun: new Date().toISOString(),
        healingActions: result.actions || [],
      }));

      toast({
        title: '✅ Self-Healing Complete',
        description: `${result.actions?.length || 0} healing actions performed.`,
      });
    }
    return result;
  }, [callAutoHeal, toast]);

  const detectAndCorrectFailures = useCallback(async () => {
    const result = await callAutoHeal('detect_failures');
    if (result?.corrections?.length) {
      toast({
        title: '🔧 Auto-Corrections Applied',
        description: `Fixed ${result.corrections.length} issues automatically.`,
      });
    }
    return result;
  }, [callAutoHeal, toast]);

  const reassignStuckTasks = useCallback(async () => {
    const result = await callAutoHeal('reassign_stuck_tasks');
    if (result?.reassigned?.length) {
      toast({
        title: '📋 Tasks Reassigned',
        description: `${result.reassigned.length} stuck tasks reassigned.`,
      });
    }
    return result?.reassigned;
  }, [callAutoHeal, toast]);

  const retryFailedPayouts = useCallback(async () => {
    const result = await callAutoHeal('retry_failed_payouts');
    return result?.retried;
  }, [callAutoHeal]);

  // =========================================================================
  // SECURITY
  // =========================================================================

  const detectSuspiciousBehavior = useCallback(async () => {
    const result = await callAutoHeal('detect_suspicious');
    if (result?.suspicious) {
      setState(prev => ({ ...prev, suspiciousActivity: result.suspicious }));

      if (result.suspicious.length > 0) {
        toast({
          title: '🚨 Suspicious Activity Detected',
          description: `${result.suspicious.length} threats identified.`,
          variant: 'destructive',
        });
      }
    }
    return result?.suspicious;
  }, [callAutoHeal, toast]);

  const autoBlockThreat = useCallback(async (data: { ip?: string; deviceId?: string; userId?: string; reason: string }) => {
    const result = await callAutoHeal('auto_block', data);
    if (result?.blocked) {
      toast({
        title: '🛡️ Threat Blocked',
        description: `Blocked: ${data.ip || data.deviceId || data.userId}`,
      });
    }
    return result;
  }, [callAutoHeal, toast]);

  const detectFraudPatterns = useCallback(async () => {
    const result = await callAutoHeal('detect_fraud');
    if (result?.fraud) {
      setState(prev => ({ ...prev, fraudPatterns: result.fraud }));
    }
    return result?.fraud;
  }, [callAutoHeal]);

  const escalateToBoss = useCallback(async (reason: string, severity: string, details: any) => {
    const result = await callAutoHeal('escalate_to_boss', { reason, severity, details });
    if (result?.escalated) {
      toast({
        title: '👑 Escalated to BOSS',
        description: reason,
        variant: 'destructive',
      });
    }
    return result;
  }, [callAutoHeal, toast]);

  // =========================================================================
  // DEVELOPER ROUTING
  // =========================================================================

  const autoAssignTask = useCallback(async (taskId: string) => {
    const result = await callAutoHeal('auto_assign_task', { taskId });
    return result?.assignment;
  }, [callAutoHeal]);

  const estimateTaskTime = useCallback(async (taskId: string) => {
    const result = await callAutoHeal('estimate_time', { taskId });
    return result?.estimate;
  }, [callAutoHeal]);

  const prioritizeBySLA = useCallback(async () => {
    const result = await callAutoHeal('prioritize_sla');
    return result?.prioritized;
  }, [callAutoHeal]);

  // =========================================================================
  // PREDICTIONS
  // =========================================================================

  const analyzePatterns = useCallback(async () => {
    const result = await callAutoHeal('analyze_patterns');
    return result?.patterns;
  }, [callAutoHeal]);

  const predictScaling = useCallback(async () => {
    const result = await callAutoHeal('predict_scaling');
    if (result?.prediction) {
      setState(prev => ({ ...prev, predictions: result.prediction }));
    }
    return result?.prediction;
  }, [callAutoHeal]);

  const forecastWalletVolume = useCallback(async () => {
    const result = await callAutoHeal('forecast_wallet_volume');
    return result?.forecast;
  }, [callAutoHeal]);

  // =========================================================================
  // OPTIMIZATION
  // =========================================================================

  const runOptimizations = useCallback(async () => {
    const result = await callAutoHeal('optimize');
    if (result?.optimizations?.length) {
      toast({
        title: '⚡ Optimizations Applied',
        description: `${result.optimizations.length} optimizations completed.`,
      });
    }
    return result?.optimizations;
  }, [callAutoHeal, toast]);

  // =========================================================================
  // MONITORING CONTROL
  // =========================================================================

  const startMonitoring = useCallback(() => {
    if (state.isMonitoring) return;

    setState(prev => ({ ...prev, isMonitoring: true }));

    // Health check every 2 minutes
    monitoringInterval.current = setInterval(async () => {
      await runHealthCheck();
      await getMetrics();
      await detectSuspiciousBehavior();
    }, 2 * 60 * 1000);

    // Self-healing every 15 minutes
    healingInterval.current = setInterval(async () => {
      await detectAndCorrectFailures();
      await prioritizeBySLA();
    }, 15 * 60 * 1000);

    // Initial run
    runHealthCheck();
    getMetrics();
  }, [state.isMonitoring, runHealthCheck, getMetrics, detectSuspiciousBehavior, detectAndCorrectFailures, prioritizeBySLA]);

  const stopMonitoring = useCallback(() => {
    if (monitoringInterval.current) {
      clearInterval(monitoringInterval.current);
      monitoringInterval.current = null;
    }
    if (healingInterval.current) {
      clearInterval(healingInterval.current);
      healingInterval.current = null;
    }
    setState(prev => ({ ...prev, isMonitoring: false }));
  }, []);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart) {
      startMonitoring();
    }
    return () => stopMonitoring();
  }, [autoStart]);

  return {
    // State
    ...state,

    // Monitoring
    startMonitoring,
    stopMonitoring,
    runHealthCheck,
    getMetrics,

    // Self-Healing
    runSelfHealing,
    detectAndCorrectFailures,
    reassignStuckTasks,
    retryFailedPayouts,

    // Security
    detectSuspiciousBehavior,
    autoBlockThreat,
    detectFraudPatterns,
    escalateToBoss,

    // Developer Routing
    autoAssignTask,
    estimateTaskTime,
    prioritizeBySLA,

    // Predictions
    analyzePatterns,
    predictScaling,
    forecastWalletVolume,

    // Optimization
    runOptimizations,
  };
}

// Utility functions
export const getHealthStatusColor = (status: string) => {
  switch (status) {
    case 'healthy':
    case 'ok':
      return 'text-green-500';
    case 'degraded':
      return 'text-yellow-500';
    case 'critical':
      return 'text-red-500';
    default:
      return 'text-muted-foreground';
  }
};

export const getHealthStatusBg = (status: string) => {
  switch (status) {
    case 'healthy':
    case 'ok':
      return 'bg-green-500/10';
    case 'degraded':
      return 'bg-yellow-500/10';
    case 'critical':
      return 'bg-red-500/10';
    default:
      return 'bg-muted';
  }
};
