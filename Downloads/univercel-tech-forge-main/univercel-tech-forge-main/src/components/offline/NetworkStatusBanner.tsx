/**
 * Network Status Banner
 * Shows offline/slow connection status with sync info
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, CloudOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { useOffline } from '@/lib/offline/offline-context';
import { cn } from '@/lib/utils';

interface NetworkStatusBannerProps {
  className?: string;
}

export function NetworkStatusBanner({ className }: NetworkStatusBannerProps) {
  const { isOnline, networkQuality, pendingActions, forceSync } = useOffline();

  const shouldShow = !isOnline || networkQuality === '2g' || pendingActions > 0;

  if (!shouldShow) return null;

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        message: 'You\'re offline',
        subMessage: pendingActions > 0 ? `${pendingActions} actions queued` : 'Data will sync when connected',
        color: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        iconColor: 'text-amber-400'
      };
    }

    if (networkQuality === '2g') {
      return {
        icon: AlertTriangle,
        message: 'Slow connection detected',
        subMessage: 'Using low-data mode for better performance',
        color: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
        iconColor: 'text-orange-400'
      };
    }

    if (pendingActions > 0) {
      return {
        icon: RefreshCw,
        message: 'Syncing...',
        subMessage: `${pendingActions} actions remaining`,
        color: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
        iconColor: 'text-cyan-400 animate-spin'
      };
    }

    return null;
  };

  const status = getStatusInfo();
  if (!status) return null;

  const Icon = status.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className={cn(
          'border-b backdrop-blur-sm',
          status.color,
          className
        )}
      >
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <Icon className={cn('h-4 w-4', status.iconColor)} />
            <div>
              <span className="text-sm font-medium">{status.message}</span>
              <span className="text-xs opacity-75 ml-2">{status.subMessage}</span>
            </div>
          </div>
          
          {isOnline && pendingActions > 0 && (
            <button
              onClick={forceSync}
              className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              Sync Now
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
