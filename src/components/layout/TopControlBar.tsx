import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Activity,
  Users,
  DollarSign,
  Bell,
  Shield,
  Volume2,
  VolumeX,
  AlertTriangle,
  Server,
  Cpu,
  Wallet,
  Bot,
  Radio,
  Lock,
  Unlock,
} from 'lucide-react';

interface StatusItem {
  label: string;
  status: 'online' | 'warning' | 'critical';
  icon: React.ReactNode;
  value?: string;
  path?: string;
}

const TopControlBar = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const isSuperAdmin = userRole === 'super_admin';

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFrozen, setIsFrozen] = useState(false);
  const [noiseReduction, setNoiseReduction] = useState(false);
  const [notifications, setNotifications] = useState(12);
  const [liveUsers, setLiveUsers] = useState(2847);
  const [revenue, setRevenue] = useState(847293);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate live data
      setLiveUsers((prev) => prev + Math.floor(Math.random() * 10 - 5));
      setRevenue((prev) => prev + Math.floor(Math.random() * 100));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const statusItems: StatusItem[] = [
    ...(isSuperAdmin
      ? ([
          {
            label: 'System',
            status: 'online',
            icon: <Server className="w-3.5 h-3.5" />,
            path: '/super-admin/system-settings',
          },
          {
            label: 'Demo',
            status: 'online',
            icon: <Activity className="w-3.5 h-3.5" />,
            path: '/super-admin/demo-manager',
          },
        ] as StatusItem[])
      : []),
    {
      label: 'API',
      status: 'warning',
      icon: <Radio className="w-3.5 h-3.5" />,
      path: '/api-integrations',
    },
    ...(isSuperAdmin
      ? ([
          {
            label: 'AI',
            status: 'online',
            icon: <Bot className="w-3.5 h-3.5" />,
            path: '/super-admin/ai-billing',
          },
          {
            label: 'Wallet',
            status: 'online',
            icon: <Wallet className="w-3.5 h-3.5" />,
            path: '/super-admin/finance-center',
          },
          {
            label: 'Server',
            status: 'online',
            icon: <Cpu className="w-3.5 h-3.5" />,
            path: '/super-admin/system-settings',
          },
        ] as StatusItem[])
      : []),
  ];

  const getStatusColor = (status: StatusItem['status']) => {
    switch (status) {
      case 'online':
        return 'status-dot-online';
      case 'warning':
        return 'status-dot-warning';
      case 'critical':
        return 'status-dot-critical';
      default:
        return 'status-dot-online';
    }
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-14 glass-panel border-b border-border/30 flex items-center justify-between px-4 relative z-50"
    >
      {/* Left Section - Status Heatmap */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          {statusItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-2 text-xs cursor-pointer hover:bg-secondary/50 px-2 py-1 rounded-md transition-colors"
              onClick={() => item.path && navigate(item.path)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-muted-foreground">{item.icon}</div>
              <span className="text-muted-foreground hidden xl:inline">{item.label}</span>
              <div className={`status-dot ${getStatusColor(item.status)}`} />
            </motion.div>
          ))}
        </div>

        <div className="w-px h-6 bg-border/50" />

        {/* Live Users */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-neon-cyan" />
          <span className="text-sm font-mono text-foreground">{liveUsers.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">live</span>
        </div>
      </div>

      {/* Center Section - Time & Revenue */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8">
        <div className="text-center">
          <div className="font-mono text-lg neon-text">
            {currentTime.toLocaleTimeString('en-US', { hour12: false })}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>

        <div className="w-px h-8 bg-border/50" />

        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-neon-green" />
          <div>
            <div className="font-mono text-sm text-foreground">
              ${revenue.toLocaleString()}
            </div>
            <div className="text-[10px] text-neon-green">+12.4% today</div>
          </div>
        </div>
      </div>

      {/* Right Section - Controls */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
        >
          <Bell className="w-4 h-4 text-foreground" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-neon-red rounded-full text-[10px] font-bold flex items-center justify-center text-white">
              {notifications}
            </span>
          )}
        </motion.button>

        {/* Noise Reduction */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setNoiseReduction(!noiseReduction)}
          className={`p-2 rounded-lg transition-colors ${
            noiseReduction ? 'bg-primary/20 text-primary' : 'bg-secondary/50 text-foreground hover:bg-secondary'
          }`}
        >
          {noiseReduction ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </motion.button>

        {/* Freeze Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFrozen(!isFrozen)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs transition-all ${
            isFrozen 
              ? 'bg-neon-red/20 text-neon-red border border-neon-red/50' 
              : 'bg-secondary/50 text-foreground hover:bg-secondary border border-transparent'
          }`}
        >
          {isFrozen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          <span className="hidden lg:inline">{isFrozen ? 'FROZEN' : 'ACTIVE'}</span>
        </motion.button>

        {/* Emergency Broadcast */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neon-orange/20 text-neon-orange border border-neon-orange/50 font-medium text-xs hover:bg-neon-orange/30 transition-colors"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">BROADCAST</span>
        </motion.button>

        {/* Super Admin Badge */}
        {isSuperAdmin && (
          <div className="flex items-center gap-2 px-3 py-1.5 glass-panel-glow rounded-lg">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary">SUPER ADMIN</span>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default TopControlBar;