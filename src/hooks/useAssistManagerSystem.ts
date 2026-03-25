import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  approveAssistManagerSession,
  createAssistManagerSession,
  emergencyStopAssistManagerSession,
  endAssistManagerSession,
  getAssistManagerAiLogs,
  getAssistManagerDashboard,
  getAssistManagerPendingApprovals,
  getAssistManagerSessionDetail,
  getAssistManagerSettings,
  listAssistManagerSessions,
  pauseAssistManagerSession,
  sendAssistManagerChat,
  sendAssistManagerControlEvent,
  startAssistManagerSession,
  updateAssistManagerSettings,
  type AssistDashboardResponse,
  type AssistManagerAILog,
  type AssistManagerApproval,
  type AssistManagerSession,
  type AssistManagerSettings,
  type CreateAssistSessionInput,
} from '@/lib/api/assist-manager';
import { supabase } from '@/integrations/supabase/client';

const DASHBOARD_KEY = ['assist-manager-dashboard'];
const SESSIONS_KEY = ['assist-manager-sessions'];
const APPROVALS_KEY = ['assist-manager-approvals'];
const SETTINGS_KEY = ['assist-manager-settings'];
const AI_LOGS_KEY = ['assist-manager-ai-logs'];

export default function useAssistManagerSystem() {
  const queryClient = useQueryClient();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [permissionTokens, setPermissionTokens] = useState<Record<string, string>>({});

  useEffect(() => {
    const channel = supabase
      .channel('assist-manager-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assist_manager_sessions' }, () => {
        queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
        queryClient.invalidateQueries({ queryKey: SESSIONS_KEY });
        queryClient.invalidateQueries({ queryKey: APPROVALS_KEY });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assist_manager_approvals' }, () => {
        queryClient.invalidateQueries({ queryKey: APPROVALS_KEY });
        queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assist_manager_ai_logs' }, () => {
        queryClient.invalidateQueries({ queryKey: AI_LOGS_KEY });
        queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const dashboardQuery = useQuery({
    queryKey: DASHBOARD_KEY,
    queryFn: getAssistManagerDashboard,
    staleTime: 0,
  });

  const sessionsQuery = useQuery({
    queryKey: SESSIONS_KEY,
    queryFn: () => listAssistManagerSessions({ limit: 100 }),
    staleTime: 0,
  });

  const approvalsQuery = useQuery({
    queryKey: APPROVALS_KEY,
    queryFn: getAssistManagerPendingApprovals,
    staleTime: 0,
  });

  const settingsQuery = useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: getAssistManagerSettings,
    staleTime: 0,
  });

  const aiLogsQuery = useQuery({
    queryKey: [...AI_LOGS_KEY, selectedSessionId || 'all'],
    queryFn: () => getAssistManagerAiLogs(selectedSessionId || undefined),
    staleTime: 0,
  });

  const detailQuery = useQuery({
    queryKey: ['assist-manager-detail', selectedSessionId],
    queryFn: () => selectedSessionId ? getAssistManagerSessionDetail(selectedSessionId) : null,
    enabled: Boolean(selectedSessionId),
    staleTime: 0,
  });

  const invalidateAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY }),
      queryClient.invalidateQueries({ queryKey: SESSIONS_KEY }),
      queryClient.invalidateQueries({ queryKey: APPROVALS_KEY }),
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY }),
      queryClient.invalidateQueries({ queryKey: AI_LOGS_KEY }),
      queryClient.invalidateQueries({ queryKey: ['assist-manager-detail'] }),
    ]);
  };

  const createSession = useMutation({
    mutationFn: (input: CreateAssistSessionInput) => createAssistManagerSession(input),
    onSuccess: async (result) => {
      await invalidateAll();
      setSelectedSessionId(result.session.session_id);
      setPermissionTokens((current) => ({
        ...current,
        [result.session.session_id]: result.signaling.permission_token,
      }));
      toast.success('Assist session request created and sent for approval.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to create assist session.'),
  });

  const approveSession = useMutation({
    mutationFn: (input: { session_id: string; decision: 'approved' | 'denied'; reason?: string }) => approveAssistManagerSession(input),
    onSuccess: async (_, variables) => {
      await invalidateAll();
      toast.success(variables.decision === 'approved' ? 'Assist session approved.' : 'Assist session denied.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to process approval.'),
  });

  const startSession = useMutation({
    mutationFn: (input: { session_id: string; permission_token: string }) => startAssistManagerSession(input),
    onSuccess: async (result, variables) => {
      await invalidateAll();
      setSelectedSessionId(variables.session_id);
      toast.success(`Live assist started via ${result.signaling_protocol}.`);
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to start session.'),
  });

  const pauseSession = useMutation({
    mutationFn: (input: { session_id: string; reason?: string }) => pauseAssistManagerSession(input),
    onSuccess: async () => {
      await invalidateAll();
      toast.info('Assist session paused.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to pause session.'),
  });

  const endSession = useMutation({
    mutationFn: (input: { session_id: string; reason?: string }) => endAssistManagerSession(input),
    onSuccess: async () => {
      await invalidateAll();
      toast.success('Assist session ended.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to end session.'),
  });

  const emergencyStop = useMutation({
    mutationFn: (input: { session_id: string; reason?: string }) => emergencyStopAssistManagerSession(input),
    onSuccess: async () => {
      await invalidateAll();
      toast.warning('Emergency stop executed.');
    },
    onError: (error: Error) => toast.error(error.message || 'Emergency stop failed.'),
  });

  const updateSettings = useMutation({
    mutationFn: (settings: Partial<AssistManagerSettings>) => updateAssistManagerSettings(settings),
    onSuccess: async () => {
      await invalidateAll();
      toast.success('Assist Manager settings updated.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to update settings.'),
  });

  const sendControlEvent = useMutation({
    mutationFn: (input: { session_id: string; event_type: string; scope: string; payload?: Record<string, unknown> }) => sendAssistManagerControlEvent(input),
    onError: (error: Error) => toast.error(error.message || 'Control event blocked.'),
  });

  const sendChatMessage = useMutation({
    mutationFn: (input: { session_id: string; message: string; message_type?: 'chat' | 'system' | 'voice_status'; metadata?: Record<string, unknown> }) => sendAssistManagerChat(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['assist-manager-detail', selectedSessionId] });
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to send message.'),
  });

  const metrics = dashboardQuery.data?.metrics || {
    activeSessions: 0,
    pendingRequests: 0,
    approvedSessions: 0,
    blockedSessions: 0,
    aiAssisted: 0,
    securityAlerts: 0,
    totalSessions: 0,
    approvalsToday: 0,
    deniedToday: 0,
  };

  const liveSessions = useMemo(() => (sessionsQuery.data || []).filter((session) => session.status === 'active'), [sessionsQuery.data]);
  const pendingSessions = useMemo(() => (sessionsQuery.data || []).filter((session) => session.status === 'pending'), [sessionsQuery.data]);
  const approvedSessions = useMemo(() => (sessionsQuery.data || []).filter((session) => session.status === 'approved'), [sessionsQuery.data]);
  const blockedSessions = useMemo(() => (sessionsQuery.data || []).filter((session) => session.status === 'blocked' || session.emergency_stopped), [sessionsQuery.data]);

  return {
    metrics,
    dashboard: dashboardQuery.data as AssistDashboardResponse | undefined,
    sessions: sessionsQuery.data || [] as AssistManagerSession[],
    liveSessions,
    pendingSessions,
    approvedSessions,
    blockedSessions,
    approvals: approvalsQuery.data || [] as AssistManagerApproval[],
    settings: settingsQuery.data,
    aiLogs: aiLogsQuery.data || [] as AssistManagerAILog[],
    permissionTokens,
    selectedSessionId,
    setSelectedSessionId,
    sessionDetail: detailQuery.data,
    isLoading: dashboardQuery.isLoading || sessionsQuery.isLoading,
    createSession,
    approveSession,
    startSession,
    pauseSession,
    endSession,
    emergencyStop,
    updateSettings,
    sendControlEvent,
    sendChatMessage,
    refetchAll: invalidateAll,
  };
}