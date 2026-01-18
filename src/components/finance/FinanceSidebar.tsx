/**
 * FINANCE SIDEBAR
 * SINGLE-CONTEXT ENFORCEMENT: Uses sidebar store for strict isolation
 */

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
import { useSidebarStore, useShouldRenderSidebar } from "@/stores/sidebarStore";

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
  const { exitToGlobal } = useSidebarStore();
  
  // Use dedicated hook for strict visibility check
  const shouldRender = useShouldRenderSidebar('category', 'finance-manager');
  
  // Handle back navigation - triggers FULL context switch to Boss
  const handleBack = () => {
    exitToGlobal();
    onBack?.();
  };
  
  // STRICT ISOLATION: Only render when in Module context with matching category
  if (!shouldRender) {
    return null;
  }
  
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
    <aside className="w-64 bg-card/50 border-r border-border/50 flex flex-col">
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
      
      {/* Logo */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-sm font-semibold text-foreground">Finance Manager</h2>
            <p className="text-xs text-muted-foreground">Financial Operations</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border/50">
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground truncate">{userName}</span>
            <Badge variant="outline" className="text-[10px]">
              FINANCE
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground font-mono">{maskedId}</span>
        </div>
      </div>

      {/* Finance Modules Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
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
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                isActive
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <view.icon className="w-4 h-4" />
              <span>{view.label}</span>
              {isActive && (
                <motion.div
                  layoutId="finance-active"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Gateway Status */}
      <div className="p-4 border-t border-border/50">
        <div className="bg-muted/30 rounded-lg p-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Payment Gateways</p>
          <div className="space-y-1.5">
            {['Razorpay', 'Stripe', 'PayPal'].map((gateway) => (
              <div key={gateway} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{gateway}</span>
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
