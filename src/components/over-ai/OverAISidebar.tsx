/**
 * OVER AI - Sidebar Navigation
 * LOCKED - DO NOT MODIFY THEME/COLORS/SPACING
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Zap,
  Server,
  HeartPulse,
  Brain,
  HeadphonesIcon,
  Shield,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { OverAISection } from './types';
import softwareValaLogo from '@/assets/software-vala-logo-transparent.png';

interface OverAISidebarProps {
  activeSection: OverAISection;
  onSectionChange: (section: OverAISection) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onBack: () => void;
}

const MENU_ITEMS: { id: OverAISection; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'AI Dashboard', icon: LayoutDashboard },
  { id: 'speed-engine', label: 'Speed Engine', icon: Zap },
  { id: 'server-orchestration', label: 'Server Orchestration', icon: Server },
  { id: 'self-healing', label: 'Self-Healing System', icon: HeartPulse },
  { id: 'decision-logic', label: 'Decision Logic', icon: Brain },
  { id: 'support-integration', label: 'Support Integration', icon: HeadphonesIcon },
  { id: 'security-control', label: 'Security & Control', icon: Shield },
  { id: 'fail-safe', label: 'Fail-Safe Mode', icon: AlertTriangle },
];

export function OverAISidebar({
  activeSection,
  onSectionChange,
  collapsed,
  onCollapsedChange,
  onBack,
}: OverAISidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-to-b from-[#0a0a10] via-[#0d0d14] to-[#0a0a10] backdrop-blur-xl border-r border-cyan-500/20 z-50 flex flex-col"
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => onCollapsedChange(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-cyan-500/20 border border-cyan-500/40 rounded-full flex items-center justify-center text-cyan-400 hover:bg-cyan-500/30 transition-colors z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Logo & Header */}
      <div className="p-4 border-b border-cyan-500/10">
        <div className="flex items-center justify-center mb-3">
          <img
            src={softwareValaLogo}
            alt="Software Vala"
            className="w-12 h-12 rounded-full object-contain border-2 border-cyan-500/30"
          />
        </div>
        {!collapsed && (
          <div className="text-center">
            <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              OVER AI
            </h2>
            <p className="text-[10px] text-cyan-500/60 uppercase tracking-wider">
              Core Intelligence Engine
            </p>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="p-2 border-b border-cyan-500/10">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onBack}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">Back</span>}
            </button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" className="bg-slate-900 border-cyan-500/30 text-white">
              Back
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <div className="space-y-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            const button = (
              <motion.button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-left',
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,255,255,0.15)]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-cyan-400' : 'text-cyan-500/50')} />
                {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
              </motion.button>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right" className="bg-slate-900 border-cyan-500/30 text-white">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return button;
          })}
        </div>
      </nav>

      {/* Status Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-cyan-500/10">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
            <Brain className="w-8 h-8 text-cyan-400" />
            <div>
              <p className="text-xs text-cyan-400 font-medium">OVER AI ACTIVE</p>
              <p className="text-[10px] text-cyan-500/60">Response: &lt;100ms</p>
            </div>
          </div>
        </div>
      )}
    </motion.aside>
  );
}

export default OverAISidebar;
