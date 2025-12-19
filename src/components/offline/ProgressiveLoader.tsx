/**
 * Progressive Loader
 * Shows skeleton while content loads, with retry on failure
 */

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { RefreshCw, AlertCircle, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOffline } from '@/lib/offline/offline-context';
import { SkeletonCard, SkeletonList } from './SkeletonDashboard';
import { cn } from '@/lib/utils';

interface ProgressiveLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  onRetry?: () => void;
  minLoadTime?: number;
  className?: string;
}

export function ProgressiveLoader({
  children,
  fallback,
  errorFallback,
  onRetry,
  minLoadTime = 300,
  className
}: ProgressiveLoaderProps) {
  const { isOnline } = useOffline();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), minLoadTime);
    return () => clearTimeout(timer);
  }, [minLoadTime]);

  if (!ready) {
    return <>{fallback || <SkeletonCard />}</>;
  }

  return (
    <Suspense fallback={fallback || <SkeletonCard />}>
      <ErrorBoundary
        fallback={errorFallback}
        onRetry={onRetry}
        isOnline={isOnline}
        className={className}
      >
        {children}
      </ErrorBoundary>
    </Suspense>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onRetry?: () => void;
  isOnline: boolean;
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={cn(
          'flex flex-col items-center justify-center p-8 text-center space-y-4',
          this.props.className
        )}>
          {!this.props.isOnline ? (
            <>
              <WifiOff className="h-12 w-12 text-amber-400" />
              <div>
                <p className="font-medium text-foreground">You're offline</p>
                <p className="text-sm text-muted-foreground">
                  This content requires an internet connection
                </p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div>
                <p className="font-medium text-foreground">Something went wrong</p>
                <p className="text-sm text-muted-foreground">
                  {this.state.error?.message || 'Failed to load content'}
                </p>
              </div>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={this.handleRetry}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Lazy component wrapper with automatic code splitting
 */
export function lazyLoad<P extends object>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = React.lazy(importFn);

  return function LazyLoadedComponent(props: P) {
    return (
      <ProgressiveLoader fallback={fallback || <SkeletonList />}>
        <LazyComponent {...props} />
      </ProgressiveLoader>
    );
  };
}
