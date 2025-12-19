import { useState } from "react";
import { motion } from "framer-motion";
import MarketingSidebar from "@/components/marketing/MarketingSidebar";
import MarketingTopBar from "@/components/marketing/MarketingTopBar";
import CampaignCommandCenter from "@/components/marketing/CampaignCommandCenter";
import LeadAmplificationEngine from "@/components/marketing/LeadAmplificationEngine";
import InfluencerBridge from "@/components/marketing/InfluencerBridge";
import MultiChannelAutomation from "@/components/marketing/MultiChannelAutomation";
import PerformanceAnalyticsHub from "@/components/marketing/PerformanceAnalyticsHub";
import ContentCreativeLibrary from "@/components/marketing/ContentCreativeLibrary";
import TerritoryIntelligence from "@/components/marketing/TerritoryIntelligence";
import MarketingNotifications from "@/components/marketing/MarketingNotifications";
import AICampaignOptimizer from "@/components/marketing/AICampaignOptimizer";

const MarketingManager = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CampaignCommandCenter />
              </div>
              <LeadAmplificationEngine />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceAnalyticsHub />
              <TerritoryIntelligence />
            </div>
          </div>
        );
      case "campaigns":
        return <CampaignCommandCenter fullView />;
      case "leads":
        return <LeadAmplificationEngine fullView />;
      case "influencers":
        return <InfluencerBridge />;
      case "automation":
        return <MultiChannelAutomation />;
      case "analytics":
        return <PerformanceAnalyticsHub fullView />;
      case "content":
        return <ContentCreativeLibrary />;
      case "territory":
        return <TerritoryIntelligence fullView />;
      case "ai-optimizer":
        return <AICampaignOptimizer />;
      default:
        return <CampaignCommandCenter />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950/20 flex">
      <MarketingSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="flex-1 flex flex-col">
        <MarketingTopBar />
        
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
      
      <MarketingNotifications />
    </div>
  );
};

export default MarketingManager;
