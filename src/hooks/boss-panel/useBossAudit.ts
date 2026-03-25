import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AuditLog {
  log_id: string;
  actor_role: string;
  actor_id: string | null;
  action_type: string;
  target: string | null;
  target_id: string | null;
  risk_level: string;
  metadata: Record<string, unknown>;
  timestamp: string;
  hash_signature: string | null;
}

export interface AuditFilter {
  userId?: string;
  actionType?: string;
  startDate?: string;
  endDate?: string;
  riskLevel?: string;
}

export function useBossAudit(filter?: AuditFilter) {
  const auditQuery = useQuery({
    queryKey: ['boss-audit-logs', filter],
    queryFn: async (): Promise<AuditLog[]> => {
      let query = supabase
        .from('system_activity_log')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(500);

      if (filter?.userId) {
        query = query.eq('actor_id', filter.userId);
      }
      if (filter?.actionType) {
        query = query.eq('action_type', filter.actionType);
      }
      if (filter?.riskLevel) {
        query = query.eq('risk_level', filter.riskLevel);
      }
      if (filter?.startDate) {
        query = query.gte('timestamp', filter.startDate);
      }
      if (filter?.endDate) {
        query = query.lte('timestamp', filter.endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as AuditLog[];
    }
  });

  const searchByUser = async (userId: string) => {
    const { data, error } = await supabase
      .from('system_activity_log')
      .select('*')
      .eq('actor_id', userId)
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) throw error;
    return (data || []) as AuditLog[];
  };

  const searchByAction = async (actionType: string) => {
    const { data, error } = await supabase
      .from('system_activity_log')
      .select('*')
      .eq('action_type', actionType)
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) throw error;
    return (data || []) as AuditLog[];
  };

  const getActionTypes = () => {
    const logs = auditQuery.data || [];
    return [...new Set(logs.map(log => log.action_type))];
  };

  return {
    logs: auditQuery.data || [],
    isLoading: auditQuery.isLoading,
    error: auditQuery.error,
    searchByUser,
    searchByAction,
    getActionTypes,
    refetch: auditQuery.refetch
  };
}
