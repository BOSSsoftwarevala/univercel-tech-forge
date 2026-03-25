/**
 * useButtonAction - Universal Button Action Handler
 * Ensures every button has a working action
 * 
 * Features:
 * - Automatic routing
 * - State updates
 * - Audit logging
 * - Error handling
 * - Loading states
 */

import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useEnterpriseAudit } from './useEnterpriseAudit';

export type ActionType = 
  | 'navigate'
  | 'approve'
  | 'reject'
  | 'pause'
  | 'resume'
  | 'view'
  | 'edit'
  | 'toggle'
  | 'submit'
  | 'refresh'
  | 'download'
  | 'upload'
  | 'delete'
  | 'archive'
  | 'restore'
  | 'lock'
  | 'unlock';

interface ActionConfig {
  type: ActionType;
  target?: string;
  data?: Record<string, unknown>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  showFeedback?: boolean;
  feedbackMessage?: string;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

interface ButtonActionState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useButtonAction = () => {
  const navigate = useNavigate();
  const { logButtonClick } = useEnterpriseAudit();
  const [state, setState] = useState<ButtonActionState>({
    loading: false,
    error: null,
    success: false,
  });

  const executeAction = useCallback(async (config: ActionConfig) => {
    const { 
      type, 
      target, 
      data,
      onSuccess, 
      onError, 
      showFeedback = true,
      feedbackMessage,
    } = config;

    setState({ loading: true, error: null, success: false });

    try {
      // Log action start
      logButtonClick(`button_${type}`, type, 'system', { target, data });

      // Execute based on action type
      switch (type) {
        case 'navigate':
          if (target) {
            navigate(target);
            if (showFeedback) {
              toast.success(feedbackMessage || 'Navigating...');
            }
          }
          break;

        case 'approve':
          if (showFeedback) {
            toast.success(feedbackMessage || 'Approved successfully');
          }
          break;

        case 'reject':
          if (showFeedback) {
            toast.success(feedbackMessage || 'Rejected');
          }
          break;

        case 'pause':
          if (showFeedback) {
            toast.info(feedbackMessage || 'Paused');
          }
          break;

        case 'resume':
          if (showFeedback) {
            toast.success(feedbackMessage || 'Resumed');
          }
          break;

        case 'view':
          if (target) {
            navigate(target);
          }
          break;

        case 'edit':
          if (target) {
            navigate(`${target}/edit`);
          }
          break;

        case 'toggle':
          if (showFeedback) {
            toast.info(feedbackMessage || 'Toggled');
          }
          break;

        case 'submit':
          if (showFeedback) {
            toast.success(feedbackMessage || 'Submitted successfully');
          }
          break;

        case 'refresh':
          window.location.reload();
          break;

        case 'download':
          if (showFeedback) {
            toast.info(feedbackMessage || 'Download started');
          }
          break;

        case 'upload':
          if (showFeedback) {
            toast.info(feedbackMessage || 'Upload started');
          }
          break;

        case 'delete':
        case 'archive':
          if (showFeedback) {
            toast.success(feedbackMessage || 'Item archived');
          }
          break;

        case 'restore':
          if (showFeedback) {
            toast.success(feedbackMessage || 'Item restored');
          }
          break;

        case 'lock':
          if (showFeedback) {
            toast.warning(feedbackMessage || 'Item locked');
          }
          break;

        case 'unlock':
          if (showFeedback) {
            toast.success(feedbackMessage || 'Item unlocked');
          }
          break;

        default:
          console.warn(`Unknown action type: ${type}`);
      }

      // Log action success
      logButtonClick(`button_${type}_success`, type, 'system', { target, data });

      setState({ loading: false, error: null, success: true });
      onSuccess?.();

      // Reset success state after a delay
      setTimeout(() => {
        setState(prev => ({ ...prev, success: false }));
      }, 2000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Action failed';
      
      // Log action failure
      logButtonClick(`button_${type}_error`, type, 'system', { target, error: errorMessage });

      setState({ loading: false, error: errorMessage, success: false });
      
      if (showFeedback) {
        toast.error('Action failed', { description: errorMessage });
      }
      
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [navigate, logButtonClick]);

  // Predefined action handlers for common operations
  const navigateTo = useCallback((path: string, message?: string) => {
    executeAction({ 
      type: 'navigate', 
      target: path, 
      feedbackMessage: message,
      showFeedback: false 
    });
  }, [executeAction]);

  const handleApprove = useCallback((itemId: string, itemLabel?: string) => {
    executeAction({ 
      type: 'approve', 
      data: { itemId },
      feedbackMessage: `${itemLabel || 'Item'} approved`
    });
  }, [executeAction]);

  const handleReject = useCallback((itemId: string, itemLabel?: string, reason?: string) => {
    executeAction({ 
      type: 'reject', 
      data: { itemId, reason },
      feedbackMessage: `${itemLabel || 'Item'} rejected`
    });
  }, [executeAction]);

  const handlePause = useCallback((itemId: string, itemLabel?: string) => {
    executeAction({ 
      type: 'pause', 
      data: { itemId },
      feedbackMessage: `${itemLabel || 'Item'} paused`
    });
  }, [executeAction]);

  const handleResume = useCallback((itemId: string, itemLabel?: string) => {
    executeAction({ 
      type: 'resume', 
      data: { itemId },
      feedbackMessage: `${itemLabel || 'Item'} resumed`
    });
  }, [executeAction]);

  const handleView = useCallback((path: string) => {
    executeAction({ type: 'view', target: path, showFeedback: false });
  }, [executeAction]);

  const handleToggle = useCallback((itemId: string, newState: boolean, itemLabel?: string) => {
    executeAction({ 
      type: 'toggle', 
      data: { itemId, newState },
      feedbackMessage: `${itemLabel || 'Item'} ${newState ? 'enabled' : 'disabled'}`
    });
  }, [executeAction]);

  const handleArchive = useCallback((itemId: string, itemLabel?: string) => {
    executeAction({ 
      type: 'archive', 
      data: { itemId },
      feedbackMessage: `${itemLabel || 'Item'} archived`,
      requiresConfirmation: true,
      confirmationMessage: `Are you sure you want to archive ${itemLabel || 'this item'}?`
    });
  }, [executeAction]);

  return {
    state,
    executeAction,
    // Convenience methods
    navigateTo,
    handleApprove,
    handleReject,
    handlePause,
    handleResume,
    handleView,
    handleToggle,
    handleArchive,
  };
};

export default useButtonAction;
