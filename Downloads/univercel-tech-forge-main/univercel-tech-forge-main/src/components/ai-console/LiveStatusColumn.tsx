import { motion } from 'framer-motion';
import { Brain, Zap, TrendingUp, DollarSign, Award, Clock, Database, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import RadialGauge from './RadialGauge';

interface LiveStatusColumnProps {
  currentMode: 'generative' | 'lite' | 'cache';
}

const LiveStatusColumn = ({ currentMode }: LiveStatusColumnProps) => {
  const getModeIcon = () => {
    switch (currentMode) {
      case 'generative': return <Brain className="w-5 h-5" />;
      case 'lite': return <Zap className="w-5 h-5" />;
      case 'cache': return <Database className="w-5 h-5" />;
    }
  };

  const getModeColor = () => {
    switch (currentMode) {
      case 'generative': return 'text-neon-purple';
      case 'lite': return 'text-neon-cyan';
      case 'cache': return 'text-neon-green';
    }
  };

  const getModeBg = () => {
    switch (currentMode) {
      case 'generative': return 'from-neon-purple/20 to-neon-purple/5 border-neon-purple/30';
      case 'lite': return 'from-neon-cyan/20 to-neon-cyan/5 border-neon-cyan/30';
      case 'cache': return 'from-neon-green/20 to-neon-green/5 border-neon-green/30';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground font-mono flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" />
        Live Status
      </h2>

      {/* Current Mode Card */}
      <motion.div 
        className={`metric-card bg-gradient-to-br ${getModeBg()}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Current Mode</span>
          <motion.div 
            className={getModeColor()}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {getModeIcon()}
          </motion.div>
        </div>
        <div className={`text-2xl font-bold uppercase tracking-wide ${getModeColor()}`}>
          {currentMode}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {currentMode === 'generative' && 'Full AI capabilities active'}
          {currentMode === 'lite' && 'Lightweight processing mode'}
          {currentMode === 'cache' && 'Serving cached responses'}
        </p>
      </motion.div>

      {/* AI Load Meter */}
      <motion.div 
        className="metric-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">AI Load Meter</span>
          <Badge variant="outline" className="text-xs bg-neon-green/10 border-neon-green/30 text-neon-green">
            Optimal
          </Badge>
        </div>
        <RadialGauge value={42} maxValue={100} label="System Load" />
      </motion.div>

      {/* Monthly AI Usage */}
      <motion.div 
        className="metric-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Monthly AI Usage</span>
          <TrendingUp className="w-4 h-4 text-neon-green" />
        </div>
        <div className="text-2xl font-bold text-foreground">847,293</div>
        <p className="text-xs text-muted-foreground">API calls this month</p>
        <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div 
            className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-green"
            initial={{ width: 0 }}
            animate={{ width: '67%' }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">67% of monthly limit</p>
      </motion.div>

      {/* Cost Threshold */}
      <motion.div 
        className="metric-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Cost Threshold</span>
          <DollarSign className="w-4 h-4 text-neon-orange" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">$12,847</span>
          <span className="text-sm text-muted-foreground">/ $20,000</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div 
            className="h-full rounded-full bg-gradient-to-r from-neon-orange to-neon-red"
            initial={{ width: 0 }}
            animate={{ width: '64%' }}
            transition={{ duration: 1, delay: 0.6 }}
          />
        </div>
      </motion.div>

      {/* Performance Score */}
      <motion.div 
        className="metric-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Performance Score</span>
          <Award className="w-4 h-4 text-gold" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-foreground">98.7</span>
          <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
            Excellent
          </Badge>
        </div>
      </motion.div>

      {/* Tag Chips */}
      <motion.div 
        className="flex flex-wrap gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Badge variant="outline" className="text-xs bg-neon-green/10 border-neon-green/30 text-neon-green">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green mr-1.5" />
          Peak Traffic ON
        </Badge>
        <Badge variant="outline" className="text-xs bg-secondary border-border text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mr-1.5" />
          Auto Degrade OFF
        </Badge>
        <Badge variant="outline" className="text-xs bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan">
          <Clock className="w-3 h-3 mr-1" />
          Cache Hit 89%
        </Badge>
      </motion.div>
    </div>
  );
};

export default LiveStatusColumn;
