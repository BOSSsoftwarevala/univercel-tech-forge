import React, { memo, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RealTimeCounterProps {
  value: number;
  label?: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  showChange?: boolean;
  format?: 'number' | 'currency' | 'compact';
}

const AnimatedDigit = memo(({ digit, index }: { digit: string; index: number }) => {
  return (
    <motion.span
      key={`${digit}-${index}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.15, delay: index * 0.02 }}
      className="inline-block"
    >
      {digit}
    </motion.span>
  );
});

AnimatedDigit.displayName = 'AnimatedDigit';

export const RealTimeCounter = memo(({
  value,
  label,
  prefix = '',
  suffix = '',
  duration = 500,
  className,
  size = 'lg',
  color = 'cyan',
  showChange = true,
  format = 'number'
}: RealTimeCounterProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [change, setChange] = useState(0);
  const previousValue = useRef(value);
  const animationRef = useRef<number | null>(null);

  const spring = useSpring(value, { stiffness: 100, damping: 30, mass: 1 });

  useEffect(() => {
    spring.set(value);
    
    const diff = value - previousValue.current;
    if (diff !== 0) {
      setChange(diff);
      setTimeout(() => setChange(0), 2000);
    }
    previousValue.current = value;

    // Animate counter
    const startValue = displayValue;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      const currentValue = Math.round(startValue + (value - startValue) * eased);
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration, spring]);

  const formatValue = (val: number): string => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(val);
      case 'compact':
        if (val >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
        if (val >= 1e6) return `${(val / 1e6).toFixed(1)}M`;
        if (val >= 1e3) return `${(val / 1e3).toFixed(1)}K`;
        return val.toString();
      default:
        return val.toLocaleString();
    }
  };

  const sizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-7xl'
  };

  const colors = {
    cyan: 'text-cyan-400',
    emerald: 'text-emerald-400',
    purple: 'text-purple-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400'
  };

  const glowColors = {
    cyan: 'drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]',
    emerald: 'drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]',
    purple: 'drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]',
    amber: 'drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]',
    rose: 'drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]'
  };

  const formattedValue = formatValue(displayValue);
  const digits = formattedValue.split('');

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {label && (
        <span className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">
          {label}
        </span>
      )}

      <div className="relative">
        <motion.div
          className={cn(
            "font-bold font-mono tracking-tight",
            sizes[size],
            colors[color as keyof typeof colors] || 'text-cyan-400',
            glowColors[color as keyof typeof glowColors] || glowColors.cyan
          )}
        >
          {prefix}
          <AnimatePresence mode="popLayout">
            {digits.map((digit, i) => (
              <AnimatedDigit key={`${digit}-${i}-${displayValue}`} digit={digit} index={i} />
            ))}
          </AnimatePresence>
          {suffix}
        </motion.div>

        {/* Change indicator */}
        <AnimatePresence>
          {showChange && change !== 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className={cn(
                "absolute -top-6 left-1/2 text-sm font-bold",
                change > 0 ? 'text-emerald-400' : 'text-rose-400'
              )}
            >
              {change > 0 ? '+' : ''}{change.toLocaleString()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pulse ring animation */}
      {change !== 0 && (
        <motion.div
          initial={{ opacity: 0.8, scale: 0.8 }}
          animate={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 1 }}
          className={cn(
            "absolute inset-0 rounded-full border-2",
            change > 0 ? 'border-emerald-400' : 'border-rose-400'
          )}
        />
      )}
    </div>
  );
});

RealTimeCounter.displayName = 'RealTimeCounter';

// Multi-counter display for dashboards
export const CounterGrid = memo(({ 
  counters 
}: { 
  counters: Array<RealTimeCounterProps & { id: string }> 
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {counters.map((counter) => (
        <div 
          key={counter.id}
          className="p-6 rounded-xl bg-slate-900/50 border border-cyan-500/20 backdrop-blur-sm"
        >
          <RealTimeCounter {...counter} />
        </div>
      ))}
    </div>
  );
});

CounterGrid.displayName = 'CounterGrid';
