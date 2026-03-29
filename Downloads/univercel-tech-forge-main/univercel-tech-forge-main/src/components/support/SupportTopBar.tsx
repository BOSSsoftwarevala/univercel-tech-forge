import { motion } from 'framer-motion';
import { Bell, Sparkles, User, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SupportTopBarProps {
  onNotificationClick: () => void;
  onAIClick: () => void;
}

const SupportTopBar = ({ onNotificationClick, onAIClick }: SupportTopBarProps) => {
  const [ticketCount, setTicketCount] = useState(12);
  const [hasNotifications, setHasNotifications] = useState(true);

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 h-16 bg-slate-900/60 backdrop-blur-2xl border-b border-teal-500/10 z-50 flex items-center justify-between px-6"
    >
      {/* Left - Logo & Title */}
      <div className="flex items-center gap-4">
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-teal-500/20">
            SV
          </div>
        </motion.div>
        <h1 className="text-lg font-semibold text-white">
          Support Command Center
        </h1>
      </div>

      {/* Center - Live Ticket Pulse */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <motion.div
          className="flex items-center gap-3 px-5 py-2 rounded-full bg-slate-800/40 border border-teal-500/20"
          animate={{ 
            boxShadow: ['0 0 0 rgba(20, 184, 166, 0)', '0 0 20px rgba(20, 184, 166, 0.1)', '0 0 0 rgba(20, 184, 166, 0)'] 
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-teal-400 rounded-full"
          />
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            <span className="text-sm text-slate-300">
              <span className="text-teal-400 font-semibold">{ticketCount}</span> Open Tickets
            </span>
          </div>
        </motion.div>
      </div>

      {/* Right - Controls */}
      <div className="flex items-center gap-3">
        {/* User ID */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/30 border border-slate-700/30">
          <User className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-slate-400">vala(support)***</span>
        </div>

        {/* AI Troubleshooter Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAIClick}
          className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500/10 to-sky-500/10 border border-teal-500/20 hover:border-teal-400/30 transition-all group"
        >
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span className="text-sm text-teal-400 font-medium">AI Troubleshooter</span>
        </motion.button>

        {/* Notification Bell */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNotificationClick}
          className="relative p-2.5 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-teal-500/20 transition-all"
        >
          <Bell className="w-5 h-5 text-slate-400" />
          {hasNotifications && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-400 rounded-full"
            />
          )}
        </motion.button>
      </div>
    </motion.header>
  );
};

export default SupportTopBar;
