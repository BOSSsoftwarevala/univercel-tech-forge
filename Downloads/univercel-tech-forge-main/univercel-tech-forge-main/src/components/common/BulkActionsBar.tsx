import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, X, Trash2, Archive, Tag, UserPlus, Download, 
  MoreHorizontal, AlertTriangle, Loader2, CheckCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export interface BulkAction {
  id: string;
  label: string;
  icon: React.ElementType;
  variant?: 'default' | 'destructive' | 'warning';
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

interface BulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onAction: (actionId: string, selectedIds: string[]) => Promise<boolean>;
  selectedIds: string[];
  actions?: BulkAction[];
  entityName?: string;
}

const defaultActions: BulkAction[] = [
  { id: 'delete', label: 'Delete', icon: Trash2, variant: 'destructive', requiresConfirmation: true },
  { id: 'archive', label: 'Archive', icon: Archive, requiresConfirmation: true },
  { id: 'assign', label: 'Assign', icon: UserPlus },
  { id: 'tag', label: 'Add Tag', icon: Tag },
  { id: 'export', label: 'Export', icon: Download },
];

export function BulkActionsBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  onAction,
  selectedIds,
  actions = defaultActions,
  entityName = 'items',
}: BulkActionsBarProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<BulkAction | null>(null);
  const [successAction, setSuccessAction] = useState<string | null>(null);

  const handleAction = async (action: BulkAction) => {
    if (action.requiresConfirmation) {
      setConfirmAction(action);
      return;
    }
    await executeAction(action);
  };

  const executeAction = async (action: BulkAction) => {
    setLoading(action.id);
    setConfirmAction(null);

    try {
      const success = await onAction(action.id, selectedIds);
      if (success) {
        setSuccessAction(action.id);
        toast.success(`${action.label} completed for ${selectedCount} ${entityName}`);
        setTimeout(() => {
          setSuccessAction(null);
          onClearSelection();
        }, 1500);
      }
    } catch (error) {
      toast.error(`Failed to ${action.label.toLowerCase()}`);
    } finally {
      setLoading(null);
    }
  };

  const primaryActions = actions.slice(0, 3);
  const moreActions = actions.slice(3);

  if (selectedCount === 0) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl">
            {/* Selection Info */}
            <div className="flex items-center gap-2 pr-3 border-r border-slate-700">
              <CheckSquare className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-white">
                {selectedCount} selected
              </span>
              {selectedCount < totalCount && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={onSelectAll}
                  className="text-xs text-primary p-0 h-auto"
                >
                  Select all {totalCount}
                </Button>
              )}
            </div>

            {/* Primary Actions */}
            <div className="flex items-center gap-2">
              {primaryActions.map((action) => {
                const Icon = action.icon;
                const isLoading = loading === action.id;
                const isSuccess = successAction === action.id;

                return (
                  <Button
                    key={action.id}
                    variant={action.variant === 'destructive' ? 'destructive' : 'secondary'}
                    size="sm"
                    onClick={() => handleAction(action)}
                    disabled={!!loading}
                    className="gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isSuccess ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                    {action.label}
                  </Button>
                );
              })}

              {/* More Actions Dropdown */}
              {moreActions.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" disabled={!!loading}>
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {moreActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <React.Fragment key={action.id}>
                          {index > 0 && action.variant === 'destructive' && <DropdownMenuSeparator />}
                          <DropdownMenuItem
                            onClick={() => handleAction(action)}
                            className={action.variant === 'destructive' ? 'text-destructive' : ''}
                          >
                            <Icon className="w-4 h-4 mr-2" />
                            {action.label}
                          </DropdownMenuItem>
                        </React.Fragment>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Clear Selection */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearSelection}
              className="h-8 w-8 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Confirm {confirmAction?.label}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.confirmationMessage || 
                `Are you sure you want to ${confirmAction?.label.toLowerCase()} ${selectedCount} ${entityName}? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmAction && executeAction(confirmAction)}
              className={confirmAction?.variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
            >
              {confirmAction?.label}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default BulkActionsBar;
