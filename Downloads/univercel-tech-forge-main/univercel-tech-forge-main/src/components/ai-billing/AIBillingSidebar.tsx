import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  QrCode, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  Wallet,
  History,
  Settings,
  BarChart3
} from "lucide-react";

interface AIBillingSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AIBillingSidebar = ({ activeTab, onTabChange }: AIBillingSidebarProps) => {
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "statements", label: "Statements", icon: FileText },
    { id: "qr-codes", label: "QR Codes", icon: QrCode },
    { id: "efficiency", label: "Efficiency", icon: TrendingUp },
    { id: "compare", label: "Compare Pricing", icon: BarChart3 },
    { id: "fraud", label: "Fraud Detection", icon: AlertTriangle },
    { id: "wallet", label: "Wallet Log", icon: Wallet },
    { id: "history", label: "Scan History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 border-r border-border bg-card/30 p-4 space-y-2">
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Billing Menu
        </h3>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="mt-8 pt-6 border-t border-border space-y-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Quick Stats
        </h4>
        
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-blue-400">Today's Usage</p>
            <p className="text-lg font-bold text-blue-500">₹42.50</p>
          </div>
          
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-xs text-green-400">Weekly Total</p>
            <p className="text-lg font-bold text-green-500">₹312.80</p>
          </div>
          
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-xs text-amber-400">Pending Bills</p>
            <p className="text-lg font-bold text-amber-500">3</p>
          </div>
        </div>
      </div>

      {/* Access Control Notice */}
      <div className="mt-6 p-3 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-primary" />
          <p className="text-xs font-semibold text-primary">Access Control</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Only Super Admin, Finance Manager, and Auditor can access this module.
        </p>
      </div>
    </div>
  );
};
