import { motion } from 'framer-motion';
import { Bell, Bot, Radio, User, Timer } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DeveloperTopBarProps {
  onNotificationClick: () => void;
  onAIClick: () => void;
}

const DeveloperTopBar = ({ onNotificationClick, onAIClick }: DeveloperTopBarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hasNotifications, setHasNotifications] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-cyan-500/20 z-50 flex items-center justify-between px-6"
    >
      {/* Left - Logo */}
      <div className="flex items-center gap-4">
        <motion.div
          className="relative"
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/30">
            SV
          </div>
          <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-lg" />
        </motion.div>
      </div>

      {/* Center - Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3">
        <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Developer Command Center
        </h1>
      </div>

      {/* Right - Controls */}
      <div className="flex items-center gap-4">
        {/* Active Timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <Timer className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-mono text-slate-300">
            {currentTime.toLocaleTimeString()}
          </span>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"
          />
          <span className="text-sm font-medium text-emerald-400">LIVE</span>
        </div>

        {/* User ID */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <User className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-300">vala(dev)***</span>
        </div>

        {/* AI Assist Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAIClick}
          className="relative p-2.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 hover:border-cyan-400/50 transition-all group"
        >
          <Bot className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-cyan-400/10 blur-lg rounded-lg"
          />
        </motion.button>

        {/* Notification Bell */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNotificationClick}
          className="relative p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-all"
        >
          <Bell className="w-5 h-5 text-slate-400" />
          {hasNotifications && (
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute top-1 right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
            />
          )}
        </motion.button>
      </div>
    </motion.header>
  );
};

export default DeveloperTopBar;
