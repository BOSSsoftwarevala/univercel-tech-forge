/**
 * ROLE SWITCH SIDEBAR V2
 * Modern shadcn-based sidebar with collapsible groups
 * Uses semantic design tokens from index.css
 */

import * as React from "react";
import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ChevronLeft,
  LogOut,
  Crown,
  Globe2,
  Flag,
  Server,
  Building2,
  Headphones,
  Handshake,
  Target,
  Scale,
  ListTodo,
  Wallet,
  Terminal,
  Megaphone,
  Shield,
  Box,
  Eye,
  Code2,
  LayoutDashboard,
  Users,
  Activity,
  Settings,
  CheckCircle,
  Lock,
  Archive,
  Zap,
  TrendingUp,
  Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";

// ==============================================
// TYPES
// ==============================================
export type ActiveRole =
  | "boss_owner"
  | "ceo"
  | "continent_super_admin"
  | "country_head"
  | "server_manager"
  | "franchise_manager"
  | "sales_support_manager"
  | "reseller_manager"
  | "lead_manager"
  | "product_manager"
  | "demo_manager"
  | "pro_manager"
  | "legal_manager"
  | "task_management"
  | "finance_manager"
  | "vala_ai_management"
  | "developer_management"
  | "marketing_management"
  | "customer_support_management"
  | "role_manager";

interface SubCategory {
  id: string;
  label: string;
  status?: "active" | "locked" | "coming-soon";
}

interface Category {
  id: string;
  label: string;
  icon: React.ElementType;
  subCategories?: SubCategory[];
}

interface Module {
  id: string;
  label: string;
  icon: React.ElementType;
  categories: Category[];
}

interface RoleConfig {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  description: string;
}

interface RoleSwitchSidebarProps {
  activeRole: ActiveRole;
  onRoleChange: (role: ActiveRole) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
  activeNav?: string;
  onNavChange?: (navId: string) => void;
  onSubItemClick?: (subItemId: string) => void;
}

// ==============================================
// ROLE CONFIGURATIONS
// ==============================================
const roleConfigs: Record<ActiveRole, RoleConfig> = {
  boss_owner: {
    id: "boss_owner",
    label: "Boss / Owner",
    shortLabel: "BOSS",
    icon: Crown,
    description: "Final Authority • System Owner",
  },
  ceo: {
    id: "ceo",
    label: "CEO",
    shortLabel: "CEO",
    icon: Eye,
    description: "Vision & Oversight • Read-only",
  },
  continent_super_admin: {
    id: "continent_super_admin",
    label: "Continent Admin",
    shortLabel: "CA",
    icon: Globe2,
    description: "Continent-level management",
  },
  country_head: {
    id: "country_head",
    label: "Country Head",
    shortLabel: "CH",
    icon: Flag,
    description: "Country & Region Operations",
  },
  server_manager: {
    id: "server_manager",
    label: "Server Manager",
    shortLabel: "SM",
    icon: Server,
    description: "Infrastructure & technical ops",
  },
  franchise_manager: {
    id: "franchise_manager",
    label: "Franchise Manager",
    shortLabel: "FM",
    icon: Building2,
    description: "Business & operations view",
  },
  sales_support_manager: {
    id: "sales_support_manager",
    label: "Sales & Support",
    shortLabel: "SSM",
    icon: Headphones,
    description: "CRM & ticketing view",
  },
  reseller_manager: {
    id: "reseller_manager",
    label: "Reseller Manager",
    shortLabel: "RM",
    icon: Handshake,
    description: "Partner & channel view",
  },
  lead_manager: {
    id: "lead_manager",
    label: "Lead Manager",
    shortLabel: "LM",
    icon: Target,
    description: "Sales pipeline & leads",
  },
  product_manager: {
    id: "product_manager",
    label: "Product Manager",
    shortLabel: "PM",
    icon: Box,
    description: "Product catalog & demos",
  },
  demo_manager: {
    id: "demo_manager",
    label: "Demo Manager",
    shortLabel: "DEMO",
    icon: Terminal,
    description: "Demos, trials & previews",
  },
  pro_manager: {
    id: "pro_manager",
    label: "Pro Manager",
    shortLabel: "PM",
    icon: Crown,
    description: "Prime user management",
  },
  legal_manager: {
    id: "legal_manager",
    label: "Legal Manager",
    shortLabel: "LG",
    icon: Scale,
    description: "Legal & compliance",
  },
  task_management: {
    id: "task_management",
    label: "Task Management",
    shortLabel: "TM",
    icon: ListTodo,
    description: "Global task management",
  },
  finance_manager: {
    id: "finance_manager",
    label: "Finance Manager",
    shortLabel: "FIN",
    icon: Wallet,
    description: "Financial operations",
  },
  vala_ai_management: {
    id: "vala_ai_management",
    label: "VALA AI",
    shortLabel: "AI",
    icon: Terminal,
    description: "AI Operations & Automation",
  },
  marketing_management: {
    id: "marketing_management",
    label: "Marketing",
    shortLabel: "MKT",
    icon: Megaphone,
    description: "Marketing & growth ops",
  },
  customer_support_management: {
    id: "customer_support_management",
    label: "Customer Support",
    shortLabel: "CSM",
    icon: Headphones,
    description: "Support & helpdesk",
  },
  role_manager: {
    id: "role_manager",
    label: "Role Manager",
    shortLabel: "RM",
    icon: Shield,
    description: "Role & permissions",
  },
  developer_management: {
    id: "developer_management",
    label: "Developer",
    shortLabel: "DEV",
    icon: Code2,
    description: "Development & engineering",
  },
};

