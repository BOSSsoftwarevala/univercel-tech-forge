import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface APIConfig {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  timeout?: number;
  showToast?: boolean;
  retryOn?: string[];
}

interface APIState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  retryCount: number;
  lastAttemptAt: Date | null;
}

const defaultConfig: Required<Omit<APIConfig, 'showToast' | 'retryOn'>> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  timeout: 30000,
};

/**
 * Universal API Wrapper for Boss Panel
 * Handles authentication, retries, timeouts, logging, and error recovery
 */
export function useBossAPI<T = any>(config: APIConfig = {}) {
  const [state, setState] = useState<APIState<T>>({
    data: null,
    loading: false,
    error: null,
    retryCount: 0,
    lastAttemptAt: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const configRef = useRef({ ...defaultConfig, ...config });

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const calculateDelay = (attempt: number): number => {
    const { initialDelay, maxDelay } = configRef.current;
    const delay = initialDelay * Math.pow(2, attempt);
    return Math.min(delay, maxDelay);
  };

  const shouldRetryError = (error: Error): boolean => {
    const { retryOn } = configRef.current;
    if (!retryOn || retryOn.length === 0) return true; // Default retry logic

    const message = error.message.toLowerCase();
    return retryOn.some(condition => message.includes(condition.toLowerCase()));
  };

  const logRequest = async (endpoint: string, method: string, success: boolean, duration: number, error?: string) => {
    try {
      await supabase.from('api_request_logs').insert({
        endpoint,
        method,
        success,
        duration_ms: duration,
        error_message: error,
        user_id: (await supabase.auth.getUser()).data.user?.id
      });
    } catch (logError) {
      console.warn('Failed to log API request:', logError);
    }
  };

  const execute = useCallback(async <R = T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      body?: any;
      params?: Record<string, any>;
      headers?: Record<string, string>;
    } = {}
  ): Promise<R | null> => {
    const { maxRetries, timeout, showToast } = configRef.current;
    const { method = 'GET', body, params, headers = {} } = options;

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setState(prev => ({ ...prev, loading: true, error: null, retryCount: 0 }));

    const startTime = Date.now();

    // Build URL with params
    let url = endpoint;
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      url += `?${searchParams.toString()}`;
    }

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        setState(prev => ({ ...prev, retryCount: attempt, lastAttemptAt: new Date() }));

        // Create timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), timeout);
        });

        // Prepare request options
        const requestOptions: RequestInit = {
          method,
          signal,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
        };

        if (body && (method === 'POST' || method === 'PUT')) {
          requestOptions.body = JSON.stringify(body);
        }

        // Make the request
        const response = await Promise.race([
          fetch(url, requestOptions),
          timeoutPromise,
        ]);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        // Validate response structure
        if (result && typeof result === 'object' && 'success' in result && !result.success) {
          throw new Error(result.message || 'API request failed');
        }

        const duration = Date.now() - startTime;
        await logRequest(endpoint, method, true, duration);

        setState(prev => ({
          ...prev,
          data: result as unknown as T,
          loading: false,
          error: null,
        }));

        return result;
      } catch (error) {
        const err = error as Error;
        const duration = Date.now() - startTime;

        // Don't retry if aborted
        if (signal.aborted) {
          setState(prev => ({ ...prev, loading: false }));
          return null;
        }

        // Check if we should retry
        if (attempt < maxRetries && shouldRetryError(err)) {
          const delay = calculateDelay(attempt);

          if (showToast) {
            toast.warning(`Request failed, retrying in ${delay/1000}s... (${attempt + 1}/${maxRetries})`);
          }

          await sleep(delay);
          continue;
        }

        // Max retries reached or non-retryable error
        await logRequest(endpoint, method, false, duration, err.message);

        setState(prev => ({
          ...prev,
          loading: false,
          error: err,
        }));

        if (attempt === maxRetries && showToast) {
          toast.error(`Request failed: ${err.message}`);
        }

        return null;
      }
    }

    return null;
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const reset = useCallback(() => {
    cancel();
    setState({
      data: null,
      loading: false,
      error: null,
      retryCount: 0,
      lastAttemptAt: null,
    });
  }, [cancel]);

  return {
    ...state,
    execute,
    cancel,
    reset,
    isRetrying: state.loading && state.retryCount > 0,
  };
}

// Specialized hooks for common Boss Panel operations
export function useBossModules() {
  const api = useBossAPI();

  const getModules = useCallback(async () => {
    return api.execute('/functions/v1/system-modules-manager', {
      method: 'POST',
      body: { action: 'get_modules' }
    });
  }, [api]);

  const enableModule = useCallback(async (moduleId: string, moduleName: string) => {
    return api.execute('/functions/v1/system-modules-manager', {
      method: 'POST',
      body: { action: 'enable_module', data: { module_id: moduleId, module_name: moduleName } }
    });
  }, [api]);

  const disableModule = useCallback(async (moduleId: string, moduleName: string) => {
    return api.execute('/functions/v1/system-modules-manager', {
      method: 'POST',
      body: { action: 'disable_module', data: { module_id: moduleId, module_name: moduleName } }
    });
  }, [api]);

  const setMaintenance = useCallback(async (moduleId: string, moduleName: string, reason?: string) => {
    return api.execute('/functions/v1/system-modules-manager', {
      method: 'POST',
      body: { action: 'set_maintenance', data: { module_id: moduleId, module_name: moduleName, reason } }
    });
  }, [api]);

  return {
    ...api,
    getModules,
    enableModule,
    disableModule,
    setMaintenance,
  };
}

export function useBossNotifications() {
  const api = useBossAPI();

  const getNotifications = useCallback(async () => {
    return api.execute('/api/boss/notifications');
  }, [api]);

  const markAsRead = useCallback(async (notificationId: string) => {
    return api.execute('/api/boss/notifications/read', {
      method: 'POST',
      body: { notification_id: notificationId }
    });
  }, [api]);

  const markAllAsRead = useCallback(async () => {
    return api.execute('/api/boss/notifications/read-all', {
      method: 'POST'
    });
  }, [api]);

  return {
    ...api,
    getNotifications,
    markAsRead,
    markAllAsRead,
  };
}

export function useBossDashboard() {
  const api = useBossAPI();

  const getDashboardData = useCallback(async () => {
    return api.execute('/api/boss/dashboard', {
      method: 'GET'
    });
  }, [api]);

  const getRealtimeStats = useCallback(async () => {
    return api.execute('/api/boss/dashboard/realtime', {
      method: 'GET'
    });
  }, [api]);

  const getRecentActivity = useCallback(async () => {
    return api.execute('/api/boss/dashboard/activity', {
      method: 'GET'
    });
  }, [api]);

  return {
    ...api,
    getDashboardData,
    getRealtimeStats,
    getRecentActivity,
  };
}