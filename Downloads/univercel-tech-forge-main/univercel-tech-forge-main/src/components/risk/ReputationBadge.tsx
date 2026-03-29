import React from 'react';
import { Star, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReputationBadgeProps {
  starRating: number;
  trustIndex: number;
  size?: 'sm' | 'md' | 'lg';
  showTrend?: boolean;
  trend?: 'up' | 'down' | 'stable';
}

export function ReputationBadge({ 
  starRating, 
  trustIndex, 
  size = 'md',
  showTrend = false,
  trend = 'stable'
}: ReputationBadgeProps) {
  const getTrustColor = (trust: number) => {
    if (trust >= 80) return 'text-green-500';
    if (trust >= 60) return 'text-yellow-500';
    if (trust >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getTrustBg = (trust: number) => {
    if (trust >= 80) return 'bg-green-500/10';
    if (trust >= 60) return 'bg-yellow-500/10';
    if (trust >= 40) return 'bg-orange-500/10';
    return 'bg-red-500/10';
  };

  const sizeClasses = {
    sm: 'text-xs p-1.5',
    md: 'text-sm p-2',
    lg: 'text-base p-3',
  };

  const starSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className={cn(
      "inline-flex items-center gap-2 rounded-lg",
      getTrustBg(trustIndex),
      sizeClasses[size]
    )}>
      <div className="flex items-center gap-1">
        <Star className={cn(starSize[size], "fill-yellow-400 text-yellow-400")} />
        <span className="font-medium">{starRating.toFixed(1)}</span>
      </div>
      <div className={cn("border-l border-current/20 pl-2 flex items-center gap-1", getTrustColor(trustIndex))}>
        <span className="font-medium">{trustIndex}%</span>
        <span className="text-muted-foreground">trust</span>
        {showTrend && (
          <TrendIcon className={cn(
            starSize[size],
            trend === 'up' ? 'text-green-500' : 
            trend === 'down' ? 'text-red-500' : 
            'text-muted-foreground'
          )} />
        )}
      </div>
    </div>
  );
}