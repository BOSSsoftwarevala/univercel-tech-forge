import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, WifiOff, Cloud, CloudOff, RefreshCw, 
  Database, Download, Upload, Check, AlertTriangle,
  Zap, Signal, SignalLow, SignalMedium
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

interface CacheEntry {
  id: string;
  name: string;
  size: string;
  lastSync: Date;
  status: 'synced' | 'pending' | 'error';
  priority: 'critical' | 'high' | 'normal';
}

interface SyncQueue {
  id: string;
  action: string;
  data: string;
  timestamp: Date;
  retries: number;
}

const mockCache: CacheEntry[] = [
  { id: '1', name: 'Lead Data', size: '2.4 MB', lastSync: new Date(Date.now() - 300000), status: 'synced', priority: 'critical' },
  { id: '2', name: 'Task Queue', size: '1.1 MB', lastSync: new Date(Date.now() - 600000), status: 'synced', priority: 'critical' },
  { id: '3', name: 'Demo Links', size: '0.8 MB', lastSync: new Date(Date.now() - 900000), status: 'pending', priority: 'high' },
  { id: '4', name: 'Chat Messages', size: '3.2 MB', lastSync: new Date(Date.now() - 1200000), status: 'synced', priority: 'high' },
  { id: '5', name: 'User Profiles', size: '0.5 MB', lastSync: new Date(Date.now() - 1800000), status: 'synced', priority: 'normal' },
];

const mockQueue: SyncQueue[] = [
  { id: '1', action: 'UPDATE_LEAD', data: 'Lead #4523', timestamp: new Date(Date.now() - 120000), retries: 0 },
  { id: '2', action: 'SEND_MESSAGE', data: 'Chat message', timestamp: new Date(Date.now() - 180000), retries: 1 },
];

export function OfflineFirstMode() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lowDataMode, setLowDataMode] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'4g' | '3g' | '2g' | 'offline'>('4g');
  const [cache, setCache] = useState<CacheEntry[]>(mockCache);
  const [syncQueue, setSyncQueue] = useState<SyncQueue[]>(mockQueue);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [cacheSize, setCacheSize] = useState(8.0);
  const [maxCache, setMaxCache] = useState(50);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back Online",
        description: "Syncing pending changes...",
      });
      triggerSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline Mode",
        description: "Changes will sync when connection is restored.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerSync = () => {
    if (!isOnline || isSyncing) return;
    
    setIsSyncing(true);
    setSyncProgress(0);

    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          setCache(cache.map(c => ({ ...c, status: 'synced' as const, lastSync: new Date() })));
          setSyncQueue([]);
          toast({
            title: "Sync Complete",
            description: "All data has been synchronized.",
          });
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 500);
  };

  const clearCache = () => {
    setCacheSize(0.5);
    toast({
      title: "Cache Cleared",
      description: "Local cache has been cleared. Essential data will be re-downloaded.",
    });
  };

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case '4g': return Signal;
      case '3g': return SignalMedium;
      case '2g': return SignalLow;
      case 'offline': return WifiOff;
      default: return Signal;
    }
  };

  const ConnectionIcon = getConnectionIcon();

  const getConnectionColor = () => {
    switch (connectionQuality) {
      case '4g': return 'text-green-500';
      case '3g': return 'text-yellow-500';
      case '2g': return 'text-orange-500';
      case 'offline': return 'text-red-500';
      default: return 'text-green-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-mono font-bold text-foreground flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Offline-First Mode
          </h2>
          <p className="text-sm text-muted-foreground">2G compatible • Auto-sync • Low-data optimization</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
            isOnline ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
          }`}>
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-mono ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 border border-border/30`}>
            <ConnectionIcon className={`w-4 h-4 ${getConnectionColor()}`} />
            <span className="text-sm font-mono text-foreground uppercase">{connectionQuality}</span>
          </div>
        </div>
      </div>

      {/* Low Data Mode Toggle */}
      <div className="glass-panel p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Low Data Mode (2G Compatible)</h3>
              <p className="text-sm text-muted-foreground">Reduces data usage by 80% • Optimized for slow connections</p>
            </div>
          </div>
          <Switch checked={lowDataMode} onCheckedChange={setLowDataMode} />
        </div>

        <AnimatePresence>
          {lowDataMode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-border/30"
            >
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-lg bg-background/50">
                  <p className="text-xs text-muted-foreground">Images</p>
                  <p className="text-sm font-mono text-orange-500">Compressed</p>
                </div>
                <div className="p-3 rounded-lg bg-background/50">
                  <p className="text-xs text-muted-foreground">Animations</p>
                  <p className="text-sm font-mono text-orange-500">Disabled</p>
                </div>
                <div className="p-3 rounded-lg bg-background/50">
                  <p className="text-xs text-muted-foreground">Sync Interval</p>
                  <p className="text-sm font-mono text-orange-500">5 min</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cache Status */}
      <div className="glass-panel p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-foreground flex items-center gap-2">
            <Cloud className="w-5 h-5 text-primary" />
            Local Cache
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {cacheSize.toFixed(1)} MB / {maxCache} MB
            </span>
            <Button variant="outline" size="sm" onClick={clearCache}>
              Clear Cache
            </Button>
          </div>
        </div>

        <Progress value={(cacheSize / maxCache) * 100} className="h-2 mb-4" />

        <div className="space-y-2">
          {cache.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 rounded-lg bg-background/30"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  entry.status === 'synced' ? 'bg-green-500' :
                  entry.status === 'pending' ? 'bg-orange-500 animate-pulse' : 'bg-red-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.size} • Last sync: {Math.floor((Date.now() - entry.lastSync.getTime()) / 60000)}m ago
                  </p>
                </div>
              </div>
              <Badge variant="outline" className={
                entry.priority === 'critical' ? 'border-red-500/50 text-red-500' :
                entry.priority === 'high' ? 'border-orange-500/50 text-orange-500' : ''
              }>
                {entry.priority}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sync Queue */}
      <div className="glass-panel p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-foreground flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Sync Queue
            {syncQueue.length > 0 && (
              <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/50">
                {syncQueue.length} pending
              </Badge>
            )}
          </h3>
          <Button 
            onClick={triggerSync} 
            disabled={!isOnline || isSyncing || syncQueue.length === 0}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing && 'animate-spin'}`} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>

        {isSyncing && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Syncing...</span>
              <span className="font-mono text-primary">{Math.round(syncProgress)}%</span>
            </div>
            <Progress value={syncProgress} className="h-2" />
          </div>
        )}

        {syncQueue.length > 0 ? (
          <div className="space-y-2">
            {syncQueue.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg bg-orange-500/5 border border-orange-500/20"
              >
                <div className="flex items-center gap-3">
                  <Upload className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.data}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {Math.floor((Date.now() - item.timestamp.getTime()) / 60000)}m ago
                  </p>
                  {item.retries > 0 && (
                    <p className="text-xs text-orange-500">Retry #{item.retries}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Check className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p>All changes synced</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OfflineFirstMode;
