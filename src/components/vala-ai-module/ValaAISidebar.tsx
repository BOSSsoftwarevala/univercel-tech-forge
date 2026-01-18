/**
 * VALA AI SIDEBAR
 * Single Workspace - AI Command Center
 * RENAMED FROM: Development Manager
 * SINGLE SIDEBAR ENFORCEMENT: Uses sidebar store
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home,
  Plus,
  PlayCircle,
  Monitor,
  Inbox,
  Wrench,
  Rocket,
  GitBranch,
  FileText,
  Settings,
  ArrowLeft,
  Brain,
  Cpu,
  ListTodo,
  Webhook,
  Cog,
  Wallet,
  AlertTriangle,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebarStore';

export type ValaAISection = 
  | 'home' 
  | 'dashboard'
  | 'new-project' 
  | 'live-builds' 
  | 'active-demos' 
  | 'issue-inbox' 
  | 'auto-fix-queue' 
  | 'deployment' 
  | 'models'
  | 'tasks'
  | 'api'
  | 'automation'
  | 'credits'
  | 'alerts'
  | 'versions'
  | 'logs'
  | 'settings';

interface ValaAISidebarProps {
  activeSection: ValaAISection;
  onSectionChange: (section: ValaAISection) => void;
  onBack?: () => void;
}

const sidebarItems: { id: ValaAISection; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'dashboard', label: 'AI Dashboard', icon: LayoutDashboard, badge: 'Full' },
  { id: 'new-project', label: 'New Project', icon: Plus },
  { id: 'live-builds', label: 'Live Builds', icon: PlayCircle },
  { id: 'active-demos', label: 'Active Demos', icon: Monitor },
  { id: 'issue-inbox', label: 'Issue Inbox', icon: Inbox },
  { id: 'auto-fix-queue', label: 'Auto Fix Queue', icon: Wrench },
  { id: 'deployment', label: 'Deployment', icon: Rocket },
  { id: 'models', label: 'AI Models', icon: Cpu },
  { id: 'tasks', label: 'AI Tasks', icon: ListTodo },
  { id: 'api', label: 'API Calls', icon: Webhook },
  { id: 'automation', label: 'Automation', icon: Cog },
  { id: 'credits', label: 'Credits', icon: Wallet },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'versions', label: 'Versions', icon: GitBranch },
  { id: 'logs', label: 'Logs', icon: FileText, badge: 'Read-only' },
  { id: 'settings', label: 'Settings', icon: Settings, badge: 'Limited' },
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
          <span>← Back to Control Panel</span>
        </motion.button>
      </div>
      
      <div className="p-4" style={{ borderBottom: `1px solid ${SIDEBAR_COLORS.border}` }}>
        <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: SIDEBAR_COLORS.text }}>
          <Brain className="w-4 h-4" style={{ color: SIDEBAR_COLORS.iconColor }} />
          VALA AI
        </h2>
        <p className="text-xs mt-1" style={{ color: SIDEBAR_COLORS.textMuted }}>AI Command Center</p>
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
