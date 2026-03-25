import { motion } from 'framer-motion';
import { 
  ArrowRight, Brain, Zap, Database, GitBranch, 
  BarChart3, Clock, Repeat, Activity
} from 'lucide-react';

interface SwitchingLogicColumnProps {
  currentMode: 'generative' | 'lite' | 'cache';
}

const SwitchingLogicColumn = ({ currentMode }: SwitchingLogicColumnProps) => {
  const nodes = [
    { 
      id: 'input', 
      label: 'Input Trigger', 
      icon: Activity,
      color: 'from-sv-blue to-sv-blue-bright'
    },
    { 
      id: 'complexity', 
      label: 'complexity_score > threshold', 
      type: 'condition',
      active: currentMode === 'generative'
    },
    { 
      id: 'repetition', 
      label: 'repetition_score high', 
      type: 'condition',
      active: currentMode === 'lite'
    },
    { 
      id: 'cached', 
      label: 'cached_answer exists', 
      type: 'condition',
      active: currentMode === 'cache'
    },
    { 
      id: 'peak', 
      label: 'peak_traffic mode', 
      type: 'condition',
      active: false
    },
  ];

  const outputs = [
    { 
      id: 'generative', 
      label: 'Generative AI', 
      icon: Brain, 
      color: 'neon-purple',
      active: currentMode === 'generative'
    },
    { 
      id: 'lite', 
      label: 'Lightweight AI', 
      icon: Zap, 
      color: 'neon-cyan',
      active: currentMode === 'lite'
    },
    { 
      id: 'cache', 
      label: 'Cached Reply', 
      icon: Database, 
      color: 'neon-green',
      active: currentMode === 'cache'
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground font-mono flex items-center gap-2">
        <GitBranch className="w-5 h-5 text-primary" />
        Switching Logic
      </h2>

      <div className="metric-card relative overflow-visible">
        {/* Flow Container */}
        <div className="space-y-4">
          {/* Input Trigger */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-sv-blue/20 to-sv-blue-bright/10 border border-sv-blue/30">
              <div className="w-10 h-10 rounded-lg bg-sv-blue/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-sv-blue-bright" />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">Input Trigger</span>
                <p className="text-xs text-muted-foreground">Incoming AI Request</p>
              </div>
            </div>
            
            {/* Animated Arrow */}
            <div className="absolute left-1/2 -bottom-3 transform -translate-x-1/2">
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
              </motion.div>
            </div>
          </motion.div>

          {/* Condition Blocks */}
          <div className="space-y-2 pl-4 border-l-2 border-dashed border-border ml-5">
            {[
              { condition: 'complexity_score > threshold', result: 'generative', active: currentMode === 'generative' },
              { condition: 'repetition_score high', result: 'lite', active: currentMode === 'lite' },
              { condition: 'cached_answer exists', result: 'cache', active: currentMode === 'cache' },
              { condition: 'peak_traffic mode', result: 'lite', active: false },
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`relative flex items-center gap-2 p-2.5 rounded-lg transition-all duration-300 ${
                  item.active 
                    ? 'bg-primary/20 border border-primary/50 shadow-lg shadow-primary/20' 
                    : 'bg-secondary/50 border border-border/30'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <span className={`text-xs font-mono ${item.active ? 'text-primary' : 'text-muted-foreground'}`}>
                  IF →
                </span>
                <code className={`text-xs flex-1 ${item.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item.condition}
                </code>
                {item.active && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Animated Connecting Lines */}
          <div className="flex justify-center my-2">
            <motion.div 
              className="flex items-center gap-1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary/50"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </motion.div>
          </div>

          {/* Output Nodes */}
          <div className="space-y-2">
            {outputs.map((output, index) => {
              const Icon = output.icon;
              return (
                <motion.div
                  key={output.id}
                  className={`relative flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                    output.active 
                      ? `bg-${output.color}/20 border-2 border-${output.color}/50` 
                      : 'bg-secondary/30 border border-border/20 opacity-50'
                  }`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + 0.1 * index }}
                  style={output.active ? {
                    boxShadow: `0 0 30px hsl(var(--${output.color}) / 0.3)`,
                    background: `linear-gradient(135deg, hsl(var(--${output.color}) / 0.2) 0%, transparent 100%)`
                  } : {}}
                >
                  <motion.div 
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      output.active ? `bg-${output.color}/30` : 'bg-secondary'
                    }`}
                    animate={output.active ? { rotate: [0, 5, -5, 0] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Icon className={`w-5 h-5 ${output.active ? `text-${output.color}` : 'text-muted-foreground'}`} />
                  </motion.div>
                  <div className="flex-1">
                    <span className={`text-sm font-medium ${output.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {output.label}
                    </span>
                    {output.active && (
                      <motion.div 
                        className="flex items-center gap-1 mt-0.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full bg-${output.color} animate-pulse`} />
                        <span className={`text-xs text-${output.color}`}>Active</span>
                      </motion.div>
                    )}
                  </div>
                  {output.active && (
                    <motion.div
                      className={`absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-${output.color}`}
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Flow Animation Overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            animate={{ y: [0, 400, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SwitchingLogicColumn;
