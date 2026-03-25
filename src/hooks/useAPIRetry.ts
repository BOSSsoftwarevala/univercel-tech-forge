import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface RetryConfig {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  timeout?: number;
  onRetry?: (attempt: number, error: Error) => void;
  onMaxRetriesReached?: (error: Error) => void;
  shouldRetry?: (error: Error) => boolean;
}

interface APIState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  attempt: number;
  lastAttemptAt: Date | null;
}

const defaultConfig: Required<Omit<RetryConfig, 'onRetry' | 'onMaxRetriesReached' | 'shouldRetry'>> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  timeout: 30000,
};

export function useAPIRetry<T>(config: RetryConfig = {}) {
  const [state, setState] = useState<APIState<T>>({
    data: null,
    loading: false,
    error: null,
    attempt: 0,
    lastAttemptAt: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const configRef = useRef({ ...defaultConfig, ...config });
  configRef.current = { ...defaultConfig, ...config };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const calculateDelay = (attempt: number): number => {
    const { initialDelay, maxDelay, backoffFactor } = configRef.current;
    const delay = initialDelay * Math.pow(backoffFactor, attempt);
    return Math.min(delay, maxDelay);
  };

  const shouldRetryError = (error: Error): boolean => {
    const { shouldRetry } = configRef.current;
    if (shouldRetry) return shouldRetry(error);

    // Default retry logic
    const message = error.message.toLowerCase();
    const isNetworkError = message.includes('network') || 
                          message.includes('fetch') ||
                          message.includes('timeout') ||
                          message.includes('connection');
    const isServerError = message.includes('500') || 
                         message.includes('502') || 
                         message.includes('503') ||
                         message.includes('504');
    
    return isNetworkError || isServerError;
  };

  const execute = useCallback(async <R = T>(
    fn: (signal: AbortSignal) => Promise<R>,
    options?: { showToast?: boolean }
  ): Promise<R | null> => {
    const { maxRetries, timeout, onRetry, onMaxRetriesReached } = configRef.current;

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setState(prev => ({ ...prev, loading: true, error: null, attempt: 0 }));

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        setState(prev => ({ ...prev, attempt, lastAttemptAt: new Date() }));

        // Create timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), timeout);
        });

        // Race between the actual request and timeout
        const result = await Promise.race([
          fn(signal),
          timeoutPromise,
        ]);

        setState(prev => ({
          ...prev,
          data: result as unknown as T,
          loading: false,
          error: null,
        }));

        return result;
      } catch (error) {
        const err = error as Error;

        // Don't retry if aborted
        if (signal.aborted) {
          setState(prev => ({ ...prev, loading: false }));
          return null;
        }

        // Check if we should retry
        if (attempt < maxRetries && shouldRetryError(err)) {
          const delay = calculateDelay(attempt);
          
          if (options?.showToast) {
            toast.warning(`Request failed, retrying in ${delay/1000}s... (${attempt + 1}/${maxRetries})`);
          }

          onRetry?.(attempt + 1, err);
          await sleep(delay);
          continue;
        }

        // Max retries reached or non-retryable error
        setState(prev => ({
          ...prev,
          loading: false,
          error: err,
        }));

        if (attempt === maxRetries) {
          onMaxRetriesReached?.(err);
          if (options?.showToast) {
            toast.error('Request failed after multiple attempts');
          }
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
      attempt: 0,
      lastAttemptAt: null,
    });
  }, [cancel]);

  return {
    ...state,
    execute,
    cancel,
    reset,
    isRetrying: state.loading && state.attempt > 0,
  };
}

// Simpler fetch wrapper with retry
export async function fetchWithRetry<T>(
  url: string,
  options?: RequestInit & { retryConfig?: RetryConfig }
): Promise<T> {
  const { retryConfig = {}, ...fetchOptions } = options || {};
  const { maxRetries = 3, initialDelay = 1000, backoffFactor = 2 } = retryConfig;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      const delay = initialDelay * Math.pow(backoffFactor, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Max retries exceeded');
}

export default useAPIRetry;
