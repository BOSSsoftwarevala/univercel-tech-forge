import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, ShieldAlert, LogOut, User, Radio, Loader2,
  Headphones, MessageSquare, ListChecks, Globe, Banknote,
  Search, ChevronRight, Crown, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  NotificationsModal, AssistModal, PromiseTrackerModal,
  InternalChatModal, LanguageModal, CurrencyModal,
} from './BossActionModals';

// ─── ENTERPRISE DARK SHELL ───────────────────────────────────
const S = {
  bg:       'hsl(222, 47%, 7%)',
  bgHover:  'hsla(217, 92%, 65%, 0.1)',
  border:   'hsla(215, 40%, 35%, 0.3)',
  text:     'hsl(210, 40%, 98%)',
  muted:    'hsl(215, 22%, 58%)',
  brand:    'hsl(217, 92%, 65%)',
  green:    'hsl(160, 84%, 44%)',
  red:      'hsl(346, 82%, 55%)',
  amber:    'hsl(38, 95%, 55%)',
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
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

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
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'user_notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        if (payload.new && (payload.new as { is_read: boolean }).is_read === false) {
          setUnreadCount((prev) => prev + 1);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  const handleEmergencyLock = async () => {
    setIsLocking(true);
    try {
      await supabase.from('audit_logs').insert({
        user_id: user?.id, role: 'boss_owner' as any, module: 'boss-panel',
        action: 'emergency_system_lock', meta_json: { timestamp: new Date().toISOString() }
      });
      toast.success('🔒 EMERGENCY LOCK ACTIVATED', { description: 'All system operations frozen.', duration: 5000 });
    } catch { toast.error('Failed to activate emergency lock'); }
    finally { setIsLocking(false); }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.from('audit_logs').insert({
        user_id: user?.id, role: 'boss_owner' as any, module: 'boss-panel',
        action: 'secure_logout', meta_json: { timestamp: new Date().toISOString() }
      });
      await signOut();
      toast.success('Securely logged out');
      navigate('/auth');
    } catch { toast.error('Logout failed'); }
    finally { setIsLoggingOut(false); }
  };

  const IconBtn = ({ children, onClick, badge }: { children: React.ReactNode; onClick?: () => void; badge?: number }) => (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
      style={{ color: S.muted }}
      onMouseEnter={(e) => { e.currentTarget.style.background = S.bgHover; e.currentTarget.style.color = S.text; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = S.muted; }}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[9px] font-bold rounded-full"
          style={{ background: S.red, color: S.text }}>{badge > 9 ? '9+' : badge}</span>
      )}
    </button>
  );

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 flex items-center h-12 px-4"
      style={{ 
        background: S.bg, 
        borderBottom: `1px solid ${S.border}`,
        boxShadow: '0 4px 20px -4px hsla(222,47%,4%,0.6)',
      }}
    >
      {/* LEFT: Brand + Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
          style={{ background: `linear-gradient(135deg, ${S.brand}, hsl(262, 83%, 58%))` }}>
          <Crown className="w-4 h-4" style={{ color: S.text }} />
        </div>
        <div className="h-5 w-px" style={{ background: S.border }} />
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-bold" style={{ color: S.text }}>Software Vala</span>
          <ChevronRight className="w-3 h-3" style={{ color: S.muted }} />
          <span className="font-semibold" style={{ color: S.brand }}>Boss Command Center</span>
        </div>
      </div>

      {/* CENTER: Search */}
      <div className="flex-1 flex justify-center max-w-lg mx-auto">
        <div className="flex items-center gap-2 px-3.5 h-8 rounded-lg w-full transition-all"
          style={{ background: 'hsla(215, 28%, 20%, 0.5)', border: `1px solid ${S.border}` }}>
          <Search className="w-3.5 h-3.5" style={{ color: S.muted }} />
          <input type="text" placeholder="Search modules, reports, users..."
            className="bg-transparent text-xs outline-none flex-1 placeholder:text-inherit"
            style={{ color: S.text }} />
          <kbd className="text-[9px] px-1.5 py-0.5 rounded font-mono" 
            style={{ background: 'hsla(215, 28%, 25%, 0.6)', color: S.muted, border: `1px solid ${S.border}` }}>⌘K</kbd>
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-1">
        {/* Live indicator */}
        <button onClick={onStreamingToggle}
          className="flex items-center gap-1.5 px-3 h-7 rounded-lg text-[11px] font-bold mr-1 transition-all"
          style={{
            background: streamingOn ? 'hsla(160, 84%, 39%, 0.12)' : 'hsla(346, 77%, 49%, 0.12)',
            color: streamingOn ? S.green : S.red,
            border: `1px solid ${streamingOn ? 'hsla(160, 84%, 39%, 0.25)' : 'hsla(346, 77%, 49%, 0.25)'}`,
          }}>
          <Radio className={`w-3 h-3 ${streamingOn ? 'animate-pulse' : ''}`} />
          {streamingOn ? 'LIVE' : 'PAUSED'}
        </button>

        {/* Clock */}
        <div className="flex items-center gap-1.5 px-2.5 h-7 rounded-lg mr-1 text-[11px] font-mono tabular-nums"
          style={{ color: S.muted, background: 'hsla(215, 28%, 20%, 0.3)' }}>
          <Clock className="w-3 h-3" />
          {time.toLocaleTimeString('en-US', { hour12: false })}
        </div>

        <div className="h-5 w-px mx-1" style={{ background: S.border }} />

        <IconBtn onClick={() => setShowAssist(true)}><Headphones className="w-4 h-4" /></IconBtn>
        <IconBtn onClick={() => setShowPromise(true)}><ListChecks className="w-4 h-4" /></IconBtn>
        <IconBtn onClick={() => setShowChat(true)}><MessageSquare className="w-4 h-4" /></IconBtn>
        <IconBtn onClick={() => setShowNotifications(true)} badge={unreadCount}><Bell className="w-4 h-4" /></IconBtn>
        <IconBtn onClick={() => setShowLanguage(true)}><Globe className="w-4 h-4" /></IconBtn>
        <IconBtn onClick={() => setShowCurrency(true)}><Banknote className="w-4 h-4" /></IconBtn>

        <div className="h-5 w-px mx-1" style={{ background: S.border }} />

        {/* Emergency Lock */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex items-center justify-center w-9 h-9 rounded-lg transition-all hover:bg-red-500/10"
              style={{ color: S.red }}>
              <ShieldAlert className="w-4 h-4" />
            </button>
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
              <AlertDialogAction onClick={handleEmergencyLock} disabled={isLocking}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {isLocking ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Locking...</> : 'ACTIVATE LOCKDOWN'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center w-8 h-8 rounded-full ml-1"
              style={{ background: `linear-gradient(135deg, ${S.brand}, hsl(262, 83%, 58%))`, color: S.text }}>
              <User className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-sidebar border-sidebar-border">
            <DropdownMenuItem onClick={() => navigate('/settings')} className="text-muted-foreground hover:bg-white/5 cursor-pointer">
              <User className="w-4 h-4 mr-2" />Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-sidebar-border" />
            <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}
              className="text-destructive hover:bg-destructive/10 cursor-pointer">
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
