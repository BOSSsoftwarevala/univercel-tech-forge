import { AppRole, ROLE_CONFIG, ROLE_GRADES } from '@/types/roles';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RoleBadgeProps {
  role: AppRole;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

export function RoleBadge({ role, size = 'md', showTooltip = true, className }: RoleBadgeProps) {
  const config = ROLE_CONFIG[role];
  const gradeInfo = ROLE_GRADES[role];
  
  if (!config) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const badge = (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: `${config.color}20`,
        color: config.color,
        borderColor: `${config.color}40`,
      }}
    >
      {config.label}
    </span>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{gradeInfo?.displayName || config.label}</p>
          <p className="text-xs text-muted-foreground">{gradeInfo?.gradeLabel}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
