/**
 * Premium Button with Micro-interactions
 * Scale, glow, and sound feedback on click
 */

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRoleSounds } from '@/hooks/useRoleSounds';

interface PremiumButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  userRole?: string;
  enableSound?: boolean;
  glowOnHover?: boolean;
}

const variantStyles = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  ghost: 'bg-transparent hover:bg-secondary/50',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const PremiumButton = ({
  children,
  variant = 'primary',
  size = 'md',
  userRole = 'user',
  enableSound = true,
  glowOnHover = true,
  className,
  onClick,
  ...props
}: PremiumButtonProps) => {
  const { playButtonClick } = useRoleSounds(userRole);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (enableSound) playButtonClick();
    onClick?.(e);
  };

  return (
    <motion.button
      className={cn(
        'relative rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      {...props}
    >
      {glowOnHover && variant === 'primary' && (
        <motion.span
          className="absolute inset-0 rounded-lg opacity-0 pointer-events-none"
          style={{ boxShadow: '0 0 20px hsl(var(--primary) / 0.4)' }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      {children}
    </motion.button>
  );
};

/**
 * Error shake animation component
 */
export const ErrorShake = ({ children, trigger }: { children: React.ReactNode; trigger: boolean }) => (
  <motion.div
    animate={trigger ? { x: [-4, 4, -4, 4, 0] } : {}}
    transition={{ duration: 0.4 }}
  >
    {children}
  </motion.div>
);

export default PremiumButton;
