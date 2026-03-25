import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Minus, Award, Clock, Shield, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PerformanceMetricsCardProps {
  productivity: number;
  onTime: number;
  quality: number;
  penaltyStatus: 'none' | 'penalty' | 'bonus';
  penaltyAmount?: number;
}

const PerformanceMetricsCard = ({ 
  productivity, 
  onTime, 
  quality, 
  penaltyStatus,
  penaltyAmount = 0 
}: PerformanceMetricsCardProps) => {
  const getMetricColor = (value: number) => {
    if (value >= 90) return 'text-emerald-400';
    if (value >= 70) return 'text-amber-400';
    return 'text-red-400';
  };

  const getProgressColor = (value: number) => {
    if (value >= 90) return 'from-emerald-500 to-teal-500';
    if (value >= 70) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const getTrendIcon = (value: number) => {
    if (value >= 90) return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    if (value >= 70) return <Minus className="w-4 h-4 text-amber-400" />;
    return <TrendingDown className="w-4 h-4 text-red-400" />;
  };

  const metrics = [
    { label: 'Productivity', value: productivity, icon: BarChart3 },
    { label: 'On-Time', value: onTime, icon: Clock },
    { label: 'Quality', value: quality, icon: Shield },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
            <p className="text-xs text-slate-400">Read-only dashboard</p>
          </div>
        </div>

        {/* Penalty/Bonus Indicator */}
        {penaltyStatus !== 'none' && (
          <Badge 
            variant="outline" 
            className={
              penaltyStatus === 'bonus' 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                : 'bg-red-500/20 text-red-400 border-red-500/30'
            }
          >
            {penaltyStatus === 'bonus' ? (
              <>
                <Award className="w-3 h-3 mr-1" />
                +${penaltyAmount} Bonus
              </>
            ) : (
              <>
                <AlertTriangle className="w-3 h-3 mr-1" />
                -${penaltyAmount} Penalty
              </>
            )}
          </Badge>
        )}
      </div>

      <div className="space-y-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <metric.icon className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300">{metric.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${getMetricColor(metric.value)}`}>
                  {metric.value}%
                </span>
                {getTrendIcon(metric.value)}
              </div>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${getProgressColor(metric.value)}`}
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Overall Score */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-300">Overall Score</span>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${getMetricColor(Math.round((productivity + onTime + quality) / 3))}`}>
              {Math.round((productivity + onTime + quality) / 3)}%
            </span>
            <Award className={`w-5 h-5 ${getMetricColor(Math.round((productivity + onTime + quality) / 3))}`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PerformanceMetricsCard;
