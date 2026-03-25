import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardSummary {
  totalSuperAdmins: number;
  activeContinents: number;
  countriesLive: number;
  revenueToday: number;
  criticalAlerts: number;
  systemHealth: number;
}

export interface SystemHealth {
  overall: number;
  modules: {
    name: string;
    status: string;
    health: number;
  }[];
}

export function useBossDashboard() {
  const summaryQuery = useQuery({
    queryKey: ['boss-dashboard-summary'],
    queryFn: async (): Promise<DashboardSummary> => {
      // Get super admin count
      const { count: superAdminCount } = await supabase
        .from('super_admin')
        .select('*', { count: 'exact', head: true });

      // Get critical alerts count
      const { count: alertsCount } = await supabase
        .from('security_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('severity', 'critical')
        .is('resolved_at', null);

      // Get active modules for system health
      const { data: modules } = await supabase
        .from('system_modules')
        .select('status');

      const activeModules = modules?.filter(m => m.status === 'active').length || 0;
      const totalModules = modules?.length || 1;
      const systemHealth = Math.round((activeModules / totalModules) * 100);

      return {
        totalSuperAdmins: superAdminCount || 0,
        activeContinents: 6, // Placeholder - would come from real data
        countriesLive: 45, // Placeholder
        revenueToday: 125000, // Placeholder
        criticalAlerts: alertsCount || 0,
        systemHealth
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const systemHealthQuery = useQuery({
    queryKey: ['boss-system-health'],
    queryFn: async (): Promise<SystemHealth> => {
      const { data: modules } = await supabase
        .from('system_modules')
        .select('module_name, status');

      const moduleHealth = modules?.map(m => ({
        name: m.module_name,
        status: m.status || 'active',
        health: m.status === 'active' ? 100 : m.status === 'maintenance' ? 50 : 0
      })) || [];

      const overall = moduleHealth.length > 0 
        ? Math.round(moduleHealth.reduce((sum, m) => sum + m.health, 0) / moduleHealth.length)
        : 100;

      return {
        overall,
        modules: moduleHealth
      };
    },
    refetchInterval: 30000
  });

  return {
    summary: summaryQuery.data,
    systemHealth: systemHealthQuery.data,
    isLoading: summaryQuery.isLoading || systemHealthQuery.isLoading,
    error: summaryQuery.error || systemHealthQuery.error
  };
}
