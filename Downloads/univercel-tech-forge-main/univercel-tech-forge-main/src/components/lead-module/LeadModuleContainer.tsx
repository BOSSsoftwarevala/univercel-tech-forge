/**
 * LEAD MODULE CONTAINER (Step 9)
 */
import React, { useState } from 'react';
import { LeadModuleSidebar, type LeadSection } from './LeadModuleSidebar';
import { LeadDashboard } from './LeadDashboard';
import { AllLeads } from './AllLeads';
import { LeadSources } from './LeadSources';
import { CountryView } from './CountryView';
import { LeadScoring } from './LeadScoring';
import { Assignments } from './Assignments';
import { FollowUps } from './FollowUps';
import { Conversions } from './Conversions';
import { LeadReports } from './LeadReports';
import { LeadSettings } from './LeadSettings';

interface LeadModuleContainerProps {
  initialSection?: LeadSection;
  onBack?: () => void;
}

export const LeadModuleContainer: React.FC<LeadModuleContainerProps> = ({ 
  initialSection = 'dashboard',
  onBack
}) => {
  const [activeSection, setActiveSection] = useState<LeadSection>(initialSection);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <LeadDashboard />;
      case 'all-leads': return <AllLeads />;
      case 'lead-sources': return <LeadSources />;
      case 'country-view': return <CountryView />;
      case 'lead-scoring': return <LeadScoring />;
      case 'assignments': return <Assignments />;
      case 'follow-ups': return <FollowUps />;
      case 'conversions': return <Conversions />;
      case 'reports': return <LeadReports />;
      case 'settings': return <LeadSettings />;
      default: return <LeadDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen w-full" style={{ background: '#0B0F1A' }}>
      <LeadModuleSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        onBack={onBack}
      />
      <div className="flex-1 p-6 overflow-auto" style={{ color: '#FFFFFF' }}>{renderContent()}</div>
    </div>
  );
};
