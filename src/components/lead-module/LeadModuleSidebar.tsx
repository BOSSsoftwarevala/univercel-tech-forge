/**
 * LEAD MODULE SIDEBAR
 * 9-item sidebar as per Step 6 spec
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, Radio, Target, GitBranch,
  Globe, PhoneCall, TrendingUp, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export type LeadSection = 
  | 'overview'
  | 'all-leads'
  | 'lead-sources'
  | 'lead-scoring'
  | 'lead-routing'
  | 'country-region'
  | 'follow-ups'
  | 'conversions'
  | 'settings';

interface LeadModuleSidebarProps {
  activeSection: LeadSection;
  onSectionChange: (section: LeadSection) => void;
}

const menuItems: { id: LeadSection; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'all-leads', label: 'All Leads', icon: Users },
  { id: 'lead-sources', label: 'Lead Sources', icon: Radio },
  { id: 'lead-scoring', label: 'Lead Scoring', icon: Target },
  { id: 'lead-routing', label: 'Lead Routing', icon: GitBranch },
  { id: 'country-region', label: 'Country / Region', icon: Globe },
  { id: 'follow-ups', label: 'Follow-ups', icon: PhoneCall },
  { id: 'conversions', label: 'Conversions', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const LeadModuleSidebar: React.FC<LeadModuleSidebarProps> = ({
  activeSection,
  onSectionChange,
}) => {
  return (
    <div className="w-56 bg-card/50 border-r border-border/50 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Lead Management</h2>
            <p className="text-[10px] text-muted-foreground">AI-Driven CRM</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
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
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all",
                  isActive 
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className={cn(
                  "w-4 h-4",
                  isActive ? "text-emerald-400" : "text-muted-foreground"
                )} />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer Status */}
      <div className="p-3 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Lead Pipeline Active</span>
        </div>
      </div>
    </div>
  );
};
