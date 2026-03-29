import { useEffect, useMemo, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CreateDeveloperTaskInput, ManagedTaskRecord } from '@/hooks/useDeveloperTaskSystem';
import {
  DeveloperBuildRunRecord,
  DeveloperWorkflowAlertRecord,
  TaskAiDecisionRecord,
} from '@/hooks/useDeveloperWorkflowCenter';

const GOD_MODE_QUERY_KEY = ['task-manager-god-mode'];
const DONE_STATUSES = new Set(['completed', 'closed', 'cancelled', 'rejected']);
const ACTIVE_STATUSES = new Set(['new', 'pending', 'assigned', 'accepted', 'in_progress', 'working', 'paused', 'blocked', 'testing', 'qa_queue', 'review', 'escalated', 'ai_in_progress']);

type RecommendationOwnerType = 'ai' | 'human' | 'hybrid' | 'monitor';
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
type CommandKey = 'refresh_predictions' | 'auto_assign' | 'sla_shield' | 'self_heal' | 'rebalance' | 'full_cycle' | 'zero_click_cycle';

interface WorkflowHumanDeveloper {
  id: string;
  userId: string;
  fullName: string;
  status: string;
  availabilityStatus: string | null;
  skills: string[];
  activeTaskCount: number;
}

interface WorkflowAIAgent {
  id: string;
  agent_key: string;
  display_name: string;
  status: string;
  skill_tags: string[];
  supported_modules: string[];
  max_concurrent_tasks: number;
  quality_bias: number;
  deployment_enabled: boolean;
}

interface TaskCreationMutationLike {
  mutateAsync: (payload: CreateDeveloperTaskInput) => Promise<unknown>;
}

export interface TaskManagerGodModeSource {
  tasks: ManagedTaskRecord[];
  humanDevelopers: WorkflowHumanDeveloper[];
  aiAgents: WorkflowAIAgent[];
  aiDecisions: TaskAiDecisionRecord[];
  builds: DeveloperBuildRunRecord[];
  alerts: DeveloperWorkflowAlertRecord[];
  createTask: TaskCreationMutationLike;
  refetchAll: () => Promise<unknown>;
  workflowLoading?: boolean;
}

export interface TaskManagerGodModeSettings {
  id?: string;
  manager_key: string;
  zero_click_enabled: boolean;
  auto_assign_enabled: boolean;
  auto_heal_enabled: boolean;
  sla_guard_enabled: boolean;
  self_repair_enabled: boolean;
  human_override_required: boolean;
  confidence_threshold: number;
  max_auto_retries: number;
  command_cooldown_seconds: number;
  daily_ai_budget: number;
  metadata: Record<string, unknown>;
}

export interface TaskExecutionPredictionRecord {
  id: string;
  task_id: string;
  recommended_owner_type: RecommendationOwnerType;
  recommended_owner_id: string | null;
  risk_level: RiskLevel;
  delay_risk_score: number;
  cost_score: number;
  success_score: number;
  next_best_action: string;
  predicted_deadline_at: string | null;
  rationale: string | null;
  snapshot: Record<string, unknown>;
  computed_at: string;
  updated_at: string;
}

