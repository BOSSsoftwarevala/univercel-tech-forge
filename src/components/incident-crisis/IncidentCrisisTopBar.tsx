import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, Bell, Bot, Shield, Activity, 
  Clock, Radio, Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface IncidentCrisisTopBarProps {
  onNotificationClick: () => void;
  onAIClick: () => void;
  activeIncidents?: number;
}

const IncidentCrisisTopBar = ({ 
  onNotificationClick, 
  onAIClick,
  activeIncidents = 0
}: IncidentCrisisTopBarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const userName = user?.email?.split('@')[0] || 'Crisis Manager';

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 h-16 bg-slate-950/90 backdrop-blur-xl border-b border-red-500/20 z-50"
    >
      {/* Critical Alert Banner */}
      {activeIncidents > 0 && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 flex items-center justify-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-white animate-pulse" />
          <span className="text-white text-sm font-bold">
            {activeIncidents} ACTIVE INCIDENT{activeIncidents > 1 ? 'S' : ''} REQUIRING ATTENTION
          </span>
          <AlertTriangle className="w-4 h-4 text-white animate-pulse" />
        </motion.div>
      )}

      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ 
              scale: activeIncidents > 0 ? [1, 1.1, 1] : 1,
              rotate: activeIncidents > 0 ? [0, -5, 5, 0] : 0
            }}
            transition={{ duration: 0.5, repeat: activeIncidents > 0 ? Infinity : 0, repeatDelay: 2 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/30"
          >
            <Shield className="w-6 h-6 text-white" />
          </motion.div>
          
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Crisis Command Center
              </h1>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px] uppercase">
                Crisis Response
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              Welcome back, <span className="text-orange-400 font-medium">{userName}</span>
            </p>
          </div>
        </div>

        {/* Center - Status Indicators */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-red-500/20">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-xs text-slate-300">System Health: </span>
            <span className="text-xs font-bold text-green-400">98.5%</span>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-red-500/20">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-300">Response Time: </span>
            <span className="text-xs font-bold text-amber-400">2.3s avg</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Time Display */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-red-500/20">
            <Clock className="w-4 h-4 text-red-400" />
            <span className="text-sm font-mono text-slate-300">
              {currentTime.toLocaleTimeString('en-US', { hour12: false })}
            </span>
          </div>

          {/* Live Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30">
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-red-500"
            />
            <Radio className="w-4 h-4 text-red-400" />
            <span className="text-xs font-bold text-red-400 uppercase">Live</span>
          </div>

          {/* AI Crisis Analyzer */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onAIClick}
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
            >
              <Bot className="w-4 h-4 mr-2" />
              AI Crisis Analyzer
            </Button>
          </motion.div>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNotificationClick}
            className="relative p-2 rounded-lg bg-slate-800/50 border border-red-500/20 hover:bg-slate-700/50 transition-colors"
          >
            <Bell className="w-5 h-5 text-red-400" />
            {activeIncidents > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
              >
                {activeIncidents}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default IncidentCrisisTopBar;
