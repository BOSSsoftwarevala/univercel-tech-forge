import React, { useState } from 'react';
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

interface BossPanelHeaderProps {
  streamingOn: boolean;
  onStreamingToggle: () => void;
}

// LOCKED: Header height 64px Desktop, colors #0B0F1A → #111827
export function BossPanelHeader({ streamingOn, onStreamingToggle }: BossPanelHeaderProps) {
  const [isLocking, setIsLocking] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

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

  const handleNotificationsClick = () => {
    toast.info('Notifications', { description: '3 critical alerts pending' });
  };

  const handleAssistClick = () => {
    toast.info('Assist Mode', { description: 'UltraViewer assist ready' });
  };

  const handlePromiseClick = () => {
    toast.info('Promise Tracker', { description: '12 active promises' });
  };

  const handleChatClick = () => {
    toast.info('Internal Chat', { description: 'Opening chat bot...' });
  };

  const handleLanguageClick = () => {
    toast.info('Language', { description: 'English (US)' });
  };

  const handleCurrencyClick = () => {
    toast.info('Currency', { description: 'USD ($)' });
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6"
      style={{ 
        height: '64px',
        background: 'linear-gradient(to right, #0B0F1A, #111827)'
      }}
    >
      {/* LEFT: Logo Icon Only - LOCKED */}
      <div className="flex items-center gap-3">
        <div 
          className="flex items-center justify-center"
          style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)'
          }}
        >
          <span className="text-white font-bold text-lg">S</span>
        </div>
      </div>

      {/* CENTER: Live Status - LOCKED */}
      <button
        onClick={onStreamingToggle}
        className="flex items-center gap-2 px-4 py-2 rounded-full transition-all"
        style={{
          height: '36px',
          background: streamingOn ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${streamingOn ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
          color: streamingOn ? '#10B981' : '#EF4444'
        }}
      >
        <Radio 
          style={{ width: '16px', height: '16px' }} 
          className={streamingOn ? 'animate-pulse' : ''} 
        />
        <span style={{ fontSize: '13px', fontWeight: 500 }}>
          {streamingOn ? 'LIVE' : 'PAUSED'}
        </span>
      </button>

      {/* RIGHT: Icon-only actions - LOCKED sizes 20-22px */}
      <div className="flex items-center gap-1">
        {/* Assist (UltraViewer) */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleAssistClick}
          className="hover:bg-white/5"
          style={{ width: '40px', height: '40px' }}
        >
          <Headphones style={{ width: '20px', height: '20px', color: '#9CA3AF' }} />
        </Button>

        {/* Promise Tracker */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handlePromiseClick}
          className="hover:bg-white/5"
          style={{ width: '40px', height: '40px' }}
        >
          <ListChecks style={{ width: '20px', height: '20px', color: '#9CA3AF' }} />
        </Button>

        {/* Internal Chat Bot */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleChatClick}
          className="hover:bg-white/5"
          style={{ width: '40px', height: '40px' }}
        >
          <MessageSquare style={{ width: '20px', height: '20px', color: '#9CA3AF' }} />
        </Button>

        {/* Notifications / Buzzer */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleNotificationsClick}
          className="relative hover:bg-white/5"
          style={{ width: '40px', height: '40px' }}
        >
          <Bell style={{ width: '20px', height: '20px', color: '#9CA3AF' }} />
          <span 
            className="absolute flex items-center justify-center text-white"
            style={{
              top: '4px',
              right: '4px',
              width: '16px',
              height: '16px',
              fontSize: '10px',
              fontWeight: 600,
              background: '#EF4444',
              borderRadius: '50%'
            }}
          >
            3
          </span>
        </Button>

        {/* Language */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleLanguageClick}
          className="hover:bg-white/5"
          style={{ width: '40px', height: '40px' }}
        >
          <Globe style={{ width: '20px', height: '20px', color: '#9CA3AF' }} />
        </Button>

        {/* Currency */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleCurrencyClick}
          className="hover:bg-white/5"
          style={{ width: '40px', height: '40px' }}
        >
          <Banknote style={{ width: '20px', height: '20px', color: '#9CA3AF' }} />
        </Button>

        {/* Emergency Lock */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-red-500/10"
              style={{ width: '40px', height: '40px' }}
            >
              <ShieldAlert style={{ width: '20px', height: '20px', color: '#EF4444' }} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent style={{ background: '#0B0F1A', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <AlertDialogHeader>
              <AlertDialogTitle style={{ color: '#EF4444' }}>⚠️ Emergency System Lock</AlertDialogTitle>
              <AlertDialogDescription style={{ color: '#BFC7D5' }}>
                This will immediately lock down all system operations. Only you can unlock it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                style={{ 
                  background: '#1E293B', 
                  border: '1px solid #1F2937',
                  color: '#FFFFFF'
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleEmergencyLock}
                disabled={isLocking}
                style={{ background: '#EF4444', color: '#FFFFFF' }}
              >
                {isLocking ? (
                  <>
                    <Loader2 style={{ width: '16px', height: '16px', marginRight: '8px' }} className="animate-spin" />
                    Locking...
                  </>
                ) : (
                  'Confirm Lock'
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
              className="hover:bg-white/5"
              style={{ width: '40px', height: '40px', padding: 0 }}
            >
              <div 
                className="flex items-center justify-center"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563EB, #1D4ED8)'
                }}
              >
                <User style={{ width: '16px', height: '16px', color: '#FFFFFF' }} />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end"
            style={{ background: '#0B0F1A', border: '1px solid #1F2937' }}
          >
            <DropdownMenuItem 
              onClick={() => navigate('/settings')}
              style={{ color: '#BFC7D5', cursor: 'pointer' }}
              className="hover:bg-white/5 focus:bg-white/5"
            >
              <User style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator style={{ background: '#1F2937' }} />
            <DropdownMenuItem 
              onClick={handleLogout}
              disabled={isLoggingOut}
              style={{ color: '#EF4444', cursor: 'pointer' }}
              className="hover:bg-red-500/10 focus:bg-red-500/10"
            >
              {isLoggingOut ? (
                <Loader2 style={{ width: '16px', height: '16px', marginRight: '8px' }} className="animate-spin" />
              ) : (
                <LogOut style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              )}
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
