/**
 * DEVELOPER FULL SIDEBAR
 * 12-Section Enterprise Developer Dashboard
 * LOCK: No modifications without approval
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  FolderKanban,
  Rocket,
  CalendarClock,
  Bug,
  Sparkles,
  Activity,
  ShieldCheck,
  FileText,
  Wrench,
  MessageSquare,
  Settings,
  ChevronDown,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

export type DevSection =
  | 'home'
  | 'projects-active'
  | 'projects-waiting'
  | 'projects-hold'
  | 'projects-completed'
  | 'build-queue'
  | 'deploy-queue'
  | 'tasks-my'
  | 'tasks-team'
  | 'bugs-reported'
  | 'bugs-auto'
  | 'ai-suggestions'
  | 'ai-autofix'
  | 'ai-assist'
  | 'monitor-build'
  | 'monitor-server'
  | 'promises-my'
  | 'promises-team'
  | 'logs-activity'
  | 'logs-build'
  | 'tools-formatter'
  | 'tools-optimizer'
  | 'tools-validator'
  | 'comm-chat'
  | 'comm-issues'
  | 'settings';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  children?: { id: DevSection; label: string }[];
}

const sidebarItems: SidebarItem[] = [
  { id: 'home', label: 'Developer Home', icon: Home },
  {
    id: 'projects',
    label: 'Assigned Projects',
    icon: FolderKanban,
    children: [
      { id: 'projects-active', label: 'Active' },
      { id: 'projects-waiting', label: 'Waiting Approval' },
      { id: 'projects-hold', label: 'On Hold' },
      { id: 'projects-completed', label: 'Completed' }
    ]
  },
  {
    id: 'build',
    label: 'Build & Deploy',
    icon: Rocket,
    children: [
      { id: 'build-queue', label: 'Build Queue' },
      { id: 'deploy-queue', label: 'Deploy Queue' }
    ]
  },
  {
    id: 'tasks',
    label: 'Tasks & Timeline',
    icon: CalendarClock,
    children: [
      { id: 'tasks-my', label: 'My Tasks' },
      { id: 'tasks-team', label: 'Team Tasks' }
    ]
  },
  {
    id: 'bugs',
    label: 'Bug & Fix Center',
    icon: Bug,
    children: [
      { id: 'bugs-reported', label: 'Reported Bugs' },
      { id: 'bugs-auto', label: 'Auto Detected' }
    ]
  },
  {
    id: 'ai',
    label: 'AI Co-Pilot (Vala AI)',
    icon: Sparkles,
    children: [
      { id: 'ai-suggestions', label: 'Suggestions' },
      { id: 'ai-autofix', label: 'Auto Fix' },
      { id: 'ai-assist', label: 'Code Assist' }
    ]
  },
  {
    id: 'monitor',
    label: 'Live Monitoring',
    icon: Activity,
    children: [
      { id: 'monitor-build', label: 'Build Status' },
      { id: 'monitor-server', label: 'Server Status' }
    ]
  },
  {
    id: 'promises',
    label: 'Promises & SLA',
    icon: ShieldCheck,
    children: [
      { id: 'promises-my', label: 'My Promises' },
      { id: 'promises-team', label: 'Team Promises' }
    ]
  },
  {
    id: 'logs',
    label: 'Logs & Reports',
    icon: FileText,
    children: [
      { id: 'logs-activity', label: 'Activity Logs' },
      { id: 'logs-build', label: 'Build Logs' }
    ]
  },
  {
    id: 'tools',
    label: 'Tools & Utilities',
    icon: Wrench,
    children: [
      { id: 'tools-formatter', label: 'Formatter' },
      { id: 'tools-optimizer', label: 'Optimizer' },
      { id: 'tools-validator', label: 'Validator' }
    ]
  },
  {
    id: 'comm',
    label: 'Communication',
    icon: MessageSquare,
    children: [
      { id: 'comm-chat', label: 'Internal Chat' },
      { id: 'comm-issues', label: 'Issue Threads' }
    ]
  },
  { id: 'settings', label: 'Settings & Access', icon: Settings }
];

interface DevFullSidebarProps {
  activeSection: DevSection;
  onSectionChange: (section: DevSection) => void;
  onBack?: () => void;
}

export const DevFullSidebar: React.FC<DevFullSidebarProps> = ({
  activeSection,
  onSectionChange,
  onBack
}) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['projects', 'build', 'tasks']);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId) ? prev.filter(g => g !== groupId) : [...prev, groupId]
    );
  };

  const isActive = (id: string) => activeSection === id;
  const isGroupActive = (item: SidebarItem) =>
    item.children?.some(child => child.id === activeSection);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 h-full bg-slate-950 border-r border-cyan-500/20 flex flex-col shrink-0"
    >
      {/* Header */}
      <div className="p-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">Developer Panel</h2>
              <p className="text-xs text-slate-400">Execution Center</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {sidebarItems.map((item) => (
          <div key={item.id}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleGroup(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isGroupActive(item)
                      ? 'bg-cyan-500/10 text-cyan-400'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {expandedGroups.includes(item.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {expandedGroups.includes(item.id) && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-slate-700 pl-3">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => onSectionChange(child.id)}
                        className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive(child.id)
                            ? 'bg-cyan-500/20 text-cyan-400 font-medium'
                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => onSectionChange(item.id as DevSection)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive(item.id)
                    ? 'bg-cyan-500/20 text-cyan-400 font-medium'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            )}
          </div>
        ))}
      </nav>

      {/* Footer Stats */}
      <div className="p-4 border-t border-cyan-500/20">
        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400">Today's Progress</span>
            <span className="text-cyan-400 font-medium">68%</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-[68%] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
          </div>
        </div>
      </div>
    </motion.aside>
  );
};
