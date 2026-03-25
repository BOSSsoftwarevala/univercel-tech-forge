import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { seoManagerApi, type AIContentRequest, type SEOAISuggestion } from '@/lib/api/seo-manager';

const SEO_MANAGER_QUERY_KEY = ['seo-manager', 'dashboard'] as const;

export function useSEOManagerSystem() {
  const queryClient = useQueryClient();

  const dashboardQuery = useQuery({
    queryKey: SEO_MANAGER_QUERY_KEY,
    queryFn: seoManagerApi.getDashboard,
    staleTime: 20_000,
    refetchInterval: 45_000,
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: SEO_MANAGER_QUERY_KEY });
  };

  const generateKeywordsMutation = useMutation({
    mutationFn: seoManagerApi.generateKeywords,
    onSuccess: invalidate,
  });

  const createBlogMutation = useMutation({
    mutationFn: seoManagerApi.createBlog,
    onSuccess: invalidate,
  });

  const createLandingPageMutation = useMutation({
    mutationFn: seoManagerApi.createLandingPage,
    onSuccess: invalidate,
  });

  const updateMetaMutation = useMutation({
    mutationFn: seoManagerApi.updateMeta,
    onSuccess: invalidate,
  });

  const updateSuggestionStatusMutation = useMutation({
    mutationFn: ({ suggestionId, status }: { suggestionId: string; status: SEOAISuggestion['status'] }) =>
      seoManagerApi.updateSuggestionStatus(suggestionId, status),
    onSuccess: invalidate,
  });

  const runTechnicalAuditMutation = useMutation({
    mutationFn: seoManagerApi.runTechnicalAudit,
    onSuccess: invalidate,
  });

  const createBacklinkMutation = useMutation({
    mutationFn: seoManagerApi.createBacklink,
    onSuccess: invalidate,
  });

  const generateContentMutation = useMutation({
    mutationFn: (input: AIContentRequest) => seoManagerApi.generateContent(input),
  });

  const optimizeContentMutation = useMutation({
    mutationFn: (input: AIContentRequest) => seoManagerApi.optimizeContent(input),
  });

  const translateContentMutation = useMutation({
    mutationFn: seoManagerApi.translateContent,
    onSuccess: invalidate,
  });

  const publishContentMutation = useMutation({
    mutationFn: seoManagerApi.publishContent,
    onSuccess: invalidate,
  });

  const distributeSocialMutation = useMutation({
    mutationFn: seoManagerApi.distributeSocial,
  });

  const sendEmailMutation = useMutation({
    mutationFn: seoManagerApi.sendEmail,
  });

  const createAdMutation = useMutation({
    mutationFn: seoManagerApi.createAd,
    onSuccess: invalidate,
  });

  const getContentAnalyticsQuery = useQuery({
    queryKey: ['seo-manager', 'content-analytics'],
    queryFn: seoManagerApi.getContentAnalytics,
    staleTime: 20_000,
    refetchInterval: 60_000,
  });

  const improveContentMutation = useMutation({
    mutationFn: seoManagerApi.improveContent,
    onSuccess: invalidate,
  });

  const runDailyAutomationMutation = useMutation({
    mutationFn: seoManagerApi.runDailyAutomation,
    onSuccess: invalidate,
  });

  useEffect(() => {
    const channel = supabase.channel('seo-manager-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'seo_keywords' }, invalidate)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, invalidate)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'landing_pages' }, invalidate)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'seo_ai_suggestions' }, invalidate)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'seo_activity_logs' }, invalidate)
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    dashboardQuery,
    dashboard: dashboardQuery.data,
    contentAnalyticsQuery: getContentAnalyticsQuery,
    contentAnalytics: getContentAnalyticsQuery.data,
    isLoading: dashboardQuery.isLoading,
    isRefreshing: dashboardQuery.isFetching,
    generateKeywordsMutation,
    createBlogMutation,
    createLandingPageMutation,
    updateMetaMutation,
    updateSuggestionStatusMutation,
    runTechnicalAuditMutation,
    createBacklinkMutation,
    generateContentMutation,
    optimizeContentMutation,
    translateContentMutation,
    publishContentMutation,
    distributeSocialMutation,
    sendEmailMutation,
    createAdMutation,
    improveContentMutation,
    runDailyAutomationMutation,
  };
}

export type SEOManagerSystem = ReturnType<typeof useSEOManagerSystem>;