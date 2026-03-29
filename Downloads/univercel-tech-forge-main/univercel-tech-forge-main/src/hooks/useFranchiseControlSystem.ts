import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { franchiseApi } from '@/lib/api/franchise';

const FRANCHISE_DASHBOARD_QUERY_KEY = ['franchise-control', 'live-dashboard'] as const;

export function useFranchiseControlSystem() {
  const queryClient = useQueryClient();

  const dashboardQuery = useQuery({
    queryKey: FRANCHISE_DASHBOARD_QUERY_KEY,
    queryFn: franchiseApi.getLiveDashboard,
    staleTime: 20_000,
    refetchInterval: 45_000,
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ['franchise-control'] });
  };

  const createStoreMutation = useMutation({
    mutationFn: franchiseApi.createStore,
    onSuccess: invalidate,
  });

  const createLeadMutation = useMutation({
    mutationFn: franchiseApi.createLead,
    onSuccess: invalidate,
  });

  const routeLeadMutation = useMutation({
    mutationFn: franchiseApi.autoRouteLead,
    onSuccess: invalidate,
  });

  const payoutMutation = useMutation({
    mutationFn: franchiseApi.processPayout,
    onSuccess: invalidate,
  });

  return {
    dashboardQuery,
    dashboard: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading,
    isRefreshing: dashboardQuery.isFetching,
    createStoreMutation,
    createLeadMutation,
    routeLeadMutation,
    payoutMutation,
  };
}

export type FranchiseControlSystem = ReturnType<typeof useFranchiseControlSystem>;