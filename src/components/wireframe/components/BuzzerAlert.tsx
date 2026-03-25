import React from 'react';
import { AlertTriangle, Bell, Clock, X, Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BuzzerAlertProps {
  type: 'lead' | 'task' | 'demo' | 'escalation';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  countdown?: number;
  onAccept?: () => void;
  onDismiss?: () => void;
  isDark?: boolean;
}

export function BuzzerAlert({
  type,
  title,
  description,
  priority,
  countdown,
  onAccept,
  onDismiss,
  isDark = true
}: BuzzerAlertProps) {
  const priorityColors = {
    high: 'bg-red-500 border-red-500',
    medium: 'bg-amber-500 border-amber-500',
    low: 'bg-blue-500 border-blue-500'
  };

  const typeIcons = {
    lead: Bell,
    task: Clock,
    demo: AlertTriangle,
    escalation: AlertTriangle
  };

  const Icon = typeIcons[type];

  return (
    <div className={`relative overflow-hidden rounded-xl border-2 animate-pulse ${priorityColors[priority]} ${
      isDark ? 'bg-slate-900' : 'bg-white'
    }`}>
      {/* Animated Border */}
      <div className={`absolute inset-0 bg-gradient-to-r ${
        priority === 'high' ? 'from-red-500/20 to-orange-500/20' :
        priority === 'medium' ? 'from-amber-500/20 to-yellow-500/20' :
        'from-blue-500/20 to-cyan-500/20'
      } animate-pulse`} />

      <div className="relative p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${priorityColors[priority]}`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold">{title}</h3>
                <Badge variant="outline" className="text-[10px] uppercase">
                  {type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>

          {/* Countdown */}
          {countdown !== undefined && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-bold font-mono">{countdown}s</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button 
            onClick={onAccept}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500"
          >
            <Check className="h-4 w-4 mr-2" />
            Accept
          </Button>
          <Button 
            variant="outline" 
            onClick={onDismiss}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-2" />
            Dismiss
          </Button>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
