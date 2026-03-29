import { motion } from 'framer-motion';
import { Sparkles, User, Settings, TrendingUp, MessageSquare, Bell, HandHeart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalNotificationHeader from '@/components/shared/GlobalNotificationHeader';
import type { NotificationAlert } from '@/components/shared/GlobalNotificationHeader';
import { toast } from 'sonner';
import softwareValaLogo from '@/assets/software-vala-logo.png';

interface InfluencerTopBarProps {
  onNotificationClick: () => void;
  onAIClick: () => void;
  notifications?: NotificationAlert[];
  onDismissNotification?: (id: string) => void;
  onNotificationAction?: (id: string) => void;
}

const InfluencerTopBar = ({ 
  onNotificationClick, 
  onAIClick,
  notifications = [],
  onDismissNotification = () => {},
  onNotificationAction = () => {}
}: InfluencerTopBarProps) => {
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState(45280);
  const [showChat, setShowChat] = useState(false);

  // Simulate live earnings pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setEarnings(prev => prev + Math.floor(Math.random() * 50));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePromiseClick = () => {
    navigate('/promise-tracker');
  };

  const handleChatClick = () => {
    setShowChat(!showChat);
    toast.success('Opening internal chat...', { description: 'Team communication panel' });
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-violet-500/20 z-50 flex items-center justify-between px-6"
    >
      {/* Left - Logo & Title */}
      <div className="flex items-center gap-4">
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-10 h-10 rounded-lg overflow-hidden shadow-lg shadow-violet-500/30">
            <img 
              src={softwareValaLogo} 
              alt="Software Vala" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-violet-400/20 blur-xl rounded-lg" />
        </motion.div>
        <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
          Influencer Command Center
        </h1>
      </div>

      {/* Center - Live Earnings Pulse */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <motion.div
          className="flex items-center gap-3 px-6 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30"
          animate={{ boxShadow: ['0 0 20px rgba(139, 92, 246, 0.3)', '0 0 40px rgba(139, 92, 246, 0.5)', '0 0 20px rgba(139, 92, 246, 0.3)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400">Live Earnings</span>
            <motion.span
              key={earnings}
              initial={{ scale: 1.1, color: '#34d399' }}
              animate={{ scale: 1, color: '#ffffff' }}
              className="text-lg font-bold"
            >
              ₹{earnings.toLocaleString()}
            </motion.span>
          </div>
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"
          />
        </motion.div>
      </div>

      {/* Right - Controls */}
      <div className="flex items-center gap-3">
        {/* User ID */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <User className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-300">vala(influencer)***</span>
        </div>

        {/* Promise Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePromiseClick}
          className="relative p-2.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 hover:border-emerald-400/50 transition-all group"
          data-testid="promise-button"
        >
          <HandHeart className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
        </motion.button>

        {/* Internal Chat Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleChatClick}
          className="relative p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all group"
          data-testid="internal-chat-button"
        >
          <MessageSquare className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
        </motion.button>

        {/* Bell/Alert Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNotificationClick}
          className="relative p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/50 transition-all group"
        >
          <Bell className="w-5 h-5 text-amber-400 group-hover:text-amber-300" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </motion.button>

        {/* AI Optimizer Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAIClick}
          className="relative p-2.5 rounded-lg bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30 hover:border-violet-400/50 transition-all group"
        >
          <Sparkles className="w-5 h-5 text-violet-400 group-hover:text-violet-300" />
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-violet-400/10 blur-lg rounded-lg"
          />
        </motion.button>

        {/* Global Notification Header */}
        <GlobalNotificationHeader
          userRole="influencer"
          notifications={notifications}
          onDismiss={onDismissNotification}
          onAction={onNotificationAction}
        />

        {/* Settings */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSettingsClick}
          className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-all"
          data-testid="settings-button"
        >
          <Settings className="w-5 h-5 text-slate-400" />
        </motion.button>
      </div>
    </motion.header>
  );
};

export default InfluencerTopBar;
