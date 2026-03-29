import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Map, MapPin, Users, Building2, Store,
  Target, BarChart3, AlertTriangle, FileText, Settings,
  ChevronLeft, ChevronRight, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type CountryHeadSection = 
  | "dashboard"
  | "country-map"
  | "regions"
  | "area-managers"
  | "country-users"
  | "franchises"
  | "resellers"
  | "influencers"
  | "analytics"
  | "escalations"
  | "reports"
  | "settings";

interface CountryHeadSidebarProps {
  activeSection: CountryHeadSection;
  onSectionChange: (section: CountryHeadSection) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  countryName: string;
  countryFlag: string;
  themeGradient?: string;
}

const sidebarItems: { id: CountryHeadSection; label: string; icon: any }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "country-map", label: "Country Map (Live)", icon: Map },
  { id: "regions", label: "Regions & Areas", icon: MapPin },
  { id: "area-managers", label: "Area Managers", icon: Users },
  { id: "country-users", label: "Country Users", icon: Globe },
  { id: "franchises", label: "Franchise (Country)", icon: Building2 },
  { id: "resellers", label: "Reseller (Country)", icon: Store },
  { id: "influencers", label: "Influencers / Partners", icon: Target },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "escalations", label: "Escalations", icon: AlertTriangle },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "settings", label: "Settings (Country)", icon: Settings },
];

const CountryHeadSidebar = ({
  activeSection,
  onSectionChange,
  collapsed,
  onToggleCollapse,
  countryName,
  countryFlag,
  themeGradient = "from-orange-500 to-amber-600"
}: CountryHeadSidebarProps) => {
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
            <div className={cn(
              "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-2xl",
              themeGradient
            )}>
              {countryFlag}
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-white truncate">{countryName}</p>
              <p className="text-[10px] text-slate-400">Country Head</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className={cn(
            "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-2xl mx-auto",
            themeGradient
          )}>
            {countryFlag}
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
                  ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0",
                isActive ? "text-cyan-400" : "text-slate-400"
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

export default CountryHeadSidebar;
