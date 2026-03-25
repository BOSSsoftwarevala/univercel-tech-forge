import { callEdgeRoute } from '@/lib/api/edge-client';

export interface PromiseApiResult {
  success: boolean;
  promiseId?: string;
  timerId?: string;
  scoreEffect?: number;
  error?: string;
  elapsedSeconds?: number;
  repaired?: number;
}

async function postRoute<T>(path: string, body?: Record<string, unknown>) {
  const response = await callEdgeRoute<T>('api-promise', path, {
    method: 'POST',
    body,
    module: 'promise',
  });
  return response.data;
}

async function getRoute<T>(path: string, query?: Record<string, string | number | boolean | undefined | null>) {
  const response = await callEdgeRoute<T>('api-promise', path, {
    query,
    module: 'promise',
  });
  return response.data;
}

export const promiseApi = {
  createPromise(payload: { taskId: string; developerId?: string; estimatedHours?: number; deadline?: string }) {
    return postRoute<PromiseApiResult>('promise/create', {
      task_id: payload.taskId,
      developer_id: payload.developerId,
      estimated_hours: payload.estimatedHours,
      deadline: payload.deadline,
    });
  },

  startTimer(taskId: string) {
    return postRoute<PromiseApiResult>('timer/start', { task_id: taskId });
  },

  pauseTimer(taskId: string, reason: string) {
    return postRoute<PromiseApiResult>('timer/pause', { task_id: taskId, reason });
  },

  resumeTimer(taskId?: string) {
    return postRoute<PromiseApiResult>('timer/resume', { task_id: taskId || null });
  },

  stopTimer(taskId: string) {
    return postRoute<PromiseApiResult>('timer/stop', { task_id: taskId });
  },

  completeTimer(taskId: string) {
    return postRoute<PromiseApiResult>('timer/complete', { task_id: taskId });
  },

  repairConsistency() {
    return postRoute<PromiseApiResult>('repair/consistency');
  },

  getOverview() {
    return getRoute<Record<string, unknown>>('overview');
  },
};