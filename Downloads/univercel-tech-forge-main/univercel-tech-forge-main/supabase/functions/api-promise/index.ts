import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { withAuth, RequestContext } from '../_shared/middleware.ts';
import { errorResponse, jsonResponse, validateRequired } from '../_shared/utils.ts';

const ALLOWED_ROLES = ['developer', 'task_manager', 'promise_management', 'pro_manager', 'super_admin', 'boss_owner', 'admin'];
const MANAGER_ROLES = ['task_manager', 'promise_management', 'pro_manager', 'super_admin', 'boss_owner', 'admin'];

function normalizePath(path: string) {
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
}

function trim(path: string) {
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
}

function matches(path: string, ...candidates: string[]) {
  return candidates.includes(trim(path));
}

function getRequestMeta(req: Request, rawBody: Record<string, unknown>) {
  const url = new URL(req.url);
  const pathFromUrl = url.pathname.replace(/^.*\/api-promise/, '') || '/';
  return {
    path: normalizePath(String(rawBody._path || pathFromUrl || '/')),
    method: String(rawBody._method || req.method || 'GET').toUpperCase(),
  };
}

function getPayload(body: Record<string, unknown>) {
  const nextBody = { ...body };
  delete nextBody._path;
  delete nextBody._method;
  return nextBody;
}

function canManage(role: string) {
  return MANAGER_ROLES.includes(role);
}

