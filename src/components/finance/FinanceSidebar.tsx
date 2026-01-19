/**
 * FINANCE SIDEBAR - EXPANDED
 * Master Financial Control with 14 sections
 * STRICT: No color/font/layout changes - only sidebar expansion
 */

import React, { useState } from 'react';
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
  KeyRound,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Building2,
  Users,
  Banknote,
  Globe,
  Smartphone,
  Bitcoin,
  FileSpreadsheet,
  RefreshCw,
  RotateCcw,
  Scale,
  BarChart3,
  Calendar,
  Download,
  Bell,
  CheckCircle,
  XCircle,
  Activity,
  Eye,
  Server,
  Cpu,
  Megaphone,
  HeadphonesIcon,
  PenTool,
  Zap,
  StopCircle,
  Target,
  ArrowUpDown,
  Percent,
  BadgeDollarSign,
  FileCheck,
  FileMinus,
  FilePlus,
  UploadCloud,
  DownloadCloud,
  Landmark,
  CircleDollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import softwareValaLogo from '@/assets/software-vala-logo.png';
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebarStore } from "@/stores/sidebarStore";
import { ScrollArea } from "@/components/ui/scroll-area";

// Extended Finance View types for all 14 sections
export type FinanceView = 
  // 1. Finance Overview
  | "overview_total_balance"
  | "overview_today_inflow"
  | "overview_today_outflow"
  | "overview_net_profit"
  | "overview_pending"
  // 2. Wallet Management
  | "wallet_master"
  | "wallet_franchise"
  | "wallet_reseller"
  | "wallet_user"
  | "wallet_topup"
  | "wallet_deduction"
  | "wallet_low_balance"
  // 3. Payment Management
  | "payment_incoming"
  | "payment_outgoing"
  | "payment_failed"
  | "payment_pending"
  | "payment_partial"
  // 4. Payment Gateways
  | "gateway_upi"
  | "gateway_bank"
  | "gateway_payu"
  | "gateway_stripe"
  | "gateway_paypal"
  | "gateway_crypto"
  // 5. Invoice Management
  | "invoice_generate"
  | "invoice_auto"
  | "invoice_franchise"
  | "invoice_reseller"
  | "invoice_tax"
  | "invoice_credit_note"
  | "invoice_debit_note"
  // 6. Subscription & Plans
  | "plan_active"
  | "plan_expired"
  | "plan_renewal"
  | "plan_upgrade"
  | "plan_downgrade"
  // 7. Commission Management
  | "commission_franchise"
  | "commission_reseller"
  | "commission_influencer"
  | "commission_rules"
  | "commission_auto_deduct"
  // 8. Cost & Expense
  | "cost_server"
  | "cost_ai_api"
  | "cost_marketing"
  | "cost_support"
  | "cost_manual_entry"
  // 9. AI/API Billing
  | "ai_usage_cost"
  | "api_usage_cost"
  | "ai_spike_alert"
  | "ai_stop_resume"
  | "ai_budget_limit"
  // 10. Refund & Adjustment
  | "refund_requests"
  | "refund_approved"
  | "refund_rejected"
  | "refund_wallet_adjust"
  // 11. Compliance & Tax
  | "tax_gst_vat"
  | "tax_tds"
  | "tax_country_wise"
  | "tax_audit_reports"
  // 12. Reports & Analytics
  | "report_daily"
  | "report_monthly"
  | "report_yearly"
  | "report_export"
  // 13. Alerts & Approval
  | "alert_high_amount"
  | "alert_manual_override"
  | "alert_risky_transaction"
  // 14. Logs & Security
  | "log_transactions"
  | "log_activity"
  | "log_masked_view"
  | "log_fraud_detection"
  // Legacy compatibility
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

interface SidebarSection {
  id: string;
  label: string;
  icon: React.ElementType;
  items: {
    id: FinanceView;
    label: string;
    icon: React.ElementType;
  }[];
}

