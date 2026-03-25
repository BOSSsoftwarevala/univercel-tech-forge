/**
 * System Action Button Component
 * Universal button with loading states, confirmation dialogs, and audit trail
 * Works with all manager modules
 */

import { useState, useCallback, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, Check, X, AlertTriangle, LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { 
  useSystemActions, 
  SystemActionConfig, 
  SystemModule, 
  SystemAction 
} from '@/hooks/useSystemActions';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';
type ButtonStatus = 'idle' | 'loading' | 'success' | 'error';

interface SystemActionButtonProps {
  // Action configuration
  module: SystemModule;
  action: SystemAction;
  entityType: string;
  entityId?: string;
  entityName?: string;
  data?: Record<string, unknown>;
  
  // Button appearance
  label?: string;
  icon?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  
  // Confirmation
  requiresConfirmation?: boolean;
  confirmTitle?: string;
  confirmMessage?: string;
  
  // Callbacks
  handler?: () => Promise<unknown>;
  onSuccess?: (data?: unknown) => void;
  onError?: (error: string) => void;
  
  // Children
  children?: ReactNode;
}

export function SystemActionButton({
  module,
  action,
  entityType,
  entityId,
  entityName,
  data,
  label,
  icon,
  variant = 'default',
  size = 'default',
  className,
  disabled,
  requiresConfirmation,
  confirmTitle,
  confirmMessage,
  handler,
  onSuccess,
  onError,
  children
}: SystemActionButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<ButtonStatus>('idle');
  const { executeAction } = useSystemActions();

  // Determine if action needs confirmation
  const needsConfirmation = requiresConfirmation || 
    ['delete', 'suspend', 'lock', 'reject'].includes(action);

  // Build action config
  const config: SystemActionConfig = {
    module,
    action,
    entityType,
    entityId,
    entityName,
    data,
    requiresConfirmation: needsConfirmation,
    confirmTitle: confirmTitle || `Confirm ${action}`,
    confirmMessage: confirmMessage || `Are you sure you want to ${action} this ${entityType}?`,
    onSuccess,
    onError
  };

  const performAction = useCallback(async () => {
    setStatus('loading');
    
    const result = await executeAction(config, handler);
    
    if (result.success) {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 1500);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  }, [executeAction, config, handler]);

  const handleClick = useCallback(() => {
    if (needsConfirmation) {
      setShowConfirm(true);
    } else {
      performAction();
    }
  }, [needsConfirmation, performAction]);

  const handleConfirm = useCallback(() => {
    setShowConfirm(false);
    performAction();
  }, [performAction]);

  // Get button variant based on action type
  const getActionVariant = (): ButtonVariant => {
    if (variant !== 'default') return variant;
    
    switch (action) {
      case 'delete':
      case 'suspend':
      case 'reject':
        return 'destructive';
      case 'approve':
      case 'enable':
      case 'activate':
        return 'default';
      default:
        return 'outline';
    }
  };

  // Get action label if not provided
  const getActionLabel = (): string => {
    if (label) return label;
    
    const actionLabels: Record<SystemAction, string> = {
      create: 'Create',
      read: 'View',
      update: 'Update',
      delete: 'Delete',
      soft_delete: 'Move to Trash',
      restore: 'Restore',
      enable: 'Enable',
      disable: 'Disable',
      suspend: 'Suspend',
      activate: 'Activate',
      pause: 'Pause',
      resume: 'Resume',
      approve: 'Approve',
      reject: 'Reject',
      escalate: 'Escalate',
      assign: 'Assign',
      reassign: 'Reassign',
      unassign: 'Unassign',
      export: 'Export',
      import: 'Import',
      sync: 'Sync',
      refresh: 'Refresh',
      duplicate: 'Duplicate',
      merge: 'Merge',
      lock: 'Lock',
      unlock: 'Unlock',
      archive: 'Archive',
      unarchive: 'Unarchive',
      publish: 'Publish',
      unpublish: 'Unpublish'
    };
    
    return actionLabels[action] || action;
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </motion.div>
        );
      case 'success':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-emerald-400"
          >
            <Check className="w-4 h-4" />
            <span>Done</span>
          </motion.div>
        );
      case 'error':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-red-400"
          >
            <X className="w-4 h-4" />
            <span>Failed</span>
          </motion.div>
        );
      default:
        return children || (
          <div className="flex items-center gap-2">
            {icon}
            <span>{getActionLabel()}</span>
          </div>
        );
    }
  };

  return (
    <>
      <Button
        variant={getActionVariant()}
        size={size}
        className={cn(
          'transition-all duration-200',
          status === 'success' && 'bg-emerald-500/20 border-emerald-500/50',
          status === 'error' && 'bg-red-500/20 border-red-500/50',
          className
        )}
        disabled={disabled || status === 'loading'}
        onClick={handleClick}
      >
        <AnimatePresence mode="wait">
          <motion.div key={status}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </Button>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="bg-card border-amber-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              {config.confirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {config.confirmMessage}
              <span className="text-xs text-muted-foreground mt-2 block">
                This action will be logged for audit purposes.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirm}
              className={cn(
                action === 'delete' || action === 'suspend' 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-primary hover:bg-primary/90'
              )}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Quick action button variants for common operations
