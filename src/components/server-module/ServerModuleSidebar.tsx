/**
 * SERVER MODULE SIDEBAR
 * Ultra-simple sidebar with exactly 9 items as specified
 * Includes Back to Boss button for navigation
 * 
 * SINGLE-CONTEXT ENFORCEMENT:
 * - Only renders when activeContext === 'module' AND category matches
 * - Back button triggers full context switch to Boss
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Plus, Server, Activity, Shield, 
  Database, FileText, Brain, Settings, ArrowLeft 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebarStore';

export type ServerModuleSection = 
  | 'overview'
  | 'add-server'
  | 'active-servers'
  | 'health-load'
  | 'security'
  | 'backups'
  | 'logs'
  | 'ai-actions'
  | 'settings';

interface ServerModuleSidebarProps {
  activeSection: ServerModuleSection;
  onSectionChange: (section: ServerModuleSection) => void;
  onBack?: () => void;
}

const sidebarItems: { id: ServerModuleSection; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'add-server', label: 'Add Server', icon: Plus },
  { id: 'active-servers', label: 'Active Servers', icon: Server },
  { id: 'health-load', label: 'Health & Load', icon: Activity },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'backups', label: 'Backups', icon: Database },
  { id: 'logs', label: 'Logs', icon: FileText },
  { id: 'ai-actions', label: 'AI Actions', icon: Brain },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const ServerModuleSidebar: React.FC<ServerModuleSidebarProps> = ({
  activeSection,
  onSectionChange,
  onBack,
}) => {
  // SINGLE-CONTEXT ENFORCEMENT: Use store for clean context transitions
  const { exitToGlobal, enterCategory } = useSidebarStore();
  
  // ALWAYS VISIBLE: When this component mounts, enter this category context
  React.useEffect(() => {
    enterCategory('server-manager');
    return () => {
      // Cleanup handled by exitToGlobal on back button
    };
  }, [enterCategory]);
  
  // Handle back navigation - triggers FULL context switch to Boss
  const handleBack = () => {
    // 1. Update store state (Boss context)
    exitToGlobal();
    // 2. Call parent callback to update navigation state
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
      className="w-56 flex flex-col shrink-0"
      style={{ 
        background: SIDEBAR_COLORS.bgGradient, 
        borderRight: `1px solid ${SIDEBAR_COLORS.border}` 
      }}
    >
      {/* Back Button - Triggers context switch */}
      <div className="p-2" style={{ borderBottom: `1px solid ${SIDEBAR_COLORS.border}` }}>
        <motion.button
          onClick={handleBack}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
          style={{ color: SIDEBAR_COLORS.textMuted }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Control Panel</span>
        </motion.button>
      </div>
      
      {/* Module Header */}
      <div className="p-4" style={{ borderBottom: `1px solid ${SIDEBAR_COLORS.border}` }}>
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: SIDEBAR_COLORS.activeHighlight }}
          >
            <Server className="w-4 h-4" style={{ color: SIDEBAR_COLORS.text }} />
          </div>
          <span className="font-semibold" style={{ color: SIDEBAR_COLORS.text }}>Servers</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-2 space-y-1 overflow-auto">
        {sidebarItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
              style={{
                background: isActive ? SIDEBAR_COLORS.activeHighlight : 'transparent',
                color: isActive ? SIDEBAR_COLORS.text : SIDEBAR_COLORS.textMuted,
              }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? SIDEBAR_COLORS.text : SIDEBAR_COLORS.iconColor }} />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Status Footer */}
      <div className="p-3" style={{ borderTop: `1px solid ${SIDEBAR_COLORS.border}` }}>
        <div 
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-400">AI Active</span>
        </div>
      </div>
    </div>
  );
};

export default ServerModuleSidebar;
