/**
 * OVER AI - Main Container
 * LOCKED - DO NOT MODIFY
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { OverAISidebar } from './OverAISidebar';
import { OverAIHeader } from './OverAIHeader';
import { OverAIDashboard } from './sections/OverAIDashboard';
import { AISpeedEngine } from './sections/AISpeedEngine';
import { ServerOrchestration } from './sections/ServerOrchestration';
import { SelfHealingSystem } from './sections/SelfHealingSystem';
import { AIDecisionLogic } from './sections/AIDecisionLogic';
import { SupportIntegration } from './sections/SupportIntegration';
import { SecurityControl } from './sections/SecurityControl';
import { FailSafeMode } from './sections/FailSafeMode';
import { OverAISection, UserRole } from './types';

interface OverAIContainerProps {
  userRole?: UserRole;
}

// Allowed roles for OVER AI access
const ALLOWED_ROLES: UserRole[] = ['ceo', 'core_ai_admin', 'server_manager', 'support_manager'];

export function OverAIContainer({ userRole = 'ceo' }: OverAIContainerProps) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<OverAISection>('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  // Security: Block unauthorized access
  useEffect(() => {
    if (!ALLOWED_ROLES.includes(userRole)) {
      toast.error('Access Denied: Insufficient permissions');
      navigate('/');
      return;
    }
  }, [userRole, navigate]);

  // Security: Disable right-click
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast.error('Right-click disabled');
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error('Copy disabled');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+C, Ctrl+V, Ctrl+U, F12, Ctrl+Shift+I
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'u')) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I')
      ) {
        e.preventDefault();
        toast.error('Action blocked');
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <OverAIDashboard />;
      case 'speed-engine':
        return <AISpeedEngine />;
      case 'server-orchestration':
        return <ServerOrchestration />;
      case 'self-healing':
        return <SelfHealingSystem />;
      case 'decision-logic':
        return <AIDecisionLogic />;
      case 'support-integration':
        return <SupportIntegration />;
      case 'security-control':
        return <SecurityControl />;
      case 'fail-safe':
        return <FailSafeMode />;
      default:
        return <OverAIDashboard />;
    }
  };

  // Check read-only for support_manager
  const isReadOnly = userRole === 'support_manager';

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#0a0a10] via-[#0d0d14] to-[#0a0a10] text-white flex flex-col select-none"
      style={{ userSelect: 'none' }}
    >
      {/* Fixed Global Header */}
      <OverAIHeader userRole={userRole} />

      <div className="flex flex-1 pt-16">
        {/* Left Sidebar */}
        <OverAISidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          onBack={handleBack}
        />

        {/* Main Content */}
        <main
          className="flex-1 transition-all duration-300 p-6 overflow-auto"
          style={{ marginLeft: collapsed ? 80 : 280 }}
        >
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {isReadOnly && (
              <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
                ⚠️ READ-ONLY MODE: You can view but not modify settings
              </div>
            )}
            {renderSection()}
          </motion.div>
        </main>
      </div>

      {/* Footer */}
      <footer className="h-10 bg-[#0a0a10]/80 border-t border-cyan-500/20 flex items-center justify-between px-6 text-xs text-white/50">
        <span>OVER AI v1.0 • Core Intelligence Engine</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          System Locked • No Modifications Allowed
        </span>
      </footer>
    </div>
  );
}

export default OverAIContainer;
