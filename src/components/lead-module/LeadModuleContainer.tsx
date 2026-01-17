import React, { useState } from 'react';
import { LeadModuleSidebar, type LeadSection } from './LeadModuleSidebar';
import { LeadOverview } from './LeadOverview';
import { AllLeads } from './AllLeads';
import { LeadSources } from './LeadSources';
import { LeadScoring } from './LeadScoring';
import { LeadRouting } from './LeadRouting';
import { CountryRegion } from './CountryRegion';
import { FollowUps } from './FollowUps';
import { Conversions } from './Conversions';
import { LeadSettings } from './LeadSettings';

export const LeadModuleContainer: React.FC<{ initialSection?: LeadSection }> = ({ initialSection = 'overview' }) => {
  const [activeSection, setActiveSection] = useState<LeadSection>(initialSection);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return <LeadOverview />;
      case 'all-leads': return <AllLeads />;
      case 'lead-sources': return <LeadSources />;
      case 'lead-scoring': return <LeadScoring />;
      case 'lead-routing': return <LeadRouting />;
      case 'country-region': return <CountryRegion />;
      case 'follow-ups': return <FollowUps />;
      case 'conversions': return <Conversions />;
      case 'settings': return <LeadSettings />;
      default: return <LeadOverview />;
    }
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-120px)]">
      <LeadModuleSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 p-6 overflow-auto">{renderContent()}</div>
    </div>
  );
};