// ==============================================
// NAVIGATION STRUCTURE (simplified for Boss)
// ==============================================
const bossNavStructure: Module[] = [
  {
    id: "operations",
    label: "Operations",
    icon: LayoutDashboard,
    categories: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        subCategories: [
          { id: "overview", label: "Overview", status: "active" },
          { id: "metrics", label: "Key Metrics", status: "active" },
          { id: "alerts", label: "Critical Alerts", status: "active" },
        ],
      },
      {
        id: "approvals",
        label: "Approvals",
        icon: CheckCircle,
        subCategories: [
          { id: "pending-approvals", label: "Pending", status: "active" },
          { id: "approved-list", label: "Approved", status: "active" },
          { id: "rejected-list", label: "Rejected", status: "active" },
        ],
      },
    ],
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    icon: Server,
    categories: [
      {
        id: "server-control",
        label: "Server Control",
        icon: Server,
        subCategories: [
          { id: "server-overview", label: "Overview", status: "active" },
          { id: "server-add", label: "Add Server", status: "active" },
          { id: "server-active", label: "Active Servers", status: "active" },
        ],
      },
      {
        id: "vala-ai",
        label: "VALA AI",
        icon: Terminal,
        subCategories: [
          { id: "ai-overview", label: "Overview", status: "active" },
          { id: "ai-requests", label: "AI Requests", status: "active" },
          { id: "ai-models", label: "AI Models", status: "active" },
        ],
      },
    ],
  },
  {
    id: "business",
    label: "Business",
    icon: Building2,
    categories: [
      {
        id: "franchise-control",
        label: "Franchise Control",
        icon: Building2,
        subCategories: [
          { id: "franchise-list", label: "All Franchises", status: "active" },
          { id: "franchise-performance", label: "Performance", status: "active" },
        ],
      },
      {
        id: "finance",
        label: "Finance & Wallet",
        icon: Wallet,
        subCategories: [
          { id: "finance-overview", label: "Overview", status: "active" },
          { id: "finance-transactions", label: "Transactions", status: "active" },
        ],
      },
    ],
  },
  {
    id: "growth",
    label: "Growth",
    icon: TrendingUp,
    categories: [
      {
        id: "marketing",
        label: "Marketing / Leads",
        icon: Target,
        subCategories: [
          { id: "marketing-dashboard", label: "Dashboard", status: "active" },
          { id: "marketing-campaigns", label: "Campaigns", status: "active" },
        ],
      },
      {
        id: "product-demo",
        label: "Product & Demo",
        icon: Box,
        subCategories: [
          { id: "product-catalog", label: "Catalog", status: "active" },
          { id: "product-demos", label: "Demo Manager", status: "active" },
        ],
      },
    ],
  },
  {
    id: "system",
    label: "System",
    icon: Settings,
    categories: [
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        subCategories: [
          { id: "settings-general", label: "General", status: "active" },
          { id: "settings-users", label: "Users", status: "active" },
          { id: "settings-permissions", label: "Permissions", status: "active" },
        ],
      },
      {
        id: "security",
        label: "Security",
        icon: Shield,
        subCategories: [
          { id: "security-overview", label: "Overview", status: "active" },
          { id: "security-audit", label: "Audit Log", status: "active" },
        ],
      },
    ],
  },
];

