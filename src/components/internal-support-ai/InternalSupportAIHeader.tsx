/**
 * Internal Support AI Manager - Global Header
 * Fixed header with system status, SLA timer, and security indicators
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Heart,
  Shield,
  Lock,
  Globe,
  Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SystemStatus } from './types';

interface InternalSupportAIHeaderProps {
  systemStatus: SystemStatus;
  pendingIssues: number;
  autoFixSuccessRate: number;
  escalationQueue: number;
  userRole: string;
}

export const InternalSupportAIHeader: React.FC<InternalSupportAIHeaderProps> = ({
  systemStatus,
  pendingIssues,
  autoFixSuccessRate,
  escalationQueue,
  userRole
}) => {
  const [slaTimer, setSlaTimer] = useState('00:45:32');
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate SLA timer countdown
      const parts = slaTimer.split(':');
      let hours = parseInt(parts[0]);
      let minutes = parseInt(parts[1]);
      let seconds = parseInt(parts[2]);

      if (seconds > 0) seconds--;
      else if (minutes > 0) { minutes--; seconds = 59; }
      else if (hours > 0) { hours--; minutes = 59; seconds = 59; }

      setSlaTimer(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [slaTimer]);

  const getStatusColor = (status: SystemStatus) => {
    switch (status) {
      case 'LIVE': return 'bg-emerald-500';
      case 'DEGRADED': return 'bg-amber-500';
      case 'OFFLINE': return 'bg-red-500';
    }
  };

  const getStatusBadge = (status: SystemStatus) => {
    switch (status) {
      case 'LIVE': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'DEGRADED': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'OFFLINE': return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-14 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-cyan-900/20 backdrop-blur-xl border-b border-cyan-500/20 flex items-center justify-between px-4 fixed top-0 left-64 right-0 z-40"
    >
      {/* Left Section - System Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus)} animate-pulse`} />
          <Badge className={`${getStatusBadge(systemStatus)} border text-[10px] px-2 py-0.5`}>
            {systemStatus}
          </Badge>
          <span className="text-[10px] text-slate-400">Internal Support AI</span>
        </div>

        <div className="h-4 w-px bg-slate-700" />

        {/* Active SLA Timer */}
        <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-1.5 border border-slate-700/50">
          <Clock className="w-3 h-3 text-cyan-400" />
          <span className="text-[10px] text-slate-300">SLA Timer:</span>
          <span className={`text-xs font-mono font-bold ${
            slaTimer.startsWith('00:0') ? 'text-red-400' : 'text-cyan-400'
          }`}>
            {slaTimer}
          </span>
        </div>

        {/* Pending Issues */}
        <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-1.5 border border-slate-700/50">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span className="text-[10px] text-slate-300">Pending:</span>
          <span className="text-xs font-bold text-amber-400">{pendingIssues}</span>
        </div>
      </div>

      {/* Center Section - Key Metrics */}
      <div className="flex items-center gap-4">
        {/* Auto-Fix Success Rate */}
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] text-slate-300">Auto-Fix:</span>
          <span className="text-xs font-bold text-emerald-400">{autoFixSuccessRate}%</span>
        </div>

        <div className="h-4 w-px bg-slate-700" />

        {/* Escalation Queue */}
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-purple-400" />
          <span className="text-[10px] text-slate-300">Escalation Queue:</span>
          <span className="text-xs font-bold text-purple-400">{escalationQueue}</span>
        </div>

        <div className="h-4 w-px bg-slate-700" />

        {/* AI Health */}
        <div className="flex items-center gap-2">
          <Heart className="w-3 h-3 text-rose-400" />
          <span className="text-[10px] text-slate-300">AI Health:</span>
          <span className="text-xs font-bold text-emerald-400">98.5%</span>
        </div>
      </div>

      {/* Right Section - User & Security */}
      <div className="flex items-center gap-3">
        {/* Language Auto-Detect */}
        <div className="flex items-center gap-1 text-[10px] text-slate-400">
          <Globe className="w-3 h-3" />
          <span>EN</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors border border-slate-700/50">
          <Bell className="w-4 h-4 text-slate-300" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
              {notifications}
            </span>
          )}
        </button>

        {/* Role Badge */}
        <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] px-2 py-0.5">
          {userRole}
        </Badge>

        {/* Secure Session Lock */}
        <div className="flex items-center gap-1 bg-emerald-500/10 rounded-lg px-2 py-1 border border-emerald-500/20">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] text-emerald-400">Secure</span>
        </div>
      </div>
    </motion.header>
  );
};
