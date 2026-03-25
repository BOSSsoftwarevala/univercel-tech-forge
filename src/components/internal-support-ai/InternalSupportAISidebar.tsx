/**
 * Internal Support AI Manager - Sidebar Navigation
 * Enterprise-grade sidebar with all support modules
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Radar,
  Tags,
  Wrench,
  MessageCircleQuestion,
  ArrowUpCircle,
  CheckCircle2,
  BookOpen,
  FileText,
  Shield,
  ChevronDown,
  ChevronRight,
  Activity,
  AlertTriangle,
  MousePointer,
  Wifi,
  Lock,
  RefreshCw,
  Zap,
  Clock,
  Users,
  Target,
  TrendingUp,
  Database,
  Eye,
  BrainCircuit
} from 'lucide-react';
import { SupportAISection } from './types';
import softwareValaLogo from '@/assets/software-vala-logo-transparent.png';

interface InternalSupportAISidebarProps {
  activeSection: SupportAISection;
  onSectionChange: (section: SupportAISection) => void;
}

interface MenuItem {
  id: SupportAISection;
  label: string;
  icon: React.ReactNode;
  subItems?: { id: string; label: string; icon: React.ReactNode }[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-4 h-4" />,
    subItems: [
      { id: 'live-overview', label: 'Live Issue Overview', icon: <Activity className="w-3 h-3" /> },
      { id: 'auto-fix-graph', label: 'Auto-Fix Success Graph', icon: <TrendingUp className="w-3 h-3" /> },
      { id: 'failures-heatmap', label: 'Active Failures Heatmap', icon: <Target className="w-3 h-3" /> },
      { id: 'sla-predictor', label: 'SLA Breach Predictor', icon: <Clock className="w-3 h-3" /> },
      { id: 'frustration-index', label: 'User Frustration Index', icon: <AlertTriangle className="w-3 h-3" /> }
    ]
  },
  {
    id: 'auto-detection',
    label: 'Auto Issue Detection',
    icon: <Radar className="w-4 h-4" />,
    subItems: [
      { id: 'context-capture', label: 'Real-time Context Capture', icon: <Eye className="w-3 h-3" /> },
      { id: 'error-listener', label: 'Silent Error Listener', icon: <AlertTriangle className="w-3 h-3" /> },
      { id: 'click-tracker', label: 'Click-Failure Tracker', icon: <MousePointer className="w-3 h-3" /> },
      { id: 'api-detector', label: 'API Failure Detector', icon: <Zap className="w-3 h-3" /> },
      { id: 'permission-detector', label: 'Permission Mismatch', icon: <Lock className="w-3 h-3" /> },
      { id: 'session-detector', label: 'Session Corruption', icon: <RefreshCw className="w-3 h-3" /> },
      { id: 'network-detector', label: 'Network / Latency', icon: <Wifi className="w-3 h-3" /> }
    ]
  },
  {
    id: 'issue-classification',
    label: 'Issue Classification',
    icon: <Tags className="w-4 h-4" />,
    subItems: [
      { id: 'ui-failure', label: 'UI Failure', icon: <LayoutDashboard className="w-3 h-3" /> },
      { id: 'functional-failure', label: 'Functional Failure', icon: <Wrench className="w-3 h-3" /> },
      { id: 'performance-lag', label: 'Performance Lag', icon: <Activity className="w-3 h-3" /> },
      { id: 'permission-issue', label: 'Permission / Role Issue', icon: <Shield className="w-3 h-3" /> },
      { id: 'billing-issue', label: 'Billing / Wallet Issue', icon: <Database className="w-3 h-3" /> },
      { id: 'demo-issue', label: 'Demo / Preview Issue', icon: <Eye className="w-3 h-3" /> },
      { id: 'ai-issue', label: 'AI Response Issue', icon: <BrainCircuit className="w-3 h-3" /> },
      { id: 'unknown-pattern', label: 'Unknown / New Pattern', icon: <AlertTriangle className="w-3 h-3" /> }
    ]
  },
  {
    id: 'auto-fix-engine',
    label: 'Auto-Fix Engine',
    icon: <Wrench className="w-4 h-4" />,
    subItems: [
      { id: 'safe-fix-queue', label: 'Safe Fix Queue', icon: <CheckCircle2 className="w-3 h-3" /> },
      { id: 'config-resync', label: 'Config Re-sync', icon: <RefreshCw className="w-3 h-3" /> },
      { id: 'permission-rebind', label: 'Permission Rebind', icon: <Lock className="w-3 h-3" /> },
      { id: 'cache-reset', label: 'Cache / State Reset', icon: <Database className="w-3 h-3" /> },
      { id: 'api-reconnect', label: 'API Reconnect', icon: <Wifi className="w-3 h-3" /> },
      { id: 'service-restart', label: 'Service Restart (Scoped)', icon: <Zap className="w-3 h-3" /> },
      { id: 'rollback-stable', label: 'Rollback to Last Stable', icon: <RefreshCw className="w-3 h-3" /> }
    ]
  },
  {
    id: 'smart-clarification',
    label: 'Smart Clarification',
    icon: <MessageCircleQuestion className="w-4 h-4" />,
    subItems: [
      { id: 'single-question', label: 'Single Question Generator', icon: <MessageCircleQuestion className="w-3 h-3" /> },
      { id: 'yes-no-resolver', label: 'Yes / No Resolver', icon: <CheckCircle2 className="w-3 h-3" /> },
      { id: 'option-selector', label: 'Option Selector (Max 3)', icon: <Target className="w-3 h-3" /> },
      { id: 'auto-timeout', label: 'Auto-timeout → Escalate', icon: <Clock className="w-3 h-3" /> }
    ]
  },
  {
    id: 'escalation-manager',
    label: 'Escalation Manager',
    icon: <ArrowUpCircle className="w-4 h-4" />,
    subItems: [
      { id: 'auto-task-creation', label: 'Auto Task Creation', icon: <Target className="w-3 h-3" /> },
      { id: 'team-routing', label: 'Correct Team Routing', icon: <Users className="w-3 h-3" /> },
      { id: 'sla-auto-start', label: 'SLA Auto Start', icon: <Clock className="w-3 h-3" /> },
      { id: 'priority-assign', label: 'Priority Auto Assign', icon: <AlertTriangle className="w-3 h-3" /> },
      { id: 'progress-tracker', label: 'User-visible Progress', icon: <Activity className="w-3 h-3" /> },
      { id: 'internal-notes', label: 'Internal Notes (Hidden)', icon: <FileText className="w-3 h-3" /> }
    ]
  },
  {
    id: 'resolution-confirmation',
    label: 'Resolution Confirmation',
    icon: <CheckCircle2 className="w-4 h-4" />,
    subItems: [
      { id: 'auto-verification', label: 'Auto Verification Check', icon: <CheckCircle2 className="w-3 h-3" /> },
      { id: 'user-confirmation', label: 'User Confirmation', icon: <Users className="w-3 h-3" /> },
      { id: 'reopen-issue', label: 'Reopen Issue', icon: <RefreshCw className="w-3 h-3" /> },
      { id: 'feedback-capture', label: 'Feedback Capture (1-click)', icon: <Target className="w-3 h-3" /> }
    ]
  },
  {
    id: 'knowledge-intelligence',
    label: 'Knowledge Intelligence',
    icon: <BookOpen className="w-4 h-4" />,
    subItems: [
      { id: 'known-issues', label: 'Known Issues Library', icon: <Database className="w-3 h-3" /> },
      { id: 'auto-match', label: 'Auto-Match Resolver', icon: <Target className="w-3 h-3" /> },
      { id: 'fix-history', label: 'Fix History Tracker', icon: <FileText className="w-3 h-3" /> },
      { id: 'pattern-learning', label: 'Pattern Learning Engine', icon: <BrainCircuit className="w-3 h-3" /> }
    ]
  },
  {
    id: 'ai-transparency-log',
    label: 'AI Transparency Log',
    icon: <FileText className="w-4 h-4" />,
    subItems: [
      { id: 'issue-detected', label: 'Issue Detected', icon: <AlertTriangle className="w-3 h-3" /> },
      { id: 'action-taken', label: 'Action Taken', icon: <Wrench className="w-3 h-3" /> },
      { id: 'reason', label: 'Reason', icon: <MessageCircleQuestion className="w-3 h-3" /> },
      { id: 'outcome', label: 'Outcome', icon: <CheckCircle2 className="w-3 h-3" /> },
      { id: 'next-step', label: 'Next Step', icon: <ArrowUpCircle className="w-3 h-3" /> }
    ]
  },
  {
    id: 'security-privacy',
    label: 'Security & Privacy',
    icon: <Shield className="w-4 h-4" />,
    subItems: [
      { id: 'no-chat-delete', label: 'No Chat Delete', icon: <Lock className="w-3 h-3" /> },
      { id: 'no-edit', label: 'No Edit', icon: <Lock className="w-3 h-3" /> },
      { id: 'no-copy', label: 'No Copy', icon: <Lock className="w-3 h-3" /> },
      { id: 'no-share', label: 'No Share', icon: <Lock className="w-3 h-3" /> },
      { id: 'no-screenshot', label: 'No Screenshot', icon: <Lock className="w-3 h-3" /> },
      { id: 'masked-identity', label: 'Masked Identity', icon: <Shield className="w-3 h-3" /> }
    ]
  }
];

export const InternalSupportAISidebar: React.FC<InternalSupportAISidebarProps> = ({
  activeSection,
  onSectionChange
}) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['dashboard']);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]
    );
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl border-r border-cyan-500/20 flex flex-col h-screen fixed left-0 top-0 z-50"
    >
      {/* Logo Header */}
      <div className="px-3 py-3 border-b border-cyan-500/20 shrink-0 flex justify-center">
        <img
          src={softwareValaLogo}
          alt="Software Vala"
          className="w-14 h-14 rounded-full object-contain border-2 border-cyan-500/30"
        />
      </div>

      {/* Title */}
      <div className="px-4 py-3 border-b border-cyan-500/20">
        <h2 className="text-sm font-bold text-cyan-400 text-center">
          INTERNAL SUPPORT AI
        </h2>
        <p className="text-[10px] text-slate-400 text-center mt-1">
          Enterprise Auto-Identify System
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => {
                onSectionChange(item.id);
                if (item.subItems) toggleMenu(item.id);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={activeSection === item.id ? 'text-cyan-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.subItems && (
                <span className="text-slate-500">
                  {expandedMenus.includes(item.id) ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </span>
              )}
            </button>

            <AnimatePresence>
              {item.subItems && expandedMenus.includes(item.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden ml-4 mt-1 space-y-0.5"
                >
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-[10px] text-slate-400 hover:text-cyan-300 hover:bg-slate-800/30 transition-all"
                    >
                      <span className="text-slate-500">{subItem.icon}</span>
                      <span>{subItem.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* System Stats Footer */}
      <div className="p-3 border-t border-cyan-500/20 bg-slate-900/50">
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="bg-emerald-500/10 rounded p-2 text-center">
            <p className="text-emerald-400 font-bold">92%</p>
            <p className="text-slate-500">Auto-Fix Rate</p>
          </div>
          <div className="bg-cyan-500/10 rounded p-2 text-center">
            <p className="text-cyan-400 font-bold">&lt;300ms</p>
            <p className="text-slate-500">Response</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};
