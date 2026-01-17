import { useState } from "react";
import { MarketingModuleSidebar } from "./MarketingModuleSidebar";
import { MarketingDashboard } from "./MarketingDashboard";
import { SEOManager } from "./SEOManager";
import { AdsManager } from "./AdsManager";
import { ContentStudio } from "./ContentStudio";
import { KeywordPlanner } from "./KeywordPlanner";
import { CountryStrategy } from "./CountryStrategy";
import { LeadFunnel } from "./LeadFunnel";
import { Performance } from "./Performance";
import { BudgetControl } from "./BudgetControl";
import { MarketingSettings } from "./MarketingSettings";

interface MarketingModuleContainerProps {
  onBack?: () => void;
}

export const MarketingModuleContainer: React.FC<MarketingModuleContainerProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <MarketingDashboard />;
      case "seo-manager":
        return <SEOManager />;
      case "ads-manager":
        return <AdsManager />;
      case "content-studio":
        return <ContentStudio />;
      case "keyword-planner":
        return <KeywordPlanner />;
      case "country-strategy":
        return <CountryStrategy />;
      case "lead-funnel":
        return <LeadFunnel />;
      case "performance":
        return <Performance />;
      case "budget-control":
        return <BudgetControl />;
      case "settings":
        return <MarketingSettings />;
      default:
        return <MarketingDashboard />;
    }
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-120px)]">
      <MarketingModuleSidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        onBack={onBack}
      />
      <div className="flex-1 p-6 overflow-auto">{renderContent()}</div>
    </div>
  );
};
