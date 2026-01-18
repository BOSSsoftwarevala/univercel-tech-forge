import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Map, List, Users, DollarSign,
  Target, Activity, CheckCircle, FileText, History,
  ChevronLeft, ChevronRight, Store, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type FranchiseManagerSection = 
  | "overview"
  | "franchise_map"
  | "franchise_list"
  | "franchise_staff"
  | "sales_revenue"
  | "leads_management"
  | "customer_activity"
  | "approvals"
  | "reports"
  | "activity_log";

interface FranchiseManagerSidebarProps {
  activeSection: FranchiseManagerSection;
  onSectionChange: (section: FranchiseManagerSection) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  franchiseName?: string;
  onBackToCountryHead?: () => void;
}

const sidebarItems: { id: FranchiseManagerSection; label: string; icon: any }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "franchise_map", label: "Franchise Map", icon: Map },
  { id: "franchise_list", label: "Franchise List", icon: List },
  { id: "franchise_staff", label: "Franchise Staff", icon: Users },
  { id: "sales_revenue", label: "Sales & Revenue", icon: DollarSign },
  { id: "leads_management", label: "Leads Management", icon: Target },
  { id: "customer_activity", label: "Customer Activity", icon: Activity },
  { id: "approvals", label: "Approvals", icon: CheckCircle },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "activity_log", label: "Activity Log", icon: History },
];

const FranchiseManagerSidebar = ({
  activeSection,
  onSectionChange,
  collapsed,
  onToggleCollapse,
  franchiseName = "Assigned Franchise(s)",
  onBackToCountryHead
}: FranchiseManagerSidebarProps) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 256 }}
      className="h-full bg-slate-900/95 border-r border-slate-700/50 flex flex-col shrink-0"
    >
      {/* Header */}
      <div className="p-3 border-b border-slate-700/50 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-white truncate">Franchise Manager</p>
              <p className="text-[10px] text-slate-400 truncate">{franchiseName}</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto">
            <Store className="w-5 h-5 text-white" />
          </div>
        )}
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8 text-slate-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      {collapsed && (
        <div className="p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="w-full h-8 text-slate-400 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = activeSection === item.id;
          
          const button = (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full justify-start gap-3 h-10",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0",
                isActive ? "text-indigo-400" : "text-slate-400"
              )} />
              {!collapsed && (
                <span className="truncate text-sm">{item.label}</span>
              )}
            </Button>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  {button}
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-800 border-slate-700">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return button;
        })}
      </nav>

      {/* Back Button */}
      {onBackToCountryHead && (
        <div className="p-3 border-t border-slate-700/50">
          {collapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBackToCountryHead}
                  className="w-full h-10 text-slate-400 hover:text-white hover:bg-slate-800/50"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-slate-800 border-slate-700">
                <p>Back to Country Head</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              onClick={onBackToCountryHead}
              className="w-full justify-start gap-3 h-10 text-slate-400 hover:text-white hover:bg-slate-800/50"
            >
              <ArrowLeft className="w-5 h-5 flex-shrink-0" />
              <span className="truncate text-sm">Back to Country Head</span>
            </Button>
          )}
        </div>
      )}

      {/* Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-700/50">
          <p className="text-[10px] text-slate-500 text-center">
            Franchise Scope Only
          </p>
        </div>
      )}
    </motion.aside>
  );
};

export default FranchiseManagerSidebar;
