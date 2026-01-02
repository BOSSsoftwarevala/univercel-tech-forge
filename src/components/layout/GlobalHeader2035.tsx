import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

interface HeaderProps {
  roleName: string;
  maskedId: string;
  lowDataMode: boolean;
  onChatToggle: () => void;
}

const GlobalHeader2035 = ({ roleName, maskedId, lowDataMode, onChatToggle }: HeaderProps) => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', message: 'High priority lead waiting', time: '2m ago' },
    { id: 2, type: 'info', message: 'Task assigned to you', time: '5m ago' },
    { id: 3, type: 'success', message: 'Payment received', time: '15m ago' },
  ]);
  const [buzzerActive, setBuzzerActive] = useState(true);
  const [systemHealth, setSystemHealth] = useState(98.5);
  const [soundEnabled, setSoundEnabled] = useState(true);

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

        {/* Promise Button */}
        <Button
          size="sm"
          className={cn(
            "gap-2",
            lowDataMode 
              ? "bg-primary"
              : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          )}
        >
          <Sparkles className="h-4 w-4" />
          Promise
        </Button>
      </div>

      {/* Right Section - Actions & Profile */}
      <div className="flex items-center gap-3">
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

        {/* AI Quick Assist */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bot className="h-4 w-4 text-cyan-400" />
          {!lowDataMode && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          )}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {notifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                  {notifications.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2 border-b border-border">
              <h4 className="font-semibold">Notifications</h4>
            </div>
            {notifications.map((notif) => (
              <DropdownMenuItem key={notif.id} className="flex items-start gap-3 p-3">
                <AlertTriangle className={cn(
                  "h-4 w-4 mt-0.5",
                  notif.type === 'alert' ? 'text-red-400' :
                  notif.type === 'success' ? 'text-green-400' : 'text-blue-400'
                )} />
                <div className="flex-1">
                  <p className="text-sm">{notif.message}</p>
                  <span className="text-xs text-muted-foreground">{notif.time}</span>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Chat Toggle */}
        <Button variant="ghost" size="icon" onClick={onChatToggle}>
          <MessageSquare className="h-4 w-4" />
        </Button>

        {/* User Profile (Masked) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-2 pr-3">
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center",
                lowDataMode 
                  ? "bg-muted" 
                  : "bg-gradient-to-br from-cyan-500/30 to-blue-500/30"
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
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Security</DropdownMenuItem>
            <DropdownMenuItem>Help Center</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-400">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default GlobalHeader2035;
