import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PrimeUserSidebar from "@/components/prime-user/PrimeUserSidebar";
import PrimeUserTopBar from "@/components/prime-user/PrimeUserTopBar";
import LiveTaskTimer from "@/components/prime-user/LiveTaskTimer";
import PriorityQueuePosition from "@/components/prime-user/PriorityQueuePosition";
import ProjectMilestones from "@/components/prime-user/ProjectMilestones";
import AccountManagerChat from "@/components/prime-user/AccountManagerChat";
import DocumentTracker from "@/components/prime-user/DocumentTracker";
import WalletHistory from "@/components/prime-user/WalletHistory";
import BugChangeTracker from "@/components/prime-user/BugChangeTracker";
import DownloadArea from "@/components/prime-user/DownloadArea";
import PrimeNotifications from "@/components/prime-user/PrimeNotifications";
import WelcomeAnimation from "@/components/prime-user/WelcomeAnimation";
import PriorityTicketPanel from "@/components/prime-user/PriorityTicketPanel";
import PriorityDevConsole from "@/components/prime-user/PriorityDevConsole";
import MaskedDevChat from "@/components/prime-user/MaskedDevChat";
import PremiumSupportCenter from "@/components/prime-user/PremiumSupportCenter";
import FeatureRequestBoard from "@/components/prime-user/FeatureRequestBoard";
import VIPDemoAccess from "@/components/prime-user/VIPDemoAccess";
import UptimeMonitor from "@/components/prime-user/UptimeMonitor";
import AIRequirementInterpreter from "@/components/prime-user/AIRequirementInterpreter";
import TrainingHub from "@/components/prime-user/TrainingHub";
import EmergencyChannel from "@/components/prime-user/EmergencyChannel";
import UsageAnalytics from "@/components/prime-user/UsageAnalytics";
import AnnouncementFeed from "@/components/prime-user/AnnouncementFeed";
import UpgradeStore from "@/components/prime-user/UpgradeStore";

const PrimeUserDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [showWelcome, setShowWelcome] = useState(true);

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2"><LiveTaskTimer /></div>
              <PriorityQueuePosition />
            </div>
            <ProjectMilestones />
          </div>
        );
      case "tickets": return <PriorityTicketPanel />;
      case "dev-console": return <PriorityDevConsole />;
      case "dev-chat": return <MaskedDevChat />;
      case "support": return <PremiumSupportCenter />;
      case "features": return <FeatureRequestBoard />;
      case "demos": return <VIPDemoAccess />;
      case "uptime": return <UptimeMonitor />;
      case "ai-interpreter": return <AIRequirementInterpreter />;
      case "training": return <TrainingHub />;
      case "emergency": return <EmergencyChannel />;
      case "analytics": return <UsageAnalytics />;
      case "announcements": return <AnnouncementFeed />;
      case "store": return <UpgradeStore />;
      case "milestones": return <ProjectMilestones />;
      case "chat": return <AccountManagerChat />;
      case "documents": return <DocumentTracker />;
      case "wallet": return <WalletHistory />;
      case "bugs": return <BugChangeTracker />;
      case "downloads": return <DownloadArea />;
      default: return <PriorityTicketPanel />;
    }
  };

  return (
    <>
      <AnimatePresence>
        {showWelcome && <WelcomeAnimation onComplete={() => setShowWelcome(false)} />}
      </AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: showWelcome ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950/20 flex"
      >
        <PrimeUserSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="flex-1 flex flex-col">
          <PrimeUserTopBar />
          <main className="flex-1 p-6 overflow-auto">
            <motion.div key={activeSection} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              {renderContent()}
            </motion.div>
          </main>
        </div>
        <PrimeNotifications />
      </motion.div>
    </>
  );
};

export default PrimeUserDashboard;
