/**
 * Command Header - Performance Optimized
 * Responsive, mobile-friendly, memoized
 */

import { useState, useEffect, memo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Volume2, VolumeX, Search, User, Settings, LogOut,
  AlertTriangle, CheckCircle, Clock, Zap, MessageSquare, Menu, Download, Smartphone,
  Bot, Headphones, HandHeart
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_CONFIG, AppRole } from '@/types/roles';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { SafeAssistTrigger } from '@/components/support/SafeAssistTrigger';
import promiseIcon from '@/assets/promise-icon.jpg';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

const CommandHeader = memo(() => {
  const { user, userRole, signOut } = useAuth();
  const location = useLocation();
  const [buzzerActive, setBuzzerActive] = useState(false);
  const [buzzerMuted, setBuzzerMuted] = useState(false);
  const [promiseState, setPromiseState] = useState<'idle' | 'pending' | 'active'>('idle');
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', type: 'critical', title: 'Demo Down', message: 'E-commerce demo offline', timestamp: new Date(), acknowledged: false },
    { id: '2', type: 'warning', title: 'SLA Breach', message: 'Task #2847 exceeded deadline', timestamp: new Date(), acknowledged: false },
    { id: '3', type: 'info', title: 'New Lead', message: 'Hot lead from Mumbai assigned', timestamp: new Date(), acknowledged: true },
  ]);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleChatbotClick = useCallback(() => {
    setChatbotOpen(true);
    toast.success('AI Assistant Ready', {
      description: 'How can I help you today?'
    });
  }, []);

  const handlePromiseClick = () => {
    if (promiseState === 'idle') {
      setPromiseState('pending');
      toast.success('Promise mode activated');
    } else if (promiseState === 'pending') {
      setPromiseState('active');
      toast.success('Task is now active');
    } else {
      setPromiseState('idle');
      toast.info('Promise mode deactivated');
    }
  };

  const handleDownloadAPK = useCallback(() => {
    toast.success('Downloading Software Vala Mobile App...', {
      description: 'APK file will be downloaded shortly'
    });
    // Create a download link for the APK
    const link = document.createElement('a');
    link.href = '/software-vala-app.apk';
    link.download = 'SoftwareVala-Mobile-v1.0.0.apk';
    link.click();
  }, []);

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;
  const roleConfig = userRole ? ROLE_CONFIG[userRole as AppRole] : null;

  // Buzzer effect for critical alerts
  useEffect(() => {
    const criticalUnacked = alerts.some(a => a.type === 'critical' && !a.acknowledged);
    setBuzzerActive(criticalUnacked && !buzzerMuted);
  }, [alerts, buzzerMuted]);

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'warning': return <Clock className="w-4 h-4 text-neon-orange" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-neon-green" />;
      default: return <Zap className="w-4 h-4 text-primary" />;
    }
  };

  const getMaskedIdentity = () => {
    if (!user?.email) return 'Unknown';
    return user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3');
  };

  return (
    <header className="h-16 border-b border-sidebar-border bg-sidebar flex items-center justify-between px-4 sticky top-0 z-50 shadow-lg">
      {/* Left: Logo & Breadcrumb */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-white/95 flex items-center justify-center shadow-md">
            <span className="font-bold text-lg text-primary">SV</span>
          </div>
          <span className="font-mono font-bold text-lg hidden md:block text-sidebar-foreground">Software Vala</span>
        </Link>
        
        {/* Breadcrumb */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-sidebar-foreground/70">
          <span>/</span>
          <span className="capitalize">{location.pathname.split('/')[1] || 'Home'}</span>
          {location.pathname.split('/')[2] && (
            <>
              <span>/</span>
              <span className="capitalize text-sidebar-foreground font-medium">{location.pathname.split('/')[2].replace('-', ' ')}</span>
            </>
          )}
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-xl mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <Input
            placeholder="Search leads, tasks, demos..."
            className="pl-10 bg-white/15 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:bg-white/20"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Download APK Button */}
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadAPK}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all border border-cyan-400/30"
        >
          <Smartphone className="w-4 h-4" />
          <span className="hidden md:inline">Download App</span>
          <Download className="w-4 h-4" />
        </motion.button>

        {/* Promise Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePromiseClick}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all shadow-md",
            promiseState === 'active'
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border border-green-400/50 shadow-green-500/30'
              : promiseState === 'pending'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border border-amber-400/50 animate-pulse shadow-amber-500/30'
              : 'bg-secondary/80 text-foreground border border-border/50 hover:border-primary/50 hover:bg-secondary'
          )}
        >
          <img src={promiseIcon} alt="Promise" className="w-6 h-6 rounded-full object-cover ring-2 ring-white/20" />
          <span className="hidden sm:inline">
            {promiseState === 'active' ? 'Active' : promiseState === 'pending' ? 'Promise' : 'No Task'}
          </span>
        </motion.button>

        {/* Safe Assist Button */}
        <SafeAssistTrigger variant="compact" />

        {/* AI Chatbot Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleChatbotClick}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium text-sm shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all border border-purple-400/30"
        >
          <Bot className="w-4 h-4" />
          <span className="hidden md:inline">AI Chat</span>
        </motion.button>

        {/* Alert Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all shadow-md",
                unacknowledgedCount > 0
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white border border-red-400/50 shadow-red-500/30"
                  : "bg-secondary/80 text-foreground border border-border/50 hover:border-primary/50"
              )}
            >
              <Bell className="w-4 h-4" />
              <span className="hidden md:inline">Alerts</span>
              {unacknowledgedCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-white text-red-600 text-xs rounded-full flex items-center justify-center font-bold shadow-md"
                >
                  {unacknowledgedCount}
                </motion.span>
              )}
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-card/95 backdrop-blur-xl border-border/50">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Badge variant="secondary" className="text-xs">{alerts.length}</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              {alerts.map((alert) => (
                <DropdownMenuItem
                  key={alert.id}
                  className={`flex items-start gap-3 p-3 cursor-pointer ${!alert.acknowledged ? 'bg-primary/5' : ''}`}
                  onClick={() => acknowledgeAlert(alert.id)}
                >
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{alert.message}</p>
                  </div>
                  {!alert.acknowledged && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Buzzer Control */}
        <AnimatePresence>
          {buzzerActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="relative"
            >
              <motion.div
                animate={{
                  boxShadow: ['0 0 0 0 hsl(0 84% 60% / 0.4)', '0 0 0 10px hsl(0 84% 60% / 0)', '0 0 0 0 hsl(0 84% 60% / 0)'],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setBuzzerMuted(!buzzerMuted)}
                className="relative bg-destructive/20 hover:bg-destructive/30 text-destructive"
              >
                {buzzerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Internal Chat Link */}
        <Button variant="ghost" size="icon" asChild>
          <Link to="/internal-chat">
            <MessageSquare className="w-5 h-5" />
          </Link>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-neon-teal flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-border/50">
            <DropdownMenuLabel>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: roleConfig?.color || '#888' }}
                />
                <span>{roleConfig?.label || 'User'}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
});

CommandHeader.displayName = 'CommandHeader';

export default CommandHeader;
