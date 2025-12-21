import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Wifi, 
  WifiOff, 
  Clock, 
  MapPin,
  ToggleLeft,
  ToggleRight,
  Shield,
  FileText,
  HelpCircle,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FooterProps {
  lowDataMode: boolean;
  onDataModeToggle: () => void;
}

const GlobalFooter2035 = ({ lowDataMode, onDataModeToggle }: FooterProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [networkStatus, setNetworkStatus] = useState({
    online: true,
    effectiveType: '4g',
    downlink: 10
  });

  // Update time
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Monitor network
  useEffect(() => {
    const connection = (navigator as any).connection;
    if (connection) {
      const updateNetwork = () => {
        setNetworkStatus({
          online: navigator.onLine,
          effectiveType: connection.effectiveType || '4g',
          downlink: connection.downlink || 10
        });
      };
      updateNetwork();
      connection.addEventListener('change', updateNetwork);
      window.addEventListener('online', updateNetwork);
      window.addEventListener('offline', updateNetwork);
      return () => {
        connection.removeEventListener('change', updateNetwork);
        window.removeEventListener('online', updateNetwork);
        window.removeEventListener('offline', updateNetwork);
      };
    }
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getNetworkColor = () => {
    if (!networkStatus.online) return 'text-red-400';
    switch (networkStatus.effectiveType) {
      case '4g': return 'text-green-400';
      case '3g': return 'text-yellow-400';
      case '2g': return 'text-orange-400';
      default: return 'text-red-400';
    }
  };

  return (
    <footer className={cn(
      "h-12 flex items-center justify-between px-6 border-t",
      lowDataMode 
        ? "bg-background border-border" 
        : "bg-[#0d1025]/80 backdrop-blur-xl border-white/5"
    )}>
      {/* Left - Branch Map Link */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-xs"
        >
          <Globe className="h-3.5 w-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Live Branch Map</span>
        </Button>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>12 Active Branches</span>
        </div>
      </div>

      {/* Center - Network & Data Mode */}
      <div className="flex items-center gap-6">
        {/* Network Status */}
        <div className="flex items-center gap-2">
          {networkStatus.online ? (
            <Wifi className={cn("h-4 w-4", getNetworkColor())} />
          ) : (
            <WifiOff className="h-4 w-4 text-red-400" />
          )}
          <div className="text-xs">
            <span className={getNetworkColor()}>
              {networkStatus.online ? networkStatus.effectiveType.toUpperCase() : 'Offline'}
            </span>
            {networkStatus.online && (
              <span className="text-muted-foreground ml-1">
                ({networkStatus.downlink} Mbps)
              </span>
            )}
          </div>
        </div>

        {/* Data Mode Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onDataModeToggle}
          className="gap-2 text-xs"
        >
          {lowDataMode ? (
            <>
              <ToggleLeft className="h-4 w-4 text-muted-foreground" />
              <span>Lite Mode</span>
            </>
          ) : (
            <>
              <ToggleRight className="h-4 w-4 text-primary" />
              <span>Full Mode</span>
            </>
          )}
        </Button>

        {/* System Status */}
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-green-400" />
          <span className="text-xs text-green-400">All Systems Operational</span>
        </div>
      </div>

      {/* Right - Time & Legal */}
      <div className="flex items-center gap-4">
        {/* Legal Links */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-muted-foreground">
          <button className="hover:text-foreground transition-colors flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Privacy
          </button>
          <button className="hover:text-foreground transition-colors flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Terms
          </button>
          <button className="hover:text-foreground transition-colors flex items-center gap-1">
            <HelpCircle className="h-3 w-3" />
            Help
          </button>
        </div>

        {/* System Clock */}
        <div className="flex items-center gap-2 text-xs">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <div className="font-mono">
            <span className="text-foreground">{formatTime(currentTime)}</span>
            <span className="text-muted-foreground ml-2 hidden sm:inline">
              {formatDate(currentTime)}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter2035;
