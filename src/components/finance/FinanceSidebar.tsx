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
  Grid3X3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";
import softwareValaLogo from '@/assets/software-vala-logo.png';

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
  const mainNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Lead Manager", href: "/lead-manager" },
    { icon: CheckSquare, label: "Task Manager", href: "/task-manager" },
    { icon: DollarSign, label: "Finance Manager", href: "/finance", active: true },
    { icon: Heart, label: "Client Success", href: "/client-success" },
    { icon: Lightbulb, label: "R&D", href: "/rnd-dashboard" },
    { icon: Wallet, label: "Wallet", href: "#" },
    { icon: Bell, label: "Notifications", href: "#" },
    { icon: BarChart3, label: "Performance", href: "/performance" },
    { icon: User, label: "Profile", href: "#" },
  ];

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

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          {mainNavItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                item.active
                  ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
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
        </div>
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
    </aside>
  );
};

export default FinanceSidebar;
