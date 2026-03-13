import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ResellerApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  recentApplications: {
    id: string;
    full_name: string;
    email: string;
    status: string;
    created_at: string;
    payment_status: string | null;
  }[];
}

export interface FranchiseAccountStats {
  total: number;
  active: number;
  pending: number;
  recentAccounts: {
    id: string;
    owner_name: string;
    business_name: string;
    status: string | null;
    created_at: string;
  }[];
}

export interface JobApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  recentApplications: {
    id: string;
    full_name: string;
    email: string;
    application_type: string;
    status: string;
    created_at: string;
  }[];
}

export interface DashboardMetrics {
  totalRevenue: number;
  revenueByMonth: { month: string; revenue: number; trend: number }[];
  activeUsers: number;
  newUsers: number;
}

export function useResellerApplications() {
  return useQuery({
    queryKey: ['boss-reseller-applications'],
    queryFn: async (): Promise<ResellerApplicationStats> => {
      const { data, error } = await supabase
        .from('reseller_applications')
        .select('id, full_name, email, status, created_at, payment_status')
        .eq('application_type', 'reseller')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const rows = data || [];
      return {
        total: rows.length,
        pending: rows.filter(r => r.status === 'pending').length,
        approved: rows.filter(r => r.status === 'approved').length,
        rejected: rows.filter(r => r.status === 'rejected').length,
        recentApplications: rows.slice(0, 5),
      };
    },
    refetchInterval: 30000,
  });
}

export function useFranchiseAccounts() {
  return useQuery({
    queryKey: ['boss-franchise-accounts'],
    queryFn: async (): Promise<FranchiseAccountStats> => {
      const { data, error } = await supabase
        .from('franchise_accounts')
        .select('id, owner_name, business_name, status, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const rows = data || [];
      return {
        total: rows.length,
        active: rows.filter(r => r.status === 'active').length,
        pending: rows.filter(r => r.status === 'pending').length,
        recentAccounts: rows.slice(0, 5),
      };
    },
    refetchInterval: 30000,
  });
}

export function useJobApplications() {
  return useQuery({
    queryKey: ['boss-job-applications'],
    queryFn: async (): Promise<JobApplicationStats> => {
      const { data, error } = await supabase
        .from('reseller_applications')
        .select('id, full_name, email, application_type, status, created_at')
        .in('application_type', ['developer', 'influencer', 'prime'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      const rows = data || [];
      return {
        total: rows.length,
        pending: rows.filter(r => r.status === 'pending').length,
        approved: rows.filter(r => r.status === 'approved').length,
        rejected: rows.filter(r => r.status === 'rejected').length,
        recentApplications: rows.slice(0, 5),
      };
    },
    refetchInterval: 30000,
  });
}

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['boss-dashboard-metrics'],
    queryFn: async (): Promise<DashboardMetrics> => {
      // Get paid applications for revenue calculation
      const { data: paidApps, error: revenueError } = await supabase
        .from('reseller_applications')
        .select('payment_amount, created_at')
        .eq('payment_status', 'paid');

      if (revenueError) throw revenueError;

      const paid = paidApps || [];
      const totalRevenue = paid.reduce((sum, r) => sum + (r.payment_amount || 0), 0);

      // Build per-month revenue aggregation for last 6 months
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();
      const monthRevenues = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 6 + i, 1);
        return paid
          .filter(r => {
            const rd = new Date(r.created_at);
            return rd.getFullYear() === d.getFullYear() && rd.getMonth() === d.getMonth();
          })
          .reduce((sum, r) => sum + (r.payment_amount || 0), 0);
      });
      const revenueByMonth = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
        const monthLabel = monthNames[d.getMonth()];
        const revenue = monthRevenues[i + 1];
        const trend = monthRevenues[i]; // previous month as trend baseline
        return { month: monthLabel, revenue, trend };
      });

      // Get active users count from profiles table
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // New users in last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { count: newUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo);

      return {
        totalRevenue,
        revenueByMonth,
        activeUsers: activeUsers || 0,
        newUsers: newUsers || 0,
      };
    },
    refetchInterval: 30000,
  });
}

export function useDashboardRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('boss-dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reseller_applications' }, () => {
        queryClient.invalidateQueries({ queryKey: ['boss-reseller-applications'] });
        queryClient.invalidateQueries({ queryKey: ['boss-job-applications'] });
        queryClient.invalidateQueries({ queryKey: ['boss-dashboard-metrics'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'franchise_accounts' }, () => {
        queryClient.invalidateQueries({ queryKey: ['boss-franchise-accounts'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
