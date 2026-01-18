/**
 * SALES SUPPORT SIDEBAR
 * SINGLE-CONTEXT ENFORCEMENT: Uses sidebar store for strict isolation
 */

import React from 'react';
import { motion } from "framer-motion";
import { 
  Headset, LayoutDashboard, Inbox, FileText, MessageCircle, Bot, Ticket,
  Shield, BarChart3, Phone, AlertCircle, Settings, Users, Mail, Activity,
  TrendingUp, UserRound, ArrowLeft
} from "lucide-react";
import { useSidebarStore } from "@/stores/sidebarStore";

interface SalesSupportSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onBack?: () => void;
}

const SalesSupportSidebar = ({ activeSection, setActiveSection, onBack }: SalesSupportSidebarProps) => {
  // SINGLE-CONTEXT ENFORCEMENT: Use store for clean context transitions
  const { exitToGlobal, enterCategory } = useSidebarStore();
  
  // ALWAYS VISIBLE: When this component mounts, enter this category context
  React.useEffect(() => {
    enterCategory('sales-support');
    return () => {
      // Cleanup handled by exitToGlobal on back button
    };
  }, [enterCategory]);
  
  // Handle back navigation - triggers FULL context switch to Boss
  const handleBack = () => {
    exitToGlobal();
    onBack?.();
  };

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
    <aside className="w-64 flex flex-col h-full" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0d1b2a 100%)', borderRight: '1px solid #1e3a5f' }}>
      {/* Back Button */}
      <div className="p-2" style={{ borderBottom: '1px solid #1e3a5f' }}>
        <motion.button
          onClick={handleBack}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
          style={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Control Panel</span>
        </motion.button>
      </div>

      <div className="p-4" style={{ borderBottom: '1px solid #1e3a5f' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(37, 99, 235, 0.2)' }}>
            <Headset className="w-5 h-5" style={{ color: '#60a5fa' }} />
          </div>
          <div>
            <h1 className="text-sm font-bold" style={{ color: '#ffffff' }}>Sales & Support</h1>
            <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Executive Portal</p>
          </div>
        </div>
        <div className="mt-3 p-2 rounded-lg" style={{ background: 'rgba(30, 58, 95, 0.3)', border: '1px solid #1e3a5f' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-medium" style={{ color: '#ffffff' }}>Online</span>
            </div>
            <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>12 leads waiting</span>
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
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all"
              style={{
                background: isActive ? '#2563eb' : 'transparent',
                color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              }}
            >
              <Icon className="w-4 h-4" style={{ color: isActive ? '#ffffff' : '#60a5fa' }} />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      <div className="p-4" style={{ borderTop: '1px solid #1e3a5f' }}>
        <div className="flex items-center justify-between text-xs mb-2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          <span>Today's Target</span>
          <span style={{ color: '#60a5fa' }}>8/15 Conversions</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(30, 58, 95, 0.5)' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "53%" }}
            className="h-full"
            style={{ background: '#2563eb' }}
          />
        </div>
      </div>
    </aside>
  );
};

export default SalesSupportSidebar;
