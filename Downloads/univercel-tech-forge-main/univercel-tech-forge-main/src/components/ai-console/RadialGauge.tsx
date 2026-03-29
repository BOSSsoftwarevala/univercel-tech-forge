import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface RadialGaugeProps {
  value: number;
  maxValue: number;
  label: string;
  size?: number;
}

const RadialGauge = ({ value, maxValue, label, size = 160 }: RadialGaugeProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  const percentage = (animatedValue / maxValue) * 100;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75; // 270 degree arc

  const getColor = () => {
    if (percentage < 50) return 'hsl(var(--neon-green))';
    if (percentage < 75) return 'hsl(var(--neon-orange))';
    return 'hsl(var(--neon-red))';
  };

  const getGlowColor = () => {
    if (percentage < 50) return 'rgba(74, 222, 128, 0.4)';
    if (percentage < 75) return 'rgba(251, 146, 60, 0.4)';
    return 'rgba(248, 113, 113, 0.4)';
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-135"
        style={{ filter: `drop-shadow(0 0 10px ${getGlowColor()})` }}
      >
        {/* Background arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
        />
        
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          strokeLinecap="round"
        />

        {/* Glow effect */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth + 4}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          strokeLinecap="round"
          opacity={0.3}
          style={{ filter: 'blur(6px)' }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className="text-3xl font-bold text-foreground font-mono"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {animatedValue}%
        </motion.span>
        <span className="text-xs text-muted-foreground mt-1">{label}</span>
      </div>

      {/* Tick marks */}
      <svg
        width={size}
        height={size}
        className="absolute inset-0"
        style={{ transform: 'rotate(-135deg)' }}
      >
        {[...Array(11)].map((_, i) => {
          const angle = (i * 27 * Math.PI) / 180;
          const x1 = size / 2 + (radius - 20) * Math.cos(angle);
          const y1 = size / 2 + (radius - 20) * Math.sin(angle);
          const x2 = size / 2 + (radius - 12) * Math.cos(angle);
          const y2 = size / 2 + (radius - 12) * Math.sin(angle);
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={i % 5 === 0 ? 2 : 1}
              opacity={0.5}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default RadialGauge;
