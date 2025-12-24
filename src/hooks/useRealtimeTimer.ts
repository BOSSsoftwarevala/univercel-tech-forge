import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  startTime: Date | null;
  pauseTime: Date | null;
  elapsedSeconds: number;
  currentTaskId: string | null;
  pauseReason: string | null;
}

export const useRealtimeTimer = () => {
  const queryClient = useQueryClient();
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    isPaused: false,
    startTime: null,
    pauseTime: null,
    elapsedSeconds: 0,
    currentTaskId: null,
    pauseReason: null
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const visibilityRef = useRef(true);

  // Fetch current timer state from database
  const { data: dbTimerState, refetch: refetchTimer } = useQuery({
    queryKey: ['dev-timer'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('dev_timer')
        .select('*')
        .eq('dev_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    staleTime: 0
  });

  // Sync local state with database state
  useEffect(() => {
    if (dbTimerState) {
      const isRunning = !!dbTimerState.start_timestamp && !dbTimerState.stop_timestamp;
      const isPaused = !!dbTimerState.pause_timestamp && !dbTimerState.stop_timestamp;
      
      setTimerState({
        isRunning,
        isPaused,
        startTime: dbTimerState.start_timestamp ? new Date(dbTimerState.start_timestamp) : null,
        pauseTime: dbTimerState.pause_timestamp ? new Date(dbTimerState.pause_timestamp) : null,
        elapsedSeconds: dbTimerState.total_seconds || 0,
        currentTaskId: dbTimerState.task_id || null,
        pauseReason: null
      });
    }
  }, [dbTimerState]);

  // Realtime subscription for timer updates
  useEffect(() => {
    const channel = supabase
      .channel('timer-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dev_timer'
        },
        (payload) => {
          console.log('Timer update:', payload);
          refetchTimer();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchTimer]);

  // Update elapsed time every second when running
  useEffect(() => {
    if (timerState.isRunning && !timerState.isPaused && timerState.startTime) {
      intervalRef.current = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - timerState.startTime!.getTime()) / 1000);
        setTimerState(prev => ({ ...prev, elapsedSeconds: elapsed }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, timerState.isPaused, timerState.startTime]);

  // Auto-pause on tab visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && timerState.isRunning && !timerState.isPaused) {
        visibilityRef.current = false;
        pauseTimer('Tab switched - auto paused');
      } else if (!document.hidden && !visibilityRef.current) {
        visibilityRef.current = true;
        toast.info('Timer was auto-paused. Resume when ready.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timerState.isRunning, timerState.isPaused]);

  // Start timer mutation
  const startTimerMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const now = new Date().toISOString();

      // Insert new timer record
      const { error } = await supabase
        .from('dev_timer')
        .insert({
          dev_id: user.id,
          task_id: taskId,
          start_timestamp: now,
          total_seconds: 0
        });

      if (error) throw error;

      // Log timer start
      await supabase.from('developer_timer_logs').insert({
        developer_id: user.id,
        task_id: taskId,
        action: 'start',
        timestamp: now
      });

      // Update task status
      await supabase
        .from('developer_tasks')
        .update({ status: 'in_progress', started_at: now })
        .eq('id', taskId);

      return taskId;
    },
    onSuccess: (taskId) => {
      setTimerState(prev => ({
        ...prev,
        isRunning: true,
        isPaused: false,
        startTime: new Date(),
        currentTaskId: taskId,
        elapsedSeconds: 0
      }));
      queryClient.invalidateQueries({ queryKey: ['dev-timer'] });
      queryClient.invalidateQueries({ queryKey: ['developer-tasks'] });
      toast.success('Timer started!');
    }
  });

  // Pause timer
  const pauseTimer = useCallback(async (reason: string = 'Manual pause') => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !dbTimerState) return;

    const now = new Date().toISOString();

    await supabase
      .from('dev_timer')
      .update({
        pause_timestamp: now,
        total_seconds: timerState.elapsedSeconds
      })
      .eq('timer_id', dbTimerState.timer_id);

    // Log pause
    await supabase.from('developer_timer_logs').insert({
      developer_id: user.id,
      task_id: timerState.currentTaskId,
      action: 'pause',
      pause_reason: reason,
      timestamp: now,
      elapsed_minutes: Math.floor(timerState.elapsedSeconds / 60)
    });

    setTimerState(prev => ({
      ...prev,
      isPaused: true,
      pauseTime: new Date(),
      pauseReason: reason
    }));

    queryClient.invalidateQueries({ queryKey: ['dev-timer'] });
  }, [timerState.elapsedSeconds, timerState.currentTaskId, queryClient, dbTimerState]);

  // Resume timer
  const resumeTimer = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !dbTimerState) return;

    const now = new Date();
    const pauseDuration = timerState.pauseTime 
      ? Math.floor((now.getTime() - timerState.pauseTime.getTime()) / 1000)
      : 0;

    // Adjust start time to account for pause duration
    const newStartTime = timerState.startTime 
      ? new Date(timerState.startTime.getTime() + pauseDuration * 1000)
      : now;

    await supabase
      .from('dev_timer')
      .update({
        pause_timestamp: null,
        start_timestamp: newStartTime.toISOString()
      })
      .eq('timer_id', dbTimerState.timer_id);

    // Log resume
    await supabase.from('developer_timer_logs').insert({
      developer_id: user.id,
      task_id: timerState.currentTaskId,
      action: 'resume',
      timestamp: now.toISOString()
    });

    setTimerState(prev => ({
      ...prev,
      isPaused: false,
      pauseTime: null,
      pauseReason: null,
      startTime: newStartTime
    }));

    queryClient.invalidateQueries({ queryKey: ['dev-timer'] });
    toast.success('Timer resumed!');
  }, [timerState.pauseTime, timerState.startTime, timerState.currentTaskId, queryClient, dbTimerState]);

  // Stop timer
  const stopTimer = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !dbTimerState) return;

    const now = new Date().toISOString();

    await supabase
      .from('dev_timer')
      .update({
        stop_timestamp: now,
        total_seconds: timerState.elapsedSeconds
      })
      .eq('timer_id', dbTimerState.timer_id);

    // Log stop
    await supabase.from('developer_timer_logs').insert({
      developer_id: user.id,
      task_id: timerState.currentTaskId,
      action: 'stop',
      timestamp: now,
      elapsed_minutes: Math.floor(timerState.elapsedSeconds / 60)
    });

    setTimerState({
      isRunning: false,
      isPaused: false,
      startTime: null,
      pauseTime: null,
      elapsedSeconds: 0,
      currentTaskId: null,
      pauseReason: null
    });

    queryClient.invalidateQueries({ queryKey: ['dev-timer'] });
  }, [timerState.currentTaskId, timerState.elapsedSeconds, queryClient, dbTimerState]);

  // Format time helper
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timerState,
    formattedTime: formatTime(timerState.elapsedSeconds),
    startTimer: startTimerMutation.mutate,
    pauseTimer,
    resumeTimer,
    stopTimer,
    isStarting: startTimerMutation.isPending
  };
};

export default useRealtimeTimer;
