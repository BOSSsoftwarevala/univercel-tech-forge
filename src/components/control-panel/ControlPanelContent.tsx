/**
 * CONTROL PANEL CONTENT
 * Main content component for the black sidebar Control Panel
 * Contains all live operational sections
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, MessageCircle, ListTodo, Clock, Zap, Bell } from 'lucide-react';
import { LiveStatusIndicators } from './LiveStatusIndicators';
import { LiveChatBlock } from './LiveChatBlock';
import { LiveRunningTasks } from './LiveRunningTasks';
import { LiveCommitments } from './LiveCommitments';
import { QuickActions } from './QuickActions';
import { AlertsPreview } from './AlertsPreview';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ControlPanelContentProps {
  collapsed?: boolean;
}

interface SectionProps {
  icon: React.ElementType;
  title: string;
  collapsed?: boolean;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ icon: Icon, title, collapsed, children }) => {
  if (collapsed) return null;
  
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 px-1">
        <Icon className="w-3 h-3 text-white/50" />
        <span className="text-[9px] font-medium uppercase tracking-wider text-white/50">{title}</span>
      </div>
      {children}
    </div>
  );
};

export const ControlPanelContent: React.FC<ControlPanelContentProps> = ({ collapsed = false }) => {
  if (collapsed) {
    // Collapsed view - show only icons
    return (
      <div className="flex flex-col items-center gap-3 py-3">
        <motion.div 
          className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.1 }}
          title="System Online"
        >
          <Activity className="w-4 h-4 text-emerald-400" />
        </motion.div>
        <motion.div 
          className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.1 }}
          title="Live Chat"
        >
          <MessageCircle className="w-4 h-4 text-blue-400" />
        </motion.div>
        <motion.div 
          className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.1 }}
          title="Tasks"
        >
          <ListTodo className="w-4 h-4 text-amber-400" />
        </motion.div>
        <motion.div 
          className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center cursor-pointer relative"
          whileHover={{ scale: 1.1 }}
          title="Alerts"
        >
          <Bell className="w-4 h-4 text-red-400" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 text-[8px] text-white flex items-center justify-center">3</span>
        </motion.div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-2 space-y-4">
        {/* Section 1: Live Status */}
        <Section icon={Activity} title="Live Status" collapsed={collapsed}>
          <LiveStatusIndicators />
        </Section>

        {/* Section 2: Live Chat */}
        <Section icon={MessageCircle} title="Support" collapsed={collapsed}>
          <LiveChatBlock />
        </Section>

        {/* Section 3: Running Tasks */}
        <Section icon={ListTodo} title="Running Tasks" collapsed={collapsed}>
          <LiveRunningTasks />
        </Section>

        {/* Section 4: Commitments */}
        <Section icon={Clock} title="Commitments" collapsed={collapsed}>
          <LiveCommitments />
        </Section>

        {/* Section 5: Quick Actions */}
        <Section icon={Zap} title="Quick Actions" collapsed={collapsed}>
          <QuickActions />
        </Section>

        {/* Section 6: Alerts Preview */}
        <Section icon={Bell} title="Alerts" collapsed={collapsed}>
          <AlertsPreview />
        </Section>
      </div>
    </ScrollArea>
  );
};
