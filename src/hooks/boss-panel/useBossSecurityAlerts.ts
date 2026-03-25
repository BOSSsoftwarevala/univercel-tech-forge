import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface SecurityAlert {
  alert_id: string;
  severity: string;
  source: string;
  description: string;
  affected_user_id: string | null;
  affected_role: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
}

export function useBossSecurityAlerts() {
  const [liveAlerts, setLiveAlerts] = useState<SecurityAlert[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  const alertsQuery = useQuery({
    queryKey: ['boss-security-alerts'],
    queryFn: async (): Promise<SecurityAlert[]> => {
      const { data, error } = await supabase
        .from('security_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return (data || []) as SecurityAlert[];
    }
  });

  // Subscribe to realtime alerts
  useEffect(() => {
    const newChannel = supabase
      .channel('boss-security-alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_alerts'
        },
        (payload) => {
          const newAlert = payload.new as SecurityAlert;
          setLiveAlerts(prev => [newAlert, ...prev].slice(0, 20));
        }
      )
      .subscribe();

    setChannel(newChannel);

    return () => {
      supabase.removeChannel(newChannel);
    };
  }, []);

  const allAlerts = [...liveAlerts, ...(alertsQuery.data || [])]
    .filter((alert, index, self) => 
      index === self.findIndex(a => a.alert_id === alert.alert_id)
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const criticalAlerts = allAlerts.filter(a => a.severity === 'critical' && !a.resolved_at);
  const unresolvedAlerts = allAlerts.filter(a => !a.resolved_at);

  return {
    alerts: allAlerts,
    criticalAlerts,
    unresolvedAlerts,
    isLoading: alertsQuery.isLoading,
    error: alertsQuery.error,
    criticalCount: criticalAlerts.length,
    unresolvedCount: unresolvedAlerts.length
  };
}
