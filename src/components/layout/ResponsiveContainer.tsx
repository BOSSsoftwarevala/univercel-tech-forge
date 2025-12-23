/**
 * Responsive Container - Mobile/Tablet/Desktop optimized
 * Handles proper spacing and layout across all devices
 */

import { ReactNode, memo } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  /** Full width on mobile, constrained on larger screens */
  fluid?: boolean;
  /** Remove padding on mobile */
  noPaddingMobile?: boolean;
  /** Center content */
  center?: boolean;
}

export const ResponsiveContainer = memo(({ 
  children, 
  className,
  fluid = false,
  noPaddingMobile = false,
  center = false
}: ResponsiveContainerProps) => (
  <div className={cn(
    "w-full",
    !fluid && "max-w-7xl mx-auto",
    noPaddingMobile ? "px-0 sm:px-4 md:px-6 lg:px-8" : "px-4 sm:px-6 lg:px-8",
    center && "flex flex-col items-center",
    className
  )}>
    {children}
  </div>
));

ResponsiveContainer.displayName = 'ResponsiveContainer';

/**
 * Responsive Grid - Auto-adjusts columns based on screen size
 */
interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  /** Number of columns on mobile */
  cols?: 1 | 2;
  /** Gap size */
  gap?: 'sm' | 'md' | 'lg';
}

export const ResponsiveGrid = memo(({ 
  children, 
  className,
  cols = 1,
  gap = 'md'
}: ResponsiveGridProps) => (
  <div className={cn(
    "grid",
    cols === 1 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    gap === 'sm' && "gap-2 sm:gap-3",
    gap === 'md' && "gap-3 sm:gap-4 lg:gap-6",
    gap === 'lg' && "gap-4 sm:gap-6 lg:gap-8",
    className
  )}>
    {children}
  </div>
));

ResponsiveGrid.displayName = 'ResponsiveGrid';

/**
 * Responsive Stack - Horizontal on desktop, vertical on mobile
 */
interface ResponsiveStackProps {
  children: ReactNode;
  className?: string;
  /** Breakpoint to switch */
  breakpoint?: 'sm' | 'md' | 'lg';
  /** Gap size */
  gap?: 'sm' | 'md' | 'lg';
  /** Reverse on mobile */
  reverseMobile?: boolean;
}

export const ResponsiveStack = memo(({ 
  children, 
  className,
  breakpoint = 'md',
  gap = 'md',
  reverseMobile = false
}: ResponsiveStackProps) => (
  <div className={cn(
    "flex",
    reverseMobile ? "flex-col-reverse" : "flex-col",
    breakpoint === 'sm' && "sm:flex-row",
    breakpoint === 'md' && "md:flex-row",
    breakpoint === 'lg' && "lg:flex-row",
    gap === 'sm' && "gap-2 sm:gap-3",
    gap === 'md' && "gap-3 sm:gap-4",
    gap === 'lg' && "gap-4 sm:gap-6",
    className
  )}>
    {children}
  </div>
));

ResponsiveStack.displayName = 'ResponsiveStack';

/**
 * Hide on mobile helper
 */
export const HideOnMobile = memo(({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("hidden sm:block", className)}>{children}</div>
));

HideOnMobile.displayName = 'HideOnMobile';

/**
 * Show only on mobile helper
 */
export const ShowOnMobile = memo(({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("block sm:hidden", className)}>{children}</div>
));

ShowOnMobile.displayName = 'ShowOnMobile';

/**
 * Touch-friendly button wrapper
 */
export const TouchTarget = memo(({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("min-h-[44px] min-w-[44px] flex items-center justify-center", className)}>
    {children}
  </div>
));

TouchTarget.displayName = 'TouchTarget';
