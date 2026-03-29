import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  marketingManagerApi,
  type CreateMarketingCampaignInput,
  type MarketingAIInsight,
  type MarketingContentQueueItem,
} from '@/lib/api/marketing-manager';

const MARKETING_MANAGER_QUERY_KEY = ['marketing-manager', 'dashboard'] as const;

export function useMarketingManagerSystem() {
  const queryClient = useQueryClient();

  const dashboardQuery = useQuery({
    queryKey: MARKETING_MANAGER_QUERY_KEY,
    queryFn: marketingManagerApi.getDashboard,
    staleTime: 20_000,
    refetchInterval: 45_000,
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: MARKETING_MANAGER_QUERY_KEY });
  };

  const createCampaignMutation = useMutation({
    mutationFn: (input: CreateMarketingCampaignInput) => marketingManagerApi.createCampaign(input),
    onSuccess: invalidate,
  });

  const updateCampaignStatusMutation = useMutation({
    mutationFn: ({ campaignId, status }: { campaignId: string; status: string }) =>
      marketingManagerApi.updateCampaignStatus(campaignId, status),
    onSuccess: invalidate,
  });

  const updateInsightStatusMutation = useMutation({
    mutationFn: ({ insightId, status }: { insightId: string; status: MarketingAIInsight['status'] }) =>
      marketingManagerApi.updateInsightStatus(insightId, status),
    onSuccess: invalidate,
  });

  const updateContentStatusMutation = useMutation({
    mutationFn: ({ contentId, status }: { contentId: string; status: MarketingContentQueueItem['status'] }) =>
      marketingManagerApi.updateContentStatus(contentId, status),
    onSuccess: invalidate,
  });

  const runAutomationMutation = useMutation({
    mutationFn: marketingManagerApi.runAutomation,
    onSuccess: invalidate,
  });

  const analyzeMarketingMutation = useMutation({
    mutationFn: marketingManagerApi.analyzeMarketing,
    onSuccess: invalidate,
  });

  useEffect(() => {
    const channel = supabase.channel('marketing-manager-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marketing_campaigns' }, invalidate)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marketing_ai_insights' }, invalidate)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marketing_alerts' }, invalidate)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marketing_content_queue' }, invalidate)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marketing_activity_logs' }, invalidate)
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
    createCampaignMutation,
    updateCampaignStatusMutation,
    updateInsightStatusMutation,
    updateContentStatusMutation,
    runAutomationMutation,
    analyzeMarketingMutation,
  };
}

export type MarketingManagerSystem = ReturnType<typeof useMarketingManagerSystem>;