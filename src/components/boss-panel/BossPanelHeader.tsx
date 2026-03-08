import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  ShieldAlert, 
  LogOut, 
  User,
  Radio,
  Loader2,
  Headphones,
  MessageSquare,
  ListChecks,
  Globe,
  Banknote,
  Search,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  NotificationsModal,
  AssistModal,
  PromiseTrackerModal,
  InternalChatModal,
  LanguageModal,
  CurrencyModal,
} from './BossActionModals';

// ─── SAP SHELL BAR COLOR TOKENS ───────────────────────────────
const SHELL = {
  bg: 'hsl(214, 32%, 20%)',        // SAP Shell dark
  bgHover: 'hsl(214, 32%, 26%)',
  text: 'hsl(0, 0%, 100%)',
  textMuted: 'hsl(214, 20%, 70%)',
  separator: 'hsl(214, 25%, 30%)',
  brand: 'hsl(210, 100%, 46%)',    // SAP Blue
  badge: 'hsl(0, 78%, 55%)',       // SAP Negative
  positive: 'hsl(145, 63%, 42%)',
};

interface BossPanelHeaderProps {
  streamingOn: boolean;
  onStreamingToggle: () => void;
}

export function BossPanelHeader({ streamingOn, onStreamingToggle }: BossPanelHeaderProps) {
  const [isLocking, setIsLocking] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAssist, setShowAssist] = useState(false);
  const [showPromise, setShowPromise] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const fetchUnreadCount = async () => {
      const { count } = await supabase
        .from('user_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      setUnreadCount(count ?? 0);
    };

    fetchUnreadCount();

    const channel = supabase
      .channel(`header-notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new && (payload.new as { is_read: boolean }).is_read === false) {
            setUnreadCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleEmergencyLock = async () => {
    setIsLocking(true);
    try {
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        role: 'boss_owner' as any,
        module: 'boss-panel',
        action: 'emergency_system_lock',
        meta_json: { timestamp: new Date().toISOString() }
      });
      toast.success('🔒 EMERGENCY LOCK ACTIVATED', {
        description: 'All system operations have been frozen.',
        duration: 5000
      });
    } catch (error) {
      toast.error('Failed to activate emergency lock');
    } finally {
      setIsLocking(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        role: 'boss_owner' as any,
        module: 'boss-panel',
        action: 'secure_logout',
        meta_json: { timestamp: new Date().toISOString() }
      });
      await signOut();
      toast.success('Securely logged out');
      navigate('/auth');
    } catch (error) {
      toast.error('Logout failed');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const ShellButton = ({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center w-10 h-10 rounded transition-colors ${className}`}
      style={{ color: SHELL.text }}
      onMouseEnter={(e) => (e.currentTarget.style.background = SHELL.bgHover)}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </button>
  );

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 flex items-center h-11 px-3"
      style={{ background: SHELL.bg, borderBottom: `1px solid ${SHELL.separator}` }}
    >
      {/* LEFT: SAP Logo + Product Title */}
      <div className="flex items-center gap-3 mr-4">
        <div className="flex items-center justify-center w-8 h-8 rounded" style={{ background: SHELL.brand }}>
          <span className="font-bold text-sm" style={{ color: SHELL.text }}>SV</span>
        </div>
        <div className="h-5 w-px" style={{ background: SHELL.separator }} />
        <span className="text-sm font-medium" style={{ color: SHELL.text }}>Boss Command Center</span>
      </div>

      {/* CENTER: Search (SAP Shell Search) */}
      <div className="flex-1 flex justify-center max-w-md mx-auto">
        <div 
          className="flex items-center gap-2 px-3 h-8 rounded w-full"
          style={{ background: 'hsl(214, 32%, 26%)', border: `1px solid ${SHELL.separator}` }}
        >
          <Search className="w-3.5 h-3.5" style={{ color: SHELL.textMuted }} />
          <input 
            type="text" 
            placeholder="Search modules, reports, users..."
            className="bg-transparent text-xs outline-none flex-1 placeholder:text-inherit"
            style={{ color: SHELL.text }}
          />
        </div>
      </div>

      {/* RIGHT: Shell Actions */}
      <div className="flex items-center gap-0.5 ml-4">
        {/* Live Status Indicator */}
        <button
          onClick={onStreamingToggle}
          className="flex items-center gap-1.5 px-3 h-7 rounded text-xs font-medium mr-1 transition-colors"
          style={{
            background: streamingOn ? 'hsl(145, 63%, 20%)' : 'hsl(0, 78%, 25%)',
            color: streamingOn ? SHELL.positive : SHELL.badge,
            border: `1px solid ${streamingOn ? 'hsl(145, 63%, 35%)' : 'hsl(0, 78%, 40%)'}`
          }}
        >
          <Radio className={`w-3 h-3 ${streamingOn ? 'animate-pulse' : ''}`} />
          {streamingOn ? 'LIVE' : 'PAUSED'}
        </button>

        <div className="h-5 w-px mx-1" style={{ background: SHELL.separator }} />

        <ShellButton onClick={() => setShowAssist(true)}>
          <Headphones className="w-4 h-4" />
        </ShellButton>

        <ShellButton onClick={() => setShowPromise(true)}>
          <ListChecks className="w-4 h-4" />
        </ShellButton>

        <ShellButton onClick={() => setShowChat(true)}>
          <MessageSquare className="w-4 h-4" />
        </ShellButton>

        <ShellButton onClick={() => setShowNotifications(true)}>
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span 
              className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[9px] font-bold rounded-full"
              style={{ background: SHELL.badge, color: SHELL.text }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </ShellButton>

        <ShellButton onClick={() => setShowLanguage(true)}>
          <Globe className="w-4 h-4" />
        </ShellButton>

        <ShellButton onClick={() => setShowCurrency(true)}>
          <Banknote className="w-4 h-4" />
        </ShellButton>

        <div className="h-5 w-px mx-1" style={{ background: SHELL.separator }} />

        {/* Emergency Lock */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <ShellButton className="hover:!bg-red-900/30">
              <ShieldAlert className="w-4 h-4" style={{ color: SHELL.badge }} />
            </ShellButton>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-sidebar border-destructive/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive">⚠️ Emergency System Lock</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                This will immediately lock down all system operations. Only you can unlock it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-sidebar-accent border-sidebar-border text-foreground">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleEmergencyLock}
                disabled={isLocking}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isLocking ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Locking...</> : 'ACTIVATE LOCKDOWN'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Profile Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full ml-1 transition-colors"
              style={{ background: SHELL.brand, color: SHELL.text }}
            >
              <User className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-sidebar border-sidebar-border">
            <DropdownMenuItem onClick={() => navigate('/settings')} className="text-muted-foreground hover:bg-white/5 focus:bg-white/5 cursor-pointer">
              <User className="w-4 h-4 mr-2" />Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-sidebar-border" />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 cursor-pointer"
            >
              {isLoggingOut ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogOut className="w-4 h-4 mr-2" />}
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Modals */}
      <NotificationsModal open={showNotifications} onClose={() => setShowNotifications(false)} userId={user?.id} onUnreadCountChange={setUnreadCount} />
      <AssistModal open={showAssist} onClose={() => setShowAssist(false)} />
      <PromiseTrackerModal open={showPromise} onClose={() => setShowPromise(false)} />
      <InternalChatModal open={showChat} onClose={() => setShowChat(false)} />
      <LanguageModal open={showLanguage} onClose={() => setShowLanguage(false)} />
      <CurrencyModal open={showCurrency} onClose={() => setShowCurrency(false)} />
    </header>
  );
}
