/**
 * BOSS PENDING ACTIONS HOOK
 * Realtime pending approvals, alerts, and high-priority items for Boss Panel
 */

import { useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PendingApproval {
  id: string;
  request_type: string;
  request_data: Record<string, unknown>;
  status: string;
  requested_by_user_id: string;
  created_at: string;
  expires_at: string | null;
  risk_score: number | null;
}

export interface SecurityAlert {
  id: string;
  alert_type: string;
  severity: string;
  description: string | null;
  created_at: string;
  is_resolved: boolean;
}

export interface BossPendingCounts {
  pendingApprovals: number;
  criticalAlerts: number;
  highRiskActions: number;
  total: number;
}

async function fetchPendingApprovals(): Promise<PendingApproval[]> {
  const { data, error } = await supabase
    .from('approvals')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return (data ?? []) as unknown as PendingApproval[];
}

async function fetchSecurityAlerts(): Promise<SecurityAlert[]> {
  // Execute raw query to avoid deep type instantiation
  const { data, error } = await (supabase as any)
    .from('security_alerts')
    .select('id, alert_type, severity, message, created_at, is_resolved')
    .eq('is_resolved', false)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;

  const rows = (data ?? []) as Array<{
    id: string;
    alert_type: string;
    severity: string;
    message: string | null;
    created_at: string;
    is_resolved: boolean;
  }>;

  return rows.map((a) => ({
    id: a.id,
    alert_type: a.alert_type,
    severity: a.severity,
    description: a.message,
    created_at: a.created_at,
    is_resolved: a.is_resolved,
  }));
}

async function fetchHighRiskCount(): Promise<number> {
  const { count, error } = await supabase
    .from('system_activity_log')
    .select('*', { count: 'exact', head: true })
    .in('risk_level', ['high', 'critical']);

  if (error) throw error;
  return count ?? 0;
}

export function useBossPendingActions() {
  const queryClient = useQueryClient();

  // Query pending approvals
  const approvalsQuery = useQuery({
    queryKey: ['boss-pending-approvals'],
    queryFn: fetchPendingApprovals,
    refetchInterval: 15000,
  });

  // Query critical security alerts
  const alertsQuery = useQuery({
    queryKey: ['boss-security-alerts'],
    queryFn: fetchSecurityAlerts,
    refetchInterval: 15000,
  });

  // Query high-risk actions from system_activity_log
  const highRiskQuery = useQuery({
    queryKey: ['boss-high-risk-actions'],
    queryFn: fetchHighRiskCount,
    refetchInterval: 15000,
  });

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('boss-pending-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'approvals' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['boss-pending-approvals'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'security_alerts' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['boss-security-alerts'] });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'system_activity_log' },
        (payload) => {
          const newRow = payload.new as { risk_level?: string };
          if (newRow.risk_level === 'high' || newRow.risk_level === 'critical') {
            queryClient.invalidateQueries({ queryKey: ['boss-high-risk-actions'] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Computed counts
  const counts: BossPendingCounts = {
    pendingApprovals: approvalsQuery.data?.length ?? 0,
    criticalAlerts: alertsQuery.data?.filter((a) => a.severity === 'critical').length ?? 0,
    highRiskActions: highRiskQuery.data ?? 0,
    total:
      (approvalsQuery.data?.length ?? 0) +
      (alertsQuery.data?.filter((a) => a.severity === 'critical').length ?? 0),
  };

  // Approve action
  const approveRequest = useCallback(
    async (approvalId: string, notes?: string) => {
      const { error } = await supabase
        .from('approvals')
        .update({ status: 'approved' } as Record<string, unknown>)
        .eq('id', approvalId);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        action: 'approval_granted',
        module: 'boss_dashboard',
        meta_json: { approval_id: approvalId, notes },
      });

      queryClient.invalidateQueries({ queryKey: ['boss-pending-approvals'] });
      return true;
    },
    [queryClient]
  );

  // Reject action
  const rejectRequest = useCallback(
    async (approvalId: string, reason?: string) => {
      const { error } = await supabase
        .from('approvals')
        .update({ status: 'rejected' } as Record<string, unknown>)
        .eq('id', approvalId);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        action: 'approval_rejected',
        module: 'boss_dashboard',
        meta_json: { approval_id: approvalId, reason },
      });

      queryClient.invalidateQueries({ queryKey: ['boss-pending-approvals'] });
      return true;
    },
    [queryClient]
  );

  // Resolve alert
  const resolveAlert = useCallback(
    async (alertId: string, notes?: string) => {
      const updatePayload = {
        is_resolved: true,
        resolved_at: new Date().toISOString(),
        resolution_notes: notes,
      };
      const { error } = await (supabase as any)
        .from('security_alerts')
        .update(updatePayload)
        .eq('id', alertId);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        action: 'alert_resolved',
        module: 'boss_dashboard',
        meta_json: { alert_id: alertId, notes },
      });

      queryClient.invalidateQueries({ queryKey: ['boss-security-alerts'] });
      return true;
    },
    [queryClient]
  );

  return {
    pendingApprovals: approvalsQuery.data ?? [],
    securityAlerts: alertsQuery.data ?? [],
    counts,
    isLoading: approvalsQuery.isLoading || alertsQuery.isLoading,
    error: approvalsQuery.error || alertsQuery.error,
    approveRequest,
    rejectRequest,
    resolveAlert,
    refetch: () => {
      approvalsQuery.refetch();
      alertsQuery.refetch();
      highRiskQuery.refetch();
    },
  };
}
