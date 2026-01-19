import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Map, Users, Building2, Store, Target,
  Clock, AlertTriangle, DollarSign, Shield, FileText, Settings,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type ContinentSidebarSection = 
  | "dashboard"
  | "live_map"
  | "countries"
  | "franchises"
  | "resellers"
  | "leads"
  | "revenue"
  | "approvals"
  | "issues"
  | "reports"
  | "compliance"
  | "settings";

interface ContinentSidebarProps {
  activeSection: ContinentSidebarSection;
  onSectionChange: (section: ContinentSidebarSection) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  continentName: string;
  continentIcon: string;
  themeGradient?: string;
}

const sidebarItems: { id: ContinentSidebarSection; label: string; icon: any }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "live_map", label: "Live Continent Map", icon: Map },
  { id: "countries", label: "Countries Management", icon: Users },
  { id: "franchises", label: "Franchise Management", icon: Building2 },
  { id: "resellers", label: "Reseller Management", icon: Store },
  { id: "leads", label: "Lead Oversight", icon: Target },
  { id: "revenue", label: "Revenue & Wallet", icon: DollarSign },
  { id: "approvals", label: "Approvals Center", icon: Clock },
  { id: "issues", label: "Issues & Alerts", icon: AlertTriangle },
  { id: "reports", label: "Reports & Analytics", icon: FileText },
  { id: "compliance", label: "Compliance / Legal", icon: Shield },
  { id: "settings", label: "Settings", icon: Settings },
];

const ContinentSidebar = ({
  activeSection,
  onSectionChange,
  collapsed,
  onToggleCollapse,
  continentName,
  continentIcon,
  themeGradient = "from-red-500 to-orange-600"
}: ContinentSidebarProps) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 256 }}
      className="h-full bg-slate-900/95 border-r border-slate-700/50 flex flex-col"
    >
      {/* Header */}
      <div className="p-3 border-b border-slate-700/50 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-xl", themeGradient)}>
              {continentIcon}
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-white truncate">{continentName}</p>
              <p className="text-[10px] text-slate-400">Super Admin</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8 text-slate-400 hover:text-white"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

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
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0",
                isActive ? "text-red-400" : "text-slate-400"
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

      {/* Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-700/50">
          <p className="text-[10px] text-slate-500 text-center">
            {continentName} Scope Only
          </p>
        </div>
      )}
    </motion.aside>
  );
};

export default ContinentSidebar;
