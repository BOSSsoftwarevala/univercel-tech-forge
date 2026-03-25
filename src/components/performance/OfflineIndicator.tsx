import React, { useEffect, useState } from 'react';
import { WifiOff, RefreshCw, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useNetwork } from '@/contexts/NetworkContext';
import { useCache } from '@/lib/cache/indexedDB';

export function OfflineIndicator() {
  const { isOnline } = useNetwork();
  const { getOfflineQueue, clearOfflineQueue } = useCache();
  const [pendingActions, setPendingActions] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Check for pending offline actions
  useEffect(() => {
    const checkQueue = async () => {
      const queue = await getOfflineQueue();
      setPendingActions(queue.length);
    };
    checkQueue();
    
    const interval = setInterval(checkQueue, 5000);
    return () => clearInterval(interval);
  }, [getOfflineQueue]);

  // Show/hide banner based on online status
  useEffect(() => {
    if (!isOnline) {
      setShowBanner(true);
    } else {
      // Keep showing for a moment then hide
      const timer = setTimeout(() => setShowBanner(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  // Sync pending actions when back online
  const handleSync = async () => {
    if (!isOnline || isSyncing) return;
    
    setIsSyncing(true);
    try {
      const queue = await getOfflineQueue();
      
      for (const action of queue) {
        try {
          // Process each queued action
          await fetch(action.endpoint, {
            method: action.method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(action.body),
          });
        } catch (error) {
          console.error('Sync error for action:', action, error);
        }
      }
      
      await clearOfflineQueue();
      setPendingActions(0);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!showBanner && pendingActions === 0) return null;

  return (
    <div className={cn(
      "fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50",
      "transition-transform duration-300",
      showBanner ? "translate-y-0" : "translate-y-24"
    )}>
      {!isOnline ? (
        <Alert variant="destructive" className="border-orange-500/50 bg-orange-500/10">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>You're offline</AlertTitle>
          <AlertDescription>
            Don't worry! Your changes are saved locally and will sync when you're back online.
            {pendingActions > 0 && (
              <span className="block mt-1 text-xs">
                {pendingActions} action{pendingActions > 1 ? 's' : ''} pending
              </span>
            )}
          </AlertDescription>
        </Alert>
      ) : pendingActions > 0 ? (
        <Alert className="border-blue-500/50 bg-blue-500/10">
          <AlertTriangle className="h-4 w-4 text-blue-500" />
          <AlertTitle className="text-blue-500">Back online</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{pendingActions} pending action{pendingActions > 1 ? 's' : ''}</span>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleSync}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-1" />
              )}
              Sync now
            </Button>
          </AlertDescription>
        </Alert>
      ) : showBanner ? (
        <Alert className="border-green-500/50 bg-green-500/10">
          <Check className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-500">Back online</AlertTitle>
          <AlertDescription>
            All changes are synced!
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
