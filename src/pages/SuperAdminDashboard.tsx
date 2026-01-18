import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminTopBar from "@/components/admin/AdminTopBar";
import AdminNotifications from "@/components/admin/AdminNotifications";
import HeaderAlertStack from "@/components/shared/HeaderAlertStack";
import FloatingChatButton from "@/components/admin/FloatingChatButton";
import type { NotificationAlert } from "@/components/shared/GlobalNotificationHeader";
import { PendingRequestsBanner } from "@/components/shared/PendingRequestsBanner";

// Placeholder type for legacy AdminView
type AdminView = string;

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

// Placeholder component for categories not yet implemented
const CategoryPlaceholder = ({ title }: { title: string }) => (
  <div className="space-y-6">
    <div className="flex flex-col items-center justify-center py-6 bg-card/30 rounded-2xl border border-white/10">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
        <span className="text-3xl">🚧</span>
      </div>
      <h2 className="text-2xl font-bold mb-1">{title}</h2>
      <p className="text-muted-foreground text-sm">This module is ready for sub/micro/nano mapping</p>
    </div>
    
    {/* 3 Equal Sized Boxes */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 min-h-[200px] flex flex-col items-center justify-center hover:border-primary/30 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-3">
          <span className="text-xl">📊</span>
        </div>
        <h3 className="font-semibold text-lg mb-1">Quick Stats</h3>
        <p className="text-muted-foreground text-sm text-center">Overview metrics and KPIs</p>
      </div>
      
      <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 min-h-[200px] flex flex-col items-center justify-center hover:border-primary/30 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center mb-3">
          <span className="text-xl">⚡</span>
        </div>
        <h3 className="font-semibold text-lg mb-1">Recent Activity</h3>
        <p className="text-muted-foreground text-sm text-center">Latest actions and updates</p>
      </div>
      
      <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 min-h-[200px] flex flex-col items-center justify-center hover:border-primary/30 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-neon-teal/20 flex items-center justify-center mb-3">
          <span className="text-xl">🔧</span>
        </div>
        <h3 className="font-semibold text-lg mb-1">Quick Actions</h3>
        <p className="text-muted-foreground text-sm text-center">Common tasks and shortcuts</p>
      </div>
    </div>
  </div>
);

const SuperAdminDashboard = () => {
  const [activeView, setActiveView] = useState<AdminView>("super-admin");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationAlert[]>(sampleNotifications);

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id && !n.isBuzzer));
  };

  const handleNotificationAction = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const stackAlerts = notifications.filter(n => n.type === 'priority' || n.type === 'danger').slice(0, 3);

  // Map of category titles for display
  const categoryTitles: Record<AdminView, string> = {
    "super-admin": "Super Admin",
    "admin": "Admin",
    "server-manager": "Server Manager",
    "franchise-manager": "Franchise Manager",
    "sales-support-manager": "Sales & Support Manager",
    "reseller-manager": "Reseller Manager",
    "api-ai-manager": "API / AI Manager",
    "influencer-manager": "Influencer Manager",
    "seo-manager": "SEO Manager",
    "marketing-manager": "Marketing Manager",
    "lead-manager": "Lead Manager",
    "pro-manager": "Pro Manager",
    "legal-manager": "Legal Manager",
    "task-manager": "Task Manager",
    "hr-manager": "HR Manager",
    "developer-manager": "Developer Manager",
    "franchise": "Franchise",
    "developer": "Developer",
    "reseller": "Reseller",
    "influencer": "Influencer",
    "prime-user": "Prime User",
    "user": "User",
    "frontend": "Frontend",
    "safe-assist": "Safe Assist",
    "assist-manager": "Assist Manager",
    "promise-tracker": "Promise Tracker",
    "promise-management": "Promise Management",
    "dashboard-management": "Dashboard Management",
  };

  const renderContent = () => {
    return <CategoryPlaceholder title={categoryTitles[activeView]} />;
  };

  return (
    <div className="min-h-screen bg-background grid-lines flex flex-col">
      {/* Pending Requests Banner - TOP PRIORITY */}
      <PendingRequestsBanner />
      
      <div className="flex-1 flex relative">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-purple/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-neon-teal/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        {/* Sidebar removed - using new RoleSwitchSidebarNew */}
      
      <div className="flex-1 flex flex-col">
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
    </div>
  );
};

export default SuperAdminDashboard;
