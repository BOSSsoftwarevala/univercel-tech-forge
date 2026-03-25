import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  AlertTriangle,
  MessageSquare,
  Bot,
  Activity,
  Zap,
  Shield,
  User,
  ChevronDown,
  Search,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProtectedActionHandler } from '@/hooks/useProtectedActionHandler';
import { useNotifications } from '@/contexts/NotificationContext';

interface HeaderProps {
  roleName: string;
  maskedId: string;
  lowDataMode: boolean;
  onChatToggle: () => void;
}

const GlobalHeader2035 = ({ roleName, maskedId, lowDataMode, onChatToggle }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { handleAction } = useProtectedActionHandler();
  const { notifications, unreadCount } = useNotifications();

  const [buzzerActive, setBuzzerActive] = useState(true);
  const [systemHealth, setSystemHealth] = useState(98.5);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const notificationPreview = notifications.slice(0, 5);

  // Simulate real-time health updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(prev => {
        const change = (Math.random() - 0.5) * 2;
        return Math.max(90, Math.min(100, prev + change));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Navigation handlers for requested buttons
  const goTo = useCallback((path: string) => navigate(path), [navigate]);

  const handleFranchise = useCallback(() => goTo('/franchise'), [goTo]);
  const handleReseller = useCallback(() => goTo('/reseller'), [goTo]);
  const handleInfluencer = useCallback(() => {
    void handleAction('becomeInfluencer');
  }, [handleAction]);
  const handleJoinDeveloper = useCallback(() => {
    void handleAction('joinDeveloper');
  }, [handleAction]);
  const handleApplyJob = useCallback(() => {
    void handleAction('applyForJob');
  }, [handleAction]);
  const handleLogin = useCallback(() => {
    void handleAction('login');
  }, [handleAction]);
  const handleBossPortal = useCallback(() => {
    void handleAction('bossPortal');
  }, [handleAction]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      goTo('/auth');
    } catch {
      goTo('/auth');
    }
  }, [signOut, goTo]);

  return (
    <header className={cn(
      "h-16 flex items-center justify-between px-6 border-b sticky top-0 z-40",
      "bg-[#1a1f3c] border-[#2a3f6f]"
    )}>
      {/* Left Section - Search & Role */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search anything..."
            className={cn(
              "w-64 h-9 pl-9 pr-4 rounded-lg text-sm transition-all",
              lowDataMode
                ? "bg-muted border border-border"
                : "bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
            )}
          />
        </div>

        <Badge variant="outline" className="border-primary/30 text-primary">
          {roleName}
        </Badge>
      </div>

      {/* Center Section - Alerts & Buzzers */}
      <div className="flex items-center gap-6">
        {/* Buzzer Indicator */}
        <motion.div
          animate={buzzerActive && !lowDataMode ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex items-center gap-2"
        >
          <div className={cn(
            "relative p-2 rounded-full",
            buzzerActive
              ? lowDataMode ? "bg-yellow-500/20" : "bg-gradient-to-r from-yellow-500/20 to-orange-500/20"
              : "bg-muted"
          )}>
            <Zap className={cn(
              "h-4 w-4",
              buzzerActive ? "text-yellow-400" : "text-muted-foreground"
            )} />
            {buzzerActive && !lowDataMode && (
              <span className="absolute inset-0 rounded-full animate-ping bg-yellow-500/20" />
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {buzzerActive ? 'Live' : 'Paused'}
          </span>
        </motion.div>

        {/* System Health */}
        <div className="flex items-center gap-2">
          <Activity className={cn(
            "h-4 w-4",
            systemHealth > 95 ? "text-green-400" :
            systemHealth > 85 ? "text-yellow-400" : "text-red-400"
          )} />
          <div className="w-24">
            <Progress
              value={systemHealth}
              className={cn(
                "h-2",
                systemHealth > 95 ? "[&>div]:bg-green-500" :
                systemHealth > 85 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-red-500"
              )}
            />
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {systemHealth.toFixed(1)}%
          </span>
        </div>

        {/* Promise Button (visual) */}
        <Button
          size="sm"
          className={cn(
            "gap-2",
            lowDataMode
              ? "bg-primary"
              : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          )}
          onClick={() => goTo('/promise-tracker')}
        >
          <Sparkles className="h-4 w-4" />
          Promise
        </Button>
      </div>

      {/* Right Section - Actions & Profile */}
      <div className="flex items-center gap-2">
        {/* Business / Partner Buttons */}
        <div className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleFranchise} className="text-sm">
            Franchise
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReseller} className="text-sm">
            Reseller
          </Button>
          <Button variant="ghost" size="sm" onClick={handleInfluencer} className="text-sm">
            Influencer
          </Button>
        </div>

        {/* Join / Jobs / Login / Boss Portal */}
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={handleJoinDeveloper} className="text-sm">
            Join as Developer
          </Button>

          <Button variant="subtle" size="sm" onClick={handleApplyJob} className="text-sm">
            Apply for Job
          </Button>

          {!user ? (
            <Button variant="default" size="sm" onClick={handleLogin} className="text-sm">
              Login
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 pl-2 pr-3">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center",
                    lowDataMode ? "bg-muted" : "bg-gradient-to-br from-cyan-500/30 to-blue-500/30"
                  )}>
                    <User className="h-4 w-4" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-medium">{maskedId}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Shield className="h-2.5 w-2.5" />
                      Masked Identity
                    </p>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => goTo('/profile')}>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => goTo('/user/library')}>My Library</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-400">Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button variant="destructive" size="sm" onClick={handleBossPortal} className="text-sm">
            Boss Portal
          </Button>

          {/* Chat Toggle */}
          <Button variant="ghost" size="icon" onClick={onChatToggle}>
            <MessageSquare className="h-4 w-4" />
          </Button>

          {/* Sound Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="relative"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2 border-b border-border">
                <h4 className="font-semibold">Notifications</h4>
              </div>
              {notificationPreview.length === 0 ? (
                <DropdownMenuItem className="flex items-start gap-3 p-3 text-muted-foreground">
                  No new notifications
                </DropdownMenuItem>
              ) : notificationPreview.map((notif) => (
                <DropdownMenuItem key={notif.id} className="flex items-start gap-3 p-3">
                  <AlertTriangle className={cn(
                    "h-4 w-4 mt-0.5",
                    notif.type === 'priority' || notif.type === 'danger' ? 'text-red-400' :
                    notif.type === 'success' ? 'text-green-400' : 'text-blue-400'
                  )} />
                  <div className="flex-1">
                    <p className="text-sm">{notif.message}</p>
                    <span className="text-xs text-muted-foreground">{notif.timestamp.toLocaleString()}</span>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary" onClick={() => goTo('/dashboard/notifications')}>
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader2035;
