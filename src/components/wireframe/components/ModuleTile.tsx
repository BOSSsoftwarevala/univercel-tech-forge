import React from 'react';
import { GripVertical, MoreVertical, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ModuleTileProps {
  title: string;
  icon: LucideIcon;
  color: string;
  stats: {
    pending: number;
    active: number;
    done: number;
  };
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onClick?: () => void;
  isDraggable?: boolean;
  isDark?: boolean;
}

export function ModuleTile({
  title,
  icon: Icon,
  color,
  stats,
  trend,
  trendValue,
  onClick,
  isDraggable = true,
  isDark = true
}: ModuleTileProps) {
  return (
    <div 
      className={`group relative p-4 rounded-xl border transition-all hover:shadow-lg cursor-pointer ${
        isDark 
          ? 'bg-slate-800/50 border-slate-700 hover:border-cyan-500/50' 
          : 'bg-white border-gray-200 hover:border-cyan-500'
      }`}
      onClick={onClick}
    >
      {/* Drag Handle */}
      {isDraggable && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      {/* More Options */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-2 top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <MoreVertical className="h-3 w-3" />
      </Button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2.5 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{title}</h3>
          {trend && (
            <div className={`flex items-center gap-1 text-xs ${
              trend === 'up' ? 'text-emerald-500' : 'text-red-500'
            }`}>
              {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2 rounded-lg bg-amber-500/10">
          <p className="text-lg font-bold text-amber-500">{stats.pending}</p>
          <p className="text-[10px] text-muted-foreground">Pending</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-cyan-500/10">
          <p className="text-lg font-bold text-cyan-500">{stats.active}</p>
          <p className="text-[10px] text-muted-foreground">Active</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-emerald-500/10">
          <p className="text-lg font-bold text-emerald-500">{stats.done}</p>
          <p className="text-[10px] text-muted-foreground">Done</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-3 flex items-center justify-between">
        <Badge variant="outline" className="text-[10px]">
          View Details
        </Badge>
        <ExternalLink className="h-3 w-3 text-muted-foreground" />
      </div>
    </div>
  );
}
