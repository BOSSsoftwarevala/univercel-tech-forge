import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Globe2, MapPin, Server, ChevronLeft, ChevronRight, ArrowLeft,
  Crown, LayoutDashboard, Users, Shield, Activity,
  Settings, LogOut, AlertCircle, Building2, Headphones, Handshake,
  Target, Star, Scale, ListTodo, Wallet, FileText, Receipt, 
  TrendingUp, CreditCard, PieChart, BarChart3, Clock, Code2,
  UserCheck, Briefcase, Award, MessageSquare, Phone, Mail,
  Package, Truck, Store, Map, Database, HardDrive, Cpu,
  Monitor, Zap, Lock, Key, Gavel, FileCheck, BookOpen,
  Bug, GitBranch, Rocket, Terminal, AlertTriangle, Radio,
  Megaphone, Image, Share2, BarChart, LineChart, Palette, Ticket,
  Flag, Box, ShoppingCart, Eye, Play, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export type ActiveRole = "master_admin" | "super_admin_hierarchy" | "continent_super_admin" | "country_head" | "area_manager" | "server_manager" | "franchise_manager" | "sales_support_manager" | "reseller_manager" | "lead_manager" | "pro_manager" | "legal_manager" | "task_management" | "finance_manager" | "developer_management" | "marketing_management" | "customer_support_management" | "role_manager" | "product_manager";