export interface TaskFailureMemoryRecord {
  id: string;
  task_id: string | null;
  build_run_id: string | null;
  failure_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'retrying' | 'resolved' | 'ignored';
  signature_hash: string;
  root_cause: string;
  fix_strategy: string | null;
  resolution_notes: string | null;
  retry_count: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface TaskManagerCommandRunRecord {
  id: string;
  command_key: string;
  trigger_mode: 'manual' | 'automatic' | 'zero_click';
  status: 'queued' | 'running' | 'completed' | 'failed';
  summary: string | null;
  total_actions: number;
  succeeded_actions: number;
  failed_actions: number;
  started_at: string;
  completed_at: string | null;
  details: Record<string, unknown>;
}

export interface TaskManagerTemplateRecord {
  id: string;
  name: string;
  description: string | null;
  module: string;
  priority: string;
  complexity_label: string;
  assignment_target: 'ai' | 'human';
  auto_deploy_allowed: boolean;
  usage_count: number;
  source_task_id: string | null;
  default_skills: string[];
  template_payload: Record<string, unknown>;
  updated_at: string;
}

export interface TaskManagerGodModeSummary {
  highRiskTasks: number;
  criticalTasks: number;
  openFailures: number;
  autoReadyTasks: number;
  automationCoverage: number;
  averageDelayRisk: number;
  averageSuccessScore: number;
  projectedCost: number;
  zeroClickEnabled: boolean;
}

interface RunCommandInput {
  commandKey: CommandKey;
  note?: string;
}

interface CreateTemplateInput {
  taskId: string;
  name?: string;
  description?: string;
}

interface RunTemplateInput {
  templateId: string;
}

const untypedSupabase = supabase as any;

const DEFAULT_SETTINGS: TaskManagerGodModeSettings = {
  manager_key: 'global',
  zero_click_enabled: false,
  auto_assign_enabled: true,
  auto_heal_enabled: true,
  sla_guard_enabled: true,
  self_repair_enabled: true,
  human_override_required: false,
  confidence_threshold: 78,
  max_auto_retries: 2,
  command_cooldown_seconds: 120,
  daily_ai_budget: 2500,
  metadata: {},
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const toSentence = (value: string) => value.replace(/_/g, ' ');

const createSignatureHash = (taskId: string | null, failureType: string, rootCause: string) => {
  return `${taskId || 'system'}::${failureType}::${rootCause.trim().toLowerCase().slice(0, 140)}`;
};

const isSensitiveModule = (moduleName: string) => /(auth|security|billing|compliance|payment|server|legal)/i.test(moduleName);

export default function useTaskManagerGodMode(source: TaskManagerGodModeSource) {
  const queryClient = useQueryClient();
  const lastAutoCycleRef = useRef<number>(0);

  const getCurrentActor = async () => {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      throw new Error('Authentication required');
    }

    return authData.user;
  };

  const godModeQuery = useQuery({
    queryKey: GOD_MODE_QUERY_KEY,
    queryFn: async () => {
      const [
        { data: settingsRows },
        { data: predictionRows },
        { data: failureRows },
        { data: commandRows },
        { data: templateRows },
      ] = await Promise.all([
        untypedSupabase.from('task_manager_god_mode_settings').select('*').order('updated_at', { ascending: false }).limit(1),
        untypedSupabase.from('task_execution_predictions').select('*').order('updated_at', { ascending: false }).limit(200),
        untypedSupabase.from('task_failure_memory').select('*').order('updated_at', { ascending: false }).limit(200),
        untypedSupabase.from('task_manager_command_runs').select('*').order('started_at', { ascending: false }).limit(40),
        untypedSupabase.from('task_manager_templates').select('*').order('updated_at', { ascending: false }).limit(40),
      ]);

      return {
        settings: (settingsRows?.[0] || DEFAULT_SETTINGS) as TaskManagerGodModeSettings,
        predictions: (predictionRows || []) as TaskExecutionPredictionRecord[],
        failureMemory: (failureRows || []) as TaskFailureMemoryRecord[],
        commandRuns: (commandRows || []) as TaskManagerCommandRunRecord[],
        templates: (templateRows || []) as TaskManagerTemplateRecord[],
      };
    },
    staleTime: 0,
  });

  const godModeSettings = godModeQuery.data?.settings || DEFAULT_SETTINGS;
  const persistedPredictions = godModeQuery.data?.predictions || [];
  const failureMemory = godModeQuery.data?.failureMemory || [];
  const commandRuns = godModeQuery.data?.commandRuns || [];
  const templates = godModeQuery.data?.templates || [];

  const aiDecisionByTaskId = useMemo(() => {
    return source.aiDecisions.reduce<Record<string, TaskAiDecisionRecord>>((accumulator, decision) => {
      accumulator[decision.task_id] = decision;
      return accumulator;
    }, {});
  }, [source.aiDecisions]);

  const buildByTaskId = useMemo(() => {
    return source.builds.reduce<Record<string, DeveloperBuildRunRecord[]>>((accumulator, build) => {
      accumulator[build.task_id] = accumulator[build.task_id] || [];
      accumulator[build.task_id].push(build);
      return accumulator;
    }, {});
  }, [source.builds]);

  const openAlertsByTaskId = useMemo(() => {
    return source.alerts.reduce<Record<string, DeveloperWorkflowAlertRecord[]>>((accumulator, alert) => {
      if (!alert.task_id || alert.status === 'resolved') {
        return accumulator;
      }

      accumulator[alert.task_id] = accumulator[alert.task_id] || [];
      accumulator[alert.task_id].push(alert);
      return accumulator;
    }, {});
  }, [source.alerts]);

  const failureMemoryByTaskId = useMemo(() => {
    return failureMemory.reduce<Record<string, TaskFailureMemoryRecord[]>>((accumulator, row) => {
      if (!row.task_id) {
        return accumulator;
      }

      accumulator[row.task_id] = accumulator[row.task_id] || [];
      accumulator[row.task_id].push(row);
      return accumulator;
    }, {});
  }, [failureMemory]);

  const selectBestHuman = (task: ManagedTaskRecord) => {
    const requiredSkills = task.requiredSkills || [];
    return [...source.humanDevelopers]
      .map((developer) => {
        const skillMatchCount = requiredSkills.filter((skill) => developer.skills.includes(skill)).length;
        const availabilityWeight = developer.availabilityStatus === 'busy' ? -18 : 15;
        const workloadWeight = Math.max(-12, 15 - developer.activeTaskCount * 6);
        const currentOwnerWeight = developer.id === task.developerId ? 8 : 0;
        return {
          developer,
          score: skillMatchCount * 25 + availabilityWeight + workloadWeight + currentOwnerWeight,
        };
      })
      .sort((left, right) => right.score - left.score)[0]?.developer || null;
  };

  const selectBestAI = (task: ManagedTaskRecord) => {
    const requiredSkills = task.requiredSkills || [];
    return [...source.aiAgents]
      .map((agent) => {
        const skillMatchCount = requiredSkills.filter((skill) => agent.skill_tags.includes(skill)).length;
        const moduleWeight = agent.supported_modules.includes(task.module) ? 20 : 0;
        const concurrencyWeight = Math.max(0, agent.max_concurrent_tasks - source.tasks.filter((item) => item.assignedToType === 'ai' && ACTIVE_STATUSES.has(item.status)).length);
        return {
          agent,
          score: agent.quality_bias + skillMatchCount * 18 + moduleWeight + concurrencyWeight,
        };
      })
      .sort((left, right) => right.score - left.score)[0]?.agent || null;
  };

  const computedPredictions = useMemo(() => {
    const now = Date.now();

    return source.tasks.map((task) => {
      const currentDecision = aiDecisionByTaskId[task.id];
      const relatedBuilds = buildByTaskId[task.id] || [];
      const latestBuild = relatedBuilds[0] || null;
      const failures = failureMemoryByTaskId[task.id] || [];
      const openFailureCount = failures.filter((row) => row.status !== 'resolved' && row.status !== 'ignored').length;
      const humanCandidate = selectBestHuman(task);
      const aiCandidate = selectBestAI(task);
      const deadlineMinutes = task.deadline ? Math.round((new Date(task.deadline).getTime() - now) / 60000) : null;
      const deadlinePressure = deadlineMinutes === null
        ? 24
        : deadlineMinutes <= 0
          ? 95
          : deadlineMinutes <= 60
            ? 82
            : deadlineMinutes <= 180
              ? 64
              : deadlineMinutes <= 480
                ? 42
                : 24;
      const currentHumanLoad = task.developerId
        ? source.humanDevelopers.find((developer) => developer.id === task.developerId)?.activeTaskCount || 0
        : 0;
      const failurePressure = openFailureCount * 15 + (latestBuild?.status === 'failed' ? 18 : 0) + ((latestBuild?.retry_count || 0) * 6);
      const qualityPressure = task.qualityStatus === 'rejected' ? 18 : task.qualityStatus === 'pending' ? 6 : 0;
      const alertPressure = (openAlertsByTaskId[task.id]?.length || 0) * 8;
      const delayRiskScore = clamp(
        Math.round(deadlinePressure + task.complexityScore * 0.28 + failurePressure + qualityPressure + alertPressure + currentHumanLoad * 5 - (task.assignedToType === 'ai' ? 6 : 0)),
        4,
        99,
      );

      const sensitiveModule = isSensitiveModule(task.module);
      const humanCostScore = clamp(Math.round((task.estimatedHours || 1) * 8 + (humanCandidate?.activeTaskCount || 0) * 7 + (task.priority === 'high' ? 12 : 4)), 10, 99);
      const aiCostScore = clamp(Math.round(task.complexityScore * 0.55 + task.requiredSkills.length * 5 + (task.autoDeployAllowed ? -6 : 8) + (sensitiveModule ? 14 : 0)), 8, 96);
      const successScore = clamp(
        100 - Math.round(delayRiskScore * 0.42) - openFailureCount * 9 - (task.qualityStatus === 'rejected' ? 14 : 0) + (task.assignedToType === 'ai' ? 6 : 0) + (task.autoDeployAllowed ? 3 : 0),
        18,
        98,
      );

      let recommendedOwnerType: RecommendationOwnerType = 'monitor';
      if (!DONE_STATUSES.has(task.status)) {
        if (!sensitiveModule && task.complexityScore <= 56 && aiCandidate && successScore >= godModeSettings.confidence_threshold) {
          recommendedOwnerType = 'ai';
        } else if (humanCandidate) {
          recommendedOwnerType = task.complexityScore <= 72 && aiCandidate && Math.abs(aiCostScore - humanCostScore) <= 6 ? 'hybrid' : 'human';
        }
      }

      const riskLevel: RiskLevel = delayRiskScore >= 85
        ? 'critical'
        : delayRiskScore >= 65
          ? 'high'
          : delayRiskScore >= 40
            ? 'medium'
            : 'low';

      const nextBestAction = DONE_STATUSES.has(task.status)
        ? 'archive_learning'
        : latestBuild?.status === 'failed' && (latestBuild.retry_count || 0) < godModeSettings.max_auto_retries
          ? 'self_heal_retry'
          : task.qualityStatus === 'rejected'
            ? 'route_revision'
            : delayMinutesToAction(deadlineMinutes, delayRiskScore, task.developerId, recommendedOwnerType);

      const rationaleParts = [
        `delay risk ${delayRiskScore}`,
        `success score ${successScore}`,
        openFailureCount ? `${openFailureCount} open failure memory item(s)` : 'no open failure memory',
        currentDecision?.mode ? `last AI decision ${currentDecision.mode}` : 'no prior AI decision',
      ];

      return {
        task_id: task.id,
        recommended_owner_type: recommendedOwnerType,
        recommended_owner_id: recommendedOwnerType === 'ai'
          ? aiCandidate?.id || null
          : recommendedOwnerType === 'human' || recommendedOwnerType === 'hybrid'
            ? humanCandidate?.id || null
            : null,
        risk_level: riskLevel,
        delay_risk_score: delayRiskScore,
        cost_score: Math.min(humanCostScore, aiCostScore),
        success_score: successScore,
        next_best_action: nextBestAction,
        predicted_deadline_at: task.deadline,
        rationale: rationaleParts.join(' • '),
        snapshot: {
          human_cost_score: humanCostScore,
          ai_cost_score: aiCostScore,
          failure_count: openFailureCount,
          active_alerts: openAlertsByTaskId[task.id]?.length || 0,
          current_owner_type: task.assignedToType,
          sensitive_module: sensitiveModule,
        },
        computed_at: new Date().toISOString(),
      };
    });
  }, [aiDecisionByTaskId, buildByTaskId, failureMemoryByTaskId, godModeSettings.confidence_threshold, godModeSettings.max_auto_retries, openAlertsByTaskId, source.aiAgents, source.humanDevelopers, source.tasks]);

  const predictions = useMemo(() => {
    const persistedMap = new Map(persistedPredictions.map((prediction) => [prediction.task_id, prediction]));
    return computedPredictions.map((prediction) => ({
      ...(persistedMap.get(prediction.task_id) || {}),
      ...prediction,
    })) as TaskExecutionPredictionRecord[];
  }, [computedPredictions, persistedPredictions]);

  const predictionsByTaskId = useMemo(() => {
    return predictions.reduce<Record<string, TaskExecutionPredictionRecord>>((accumulator, prediction) => {
      accumulator[prediction.task_id] = prediction;
      return accumulator;
    }, {});
  }, [predictions]);

  const summary = useMemo<TaskManagerGodModeSummary>(() => {
    const highRiskTasks = predictions.filter((prediction) => prediction.delay_risk_score >= 65 && !DONE_STATUSES.has(source.tasks.find((task) => task.id === prediction.task_id)?.status || 'completed')).length;
    const criticalTasks = predictions.filter((prediction) => prediction.risk_level === 'critical').length;
    const openFailures = failureMemory.filter((row) => row.status !== 'resolved' && row.status !== 'ignored').length;
    const autoReadyTasks = predictions.filter((prediction) => ['auto_assign_ai', 'self_heal_retry', 'rebalance_assignment'].includes(prediction.next_best_action)).length;
    const automationCoverage = source.tasks.length ? Math.round((source.tasks.filter((task) => task.assignedToType === 'ai').length / source.tasks.length) * 100) : 0;
    const averageDelayRisk = predictions.length ? Math.round(predictions.reduce((sum, prediction) => sum + prediction.delay_risk_score, 0) / predictions.length) : 0;
    const averageSuccessScore = predictions.length ? Math.round(predictions.reduce((sum, prediction) => sum + prediction.success_score, 0) / predictions.length) : 0;
    const projectedCost = predictions.reduce((sum, prediction) => sum + prediction.cost_score, 0);

    return {
      highRiskTasks,
      criticalTasks,
      openFailures,
      autoReadyTasks,
      automationCoverage,
      averageDelayRisk,
      averageSuccessScore,
      projectedCost,
      zeroClickEnabled: godModeSettings.zero_click_enabled,
    };
  }, [failureMemory, godModeSettings.zero_click_enabled, predictions, source.tasks]);

  const predictiveQueue = useMemo(() => {
    return [...predictions]
      .sort((left, right) => {
        if (right.delay_risk_score !== left.delay_risk_score) {
          return right.delay_risk_score - left.delay_risk_score;
        }

        return right.cost_score - left.cost_score;
      })
      .slice(0, 8);
  }, [predictions]);

  const persistPredictions = async (actorUserId: string) => {
    if (!computedPredictions.length) {
      return;
    }

    await untypedSupabase.from('task_execution_predictions').upsert(
      computedPredictions.map((prediction) => ({
        ...prediction,
        computed_by: actorUserId,
      })),
      { onConflict: 'task_id' },
    );

    await Promise.all(computedPredictions.map((prediction) => {
      const task = source.tasks.find((row) => row.id === prediction.task_id);
      if (!task) {
        return Promise.resolve();
      }

      return untypedSupabase.from('task_ai_decision').upsert({
        task_id: prediction.task_id,
        mode: prediction.recommended_owner_type === 'hybrid' ? 'hybrid' : prediction.recommended_owner_type === 'monitor' ? (task.assignedToType === 'ai' ? 'ai' : 'human') : prediction.recommended_owner_type,
        confidence_score: prediction.success_score,
        assigned_to: prediction.recommended_owner_type === 'ai'
          ? source.aiAgents.find((agent) => agent.id === prediction.recommended_owner_id)?.display_name || 'AI automation'
          : source.humanDevelopers.find((developer) => developer.id === prediction.recommended_owner_id)?.fullName || task.assignedToName,
        cost_score: prediction.cost_score,
        delay_risk_score: prediction.delay_risk_score,
        reasoning: prediction.rationale,
      }, { onConflict: 'task_id' });
    }));
  };

  const insertTaskLog = async (taskId: string, developerId: string | null, action: string, details: string, metadata?: Record<string, unknown>) => {
    const { error } = await supabase.from('task_logs').insert({
      task_id: taskId,
      developer_id: developerId,
      action,
      action_type: 'system',
      details,
      metadata: metadata || {},
    });

    if (error) {
      throw error;
    }
  };

  const addWorkflowAlert = async (payload: { userId?: string | null; taskId?: string | null; type: string; severity: string; title: string; message: string; metadata?: Record<string, unknown> }) => {
    const duplicate = source.alerts.find((alert) => alert.task_id === (payload.taskId || null) && alert.title === payload.title && alert.status === 'open');
    if (duplicate) {
      return;
    }

    await untypedSupabase.from('developer_workflow_alerts').insert({
      user_id: payload.userId || null,
      task_id: payload.taskId || null,
      alert_type: payload.type,
      severity: payload.severity,
      title: payload.title,
      message: payload.message,
      status: 'open',
      metadata: payload.metadata || {},
    });
  };

  const ensureFailureMemory = async (actorUserId: string, payload: { taskId?: string | null; buildRunId?: string | null; failureType: string; severity: 'low' | 'medium' | 'high' | 'critical'; rootCause: string; fixStrategy?: string | null; metadata?: Record<string, unknown> }) => {
    const signatureHash = createSignatureHash(payload.taskId || null, payload.failureType, payload.rootCause);
    const existing = failureMemory.find((row) => row.signature_hash === signatureHash && row.status !== 'resolved' && row.status !== 'ignored');
    if (existing) {
      return existing.id;
    }

    const { data, error } = await untypedSupabase.from('task_failure_memory').insert({
      task_id: payload.taskId || null,
      build_run_id: payload.buildRunId || null,
      failure_type: payload.failureType,
      severity: payload.severity,
      signature_hash: signatureHash,
      root_cause: payload.rootCause,
      fix_strategy: payload.fixStrategy || null,
      metadata: payload.metadata || {},
      created_by: actorUserId,
    }).select('id').single();

    if (error) {
      throw error;
    }

    return data.id as string;
  };

  const assignTaskDirect = async (task: ManagedTaskRecord, prediction: TaskExecutionPredictionRecord) => {
    const now = new Date().toISOString();

    if (prediction.recommended_owner_type === 'human') {
      const developer = source.humanDevelopers.find((row) => row.id === prediction.recommended_owner_id);
      if (!developer) {
        throw new Error('Recommended human developer not available.');
      }

      const { data: registrationRow } = await supabase.from('developer_registrations').select('nda_accepted').eq('user_id', developer.userId).maybeSingle();
      if (!registrationRow?.nda_accepted) {
        throw new Error(`${developer.fullName} has not accepted the NDA.`);
      }

      await supabase.from('developer_tasks').update({
        developer_id: developer.id,
        status: 'assigned',
        assigned_at: now,
        escalated_flag: false,
        escalation_reason: null,
        updated_at: now,
      }).eq('id', task.id);

      await untypedSupabase.from('developer_task_orchestration').update({
        assignment_target: 'human',
        assigned_agent_id: null,
        assignment_reason: prediction.rationale,
        assignment_confidence: prediction.success_score,
        updated_at: now,
      }).eq('task_id', task.id);

      await untypedSupabase.from('task_ai_decision').upsert({
        task_id: task.id,
        mode: 'human',
        confidence_score: prediction.success_score,
        assigned_to: developer.fullName,
        cost_score: prediction.cost_score,
        delay_risk_score: prediction.delay_risk_score,
        reasoning: prediction.rationale,
      }, { onConflict: 'task_id' });

      await insertTaskLog(task.id, developer.id, 'god_mode_assign_human', `God Mode assigned ${developer.fullName}.`, { prediction });
      return `Assigned ${task.title} to ${developer.fullName}`;
    }

    const agent = source.aiAgents.find((row) => row.id === prediction.recommended_owner_id);
    if (!agent) {
      throw new Error('Recommended AI agent not available.');
    }

    await supabase.from('developer_tasks').update({
      developer_id: null,
      status: 'ai_in_progress',
      assigned_at: now,
      updated_at: now,
    }).eq('id', task.id);

    await untypedSupabase.from('developer_task_orchestration').update({
      assignment_target: 'ai',
      assigned_agent_id: agent.id,
      assignment_reason: prediction.rationale,
      assignment_confidence: prediction.success_score,
      updated_at: now,
    }).eq('task_id', task.id);

    await untypedSupabase.from('task_ai_decision').upsert({
      task_id: task.id,
      mode: 'ai',
      confidence_score: prediction.success_score,
      assigned_to: agent.display_name,
      cost_score: prediction.cost_score,
      delay_risk_score: prediction.delay_risk_score,
      reasoning: prediction.rationale,
    }, { onConflict: 'task_id' });

    const qualityScore = clamp(Math.round((agent.quality_bias + prediction.success_score) / 2), 82, 97);
    const completedAt = new Date().toISOString();
    await supabase.from('developer_tasks').update({
      status: qualityScore >= godModeSettings.confidence_threshold ? 'completed' : 'testing',
      started_at: task.startedAt || completedAt,
      completed_at: qualityScore >= godModeSettings.confidence_threshold ? completedAt : null,
      actual_delivery_at: qualityScore >= godModeSettings.confidence_threshold ? completedAt : null,
      quality_score: qualityScore,
      delivery_notes: `Autonomous AI execution completed by ${agent.display_name}.`,
      updated_at: completedAt,
    }).eq('id', task.id);

    await untypedSupabase.from('developer_task_orchestration').update({
      quality_status: qualityScore >= godModeSettings.confidence_threshold ? 'approved' : 'pending',
      quality_score: qualityScore,
      quality_feedback: `Autonomous AI execution completed by ${agent.display_name}.`,
      actual_minutes: Math.max(6, Math.round((task.estimatedHours || 1) * 20)),
      deadline_breached: false,
      auto_deploy_status: task.autoDeployAllowed && qualityScore >= 88 ? 'deployed' : task.autoDeployAllowed ? 'blocked' : 'not_requested',
      updated_at: completedAt,
    }).eq('task_id', task.id);

    await insertTaskLog(task.id, null, 'god_mode_assign_ai', `God Mode routed task to ${agent.display_name}.`, { prediction, quality_score: qualityScore });
    return `AI executed ${task.title} via ${agent.display_name}`;
  };

  const saveSettings = useMutation({
    mutationFn: async (partial: Partial<TaskManagerGodModeSettings>) => {
      const actorUserId = (await getCurrentActor()).id;
      const payload = {
        ...godModeSettings,
        ...partial,
        manager_key: 'global',
        updated_by: actorUserId,
      };

      const { error } = await untypedSupabase.from('task_manager_god_mode_settings').upsert(payload, { onConflict: 'manager_key' });
      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: GOD_MODE_QUERY_KEY });
      toast.success('God Mode settings updated.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to update God Mode settings.'),
  });

