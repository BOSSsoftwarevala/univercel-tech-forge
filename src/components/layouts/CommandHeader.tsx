/**
 * Command Header - Performance Optimized
 * Responsive, mobile-friendly, memoized
 */

import { useState, useEffect, memo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Volume2, VolumeX, Search, User, Settings, LogOut,
  AlertTriangle, CheckCircle, Clock, Zap, MessageSquare, Menu
} from 'lucide-react';
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
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', type: 'critical', title: 'Demo Down', message: 'E-commerce demo offline', timestamp: new Date(), acknowledged: false },
    { id: '2', type: 'warning', title: 'SLA Breach', message: 'Task #2847 exceeded deadline', timestamp: new Date(), acknowledged: false },
    { id: '3', type: 'info', title: 'New Lead', message: 'Hot lead from Mumbai assigned', timestamp: new Date(), acknowledged: true },
  ]);
  const [searchOpen, setSearchOpen] = useState(false);

  const handlePromiseClick = () => {
    if (promiseState === 'idle') {
      setPromiseState('pending');
    } else if (promiseState === 'pending') {
      setPromiseState('active');
    } else {
      setPromiseState('idle');
    }
  };

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
    <header className="h-16 border-b border-border/50 bg-card/80 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-50">
      {/* Left: Logo & Breadcrumb */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-neon-teal flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">SV</span>
          </div>
          <span className="font-mono font-bold text-lg hidden md:block">Software Vala</span>
        </Link>
        
        {/* Breadcrumb */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
          <span>/</span>
          <span className="capitalize">{location.pathname.split('/')[1] || 'Home'}</span>
          {location.pathname.split('/')[2] && (
            <>
              <span>/</span>
              <span className="capitalize text-foreground">{location.pathname.split('/')[2].replace('-', ' ')}</span>
            </>
          )}
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-xl mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search leads, tasks, demos..."
            className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Promise Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePromiseClick}
          className={cn(
            "flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium text-sm transition-all",
            promiseState === 'active'
              ? 'bg-green-500/20 text-green-500 border border-green-500/50'
              : promiseState === 'pending'
              ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50 animate-pulse'
              : 'bg-secondary/50 text-muted-foreground border border-border/50 hover:border-primary/50'
          )}
        >
          <img src={promiseIcon} alt="Promise" className="w-6 h-6 rounded-full object-cover" />
          <span className="hidden sm:inline">
            {promiseState === 'active' ? 'Active' : promiseState === 'pending' ? 'Promise' : 'No Task'}
          </span>
        </motion.button>

        {/* Safe Assist - ONLY visible to support roles, NOT to regular users */}
        {userRole && ['support', 'client_success', 'super_admin', 'master'].includes(userRole) && (
          <SafeAssistTrigger variant="compact" />
        )}

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

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unacknowledgedCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold"
                >
                  {unacknowledgedCount}
                </motion.span>
              )}
            </Button>
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

        {/* Chat */}
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
