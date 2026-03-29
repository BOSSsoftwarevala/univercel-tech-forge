/**
 * System Confirmation Dialog
 * Universal confirmation dialog for destructive or important actions
 */

import { ReactNode } from 'react';
import { 
  AlertTriangle, 
  Trash2, 
  Lock, 
  UserX, 
  AlertCircle,
  Check,
  Loader2 
} from 'lucide-react';
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
import { cn } from '@/lib/utils';

export type ConfirmActionType = 
  | 'delete' | 'suspend' | 'lock' | 'reject' 
  | 'approve' | 'enable' | 'disable' | 'confirm';

interface SystemConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
  
  // Content
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  
  // Type determines icon and styling
  actionType?: ConfirmActionType;
  
  // State
  isLoading?: boolean;
  
  // Custom content
  children?: ReactNode;
}

const actionConfig: Record<ConfirmActionType, {
  icon: typeof AlertTriangle;
  iconColor: string;
  buttonColor: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultConfirmLabel: string;
}> = {
  delete: {
    icon: Trash2,
    iconColor: 'text-red-400',
    buttonColor: 'bg-red-500 hover:bg-red-600',
    defaultTitle: 'Delete Item',
    defaultDescription: 'Are you sure you want to delete this item? This action cannot be undone.',
    defaultConfirmLabel: 'Delete'
  },
  suspend: {
    icon: UserX,
    iconColor: 'text-amber-400',
    buttonColor: 'bg-amber-500 hover:bg-amber-600',
    defaultTitle: 'Suspend Account',
    defaultDescription: 'This will suspend the account and restrict all access.',
    defaultConfirmLabel: 'Suspend'
  },
  lock: {
    icon: Lock,
    iconColor: 'text-amber-400',
    buttonColor: 'bg-amber-500 hover:bg-amber-600',
    defaultTitle: 'Lock Resource',
    defaultDescription: 'This will lock the resource and prevent any modifications.',
    defaultConfirmLabel: 'Lock'
  },
  reject: {
    icon: AlertCircle,
    iconColor: 'text-red-400',
    buttonColor: 'bg-red-500 hover:bg-red-600',
    defaultTitle: 'Reject Request',
    defaultDescription: 'Are you sure you want to reject this request?',
    defaultConfirmLabel: 'Reject'
  },
  approve: {
    icon: Check,
    iconColor: 'text-emerald-400',
    buttonColor: 'bg-emerald-500 hover:bg-emerald-600',
    defaultTitle: 'Approve Request',
    defaultDescription: 'Are you sure you want to approve this request?',
    defaultConfirmLabel: 'Approve'
  },
  enable: {
    icon: Check,
    iconColor: 'text-emerald-400',
    buttonColor: 'bg-emerald-500 hover:bg-emerald-600',
    defaultTitle: 'Enable Item',
    defaultDescription: 'This will enable the item and make it active.',
    defaultConfirmLabel: 'Enable'
  },
  disable: {
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
    buttonColor: 'bg-amber-500 hover:bg-amber-600',
    defaultTitle: 'Disable Item',
    defaultDescription: 'This will disable the item and make it inactive.',
    defaultConfirmLabel: 'Disable'
  },
  confirm: {
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
    buttonColor: 'bg-primary hover:bg-primary/90',
    defaultTitle: 'Confirm Action',
    defaultDescription: 'Are you sure you want to proceed with this action?',
    defaultConfirmLabel: 'Confirm'
  }
};

export function SystemConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  actionType = 'confirm',
  isLoading = false,
  children
}: SystemConfirmDialogProps) {
  const config = actionConfig[actionType];
  const IconComponent = config.icon;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              actionType === 'delete' || actionType === 'reject' 
                ? "bg-red-500/20" 
                : actionType === 'approve' || actionType === 'enable'
                ? "bg-emerald-500/20"
                : "bg-amber-500/20"
            )}>
              <IconComponent className={cn("w-4 h-4", config.iconColor)} />
            </div>
            {title || config.defaultTitle}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {description || config.defaultDescription}
            {children}
            <span className="text-xs text-muted-foreground/70 mt-3 block">
              This action will be logged for audit purposes.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(config.buttonColor)}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </span>
            ) : (
              confirmLabel || config.defaultConfirmLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default SystemConfirmDialog;