const financeSections: SidebarSection[] = [
  {
    id: "overview",
    label: "Finance Overview",
    icon: LayoutDashboard,
    items: [
      { id: "overview_total_balance", label: "Total Balance", icon: CircleDollarSign },
      { id: "overview_today_inflow", label: "Today Inflow", icon: TrendingUp },
      { id: "overview_today_outflow", label: "Today Outflow", icon: TrendingDown },
      { id: "overview_net_profit", label: "Net Profit / Loss", icon: BarChart3 },
      { id: "overview_pending", label: "Pending Amount", icon: Clock },
    ]
  },
  {
    id: "wallet",
    label: "Wallet Management",
    icon: Wallet,
    items: [
      { id: "wallet_master", label: "Master Wallet", icon: Landmark },
      { id: "wallet_franchise", label: "Franchise Wallet", icon: Building2 },
      { id: "wallet_reseller", label: "Reseller Wallet", icon: Users },
      { id: "wallet_user", label: "User Wallet", icon: Users },
      { id: "wallet_topup", label: "Wallet Top-up", icon: UploadCloud },
      { id: "wallet_deduction", label: "Wallet Deduction", icon: DownloadCloud },
      { id: "wallet_low_balance", label: "Low Balance Alert", icon: AlertTriangle },
    ]
  },
  {
    id: "payments",
    label: "Payment Management",
    icon: CreditCard,
    items: [
      { id: "payment_incoming", label: "Incoming Payments", icon: TrendingUp },
      { id: "payment_outgoing", label: "Outgoing Payments", icon: TrendingDown },
      { id: "payment_failed", label: "Failed Payments", icon: XCircle },
      { id: "payment_pending", label: "Pending Payments", icon: Clock },
      { id: "payment_partial", label: "Partial Payments", icon: PieChart },
    ]
  },
  {
    id: "gateways",
    label: "Payment Gateways",
    icon: Globe,
    items: [
      { id: "gateway_upi", label: "UPI", icon: Smartphone },
      { id: "gateway_bank", label: "Bank Transfer", icon: Landmark },
      { id: "gateway_payu", label: "PayU", icon: CreditCard },
      { id: "gateway_stripe", label: "Stripe", icon: CreditCard },
      { id: "gateway_paypal", label: "PayPal", icon: DollarSign },
      { id: "gateway_crypto", label: "Crypto (Binance/USDT)", icon: Bitcoin },
    ]
  },
  {
    id: "invoices",
    label: "Invoice Management",
    icon: FileText,
    items: [
      { id: "invoice_generate", label: "Generate Invoice", icon: FilePlus },
      { id: "invoice_auto", label: "Auto Invoice", icon: RefreshCw },
      { id: "invoice_franchise", label: "Franchise Invoice", icon: Building2 },
      { id: "invoice_reseller", label: "Reseller Invoice", icon: Users },
      { id: "invoice_tax", label: "Tax Invoice", icon: FileCheck },
      { id: "invoice_credit_note", label: "Credit Note", icon: FilePlus },
      { id: "invoice_debit_note", label: "Debit Note", icon: FileMinus },
    ]
  },
  {
    id: "subscriptions",
    label: "Subscription & Plans",
    icon: BadgeDollarSign,
    items: [
      { id: "plan_active", label: "Active Plans", icon: CheckCircle },
      { id: "plan_expired", label: "Expired Plans", icon: XCircle },
      { id: "plan_renewal", label: "Renewal Due", icon: RefreshCw },
      { id: "plan_upgrade", label: "Upgrade Plan", icon: TrendingUp },
      { id: "plan_downgrade", label: "Downgrade Plan", icon: TrendingDown },
    ]
  },
  {
    id: "commissions",
    label: "Commission Management",
    icon: Percent,
    items: [
      { id: "commission_franchise", label: "Franchise Commission", icon: Building2 },
      { id: "commission_reseller", label: "Reseller Commission", icon: Users },
      { id: "commission_influencer", label: "Influencer Payout", icon: Megaphone },
      { id: "commission_rules", label: "Commission Rules", icon: Settings },
      { id: "commission_auto_deduct", label: "Auto Deduction", icon: Zap },
    ]
  },
  {
    id: "costs",
    label: "Cost & Expense Control",
    icon: Receipt,
    items: [
      { id: "cost_server", label: "Server Cost", icon: Server },
      { id: "cost_ai_api", label: "AI / API Cost", icon: Cpu },
      { id: "cost_marketing", label: "Marketing Cost", icon: Megaphone },
      { id: "cost_support", label: "Support Cost", icon: HeadphonesIcon },
      { id: "cost_manual_entry", label: "Manual Expense Entry", icon: PenTool },
    ]
  },
  {
    id: "ai_billing",
    label: "AI / API Billing",
    icon: Cpu,
    items: [
      { id: "ai_usage_cost", label: "AI Usage Cost", icon: BarChart3 },
      { id: "api_usage_cost", label: "API Usage Cost", icon: Activity },
      { id: "ai_spike_alert", label: "Cost Spike Alert", icon: AlertTriangle },
      { id: "ai_stop_resume", label: "Stop / Resume AI", icon: StopCircle },
      { id: "ai_budget_limit", label: "Budget Limit", icon: Target },
    ]
  },
  {
    id: "refunds",
    label: "Refund & Adjustment",
    icon: RotateCcw,
    items: [
      { id: "refund_requests", label: "Refund Requests", icon: Clock },
      { id: "refund_approved", label: "Approved Refund", icon: CheckCircle },
      { id: "refund_rejected", label: "Rejected Refund", icon: XCircle },
      { id: "refund_wallet_adjust", label: "Wallet Adjustment", icon: ArrowUpDown },
    ]
  },
  {
    id: "compliance",
    label: "Compliance & Tax",
    icon: Scale,
    items: [
      { id: "tax_gst_vat", label: "GST / VAT", icon: FileCheck },
      { id: "tax_tds", label: "TDS / Withholding", icon: FileMinus },
      { id: "tax_country_wise", label: "Country-wise Tax", icon: Globe },
      { id: "tax_audit_reports", label: "Audit Ready Reports", icon: FileSpreadsheet },
    ]
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    icon: BarChart3,
    items: [
      { id: "report_daily", label: "Daily Finance Report", icon: Calendar },
      { id: "report_monthly", label: "Monthly Report", icon: Calendar },
      { id: "report_yearly", label: "Yearly Report", icon: Calendar },
      { id: "report_export", label: "Export PDF / Excel", icon: Download },
    ]
  },
  {
    id: "alerts",
    label: "Alerts & Approval",
    icon: Bell,
    items: [
      { id: "alert_high_amount", label: "High Amount Approval", icon: AlertTriangle },
      { id: "alert_manual_override", label: "Manual Override Request", icon: Settings },
      { id: "alert_risky_transaction", label: "Risky Transaction Alert", icon: Shield },
    ]
  },
  {
    id: "logs",
    label: "Logs & Security",
    icon: Lock,
    items: [
      { id: "log_transactions", label: "Transaction Logs", icon: FileText },
      { id: "log_activity", label: "Finance Activity Log", icon: Activity },
      { id: "log_masked_view", label: "Masked Data View", icon: Eye },
      { id: "log_fraud_detection", label: "Fraud Detection", icon: Shield },
    ]
  },
];

