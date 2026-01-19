/**
 * DEVELOPER FULL HEADER
 * Fixed top header with all required elements
 * LOCK: No modifications without approval
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Globe,
  Bell,
  ShieldAlert,
  HeadphonesIcon,
  MessageSquare,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const DevFullHeader: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertCount] = useState(3);
  const [promiseStatus] = useState<'active' | 'breached'>('active');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <header className="h-14 bg-slate-950 border-b border-cyan-500/20 flex items-center justify-between px-4 shrink-0">
      {/* Left Section - Time & Date */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-white">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-sm">{formatTime(currentTime)}</span>
          <span className="text-slate-500">|</span>
          <span className="text-sm text-slate-400">{formatDate(currentTime)}</span>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-3">
        {/* Language Switch */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 transition-colors">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-white">EN</span>
        </button>

        {/* Alert Bell */}
        <button className="relative p-2 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 transition-colors">
          <Bell className="w-4 h-4 text-white" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full">
              {alertCount}
            </span>
          )}
        </button>

        {/* Promise Status */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
          promiseStatus === 'active'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {promiseStatus === 'active' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          <span className="text-xs font-medium">
            {promiseStatus === 'active' ? 'SLA Active' : 'SLA Breached'}
          </span>
        </div>

        {/* Assist Button */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-400 hover:bg-violet-500/20 transition-colors">
          <HeadphonesIcon className="w-4 h-4" />
          <span className="text-xs font-medium">Assist</span>
        </button>

        {/* Internal Chat */}
        <button className="relative p-2 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 transition-colors">
          <MessageSquare className="w-4 h-4 text-white" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-white">Developer</p>
            <p className="text-[10px] text-slate-400">Level 3 • Active</p>
          </div>
        </div>
      </div>
    </header>
  );
};
