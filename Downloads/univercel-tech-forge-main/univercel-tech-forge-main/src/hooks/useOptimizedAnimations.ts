/**
 * Animation Performance Hook
 * Optimizes framer-motion animations for smoothness
 */

import { useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

// Standard animation variants - fast and smooth
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
  }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' }
  }
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  }
};

export const slideInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  }
};

// Stagger children animation
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2 }
  }
};

// Hook to get optimized animation props
export function useOptimizedAnimations() {
  const prefersReducedMotion = useReducedMotion();
  
  return useMemo(() => {
    if (prefersReducedMotion) {
      // Instant transitions for users who prefer reduced motion
      return {
        fadeInUp: { 
          hidden: { opacity: 0 }, 
          visible: { opacity: 1, transition: { duration: 0 } } 
        },
        fadeIn: { 
          hidden: { opacity: 0 }, 
          visible: { opacity: 1, transition: { duration: 0 } } 
        },
        scaleIn: { 
          hidden: { opacity: 0 }, 
          visible: { opacity: 1, transition: { duration: 0 } } 
        },
        slideInLeft: { 
          hidden: { opacity: 0 }, 
          visible: { opacity: 1, transition: { duration: 0 } } 
        },
        slideInRight: { 
          hidden: { opacity: 0 }, 
          visible: { opacity: 1, transition: { duration: 0 } } 
        },
        staggerContainer: { 
          hidden: { opacity: 1 }, 
          visible: { opacity: 1 } 
        },
        staggerItem: { 
          hidden: { opacity: 0 }, 
          visible: { opacity: 1, transition: { duration: 0 } } 
        },
        transition: { duration: 0 },
        disabled: true
      };
    }
    
    return {
      fadeInUp,
      fadeIn,
      scaleIn,
      slideInLeft,
      slideInRight,
      staggerContainer,
      staggerItem,
      transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
      disabled: false
    };
  }, [prefersReducedMotion]);
}

// Quick fade props for common elements
export const quickFadeProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15 }
};

// Quick slide props
export const quickSlideProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 }
};

export default useOptimizedAnimations;
