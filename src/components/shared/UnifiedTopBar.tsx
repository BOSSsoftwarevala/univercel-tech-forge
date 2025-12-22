import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Users, 
  DollarSign, 
  Shield, 
  Server,
  Bot,
  Radio,
  Wallet,
  Cpu,
  Search
} from 'lucide-react';
import { useRegionDetection } from '@/hooks/useRegionDetection';
import GlobalNotificationHeader from './GlobalNotificationHeader';
import HeaderAlertStack from './HeaderAlertStack';
import type { NotificationAlert } from './GlobalNotificationHeader';
import { Input } from '@/components/ui/input';

interface StatusItem {
  label: string;
  status: 'online' | 'warning' | 'critical';
  icon: React.ReactNode;
}

interface UnifiedTopBarProps {
  userRole: string;
  title?: string;
  subtitle?: string;
  notifications: NotificationAlert[];
  onDismissNotification: (id: string) => void;
  onNotificationAction: (id: string) => void;
  showSearch?: boolean;
  showPromiseButton?: boolean;
  onPromiseClick?: () => void;
  promiseState?: 'idle' | 'pending' | 'active';
  showStatusHeatmap?: boolean;
  customMetrics?: React.ReactNode;
  accentColor?: string;
}

const UnifiedTopBar = ({
  userRole,
  title = 'Command Center',
  subtitle,
  notifications,
  onDismissNotification,
  onNotificationAction,
  showSearch = false,
  showPromiseButton = false,
  onPromiseClick,
  promiseState = 'idle',
  showStatusHeatmap = false,
  customMetrics,
  accentColor = 'cyan',
}: UnifiedTopBarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const { formatTime, formatDate } = useRegionDetection();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const statusItems: StatusItem[] = [
    { label: 'System', status: 'online', icon: <Server className="w-3.5 h-3.5" /> },
    { label: 'Demo', status: 'online', icon: <Activity className="w-3.5 h-3.5" /> },
    { label: 'API', status: 'warning', icon: <Radio className="w-3.5 h-3.5" /> },
    { label: 'AI', status: 'online', icon: <Bot className="w-3.5 h-3.5" /> },
    { label: 'Wallet', status: 'online', icon: <Wallet className="w-3.5 h-3.5" /> },
    { label: 'Server', status: 'online', icon: <Cpu className="w-3.5 h-3.5" /> },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-400';
      case 'warning': return 'bg-amber-400';
      case 'critical': return 'bg-red-400 animate-pulse';
      default: return 'bg-emerald-400';
    }
  };

  const accentColors: Record<string, string> = {
    cyan: 'from-cyan-500 to-blue-500',
    violet: 'from-violet-500 to-purple-500',
    emerald: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-500 to-orange-500',
    rose: 'from-rose-500 to-pink-500',
    indigo: 'from-indigo-500 to-violet-500',
    teal: 'from-teal-500 to-cyan-500',
  };

  // Filter alerts for the stack (only show recent priority ones)
  const stackAlerts = notifications.filter(n => 
    n.type === 'priority' || n.type === 'danger'
  ).slice(0, 3);

  return (
    <>
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/30 z-50 flex items-center justify-between px-6"
      >
        {/* Left Section */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${accentColors[accentColor]} flex items-center justify-center font-bold text-white shadow-lg`}>
              SV
            </div>
          </motion.div>

          {/* Title */}
          <div>
            <h1 className={`text-lg font-bold bg-gradient-to-r ${accentColors[accentColor]} bg-clip-text text-transparent`}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-500">{subtitle}</p>
            )}
          </div>

          {/* Status Heatmap */}
          {showStatusHeatmap && (
            <>
              <div className="w-px h-8 bg-slate-700/50" />
              <div className="flex items-center gap-3">
                {statusItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-500">{item.icon}</span>
                    <span className="text-slate-400 hidden xl:inline">{item.label}</span>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`} />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Search */}
          {showSearch && (
            <div className="relative ml-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-64 pl-10 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
              />
            </div>
          )}
        </div>

        {/* Center - Time & Custom Metrics */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
          {/* Time */}
          <div className="text-center">
            <div className={`font-mono text-lg bg-gradient-to-r ${accentColors[accentColor]} bg-clip-text text-transparent`}>
              {formatTime(currentTime)}
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">
              {formatDate(currentTime, { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>

          {customMetrics && (
            <>
              <div className="w-px h-8 bg-slate-700/50" />
              {customMetrics}
            </>
          )}
        </div>

        {/* Right Section - Notifications */}
        <GlobalNotificationHeader
          userRole={userRole}
          notifications={notifications}
          onDismiss={onDismissNotification}
          onAction={onNotificationAction}
          showPromiseButton={showPromiseButton}
          onPromiseClick={onPromiseClick}
          promiseState={promiseState}
        />
      </motion.header>

      {/* Alert Stack (positioned below header) */}
      {stackAlerts.length > 0 && (
        <HeaderAlertStack
          alerts={stackAlerts}
          onDismiss={onDismissNotification}
          onAction={onNotificationAction}
        />
      )}
    </>
  );
};

export default UnifiedTopBar;
