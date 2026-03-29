/**
 * Performance Optimizer - System-wide performance enhancements
 * Provides memoization, debouncing, and optimization utilities
 */

import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

// ============================================
// DEBOUNCED CALLBACK - Prevents rapid re-execution
// ============================================
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);
  
  // Update callback ref on change
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]) as T;
}

// ============================================
// THROTTLED CALLBACK - Rate limiting
// ============================================
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  limit: number = 100
): T {
  const lastRan = useRef(0);
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastRan.current >= limit) {
      lastRan.current = now;
      callbackRef.current(...args);
    }
  }, [limit]) as T;
}

// ============================================
// STABLE CALLBACK - Prevents unnecessary re-renders
// ============================================
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as T;
}

// ============================================
// DEFERRED VALUE - Deprioritizes non-urgent updates
// ============================================
export function useDeferredState<T>(value: T, delay: number = 100): T {
  const [deferredValue, setDeferredValue] = useState(value);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDeferredValue(value);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [value, delay]);
  
  return deferredValue;
}

// ============================================
// INTERSECTION OBSERVER - Lazy load on visibility
// ============================================
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefObject<HTMLDivElement>, boolean] {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect(); // Once visible, stop observing
      }
    }, { threshold: 0.1, ...options });
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, []);
  
  return [elementRef, isVisible];
}

// ============================================
// CACHED COMPUTATION - Memoizes expensive operations
// ============================================
export function useCachedComputation<T, D extends any[]>(
  compute: () => T,
  deps: D,
  cacheKey?: string
): T {
  const cache = useRef<Map<string, T>>(new Map());
  const key = cacheKey || JSON.stringify(deps);
  
  return useMemo(() => {
    if (cache.current.has(key)) {
      return cache.current.get(key)!;
    }
    
    const result = compute();
    cache.current.set(key, result);
    
    // Limit cache size to prevent memory leaks
    if (cache.current.size > 50) {
      const firstKey = cache.current.keys().next().value;
      if (firstKey) cache.current.delete(firstKey);
    }
    
    return result;
  }, deps);
}

// ============================================
// REQUEST IDLE CALLBACK - Schedule low-priority work
// ============================================
export function useIdleCallback(callback: () => void, options?: IdleRequestOptions) {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(callback, options);
      return () => cancelIdleCallback(id);
    } else {
      const timeout = setTimeout(callback, 1);
      return () => clearTimeout(timeout);
    }
  }, []);
}

// ============================================
// BATCH STATE UPDATES - Combines multiple updates
// ============================================
export function useBatchedUpdates<T extends Record<string, any>>(
  initialState: T
): [T, (updates: Partial<T>) => void] {
  const [state, setState] = useState(initialState);
  const pendingUpdates = useRef<Partial<T>>({});
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const batchUpdate = useCallback((updates: Partial<T>) => {
    pendingUpdates.current = { ...pendingUpdates.current, ...updates };
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, ...pendingUpdates.current }));
      pendingUpdates.current = {};
    }, 16); // Next frame
  }, []);
  
  return [state, batchUpdate];
}

// ============================================
// PERFORMANCE METRICS - Track component performance
// ============================================
export function usePerformanceMetrics(componentName: string) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());
  
  useEffect(() => {
    renderCount.current++;
    const currentTime = performance.now();
    const timeSinceLastRender = currentTime - lastRenderTime.current;
    
    // Log slow renders in development
    if (import.meta.env.DEV && timeSinceLastRender < 16 && renderCount.current > 1) {
      console.debug(`[Perf] ${componentName}: rapid re-render (${timeSinceLastRender.toFixed(2)}ms)`);
    }
    
    lastRenderTime.current = currentTime;
  });
  
  return { renderCount: renderCount.current };
}

// ============================================
// OPTIMIZED LIST - Virtual scrolling helper
// ============================================
export function useOptimizedList<T>(
  items: T[],
  options: { pageSize?: number; prefetch?: number } = {}
) {
  const { pageSize = 20, prefetch = 5 } = options;
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: pageSize });
  
  const visibleItems = useMemo(() => {
    return items.slice(
      Math.max(0, visibleRange.start - prefetch),
      Math.min(items.length, visibleRange.end + prefetch)
    );
  }, [items, visibleRange, prefetch]);
  
  const loadMore = useCallback(() => {
    setVisibleRange(prev => ({
      start: prev.start,
      end: Math.min(items.length, prev.end + pageSize)
    }));
  }, [items.length, pageSize]);
  
  const hasMore = visibleRange.end < items.length;
  
  return { visibleItems, loadMore, hasMore, total: items.length };
}

// ============================================
// RAF SCHEDULER - Schedule animations efficiently
// ============================================
export function useRAFScheduler() {
  const rafRef = useRef<number>();
  
  const schedule = useCallback((callback: () => void) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(callback);
  }, []);
  
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);
  
  return schedule;
}

// Export combined performance hook
export function usePerformanceOptimizations() {
  return {
    useDebouncedCallback,
    useThrottledCallback,
    useStableCallback,
    useDeferredState,
    useIntersectionObserver,
    useCachedComputation,
    useIdleCallback,
    useBatchedUpdates,
    usePerformanceMetrics,
    useOptimizedList,
    useRAFScheduler
  };
}
