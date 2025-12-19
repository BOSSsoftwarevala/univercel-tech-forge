import { useState } from "react";
import { motion } from "framer-motion";
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

const PrimeUserDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <LiveTaskTimer />
              </div>
              <PriorityQueuePosition />
            </div>
            <ProjectMilestones />
          </div>
        );
      case "milestones":
        return <ProjectMilestones />;
      case "chat":
        return <AccountManagerChat />;
      case "documents":
        return <DocumentTracker />;
      case "wallet":
        return <WalletHistory />;
      case "bugs":
        return <BugChangeTracker />;
      case "downloads":
        return <DownloadArea />;
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <LiveTaskTimer />
            </div>
            <PriorityQueuePosition />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950/20 flex">
      <PrimeUserSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="flex-1 flex flex-col">
        <PrimeUserTopBar />
        
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
      
      <PrimeNotifications />
    </div>
  );
};

export default PrimeUserDashboard;
