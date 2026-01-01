import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Package, Plus, MonitorPlay, Upload,
  BarChart3, FileText, Settings, ChevronRight, Lock,
  ShieldAlert
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import ProductDashboard from "./ProductDashboard";
import AddProduct from "./AddProduct";
import ProductList from "./ProductList";
import DemoManager from "./DemoManager";
import AddDemo from "./AddDemo";
import BulkAdd from "./BulkAdd";
import ProductAnalytics from "./ProductAnalytics";
import ProductAuditLogs from "./ProductAuditLogs";

type MenuItemType = {
  id: string;
  label: string;
  icon: React.ElementType;
  locked?: boolean;
  readOnly?: boolean;
};

const menuItems: MenuItemType[] = [
  { id: "dashboard", label: "Product Dashboard", icon: LayoutDashboard, readOnly: true },
  { id: "add-product", label: "Add Product", icon: Plus },
  { id: "products", label: "Product List", icon: Package, readOnly: true },
  { id: "demo-manager", label: "Demo Manager", icon: MonitorPlay, readOnly: true },
  { id: "add-demo", label: "Add Demo", icon: Plus },
  { id: "bulk-add", label: "Bulk Add", icon: Upload },
  { id: "analytics", label: "Analytics", icon: BarChart3, readOnly: true },
  { id: "audit-logs", label: "Audit Logs", icon: FileText, readOnly: true },
  { id: "settings", label: "Settings", icon: Settings, locked: true },
];

const ProductDemoManagerLayout = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <ProductDashboard />;
      case "add-product":
        return <AddProduct onSuccess={() => setActiveSection("products")} />;
      case "products":
        return <ProductList />;
      case "demo-manager":
        return <DemoManager />;
      case "add-demo":
        return <AddDemo onSuccess={() => setActiveSection("demo-manager")} />;
      case "bulk-add":
        return <BulkAdd />;
      case "analytics":
        return <ProductAnalytics />;
      case "audit-logs":
        return <ProductAuditLogs />;
      default:
        return <ProductDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-800/50 bg-slate-900/30 backdrop-blur-xl">
        <div className="p-4 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">Product & Demo</h2>
              <p className="text-xs text-slate-400">Manager Panel</p>
            </div>
          </div>
        </div>

        {/* Policy Badge */}
        <div className="p-4">
          <div className="p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-medium text-amber-400">ADD-ONLY MODE</span>
            </div>
            <p className="text-[10px] text-amber-400/70">No Edit • No Delete • Full Audit</p>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <nav className="p-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const isDisabled = item.locked;

              return (
                <button
                  key={item.id}
                  onClick={() => !isDisabled && setActiveSection(item.id)}
                  disabled={isDisabled}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                    isActive
                      ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                      : isDisabled
                      ? "text-slate-600 cursor-not-allowed"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.readOnly && (
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-slate-600 text-slate-500">
                      READ
                    </Badge>
                  )}
                  {item.locked && <Lock className="w-3 h-3 text-slate-600" />}
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </button>
              );
            })}
          </nav>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDemoManagerLayout;
