import { useState } from "react";
import FinanceSidebar from "@/components/finance/FinanceSidebar";
import RevenueDashboard from "@/components/finance/RevenueDashboard";
import PayoutManager from "@/components/finance/PayoutManager";
import WalletSystem from "@/components/finance/WalletSystem";
import CommissionLedger from "@/components/finance/CommissionLedger";
import InvoiceCenter from "@/components/finance/InvoiceCenter";
import TransactionHeatmap from "@/components/finance/TransactionHeatmap";
import FraudScanner from "@/components/finance/FraudScanner";
import AuditLogs from "@/components/finance/AuditLogs";
import FinanceNotifications from "@/components/finance/FinanceNotifications";

type FinanceView = 
  | "revenue" 
  | "payouts" 
  | "wallets" 
  | "commissions" 
  | "invoices" 
  | "heatmap" 
  | "fraud" 
  | "audit";

const FinanceManager = () => {
  const [activeView, setActiveView] = useState<FinanceView>("revenue");
  const [showNotifications, setShowNotifications] = useState(false);

  const renderContent = () => {
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
        return <RevenueDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <FinanceSidebar activeView={activeView} onViewChange={setActiveView} />
      
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
