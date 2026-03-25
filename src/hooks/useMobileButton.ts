/**
 * Mobile Button Hook
 * Ensures reliable button behavior on mobile with haptics and debounce
 */

import { useState, useCallback, useRef } from 'react';
import { useCapacitorMobile } from './useCapacitorMobile';

interface MobileButtonOptions {
  debounceMs?: number;
  hapticStyle?: 'light' | 'medium' | 'heavy';
  showLoading?: boolean;
}

interface MobileButtonState {
  isProcessing: boolean;
  isDisabled: boolean;
  error: string | null;
}

export function useMobileButton(options: MobileButtonOptions = {}) {
  const { debounceMs = 300, hapticStyle = 'light', showLoading = true } = options;
  const { isNative, triggerHaptic } = useCapacitorMobile();
  
  const [state, setState] = useState<MobileButtonState>({
    isProcessing: false,
    isDisabled: false,
    error: null
  });

  const lastClickRef = useRef<number>(0);
  const processingRef = useRef<boolean>(false);

  /**
   * Handle button click with debounce, haptics, and loading state
   */
  const handleClick = useCallback(async <T>(
    action: () => Promise<T> | T
  ): Promise<T | null> => {
    const now = Date.now();

    // Debounce check
    if (now - lastClickRef.current < debounceMs) {
      return null;
    }

    // Already processing check
    if (processingRef.current) {
      return null;
    }

    lastClickRef.current = now;
    processingRef.current = true;

    // Trigger haptic feedback
    if (isNative) {
      await triggerHaptic(hapticStyle);
    }

    if (showLoading) {
      setState(prev => ({ ...prev, isProcessing: true, error: null }));
    }

    try {
      const result = await action();
      
      setState(prev => ({ ...prev, isProcessing: false, error: null }));
      processingRef.current = false;
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Action failed';
      
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: errorMessage 
      }));
      processingRef.current = false;
      
      // Heavy haptic on error
      if (isNative) {
        await triggerHaptic('heavy');
      }
      
      return null;
    }
  }, [debounceMs, hapticStyle, showLoading, isNative, triggerHaptic]);

  /**
   * Reset button state
   */
  const reset = useCallback(() => {
    setState({
      isProcessing: false,
      isDisabled: false,
      error: null
    });
    processingRef.current = false;
  }, []);

  /**
   * Disable button temporarily
   */
  const disable = useCallback((disabled: boolean = true) => {
    setState(prev => ({ ...prev, isDisabled: disabled }));
  }, []);

  return {
    ...state,
    handleClick,
    reset,
    disable,
    isClickable: !state.isProcessing && !state.isDisabled
  };
}
