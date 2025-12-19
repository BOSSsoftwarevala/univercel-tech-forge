import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import ModuleOverview from "@/components/admin/ModuleOverview";
import RoleAccessControl from "@/components/admin/RoleAccessControl";
import SystemHealth from "@/components/admin/SystemHealth";
import UserManagement from "@/components/admin/UserManagement";
import ActivityMonitor from "@/components/admin/ActivityMonitor";
import GlobalMetrics from "@/components/admin/GlobalMetrics";
import SecurityCenter from "@/components/admin/SecurityCenter";
import AdminNotifications from "@/components/admin/AdminNotifications";

type AdminView = 
  | "overview"
  | "roles"
  | "users"
  | "health"
  | "activity"
  | "metrics"
  | "security";

const SuperAdminDashboard = () => {
  const [activeView, setActiveView] = useState<AdminView>("overview");
  const [showNotifications, setShowNotifications] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return <ModuleOverview />;
      case "roles":
        return <RoleAccessControl />;
      case "users":
        return <UserManagement />;
      case "health":
        return <SystemHealth />;
      case "activity":
        return <ActivityMonitor />;
      case "metrics":
        return <GlobalMetrics />;
      case "security":
        return <SecurityCenter />;
      default:
        return <ModuleOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background grid-lines flex">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-purple/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-neon-teal/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <AdminSidebar activeView={activeView} onViewChange={setActiveView} />
      
      <div className="flex-1 flex flex-col ml-64">
        <AdminTopBar onNotificationsClick={() => setShowNotifications(true)} />
        
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

      <AdminNotifications 
        open={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
};

export default SuperAdminDashboard;
