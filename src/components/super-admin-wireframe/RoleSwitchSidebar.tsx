import { useState, useCallback, useEffect } from "react";
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
  Flag, Box, ShoppingCart, Eye, Play, Layers,
  CheckCircle, XCircle, ArrowUpRight, Pause, Archive, Ban
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { toast } from "sonner";


export type ActiveRole = "boss_owner" | "ceo" | "continent_super_admin" | "country_head" | "server_manager" | "franchise_manager" | "sales_support_manager" | "reseller_manager" | "lead_manager" | "pro_manager" | "legal_manager" | "task_management" | "finance_manager" | "vala_ai_management" | "marketing_management" | "customer_support_management" | "role_manager" | "product_manager";

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

// Role configurations with themes
export const roleConfigs = {
  boss_owner: {
    id: "boss_owner",
    label: "Boss / Owner",
    shortLabel: "BOSS",
    icon: Crown,
    themeColor: "from-amber-500 via-yellow-500 to-orange-600",
    accentColor: "text-amber-400",
    bgAccent: "bg-amber-500/10",
    borderAccent: "border-amber-500/50",
    description: "Final Authority • System Owner",
  },
  ceo: {
    id: "ceo",
    label: "CEO",
    shortLabel: "CEO",
    icon: Eye,
    themeColor: "from-emerald-500 via-teal-500 to-cyan-600",
    accentColor: "text-emerald-400",
    bgAccent: "bg-emerald-500/10",
    borderAccent: "border-emerald-500/50",
    description: "Vision & Oversight • Read-only",
  },
  continent_super_admin: {
    id: "continent_super_admin",
    label: "Continent Admin",
    shortLabel: "CA",
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
    description: "Country & Region Operations",
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

// STEP 7: 3-Level Navigation Structure
// Level 1 = Module (expands to show Level 2)
// Level 2 = Category (expands to show Level 3)
// Level 3 = Subcategory (LOADS SCREEN - only this level loads content)

interface SubCategory {
  id: string;
  label: string;
  status?: 'active' | 'locked' | 'coming-soon';
}

interface Category {
  id: string;
  label: string;
  icon: any;
  subCategories?: SubCategory[];
}

interface Module {
  id: string;
  label: string;
  icon: any;
  categories: Category[];
}

// STEP 7: Full 3-level navigation structure per role
const roleNavStructure: Record<ActiveRole, Module[]> = {
  boss_owner: [
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
          ]
        },
        { 
          id: "approvals", 
          label: "Approvals", 
          icon: CheckCircle,
          subCategories: [
            { id: "pending-approvals", label: "Pending", status: "active" },
            { id: "approved-list", label: "Approved", status: "active" },
            { id: "rejected-list", label: "Rejected", status: "active" },
          ]
        },
      ]
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
            { id: "server-health", label: "Health & Load", status: "active" },
            { id: "server-security", label: "Security", status: "active" },
          ]
        },
        { 
          id: "dev-control", 
          label: "Development", 
          icon: Code2,
          subCategories: [
            { id: "dev-overview", label: "Overview", status: "active" },
            { id: "dev-tasks", label: "Tasks", status: "active" },
            { id: "dev-bugs", label: "Bug Tracker", status: "active" },
            { id: "dev-releases", label: "Releases", status: "active" },
          ]
        },
      ]
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
            { id: "franchise-issues", label: "Issues", status: "active" },
          ]
        },
        { 
          id: "reseller-control", 
          label: "Reseller Control", 
          icon: Handshake,
          subCategories: [
            { id: "reseller-list", label: "All Resellers", status: "active" },
            { id: "reseller-tiers", label: "Tiers", status: "active" },
            { id: "reseller-commissions", label: "Commissions", status: "active" },
          ]
        },
        { 
          id: "finance", 
          label: "Finance & Wallet", 
          icon: Wallet,
          subCategories: [
            { id: "finance-overview", label: "Overview", status: "active" },
            { id: "finance-transactions", label: "Transactions", status: "active" },
            { id: "finance-payouts", label: "Payouts", status: "active" },
          ]
        },
      ]
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
            { id: "marketing-leads", label: "All Leads", status: "active" },
          ]
        },
        { 
          id: "product-demo", 
          label: "Product & Demo", 
          icon: Box,
          subCategories: [
            { id: "product-catalog", label: "Catalog", status: "active" },
            { id: "product-demos", label: "Demo Manager", status: "active" },
            { id: "product-pricing", label: "Pricing", status: "active" },
          ]
        },
      ]
    },
    {
      id: "support-security",
      label: "Support & Security",
      icon: Shield,
      categories: [
        { 
          id: "support-overview", 
          label: "Support Overview", 
          icon: Headphones,
          subCategories: [
            { id: "support-tickets", label: "Tickets", status: "active" },
            { id: "support-team", label: "Team", status: "active" },
            { id: "support-sla", label: "SLA", status: "active" },
          ]
        },
        { 
          id: "security", 
          label: "Security / Black Box", 
          icon: Shield,
          subCategories: [
            { id: "security-overview", label: "Overview", status: "active" },
            { id: "security-audit", label: "Audit Log", status: "active" },
            { id: "security-alerts", label: "Alerts", status: "active" },
          ]
        },
      ]
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
          ]
        },
      ]
    },
  ],
  ceo: [
    {
      id: "overview",
      label: "Overview",
      icon: Eye,
      categories: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, subCategories: [{ id: "ceo-overview", label: "Business Overview", status: "active" }] },
        { id: "revenue", label: "Revenue", icon: TrendingUp, subCategories: [{ id: "ceo-revenue", label: "Revenue Insights", status: "active" }] },
        { id: "analytics", label: "Analytics", icon: BarChart3, subCategories: [{ id: "ceo-analytics", label: "Analytics Dashboard", status: "active" }] },
        { id: "reports", label: "Reports", icon: FileText, subCategories: [{ id: "ceo-reports", label: "View Reports", status: "active" }] },
      ]
    },
  ],
  continent_super_admin: [
    {
      id: "continents",
      label: "Continents",
      icon: Globe2,
      categories: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, subCategories: [
          { id: "csa-asia", label: "Asia Super Admin", status: "active" },
          { id: "csa-africa", label: "Africa Super Admin", status: "active" },
          { id: "csa-europe", label: "Europe Super Admin", status: "active" },
          { id: "csa-north-america", label: "North America", status: "active" },
          { id: "csa-south-america", label: "South America", status: "active" },
          { id: "csa-australia", label: "Australia", status: "active" },
        ]},
        { id: "admins", label: "Admins", icon: Users, subCategories: [{ id: "continent-admins", label: "All Admins", status: "active" }] },
        { id: "countries", label: "Countries", icon: Map, subCategories: [{ id: "country-overview", label: "Country Overview", status: "active" }] },
      ]
    },
  ],
  server_manager: [
    {
      id: "servers",
      label: "Servers",
      icon: Server,
      categories: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, subCategories: [{ id: "server-dash", label: "Server Dashboard", status: "active" }] },
        { id: "servers", label: "All Servers", icon: Server, subCategories: [{ id: "server-list", label: "Server List", status: "active" }] },
        { id: "databases", label: "Databases", icon: Database, subCategories: [{ id: "db-list", label: "All Databases", status: "active" }] },
        { id: "monitoring", label: "Monitoring", icon: Monitor, subCategories: [{ id: "server-monitoring", label: "Live Monitoring", status: "active" }] },
        { id: "security", label: "Security", icon: Shield, subCategories: [{ id: "server-security", label: "Security Config", status: "active" }] },
      ]
    },
  ],
  franchise_manager: [
    {
      id: "franchises",
      label: "Franchises",
      icon: Building2,
      categories: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, subCategories: [{ id: "franchise-dash", label: "Franchise Dashboard", status: "active" }] },
        { id: "franchises", label: "All Franchises", icon: Building2, subCategories: [{ id: "franchise-list", label: "Franchise List", status: "active" }] },
        { id: "branches", label: "Branches", icon: Store, subCategories: [{ id: "branch-network", label: "Branch Network", status: "active" }] },
        { id: "performance", label: "Performance", icon: TrendingUp, subCategories: [{ id: "franchise-perf", label: "Performance Metrics", status: "active" }] },
      ]
    },
  ],
  sales_support_manager: [
    {
      id: "support",
      label: "Support",
      icon: Headphones,
      categories: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, subCategories: [{ id: "support-dash", label: "Support Dashboard", status: "active" }] },
        { id: "tickets", label: "Tickets", icon: MessageSquare, subCategories: [{ id: "ticket-list", label: "All Tickets", status: "active" }] },
        { id: "team", label: "Team", icon: Users, subCategories: [{ id: "support-team", label: "Support Team", status: "active" }] },
      ]
    },
  ],
  reseller_manager: [
    {
      id: "resellers",
      label: "Resellers",
      icon: Handshake,
      categories: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, subCategories: [{ id: "reseller-dash", label: "Reseller Dashboard", status: "active" }] },
        { id: "resellers", label: "All Resellers", icon: Handshake, subCategories: [{ id: "reseller-list", label: "Reseller List", status: "active" }] },
        { id: "commissions", label: "Commissions", icon: CreditCard, subCategories: [{ id: "commission-list", label: "Commission Tracking", status: "active" }] },
      ]
    },
  ],
  lead_manager: [
    {
      id: "leads",
      label: "Leads",
      icon: Target,
      categories: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, subCategories: [{ id: "lead-dash", label: "Lead Dashboard", status: "active" }] },
        { id: "leads", label: "All Leads", icon: Target, subCategories: [{ id: "lead-list", label: "Lead List", status: "active" }] },
        { id: "pipeline", label: "Pipeline", icon: TrendingUp, subCategories: [{ id: "sales-pipeline", label: "Sales Pipeline", status: "active" }] },
      ]
    },
  ],
  pro_manager: [
    {
      id: "pros",
      label: "Pro Users",
      icon: Crown,
      categories: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, subCategories: [{ id: "pro-dash", label: "Pro Dashboard", status: "active" }] },
        { id: "pros", label: "All Pro Users", icon: Crown, subCategories: [{ id: "pro-list", label: "Pro User List", status: "active" }] },
        { id: "subscriptions", label: "Subscriptions", icon: CreditCard, subCategories: [{ id: "pro-subs", label: "Subscription Management", status: "active" }] },
      ]
    },
  ],
  legal_manager: [
    {
      id: "legal",
      label: "Legal",
      icon: Scale,
      categories: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, subCategories: [{ id: "legal-dash", label: "Legal Dashboard", status: "active" }] },
        { id: "cases", label: "Cases", icon: Gavel, subCategories: [{ id: "case-list", label: "All Cases", status: "active" }] },
        { id: "compliance", label: "Compliance", icon: Shield, subCategories: [{ id: "compliance-check", label: "Compliance Check", status: "active" }] },
      ]
    },
  ],
  task_management: [
    {
      id: "tasks",
      label: "Tasks",
      icon: ListTodo,
      categories: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, subCategories: [{ id: "task-dash", label: "Task Dashboard", status: "active" }] },
        { id: "tasks", label: "All Tasks", icon: ListTodo, subCategories: [{ id: "task-list", label: "Task List", status: "active" }] },
        { id: "developers", label: "Developers", icon: Code2, subCategories: [{ id: "dev-list", label: "Developer List", status: "active" }] },
      ]
    },
  ],
  finance_manager: [
    {
      id: "finance",
      label: "Finance",
      icon: Wallet,
      categories: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, subCategories: [{ id: "finance-dash", label: "Finance Dashboard", status: "active" }] },
        { id: "transactions", label: "Transactions", icon: Receipt, subCategories: [{ id: "tx-list", label: "All Transactions", status: "active" }] },
        { id: "payouts", label: "Payouts", icon: Wallet, subCategories: [{ id: "payout-list", label: "Payout Management", status: "active" }] },
      ]
    },
  ],
  vala_ai_management: [
    {
      id: "vala-ai",
      label: "VALA AI",
      icon: Terminal,
      categories: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, subCategories: [{ id: "vala-ai-dash", label: "AI Dashboard", status: "active" }] },
        { id: "ai-requests", label: "AI Requests", icon: Code2, subCategories: [{ id: "ai-req", label: "AI Requests", status: "active" }] },
        { id: "ai-models", label: "AI Models", icon: Cpu, subCategories: [{ id: "ai-models", label: "AI Models", status: "active" }] },
      ]
    },
  ],
  marketing_management: [
    {
      id: "marketing",
      label: "Marketing",
      icon: Megaphone,
      categories: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, subCategories: [{ id: "mkt-dash", label: "Marketing Dashboard", status: "active" }] },
        { id: "campaigns", label: "Campaigns", icon: Megaphone, subCategories: [{ id: "campaign-list", label: "All Campaigns", status: "active" }] },
        { id: "analytics", label: "Analytics", icon: LineChart, subCategories: [{ id: "mkt-analytics", label: "Marketing Analytics", status: "active" }] },
      ]
    },
  ],
  customer_support_management: [
    {
      id: "support",
      label: "Support",
      icon: Headphones,
      categories: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, subCategories: [{ id: "csm-dash", label: "Support Dashboard", status: "active" }] },
        { id: "tickets", label: "Tickets", icon: MessageSquare, subCategories: [{ id: "csm-tickets", label: "All Tickets", status: "active" }] },
        { id: "escalations", label: "Escalations", icon: AlertCircle, subCategories: [{ id: "escalation-list", label: "Escalation Queue", status: "active" }] },
      ]
    },
  ],
  role_manager: [
    {
      id: "roles",
      label: "Roles",
      icon: Shield,
      categories: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, subCategories: [{ id: "role-dash", label: "Role Dashboard", status: "active" }] },
        { id: "roles", label: "All Roles", icon: Shield, subCategories: [{ id: "role-list", label: "Role List", status: "active" }] },
        { id: "matrix", label: "Permission Matrix", icon: Key, subCategories: [{ id: "perm-matrix", label: "View Matrix", status: "active" }] },
      ]
    },
  ],
  country_head: [
    {
      id: "country",
      label: "Country",
      icon: Flag,
      categories: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, subCategories: [{ id: "country-dash", label: "Country Dashboard", status: "active" }] },
        { id: "areas", label: "Regions", icon: Map, subCategories: [{ id: "region-list", label: "All Regions", status: "active" }] },
        { id: "managers", label: "Managers", icon: Users, subCategories: [{ id: "area-managers", label: "Area Managers", status: "active" }] },
      ]
    },
  ],
  product_manager: [
    {
      id: "products",
      label: "Products",
      icon: Box,
      categories: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, subCategories: [{ id: "product-dash", label: "Product Dashboard", status: "active" }] },
        { id: "products", label: "All Products", icon: Box, subCategories: [{ id: "product-list", label: "Product Catalog", status: "active" }] },
        { id: "demos", label: "Demos", icon: Play, subCategories: [{ id: "demo-manager", label: "Demo Manager", status: "active" }] },
        { id: "pricing", label: "Pricing", icon: CreditCard, subCategories: [{ id: "pricing-plans", label: "Pricing & Plans", status: "active" }] },
      ]
    },
  ],
};