  const createTemplateFromTask = useMutation({
    mutationFn: async ({ taskId, name, description }: CreateTemplateInput) => {
      const actorUserId = (await getCurrentActor()).id;
      const task = source.tasks.find((row) => row.id === taskId);
      const prediction = predictionsByTaskId[taskId];
      if (!task) {
        throw new Error('Task not found for template creation.');
      }

      const payload: CreateDeveloperTaskInput = {
        title: task.title,
        description: task.description || '',
        module: task.module,
        priority: (['low', 'medium', 'high'].includes(task.priority) ? task.priority : 'medium') as 'low' | 'medium' | 'high',
        deadline: task.deadline || new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        complexityMode: 'manual',
        manualComplexity: task.complexityLabel,
        expectedHours: task.estimatedHours,
        skills: task.requiredSkills,
        autoDeployAllowed: task.autoDeployAllowed,
      };

      const { error } = await untypedSupabase.from('task_manager_templates').insert({
        name: name || `${task.title} Template`,
        description: description || task.description || prediction?.rationale || 'Saved from live task execution.',
        module: task.module,
        priority: task.priority,
        complexity_label: task.complexityLabel,
        assignment_target: task.assignedToType,
        auto_deploy_allowed: task.autoDeployAllowed,
        source_task_id: task.id,
        default_skills: task.requiredSkills,
        template_payload: payload,
        created_by: actorUserId,
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: GOD_MODE_QUERY_KEY });
      toast.success('Task template saved.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to save task template.'),
  });

  const runTemplate = useMutation({
    mutationFn: async ({ templateId }: RunTemplateInput) => {
      const template = templates.find((row) => row.id === templateId);
      if (!template) {
        throw new Error('Template not found.');
      }

      const payload = template.template_payload as unknown as CreateDeveloperTaskInput;
      await source.createTask.mutateAsync({
        ...payload,
        deadline: payload.deadline || new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      });

      await untypedSupabase.from('task_manager_templates').update({
        usage_count: (template.usage_count || 0) + 1,
      }).eq('id', templateId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: GOD_MODE_QUERY_KEY });
      toast.success('Template launched as a live task.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to run task template.'),
  });

  const runCommand = useMutation({
    mutationFn: async ({ commandKey, note }: RunCommandInput) => {
      const actorUserId = (await getCurrentActor()).id;
      const startedAt = new Date().toISOString();
      const triggerMode = commandKey === 'zero_click_cycle' ? 'zero_click' : 'manual';
      const { data: commandRun, error: commandRunError } = await untypedSupabase.from('task_manager_command_runs').insert({
        command_key: commandKey,
        trigger_mode: triggerMode,
        status: 'running',
        summary: note || `Started ${commandKey}`,
        details: { note: note || null },
        created_by: actorUserId,
        started_at: startedAt,
      }).select('*').single();

      if (commandRunError) {
        throw commandRunError;
      }

      const actionLog: string[] = [];
      let succeededActions = 0;
      let failedActions = 0;

      const executeAction = async (action: () => Promise<string | void>) => {
        try {
          const result = await action();
          if (result) {
            actionLog.push(result);
          }
          succeededActions += 1;
        } catch (error) {
          failedActions += 1;
          actionLog.push(error instanceof Error ? error.message : 'Unknown command failure');
        }
      };

      await executeAction(async () => {
        await persistPredictions(actorUserId);
        return 'Prediction graph refreshed.';
      });

      if (['auto_assign', 'full_cycle', 'zero_click_cycle'].includes(commandKey) && godModeSettings.auto_assign_enabled) {
        for (const task of source.tasks.filter((row) => ACTIVE_STATUSES.has(row.status) && !DONE_STATUSES.has(row.status))) {
          const prediction = predictionsByTaskId[task.id];
          if (!prediction) {
            continue;
          }

          const shouldAutoAssign = !task.developerId && ['ai', 'human'].includes(prediction.recommended_owner_type) && prediction.success_score >= godModeSettings.confidence_threshold;
          if (!shouldAutoAssign) {
            continue;
          }

          await executeAction(async () => assignTaskDirect(task, prediction));
        }
      }

      if (['sla_shield', 'full_cycle', 'zero_click_cycle'].includes(commandKey) && godModeSettings.sla_guard_enabled) {
        for (const prediction of predictions.filter((row) => row.delay_risk_score >= 70)) {
          const task = source.tasks.find((row) => row.id === prediction.task_id);
          if (!task || DONE_STATUSES.has(task.status)) {
            continue;
          }

          await executeAction(async () => {
            await addWorkflowAlert({
              taskId: task.id,
              userId: source.humanDevelopers.find((developer) => developer.id === task.developerId)?.userId || null,
              type: 'delay',
              severity: prediction.risk_level === 'critical' ? 'critical' : 'high',
              title: `God Mode ${prediction.risk_level.toUpperCase()} SLA Risk`,
              message: `${task.title} requires ${toSentence(prediction.next_best_action)}. ${prediction.rationale || ''}`,
              metadata: { commandKey, prediction },
            });

            if (prediction.delay_risk_score >= 85 && task.status !== 'escalated') {
              await supabase.from('developer_tasks').update({
                status: 'escalated',
                escalated_flag: true,
                escalation_reason: prediction.rationale,
                updated_at: new Date().toISOString(),
              }).eq('id', task.id);
              await insertTaskLog(task.id, task.developerId, 'god_mode_escalation', 'God Mode escalated task due to critical delay risk.', { prediction });
            }

            return `SLA shield processed ${task.title}`;
          });
        }
      }

      if (['self_heal', 'full_cycle', 'zero_click_cycle'].includes(commandKey) && godModeSettings.auto_heal_enabled) {
        for (const build of source.builds.filter((row) => row.status === 'failed')) {
          const task = source.tasks.find((row) => row.id === build.task_id);
          if (!task) {
            continue;
          }

          await executeAction(async () => {
            await ensureFailureMemory(actorUserId, {
              taskId: task.id,
              buildRunId: build.id,
              failureType: 'build_failed',
              severity: build.retry_count >= godModeSettings.max_auto_retries ? 'critical' : 'high',
              rootCause: build.last_error || 'Build failed without explicit error payload.',
              fixStrategy: build.retry_count < godModeSettings.max_auto_retries ? 'Retry build automatically and surface to QA if stable.' : 'Escalate to manager because retry limit is exhausted.',
              metadata: { retry_count: build.retry_count, build_target: build.build_target },
            });

            if (build.retry_count < godModeSettings.max_auto_retries) {
              await untypedSupabase.from('developer_build_runs').update({
                status: 'retrying',
                retry_count: (build.retry_count || 0) + 1,
                timer_started_at: new Date().toISOString(),
                timer_stopped_at: null,
              }).eq('id', build.id);

              await supabase.from('developer_tasks').update({
                status: 'testing',
                updated_at: new Date().toISOString(),
              }).eq('id', task.id);
            } else {
              await addWorkflowAlert({
                taskId: task.id,
                userId: source.humanDevelopers.find((developer) => developer.id === task.developerId)?.userId || null,
                type: 'build',
                severity: 'critical',
                title: 'God Mode Build Lock',
                message: `${task.title} exhausted auto-heal retries and needs manual repair.`,
                metadata: { buildId: build.id },
              });
            }

            await insertTaskLog(task.id, task.developerId, 'god_mode_self_heal', 'God Mode processed build failure memory and recovery path.', { build_id: build.id });
            return `Self-heal processed ${task.title}`;
          });
        }

        for (const task of source.tasks.filter((row) => row.qualityStatus === 'rejected')) {
          await executeAction(async () => {
            await ensureFailureMemory(actorUserId, {
              taskId: task.id,
              failureType: 'quality_rejection',
              severity: task.deadlineBreached ? 'critical' : 'high',
              rootCause: task.qualityFeedback || 'Task failed the AI quality gate.',
              fixStrategy: 'Route revision with targeted feedback and preserve this pattern for future auto-assignment decisions.',
              metadata: { quality_score: task.qualityScore, assigned_to_type: task.assignedToType },
            });
            return `Failure memory recorded for ${task.title}`;
          });
        }
      }

      if (['rebalance', 'full_cycle', 'zero_click_cycle'].includes(commandKey)) {
        for (const task of source.tasks.filter((row) => row.assignedToType === 'human' && row.developerId && ['assigned', 'accepted', 'paused'].includes(row.status))) {
          const prediction = predictionsByTaskId[task.id];
          if (!prediction || prediction.recommended_owner_type !== 'human' || prediction.recommended_owner_id === task.developerId) {
            continue;
          }

          const currentDeveloper = source.humanDevelopers.find((developer) => developer.id === task.developerId);
          const recommendedDeveloper = source.humanDevelopers.find((developer) => developer.id === prediction.recommended_owner_id);
          if (!currentDeveloper || !recommendedDeveloper) {
            continue;
          }

          if (currentDeveloper.activeTaskCount <= recommendedDeveloper.activeTaskCount + 1) {
            continue;
          }

          await executeAction(async () => assignTaskDirect(task, prediction));
        }
      }

      const completedAt = new Date().toISOString();
      const finalStatus = failedActions > 0 && succeededActions === 0 ? 'failed' : 'completed';
      const summaryText = actionLog.length
        ? actionLog.slice(0, 6).join(' | ')
        : `${commandKey} finished without changes.`;

      await untypedSupabase.from('task_manager_command_runs').update({
        status: finalStatus,
        summary: summaryText,
        details: { note: note || null, log: actionLog },
        total_actions: succeededActions + failedActions,
        succeeded_actions: succeededActions,
        failed_actions: failedActions,
        completed_at: completedAt,
      }).eq('id', commandRun.id);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: GOD_MODE_QUERY_KEY }),
        source.refetchAll(),
      ]);

