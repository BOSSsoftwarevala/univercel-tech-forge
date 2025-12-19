import { WifiOff, RefreshCw, CloudOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useOfflineSync } from '@/hooks/useOfflineSync';

export const OfflineBanner = () => {
  const { isOnline, isSyncing, queueLength, processQueue } = useOfflineSync();

  if (isOnline && queueLength === 0) return null;

  return (
    <div 
      className={cn(
        'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
        'px-4 py-3 rounded-lg shadow-lg backdrop-blur-xl',
        'flex items-center gap-3 text-sm font-medium',
        'transition-all duration-300 animate-slide-up',
        !isOnline 
          ? 'bg-destructive/90 text-destructive-foreground' 
          : 'bg-neon-orange/90 text-background'
      )}
    >
      {!isOnline ? (
        <>
          <WifiOff className="w-5 h-5" />
          <span>You're offline. Changes will sync when connection is restored.</span>
        </>
      ) : queueLength > 0 ? (
        <>
          {isSyncing ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <CloudOff className="w-5 h-5" />
          )}
          <span>
            {isSyncing 
              ? 'Syncing changes...' 
              : `${queueLength} changes pending sync`}
          </span>
          {!isSyncing && (
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => processQueue()}
              className="ml-2 h-7"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Sync Now
            </Button>
          )}
        </>
      ) : (
        <>
          <Check className="w-5 h-5" />
          <span>All changes synced</span>
        </>
      )}
    </div>
  );
};

export default OfflineBanner;
