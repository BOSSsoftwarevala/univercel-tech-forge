/**
 * Internal Support AI Manager - Main Container
 * Routes between all support modules
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { InternalSupportAISidebar } from './InternalSupportAISidebar';
import { InternalSupportAIHeader } from './InternalSupportAIHeader';
import { SupportDashboard } from './sections/SupportDashboard';
import { AutoIssueDetection } from './sections/AutoIssueDetection';
import { AutoFixEngine } from './sections/AutoFixEngine';
import { EscalationManager } from './sections/EscalationManager';
import { AITransparencyLog } from './sections/AITransparencyLog';
import { SecurityPrivacy } from './sections/SecurityPrivacy';
import { SupportAISection } from './types';

interface InternalSupportAIContainerProps {
  onBack?: () => void;
}

export const InternalSupportAIContainer: React.FC<InternalSupportAIContainerProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState<SupportAISection>('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <SupportDashboard activeView={activeSection} />;
      case 'auto-detection':
        return <AutoIssueDetection activeView={activeSection} />;
      case 'issue-classification':
        return <AutoIssueDetection activeView={activeSection} />;
      case 'auto-fix-engine':
        return <AutoFixEngine activeView={activeSection} />;
      case 'smart-clarification':
        return <SupportDashboard activeView={activeSection} />;
      case 'escalation-manager':
        return <EscalationManager activeView={activeSection} />;
      case 'resolution-confirmation':
        return <SupportDashboard activeView={activeSection} />;
      case 'knowledge-intelligence':
        return <SupportDashboard activeView={activeSection} />;
      case 'ai-transparency-log':
        return <AITransparencyLog activeView={activeSection} />;
      case 'security-privacy':
        return <SecurityPrivacy activeView={activeSection} />;
      default:
        return <SupportDashboard activeView="dashboard" />;
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex"
      style={{ background: 'linear-gradient(135deg, #0B0F1A 0%, #0F172A 50%, #0B1628 100%)' }}
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
    >
      {/* Sidebar */}
      <InternalSupportAISidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <InternalSupportAIHeader
          systemStatus="LIVE"
          pendingIssues={12}
          autoFixSuccessRate={91.3}
          escalationQueue={3}
          userRole="SUPER_ADMIN"
        />

        {/* Content */}
        <main className="flex-1 p-4 overflow-auto mt-14">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>

      {/* Anti-Screenshot Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{
          background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.001) 10px, rgba(0,0,0,0.001) 20px)'
        }}
      />
    </div>
  );
};

export default InternalSupportAIContainer;
