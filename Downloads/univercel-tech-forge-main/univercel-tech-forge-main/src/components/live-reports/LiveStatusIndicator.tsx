import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LiveStatusIndicatorProps {
  status: 'online' | 'offline' | 'force_logout' | 'pending';
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
  className?: string;
}

export function LiveStatusIndicator({ 
  status, 
  size = 'md', 
  showPulse = true,
  className 
}: LiveStatusIndicatorProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    force_logout: 'bg-red-500',
    pending: 'bg-yellow-500',
  };

  const pulseColors = {
    online: 'bg-green-400',
    offline: 'bg-gray-400',
    force_logout: 'bg-red-400',
    pending: 'bg-yellow-400',
  };

  return (
    <span className={cn("relative inline-flex", className)}>
      {showPulse && status === 'online' && (
        <motion.span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75",
            pulseColors[status]
          )}
          animate={{ scale: [1, 1.5, 1], opacity: [0.75, 0, 0.75] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      <span
        className={cn(
          "relative inline-flex rounded-full",
          sizeClasses[size],
          statusColors[status]
        )}
      />
    </span>
  );
}

export function getStatusFromUserData(data: {
  is_online: boolean;
  force_logged_out: boolean;
  pending_approval: boolean;
}): 'online' | 'offline' | 'force_logout' | 'pending' {
  if (data.force_logged_out) return 'force_logout';
  if (data.pending_approval) return 'pending';
  if (data.is_online) return 'online';
  return 'offline';
}

export function getStatusLabel(status: 'online' | 'offline' | 'force_logout' | 'pending'): string {
  switch (status) {
    case 'online': return 'Active Now';
    case 'offline': return 'Offline';
    case 'force_logout': return 'Force Logged Out';
    case 'pending': return 'Pending Approval';
  }
}
