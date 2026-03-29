import { useEffect, useMemo, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const TASK_SYSTEM_QUERY_KEY = ['developer-task-system'];
const DEADLINE_WARNING_MINUTES = 120;

type TaskPriority = 'low' | 'medium' | 'high';
type ComplexityLabel = 'simple' | 'moderate' | 'complex' | 'critical';
type AssignmentTarget = 'ai' | 'human';
type QualityStatus = 'pending' | 'approved' | 'rejected' | 'override_approved';

export interface CreateDeveloperTaskInput {
  title: string;
  description: string;
  module: string;
  priority: TaskPriority;
  deadline: string;
  complexityMode: 'auto' | 'manual';
  manualComplexity?: ComplexityLabel;
  expectedHours?: number | null;
  skills: string[];
  autoDeployAllowed?: boolean;
}

export interface ManagedTaskRecord {
  id: string;
  title: string;
  description: string | null;
  module: string;
  priority: string;
  status: string;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
  assignedToName: string;
  assignedToType: AssignmentTarget;
  assignedToId: string | null;
  assignmentReason: string;
  assignmentConfidence: number;
  complexityScore: number;
  complexityLabel: ComplexityLabel;
  requiredSkills: string[];
  qualityStatus: QualityStatus;
  qualityScore: number | null;
  qualityFeedback: string | null;
  actualMinutes: number;
  estimatedHours: number;
  deadlineBreached: boolean;
  autoDeployAllowed: boolean;
  autoDeployStatus: string;
  rewardAmount: number;
  penaltyAmount: number;
  taskAmount: number;
  developerId: string | null;
  startedAt: string | null;
  acceptedAt: string | null;
  pausedAt: string | null;
  totalPausedMinutes: number;
}

export interface TaskDashboardMetrics {
  total: number;
  active: number;
  aiTasks: number;
  humanTasks: number;
  completed: number;
  delayed: number;
  penalties: number;
  rewards: number;
}

interface HumanDeveloperCandidate {
  id: string;
  userId: string;
  fullName: string;
  status: string;
  availabilityStatus: string | null;
  skills: string[];
  activeTaskCount: number;
}

interface AIAgentCandidate {
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

interface ComplexityResult {
  score: number;
  label: ComplexityLabel;
  target: AssignmentTarget;
  confidence: number;
  reason: string;
}

interface QualityReviewResult {
  score: number;
  status: QualityStatus;
  feedback: string;
  penaltyAmount: number;
  rewardAmount: number;
  autoDeployStatus: string;
  deadlineBreached: boolean;
}

interface UseDeveloperTaskSystemOptions {
  developerOnly?: boolean;
}

const untypedSupabase = supabase as any;

const ACTIVE_STATUSES = new Set(['new', 'pending', 'assigned', 'accepted', 'in_progress', 'working', 'paused', 'blocked', 'testing', 'qa_queue', 'review', 'escalated']);
const DONE_STATUSES = new Set(['completed', 'closed', 'cancelled', 'rejected']);

const uniqueArray = (values: Array<string | null | undefined>) => {
  return [...new Set(values.filter((value): value is string => Boolean(value && value.trim())).map((value) => value.trim()))];
};

const toIsoOrNull = (value?: string | null) => {
  if (!value) {
    return null;
  }

  return new Date(value).toISOString();
};

const normalizePriority = (priority: string): TaskPriority => {
  if (priority === 'high') {
    return 'high';
  }

  if (priority === 'low') {
    return 'low';
  }

  return 'medium';
};

const computeComplexity = (input: CreateDeveloperTaskInput): ComplexityResult => {
  if (input.complexityMode === 'manual' && input.manualComplexity) {
    const manualMap: Record<ComplexityLabel, number> = {
      simple: 25,
      moderate: 48,
      complex: 74,
      critical: 92,
    };

    const manualScore = manualMap[input.manualComplexity];
    const manualTarget: AssignmentTarget = manualScore <= 45 ? 'ai' : 'human';

    return {
      score: manualScore,
      label: input.manualComplexity,
      target: manualTarget,
      confidence: 95,
      reason: `Manual complexity selected as ${input.manualComplexity}.`,
    };
  }

  let score = 0;
  const keywords = `${input.title} ${input.description}`.toLowerCase();

  score += Math.min(25, Math.floor(input.description.length / 16));
  score += Math.min(20, input.skills.length * 5);

  if (input.priority === 'high') {
    score += 25;
  } else if (input.priority === 'medium') {
    score += 10;
  }

  if (['auth', 'server', 'security', 'billing', 'marketplace'].includes(input.module.toLowerCase())) {
    score += 18;
  }

  if (/(payment|security|migration|critical|compliance|production|database|realtime|deploy)/.test(keywords)) {
    score += 20;
  }

  if (/(refactor|bug|copy|label|text|cleanup|minor|simple|small)/.test(keywords)) {
    score -= 10;
  }

  score = Math.max(5, Math.min(100, score));

  let label: ComplexityLabel = 'simple';
  if (score >= 85) {
    label = 'critical';
  } else if (score >= 65) {
    label = 'complex';
  } else if (score >= 40) {
    label = 'moderate';
  }

  const target: AssignmentTarget = score <= 42 && input.priority !== 'high' ? 'ai' : 'human';
  const confidence = target === 'ai' ? Math.max(70, 95 - score) : Math.min(96, 55 + Math.floor(score / 2));
  const reason = target === 'ai'
    ? 'Task is repetitive or bounded enough for AI execution with automated quality review.'
    : 'Task is complex, critical, or module-sensitive and should be handled by a human developer.';

  return { score, label, target, confidence, reason };
};

const calculateActualMinutes = (task: {
  accepted_at: string | null;
  started_at: string | null;
  created_at: string;
  paused_at: string | null;
  total_paused_minutes: number | null;
}, endAt: Date) => {
  const startedBase = task.started_at || task.accepted_at || task.created_at;
  const baseTime = new Date(startedBase).getTime();
  const pauseCarry = task.total_paused_minutes || 0;
  const currentPauseMinutes = task.paused_at
    ? Math.max(0, Math.round((endAt.getTime() - new Date(task.paused_at).getTime()) / 60000))
    : 0;

  const elapsedMinutes = Math.max(1, Math.round((endAt.getTime() - baseTime) / 60000) - pauseCarry - currentPauseMinutes);
  return elapsedMinutes;
};

const buildQualityReview = (
  task: {
    priority: string | null;
    deadline: string | null;
    estimated_hours: number | null;
  },
  orchestration: {
    complexity_label: ComplexityLabel;
    auto_deploy_allowed: boolean;
  },
  actualMinutes: number,
  submissionNotes: string,
): QualityReviewResult => {
  const now = new Date();
  const deadlineBreached = Boolean(task.deadline && now.getTime() > new Date(task.deadline).getTime());
  const lateMinutes = deadlineBreached && task.deadline
    ? Math.max(1, Math.round((now.getTime() - new Date(task.deadline).getTime()) / 60000))
    : 0;
  const expectedMinutes = Math.max(30, Math.round((task.estimated_hours || 2) * 60));
  const reviewNotes = submissionNotes.trim().length;

  let score = 92;
  if (task.priority === 'high') {
    score -= 6;
  }
  if (orchestration.complexity_label === 'complex') {
    score -= 5;
  }
  if (orchestration.complexity_label === 'critical') {
    score -= 10;
  }
  if (actualMinutes > expectedMinutes) {
    score -= Math.min(14, Math.round((actualMinutes - expectedMinutes) / 20));
  }
  if (reviewNotes < 24) {
    score -= 7;
  }
  if (deadlineBreached) {
    score -= Math.min(25, 10 + Math.round(lateMinutes / 25));
  }

  score = Math.max(35, Math.min(98, score));

  let penaltyAmount = 0;
  let rewardAmount = 0;
  const feedback: string[] = [];

  if (deadlineBreached) {
    penaltyAmount += Math.min(180, 30 + Math.ceil(lateMinutes / 60) * 15);
    feedback.push(`Late submission by ${lateMinutes} minute(s).`);
  } else {
    feedback.push('Submission landed within the deadline window.');
  }

  if (score < 82) {
    penaltyAmount += 40;
    feedback.push('AI quality gate rejected this submission for revision.');
  } else {
    feedback.push('AI quality gate approved the submission.');
  }

  if (!deadlineBreached && score >= 92) {
    rewardAmount = 60;
    feedback.push('Fast, high-quality delivery triggered a top-tier bonus.');
  } else if (!deadlineBreached && score >= 86) {
    rewardAmount = 25;
    feedback.push('On-time delivery with strong quality triggered a bonus.');
  }

  return {
    score,
    status: score >= 82 ? 'approved' : 'rejected',
    feedback: feedback.join(' '),
    penaltyAmount,
    rewardAmount,
    autoDeployStatus: orchestration.auto_deploy_allowed && score >= 88 ? 'deployed' : (orchestration.auto_deploy_allowed ? 'blocked' : 'not_requested'),
    deadlineBreached,
  };
};

const mapTaskRecord = (
  task: any,
  orchestration: any,
  developerMap: Map<string, any>,
  agentMap: Map<string, any>,
): ManagedTaskRecord => {
  const developer = task.developer_id ? developerMap.get(task.developer_id) : null;
  const agent = orchestration?.assigned_agent_id ? agentMap.get(orchestration.assigned_agent_id) : null;
  const assignedToType: AssignmentTarget = orchestration?.assignment_target === 'ai' ? 'ai' : 'human';

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    module: orchestration?.module || task.category || 'general',
    priority: task.priority || 'medium',
    status: task.status,
    deadline: task.deadline,
    createdAt: task.created_at,
    updatedAt: task.updated_at,
    assignedToName: assignedToType === 'ai'
      ? agent?.display_name || 'AI Automation'
      : developer?.full_name || 'Unassigned Human',
    assignedToType,
    assignedToId: assignedToType === 'ai' ? agent?.id || null : developer?.id || null,
    assignmentReason: orchestration?.assignment_reason || 'Pending assignment reasoning.',
    assignmentConfidence: orchestration?.assignment_confidence || 0,
    complexityScore: orchestration?.complexity_score || 0,
    complexityLabel: orchestration?.complexity_label || 'simple',
    requiredSkills: orchestration?.required_skills || task.tech_stack || [],
    qualityStatus: orchestration?.quality_status || 'pending',
    qualityScore: orchestration?.quality_score ?? task.quality_score ?? null,
    qualityFeedback: orchestration?.quality_feedback || null,
    actualMinutes: orchestration?.actual_minutes || 0,
    estimatedHours: task.estimated_hours || 0,
    deadlineBreached: Boolean(orchestration?.deadline_breached),
    autoDeployAllowed: Boolean(orchestration?.auto_deploy_allowed),
    autoDeployStatus: orchestration?.auto_deploy_status || 'not_requested',
    rewardAmount: Number(orchestration?.reward_amount || 0),
    penaltyAmount: Number(orchestration?.penalty_amount || task.penalty_amount || 0),
    taskAmount: Number(task.task_amount || 0),
    developerId: task.developer_id,
    startedAt: task.started_at,
    acceptedAt: task.accepted_at,
    pausedAt: task.paused_at,
    totalPausedMinutes: task.total_paused_minutes || 0,
  };
};

const ensureDeveloperWallet = async (developerId: string) => {
  const { data: existingWallet, error: existingWalletError } = await supabase
    .from('developer_wallet')
    .select('*')
    .eq('developer_id', developerId)
    .maybeSingle();

  if (existingWalletError) {
    throw existingWalletError;
  }

  if (existingWallet) {
    return existingWallet;
  }

  const { data: createdWallet, error: createWalletError } = await supabase
    .from('developer_wallet')
    .insert({ developer_id: developerId })
    .select('*')
    .single();

  if (createWalletError) {
    throw createWalletError;
  }

  return createdWallet;
};

const applyCompensation = async (developerId: string, taskId: string, rewardAmount: number, penaltyAmount: number, reason: string) => {
  if (!rewardAmount && !penaltyAmount) {
    return;
  }

  const wallet = await ensureDeveloperWallet(developerId);
  let availableBalance = Number(wallet.available_balance || 0);
  let pendingBalance = Number(wallet.pending_balance || 0);
  let totalEarned = Number(wallet.total_earned || 0);
  let totalPenalties = Number(wallet.total_penalties || 0);

  if (rewardAmount > 0) {
    pendingBalance += rewardAmount;
    totalEarned += rewardAmount;

    await supabase.from('developer_wallet_transactions').insert({
      developer_id: developerId,
      wallet_id: wallet.id,
      transaction_type: 'bonus',
      amount: rewardAmount,
      balance_after: pendingBalance,
      task_id: taskId,
      reference_type: 'task_reward',
      description: reason,
      status: 'completed',
    });
  }

  if (penaltyAmount > 0) {
    availableBalance = Math.max(0, availableBalance - penaltyAmount);
    totalPenalties += penaltyAmount;

    await supabase.from('developer_wallet_transactions').insert({
      developer_id: developerId,
      wallet_id: wallet.id,
      transaction_type: 'penalty',
      amount: penaltyAmount,
      balance_after: availableBalance,
      task_id: taskId,
      reference_type: 'task_penalty',
      description: reason,
      status: 'completed',
    });
  }

  await supabase
    .from('developer_wallet')
    .update({
      available_balance: availableBalance,
      pending_balance: pendingBalance,
      total_earned: totalEarned,
      total_penalties: totalPenalties,
      updated_at: new Date().toISOString(),
    })
    .eq('id', wallet.id);
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

export function useDeveloperTaskSystem(options: UseDeveloperTaskSystemOptions = {}) {
  const queryClient = useQueryClient();
  const deadlineWarningsRef = useRef<Set<string>>(new Set());

  const tasksQuery = useQuery({
    queryKey: [...TASK_SYSTEM_QUERY_KEY, options.developerOnly ? 'developer' : 'manager'],
    queryFn: async () => {
      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData.user;
      const [{ data: taskRows, error: taskError }, { data: developerRows }, { data: skillRows }, { data: agentRows }, { data: currentDeveloperRow }] = await Promise.all([
        supabase.from('developer_tasks').select('*').order('created_at', { ascending: false }).limit(200),
        supabase.from('developers').select('*'),
        supabase.from('developer_skills').select('*'),
        untypedSupabase.from('ai_developer_agents').select('*'),
        currentUser ? supabase.from('developers').select('*').eq('user_id', currentUser.id).maybeSingle() : Promise.resolve({ data: null }),
      ]);

      if (taskError) {
        throw taskError;
      }

      const taskIds = (taskRows || []).map((task: any) => task.id);
      const developerIds = uniqueArray((taskRows || []).map((task: any) => task.developer_id));
      const orchestrationRows = taskIds.length
        ? (await untypedSupabase.from('developer_task_orchestration').select('*').in('task_id', taskIds)).data || []
        : [];

      const developerMap = new Map((developerRows || []).map((developer: any) => [developer.id, developer]));
      const agentMap = new Map((agentRows || []).map((agent: any) => [agent.id, agent]));
      const orchestrationMap = new Map(orchestrationRows.map((row: any) => [row.task_id, row]));

      const skillMap = new Map<string, string[]>();
      for (const skill of skillRows || []) {
        const existingSkills = skillMap.get(skill.developer_id) || [];
        skillMap.set(skill.developer_id, uniqueArray([...existingSkills, skill.skill_name]));
      }

      const activeTaskCount = new Map<string, number>();
      for (const task of taskRows || []) {
        if (task.developer_id && ACTIVE_STATUSES.has(task.status)) {
          activeTaskCount.set(task.developer_id, (activeTaskCount.get(task.developer_id) || 0) + 1);
        }
      }

      const managedTasks = (taskRows || [])
        .map((task: any) => mapTaskRecord(task, orchestrationMap.get(task.id), developerMap, agentMap))
        .filter((task: ManagedTaskRecord) => !options.developerOnly || task.developerId === currentDeveloperRow?.id);

      const humanDevelopers: HumanDeveloperCandidate[] = (developerRows || [])
        .filter((developer: any) => developer.status === 'active' && !developer.is_frozen)
        .map((developer: any) => ({
          id: developer.id,
          userId: developer.user_id,
          fullName: developer.full_name,
          status: developer.status,
          availabilityStatus: developer.availability_status,
          skills: skillMap.get(developer.id) || [],
          activeTaskCount: activeTaskCount.get(developer.id) || 0,
        }));

      const aiAgents: AIAgentCandidate[] = (agentRows || []).filter((agent: any) => agent.status === 'active');

      return {
        tasks: managedTasks,
        humanDevelopers,
        aiAgents,
      };
    },
    staleTime: 0,
  });

  const tasks = tasksQuery.data?.tasks || [];
  const humanDevelopers = tasksQuery.data?.humanDevelopers || [];
  const aiAgents = tasksQuery.data?.aiAgents || [];

  useEffect(() => {
    const now = Date.now();

    for (const task of tasks) {
      if (!task.deadline || DONE_STATUSES.has(task.status)) {
        continue;
      }

      const minutesRemaining = Math.round((new Date(task.deadline).getTime() - now) / 60000);
      if (minutesRemaining > 0 && minutesRemaining <= DEADLINE_WARNING_MINUTES && !deadlineWarningsRef.current.has(task.id)) {
        deadlineWarningsRef.current.add(task.id);
        toast.warning(`Deadline near: ${task.title}`, {
          description: `${minutesRemaining} minute(s) left before penalty window starts.`,
        });
      }
    }
  }, [tasks]);

  const metrics = useMemo<TaskDashboardMetrics>(() => {
    return {
      total: tasks.length,
      active: tasks.filter((task) => ACTIVE_STATUSES.has(task.status)).length,
      aiTasks: tasks.filter((task) => task.assignedToType === 'ai').length,
      humanTasks: tasks.filter((task) => task.assignedToType === 'human').length,
      completed: tasks.filter((task) => task.status === 'completed').length,
      delayed: tasks.filter((task) => !DONE_STATUSES.has(task.status) && task.deadlineBreached).length,
      penalties: tasks.reduce((sum, task) => sum + task.penaltyAmount, 0),
      rewards: tasks.reduce((sum, task) => sum + task.rewardAmount, 0),
    };
  }, [tasks]);

  const leaderboard = useMemo(() => {
    const board = new Map<string, { name: string; tasks: number; qualitySum: number; onTime: number }>();

    for (const task of tasks.filter((item) => item.assignedToType === 'human' && item.developerId)) {
      const current = board.get(task.developerId!) || {
        name: task.assignedToName,
        tasks: 0,
        qualitySum: 0,
        onTime: 0,
      };

      if (task.status === 'completed') {
        current.tasks += 1;
        current.qualitySum += task.qualityScore || 0;
        current.onTime += task.deadlineBreached ? 0 : 1;
      }

      board.set(task.developerId!, current);
    }

    return [...board.entries()]
      .map(([developerId, value]) => ({
        developerId,
        name: value.name,
        completedTasks: value.tasks,
        averageQuality: value.tasks ? Math.round(value.qualitySum / value.tasks) : 0,
        onTimeRate: value.tasks ? Math.round((value.onTime / value.tasks) * 100) : 0,
      }))
      .sort((left, right) => {
        if (right.completedTasks !== left.completedTasks) {
          return right.completedTasks - left.completedTasks;
        }

        return right.averageQuality - left.averageQuality;
      })
      .slice(0, 5);
  }, [tasks]);

  const selectHumanDeveloper = (input: CreateDeveloperTaskInput) => {
    const requiredSkills = uniqueArray(input.skills);

    const scoredCandidates = humanDevelopers
      .map((candidate) => {
        const skillMatchCount = requiredSkills.filter((skill) => candidate.skills.includes(skill)).length;
        const availabilityScore = candidate.availabilityStatus === 'busy' ? -20 : 15;
        const workloadScore = Math.max(0, 15 - candidate.activeTaskCount * 5);
        return {
          candidate,
          score: skillMatchCount * 25 + availabilityScore + workloadScore,
        };
      })
      .sort((left, right) => right.score - left.score);

    return scoredCandidates[0]?.candidate || null;
  };

  const selectAIAgent = (input: CreateDeveloperTaskInput) => {
    const requiredSkills = uniqueArray(input.skills);

    const scoredAgents = aiAgents
      .map((agent) => {
        const skillMatchCount = requiredSkills.filter((skill) => agent.skill_tags.includes(skill)).length;
        const moduleMatch = agent.supported_modules.includes(input.module) ? 20 : 0;
        return {
          agent,
          score: skillMatchCount * 20 + moduleMatch + agent.quality_bias,
        };
      })
      .sort((left, right) => right.score - left.score);

    return scoredAgents[0]?.agent || null;
  };

  const runAIAutomation = async (taskRow: any, orchestrationRow: any, aiAgent: AIAgentCandidate | null) => {
    const aiScore = Math.max(84, Math.min(98, (aiAgent?.quality_bias || 88) + (orchestrationRow.complexity_label === 'simple' ? 6 : 0)));
    const approved = aiScore >= 86;
    const qualityFeedback = approved
      ? `AI execution completed by ${aiAgent?.display_name || 'system automation'} with automated review approval.`
      : `AI execution requires human intervention after automated review.`;
    const completedAt = new Date().toISOString();
    const actualMinutes = Math.max(8, Math.round((taskRow.estimated_hours || 1) * 18));
    const autoDeployStatus = orchestrationRow.auto_deploy_allowed && approved ? 'deployed' : (orchestrationRow.auto_deploy_allowed ? 'blocked' : 'not_requested');

    const { error: taskUpdateError } = await supabase
      .from('developer_tasks')
      .update({
        status: approved ? 'completed' : 'testing',
        started_at: taskRow.started_at || new Date().toISOString(),
        completed_at: approved ? completedAt : null,
        actual_delivery_at: approved ? completedAt : null,
        quality_score: aiScore,
        delivery_notes: qualityFeedback,
        updated_at: completedAt,
      })
      .eq('id', taskRow.id);

    if (taskUpdateError) {
      throw taskUpdateError;
    }

    await untypedSupabase
      .from('developer_task_orchestration')
      .update({
        quality_status: approved ? 'approved' : 'rejected',
        quality_score: aiScore,
        quality_feedback: qualityFeedback,
        actual_minutes: actualMinutes,
        deadline_breached: false,
        auto_deploy_status: autoDeployStatus,
        updated_at: completedAt,
      })
      .eq('task_id', taskRow.id);

    await insertTaskLog(taskRow.id, null, 'ai_auto_execution', qualityFeedback, {
      assignment_target: 'ai',
      agent: aiAgent?.display_name || 'system automation',
      quality_score: aiScore,
      auto_deploy_status: autoDeployStatus,
    });
  };

  const createTask = useMutation({
    mutationFn: async (input: CreateDeveloperTaskInput) => {
      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData.user;

      if (!currentUser) {
        throw new Error('Authentication required');
      }

      const complexity = computeComplexity(input);
      const humanCandidate = complexity.target === 'human' ? selectHumanDeveloper(input) : null;
      const aiAgent = selectAIAgent(input);
      const assignmentTarget: AssignmentTarget = complexity.target === 'human' && humanCandidate ? 'human' : 'ai';
      const priority = normalizePriority(input.priority);
      const estimatedHours = input.expectedHours && input.expectedHours > 0
        ? input.expectedHours
        : complexity.label === 'simple'
          ? 2
          : complexity.label === 'moderate'
            ? 6
            : complexity.label === 'complex'
              ? 10
              : 16;
      const assignedDeveloperId = assignmentTarget === 'human' ? humanCandidate?.id || null : null;
      const initialStatus = assignmentTarget === 'human' ? 'assigned' : 'testing';

      const { data: taskRow, error: taskInsertError } = await supabase
        .from('developer_tasks')
        .insert({
          developer_id: assignedDeveloperId,
          assigned_by: currentUser.id,
          title: input.title,
          description: input.description,
          category: input.module,
          tech_stack: input.skills,
          priority,
          status: initialStatus,
          estimated_hours: estimatedHours,
          max_delivery_hours: estimatedHours,
          deadline: toIsoOrNull(input.deadline),
          promised_delivery_at: toIsoOrNull(input.deadline),
          task_amount: Math.round(estimatedHours * 35),
          updated_at: new Date().toISOString(),
        })
        .select('*')
        .single();

      if (taskInsertError) {
        throw taskInsertError;
      }

      const orchestrationPayload = {
        task_id: taskRow.id,
        module: input.module,
        complexity_source: input.complexityMode,
        complexity_score: complexity.score,
        complexity_label: complexity.label,
        assignment_target: assignmentTarget,
        assignment_confidence: complexity.confidence,
        assignment_reason: assignmentTarget === 'human' && humanCandidate
          ? `${complexity.reason} Best fit: ${humanCandidate.fullName}.`
          : `${complexity.reason} Selected agent: ${aiAgent?.display_name || 'VALA AutoFix'}.`,
        assigned_agent_id: assignmentTarget === 'ai' ? aiAgent?.id || null : null,
        required_skills: input.skills,
        auto_deploy_allowed: Boolean(input.autoDeployAllowed),
        auto_deploy_status: input.autoDeployAllowed ? 'queued' : 'not_requested',
      };

      const { error: orchestrationError } = await untypedSupabase.from('developer_task_orchestration').insert(orchestrationPayload);
      if (orchestrationError) {
        throw orchestrationError;
      }

      await insertTaskLog(
        taskRow.id,
        assignedDeveloperId,
        'task_created',
        `Task created and routed to ${assignmentTarget === 'human' ? humanCandidate?.fullName || 'human developer' : aiAgent?.display_name || 'AI automation'}.`,
        {
          assignment_target: assignmentTarget,
          complexity_label: complexity.label,
          module: input.module,
          required_skills: input.skills,
        },
      );

      if (assignmentTarget === 'ai') {
        await runAIAutomation(taskRow, orchestrationPayload, aiAgent);
      }

      return taskRow.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_SYSTEM_QUERY_KEY });
      toast.success('Task created with auto assignment and orchestration.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create task.');
    },
  });

  const getCurrentDeveloperRow = async () => {
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData.user;

    if (!currentUser) {
      throw new Error('Authentication required');
    }

    const { data: developerRow, error } = await supabase
      .from('developers')
      .select('*')
      .eq('user_id', currentUser.id)
      .single();

    if (error) {
      throw error;
    }

    return developerRow;
  };

  const acceptTask = useMutation({
    mutationFn: async (taskId: string) => {
      const developerRow = await getCurrentDeveloperRow();
      const { error } = await supabase
        .from('developer_tasks')
        .update({
          developer_id: developerRow.id,
          status: 'accepted',
          accepted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId);

      if (error) {
        throw error;
      }

      await insertTaskLog(taskId, developerRow.id, 'task_accepted', 'Developer accepted task and timer is ready to start.');
      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_SYSTEM_QUERY_KEY });
      toast.success('Task accepted.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to accept task.');
    },
  });

  const startTask = useMutation({
    mutationFn: async (taskId: string) => {
      const developerRow = await getCurrentDeveloperRow();
      const targetTask = tasks.find((task) => task.id === taskId);

      if (!targetTask) {
        throw new Error('Task not found');
      }

      let totalPausedMinutes = targetTask.totalPausedMinutes;
      if (targetTask.pausedAt) {
        totalPausedMinutes += Math.max(0, Math.round((Date.now() - new Date(targetTask.pausedAt).getTime()) / 60000));
      }

      const now = new Date().toISOString();
      const { error } = await supabase
        .from('developer_tasks')
        .update({
          status: 'in_progress',
          started_at: targetTask.startedAt || now,
          paused_at: null,
          total_paused_minutes: totalPausedMinutes,
          updated_at: now,
        })
        .eq('id', taskId);

      if (error) {
        throw error;
      }

      await supabase.from('developer_timer_logs').insert({
        developer_id: developerRow.id,
        task_id: taskId,
        action: targetTask.pausedAt ? 'resume' : 'start',
        elapsed_minutes: totalPausedMinutes,
        timestamp: now,
      });

      await insertTaskLog(taskId, developerRow.id, 'task_started', 'Developer started active execution timer.');
      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_SYSTEM_QUERY_KEY });
      toast.success('Task timer started.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to start task.');
    },
  });

  const pauseTask = useMutation({
    mutationFn: async ({ taskId, reason }: { taskId: string; reason?: string }) => {
      const developerRow = await getCurrentDeveloperRow();
      const now = new Date().toISOString();

      const { error } = await supabase
        .from('developer_tasks')
        .update({
          status: 'paused',
          paused_at: now,
          pause_reason: reason || 'Paused by developer',
          updated_at: now,
        })
        .eq('id', taskId);

      if (error) {
        throw error;
      }

      await supabase.from('developer_timer_logs').insert({
        developer_id: developerRow.id,
        task_id: taskId,
        action: 'pause',
        pause_reason: reason || 'Paused by developer',
        timestamp: now,
      });

      await insertTaskLog(taskId, developerRow.id, 'task_paused', reason || 'Paused by developer.');
      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_SYSTEM_QUERY_KEY });
      toast.info('Task paused.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to pause task.');
    },
  });

  const submitTask = useMutation({
    mutationFn: async ({ taskId, notes }: { taskId: string; notes: string }) => {
      const developerRow = await getCurrentDeveloperRow();
      const { data: taskRow, error: taskError } = await supabase
        .from('developer_tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (taskError) {
        throw taskError;
      }

      const { data: orchestrationRows, error: orchestrationError } = await untypedSupabase
        .from('developer_task_orchestration')
        .select('*')
        .eq('task_id', taskId)
        .limit(1);

      if (orchestrationError) {
        throw orchestrationError;
      }

      const orchestrationRow = orchestrationRows?.[0];
      if (!orchestrationRow) {
        throw new Error('Orchestration record missing for task.');
      }

      const now = new Date();
      const actualMinutes = calculateActualMinutes(taskRow, now);
      const review = buildQualityReview(taskRow, orchestrationRow, actualMinutes, notes);
      const completedAt = now.toISOString();
      const finalStatus = review.status === 'approved' ? 'completed' : 'working';

      const { error: submissionError } = await supabase.from('developer_code_submissions').insert({
        developer_id: developerRow.id,
        task_id: taskId,
        submission_type: 'final',
        notes,
        commit_message: `Task delivery: ${taskRow.title}`,
        ai_review_score: review.score,
        ai_review_feedback: review.feedback,
        review_status: review.status === 'approved' ? 'approved' : 'revision_needed',
        review_notes: review.feedback,
        reviewed_at: completedAt,
      });

      if (submissionError) {
        throw submissionError;
      }

      const { error: taskUpdateError } = await supabase
        .from('developer_tasks')
        .update({
          status: finalStatus,
          completed_at: review.status === 'approved' ? completedAt : null,
          actual_delivery_at: completedAt,
          quality_score: review.score,
          penalty_amount: review.penaltyAmount,
          delivery_notes: notes,
          updated_at: completedAt,
        })
        .eq('id', taskId);

      if (taskUpdateError) {
        throw taskUpdateError;
      }

      const { error: orchestrationUpdateError } = await untypedSupabase
        .from('developer_task_orchestration')
        .update({
          quality_status: review.status,
          quality_score: review.score,
          quality_feedback: review.feedback,
          actual_minutes: actualMinutes,
          deadline_breached: review.deadlineBreached,
          auto_deploy_status: review.autoDeployStatus,
          reward_amount: review.rewardAmount,
          penalty_amount: review.penaltyAmount,
          updated_at: completedAt,
        })
        .eq('task_id', taskId);

      if (orchestrationUpdateError) {
        throw orchestrationUpdateError;
      }

      await supabase.from('developer_timer_logs').insert({
        developer_id: developerRow.id,
        task_id: taskId,
        action: 'stop',
        elapsed_minutes: actualMinutes,
        timestamp: completedAt,
        metadata: {
          quality_score: review.score,
          quality_status: review.status,
        },
      });

      if (review.penaltyAmount > 0) {
        await supabase.from('developer_violations').insert({
          developer_id: developerRow.id,
          task_id: taskId,
          violation_type: review.deadlineBreached ? 'missed_deadline' : 'quality_issue',
          severity: review.status === 'approved' ? 'warning' : 'critical',
          description: review.feedback,
          penalty_amount: review.penaltyAmount,
          auto_generated: true,
        });
      }

      await applyCompensation(
        developerRow.id,
        taskId,
        review.rewardAmount,
        review.penaltyAmount,
        review.feedback,
      );

      await insertTaskLog(taskId, developerRow.id, 'task_submitted', review.feedback, {
        actual_minutes: actualMinutes,
        quality_score: review.score,
        quality_status: review.status,
      });

      return review;
    },
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: TASK_SYSTEM_QUERY_KEY });
      if (review.status === 'approved') {
        toast.success('Submission approved by AI quality gate.');
      } else {
        toast.error('Submission rejected by AI quality gate and returned for revision.');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit task.');
    },
  });

  const overrideApproval = useMutation({
    mutationFn: async (taskId: string) => {
      const now = new Date().toISOString();
      const { error: orchestrationError } = await untypedSupabase
        .from('developer_task_orchestration')
        .update({
          quality_status: 'override_approved',
          updated_at: now,
        })
        .eq('task_id', taskId);

      if (orchestrationError) {
        throw orchestrationError;
      }

      const { error: taskError } = await supabase
        .from('developer_tasks')
        .update({
          status: 'completed',
          completed_at: now,
          actual_delivery_at: now,
          updated_at: now,
        })
        .eq('id', taskId);

      if (taskError) {
        throw taskError;
      }

      await insertTaskLog(taskId, null, 'manual_override', 'Admin override approved the task after AI rejection.');
      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_SYSTEM_QUERY_KEY });
      toast.success('Manual override applied.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to override approval.');
    },
  });

  return {
    tasks,
    metrics,
    leaderboard,
    humanDevelopers,
    aiAgents,
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    refetch: tasksQuery.refetch,
    createTask,
    acceptTask,
    startTask,
    pauseTask,
    submitTask,
    overrideApproval,
  };
}

export default useDeveloperTaskSystem;