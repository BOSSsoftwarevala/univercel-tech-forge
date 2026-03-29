import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface RiskScore {
  user_id: string;
  current_score: number;
  previous_score: number;
  risk_level: 'normal' | 'caution' | 'watch' | 'high' | 'critical';
  login_pattern_score: number;
  device_score: number;
  transaction_score: number;
  behavior_score: number;
  commission_score: number;
  lead_score: number;
  factors: string[];
  escalation_level: number;
  last_calculated_at: string;
}

interface ReputationScore {
  entity_type: string;
  entity_id: string;
  star_rating: number;
  trust_index: number;
  performance_rating: number;
  complaint_ratio: number;
  delivery_accuracy: number;
  payout_priority: string;
  wallet_privilege_level: string;
}

interface RiskAlert {
  id: string;
  user_id: string;
  alert_type: string;
  severity: 'info' | 'warning' | 'danger' | 'critical';
  title: string;
  description: string;
  risk_score: number;
  risk_level: string;
  indicators: string[];
  recommended_action: string;
  is_active: boolean;
  acknowledged: boolean;
  created_at: string;
}

interface CommandCenterData {
  high_risk_users: RiskScore[];
  recent_alerts: RiskAlert[];
  risk_distribution: {
    normal: number;
    caution: number;
    watch: number;
    high: number;
    critical: number;
  };
  recent_escalations: any[];
  watchlist_count: number;
  summary: {
    total_high_risk: number;
    active_alerts: number;
    pending_escalations: number;
  };
}

