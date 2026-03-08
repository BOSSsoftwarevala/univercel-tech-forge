import { useState } from "react";
import FinanceSidebar, { FinanceView } from "@/components/finance/FinanceSidebar";
import FinanceNotifications from "@/components/finance/FinanceNotifications";
import FinanceSecurityBanner from "@/components/finance/FinanceSecurityBanner";

// New section components
import FinanceDashboard from "@/components/finance/sections/FinanceDashboard";
import FinancialManagement from "@/components/finance/sections/FinancialManagement";
import AccountingSection from "@/components/finance/sections/AccountingSection";
import TransactionsSection from "@/components/finance/sections/TransactionsSection";
import ReportsSection from "@/components/finance/sections/ReportsSection";

// Legacy section components
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
  const [activeView, setActiveView] = useState<FinanceView>("dash_financial_overview");
  const [showNotifications, setShowNotifications] = useState(false);

  const renderContent = () => {
    // New primary sections
    if (activeView.startsWith("dash_")) return <FinanceDashboard activeView={activeView} />;
    if (activeView.startsWith("fm_")) return <FinancialManagement activeView={activeView} />;
    if (activeView.startsWith("acc_")) return <AccountingSection activeView={activeView} />;
    if (activeView.startsWith("txn_")) return <TransactionsSection activeView={activeView} />;
    if (activeView.startsWith("rpt_")) return <ReportsSection activeView={activeView} />;

    // Legacy sections (backward compatibility)
    if (activeView.startsWith("overview_")) return <FinanceOverview activeView={activeView} />;
    if (activeView.startsWith("wallet_")) return <WalletManagement activeView={activeView} />;
    if (activeView.startsWith("payment_")) return <PaymentManagement activeView={activeView} />;
    if (activeView.startsWith("gateway_")) return <PaymentGateways activeView={activeView} />;
    if (activeView.startsWith("invoice_")) return <InvoiceManagement activeView={activeView} />;
    if (activeView.startsWith("plan_")) return <SubscriptionPlans activeView={activeView} />;
    if (activeView.startsWith("commission_")) return <CommissionManagement activeView={activeView} />;
    if (activeView.startsWith("cost_")) return <CostExpenseControl activeView={activeView} />;
    if (activeView.startsWith("ai_") || activeView.startsWith("api_")) return <AIAPIBilling activeView={activeView} />;
    if (activeView.startsWith("refund_")) return <RefundAdjustment activeView={activeView} />;
    if (activeView.startsWith("tax_")) return <ComplianceTax activeView={activeView} />;
    if (activeView.startsWith("report_")) return <ReportsAnalytics activeView={activeView} />;
    if (activeView.startsWith("alert_")) return <AlertsApproval activeView={activeView} />;
    if (activeView.startsWith("log_")) return <LogsSecurity activeView={activeView} />;

    return <FinanceDashboard activeView="dash_financial_overview" />;
  };

  return (
    <div className="h-screen flex w-full overflow-hidden" style={{ background: '#f0f3f5', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <FinanceSidebar activeView={activeView} onViewChange={setActiveView} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Security Policy Banner */}
        <FinanceSecurityBanner />
        {/* QuickBooks top bar */}
        <header className="h-[52px] bg-[#0d333f] flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-[15px] font-semibold text-white">Finance Manager</h1>
            <span className="text-[12px] text-white/30">|</span>
            <span className="text-[13px] text-white/70">
              {activeView.replace(/^(dash_|fm_|acc_|txn_|rpt_)/, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 rounded-full bg-[#2ca01c] text-white text-[12px] font-medium hover:bg-[#249317] transition-colors">
              + New Transaction
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
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
