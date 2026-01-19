import { useState } from "react";
import FinanceSidebar, { FinanceView } from "@/components/finance/FinanceSidebar";
import RevenueDashboard from "@/components/finance/RevenueDashboard";
import PayoutManager from "@/components/finance/PayoutManager";
import WalletSystem from "@/components/finance/WalletSystem";
import CommissionLedger from "@/components/finance/CommissionLedger";
import InvoiceCenter from "@/components/finance/InvoiceCenter";
import TransactionHeatmap from "@/components/finance/TransactionHeatmap";
import FraudScanner from "@/components/finance/FraudScanner";
import AuditLogs from "@/components/finance/AuditLogs";
import FinanceNotifications from "@/components/finance/FinanceNotifications";

// Import new section components
import FinanceOverview from "@/components/finance/sections/FinanceOverview";
import WalletManagement from "@/components/finance/sections/WalletManagement";
import PaymentManagement from "@/components/finance/sections/PaymentManagement";
import PaymentGateways from "@/components/finance/sections/PaymentGateways";
import InvoiceManagement from "@/components/finance/sections/InvoiceManagement";
import SubscriptionPlans from "@/components/finance/sections/SubscriptionPlans";
import CommissionManagement from "@/components/finance/sections/CommissionManagement";
import CostExpenseControl from "@/components/finance/sections/CostExpenseControl";
import AIAPIBilling from "@/components/finance/sections/AIAPIBilling";
import RefundAdjustment from "@/components/finance/sections/RefundAdjustment";
import ComplianceTax from "@/components/finance/sections/ComplianceTax";
import ReportsAnalytics from "@/components/finance/sections/ReportsAnalytics";
import AlertsApproval from "@/components/finance/sections/AlertsApproval";
import LogsSecurity from "@/components/finance/sections/LogsSecurity";

const FinanceManager = () => {
  const [activeView, setActiveView] = useState<FinanceView>("overview_total_balance");
  const [showNotifications, setShowNotifications] = useState(false);

  const handleViewChange = (view: FinanceView) => {
    setActiveView(view);
  };

  const renderContent = () => {
    // Finance Overview Section
    if (activeView.startsWith("overview_")) {
      return <FinanceOverview activeView={activeView} />;
    }
    
    // Wallet Management Section
    if (activeView.startsWith("wallet_")) {
      return <WalletManagement activeView={activeView} />;
    }
    
    // Payment Management Section
    if (activeView.startsWith("payment_")) {
      return <PaymentManagement activeView={activeView} />;
    }
    
    // Payment Gateways Section
    if (activeView.startsWith("gateway_")) {
      return <PaymentGateways activeView={activeView} />;
    }
    
    // Invoice Management Section
    if (activeView.startsWith("invoice_")) {
      return <InvoiceManagement activeView={activeView} />;
    }
    
    // Subscription & Plans Section
    if (activeView.startsWith("plan_")) {
      return <SubscriptionPlans activeView={activeView} />;
    }
    
    // Commission Management Section
    if (activeView.startsWith("commission_")) {
      return <CommissionManagement activeView={activeView} />;
    }
    
    // Cost & Expense Section
    if (activeView.startsWith("cost_")) {
      return <CostExpenseControl activeView={activeView} />;
    }
    
    // AI/API Billing Section
    if (activeView.startsWith("ai_") || activeView.startsWith("api_")) {
      return <AIAPIBilling activeView={activeView} />;
    }
    
    // Refund & Adjustment Section
    if (activeView.startsWith("refund_")) {
      return <RefundAdjustment activeView={activeView} />;
    }
    
    // Compliance & Tax Section
    if (activeView.startsWith("tax_")) {
      return <ComplianceTax activeView={activeView} />;
    }
    
    // Reports & Analytics Section
    if (activeView.startsWith("report_")) {
      return <ReportsAnalytics activeView={activeView} />;
    }
    
    // Alerts & Approval Section
    if (activeView.startsWith("alert_")) {
      return <AlertsApproval activeView={activeView} />;
    }
    
    // Logs & Security Section
    if (activeView.startsWith("log_")) {
      return <LogsSecurity activeView={activeView} />;
    }

    // Legacy views for backward compatibility
    switch (activeView) {
      case "revenue":
        return <RevenueDashboard />;
      case "payouts":
        return <PayoutManager />;
      case "wallets":
        return <WalletSystem />;
      case "commissions":
        return <CommissionLedger />;
      case "invoices":
        return <InvoiceCenter />;
      case "heatmap":
        return <TransactionHeatmap />;
      case "fraud":
        return <FraudScanner />;
      case "audit":
        return <AuditLogs />;
      default:
        return <FinanceOverview activeView="overview_total_balance" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <FinanceSidebar activeView={activeView} onViewChange={handleViewChange} />
      
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto pt-20">
          {renderContent()}
        </main>
      </div>

      <FinanceNotifications 
        open={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
};

export default FinanceManager;
