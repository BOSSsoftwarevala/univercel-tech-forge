import { useState } from "react";
import { motion } from "framer-motion";
import MarketingSidebar from "@/components/marketing/MarketingSidebar";
import MarketingTopBar from "@/components/marketing/MarketingTopBar";
import MarketingNotifications from "@/components/marketing/MarketingNotifications";

// Section Components
import MarketingOverview from "@/components/marketing/sections/MarketingOverview";
import SEOManagement from "@/components/marketing/sections/SEOManagement";
import ContentMarketing from "@/components/marketing/sections/ContentMarketing";
import PaidAdsManager from "@/components/marketing/sections/PaidAdsManager";
import SocialMediaMarketing from "@/components/marketing/sections/SocialMediaMarketing";
import LeadGeneration from "@/components/marketing/sections/LeadGeneration";
import LeadRoutingScoring from "@/components/marketing/sections/LeadRoutingScoring";
import CampaignManagement from "@/components/marketing/sections/CampaignManagement";
import RegionalMarketing from "@/components/marketing/sections/RegionalMarketing";
import InfluencerMarketing from "@/components/marketing/sections/InfluencerMarketing";
import EmailSMSMarketing from "@/components/marketing/sections/EmailSMSMarketing";
import MarketingAutomation from "@/components/marketing/sections/MarketingAutomation";
import AnalyticsReports from "@/components/marketing/sections/AnalyticsReports";
import AlertsApprovals from "@/components/marketing/sections/AlertsApprovals";
import LogsCompliance from "@/components/marketing/sections/LogsCompliance";

const MarketingManager = () => {
  const [activeSection, setActiveSection] = useState("overview-campaigns");

  const renderContent = () => {
    // Overview Section
    if (activeSection.startsWith("overview")) {
      return <MarketingOverview activeView={activeSection} />;
    }
    
    // SEO Management
    if (activeSection.startsWith("seo")) {
      return <SEOManagement activeView={activeSection} />;
    }
    
    // Content Marketing
    if (activeSection.startsWith("content")) {
      return <ContentMarketing activeView={activeSection} />;
    }
    
    // Paid Ads Manager
    if (activeSection.startsWith("ads")) {
      return <PaidAdsManager activeView={activeSection} />;
    }
    
    // Social Media Marketing
    if (activeSection.startsWith("social")) {
      return <SocialMediaMarketing activeView={activeSection} />;
    }
    
    // Lead Generation
    if (activeSection.startsWith("leads")) {
      return <LeadGeneration activeView={activeSection} />;
    }
    
    // Lead Routing & Scoring
    if (activeSection.startsWith("routing")) {
      return <LeadRoutingScoring activeView={activeSection} />;
    }
    
    // Campaign Management
    if (activeSection.startsWith("campaigns")) {
      return <CampaignManagement activeView={activeSection} />;
    }
    
    // Regional Marketing
    if (activeSection.startsWith("regional")) {
      return <RegionalMarketing activeView={activeSection} />;
    }
    
    // Influencer Marketing
    if (activeSection.startsWith("influencer")) {
      return <InfluencerMarketing activeView={activeSection} />;
    }
    
    // Email & SMS Marketing
    if (activeSection.startsWith("email") || activeSection.startsWith("sms") || activeSection.startsWith("whatsapp") || activeSection.startsWith("template") || activeSection.startsWith("delivery")) {
      return <EmailSMSMarketing activeView={activeSection} />;
    }
    
    // Marketing Automation
    if (activeSection.startsWith("automation")) {
      return <MarketingAutomation activeView={activeSection} />;
    }
    
    // Analytics & Reports
    if (activeSection.startsWith("analytics")) {
      return <AnalyticsReports activeView={activeSection} />;
    }
    
    // Alerts & Approvals
    if (activeSection.startsWith("alerts")) {
      return <AlertsApprovals activeView={activeSection} />;
    }
    
    // Logs & Compliance
    if (activeSection.startsWith("logs")) {
      return <LogsCompliance activeView={activeSection} />;
    }
    
    // Default to Overview
    return <MarketingOverview activeView="overview-campaigns" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950/20 flex">
      <MarketingSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <MarketingTopBar />
        
        <main className="flex-1 p-4 overflow-auto">
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
      
      <MarketingNotifications />
    </div>
  );
};

export default MarketingManager;