function toNumber(value: unknown, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

async function getDeveloperId(supabaseAdmin: any, userId: string) {
  const { data, error } = await supabaseAdmin.rpc('get_developer_id', { _user_id: userId });
  if (error || !data) {
    throw new Error('Developer profile not found for this user.');
  }
  return String(data);
}

async function logSystem(supabaseAdmin: any, payload: Record<string, unknown>) {
  try {
    await supabaseAdmin.from('system_logs').insert(payload);
  } catch {
    // Best effort only.
  }
}

async function logError(supabaseAdmin: any, payload: Record<string, unknown>) {
  try {
    await supabaseAdmin.from('error_logs').insert(payload);
  } catch {
    // Best effort only.
  }
}

async function auditPromiseAction(
  supabaseAdmin: any,
  actionType: string,
  actorId: string,
  actorRole: string,
  promiseId: string | null,
  previousStatus: string | null,
  newStatus: string | null,
  reason: string,
) {
  try {
    await supabaseAdmin.from('promise_audit_logs').insert({
      promise_id: promiseId,
      action_type: actionType,
      action_by: actorId,
      action_by_role: actorRole,
      previous_status: previousStatus,
      new_status: newStatus,
      reason,
      is_system_action: false,
    });
  } catch {
    // Keep older environments compatible.
  }
}

async function handleCreatePromise(ctx: RequestContext, body: Record<string, unknown>) {
  const validation = validateRequired(body, ['task_id']);
  if (validation) return errorResponse(validation);

  const developerId = body.developer_id && canManage(ctx.user.role)
    ? String(body.developer_id)
    : await getDeveloperId(ctx.supabaseAdmin, ctx.user.userId);

  const estimatedHours = Math.max(toNumber(body.estimated_hours, 1), 0.25);
  const deadline = body.deadline
    ? new Date(String(body.deadline))
    : new Date(Date.now() + estimatedHours * 60 * 60 * 1000);

  if (Number.isNaN(deadline.getTime()) || deadline <= new Date()) {
    return errorResponse('Deadline must be a valid future timestamp.', 400);
  }

  const { data: existingPromise } = await ctx.supabaseAdmin
    .from('promise_logs')
    .select('id, status')
    .eq('task_id', String(body.task_id))
    .eq('developer_id', developerId)
    .in('status', ['promised', 'in_progress'])
    .maybeSingle();

  if (existingPromise) {
    return errorResponse('Active promise already exists for this task.', 409);
  }

  const { data: activePromises } = await ctx.supabaseAdmin
    .from('promise_logs')
    .select('id')
    .eq('developer_id', developerId)
    .in('status', ['promised', 'in_progress']);

  if ((activePromises || []).length >= 3) {
    return errorResponse('Maximum concurrent promises reached.', 409);
  }

  const { data: promise, error } = await ctx.supabaseAdmin
    .from('promise_logs')
    .insert({
      developer_id: developerId,
      task_id: String(body.task_id),
      deadline: deadline.toISOString(),
      status: 'promised',
      score_effect: 0,
      extended_count: 0,
    })
    .select('id')
    .single();

  if (error || !promise) {
    return errorResponse(error?.message || 'Failed to create promise.', 400);
  }

  await auditPromiseAction(ctx.supabaseAdmin, 'creation', ctx.user.userId, ctx.user.role, promise.id, null, 'promised', 'Promise created via api-promise');
  await logSystem(ctx.supabaseAdmin, {
    module: 'promise',
    action: 'promise_created',
    status: 'success',
    user_id: ctx.user.userId,
    metadata: { promise_id: promise.id, task_id: body.task_id, developer_id: developerId },
  });

  return jsonResponse({ success: true, promiseId: promise.id });
}

async function getActiveTimer(ctx: RequestContext, developerId: string, taskId?: string | null) {
  let query = ctx.supabaseAdmin
    .from('dev_timer')
    .select('*')
    .eq('dev_id', developerId)
    .is('stop_timestamp', null)
    .order('created_at', { ascending: false })
    .limit(1);

  if (taskId) {
    query = query.eq('task_id', taskId);
  }

  const { data } = await query.maybeSingle();
  return data;
}

async function handleStartTimer(ctx: RequestContext, body: Record<string, unknown>) {
  const validation = validateRequired(body, ['task_id']);
  if (validation) return errorResponse(validation);

  const developerId = await getDeveloperId(ctx.supabaseAdmin, ctx.user.userId);
  const taskId = String(body.task_id);
  const { data: promise } = await ctx.supabaseAdmin
    .from('promise_logs')
    .select('id, status')
    .eq('task_id', taskId)
    .eq('developer_id', developerId)
    .in('status', ['promised', 'in_progress'])
    .maybeSingle();

  if (!promise) {
    return errorResponse('No active promise found. Promise required before starting timer.', 409);
  }

  const existingTimer = await getActiveTimer(ctx, developerId, taskId);
  const nowIso = new Date().toISOString();

  if (existingTimer) {
    await ctx.supabaseAdmin
      .from('dev_timer')
      .update({ pause_timestamp: null, start_timestamp: nowIso })
      .eq('timer_id', existingTimer.timer_id);

    await ctx.supabaseAdmin.from('developer_timer_logs').insert({
      developer_id: developerId,
      task_id: taskId,
      action: 'resume',
      timestamp: nowIso,
    });

    return jsonResponse({ success: true, timerId: existingTimer.timer_id });
  }

  const { data: timer, error } = await ctx.supabaseAdmin
    .from('dev_timer')
    .insert({
      task_id: taskId,
      dev_id: developerId,
      start_timestamp: nowIso,
      total_seconds: 0,
    })
    .select('timer_id')
    .single();

  if (error || !timer) {
    return errorResponse(error?.message || 'Failed to start timer.', 400);
  }

  await ctx.supabaseAdmin.from('promise_logs').update({ status: 'in_progress', updated_at: nowIso }).eq('id', promise.id);
  await ctx.supabaseAdmin.from('developer_timer_logs').insert({
    developer_id: developerId,
    task_id: taskId,
    action: 'start',
    timestamp: nowIso,
  });
  await ctx.supabaseAdmin.from('developer_tasks').update({ status: 'in_progress', started_at: nowIso }).eq('id', taskId);
  await auditPromiseAction(ctx.supabaseAdmin, 'timer_start', ctx.user.userId, ctx.user.role, promise.id, 'promised', 'in_progress', 'Timer started');

  return jsonResponse({ success: true, timerId: timer.timer_id });
}

async function handlePauseTimer(ctx: RequestContext, body: Record<string, unknown>) {
  const validation = validateRequired(body, ['task_id', 'reason']);
  if (validation) return errorResponse(validation);

  const reason = String(body.reason || '').trim();
  if (reason.length < 10) {
    return errorResponse('Pause reason must be at least 10 characters.', 400);
  }

  const developerId = await getDeveloperId(ctx.supabaseAdmin, ctx.user.userId);
  const timer = await getActiveTimer(ctx, developerId, String(body.task_id));
  if (!timer) {
    return errorResponse('No active timer found.', 404);
  }

  const pauseTime = new Date();
  const elapsedSeconds = timer.pause_timestamp
    ? toNumber(timer.total_seconds, 0)
    : toNumber(timer.total_seconds, 0) + Math.floor((pauseTime.getTime() - new Date(timer.start_timestamp).getTime()) / 1000);

  await ctx.supabaseAdmin
    .from('dev_timer')
    .update({
      pause_timestamp: pauseTime.toISOString(),
      total_seconds: elapsedSeconds,
    })
    .eq('timer_id', timer.timer_id);

  await ctx.supabaseAdmin.from('developer_timer_logs').insert({
    developer_id: developerId,
    task_id: String(body.task_id),
    action: 'pause',
    pause_reason: reason,
    timestamp: pauseTime.toISOString(),
    elapsed_minutes: Math.floor(elapsedSeconds / 60),
  });

  return jsonResponse({ success: true, elapsedSeconds });
}

async function handleResumeTimer(ctx: RequestContext, body: Record<string, unknown>) {
  const developerId = await getDeveloperId(ctx.supabaseAdmin, ctx.user.userId);
  const taskId = body.task_id ? String(body.task_id) : null;
  const timer = await getActiveTimer(ctx, developerId, taskId);
  if (!timer) {
    return errorResponse('No paused timer found.', 404);
  }

  const nowIso = new Date().toISOString();
  await ctx.supabaseAdmin
    .from('dev_timer')
    .update({ pause_timestamp: null, start_timestamp: nowIso })
    .eq('timer_id', timer.timer_id);

  await ctx.supabaseAdmin.from('developer_timer_logs').insert({
    developer_id: developerId,
    task_id: timer.task_id,
    action: 'resume',
    timestamp: nowIso,
  });

  return jsonResponse({ success: true, timerId: timer.timer_id });
}

async function stopTimerInternal(ctx: RequestContext, taskId: string, completePromise: boolean) {
  const developerId = await getDeveloperId(ctx.supabaseAdmin, ctx.user.userId);
  const timer = await getActiveTimer(ctx, developerId, taskId);
  if (!timer) {
    return errorResponse('No active timer found.', 404);
  }

  const now = new Date();
  const elapsedSeconds = timer.pause_timestamp
    ? toNumber(timer.total_seconds, 0)
    : toNumber(timer.total_seconds, 0) + Math.floor((now.getTime() - new Date(timer.start_timestamp).getTime()) / 1000);

  await ctx.supabaseAdmin
    .from('dev_timer')
    .update({
      stop_timestamp: now.toISOString(),
      total_seconds: elapsedSeconds,
    })
    .eq('timer_id', timer.timer_id);

  await ctx.supabaseAdmin.from('developer_timer_logs').insert({
    developer_id: developerId,
    task_id: taskId,
    action: completePromise ? 'complete' : 'stop',
    timestamp: now.toISOString(),
    elapsed_minutes: Math.floor(elapsedSeconds / 60),
  });

  let scoreEffect = 0;
  if (completePromise) {
    const { data: promise } = await ctx.supabaseAdmin
      .from('promise_logs')
      .select('id, deadline, status')
      .eq('task_id', taskId)
      .eq('developer_id', developerId)
      .in('status', ['promised', 'in_progress'])
      .maybeSingle();

    if (promise) {
      const deadline = new Date(promise.deadline);
      scoreEffect = now > deadline
        ? -Math.min(20, Math.floor((now.getTime() - deadline.getTime()) / (30 * 60 * 1000)) * 5 || 5)
        : Math.min(10, 5 + Math.floor((deadline.getTime() - now.getTime()) / (60 * 60 * 1000)));

      await ctx.supabaseAdmin
        .from('promise_logs')
        .update({
          status: 'completed',
          finished_time: now.toISOString(),
          score_effect: scoreEffect,
          updated_at: now.toISOString(),
        })
        .eq('id', promise.id);

      await auditPromiseAction(ctx.supabaseAdmin, 'timer_complete', ctx.user.userId, ctx.user.role, promise.id, promise.status, 'completed', 'Timer completed and promise fulfilled');
    }
  }

  return jsonResponse({ success: true, elapsedSeconds, scoreEffect, timerId: timer.timer_id });
}

async function handleRepairConsistency(ctx: RequestContext) {
  if (!canManage(ctx.user.role)) {
    return errorResponse('Forbidden', 403);
  }

  const nowIso = new Date().toISOString();
  const { data: timers } = await ctx.supabaseAdmin
    .from('dev_timer')
    .select('timer_id, task_id, dev_id, start_timestamp, total_seconds')
    .is('stop_timestamp', null)
    .limit(50);

  let repaired = 0;
  for (const timer of timers || []) {
    const { data: promise } = await ctx.supabaseAdmin
      .from('promise_logs')
      .select('id')
      .eq('task_id', timer.task_id)
      .eq('developer_id', timer.dev_id)
      .in('status', ['promised', 'in_progress'])
      .maybeSingle();

    if (!promise) {
      const totalSeconds = toNumber(timer.total_seconds, 0) + Math.max(0, Math.floor((Date.now() - new Date(timer.start_timestamp).getTime()) / 1000));
      await ctx.supabaseAdmin
        .from('dev_timer')
        .update({ stop_timestamp: nowIso, total_seconds: totalSeconds })
        .eq('timer_id', timer.timer_id);
      repaired += 1;
    }
  }

  await logSystem(ctx.supabaseAdmin, {
    module: 'promise',
    action: 'repair_consistency',
    status: 'success',
    user_id: ctx.user.userId,
    metadata: { repaired },
  });

  return jsonResponse({ success: true, repaired });
}

async function handleOverview(ctx: RequestContext) {
  const developerId = await getDeveloperId(ctx.supabaseAdmin, ctx.user.userId);
  const [promises, timers] = await Promise.all([
    ctx.supabaseAdmin
      .from('promise_logs')
      .select('id, status, deadline')
      .eq('developer_id', developerId)
      .order('created_at', { ascending: false })
      .limit(20),
    ctx.supabaseAdmin
      .from('dev_timer')
      .select('timer_id, task_id, start_timestamp, pause_timestamp, stop_timestamp, total_seconds')
      .eq('dev_id', developerId)
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  const promiseRows = promises.data || [];
  return jsonResponse({
    active_promises: promiseRows.filter((row: any) => ['promised', 'in_progress'].includes(row.status)).length,
    breached_promises: promiseRows.filter((row: any) => row.status === 'breached').length,
    overdue_promises: promiseRows.filter((row: any) => new Date(row.deadline).getTime() < Date.now() && row.status !== 'completed').length,
    timers: timers.data || [],
  });
}

serve(async (req: Request) => {
  const rawBody = req.method === 'POST' ? await req.clone().json().catch(() => ({})) : {};
  const meta = getRequestMeta(req, rawBody as Record<string, unknown>);

  return withAuth(req, ALLOWED_ROLES, async (ctx) => {
    const body = getPayload((ctx.body || {}) as Record<string, unknown>);

    try {
      if (matches(meta.path, '/overview') && meta.method === 'GET') {
        return await handleOverview(ctx);
      }
      if (matches(meta.path, '/promise/create') && meta.method === 'POST') {
        return await handleCreatePromise(ctx, body);
      }
      if (matches(meta.path, '/timer/start') && meta.method === 'POST') {
        return await handleStartTimer(ctx, body);
      }
      if (matches(meta.path, '/timer/pause') && meta.method === 'POST') {
        return await handlePauseTimer(ctx, body);
      }
      if (matches(meta.path, '/timer/resume') && meta.method === 'POST') {
        return await handleResumeTimer(ctx, body);
      }
      if (matches(meta.path, '/timer/stop') && meta.method === 'POST') {
        const validation = validateRequired(body, ['task_id']);
        if (validation) return errorResponse(validation);
        return await stopTimerInternal(ctx, String(body.task_id), false);
      }
      if (matches(meta.path, '/timer/complete') && meta.method === 'POST') {
        const validation = validateRequired(body, ['task_id']);
        if (validation) return errorResponse(validation);
        return await stopTimerInternal(ctx, String(body.task_id), true);
      }
      if (matches(meta.path, '/repair/consistency') && meta.method === 'POST') {
        return await handleRepairConsistency(ctx);
      }
    } catch (error) {
      await logError(ctx.supabaseAdmin, {
        module: 'promise',
        endpoint: meta.path,
        error: error instanceof Error ? error.message : 'Unknown api-promise failure',
        error_code: 'API_PROMISE_FAILED',
        fix_status: 'queued',
        severity: 'high',
        user_id: ctx.user.userId,
        metadata: { method: meta.method },
      });
      return errorResponse(error instanceof Error ? error.message : 'Promise API failed', 500);
    }

    return errorResponse('Not found', 404);
  }, { module: 'promise', action: `${meta.method}:${meta.path}` });
});