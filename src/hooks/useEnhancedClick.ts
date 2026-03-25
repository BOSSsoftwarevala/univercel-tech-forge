/**
 * Enhanced Click Handler - Ultra-fast, debounced actions
 * Prevents duplicate clicks, provides haptic feedback
 */

import { useCallback, useRef, useState } from 'react';
import { useEnterpriseAudit, AuditModule } from './useEnterpriseAudit';

interface UseEnhancedClickOptions {
  debounceMs?: number;
  auditModule?: AuditModule;
  auditAction?: string;
  hapticFeedback?: boolean;
}

export function useEnhancedClick(
  handler: () => void | Promise<void>,
  options: UseEnhancedClickOptions = {}
) {
  const {
    debounceMs = 300,
    auditModule,
    auditAction,
    hapticFeedback = true
  } = options;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const lastClickTime = useRef(0);
  const { logAction } = useEnterpriseAudit();
  
  const handleClick = useCallback(async () => {
    const now = Date.now();
    
    // Debounce rapid clicks
    if (now - lastClickTime.current < debounceMs) {
      return;
    }
    
    lastClickTime.current = now;
    
    // Prevent double processing
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Haptic feedback (if supported)
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }
      
      // Log action if audit enabled
      if (auditModule && auditAction) {
        await logAction({
          action: auditAction,
          module: auditModule,
          severity: 'low'
        });
      }
      
      // Execute handler
      await handler();
    } catch (error) {
      console.error('Click handler error:', error);
    } finally {
      // Allow next click after short delay
      setTimeout(() => {
        setIsProcessing(false);
      }, 100);
    }
  }, [handler, debounceMs, isProcessing, auditModule, auditAction, hapticFeedback, logAction]);
  
  return {
    onClick: handleClick,
    isProcessing,
    disabled: isProcessing
  };
}

// Simple debounced click hook
export function useQuickClick(handler: () => void, debounceMs = 200) {
  const lastClick = useRef(0);
  
  return useCallback(() => {
    const now = Date.now();
    if (now - lastClick.current >= debounceMs) {
      lastClick.current = now;
      handler();
    }
  }, [handler, debounceMs]);
}

// Throttled callback for scroll/resize events
export function useThrottledHandler<T extends (...args: any[]) => any>(
  handler: T,
  throttleMs = 100
): T {
  const lastExec = useRef(0);
  const handlerRef = useRef(handler);
  handlerRef.current = handler;
  
  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastExec.current >= throttleMs) {
      lastExec.current = now;
      return handlerRef.current(...args);
    }
  }, [throttleMs]) as T;
}

export default useEnhancedClick;
