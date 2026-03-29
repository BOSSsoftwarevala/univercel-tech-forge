import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { leadManagerApi } from '@/lib/api/lead-manager';

const LEAD_MANAGER_DASHBOARD_KEY = ['lead-manager', 'dashboard'] as const;

export function useLeadManagerSystem() {
  const queryClient = useQueryClient();

  const dashboardQuery = useQuery({
    queryKey: LEAD_MANAGER_DASHBOARD_KEY,
    queryFn: leadManagerApi.getDashboard,
    staleTime: 20_000,
    refetchInterval: 45_000,
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ['lead-manager'] });
  };

  const captureLeadMutation = useMutation({
    mutationFn: leadManagerApi.captureLead,
    onSuccess: invalidate,
  });

  const moveLeadStageMutation = useMutation({
    mutationFn: leadManagerApi.moveLeadStage,
    onSuccess: invalidate,
  });

  const assignLeadMutation = useMutation({
    mutationFn: leadManagerApi.assignLead,
    onSuccess: invalidate,
  });

  const convertLeadMutation = useMutation({
    mutationFn: leadManagerApi.convertLead,
    onSuccess: invalidate,
  });

  const aiSuggestionMutation = useMutation({
    mutationFn: leadManagerApi.getAISuggestions,
    onSuccess: invalidate,
  });

  useEffect(() => {
    const channel = supabase.channel('lead-manager-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, invalidate)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lead_alerts' }, invalidate)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lead_follow_ups' }, invalidate)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lead_communications' }, invalidate)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lead_ai_suggestions' }, invalidate)
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    dashboardQuery,
    dashboard: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading,
    isRefreshing: dashboardQuery.isFetching,
    captureLeadMutation,
    moveLeadStageMutation,
    assignLeadMutation,
    convertLeadMutation,
    aiSuggestionMutation,
  };
}

export type LeadManagerSystem = ReturnType<typeof useLeadManagerSystem>;