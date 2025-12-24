import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebarFull from "@/components/admin/AdminSidebarFull";
import AdminTopBar from "@/components/admin/AdminTopBar";
import ModuleOverview from "@/components/admin/ModuleOverview";
import RoleAccessControl from "@/components/admin/RoleAccessControl";
import SystemHealth from "@/components/admin/SystemHealth";
import UserManagement from "@/components/admin/UserManagement";
import ActivityMonitor from "@/components/admin/ActivityMonitor";
import GlobalMetrics from "@/components/admin/GlobalMetrics";
import SecurityCenter from "@/components/admin/SecurityCenter";
import AdminNotifications from "@/components/admin/AdminNotifications";
import GlobalLiveControlCenter from "@/components/admin/GlobalLiveControlCenter";
import GlobalBranchMap from "@/components/admin/GlobalBranchMap";
import GlobalPromiseStatus from "@/components/admin/GlobalPromiseStatus";
import WalletFinanceConsole from "@/components/admin/WalletFinanceConsole";
import LeadDistributionHub from "@/components/admin/LeadDistributionHub";
import DeveloperTaskOrchestration from "@/components/admin/DeveloperTaskOrchestration";
import AIDeveloperManagement from "@/components/admin/AIDeveloperManagement";
import AIResellerManager from "@/components/admin/AIResellerManager";
import AIInfluencerManager from "@/components/admin/AIInfluencerManager";
import PerformanceScoringAI from "@/components/admin/PerformanceScoringAI";
import ComplianceLegalShield from "@/components/admin/ComplianceLegalShield";
import EmergencyBuzzerControls from "@/components/admin/EmergencyBuzzerControls";
import HeaderAlertStack from "@/components/shared/HeaderAlertStack";
import LiveAlertGrid from "@/components/admin/LiveAlertGrid";
import FloatingChatButton from "@/components/admin/FloatingChatButton";
import WelcomeBoss from "@/components/admin/WelcomeBoss";
import ProductManager from "@/components/demo-manager/ProductManager";
import ServerManagement from "@/components/admin/ServerManagement";
import { SuperAdminApprovalQueue } from "@/components/admin/SuperAdminApprovalQueue";
import { TwoFactorSettings } from "@/components/auth/TwoFactorSettings";
import { TrustedDeviceManager } from "@/components/auth/TrustedDeviceManager";
import { BackupCodesManager } from "@/components/auth/BackupCodesManager";
import ForceLogoutManager from "@/components/admin/ForceLogoutManager";
import ApprovalsHub from "@/components/admin/ApprovalsHub";
import PromiseManagement from "@/components/admin/PromiseManagement";
import AIManagementCenter from "@/components/admin/AIManagementCenter";
import FranchiseKeyGenerator from "@/components/admin/FranchiseKeyGenerator";
import ServerManagementHub from "@/components/admin/ServerManagementHub";
import type { NotificationAlert } from "@/components/shared/GlobalNotificationHeader";

type AdminView =
  | "overview"
  | "roles"
  | "users"
  | "health"
  | "activity"
  | "metrics"
  | "security"
  | "live-control"
  | "wallet-finance"
  | "lead-distribution"
  | "dev-orchestration"
  | "performance-ai"
  | "compliance"
  | "emergency"
  | "franchise"
  | "reseller"
  | "sales"
  | "support"
  | "seo"
  | "marketing"
  | "rnd"
  | "client-success"
  | "legal"
  | "hr"
  | "demo-product"
  | "influencer"
  | "prime-users"
  | "server-management"
  | "approval-queue"
  | "2fa-settings"
  | "force-logout"
  | "promise-management"
  | "ai-management"
  | "franchise-keys"
  | "settings";

