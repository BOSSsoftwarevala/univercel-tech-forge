/**
 * LEAD MODULE SIDEBAR (Step 9)
 * 10-item sidebar with Back to Boss button
 * 
 * SINGLE-CONTEXT ENFORCEMENT:
 * - Only renders when activeContext === 'module' AND category === 'lead-manager'
 * - Back button triggers full context switch to Boss
 */
import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, Radio, Globe, Target,
  UserCheck, PhoneCall, TrendingUp, BarChart3, Settings, ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSidebarStore } from '@/stores/sidebarStore';

export type LeadSection = 
  | 'dashboard'
  | 'all-leads'
  | 'lead-sources'
  | 'country-view'
  | 'lead-scoring'
  | 'assignments'
  | 'follow-ups'
  | 'conversions'
  | 'reports'
  | 'settings';

interface LeadModuleSidebarProps {
  activeSection: LeadSection;
  onSectionChange: (section: LeadSection) => void;
  onBack?: () => void;
}

const menuItems: { id: LeadSection; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'all-leads', label: 'All Leads', icon: Users },
  { id: 'lead-sources', label: 'Lead Sources', icon: Radio },
  { id: 'country-view', label: 'Country View', icon: Globe },
  { id: 'lead-scoring', label: 'Lead Scoring', icon: Target },
  { id: 'assignments', label: 'Assignments', icon: UserCheck },
  { id: 'follow-ups', label: 'Follow-ups', icon: PhoneCall },
  { id: 'conversions', label: 'Conversions', icon: TrendingUp },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const LeadModuleSidebar: React.FC<LeadModuleSidebarProps> = ({
  activeSection,
  onSectionChange,
  onBack,
}) => {
  // SINGLE-CONTEXT ENFORCEMENT: Use store for clean context transitions
  const { exitToGlobal, enterCategory } = useSidebarStore();
  
  // ALWAYS VISIBLE: When this component mounts, enter this category context
  React.useEffect(() => {
    enterCategory('lead-manager');
    return () => {
      // Cleanup handled by exitToGlobal on back button
    };
  }, [enterCategory]);
  
  // Handle back navigation - triggers FULL context switch to Boss
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
      className="w-56 flex flex-col h-full shrink-0"
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
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: SIDEBAR_COLORS.activeHighlight }}
          >
            <Users className="w-4 h-4" style={{ color: SIDEBAR_COLORS.text }} />
          </div>
          <div>
            <h2 className="text-sm font-bold" style={{ color: SIDEBAR_COLORS.text }}>Lead Manager</h2>
            <p className="text-[10px]" style={{ color: SIDEBAR_COLORS.textMuted }}>AI-Powered CRM</p>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 py-2">
        <div className="px-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all"
                style={{
                  background: isActive ? SIDEBAR_COLORS.activeHighlight : 'transparent',
                  color: isActive ? SIDEBAR_COLORS.text : SIDEBAR_COLORS.textMuted,
                }}
              >
                <Icon className="w-4 h-4" style={{ color: isActive ? SIDEBAR_COLORS.text : SIDEBAR_COLORS.iconColor }} />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>
      <div className="p-3" style={{ borderTop: `1px solid ${SIDEBAR_COLORS.border}` }}>
        <div className="flex items-center gap-2 text-xs" style={{ color: SIDEBAR_COLORS.textMuted }}>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Pipeline Active</span>
        </div>
      </div>
    </div>
  );
};