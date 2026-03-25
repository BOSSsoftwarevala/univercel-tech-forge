/**
 * RESELLER MANAGER FULL VIEW
 * Complete dashboard with hierarchical sidebar
 */
import React, { useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ResellerManagerFullSidebar } from '@/components/reseller-manager/ResellerManagerFullSidebar';
import { ResellerManagerFullContent } from '@/components/reseller-manager/ResellerManagerFullContent';
import { useNavigate } from 'react-router-dom';

interface ResellerManagerFullViewProps {
  onBack?: () => void;
}

export function ResellerManagerFullView({ onBack }: ResellerManagerFullViewProps) {
  const [activeSection, setActiveSection] = useState('dashboard-overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/super-admin-system/role-switch?role=boss_owner');
    }
  };

  return (
    <TooltipProvider>
      <div className="flex h-full w-full bg-slate-950">
        <ResellerManagerFullSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onBack={handleBack}
        />
        <main className="flex-1 overflow-hidden">
          <ResellerManagerFullContent activeSection={activeSection} />
        </main>
      </div>
    </TooltipProvider>
  );
}

export default ResellerManagerFullView;
