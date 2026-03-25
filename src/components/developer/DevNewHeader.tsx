import { motion } from 'framer-motion';
import { Timer, User, Circle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DevNewHeaderProps {
  timerRunning: boolean;
  elapsedTime: string;
  status: 'assigned' | 'in_progress' | 'blocked' | 'review';
  maskedId: string;
}

const statusConfig = {
  assigned: { label: 'Assigned', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  in_progress: { label: 'In Progress', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  blocked: { label: 'Blocked', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  review: { label: 'Review', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
};

const DevNewHeader = ({ timerRunning, elapsedTime, status, maskedId }: DevNewHeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const statusInfo = statusConfig[status];

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 h-16 bg-slate-950/95 backdrop-blur-xl border-b border-cyan-500/20 z-50 flex items-center justify-between px-6"
    >
      {/* Left - Logo */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/30">
          SV
        </div>
        <span className="text-lg font-bold text-white hidden md:block">Developer Panel</span>
      </div>

      {/* Center - Timer */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        {/* Live Timer Indicator */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
          timerRunning 
            ? 'bg-red-500/10 border-red-500/50' 
            : 'bg-slate-800/50 border-slate-700/50'
        }`}>
          <motion.div
            animate={timerRunning ? { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <Circle className={`w-3 h-3 ${timerRunning ? 'fill-red-500 text-red-500' : 'fill-slate-500 text-slate-500'}`} />
          </motion.div>
          <Timer className={`w-4 h-4 ${timerRunning ? 'text-red-400' : 'text-slate-400'}`} />
          <span className={`font-mono font-bold ${timerRunning ? 'text-red-400' : 'text-slate-400'}`}>
            {elapsedTime}
          </span>
        </div>
      </div>

      {/* Right - Info */}
      <div className="flex items-center gap-3">
        {/* Role Badge */}
        <div className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <span className="text-sm font-medium text-cyan-400">Developer</span>
        </div>

        {/* Status Chip */}
        <div className={`px-3 py-1.5 rounded-lg border ${statusInfo.color}`}>
          <span className="text-sm font-medium">{statusInfo.label}</span>
        </div>

        {/* Masked ID */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <User className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-300 font-mono">{maskedId}</span>
        </div>
      </div>
    </motion.header>
  );
};

export default DevNewHeader;
