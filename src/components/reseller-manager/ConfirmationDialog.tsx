import React from 'react';
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
import { Loader2, AlertTriangle, CheckCircle, XCircle, RotateCw } from 'lucide-react';
import { ActionState, ActionType } from '@/hooks/useEnterpriseAction';
import { Button } from '@/components/ui/button';

interface ConfirmationDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  actionType: ActionType;
  entityName?: string;
  message?: string;
  state?: ActionState;
  onRetry?: () => void;
}

const actionLabels: Record<ActionType, { title: string; description: string; variant: 'default' | 'destructive' }> = {
  view: { title: 'View Details', description: 'View the details of this item?', variant: 'default' },
  create: { title: 'Create New', description: 'Create this new item?', variant: 'default' },
  edit: { title: 'Edit Item', description: 'Save the changes to this item?', variant: 'default' },
  approve: { title: 'Approve', description: 'Approve this item? This action will be logged.', variant: 'default' },
  reject: { title: 'Reject', description: 'Reject this item? A reason is required.', variant: 'destructive' },
  suspend: { title: 'Suspend', description: 'Suspend this item? It can be resumed later.', variant: 'destructive' },
  resume: { title: 'Resume', description: 'Resume this suspended item?', variant: 'default' },
  delete: { title: 'Delete', description: 'Delete this item? This uses soft delete and can be restored by Super Admin.', variant: 'destructive' },
  escalate: { title: 'Escalate', description: 'Escalate this item to the next level? Notes are required.', variant: 'destructive' },
  export: { title: 'Export Data', description: 'Export the selected data?', variant: 'default' },
  assign: { title: 'Assign', description: 'Assign this item to the selected user?', variant: 'default' },
  'ai-review': { title: 'AI Review', description: 'Request AI analysis of this item?', variant: 'default' },
};

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onConfirm,
  onCancel,
  actionType,
  entityName,
  message,
  state = 'idle',
  onRetry,
}) => {
  const actionConfig = actionLabels[actionType];

  const renderStateIcon = () => {
    switch (state) {
      case 'loading':
        return <Loader2 className="h-6 w-6 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'retry':
        return <RotateCw className="h-6 w-6 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {renderStateIcon()}
            <AlertDialogTitle className="text-foreground">
              {actionConfig.title}
              {entityName && ` - ${entityName}`}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-muted-foreground">
            {message || actionConfig.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {state === 'error' && onRetry && (
            <Button variant="outline" onClick={onRetry} className="gap-2">
              <RotateCw className="h-4 w-4" />
              Retry
            </Button>
          )}
          <AlertDialogCancel 
            onClick={onCancel}
            disabled={state === 'loading'}
            className="bg-muted text-muted-foreground hover:bg-muted/80"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={state === 'loading'}
            className={actionConfig.variant === 'destructive' 
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }
          >
            {state === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              'Confirm'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
