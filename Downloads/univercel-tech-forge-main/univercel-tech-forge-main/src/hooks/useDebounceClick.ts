/**
 * SMOOTH-03: Button Debounce & Safe Click Hook
 * Prevents double clicks, duplicate submissions, and accidental multi-clicks
 */

import { useCallback, useRef, useState } from 'react';

interface DebounceClickOptions {
  delay?: number;           // Debounce delay in ms (default: 300)
  showProcessing?: boolean; // Show processing state
  onStart?: () => void;     // Called when action starts
  onComplete?: () => void;  // Called when action completes
  onError?: (error: Error) => void;
}

interface DebounceClickReturn {
  handleClick: (action: () => Promise<void> | void) => Promise<void>;
  isProcessing: boolean;
  lastClickTime: number | null;
}

export function useDebounceClick(options: DebounceClickOptions = {}): DebounceClickReturn {
  const {
    delay = 300,
    showProcessing = true,
    onStart,
    onComplete,
    onError
  } = options;

  const [isProcessing, setIsProcessing] = useState(false);
  const lastClickTimeRef = useRef<number | null>(null);
  const processingRef = useRef(false);

  const handleClick = useCallback(async (action: () => Promise<void> | void) => {
    const now = Date.now();
    
    // Debounce check - prevent clicks within delay window
    if (lastClickTimeRef.current && (now - lastClickTimeRef.current) < delay) {
      return;
    }
    
    // Prevent double execution while processing
    if (processingRef.current) {
      return;
    }

    lastClickTimeRef.current = now;
    processingRef.current = true;
    
    if (showProcessing) {
      setIsProcessing(true);
    }
    
    onStart?.();

    try {
      await action();
      onComplete?.();
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      processingRef.current = false;
      if (showProcessing) {
        setIsProcessing(false);
      }
    }
  }, [delay, showProcessing, onStart, onComplete, onError]);

  return {
    handleClick,
    isProcessing,
    lastClickTime: lastClickTimeRef.current
  };
}

/**
 * Higher-order function for wrapping button onClick handlers
 */
export function createSafeClick<T extends unknown[]>(
  handler: (...args: T) => Promise<void> | void,
  debounceMs = 300
): (...args: T) => void {
  let lastCall = 0;
  let isRunning = false;

  return (...args: T) => {
    const now = Date.now();
    
    if (now - lastCall < debounceMs || isRunning) {
      return;
    }
    
    lastCall = now;
    isRunning = true;
    
    Promise.resolve(handler(...args)).finally(() => {
      isRunning = false;
    });
  };
}