interface RoleSwitchSidebarProps {
  activeRole: ActiveRole;
  onRoleChange: (role: ActiveRole) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

// Role configurations with themes
const roleConfigs = {
  master_admin: {
    id: "master_admin",
    label: "Master Admin",
    shortLabel: "MA",
    icon: Crown,
    themeColor: "from-amber-500 via-yellow-500 to-orange-600",
    accentColor: "text-amber-400",
    bgAccent: "bg-amber-500/10",
    borderAccent: "border-amber-500/50",
    description: "Top-level authority • System Owner",
  },
  super_admin_hierarchy: {
    id: "super_admin_hierarchy",
    label: "Boss",
    shortLabel: "BO",
    icon: Globe2,
    themeColor: "from-blue-500 via-indigo-500 to-purple-600",
    accentColor: "text-blue-400",
    bgAccent: "bg-blue-500/10",
    borderAccent: "border-blue-500/50",
    description: "Global Operations Head",
  },
  continent_super_admin: {
    id: "continent_super_admin",
    label: "Continent Super Admin",
    shortLabel: "CSA",
    icon: Globe2,
    themeColor: "from-blue-500 to-emerald-500",
    accentColor: "text-blue-400",
    bgAccent: "bg-blue-500/10",
    borderAccent: "border-blue-500/50",
    description: "Continent-level management",
  },
  country_head: {
    id: "country_head",
    label: "Country Head",
    shortLabel: "CH",
    icon: Flag,
    themeColor: "from-orange-500 to-amber-600",
    accentColor: "text-orange-400",
    bgAccent: "bg-orange-500/10",
    borderAccent: "border-orange-500/50",
    description: "Country Operations Head",
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
  finance_manager: {
    id: "finance_manager",
    label: "Finance Manager",
    shortLabel: "FIN",
    icon: Wallet,
    themeColor: "from-emerald-700 to-green-600",
    accentColor: "text-emerald-400",
    bgAccent: "bg-emerald-700/10",
    borderAccent: "border-emerald-600/50",
    description: "Financial operations & accounting",
  },
  developer_management: {
    id: "developer_management",
    label: "Developer Management",
    shortLabel: "DEV",
    icon: Terminal,
    themeColor: "from-slate-700 to-zinc-900",
    accentColor: "text-cyan-400",
    bgAccent: "bg-cyan-500/10",
    borderAccent: "border-cyan-500/50",
    description: "Tech & engineering operations",
  },
  marketing_management: {
    id: "marketing_management",
    label: "Marketing Management",
    shortLabel: "MKT",
    icon: Megaphone,
    themeColor: "from-pink-500 to-rose-600",
    accentColor: "text-pink-400",
    bgAccent: "bg-pink-500/10",
    borderAccent: "border-pink-500/50",
    description: "Marketing & growth operations",
  },
  customer_support_management: {
    id: "customer_support_management",
    label: "Customer Support Management",
    shortLabel: "CSM",
    icon: Headphones,
    themeColor: "from-blue-500 to-cyan-600",
    accentColor: "text-blue-400",
    bgAccent: "bg-blue-500/10",
    borderAccent: "border-blue-500/50",
    description: "Support & helpdesk operations",
  },
  role_manager: {
    id: "role_manager",
    label: "Role Manager",
    shortLabel: "RM",
    icon: Shield,
    themeColor: "from-violet-500 to-purple-600",
    accentColor: "text-violet-400",
    bgAccent: "bg-violet-500/10",
    borderAccent: "border-violet-500/50",
    description: "Role & permission management",
  },
  product_manager: {
    id: "product_manager",
    label: "Product Manager",
    shortLabel: "PM",
    icon: Box,
    themeColor: "from-indigo-500 to-violet-600",
    accentColor: "text-indigo-400",
    bgAccent: "bg-indigo-500/10",
    borderAccent: "border-indigo-500/50",
    description: "Product catalog & demo management",
  },
} as const;

// Extended navigation items per role - role-specific features
const roleNavItems = {
  continent_super_admin: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "continents", label: "All Continents", icon: Globe2 },
    { id: "admins", label: "Continent Admins", icon: Users },
    { id: "countries", label: "Country Overview", icon: Map },
    { id: "activity", label: "Live Activity", icon: Activity },
    { id: "reports", label: "Global Reports", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  area_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "managers", label: "All Area Managers", icon: Users },
    { id: "regions", label: "Regions & Zones", icon: Map },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "activity", label: "Area Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  server_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "servers", label: "All Servers", icon: Server },
    { id: "databases", label: "Databases", icon: Database },
    { id: "storage", label: "Storage", icon: HardDrive },
    { id: "monitoring", label: "Monitoring", icon: Monitor },
    { id: "performance", label: "Performance", icon: Cpu },
    { id: "security", label: "Security", icon: Shield },
    { id: "activity", label: "Tech Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  franchise_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "franchises", label: "All Franchises", icon: Building2 },
    { id: "branches", label: "Branch Network", icon: Store },
    { id: "operations", label: "Operations", icon: Briefcase },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "activity", label: "Franchise Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  sales_support_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "team", label: "Support Team", icon: Users },
    { id: "tickets", label: "Support Tickets", icon: MessageSquare },
    { id: "calls", label: "Call Center", icon: Phone },
    { id: "emails", label: "Email Queue", icon: Mail },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "activity", label: "Support Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  reseller_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "resellers", label: "All Resellers", icon: Handshake },
    { id: "tiers", label: "Reseller Tiers", icon: Award },
    { id: "commissions", label: "Commissions", icon: CreditCard },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "payouts", label: "Payouts", icon: Wallet },
    { id: "activity", label: "Partner Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  lead_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "leads", label: "All Leads", icon: Target },
    { id: "pipeline", label: "Sales Pipeline", icon: TrendingUp },
    { id: "sources", label: "Lead Sources", icon: Zap },
    { id: "assignments", label: "Assignments", icon: UserCheck },
    { id: "activity", label: "Lead Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  pro_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "pros", label: "All Pro Users", icon: Crown },
    { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
    { id: "benefits", label: "Pro Benefits", icon: Award },
    { id: "upgrades", label: "Upgrades", icon: TrendingUp },
    { id: "activity", label: "Pro Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  legal_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "cases", label: "Legal Cases", icon: Gavel },
    { id: "contracts", label: "Contracts", icon: FileCheck },
    { id: "compliance", label: "Compliance", icon: Shield },
    { id: "documents", label: "Documents", icon: BookOpen },
    { id: "activity", label: "Legal Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  task_management: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "tasks", label: "All Tasks", icon: ListTodo },
    { id: "developers", label: "Developers", icon: Code2 },
    { id: "projects", label: "Projects", icon: Package },
    { id: "sprints", label: "Sprints", icon: Zap },
    { id: "activity", label: "Task Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  finance_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "managers", label: "All Finance Managers", icon: Users },
    { id: "transactions", label: "Transactions", icon: Receipt },
    { id: "revenue", label: "Revenue", icon: TrendingUp },
    { id: "expenses", label: "Expenses", icon: CreditCard },
    { id: "commissions", label: "Commissions", icon: PieChart },
    { id: "payouts", label: "Payouts", icon: Wallet },
    { id: "invoices", label: "Invoices", icon: FileText },
    { id: "tax", label: "Tax & Compliance", icon: Scale },
    { id: "activity", label: "Finance Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  developer_management: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "managers", label: "All Dev Managers", icon: Users },
    { id: "developers", label: "Developers", icon: Code2 },
    { id: "tasks", label: "Tasks & Sprints", icon: ListTodo },
    { id: "bugs", label: "Bug Tracker", icon: Bug },
    { id: "apis", label: "API Management", icon: Radio },
    { id: "releases", label: "Releases", icon: Rocket },
    { id: "monitoring", label: "System Monitoring", icon: Monitor },
    { id: "security", label: "Security & Access", icon: Key },
    { id: "activity", label: "Tech Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  marketing_management: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "managers", label: "All Marketing Managers", icon: Users },
    { id: "campaigns", label: "Campaigns", icon: Megaphone },
    { id: "leads", label: "Lead Sources", icon: Target },
    { id: "content", label: "Content Library", icon: Image },
    { id: "ads", label: "Ad Accounts", icon: Share2 },
    { id: "analytics", label: "Analytics & Insights", icon: LineChart },
    { id: "brand", label: "Brand & Compliance", icon: Palette },
    { id: "activity", label: "Marketing Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  customer_support_management: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "managers", label: "All Support Managers", icon: Users },
    { id: "tickets", label: "Tickets", icon: MessageSquare },
    { id: "users", label: "Users & Partners", icon: UserCheck },
    { id: "sla", label: "SLA Management", icon: Clock },
    { id: "communication", label: "Communication", icon: Mail },
    { id: "escalations", label: "Escalations", icon: AlertCircle },
    { id: "knowledge", label: "Knowledge Base", icon: BookOpen },
    { id: "activity", label: "Support Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  role_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "roles", label: "All Roles", icon: Shield },
    { id: "approvals", label: "Pending Approvals", icon: Clock },
    { id: "matrix", label: "Permission Matrix", icon: Key },
    { id: "assignments", label: "Role Assignments", icon: UserCheck },
    { id: "versions", label: "Role Versions", icon: FileText },
    { id: "audit", label: "Audit Log", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  master_admin: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "super-admins", label: "Super Admins", icon: Users },
    { id: "roles", label: "Roles & Permissions", icon: Key },
    { id: "modules", label: "System Modules", icon: Cpu },
    { id: "audit", label: "Audit & Blackbox", icon: Database },
    { id: "security", label: "Security & Legal", icon: Shield },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  super_admin_hierarchy: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "continents", label: "Continents", icon: Globe2 },
    { id: "admins", label: "Continent Admins", icon: Users },
    { id: "modules", label: "Global Modules", icon: Cpu },
    { id: "activity", label: "Activity Log", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  country_head: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "areas", label: "Regions & Areas", icon: Map },
    { id: "managers", label: "Area Managers", icon: Users },
    { id: "users", label: "Country Users", icon: UserCheck },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "escalations", label: "Escalations", icon: AlertTriangle },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  product_manager: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "All Products", icon: Box },
    { id: "demos", label: "Demo Management", icon: Play },
    { id: "catalog", label: "Product Catalog", icon: Layers },
    { id: "pricing", label: "Pricing & Plans", icon: CreditCard },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "analytics", label: "Product Analytics", icon: BarChart3 },
    { id: "activity", label: "Product Activity", icon: Activity },
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
  const [isDrilledDown, setIsDrilledDown] = useState(false);

  const handleRoleSelect = (roleId: ActiveRole) => {
    onRoleChange(roleId);
    setIsDrilledDown(true);
    setActiveNav("dashboard");
  };

  const handleBackToRoles = () => {
    setIsDrilledDown(false);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex flex-col border-r transition-colors duration-300",
        activeRole === "server_manager" || activeRole === "developer_management"
          ? "bg-zinc-900 border-zinc-700" 
          : activeRole === "finance_manager"
          ? "bg-emerald-950 border-emerald-800"
          : "bg-sidebar border-sidebar-border"
      )}
    >
      {/* Header - Generic Control Panel (no role name to avoid duplication) */}
      <div className="p-4 border-b border-sidebar-border/50">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br",
              currentConfig.themeColor
            )}
          >
            <currentConfig.icon className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1"
              >
                <h2 className="text-sm font-bold text-foreground">Control Panel</h2>
                <p className="text-xs text-muted-foreground">Navigation Menu</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isDrilledDown ? (
          /* Role Switch Section - Show all roles */
          <motion.div
            key="role-list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 overflow-hidden"
          >
            <ScrollArea className="h-full">
              <div className="p-3">
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
                              handleRoleSelect(role.id as ActiveRole);
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
                            {!collapsed && (
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
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
            </ScrollArea>
          </motion.div>
        ) : (
          /* Drilled-down view - Show only active role's features */
          <motion.div
            key="role-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 overflow-hidden flex flex-col"
          >
            {/* Back button and active role header */}
            <div className="p-3 border-b border-sidebar-border/50">
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToRoles}
                    className={cn(
                      "w-full gap-2 mb-3",
                      collapsed ? "justify-center px-0" : "justify-start"
                    )}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {!collapsed && <span>Back to Roles</span>}
                  </Button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" sideOffset={10}>
                    Back to Roles
                  </TooltipContent>
                )}
              </Tooltip>

              {/* Current Role Badge */}
              <div className={cn(
                "flex items-center gap-3 p-3 rounded-xl",
                currentConfig.bgAccent,
                "border",
                currentConfig.borderAccent
              )}>
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br",
                  currentConfig.themeColor
                )}>
                  <currentConfig.icon className="w-5 h-5 text-white" />
                </div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1"
                    >
                      <span className={cn("text-sm font-bold block", currentConfig.accentColor)}>
                        {currentConfig.label}
                      </span>
                      <Badge variant="outline" className={cn("text-xs mt-1", currentConfig.accentColor, currentConfig.borderAccent)}>
                        Active
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Role-specific Navigation */}
            <ScrollArea className="flex-1 py-4">
              <AnimatePresence>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-5"
                  >
                    {currentConfig.shortLabel} Features
                  </motion.p>
                )}
              </AnimatePresence>
              
              <nav className="space-y-1 px-3">
                {currentNavItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <Tooltip delayDuration={0}>
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
                    </motion.div>
                  );
                })}
              </nav>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

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
