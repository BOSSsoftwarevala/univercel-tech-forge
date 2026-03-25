/**
 * Lazy Route Loading - Performance Optimized
 * Reduces initial bundle size by code-splitting all routes
 */

import React, { Suspense, lazy, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

// Fast loading skeleton for route transitions
export const RouteLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center space-y-3">
      <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Minimal skeleton for quick loads
export const MinimalLoader = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-6 h-6 text-primary animate-spin" />
  </div>
);

// Lazy load wrapper with preload support
export function lazyRoute<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback: React.ReactNode = <RouteLoader />
) {
  const LazyComponent = lazy(importFn);
  
  const WrappedComponent = (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
  
  // Attach preload method for route prefetching
  (WrappedComponent as any).preload = importFn;
  
  return WrappedComponent;
}

// Preload routes on hover/focus for instant navigation
export function preloadRoute(importFn: () => Promise<any>) {
  importFn();
}