// ============================================
// ENTERPRISE: Global Actions Panel Component
// Context-aware actions for selected cards
// ============================================
const GlobalActionsPanel = ({ collapsed }: { collapsed: boolean }) => {
  const { selectedCard, clearSelection } = useDashboardContext();
  
  // Action handlers
  const handleAction = useCallback((actionType: string) => {
    if (!selectedCard) return;
    
    const actionMessages: Record<string, { title: string; type: 'success' | 'error' | 'warning' | 'info' }> = {
      approve: { title: `✓ Approved: ${selectedCard.label}`, type: 'success' },
      reject: { title: `✕ Rejected: ${selectedCard.label}`, type: 'error' },
      override: { title: `⚡ Override Applied: ${selectedCard.label}`, type: 'warning' },
      assign: { title: `👤 Assigned: ${selectedCard.label}`, type: 'info' },
      lock: { title: `🔒 Locked: ${selectedCard.label}`, type: 'error' },
      freeze: { title: `❄️ Frozen: ${selectedCard.label}`, type: 'warning' },
      escalate: { title: `⬆ Escalated: ${selectedCard.label}`, type: 'warning' },
      archive: { title: `📦 Archived: ${selectedCard.label}`, type: 'info' },
    };
    
    const msg = actionMessages[actionType] || { title: `Action: ${actionType}`, type: 'info' as const };
    toast[msg.type](msg.title, { description: `Applied to ${selectedCard.value} items` });
    clearSelection();
  }, [selectedCard, clearSelection]);

  const actions = [
    { id: 'approve', label: 'Approve', icon: CheckCircle, color: 'bg-emerald-500 hover:bg-emerald-600', textColor: 'text-white' },
    { id: 'reject', label: 'Reject', icon: XCircle, color: 'bg-red-500 hover:bg-red-600', textColor: 'text-white' },
    { id: 'override', label: 'Override', icon: Zap, color: 'bg-orange-500 hover:bg-orange-600', textColor: 'text-white' },
    { id: 'assign', label: 'Assign', icon: UserCheck, color: 'bg-blue-500 hover:bg-blue-600', textColor: 'text-white' },
    { id: 'lock', label: 'Lock', icon: Lock, color: 'bg-slate-600 hover:bg-slate-700', textColor: 'text-white' },
    { id: 'freeze', label: 'Freeze', icon: Pause, color: 'bg-cyan-500 hover:bg-cyan-600', textColor: 'text-white' },
    { id: 'escalate', label: 'Escalate', icon: ArrowUpRight, color: 'bg-purple-500 hover:bg-purple-600', textColor: 'text-white' },
    { id: 'archive', label: 'Archive', icon: Archive, color: 'bg-amber-500 hover:bg-amber-600', textColor: 'text-white' },
  ];

  if (collapsed) {
    return (
      <div className="p-2 border-t border-white/20">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div className={cn(
              "w-full h-8 rounded-lg flex items-center justify-center",
              selectedCard ? "bg-emerald-500/30" : "bg-white/10"
            )}>
              <Zap className={cn("w-4 h-4", selectedCard ? "text-emerald-300" : "text-white/50")} />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            {selectedCard ? `Actions for: ${selectedCard.label}` : 'Select a card first'}
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="border-t border-white/20 bg-white/5">
      {/* Header */}
      <div className="px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">
            Global Actions
          </span>
        </div>
        {selectedCard && (
          <button 
            onClick={clearSelection}
            className="text-[9px] text-white/60 hover:text-white/90 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Context Info */}
      {selectedCard ? (
        <div className="px-3 pb-2">
          <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
            <p className="text-[10px] text-blue-200 font-medium truncate">{selectedCard.label}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] text-white/70">{selectedCard.value} items</span>
              <span className={cn(
                "text-[8px] font-semibold px-1.5 py-0.5 rounded",
                selectedCard.severity === 'critical' ? 'bg-red-500/30 text-red-300' :
                selectedCard.severity === 'high' ? 'bg-orange-500/30 text-orange-300' :
                selectedCard.severity === 'medium' ? 'bg-yellow-500/30 text-yellow-300' :
                'bg-green-500/30 text-green-300'
              )}>
                {selectedCard.severity.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-3 pb-2">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            <p className="text-[9px] text-white/50 text-center">Select a card to enable actions</p>
          </div>
        </div>
      )}

      {/* Action Buttons Grid */}
      <div className="px-3 pb-3 grid grid-cols-2 gap-1.5">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              disabled={!selectedCard}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] font-medium transition-all",
                selectedCard 
                  ? `${action.color} ${action.textColor} shadow-sm`
                  : "bg-white/10 text-white/40 cursor-not-allowed"
              )}
            >
              <Icon className="w-3 h-3" />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const RoleSwitchSidebar = ({
  activeRole,
  onRoleChange,
  collapsed,
  onToggleCollapse,
  onLogout,
  activeNav: externalActiveNav,
  onNavChange,
  onSubItemClick,
}: RoleSwitchSidebarProps) => {
  const currentConfig = roleConfigs[activeRole] ?? roleConfigs.boss_owner;
  // STEP 7: Use new 3-level navigation structure
  const currentNavStructure = roleNavStructure[activeRole] ?? [];
  const [internalActiveNav, setInternalActiveNav] = useState("overview");
  
  // STEP 2 FIX: Auto drill-down when a role is active (Boss should start drilled in)
  const [isDrilledDown, setIsDrilledDown] = useState(true);
  
  // STEP 7: Track expanded modules (Level 1) and categories (Level 2)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['operations']));
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['dashboard']));
  // Track the active subcategory (Level 3) - the one that loads content
  const [activeSubCategory, setActiveSubCategory] = useState<string>("overview");
  
  // Use external activeNav if provided, otherwise use internal state
  const activeNav = externalActiveNav ?? internalActiveNav;
  
  // STEP 7: When role changes, reset all expansion states
  useEffect(() => {
    setIsDrilledDown(true);
    // Reset to first module/category expanded
    const firstModule = currentNavStructure[0];
    if (firstModule) {
      setExpandedModules(new Set([firstModule.id]));
      const firstCategory = firstModule.categories[0];
      if (firstCategory) {
        setExpandedCategories(new Set([firstCategory.id]));
        const firstSubCategory = firstCategory.subCategories?.[0];
        if (firstSubCategory) {
          setActiveSubCategory(firstSubCategory.id);
        }
      }
    }
  }, [activeRole]);

  // STEP 7: Toggle module expansion (Level 1) - only expands, no content load
  const toggleModuleExpansion = useCallback((moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set<string>();
      if (!prev.has(moduleId)) {
        newSet.add(moduleId);
      }
      return newSet;
    });
    // Reset category expansion when switching modules
    setExpandedCategories(new Set());
  }, []);

  // STEP 7: Toggle category expansion (Level 2) - only expands, no content load
  const toggleCategoryExpansion = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set<string>();
      if (!prev.has(categoryId)) {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  // STEP 10: Handle subcategory click (Level 3) - THIS LOADS THE SCREEN with proper action mapping
  const handleSubCategoryClick = useCallback((subCategoryId: string, subCategoryLabel: string, status?: string) => {
    // STEP 10: Check if feature is locked/coming-soon
    if (status === 'locked' || status === 'coming-soon') {
      toast.info('Coming Soon', { 
        description: `${subCategoryLabel} will be available soon`,
        duration: 2000
      });
      return;
    }
    
    setActiveSubCategory(subCategoryId);
    
    if (onNavChange) {
      onNavChange(subCategoryId);
    } else {
      setInternalActiveNav(subCategoryId);
    }
    
    // Also call the sub-item click handler
    onSubItemClick?.(subCategoryId);
    
    // STEP 10: Show loading feedback with action type
    toast.success(`Loading: ${subCategoryLabel}`, { 
      description: 'Screen loading...',
      duration: 1500 
    });
  }, [onNavChange, onSubItemClick]);

  const handleRoleSelect = useCallback((roleId: ActiveRole) => {
    onRoleChange(roleId);
    setIsDrilledDown(true);
    
    // Reset to first module/category
    const firstModule = roleNavStructure[roleId]?.[0];
    if (firstModule) {
      setExpandedModules(new Set([firstModule.id]));
      const firstCategory = firstModule.categories[0];
      if (firstCategory) {
        setExpandedCategories(new Set([firstCategory.id]));
        const firstSubCategory = firstCategory.subCategories?.[0];
        if (firstSubCategory) {
          setActiveSubCategory(firstSubCategory.id);
          if (onNavChange) {
            onNavChange(firstSubCategory.id);
          } else {
            setInternalActiveNav(firstSubCategory.id);
          }
        }
      }
    }
  }, [onRoleChange, onNavChange]);

  const handleBackToRoles = useCallback(() => {
    setIsDrilledDown(false);
  }, []);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 60 : 240 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "flex flex-col border-r transition-colors duration-200",
        "border-blue-400/30"
      )}
      style={{ background: 'linear-gradient(180deg, hsl(217 91% 50%) 0%, hsl(226 71% 45%) 100%)' }}
    >
      {/* Header - Compact Control Panel */}
      <div className="p-3 border-b border-white/15 bg-white/5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white shadow-md flex-shrink-0">
            <currentConfig.icon className="w-4 h-4 text-blue-600" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <h2 className="text-sm font-bold text-white tracking-tight truncate">Control Panel</h2>
                <p className="text-[10px] text-white/70 font-medium">Super Admin</p>
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
              <div className="p-2">
                <AnimatePresence>
                  {!collapsed && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[10px] font-semibold text-white/70 uppercase tracking-wider mb-2 px-2"
                    >
                      Switch Role
                    </motion.p>
                  )}
                </AnimatePresence>
                
                <div className="space-y-0.5">
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
                              "w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-150 relative",
                              // STEP 5: Active state with background highlight + left indicator
                              isActive
                                ? "bg-white/15 text-white font-semibold"
                                : "text-white/90 hover:bg-white/15 hover:text-white"
                            )}
                          >
                            {/* STEP 5: Left indicator bar for active state */}
                            {isActive && (
                              <motion.div 
                                layoutId="role-active-indicator"
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full"
                              />
                            )}
                            <div className={cn(
                              "w-6 h-6 rounded-md flex items-center justify-center transition-all flex-shrink-0",
                              isActive 
                                ? "bg-white"
                                : "bg-white/20"
                            )}>
                              <Icon className={cn("w-3 h-3", isActive ? "text-primary" : "text-white")} />
                            </div>
                            <AnimatePresence>
                              {!collapsed && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="flex-1 text-left min-w-0"
                                >
                                  <span className={cn("text-xs block text-white truncate", isActive ? "font-semibold" : "font-medium")}>{role.label}</span>
                                </motion.div>
                              )}
                            </AnimatePresence>
                            {!collapsed && (
                              <ChevronRight className="w-3 h-3 text-white/70 flex-shrink-0" />
                            )}
                          </button>
                        </TooltipTrigger>
                        {collapsed && (
                          <TooltipContent side="right" sideOffset={8}>
                            <div>
                              <p className="font-medium text-sm">{role.label}</p>
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
            <div className="p-3 border-b border-white/20">
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToRoles}
                    className={cn(
                      "w-full gap-2 mb-3 text-white hover:bg-white/20 hover:text-white",
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
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/20 border border-white/30">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white">
                  <currentConfig.icon className="w-5 h-5 text-primary" />
                </div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1"
                    >
                      <span className="text-sm font-bold block text-white">
                        {currentConfig.label}
                      </span>
                      <Badge variant="outline" className="text-xs mt-1 text-white border-white/50">
                        Active
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* STEP 7: 3-Level Navigation Structure */}
            <ScrollArea className="flex-1 py-2">
              <AnimatePresence>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3 px-5"
                  >
                    {currentConfig.shortLabel} Features
                  </motion.p>
                )}
              </AnimatePresence>
              
              <nav className="space-y-1 px-2">
                {/* LEVEL 1: Modules */}
                {currentNavStructure.map((module, moduleIdx) => {
                  const ModuleIcon = module.icon;
                  const isModuleExpanded = expandedModules.has(module.id);
                  const hasCategories = module.categories && module.categories.length > 0;
                  
                  // Check if any subcategory under this module is active
                  const isModuleActive = module.categories.some(cat => 
                    cat.subCategories?.some(sub => sub.id === activeSubCategory)
                  );

                  return (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: moduleIdx * 0.03 }}
                    >
                      {/* Level 1: Module Button - ONLY EXPANDS, NO CONTENT LOAD */}
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleModuleExpansion(module.id);
                            }}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative",
                              isModuleExpanded || isModuleActive
                                ? "text-white font-semibold bg-white/20"
                                : "text-white/90 hover:text-white hover:bg-white/10",
                              collapsed ? "justify-center" : ""
                            )}
                          >
                            {/* Left indicator for active module */}
                            {isModuleActive && (
                              <motion.div 
                                layoutId="module-active-indicator"
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-400 rounded-r-full"
                              />
                            )}
                            <ModuleIcon className={cn("w-5 h-5 flex-shrink-0", isModuleActive ? "text-amber-300" : "text-white/80")} />
                            <AnimatePresence>
                              {!collapsed && (
                                <motion.span
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className={cn("text-sm truncate flex-1 text-left", isModuleActive ? "font-semibold" : "font-medium")}
                                >
                                  {module.label}
                                </motion.span>
                              )}
                            </AnimatePresence>
                            {/* Chevron for modules */}
                            {hasCategories && !collapsed && (
                              <motion.div
                                animate={{ rotate: isModuleExpanded ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronRight className="w-4 h-4 text-white/70" />
                              </motion.div>
                            )}
                          </button>
                        </TooltipTrigger>
                        {collapsed && (
                          <TooltipContent side="right" sideOffset={10}>
                            {module.label}
                          </TooltipContent>
                        )}
                      </Tooltip>
                      
                      {/* LEVEL 2: Categories - Show when module is expanded */}
                      <AnimatePresence>
                        {isModuleExpanded && hasCategories && !collapsed && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-1 ml-4 border-l border-white/20 space-y-0.5"
                          >
                            {module.categories.map((category, catIdx) => {
                              const CategoryIcon = category.icon;
                              const isCategoryExpanded = expandedCategories.has(category.id);
                              const hasSubCategories = category.subCategories && category.subCategories.length > 0;
                              
                              // Check if any subcategory under this category is active
                              const isCategoryActive = category.subCategories?.some(sub => sub.id === activeSubCategory);

                              return (
                                <motion.div
                                  key={category.id}
                                  initial={{ opacity: 0, x: -5 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: catIdx * 0.02 }}
                                >
                                  {/* Level 2: Category Button - ONLY EXPANDS, NO CONTENT LOAD */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      toggleCategoryExpansion(category.id);
                                    }}
                                    className={cn(
                                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all relative ml-1",
                                      isCategoryExpanded || isCategoryActive
                                        ? "text-white font-medium bg-white/15"
                                        : "text-white/80 hover:text-white hover:bg-white/10"
                                    )}
                                  >
                                    {/* Left indicator for active category */}
                                    {isCategoryActive && (
                                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-emerald-400 rounded-r-full" />
                                    )}
                                    <CategoryIcon className={cn("w-4 h-4 flex-shrink-0", isCategoryActive ? "text-emerald-300" : "text-white/70")} />
                                    <span className={cn("text-xs truncate flex-1 text-left", isCategoryActive ? "font-semibold" : "font-medium")}>
                                      {category.label}
                                    </span>
                                    {/* Chevron for categories with subcategories */}
                                    {hasSubCategories && (
                                      <motion.div
                                        animate={{ rotate: isCategoryExpanded ? 90 : 0 }}
                                        transition={{ duration: 0.15 }}
                                      >
                                        <ChevronRight className="w-3 h-3 text-white/60" />
                                      </motion.div>
                                    )}
                                  </button>
                                  
                                  {/* LEVEL 3: SubCategories - THESE LOAD SCREENS */}
                                  <AnimatePresence>
                                    {isCategoryExpanded && hasSubCategories && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="mt-0.5 ml-4 border-l border-white/15 space-y-0.5"
                                      >
                                        {category.subCategories!.map((subCategory, subIdx) => {
                                          const isSubCategoryActive = activeSubCategory === subCategory.id;
                                          const isLocked = subCategory.status === 'locked';

                                          return (
                                            <motion.button
                                              key={subCategory.id}
                                              initial={{ opacity: 0, x: -5 }}
                                              animate={{ opacity: 1, x: 0 }}
                                              transition={{ delay: subIdx * 0.015 }}
                                              onClick={(e) => {
                                                e.preventDefault();
                                                if (!isLocked) {
                                                  handleSubCategoryClick(subCategory.id, subCategory.label);
                                                } else {
                                                  toast.error('This feature is locked');
                                                }
                                              }}
                                              disabled={isLocked}
                                              className={cn(
                                                "w-full flex items-center gap-2 px-3 py-1.5 rounded-md transition-all relative ml-1 group",
                                                isSubCategoryActive
                                                  ? "bg-white/25 text-white font-semibold"
                                                  : isLocked
                                                    ? "text-white/40 cursor-not-allowed"
                                                    : "text-white/70 hover:text-white hover:bg-white/10"
                                              )}
                                            >
                                              {/* Active indicator */}
                                              {isSubCategoryActive && (
                                                <motion.div 
                                                  layoutId="subcategory-active"
                                                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3 bg-white rounded-r-full"
                                                />
                                              )}
                                              {/* Status dot */}
                                              <div className="relative flex-shrink-0">
                                                <div
                                                  className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    isSubCategoryActive ? "bg-white" : 
                                                    isLocked ? "bg-white/30" : "bg-emerald-400"
                                                  )}
                                                />
                                                {!isLocked && !isSubCategoryActive && (
                                                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-30" />
                                                )}
                                              </div>
                                              <span className={cn("text-[11px] truncate flex-1 text-left", isSubCategoryActive ? "font-semibold" : "")}>
                                                {subCategory.label}
                                              </span>
                                              {/* Arrow on hover */}
                                              <ChevronRight className={cn(
                                                "w-3 h-3 transition-opacity flex-shrink-0",
                                                isSubCategoryActive ? "opacity-100 text-white" : "opacity-0 group-hover:opacity-100 text-white/50"
                                              )} />
                                            </motion.button>
                                          );
                                        })}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </nav>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ENTERPRISE: Global Actions Panel - Context Aware */}
      <GlobalActionsPanel collapsed={collapsed} />

      {/* Footer */}
      <div className="p-3 border-t border-white/20 space-y-2">
        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className={cn("w-full text-white hover:bg-white/20 hover:text-white", collapsed ? "justify-center" : "justify-start")}
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
                "w-full text-white/80 hover:text-white hover:bg-red-500/30",
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
