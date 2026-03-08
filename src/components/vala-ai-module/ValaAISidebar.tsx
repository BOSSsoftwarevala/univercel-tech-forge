/**
 * VALA AI SIDEBAR
 * Single Workspace - AI Command Center
 * RENAMED FROM: Development Manager
 * SINGLE SIDEBAR ENFORCEMENT: Uses sidebar store
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Terminal, 
  FolderOpen, 
  History, 
  FileText as LogsIcon, 
  Bug, 
  RotateCcw, 
  Lock, 
  Cpu, 
  Wallet,
  Infinity as InfinityIcon,
  Settings as SettingsIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebarStore';
import softwareValaLogo from '@/assets/software-vala-logo-transparent.png';

export type ValaAISection = 
  | 'command-center'
  | 'continuous-creation'
  | 'active-project'
  | 'prompt-history'
  | 'execution-logs'
  | 'error-detection'
  | 'rollback'
  | 'lock-status'
  | 'models'
  | 'credits'
  | 'settings';

interface ValaAISidebarProps {
  activeSection: ValaAISection;
  onSectionChange: (section: ValaAISection) => void;
  onBack?: () => void;
}

const sidebarItems: { id: ValaAISection; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'command-center', label: 'Command Center', icon: Terminal, badge: 'CORE' },
  { id: 'continuous-creation', label: 'Auto Builder', icon: InfinityIcon, badge: 'AUTO' },
  { id: 'active-project', label: 'Active Project', icon: FolderOpen },
  { id: 'prompt-history', label: 'Prompt History', icon: History, badge: 'Read-Only' },
  { id: 'execution-logs', label: 'Execution Logs', icon: LogsIcon },
  { id: 'error-detection', label: 'Error Detection', icon: Bug },
  { id: 'rollback', label: 'Rollback Trigger', icon: RotateCcw },
  { id: 'lock-status', label: 'Lock Status', icon: Lock },
  { id: 'models', label: 'AI Models', icon: Cpu },
  { id: 'credits', label: 'Credits', icon: Wallet },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, badge: 'Limited' },
];

export const ValaAISidebar: React.FC<ValaAISidebarProps> = ({
  activeSection,
  onSectionChange,
  onBack,
}) => {
  // SINGLE SIDEBAR ENFORCEMENT: Use store for navigation
  const { exitToGlobal, enterCategory } = useSidebarStore();
  
  // ALWAYS VISIBLE: When this component mounts, enter this category context
  React.useEffect(() => {
    enterCategory('vala-ai');
    return () => {
      // Cleanup handled by exitToGlobal on back button
    };
  }, [enterCategory]);
  
  // Handle back navigation - updates store AND calls prop callback
  const handleBack = () => {
    exitToGlobal();
    onBack?.();
  };
  
  // ===== LOCKED COLORS: Dark Navy Blue Sidebar (matches Control Panel) =====
  const SIDEBAR_COLORS = {
    bg: '#0a1628',
    bgGradient: 'linear-gradient(180deg, #0a1628 0%, #0d1b2a 100%)',
    border: '#1e3a5f',
    activeHighlight: '#2563eb',
    hoverBg: 'rgba(37, 99, 235, 0.15)',
    text: '#ffffff',
    textMuted: 'rgba(255, 255, 255, 0.7)',
    iconColor: '#60a5fa',
  };
  
  return (
    <div 
      className="w-56 h-full flex flex-col"
      style={{ 
        background: SIDEBAR_COLORS.bgGradient, 
        borderRight: `1px solid ${SIDEBAR_COLORS.border}` 
      }}
    >
      {/* Back Button */}
      <div className="p-2" style={{ borderBottom: `1px solid ${SIDEBAR_COLORS.border}` }}>
        <motion.button
          onClick={handleBack}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
          style={{ color: SIDEBAR_COLORS.textMuted }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Panel</span>
        </motion.button>
      </div>
      
      <div className="p-4 flex justify-center" style={{ borderBottom: `1px solid ${SIDEBAR_COLORS.border}` }}>
        <img 
          src={softwareValaLogo} 
          alt="Software Vala Logo" 
          className="w-14 h-14 rounded-full object-contain border-2 border-cyan-500/30"
        />
      </div>
      
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isItemActive = activeSection === item.id;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all"
              style={{
                background: isItemActive ? SIDEBAR_COLORS.activeHighlight : 'transparent',
                color: isItemActive ? SIDEBAR_COLORS.text : SIDEBAR_COLORS.textMuted,
              }}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" style={{ color: isItemActive ? SIDEBAR_COLORS.text : SIDEBAR_COLORS.iconColor }} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span 
                  className="text-[10px] px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(37, 99, 235, 0.3)', color: SIDEBAR_COLORS.textMuted }}
                >
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};
