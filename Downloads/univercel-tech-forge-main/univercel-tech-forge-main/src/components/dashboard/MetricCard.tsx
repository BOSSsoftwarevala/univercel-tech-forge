import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  accentColor?: string;
  delay?: number;
}

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeLabel,
  icon, 
  trend = 'neutral',
  accentColor = 'neon-cyan',
  delay = 0 
}: MetricCardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3" />;
      case 'down': return <TrendingDown className="w-3 h-3" />;
      default: return <Minus className="w-3 h-3" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-neon-green';
      case 'down': return 'text-neon-red';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="metric-card group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg bg-${accentColor}/10 text-${accentColor} group-hover:bg-${accentColor}/20 transition-colors`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{change > 0 ? '+' : ''}{change}%</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm text-muted-foreground">{title}</h3>
        <div className="font-mono text-2xl font-bold text-foreground">{value}</div>
        {changeLabel && (
          <p className="text-xs text-muted-foreground">{changeLabel}</p>
        )}
      </div>

      {/* Decorative corner */}
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-${accentColor}/10 to-transparent rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
    </motion.div>
  );
};

export default MetricCard;