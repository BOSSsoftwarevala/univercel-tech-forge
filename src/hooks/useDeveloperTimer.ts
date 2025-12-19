import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  startTime: Date | null;
  pauseTime: Date | null;
  totalPausedMs: number;
  elapsedSeconds: number;
  taskId: string | null;
  hasAgreed: boolean;
}

interface Task {
  id: string;
  title: string;
  status: string;
  deadline?: string;
  estimated_hours?: number;
  promised_delivery_at?: string;
}

export function useDeveloperTimer() {
  const { user } = useAuth();
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    isPaused: false,
    startTime: null,
    pauseTime: null,
    totalPausedMs: 0,
    elapsedSeconds: 0,
    taskId: null,
    hasAgreed: false
  });
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate elapsed time
  const calculateElapsed = useCallback(() => {
    if (!timerState.startTime) return 0;
    
    const now = timerState.isPaused && timerState.pauseTime 
      ? timerState.pauseTime 
      : new Date();
    
    const elapsedMs = now.getTime() - timerState.startTime.getTime() - timerState.totalPausedMs;
    return Math.floor(elapsedMs / 1000);
  }, [timerState.startTime, timerState.isPaused, timerState.pauseTime, timerState.totalPausedMs]);

  // Accept task with "I Agree" - starts timer
  const acceptTask = useCallback(async (taskId: string) => {
    if (!user) return false;

    try {
      // Update task status
      const { data: task, error: taskError } = await supabase
        .from('developer_tasks')
        .update({
          status: 'in_progress',
          accepted_at: new Date().toISOString(),
          started_at: new Date().toISOString(),
          developer_id: user.id
        })
        .eq('id', taskId)
        .select()
        .single();

      if (taskError) throw taskError;

      // Log timer start
      await supabase.from('developer_timer_logs').insert({
        task_id: taskId,
        developer_id: user.id,
        action: 'start',
        timestamp: new Date().toISOString()
      });

      // Start timer
      const startTime = new Date();
      setTimerState({
        isRunning: true,
        isPaused: false,
        startTime,
        pauseTime: null,
        totalPausedMs: 0,
        elapsedSeconds: 0,
        taskId,
        hasAgreed: true
      });

      setCurrentTask(task);
      toast.success('Task accepted. Timer started!');
      return true;
    } catch (err) {
      console.error('Error accepting task:', err);
      toast.error('Failed to accept task');
      return false;
    }
  }, [user]);

  // Pause timer
  const pauseTimer = useCallback(async (reason: string) => {
    if (!timerState.isRunning || timerState.isPaused || !timerState.taskId || !user) return false;

    try {
      const pauseTime = new Date();
      const elapsed = calculateElapsed();

      // Log pause
      await supabase.from('developer_timer_logs').insert({
        task_id: timerState.taskId,
        developer_id: user.id,
        action: 'pause',
        pause_reason: reason,
        elapsed_minutes: Math.floor(elapsed / 60),
        timestamp: pauseTime.toISOString()
      });

      // Update task
      await supabase
        .from('developer_tasks')
        .update({
          paused_at: pauseTime.toISOString(),
          pause_reason: reason
        })
        .eq('id', timerState.taskId);

      setTimerState(prev => ({
        ...prev,
        isPaused: true,
        pauseTime
      }));

      toast.info('Timer paused');
      return true;
    } catch (err) {
      console.error('Error pausing timer:', err);
      return false;
    }
  }, [timerState, user, calculateElapsed]);

  // Resume timer
  const resumeTimer = useCallback(async () => {
    if (!timerState.isPaused || !timerState.pauseTime || !timerState.taskId || !user) return false;

    try {
      const resumeTime = new Date();
      const pausedMs = resumeTime.getTime() - timerState.pauseTime.getTime();

      // Log resume
      await supabase.from('developer_timer_logs').insert({
        task_id: timerState.taskId,
        developer_id: user.id,
        action: 'resume',
        timestamp: resumeTime.toISOString()
      });

      // Update task
      await supabase
        .from('developer_tasks')
        .update({
          paused_at: null,
          pause_reason: null,
          total_paused_minutes: Math.floor((timerState.totalPausedMs + pausedMs) / 60000)
        })
        .eq('id', timerState.taskId);

      setTimerState(prev => ({
        ...prev,
        isPaused: false,
        pauseTime: null,
        totalPausedMs: prev.totalPausedMs + pausedMs
      }));

      toast.success('Timer resumed');
      return true;
    } catch (err) {
      console.error('Error resuming timer:', err);
      return false;
    }
  }, [timerState, user]);

  // Complete task
  const completeTask = useCallback(async (deliveryNotes?: string) => {
    if (!timerState.taskId || !user) return false;

    try {
      const completedAt = new Date();
      const elapsed = calculateElapsed();

      // Log completion
      await supabase.from('developer_timer_logs').insert({
        task_id: timerState.taskId,
        developer_id: user.id,
        action: 'complete',
        elapsed_minutes: Math.floor(elapsed / 60),
        timestamp: completedAt.toISOString()
      });

      // Update task
      await supabase
        .from('developer_tasks')
        .update({
          status: 'completed',
          completed_at: completedAt.toISOString(),
          actual_delivery_at: completedAt.toISOString(),
          delivery_notes: deliveryNotes
        })
        .eq('id', timerState.taskId);

      // Reset timer
      setTimerState({
        isRunning: false,
        isPaused: false,
        startTime: null,
        pauseTime: null,
        totalPausedMs: 0,
        elapsedSeconds: 0,
        taskId: null,
        hasAgreed: false
      });
      setCurrentTask(null);

      toast.success('Task completed!');
      return true;
    } catch (err) {
      console.error('Error completing task:', err);
      toast.error('Failed to complete task');
      return false;
    }
  }, [timerState, user, calculateElapsed]);

  // Make promise
  const makePromise = useCallback(async (promisedDeliveryAt: Date) => {
    if (!timerState.taskId || !user) return false;

    try {
      await supabase
        .from('developer_tasks')
        .update({
          promised_at: new Date().toISOString(),
          promised_delivery_at: promisedDeliveryAt.toISOString()
        })
        .eq('id', timerState.taskId);

      // Log promise
      await supabase.from('promise_logs').insert({
        task_id: timerState.taskId,
        developer_id: user.id,
        status: 'promised',
        deadline: promisedDeliveryAt.toISOString()
      });

      toast.success('Promise made! Deliver on time.');
      return true;
    } catch (err) {
      console.error('Error making promise:', err);
      return false;
    }
  }, [timerState.taskId, user]);

  // Format time display
  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Update elapsed time every second
  useEffect(() => {
    if (timerState.isRunning && !timerState.isPaused) {
      intervalRef.current = setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          elapsedSeconds: calculateElapsed()
        }));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, timerState.isPaused, calculateElapsed]);

  return {
    timerState,
    currentTask,
    acceptTask,
    pauseTimer,
    resumeTimer,
    completeTask,
    makePromise,
    formatTime,
    elapsedFormatted: formatTime(timerState.elapsedSeconds)
  };
}
