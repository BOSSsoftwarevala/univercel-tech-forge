/**
 * FINANCE SIDEBAR
 * SINGLE-CONTEXT ENFORCEMENT: Uses sidebar store for strict isolation
 */

import React from 'react';
import {
  LayoutDashboard, 
  DollarSign,
  Wallet,
  CreditCard,
  Receipt,
  PieChart,
  Shield,
  FileText,
  Grid3X3,
  LogOut,
  Settings,
  Lock,
  ArrowLeft,
  KeyRound
} from "lucide-react";
import { cn } from "@/lib/utils";
import softwareValaLogo from '@/assets/software-vala-logo.png';
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useSidebarStore } from "@/stores/sidebarStore";

type FinanceView = 
  | "revenue" 
  | "payouts" 
  | "wallets" 
  | "commissions" 
  | "invoices" 
  | "heatmap" 
  | "fraud" 
  | "audit";

interface FinanceSidebarProps {
  activeView: FinanceView;
  onViewChange: (view: FinanceView) => void;
  onBack?: () => void;
}

const FinanceSidebar = ({ activeView, onViewChange, onBack }: FinanceSidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // SINGLE-CONTEXT ENFORCEMENT: Use store for clean context transitions
  const { exitToGlobal, enterCategory } = useSidebarStore();
  
  // ALWAYS VISIBLE: When this component mounts, enter this category context
  React.useEffect(() => {
    enterCategory('finance-manager');
    return () => {
      // Cleanup handled by exitToGlobal on back button
    };
  }, [enterCategory]);
  
  // Handle back navigation - triggers FULL context switch to Boss
  const handleBack = () => {
    exitToGlobal();
    onBack?.();
  };
  
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Finance Manager';
  const maskedId = user?.id ? `FIN-${user.id.substring(0, 4).toUpperCase()}` : 'FIN-0000';
  
  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const financeViews = [
    { id: "revenue" as const, icon: PieChart, label: "Revenue Dashboard" },
    { id: "payouts" as const, icon: CreditCard, label: "Payout Manager" },
    { id: "wallets" as const, icon: Wallet, label: "Wallet System" },
    { id: "commissions" as const, icon: Receipt, label: "Commission Ledger" },
    { id: "invoices" as const, icon: FileText, label: "Invoice Center" },
    { id: "heatmap" as const, icon: Grid3X3, label: "Transaction Heatmap" },
    { id: "fraud" as const, icon: Shield, label: "Fraud Scanner" },
    { id: "audit" as const, icon: FileText, label: "Audit Logs" },
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
      
      {/* Logo */}
      <div className="p-4" style={{ borderBottom: '1px solid #1e3a5f' }}>
        <div className="flex items-center gap-3">
          <DollarSign className="w-5 h-5" style={{ color: '#60a5fa' }} />
          <div>
            <h2 className="text-sm font-semibold" style={{ color: '#ffffff' }}>Finance Manager</h2>
            <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Financial Operations</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4" style={{ borderBottom: '1px solid #1e3a5f' }}>
        <div className="rounded-lg p-3" style={{ background: 'rgba(30, 58, 95, 0.3)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium truncate" style={{ color: '#ffffff' }}>{userName}</span>
            <Badge variant="outline" className="text-[10px]" style={{ borderColor: '#1e3a5f', color: 'rgba(255, 255, 255, 0.7)' }}>
              FINANCE
            </Badge>
          </div>
          <span className="text-xs font-mono" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{maskedId}</span>
        </div>
      </div>

      {/* Finance Modules Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Finance Modules
        </p>
        {financeViews.map((view) => {
          const isActive = activeView === view.id;
          return (
            <motion.button
              key={view.id}
              onClick={() => onViewChange(view.id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all"
              style={{
                background: isActive ? '#2563eb' : 'transparent',
                color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              }}
            >
              <view.icon className="w-4 h-4" style={{ color: isActive ? '#ffffff' : '#60a5fa' }} />
              <span>{view.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Gateway Status */}
      <div className="p-4" style={{ borderTop: '1px solid #1e3a5f' }}>
        <div className="rounded-lg p-3" style={{ background: 'rgba(30, 58, 95, 0.3)' }}>
          <p className="text-xs font-medium mb-2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Payment Gateways</p>
          <div className="space-y-1.5">
            {['Razorpay', 'Stripe', 'PayPal'].map((gateway) => (
              <div key={gateway} className="flex items-center justify-between text-xs">
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{gateway}</span>
                <span className="flex items-center gap-1 text-emerald-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FinanceSidebar;
