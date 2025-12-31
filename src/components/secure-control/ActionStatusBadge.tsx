import { Badge } from '@/components/ui/badge';
import { Clock, Lock, ArrowUpRight, AlertOctagon, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ActionStatus = 'pending' | 'locked' | 'forwarded' | 'blocked' | 'approved';

interface ActionStatusBadgeProps {
  status: ActionStatus;
  className?: string;
}

const statusConfig: Record<ActionStatus, {
  icon: typeof Clock;
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}> = {
  pending: {
    icon: Clock,
    label: 'PENDING',
    bgClass: 'bg-yellow-950/50',
    textClass: 'text-yellow-400',
    borderClass: 'border-yellow-800/50'
  },
  locked: {
    icon: Lock,
    label: 'LOCKED',
    bgClass: 'bg-blue-950/50',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-800/50'
  },
  forwarded: {
    icon: ArrowUpRight,
    label: 'FORWARDED',
    bgClass: 'bg-purple-950/50',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-800/50'
  },
  blocked: {
    icon: AlertOctagon,
    label: 'BLOCKED',
    bgClass: 'bg-red-950/50',
    textClass: 'text-red-400',
    borderClass: 'border-red-800/50'
  },
  approved: {
    icon: CheckCircle,
    label: 'APPROVED',
    bgClass: 'bg-green-950/50',
    textClass: 'text-green-400',
    borderClass: 'border-green-800/50'
  }
};

export function ActionStatusBadge({ status, className }: ActionStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "flex items-center gap-1.5 px-2 py-1",
        config.bgClass,
        config.textClass,
        config.borderClass,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      <span className="text-xs font-medium tracking-wider">{config.label}</span>
    </Badge>
  );
}
