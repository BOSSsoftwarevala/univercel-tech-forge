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
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'sidebar' | 'sidebar-active';
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
  sidebar: 'bg-transparent text-gray-400 hover:bg-white/10 hover:text-white border border-transparent hover:border-primary/20 hover:shadow-[0_0_12px_rgba(59,130,246,0.25)]',
  'sidebar-active': 'bg-primary/15 text-primary border border-primary/40 shadow-[0_0_20px_rgba(59,130,246,0.4)]',
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
        'relative flex items-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      {...props}
    >
      {glowOnHover && (variant === 'primary' || variant === 'sidebar-active' || variant === 'sidebar') && (
        <motion.span
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{ 
            boxShadow: variant === 'sidebar-active' 
              ? '0 0 25px hsl(var(--primary) / 0.5)' 
              : '0 0 15px hsl(var(--primary) / 0.3)' 
          }}
          transition={{ duration: 0.25 }}
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
