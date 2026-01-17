/**
 * GlobalHeaderActions - Header icon bar with role-based visibility
 * STEP 8: Icon order - Assist, Promise, Internal Chat, Tasks, Alerts, Language, Currency, Profile
 * Icon size: 20px, Hit area: 40x40px, Spacing: 12px (gap-3)
 */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Bell, 
  MessageSquare, 
  ClipboardList, 
  Globe, 
  DollarSign, 
  User,
  Volume2,
  VolumeX,
  Check,
  ChevronDown,
  Lock,
  Key,
  LogOut,
  Settings,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { SafeAssistTrigger } from "@/components/support/SafeAssistTrigger";
import HeaderIconButton from "./HeaderIconButton";
import promiseIcon from "@/assets/promise-icon.jpg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserRole = 'boss' | 'employee' | 'client' | 'super_admin' | 'manager';

interface GlobalHeaderActionsProps {
  userRole: UserRole;
  onLogout?: () => void;
  profileGradient?: string;
  taskCount?: number;
  alertCount?: number;
  chatUnread?: number;
}

// Languages with flags
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
];

// Currencies
const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

export const GlobalHeaderActions = ({
  userRole,
  onLogout,
  profileGradient = "from-amber-500 to-orange-600",
  taskCount = 2,
  alertCount = 3,
  chatUnread = 5,
}: GlobalHeaderActionsProps) => {
  const navigate = useNavigate();
  
  // State
  const [promiseState, setPromiseState] = useState<'idle' | 'pending' | 'active'>('idle');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Role-based visibility
  const canSeeAssist = userRole !== 'client';
  const canSeePromise = userRole === 'boss' || userRole === 'super_admin' || userRole === 'manager';
  const canSeeInternalChat = userRole !== 'client';
  const canSeeCurrency = userRole === 'boss' || userRole === 'super_admin';

  // Handlers
  const handlePromiseClick = useCallback(() => {
    setActionLoading('promise');
    setTimeout(() => {
      if (promiseState === 'idle') {
        setPromiseState('pending');
        toast.success('Promise mode activated', {
          description: 'Tracking pending promises'
        });
      } else if (promiseState === 'pending') {
        setPromiseState('active');
        toast.success('Promise is now active');
      } else {
        setPromiseState('idle');
        toast.info('Promise mode deactivated');
      }
      setActionLoading(null);
    }, 300);
  }, [promiseState]);

  const handleChatClick = useCallback(() => {
    setActionLoading('chat');
    setTimeout(() => {
      navigate('/internal-chat');
      setActionLoading(null);
    }, 200);
  }, [navigate]);

  const handleTasksClick = useCallback(() => {
    toast.info(`${taskCount} Assigned Tasks`, {
      description: 'View your task assignments',
      action: {
        label: 'View All',
        onClick: () => navigate('/tasks')
      }
    });
  }, [taskCount, navigate]);

  const handleAlertsClick = useCallback(() => {
    toast.info(`${alertCount} Active Alerts`, {
      description: 'View all system alerts and notifications',
    });
  }, [alertCount]);

  const handleToggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
    toast.success(soundEnabled ? 'Alert sounds disabled' : 'Alert sounds enabled');
  }, [soundEnabled]);

  const handleLanguageChange = useCallback((langCode: string) => {
    setActionLoading('language');
    setCurrentLanguage(langCode);
    setLangMenuOpen(false);
    const lang = languages.find(l => l.code === langCode);
    setTimeout(() => {
      toast.success(`Language changed to ${lang?.name}`, {
        description: 'UI will reload with new language'
      });
      setActionLoading(null);
    }, 500);
  }, []);

  const handleCurrencyChange = useCallback((currCode: string) => {
    setCurrentCurrency(currCode);
    setCurrencyMenuOpen(false);
    const curr = currencies.find(c => c.code === currCode);
    toast.success(`Currency changed to ${curr?.name}`);
  }, []);

  const handleProfileAction = useCallback((action: string) => {
    setProfileMenuOpen(false);
    switch (action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'password':
        toast.info('Change Password', { description: 'Opening password settings...' });
        break;
      case '2fa':
        toast.info('Two-Factor Authentication', { description: 'Opening 2FA settings...' });
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'logout':
        onLogout?.();
        break;
    }
  }, [navigate, onLogout]);

  const currentLang = languages.find(l => l.code === currentLanguage);
  const currentCurr = currencies.find(c => c.code === currentCurrency);

  return (
    <div className="flex items-center gap-3">
      {/* 1️⃣ Assist (UltraViewer-style) - Hidden for clients */}
      {canSeeAssist && (
        <SafeAssistTrigger variant="compact" />
      )}

      {/* 2️⃣ Promise - Hidden for clients and employees */}
      {canSeePromise && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePromiseClick}
          disabled={actionLoading === 'promise'}
          className={cn(
            "relative w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md group border",
            promiseState === 'active'
              ? 'bg-gradient-to-br from-green-600 to-emerald-600 border-green-400/50'
              : promiseState === 'pending'
              ? 'bg-gradient-to-br from-amber-500 to-orange-500 border-amber-400/50 animate-pulse'
              : 'bg-secondary/80 border-border/50 hover:border-primary/50'
          )}
          title={promiseState === 'active' ? 'Promise Active' : promiseState === 'pending' ? 'Promise Pending' : 'Promise Tracker'}
        >
          {actionLoading === 'promise' ? (
            <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
          ) : (
            <img src={promiseIcon} alt="Promise" className="w-5 h-5 rounded-full object-cover" />
          )}
          {promiseState !== 'idle' && (
            <span className={cn(
              "absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center",
              promiseState === 'active' ? "bg-green-400 text-green-900" : "bg-amber-400 text-amber-900"
            )}>
              1
            </span>
          )}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
            {promiseState === 'active' ? 'Promise Active' : promiseState === 'pending' ? 'Promise Pending' : 'Promise Tracker'}
          </div>
        </motion.button>
      )}

      {/* 3️⃣ Internal Chat - Hidden for clients */}
      {canSeeInternalChat && (
        <HeaderIconButton
          icon={MessageSquare}
          onClick={handleChatClick}
          tooltip="Internal Chat"
          badge={chatUnread > 0 ? chatUnread : undefined}
          badgeVariant="default"
          disabled={actionLoading === 'chat'}
        />
      )}

      {/* 4️⃣ Tasks */}
      <HeaderIconButton
        icon={ClipboardList}
        onClick={handleTasksClick}
        tooltip={`${taskCount} Tasks`}
        badge={taskCount > 0 ? taskCount : undefined}
        badgeVariant="warning"
      />

      {/* 5️⃣ Alerts / Bell */}
      <div className="relative flex items-center">
        <HeaderIconButton
          icon={Bell}
          onClick={handleAlertsClick}
          tooltip={`${alertCount} Alerts`}
          badge={alertCount > 0 ? alertCount : undefined}
          badgeVariant="danger"
          variant={alertCount > 0 ? 'danger' : 'default'}
        />
        {/* Sound Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleSound}
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center"
          title={soundEnabled ? 'Sound ON' : 'Sound OFF'}
        >
          {soundEnabled ? (
            <Volume2 className="w-3 h-3 text-emerald-400" />
          ) : (
            <VolumeX className="w-3 h-3 text-red-400" />
          )}
        </motion.button>
      </div>

      {/* 6️⃣ Language */}
      <DropdownMenu open={langMenuOpen} onOpenChange={setLangMenuOpen}>
        <DropdownMenuTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-10 h-10 rounded-xl bg-secondary/80 border border-border/50 hover:border-primary/50 flex items-center justify-center transition-all group"
          >
            {actionLoading === 'language' ? (
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
            ) : (
              <span className="text-lg">{currentLang?.flag}</span>
            )}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              Language: {currentLang?.name}
            </div>
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
              {currentLanguage === lang.code && <Check className="w-4 h-4 text-emerald-500" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 7️⃣ Currency - Hidden for employees and clients */}
      {canSeeCurrency && (
        <DropdownMenu open={currencyMenuOpen} onOpenChange={setCurrencyMenuOpen}>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10 rounded-xl bg-secondary/80 border border-border/50 hover:border-primary/50 flex items-center justify-center transition-all group"
            >
              <span className="text-lg font-semibold text-muted-foreground">{currentCurr?.symbol}</span>
              <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                Currency: {currentCurr?.code}
              </div>
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {currencies.map((curr) => (
              <DropdownMenuItem
                key={curr.code}
                onClick={() => handleCurrencyChange(curr.code)}
                className="flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <span className="font-semibold">{curr.symbol}</span>
                  <span>{curr.name}</span>
                </span>
                {currentCurrency === curr.code && <Check className="w-4 h-4 text-emerald-500" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Divider */}
      <div className="w-px h-8 bg-border/50" />

      {/* 8️⃣ Profile */}
      <DropdownMenu open={profileMenuOpen} onOpenChange={setProfileMenuOpen}>
        <DropdownMenuTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br cursor-pointer shadow-lg group relative",
              profileGradient
            )}
          >
            <User className="w-5 h-5 text-white" />
            <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              Profile
            </div>
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => handleProfileAction('profile')}>
            <User className="w-4 h-4 mr-2" />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleProfileAction('password')}>
            <Key className="w-4 h-4 mr-2" />
            Change Password
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleProfileAction('2fa')}>
            <Lock className="w-4 h-4 mr-2" />
            Two-Factor Auth
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleProfileAction('settings')}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => handleProfileAction('logout')}
            className="text-red-500 focus:text-red-500"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default GlobalHeaderActions;
