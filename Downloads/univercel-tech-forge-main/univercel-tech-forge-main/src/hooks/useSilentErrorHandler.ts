/**
 * SMOOTH-06: Silent Error Handler Hook
 * Handles errors gracefully without red screens or technical messages
 */

import { useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

interface ErrorLogEntry {
  error_type: string;
  message: string;
  severity: ErrorSeverity;
  module?: string;
  action?: string;
  user_id?: string;
  stack?: string;
  metadata?: Record<string, unknown>;
}

interface SilentErrorOptions {
  showNotice?: boolean;        // Show soft notice to user
  autoRetry?: boolean;         // Auto retry the action
  maxRetries?: number;         // Max retry attempts
  retryDelay?: number;         // Delay between retries (ms)
  fallbackAction?: () => void; // Fallback if all retries fail
  module?: string;             // Module name for logging
  action?: string;             // Action name for logging
}

export function useSilentErrorHandler() {
  const retryCountRef = useRef<Map<string, number>>(new Map());

  // Log error to audit (silent, no throw)
  const logError = useCallback(async (entry: ErrorLogEntry) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('audit_logs').insert([{
        user_id: user?.id || undefined,
        action: `error_${entry.error_type}`,
        module: entry.module || 'system',
        meta_json: {
          message: entry.message,
          severity: entry.severity,
          action: entry.action,
          stack: entry.stack?.substring(0, 500),
          metadata: entry.metadata as Json,
          timestamp: new Date().toISOString()
        } as Json
      }]);
    } catch {
      // Silent fail - logging should never break the app
      console.warn('[SilentErrorHandler] Failed to log error to audit');
    }
  }, []);

  // Handle error with optional retry
  const handleError = useCallback(async <T>(
    error: Error,
    actionKey: string,
    retryFn?: () => Promise<T>,
    options: SilentErrorOptions = {}
  ): Promise<T | null> => {
    const {
      showNotice = true,
      autoRetry = true,
      maxRetries = 1,
      retryDelay = 1000,
      fallbackAction,
      module,
      action
    } = options;

    // Determine severity
    const severity: ErrorSeverity = error.message.includes('network') || 
                                    error.message.includes('fetch') 
                                    ? 'medium' 
                                    : 'high';

    // Log to audit
    await logError({
      error_type: error.name || 'UnknownError',
      message: error.message,
      severity,
      module,
      action,
      stack: error.stack
    });

    // Auto retry logic
    if (autoRetry && retryFn) {
      const currentCount = retryCountRef.current.get(actionKey) || 0;
      
      if (currentCount < maxRetries) {
        retryCountRef.current.set(actionKey, currentCount + 1);
        
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        
        try {
          const result = await retryFn();
          retryCountRef.current.delete(actionKey);
          return result;
        } catch (retryError) {
          // Retry also failed
          return handleError(
            retryError instanceof Error ? retryError : new Error('Retry failed'),
            actionKey,
            undefined, // Don't retry again
            { ...options, autoRetry: false }
          );
        }
      }
    }

    // Reset retry count
    retryCountRef.current.delete(actionKey);

    // Show soft notice with POSITIVE messaging (not error popup)
    if (showNotice) {
      toast.info('Processing is taking a bit longer than expected. Please wait.', {
        duration: 3000,
        position: 'bottom-right'
      });
    }

    // Execute fallback
    fallbackAction?.();

    return null;
  }, [logError]);

  // Wrap async function with silent error handling
  const wrapAsync = useCallback(<T, A extends unknown[]>(
    fn: (...args: A) => Promise<T>,
    actionKey: string,
    options: SilentErrorOptions = {}
  ) => {
    return async (...args: A): Promise<T | null> => {
      try {
        return await fn(...args);
      } catch (error) {
        return handleError(
          error instanceof Error ? error : new Error('Unknown error'),
          actionKey,
          () => fn(...args),
          options
        );
      }
    };
  }, [handleError]);

  return {
    handleError,
    wrapAsync,
    logError
  };
}
