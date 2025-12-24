import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  DollarSign,
  Heart,
  Lightbulb,
  Wallet,
  Bell,
  BarChart3,
  User,
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
import { NavLink } from "@/components/NavLink";
import softwareValaLogo from '@/assets/software-vala-logo.png';
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
}

const FinanceSidebar = ({ activeView, onViewChange }: FinanceSidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
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
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <img 
          src={softwareValaLogo} 
          alt="Software Vala" 
          className="h-10 w-auto object-contain mb-1"
        />
        <p className="text-xs text-slate-500 mt-1">Finance Manager</p>
      </div>

      {/* User Info & Role Badge */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{userName}</span>
            <Badge className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white text-[10px] px-2 py-0.5">
              FINANCE MANAGER
            </Badge>
          </div>
          <span className="text-xs text-slate-500 font-mono">{maskedId}</span>
        </div>
      </div>

      {/* Finance Modules Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Finance Modules
        </p>
        {financeViews.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
              activeView === view.id
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/25"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <view.icon className="w-4 h-4" />
            {view.label}
          </button>
        ))}
      </nav>

      {/* Gateway Status */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Payment Gateways</p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Razorpay</span>
              <span className="flex items-center gap-1 text-cyan-600">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                Active
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Stripe</span>
              <span className="flex items-center gap-1 text-cyan-600">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                Active
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">PayPal</span>
              <span className="flex items-center gap-1 text-cyan-600">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
            onClick={() => navigate('/change-password')}
          >
            <Lock className="w-4 h-4 mr-1" />
            Password
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
            onClick={() => navigate('/settings')}
          >
            <Settings className="w-4 h-4 mr-1" />
            Settings
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
          onClick={() => navigate('/forgot-password')}
        >
          <KeyRound className="w-4 h-4 mr-2" />
          Forgot Password
        </Button>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default FinanceSidebar;
