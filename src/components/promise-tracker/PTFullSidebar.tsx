import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  LayoutDashboard, 
  List, 
  Plus, 
  FolderTree, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  CheckCircle, 
  TrendingUp, 
  DollarSign, 
  Brain, 
  FileText, 
  Settings,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Layers
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarSection {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  badgeColor?: string;
  children?: { id: string; label: string; badge?: number }[];
}

const sidebarSections: SidebarSection[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'all-promises', label: 'All Promises', icon: List, badge: 156 },
  { id: 'create-promise', label: 'Create Promise', icon: Plus },
  { 
    id: 'promise-categories', 
    label: 'Promise Categories', 
    icon: FolderTree,
    children: [
      { id: 'cat-sales', label: 'Sales' },
      { id: 'cat-support', label: 'Support' },
      { id: 'cat-delivery', label: 'Delivery' },
      { id: 'cat-payment', label: 'Payment' },
      { id: 'cat-legal', label: 'Legal' },
      { id: 'cat-partnership', label: 'Partnership' },
      { id: 'cat-sla', label: 'SLA' },
    ]
  },
  { id: 'active-promises', label: 'Active Promises', icon: Clock, badge: 42, badgeColor: 'bg-blue-500/20 text-blue-400' },
  { id: 'delayed-promises', label: 'Delayed Promises', icon: AlertTriangle, badge: 8, badgeColor: 'bg-yellow-500/20 text-yellow-400' },
  { id: 'broken-promises', label: 'Broken Promises', icon: XCircle, badge: 3, badgeColor: 'bg-red-500/20 text-red-400' },
  { id: 'fulfilled-promises', label: 'Fulfilled Promises', icon: CheckCircle, badge: 89, badgeColor: 'bg-green-500/20 text-green-400' },
  { id: 'escalations', label: 'Escalations', icon: TrendingUp, badge: 5, badgeColor: 'bg-orange-500/20 text-orange-400' },
  { id: 'fine-tip-rules', label: 'Fine & Tip Rules', icon: DollarSign },
  { id: 'ai-insights', label: 'AI Insights', icon: Brain, badgeColor: 'bg-purple-500/20 text-purple-400' },
  { id: 'audit-logs', label: 'Audit Logs', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface PTFullSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onBack?: () => void;
}

export default function PTFullSidebar({
  activeSection,
  onSectionChange,
  collapsed,
  onToggleCollapse,
  onBack,
}: PTFullSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['promise-categories']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const renderSidebarItem = (section: SidebarSection) => {
    const Icon = section.icon;
    const isActive = activeSection === section.id || 
                     section.children?.some(child => child.id === activeSection);
    const isExpanded = expandedSections.includes(section.id);
    const hasChildren = section.children && section.children.length > 0;

    const itemContent = (
      <motion.div
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          if (hasChildren) {
            toggleSection(section.id);
          } else {
            onSectionChange(section.id);
          }
        }}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
          isActive
            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
        )}
      >
        <Icon className="w-4 h-4 shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-sm font-medium truncate">{section.label}</span>
            {section.badge !== undefined && (
              <Badge className={cn("text-xs px-1.5 py-0", section.badgeColor || "bg-slate-700 text-slate-300")}>
                {section.badge}
              </Badge>
            )}
            {hasChildren && (
              <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    );

    if (collapsed) {
      return (
        <Tooltip key={section.id}>
          <TooltipTrigger asChild>{itemContent}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {section.label}
            {section.badge !== undefined && (
              <Badge className={cn("text-xs", section.badgeColor)}>{section.badge}</Badge>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <div key={section.id}>
        {itemContent}
        {hasChildren && (
          <AnimatePresence>
            {isExpanded && !collapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="ml-4 mt-1 space-y-1 overflow-hidden"
              >
                {section.children!.map(child => (
                  <motion.div
                    key={child.id}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSectionChange(child.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-all",
                      activeSection === child.id
                        ? "bg-rose-500/10 text-rose-400"
                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
                    )}
                  >
                    <Layers className="w-3 h-3" />
                    <span className="truncate">{child.label}</span>
                    {child.badge !== undefined && (
                      <Badge className="text-xs bg-slate-700 text-slate-300 ml-auto">
                        {child.badge}
                      </Badge>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 280 }}
      className="h-full bg-slate-900/95 border-r border-slate-700/50 flex flex-col"
    >
      {/* Back Button */}
      {!collapsed && (
        <div className="p-2 border-b border-slate-700/50">
          <motion.button
            onClick={handleBack}
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Boss</span>
          </motion.button>
        </div>
      )}

      {/* Header */}
      <div className={cn("p-4 border-b border-slate-700/50", collapsed && "p-2")}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/20 rounded-lg">
            <Target className="w-5 h-5 text-rose-400" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-white">Promise Tracker</h2>
              <p className="text-xs text-slate-400">Management System</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Items */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sidebarSections.map(renderSidebarItem)}
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>System Status</span>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              ACTIVE
            </Badge>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
