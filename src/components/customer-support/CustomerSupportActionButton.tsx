/**
 * Customer Support Action Button
 * Properly handles loading states, actions, and ref forwarding
 */
import React, { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomerSupportActionButtonProps {
  action: string;
  target?: string;
  variant?: 'outline' | 'default' | 'ghost' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
  icon?: React.ElementType;
  className?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  onClick: (action: string, target?: string) => void;
}

export const CustomerSupportActionButton = forwardRef<
  HTMLButtonElement,
  CustomerSupportActionButtonProps
>(({ 
  action, 
  target, 
  variant = 'outline', 
  size = 'sm',
  icon: Icon,
  className,
  children,
  isLoading = false,
  onClick,
}, ref) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      onClick(action, target);
    }
  };

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "transition-all duration-200",
        isLoading && "opacity-70",
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </Button>
  );
});

CustomerSupportActionButton.displayName = 'CustomerSupportActionButton';

export default CustomerSupportActionButton;
