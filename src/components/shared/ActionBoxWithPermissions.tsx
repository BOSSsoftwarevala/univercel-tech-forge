/**
 * ACTION BOX WITH REAL PERMISSIONS
 * =================================
 * Integrates with backend permission system
 * Buttons only show if user has permission
 * Actions execute with server-side validation
 */

import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Eye, Edit3, RefreshCw, Send, CheckCircle, XCircle,
  Pause, Play, StopCircle, Trash2, Brain, FileText,
  MoreHorizontal, ChevronDown, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  useBoxPermissions, 
  useBoxAction, 
  useAllBoxStatuses,
  type BoxType, 
  type BoxStatus, 
  type ActionType 
} from "@/hooks/useBoxPermissions";

// ===== ACTION CONFIG =====
interface ActionConfig {
  id: ActionType;
  label: string;
  icon: React.ElementType;
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  colorClass?: string;
}

const ACTION_CONFIG: Record<ActionType, ActionConfig> = {
  view: { id: 'view', label: 'View', icon: Eye, variant: 'outline' },
  edit: { id: 'edit', label: 'Edit', icon: Edit3, variant: 'outline' },
  update: { id: 'update', label: 'Update', icon: RefreshCw, variant: 'outline' },
  post: { id: 'post', label: 'Post', icon: Send, variant: 'default', colorClass: 'bg-blue-600 hover:bg-blue-700' },
  approve: { id: 'approve', label: 'Approve', icon: CheckCircle, variant: 'default', colorClass: 'bg-emerald-600 hover:bg-emerald-700' },
  reject: { id: 'reject', label: 'Reject', icon: XCircle, variant: 'destructive' },
  suspend: { id: 'suspend', label: 'Suspend', icon: Pause, variant: 'outline', colorClass: 'border-amber-500 text-amber-500 hover:bg-amber-500/10' },
  resume: { id: 'resume', label: 'Resume', icon: Play, variant: 'outline', colorClass: 'border-emerald-500 text-emerald-500 hover:bg-emerald-500/10' },
  stop: { id: 'stop', label: 'Stop', icon: StopCircle, variant: 'destructive' },
  start: { id: 'start', label: 'Start', icon: Play, variant: 'default', colorClass: 'bg-emerald-600 hover:bg-emerald-700' },
  delete: { id: 'delete', label: 'Delete', icon: Trash2, variant: 'destructive' },
  startAi: { id: 'startAi', label: 'Start AI', icon: Brain, variant: 'default', colorClass: 'bg-cyan-600 hover:bg-cyan-700' },
  stopAi: { id: 'stopAi', label: 'Stop AI', icon: StopCircle, variant: 'outline', colorClass: 'border-cyan-500 text-cyan-500' },
  viewLogs: { id: 'viewLogs', label: 'View Logs', icon: FileText, variant: 'outline' },
  pauseMonitoring: { id: 'pauseMonitoring', label: 'Pause', icon: Pause, variant: 'outline' },
};

// ===== STATUS BADGE COLORS =====
const STATUS_COLORS: Record<BoxStatus, string> = {
  active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
  suspended: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  stopped: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
  error: 'bg-red-500/20 text-red-400 border-red-500/50',
};

// ===== PROPS =====
interface ActionBoxWithPermissionsProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  boxType: BoxType;
  entityId: string;
  userRole: string;
  children?: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
  compact?: boolean;
  onActionComplete?: (actionType: ActionType, newStatus: BoxStatus) => void;
}

// ===== MAIN COMPONENT =====
export const ActionBoxWithPermissions = memo<ActionBoxWithPermissionsProps>(({
  title,
  subtitle,
  icon: Icon,
  boxType,
  entityId,
  userRole,
  children,
  className,
  headerRight,
  compact = false,
  onActionComplete,
}) => {
  // Hooks
  const { getAllowedActions, isLoading: permLoading } = useBoxPermissions(userRole);
  const { getStatus } = useAllBoxStatuses();
  const executeAction = useBoxAction();

  // Get current status and allowed actions
  const currentStatus = getStatus(entityId);
  const allowedActions = getAllowedActions(boxType);

  // Handle action click
  const handleAction = useCallback(async (actionType: ActionType) => {
    const result = await executeAction.mutateAsync({
      boxType,
      entityId,
      actionType,
      userRole,
    });

    if (result.success && onActionComplete) {
      onActionComplete(actionType, result.newStatus);
    }
  }, [boxType, entityId, userRole, executeAction, onActionComplete]);

  // Split actions for display
  const visibleActions = allowedActions.slice(0, compact ? 2 : 3);
  const dropdownActions = allowedActions.slice(compact ? 2 : 3);

  // Loading state
  if (permLoading) {
    return (
      <Card className="animate-pulse bg-card/50">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("group", className)}
    >
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300",
        "bg-card/50 backdrop-blur border-border/50",
        "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
      )}>
        {/* Header */}
        <CardHeader className={cn("pb-2", compact && "p-4")}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {Icon && (
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base font-semibold text-foreground truncate">
                  {title}
                </CardTitle>
                {subtitle && (
                  <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
                )}
              </div>
            </div>
            
            {/* Status Badge + Custom Header Right */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {headerRight}
              <Badge className={cn("text-xs font-medium capitalize", STATUS_COLORS[currentStatus])}>
                {currentStatus}
              </Badge>
            </div>
          </div>
        </CardHeader>

        {/* Content */}
        {children && (
          <CardContent className={cn("pt-0", compact && "px-4 pb-4")}>
            {children}
          </CardContent>
        )}

        {/* Action Buttons - Only show allowed actions */}
        {allowedActions.length > 0 && (
          <div className={cn(
            "px-4 py-3 border-t border-border/30 flex items-center gap-2 flex-wrap",
            "bg-gradient-to-r from-transparent via-muted/5 to-transparent"
          )}>
            {visibleActions.map((actionId) => {
              const action = ACTION_CONFIG[actionId];
              if (!action) return null;
              
              const ActionIcon = action.icon;
              const isLoading = executeAction.isPending;
              
              return (
                <Button
                  key={action.id}
                  size="sm"
                  variant={action.variant}
                  className={cn(
                    "gap-1.5 text-xs font-medium h-8",
                    action.colorClass
                  )}
                  onClick={() => handleAction(action.id)}
                  disabled={isLoading}
                >
                  <ActionIcon className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
                  {action.label}
                </Button>
              );
            })}

            {/* Dropdown for additional actions */}
            {dropdownActions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-1 text-xs h-8">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                    More
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {dropdownActions.map((actionId) => {
                    const action = ACTION_CONFIG[actionId];
                    if (!action) return null;
                    const ActionIcon = action.icon;
                    return (
                      <DropdownMenuItem
                        key={action.id}
                        onClick={() => handleAction(action.id)}
                        className="gap-2 text-sm"
                      >
                        <ActionIcon className="w-4 h-4" />
                        {action.label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}

        {/* No permissions warning */}
        {allowedActions.length === 0 && (
          <div className="px-4 py-3 border-t border-border/30 text-center">
            <p className="text-xs text-muted-foreground">No actions available for your role</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
});

ActionBoxWithPermissions.displayName = 'ActionBoxWithPermissions';

export default ActionBoxWithPermissions;
