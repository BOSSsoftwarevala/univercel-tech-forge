import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DemoManagerSidebar from "@/components/demo-manager/DemoManagerSidebar";
import DemoManagerTopBar from "@/components/demo-manager/DemoManagerTopBar";
import DemoStatusGrid from "@/components/demo-manager/DemoStatusGrid";
import DemoUptimeMonitor from "@/components/demo-manager/DemoUptimeMonitor";
import DemoURLManager from "@/components/demo-manager/DemoURLManager";
import DemoAnalytics from "@/components/demo-manager/DemoAnalytics";
import DemoCatalog from "@/components/demo-manager/DemoCatalog";
import DemoCreator from "@/components/demo-manager/DemoCreator";
import DemoNotifications from "@/components/demo-manager/DemoNotifications";

type DemoView = 
  | "status"
  | "uptime"
  | "urls"
  | "analytics"
  | "catalog"
  | "create";

const ProductDemoManager = () => {
  const [activeView, setActiveView] = useState<DemoView>("status");
  const [showNotifications, setShowNotifications] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case "status":
        return <DemoStatusGrid />;
      case "uptime":
        return <DemoUptimeMonitor />;
      case "urls":
        return <DemoURLManager />;
      case "analytics":
        return <DemoAnalytics />;
      case "catalog":
        return <DemoCatalog />;
      case "create":
        return <DemoCreator />;
      default:
        return <DemoStatusGrid />;
    }
  };

  return (
    <div className="min-h-screen bg-background grid-lines flex">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-teal/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-neon-green/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <DemoManagerSidebar activeView={activeView} onViewChange={setActiveView} />
      
      <div className="flex-1 flex flex-col ml-64">
        <DemoManagerTopBar onNotificationsClick={() => setShowNotifications(true)} />
        
        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <DemoNotifications 
        open={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
};

export default ProductDemoManager;