// Sample notifications for demo
const sampleNotifications: NotificationAlert[] = [
  {
    id: '1',
    type: 'priority',
    message: 'New lead unassigned for 8 minutes - Mumbai Region',
    timestamp: new Date(Date.now() - 2 * 60000),
    eventType: 'LEAD ACTIVITY',
    actionLabel: 'Assign Now',
    isBuzzer: true,
    roleTarget: ['lead_manager', 'franchise', 'super_admin'],
  },
  {
    id: '2',
    type: 'danger',
    message: 'Demo server "ERP Pro" is offline - Action required',
    timestamp: new Date(Date.now() - 5 * 60000),
    eventType: 'DEMO OFFLINE',
    actionLabel: 'View Status',
    isBuzzer: true,
    roleTarget: ['demo_manager', 'super_admin'],
  },
  {
    id: '3',
    type: 'warning',
    message: 'Developer DEV-042 has not accepted task for 15 minutes',
    timestamp: new Date(Date.now() - 15 * 60000),
    eventType: 'DEVELOPER DELAY',
    actionLabel: 'Escalate',
    roleTarget: ['super_admin'],
  },
  {
    id: '4',
    type: 'success',
    message: 'Payment of ₹1,25,000 received from Prime Client #287',
    timestamp: new Date(Date.now() - 30 * 60000),
    eventType: 'PAYMENT SUCCESS',
    roleTarget: ['finance', 'super_admin'],
  },
  {
    id: '5',
    type: 'info',
    message: 'VIP Ticket #VIP-1842 requires immediate attention',
    timestamp: new Date(Date.now() - 3 * 60000),
    eventType: 'VIP PRIORITY',
    actionLabel: 'View Ticket',
    isBuzzer: true,
    roleTarget: ['support', 'super_admin'],
  },
];

const SuperAdminDashboard = () => {
  const [activeView, setActiveView] = useState<AdminView>("live-control");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationAlert[]>(sampleNotifications);

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id && !n.isBuzzer));
  };

  const handleNotificationAction = (id: string) => {
    // Handle action and remove notification
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Filter priority alerts for the stack
  const stackAlerts = notifications.filter(n => n.type === 'priority' || n.type === 'danger').slice(0, 3);

  const renderContent = () => {
    switch (activeView) {
      case "live-control":
        return (
          <div className="space-y-6">
            {/* Welcome Boss Title */}
            <WelcomeBoss disabled={showNotifications} />
            
            {/* Live Alert Grid - 2x2 */}
            <LiveAlertGrid />
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="overflow-auto max-h-[600px]">
                <GlobalLiveControlCenter />
              </div>
              <div className="h-[600px]">
                <GlobalBranchMap />
              </div>
            </div>
            <GlobalPromiseStatus />
          </div>
        );
      case "overview":
        return <ModuleOverview />;
      case "lead-distribution":
        return <LeadDistributionHub />;
      case "dev-orchestration":
        return <AIDeveloperManagement />;
      case "reseller":
        return <AIResellerManager />;
      case "wallet-finance":
        return <WalletFinanceConsole />;
      case "performance-ai":
        return <PerformanceScoringAI />;
      case "roles":
        return <RoleAccessControl />;
      case "users":
        return <UserManagement />;
      case "compliance":
        return <ComplianceLegalShield />;
      case "security":
        return <SecurityCenter />;
      case "emergency":
        return <EmergencyBuzzerControls />;
      case "health":
        return <SystemHealth />;
      case "activity":
        return <ActivityMonitor />;
      case "metrics":
        return <GlobalMetrics />;
      case "demo-product":
        return <ProductManager viewOnly={true} />;
      case "influencer":
        return <AIInfluencerManager />;
      case "server-management":
        return <ServerManagementHub />;
      case "approval-queue":
        return <ApprovalsHub />;
      case "force-logout":
        return <ForceLogoutManager />;
      case "promise-management":
        return <PromiseManagement />;
      case "ai-management":
        return <AIManagementCenter />;
      case "franchise-keys":
        return <FranchiseKeyGenerator />;
      case "franchise":
        return <FranchiseKeyGenerator />;
      case "2fa-settings":
        return (
          <div className="space-y-6">
            <TwoFactorSettings />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TrustedDeviceManager />
              <BackupCodesManager />
            </div>
          </div>
        );
      default:
        return <GlobalLiveControlCenter />;
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

      <AdminSidebarFull activeView={activeView} onViewChange={setActiveView} />
      
      <div className="flex-1 flex flex-col ml-64">
        <AdminTopBar 
          onNotificationsClick={() => setShowNotifications(true)}
          notifications={notifications}
          onDismissNotification={handleDismissNotification}
          onNotificationAction={handleNotificationAction}
        />
        
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

      {/* Header Alert Stack for Priority Notifications */}
      {stackAlerts.length > 0 && (
        <HeaderAlertStack
          alerts={stackAlerts}
          onDismiss={handleDismissNotification}
          onAction={handleNotificationAction}
        />
      )}

      {/* Floating Chat Button */}
      <FloatingChatButton 
        unreadCount={5} 
        onClick={() => setShowNotifications(true)} 
      />

      <AdminNotifications 
        open={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
};

export default SuperAdminDashboard;
