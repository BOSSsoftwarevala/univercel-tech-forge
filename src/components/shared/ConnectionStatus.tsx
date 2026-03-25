import { Wifi, WifiOff, Signal, SignalLow, SignalMedium, SignalHigh } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  isConnected: boolean;
  quality: 'excellent' | 'good' | 'poor' | 'offline';
  latency?: number;
  showLatency?: boolean;
  className?: string;
}

export const ConnectionStatus = ({
  isConnected,
  quality,
  latency,
  showLatency = true,
  className
}: ConnectionStatusProps) => {
  const getIcon = () => {
    if (!isConnected || quality === 'offline') {
      return <WifiOff className="w-4 h-4" />;
    }
    
    switch (quality) {
      case 'excellent':
        return <SignalHigh className="w-4 h-4" />;
      case 'good':
        return <SignalMedium className="w-4 h-4" />;
      case 'poor':
        return <SignalLow className="w-4 h-4" />;
      default:
        return <Signal className="w-4 h-4" />;
    }
  };

  const getColor = () => {
    if (!isConnected || quality === 'offline') return 'text-destructive';
    switch (quality) {
      case 'excellent':
        return 'text-neon-green';
      case 'good':
        return 'text-neon-cyan';
      case 'poor':
        return 'text-neon-orange';
      default:
        return 'text-muted-foreground';
    }
  };

  const getLabel = () => {
    if (!isConnected || quality === 'offline') return 'Offline';
    switch (quality) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'poor':
        return 'Slow';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={cn('flex items-center gap-2', getColor(), className)}>
      {getIcon()}
      <span className="text-xs font-medium">{getLabel()}</span>
      {showLatency && latency !== undefined && isConnected && (
        <span className="text-xs opacity-70">{latency}ms</span>
      )}
    </div>
  );
};

export default ConnectionStatus;
