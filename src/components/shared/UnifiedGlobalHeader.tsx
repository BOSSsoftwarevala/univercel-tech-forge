/**
 * UNIFIED GLOBAL HEADER
 * Icon-only header across ALL dashboards
 * Order: Logo → AI/API → Promise → Assist → Chat → Notification
 * LOCK: No modifications without approval
 */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Zap,
  Timer,
  Headphones,
  MessageSquare,
  Bell,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";

// Status types
type ApiStatus = 'healthy' | 'warning' | 'stopped';
type PromiseStatus = 'normal' | 'breached';

interface UnifiedGlobalHeaderProps {
  className?: string;
}

export const UnifiedGlobalHeader = ({ className }: UnifiedGlobalHeaderProps) => {
  const navigate = useNavigate();

  // States for each module
  const [apiStatus, setApiStatus] = useState<ApiStatus>('healthy');
  const [promiseCount, setPromiseCount] = useState(3);
  const [promiseBreached, setPromiseBreached] = useState(false);
  const [assistSessions, setAssistSessions] = useState(1);
  const [assistLive, setAssistLive] = useState(true);
  const [chatUnread, setChatUnread] = useState(5);
  const [alertCount, setAlertCount] = useState(2);
  const [alertCritical, setAlertCritical] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Drawer states
  const [apiDrawerOpen, setApiDrawerOpen] = useState(false);
  const [promiseDrawerOpen, setPromiseDrawerOpen] = useState(false);
  const [assistDrawerOpen, setAssistDrawerOpen] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [alertDrawerOpen, setAlertDrawerOpen] = useState(false);

  // Handlers
  const handleLogoClick = useCallback(() => {
    navigate('/super-admin-system/role-switch');
  }, [navigate]);

  const handleApiClick = useCallback(() => {
    navigate('/super-admin-system/role-switch?role=api_ai_manager');
  }, [navigate]);

  const handlePromiseClick = useCallback(() => {
    navigate('/super-admin-system/role-switch?role=promise_tracker_manager');
  }, [navigate]);

  const handleAssistClick = useCallback(() => {
    navigate('/super-admin-system/role-switch?role=assist_manager');
  }, [navigate]);

  const handleChatClick = useCallback(() => {
    navigate('/super-admin-system/role-switch?role=internal_chatbot');
  }, [navigate]);

  const handleAlertClick = useCallback(() => {
    setAlertDrawerOpen(!alertDrawerOpen);
  }, [alertDrawerOpen]);

  const handleSoundToggle = useCallback(() => {
    setSoundEnabled(prev => !prev);
    toast.success(soundEnabled ? 'Alert sounds disabled' : 'Alert sounds enabled');
  }, [soundEnabled]);

  // Status dot color helper
  const getApiStatusColor = () => {
    switch (apiStatus) {
      case 'healthy': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'stopped': return 'bg-red-500';
    }
  };

  return (
    <header className={cn(
      "h-14 bg-slate-950 border-b border-slate-800/50 flex items-center justify-between px-4 shrink-0 sticky top-0 z-50",
      className
    )}>
      {/* Left Section - Logo */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogoClick}
        className="flex items-center gap-2 group"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
          <span className="text-white font-bold text-sm">SV</span>
        </div>
      </motion.button>

      {/* Right Section - Icon Actions */}
      <div className="flex items-center gap-3">
        {/* 1️⃣ AI API Manager */}
        <HeaderIcon
          icon={Zap}
          tooltip="AI / API Manager"
          onClick={handleApiClick}
          statusDot={getApiStatusColor()}
        />

        {/* 2️⃣ Promise Tracker */}
        <HeaderIcon
          icon={Timer}
          tooltip="Promise Tracker"
          onClick={handlePromiseClick}
          badge={promiseCount > 0 ? promiseCount : undefined}
          badgeColor={promiseBreached ? 'bg-red-500' : 'bg-amber-500'}
          glowRed={promiseBreached}
        />

        {/* 3️⃣ Assist Manager (UltraViewer-style) */}
        <HeaderIcon
          icon={Headphones}
          tooltip="Assist Manager"
          onClick={handleAssistClick}
          badge={assistSessions > 0 ? assistSessions : undefined}
          pulseRing={assistLive}
          variant="assist"
        />

        {/* 4️⃣ Internal Chat Bot */}
        <HeaderIcon
          icon={MessageSquare}
          tooltip="Internal Chat"
          onClick={handleChatClick}
          badge={chatUnread > 0 ? chatUnread : undefined}
          badgeColor="bg-emerald-500"
        />

        {/* 5️⃣ Notification / Alert Bell */}
        <div className="relative">
          <HeaderIcon
            icon={Bell}
            tooltip="Notifications"
            onClick={handleAlertClick}
            badge={alertCount > 0 ? alertCount : undefined}
            badgeColor={alertCritical ? 'bg-red-500' : 'bg-orange-500'}
            ringColor={alertCritical ? 'ring-red-500/50' : alertCount > 0 ? 'ring-orange-500/50' : undefined}
          />
          {/* Sound Toggle Mini Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSoundToggle}
            className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center"
            title={soundEnabled ? 'Sound ON' : 'Sound OFF'}
          >
            {soundEnabled ? (
              <Volume2 className="w-2.5 h-2.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-2.5 h-2.5 text-red-400" />
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};

// ==============================================
// HEADER ICON COMPONENT (3D Premium Style)
// ==============================================

interface HeaderIconProps {
  icon: React.FC<{ className?: string }>;
  tooltip: string;
  onClick: () => void;
  badge?: number;
  badgeColor?: string;
  statusDot?: string;
  glowRed?: boolean;
  pulseRing?: boolean;
  ringColor?: string;
  variant?: 'default' | 'assist';
}

const HeaderIcon = ({
  icon: Icon,
  tooltip,
  onClick,
  badge,
  badgeColor = 'bg-primary',
  statusDot,
  glowRed = false,
  pulseRing = false,
  ringColor,
  variant = 'default',
}: HeaderIconProps) => {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "relative w-10 h-10 rounded-xl flex items-center justify-center transition-all group",
        // 3D premium depth
        "bg-gradient-to-b from-slate-800 to-slate-900",
        "border border-slate-700/50",
        "shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]",
        "hover:border-cyan-500/30 hover:shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]",
        // Variants
        variant === 'assist' && "bg-gradient-to-b from-violet-900/50 to-slate-900 border-violet-500/30",
        // Glow effects
        glowRed && "ring-2 ring-red-500/50 animate-pulse",
        ringColor && `ring-2 ${ringColor}`
      )}
      title={tooltip}
    >
      {/* Icon */}
      <Icon className={cn(
        "w-5 h-5 transition-colors",
        variant === 'assist' ? "text-violet-400" : "text-slate-400",
        "group-hover:text-cyan-400"
      )} />

      {/* Status Dot (for API status) */}
      {statusDot && (
        <span className={cn(
          "absolute top-1 right-1 w-2 h-2 rounded-full",
          statusDot
        )} />
      )}

      {/* Badge Count */}
      {badge !== undefined && (
        <span className={cn(
          "absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-white shadow-md",
          badgeColor
        )}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}

      {/* Pulse Ring (for live assist sessions) */}
      {pulseRing && (
        <motion.span
          className="absolute inset-0 rounded-xl border-2 border-violet-500/50"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Tooltip */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
        {tooltip}
      </div>
    </motion.button>
  );
};

export default UnifiedGlobalHeader;
