import { useState } from "react";
import { MarketingModuleSidebar } from "./MarketingModuleSidebar";
import { MarketingOverview } from "./MarketingOverview";
import { SEOManager } from "./SEOManager";
import { AdsManager } from "./AdsManager";
import { ContentStudio } from "./ContentStudio";
import { KeywordResearch } from "./KeywordResearch";
import { GeoTargeting } from "./GeoTargeting";
import { BudgetControl } from "./BudgetControl";
import { LeadAttribution } from "./LeadAttribution";
import { MarketingReports } from "./MarketingReports";
import { MarketingSettings } from "./MarketingSettings";

export const MarketingModuleContainer = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <MarketingOverview />;
      case "seo-manager":
        return <SEOManager />;
      case "ads-manager":
        return <AdsManager />;
      case "content-studio":
        return <ContentStudio />;
      case "keyword-research":
        return <KeywordResearch />;
      case "geo-targeting":
        return <GeoTargeting />;
      case "budget-control":
        return <BudgetControl />;
      case "lead-attribution":
        return <LeadAttribution />;
      case "reports":
        return <MarketingReports />;
      case "settings":
        return <MarketingSettings />;
      default:
        return <MarketingOverview />;
    }
  };

  return (
    <div className="flex h-full min-h-screen bg-background">
      <MarketingModuleSidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
      <div className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};