const FinanceSidebar = ({ activeView, onViewChange, onBack }: FinanceSidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["overview"]);
  
  // SINGLE-CONTEXT ENFORCEMENT: Use store for clean context transitions
  const { exitToGlobal, enterCategory } = useSidebarStore();
  
  // ALWAYS VISIBLE: When this component mounts, enter this category context
  React.useEffect(() => {
    enterCategory('finance-manager');
    return () => {
      // Cleanup handled by exitToGlobal on back button
    };
  }, [enterCategory]);
  
  // Auto-expand section containing active view
  React.useEffect(() => {
    const section = financeSections.find(s => 
      s.items.some(item => item.id === activeView)
    );
    if (section && !expandedSections.includes(section.id)) {
      setExpandedSections(prev => [...prev, section.id]);
    }
  }, [activeView]);
  
  // Handle back navigation - triggers FULL context switch to Boss
  const handleBack = () => {
    exitToGlobal();
    onBack?.();
  };
  
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };
  
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Finance Manager';
  const maskedId = user?.id ? `FIN-${user.id.substring(0, 4).toUpperCase()}` : 'FIN-0000';
  
  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <aside className="w-72 flex flex-col h-screen sticky top-0 left-0 z-40" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0d1b2a 100%)', borderRight: '1px solid #1e3a5f' }}>
      {/* Back Button */}
      <div className="p-2 flex-shrink-0" style={{ borderBottom: '1px solid #1e3a5f' }}>
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
      <div className="p-4 flex-shrink-0" style={{ borderBottom: '1px solid #1e3a5f' }}>
        <div className="flex items-center gap-3">
          <DollarSign className="w-5 h-5" style={{ color: '#60a5fa' }} />
          <div>
            <h2 className="text-sm font-semibold" style={{ color: '#ffffff' }}>Finance Manager</h2>
            <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Master Financial Control</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-3 flex-shrink-0" style={{ borderBottom: '1px solid #1e3a5f' }}>
        <div className="rounded-lg p-2" style={{ background: 'rgba(30, 58, 95, 0.3)' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium truncate" style={{ color: '#ffffff' }}>{userName}</span>
            <Badge variant="outline" className="text-[9px] px-1.5" style={{ borderColor: '#1e3a5f', color: 'rgba(255, 255, 255, 0.7)' }}>
              FINANCE
            </Badge>
          </div>
          <span className="text-[10px] font-mono" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{maskedId}</span>
        </div>
      </div>

      {/* Finance Modules Navigation - Scrollable */}
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-0.5">
          {financeSections.map((section) => {
            const isExpanded = expandedSections.includes(section.id);
            const hasActiveItem = section.items.some(item => item.id === activeView);
            const SectionIcon = section.icon;
            
            return (
              <div key={section.id} className="mb-0.5">
                {/* Section Header */}
                <motion.button
                  onClick={() => toggleSection(section.id)}
                  whileHover={{ x: 1 }}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: hasActiveItem ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                    color: hasActiveItem ? '#60a5fa' : 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <SectionIcon className="w-4 h-4" style={{ color: hasActiveItem ? '#60a5fa' : 'rgba(255, 255, 255, 0.6)' }} />
                    <span>{section.label}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5" style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                  )}
                </motion.button>
                
                {/* Section Items */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 pl-2 border-l border-slate-700/50 space-y-0.5 py-1">
                        {section.items.map((item) => {
                          const isActive = activeView === item.id;
                          const ItemIcon = item.icon;
                          
                          return (
                            <motion.button
                              key={item.id}
                              onClick={() => onViewChange(item.id)}
                              whileHover={{ x: 2 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] transition-all"
                              style={{
                                background: isActive ? '#2563eb' : 'transparent',
                                color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                              }}
                            >
                              <ItemIcon className="w-3.5 h-3.5" style={{ color: isActive ? '#ffffff' : '#60a5fa' }} />
                              <span className="truncate">{item.label}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Gateway Status */}
      <div className="p-3 flex-shrink-0" style={{ borderTop: '1px solid #1e3a5f' }}>
        <div className="rounded-lg p-2" style={{ background: 'rgba(30, 58, 95, 0.3)' }}>
          <p className="text-[10px] font-medium mb-1.5" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Payment Gateways</p>
          <div className="grid grid-cols-2 gap-1">
            {['UPI', 'Stripe', 'PayPal', 'Bank'].map((gateway) => (
              <div key={gateway} className="flex items-center gap-1 text-[9px]">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{gateway}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FinanceSidebar;
