import React from 'react';
import { 
  Wifi, 
  WifiOff, 
  Signal, 
  SignalLow, 
  SignalMedium, 
  SignalHigh,
  Zap,
  Battery,
  Gauge
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useNetwork } from '@/contexts/NetworkContext';
import { PerformanceMode } from '@/hooks/useNetworkStatus';

export function NetworkIndicator() {
  const { 
    isOnline, 
    speed, 
    type, 
    downlink, 
    rtt, 
    performanceMode, 
    setPerformanceMode,
    isAutoMode,
    saveData 
  } = useNetwork();

  const getSignalIcon = () => {
    if (!isOnline) return <WifiOff className="h-4 w-4 text-red-500" />;
    
    switch (speed) {
      case 'fast':
        return <SignalHigh className="h-4 w-4 text-green-500" />;
      case 'medium':
        return <SignalMedium className="h-4 w-4 text-yellow-500" />;
      case 'slow':
        return <SignalLow className="h-4 w-4 text-orange-500" />;
      default:
        return <Signal className="h-4 w-4" />;
    }
  };

  const getModeIcon = () => {
    switch (performanceMode) {
      case 'full':
        return <Zap className="h-3 w-3" />;
      case 'lite':
        return <Gauge className="h-3 w-3" />;
      case 'ultra-lite':
        return <Battery className="h-3 w-3" />;
    }
  };

  const getModeLabel = () => {
    switch (performanceMode) {
      case 'full':
        return 'Full';
      case 'lite':
        return 'Lite';
      case 'ultra-lite':
        return 'Ultra Lite';
    }
  };

  const getModeColor = () => {
    switch (performanceMode) {
      case 'full':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'lite':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'ultra-lite':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2 px-2">
          {getSignalIcon()}
          <Badge variant="outline" className={cn("text-xs py-0 px-1.5", getModeColor())}>
            {getModeIcon()}
            <span className="ml-1">{getModeLabel()}</span>
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Network Status</span>
          <Badge variant={isOnline ? "secondary" : "destructive"}>
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Network Info */}
        <div className="px-2 py-1.5 text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Connection</span>
            <span className="font-medium">{type.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span>Speed</span>
            <span className="font-medium">{downlink.toFixed(1)} Mbps</span>
          </div>
          <div className="flex justify-between">
            <span>Latency</span>
            <span className="font-medium">{rtt}ms</span>
          </div>
          {saveData && (
            <div className="flex justify-between">
              <span>Data Saver</span>
              <span className="font-medium text-yellow-500">Enabled</span>
            </div>
          )}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Performance Mode</DropdownMenuLabel>
        
        <DropdownMenuItem 
          onClick={() => setPerformanceMode('auto')}
          className={cn(isAutoMode && "bg-accent")}
        >
          <Signal className="mr-2 h-4 w-4" />
          <div className="flex-1">
            <div>Auto</div>
            <div className="text-xs text-muted-foreground">Adapt to network</div>
          </div>
          {isAutoMode && <span className="text-xs text-primary">Active</span>}
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => setPerformanceMode('full')}
          className={cn(!isAutoMode && performanceMode === 'full' && "bg-accent")}
        >
          <Zap className="mr-2 h-4 w-4 text-green-500" />
          <div className="flex-1">
            <div>Full Mode</div>
            <div className="text-xs text-muted-foreground">All features & animations</div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => setPerformanceMode('lite')}
          className={cn(!isAutoMode && performanceMode === 'lite' && "bg-accent")}
        >
          <Gauge className="mr-2 h-4 w-4 text-yellow-500" />
          <div className="flex-1">
            <div>Lite Mode</div>
            <div className="text-xs text-muted-foreground">Reduced effects</div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => setPerformanceMode('ultra-lite')}
          className={cn(!isAutoMode && performanceMode === 'ultra-lite' && "bg-accent")}
        >
          <Battery className="mr-2 h-4 w-4 text-orange-500" />
          <div className="flex-1">
            <div>Ultra Lite</div>
            <div className="text-xs text-muted-foreground">Text-first, minimal UI</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}