export function useRiskEngine() {
  const { user } = useAuth();
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [reputation, setReputation] = useState<ReputationScore | null>(null);
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [commandCenterData, setCommandCenterData] = useState<CommandCenterData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's risk score
  const fetchRiskScore = useCallback(async (userId?: string) => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return null;

    try {
      const response = await supabase.functions.invoke('api-risk-engine', {
        body: {
          path: '/get-score',
          user_id: targetUserId,
        },
      });

      if (response.data?.success) {
        setRiskScore(response.data.data);
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch risk score:', error);
      return null;
    }
  }, [user]);

  // Record a risk event
  const recordRiskEvent = useCallback(async (
    eventType: string,
    eventCategory: 'login' | 'transaction' | 'behavior' | 'device' | 'lead' | 'commission' | 'demo' | 'code' | 'communication',
    severity: 'low' | 'medium' | 'high' | 'critical' = 'low',
    metadata?: Record<string, unknown>
  ) => {
    if (!user) return null;

    try {
      const response = await supabase.functions.invoke('api-risk-engine', {
        body: {
          path: '/record-event',
          user_id: user.id,
          event_type: eventType,
          event_category: eventCategory,
          severity,
          metadata,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to record risk event:', error);
      return null;
    }
  }, [user]);

  // Analyze behavior pattern
  const analyzeBehavior = useCallback(async (
    patternType: string,
    currentData: Record<string, unknown>
  ) => {
    if (!user) return null;

    try {
      const response = await supabase.functions.invoke('api-risk-engine', {
        body: {
          path: '/analyze-behavior',
          user_id: user.id,
          pattern_type: patternType,
          current_data: currentData,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to analyze behavior:', error);
      return null;
    }
  }, [user]);

  // Analyze transaction risk
  const analyzeTransaction = useCallback(async (
    transactionType: string,
    amount: number,
    metadata?: Record<string, unknown>
  ) => {
    if (!user) return null;

    try {
      const response = await supabase.functions.invoke('api-risk-engine', {
        body: {
          path: '/analyze-transaction',
          user_id: user.id,
          transaction_type: transactionType,
          amount,
          metadata,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to analyze transaction:', error);
      return null;
    }
  }, [user]);

  // Get reputation score
  const fetchReputation = useCallback(async (entityType: string, entityId: string) => {
    try {
      const response = await supabase.functions.invoke('api-risk-engine', {
        body: {
          path: '/get-reputation',
          entity_type: entityType,
          entity_id: entityId,
        },
      });

      if (response.data?.success) {
        setReputation(response.data.data);
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch reputation:', error);
      return null;
    }
  }, []);

  // Fetch command center data (admin)
  const fetchCommandCenterData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('api-risk-engine', {
        body: {
          path: '/command-center',
        },
      });

      if (response.data?.success) {
        setCommandCenterData(response.data.data);
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch command center data:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch active alerts
  const fetchAlerts = useCallback(async (severity?: string) => {
    try {
      const response = await supabase.functions.invoke('api-risk-engine', {
        body: {
          path: '/alerts',
          status: 'active',
          severity,
        },
      });

      if (response.data?.success) {
        setAlerts(response.data.data || []);
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      return [];
    }
  }, []);

  // Acknowledge an alert
  const acknowledgeAlert = useCallback(async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('risk_alerts')
        .update({
          acknowledged: true,
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: user?.id,
        })
        .eq('id', alertId);

      if (!error) {
        setAlerts(prev => prev.map(a => 
          a.id === alertId ? { ...a, acknowledged: true } : a
        ));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
      return false;
    }
  }, [user]);

  // Add to watchlist
  const addToWatchlist = useCallback(async (
    userId: string,
    watchlistType: 'monitor' | 'restrict' | 'whitelist' | 'blacklist',
    reason: string,
    expiresAt?: string
  ) => {
    try {
      const response = await supabase.functions.invoke('api-risk-engine', {
        body: {
          path: '/watchlist',
          action: 'add',
          user_id: userId,
          watchlist_type: watchlistType,
          reason,
          added_by: user?.id,
          expires_at: expiresAt,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to add to watchlist:', error);
      return null;
    }
  }, [user]);

  // Remove from watchlist
  const removeFromWatchlist = useCallback(async (userId: string) => {
    try {
      const response = await supabase.functions.invoke('api-risk-engine', {
        body: {
          path: '/watchlist',
          action: 'remove',
          user_id: userId,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to remove from watchlist:', error);
      return null;
    }
  }, []);

  // Trigger manual escalation
  const triggerEscalation = useCallback(async (
    userId: string,
    level: 1 | 2 | 3 | 4,
    reason: string
  ) => {
    try {
      const response = await supabase.functions.invoke('api-risk-engine', {
        body: {
          path: '/escalate',
          user_id: userId,
          level,
          trigger_reason: reason,
          auto_triggered: false,
          triggered_by: user?.id,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to trigger escalation:', error);
      return null;
    }
  }, [user]);

  // AI-powered analysis
  const requestAIAnalysis = useCallback(async (
    userId: string,
    analysisType: string,
    data: Record<string, unknown>
  ) => {
    try {
      const response = await supabase.functions.invoke('api-risk-engine', {
        body: {
          path: '/ai-analyze',
          user_id: userId,
          analysis_type: analysisType,
          data,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to request AI analysis:', error);
      return null;
    }
  }, []);

  // Subscribe to real-time alerts
  useEffect(() => {
    const channel = supabase
      .channel('risk-alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'risk_alerts',
        },
        (payload) => {
          const newAlert = payload.new as RiskAlert;
          setAlerts(prev => [newAlert, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Initial fetch for user's risk score
  useEffect(() => {
    if (user) {
      fetchRiskScore();
    }
  }, [user, fetchRiskScore]);

  return {
    riskScore,
    reputation,
    alerts,
    commandCenterData,
    isLoading,
    fetchRiskScore,
    recordRiskEvent,
    analyzeBehavior,
    analyzeTransaction,
    fetchReputation,
    fetchCommandCenterData,
    fetchAlerts,
    acknowledgeAlert,
    addToWatchlist,
    removeFromWatchlist,
    triggerEscalation,
    requestAIAnalysis,
  };
}

// Risk level utilities
export const getRiskLevelColor = (level: string) => {
  switch (level) {
    case 'normal': return 'text-green-500';
    case 'caution': return 'text-yellow-500';
    case 'watch': return 'text-orange-500';
    case 'high': return 'text-red-500';
    case 'critical': return 'text-red-700';
    default: return 'text-muted-foreground';
  }
};

export const getRiskLevelBgColor = (level: string) => {
  switch (level) {
    case 'normal': return 'bg-green-500/10';
    case 'caution': return 'bg-yellow-500/10';
    case 'watch': return 'bg-orange-500/10';
    case 'high': return 'bg-red-500/10';
    case 'critical': return 'bg-red-700/10';
    default: return 'bg-muted';
  }
};

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'info': return 'text-blue-500';
    case 'warning': return 'text-yellow-500';
    case 'danger': return 'text-orange-500';
    case 'critical': return 'text-red-600';
    default: return 'text-muted-foreground';
  }
};