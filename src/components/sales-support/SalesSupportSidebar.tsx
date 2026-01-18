/**
 * SALES SUPPORT SIDEBAR
 * SINGLE-CONTEXT ENFORCEMENT: Uses sidebar store for strict isolation
 */

import { motion } from "framer-motion";
import { 
  Headset, LayoutDashboard, Inbox, FileText, MessageCircle, Bot, Ticket,
  Shield, BarChart3, Phone, AlertCircle, Settings, Users, Mail, Activity,
  TrendingUp, UserRound, ArrowLeft
} from "lucide-react";
import { useSidebarStore, useShouldRenderSidebar } from "@/stores/sidebarStore";

interface SalesSupportSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onBack?: () => void;
}

const SalesSupportSidebar = ({ activeSection, setActiveSection, onBack }: SalesSupportSidebarProps) => {
  // SINGLE-CONTEXT ENFORCEMENT: Use store for clean context transitions
  const { exitToGlobal } = useSidebarStore();
  
  // Use dedicated hook for strict visibility check
  const shouldRender = useShouldRenderSidebar('category', 'sales-support');
  
  // Handle back navigation - triggers FULL context switch to Boss
  const handleBack = () => {
    exitToGlobal();
    onBack?.();
  };
  
  // STRICT ISOLATION: Only render when in Module context with matching category
  if (!shouldRender) {
    return null;
  }

  // Enterprise SSM Module Navigation - Final Locked List
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "support-team", label: "Support Team", icon: Headset },
    { id: "sales-team", label: "Sales Team", icon: Users },
    { id: "support-tickets", label: "Support Tickets", icon: Ticket },
    { id: "sales-leads", label: "Sales Leads", icon: Inbox },
    { id: "crm", label: "CRM / Customers", icon: UserRound },
    { id: "call-center", label: "Call Center", icon: Phone },
    { id: "email-queue", label: "Email Queue", icon: Mail },
    { id: "live-chat", label: "Live Chat", icon: MessageCircle },
    { id: "escalations", label: "Escalations", icon: AlertCircle },
    { id: "sla-compliance", label: "SLAs & Compliance", icon: Shield },
    { id: "performance", label: "Performance", icon: BarChart3 },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "support-activity", label: "Support Activity", icon: Activity },
    { id: "sales-activity", label: "Sales Activity", icon: TrendingUp },
    { id: "ai-insights", label: "AI Insights", icon: Bot },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-card/50 border-r border-border/50 flex flex-col h-full">
      {/* Back Button */}
      <div className="p-2 border-b border-border/50">
        <motion.button
          onClick={handleBack}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Boss</span>
        </motion.button>
      </div>

      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Headset className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">Sales & Support</h1>
            <p className="text-xs text-muted-foreground">Executive Portal</p>
          </div>
        </div>
        <div className="mt-3 p-2 rounded-lg bg-muted/50 border border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-foreground font-medium">Online</span>
            </div>
            <span className="text-xs text-muted-foreground">12 leads waiting</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="sales-support-active"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Today's Target</span>
          <span className="text-primary">8/15 Conversions</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "53%" }}
            className="h-full bg-primary"
          />
        </div>
      </div>
    </aside>
  );
};

export default SalesSupportSidebar;
