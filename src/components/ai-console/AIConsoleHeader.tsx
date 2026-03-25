import { motion } from 'framer-motion';
import { Bell, Wallet, Activity, Brain, Cpu, Shield, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AIConsoleHeaderProps {
  currentMode: 'generative' | 'lite' | 'cache';
}

const AIConsoleHeader = ({ currentMode }: AIConsoleHeaderProps) => {
  const getModeStyles = () => {
    switch (currentMode) {
      case 'generative':
        return { bg: 'bg-neon-purple/20', border: 'border-neon-purple/50', glow: 'shadow-neon-purple/30' };
      case 'lite':
        return { bg: 'bg-neon-cyan/20', border: 'border-neon-cyan/50', glow: 'shadow-neon-cyan/30' };
      case 'cache':
        return { bg: 'bg-neon-green/20', border: 'border-neon-green/50', glow: 'shadow-neon-green/30' };
    }
  };

  const styles = getModeStyles();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50">
      {/* Main Header */}
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Left - Logo & Title */}
        <div className="flex items-center gap-4">
          {/* Software Vala Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sv-blue to-sv-blue-bright flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <motion.div
                className="absolute -inset-1 rounded-lg bg-sv-blue/30 blur-md -z-10"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight font-mono">
                SOFTWARE VALA
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                Enterprise AI Platform
              </p>
            </div>
          </motion.div>

          <div className="h-8 w-px bg-border/50 mx-2" />

          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            <span className="text-xl font-bold text-foreground font-mono">
              AI Optimization Console
            </span>
          </div>
        </div>

        {/* Right - Status Indicators */}
        <div className="flex items-center gap-4">
          {/* System Load Indicator */}
          <Tooltip>
            <TooltipTrigger>
              <motion.div 
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50"
                whileHover={{ scale: 1.02 }}
              >
                <Activity className="w-4 h-4 text-neon-green" />
                <span className="text-sm font-medium text-foreground">42%</span>
                <span className="text-xs text-muted-foreground">Load</span>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Current System Load</p>
            </TooltipContent>
          </Tooltip>

          {/* Wallet Cost */}
          <Tooltip>
            <TooltipTrigger>
              <motion.div 
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50"
                whileHover={{ scale: 1.02 }}
              >
                <Wallet className="w-4 h-4 text-neon-orange" />
                <span className="text-sm font-medium text-foreground">$847.32</span>
                <span className="text-xs text-muted-foreground">Today</span>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Today's AI Cost</p>
            </TooltipContent>
          </Tooltip>

          {/* Notification Bell */}
          <Tooltip>
            <TooltipTrigger>
              <motion.button 
                className="relative p-2 rounded-lg bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5 text-foreground" />
                <motion.span 
                  className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-[10px] font-bold text-destructive-foreground"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  3
                </motion.span>
              </motion.button>
            </TooltipTrigger>
            <TooltipContent>
              <p>3 Unread Notifications</p>
            </TooltipContent>
          </Tooltip>

          {/* Current Mode Badge */}
          <motion.div 
            className={`px-4 py-2 rounded-lg ${styles.bg} border ${styles.border} shadow-lg ${styles.glow}`}
            animate={{ boxShadow: ['0 0 20px rgba(0,0,0,0.3)', '0 0 30px rgba(0,0,0,0.5)', '0 0 20px rgba(0,0,0,0.3)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center gap-2">
              <Zap className={`w-4 h-4 ${
                currentMode === 'generative' ? 'text-neon-purple' :
                currentMode === 'lite' ? 'text-neon-cyan' : 'text-neon-green'
              }`} />
              <span className="text-sm font-bold uppercase tracking-wider">
                {currentMode} Mode
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sub Header */}
      <div className="h-10 px-6 flex items-center justify-between border-t border-border/30 bg-secondary/20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-3.5 h-3.5 text-neon-green" />
            <span>Smart AI Switching</span>
          </div>
          <div className="w-px h-4 bg-border/50" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Wallet className="w-3.5 h-3.5 text-neon-orange" />
            <span>Cost Controlled</span>
          </div>
          <div className="w-px h-4 bg-border/50" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="w-3.5 h-3.5 text-neon-cyan" />
            <span>Zero Downtime</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-xs bg-neon-green/10 border-neon-green/30 text-neon-green">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green mr-1.5 animate-pulse" />
            System Healthy
          </Badge>
          <span className="text-xs text-muted-foreground">
            Last sync: 2 seconds ago
          </span>
        </div>
      </div>
    </header>
  );
};

export default AIConsoleHeader;
