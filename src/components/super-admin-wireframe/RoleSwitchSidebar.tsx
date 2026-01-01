import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Globe2, MapPin, Server, ChevronLeft, ChevronRight,
  Crown, LayoutDashboard, Users, Shield, Activity,
  Settings, LogOut, AlertCircle, Building2, Headphones, Handshake,
  Target, Star, Scale, ListTodo
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export type ActiveRole = "continent_super_admin" | "area_manager" | "server_manager" | "franchise_manager" | "sales_support_manager" | "reseller_manager" | "lead_manager" | "pro_manager" | "legal_manager" | "task_management";

interface RoleSwitchSidebarProps {
  activeRole: ActiveRole;
  onRoleChange: (role: ActiveRole) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

// Role configurations with themes
const roleConfigs = {
  continent_super_admin: {
    id: "continent_super_admin",
    label: "Continent Super Admin",
    shortLabel: "CSA",
    icon: Globe2,
    themeColor: "from-blue-500 to-emerald-500",
    accentColor: "text-blue-400",
    bgAccent: "bg-blue-500/10",
    borderAccent: "border-blue-500/50",
    description: "Global continent-level management",
  },
  area_manager: {
    id: "area_manager",
    label: "Area Manager",
    shortLabel: "AM",
    icon: MapPin,
    themeColor: "from-cyan-500 to-sky-500",
    accentColor: "text-cyan-400",
    bgAccent: "bg-cyan-500/10",
    borderAccent: "border-cyan-500/50",
    description: "Country/region operations",
  },
  server_manager: {
    id: "server_manager",
    label: "Server Manager",
    shortLabel: "SM",
    icon: Server,
    themeColor: "from-slate-600 to-zinc-700",
    accentColor: "text-emerald-400",
    bgAccent: "bg-emerald-500/10",
    borderAccent: "border-emerald-500/50",
    description: "Infrastructure & technical ops",
  },
  franchise_manager: {
    id: "franchise_manager",
    label: "Franchise Manager",
    shortLabel: "FM",
    icon: Building2,
    themeColor: "from-indigo-500 to-purple-600",
    accentColor: "text-indigo-400",
    bgAccent: "bg-indigo-500/10",
    borderAccent: "border-indigo-500/50",
    description: "Business & operations view",
  },
  sales_support_manager: {
    id: "sales_support_manager",
    label: "Sales & Support Manager",
    shortLabel: "SSM",
    icon: Headphones,
    themeColor: "from-teal-500 to-emerald-600",
    accentColor: "text-teal-400",
    bgAccent: "bg-teal-500/10",
    borderAccent: "border-teal-500/50",
    description: "CRM & ticketing view",
  },
  reseller_manager: {
    id: "reseller_manager",
    label: "Reseller Manager",
    shortLabel: "RM",
    icon: Handshake,
    themeColor: "from-amber-500 to-orange-600",
    accentColor: "text-amber-400",
    bgAccent: "bg-amber-500/10",
    borderAccent: "border-amber-500/50",
    description: "Partner & channel view",
  },
  lead_manager: {
    id: "lead_manager",
    label: "Lead Manager",
    shortLabel: "LM",
    icon: Target,
    themeColor: "from-violet-500 to-purple-600",
    accentColor: "text-violet-400",
    bgAccent: "bg-violet-500/10",
    borderAccent: "border-violet-500/50",
    description: "Sales pipeline & leads view",
  },
  pro_manager: {
    id: "pro_manager",
    label: "Pro Manager",
    shortLabel: "PM",
    icon: Crown,
    themeColor: "from-yellow-500 to-amber-600",
    accentColor: "text-yellow-400",
    bgAccent: "bg-yellow-500/10",
    borderAccent: "border-yellow-500/50",
    description: "Prime user management",
  },
  legal_manager: {
    id: "legal_manager",
    label: "Legal Manager",
    shortLabel: "LG",
    icon: Scale,
    themeColor: "from-rose-900 to-slate-800",
    accentColor: "text-rose-400",
    bgAccent: "bg-rose-900/10",
    borderAccent: "border-rose-900/50",
    description: "Legal & compliance view",
  },
  task_management: {
    id: "task_management",
    label: "Task Management",
    shortLabel: "TM",
    icon: ListTodo,
    themeColor: "from-blue-500 to-cyan-600",
    accentColor: "text-blue-400",
    bgAccent: "bg-blue-500/10",
    borderAccent: "border-blue-500/50",
    description: "Global task management",
  },
} as const;

// Navigation items per role
const roleNavItems = {
  continent_super_admin: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "list", label: "All Continent Admins", icon: Users },
    { id: "activity", label: "Live Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  area_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "list", label: "All Area Managers", icon: Users },
    { id: "activity", label: "Area Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  server_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "list", label: "All Server Managers", icon: Users },
    { id: "activity", label: "Tech Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  franchise_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "list", label: "All Franchises", icon: Building2 },
    { id: "activity", label: "Franchise Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  sales_support_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "list", label: "All Managers", icon: Users },
    { id: "activity", label: "Support Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  reseller_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "list", label: "All Resellers", icon: Handshake },
    { id: "activity", label: "Partner Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  lead_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "list", label: "All Lead Managers", icon: Target },
    { id: "activity", label: "Lead Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  pro_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "list", label: "All Pro Managers", icon: Crown },
    { id: "activity", label: "Pro Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  legal_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "list", label: "All Legal Managers", icon: Scale },
    { id: "activity", label: "Legal Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  task_management: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "list", label: "All Tasks", icon: ListTodo },
    { id: "activity", label: "Task Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
};

const RoleSwitchSidebar = ({
  activeRole,
  onRoleChange,
  collapsed,
  onToggleCollapse,
  onLogout,
}: RoleSwitchSidebarProps) => {
  const currentConfig = roleConfigs[activeRole];
  const currentNavItems = roleNavItems[activeRole];
  const [activeNav, setActiveNav] = useState("dashboard");

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex flex-col border-r transition-colors duration-300",
        activeRole === "server_manager" 
          ? "bg-zinc-900 border-zinc-700" 
          : "bg-sidebar border-sidebar-border"
      )}
    >
      {/* Header with Super Admin badge */}
      <div className="p-4 border-b border-sidebar-border/50">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br",
            currentConfig.themeColor
          )}>
            <Crown className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1"
              >
                <h2 className="text-sm font-bold text-foreground">Super Admin</h2>
                <p className="text-xs text-muted-foreground">Control Panel</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Role Switch Section */}
      <div className="p-3 border-b border-sidebar-border/50">
        <AnimatePresence>
          {!collapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2"
            >
              Switch Role View
            </motion.p>
          )}
        </AnimatePresence>
        
        <div className="space-y-1">
          {Object.values(roleConfigs).map((role) => {
            const Icon = role.icon;
            const isActive = activeRole === role.id;

            return (
              <Tooltip key={role.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onRoleChange(role.id as ActiveRole);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      isActive
                        ? cn("border-l-4", role.bgAccent, role.borderAccent, role.accentColor)
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground border-l-4 border-transparent"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                      isActive 
                        ? cn("bg-gradient-to-br", role.themeColor)
                        : "bg-sidebar-accent"
                    )}>
                      <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-muted-foreground")} />
                    </div>
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex-1 text-left"
                        >
                          <span className="text-sm font-medium block">{role.label}</span>
                          <span className="text-xs text-muted-foreground">{role.description}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {isActive && !collapsed && (
                      <Badge variant="outline" className={cn("text-xs", role.accentColor, role.borderAccent)}>
                        Active
                      </Badge>
                    )}
                  </button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" sideOffset={10}>
                    <div>
                      <p className="font-medium">{role.label}</p>
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* Navigation for active role */}
      <ScrollArea className="flex-1 py-4">
        <AnimatePresence>
          {!collapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-5"
            >
              {currentConfig.shortLabel} Navigation
            </motion.p>
          )}
        </AnimatePresence>
        
        <nav className="space-y-1 px-3">
          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <Tooltip key={item.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNav(item.id);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      isActive
                        ? cn(currentConfig.bgAccent, currentConfig.accentColor, "border-l-2", currentConfig.borderAccent)
                        : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && currentConfig.accentColor)} />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-sm font-medium truncate"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" sideOffset={10}>
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border/50 space-y-2">
        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className={cn("w-full", collapsed ? "justify-center" : "justify-start")}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="ml-2">Collapse</span>}
        </Button>

        {/* Logout */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={onLogout}
              className={cn(
                "w-full text-destructive hover:text-destructive hover:bg-destructive/10",
                collapsed ? "justify-center px-0" : "justify-start gap-3"
              )}
            >
              <LogOut className="w-5 h-5" />
              {!collapsed && <span>Logout</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" sideOffset={10}>
              Logout
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </motion.aside>
  );
};

export default RoleSwitchSidebar;
export { roleConfigs };
