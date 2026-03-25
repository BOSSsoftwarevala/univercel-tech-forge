import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  variant?: 'card' | 'table' | 'chart' | 'stat' | 'list' | 'text';
  count?: number;
  className?: string;
}

const Skeleton = ({ className }: { className?: string }) => (
  <div 
    className={cn(
      'bg-secondary/50 rounded animate-pulse',
      className
    )} 
  />
);

export const SkeletonLoader = ({ 
  variant = 'card', 
  count = 1,
  className 
}: SkeletonLoaderProps) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="glass-panel overflow-hidden">
            <div className="p-4 border-b border-border/30">
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="divide-y divide-border/20">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </div>
        );

      case 'chart':
        return (
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="h-64 flex items-end gap-2 pt-4">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-secondary/50 rounded animate-pulse"
                  style={{ height: `${20 + (i * 5) % 60}%` }} 
                />
              ))}
            </div>
            <div className="flex justify-between">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-3 w-8" />
              ))}
            </div>
          </div>
        );

      case 'stat':
        return (
          <div className="glass-panel p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-full" />
          </div>
        );

      case 'list':
        return (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        );

      case 'text':
        return (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        );

      default:
        return <Skeleton className="h-24 w-full" />;
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {[...Array(count)].map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
