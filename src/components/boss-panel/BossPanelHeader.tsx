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
  Banknote
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

interface BossPanelHeaderProps {
  streamingOn: boolean;
  onStreamingToggle: () => void;
}

// BRAND THEME: Dark header with blue accent
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
        () => setUnreadCount((prev) => prev + 1)
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

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16"
      style={{ background: 'hsl(217 91% 50%)' }}
    >
      {/* LEFT: Logo Icon Only */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white">
          <span className="font-bold text-lg" style={{ color: 'hsl(217 91% 50%)' }}>S</span>
        </div>
      </div>

      {/* CENTER: Live Status */}
      <button
        onClick={onStreamingToggle}
        className={`flex items-center gap-2 px-4 py-2 h-9 rounded-full transition-all border ${
          streamingOn 
            ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-500' 
            : 'bg-destructive/15 border-destructive/50 text-destructive'
        }`}
      >
        <Radio className={`w-4 h-4 ${streamingOn ? 'animate-pulse' : ''}`} />
        <span className="text-[13px] font-medium">
          {streamingOn ? 'LIVE' : 'PAUSED'}
        </span>
      </button>

      {/* RIGHT: Icon-only actions */}
      <div className="flex items-center gap-1">
        {/* Assist (UltraViewer) */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowAssist(true)}
          className="hover:bg-white/20 w-10 h-10"
        >
          <Headphones className="w-5 h-5 text-white" />
        </Button>

        {/* Promise Tracker */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowPromise(true)}
          className="hover:bg-white/20 w-10 h-10"
        >
          <ListChecks className="w-5 h-5 text-white" />
        </Button>

        {/* Internal Chat Bot */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowChat(true)}
          className="hover:bg-white/20 w-10 h-10"
        >
          <MessageSquare className="w-5 h-5 text-white" />
        </Button>

        {/* Notifications / Buzzer */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowNotifications(true)}
          className="relative hover:bg-white/20 w-10 h-10"
        >
          <Bell className="w-5 h-5 text-white" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-semibold bg-red-500 text-white rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>

        {/* Language */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowLanguage(true)}
          className="hover:bg-white/20 w-10 h-10"
        >
          <Globe className="w-5 h-5 text-white" />
        </Button>

        {/* Currency */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowCurrency(true)}
          className="hover:bg-white/20 w-10 h-10"
        >
          <Banknote className="w-5 h-5 text-white" />
        </Button>

        {/* Emergency Lock */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-destructive/10 w-10 h-10"
            >
              <ShieldAlert className="w-5 h-5 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-sidebar border-destructive/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive">⚠️ Emergency System Lock</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                This will immediately lock down all system operations. Only you can unlock it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-sidebar-accent border-sidebar-border text-foreground">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleEmergencyLock}
                disabled={isLocking}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isLocking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Locking...
                  </>
                ) : (
                  'ACTIVATE LOCKDOWN'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Profile Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="hover:bg-white/20 w-10 h-10 p-0"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white">
                <User className="w-4 h-4" style={{ color: 'hsl(217 91% 50%)' }} />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end"
            className="bg-sidebar border-sidebar-border"
          >
            <DropdownMenuItem 
              onClick={() => navigate('/settings')}
              className="text-muted-foreground hover:bg-white/5 focus:bg-white/5 cursor-pointer"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-sidebar-border" />
            <DropdownMenuItem 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 cursor-pointer"
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4 mr-2" />
              )}
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
