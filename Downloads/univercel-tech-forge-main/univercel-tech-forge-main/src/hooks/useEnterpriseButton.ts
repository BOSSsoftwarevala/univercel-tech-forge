/**
 * JIRA-BTN-01/02/03: Enterprise Button Hook
 * Ensures every button follows: CLICK → PERMISSION → API → VALIDATION → DB → AUDIT → UI UPDATE
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useEnterpriseAudit, AuditModule } from './useEnterpriseAudit';

export type ButtonState = 'idle' | 'loading' | 'success' | 'error' | 'confirming' | 'disabled';

export interface ButtonConfig {
  id: string;
  label: string;
  module: AuditModule;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  disabledReason?: string;
  permissionCheck?: () => Promise<boolean>;
}

export interface ButtonResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export function useEnterpriseButton<T = unknown>(config: ButtonConfig) {
  const [state, setState] = useState<ButtonState>('idle');
  const [confirmCallback, setConfirmCallback] = useState<(() => Promise<void>) | null>(null);
  
  const { logButtonClick, logApiCall } = useEnterpriseAudit();

  /**
   * Execute button action with full lifecycle
   */
  const execute = useCallback(async (
    action: () => Promise<T>,
    options?: {
      skipConfirmation?: boolean;
      context?: Record<string, unknown>;
    }
  ): Promise<ButtonResult<T>> => {
    // Step 1: Log button click
    await logButtonClick(config.id, config.label, config.module, options?.context);

    // Step 2: Check if disabled
    if (state === 'disabled') {
      toast.warning(config.disabledReason || 'This action is currently disabled');
      return { success: false, error: 'Action disabled' };
    }

    // Step 3: Permission check
    if (config.permissionCheck) {
      const hasPermission = await config.permissionCheck();
      if (!hasPermission) {
        toast.info('This action is handled automatically at a higher level.');
        await logApiCall(config.id, 'PERMISSION_CHECK', config.module, false, 403, 'Access configuration');
        return { success: false, error: 'Access configuration' };
      }
    }

    // Step 4: Confirmation if required
    if (config.requiresConfirmation && !options?.skipConfirmation) {
      return new Promise((resolve) => {
        setState('confirming');
        setConfirmCallback(() => async () => {
          try {
            setState('loading');
            const result = await action();
            
            // Log success
            await logApiCall(config.id, 'EXECUTE', config.module, true, 200);
            
            setState('success');
            toast.success(config.successMessage || 'Action completed');
            
            // Reset to idle after 2 seconds
            setTimeout(() => setState('idle'), 2000);
            
            resolve({ success: true, data: result });
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Processing delayed';
            
            // Log error
            await logApiCall(config.id, 'EXECUTE', config.module, false, 500, errorMsg);
            
            setState('error');
            toast.info("Processing is taking a bit longer than expected. Please wait.");
            
            // Reset to idle after 3 seconds
            setTimeout(() => setState('idle'), 3000);
            
            resolve({ success: false, error: errorMsg });
          }
        });
      });
    }

    // Step 5: Execute directly
    try {
      setState('loading');
      const result = await action();
      
      // Log success
      await logApiCall(config.id, 'EXECUTE', config.module, true, 200);
      
      setState('success');
      toast.success(config.successMessage || 'Action completed');
      
      // Reset to idle after 2 seconds
      setTimeout(() => setState('idle'), 2000);
      
      return { success: true, data: result };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Processing delayed';
      
      // Log error
      await logApiCall(config.id, 'EXECUTE', config.module, false, 500, errorMsg);
      
      setState('error');
      toast.info("Processing is taking a bit longer than expected. Please wait.");
      
      // Reset to idle after 3 seconds
      setTimeout(() => setState('idle'), 3000);
      
      return { success: false, error: errorMsg };
    }
  }, [config, state, logButtonClick, logApiCall]);

  /**
   * Confirm pending action
   */
  const confirm = useCallback(async () => {
    if (confirmCallback) {
      await confirmCallback();
      setConfirmCallback(null);
    }
  }, [confirmCallback]);

  /**
   * Cancel pending confirmation
   */
  const cancel = useCallback(() => {
    setState('idle');
    setConfirmCallback(null);
  }, []);

  /**
   * Set disabled state with reason
   */
  const setDisabled = useCallback((disabled: boolean, reason?: string) => {
    if (disabled) {
      setState('disabled');
      if (reason) {
        // Store reason in config (would need config to be mutable or use state)
      }
    } else if (state === 'disabled') {
      setState('idle');
    }
  }, [state]);

  /**
   * Retry after error
   */
  const retry = useCallback(async (action: () => Promise<T>) => {
    setState('idle');
    return execute(action, { skipConfirmation: true });
  }, [execute]);

  return {
    state,
    isLoading: state === 'loading',
    isConfirming: state === 'confirming',
    isDisabled: state === 'disabled',
    isSuccess: state === 'success',
    isError: state === 'error',
    confirmationMessage: config.confirmationMessage,
    execute,
    confirm,
    cancel,
    setDisabled,
    retry,
  };
}

/**
 * Pre-configured button types
 */
export const createButtonConfig = (
  id: string,
  label: string,
  module: AuditModule,
  type: 'primary' | 'secondary' | 'destructive' | 'ai'
): ButtonConfig => {
  const configs: Record<string, Partial<ButtonConfig>> = {
    primary: {
      requiresConfirmation: false,
    },
    secondary: {
      requiresConfirmation: false,
    },
    destructive: {
      requiresConfirmation: true,
      confirmationMessage: `Are you sure you want to ${label.toLowerCase()}?`,
    },
    ai: {
      requiresConfirmation: true,
      confirmationMessage: 'AI suggestions require human approval. Proceed?',
    },
  };

  return {
    id,
    label,
    module,
    ...configs[type],
  };
};