export function CreateButton({ 
  module, 
  entityType, 
  ...props 
}: Omit<SystemActionButtonProps, 'action' | 'label'> & { module: SystemModule; entityType: string }) {
  return (
    <SystemActionButton
      {...props}
      module={module}
      action="create"
      entityType={entityType}
      label={`Create ${entityType}`}
      variant="default"
    />
  );
}

export function EditButton({ 
  module, 
  entityType,
  entityId,
  ...props 
}: Omit<SystemActionButtonProps, 'action' | 'label'> & { module: SystemModule; entityType: string; entityId: string }) {
  return (
    <SystemActionButton
      {...props}
      module={module}
      action="update"
      entityType={entityType}
      entityId={entityId}
      label="Edit"
      variant="outline"
    />
  );
}

export function DeleteButton({ 
  module, 
  entityType,
  entityId,
  ...props 
}: Omit<SystemActionButtonProps, 'action' | 'label'> & { module: SystemModule; entityType: string; entityId: string }) {
  return (
    <SystemActionButton
      {...props}
      module={module}
      action="delete"
      entityType={entityType}
      entityId={entityId}
      label="Delete"
      variant="destructive"
      requiresConfirmation
    />
  );
}

export function ApproveButton({ 
  module, 
  entityType,
  entityId,
  ...props 
}: Omit<SystemActionButtonProps, 'action' | 'label'> & { module: SystemModule; entityType: string; entityId: string }) {
  return (
    <SystemActionButton
      {...props}
      module={module}
      action="approve"
      entityType={entityType}
      entityId={entityId}
      label="Approve"
      variant="default"
      className="bg-emerald-500 hover:bg-emerald-600"
    />
  );
}

export function RejectButton({ 
  module, 
  entityType,
  entityId,
  ...props 
}: Omit<SystemActionButtonProps, 'action' | 'label'> & { module: SystemModule; entityType: string; entityId: string }) {
  return (
    <SystemActionButton
      {...props}
      module={module}
      action="reject"
      entityType={entityType}
      entityId={entityId}
      label="Reject"
      variant="destructive"
    />
  );
}

export function SuspendButton({ 
  module, 
  entityType,
  entityId,
  ...props 
}: Omit<SystemActionButtonProps, 'action' | 'label'> & { module: SystemModule; entityType: string; entityId: string }) {
  return (
    <SystemActionButton
      {...props}
      module={module}
      action="suspend"
      entityType={entityType}
      entityId={entityId}
      label="Suspend"
      variant="destructive"
      requiresConfirmation
    />
  );
}

export function EnableButton({ 
  module, 
  entityType,
  entityId,
  ...props 
}: Omit<SystemActionButtonProps, 'action' | 'label'> & { module: SystemModule; entityType: string; entityId: string }) {
  return (
    <SystemActionButton
      {...props}
      module={module}
      action="enable"
      entityType={entityType}
      entityId={entityId}
      label="Enable"
      variant="outline"
      className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
    />
  );
}

export function DisableButton({ 
  module, 
  entityType,
  entityId,
  ...props 
}: Omit<SystemActionButtonProps, 'action' | 'label'> & { module: SystemModule; entityType: string; entityId: string }) {
  return (
    <SystemActionButton
      {...props}
      module={module}
      action="disable"
      entityType={entityType}
      entityId={entityId}
      label="Disable"
      variant="outline"
      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
    />
  );
}

export function ExportButton({ 
  module, 
  entityType,
  format = 'csv',
  ...props 
}: Omit<SystemActionButtonProps, 'action' | 'label' | 'data'> & { module: SystemModule; entityType: string; format?: string }) {
  return (
    <SystemActionButton
      {...props}
      module={module}
      action="export"
      entityType={entityType}
      data={{ format }}
      label="Export"
      variant="outline"
    />
  );
}

export function RefreshButton({ 
  module, 
  entityType,
  ...props 
}: Omit<SystemActionButtonProps, 'action' | 'label'> & { module: SystemModule; entityType: string }) {
  return (
    <SystemActionButton
      {...props}
      module={module}
      action="refresh"
      entityType={entityType}
      label="Refresh"
      variant="ghost"
    />
  );
}

export default SystemActionButton;