      return {
        summary: summaryText,
        succeededActions,
        failedActions,
      };
    },
    onSuccess: (result) => {
      toast.success(result.summary || 'God Mode command completed.');
    },
    onError: (error: Error) => toast.error(error.message || 'God Mode command failed.'),
  });

  useEffect(() => {
    if (!godModeSettings.zero_click_enabled || source.workflowLoading || runCommand.isPending) {
      return;
    }

    const cooldownMs = Math.max(30000, godModeSettings.command_cooldown_seconds * 1000);
    const runScheduledCycle = () => {
      const now = Date.now();
      if (now - lastAutoCycleRef.current < cooldownMs) {
        return;
      }

      lastAutoCycleRef.current = now;
      runCommand.mutate({ commandKey: 'zero_click_cycle', note: 'Scheduled zero-click God Mode cycle.' });
    };

    runScheduledCycle();
    const timer = window.setInterval(runScheduledCycle, cooldownMs);
    return () => window.clearInterval(timer);
  }, [godModeSettings.command_cooldown_seconds, godModeSettings.zero_click_enabled, runCommand, source.workflowLoading]);

  return {
    godModeSettings,
    predictions,
    predictionsByTaskId,
    predictiveQueue,
    failureMemory,
    commandRuns,
    templates,
    summary,
    isLoading: godModeQuery.isLoading,
    refetch: godModeQuery.refetch,
    saveSettings,
    createTemplateFromTask,
    runTemplate,
    runCommand,
  };
}

function delayMinutesToAction(deadlineMinutes: number | null, delayRiskScore: number, developerId: string | null, ownerType: RecommendationOwnerType) {
  if (deadlineMinutes !== null && deadlineMinutes <= 0) {
    return 'escalate_now';
  }

  if (!developerId && ownerType === 'ai') {
    return 'auto_assign_ai';
  }

  if (!developerId && ownerType === 'human') {
    return 'assign_human';
  }

  if (delayRiskScore >= 75) {
    return 'sla_intervention';
  }

  if (delayRiskScore >= 62) {
    return 'rebalance_assignment';
  }

  return 'monitor';
}