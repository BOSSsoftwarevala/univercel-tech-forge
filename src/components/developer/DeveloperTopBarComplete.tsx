import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Timer, User, Bot, Bell, Settings, LogOut, Play, Pause,
  ChevronDown, Circle, Shield, Briefcase, Eye, Moon, Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import GlobalNotificationHeader from '@/components/shared/GlobalNotificationHeader';

interface DeveloperTopBarCompleteProps {
  timerRunning: boolean;
  elapsedTime: string;
  onToggleTimer: () => void;
  projectName?: string;
  sprintStatus?: 'active' | 'paused' | 'completed';
  onNotificationClick?: () => void;
  onAIClick?: () => void;
  notifications?: any[];
}

const DeveloperTopBarComplete = ({
  timerRunning,
  elapsedTime,
  onToggleTimer,
  projectName = 'Payment Gateway Module',
  sprintStatus = 'active',
  onNotificationClick,
  onAIClick,
  notifications = []
}: DeveloperTopBarCompleteProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [availability, setAvailability] = useState<'available' | 'busy' | 'away'>('available');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await signOut();
    toast.success('Session ended successfully');
    navigate('/auth');
  };

  const getSprintStatusColor = () => {
    switch (sprintStatus) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'paused': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getAvailabilityColor = () => {
    switch (availability) {
      case 'available': return 'bg-emerald-400';
      case 'busy': return 'bg-red-400';
      case 'away': return 'bg-amber-400';
      default: return 'bg-slate-400';
    }
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 h-16 bg-slate-950/95 backdrop-blur-xl border-b border-cyan-500/20 z-50 flex items-center justify-between px-4"
    >
      {/* Left - Logo & Role Badge */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/30">
          SV
        </div>
        
        {/* Role Badge */}
        <div className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <span className="text-sm font-medium text-cyan-400">Developer</span>
        </div>

        {/* Project Name */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <Briefcase className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-300 max-w-[200px] truncate">{projectName}</span>
        </div>

        {/* Sprint Status */}
        <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getSprintStatusColor()}`}>
          <motion.div
            animate={sprintStatus === 'active' ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`w-2 h-2 rounded-full ${sprintStatus === 'active' ? 'bg-emerald-400' : sprintStatus === 'paused' ? 'bg-amber-400' : 'bg-blue-400'}`}
          />
          <span className="text-xs font-medium capitalize">Sprint: {sprintStatus}</span>
        </div>
      </div>

      {/* Center - Global Timer */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3">
        <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${
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
          <span className={`font-mono font-bold text-lg ${timerRunning ? 'text-red-400' : 'text-slate-400'}`}>
            {elapsedTime}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggleTimer}
            className={`p-1 h-7 w-7 ${timerRunning ? 'hover:bg-red-500/20' : 'hover:bg-emerald-500/20'}`}
          >
            {timerRunning ? (
              <Pause className="w-4 h-4 text-red-400" />
            ) : (
              <Play className="w-4 h-4 text-emerald-400" />
            )}
          </Button>
        </div>
      </div>

      {/* Right - Controls */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <GlobalNotificationHeader
          userRole="developer"
          notifications={notifications}
          onDismiss={() => {}}
          onAction={() => {}}
          showPromiseButton={true}
        />

        {/* AI Assistant Quick Access */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAIClick}
          className="relative p-2.5 rounded-lg bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 hover:border-violet-400/50 transition-all group"
        >
          <Bot className="w-5 h-5 text-violet-400 group-hover:text-violet-300" />
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-violet-400/10 blur-lg rounded-lg"
          />
        </motion.button>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-all"
          >
            <div className="relative">
              <User className="w-5 h-5 text-slate-400" />
              <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-800 ${getAvailabilityColor()}`} />
            </div>
            <span className="text-sm text-slate-300 hidden md:block">DEV***X4</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-56 bg-slate-900 border border-slate-700/50 rounded-xl shadow-xl overflow-hidden z-50"
              >
                {/* Profile Header */}
                <div className="p-4 border-b border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                      <User className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">DEV***X4</p>
                      <p className="text-xs text-slate-400">Senior Developer</p>
                    </div>
                  </div>
                </div>

                {/* Availability Status */}
                <div className="p-3 border-b border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-2">Availability Status</p>
                  <div className="flex gap-2">
                    {(['available', 'busy', 'away'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setAvailability(status)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                          availability === status
                            ? status === 'available' 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                              : status === 'busy'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                            : 'bg-slate-800/50 text-slate-400 border border-transparent hover:border-slate-600'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <button
                    onClick={() => { navigate('/developer/profile'); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">View Profile</span>
                  </button>
                  <button
                    onClick={() => { navigate('/settings'); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

export default DeveloperTopBarComplete;
