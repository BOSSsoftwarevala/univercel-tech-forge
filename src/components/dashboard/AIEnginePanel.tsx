import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Brain, 
  MessageSquare, 
  Target, 
  AlertTriangle,
  Sparkles,
  Send
} from 'lucide-react';

interface AIMetric {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}

const aiMetrics: AIMetric[] = [
  { label: 'Auto Issues Resolved', value: '847', icon: <Brain className="w-4 h-4" />, trend: '+23%' },
  { label: 'Leads Qualified', value: '1,293', icon: <Target className="w-4 h-4" />, trend: '+18%' },
  { label: 'Chat Sessions', value: '3,847', icon: <MessageSquare className="w-4 h-4" />, trend: '+12%' },
  { label: 'Fraud Detected', value: '23', icon: <AlertTriangle className="w-4 h-4" />, trend: '-45%' },
];

const AIEnginePanel = ({ delay = 0 }: { delay?: number }) => {
  const [inputValue, setInputValue] = useState('');
  const [aiStatus, setAiStatus] = useState('Active');
  const [processingCount, setProcessingCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingCount(prev => (prev + Math.floor(Math.random() * 3)) % 100);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="glass-panel-glow p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/20">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">AI Decision Engine</h3>
            <span className="text-xs text-muted-foreground">Neural Processing v4.2</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="status-dot status-dot-online" />
          <span className="text-xs text-neon-green font-medium">{aiStatus}</span>
        </div>
      </div>

      {/* AI Processing Indicator */}
      <div className="glass-panel p-3 rounded-xl mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Processing Queue</span>
          <span className="text-xs font-mono text-primary">{processingCount} tasks</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-neon-teal rounded-full"
            animate={{ width: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {aiMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + (index * 0.05) }}
            className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              {metric.icon}
              <span className="text-[10px]">{metric.label}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg font-bold text-foreground">{metric.value}</span>
              <span className="text-xs text-neon-green">{metric.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Command Input */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask AI anything..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AIEnginePanel;