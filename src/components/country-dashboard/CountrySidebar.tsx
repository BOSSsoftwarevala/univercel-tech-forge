import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Building2, Store, Users, Target, DollarSign,
  Shield, AlertTriangle, FileText, Settings, ChevronLeft, ChevronRight, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type CountrySidebarSection = 
  | "dashboard"
  | "franchises"
  | "resellers"
  | "influencers"
  | "leads"
  | "revenue"
  | "compliance"
  | "alerts"
  | "reports"
  | "settings";

interface CountrySidebarProps {
  activeSection: CountrySidebarSection;
  onSectionChange: (section: CountrySidebarSection) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  countryName: string;
}

const sidebarItems: { id: CountrySidebarSection; label: string; icon: any }[] = [
  { id: "dashboard", label: "Country Dashboard", icon: LayoutDashboard },
  { id: "franchises", label: "Franchise Management", icon: Building2 },
  { id: "resellers", label: "Reseller Management", icon: Store },
  { id: "influencers", label: "Influencer / Partner", icon: Users },
  { id: "leads", label: "Lead Management", icon: Target },
  { id: "revenue", label: "Revenue & Payouts", icon: DollarSign },
  { id: "compliance", label: "Compliance & Legal", icon: Shield },
  { id: "alerts", label: "Alerts & Incidents", icon: AlertTriangle },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

const CountrySidebar = ({
  activeSection,
  onSectionChange,
  collapsed,
  onToggleCollapse,
  countryName
}: CountrySidebarProps) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      className="h-full bg-slate-900/95 border-r border-slate-700/50 flex flex-col"
    >
      {/* Header */}
      <div className="p-3 border-b border-slate-700/50 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-white truncate">{countryName}</p>
              <p className="text-[10px] text-slate-400">Country Scope</p>
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
                  ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0",
                isActive ? "text-orange-400" : "text-slate-400"
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
            Country-Scoped Access Only
          </p>
        </div>
      )}
    </motion.aside>
  );
};

export default CountrySidebar;
