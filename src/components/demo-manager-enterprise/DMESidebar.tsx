/**
 * DEMO MANAGER ENTERPRISE - SIDEBAR
 * Single sidebar with 10 sections
 * Back button → Control Panel
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Library,
  FolderTree,
  HeartPulse,
  CheckCircle2,
  Bot,
  Link,
  ShieldCheck,
  FileText,
  Settings,
  ArrowLeft,
  Monitor,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export type DMESection =
  | 'overview'
  | 'add-demo'
  | 'demo-list'
  | 'demo-access'
  | 'demo-content'
  | 'demo-upgrade'
  | 'demo-issues'
  | 'marketplace-sync'
  | 'library'
  | 'health'
  | 'security'
  | 'settings';

const menuItems: { id: DMESection; label: string; icon: any; badge?: string }[] = [
  { id: 'overview', label: 'Demo Dashboard', icon: LayoutDashboard, badge: 'LIVE' },
  { id: 'add-demo', label: 'Add New Demo', icon: Monitor },
  { id: 'demo-list', label: 'Demo List', icon: Library },
  { id: 'demo-access', label: 'Demo Access', icon: ShieldCheck },
  { id: 'demo-content', label: 'Demo Content', icon: FileText },
  { id: 'demo-upgrade', label: 'Demo Upgrade (Vala AI)', icon: Bot, badge: 'AI' },
  { id: 'demo-issues', label: 'Demo Issues', icon: HeartPulse },
  { id: 'marketplace-sync', label: 'Marketplace Sync', icon: Link },
  { id: 'library', label: 'Demo Library', icon: FolderTree, badge: '5K+' },
  { id: 'health', label: 'Demo Health', icon: CheckCircle2, badge: '99.9%' },
  { id: 'security', label: 'Demo Security', icon: ShieldCheck },
  { id: 'settings', label: 'Demo Settings', icon: Settings },
];

interface DMESidebarProps {
  activeSection: DMESection;
  onSectionChange: (section: DMESection) => void;
  onBack?: () => void;
}

export const DMESidebar: React.FC<DMESidebarProps> = ({
  activeSection,
  onSectionChange,
  onBack
}) => {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 h-full bg-card border-r border-border flex flex-col shrink-0"
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-teal via-primary to-neon-green flex items-center justify-center relative">
            <Monitor className="w-6 h-6 text-primary-foreground" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-teal/50 to-transparent animate-pulse" />
          </div>
          <div>
            <div className="font-mono font-bold text-sm text-foreground">SOFTWARE VALA</div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-[10px] text-neon-green uppercase tracking-widest font-mono">Demo Manager</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="p-3 border-b border-border/30">
        <div className="glass-panel-glow p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-neon-teal" />
            <span className="text-xs font-mono text-neon-teal">SYSTEM STATUS</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-sm font-mono font-bold text-neon-green">247</div>
              <div className="text-[8px] text-muted-foreground">LIVE</div>
            </div>
            <div>
              <div className="text-sm font-mono font-bold text-neon-orange">12</div>
              <div className="text-[8px] text-muted-foreground">BROKEN</div>
            </div>
            <div>
              <div className="text-sm font-mono font-bold text-primary">99.9%</div>
              <div className="text-[8px] text-muted-foreground">AI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-neon-teal/10 text-neon-teal border-l-2 border-neon-teal'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
              style={isActive ? { boxShadow: 'inset 0 0 20px hsl(174 100% 45% / 0.1)' } : {}}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium truncate">{item.label}</span>
              {item.badge && (
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  item.badge === 'LIVE' || item.badge === 'AI'
                    ? 'bg-neon-green/20 text-neon-green animate-pulse'
                    : 'bg-neon-teal/20 text-neon-teal'
                }`}>
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Back Button */}
      <div className="p-3 border-t border-border/30">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="w-full text-xs gap-2 h-9 border-border/50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Control Panel
        </Button>
      </div>
    </motion.aside>
  );
};
