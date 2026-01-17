import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { 
  Loader2, AlertCircle, FileX, Search, Inbox, RefreshCw, 
  WifiOff, ServerCrash, Clock, CheckCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Loading State
interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'skeleton' | 'pulse';
  className?: string;
}

export function LoadingState({ 
  message = 'Loading...', 
  size = 'md',
  variant = 'spinner',
  className 
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  if (variant === 'skeleton') {
    return (
      <div className={cn('space-y-4 p-6', className)}>
        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
        <div className="h-32 w-full bg-muted rounded animate-pulse" />
        <div className="flex gap-4">
          <div className="h-10 w-24 bg-muted rounded animate-pulse" />
          <div className="h-10 w-24 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('flex flex-col items-center justify-center py-12', className)}
    >
      <Loader2 className={cn('animate-spin text-primary mb-4', sizeClasses[size])} />
      <p className="text-sm text-muted-foreground">{message}</p>
    </motion.div>
  );
}

// Error State
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  variant?: 'default' | 'network' | 'server' | 'timeout';
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading the data.',
  onRetry,
  retryLabel = 'Try Again',
  variant = 'default',
  className,
}: ErrorStateProps) {
  const icons = {
    default: AlertCircle,
    network: WifiOff,
    server: ServerCrash,
    timeout: Clock,
  };
  const Icon = icons[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col items-center justify-center py-12 text-center', className)}
    >
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          {retryLabel}
        </Button>
      )}
    </motion.div>
  );
}

// Empty State
interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ElementType;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'search' | 'inbox' | 'file';
  className?: string;
}

export function EmptyState({
  title = 'No data found',
  message = 'There is nothing to display here yet.',
  icon,
  action,
  variant = 'default',
  className,
}: EmptyStateProps) {
  const icons = {
    default: Inbox,
    search: Search,
    inbox: Inbox,
    file: FileX,
  };
  const Icon = icon || icons[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col items-center justify-center py-12 text-center', className)}
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{message}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}

// Success State
interface SuccessStateProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  autoHide?: boolean;
  onAutoHide?: () => void;
}

export function SuccessState({
  title = 'Success!',
  message = 'The operation completed successfully.',
  action,
  className,
  autoHide = false,
  onAutoHide,
}: SuccessStateProps) {
  React.useEffect(() => {
    if (autoHide && onAutoHide) {
      const timer = setTimeout(onAutoHide, 3000);
      return () => clearTimeout(timer);
    }
  }, [autoHide, onAutoHide]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn('flex flex-col items-center justify-center py-12 text-center', className)}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.1 }}
        className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4"
      >
        <CheckCircle className="w-8 h-8 text-green-500" />
      </motion.div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{message}</p>
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}

// Combined State Handler
interface StateHandlerProps {
  loading?: boolean;
  error?: Error | string | null;
  empty?: boolean;
  children: ReactNode;
  onRetry?: () => void;
  loadingMessage?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyAction?: { label: string; onClick: () => void };
}

export function StateHandler({
  loading,
  error,
  empty,
  children,
  onRetry,
  loadingMessage,
  emptyTitle,
  emptyMessage,
  emptyAction,
}: StateHandlerProps) {
  if (loading) {
    return <LoadingState message={loadingMessage} />;
  }

  if (error) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }

  if (empty) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        action={emptyAction}
      />
    );
  }

  return <>{children}</>;
}

export default StateHandler;