// Quick role switcher items (top 4 shown)
const quickRoles: ActiveRole[] = [
  "ceo",
  "continent_super_admin",
  "country_head",
  "server_manager",
];

// ==============================================
// MAIN COMPONENT
// ==============================================
export const RoleSwitchSidebarNew: React.FC<RoleSwitchSidebarProps> = ({
  activeRole,
  onRoleChange,
  collapsed,
  onToggleCollapse,
  onLogout,
  activeNav,
  onNavChange,
  onSubItemClick,
}) => {
  const currentConfig = roleConfigs[activeRole] ?? roleConfigs.boss_owner;
  const Icon = currentConfig.icon;

  // Track expanded modules and categories
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(["operations"])
  );
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["dashboard"])
  );
  const [activeSubCategory, setActiveSubCategory] = useState<string>("overview");

  // Reset expansion when role changes
  useEffect(() => {
    setExpandedModules(new Set(["operations"]));
    setExpandedCategories(new Set(["dashboard"]));
    setActiveSubCategory("overview");
  }, [activeRole]);

  const handleModuleToggle = useCallback((moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  }, []);

  const handleCategoryToggle = useCallback((categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  const handleSubCategoryClick = useCallback(
    (subId: string, label: string, status?: string) => {
      if (status === "locked" || status === "coming-soon") {
        toast.info("Coming Soon", { description: `${label} will be available soon` });
        return;
      }
      setActiveSubCategory(subId);
      onNavChange?.(subId);
      onSubItemClick?.(subId);
    },
    [onNavChange, onSubItemClick]
  );

  const handleRoleSelect = useCallback(
    (roleId: ActiveRole) => {
      onRoleChange(roleId);
    },
    [onRoleChange]
  );

  // Determine sidebar width
  const sidebarWidth = collapsed ? 60 : 260;

  return (
    <aside
      className={cn(
        "flex flex-col h-screen border-r transition-all duration-200 ease-in-out",
        "bg-sidebar text-sidebar-foreground border-sidebar-border"
      )}
      style={{ width: sidebarWidth }}
    >
      {/* ===== HEADER: Role Card ===== */}
      <div className="p-3 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center">
            <Icon className="w-5 h-5 text-sidebar-accent-foreground" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold truncate">{currentConfig.label}</h2>
                <Badge
                  variant="secondary"
                  className="text-[9px] px-1.5 py-0 bg-sidebar-accent/30 text-sidebar-foreground border-0"
                >
                  {activeRole === "boss_owner" ? "AUTHORITY" : "VIEW"}
                </Badge>
              </div>
              <p className="text-[10px] text-sidebar-foreground/70 truncate">
                {currentConfig.description}
              </p>
            </div>
          )}
        </div>

        {/* Boss quick actions */}
        {!collapsed && activeRole === "boss_owner" && (
          <div className="flex items-center gap-1.5 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 h-7 text-[10px] bg-sidebar-accent/20 hover:bg-sidebar-accent/30 text-sidebar-foreground"
            >
              <Lock className="w-3 h-3 mr-1" />
              Lock
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 h-7 text-[10px] bg-sidebar-accent/20 hover:bg-sidebar-accent/30 text-sidebar-foreground"
            >
              <Zap className="w-3 h-3 mr-1" />
              Override
            </Button>
          </div>
        )}
      </div>

      {/* ===== ROLE SWITCHER ===== */}
      <div className="p-2 border-b border-sidebar-border">
        {!collapsed && (
          <p className="text-[9px] font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-1.5 px-1">
            Switch Role
          </p>
        )}
        <div className="space-y-0.5">
          {quickRoles.map((roleId) => {
            const role = roleConfigs[roleId];
            const RoleIcon = role.icon;
            const isActive = activeRole === roleId;

            return (
              <Tooltip key={roleId} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleRoleSelect(roleId)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded flex items-center justify-center",
                        isActive ? "bg-sidebar-primary" : "bg-sidebar-accent/30"
                      )}
                    >
                      <RoleIcon
                        className={cn(
                          "w-3 h-3",
                          isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground"
                        )}
                      />
                    </div>
                    {!collapsed && (
                      <span className="text-[11px] truncate">{role.label}</span>
                    )}
                  </button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">{role.label}</TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* ===== STATUS BAR ===== */}
      <div className="px-3 py-2 border-b border-sidebar-border bg-sidebar-accent/20">
        <div className="flex items-center gap-2">
          {!collapsed ? (
            <>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-medium">RUNNING</span>
              </div>
              <span className="text-sidebar-foreground/40">|</span>
              <div className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                <span className="text-[10px]">AI: ACTIVE</span>
              </div>
            </>
          ) : (
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mx-auto" />
          )}
        </div>
      </div>

      {/* ===== NAVIGATION ===== */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {!collapsed && (
            <p className="text-[10px] font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-2 px-2">
              {currentConfig.shortLabel} Features
            </p>
          )}

          <nav className="space-y-1">
            {bossNavStructure.map((module) => {
              const ModuleIcon = module.icon;
              const isModuleExpanded = expandedModules.has(module.id);
              const isModuleActive = module.categories.some((cat) =>
                cat.subCategories?.some((sub) => sub.id === activeSubCategory)
              );

              return (
                <Collapsible
                  key={module.id}
                  open={isModuleExpanded}
                  onOpenChange={() => handleModuleToggle(module.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <button
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                            isModuleExpanded || isModuleActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "hover:bg-sidebar-accent/50"
                          )}
                        >
                          <ModuleIcon className="w-4 h-4 flex-shrink-0" />
                          {!collapsed && (
                            <>
                              <span className="text-sm font-medium flex-1 text-left truncate">
                                {module.label}
                              </span>
                              <ChevronRight
                                className={cn(
                                  "w-4 h-4 transition-transform",
                                  isModuleExpanded && "rotate-90"
                                )}
                              />
                            </>
                          )}
                        </button>
                      </TooltipTrigger>
                      {collapsed && (
                        <TooltipContent side="right">{module.label}</TooltipContent>
                      )}
                    </Tooltip>
                  </CollapsibleTrigger>

                  {!collapsed && (
                    <CollapsibleContent className="pl-4 mt-1 space-y-0.5">
                      {module.categories.map((category) => {
                        const CategoryIcon = category.icon;
                        const isCategoryExpanded = expandedCategories.has(category.id);
                        const isCategoryActive = category.subCategories?.some(
                          (sub) => sub.id === activeSubCategory
                        );

                        return (
                          <Collapsible
                            key={category.id}
                            open={isCategoryExpanded}
                            onOpenChange={() => handleCategoryToggle(category.id)}
                          >
                            <CollapsibleTrigger asChild>
                              <button
                                className={cn(
                                  "w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-sm",
                                  isCategoryExpanded || isCategoryActive
                                    ? "bg-sidebar-accent/60 font-medium"
                                    : "hover:bg-sidebar-accent/30"
                                )}
                              >
                                <CategoryIcon className="w-3.5 h-3.5" />
                                <span className="flex-1 text-left text-xs truncate">
                                  {category.label}
                                </span>
                                {category.subCategories && (
                                  <ChevronRight
                                    className={cn(
                                      "w-3 h-3 transition-transform",
                                      isCategoryExpanded && "rotate-90"
                                    )}
                                  />
                                )}
                              </button>
                            </CollapsibleTrigger>

                            <CollapsibleContent className="pl-4 mt-0.5 space-y-0.5 border-l border-sidebar-border/50 ml-2">
                              {category.subCategories?.map((sub) => {
                                const isSubActive = activeSubCategory === sub.id;
                                const isLocked = sub.status === "locked";

                                return (
                                  <button
                                    key={sub.id}
                                    onClick={() =>
                                      handleSubCategoryClick(sub.id, sub.label, sub.status)
                                    }
                                    disabled={isLocked}
                                    className={cn(
                                      "w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] transition-colors",
                                      isSubActive
                                        ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                                        : "hover:bg-sidebar-accent/40",
                                      isLocked && "opacity-50 cursor-not-allowed"
                                    )}
                                  >
                                    <span className="truncate">{sub.label}</span>
                                    {isLocked && <Lock className="w-2.5 h-2.5 ml-auto" />}
                                  </button>
                                );
                              })}
                            </CollapsibleContent>
                          </Collapsible>
                        );
                      })}
                    </CollapsibleContent>
                  )}
                </Collapsible>
              );
            })}
          </nav>
        </div>
      </ScrollArea>

      {/* ===== FOOTER ===== */}
      <div className="mt-auto border-t border-sidebar-border p-2">
        {/* Collapse toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="w-full justify-center mb-1 text-sidebar-foreground/70 hover:bg-sidebar-accent/30"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </Button>

        {/* Logout */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="w-full justify-center text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
              {!collapsed && <span className="ml-2 text-xs">Logout</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Logout</TooltipContent>}
        </Tooltip>
      </div>
    </aside>
  );
};

export default RoleSwitchSidebarNew;
