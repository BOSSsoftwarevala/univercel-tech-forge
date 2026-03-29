import React from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmActionDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'destructive' | 'default';
  onConfirm: () => void;
  disabled?: boolean;
}

export const ConfirmActionDialog = ({
  trigger,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  disabled = false
}: ConfirmActionDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild disabled={disabled}>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#12121a] border-gray-800 max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {variant === 'destructive' && (
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
            )}
            <div>
              <AlertDialogTitle className="text-white text-base font-semibold">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400 text-sm mt-1">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-white">
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            className={cn(
              variant === 'destructive' 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-primary hover:bg-primary/90'
            )}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size?: 'xs' | 'sm' | 'md';
  icon?: React.ReactNode;
  disabled?: boolean;
  requiresApproval?: boolean;
  className?: string;
}

export const ActionButton = ({
  children,
  onClick,
  variant = 'secondary',
  size = 'sm',
  icon,
  disabled = false,
  requiresApproval = false,
  className
}: ActionButtonProps) => {
  const sizeClasses = {
    xs: 'h-6 px-2 text-[10px]',
    sm: 'h-7 px-2.5 text-xs',
    md: 'h-8 px-3 text-sm'
  };

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
    secondary: 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border border-gray-700/50',
    destructive: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30',
    ghost: 'hover:bg-gray-800/50 text-gray-400 hover:text-gray-200'
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "font-medium transition-all duration-100 gap-1.5 rounded-md",
        sizeClasses[size],
        variantClasses[variant],
        requiresApproval && "ring-1 ring-amber-500/30",
        className
      )}
    >
      {icon}
      {children}
      {requiresApproval && (
        <span className="text-[8px] bg-amber-500/20 text-amber-400 px-1 rounded ml-1">
          APPROVAL
        </span>
      )}
    </Button>
  );
};
