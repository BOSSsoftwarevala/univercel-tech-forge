/**
 * Hardened Timer & Promise Engine - Enterprise Security
 * - Backend validation for all timer operations
 * - No task without promise enforcement
 * - SLA violation detection with automatic penalties
 * - Audit logging for all actions
 */

import { supabase } from '@/integrations/supabase/client';
import { promiseApi } from '@/lib/api/promise';
import { AppRole } from './rbac';

export interface TimerState {
  taskId: string;
  developerId: string;
  startTime: string | null;
  pauseTime: string | null;
  stopTime: string | null;
  totalSeconds: number;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'breached';
  slaDeadline: string | null;
  promiseId: string | null;
}

export interface PromiseLog {
  id: string;
  developerId: string;
  taskId: string;
  promisedDeadline: string;
  actualDeadline?: string;
  status: 'promised' | 'in_progress' | 'completed' | 'breached' | 'extended';
  breachReason?: string;
  scoreEffect: number;
  extensionCount: number;
  createdAt: string;
}

// SLA penalty configuration
export const SLA_PENALTY_CONFIG = {
  warning: { threshold: 0.5, penaltyPercent: 0 }, // 50% time remaining
  critical: { threshold: 0.25, penaltyPercent: 5 }, // 25% time remaining
  overdue: { threshold: 0, penaltyPercent: 10 }, // Past deadline
  severeOverdue: { threshold: -0.5, penaltyPercent: 20 }, // 50% past deadline
} as const;

// Create a new promise (required before starting timer)
export const createPromise = async (
  developerId: string,
  taskId: string,
  estimatedHours: number
): Promise<{ success: boolean; promiseId?: string; error?: string }> => {
  try {
    const result = await promiseApi.createPromise({ taskId, developerId, estimatedHours });
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to create promise' };
    }
    return { success: true, promiseId: result.promiseId };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to create promise' };
  }
};

// Start timer (requires existing promise)
export const startTimer = async (
  taskId: string,
  developerId: string
): Promise<{ success: boolean; timerId?: string; error?: string }> => {
  try {
    const result = await promiseApi.startTimer(taskId);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to start timer' };
    }
    return { success: true, timerId: result.timerId };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to start timer' };
  }
};

// Pause timer (requires valid reason)
export const pauseTimer = async (
  taskId: string,
  developerId: string,
  pauseReason: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!pauseReason || pauseReason.trim().length < 10) {
      return { success: false, error: 'Pause reason must be at least 10 characters' };
    }
    const result = await promiseApi.pauseTimer(taskId, pauseReason);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to pause timer' };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to pause timer' };
  }
};

// Complete timer and mark task done
export const completeTimer = async (
  taskId: string,
  developerId: string
): Promise<{ success: boolean; scoreEffect?: number; error?: string }> => {
  try {
    const result = await promiseApi.completeTimer(taskId);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to complete timer' };
    }
    return { success: true, scoreEffect: result.scoreEffect };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to complete timer' };
  }
};

// Check SLA status for a task
export const checkSLAStatus = (
  remainingSeconds: number,
  totalSeconds: number
): { status: 'on-track' | 'warning' | 'critical' | 'overdue'; penaltyPercent: number } => {
  const ratio = remainingSeconds / totalSeconds;

  if (ratio <= SLA_PENALTY_CONFIG.overdue.threshold) {
    return { status: 'overdue', penaltyPercent: SLA_PENALTY_CONFIG.overdue.penaltyPercent };
  }
  if (ratio <= SLA_PENALTY_CONFIG.critical.threshold) {
    return { status: 'critical', penaltyPercent: SLA_PENALTY_CONFIG.critical.penaltyPercent };
  }
  if (ratio <= SLA_PENALTY_CONFIG.warning.threshold) {
    return { status: 'warning', penaltyPercent: SLA_PENALTY_CONFIG.warning.penaltyPercent };
  }
  return { status: 'on-track', penaltyPercent: 0 };
};

// Record SLA violation
export const recordSLAViolation = async (
  taskId: string,
  developerId: string,
  severity: 'warning' | 'critical' | 'breach',
  penaltyPercent: number
): Promise<void> => {
  try {
    await supabase.from('developer_violations').insert({
      developer_id: developerId,
      task_id: taskId,
      violation_type: 'sla_breach',
      severity: severity === 'breach' ? 'critical' : 'strike',
      description: `SLA violation - ${severity} level`,
      penalty_amount: penaltyPercent,
      auto_generated: true,
    });

    // Create buzzer for super_admin
    await supabase.from('buzzer_queue').insert({
      trigger_type: 'sla_violation',
      priority: severity === 'breach' ? 'urgent' : 'high',
      role_target: 'super_admin',
      task_id: taskId,
      status: 'pending',
      auto_escalate_after: 180,
    });
  } catch (error) {
    console.error('Failed to record SLA violation:', error);
  }
};

// Log timer event for audit
const logTimerEvent = async (
  action: string,
  taskId: string,
  developerId: string,
  details: Record<string, any>
): Promise<void> => {
  try {
    await supabase.from('audit_logs').insert({
      action,
      module: 'timer_promise',
      user_id: developerId,
      meta_json: {
        task_id: taskId,
        ...details,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Failed to log timer event:', error);
  }
};

// Format seconds to HH:MM:SS
export const formatTimerDisplay = (seconds: number): string => {
  const hrs = Math.floor(Math.abs(seconds) / 3600);
  const mins = Math.floor((Math.abs(seconds) % 3600) / 60);
  const secs = Math.abs(seconds) % 60;
  const sign = seconds < 0 ? '-' : '';
  return `${sign}${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
