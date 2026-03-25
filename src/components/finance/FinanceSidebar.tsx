/**
 * FINANCE SIDEBAR - QUICKBOOKS CLONE
 * Restructured: Dashboard, Financial Management, Accounting, Transactions, Reports
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
  Lock,
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
  CircleDollarSign,
  BookOpen,
  ArrowRightLeft,
  ClipboardList,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebarStore } from "@/stores/sidebarStore";
import { ScrollArea } from "@/components/ui/scroll-area";

// Finance View types - restructured
export type FinanceView =
  // Dashboard
  | "dash_financial_overview"
  | "dash_revenue_summary"
  | "dash_expense_summary"
  | "dash_profit_loss"
  | "dash_recent_transactions"
  | "dash_pending_payments"
  | "dash_alerts"
  // Financial Management
  | "fm_manage_revenue"
  | "fm_manage_expenses"
  | "fm_manage_invoices"
  | "fm_manage_payments"
  | "fm_manage_refunds"
  | "fm_manage_payouts"
  // Accounting
  | "acc_balance_sheet"
  | "acc_profit_loss_statement"
  | "acc_cash_flow"
  | "acc_tax_reports"
  // Transactions
  | "txn_transaction_list"
  | "txn_transaction_history"
  | "txn_payment_records"
  | "txn_invoice_records"
  // Reports
  | "rpt_revenue_reports"
  | "rpt_sales_reports"
  | "rpt_financial_reports"
  | "rpt_tax_reports"
  // Legacy
  | "overview_total_balance" | "overview_today_inflow" | "overview_today_outflow" | "overview_net_profit" | "overview_pending"
  | "wallet_master" | "wallet_franchise" | "wallet_reseller" | "wallet_user" | "wallet_topup" | "wallet_deduction" | "wallet_low_balance"
  | "payment_incoming" | "payment_outgoing" | "payment_failed" | "payment_pending" | "payment_partial"
  | "gateway_upi" | "gateway_bank" | "gateway_payu" | "gateway_stripe" | "gateway_paypal" | "gateway_crypto"
  | "invoice_generate" | "invoice_auto" | "invoice_franchise" | "invoice_reseller" | "invoice_tax" | "invoice_credit_note" | "invoice_debit_note"
  | "plan_active" | "plan_expired" | "plan_renewal" | "plan_upgrade" | "plan_downgrade"
  | "commission_franchise" | "commission_reseller" | "commission_influencer" | "commission_rules" | "commission_auto_deduct"
  | "cost_server" | "cost_ai_api" | "cost_marketing" | "cost_support" | "cost_manual_entry"
  | "ai_usage_cost" | "api_usage_cost" | "ai_spike_alert" | "ai_stop_resume" | "ai_budget_limit"
  | "refund_requests" | "refund_approved" | "refund_rejected" | "refund_wallet_adjust"
  | "tax_gst_vat" | "tax_tds" | "tax_country_wise" | "tax_audit_reports"
  | "report_daily" | "report_monthly" | "report_yearly" | "report_export"
  | "alert_high_amount" | "alert_manual_override" | "alert_risky_transaction"
  | "log_transactions" | "log_activity" | "log_masked_view" | "log_fraud_detection"
  | "revenue" | "payouts" | "wallets" | "commissions" | "invoices" | "heatmap" | "fraud" | "audit";

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
    badge?: string;
  }[];
}

const financeSections: SidebarSection[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    items: [
      { id: "dash_financial_overview", label: "Financial Overview", icon: CircleDollarSign },
      { id: "dash_revenue_summary", label: "Revenue Summary", icon: TrendingUp },
      { id: "dash_expense_summary", label: "Expense Summary", icon: TrendingDown },
      { id: "dash_profit_loss", label: "Profit & Loss", icon: BarChart3 },
      { id: "dash_recent_transactions", label: "Recent Transactions", icon: ArrowRightLeft },
      { id: "dash_pending_payments", label: "Pending Payments", icon: Clock, badge: "3" },
      { id: "dash_alerts", label: "Alerts", icon: Bell, badge: "5" },
    ]
  },
  {
    id: "financial_mgmt",
    label: "Financial Management",
    icon: Wallet,
    items: [
      { id: "fm_manage_revenue", label: "Manage Revenue", icon: TrendingUp },
      { id: "fm_manage_expenses", label: "Manage Expenses", icon: Receipt },
      { id: "fm_manage_invoices", label: "Manage Invoices", icon: FileText },
      { id: "fm_manage_payments", label: "Manage Payments", icon: CreditCard },
      { id: "fm_manage_refunds", label: "Manage Refunds", icon: RotateCcw },
      { id: "fm_manage_payouts", label: "Manage Payouts", icon: Banknote },
    ]
  },
  {
    id: "accounting",
    label: "Accounting",
    icon: BookOpen,
    items: [
      { id: "acc_balance_sheet", label: "Balance Sheet", icon: Scale },
      { id: "acc_profit_loss_statement", label: "Profit & Loss Statement", icon: BarChart3 },
      { id: "acc_cash_flow", label: "Cash Flow", icon: ArrowRightLeft },
      { id: "acc_tax_reports", label: "Tax Reports", icon: FileCheck },
    ]
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: ArrowRightLeft,
    items: [
      { id: "txn_transaction_list", label: "Transaction List", icon: ClipboardList },
      { id: "txn_transaction_history", label: "Transaction History", icon: Clock },
      { id: "txn_payment_records", label: "Payment Records", icon: CreditCard },
      { id: "txn_invoice_records", label: "Invoice Records", icon: FileText },
    ]
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    items: [
      { id: "rpt_revenue_reports", label: "Revenue Reports", icon: TrendingUp },
      { id: "rpt_sales_reports", label: "Sales Reports", icon: PieChart },
      { id: "rpt_financial_reports", label: "Financial Reports", icon: FileSpreadsheet },
      { id: "rpt_tax_reports", label: "Tax Reports", icon: FileCheck },
    ]
  },
];

const FinanceSidebar = ({ activeView, onViewChange, onBack }: FinanceSidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["dashboard"]);
  
  const { exitToGlobal, enterCategory } = useSidebarStore();
  
  React.useEffect(() => {
    enterCategory('finance-manager');
    return () => {};
  }, [enterCategory]);
  
  React.useEffect(() => {
    const section = financeSections.find(s => 
      s.items.some(item => item.id === activeView)
    );
    if (section && !expandedSections.includes(section.id)) {
      setExpandedSections(prev => [...prev, section.id]);
    }
  }, [activeView]);
  
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
    <aside className="w-[260px] flex flex-col h-screen sticky top-0 left-0 z-40 bg-white border-r border-[#d4d7dc]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* QuickBooks Logo Header */}
      <div className="px-5 py-4 flex-shrink-0 border-b border-[#d4d7dc]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#2ca01c] flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#0d333f]">Software Vala</p>
            <p className="text-[11px] text-[#6b7280]">Finance Manager</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-3 flex-shrink-0 border-b border-[#e5e7eb]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#2ca01c]/10 flex items-center justify-center text-[12px] font-bold text-[#2ca01c]">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-[#0d333f] truncate">{userName}</p>
            <p className="text-[10px] text-[#6b7280] font-mono">{maskedId}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="py-2 px-2">
          {financeSections.map((section) => {
            const isExpanded = expandedSections.includes(section.id);
            const hasActiveItem = section.items.some(item => item.id === activeView);
            const SectionIcon = section.icon;
            
            return (
              <div key={section.id} className="mb-0.5">
                <button
                  onClick={() => toggleSection(section.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-md text-[12px] font-semibold transition-all",
                    hasActiveItem 
                      ? "bg-[#e8f5e3] text-[#2ca01c]" 
                      : "text-[#393a3d] hover:bg-[#f3f4f6]"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <SectionIcon className={cn("w-[16px] h-[16px]", hasActiveItem ? "text-[#2ca01c]" : "text-[#6b7280]")} />
                    <span>{section.label}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af]" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-[#9ca3af]" />
                  )}
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-5 pl-3 border-l-2 border-[#e5e7eb] space-y-0.5 py-1">
                        {section.items.map((item) => {
                          const isActive = activeView === item.id;
                          const ItemIcon = item.icon;
                          
                          return (
                            <button
                              key={item.id}
                              onClick={() => onViewChange(item.id)}
                              className={cn(
                                "w-full flex items-center gap-2 px-2.5 py-[7px] rounded-md text-[11px] transition-all",
                                isActive 
                                  ? "bg-[#2ca01c] text-white font-medium" 
                                  : "text-[#4b5563] hover:bg-[#f3f4f6] hover:text-[#0d333f]"
                              )}
                            >
                              <ItemIcon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-white" : "text-[#2ca01c]")} />
                              <span className="truncate flex-1 text-left">{item.label}</span>
                              {item.badge && (
                                <span className={cn(
                                  "text-[9px] px-1.5 py-0.5 rounded-full font-bold",
                                  isActive ? "bg-white/20 text-white" : "bg-[#ef4444] text-white"
                                )}>
                                  {item.badge}
                                </span>
                              )}
                            </button>
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

      {/* Bottom - Settings & Connections */}
      <div className="flex-shrink-0 border-t border-[#e5e7eb] p-3 space-y-1">
        <div className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider px-2 mb-1">System Connections</div>
        {[
          { label: "Marketplace", icon: Globe },
          { label: "Sales Manager", icon: TrendingUp },
          { label: "Analytics", icon: BarChart3 },
        ].map(conn => (
          <div key={conn.label} className="flex items-center gap-2 px-2 py-1.5 text-[11px] text-[#6b7280]">
            <conn.icon className="w-3.5 h-3.5 text-[#2ca01c]" />
            <span>{conn.label}</span>
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2ca01c]" />
          </div>
        ))}
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-2 py-1.5 mt-2 rounded text-[11px] text-[#ef4444] hover:bg-[#fef2f2] transition-colors"
        >
          <Lock className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default FinanceSidebar;
