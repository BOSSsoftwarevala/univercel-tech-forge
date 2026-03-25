import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import useDeveloperTaskSystem from '@/hooks/useDeveloperTaskSystem';

const untypedSupabase = supabase as any;
const WORKFLOW_QUERY_KEY = ['developer-workflow-center'];

export interface DeveloperSprintRecord {
  id: string;
  title: string;
  description: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

export interface DeveloperBuildRunRecord {
  id: string;
  task_id: string;
  developer_id: string | null;
  build_target: string;
  status: string;
  timer_started_at: string | null;
  timer_stopped_at: string | null;
  total_minutes: number;
  last_error: string | null;
  qa_sent_at: string | null;
  retry_count: number;
  updated_at: string;
}

export interface DeveloperBugRecord {
  id: string;
  task_id: string | null;
  title: string;
  description: string;
  severity: string;
  status: string;
  fix_notes: string | null;
  assigned_developer_id: string | null;
  created_at: string;
}

export interface DeveloperWorkflowAlertRecord {
  id: string;
  user_id: string | null;
  task_id: string | null;
  alert_type: string;
  severity: string;
  title: string;
  message: string;
  status: string;
  created_at: string;
}

export interface DeveloperTaskCommentRecord {
  id: string;
  task_id: string;
  author_user_id: string;
  author_role: string;
  comment_type: string;
  body: string;
  created_at: string;
}

export interface DeveloperAccessControlRecord {
  id: string;
  user_id: string;
  access_status: string;
  access_type: string;
  expires_at: string | null;
  lock_reason: string | null;
  allowed_ip: string | null;
  device_fingerprint: string | null;
  session_timeout_minutes: number;
  violation_count: number;
}

export interface TaskAiDecisionRecord {
  id: string;
  task_id: string;
  mode: string;
  confidence_score: number;
  assigned_to: string | null;
  override_mode: string | null;
  cost_score: number;
  delay_risk_score: number;
  reasoning: string | null;
}

interface UseDeveloperWorkflowCenterOptions {
  developerOnly?: boolean;
}

const appendFileMetadata = (existing: unknown, file: File) => {
  const safeArray = Array.isArray(existing) ? existing : [];
  return [
    ...safeArray,
    {
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      uploadedAt: new Date().toISOString(),
    },
  ];
};

export default function useDeveloperWorkflowCenter(options: UseDeveloperWorkflowCenterOptions = {}) {
  const queryClient = useQueryClient();
  const taskSystem = useDeveloperTaskSystem(options);

  const invalidateAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['developer-task-system'] }),
      queryClient.invalidateQueries({ queryKey: WORKFLOW_QUERY_KEY }),
    ]);
  };

  const getCurrentActor = async () => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      throw new Error('Authentication required');
    }

    const [{ data: roleRow }, { data: developerRow }] = await Promise.all([
      supabase.from('user_roles').select('role').eq('user_id', user.id).maybeSingle(),
      supabase.from('developers').select('*').eq('user_id', user.id).maybeSingle(),
    ]);

    return {
      user,
      role: roleRow?.role || 'developer',
      developer: developerRow || null,
    };
  };

  const workflowQuery = useQuery({
    queryKey: [...WORKFLOW_QUERY_KEY, options.developerOnly ? 'developer' : 'manager'],
    queryFn: async () => {
      const actor = await getCurrentActor();
      const developerId = actor.developer?.id || null;

      const sprintQuery = untypedSupabase.from('developer_sprints').select('*').order('created_at', { ascending: false }).limit(20);
      const buildQuery = untypedSupabase.from('developer_build_runs').select('*').order('updated_at', { ascending: false }).limit(50);
      const bugQuery = untypedSupabase.from('developer_bug_reports').select('*').order('created_at', { ascending: false }).limit(50);
      const alertQuery = untypedSupabase.from('developer_workflow_alerts').select('*').order('created_at', { ascending: false }).limit(50);
      const commentQuery = untypedSupabase.from('developer_task_comments').select('*').order('created_at', { ascending: false }).limit(100);
      const accessQuery = untypedSupabase.from('developer_access_controls').select('*').order('updated_at', { ascending: false }).limit(50);
      const aiDecisionQuery = untypedSupabase.from('task_ai_decision').select('*').order('updated_at', { ascending: false }).limit(100);
      const submissionQuery = supabase.from('developer_code_submissions').select('*').order('created_at', { ascending: false }).limit(100);
      const settingsQuery = supabase.from('system_settings').select('*').ilike('setting_key', 'developer.%');

      const scopedBuildQuery = options.developerOnly && developerId ? buildQuery.eq('developer_id', developerId) : buildQuery;
      const scopedBugQuery = options.developerOnly && developerId ? bugQuery.or(`assigned_developer_id.eq.${developerId},reported_by.eq.${actor.user.id}`) : bugQuery;
      const scopedAlertQuery = options.developerOnly ? alertQuery.eq('user_id', actor.user.id) : alertQuery;
      const scopedSubmissionQuery = options.developerOnly && developerId ? submissionQuery.eq('developer_id', developerId) : submissionQuery;
      const scopedAccessQuery = options.developerOnly ? accessQuery.eq('user_id', actor.user.id) : accessQuery;

      const [
        { data: sprints },
        { data: builds },
        { data: bugs },
        { data: alerts },
        { data: comments },
        { data: accessControls },
        { data: aiDecisions },
        { data: submissions },
        { data: settings },
      ] = await Promise.all([
        sprintQuery,
        scopedBuildQuery,
        scopedBugQuery,
        scopedAlertQuery,
        commentQuery,
        scopedAccessQuery,
        aiDecisionQuery,
        scopedSubmissionQuery,
        settingsQuery,
      ]);

      return {
        actor,
        sprints: (sprints || []) as DeveloperSprintRecord[],
        builds: (builds || []) as DeveloperBuildRunRecord[],
        bugs: (bugs || []) as DeveloperBugRecord[],
        alerts: (alerts || []) as DeveloperWorkflowAlertRecord[],
        comments: (comments || []) as DeveloperTaskCommentRecord[],
        accessControls: (accessControls || []) as DeveloperAccessControlRecord[],
        aiDecisions: (aiDecisions || []) as TaskAiDecisionRecord[],
        submissions: submissions || [],
        settings: settings || [],
      };
    },
    staleTime: 0,
  });

  const actor = workflowQuery.data?.actor;
  const sprints = workflowQuery.data?.sprints || [];
  const builds = workflowQuery.data?.builds || [];
  const bugs = workflowQuery.data?.bugs || [];
  const alerts = workflowQuery.data?.alerts || [];
  const comments = workflowQuery.data?.comments || [];
  const accessControls = workflowQuery.data?.accessControls || [];
  const aiDecisions = workflowQuery.data?.aiDecisions || [];
  const submissions = workflowQuery.data?.submissions || [];
  const settings = workflowQuery.data?.settings || [];

  const commentsByTaskId = useMemo(() => {
    return comments.reduce<Record<string, DeveloperTaskCommentRecord[]>>((accumulator, comment) => {
      accumulator[comment.task_id] = accumulator[comment.task_id] || [];
      accumulator[comment.task_id].push(comment);
      return accumulator;
    }, {});
  }, [comments]);

  const accessControlByUserId = useMemo(() => {
    return accessControls.reduce<Record<string, DeveloperAccessControlRecord>>((accumulator, row) => {
      accumulator[row.user_id] = row;
      return accumulator;
    }, {});
  }, [accessControls]);

  const createSprint = useMutation({
    mutationFn: async ({ title, description, startDate, endDate }: { title: string; description?: string; startDate?: string; endDate?: string }) => {
      const currentActor = await getCurrentActor();
      const { error } = await untypedSupabase.from('developer_sprints').insert({
        title,
        description: description || null,
        start_date: startDate || null,
        end_date: endDate || null,
        created_by: currentActor.user.id,
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.success('Sprint created.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to create sprint.'),
  });

  const updateSprintStatus = useMutation({
    mutationFn: async ({ sprintId, status }: { sprintId: string; status: string }) => {
      const { error } = await untypedSupabase.from('developer_sprints').update({ status }).eq('id', sprintId);
      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.success('Sprint updated.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to update sprint.'),
  });

  const assignTask = useMutation({
    mutationFn: async ({ taskId, developerId, sprintId }: { taskId: string; developerId: string; sprintId?: string | null }) => {
      const { data: developerRow, error: developerError } = await supabase
        .from('developers')
        .select('id, user_id, full_name')
        .eq('id', developerId)
        .single();

      if (developerError) {
        throw developerError;
      }

      const { data: registrationRow, error: registrationError } = await supabase
        .from('developer_registrations')
        .select('nda_accepted')
        .eq('user_id', developerRow.user_id)
        .maybeSingle();

      if (registrationError) {
        throw registrationError;
      }

      if (!registrationRow?.nda_accepted) {
        throw new Error('NDA must be accepted before task assignment.');
      }

      const now = new Date().toISOString();
      const { error: taskError } = await supabase
        .from('developer_tasks')
        .update({
          developer_id: developerId,
          status: 'assigned',
          assigned_at: now,
          sprint_id: sprintId || null,
          escalated_flag: false,
          escalation_reason: null,
          updated_at: now,
        })
        .eq('id', taskId);

      if (taskError) {
        throw taskError;
      }

      await untypedSupabase.from('task_ai_decision').upsert({
        task_id: taskId,
        mode: 'human',
        confidence_score: 92,
        assigned_to: developerRow.full_name,
        reasoning: 'Task assigned to human developer after NDA validation.',
      }, { onConflict: 'task_id' });

      await supabase.from('task_logs').insert({
        task_id: taskId,
        developer_id: developerId,
        action: 'task_assigned',
        action_type: 'system',
        details: `Assigned to ${developerRow.full_name}.`,
        metadata: { sprint_id: sprintId || null },
      });

      await untypedSupabase.from('developer_workflow_alerts').insert({
        user_id: developerRow.user_id,
        task_id: taskId,
        alert_type: 'performance',
        severity: 'medium',
        title: 'Task Assigned',
        message: `A new task has been assigned to ${developerRow.full_name}.`,
        status: 'open',
        metadata: { task_id: taskId, action: 'assign' },
      });
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.success('Task assigned.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to assign task.'),
  });

  const reassignTask = useMutation({
    mutationFn: async ({ taskId, developerId, sprintId }: { taskId: string; developerId: string; sprintId?: string | null }) => {
      await assignTask.mutateAsync({ taskId, developerId, sprintId });
      const { error } = await supabase.from('task_logs').insert({
        task_id: taskId,
        developer_id: developerId,
        action: 'task_reassigned',
        action_type: 'system',
        details: 'Task reassigned by manager.',
        metadata: { sprint_id: sprintId || null },
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.success('Task reassigned.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to reassign task.'),
  });

  const escalateTask = useMutation({
    mutationFn: async ({ taskId, reason }: { taskId: string; reason: string }) => {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('developer_tasks')
        .update({
          status: 'escalated',
          escalated_flag: true,
          escalation_reason: reason,
          updated_at: now,
        })
        .eq('id', taskId);

      if (error) {
        throw error;
      }

      await supabase.from('task_logs').insert({
        task_id: taskId,
        action: 'task_escalated',
        action_type: 'system',
        details: reason,
      });
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.warning('Task escalated.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to escalate task.'),
  });

  const closeTask = useMutation({
    mutationFn: async ({ taskId, reason }: { taskId: string; reason?: string }) => {
      const currentActor = await getCurrentActor();
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('developer_tasks')
        .update({
          status: 'closed',
          closed_at: now,
          closed_by: currentActor.user.id,
          updated_at: now,
        })
        .eq('id', taskId);

      if (error) {
        throw error;
      }

      await supabase.from('task_logs').insert({
        task_id: taskId,
        action: 'task_closed',
        action_type: 'system',
        details: reason || 'Task closed.',
      });
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.success('Task closed.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to close task.'),
  });

  const rejectTask = useMutation({
    mutationFn: async ({ taskId, reason }: { taskId: string; reason: string }) => {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('developer_tasks')
        .update({
          status: 'rejected',
          rejected_at: now,
          rejected_reason: reason,
          updated_at: now,
        })
        .eq('id', taskId);

      if (error) {
        throw error;
      }

      await supabase.from('task_logs').insert({
        task_id: taskId,
        action: 'task_rejected',
        action_type: 'system',
        details: reason,
      });
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.warning('Task rejected.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to reject task.'),
  });

  const ensureBuildRun = async (taskId: string) => {
    const existing = builds.find((build) => build.task_id === taskId);
    if (existing) {
      return existing;
    }

    const task = taskSystem.tasks.find((row) => row.id === taskId);
    const { data, error } = await untypedSupabase.from('developer_build_runs').insert({
      task_id: taskId,
      developer_id: task?.developerId || actor?.developer?.id || null,
      build_target: 'staging',
      status: 'queued',
    }).select('*').single();

    if (error) {
      throw error;
    }

    return data as DeveloperBuildRunRecord;
  };

  const startBuild = useMutation({
    mutationFn: async (taskId: string) => {
      const build = await ensureBuildRun(taskId);
      const now = new Date().toISOString();
      const { error } = await untypedSupabase.from('developer_build_runs').update({
        status: 'running',
        timer_started_at: now,
        timer_stopped_at: null,
      }).eq('id', build.id);

      if (error) {
        throw error;
      }

      await supabase.from('developer_tasks').update({ status: 'in_progress', updated_at: now }).eq('id', taskId);
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.success('Build started.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to start build.'),
  });

  const stopBuild = useMutation({
    mutationFn: async ({ taskId, errorMessage }: { taskId: string; errorMessage?: string }) => {
      const build = await ensureBuildRun(taskId);
      const now = new Date();
      const elapsedMinutes = build.timer_started_at
        ? Math.max(1, Math.round((now.getTime() - new Date(build.timer_started_at).getTime()) / 60000))
        : 0;

      const { error } = await untypedSupabase.from('developer_build_runs').update({
        status: errorMessage ? 'failed' : 'paused',
        timer_stopped_at: now.toISOString(),
        total_minutes: (build.total_minutes || 0) + elapsedMinutes,
        last_error: errorMessage || null,
      }).eq('id', build.id);

      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.info('Build updated.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to stop build.'),
  });

  const sendBuildToQa = useMutation({
    mutationFn: async (taskId: string) => {
      const build = await ensureBuildRun(taskId);
      const now = new Date().toISOString();
      const { error } = await untypedSupabase.from('developer_build_runs').update({
        status: 'qa_queue',
        qa_sent_at: now,
      }).eq('id', build.id);

      if (error) {
        throw error;
      }

      await supabase.from('developer_tasks').update({ status: 'qa_queue', qa_status: 'pending', updated_at: now }).eq('id', taskId);
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.success('Build sent to QA.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to send build to QA.'),
  });

  const retryBuild = useMutation({
    mutationFn: async ({ taskId, errorMessage }: { taskId: string; errorMessage?: string }) => {
      const build = await ensureBuildRun(taskId);
      const now = new Date().toISOString();
      const { error } = await untypedSupabase.from('developer_build_runs').update({
        status: 'retrying',
        retry_count: (build.retry_count || 0) + 1,
        last_error: errorMessage || build.last_error || 'Retry requested',
        timer_started_at: now,
        timer_stopped_at: null,
      }).eq('id', build.id);

      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.info('Build retry queued.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to retry build.'),
  });

  const addTaskComment = useMutation({
    mutationFn: async ({ taskId, body, commentType = 'internal' }: { taskId: string; body: string; commentType?: string }) => {
      const currentActor = await getCurrentActor();
      const { error } = await untypedSupabase.from('developer_task_comments').insert({
        task_id: taskId,
        author_user_id: currentActor.user.id,
        author_role: currentActor.role,
        comment_type: commentType,
        body,
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.success('Note saved.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to save note.'),
  });

  const submitCode = useMutation({
    mutationFn: async ({ taskId, notes, commitMessage, fileUrls }: { taskId: string; notes: string; commitMessage?: string; fileUrls?: unknown[] }) => {
      const currentActor = await getCurrentActor();
      if (!currentActor.developer) {
        throw new Error('Developer profile not found.');
      }

      const { error } = await supabase.from('developer_code_submissions').insert({
        developer_id: currentActor.developer.id,
        task_id: taskId,
        notes,
        commit_message: commitMessage || null,
        file_urls: fileUrls || [],
        submission_type: 'manual',
        review_status: 'pending',
      });

      if (error) {
        throw error;
      }

      await supabase.from('developer_tasks').update({ status: 'review', updated_at: new Date().toISOString() }).eq('id', taskId);
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.success('Code submission recorded.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to submit code.'),
  });

  const uploadTaskFile = useMutation({
    mutationFn: async ({ taskId, file }: { taskId: string; file: File }) => {
      const currentActor = await getCurrentActor();
      if (!currentActor.developer) {
        throw new Error('Developer profile not found.');
      }

      const latestSubmission = submissions.find((submission: any) => submission.task_id === taskId && submission.developer_id === currentActor.developer!.id);
      if (latestSubmission) {
        const { error } = await supabase
          .from('developer_code_submissions')
          .update({ file_urls: appendFileMetadata(latestSubmission.file_urls, file) })
          .eq('id', latestSubmission.id);

        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase.from('developer_code_submissions').insert({
          developer_id: currentActor.developer.id,
          task_id: taskId,
          notes: `Attachment added: ${file.name}`,
          file_urls: appendFileMetadata([], file),
          submission_type: 'attachment',
          review_status: 'pending',
        });

        if (error) {
          throw error;
        }
      }

      await addTaskComment.mutateAsync({
        taskId,
        body: `Attachment logged: ${file.name} (${Math.round(file.size / 1024)} KB).`,
      });
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.success('File metadata attached to submission.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to attach file.'),
  });

  const reviewSubmission = useMutation({
    mutationFn: async ({ submissionId, taskId, status, notes, score }: { submissionId: string; taskId: string; status: 'approved' | 'rejected' | 'locked'; notes: string; score?: number }) => {
      const currentActor = await getCurrentActor();
      const now = new Date().toISOString();
      const { error } = await supabase.from('developer_code_submissions').update({
        review_status: status,
        review_notes: notes,
        reviewed_by: currentActor.user.id,
        reviewed_at: now,
        ai_review_score: score || null,
        ai_review_feedback: notes,
      }).eq('id', submissionId);

      if (error) {
        throw error;
      }

      await supabase.from('developer_tasks').update({
        status: status === 'approved' ? 'completed' : status === 'locked' ? 'closed' : 'rejected',
        qa_status: status,
        qa_comment: notes,
        updated_at: now,
      }).eq('id', taskId);
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.success('Submission review saved.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to review submission.'),
  });

  const reportBug = useMutation({
    mutationFn: async ({ taskId, title, description, severity }: { taskId?: string | null; title: string; description: string; severity: string }) => {
      const currentActor = await getCurrentActor();
      const { error } = await untypedSupabase.from('developer_bug_reports').insert({
        task_id: taskId || null,
        reported_by: currentActor.user.id,
        title,
        description,
        severity,
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.success('Bug logged.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to log bug.'),
  });

  const assignBug = useMutation({
    mutationFn: async ({ bugId, developerId }: { bugId: string; developerId: string }) => {
      const { error } = await untypedSupabase.from('developer_bug_reports').update({
        assigned_developer_id: developerId,
        assigned_at: new Date().toISOString(),
        status: 'assigned',
      }).eq('id', bugId);

      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.success('Bug assigned.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to assign bug.'),
  });

  const fixBug = useMutation({
    mutationFn: async ({ bugId, fixNotes }: { bugId: string; fixNotes: string }) => {
      const { error } = await untypedSupabase.from('developer_bug_reports').update({
        status: 'fixed',
        fix_notes: fixNotes,
      }).eq('id', bugId);

      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.success('Bug marked as fixed.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to update bug.'),
  });

  const verifyBug = useMutation({
    mutationFn: async (bugId: string) => {
      const { error } = await untypedSupabase.from('developer_bug_reports').update({
        status: 'verified',
        verified_at: new Date().toISOString(),
      }).eq('id', bugId);

      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.success('Bug verified.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to verify bug.'),
  });

  const closeBug = useMutation({
    mutationFn: async (bugId: string) => {
      const { error } = await untypedSupabase.from('developer_bug_reports').update({
        status: 'closed',
        closed_at: new Date().toISOString(),
      }).eq('id', bugId);

      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.success('Bug closed.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to close bug.'),
  });

  const saveSetting = useMutation({
    mutationFn: async ({ settingKey, settingValue }: { settingKey: string; settingValue: string }) => {
      const existing = settings.find((setting: any) => setting.setting_key === settingKey);
      if (existing) {
        const { error } = await supabase.from('system_settings').update({ setting_value: settingValue }).eq('id', existing.id);
        if (error) {
          throw error;
        }
        return;
      }

      const { error } = await supabase.from('system_settings').insert({
        setting_key: settingKey,
        setting_value: settingValue,
        is_public: false,
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.success('Setting saved.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to save setting.'),
  });

  const lockAccess = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      const currentActor = await getCurrentActor();
      const { error } = await untypedSupabase.rpc('lock_user_access', {
        target_user_id: userId,
        actor_user_id: currentActor.user.id,
        reason,
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.warning('Access locked.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to lock access.'),
  });

  const tempGrantAccess = useMutation({
    mutationFn: async ({ userId, expiresAt }: { userId: string; expiresAt: string }) => {
      const currentActor = await getCurrentActor();
      const { error } = await untypedSupabase.rpc('temp_grant_user_access', {
        target_user_id: userId,
        actor_user_id: currentActor.user.id,
        expires_at_input: expiresAt,
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.success('Temporary access granted.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to grant temporary access.'),
  });

  const resolveAlert = useMutation({
    mutationFn: async (alertId: string) => {
      const currentActor = await getCurrentActor();
      const { error } = await untypedSupabase.from('developer_workflow_alerts').update({
        status: 'resolved',
        resolved_at: new Date().toISOString(),
        resolved_by: currentActor.user.id,
      }).eq('id', alertId);

      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.success('Alert resolved.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to resolve alert.'),
  });

  const recordViolation = useMutation({
    mutationFn: async ({ developerId, taskId, violationType, severity, description, penaltyAmount }: { developerId: string; taskId?: string; violationType: string; severity: string; description: string; penaltyAmount?: number }) => {
      const currentActor = await getCurrentActor();
      const { error } = await supabase.from('developer_violations').insert({
        developer_id: developerId,
        task_id: taskId || null,
        violation_type: violationType,
        severity,
        description,
        penalty_amount: penaltyAmount || 0,
        created_by: currentActor.user.id,
        auto_generated: false,
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      await invalidateAll();
      toast.warning('Violation recorded.');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to record violation.'),
  });

  return {
    ...taskSystem,
    actor,
    sprints,
    builds,
    bugs,
    alerts,
    comments,
    commentsByTaskId,
    accessControls,
    accessControlByUserId,
    aiDecisions,
    submissions,
    settings,
    workflowLoading: workflowQuery.isLoading,
    refetchAll: async () => {
      await Promise.all([taskSystem.refetch(), workflowQuery.refetch()]);
    },
    createSprint,
    updateSprintStatus,
    assignTask,
    reassignTask,
    escalateTask,
    closeTask,
    rejectTask,
    startBuild,
    stopBuild,
    sendBuildToQa,
    retryBuild,
    addTaskComment,
    submitCode,
    uploadTaskFile,
    reviewSubmission,
    reportBug,
    assignBug,
    fixBug,
    verifyBug,
    closeBug,
    saveSetting,
    lockAccess,
    tempGrantAccess,
    resolveAlert,
    recordViolation,
  };
}