/**
 * Adaptive Motion Wrapper
 * Disables animations in low-data mode for performance
 */

import React from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import { useOffline } from '@/lib/offline/offline-context';

type MotionDivProps = HTMLMotionProps<'div'>;

interface AdaptiveMotionProps extends MotionDivProps {
  children: React.ReactNode;
  disableInLowData?: boolean;
}

export function AdaptiveMotion({
  children,
  disableInLowData = true,
  initial,
  animate,
  exit,
  transition,
  variants,
  ...props
}: AdaptiveMotionProps) {
  const { lowDataMode } = useOffline();

  // Disable animations in low-data mode
  if (lowDataMode && disableInLowData) {
    const { className, style, id } = props;
    return <div className={className} style={style} id={id}>{children}</div>;
  }

  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Common animation variants
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const slideIn: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

// Stagger children animation
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 }
};

/**
 * Hook to get animation props based on network conditions
 */
export function useAdaptiveAnimation() {
  const { lowDataMode } = useOffline();

  return {
    shouldAnimate: !lowDataMode,
    transition: lowDataMode ? { duration: 0 } : { duration: 0.2 },
    reducedMotion: lowDataMode
  };
}
